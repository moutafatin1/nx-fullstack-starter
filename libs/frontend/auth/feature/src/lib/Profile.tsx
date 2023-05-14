import {
  useCurrentUser,
  useSignOut,
} from '@snipstash/frontend/auth/data-access';
import { Button } from '@snipstash/shared/ui';
import { Navigate, Outlet } from 'react-router-dom';

export const ProfilePage = () => {
  const user = useCurrentUser();
  const signOutMutation = useSignOut();
  return (
    <div>
      Hello , {user.data?.id} -{' '}
      <Button
        variant="destructive"
        onClick={() => {
          signOutMutation.mutate();
        }}
      >
        Sign Out
      </Button>
    </div>
  );
};

export const Protected = () => {
  const user = useCurrentUser();
  if (user.isLoading) return <p>Loading...</p>;
  if (!user.data) return <Navigate to="/signin/" replace />;

  return <Outlet />;
};
