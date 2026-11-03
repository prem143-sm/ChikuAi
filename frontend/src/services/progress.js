const STORAGE_KEY = 'StudIQ-progress';

const DEFAULT_PROGRESS = {
  quizzesCompleted: 0,
  correctAnswers: 0,
  activitiesCompleted: 0,
  topicsExplored: [],
};

export function getProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(stored);
    return { ...DEFAULT_PROGRESS, ...parsed, topicsExplored: Array.isArray(parsed.topicsExplored) ? parsed.topicsExplored : [] };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(update) {
  const next = { ...getProgress(), ...update };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function recordActivity(topic) {
  const progress = getProgress();
  return saveProgress({
    activitiesCompleted: progress.activitiesCompleted + 1,
    topicsExplored: topic ? [...new Set([...progress.topicsExplored, topic])] : progress.topicsExplored,
  });
}

export function recordQuiz(score) {
  const progress = getProgress();
  return saveProgress({
    quizzesCompleted: progress.quizzesCompleted + 1,
    correctAnswers: progress.correctAnswers + score,
    activitiesCompleted: progress.activitiesCompleted + 1,
    topicsExplored: [...new Set([...progress.topicsExplored, 'General Knowledge'])],
  });
}

export function resetProgress() {
  localStorage.removeItem(STORAGE_KEY);
}
