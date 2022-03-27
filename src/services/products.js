import { request } from "../utils/utils";

export async function getAllProducts() {
  return await request({ method: 'get', url: '/product/all' })
};