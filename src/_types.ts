export type NextFunction = () => Promise<any>;
export type MiddlewareFunction = (ctx: any, next?: NextFunction) => any;
export type MiddlewareArg =
  | MiddlewareFunction
  | { stack: Stack; [x: string]: any }
  | boolean
  | void;

export interface Stack extends Array<any> {
  [index: number]: MiddlewareArg | Stack;
}
