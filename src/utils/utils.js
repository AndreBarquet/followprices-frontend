import axios from "axios";
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export function request({ method, url, data, onSuccess, onError } = {}) {
  if (notExists(method) || notExists(url)) return;

  return axios({ method, url, data })
    .then(function (response) {
      // handle success
      return response?.data;
    })
    .catch(function (error) {
      // handle error
      return null;
    });
}

export function exists(value) {
  return value !== null && value !== undefined;
}

export function notExists(value) {
  return value === null || value === undefined;
}