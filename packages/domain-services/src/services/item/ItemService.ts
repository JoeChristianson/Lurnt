import { makeService } from "@lurnt/domain";
import { create } from "./methods/create";
import { list } from "./methods/list";
import { getById } from "./methods/getById";
import { update } from "./methods/update";
import { remove } from "./methods/remove";

export const ItemService = {
  create: makeService("authed", { execute: create }),
  list: makeService("authed", { execute: list }),
  getById: makeService("authed", { execute: getById }),
  update: makeService("authed", { execute: update }),
  delete: makeService("authed", { execute: remove }),
};
