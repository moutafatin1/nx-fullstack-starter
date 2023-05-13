import { registerAs } from '@nestjs/config';
import { MyClassProperties, validateEnvVariables } from '@snipstash/api/utils';
import { IsNotEmpty } from 'class-validator';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface ProcessEnv extends JwtConfigType {}
  }
}

export type JwtConfigType = MyClassProperties<JwtConfig>;

class JwtConfig {
  @IsNotEmpty()
  JWT_SECRET: string;
  @IsNotEmpty()
  ACCESS_TOKEN_EXPIRES: string;

  @IsNotEmpty()
  REFRESH_TOKEN_EXPIRES: string;
}

export const jwtConfig = registerAs('jwt', () => {
  validateEnvVariables(process.env, JwtConfig);
  return {
    JWT_SECRET: process.env.JWT_SECRET,
    ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES,
    REFRESH_TOKEN_EXPIRES: new Date(
      Date.now() + parseInt(process.env.REFRESH_TOKEN_EXPIRES) * 30 // 30 days
    ),
  };
});
