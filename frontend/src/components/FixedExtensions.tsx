import React from 'react';

interface Props {
  selected: string[];
  onChange: (selected: string[]) => void;
  options?: string[];
}

const DEFAULT_FIXED_EXTENSIONS = [
  'bat', 'cmd', 'com', 'cpl', 'exe', 'scr', 'js'
];

const FixedExtensions: React.FC<Props> = ({
  selected,
  onChange,
  options = DEFAULT_FIXED_EXTENSIONS,
}) => {
  const handleCheck = (ext: string) => {
    if (selected.includes(ext)) {
      onChange(selected.filter(e => e !== ext));
    } else {
      onChange([...selected, ext]);
    }
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {options.map(ext => (
          <label key={ext} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            border: selected.includes(ext) ? '2px solid #2977f5' : '1px solid #d1d5db',
            background: selected.includes(ext) ? '#eaf2fd' : '#fcfcfc',
            borderRadius: '7px',
            padding: '5px 12px',
            cursor: 'pointer',
            fontWeight: selected.includes(ext) ? 600 : 400,
            color: '#222',
            transition: 'all 0.15s'
          }}>
            <input
              type="checkbox"
              checked={selected.includes(ext)}
              onChange={() => handleCheck(ext)}
              style={{ accentColor: '#2977f5' }}
            />
            {ext}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FixedExtensions;