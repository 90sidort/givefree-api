export const ADD_ITEM = `
mutation ADD_ITEM($item: ItemInput!, $file: FileUpload) {
  addItem(item: $item, file: $file) {
    name
    id
    description
    category
    images {
      url
      alt
    }
  }
}
`;

export const UPDATE_ITEM = `
mutation UPDATE_ITEM($id: Int!, $item: ItemInputUpdate!) {
  updateItem(id: $id, item: $item) {
    name
    id
  }
}
`;

export const DELETE_ITEM = `
  mutation DELETE_ITEM($id: Int!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

export const COUNT_ITEMS = `
query COUNT_ITEMS($input: ItemCountInput!) {
  countItems(input: $input)
}
`;

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
