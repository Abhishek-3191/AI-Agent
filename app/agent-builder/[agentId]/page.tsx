"use client"
import React,{useCallback,useState} from 'react'
import Header from '../_components/Header';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, MiniMap, Controls, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import StartNode from '../_components/StartNode';
import AgentNode from '../_components/AgentNode';
import AgentToolsPanel from '../_components/AgentToolsPanel';
const initialNodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' },type:'StartNode' },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' },type:'AgentNode' },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];
const nodeTypes = {
  StartNode: StartNode ,
  AgentNode:AgentNode,
};
const AgentBuilder = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
 
  const onNodesChange = useCallback(
    (changes:any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes:any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params:any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  )
  return (
    <div>
      <Header/>
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
