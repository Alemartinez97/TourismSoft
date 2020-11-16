import axios from 'axios';

const instance = axios.create({});
const baseUrl = 'http://localhost:3003';

export const get = url => {
  return instance.get(`${baseUrl}${url}`);
};
export const post = (url, body) => {
  return instance.post(`${baseUrl}${url}`, body);
};
export const _delete = url => {
  return instance.delete(`${baseUrl}${url}`);
};
export const put = (url,body) => {
  return instance.put(`${baseUrl}${url}`, body);
};
export const multipart = (url, method, body, files) => {
  const bodyFormData = Object.keys(body).reduce((acc, key) => {
    acc.set(key, body[key]);
    return acc;
  }, new FormData());
  if (files) {
    Array.from(files).forEach((f) => {
      if (f.file) {
        bodyFormData.append(f.name, f.file);
      }
    });  
  }
  return axios({
    method,
    url: `${baseUrl}${url}`,
    data: bodyFormData,
    config: { headers: { "Content-Type": "multipart/form-data" } }
  });
};
export default {
  get,
  post,
  put,
  _delete,
  multipart,
}