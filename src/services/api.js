import axios from 'axios';

// Use the public App Service hostname (no .canadaeast-01 or /scm)
const API_BASE = 'https://file-upload-app-cedtcedbfqfxgkg0.azurewebsites.net';

export const uploadFile = (file, onUploadProgress) => {
  const fd = new FormData();
  fd.append('file', file);
  return axios.post(
    `${API_BASE}/api/files/upload`,
    fd,
    { onUploadProgress }
  );
};

export const listFiles = (page = 1, pageSize = 10) =>
  axios.get(`${API_BASE}/api/files/viewall`, {
    params: { page, pageSize }
  });

export const parseImage = (file, onUploadProgress) => {
  const fd = new FormData();
  fd.append('image', file);
  return axios.post(
    `${API_BASE}/api/idcard/parse`,
    fd,
    { onUploadProgress }
  );
};
