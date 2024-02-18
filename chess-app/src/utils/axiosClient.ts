import axios, { AxiosRequestConfig } from "axios";

export const baseURL = process.env.REACT_APP_BASEURL ?? "http://localhost:3000";

const client = axios.create({ baseURL: baseURL });

export function request<T>(options: AxiosRequestConfig) {
  const result = client.request<T>(options);
  return result;
}
