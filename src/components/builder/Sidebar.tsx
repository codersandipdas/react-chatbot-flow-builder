import React, { memo } from 'react';
import { BuilderElementType } from '../../helpers/types';
import { BiMessageRoundedDetail } from 'react-icons/bi';

interface Props {
  className?: string;
  selectedNode: any;
}

const elements: BuilderElementType[] = [
  {
    label: 'Message',
    id: 'text-message',
    draggable: true,
    type: 'default',
    icon: <BiMessageRoundedDetail size={30} />,
  },
  {
    label: 'Message',
    id: 'text-message1',
    draggable: true,
    type: 'textNode',
    icon: <BiMessageRoundedDetail size={30} />,
  },
];

const Sidebar = ({ className = '', selectedNode }: Props) => {
  console.log('selectedNode', selectedNode);

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className={className}>
      <div className='grid grid-cols-2 gap-4 h-auto'>
        {elements.map((el) => (
          <div
            key={el.id}
            className={`dndnode flex flex-col gap-1 items-center border border-primary rounded p-2 text-primary hover:bg-primary/5  cursor-move ${el.id}`}
            onDragStart={(event) => onDragStart(event, el.type)}
            draggable
          >
            {el.icon}
            <span className='font-semibold'>{el.label}</span>
          </div>
        ))}
      </div>

      {/* <div
        className='dndnode input'
        onDragStart={(event) => onDragStart(event, 'input')}
        draggable
      >
        Input Node
      </div>
      <div
        className='dndnode'
        onDragStart={(event) => onDragStart(event, 'default')}
        draggable
      >
        Default Node    
      </div>
      <div
        className='dndnode output'
        onDragStart={(event) => onDragStart(event, 'output')}
        draggable
      >
        Output Node
      </div> */}
    </aside>
  );
};

export default memo(Sidebar);
