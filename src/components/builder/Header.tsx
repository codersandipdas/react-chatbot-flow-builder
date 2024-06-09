import React, { memo } from 'react';

interface Props {
  className?: string;
  onSave: () => void;
}

const Header = ({ className = '', onSave }: Props) => {
  return (
    <header
      className={`flex justify-between items-center gap-4 bg-zinc-100 text-sm ${className}`}
    >
      <p className='text-primary font-semibold text-xl'>Flow Builder</p>
      <button
        onClick={onSave}
        className='border border-primary px-4 py-1.5 rounded bg-white font-semibold text-primary hover:bg-primary hover:text-white'
      >
        Save changes
      </button>
    </header>
  );
};

export default memo(Header);
