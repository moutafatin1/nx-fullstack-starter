import { zodResolver } from '@hookform/resolvers/zod';
import { Button, InputField } from '@snipstash/shared/ui';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSignIn } from '../hooks/useSignIn';

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type SignInFormData = z.infer<typeof signInSchema>;

export const SignInPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });
  const signInMutation = useSignIn();
  const signIn = handleSubmit((data) => {
    signInMutation.mutate(data);
  });
  return (
    <main>
      <h1 className="mt-16 text-center text-5xl font-bold text-violet-500">
        Sign In Page
      </h1>
      <form
        onSubmit={signIn}
        className="mx-auto mt-16 flex max-w-md flex-col gap-2"
      >
        <InputField placeholder="Email" type="email" {...register('email')} />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
        <InputField
          placeholder="Password"
          type="password"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
        <Button>Sign In</Button>
      </form>
    </main>
  );
};
