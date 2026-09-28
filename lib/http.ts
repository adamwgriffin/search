import axios from "axios";
import { buildUrl } from "./listingSearchParams";

export async function http<T = unknown>(
  path: string,
  searchParams?: object,
  options: RequestInit = {}
) {
  const urlWithParams = buildUrl(path, searchParams);
  const res = await fetch(urlWithParams, options);
  if (!res.ok) {
    throw new Error(await res.text());
  }
  const data: T = await res.json();
  return data;
}

// TODO: Remove in favor of using fetch
const axiosInstance = axios.create();

export default axiosInstance;
