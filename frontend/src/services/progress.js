import { firebaseApp } from './firebase';

const STORAGE_KEY = 'StudIQ-progress';
const GRADE_KEY = 'StudIQ-grade';
const ACTIVITY_TYPES = ['maths', 'science', 'english', 'quiz', 'brain', 'story'];
const HISTORY_LIMIT = 100;

const DEFAULT_PROGRESS = {
  quizzesCompleted: 0,
  correctAnswers: 0,
  activitiesCompleted: 0,
  topicsExplored: [],
  activityCounts: {},
  grade: '5',
  completedQuizIds: [],
};

async function getFirestoreApi(user) {
  if (!firebaseApp || !user?.uid) {
    throw new Error('A signed-in guardian account is required for cloud progress.');
  }
  const firestore = await import('firebase/firestore');
  return { ...firestore, db: firestore.getFirestore(firebaseApp) };
}

function normalizeProgress(value = {}) {
  return {
    ...DEFAULT_PROGRESS,
    ...value,
    quizzesCompleted: Number.isFinite(value.quizzesCompleted) ? value.quizzesCompleted : 0,
    correctAnswers: Number.isFinite(value.correctAnswers) ? value.correctAnswers : 0,
    activitiesCompleted: Number.isFinite(value.activitiesCompleted) ? value.activitiesCompleted : 0,
    topicsExplored: Array.isArray(value.topicsExplored) ? value.topicsExplored : [],
    activityCounts: value.activityCounts && typeof value.activityCounts === 'object'
      ? value.activityCounts
      : {},
    completedQuizIds: Array.isArray(value.completedQuizIds) ? value.completedQuizIds : [],
    grade: ['5', '6', '7', '8', '9'].includes(String(value.grade)) ? String(value.grade) : '5',
  };
}

function readLocalProgress() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return normalizeProgress();
  try {
    return normalizeProgress(JSON.parse(stored));
  } catch (error) {
    throw new Error(`Saved progress is invalid: ${error.message}`);
  }
}

function writeLocalProgress(progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeProgress(progress)));
}

function progressDocument(firestore, user) {
  return firestore.doc(firestore.db, 'users', user.uid, 'progress', 'summary');
}

function historyDocument(firestore, user, activity) {
  return firestore.doc(firestore.db, 'users', user.uid, 'recent', activity);
}

function normalizeLabel(label) {
  return label.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
}

function readLocalRecentItems(activity) {
  const key = `${STORAGE_KEY}-recent-${activity}`;
  const stored = localStorage.getItem(key);
  if (!stored) return [];
  let items;
  try {
    items = JSON.parse(stored);
  } catch (error) {
    throw new Error(`Saved ${activity} activity history is invalid: ${error.message}`);
  }
  if (!Array.isArray(items) || items.some((label) => typeof label !== 'string')) {
    throw new Error(`Saved ${activity} activity history has an invalid format.`);
  }
  return items.slice(-HISTORY_LIMIT);
}

async function updateProgress(user, update) {
  if (!user) {
    const current = readLocalProgress();
    const next = normalizeProgress(typeof update === 'function' ? update(current) : { ...current, ...update });
    writeLocalProgress(next);
    return next;
  }

  const firestore = await getFirestoreApi(user);
  const ref = progressDocument(firestore, user);
  return firestore.runTransaction(firestore.db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    const current = normalizeProgress(snapshot.exists() ? snapshot.data() : undefined);
    const next = normalizeProgress(typeof update === 'function' ? update(current) : { ...current, ...update });
    transaction.set(ref, { ...next, updatedAt: new Date().toISOString() });
    return next;
  });
}

export async function getProgress(user) {
  if (!user) return readLocalProgress();
  const firestore = await getFirestoreApi(user);
  const snapshot = await firestore.getDoc(progressDocument(firestore, user));
  return normalizeProgress(snapshot.exists() ? snapshot.data() : undefined);
}

export async function setGrade(grade, user) {
  if (!['5', '6', '7', '8', '9'].includes(String(grade))) {
    throw new Error('Choose a school grade from 5 to 9.');
  }
  localStorage.setItem(GRADE_KEY, String(grade));
  return updateProgress(user, { grade: String(grade) });
}

export async function getGrade(user) {
  if (user) {
    const progress = await getProgress(user);
    return progress.grade;
  }
  const grade = localStorage.getItem(GRADE_KEY);
  return ['5', '6', '7', '8', '9'].includes(grade) ? grade : '5';
}

export async function recordActivity(topic, user, activity, grade, correct = false) {
  return updateProgress(user, (current) => ({
    ...current,
    activitiesCompleted: current.activitiesCompleted + 1,
    correctAnswers: current.correctAnswers + (correct ? 1 : 0),
    topicsExplored: topic ? [...new Set([...current.topicsExplored, topic])] : current.topicsExplored,
    activityCounts: {
      ...current.activityCounts,
      [activity]: (current.activityCounts[activity] || 0) + 1,
    },
    grade: grade || current.grade,
    lastActivityAt: new Date().toISOString(),
  }));
}

export async function recordQuiz(score, total, user, grade, completionId) {
  return updateProgress(user, (current) => {
    if (completionId && current.completedQuizIds.includes(completionId)) return current;
    return {
      ...current,
      quizzesCompleted: current.quizzesCompleted + 1,
      correctAnswers: current.correctAnswers + score,
      activitiesCompleted: current.activitiesCompleted + 1,
      topicsExplored: [...new Set([...current.topicsExplored, 'General Knowledge'])],
      activityCounts: {
        ...current.activityCounts,
        quiz: (current.activityCounts.quiz || 0) + 1,
      },
      lastQuiz: { score, total, grade: grade || current.grade, completedAt: new Date().toISOString() },
      grade: grade || current.grade,
      lastActivityAt: new Date().toISOString(),
      completedQuizIds: completionId
        ? [...current.completedQuizIds, completionId].slice(-100)
        : current.completedQuizIds,
    };
  });
}

export async function resetProgress(user) {
  if (user) {
    const firestore = await getFirestoreApi(user);
    await firestore.setDoc(progressDocument(firestore, user), normalizeProgress(), { merge: false });
  }
  localStorage.removeItem(STORAGE_KEY);
}

export async function getRecentItems(user, activity) {
  if (!ACTIVITY_TYPES.includes(activity)) throw new Error('Unsupported learning activity.');
  if (!user) return readLocalRecentItems(activity);
  const firestore = await getFirestoreApi(user);
  const snapshot = await firestore.getDoc(historyDocument(firestore, user, activity));
  const items = snapshot.exists() ? snapshot.data().items : [];
  return Array.isArray(items) ? items.filter((label) => typeof label === 'string').slice(-HISTORY_LIMIT) : [];
}

export async function recordGeneratedItems(user, activity, labels) {
  if (!ACTIVITY_TYPES.includes(activity) || !Array.isArray(labels)) {
    throw new Error('Generated learning history is invalid.');
  }
  const newLabels = [...new Set(labels.map(normalizeLabel))];
  if (!user) {
    const previous = await getRecentItems(user, activity);
    if (newLabels.some((label) => previous.includes(label))) {
      throw new Error('Generated content was already recorded. Please request a fresh item.');
    }
    const items = [...new Set([...previous, ...newLabels])].slice(-HISTORY_LIMIT);
    localStorage.setItem(`${STORAGE_KEY}-recent-${activity}`, JSON.stringify(items));
    return;
  }
  const firestore = await getFirestoreApi(user);
  const cloudRef = historyDocument(firestore, user, activity);
  await firestore.runTransaction(firestore.db, async (transaction) => {
    const snapshot = await transaction.get(cloudRef);
    const previous = snapshot.exists() && Array.isArray(snapshot.data().items) ? snapshot.data().items : [];
    const duplicate = newLabels.find((label) => previous.includes(label));
    if (duplicate) throw new Error('Generated content was already recorded. Please request a fresh item.');
    const items = [...new Set([...previous, ...newLabels])].slice(-HISTORY_LIMIT);
    transaction.set(cloudRef, { items, updatedAt: new Date().toISOString() });
  });
}

const activeSyncs = new Map();

export function syncGuestProgress(user) {
  if (!user) return;
  if (activeSyncs.has(user.uid)) return activeSyncs.get(user.uid);
  const sync = syncGuestData(user).finally(() => activeSyncs.delete(user.uid));
  activeSyncs.set(user.uid, sync);
  return sync;
}

async function syncGuestData(user) {
  const firestore = await getFirestoreApi(user);
  const guestProgress = readLocalProgress();
  const hasGuestProgress = guestProgress.activitiesCompleted > 0
    || guestProgress.quizzesCompleted > 0
    || guestProgress.topicsExplored.length > 0
    || guestProgress.grade !== '5';
  if (hasGuestProgress) {
    const ref = progressDocument(firestore, user);
    await firestore.runTransaction(firestore.db, async (transaction) => {
      const snapshot = await transaction.get(ref);
      const cloud = normalizeProgress(snapshot.exists() ? snapshot.data() : undefined);
      const activityCounts = { ...cloud.activityCounts };
      for (const [activity, count] of Object.entries(guestProgress.activityCounts)) {
        activityCounts[activity] = (activityCounts[activity] || 0) + count;
      }
      const mergedProgress = {
        ...cloud,
        activitiesCompleted: cloud.activitiesCompleted + guestProgress.activitiesCompleted,
        quizzesCompleted: cloud.quizzesCompleted + guestProgress.quizzesCompleted,
        correctAnswers: cloud.correctAnswers + guestProgress.correctAnswers,
        topicsExplored: [...new Set([...cloud.topicsExplored, ...guestProgress.topicsExplored])],
        activityCounts,
        completedQuizIds: [...new Set([...cloud.completedQuizIds, ...guestProgress.completedQuizIds])].slice(-100),
        grade: guestProgress.grade,
        updatedAt: new Date().toISOString(),
      };
      const lastQuiz = guestProgress.lastQuiz || cloud.lastQuiz;
      const lastActivityAt = guestProgress.lastActivityAt || cloud.lastActivityAt;
      if (lastQuiz) mergedProgress.lastQuiz = lastQuiz;
      if (lastActivityAt) mergedProgress.lastActivityAt = lastActivityAt;
      transaction.set(ref, mergedProgress);
    });
    localStorage.removeItem(STORAGE_KEY);
  }

  for (const activity of ACTIVITY_TYPES) {
    const key = `${STORAGE_KEY}-recent-${activity}`;
    const guestItems = readLocalRecentItems(activity);
    if (guestItems.length) {
      const ref = historyDocument(firestore, user, activity);
      await firestore.runTransaction(firestore.db, async (transaction) => {
        const snapshot = await transaction.get(ref);
        const cloudItems = snapshot.exists() && Array.isArray(snapshot.data().items) ? snapshot.data().items : [];
        const items = [...new Set([...cloudItems, ...guestItems.map(normalizeLabel)])].slice(-HISTORY_LIMIT);
        transaction.set(ref, { items, updatedAt: new Date().toISOString() });
      });
      localStorage.removeItem(key);
    }
  }
}
