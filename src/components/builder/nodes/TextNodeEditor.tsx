import React, { useEffect, useRef, useState } from 'react';

interface Props {
  label: string;
  value: string;
  id: string;
  onChange: (value: string) => void;
}

const TextNodeEditor = ({ label, value, id, onChange }: Props) => {
  const [val, setval] = useState<string>(value);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // set default value on render/re-render and focus
  useEffect(() => {
    setval(value);
    inputRef?.current?.focus();
  }, [id]);

  // call function on value change to update node
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setval(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div>
      <label className='block text-zinc-500' htmlFor={id}>
        {label}
      </label>
      <textarea
        ref={inputRef}
        className='w-full border rounded mt-3 p-2'
        id={id}
        value={val || ''}
        onChange={handleInputChange}
        rows={4}
      ></textarea>
    </div>
  );
};

export default TextNodeEditor;
