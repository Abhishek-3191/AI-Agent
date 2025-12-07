"use client"
import { WorkFlowContext } from '@/context/WorkFlowContext';
import { ChevronsLeftRightEllipsis, Circle, HatGlasses, Infinity, Merge, MousePointer, Repeat, Signature, Square, ThumbsUp, Webhook } from 'lucide-react';
import React, { useContext } from 'react'
const AgentTools=[
{
  name:'Agent',
  icon:HatGlasses,
  bgColor:'#fffacd',
  id:'agent',
  type:'AgentNode'
},
{
  name:'End',
  icon:Circle,
  bgColor:'#FFE3E3',
  id:'end',
  type:'EndNode'
},

{
  name:'If/Else',
  icon:ChevronsLeftRightEllipsis,
  bgColor:'#ffcba4',
  id:'ifElse',
  type:'IfElseNode'
},
{
  name:'While',
  icon:Infinity,
  bgColor:'#E3F2FD',
  id:'while',
  type:'WhileNode'
},
{
  name:'User Approval',
  icon:Signature,
  bgColor:'#EADCF8',
  id:'approval',
  type:'UserApprovalNode'
},
{
  name:'API',
  icon:Webhook,
  bgColor:'#90ee90 ',
  id:'api',
  type:'ApiNode'
},
];
const AgentToolsPanel = () => {

  const {addedNodes,setAddedNodes}=useContext(WorkFlowContext);

  const onAgentToolClick=(tool:any)=>{
    const newNode={
      id:`${tool.id}-${Date.now()}`,
      position:{x:0,y:100},
      data:{label:tool.name,bgColor:tool.bgColor,id:tool.id,type:tool.type},
      type:tool.type
    }
    setAddedNodes((prev:any)=>[...prev,newNode])
  }

  return (
    <div className='bg-white p-5 rounded-2xl shadow'>
      <h2 className="font-semibold mb-4 text-gray-700 text-center">AI Agent Tools</h2>

      <div className="flex items-center gap-4 flex-wrap">
        {AgentTools.map((tool, index) => (
          <div key={index} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounder-xl" 
          onClick={()=>onAgentToolClick(tool)}>
            <tool.icon
              className='p-2 rounded-lg h-8 w-8'
              style={{ backgroundColor: tool.bgColor }}
            />
            <h2 className="text-gray-700 font-medium text-sm">{tool.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};


export default AgentToolsPanel
