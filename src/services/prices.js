import { request } from "../utils/utils";
import { stringify } from 'qs';

export async function getPrices({ payload, callback } = {}) {
  const params = stringify(payload);
  return await request({ method: 'get', url: `/prices/?${params}`, callback })
};

export async function insertPrice({ payload, callback }) {
  return await request({ method: 'post', url: '/prices', data: payload, callback })
};