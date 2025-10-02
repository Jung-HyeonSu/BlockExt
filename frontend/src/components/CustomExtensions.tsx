import React, { useState, ChangeEvent, KeyboardEvent } from 'react';

interface Props {
  extensions: string[];
  onChange: (exts: string[]) => void;
  onRemove?: (ext: string) => void;
  fixedExts?: string[];
  placeholder?: string;
  maxLength?: number;
  maxCount?: number;
  addButtonText?: string;
}

const DEFAULT_MAX_LENGTH = 20;
const DEFAULT_MAX_COUNT = 200;

const isValidExt = (ext: string, maxLength: number) =>
  new RegExp(`^[a-zA-Z0-9.-]{1,${maxLength}}$`).test(ext);

const CustomExtensions: React.FC<Props> = ({
  extensions,
  onChange,
  onRemove,
  fixedExts = [],
  placeholder = "확장자 입력",
  maxLength = DEFAULT_MAX_LENGTH,
  maxCount = DEFAULT_MAX_COUNT,
  addButtonText = "+추가"
}) => {
  const [input, setInput] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // 커스텀 확장자 추가 버튼 클릭/엔터 입력 시
  const handleAdd = () => {
    const ext = input.trim();

    if (!ext) return;

    if (extensions.length >= maxCount) {
      alert(`최대 ${maxCount}개까지만 추가할 수 있습니다.`);
      return;
    }

    if (ext.length > maxLength) {
      alert(`확장자는 최대 ${maxLength}자리까지 가능합니다.`);
      return;
    }

    if (!isValidExt(ext, maxLength)) {
      alert("확장자는 영문/숫자/점(.)/하이픈(-)만 허용됩니다.");
      return;
    }

    if (extensions.includes(ext)) {
      alert("이미 추가된 확장자입니다.");
      return;
    }

    if (fixedExts.includes(ext)) {
      alert("고정 확장자에 이미 포함된 확장자는 커스텀 확장자로 추가할 수 없습니다.");
      return;
    }

    // 유효하면 추가
    onChange([...extensions, ext]);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdd();
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          style={{
            flex: 1,
            padding: '8px',
            fontSize: '15px',
            border: '1px solid #d1d5db',
            borderRadius: '5px',
            outline: 'none',
            color: '#222',
            background: '#fafbfc'
          }}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="button"
          style={{ minWidth: '60px' }}
        >
          {addButtonText}
        </button>
      </div>
      <div
        style={{
          minHeight: '44px',
          border: '1px dashed #d1d5db',
          marginTop: '13px',
          borderRadius: '7px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          alignItems: 'center',
          padding: '8px',
          background: '#fafbfc'
        }}
      >
        {extensions.map(ext => (
          <span
            key={ext}
            style={{
              background: '#e6eaf0',
              borderRadius: '14px',
              padding: '4px 12px',
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#222',
              fontWeight: 'bold',
              boxShadow: '0 0 2px #d1d5db'
            }}
          >
            {ext}
            <button
              type="button"
              onClick={() => onRemove ? onRemove(ext) : onChange(extensions.filter(e => e !== ext))}
              aria-label={`${ext} 삭제`}
              style={{
                background: 'none',
                color: '#888',
                border: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                cursor: 'pointer',
                marginLeft: '0',
                minWidth: '20px'
              }}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div style={{ textAlign: 'right', fontSize: '12px', marginTop: '5px', color: '#222' }}>
        {extensions.length}/{maxCount}
      </div>
    </div>
  );
};

export default CustomExtensions;