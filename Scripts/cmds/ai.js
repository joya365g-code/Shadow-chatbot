const OpenAI = require("openai");

module.exports = {
  name: "ai",
  run: async ({ args }) => {
    const prompt = args.join(" ");
    if (!prompt) return "❗ Please provide text after /ai";

    if (!process.env.OPENAI_API_KEY) return "❗ Missing OpenAI API key";

    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const completion = await client.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      });
      return completion.choices?.[0]?.message?.content || "🤖 No reply.";
    } catch (err) {
      console.error("AI error:", err);
      return "⚠️ AI request failed.";
    }
  }
};
