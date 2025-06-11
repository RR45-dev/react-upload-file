import React, { useState, useEffect } from 'react';
import './PreviewModal.css';

export default function PreviewModal({ url, onClose }) {
  const [subscriberId, setSubscriberId] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  useEffect(() => {
    setSubscriberId(null);
    setError('');
    setLoading(false);
  }, [url]);

  if (!url) return null;

  const ext = url.split('.').pop().toLowerCase();
  let media;
  if (['png','jpg','jpeg','gif'].includes(ext)) {
    media = <img src={url} className="preview-media" />;
  } else if (['tiff','tif'].includes(ext)) {
    media = (
      <object data={url} type="image/tiff" className="preview-media">
        <p>Browser can’t display TIFF. <a href={url}>Download</a></p>
      </object>
    );
  } else {
    media = <img src={url} className="preview-media" />;
  }

  const fetchId = async () => {
    setLoading(true);
    setError('');
    setSubscriberId(null);
    try {
      const resp = await fetch(url);
      const blob = await resp.blob();
      const file = new File([blob], `preview.${ext}`, { type: blob.type });
      const fd   = new FormData();
      fd.append('image', file);
      const data = await fetch('/api/idcard/parse', {
        method: 'POST',
        body: fd
      }).then(r => r.json());
      setSubscriberId(data.subscriberId);
    } catch {
      setError('Failed to fetch ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="preview-wrapper" onClick={e => e.stopPropagation()}>
        <div className="preview-container">{media}</div>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="fetch-id-section">
          <button className="fetch-btn" onClick={fetchId} disabled={loading}>
            {loading ? 'Fetching…' : 'Fetch ID'}
          </button>
          {subscriberId && <p className="id-text">Subscriber ID: {subscriberId}</p>}
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
);
}
