import { Handle, Position } from '@xyflow/react'
import { Webhook } from 'lucide-react'
import React from 'react'

function ApiNode() {
  return (
    <div>
      <div className='bg-white rounded-2xl p-2 px-4 border'>
      <div className='flex gap-2 items-center'>
        <Webhook className='p-2 rounded-lg h-8 w-8 bg-green-200'/>
        <h2>Api</h2>
        <Handle type='target' position={Position.Left}/>
        <Handle type='source' position={Position.Right}/>
      </div>
    </div>
    </div>
  )
}

export default ApiNode
