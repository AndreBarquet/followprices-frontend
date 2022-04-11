import { request } from "../utils/utils";

export async function login({ payload, callback } = {}) {
  return await request({ method: 'post', url: '/login', data: payload, callback })
};