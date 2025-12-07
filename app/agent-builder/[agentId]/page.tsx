"use client"
import React,{useCallback,useContext,useEffect,useState} from 'react'
import Header from '../_components/Header';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, MiniMap, Controls, Panel, useOnSelectionChange, OnSelectionChangeParams } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import StartNode from '../_customNodes/StartNode';
import AgentNode from '../_customNodes/AgentNode';
import AgentToolsPanel from '../_components/AgentToolsPanel';
import { WorkFlowContext } from '@/context/WorkFlowContext';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import {Agent} from '../../../types/AgentType'
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import EndNode from '../_customNodes/EndNode';
import IfElseNode from '../_customNodes/IfElseNode';
import WhileNode from '../_customNodes/WhileNode';
import UserApprovalNode from '../_customNodes/UserApprovalNode';
import ApiNode from '../_customNodes/ApiNode';
import SettingPanel from '../_components/SettingPanel';

export const nodeTypes = {
  StartNode: StartNode ,
  AgentNode:AgentNode,
  EndNode:EndNode,
  IfElseNode:IfElseNode,
  WhileNode:WhileNode,
  UserApprovalNode:UserApprovalNode,
  ApiNode:ApiNode,

};
const AgentBuilder = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const {addedNodes,setAddedNodes,nodeEdges,setNodeEdges,selectedNode,setSelectedNode}=useContext(WorkFlowContext);
  const {agentId}=useParams();
  const convex=useConvex();
  const [agentDetail,setAgentDetail]=useState<Agent>();
  const UpdateAgentDetail=useMutation(api.agent.UpdateAgentDetail)

useEffect(()=>{
  GetAgentDetail()
},[])

//   const GetAgentDetail=async()=>{
// const result=await convex.query(api.agent.GetAgentById,{
//  agentId: agentId as string
// })
//   }

const GetAgentDetail = async () => {
  const result = await convex.query(api.agent.GetAgentById, {
    agentId: agentId as string,
  });

  setAgentDetail(result); // ← REQUIRED
};

  useEffect(()=>{
    if(agentDetail){
setNodes(agentDetail.nodes)
setEdges(agentDetail.edges)
setAddedNodes(agentDetail.nodes)
setNodeEdges(agentDetail.edges)
    }
    
  },[agentDetail])

  useEffect(()=>{
addedNodes&&setNodes(addedNodes)
  },[addedNodes])

   useEffect(()=>{
edges && setNodeEdges(edges)
  },[edges,setNodeEdges])

//    useEffect(()=>{
// (nodes || edges) && SaveNodesAndEdges();
//   },[edges,nodes])

  // const SaveNodesAndEdges=async()=>{
      
  //    const result=await UpdateAgentDetail({
  //     // @ts-ignore
  //     id: agentDetail?._id,
  //     edges:nodeEdges,
  //     nodes:addedNodes
  //    });
  //    console.log("Result",result);
  // }

const SaveNodesAndEdges = async () => {
  if (!agentDetail?._id) {
    console.error("Agent not loaded");
    return;
  }

  await UpdateAgentDetail({
    id: agentDetail._id,
    edges: nodeEdges,
    nodes: addedNodes,
  });
  toast.success('Saved!')
};
const onNodeSelect=useCallback(({nodes,edges}:OnSelectionChangeParams)=>{
setSelectedNode(nodes[0]);
console.log(nodes[0]);
},[])
useOnSelectionChange({
  onChange:onNodeSelect,

})

 
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
      <div style={{ width: '100vw', height: 'calc(100vh - 70px)' }}>
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
        {/* <Panel position='top-center'>
        <AgentToolsPanel/>
        </Panel> */}
        <Panel position='top-right'>
        <SettingPanel/>
        </Panel>
        <Panel position='bottom-center'>
          <Button onClick={SaveNodesAndEdges}><Save/>Save</Button>
        </Panel>
       
      </ReactFlow>
    </div>
    </div>
  )
}

export default AgentBuilder;
