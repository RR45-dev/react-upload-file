import React, { useState, useEffect } from 'react';
import UploadForm   from './components/UploadForm';
import FileList     from './components/FlieList';
import PreviewModal from './components/PreviewModal';


import './App.css';

function App() {
  const [tab, setTab]               = useState('landing');   // 'landing' | 'upload' | 'viewall'
  const [files, setFiles]           = useState([]);
  const [page, setPage]             = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [previewData, setPreviewData] = useState(null);

  const pageSize = 10;

  useEffect(() => {
    if (tab === 'viewall') {
      listFiles(page, pageSize)
        .then(res => {
          setFiles(res.data.items);
          setTotalPages(Math.ceil(res.data.totalCount / res.data.pageSize));
        })
        .catch(err => console.error('Error fetching files:', err));
    }
  }, [tab, page]);

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
