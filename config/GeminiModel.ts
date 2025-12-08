import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error("Missing GOOGLE_API_KEY in environment");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export const geminiModel = genAI.getGenerativeModel({
  // stable model identifier compatible with the v1 SDK
  model: "gemini-1.5-flash-8b",

});
