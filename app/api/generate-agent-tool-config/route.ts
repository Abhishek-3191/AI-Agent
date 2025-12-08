// import { openai } from "@/config/OpenAiModel";
// import { NextRequest, NextResponse } from "next/server";
// import { geminiModel } from "@/config/GeminiModel";

// // const PROMPT = `
// // You are an AI workflow interpreter. You will receive a JSON configuration describing an agent workflow. 
// // Your task is to generate a *clean JSON output only* with no explanations, no markdown, and no extra text.

// // ### What you will receive:
// // A JSON object in the format:
// // {
// //   "startNode": "node-id",
// //   "flow": [
// //      {
// //         "id": "string",
// //         "type": "StartNode" | "AgentNode" | "ApiNode" | "IfElseNode" | "UserApprovalNode" | "EndNode",
// //         "label": "string",
// //         "settings": { ... },
// //         "next": "node-id" OR ["node-id"...] OR { "if": "...", "else": "..." } OR null
// //      }
// //   ]
// // }

// // ### Your Task:
// // 1. Interpret the workflow logically.
// // 2. Produce a JSON response with the following structure:

// // {
// //   "workflowDescription": "A human readable description (2–5 lines) of the full workflow.",
// //   "steps": [
// //      {
// //        "nodeId": "string",
// //        "type": "string",
// //        "action": "Explain what this node does based only on its settings and type.",
// //        "next": "Explain the next node(s) logically"
// //      }
// //   ]
// // }

// // ### RULES (IMPORTANT):
// // - DO NOT add backticks.
// // - DO NOT add explanations outside JSON.
// // - DO NOT invent nodes or settings not present in the input.
// // - Respect all branches exactly as defined (if/else routing).
// // - If the model reaches an EndNode, state that the workflow ends.
// // - For IfElseNode:
// //     - Use the labels/settings to describe the condition.
// //     - Describe both branches.
// // - For arrays of next steps, explain them as parallel or sequential triggers depending on node type.

// // Return ONLY the JSON object described above.
// // `;

// const PROMPT = `
// You are an AI workflow interpreter. You will receive a JSON configuration describing an agent workflow.
// You MUST return a JSON object that strictly follows the required schema shown below.

// -------------------------------------------------------------------------------
// ### INPUT FORMAT (example)
// {
//   "startNode": "string",
//   "flow": [
//     {
//       "id": "string",
//       "type": "StartNode" | "AgentNode" | "ApiNode" | "IfElseNode" | 
//               "UserApprovalNode" | "EndNode",
//       "label": "string",
//       "settings": { ...any settings... },
//       "next": "node-id" 
//               OR ["node-id", "node-id"] 
//               OR { "if": "node-id-or-null", "else": "node-id-or-null" } 
//               OR null
//     }
//   ]
// }
// -------------------------------------------------------------------------------

// ### YOUR TASK
// From the above input, produce a pure JSON output (NO explanation text, NO markdown).
// Your output MUST follow this EXACT SCHEMA:

// {
//   "workflowSummary": "A short 2–4 line description of what the workflow does overall.",
//   "steps": [
//     {
//       "nodeId": "string",
//       "nodeType": "string",
//       "label": "string",
//       "action": "Explain what this node does based strictly on its 'type' and 'settings'.",
//       "routing": "Explain logically where the workflow goes next based on 'next'. 
//                   For IfElseNode, describe both branches clearly."
//     }
//   ]
// }

// ### STRICT RULES
// 1. DO NOT include backticks.
// 2. DO NOT include markdown.
// 3. Output ONLY valid JSON (no text outside JSON).
// 4. DO NOT hallucinate or invent nodes, labels, or settings.
// 5. DO NOT infer functionality not present in the provided config.
// 6. If 'next' is null → say the workflow ends.
// 7. If Type = "IfElseNode":
//       - Describe the IF branch using: next.if
//       - Describe the ELSE branch using: next.else
// 8. If next is an array → describe nodes as parallel next steps.
// 9. If next is a single node → describe it as sequential.
// 10. Always process nodes in the same sequence as given in 'flow'.
// 11. NEVER reorder steps.
// 12. NEVER produce syntax errors, trailing commas, missing quotes, etc.

// -------------------------------------------------------------------------------
// ### FINAL OUTPUT FORMAT (MANDATORY)
// Return ONLY:

// {
//   "workflowSummary": "...",
//   "steps": [
//      {
//        "nodeId": "...",
//        "nodeType": "...",
//        "label": "...",
//        "action": "...",
//        "routing": "..."
//      }
//   ]
// }

// NO other text.
// -------------------------------------------------------------------------------

// Now interpret the following workflow:
// `;

// export async function POST(req:NextRequest){
//     const {jsonConfig}=await req.json();
//     const response=await openai.responses.create({
//     // model:'gpt-4.1',
//     model: 'gpt-4o-mini',
//     input:PROMPT+JSON.stringify(jsonConfig)
//     })
//     const outputText=response.output_text;
//     let parsedJson;
//     try {
//         parsedJson=JSON.parse(outputText.replace('```json','').replace('```',''));

//     } catch (error) {
//         return NextResponse.json({error:`Failed to parse JSON from AI response`,details:error},{status:500})
//     }
//     return NextResponse.json({parsedJson})
// }

import { NextRequest, NextResponse } from "next/server";
import { geminiModel } from "@/config/GeminiModel"; // <— YOUR GEMINI MODEL

// ----- UPDATED, SCHEMA-AWARE PROMPT -----

const PROMPT = `
You are an AI workflow interpreter. You will receive a JSON configuration extracted from the "config", "nodes", and "edges" fields of an Agent stored in Convex.

The Convex schema is:
Agent: {
  _id: string,
  agentId: string,
  name: string,
  userId: string,
  config?: object,
  nodes?: array,
  edges?: array,
  published: boolean,
  agentToolConfig?: any
}

The workflow you will interpret is always inside the "config" object and follows this structure:

{
  "startNode": "string",
  "flow": [
    {
      "id": "string",
      "type": "StartNode" | "AgentNode" | "ApiNode" | "IfElseNode" | "UserApprovalNode" | "EndNode",
      "label": "string",
      "settings": { ...any settings... },
      "next": "node-id"
              OR ["node-id", "node-id"]
              OR { "if": "node-id-or-null", "else": "node-id-or-null" }
              OR null
    }
  ]
}

IMPORTANT — OUTPUT RULES:
- Output ONLY valid JSON.
- No markdown, no backticks, no explanation text.
- Do not create fields not present in the input workflow.
- Process nodes in the exact sequence provided.
- Never reorder them.
- Respect branching exactly.
- If next = null → workflow ends.

YOUR OUTPUT MUST FOLLOW THIS EXACT SCHEMA:

{
  "workflowSummary": "Short 2–4 line summary of the entire workflow.",
  "steps": [
    {
      "nodeId": "string",
      "nodeType": "string",
      "label": "string",
      "action": "Describe what this node does based strictly on its type and settings.",
      "routing": "Describe where the workflow goes next. If IfElseNode, explain both branches."
    }
  ]
}

Now interpret the following workflow:
`;


// ----------- API ROUTE (Gemini Instead of OpenAI) -------------

export async function POST(req: NextRequest) {
  try {
    const { jsonConfig } = await req.json();

    const payload = PROMPT + JSON.stringify(jsonConfig);

    const result = await geminiModel.generateContent(payload);

    const outputText = result.response.text();

    // Cleanup: Gemini sometimes adds code fences or prefix text
    const clean = outputText
      .replace(/^```json/, "")
      .replace(/^```/, "")
      .replace(/```$/, "")
      .trim();

    let parsedJson;

    try {
      parsedJson = JSON.parse(clean);
    } catch (err) {
      return NextResponse.json(
        {
          error: "Failed to parse JSON from Gemini response",
          raw: outputText,
          details: err,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ parsedJson });

  } catch (e) {
    return NextResponse.json(
      { error: "Server error", details: e },
      { status: 500 }
    );
  }
}
