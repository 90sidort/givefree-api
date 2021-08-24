export interface SignIn {
  username: string;
  password: string;
}

export interface SignUp {
  username: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  retype: string;
  about?: string;
  active: boolean;
}
