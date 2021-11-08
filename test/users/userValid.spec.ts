import {
  validateUserCreate,
  validateResetPassword,
  validateUserUpdate,
} from "../../src/validation/userValidation";
import { signupInputObj, userUpdInputObj } from "./user.variables";

describe("User tests validation", () => {
  it("Should not be able to signup if too shoort username", () => {
    try {
      validateUserCreate({
        ...signupInputObj,
        username: "aaa",
        active: true,
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe(
        "Username has to be bewteen 4 and 200 characters long!"
      );
    }
  });
  it("Should not be able to signup if too long username", () => {
    try {
      validateUserCreate({
        ...signupInputObj,
        username: "aaa".repeat(100),
        active: true,
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe(
        "Username has to be bewteen 4 and 200 characters long!"
      );
    }
  });
  it("Should not be able to signup if too short name", () => {
    try {
      validateUserCreate({
        ...signupInputObj,
        name: "a",
        active: true,
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe(
        "Name has to be bewteen 2 and 200 characters long!"
      );
    }
  });
  it("Should not be able to signup if long short name", () => {
    try {
      validateUserCreate({
        ...signupInputObj,
        name: "a".repeat(300),
        active: true,
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe(
        "Name has to be bewteen 2 and 200 characters long!"
      );
    }
  });
  it("Should not be able to signup if too short surname", () => {
    try {
      validateUserCreate({
        ...signupInputObj,
        surname: "a",
        active: true,
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe(
        "Surname has to be bewteen 2 and 200 characters long!"
      );
    }
  });
  it("Should not be able to signup if too long surname", () => {
    try {
      validateUserCreate({
        ...signupInputObj,
        surname: "a".repeat(400),
        active: true,
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe(
        "Surname has to be bewteen 2 and 200 characters long!"
      );
    }
  });
  it("Should not be able to signup if invalid email", () => {
    try {
      validateUserCreate({
        ...signupInputObj,
        email: "a",
        active: true,
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe("Email has to be correct!");
    }
  });
  it("Should not be able to signup if password too short", () => {
    try {
      validateUserCreate({
        ...signupInputObj,
        password: "a",
        active: true,
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe(
        "Password has to be bewteen 6 and 200 characters long!"
      );
    }
  });
  it("Should not be able to signup if password too long", () => {
    try {
      validateUserCreate({
        ...signupInputObj,
        password: "a".repeat(300),
        active: true,
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe(
        "Password has to be bewteen 6 and 200 characters long!"
      );
    }
  });
  it("Should not be able to signup if passwords do not match", () => {
    try {
      validateUserCreate({
        ...signupInputObj,
        password: "superpass",
        active: true,
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe("Passwords have to match!");
    }
  });
  it("Should not be able to signup if about too long", () => {
    try {
      validateUserCreate({
        ...signupInputObj,
        about: "super".repeat(1000),
        active: true,
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe("About cannot be longer than 2000 characters!");
    }
  });
  it("Should not be able to change password to invalid", () => {
    try {
      validateResetPassword("test", "test");
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe(
        "Password has to be bewteen 6 and 200 characters long!"
      );
    }
  });
  it("Should not be able to change password if retype incorrect", () => {
    try {
      validateResetPassword("testowe", "testow");
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe("Passwords have to match!");
    }
  });
  it("Should not be able to update name if it is too long", () => {
    try {
      validateUserUpdate({ ...userUpdInputObj, name: "test".repeat(300) });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe(
        "Name has to be bewteen 2 and 200 characters long!"
      );
    }
  });
  it("Should not be able to update name if it is too short", () => {
    try {
      validateUserUpdate({ ...userUpdInputObj, name: "t" });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe(
        "Name has to be bewteen 2 and 200 characters long!"
      );
    }
  });
  it("Should not be able to update surname if it is too long", () => {
    try {
      validateUserUpdate({ ...userUpdInputObj, surname: "test".repeat(300) });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe(
        "Surname has to be bewteen 2 and 200 characters long!"
      );
    }
  });
  it("Should not be able to update surname if it is too short", () => {
    try {
      validateUserUpdate({ ...userUpdInputObj, surname: "t" });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe(
        "Surname has to be bewteen 2 and 200 characters long!"
      );
    }
  });
  it("Should not be able to update if invalid email", () => {
    try {
      validateUserUpdate({
        ...userUpdInputObj,
        newEmail: "a",
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe("Email has to be correct!");
    }
  });
  it("Should not be able to update if to long about", () => {
    try {
      validateUserUpdate({
        ...userUpdInputObj,
        about: "a".repeat(2001),
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe("About cannot be longer than 2000 characters!");
    }
  });
});
