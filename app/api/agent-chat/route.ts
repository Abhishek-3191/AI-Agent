// import { NextRequest, NextResponse } from "next/server";
// import { Agent, tool, run } from "@openai/agents";
// import z from 'zod';
// import { openai } from "@/config/OpenAiModel";

// export async function POST(req:NextRequest) {
//     const {input,tools,agents,conversationId,agentName}=await req.json();

//     const generatedTools = tools.map((t: any) => {
//     // Dynamically build zod object for parameters
//     const paramSchema = z.object(
//         Object.fromEntries(
//             Object.entries(t.parameters).map(([key, type]) => {
//                 if (type == "string") return [key, z.string()];
//                 if (type == "number") return [key, z.number()];
//                 return [key, z.any()];
//             })
//         )
//     );

//     return tool({
//         name: t.name,
//         description: t.description,
//         parameters: paramSchema,

//         async execute(params: Record<string, any>) {
//             // Replace placeholders in URL
//             let url = t.url;
//             for (const key in params) {
//                 url = url.replace(`{{${key}}}`, encodeURIComponent(params[key]));
//             }

//             if (t.includeApiKey && t.apiKey) {
//                 url += url.includes("?")
//                     ? `&key=${t.apiKey}`
//                     : `?key=${t.apiKey}`;
//             }

//             // Make API request
//             const response = await fetch(url);
//             const data = await response.json();

//             // Return raw data (or transform if needed)
//             return data;
//         }
//     });
// });
// const createdAgents=agents.map((config:any)=>{
// return new Agent({
// name:config?.name,
// instructions:config?.instructions,
// tools:generatedTools
// })
// })

// const finalAgent=Agent.create({
//     name:agentName,
//     instructions:'You determine which agent to use based on the user query.',
//     handoffs:createdAgents
// })
// const result=await run(finalAgent,input,{
//     conversationId:conversationId,
//     stream:true
// });
// const stream=result.toTextStream({
//     compatibleWithNodeStreams:true,

// })
// // @ts-ignore
// return new Response(stream)

// }

// export async function GET(req:NextRequest) {
//     const {id:conversationId}=await openai.conversations.create({

//     })
//     return NextResponse.json(conversationId);
// }
// 

import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { geminiModel } from "@/config/GeminiModel";
// ----------------------------
// POST — MAIN AGENT ORCHESTRATION
// ----------------------------
export async function POST(req: NextRequest) {
  const { input, tools, agents, conversationId, agentName } = await req.json();

  // -------------------------
  // 1. Build Dynamic Tools
  // -------------------------
  const generatedTools = tools.map((t: any) => {
    const paramSchema = z.object(
      Object.fromEntries(
        Object.entries(t.parameters).map(([key, type]) => {
          if (type === "string") return [key, z.string()];
          if (type === "number") return [key, z.number()];
          return [key, z.any()];
        })
      )
    );

    return {
      name: t.name,
      description: t.description,
      parameters: paramSchema,
      includeApiKey: t.includeApiKey,
      apiKey: t.apiKey,
      url: t.url,

      async execute(params: any) {
        let url = t.url;

        // Replace placeholders
        for (const key in params) {
          url = url.replace(`{{${key}}}`, encodeURIComponent(params[key]));
        }

        if (t.includeApiKey && t.apiKey) {
          url += url.includes("?") ? `&key=${t.apiKey}` : `?key=${t.apiKey}`;
        }

        const res = await fetch(url);
        return res.json();
      },
    };
  });

  // -------------------------
  // 2. Build Agents
  // -------------------------
  const builtAgents = agents.map((config: any) => ({
    name: config.name,
    instructions: config.instructions,
    tools: generatedTools,
  }));

  // -------------------------
  // 3. Decide which agent should respond
  // -------------------------
  let agentSelectionPrompt = `
You are a controller AI. The user said:

"${input}"

Here are the available agents:

${builtAgents
  .map(
    (a:any) => `
Agent Name: ${a.name}
Instructions: ${a.instructions}
Tools: ${a.tools.map((t:any) => t.name).join(", ")}
`
  )
  .join("\n")}

Pick exactly ONE agent name that should handle this request.
Return ONLY the agent name as a plain string with no quotes, no JSON, no extra text.
`;

  const aiSelect = await geminiModel.generateContent(agentSelectionPrompt);
  const selectedAgentName = aiSelect.response.text().trim();

  const selectedAgent = builtAgents.find((a:any) => a.name === selectedAgentName);
  if (!selectedAgent) {
    return NextResponse.json(
      { error: "Agent selection failed", selectedAgentName },
      { status: 500 }
    );
  }

  // -------------------------
  // 4. Tool Usage Decision
  // -------------------------
  const toolDecisionPrompt = `
The user said: "${input}"
Agent "${selectedAgent.name}" has tools: 
${selectedAgent.tools.map((t:any) => t.name).join(",")}.

If a tool should be used, respond exactly with:
USE_TOOL: toolName | { "params": { ... } }

If no tool is needed, respond with:
NO_TOOL
`;

  const aiToolDecision = await geminiModel.generateContent(toolDecisionPrompt);
  const toolDecisionText = aiToolDecision.response.text().trim();

  let finalResponse = "";

  // -------------------------
  // 5. Execute tool if required
  // -------------------------
  if (toolDecisionText.startsWith("USE_TOOL")) {
    const match = toolDecisionText.match(/USE_TOOL:\s*(.*?)\s*\|(.*)/);

    if (match) {
      const toolName = match[1].trim();
      const rawParams = match[2].trim();

      const toolParams = JSON.parse(rawParams).params;

      const toolObj = selectedAgent.tools.find((t:any) => t.name === toolName);

      if (!toolObj) {
        return NextResponse.json(
          { error: "Tool not found", toolName },
          { status: 500 }
        );
      }

      // Validate params
      toolObj.parameters.parse(toolParams);

      const toolResult = await toolObj.execute(toolParams);

      const finalPrompt = `
The tool "${toolName}" returned this data:

${JSON.stringify(toolResult)}

Generate a helpful final user-friendly answer.
`;

      const aiFinal = await geminiModel.generateContent(finalPrompt);
      finalResponse = aiFinal.response.text();
    }
  } else {
    // -------------------------
    // 6. No tool needed — ask Gemini for direct answer
    // -------------------------
    const directPrompt = `
Agent: ${selectedAgent.name}
Instructions: ${selectedAgent.instructions}
User Input: "${input}"

Answer based on the agent's expertise.
`;

    const directAnswer = await geminiModel.generateContent(directPrompt);
    finalResponse = directAnswer.response.text();
  }

  // -------------------------
  // 7. STREAM RESPONSE
  // -------------------------
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(finalResponse));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain" },
  });
}

// ----------------------------
// GET — Create Conversation (dummy)
// ----------------------------
export async function GET(req: NextRequest) {
  return NextResponse.json({ id: crypto.randomUUID() });
}

