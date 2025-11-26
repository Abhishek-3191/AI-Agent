import { Merge, MousePointer, Repeat, Square, ThumbsUp, Webhook } from 'lucide-react';
import React from 'react'
const AgentTools=[
{
  name:'Agent',
  icon:MousePointer,
  bgColor:'#CD7E3',
  id:'agent',
  type:'AgentNode'
},
{
  name:'End',
  icon:Square,
  bgColor:'#FFE3E3',
  id:'end',
  type:'EndNode'
},

{
  name:'If/Else',
  icon:Merge,
  bgColor:'#FFF3CD',
  id:'ifElse',
  type:'IfElseNode'
},
{
  name:'While',
  icon:Repeat,
  bgColor:'#E3F2FD',
  id:'while',
  type:'WhileNode'
},
{
  name:'User Approval',
  icon:ThumbsUp,
  bgColor:'#EADCF8',
  id:'approval',
  type:'ApprovalNode'
},
{
  name:'API',
  icon:Webhook,
  bgColor:'#D1F0FF',
  id:'api',
  type:'ApiNode'
},
];
const AgentToolsPanel = () => {
  return (
    <div className='bg-white p-5 rounded-2xl shadow'>
      <h2 className="font-semibold mb-4 text-gray-700">AI Agent Tools</h2>

      <div>
        {AgentTools.map((tool, index) => (
          <div key={index} className="flex items-center gap-2 mb-3">
            <tool.icon
              className='p-2 rounded-lg h-8 w-8'
              style={{ backgroundColor: tool.bgColor }}
            />
            <span className="text-gray-700 font-medium">{tool.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};


export default AgentToolsPanel
