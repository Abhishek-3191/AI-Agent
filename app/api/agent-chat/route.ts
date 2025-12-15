import { NextRequest, NextResponse } from "next/server";
import { Agent, tool, run } from "@openai/agents";
import z from 'zod';
import { openai } from "@/config/OpenAiModel";

export async function POST(req:NextRequest) {
    const body = await req.json();
    console.log("🔥 FRONTEND SENT:", JSON.stringify(body, null, 2));

    // const { input, tools, agents, conversationId, agentName } = body;
    const {input,tools,agents,conversationId,agentName}=await req.json();

    const generatedTools = tools.map((t: any) => {
    // Dynamically build zod object for parameters
    const paramSchema = z.object(
        Object.fromEntries(
            Object.entries(t.parameters).map(([key, type]) => {
                if (type == "string") return [key, z.string()];
                if (type == "number") return [key, z.number()];
                return [key, z.any()];
            })
        )
    );

    return tool({
        name: t.name,
        description: t.description,
        parameters: paramSchema,

        async execute(params: Record<string, any>) {
            // Replace placeholders in URL
            let url = t.url;
            for (const key in params) {
                url = url.replace(`{{${key}}}`, encodeURIComponent(params[key]));
            }

            if (t.includeApiKey && t.apiKey) {
                url += url.includes("?")
                    ? `&key=${t.apiKey}`
                    : `?key=${t.apiKey}`;
            }

            // Make API request
            const response = await fetch(url);
            const data = await response.json();

            // Return raw data (or transform if needed)
            return data;
        }
    });
});
const createdAgents=agents.map((config:any)=>{
return new Agent({
name:config?.name,
instructions:config?.instructions,
tools:generatedTools
})
})

const finalAgent=Agent.create({
    name:agentName,
    instructions:'You determine which agent to use based on the user query.',
    handoffs:createdAgents
})
const result=await run(finalAgent,input,{
    conversationId:conversationId,
    stream:true
});
const stream=result.toTextStream({
    compatibleWithNodeStreams:true,

})
// @ts-ignore
return new Response(stream)

}

export async function GET(req:NextRequest) {
    const {id:conversationId}=await openai.conversations.create({
      
    })
    return NextResponse.json(conversationId);
}


// import { NextRequest, NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import z from "zod";

// if (!process.env.GOOGLE_API_KEY) {
//   throw new Error("GOOGLE_API_KEY missing");
// }

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// export async function POST(req: NextRequest) {
//   const { input, tools, agents, conversationId, agentName } = await req.json();

//   console.log("🔥 FRONTEND SENT:", { input, tools, agents, conversationId });

//   // 1) Convert tools → Gemini Functions
//   const geminiFunctions = tools.map((t: any) => {
//     const parameters: any = {};

//     for (const [key, type] of Object.entries(t.parameters)) {
//       parameters[key] = { type };
//     }

//     return {
//       name: t.name,
//       description: t.description,
//       parameters: {
//         type: "object",
//         properties: parameters,
//       },
//     };
//   });

//   // 2) Build a unified system prompt combining all sub-agents
//   const agentInstructionsText =
//     agents
//       .map(
//         (a: any, idx: number) =>
//           `Sub-Agent #${idx + 1}\n` +
//           `Name: ${a.name}\n` +
//           `Instructions: ${a.instructions}\n`
//       )
//       .join("\n\n");

//   const systemPrompt = `
// You are the main agent: ${agentName}.
// You route queries to the best sub-agent based on their instructions.

// Here are your sub-agents:
// ${agentInstructionsText}

// Rules:
// - Think which agent can answer the query best.
// - If a tool is needed, call the appropriate function using correct parameters.
// - Reply clearly if no tool is required.
//   `.trim();

//   // 3) Create chat session with Gemini
//   const model = genAI.getGenerativeModel({
//     model: "gemini-1.5-flash",
//     tools: geminiFunctions,
//   });

//   const chat = model.startChat({
//     history: conversationId?.history || [],
//     systemInstruction: systemPrompt,
//   });

//   // 4) Send user input and stream response
//   const result = await chat.sendMessageStream(input);

//   const stream = new ReadableStream({
//     async pull(controller) {
//       for await (const chunk of result.stream) {
//         controller.enqueue(chunk.text());
//       }
//       controller.close();
//     },
//   });

//   return new Response(stream, {
//     headers: {
//       "Content-Type": "text/plain; charset=utf-8",
//     },
//   });
// }

// export async function GET() {
//   const conversationId = {
//     id: crypto.randomUUID(),
//     history: [],
//   };

//   return NextResponse.json(conversationId);
// }



// import { NextRequest, NextResponse } from "next/server";
// import { geminiAI } from "@/config/GeminiModel";

// export async function POST(req: NextRequest) {

//   const { message } = await req.json(); // frontend sends { message: "hi" }
// console.log("Frontend",message);
//   const model = await geminiAI.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents:'Hi'
//   });

//   // Generate response
//   // const result = await model.generateContent(message);//

//   return NextResponse.json({
//     // @ts-ignore
//     reply:response.text(),
//   });
// }

// export async function GET(req: NextRequest) {
//   return NextResponse.json({ message: "new conversation created" });
// }

