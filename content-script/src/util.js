// util.js

// Function to tokenize a sentence into words
const tokenize = (sentence) => {
  return sentence.toLowerCase().match(/\b\w+\b/g);
};

// Function to compute the similarity between two sentences
const sentenceSimilarity = (sent1, sent2) => {
  const words1 = tokenize(sent1);
  const words2 = tokenize(sent2);
  const commonWords = new Set([...words1].filter(word => words2.includes(word)));
  return commonWords.size / (Math.log(words1.length) + Math.log(words2.length));
};

// Function to build the similarity graph
const buildGraph = (sentences) => {
  const graph = Array(sentences.length).fill(null).map(() => Array(sentences.length).fill(0));
  for (let i = 0; i < sentences.length; i++) {
    for (let j = i + 1; j < sentences.length; j++) {
      const sim = sentenceSimilarity(sentences[i], sentences[j]);
      graph[i][j] = sim;
      graph[j][i] = sim;
    }
  }
  return graph;
};

// Function to compute TextRank scores
const computeTextRank = (graph, dampingFactor = 0.85, maxIterations = 200, tolerance = 1e-6) => {
  const scores = Array(graph.length).fill(1 / graph.length);
  for (let iter = 0; iter < maxIterations; iter++) {
    const newScores = Array(graph.length).fill((1 - dampingFactor) / graph.length);
    for (let i = 0; i < graph.length; i++) {
      for (let j = 0; j < graph.length; j++) {
        if (graph[i][j] > 0) {
          newScores[j] += dampingFactor * (graph[i][j] * scores[i]) / graph[i].reduce((sum, val) => sum + val, 0);
        }
      }
    }
    const maxDiff = Math.max(...newScores.map((score, i) => Math.abs(score - scores[i])));
    if (maxDiff < tolerance) break;
    scores.splice(0, scores.length, ...newScores);
  }
  return scores;
};

// Function to extract key sentences
export const extractKeySentences = (text, numSentences = 5) => {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const graph = buildGraph(sentences);
  const scores = computeTextRank(graph);
  const rankedSentences = sentences.map((sentence, index) => ({ sentence, score: scores[index] }))
                                    .sort((a, b) => b.score - a.score)
                                    .slice(0, numSentences)
                                    .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence));
  return rankedSentences.map(item => item.sentence);
};
