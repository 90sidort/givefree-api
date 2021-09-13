import {
  addToWishlistMutation,
  getWishersQuery,
  getWishlistQuery,
  giveItemMutation,
  removeFromWishlistMutation,
} from "../defResolver/wishlist.defResolver";

export const wishlistResolvers = {
  Query: {
    getWishlist: getWishlistQuery,
    getWishers: getWishersQuery,
  },
  Mutation: {
    addToWishlist: addToWishlistMutation,
    removeFromWishlist: removeFromWishlistMutation,
    giveItem: giveItemMutation,
  },
};
