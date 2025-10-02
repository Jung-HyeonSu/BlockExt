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

const CUSTOM_EXT_MAX_LENGTH = 20;
const CUSTOM_EXT_MAX_COUNT = 200;

function App() {
  const [fixedExts, setFixedExts] = useState<string[]>([]);
  const [fixedBlocked, setFixedBlockedState] = useState<{[name:string]: boolean}>({});
  const [customExts, setCustomExts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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

  const handleFixedChange = async (selected: string[]) => {
    setLoading(true);
    for (const name of fixedExts) {
      const shouldBlock = selected.includes(name);
      if (fixedBlocked[name] !== shouldBlock) {
        await setFixedBlocked(name, shouldBlock);
      }
    }
    fetchFixedExtensions().then((data) => {
      setFixedExts(data.map(item => item.name));
      setFixedBlockedState(
        Object.fromEntries(data.map(item => [item.name, item.blocked]))
      );
    });
    setLoading(false);
  };

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
                  maxLength={CUSTOM_EXT_MAX_LENGTH}
                  maxCount={CUSTOM_EXT_MAX_COUNT}
                  fixedExts={fixedExts}
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