// "use client"
// import { UserDetailContext } from '@/context/UserDetailContext'
// import { api } from '@/convex/_generated/api';
// import { Agent } from '@/types/AgentType';
// import { useConvex } from 'convex/react';
// import { GitBranchPlus, Link } from 'lucide-react';
// import React, { useContext, useEffect, useState } from 'react'
// import moment from 'moment';


// const MyAgents = () => {
//     const {userDetail}=useContext(UserDetailContext);
//     const[agentList,setAgentList]=useState<Agent[]>([]);
//     const convex=useConvex();

//     useEffect(()=>{
//       userDetail && GetUserAgents();
//     },[userDetail]);



//     const GetUserAgents=async()=>{
//     const result=await convex.query(api.agent.GetUserAgents,{
//         userId:userDetail?._id
//     })
//     console.log(result);
//     setAgentList(result);
//     }
//   return (
//     <div className='w-full mt-5'>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg-grid-cols-3 xl:grid-cols-4 gap-5"></div>
//       {agentList.map((agent:Agent,index:number)=>(
//        <Link href={'/agent-builder'+agent.agentId} key={index} className='p-3 border-rounded 2xl shadow'>
//         <GitBranchPlus className='bg-yellow-100 p-2 h-8'/>
//         <h2 className='mt-3'>{agent.name}</h2>
//         <h2 className="text-sm text-gray-400 mt-2">
//             {moment(agent._creationTime).fromNow()}
//         </h2>
//         </Link>
//       ))}
//     </div>
//   )
// }

// export default MyAgents

"use client"
import { UserDetailContext } from '@/context/UserDetailContext'
import { api } from '@/convex/_generated/api';
import { Agent } from '@/types/AgentType';
import { useConvex } from 'convex/react';
import { GitBranchPlus } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react'
import moment from 'moment';
import Link from 'next/link';

const MyAgents = () => {
    const { userDetail } = useContext(UserDetailContext);
    const [agentList, setAgentList] = useState<Agent[]>([]);
    const convex = useConvex();

    useEffect(() => {
        userDetail && GetUserAgents();
    }, [userDetail]);

    const GetUserAgents = async () => {
        const result = await convex.query(api.agent.GetUserAgents, {
            userId: userDetail?._id
        });
        setAgentList(result);
    }

    return (
        <div className='w-full mt-5'>

            {/* GRID FIXED — place map INSIDE grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

                {agentList.map((agent: Agent, index: number) => (
                    <Link
                        href={`/agent-builder/${agent.agentId}`}
                        key={index}
                        className='p-4 border rounded-2xl shadow-sm hover:shadow-md transition bg-white block'
                    >
                        <GitBranchPlus className='bg-yellow-100 p-2 h-10 w-10 rounded-lg' />

                        <h2 className='mt-3 font-semibold text-gray-800'>
                            {agent.name}
                        </h2>

                        <p className="text-sm text-gray-500 mt-1">
                            {moment(agent._creationTime).fromNow()}
                        </p>
                    </Link>
                ))}

            </div>
        </div>
    )
}

export default MyAgents;
