export const getUserObj = {
  getUser: {
    username: "ydoerr0",
    name: "Yorgo",
    surname: "Doerr",
    email: "ydoerr0@ibm.com",
    about:
      "Curabitur convallis. Duis consequat dui nec nisi volutpat eleifend.",
    active: true,
  },
};

export const getMeObj = {
  me: {
    username: "admin",
    id: 11122,
    name: "Admin",
    surname: "Adminowicz",
    email: "test@test.com",
    about: "Hi! I am your admin.",
    active: true,
  },
};

export const getAdminObj = {
  username: "admin",
  name: "Admin",
  surname: "Adminowicz",
  email: "test@test.com",
  about: "Hi! I am your admin.",
  active: true,
};

export const loginInputObj = {
  username: "admin",
  password: "testtest2",
};

export const updateUserObj = {
  id: 11123,
  name: "ChangedName",
  surname: "ChangedSurname",
  newEmail: "changed@email.com",
  about: "Changed about description.",
};

export const updatedUserObj = {
  updateUser: {
    id: 11123,
    name: "ChangedName",
    surname: "ChangedSurname",
    active: true,
    email: "changed@email.com",
    about: "Changed about description.",
  },
};

export const signupInputObj = {
  username: "testuser2",
  name: "Testowy",
  surname: "User",
  password: "testtest2",
  retype: "testtest2",
  email: "testowy2@user.com",
  about: "test me babe",
};

export const userUpdInputObj = {
  id: 111,
  name: "correct",
  surname: "very correct",
  newEmail: "new@email.com",
  about: "Yup, an update!",
  active: true,
};
