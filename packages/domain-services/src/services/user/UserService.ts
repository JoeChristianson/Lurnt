import { makeService } from "@lurnt/domain";
import { verifyEmail } from "./methods/verifyEmail";
import { sendVerificationEmail } from "./methods/sendVerificationEmail";
import { resendVerification } from "./methods/resendVerification";
import { getProfile } from "./methods/getProfile";
import { updateProfile } from "./methods/updateProfile";
import { planter } from "./methods/planter";
import { updateTheme } from "./methods/updateTheme";
import { loginWithGoogle } from "./methods/loginWithGoogle";
import { setHandle } from "./methods/setHandle";

export const UserService = {
  verifyEmail: makeService("unauthed", {
    execute: verifyEmail,
  }),

  sendVerificationEmail: makeService("unauthed", {
    execute: sendVerificationEmail,
  }),

  resendVerification: makeService("authed", {
    execute: resendVerification,
  }),

  getProfile: makeService("unauthed", {
    execute: getProfile,
  }),

  updateProfile: makeService("authed", {
    execute: updateProfile,
  }),

  planter: makeService("unauthed", {
    execute: planter,
  }),

  updateTheme: makeService("authed", {
    execute: updateTheme,
  }),

  loginWithGoogle: makeService("unauthed", {
    execute: loginWithGoogle,
  }),

  setHandle: makeService("unauthed", {
    execute: setHandle,
  }),
};
