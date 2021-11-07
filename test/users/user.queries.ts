export const GET_USER = `
query GET_USER($id: Int!) {
  getUser(id:$id) {
    username
    name
    surname
    email
    about
    active
  }
}
`;

export const ME_QUERY = `
query ME {
  me {
    username
    id
    name
    surname
    email
    about
    active
  }
}
`;

export const SIGNIN = `
mutation SIGNIN($password: String!, $username: String!) {
  signinUser(password:$password, username: $username)
}
`;

export const REQUEST_RESET = `
mutation RESET_REQUEST($email: String!) {
  requestReset(email: $email)
}
`;
