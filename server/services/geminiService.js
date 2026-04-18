const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateAnswer = async (context, query) => {
  try {
    const safeContext = context.substring(0, 3000);

    const prompt = `
Answer the question using ONLY the context below.
If not found, say "Not found in document".

Context:
${safeContext}

Question:
${query}

Answer:
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // ✅ modern working model
      contents: prompt,
    });

    return response.text;

  } catch (error) {
    console.error("Gemini FULL ERROR:", error);
    return error.message || "Gemini failed";
  }
};

module.exports = { generateAnswer };