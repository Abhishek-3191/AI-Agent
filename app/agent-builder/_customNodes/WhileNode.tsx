import { Input } from '@/components/ui/input'
import { Handle, Position } from '@xyflow/react'
import { Infinity } from 'lucide-react'
import React from 'react'

const WhileNode = ({data}:any) => {
  return (
     <div className='bg-white rounded-2xl p-2 px-4 border'>
      <div className='flex gap-2 items-center'>
        <Infinity className='p-2 rounded-lg h-8 w-8 bg-blue-100'/>
        <h2>Loop</h2>
      </div>
      <div className='max-w-[140px] flex flex-col gap-2 mt-2'>
        <Input placeholder='Loop-condition' className='text-sm bg-white' disabled/>
      </div>
      <Handle type='target' position={Position.Left}/>
      <Handle type='source' position={Position.Right}/>
    
    </div>
  )
}

export default WhileNode
