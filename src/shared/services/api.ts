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
