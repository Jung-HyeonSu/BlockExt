import React, { useState, useEffect } from 'react';
import './App.css';
import FixedExtensions from './components/FixedExtensions';
import CustomExtensions from './components/CustomExtensions';
import {
  fetchFixedExtensions,
  fetchCustomExtensions,
  setFixedBlocked,
  addCustomExtension,
  deleteCustomExtension
} from './api/extensionApi';

function App() {
  const [fixedExts, setFixedExts] = useState<string[]>([]);
  const [fixedBlocked, setFixedBlockedState] = useState<{[name:string]: boolean}>({});
  const [customExts, setCustomExts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 최초 렌더링 시 DB에서 목록 불러오기
  useEffect(() => {
    fetchFixedExtensions().then((data) => {
      setFixedExts(data.map(item => item.name));
      setFixedBlockedState(
        Object.fromEntries(data.map(item => [item.name, item.blocked]))
      );
    });
    fetchCustomExtensions().then((data) => {
      setCustomExts(data.map(item => item.name));
    });
  }, []);

  // 고정 확장자 상태 변경 시 서버에 반영
  const handleFixedChange = async (selected: string[]) => {
    setLoading(true);

    // 체크된 확장자 -> blocked = true, 체크 해제된 확장자 -> blocked = false
    for (const name of fixedExts) {
      const shouldBlock = selected.includes(name);
      if (fixedBlocked[name] !== shouldBlock) {
        await setFixedBlocked(name, shouldBlock);
      }
    }

    // 최신 blocked 상태 다시 불러오기
    fetchFixedExtensions().then((data) => {
      setFixedExts(data.map(item => item.name));
      setFixedBlockedState(
        Object.fromEntries(data.map(item => [item.name, item.blocked]))
      );
    });
    setLoading(false);
  };

  // 커스텀 확장자 추가
  const handleAddCustom = async (newExts: string[]) => {
    setLoading(true);
    const toAdd = newExts.filter(ext => !customExts.includes(ext));
    for (const ext of toAdd) {
      await addCustomExtension(ext);
    }
    fetchCustomExtensions().then((data) => {
      setCustomExts(data.map(item => item.name));
    });
    setLoading(false);
  };

  // 커스텀 확장자 삭제
  const handleRemoveCustom = async (toRemove: string) => {
    setLoading(true);
    await deleteCustomExtension(toRemove);
    fetchCustomExtensions().then((data) => {
      setCustomExts(data.map(item => item.name));
    });
    setLoading(false);
  };

  return (
    <div>
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
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;