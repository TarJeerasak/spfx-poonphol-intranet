import { spApi } from './api';

export interface ICurrentUser {
  id: number;
  email: string;
  loginName: string;
  displayName: string;
}

let currentUserPromise: Promise<ICurrentUser> | undefined;

export function getCurrentUser(): Promise<ICurrentUser> {
  if (!currentUserPromise) {
    currentUserPromise = spApi
      .get<{ Id: number; Email: string; LoginName: string; Title: string }>('/currentuser', {
        params: { $select: 'Id,Email,LoginName,Title' }
      })
      .then(response => ({
        id: response.data.Id,
        email: response.data.Email,
        loginName: response.data.LoginName,
        displayName: response.data.Title
      }));
  }

  return currentUserPromise;
}
