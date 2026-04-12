exports.chunkText = (text) => {
  const chunkSize = 500; // characters
  const overlap = 100;

  let chunks = [];

  for (let i = 0; i < text.length; i += (chunkSize - overlap)) {
    const chunk = text.slice(i, i + chunkSize);
    chunks.push(chunk);
  }

  return chunks;
};