export namespace MessageType {
  export interface ChatType {
    type: "chat";
    message: string;
  }

  export interface SelectFunction {
    type: "selectFunction";
    functions: Array<{ method: "get" | "post" | "delete" | "put" | "patch"; pathname: string }>;
    message: string;
  }

  export interface FillArgument {
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
}
