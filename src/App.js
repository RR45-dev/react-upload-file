// src/App.js
import React, { useState, useEffect } from 'react';
import UploadForm   from './components/UploadForm';
import FileList     from './components/FlieList';
import PreviewModal from './components/PreviewModal';
import { listFiles } from './services/api';

import './App.css';

// Full URL with query params for warming up the API
const WARMUP_URL =
  'https://file-upload-app-cedtcedbfqfxgkg0.canadaeast-01.azurewebsites.net/api/files/viewall?page=1&pageSize=10';

function App() {
  // State to track API warm-up completion
  const [isReady, setIsReady]         = useState(false);
  const [tab, setTab]                 = useState('landing');   // 'landing' | 'upload' | 'viewall'
  const [files, setFiles]             = useState([]);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [previewData, setPreviewData] = useState(null);

  const pageSize = 10;

  // 1) Warm-up effect: ping the endpoint 5× before showing UI
  useEffect(() => {
    async function warmUpApi(calls = 5) {
      for (let i = 0; i < calls; i++) {
        try {
          await fetch(WARMUP_URL, { method: 'GET', mode: 'cors' });
          console.log(`Warm-up #${i + 1} succeeded`);
        } catch (err) {
          console.warn(`Warm-up #${i + 1} failed:`, err);
        }
      }
      setIsReady(true);
    }
    warmUpApi();
  }, []);

  // 2) Fetch files when viewing the 'viewall' tab
  useEffect(() => {
    if (tab !== 'viewall') return;
    listFiles(page, pageSize)
      .then(res => {
        setFiles(res.data.items);
        setTotalPages(Math.ceil(res.data.totalCount / res.data.pageSize));
      })
      .catch(err => console.error('Error fetching files:', err));
  }, [tab, page]);

  // Don’t render the UI until warm-up is done
  if (!isReady) {
    return <div className="loading">Warming up, please wait…</div>;
  }

  return (
    <div className="wrapper">
      <div className="content">
        {tab === 'landing' && (
          <div className="content-box">
            <h1>Welcome to File App</h1>
            <p>Select an action:</p>
            <div className="button-group">
              <button onClick={() => setTab('upload')}>Upload</button>
              <button onClick={() => { setPage(1); setTab('viewall'); }}>
                View All
              </button>
            </div>
          </div>
        )}

        {tab === 'upload' && (
          <div className="content-box">
            <UploadForm onHome={() => setTab('landing')} />
          </div>
        )}

        {tab === 'viewall' && (
          <div className="content-box viewall-box">
            <button
              className="back-button"
              onClick={() => setTab('landing')}
            >
              ← Home
            </button>
            <FileList
              files={files}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onPreview={setPreviewData}
            />
          </div>
        )}
      </div>

      <PreviewModal
        url={previewData?.url}
        contentType={previewData?.contentType}
        onClose={() => setPreviewData(null)}
      />
    </div>
  );
}

export default App;
