import { makeService } from "@lurnt/domain";
import { getOrCreateQuiz } from "./methods/getOrCreateQuiz";
import { submitQuiz } from "./methods/submitQuiz";

export const NodeQuizService = {
  getOrCreateQuiz: makeService("authed", {
    execute: getOrCreateQuiz,
  }),

  submitQuiz: makeService("authed", {
    execute: submitQuiz,
  }),
};
