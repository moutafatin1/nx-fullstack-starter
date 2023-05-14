export interface SignInDtoType {
  email: string;
  password: string;
}

export interface AuthResponseType {
  user: UserType;
  accessToken: string;
}

export interface UserType {
  id: string;
}
