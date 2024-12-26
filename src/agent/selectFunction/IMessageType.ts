export namespace MessageType {}

export type MessageType = {
  type: "selectFunction";
  functions: Array<{
    method: "get" | "post" | "delete" | "put" | "patch";
    pathname: string;
    parameters: any;
  }>;
  message: string;
  isSafeMethod: boolean;
};
