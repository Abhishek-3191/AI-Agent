import { GoogleGenAI } from "@google/genai";

export const geminiAI = new GoogleGenAI({apiKey:process.env.GOOGLE_API_KEY});

