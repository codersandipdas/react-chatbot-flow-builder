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
import toast from 'react-hot-toast';

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
        data: { label: `${type} node`, value: '', selected: false },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  // set selected node on clicking a node
  const onNodeClick = useCallback((event: any, node: any) => {
    setSelectedNode({ ...node });
  }, []);

  // Function to handle node value change
  const onNodeValChange = useCallback((nodeId: string, value: string) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, value } } : node
      )
    );
  }, []);

  // deselect node on pressing editor back button
  const handleDeselectNode = () => {
    setSelectedNode(null);
    setNodes((nds) =>
      nds.map((node) => (node.selected ? { ...node, selected: false } : node))
    );
  };

  const validateNodes = () => {
    if (nodes.length <= 1) {
      return;
    }

    // Check if any node has empty target handles (no incoming connections)
    const nodeIdsWithEmptyTargetHandles: string[] = [];
    nodes.forEach((node) => {
      const incomingEdges = edges.filter((edge) => edge.target === node.id);
      const hasEmptyTargetHandle = incomingEdges.length === 0;
      if (hasEmptyTargetHandle) {
        nodeIdsWithEmptyTargetHandles.push(node.id);
      }
    });

    if (nodeIdsWithEmptyTargetHandles.length > 1) {
      toast('Cannot save flow', {
        style: { backgroundColor: '#FFCBCB' },
      });
    }
  };

  return (
    <ReactFlowProvider>
      <div className='h-screen flex overflow-hidden flex-col'>
        <Header
          onSave={validateNodes}
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
            className='w-[400px] max-w-[40%] border-l overflow-x-hidden overflow-y-auto'
            onExitNodeEditor={handleDeselectNode}
            onNodeValChange={onNodeValChange}
          />
        </div>
      </div>
    </ReactFlowProvider>
  );
};

export default Builder;
