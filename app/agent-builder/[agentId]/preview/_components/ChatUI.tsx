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

    //  const OnSendMsg=async()=>{
    //   setLoadingMsg(true);
    //   // console.log("API KEY", process.env.GOOGLE_API_KEY);

    //   setUserInput('');
    //   const res=await fetch('app/api/agent-chat',{
    //     method:'POST',
    //     headers:{
    //       "Content-Type":"application/json"
    //     },
    //     body:JSON.stringify({
    //       agentName:agentDetail?.name,
    //       agents:agentDetail?.config?.agents || [],
    //       tools:agentDetail?.config?.tools || [],
    //       input:userInput,
    //       conversationId:conversationId
    //     })
    //   })
    //   if(!res.body){
    //     return;
    //   }
    //   const reader=res.body.getReader();
    //   const decoder=new TextDecoder();
    //   let done=false;
    //   while(!done){
    //     const {value,done:doneReading}=await reader.read();
    //     done=doneReading;
    //     if(value){
    //         console.log(decoder.decode(value));
    //     }
        
    //   }
    //   setLoadingMsg(false);
    //  }

const OnSendMsg = async () => {
  if (!userInput || !agentDetail) return;

  setLoadingMsg(true);

  try {
    const payload = {
      agentName: agentDetail.name,
      agents: agentDetail.config?.agents || [],
      tools: agentDetail.config?.tools || [],
      input: userInput,              // keep userInput before clearing
      conversationId: conversationId
    };

    // Clear input after preparing payload
    setUserInput('');

    const res = await fetch('/api/agent-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Backend Error:', errorText);
      setLoadingMsg(false);
      return;
    }

    if (!res.body) {
      console.warn('No response body from backend');
      setLoadingMsg(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value);
        console.log('Stream chunk:', chunk);
        // Optionally append chunk to state to show in UI
      }
    }

  } catch (err) {
    console.error('Fetch error:', err);
  } finally {
    setLoadingMsg(false);
  }
};


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
  <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col">
    {/* Hardcoded messages */}
    <div className="flex justify-start">
      <div className="p-2 rounded-lg max-w-[80%] bg-gray-300 text-black">
        <h2 className="text-sm">Welcome! This is a demo chat.</h2>
      </div>
    </div>

    <div className="flex justify-end">
      <div className="p-2 rounded-lg max-w-[80%] bg-gray-100 text-black">
        <h2 className="text-sm">Hello! Can you show me a design idea?</h2>
      </div>
    </div>

    <div className="flex justify-start">
      <div className="p-2 rounded-lg max-w-[80%] bg-gray-300 text-black">
        <h2 className="text-sm">Sure! I suggest a modern dashboard with clean layouts.</h2>
      </div>
    </div>

    <div className="flex justify-end">
      <div className="p-2 rounded-lg max-w-[80%] bg-gray-100 text-black">
        <h2 className="text-sm">Great! Can we add dark mode?</h2>
      </div>
    </div>

    <div className="flex justify-start">
      <div className="p-2 rounded-lg max-w-[80%] bg-gray-300 text-black">
        <h2 className="text-sm">Absolutely! Dark mode will make the dashboard look sleek.</h2>
      </div>
    </div>

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

