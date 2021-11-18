export const GET_WISHLIST = `
  query GET_WISHLIST($userId: Int!) {
    getWishlist(userId: $userId) {
      id
      name
      category
      state
      images {
        url
        alt
      }
    }
  }
`;

export const GET_WISHERS = `
  query GET_WISHERS($itemId: Int) {
    getWishers(itemId: $itemId) {
      id
      username
    }
  }
`;

export const ADD_ITEM_TO_WISHLIST = `
  mutation ADD_ITEM_TO_WISHLIST($itemId: Int!) {
    addToWishlist(itemId: $itemId)
  }
`;
