import { IAuthResponse, ISignInDto } from '@snipstash/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authAxios } from './axios';

const signInFn = (data: ISignInDto) => {
  return authAxios
    .post<IAuthResponse>('/auth/signin', data, { withCredentials: true })
    .then((res) => res.data);
};

export const useSignIn = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: signInFn,
    onSuccess: (data) => {
      queryClient.setQueryData(['logged-user'], data.user);
      localStorage.setItem('nx_accessToken', data.accessToken);
      navigate('/profile');
    },
  });
};
