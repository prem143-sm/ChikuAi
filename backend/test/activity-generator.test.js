const test = require('node:test');
const assert = require('node:assert/strict');
const {
  buildActivityPrompt,
  generateActivity,
  validateActivity,
} = require('../src/ai/activity-generator');

test('activity prompt includes the requested grade, language, and recent exclusions', () => {
  const prompt = buildActivityPrompt({
    activity: 'science',
    grade: '8',
    language: 'hinglish',
    excludedLabels: ['Volcanoes under the sea'],
  });

  assert.match(prompt, /Student grade: 8/);
  assert.match(prompt, /simple Hinglish/);
  assert.match(prompt, /Volcanoes under the sea/);
});

test('maths activity validation accepts a numeric answer and rejects non-numeric answers', () => {
  const question = {
    topic: 'Fractions',
    question: 'What is 1/2 of 18?',
    answer: '9',
    explanation: 'Half of 18 is 9.',
  };
  assert.equal(validateActivity('maths', question).answer, '9');
  assert.throws(() => validateActivity('maths', { ...question, answer: 'nine' }), /must be a number/);
});

test('quiz validation requires five questions with four unique options and a correct answer', () => {
  const questions = Array.from({ length: 5 }, (_, index) => ({
    topic: 'Science',
    question: `Question ${index + 1}?`,
    options: ['A', 'B', 'C', 'D'],
    correctAnswer: 'A',
    explanation: 'A is correct.',
  }));
  assert.equal(validateActivity('quiz', { questions }).questions.length, 5);
  assert.throws(
    () => validateActivity('quiz', { questions: questions.slice(0, 4) }),
    /exactly five/
  );
  assert.throws(
    () => validateActivity('quiz', {
      questions: questions.map((question, index) => index === 0
        ? { ...question, correctAnswer: 'Missing' }
        : question),
    }),
    /include the correct answer/
  );
});

test('generated content is rejected when it includes unsafe personal-data prompts', () => {
  assert.throws(() => validateActivity('brain', {
    question: 'What is your account password?',
    hint: 'Think carefully.',
    answer: 'Do not share it.',
  }), /safety checks/);
});

test('Gemini activity generation requests JSON and returns validated fresh content', async () => {
  const originalFetch = global.fetch;
  const generated = {
    topic: 'Space',
    title: 'Why Saturn Has Rings',
    text: 'Saturn is surrounded by bright rings made mostly of ice and rock.',
    question: 'What are Saturn’s rings mostly made of?',
  };
  let requestBody;
  global.fetch = async (_url, options) => {
    requestBody = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => ({
        candidates: [{ content: { parts: [{ text: JSON.stringify(generated) }] } }],
      }),
    };
  };

  try {
    const result = await generateActivity({
      apiKey: 'test-key',
      apiUrl: 'https://example.test/v1beta',
      model: 'test-model',
      activity: 'science',
      grade: '7',
      language: 'english',
      excludedLabels: [],
    });
    assert.equal(result.success, true);
    assert.equal(result.data.title, generated.title);
    assert.equal(requestBody.generationConfig.responseMimeType, 'application/json');
    assert.match(requestBody.contents[0].parts[0].text, /Student grade: 7/);
  } finally {
    global.fetch = originalFetch;
  }
});

test('Gemini activity generation rejects a recently used label', async () => {
  const originalFetch = global.fetch;
  global.fetch = async () => ({
    ok: true,
    json: async () => ({
      candidates: [{
        content: {
          parts: [{
            text: JSON.stringify({
              topic: 'Space',
              title: 'The Moon',
              text: 'The Moon orbits Earth.',
              question: 'What orbits Earth?',
            }),
          }],
        },
      }],
    }),
  });

  try {
    const result = await generateActivity({
      apiKey: 'test-key',
      apiUrl: 'https://example.test/v1beta',
      model: 'test-model',
      activity: 'science',
      grade: '5',
      language: 'english',
      excludedLabels: ['the moon'],
    });
    assert.equal(result.success, false);
    assert.equal(result.status, 409);
  } finally {
    global.fetch = originalFetch;
  }
});
