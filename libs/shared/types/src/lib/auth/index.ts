export interface ISignInDto {
  email: string;
  password: string;
}

export interface ISignUpDto {
  email: string;
  password: string;
}

export interface IAuthResponse {
  user: CurrentActiveUser;
  accessToken: string;
}

export type CurrentActiveUser = {
  id: string;
  email: string;
};
