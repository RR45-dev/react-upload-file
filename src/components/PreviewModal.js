// src/components/PreviewModal.js
import React, { useState, useEffect } from 'react';
import { parseImage } from '../services/api';
import './PreviewModal.css';

export default function PreviewModal({ url, onClose }) {
  const [subscriberId, setSubscriberId] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  // Reset state whenever a new URL is opened
  useEffect(() => {
    setSubscriberId(null);
    setError('');
    setLoading(false);
  }, [url]);

  if (!url) return null;

  // Determine how to render the preview
  const ext = url.split('.').pop().toLowerCase();
  let media;
  if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) {
    media = <img src={url} className="preview-media" alt="preview" />;
  } else if (['tiff', 'tif'].includes(ext)) {
    media = (
      <object data={url} type="image/tiff" className="preview-media">
        <p>Your browser can’t display TIFF. <a href={url}>Download</a></p>
      </object>
    );
  } else {
    media = <img src={url} className="preview-media" alt="preview" />;
  }

  // When user clicks “Fetch ID”, download the blob and hand it off to parseImage()
  const fetchId = async () => {
    setLoading(true);
    setError('');
    setSubscriberId(null);

    try {
      // Download the blob
      const resp = await fetch(url);
      const blob = await resp.blob();
      // Wrap it in a File so parseImage can send it as form-data
      const file = new File([blob], `preview.${ext}`, { type: blob.type });

      // Use axios helper which points at the correct API_BASE
      const result = await parseImage(file);
      setSubscriberId(result.data.subscriberId);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch Subscriber ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="preview-wrapper" onClick={e => e.stopPropagation()}>
        <div className="preview-container">
          {media}
        </div>

        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <div className="fetch-id-section">
          <button
            className="fetch-btn"
            onClick={fetchId}
            disabled={loading}
          >
            {loading ? 'Fetching…' : 'Fetch ID'}
          </button>

          {subscriberId && (
            <p className="id-text">
              Subscriber ID: {subscriberId}
            </p>
          )}

          {error && (
            <p className="error-text">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
