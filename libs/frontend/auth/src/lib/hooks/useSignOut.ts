import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authAxios } from '../axios';

const signOutFn = () => authAxios.delete('/auth/signout');

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: signOutFn,
    onSuccess: () => {
      queryClient.setQueryData(['logged-user'], null);
      localStorage.removeItem('nx_accessToken');
      navigate('/signin');
    },
  });
};
