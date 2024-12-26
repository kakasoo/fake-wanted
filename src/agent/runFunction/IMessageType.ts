export namespace MessageType {}

export interface MessageType {
  type: "runFunction";
  method: "get" | "post" | "delete" | "put" | "patch";
  pathname: string;
  message: string;
}
