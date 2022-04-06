import { request } from "../utils/utils";
import { stringify } from 'qs';

export async function getAllTypes({ payload } = {}) {
  const params = stringify(payload);
  return await request({ method: 'get', url: `/type/all?${params}` })
};

export async function insertType({ payload, callback } = {}) {
  return await request({ method: 'post', url: '/type', data: payload, callback })
}

export async function updateType({ payload, callback } = {}) {
  return await request({ method: 'put', url: `/type/${payload?.id}`, data: payload, callback })
}

export async function deleteType({ payload, callback } = {}) {
  return await request({ method: 'delete', url: `/type/${payload}`, callback })
};

export async function getShort({ payload, callback } = {}) {
  const params = stringify(payload);
  return await request({ method: 'get', url: `/type/short?${params}` })
};