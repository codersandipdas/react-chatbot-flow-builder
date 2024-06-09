import React, { memo } from 'react';
import { BuilderElementType } from '../../helpers/types';
import { BiMessageRoundedDetail } from 'react-icons/bi';
import { IoMdArrowBack } from 'react-icons/io';
import TextNodeEditor from './nodes/TextNodeEditor';

interface Props {
  className?: string;
  selectedNode: any;
  onExitNodeEditor: () => void;
  onNodeValChange: (nodeId: string, value: string) => void;
}

// elements for panel, can add new elements heres
const elements: BuilderElementType[] = [
  {
    label: 'Message',
    id: 'textMessage',
    draggable: true,
    type: 'textNode',
    icon: <BiMessageRoundedDetail size={30} />,
  },
];

const Sidebar = ({
  className = '',
  selectedNode,
  onExitNodeEditor,
  onNodeValChange,
}: Props) => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: any
  ) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify(nodeType)
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  // on chnage, pass values to the builder to show the most recent data
  const handleOnChnage = (val: string) => {
    onNodeValChange(selectedNode.id, val);
  };

  return (
    <aside className={className}>
      {selectedNode ? (
        <div className='border-b'>
          <div className='flex gap-2 border-b items-center'>
            <button
              onClick={onExitNodeEditor}
              className='size-[40px] flex justify-center items-center'
            >
              <IoMdArrowBack size={18} />
            </button>
            <p className='flex-1 text-center'>
              {selectedNode?.data?.label || 'Edit Node'}
            </p>
          </div>
          <div className='px-4 py-4'>
            {selectedNode.type === 'textNode' && (
              <TextNodeEditor
                id={selectedNode.id}
                label='Text'
                value={selectedNode?.data?.value || ''}
                onChange={handleOnChnage}
              />
            )}
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-4 h-auto px-4 py-4'>
          {elements.map((el) => (
            <div
              key={el.id}
              className={`dndnode flex flex-col gap-1 items-center border border-primary rounded p-2 text-primary hover:bg-primary/5  cursor-move ${el.id}`}
              onDragStart={(event) =>
                onDragStart(event, { type: el.type, label: el.label })
              }
              draggable={el.draggable}
            >
              {el.icon}
              <span className='font-semibold'>{el.label}</span>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
};

export default memo(Sidebar);
