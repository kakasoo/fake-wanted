import { g as c } from "./index-Bd-aWwUh.mjs";

function f(t, i) {
  for (var o = 0; o < i.length; o++) {
    const e = i[o];
    if (typeof e != "string" && !Array.isArray(e)) {
      for (const r in e)
        if (r !== "default" && !(r in t)) {
          const s = Object.getOwnPropertyDescriptor(e, r);
          s &&
            Object.defineProperty(
              t,
              r,
              s.get
                ? s
                : {
                    enumerable: !0,
                    get: () => e[r],
                  },
            );
        }
    }
  }
  return Object.freeze(Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }));
}
var n, a;
function b() {
  return (
    a ||
      ((a = 1),
      (n = function () {
        throw new Error("ws does not work in the browser. Browser clients must use the native WebSocket object");
      })),
    n
  );
}
var u = b();
const w = /* @__PURE__ */ c(u),
  p = /* @__PURE__ */ f(
    {
      __proto__: null,
      default: w,
    },
    [u],
  );
export { p as b };
