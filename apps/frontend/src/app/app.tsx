// eslint-disable-next-line @typescript-eslint/no-unused-vars

import {
  ProfilePage,
  Protected,
  SignInPage,
  SignUpPage,
} from '@snipstash/frontend/auth/feature';
import { Route, Routes } from 'react-router-dom';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<div>Home</div>} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/profile" element={<Protected />}>
        <Route index element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
