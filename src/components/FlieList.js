import React from 'react';
import './FileList.css';

export default function FileList({
  files,
  page,
  totalPages,
  onPageChange,
  onPreview
}) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="file-list-container">
      <table className="file-table">
        <thead>
          <tr>
            <th>File Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => {
            const { name, url, contentType } = file;
            return (
              <tr key={url}>
                <td>{decodeURIComponent(name)}</td>
                <td>
                  <div className="action-buttons">
                    <a className="btn download-btn" href={url} download>
                      Download
                    </a>
                    <button
                      className="btn preview-btn"
                      onClick={() => onPreview({ url, contentType })}
                    >
                      Preview ▶
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Prev
        </button>
        {pageNumbers.map(num => (
          <button
            key={num}
            className={num === page ? 'active' : ''}
            onClick={() => onPageChange(num)}
          >
            {num}
          </button>
        ))}
        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
