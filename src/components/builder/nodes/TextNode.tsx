import { memo } from 'react';
import { BiMessageRoundedDetail } from 'react-icons/bi';
import { Handle, Position } from 'reactflow';

function TextNode({ data, selected }: any) {
  return (
    <div
      className={`border rounded shadow-lg bg-white ${
        selected ? 'border-primary' : 'border-zinc-100'
      } text-[10px] overflow-hidden w-[200px]`}
    >
      <Handle
        type='target'
        id='l'
        position={Position.Left}
        style={{
          left: -2.5,
        }}
      />

      <div className='bg-[#B2F0E3] flex gap-1 items-center p-1'>
        <span className='shrink-0'>
          <BiMessageRoundedDetail size={14} />
        </span>
        <span className='flex-1 font-semibold text-zinc-800'>Send Message</span>
        <div className='shrink-0 size-[16px] flex justify-center items-center rounded-full bg-white'>
          <img height={10} width={10} src='/assets/icons/whatsApp.png' />
        </div>
      </div>
      <p className='text-messages p-2'>{data?.value || 'Enter message'}</p>

      <Handle
        type='source'
        id='b'
        position={Position.Right}
        style={{
          right: -2.5,
        }}
      />
    </div>
  );
}

export default memo(TextNode);
