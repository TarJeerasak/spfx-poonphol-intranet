import axios, { AxiosInstance } from 'axios';
import { SiteURL } from '../config/site';

export const spApi: AxiosInstance = axios.create({
  baseURL: `${SiteURL}/_api/web`,
  withCredentials: true,
  headers: {
    Accept: 'application/json;odata=nometadata',
    'Content-Type': 'application/json;odata=nometadata'
  }
});

interface IContextInfoResponse {
  FormDigestValue?: string;
  d?: { GetContextWebInformation?: { FormDigestValue?: string } };
}

// Required on every SharePoint REST write (POST/MERGE/DELETE) - unlike SPFx's SPHttpClient,
// axios has no built-in digest handling, so callers fetch a fresh one before each write.
export async function fetchRequestDigest(): Promise<string> {
  const response = await spApi.post<IContextInfoResponse>(`${SiteURL}/_api/contextinfo`);
  const digest = response.data.FormDigestValue ?? response.data.d?.GetContextWebInformation?.FormDigestValue;

  if (!digest) {
    throw new Error('Unable to retrieve a SharePoint request digest.');
  }

  return digest;
}
