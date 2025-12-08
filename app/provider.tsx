"use client";
import { UserDetailContext } from '@/context/UserDetailContext';
import { WorkFlowContext } from '@/context/WorkFlowContext';
import { api } from '@/convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { ReactFlowProvider } from '@xyflow/react';
import { useMutation } from 'convex/react';
import React, { useEffect, useState } from 'react'
function Provider( {
     children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const {user}=useUser();
    const createUser=useMutation(api.user.CreateNewUser);
    const [userDetail,setUserDetail]=useState<any>();
    const [selectedNode,setSelectedNode]=useState<any>()
    const [addedNodes,setAddedNodes]=useState([{
      id:'start',
      position:{x:0,y:0},
      data:{label:'Start'},
      type:'StartNode'
    }]);
    const [nodeEdges,setNodeEdges]=useState([]);

    useEffect(()=>{
 user && CreateAndGetUser();
    },[user]);
    const CreateAndGetUser=async()=>{
          if(user){
            const result=await createUser({
                name:user.fullName??' ',
                email:user.primaryEmailAddress?.emailAddress??' '
            })
            //save to context
            setUserDetail(result);
          }
    }
  return (
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
      <ReactFlowProvider>
      <WorkFlowContext.Provider value={{addedNodes,setAddedNodes,nodeEdges,setNodeEdges,selectedNode,setSelectedNode}}>
    <div>
      {children}
    </div>
    </WorkFlowContext.Provider>
    </ReactFlowProvider>
    </UserDetailContext.Provider>
  )
}

export default Provider
