import { Input } from '@/components/ui/input'
import { Handle, Position } from '@xyflow/react'
import { ChevronsLeftRightEllipsis } from 'lucide-react'
import React from 'react'

const IfElseNode = ({data}:any) => {
  return (
    <div className='bg-white rounded-2xl p-2 px-4 border relative'>
      <div className='flex gap-2 items-center'>
        <ChevronsLeftRightEllipsis className='p-2 rounded-lg h-8 w-8 bg-orange-200'/>
        <h2>If-Else Block</h2>
      </div>

      <div className='max-w-[140px] flex flex-col gap-2 mt-2'>
        <Input placeholder='If-condition' className='text-sm bg-white' disabled/>
        <Input placeholder='Else-condition' className='text-sm bg-white' disabled/>
      </div>

      {/* target handle */}
      <Handle type='target' position={Position.Left} />

      {/* source handles - positioned separately */}
      <Handle
        type='source'
        position={Position.Right}
        id='if'
        style={{ top: '65px' }}
      />

      <Handle
        type='source'
        position={Position.Right}
        id='else'
        style={{ top: '110px' }}
      />
    </div>
  )
}

export default IfElseNode
