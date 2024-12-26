export namespace MessageType {}

export type MessageType = {
  type: "selectFunction";
  functions: Array<{
    method: "get" | "post" | "delete" | "put" | "patch";
    pathname: string;
  }>;
  message: string;
  isSafeMethod: boolean;
};
