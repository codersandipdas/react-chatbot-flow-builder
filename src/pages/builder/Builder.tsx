import Header from '../../components/builder/Header';
import 'reactflow/dist/style.css';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Edge,
  Connection,
} from 'reactflow';
import { useCallback, useMemo, useRef, useState } from 'react';
import Sidebar from '../../components/builder/Sidebar';
import TextNode from '../../components/builder/nodes/TextNode';

let id = 0;
const getId = () => `dndnode_${id++}`;

const Builder = () => {
  const nodeTypes = useMemo(() => ({ textNode: TextNode }), []);
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const sourceId = params.source;
      const sourceHandleId = params.sourceHandle;

      // Check if there is already an edge from the same source handle
      const existingEdges = edges.filter(
        (edge) =>
          edge.source === sourceId && edge.sourceHandle === sourceHandleId
      );
      if (existingEdges.length > 0) {
        return; // Do not allow multiple edges from the same source handle
      }

      setEdges((eds) => addEdge(params, eds));
    },
    [edges]
  );

  const onDragOver = useCallback((event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // get drop position
      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // create new node
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node`, value: '' },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onNodeClick = useCallback(
    (event: any, node: any) => setSelectedNode(node),
    []
  );

  return (
    <ReactFlowProvider>
      <div className='h-screen flex overflow-hidden flex-col'>
        <Header
          onSave={() => {
            console.log('onsave clcked');
          }}
          className='px-4 py-2 shrink-0 border-b'
        />

        <div className='flex-1 flex overflow-hidden'>
          <div className='flex-1 reactflow-wrapper' ref={reactFlowWrapper}>
            <ReactFlow
              nodeTypes={nodeTypes}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              onNodeClick={onNodeClick}
            >
              <Controls />
            </ReactFlow>
          </div>
          <Sidebar
            selectedNode={selectedNode}
            className='px-4 py-4 w-[400px] max-w-[40%] border-l overflow-x-hidden overflow-y-auto'
          />
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default Builder;
