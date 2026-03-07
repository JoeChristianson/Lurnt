import { ServiceContext } from "./context";

// Extract the context type based on the _type discriminator
type ContextForType<T extends ServiceContext["_type"]> = Extract<
  ServiceContext,
  { _type: T }
>;

// A service method receives context and an optional payload, returns a result
type ServiceMethod<TContext, TPayload, TResult> = (
  ctx: TContext,
  payload: TPayload
) => TResult;

// Methods object where each method gets the correct context type
type ServiceMethods<TContext> = {
  [K: string]: ServiceMethod<TContext, any, any>;
};

// Infer the shape of methods but with context type applied
type InferMethods<TContext, TMethods extends ServiceMethods<TContext>> = {
  [K in keyof TMethods]: TMethods[K] extends ServiceMethod<
    TContext,
    infer TPayload,
    infer TResult
  >
    ? ServiceMethod<TContext, TPayload, TResult>
    : never;
};

/**
 * Creates a service with methods bound to a specific context type.
 *
 * @example
 * const userService = makeService("authed", {
 *   getProfile: (ctx, payload: { includeStats: boolean }) => {
 *     // ctx is fully typed as AuthedContext
 *     return { userId: ctx.user.userId, userName: ctx.user.handle };
 *   },
 *   updateName: (ctx, payload: { newName: string }) => {
 *     // ...
 *   }
 * });
 */
export const makeService = <
  TType extends ServiceContext["_type"],
  TMethods extends ServiceMethods<ContextForType<TType>>
>(
  contextType: TType,
  methods: TMethods
): InferMethods<ContextForType<TType>, TMethods> & { _contextType: TType } => {
  return {
    ...methods,
    _contextType: contextType,
  } as InferMethods<ContextForType<TType>, TMethods> & { _contextType: TType };
};

// Helper type to extract the context type a service expects
export type ServiceContextType<T> = T extends { _contextType: infer C }
  ? C
  : never;
