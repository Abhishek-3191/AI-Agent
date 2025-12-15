import { openai } from "@/config/OpenAiModel";
import { NextRequest, NextResponse } from "next/server";
import { geminiAI } from "@/config/GeminiModel";

const PROMPT = `from this flow, Generate a agent instruction prompt with all details along with
tools with all setting info in JSON format. Do not add any extra text just written JSON data. make sure 
to mentioned paramters depends on GET or POST request.
only:{ systemPrompt:'', primaryAgentName:'', "agents": [ { "id": "agent-id", "name": "", "model": "", 
"includeHistory": true|false,
    "output": "", "tools": ["toold-id"], "instruction": "" }, ],
    "tools": [ { "id": "id", "name": "", "description": "", "method": "GET"|’POST',
        "url": "", "includeApiKey": true, "apiKey": "", "parameters": { "key": "dataType" }, 
        "usage": [ ], "assignedAgent": "" } ]}`


export async function POST(req:NextRequest){
    const {jsonConfig}=await req.json();
    const response=await openai.responses.create({
    // const response = await geminiAI.models.generateContent({
    model:'gpt-4.1',
    // model: 'gpt-4o-mini',
    input:PROMPT+JSON.stringify(jsonConfig)
    // model: "gemini-2.0-flash",
    // contents: PROMPT+JSON.stringify(jsonConfig),
    })
    // const outputText=response.text || "";
    const outputText=response.output_text 
    console.log(outputText,"text");
    let parsedJson;
    try {
        parsedJson=JSON.parse(outputText.replace('```json','').replace('```',''));


    } catch (error) {
        return NextResponse.json({error:`Failed to parse JSON from AI response`,details:error},{status:500})
    }
    return NextResponse.json({parsedJson})
}

// import { NextRequest, NextResponse } from "next/server";
// import { geminiModel } from "@/config/GeminiModel"; 

// // ----- UPDATED, SCHEMA-AWARE PROMPT -----

// const PROMPT = `
// You are an AI workflow interpreter. You will receive a JSON configuration extracted from the "config", "nodes", and "edges" fields of an Agent stored in Convex.

// The Convex schema is:
// Agent: {
//   _id: string,
//   agentId: string,
//   name: string,
//   userId: string,
//   config?: object,
//   nodes?: array,
//   edges?: array,
//   published: boolean,
//   agentToolConfig?: any
// }

// The workflow you will interpret is always inside the "config" object and follows this structure:

// {
//   "startNode": "string",
//   "flow": [
//     {
//       "id": "string",
//       "type": "StartNode" | "AgentNode" | "ApiNode" | "IfElseNode" | "UserApprovalNode" | "EndNode",
//       "label": "string",
//       "settings": { ...any settings... },
//       "next": "node-id"
//               OR ["node-id", "node-id"]
//               OR { "if": "node-id-or-null", "else": "node-id-or-null" }
//               OR null
//     }
//   ]
// }

// IMPORTANT — OUTPUT RULES:
// - Output ONLY valid JSON.
// - No markdown, no backticks, no explanation text.
// - Do not create fields not present in the input workflow.
// - Process nodes in the exact sequence provided.
// - Never reorder them.
// - Respect branching exactly.
// - If next = null → workflow ends.

// YOUR OUTPUT MUST FOLLOW THIS EXACT SCHEMA:

// {
//   "workflowSummary": "Short 2–4 line summary of the entire workflow.",
//   "steps": [
//     {
//       "nodeId": "string",
//       "nodeType": "string",
//       "label": "string",
//       "action": "Describe what this node does based strictly on its type and settings.",
//       "routing": "Describe where the workflow goes next. If IfElseNode, explain both branches."
//     }
//   ]
// }

// Now interpret the following workflow:
// `;


// // ----------- API ROUTE (Gemini Instead of OpenAI) -------------

// export async function POST(req: NextRequest) {
//   try {
//     const { jsonConfig } = await req.json();

//     const payload = PROMPT + JSON.stringify(jsonConfig);

//     const result = await geminiModel.generateContent(payload);

//     const outputText = result.response.text();

//     // Cleanup: Gemini sometimes adds code fences or prefix text
//     const clean = outputText
//       .replace(/^```json/, "")
//       .replace(/^```/, "")
//       .replace(/```$/, "")
//       .trim();

//     let parsedJson;

//     try {
//       parsedJson = JSON.parse(clean);
//     } catch (err) {
//       return NextResponse.json(
//         {
//           error: "Failed to parse JSON from Gemini response",
//           raw: outputText,
//           details: err,
//         },
//         { status: 500 }
//       );
//     }

//     return NextResponse.json({ parsedJson });

//   } catch (e) {
//     return NextResponse.json(
//       { error: "Server error", details: e },
//       { status: 500 }
//     );
//   }
// }
