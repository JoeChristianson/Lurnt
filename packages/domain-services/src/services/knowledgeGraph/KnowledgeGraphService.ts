import { makeService } from "@lurnt/domain";
import { generateGraph } from "./methods/generateGraph";
import { getGraph } from "./methods/getGraph";

export const KnowledgeGraphService = {
  generateGraph: makeService("authed", {
    execute: generateGraph,
  }),

  getGraph: makeService("authed", {
    execute: getGraph,
  }),
};
