import { request } from "../utils/utils";
import { stringify } from 'qs';

export async function getAllSetups({ payload } = {}) {
  const params = stringify(payload);
  return await request({ method: 'get', url: `/setup/all?${params}` })
};

export async function insertNewSetup({ payload, callback } = {}) {
  return await request({ method: 'post', url: '/setup', data: payload, callback })
};

export async function getDetails({ payload, callback } = {}) {
  return await request({ method: 'get', url: `/setup/details/${payload?.id}`, callback })
};

export async function getDetailsEvolution({ payload, callback } = {}) {
  return await request({ method: 'get', url: `/setup/details/evolution/${payload?.id}`, callback })
};

