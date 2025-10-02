import React, { useState } from 'react';
import './App.css';
import FixedExtensions from './components/FixedExtensions';
import CustomExtensions from './components/CustomExtensions';
import { saveExtensions } from './api/extensionApi';

const DEFAULT_FIXED_EXTENSIONS = [
  'bat', 'cmd', 'com', 'cpl', 'exe', 'scr', 'js'
];

const DEFAULT_CUSTOM_EXTENSIONS: string[] = [];

function App() {
  const [fixedExts, setFixedExts] = useState<string[]>([]);
  const [customExts, setCustomExts] = useState<string[]>(DEFAULT_CUSTOM_EXTENSIONS);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    await saveExtensions(fixedExts, customExts);
    setLoading(false);
    alert('저장되었습니다.');
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
                  selected={fixedExts}
                  onChange={setFixedExts}
                  options={DEFAULT_FIXED_EXTENSIONS}
                />
              </td>
            </tr>
            <tr>
              <th>커스텀 확장자</th>
              <td>
                <CustomExtensions extensions={customExts} onChange={setCustomExts} />
              </td>
            </tr>
          </tbody>
        </table>
        <div className="btns">
          <button className="button" onClick={handleSave} disabled={loading}>
            저장
          </button>
          <button className="button cancel" onClick={() => window.location.reload()}>
            취소
          </button>
        </div>
        <div className="footer">
        </div>
      </div>
    </div>
  );
}

export default App;