import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/next";
export const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Your ARCJET site key
  rules: [
    // Protects from SQL injection, RCE, XSS, etc.
    shield({ mode: "LIVE" }),

    // Bot detection
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"], // Allow Google, Bing, etc.
    }),

    // Rate limiting
    tokenBucket({
      mode: "LIVE",
      characteristics: ["userId"], // what identifies a user
      refillRate: 5000,
      interval: 30*24*60*60*1000,
      capacity: 5000,
    }),
  ],
});