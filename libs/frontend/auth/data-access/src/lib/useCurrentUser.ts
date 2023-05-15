import { CurrentActiveUser } from '@snipstash/types';
import { useQuery } from '@tanstack/react-query';
import { authAxios } from './axios';

const currentUserFn = () =>
  authAxios.get<CurrentActiveUser>('/auth/me').then((res) => res.data);

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['logged-user'],
    queryFn: currentUserFn,
    retry: 1,
  });
};
