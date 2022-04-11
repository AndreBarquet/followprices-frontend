import axios from "axios";
import { format } from "date-fns";

axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export function request({ method, url, data, callback } = {}) {
  if (notExists(method) || notExists(url)) return;

  return axios({ method, url, data })
    .then(function (response) {
      // handle success
      if (exists(callback)) callback(response?.data);
      return response?.data;
    })
    .catch(function (response) {
      // handle error
      const error = response?.error ?? "Ocorreu um erro";
      if (exists(callback)) callback({ error });
      return null;
    });
}

export function exists(value) {
  return value !== null && value !== undefined;
}

export function notExists(value) {
  return value === null || value === undefined;
}

export function isEmptyString(value) {
  if (typeof value !== "string") return false;
  if (value.trim() === "") return true;
  return false;
}

export function safeNull(value) {
  if (notExists(value)) return "-";
  return value;
}

export function requiredFieldError(value) {
  return notExists(value) || isEmptyString(value);
}

export function formatDate(value) {
  if (notExists(value)) return;
  return format(value, 'dd/MM/yyyy');
}

export function formatDateToRequest(value) {
  if (notExists(value)) return;
  return format(value, 'yyyy-MM-dd')
}