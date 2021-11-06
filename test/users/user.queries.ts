export const GET_USER = `
query GET_USER($id: Int!) {
  getUser(id:$id) {
    username
    name
    surname
    email
    password
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
