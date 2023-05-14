import { UserType } from '@snipstash/types';
import { useQuery } from '@tanstack/react-query';
import { authAxios } from '../axios';

const currentUserFn = () =>
  authAxios.get<UserType>('/auth/me').then((res) => res.data);

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['logged-user'],
    queryFn: currentUserFn,
    retry: 1,
  });
};
