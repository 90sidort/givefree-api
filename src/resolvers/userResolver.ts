import {
  getUserQuery,
  meQuery,
  requestResetMutation,
  resetPasswordMutation,
  signinUserMutation,
  signoutMutation,
  signupUserMutation,
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
    signout: signoutMutation,
    signupUser: signupUserMutation,
  },
};
