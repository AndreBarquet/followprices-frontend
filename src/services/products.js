import { request } from "../utils/utils";
import { stringify } from 'qs';

export async function getAllProducts({ payload } = {}) {
  const params = stringify(payload);
  return await request({ method: 'get', url: `/product/all?${params}` })
};

export async function deleteProduct({ payload, callback } = {}) {
  return await request({ method: 'delete', url: `/product/${payload}` })
};