import { zodResolver } from '@hookform/resolvers/zod';
import { useSignUp } from '@snipstash/frontend/auth/data-access';
import { Button, InputField } from '@snipstash/shared/ui';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type SignInFormData = z.infer<typeof signInSchema>;

export const SignUpPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });
  const signInMutation = useSignUp();
  const signIn = handleSubmit((data) => {
    signInMutation.mutate(data);
  });
  return (
    <main className="flex h-screen  items-center justify-center bg-slate-100 px-4">
      <div className="mb-32 rounded-lg bg-white px-10">
        <h1 className="text-foreground mt-12 text-center text-5xl font-bold">
          Create an account
        </h1>
        <form
          onSubmit={signIn}
          className="mx-auto mt-16 flex max-w-xs flex-col gap-2"
        >
          <InputField
            className="rounded-full"
            placeholder="Email"
            type="email"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
          <InputField
            className="rounded-full"
            placeholder="Password"
            type="password"
            {...register('password')}
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
          <Button className="mt-4 rounded-full">Sign Up</Button>
          <p className="mt-12 mb-4 text-center text-gray-500">
            Already have an account?{' '}
            <Link
              to="/signin"
              className="font-medium transition-colors hover:text-blue-500"
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
};
