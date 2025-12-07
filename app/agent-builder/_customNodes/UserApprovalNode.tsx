import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Handle, Position } from '@xyflow/react'
import { Signature } from 'lucide-react'
import React from 'react'

function UserApprovalNode({data}:any) {
  return (
   <div className='bg-white rounded-2xl p-2 px-4 border'>
      <div className='flex gap-2 items-center'>
        <Signature className='p-2 rounded-lg h-8 w-8 bg-purple-100'/>
        <h2>Aprroval</h2>
      </div>
      <div className='max-w-[140px] flex flex-col gap-2 mt-2'>
         <Button variant={'outline'} disabled>Aprrove</Button>
         <Button variant={'outline'} disabled>Reject</Button>
      </div>
       <Handle type='target' position={Position.Left}/>
      <Handle type='source' position={Position.Right} id={'approve'}/>
      <Handle type='source' position={Position.Right} id={'reject'}/>
      
    </div>
  )
}

export default UserApprovalNode
