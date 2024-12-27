export namespace IAgent {
  export type Role =
    | "answer"
    | "judgement"
    | "opener"
    | "scribe"
    | "selectFunction"
    | "fillArgument"
    | "called"
    | "runFunction"
    | null;
}
