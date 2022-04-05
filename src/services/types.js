import { request } from "../utils/utils";

import { stringify } from 'qs';

export async function getAllTypes(payload) {
  const params = stringify(payload);
  return await request({ method: 'get', url: `/type/all?${params}` })
};

export async function deleteType(payload) {
  return await request({ method: 'delete', url: `/type/${payload}` })
};