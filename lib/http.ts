import axios from "axios";
import { objectToQueryString } from "./listingSearchParams";
import isEmpty from "lodash/isEmpty";
import { sleep } from "@/lib";

export async function http<T = unknown>(
  url: string,
  searchParams?: object,
  options: RequestInit = {}
) {
  const urlWithParams = isEmpty(searchParams)
    ? url
    : `${url}?${objectToQueryString(searchParams)}`;
  // Slow things down a little in dev so we get a better idea of how the app
  // will deal with request latency
  // if (process.env.NODE_ENV === 'development') {
  //   await sleep(250)
  // }
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
