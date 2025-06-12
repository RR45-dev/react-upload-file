// src/components/PreviewModal.js
import React, { useState, useEffect } from 'react';
import { parseImage } from '../services/api.js';
import './PreviewModal.css';

export default function PreviewModal({ url, onClose }) {
  const [subscriberId, setSubscriberId] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  // Reset state each time a new URL is shown
  useEffect(() => {
    setSubscriberId(null);
    setError('');
    setLoading(false);
  }, [url]);

  if (!url) return null;

  // Choose the correct preview element based on extension
  const ext = url.split('.').pop().toLowerCase();
  let media;
  if (['png', 'jpg', 'jpeg', 'gif'].includes(ext)) {
    media = <img src={url} alt="preview" className="preview-media" />;
  } else if (['tiff', 'tif'].includes(ext)) {
    media = (
      <object data={url} type="image/tiff" className="preview-media">
        <p>Your browser can’t display TIFF. <a href={url}>Download</a></p>
      </object>
    );
  } else {
    media = <img src={url} alt="preview" className="preview-media" />;
  }

  // When clicked, fetch the blob and send it to the API
  const fetchId = async () => {
    setLoading(true);
    setError('');
    setSubscriberId(null);

    try {
      // Download the blob from the static site
      const resp = await fetch(url);
      const blob = await resp.blob();

      // Wrap it in a File object so parseImage can send it
      const file = new File([blob], `preview.${ext}`, { type: blob.type });

      // Use your axios helper to POST to Azure
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
