// "use client"
// import React, { useEffect, useState } from 'react'
// import Header from '../../_components/Header'
// import { useConvex } from 'convex/react'
// import { useParams } from 'next/navigation'
// import {Agent} from '../../../../types/AgentType'
// import {  ReactFlow } from '@xyflow/react'
// import { nodeTypes } from '../page'
// import '@xyflow/react/dist/style.css';
// import axios from 'axios';
// import { Button } from '@/components/ui/button'
// import { api } from '@/convex/_generated/api'
// import { useMutation } from "convex/react";
// import {  RefreshCcwIcon } from 'lucide-react'
// import ChatUI from './_components/ChatUI'

// const PreviewAgent = () => {
//   const convex=useConvex();
//   const {agentId}=useParams();
//   const [agentDetail,setAgentDetail]=useState<Agent>();
//   const [flowConfig,setFlowConfig]=useState<any>(null);
//   const [loading,setLoading]=useState(false);
//   const updateAgentToolConfig=useMutation(api.agent.UpdateAgentToolConfig)
//   const [conversationId,setConversationId]=useState<string|null>(null);
//   // 🧠 Store the agent detail fetched from Convex (nodes + edges)
// // const [agentDetail, setAgentDetail] = useState<Agent>();

// // 🌼 Convex client instance
// // const convex = useConvex();

// // 🔑 Get agentId from URL params (e.g., /agent/[agentId])
// // const { agentId } = useParams();

// // 🧾 Store generated workflow config

// // 📦 Fetch agent details when component mounts
// useEffect(() => {
//     GetAgentDetail();
// }, []);

// // 🔍 Convex query to fetch agent detail by ID
// const GetAgentDetail = async () => {
//     const result = await convex.query(api.agent.GetAgentById, {
//         agentId: agentId as string
//     });
//     setAgentDetail(result);
    
//     const conversationIdResult=await axios.get('/api/agent-chat')
//     console.log(conversationIdResult,"idof conversation")
//     setConversationId(conversationIdResult?.data)

// };

// // 🌿 Generate workflow once agent data is loaded
// useEffect(() => {
//     if (agentDetail) {
//         GenerateWorkflow();
//     }
// }, [agentDetail]);

// // 🧱 Generate workflow config (node/edge relationship)
// const GenerateWorkflow = () => {
//     // 🌿 Build Edge Map for quick source → target lookup
//     const edgeMap = agentDetail?.edges?.reduce((acc: any, edge: any) => {
//         if (!acc[edge.source]) acc[edge.source] = [];
//         acc[edge.source].push(edge);
//         return acc;
//     }, {});

//     // 📘 Build flow array by mapping each node
//     const flow = agentDetail?.nodes?.map((node: any) => {
//         const connectedEdges = edgeMap[node.id] || [];
//         let next: any = null;

//         switch (node.type) {
//             // 🌐 Conditional branching node with "if" and "else"
//             case "IfElseNode": {
//                 const ifEdge = connectedEdges.find((e: any) => e.sourceHandle === "if");
//                 const elseEdge = connectedEdges.find((e: any) => e.sourceHandle === "else");

//                 next = {
//                     if: ifEdge?.target || null,
//                     else: elseEdge?.target || null,
//                 };
//                 break;
//             }

//             // 🤖 Agent or AI Node
//             case "AgentNode": {
//                 if (connectedEdges.length === 1) {
//                     next = connectedEdges[0].target;
//                 } else if (connectedEdges.length > 1) {
//                     next = connectedEdges.map((e: any) => e.target);
//                 }
//                 break;
//             }

//             // 🔗 API Call Node
//             case "ApiNode": {
//                 if (connectedEdges.length === 1) {
//                     next = connectedEdges[0].target;
//                 }
//                 break;
//             }

//             // 🧩 User Approval Node (manual checkpoint)
//             case "UserApprovalNode": {
//                 if (connectedEdges.length === 1) {
//                     next = connectedEdges[0].target;
//                 }
//                 break;
//             }

//             // 🚀 Start Node
//             case "StartNode": {
//                 if (connectedEdges.length === 1) {
//                     next = connectedEdges[0].target;
//                 }
//                 break;
//             }

//             // 🏁 End Node
//             case "EndNode": {
//                 next = null; // No next node
//                 break;
//             }

//             // 🛠 Default handling for any unknown node type
//             default: {
//                 if (connectedEdges.length === 1) {
//                     next = connectedEdges[0].target;
//                 } else if (connectedEdges.length > 1) {
//                     next = connectedEdges.map((e: any) => e.target);
//                 }
//                 break;
//             }
//         }

//         // 🧾 Return a simplified node configuration
//         return {
//             id: node.id,
//             type: node.type,
//             label: node.data?.label || node.type,
//             settings: node.data?.settings || {},
//             next,
//         };
//     });

//     // 🏁 Find the Start Node
//     const startNode = agentDetail?.nodes?.find((n: any) => n.type === "StartNode");

//     // 📦 Final Config structure
//     const config = {
//         startNode: startNode?.id || null,
//         flow,
//     };
    
//     setFlowConfig(config);
//     console.log("✅ Generated Workflow Config:", config);
// };


// useEffect(()=>{
//   GetAgentDetail()
// },[])

// // const GetAgentDetail = async () => {
// //   const result = await convex.query(api.agent.GetAgentById, {
// //     agentId: agentId as string,
// //   });

// //   setAgentDetail(result); // ← REQUIRED
// // };

// const GenerateAgentToolConfig=async()=>{
//     setLoading(true);
// const result=await axios.post('/api/generate-agent-tool-config',{
//     jsonConfig:flowConfig
// });
// console.log(result.data,"result to mil gya");
// await updateAgentToolConfig({
//     id:agentDetail?._id as any,
//     agentToolConfig:result.data
// });
// GetAgentDetail();
// setLoading(false);
// }


//   return (
//     <div>
//       <Header previewHeader={true}
//       agentDetail={agentDetail}
//       />
//       <div className='grid grid-cols-4 gap-10'>
//       <div className='col-span-3 p-5 border rounded-2xl '>
//       <div  style={{ width: '100%', height: 'calc(100vh - 70px)' }}>
//       <ReactFlow
//               nodes={agentDetail?.nodes || [] }
//               edges={agentDetail?.edges || []}
//               fitView
//               nodeTypes={nodeTypes}
//               draggable={false}
//             ></ReactFlow> 
//       {/* /* @ts-ignore */}
//     {/* <Background variant={'dots'} gap={12} size={1}></Background> */ }
//     </div>
//     </div>
//     <div className='col-span-1 border rounded-2xl p-5 m-5'>
// {!agentDetail?.agentToolConfig ? <Button onClick={GenerateAgentToolConfig}
// disabled={loading}
// ><RefreshCcwIcon className={`${loading && 'animate-spin'}`}/>
//     Reboot Agent
//     </Button> : 
//     <ChatUI GenerateAgentToolConfig={GenerateAgentToolConfig} 
//     loading={loading}
//     agentDetail={agentDetail}
//     conversationId={conversationId}
//     />
//     }
//     </div>
//     </div>
//     </div>
//   )
// }

// export default PreviewAgent


"use client"
import React, { useEffect, useState } from 'react'
import Header from '../../_components/Header'
import { useConvex } from 'convex/react'
import { useParams } from 'next/navigation'
import { Agent } from '../../../../types/AgentType'
import { ReactFlow } from '@xyflow/react'
import { nodeTypes } from '../page'
import '@xyflow/react/dist/style.css';
import axios from 'axios';
import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api'
import { useMutation } from "convex/react";
import { RefreshCcwIcon } from 'lucide-react'
import ChatUI from './_components/ChatUI'
import PublishCodeDialog from './_components/PublishCodeDialog'

const PreviewAgent = () => {

  const convex = useConvex();
  const { agentId } = useParams();

  const [agentDetail, setAgentDetail] = useState<Agent>();
  const [flowConfig, setFlowConfig] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const updateAgentToolConfig = useMutation(api.agent.UpdateAgentToolConfig);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [openDialog,setOpenDialog]=useState(false);

  console.log("🟦 COMPONENT RENDERED | agentId =", agentId);

  useEffect(() => {
    console.log("🔵 useEffect → GetAgentDetail() called on mount");
    GetAgentDetail();
  }, []);

  const GetAgentDetail = async () => {
    console.log("🟣 Fetching agent details from Convex → agentId:", agentId);

    const result = await convex.query(api.agent.GetAgentById, {
      agentId: agentId as string
    });

    console.log("🟢 Convex Result (agentDetail):", JSON.stringify(result, null, 2));

    setAgentDetail(result);

    const conversationIdResult = await axios.get('/api/agent-chat');
    console.log("🟡 ConversationId Response:", conversationIdResult);

    setConversationId(conversationIdResult?.data);

    console.log("🟡 Saved conversationId:", conversationIdResult?.data);
  };

  useEffect(() => {
    console.log("🟠 agentDetail changed:", agentDetail);
    if (agentDetail) {
      console.log("🟠 Calling GenerateWorkflow() because agentDetail loaded");
      GenerateWorkflow();
    }
  }, [agentDetail]);

  const GenerateWorkflow = () => {
    console.log("🔵 STARTING GenerateWorkflow()");
    console.log("📌 agentDetail:", JSON.stringify(agentDetail, null, 2));

    const edgeMap = agentDetail?.edges?.reduce((acc: any, edge: any) => {
      if (!acc[edge.source]) acc[edge.source] = [];
      acc[edge.source].push(edge);
      return acc;
    }, {});

    console.log("🧩 Built edgeMap:", JSON.stringify(edgeMap, null, 2));

    const flow = agentDetail?.nodes?.map((node: any) => {
      console.log("🟨 Processing node:", node);

      const connectedEdges = edgeMap[node.id] || [];
      console.log("🔗 connectedEdges:", connectedEdges);

      let next: any = null;

      switch (node.type) {
        case "IfElseNode": {
          const ifEdge = connectedEdges.find((e: any) => e.sourceHandle === "if");
          const elseEdge = connectedEdges.find((e: any) => e.sourceHandle === "else");

          next = {
            if: ifEdge?.target || null,
            else: elseEdge?.target || null,
          };
          break;
        }

        case "AgentNode": {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          } else if (connectedEdges.length > 1) {
            next = connectedEdges.map((e: any) => e.target);
          }
          break;
        }

        case "ApiNode":
        case "UserApprovalNode":
        case "StartNode": {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          }
          break;
        }

        case "EndNode": {
          next = null;
          break;
        }

        default: {
          if (connectedEdges.length === 1) {
            next = connectedEdges[0].target;
          } else if (connectedEdges.length > 1) {
            next = connectedEdges.map((e: any) => e.target);
          }
          break;
        }
      }

      console.log("🟩 Node Processed → next:", next);

      return {
        id: node.id,
        type: node.type,
        label: node.data?.label || node.type,
        settings: node.data?.settings || {},
        next,
      };
    });

    console.log("🟦 FINAL FLOW ARRAY:", JSON.stringify(flow, null, 2));

    const startNode = agentDetail?.nodes?.find((n: any) => n.type === "StartNode");
    console.log("🏁 StartNode:", startNode);

    const config = {
      startNode: startNode?.id || null,
      flow,
    };

    console.log("💠 FINAL GENERATED flowConfig:", JSON.stringify(config, null, 2));

    setFlowConfig(config);
  };

  const GenerateAgentToolConfig = async () => {
    setLoading(true);

    console.log("⚙️ Sending flowConfig to backend:", flowConfig);

    const result = await axios.post('/api/generate-agent-tool-config', {
      jsonConfig: flowConfig
    });

    console.log("🟢 Backend returned agentToolConfig:", result.data);

    await updateAgentToolConfig({
      id: agentDetail?._id as any,
      agentToolConfig: result.data
    });

    console.log("🟣 Updated agentToolConfig in Convex");

    GetAgentDetail();
    setLoading(false);
  };

  const onPublish=()=>{
  setOpenDialog(true);
  }

  return (
    <div>
      <Header previewHeader={true} agentDetail={agentDetail} onPublish={onPublish}/>

      <div className='grid grid-cols-4 gap-10'>
        <div className='col-span-3 p-5 border rounded-2xl '>
          <div style={{ width: '100%', height: 'calc(100vh - 70px)' }}>
            <ReactFlow
              nodes={agentDetail?.nodes || []}
              edges={agentDetail?.edges || []}
              fitView
              nodeTypes={nodeTypes}
              draggable={false}
            ></ReactFlow>
          </div>
        </div>

        <div className='col-span-1 border rounded-2xl p-5 m-5'>
          {!agentDetail?.agentToolConfig ? (
            <Button onClick={GenerateAgentToolConfig} disabled={loading}>
              <RefreshCcwIcon className={`${loading && 'animate-spin'}`} />
              Reboot Agent
            </Button>
          ) : (
            <ChatUI
              GenerateAgentToolConfig={GenerateAgentToolConfig}
              loading={loading}
              agentDetail={agentDetail}
              conversationId={conversationId}
            />
          )}
        </div>
      </div>
      <PublishCodeDialog openDialog={openDialog} setOpenDialog={setOpenDialog}/>
    </div>
  );
};

export default PreviewAgent;
