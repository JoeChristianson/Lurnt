import { makeService } from "@lurnt/domain";
import { search } from "./methods/search";
import { choose } from "./methods/choose";

export const ExpertiseService = {
  search: makeService("unauthed", {
    execute: search,
  }),

  choose: makeService("authed", {
    execute: choose,
  }),
};
