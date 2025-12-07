import { Handle, Position } from '@xyflow/react'
import { Circle } from 'lucide-react'
import React from 'react'

const EndNode = ({data}:any) => {
  return (
   <div className='bg-white rounded-2xl p-2 px-4 border'>
      <div className='flex gap-2 items-center'>
        <Circle className='p-2 rounded-lg h-8 w-8 bg-red-100'/>
        <h2>End</h2>
        <Handle type='target' position={Position.Left}/>
      </div>
    </div>
  )
}

export default EndNode
