const cleanText = (text) => {
  return text
    .replace(/\n+/g, " ")          // remove line breaks
    .replace(/||||||||易||/g, "") // remove weird symbols
    .replace(/\s+/g, " ")          // fix spacing
    .trim();
};

const simpleAnswer = (context, query) => {
  if (!context) return "No context available";

  const cleaned = cleanText(context);

  const sentences = cleaned.split(". ");

  const keywords = query.toLowerCase().split(" ");

  const scored = sentences.map(sentence => {
    let score = 0;

    keywords.forEach(word => {
      if (sentence.toLowerCase().includes(word)) {
        score++;
      }
    });

    return { sentence, score };
  });

  const top = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(s => s.sentence);

  if (top.length === 0) {
    return cleaned.substring(0, 400);
  }

  return top.join(". ") + ".";
};

module.exports = { simpleAnswer };