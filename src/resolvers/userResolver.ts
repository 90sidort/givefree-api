import {
  getUserQuery,
  meQuery,
  requestResetMutation,
  resetPasswordMutation,
  signinUserMutation,
  signoutMutation,
  signupUserMutation,
  updateUserMutation,
} from "../defResolver/user.defResolver";

export const userResolvers = {
  Query: {
    me: meQuery,
    getUser: getUserQuery,
  },
  Mutation: {
    requestReset: requestResetMutation,
    resetPassword: resetPasswordMutation,
    signinUser: signinUserMutation,
    updateUser: updateUserMutation,
    signout: signoutMutation,
    signupUser: signupUserMutation,
  },
};
