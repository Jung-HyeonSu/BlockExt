import React, { useState, useEffect } from 'react';
import './App.css';
import FixedExtensions from './components/FixedExtensions';
import CustomExtensions from './components/CustomExtensions';
import {
  fetchFixedExtensions,
  fetchCustomExtensions,
  setFixedBlocked,
  addCustomExtension,
  deleteCustomExtension,
  deleteAllCustomExtensions
} from './api/extensionApi';

const CUSTOM_EXT_MAX_LENGTH = 20;
const CUSTOM_EXT_MAX_COUNT = 200;

function App() {
  const [fixedExts, setFixedExts] = useState<string[]>([]);
  const [fixedBlocked, setFixedBlockedState] = useState<{ [name: string]: boolean }>({});
  const [customExts, setCustomExts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string>('');

  // 차단된 확장자 목록 (고정 + 커스텀)
  const blockedExtensions = [
    ...fixedExts.filter(name => fixedBlocked[name]),
    ...customExts
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fixedData = await fetchFixedExtensions();
        setFixedExts(fixedData.map(item => item.name));
        setFixedBlockedState(Object.fromEntries(fixedData.map(item => [item.name, item.blocked])));

        const customData = await fetchCustomExtensions();
        setCustomExts(customData.map(item => item.name));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 고정 확장자 변경
  const handleFixedChange = async (selected: string[]) => {
    setLoading(true);
    try {
      for (const name of fixedExts) {
        const shouldBlock = selected.includes(name);
        if (fixedBlocked[name] !== shouldBlock) {
          await setFixedBlocked(name, shouldBlock);
        }
      }
      const updated = await fetchFixedExtensions();
      setFixedExts(updated.map(item => item.name));
      setFixedBlockedState(Object.fromEntries(updated.map(item => [item.name, item.blocked])));
    } finally {
      setLoading(false);
    }
  };

  // 커스텀 확장자 추가
  const handleAddCustom = async (newExts: string[]) => {
    setLoading(true);
    try {
      const toAdd = newExts.filter(ext => !customExts.includes(ext));
      for (const ext of toAdd) {
        await addCustomExtension(ext);
      }
      const updated = await fetchCustomExtensions();
      setCustomExts(updated.map(item => item.name));
    } finally {
      setLoading(false);
    }
  };

  // 커스텀 확장자 삭제
  const handleRemoveCustom = async (toRemove: string) => {
    setLoading(true);
    try {
      await deleteCustomExtension(toRemove);
      const updated = await fetchCustomExtensions();
      setCustomExts(updated.map(item => item.name));
    } finally {
      setLoading(false);
    }
  };

  // 커스텀 확장자 전체 삭제
  const handleRemoveAllCustom = async () => {
    setLoading(true);
    try {
      await deleteAllCustomExtensions();
      setCustomExts([]);
    } finally {
      setLoading(false);
    }
  };

  // 파일 첨부 테스트
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase() || '';

    if (blockedExtensions.includes(ext)) {
      setUploadMsg(`'${ext}' 확장자는 첨부할 수 없습니다.`);
      alert(`'${ext}' 확장자는 첨부할 수 없습니다.`);
      event.target.value = ''; // 첨부 취소
      return;
    }
    setUploadMsg(`파일 "${file.name}" 첨부 성공! (확장자: ${ext})`);
  };

  return (
    <div>
      {/* 로딩 오버레이 */}
      {loading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="main-panel">
        <div className="title">파일 확장자 차단</div>
        <div className="desc">
          파일확장자에 따라 특정 형식의 파일을 첨부하거나 전송하지 못하도록 제한
        </div>
        <table className="setting-table">
          <tbody>
            <tr>
              <th>고정 확장자</th>
              <td>
                <FixedExtensions
                  selected={fixedExts.filter(name => fixedBlocked[name])}
                  onChange={handleFixedChange}
                  options={fixedExts}
                />
              </td>
            </tr>
            <tr>
              <th>커스텀 확장자</th>
              <td>
                <CustomExtensions
                  extensions={customExts}
                  onChange={handleAddCustom}
                  onRemove={handleRemoveCustom}
                  onRemoveAll={handleRemoveAllCustom}
                  maxLength={CUSTOM_EXT_MAX_LENGTH}
                  maxCount={CUSTOM_EXT_MAX_COUNT}
                  fixedExts={fixedExts}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ marginTop: '42px', padding: '20px 0 0 0', borderTop: '1px solid #ececec' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px', color: '#222' }}>
            파일 첨부 테스트
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            disabled={loading} // 로딩 중 비활성화
            style={{
              border: '1px solid #d1d5db',
              borderRadius: '5px',
              padding: '6px',
              fontSize: '15px',
              background: '#fafbfc',
              marginBottom: '12px'
            }}
          />
          <div style={{ fontSize: '15px', color: '#2977f5', marginTop: '3px' }}>
            {uploadMsg}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
