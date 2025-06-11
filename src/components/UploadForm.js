import React, { useState } from 'react';
import { uploadFile } from '../services/api';
import './UploadForm.css';

const ALLOWED_EXT = ['png','jpg','jpeg','gif','tiff','tif'];

export default function UploadForm({ onHome }) {
  const [file, setFile]           = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [message, setMessage]     = useState('');
  const [error, setError]         = useState('');

  const handleFileChange = e => {
    setMessage(''); setError('');
    const picked = e.target.files[0];
    if (!picked) { setFile(null); return; }

    const ext = picked.name.split('.').pop().toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      setError('Unsupported file type. Only PNG, JPG, JPEG, GIF, TIFF or TIF allowed.');
      setFile(null);
    } else {
      setFile(picked);
    }
  };

  const submit = async e => {
    e.preventDefault();
    if (!file) return;
    setUploading(true); setProgress(0); setMessage(''); setError('');

    try {
      await uploadFile(file, ev => setProgress(Math.round((ev.loaded/ev.total)*100)));
      setMessage(`✔️ ${file.name} uploaded successfully!`);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false); setFile(null);
    }
  };

  return (
    <div className="upload-card">
      <button className="home-button" onClick={onHome}>← Home</button>
      <h2 className="card-title">Upload Your ID Image</h2>

      <form className="upload-form" onSubmit={submit}>
        <label htmlFor="fileInput" className="upload-drop-zone">
          {file ? file.name : 'Click or drag your file here'}
          <input
            id="fileInput"
            type="file"
            accept={ALLOWED_EXT.map(e => `.${e}`).join(',')}
            onChange={handleFileChange}
          />
        </label>

        <button
          type="submit"
          className="upload-btn"
          disabled={!file || uploading}
        >
          {uploading ? `Uploading ${progress}%…` : 'Upload'}
        </button>
      </form>

      {uploading && (
        <div className="progress-bar-outer">
          <div className="progress-bar-inner" style={{ width: `${progress}%` }} />
        </div>
      )}

      {error && <p className="message error">{error}</p>}
      {message && <p className="message success">{message}</p>}
    </div>
);
}
