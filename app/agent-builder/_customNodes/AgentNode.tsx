import { Handle, Position } from '@xyflow/react'
import { HatGlasses, MousePointer2, Pointer } from 'lucide-react'
import React from 'react'

const AgentNode = ({data}:any) => {
  return (
   <div className='bg-white rounded-2xl p-2 px-4 border'>
      <div className='flex gap-2 items-center'>
        <HatGlasses className='p-2 rounded-lg h-8 w-8 bg-yellow-100'/>
        <h2>{data?.label}</h2>
        <Handle type='target' position={Position.Left}/>
        <Handle type='source' position={Position.Right}/>
      </div>
    </div>
  )
}

export default AgentNode
