import { ServiceContext } from "./context";

export type UnauthedService = (
  context: Extract<
    ServiceContext,
    {
      _type: "unauthed";
    }
  >
) => void;

export type AuthedService = (
  context: Extract<ServiceContext, { _type: "authed" }>
) => void;

export type Service = UnauthedService | AuthedService;
