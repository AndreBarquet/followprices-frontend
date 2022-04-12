import { request } from "../utils/utils";
import { stringify } from 'qs';

export async function getAllProducts({ payload } = {}) {
  const params = stringify(payload);
  return await request({ method: 'get', url: `/product/all?${params}` })
};

export async function insertProduct({ payload, callback } = {}) {
  return await request({ method: 'post', url: '/product', data: payload, callback })
};

export async function updateProduct({ payload, callback } = {}) {
  return await request({ method: 'put', url: `/product/${payload?.id}`, data: payload, callback })
}

export async function deleteProduct({ payload, callback } = {}) {
  return await request({ method: 'delete', url: `/product/${payload}`, callback })
};

export async function getProductsShort({ payload, callback } = {}) {
  const params = stringify(payload);
  return await request({ method: 'get', url: `/product/short?${params}`, callback })
}

export async function getProductsGroupedByType({ payload, callback } = {}) {
  return await request({ method: 'get', url: `/product/grouped`, callback })
}