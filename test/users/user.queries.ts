export const GET_ITEMS = `
query GET_USER($id: Int!) {
  getUser(id:$id) {
    username
  }
}
`;
