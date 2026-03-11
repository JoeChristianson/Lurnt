import { makeService } from "@lurnt/domain";
import { startIntake } from "./methods/startIntake";
import { sendMessage } from "./methods/sendMessage";
import { completeIntake } from "./methods/completeIntake";
import { getConversation } from "./methods/getConversation";

export const AssessmentService = {
  startIntake: makeService("authed", {
    execute: startIntake,
  }),

  sendMessage: makeService("authed", {
    execute: sendMessage,
  }),

  completeIntake: makeService("authed", {
    execute: completeIntake,
  }),

  getConversation: makeService("authed", {
    execute: getConversation,
  }),
};
