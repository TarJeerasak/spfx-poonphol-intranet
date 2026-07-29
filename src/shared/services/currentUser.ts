import { spApi } from './api';

export interface ICurrentUser {
  id: number;
  email: string;
  loginName: string;
}

let currentUserPromise: Promise<ICurrentUser> | undefined;

export function getCurrentUser(): Promise<ICurrentUser> {
  if (!currentUserPromise) {
    currentUserPromise = spApi
      .get<{ Id: number; Email: string; LoginName: string }>('/currentuser', { params: { $select: 'Id,Email,LoginName' } })
      .then(response => ({ id: response.data.Id, email: response.data.Email, loginName: response.data.LoginName }));
  }

  return currentUserPromise;
}
