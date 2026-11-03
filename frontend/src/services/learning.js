import { api } from './api';
import { getRecentItems, recordGeneratedItems } from './progress';

const LABEL_GETTERS = {
  maths: (activity) => [activity.question],
  science: (activity) => [activity.title],
  english: (activity) => [activity.word],
  quiz: (activity) => activity.questions.map((question) => question.question),
  brain: (activity) => [activity.question],
  story: (activity) => [activity.title],
};
const activeGenerations = new Map();

function normalizeLabel(label) {
  return label.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
}

export function generateLearningActivity(options) {
  const key = [
    options.activity,
    options.grade,
    options.language,
    options.user?.uid || 'guest',
    options.difficulty || '',
  ].join(':');
  if (activeGenerations.has(key)) return activeGenerations.get(key);
  const generation = generateUniqueActivity(options).finally(() => activeGenerations.delete(key));
  activeGenerations.set(key, generation);
  return generation;
}

async function generateUniqueActivity({
  activity,
  grade,
  language,
  user,
  difficulty,
}) {
  const excludedLabels = await getRecentItems(user, activity);
  const excludedSet = new Set(excludedLabels.map(normalizeLabel));

  for (let attempt = 0; attempt < 3; attempt += 1) {
    let response;
    try {
      response = await api.generateActivity(
        activity,
        grade,
        language,
        [...excludedSet].slice(-100),
        difficulty
      );
    } catch (error) {
      if (error.status === 409 && attempt < 2) continue;
      throw error;
    }
    const content = response.activity;
    const labels = LABEL_GETTERS[activity]?.(content);
    if (!labels?.length || labels.some((label) => typeof label !== 'string')) {
      throw new Error('Gemini returned an incomplete activity. Please try again.');
    }

    const normalized = labels.map(normalizeLabel);
    const unique = new Set(normalized);
    if (unique.size !== normalized.length || normalized.some((label) => excludedSet.has(label))) {
      normalized.forEach((label) => excludedSet.add(label));
      continue;
    }

    await recordGeneratedItems(user, activity, normalized);
    return content;
  }
  throw new Error('Gemini repeated recent content several times. Please try again in a moment.');
}
