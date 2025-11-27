"use client"
import React,{useCallback,useContext,useEffect,useState} from 'react'
import Header from '../_components/Header';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, MiniMap, Controls, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import StartNode from '../_components/StartNode';
import AgentNode from '../_components/AgentNode';
import AgentToolsPanel from '../_components/AgentToolsPanel';
import { WorkFlowContext } from '@/context/WorkFlowContext';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import {Agent} from '../../../types/AgentType'

const nodeTypes = {
  StartNode: StartNode ,
  AgentNode:AgentNode,
};
const AgentBuilder = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const {addedNodes,setAddedNodes,nodeEdges,setNodeEdges}=useContext(WorkFlowContext);
  const {agentId}=useParams();
  const convex=useConvex();
  const [agentDetail,setAgentDetail]=useState<Agent>();
useEffect(()=>{
  GetAgentDetail()
},[])

  const GetAgentDetail=async()=>{
const result=await convex.query(api.agent.GetAgentById,{
 agentId: agentId as string
})
  }


  useEffect(()=>{
   addedNodes && setNodes(addedNodes)
   nodeEdges && setEdges(nodeEdges)
  },[addedNodes])

   useEffect(()=>{
edges && setNodeEdges(edges)
  },[edges,setNodeEdges])

  const SaveNodesAndEdges=()=>{
     
  }
 
  const onNodesChange = useCallback(
  (changes: any) => {
    setNodes((prev) => {
      const updated = applyNodeChanges(changes, prev);
      setAddedNodes(updated);
      return updated;
    });
  },
  [setAddedNodes]
);

  const onEdgesChange = useCallback(
    (changes:any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    // @ts-ignore
    (params:any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  )
  return (
    <div>
      <Header agentDetail={agentDetail}/>
      <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
      > 
      <MiniMap/>
      <Controls/>
      {/* @ts-ignore */}
        <Background variant='dots' gap={12} size={1}></Background>
        <Panel position='top-left'>
        <AgentToolsPanel/>
        </Panel>
        <Panel position='top-right'>
        Settings
        </Panel>
      </ReactFlow>
    </div>
    </div>
  )
}

export default AgentBuilder;
