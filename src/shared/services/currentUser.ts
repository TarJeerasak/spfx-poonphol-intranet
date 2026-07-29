import { spApi } from './api';

export interface ICurrentUser {
  email: string;
  loginName: string;
}

let currentUserPromise: Promise<ICurrentUser> | undefined;

export function getCurrentUser(): Promise<ICurrentUser> {
  if (!currentUserPromise) {
    currentUserPromise = spApi
      .get<{ Email: string; LoginName: string }>('/currentuser', { params: { $select: 'Email,LoginName' } })
      .then(response => ({ email: response.data.Email, loginName: response.data.LoginName }));
  }

  return currentUserPromise;
}
