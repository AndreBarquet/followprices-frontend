import { request } from "../utils/utils";

export async function insertNewSetup({ payload, callback } = {}) {
  return await request({ method: 'post', url: '/setup', data: payload, callback })
};