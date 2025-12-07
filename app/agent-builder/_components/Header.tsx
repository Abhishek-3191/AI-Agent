// import { Button } from '@/components/ui/button'
// import { Agent } from '@/types/AgentType'
// import { ChevronLeft, Code2, Play } from 'lucide-react'
// import Link  from 'next/link'
// import React from 'react'
// import AgentToolsPanel from './AgentToolsPanel'
// type Props={
//   agentDetail:Agent | undefined
// }
// const Header = ({agentDetail}:Props) => {
//   return (
//     <div className='w-full p-3 flex items-center justify-between'>
//       <div className='flex gap-2 items-center'>
//         <ChevronLeft className='h-8 w-8'/>
//         <h2 className='text-xl'>{agentDetail?.name}</h2>
//       </div>

//      <div className="flex items-center">
//         <AgentToolsPanel />
//       </div>

//       <div className='flex items-center gap-3'>
//         <Button variant={'ghost'}>
//             <Code2/>Code
//         </Button>
//        <Link href={agentDetail ? `/agent-builder/${agentDetail.agentId}/preview` : "#"}>
//   <Button disabled={!agentDetail}>
//     <Play /> Preview
//   </Button>
// </Link>

//          <Button>
//             Publish
//         </Button>
//       </div>
//     </div>
//   )
// }

// export default Header

import { Button } from '@/components/ui/button'
import { Agent } from '@/types/AgentType'
import { ChevronLeft, Code2, Play, X } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import AgentToolsPanel from './AgentToolsPanel'

type Props = {
  agentDetail: Agent | undefined,
  previewHeader?:boolean,
}

const Header = ({ agentDetail,previewHeader=false }: Props) => {
  return (
    <div className="w-full p-3 bg-white shadow flex items-center justify-between gap-4">

      {/* LEFT */}
      <div className="flex items-center gap-2 shrink-0">
        <ChevronLeft className="h-8 w-8 cursor-pointer" />
        <h2 className="text-xl font-semibold">{agentDetail?.name}</h2>
      </div>

      {/* CENTER → Tools Panel */}
      <div className="flex-1 flex justify-center overflow-x-auto whitespace-nowrap no-scrollbar">
        <AgentToolsPanel />
      </div>

      {/* RIGHT */}
      <div className="flex justify-end items-center gap-3">
        <Button variant="ghost">
          <Code2 /> Code
        </Button>

  {  !previewHeader?    <Link href= {`/agent-builder/${agentDetail?.agentId}/preview`}>
          <Button>
            <Play /> Preview
          </Button>
        </Link>
        :
        <Link href={`/agent-builder/${agentDetail?.agentId}`}>
          <Button variant={'outline'}>
            <X /> Close Preview
          </Button>
        </Link>}

  

        <Button>
          Publish
        </Button>
      </div>

    </div>
  )
}

export default Header
