export interface MessageType {
  type: "fillArgument";
  method: "get" | "post" | "delete" | "put" | "patch";
  pathname: string;
  parameters: {
    query?: object;
    body?: object;
    param?: object;
  };
  message: string;
}
