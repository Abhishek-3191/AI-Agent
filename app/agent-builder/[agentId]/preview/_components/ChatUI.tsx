import { Button } from '@/components/ui/button'
import { Loader2Icon, RefreshCcwIcon, Send } from 'lucide-react'
import React, { useState } from 'react'
import { api } from '@/convex/_generated/api'
import { useMutation } from "convex/react";
import {Agent} from '../../../../../types/AgentType'
import { useConvex } from 'convex/react'
import { useParams } from 'next/navigation'
import axios from 'axios';

type Props={
  GenerateAgentToolConfig:()=>void,
  loading:boolean,
  agentDetail:Agent,
  conversationId:string|null
}

function ChatUI({GenerateAgentToolConfig,loading,agentDetail,conversationId}:Props) {
    const convex=useConvex();
    const {agentId}=useParams();
    // const [agentDetail,setAgentDetail]=useState<Agent>();
    const [loadingMsg,setLoadingMsg]=useState(false);
    const updateAgentToolConfig=useMutation(api.agent.UpdateAgentToolConfig);
     const [flowConfig,setFlowConfig]=useState<any>(null);
     const [userInput,setUserInput]=useState<string>('');
     const [messages,setMessages]=useState<{role:string,content:string}[]>([]);

     const OnSendMsg=async()=>{
      setLoadingMsg(true);
      setMessages([...messages,{role:'user',content:userInput}])
      setUserInput('');
      const res=await fetch('app/api/agent-chat',{
        method:'POST',
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          agentName:agentDetail?.name,
          agents:agentDetail?.config?.agents || [],
          tools:agentDetail?.config?.tools || [],
          input:userInput,
          conversationId:conversationId
        })
      })
      if(!res.body){
        return;
      }
      const reader=res.body.getReader();
      const decoder=new TextDecoder();
      let done=false;
      while(!done){
        const {value,done:doneReading}=await reader.read();
        done=doneReading;
        if(value){
            console.log(decoder.decode(value));
            const chunk=decoder.decode(value);
            setMessages((prev)=>{
              const updated=[...prev];
              updated[updated.length-1]={
                role:'assistant',
                content:(updated[updated.length-1]?.content || '')+chunk
              }
              return updated;
            })
        }
        
      }
      setLoadingMsg(false);
     }



  return (
    <>
    <div className="flex justify-between items-center border-b p-4">
  <h2>{agentDetail?.name}</h2>
  <Button onClick={GenerateAgentToolConfig} disabled={loading}>
    <RefreshCcwIcon className={`${loading && "animate-spin"}`} /> Reboot Agent
  </Button>
</div>

<div className="w-full h-[90vh] p-4 flex flex-col">

  {/* Message Section */}
  <div  className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
   
     {messages.map((msg, index) => (
  <div
    key={index}
    className={`p-2 rounded-lg max-w-[80%]
      ${msg.role === 'user'
        ? 'bg-blue-500 text-white self-end'
        : 'bg-gray-300 text-black self-start'
      }`}
  >
    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
  </div>
))}

   

    {/* Loading state */}
    <div className="flex justify-center items-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-800"></div>
      <span className="ml-2 text-zinc-800">Thinking... Working on your request</span>
    </div>
  </div>

  {/* Footer Input */}
  <div className="p-1 mt-3 border-t flex items-center gap-2">
    <textarea
    value={userInput}
      placeholder="Type your message here..."
      className="flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
      onChange={(e)=>{setUserInput(e.target.value)}}
    ></textarea>
    <Button onClick={OnSendMsg} disabled={loadingMsg || !userInput.trim().length}>
    {loadingMsg?<Loader2Icon className='animate-spin'/>:<Send/>}
    </Button>
  </div>
</div>
</>
  )
}

export default ChatUI


// import { Button } from '@/components/ui/button'
// import { Loader2Icon, RefreshCcwIcon, Send } from 'lucide-react'
// import React, { useState } from 'react'
// import { api } from '@/convex/_generated/api'
// import { useMutation, useConvex } from "convex/react";
// import { Agent } from '../../../../../types/AgentType'
// import { useParams } from 'next/navigation'
// import axios from 'axios';

// type Props = {
//   GenerateAgentToolConfig: () => void,
//   loading: boolean,
//   agentDetail: Agent,
//   conversationId: string | null
// }

// function ChatUI({ GenerateAgentToolConfig, loading, agentDetail, conversationId }: Props) {
//   const convex = useConvex();
//   const { agentId } = useParams();

//   const updateAgentToolConfig = useMutation(api.agent.UpdateAgentToolConfig);

//   const [loadingMsg, setLoadingMsg] = useState(false);
//   const [userInput, setUserInput] = useState<string>("");

//   const [messages, setMessages] = useState<{ role: string, content: string }[]>([]);

//   // ======================
//   // SEND MESSAGE
//   // ======================
//   const OnSendMsg = async () => {
//     setLoadingMsg(true);

//     // Add user message immediately
//     setMessages((prev) => [...prev, { role: "user", content: userInput }]);

//     const currentInput = userInput;
//     setUserInput("");

    
//   const res = await fetch("/api/agent-chat", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({
//     message: currentInput   // <-- ONLY send this
//   })
// });

//     // const res = await fetch("/api/agent-chat", {
//     //   method: "POST",
//     //   headers: {
//     //     "Content-Type": "application/json"
//     //   },
//     //   body: JSON.stringify({
//     //     agentName: agentDetail?.name,
//     //     agents: agentDetail?.config?.agents || [],
//     //     tools: agentDetail?.config?.tools || [],
//     //     input: currentInput,
//     //     conversationId: conversationId
//     //   })
//     // });

//     if (!res.body){ 
//       return;
//     }

//     // Add empty assistant message placeholder
//     setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

//     const reader = res.body.getReader();
//     const decoder = new TextDecoder();

//     let done = false;
//     setMessages((prev)=>[...prev,{role:'assistant',content:'[ ]'}])

//     while (!done) {
//       const { value, done: doneReading } = await reader.read();
//       done = doneReading;

//       if (value) {
//         const chunk = decoder.decode(value);

//         // Append streamed chunk to last assistant message
//         setMessages((prev) => {
//           const updated = [...prev];
//           const lastIndex = updated.length - 1;

//           if (updated[lastIndex]?.role === "assistant") {
//             updated[lastIndex].content += chunk;
//           }

//           return updated;
//         });
//       }
//     }

//     setLoadingMsg(false);
//   };
//   return (
//     <>
//       {/* HEADER */}
//       <div className="flex justify-between items-center border-b p-4">
//         <h2 className="text-lg font-semibold">{agentDetail?.name}</h2>

//         <Button onClick={GenerateAgentToolConfig} disabled={loading}>
//           <RefreshCcwIcon className={`${loading && "animate-spin"}`} />
//           Reboot Agent
//         </Button>
//       </div>

//       {/* BODY */}
//       <div className="w-full h-[90vh] p-4 flex flex-col">

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">

//           {messages.map((msg, index) => (
//             <div
//               key={index}
//               className={`p-2 rounded-lg max-w-[80%] whitespace-pre-wrap
//                 ${msg.role === "user"
//                   ? "bg-blue-500 text-white self-end"
//                   : "bg-gray-300 text-black self-start"
//                 }`}
//             >
//               {msg.content}
//             </div>
//           ))}

//           {/* Loading Indicator */}
//           {loadingMsg && (
//             <div className="flex justify-center items-center p-4 text-gray-700">
//               <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-zinc-800"></div>
//               <span className="ml-2">Thinking... Processing your request</span>
//             </div>
//           )}
//         </div>

//         {/* Footer input */}
//         <div className="p-1 mt-3 border-t flex items-center gap-2">
//           <textarea
//             value={userInput}
//             placeholder="Type your message here..."
//             className="flex-1 resize-none border rounded-lg px-3 py-2 
//             focus:outline-none focus:ring-2"
//             onChange={(e) => setUserInput(e.target.value)}
//           />

//           <Button
//             onClick={OnSendMsg}
//             disabled={loadingMsg || !userInput.trim().length}
//           >
//             {loadingMsg ? <Loader2Icon className="animate-spin" /> : <Send />}
//           </Button>
//         </div>
//       </div>
//     </>
//   );
// }

// export default ChatUI;
