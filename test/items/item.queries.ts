export const GET_ITEM = `
query GET_ITEM($id: Int!) {
  getItem(id: $id) {
    name
    id
    state
    status
    category
    description
    images {
      url
      alt
    }
    giver {
      username
      id
      email
    }
    wishers {
      id
    }
    taker {
      id
      username
    }
  }
}
`;

export const GET_ITEMS_SEARCH = `
query GET_ITEMS($input: ItemSearchInput!) {
  items: getItems(input: $input) {
    name
    id
    state
    status
    category
    description
    images {
      url
      alt
    }
    giver {
      name
      id
    }
  }
}
`;
