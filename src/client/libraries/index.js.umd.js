(function (B, G) {
  typeof exports == "object" && typeof module < "u"
    ? G(exports)
    : typeof define == "function" && define.amd
      ? define(["exports"], G)
      : ((B = typeof globalThis < "u" ? globalThis : B || self), G((B.apis = {})));
})(this, function (B) {
  "use strict";
  var Do = Object.defineProperty;
  var Wo = (B, G, me) =>
    G in B ? Do(B, G, { enumerable: !0, configurable: !0, writable: !0, value: me }) : (B[G] = me);
  var He = (B, G, me) => Wo(B, typeof G != "symbol" ? G + "" : G, me);
  function G(n, e) {
    for (var t = 0; t < e.length; t++) {
      const s = e[t];
      if (typeof s != "string" && !Array.isArray(s)) {
        for (const c in s)
          if (c !== "default" && !(c in n)) {
            const h = Object.getOwnPropertyDescriptor(s, c);
            h && Object.defineProperty(n, c, h.get ? h : { enumerable: !0, get: () => s[c] });
          }
      }
    }
    return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: "Module" }));
  }
  function me(n) {
    return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
  }
  function Vr(n) {
    if (n.__esModule) return n;
    var e = n.default;
    if (typeof e == "function") {
      var t = function s() {
        return this instanceof s ? Reflect.construct(e, arguments, this.constructor) : e.apply(this, arguments);
      };
      t.prototype = e.prototype;
    } else t = {};
    return (
      Object.defineProperty(t, "__esModule", { value: !0 }),
      Object.keys(n).forEach(function (s) {
        var c = Object.getOwnPropertyDescriptor(n, s);
        Object.defineProperty(
          t,
          s,
          c.get
            ? c
            : {
                enumerable: !0,
                get: function () {
                  return n[s];
                },
              },
        );
      }),
      t
    );
  }
  var ye = {},
    Nt = {},
    Mn;
  function Cr() {
    return Mn || ((Mn = 1), Object.defineProperty(Nt, "__esModule", { value: !0 })), Nt;
  }
  var Mt = {},
    Te;
  (function (n) {
    n.is = (e) => typeof e == "object" && e !== null && typeof e.openapi == "string" && e.openapi.startsWith("3.0");
  })(Te || (Te = {}));
  var et;
  (function (n) {
    n.is = (e) => typeof e == "object" && e !== null && typeof e.openapi == "string" && e.openapi.startsWith("3.1");
  })(et || (et = {}));
  var tt;
  (function (n) {
    n.is = (e) => typeof e == "object" && e !== null && typeof e.swagger == "string" && e.swagger.startsWith("2.0");
  })(tt || (tt = {}));
  var nt;
  (function (n) {
    n.reference = (e) =>
      e
        .split("/")
        .filter((t) => !!t.length)
        .join(".");
  })(nt || (nt = {}));
  var be;
  (function (n) {
    n.take = (e) => (t) => (s) => {
      const c = e.get(t);
      if (c) return c;
      const h = s();
      return e.set(t, h), h;
    };
  })(be || (be = {}));
  var Pe;
  (function (n) {
    n.cascade = (e) => {
      var h;
      if (e.$ref.lastIndexOf(".") === -1) return e.description;
      const s = e.$ref.split(e.prefix)[1].split("."),
        c = s
          .slice(0, e.escape ? s.length : s.length - 1)
          .map((o, y, _) => _.slice(0, y + 1).join("."))
          .map((o) => {
            var y, _;
            return {
              key: o,
              description: (_ = (y = e.components.schemas) == null ? void 0 : y[o]) == null ? void 0 : _.description,
            };
          })
          .filter((o) => !!(o != null && o.description))
          .reverse();
      return c.length === 0
        ? e.description
        : [
            ...((h = e.description) != null && h.length ? [e.description] : []),
            ...c.map(
              (o, y) =>
                `Description of the ${y === 0 && e.escape ? "current" : "parent"} {@link ${o.key}} type:

` +
                o.description
                  .split(
                    `
`,
                  )
                  .map((_) => `> ${_}`).join(`
`),
            ),
          ].join(`

------------------------------

`);
    };
  })(Pe || (Pe = {}));
  var $;
  (function (n) {
    (n.isNull = (r) => r.type === "null"),
      (n.isUnknown = (r) => r.type === void 0 && !n.isConstant(r) && !n.isOneOf(r) && !n.isReference(r)),
      (n.isConstant = (r) => r.const !== void 0),
      (n.isBoolean = (r) => r.type === "boolean"),
      (n.isInteger = (r) => r.type === "integer"),
      (n.isNumber = (r) => r.type === "number"),
      (n.isString = (r) => r.type === "string"),
      (n.isArray = (r) => r.type === "array" && r.items !== void 0),
      (n.isTuple = (r) => r.type === "array" && r.prefixItems !== void 0),
      (n.isObject = (r) => r.type === "object"),
      (n.isReference = (r) => r.$ref !== void 0),
      (n.isOneOf = (r) => r.oneOf !== void 0),
      (n.isRecursiveReference = (r) => {
        if (n.isReference(r.schema) === !1) return !1;
        const f = r.schema.$ref.split(r.prefix)[1];
        let m = 0;
        return (
          n.visit({
            prefix: r.prefix,
            components: r.components,
            schema: r.schema,
            closure: (b) => {
              if (n.isReference(b)) {
                const p = b.$ref.split(r.prefix)[1];
                f === p && ++m;
              }
            },
          }),
          m > 1
        );
      }),
      (n.unreference = (r) => {
        const f = [],
          m = e({
            prefix: r.prefix,
            refAccessor:
              r.refAccessor ??
              `$input.${r.prefix
                .substring(2)
                .split("/")
                .filter((b) => !!b.length)
                .join(".")}`,
            accessor: r.accessor ?? "$input.schema",
            components: r.components,
            schema: r.schema,
            reasons: f,
          });
        return m === null
          ? {
              success: !1,
              error: { method: r.method, message: "failed to unreference due to unable to find.", reasons: f },
            }
          : { success: !0, value: m };
      }),
      (n.escape = (r) => {
        const f = [],
          m =
            t({
              ...r,
              reasons: f,
              visited: new Map(),
              accessor: r.accessor ?? "$input.schema",
              refAccessor: r.refAccessor ?? nt.reference(r.prefix),
            }) || null;
        return m === null
          ? {
              success: !1,
              error: {
                method: r.method,
                message: `failed to escape some reference type(s) due to unable to find${Number(r.recursive) === 0 ? " or recursive relationship" : ""}.`,
                reasons: f,
              },
            }
          : { success: !0, value: m };
      }),
      (n.visit = (r) => {
        const f = new Set(),
          m = r.refAccessor ?? `$input.${nt.reference(r.prefix)}`,
          b = (p, g) => {
            var v;
            if ((r.closure(p, g), n.isReference(p))) {
              const O = p.$ref.split(r.prefix).pop();
              if (f.has(O) === !0) return;
              f.add(O);
              const x = (v = r.components.schemas) == null ? void 0 : v[O];
              x !== void 0 && b(x, `${m}[${JSON.stringify(O)}]`);
            } else if (n.isOneOf(p)) p.oneOf.forEach((O, x) => b(O, `${g}.oneOf[${x}]`));
            else if (n.isObject(p)) {
              for (const [O, x] of Object.entries(p.properties ?? {})) b(x, `${g}.properties[${JSON.stringify(O)}]`);
              typeof p.additionalProperties == "object" &&
                p.additionalProperties !== null &&
                b(p.additionalProperties, `${g}.additionalProperties`);
            } else
              n.isArray(p)
                ? b(p.items, `${g}.items`)
                : n.isTuple(p) &&
                  ((p.prefixItems ?? []).forEach((O, x) => b(O, `${g}.prefixItems[${x}]`)),
                  typeof p.additionalItems == "object" &&
                    p.additionalItems !== null &&
                    b(p.additionalItems, `${g}.additionalItems`));
          };
        b(r.schema, r.accessor ?? "$input.schema");
      }),
      (n.covers = (r) => s({ prefix: r.prefix, components: r.components, x: r.x, y: r.y, visited: new Map() }));
    const e = (r) => {
        var b;
        if (n.isReference(r.schema) === !1) return r.schema;
        const f = r.schema.$ref.split(r.prefix).pop(),
          m = (b = r.components.schemas) == null ? void 0 : b[f];
        return m === void 0
          ? (r.reasons.push({
              schema: r.schema,
              accessor: r.accessor,
              message: `unable to find reference type ${JSON.stringify(f)}.`,
            }),
            null)
          : n.isReference(m) === !1
            ? m
            : r.first === f
              ? (r.reasons.push({
                  schema: r.schema,
                  accessor: r.accessor,
                  message: `recursive reference type ${JSON.stringify(f)}.`,
                }),
                null)
              : e({ ...r, accessor: `${r.refAccessor}[${JSON.stringify(f)}]`, first: f });
      },
      t = (r) => {
        var f, m;
        if (n.isReference(r.schema)) {
          const b = r.schema.$ref.split(r.prefix)[1],
            p = (f = r.components.schemas) == null ? void 0 : f[b];
          if (p === void 0)
            return (
              r.reasons.push({
                schema: r.schema,
                accessor: r.accessor,
                message: `unable to find reference type ${JSON.stringify(b)}.`,
              }),
              null
            );
          if (r.visited.has(b) === !0) {
            if (r.recursive === !1) return null;
            const g = r.visited.get(b);
            if (g > r.recursive)
              return r.recursive === 0
                ? (r.reasons.push({
                    schema: r.schema,
                    accessor: r.accessor,
                    message: `recursive reference type ${JSON.stringify(b)}.`,
                  }),
                  null)
                : void 0;
            r.visited.set(b, g + 1);
            const v = t({ ...r, schema: p, accessor: `${r.refAccessor}[${JSON.stringify(b)}]` });
            return (
              v && {
                ...v,
                description: Pe.cascade({
                  prefix: r.prefix,
                  components: r.components,
                  $ref: r.schema.$ref,
                  description: v.description,
                  escape: !0,
                }),
              }
            );
          } else {
            const g = t({
              ...r,
              schema: p,
              accessor: `${r.refAccessor}[${JSON.stringify(b)}]`,
              visited: new Map([...r.visited, [b, 1]]),
            });
            return (
              g && {
                ...g,
                description: Pe.cascade({
                  prefix: r.prefix,
                  components: r.components,
                  $ref: r.schema.$ref,
                  description: g.description,
                  escape: !0,
                }),
              }
            );
          }
        } else if (n.isOneOf(r.schema)) {
          const b = r.schema.oneOf.map((g, v) => t({ ...r, schema: g, accessor: `${r.accessor}.oneOf[${v}]` }));
          if (b.some((g) => g === null)) return null;
          const p = b.filter((g) => g !== void 0);
          return p.length === 0
            ? void 0
            : { ...r, oneOf: p.map((g) => i({ prefix: r.prefix, components: r.components, schema: g })).flat() };
        } else if (n.isObject(r.schema)) {
          const b = r.schema,
            p = Object.entries(b.properties ?? {}).map(([v, O]) => [
              v,
              t({ ...r, schema: O, visited: r.visited, accessor: `${r.accessor}.properties[${JSON.stringify(v)}]` }),
            ]),
            g = b.additionalProperties
              ? typeof b.additionalProperties == "object" && b.additionalProperties !== null
                ? t({ ...r, schema: b.additionalProperties, accessor: `${r.accessor}.additionalProperties` })
                : b.additionalProperties
              : !1;
          return p.some(([v, O]) => O === null) || g === null
            ? null
            : p.some(([v, O]) => {
                  var x;
                  return O === void 0 && ((x = b.required) == null ? void 0 : x.includes(v)) === !0;
                }) === !0
              ? void 0
              : {
                  ...b,
                  properties: Object.fromEntries(p.filter(([v, O]) => O !== void 0)),
                  additionalProperties: g ?? !1,
                  required:
                    ((m = b.required) == null
                      ? void 0
                      : m.filter((v) => p.some(([O, x]) => O === v && x !== void 0))) ?? [],
                };
        } else if (n.isTuple(r.schema)) {
          const b = r.schema.prefixItems.map((g, v) =>
              t({ ...r, schema: g, accessor: `${r.accessor}.prefixItems[${v}]` }),
            ),
            p = r.schema.additionalItems
              ? typeof r.schema.additionalItems == "object" && r.schema.additionalItems !== null
                ? t({ ...r, schema: r.schema.additionalItems, accessor: `${r.accessor}.additionalItems` })
                : r.schema.additionalItems
              : !1;
          return b.some((g) => g === null) || p === null
            ? null
            : b.some((g) => g === void 0)
              ? void 0
              : { ...r.schema, prefixItems: b, additionalItems: p ?? !1 };
        } else if (n.isArray(r.schema)) {
          const b = t({ ...r, schema: r.schema.items, accessor: `${r.accessor}.items` });
          return b === null
            ? null
            : b === void 0
              ? { ...r.schema, minItems: void 0, maxItems: 0, items: {} }
              : { ...r.schema, items: b };
        }
        return r.schema;
      },
      s = (r) => {
        var p;
        const f = (p = r.visited.get(r.x)) == null ? void 0 : p.get(r.y);
        if (f !== void 0) return f;
        const m = be.take(r.visited)(r.x)(() => new Map());
        m.set(r.y, !0);
        const b = c(r);
        return m.set(r.y, b), b;
      },
      c = (r) => {
        if (r.x === r.y) return !0;
        if (n.isReference(r.x) && n.isReference(r.y) && r.x.$ref === r.y.$ref) return !0;
        const f = i({ prefix: r.prefix, components: r.components, schema: r.x }),
          m = i({ prefix: r.prefix, components: r.components, schema: r.y });
        return f.some((b) => n.isUnknown(b))
          ? !0
          : m.some((b) => n.isUnknown(b))
            ? !1
            : m.every((b) =>
                f.some((p) => h({ prefix: r.prefix, components: r.components, visited: r.visited, x: p, y: b })),
              );
      },
      h = (r) =>
        r.x === r.y || n.isUnknown(r.x)
          ? !0
          : n.isUnknown(r.y)
            ? !1
            : n.isNull(r.x)
              ? n.isNull(r.y)
              : n.isConstant(r.x)
                ? n.isConstant(r.y) && r.x.const === r.y.const
                : n.isBoolean(r.x)
                  ? n.isBoolean(r.y) || (n.isConstant(r.y) && typeof r.y.const == "boolean")
                  : n.isInteger(r.x)
                    ? (n.isInteger(r.y) || n.isConstant(r.y)) && _(r.x, r.y)
                    : n.isNumber(r.x)
                      ? (n.isConstant(r.y) || n.isInteger(r.y) || n.isNumber(r.y)) && a(r.x, r.y)
                      : n.isString(r.x)
                        ? (n.isConstant(r.y) || n.isString(r.y)) && l(r.x, r.y)
                        : n.isArray(r.x)
                          ? (n.isArray(r.y) || n.isTuple(r.y)) &&
                            o({ prefix: r.prefix, components: r.components, visited: r.visited, x: r.x, y: r.y })
                          : n.isObject(r.x)
                            ? n.isObject(r.y) &&
                              y({ prefix: r.prefix, components: r.components, visited: r.visited, x: r.x, y: r.y })
                            : n.isReference(r.x)
                              ? n.isReference(r.y) && r.x.$ref === r.y.$ref
                              : !1,
      o = (r) => {
        if (n.isTuple(r.y))
          return (
            r.y.prefixItems.every((f) =>
              s({ prefix: r.prefix, components: r.components, visited: r.visited, x: r.x.items, y: f }),
            ) &&
            (r.y.additionalItems === void 0 ||
              (typeof r.y.additionalItems == "object" &&
                s({
                  prefix: r.prefix,
                  components: r.components,
                  visited: r.visited,
                  x: r.x.items,
                  y: r.y.additionalItems,
                })))
          );
        if (r.x.minItems === void 0 || (r.y.minItems !== void 0 && r.x.minItems <= r.y.minItems)) {
          if (!(r.x.maxItems === void 0 || (r.y.maxItems !== void 0 && r.x.maxItems >= r.y.maxItems))) return !1;
        } else return !1;
        return s({ prefix: r.prefix, components: r.components, visited: r.visited, x: r.x.items, y: r.y.items });
      },
      y = (r) =>
        (!r.x.additionalProperties && r.y.additionalProperties) ||
        (r.x.additionalProperties &&
          r.y.additionalProperties &&
          ((typeof r.x.additionalProperties == "object" && r.y.additionalProperties === !0) ||
            (typeof r.x.additionalProperties == "object" &&
              typeof r.y.additionalProperties == "object" &&
              !s({
                prefix: r.prefix,
                components: r.components,
                visited: r.visited,
                x: r.x.additionalProperties,
                y: r.y.additionalProperties,
              }))))
          ? !1
          : Object.entries(r.y.properties ?? {}).every(([f, m]) => {
              var p, g, v;
              const b = (p = r.x.properties) == null ? void 0 : p[f];
              return b === void 0 ||
                (((g = r.x.required) == null ? void 0 : g.includes(f)) === !0 &&
                  (((v = r.y.required) == null ? void 0 : v.includes(f)) ?? !1) === !1)
                ? !1
                : s({ prefix: r.prefix, components: r.components, visited: r.visited, x: b, y: m });
            }),
      _ = (r, f) =>
        n.isConstant(f)
          ? typeof f.const == "number" && Number.isInteger(f.const)
          : [
              r.type === f.type,
              r.minimum === void 0 || (f.minimum !== void 0 && r.minimum <= f.minimum),
              r.maximum === void 0 || (f.maximum !== void 0 && r.maximum >= f.maximum),
              r.exclusiveMinimum !== !0 ||
                r.minimum === void 0 ||
                (f.minimum !== void 0 && (f.exclusiveMinimum === !0 || r.minimum < f.minimum)),
              r.exclusiveMaximum !== !0 ||
                r.maximum === void 0 ||
                (f.maximum !== void 0 && (f.exclusiveMaximum === !0 || r.maximum > f.maximum)),
              r.multipleOf === void 0 ||
                (f.multipleOf !== void 0 && f.multipleOf / r.multipleOf === Math.floor(f.multipleOf / r.multipleOf)),
            ].every((m) => m),
      a = (r, f) =>
        n.isConstant(f)
          ? typeof f.const == "number"
          : [
              r.type === f.type || (r.type === "number" && f.type === "integer"),
              r.minimum === void 0 || (f.minimum !== void 0 && r.minimum <= f.minimum),
              r.maximum === void 0 || (f.maximum !== void 0 && r.maximum >= f.maximum),
              r.exclusiveMinimum !== !0 ||
                r.minimum === void 0 ||
                (f.minimum !== void 0 && (f.exclusiveMinimum === !0 || r.minimum < f.minimum)),
              r.exclusiveMaximum !== !0 ||
                r.maximum === void 0 ||
                (f.maximum !== void 0 && (f.exclusiveMaximum === !0 || r.maximum > f.maximum)),
              r.multipleOf === void 0 ||
                (f.multipleOf !== void 0 && f.multipleOf / r.multipleOf === Math.floor(f.multipleOf / r.multipleOf)),
            ].every((m) => m),
      l = (r, f) =>
        n.isConstant(f)
          ? typeof f.const == "string"
          : [
              r.format === void 0 || (f.format !== void 0 && d(r.format, f.format)),
              r.pattern === void 0 || r.pattern === f.pattern,
              r.minLength === void 0 || (f.minLength !== void 0 && r.minLength <= f.minLength),
              r.maxLength === void 0 || (f.maxLength !== void 0 && r.maxLength >= f.maxLength),
            ].every((m) => m),
      d = (r, f) =>
        r === f ||
        (r === "idn-email" && f === "email") ||
        (r === "idn-hostname" && f === "hostname") ||
        (["uri", "iri"].includes(r) && f === "url") ||
        (r === "iri" && f === "uri") ||
        (r === "iri-reference" && f === "uri-reference"),
      i = (r) => {
        const f = u(r);
        return n.isOneOf(f)
          ? f.oneOf.map((m) => i({ prefix: r.prefix, components: r.components, schema: m })).flat()
          : [f];
      },
      u = (r) => {
        var b;
        if (n.isReference(r.schema) === !1) return r.schema;
        const f = r.schema.$ref.replace(r.prefix, ""),
          m = u({
            prefix: r.prefix,
            components: r.components,
            schema: ((b = r.components.schemas) == null ? void 0 : b[f]) ?? {},
          });
        if (m === void 0) throw new Error(`Reference type not found: ${JSON.stringify(r.schema.$ref)}`);
        return u({ prefix: r.prefix, components: r.components, schema: m });
      };
  })($ || ($ = {}));
  var w;
  (function (n) {
    (n.isNull = (e) => $.isNull(e)),
      (n.isUnknown = (e) => $.isUnknown(e)),
      (n.isConstant = (e) => $.isConstant(e)),
      (n.isBoolean = (e) => $.isBoolean(e)),
      (n.isInteger = (e) => $.isInteger(e)),
      (n.isNumber = (e) => $.isNumber(e)),
      (n.isString = (e) => $.isString(e)),
      (n.isArray = (e) => $.isArray(e)),
      (n.isTuple = (e) => $.isTuple(e)),
      (n.isObject = (e) => $.isObject(e)),
      (n.isReference = (e) => $.isReference(e)),
      (n.isOneOf = (e) => $.isOneOf(e)),
      (n.isRecursiveReference = (e) =>
        $.isRecursiveReference({ prefix: "#/components/schemas/", components: e.components, schema: e.schema })),
      (n.escape = (e) => $.escape({ ...e, prefix: "#/components/schemas/", method: "OpenApiTypeChecker.method" })),
      (n.unreference = (e) =>
        $.unreference({ ...e, prefix: "#/components/schemas/", method: "OpenApiTypeChecker.unreference" })),
      (n.visit = (e) => $.visit({ ...e, prefix: "#/components/schemas/" })),
      (n.covers = (e) => $.covers({ prefix: "#/components/schemas/", components: e.components, x: e.x, y: e.y }));
  })(w || (w = {}));
  var rt;
  (function (n) {
    n.downgrade = (a) => {
      const l = n.downgradeComponents(a.components);
      return {
        openapi: "3.0.0",
        servers: a.servers,
        info: a.info,
        components: l.downgraded,
        paths: a.paths
          ? Object.fromEntries(
              Object.entries(a.paths)
                .filter(([d, i]) => i !== void 0)
                .map(([d, i]) => [d, e(l)(i)]),
            )
          : void 0,
        security: a.security,
        tags: a.tags,
      };
    };
    const e = (a) => (l) => ({
        ...l,
        ...(l.get ? { get: t(a)(l.get) } : void 0),
        ...(l.put ? { put: t(a)(l.put) } : void 0),
        ...(l.post ? { post: t(a)(l.post) } : void 0),
        ...(l.delete ? { delete: t(a)(l.delete) } : void 0),
        ...(l.options ? { options: t(a)(l.options) } : void 0),
        ...(l.head ? { head: t(a)(l.head) } : void 0),
        ...(l.patch ? { patch: t(a)(l.patch) } : void 0),
        ...(l.trace ? { trace: t(a)(l.trace) } : void 0),
      }),
      t = (a) => (l) => ({
        ...l,
        parameters: l.parameters ? l.parameters.map(s(a)) : void 0,
        requestBody: l.requestBody ? c(a)(l.requestBody) : void 0,
        responses: l.responses
          ? Object.fromEntries(
              Object.entries(l.responses)
                .filter(([d, i]) => i !== void 0)
                .map(([d, i]) => [d, h(a)(i)]),
            )
          : void 0,
      }),
      s = (a) => (l) => ({ ...l, schema: n.downgradeSchema(a)(l.schema) }),
      c = (a) => (l) => ({ ...l, content: l.content ? o(a)(l.content) : void 0 }),
      h = (a) => (l) => ({
        ...l,
        content: l.content ? o(a)(l.content) : void 0,
        headers: l.headers
          ? Object.fromEntries(
              Object.entries(l.headers)
                .filter(([d, i]) => i !== void 0)
                .map(([d, i]) => [d, { ...i, schema: n.downgradeSchema(a)(i.schema) }]),
            )
          : void 0,
      }),
      o = (a) => (l) =>
        Object.fromEntries(
          Object.entries(l)
            .filter(([d, i]) => i !== void 0)
            .map(([d, i]) => [d, { ...i, schema: i != null && i.schema ? n.downgradeSchema(a)(i.schema) : void 0 }]),
        );
    (n.downgradeComponents = (a) => {
      const l = { original: a, downgraded: { securitySchemes: a.securitySchemes } };
      if (a.schemas) {
        l.downgraded.schemas = {};
        for (const [d, i] of Object.entries(a.schemas))
          i !== void 0 && (l.downgraded.schemas[d] = n.downgradeSchema(l)(i));
      }
      return l;
    }),
      (n.downgradeSchema = (a) => (l) => {
        const d = _(new Set())(a.original)(l),
          i = [],
          u = {
            title: l.title,
            description: l.description,
            example: l.example,
            examples: l.examples,
            ...Object.fromEntries(Object.entries(l).filter(([m, b]) => m.startsWith("x-") && b !== void 0)),
          },
          r = (m) => {
            w.isBoolean(m)
              ? i.push({ type: "boolean" })
              : w.isBoolean(m) || w.isInteger(m) || w.isNumber(m) || w.isString(m) || w.isReference(m)
                ? i.push({ ...m })
                : w.isArray(m)
                  ? i.push({ ...m, items: n.downgradeSchema(a)(m.items) })
                  : w.isTuple(m)
                    ? i.push({
                        ...m,
                        items: (() => {
                          if (m.additionalItems === !0) return {};
                          const b = [
                            ...m.prefixItems,
                            ...(typeof m.additionalItems == "object" ? [n.downgradeSchema(a)(m.additionalItems)] : []),
                          ];
                          return b.length === 0 ? {} : { oneOf: b.map(n.downgradeSchema(a)) };
                        })(),
                        minItems: m.prefixItems.length,
                        maxItems: m.additionalItems ? void 0 : m.prefixItems.length,
                        prefixItems: void 0,
                        additionalItems: void 0,
                      })
                    : w.isObject(m)
                      ? i.push({
                          ...m,
                          properties: m.properties
                            ? Object.fromEntries(
                                Object.entries(m.properties)
                                  .filter(([b, p]) => p !== void 0)
                                  .map(([b, p]) => [b, n.downgradeSchema(a)(p)]),
                              )
                            : void 0,
                          additionalProperties:
                            typeof m.additionalProperties == "object"
                              ? n.downgradeSchema(a)(m.additionalProperties)
                              : m.additionalProperties,
                          required: m.required,
                        })
                      : w.isOneOf(m) && m.oneOf.forEach(r);
          },
          f = (m) => {
            const b = (p) => {
              const g = i.find((v) => v.type === typeof p);
              g !== void 0 ? (g.enum ?? (g.enum = []), g.enum.push(p)) : i.push({ type: typeof p, enum: [p] });
            };
            if (w.isConstant(m)) b(m.const);
            else if (w.isOneOf(m)) for (const p of m.oneOf) w.isConstant(p) && b(p.const);
          };
        if ((r(l), f(l), d === !0)) for (const m of i) w.isReference(m) ? y(new Set())(a)(m) : (m.nullable = !0);
        return d === !0 && i.length === 0
          ? { type: "null", ...u }
          : { ...(i.length === 0 ? { type: void 0 } : i.length === 1 ? { ...i[0] } : { oneOf: i }), ...u };
      });
    const y = (a) => (l) => (d) => {
        var f, m;
        var i;
        const u = d.$ref.split("/").pop();
        if (u.endsWith(".Nullable")) return;
        const r = (f = l.original.schemas) == null ? void 0 : f[u];
        if (r !== void 0) {
          {
            if (_(a)(l.original)(r) === !0) return;
            ((m = l.downgraded.schemas) == null ? void 0 : m[`${u}.Nullable`]) === void 0 &&
              ((i = l.downgraded).schemas ?? (i.schemas = {}),
              (l.downgraded.schemas[`${u}.Nullable`] = {}),
              (l.downgraded.schemas[`${u}.Nullable`] = n.downgradeSchema(l)(
                w.isOneOf(r)
                  ? { ...r, oneOf: [...r.oneOf, { type: "null" }] }
                  : {
                      oneOf: [r, { type: "null" }],
                      title: r.title,
                      description: r.description,
                      example: r.example,
                      examples: r.examples,
                      ...Object.fromEntries(Object.entries(r).filter(([b, p]) => b.startsWith("x-") && p !== void 0)),
                    },
              )));
          }
          d.$ref += ".Nullable";
        }
      },
      _ = (a) => (l) => (d) => {
        var i;
        if (w.isNull(d)) return !0;
        if (w.isReference(d)) {
          if (a.has(d.$ref)) return !1;
          a.add(d.$ref);
          const u = d.$ref.split("/").pop(),
            r = (i = l.schemas) == null ? void 0 : i[u];
          return r ? _(a)(l)(r) : !1;
        }
        return w.isOneOf(d) && d.oneOf.some(_(a)(l));
      };
  })(rt || (rt = {}));
  var Ft;
  (function (n) {
    n.convert = (l) => ({
      ...l,
      components: n.convertComponents(l.components ?? {}),
      paths: l.paths
        ? Object.fromEntries(
            Object.entries(l.paths)
              .filter(([d, i]) => i !== void 0)
              .map(([d, i]) => [d, e(l)(i)]),
          )
        : void 0,
      openapi: "3.1.0",
      "x-samchon-emended": !0,
    });
    const e = (l) => (d) => ({
        ...d,
        ...(d.get ? { get: t(l)(d)(d.get) } : void 0),
        ...(d.put ? { put: t(l)(d)(d.put) } : void 0),
        ...(d.post ? { post: t(l)(d)(d.post) } : void 0),
        ...(d.delete ? { delete: t(l)(d)(d.delete) } : void 0),
        ...(d.options ? { options: t(l)(d)(d.options) } : void 0),
        ...(d.head ? { head: t(l)(d)(d.head) } : void 0),
        ...(d.patch ? { patch: t(l)(d)(d.patch) } : void 0),
        ...(d.trace ? { trace: t(l)(d)(d.trace) } : void 0),
      }),
      t = (l) => (d) => (i) => ({
        ...i,
        parameters:
          d.parameters !== void 0 || i.parameters !== void 0
            ? [...(d.parameters ?? []), ...(i.parameters ?? [])]
                .map((u) => {
                  var f, m, b, p;
                  if (!a.isReference(u)) return s(l.components ?? {})(u);
                  const r = u.$ref.startsWith("#/components/headers/")
                    ? (m = (f = l.components) == null ? void 0 : f.headers) == null
                      ? void 0
                      : m[u.$ref.split("/").pop() ?? ""]
                    : (p = (b = l.components) == null ? void 0 : b.parameters) == null
                      ? void 0
                      : p[u.$ref.split("/").pop() ?? ""];
                  return r !== void 0 ? s(l.components ?? {})({ ...r, in: "header" }) : void 0;
                })
                .filter((u, r) => r !== void 0)
            : void 0,
        requestBody: i.requestBody ? c(l)(i.requestBody) : void 0,
        responses: i.responses
          ? Object.fromEntries(
              Object.entries(i.responses)
                .filter(([u, r]) => r !== void 0)
                .map(([u, r]) => [u, h(l)(r)])
                .filter(([u, r]) => r !== void 0),
            )
          : void 0,
      }),
      s = (l) => (d) => ({
        ...d,
        schema: n.convertSchema(l)(d.schema),
        examples: d.examples
          ? Object.fromEntries(
              Object.entries(d.examples)
                .map(([i, u]) => {
                  var r;
                  return [
                    i,
                    a.isReference(u) ? ((r = l.examples) == null ? void 0 : r[u.$ref.split("/").pop() ?? ""]) : u,
                  ];
                })
                .filter(([i, u]) => u !== void 0),
            )
          : void 0,
      }),
      c = (l) => (d) => {
        var i, u;
        if (a.isReference(d)) {
          const r =
            (u = (i = l.components) == null ? void 0 : i.requestBodies) == null
              ? void 0
              : u[d.$ref.split("/").pop() ?? ""];
          if (r === void 0) return;
          d = r;
        }
        return { ...d, content: d.content ? o(l.components ?? {})(d.content) : void 0 };
      },
      h = (l) => (d) => {
        var i, u;
        if (a.isReference(d)) {
          const r =
            (u = (i = l.components) == null ? void 0 : i.responses) == null ? void 0 : u[d.$ref.split("/").pop() ?? ""];
          if (r === void 0) return;
          d = r;
        }
        return {
          ...d,
          content: d.content ? o(l.components ?? {})(d.content) : void 0,
          headers: d.headers
            ? Object.fromEntries(
                Object.entries(d.headers)
                  .filter(([r, f]) => f !== void 0)
                  .map(([r, f]) => [
                    r,
                    (() => {
                      var b, p;
                      if (a.isReference(f) === !1) return s(l.components ?? {})({ ...f, in: "header" });
                      const m = f.$ref.startsWith("#/components/headers/")
                        ? (p = (b = l.components) == null ? void 0 : b.headers) == null
                          ? void 0
                          : p[f.$ref.split("/").pop() ?? ""]
                        : void 0;
                      return m !== void 0 ? s(l.components ?? {})({ ...m, in: "header" }) : void 0;
                    })(),
                  ])
                  .filter(([r, f]) => f !== void 0),
              )
            : void 0,
        };
      },
      o = (l) => (d) =>
        Object.fromEntries(
          Object.entries(d)
            .filter(([i, u]) => u !== void 0)
            .map(([i, u]) => [
              i,
              {
                ...u,
                schema: u.schema ? n.convertSchema(l)(u.schema) : void 0,
                examples: u.examples
                  ? Object.fromEntries(
                      Object.entries(u.examples)
                        .map(([r, f]) => {
                          var m;
                          return [
                            r,
                            a.isReference(f)
                              ? (m = l.examples) == null
                                ? void 0
                                : m[f.$ref.split("/").pop() ?? ""]
                              : f,
                          ];
                        })
                        .filter(([r, f]) => f !== void 0),
                    )
                  : void 0,
              },
            ]),
        );
    (n.convertComponents = (l) => ({
      schemas: Object.fromEntries(
        Object.entries(l.schemas ?? {})
          .filter(([d, i]) => i !== void 0)
          .map(([d, i]) => [d, n.convertSchema(l)(i)]),
      ),
      securitySchemes: l.securitySchemes,
    })),
      (n.convertSchema = (l) => (d) => {
        const i = { value: !1, default: void 0 },
          u = [],
          r = {
            title: d.title,
            description: d.description,
            ...Object.fromEntries(Object.entries(d).filter(([m, b]) => m.startsWith("x-") && b !== void 0)),
            example: d.example,
            examples: d.examples,
          },
          f = (m) => {
            var b, p, g;
            m.nullable === !0 && (i.value || (i.value = !0), m.default === null && (i.default = null)),
              Array.isArray(m.enum) &&
                (b = m.enum) != null &&
                b.length &&
                (p = m.enum) != null &&
                p.some((v) => v === null) &&
                (i.value || (i.value = !0)),
              a.isAnyOf(m)
                ? m.anyOf.forEach(f)
                : a.isOneOf(m)
                  ? m.oneOf.forEach(f)
                  : a.isAllOf(m)
                    ? m.allOf.length === 1
                      ? f(m.allOf[0])
                      : u.push(y(l)(m))
                    : a.isBoolean(m) || a.isInteger(m) || a.isNumber(m) || a.isString(m)
                      ? (g = m.enum) != null && g.length && m.enum.filter((v) => v !== null).length
                        ? u.push(...m.enum.filter((v) => v !== null).map((v) => ({ const: v })))
                        : u.push({ ...m, default: m.default ?? void 0, enum: void 0 })
                      : a.isArray(m)
                        ? u.push({ ...m, items: n.convertSchema(l)(m.items) })
                        : a.isObject(m)
                          ? u.push({
                              ...m,
                              properties: m.properties
                                ? Object.fromEntries(
                                    Object.entries(m.properties)
                                      .filter(([v, O]) => O !== void 0)
                                      .map(([v, O]) => [v, n.convertSchema(l)(O)]),
                                  )
                                : {},
                              additionalProperties: m.additionalProperties
                                ? typeof m.additionalProperties == "object" && m.additionalProperties !== null
                                  ? n.convertSchema(l)(m.additionalProperties)
                                  : m.additionalProperties
                                : void 0,
                              required: m.required ?? [],
                            })
                          : (a.isReference(m), u.push(m));
          };
        if (
          (f(d),
          i.value === !0 && !u.some((m) => m.type === "null") && u.push({ type: "null", default: i.default }),
          u.length === 2 && u.filter((m) => w.isNull(m)).length === 1)
        ) {
          const m = u.filter((b) => w.isNull(b) === !1)[0];
          for (const b of ["title", "description", "deprecated", "example", "examples"]) m[b] !== void 0 && delete m[b];
        }
        return {
          ...(u.length === 0
            ? { type: void 0 }
            : u.length === 1
              ? { ...u[0] }
              : { oneOf: u.map((m) => ({ ...m, nullable: void 0 })) }),
          ...r,
          nullable: void 0,
        };
      });
    const y = (l) => (d) => {
        const i = d.allOf.map((u) => _(l)(u));
        return i.some((u) => u === null)
          ? { type: void 0, allOf: void 0 }
          : {
              ...d,
              type: "object",
              properties: Object.fromEntries(
                i
                  .map((u) => Object.entries((u == null ? void 0 : u.properties) ?? {}))
                  .flat()
                  .map(([u, r]) => [u, n.convertSchema(l)(r)]),
              ),
              allOf: void 0,
              required: [...new Set(i.map((u) => (u == null ? void 0 : u.required) ?? []).flat())],
            };
      },
      _ =
        (l) =>
        (d, i = new Set()) => {
          var u;
          return a.isObject(d)
            ? d.properties !== void 0 && !d.additionalProperties
              ? d
              : null
            : i.has(d)
              ? null
              : (i.add(d),
                a.isReference(d)
                  ? _(l)(((u = l.schemas) == null ? void 0 : u[d.$ref.split("/").pop() ?? ""]) ?? {}, i)
                  : null);
        };
    let a;
    (function (l) {
      (l.isBoolean = (d) => d.type === "boolean"),
        (l.isInteger = (d) => d.type === "integer"),
        (l.isNumber = (d) => d.type === "number"),
        (l.isString = (d) => d.type === "string"),
        (l.isArray = (d) => d.type === "array"),
        (l.isObject = (d) => d.type === "object"),
        (l.isReference = (d) => d.$ref !== void 0),
        (l.isAllOf = (d) => d.allOf !== void 0),
        (l.isAnyOf = (d) => d.anyOf !== void 0),
        (l.isOneOf = (d) => d.oneOf !== void 0),
        (l.isNullOnly = (d) => d.type === "null");
    })((a = n.TypeChecker || (n.TypeChecker = {})));
  })(Ft || (Ft = {}));
  var Ht;
  (function (n) {
    n.convert = (u) =>
      u["x-samchon-emended"] === !0
        ? u
        : {
            ...u,
            components: _(u.components ?? {}),
            paths: u.paths
              ? Object.fromEntries(
                  Object.entries(u.paths)
                    .filter(([r, f]) => f !== void 0)
                    .map(([r, f]) => [r, t(u)(f)]),
                )
              : void 0,
            webhooks: u.webhooks
              ? Object.fromEntries(
                  Object.entries(u.webhooks)
                    .filter(([r, f]) => f !== void 0)
                    .map(([r, f]) => [r, e(u)(f)])
                    .filter(([r, f]) => f !== void 0),
                )
              : void 0,
            "x-samchon-emended": !0,
          };
    const e = (u) => (r) => {
        var m, b;
        if (!i.isReference(r)) return t(u)(r);
        const f =
          (b = (m = u.components) == null ? void 0 : m.pathItems) == null ? void 0 : b[r.$ref.split("/").pop() ?? ""];
        return f ? t(u)(f) : void 0;
      },
      t = (u) => (r) => ({
        ...r,
        ...(r.get ? { get: s(u)(r)(r.get) } : void 0),
        ...(r.put ? { put: s(u)(r)(r.put) } : void 0),
        ...(r.post ? { post: s(u)(r)(r.post) } : void 0),
        ...(r.delete ? { delete: s(u)(r)(r.delete) } : void 0),
        ...(r.options ? { options: s(u)(r)(r.options) } : void 0),
        ...(r.head ? { head: s(u)(r)(r.head) } : void 0),
        ...(r.patch ? { patch: s(u)(r)(r.patch) } : void 0),
        ...(r.trace ? { trace: s(u)(r)(r.trace) } : void 0),
      }),
      s = (u) => (r) => (f) => ({
        ...f,
        parameters:
          r.parameters !== void 0 || f.parameters !== void 0
            ? [...(r.parameters ?? []), ...(f.parameters ?? [])]
                .map((m) => {
                  var p, g, v, O;
                  if (!i.isReference(m)) return c(u.components ?? {})(m);
                  const b = m.$ref.startsWith("#/components/headers/")
                    ? (g = (p = u.components) == null ? void 0 : p.headers) == null
                      ? void 0
                      : g[m.$ref.split("/").pop() ?? ""]
                    : (O = (v = u.components) == null ? void 0 : v.parameters) == null
                      ? void 0
                      : O[m.$ref.split("/").pop() ?? ""];
                  return b !== void 0 ? c(u.components ?? {})({ ...b, in: "header" }) : void 0;
                })
                .filter((m, b) => b !== void 0)
            : void 0,
        requestBody: f.requestBody ? h(u)(f.requestBody) : void 0,
        responses: f.responses
          ? Object.fromEntries(
              Object.entries(f.responses)
                .filter(([m, b]) => b !== void 0)
                .map(([m, b]) => [m, o(u)(b)])
                .filter(([m, b]) => b !== void 0),
            )
          : void 0,
      }),
      c = (u) => (r) => ({
        ...r,
        schema: a(u)(r.schema),
        examples: r.examples
          ? Object.fromEntries(
              Object.entries(r.examples)
                .map(([f, m]) => {
                  var b;
                  return [
                    f,
                    i.isReference(m) ? ((b = u.examples) == null ? void 0 : b[m.$ref.split("/").pop() ?? ""]) : m,
                  ];
                })
                .filter(([f, m]) => m !== void 0),
            )
          : void 0,
      }),
      h = (u) => (r) => {
        var f, m;
        if (i.isReference(r)) {
          const b =
            (m = (f = u.components) == null ? void 0 : f.requestBodies) == null
              ? void 0
              : m[r.$ref.split("/").pop() ?? ""];
          if (b === void 0) return;
          r = b;
        }
        return { ...r, content: r.content ? y(u.components ?? {})(r.content) : void 0 };
      },
      o = (u) => (r) => {
        var f, m;
        if (i.isReference(r)) {
          const b =
            (m = (f = u.components) == null ? void 0 : f.responses) == null ? void 0 : m[r.$ref.split("/").pop() ?? ""];
          if (b === void 0) return;
          r = b;
        }
        return {
          ...r,
          content: r.content ? y(u.components ?? {})(r.content) : void 0,
          headers: r.headers
            ? Object.fromEntries(
                Object.entries(r.headers)
                  .filter(([b, p]) => p !== void 0)
                  .map(([b, p]) => [
                    b,
                    (() => {
                      var v, O;
                      if (i.isReference(p) === !1) return c(u.components ?? {})({ ...p, in: "header" });
                      const g = p.$ref.startsWith("#/components/headers/")
                        ? (O = (v = u.components) == null ? void 0 : v.headers) == null
                          ? void 0
                          : O[p.$ref.split("/").pop() ?? ""]
                        : void 0;
                      return g !== void 0 ? c(u.components ?? {})({ ...g, in: "header" }) : void 0;
                    })(),
                  ])
                  .filter(([b, p]) => p !== void 0),
              )
            : void 0,
        };
      },
      y = (u) => (r) =>
        Object.fromEntries(
          Object.entries(r)
            .filter(([f, m]) => m !== void 0)
            .map(([f, m]) => [
              f,
              {
                ...m,
                schema: m.schema ? a(u)(m.schema) : void 0,
                examples: m.examples
                  ? Object.fromEntries(
                      Object.entries(m.examples)
                        .map(([b, p]) => {
                          var g;
                          return [
                            b,
                            i.isReference(p)
                              ? (g = u.examples) == null
                                ? void 0
                                : g[p.$ref.split("/").pop() ?? ""]
                              : p,
                          ];
                        })
                        .filter(([b, p]) => p !== void 0),
                    )
                  : void 0,
              },
            ]),
        ),
      _ = (u) => ({
        schemas: Object.fromEntries(
          Object.entries(u.schemas ?? {})
            .filter(([r, f]) => f !== void 0)
            .map(([r, f]) => [r, a(u)(f)]),
        ),
        securitySchemes: u.securitySchemes,
      }),
      a = (u) => (r) => {
        const f = [],
          m = {
            title: r.title,
            description: r.description,
            ...Object.fromEntries(Object.entries(r).filter(([g, v]) => g.startsWith("x-") && v !== void 0)),
          },
          b = { value: !1, default: void 0 },
          p = (g) => {
            var v, O, x, Q, ee, L, K;
            if (
              (g.nullable === !0 && (b.value || (b.value = !0), g.default === null && (b.default = null)),
              Array.isArray(g.enum) &&
                (v = g.enum) != null &&
                v.length &&
                (O = g.enum) != null &&
                O.some((q) => q === null) &&
                (b.value || (b.value = !0)),
              i.isMixed(g))
            ) {
              g.const !== void 0 &&
                p({ ...g, type: void 0, oneOf: void 0, anyOf: void 0, allOf: void 0, $ref: void 0 }),
                g.oneOf !== void 0 && p({ ...g, type: void 0, anyOf: void 0, allOf: void 0, $ref: void 0 }),
                g.anyOf !== void 0 && p({ ...g, type: void 0, oneOf: void 0, allOf: void 0, $ref: void 0 }),
                g.allOf !== void 0 && p({ ...g, type: void 0, oneOf: void 0, anyOf: void 0, $ref: void 0 });
              for (const q of g.type)
                p(
                  q === "boolean" || q === "number" || q === "string"
                    ? {
                        ...g,
                        enum:
                          (x = g.enum) != null && x.length && g.enum.filter((j) => j !== null)
                            ? g.enum.filter((j) => typeof j === q)
                            : void 0,
                        type: q,
                      }
                    : q === "integer"
                      ? {
                          ...g,
                          enum:
                            (Q = g.enum) != null && Q.length && g.enum.filter((j) => j !== null)
                              ? g.enum.filter((j) => j !== null && typeof j == "number" && Number.isInteger(j))
                              : void 0,
                          type: q,
                        }
                      : { ...g, type: q },
                );
            } else if (i.isOneOf(g)) g.oneOf.forEach(p);
            else if (i.isAnyOf(g)) g.anyOf.forEach(p);
            else if (i.isAllOf(g)) g.allOf.length === 1 ? p(g.allOf[0]) : f.push(l(u)(g));
            else if (i.isBoolean(g))
              if ((ee = g.enum) != null && ee.length && g.enum.filter((q) => q !== null).length)
                for (const q of g.enum.filter((j) => j !== null))
                  f.push({ const: q, ...g, type: void 0, enum: void 0, default: void 0 });
              else f.push({ ...g, default: g.default ?? void 0, enum: void 0 });
            else if (i.isInteger(g) || i.isNumber(g))
              if ((L = g.enum) != null && L.length && g.enum.filter((q) => q !== null))
                for (const q of g.enum.filter((j) => j !== null))
                  f.push({
                    const: q,
                    ...g,
                    type: void 0,
                    enum: void 0,
                    default: void 0,
                    minimum: void 0,
                    maximum: void 0,
                    exclusiveMinimum: void 0,
                    exclusiveMaximum: void 0,
                    multipleOf: void 0,
                  });
              else
                f.push({
                  ...g,
                  default: g.default ?? void 0,
                  enum: void 0,
                  ...(typeof g.exclusiveMinimum == "number"
                    ? { minimum: g.exclusiveMinimum, exclusiveMinimum: !0 }
                    : { exclusiveMinimum: g.exclusiveMinimum }),
                  ...(typeof g.exclusiveMaximum == "number"
                    ? { maximum: g.exclusiveMaximum, exclusiveMaximum: !0 }
                    : { exclusiveMaximum: g.exclusiveMaximum }),
                });
            else if (i.isString(g))
              if ((K = g.enum) != null && K.length && g.enum.filter((q) => q !== null).length)
                for (const q of g.enum.filter((j) => j !== null))
                  f.push({ const: q, ...g, type: void 0, enum: void 0, default: void 0 });
              else f.push({ ...g, default: g.default ?? void 0, enum: void 0 });
            else
              i.isArray(g)
                ? Array.isArray(g.items)
                  ? f.push({
                      ...g,
                      items: void 0,
                      prefixItems: g.items.map(a(u)),
                      additionalItems:
                        typeof g.additionalItems == "object" && g.additionalItems !== null
                          ? a(u)(g.additionalItems)
                          : g.additionalItems,
                    })
                  : Array.isArray(g.prefixItems)
                    ? f.push({
                        ...g,
                        items: void 0,
                        prefixItems: g.prefixItems.map(a(u)),
                        additionalItems:
                          typeof g.additionalItems == "object" && g.additionalItems !== null
                            ? a(u)(g.additionalItems)
                            : g.additionalItems,
                      })
                    : g.items === void 0
                      ? f.push({ ...g, items: void 0, prefixItems: [] })
                      : f.push({ ...g, items: a(u)(g.items), prefixItems: void 0, additionalItems: void 0 })
                : i.isObject(g)
                  ? f.push({
                      ...g,
                      properties: g.properties
                        ? Object.fromEntries(
                            Object.entries(g.properties)
                              .filter(([q, j]) => j !== void 0)
                              .map(([q, j]) => [q, a(u)(j)]),
                          )
                        : {},
                      additionalProperties: g.additionalProperties
                        ? typeof g.additionalProperties == "object" && g.additionalProperties !== null
                          ? a(u)(g.additionalProperties)
                          : g.additionalProperties
                        : void 0,
                      required: g.required ?? [],
                    })
                  : i.isRecursiveReference(g)
                    ? f.push({ ...g, $ref: g.$recursiveRef, $recursiveRef: void 0 })
                    : f.push(g);
          };
        return (
          p(r),
          b.value === !0 && !f.some((g) => g.type === "null") && f.push({ type: "null", default: b.default }),
          {
            ...(f.length === 0
              ? { type: void 0 }
              : f.length === 1
                ? { ...f[0] }
                : { oneOf: f.map((g) => ({ ...g, nullable: void 0 })) }),
            ...m,
            nullable: void 0,
          }
        );
      },
      l = (u) => (r) => {
        const f = r.allOf.map((m) => d(u)(m));
        return f.some((m) => m === null)
          ? { type: void 0, allOf: void 0 }
          : {
              ...r,
              type: "object",
              properties: Object.fromEntries(
                f
                  .map((m) => Object.entries((m == null ? void 0 : m.properties) ?? {}))
                  .flat()
                  .map(([m, b]) => [m, a(u)(b)]),
              ),
              allOf: void 0,
              required: [...new Set(f.map((m) => (m == null ? void 0 : m.required) ?? []).flat())],
            };
      },
      d =
        (u) =>
        (r, f = new Set()) => {
          var m, b;
          return i.isObject(r)
            ? r.properties !== void 0 && !r.additionalProperties
              ? r
              : null
            : f.has(r)
              ? null
              : (f.add(r),
                i.isReference(r)
                  ? d(u)(((m = u.schemas) == null ? void 0 : m[r.$ref.split("/").pop() ?? ""]) ?? {}, f)
                  : i.isRecursiveReference(r)
                    ? d(u)(((b = u.schemas) == null ? void 0 : b[r.$recursiveRef.split("/").pop() ?? ""]) ?? {}, f)
                    : null);
        };
    let i;
    (function (u) {
      (u.isConstant = (r) => r.const !== void 0),
        (u.isBoolean = (r) => r.type === "boolean"),
        (u.isInteger = (r) => r.type === "integer"),
        (u.isNumber = (r) => r.type === "number"),
        (u.isString = (r) => r.type === "string"),
        (u.isArray = (r) => r.type === "array"),
        (u.isObject = (r) => r.type === "object"),
        (u.isReference = (r) => r.$ref !== void 0),
        (u.isRecursiveReference = (r) => r.$recursiveRef !== void 0),
        (u.isAllOf = (r) => r.allOf !== void 0),
        (u.isAnyOf = (r) => r.anyOf !== void 0),
        (u.isOneOf = (r) => r.oneOf !== void 0),
        (u.isNullOnly = (r) => r.type === "null"),
        (u.isMixed = (r) => Array.isArray(r.type));
    })(i || (i = {}));
  })(Ht || (Ht = {}));
  var Dt;
  (function (n) {
    n.downgrade = (a) => {
      var d, i, u;
      const l = n.downgradeComponents(a.components);
      return {
        swagger: "2.0",
        info: a.info,
        host: (i = (d = a.servers) == null ? void 0 : d[0]) != null && i.url ? a.servers[0].url.split("://").pop() : "",
        definitions: l.downgraded,
        securityDefinitions:
          (u = a.components) != null && u.securitySchemes
            ? Object.fromEntries(
                Object.entries(a.components.securitySchemes)
                  .filter(([r, f]) => f !== void 0)
                  .map(([r, f]) => y(f).map((m) => [r, m]))
                  .flat(),
              )
            : void 0,
        paths: a.paths
          ? Object.fromEntries(
              Object.entries(a.paths)
                .filter(([r, f]) => f !== void 0)
                .map(([r, f]) => [r, e(l)(f)]),
            )
          : void 0,
        security: a.security,
        tags: a.tags,
      };
    };
    const e = (a) => (l) => ({
        ...l,
        ...(l.get ? { get: t(a)(l.get) } : void 0),
        ...(l.put ? { put: t(a)(l.put) } : void 0),
        ...(l.post ? { post: t(a)(l.post) } : void 0),
        ...(l.delete ? { delete: t(a)(l.delete) } : void 0),
        ...(l.options ? { options: t(a)(l.options) } : void 0),
        ...(l.head ? { head: t(a)(l.head) } : void 0),
        ...(l.patch ? { patch: t(a)(l.patch) } : void 0),
        ...(l.trace ? { trace: t(a)(l.trace) } : void 0),
      }),
      t = (a) => (l) => ({
        ...l,
        parameters:
          l.parameters !== void 0 || l.requestBody !== void 0
            ? [...(l.parameters ?? []).map(s(a)), ...(l.requestBody ? [c(a)(l.requestBody)] : [])]
            : void 0,
        responses: l.responses
          ? Object.fromEntries(
              Object.entries(l.responses)
                .filter(([d, i]) => i !== void 0)
                .map(([d, i]) => [d, h(a)(i)]),
            )
          : void 0,
        requestBody: void 0,
        servers: void 0,
      }),
      s = (a) => (l, d) => {
        var i;
        return {
          ...n.downgradeSchema(a)(l.schema),
          ...l,
          required: (i = l.schema) == null ? void 0 : i.required,
          schema: void 0,
          name: l.name ?? `p${d}`,
          example: void 0,
          examples: void 0,
        };
      },
      c = (a) => (l) => {
        var d;
        return {
          name: "body",
          in: "body",
          description: l.description,
          required: l.required,
          schema: n.downgradeSchema(a)(((d = Object.values(l.content ?? {})[0]) == null ? void 0 : d.schema) ?? {}),
        };
      },
      h = (a) => (l) => {
        var d;
        return {
          description: l.description,
          schema: n.downgradeSchema(a)(((d = Object.values(l.content ?? {})[0]) == null ? void 0 : d.schema) ?? {}),
          headers: l.headers
            ? Object.fromEntries(
                Object.entries(l.headers)
                  .filter(([i, u]) => u !== void 0)
                  .map(([i, u]) => [
                    i,
                    { ...u, schema: n.downgradeSchema(a)(u.schema), example: void 0, examples: void 0 },
                  ]),
              )
            : void 0,
        };
      };
    (n.downgradeComponents = (a) => {
      const l = { original: a, downgraded: {} };
      if (a.schemas) {
        l.downgraded.schemas = {};
        for (const [d, i] of Object.entries(a.schemas))
          i !== void 0 && (l.downgraded[d.split("/").pop()] = n.downgradeSchema(l)(i));
      }
      return l;
    }),
      (n.downgradeSchema = (a) => (l) => {
        const d = _(new Set())(a.original)(l),
          i = [],
          u = {
            title: l.title,
            description: l.description,
            example: l.example,
            examples: l.examples ? Object.values(l.examples) : void 0,
            ...Object.fromEntries(Object.entries(l).filter(([f, m]) => f.startsWith("x-") && m !== void 0)),
          },
          r = (f) => {
            w.isBoolean(f)
              ? i.push({ type: "boolean" })
              : w.isBoolean(f) || w.isInteger(f) || w.isNumber(f) || w.isString(f)
                ? i.push({ ...f, examples: f.examples ? Object.values(f.examples) : void 0 })
                : w.isReference(f)
                  ? i.push({ $ref: `#/definitions/${f.$ref.split("/").pop()}` })
                  : w.isArray(f)
                    ? i.push({
                        ...f,
                        items: n.downgradeSchema(a)(f.items),
                        examples: f.examples ? Object.values(f.examples) : void 0,
                      })
                    : w.isTuple(f)
                      ? i.push({
                          ...f,
                          items: (() => {
                            if (f.additionalItems === !0) return {};
                            const m = [
                              ...f.prefixItems,
                              ...(typeof f.additionalItems == "object"
                                ? [n.downgradeSchema(a)(f.additionalItems)]
                                : []),
                            ];
                            return m.length === 0 ? {} : { "x-oneOf": m.map(n.downgradeSchema(a)) };
                          })(),
                          minItems: f.prefixItems.length,
                          maxItems: f.additionalItems ? void 0 : f.prefixItems.length,
                          prefixItems: void 0,
                          additionalItems: void 0,
                          examples: f.examples ? Object.values(f.examples) : void 0,
                        })
                      : w.isObject(f)
                        ? i.push({
                            ...f,
                            properties: f.properties
                              ? Object.fromEntries(
                                  Object.entries(f.properties)
                                    .filter(([m, b]) => b !== void 0)
                                    .map(([m, b]) => [m, n.downgradeSchema(a)(b)]),
                                )
                              : void 0,
                            additionalProperties:
                              typeof f.additionalProperties == "object"
                                ? n.downgradeSchema(a)(f.additionalProperties)
                                : f.additionalProperties,
                            required: f.required,
                            examples: f.examples ? Object.values(f.examples) : void 0,
                          })
                        : w.isOneOf(f) && f.oneOf.forEach(r);
          };
        if ((r(l), d)) for (const f of i) w.isReference(f) ? o(new Set())(a)(f) : (f["x-nullable"] = !0);
        return d === !0 && i.length === 0
          ? { type: "null", ...u }
          : {
              ...(i.length === 0 ? { type: void 0 } : i.length === 1 ? { ...i[0] } : { "x-oneOf": i }),
              ...u,
              ...(i.length > 1 ? { discriminator: void 0 } : {}),
            };
      });
    const o = (a) => (l) => (d) => {
        var r;
        const i = d.$ref.split("/").pop();
        if (i.endsWith(".Nullable")) return;
        const u = (r = l.original.schemas) == null ? void 0 : r[i];
        if (u !== void 0) {
          {
            if (_(a)(l.original)(u) === !0) return;
            l.downgraded[`${i}.Nullable`] === void 0 &&
              ((l.downgraded[`${i}.Nullable`] = {}),
              (l.downgraded[`${i}.Nullable`] = n.downgradeSchema(l)(
                w.isOneOf(u)
                  ? { ...u, oneOf: [...u.oneOf, { type: "null" }] }
                  : {
                      title: u.title,
                      description: u.description,
                      example: u.example,
                      examples: u.examples ? Object.values(u.examples) : void 0,
                      ...Object.fromEntries(Object.entries(u).filter(([f, m]) => f.startsWith("x-") && m !== void 0)),
                      oneOf: [u, { type: "null" }],
                    },
              )));
          }
          d.$ref += ".Nullable";
        }
      },
      y = (a) => {
        if (a.type === "apiKey") return [a];
        if (a.type === "http") return a.scheme === "basic" ? [{ type: "basic", description: a.description }] : [];
        if (a.type === "oauth2") {
          const l = [];
          return (
            a.flows.implicit &&
              l.push({
                type: "oauth2",
                flow: "implicit",
                authorizationUrl: a.flows.implicit.authorizationUrl,
                scopes: a.flows.implicit.scopes,
              }),
            a.flows.password &&
              l.push({
                type: "oauth2",
                flow: "password",
                tokenUrl: a.flows.password.tokenUrl,
                scopes: a.flows.password.scopes,
              }),
            a.flows.clientCredentials &&
              l.push({
                type: "oauth2",
                flow: "application",
                tokenUrl: a.flows.clientCredentials.tokenUrl,
                scopes: a.flows.clientCredentials.scopes,
              }),
            a.flows.authorizationCode &&
              l.push({
                type: "oauth2",
                flow: "accessCode",
                authorizationUrl: a.flows.authorizationCode.authorizationUrl,
                tokenUrl: a.flows.authorizationCode.tokenUrl,
                scopes: a.flows.authorizationCode.scopes,
              }),
            l
          );
        }
        return [];
      },
      _ = (a) => (l) => (d) => {
        var i;
        if (w.isNull(d)) return !0;
        if (w.isReference(d)) {
          if (a.has(d.$ref)) return !1;
          a.add(d.$ref);
          const u = d.$ref.split("/").pop(),
            r = (i = l.schemas) == null ? void 0 : i[u];
          return r ? _(a)(l)(r) : !1;
        }
        return w.isOneOf(d) && d.oneOf.some(_(a)(l));
      };
  })(Dt || (Dt = {}));
  var Wt;
  (function (n) {
    n.convert = (d) => ({
      openapi: "3.1.0",
      info: d.info,
      components: o(d),
      paths: d.paths
        ? Object.fromEntries(
            Object.entries(d.paths)
              .filter(([i, u]) => u !== void 0)
              .map(([i, u]) => [i, e(d)(u)]),
          )
        : void 0,
      servers: d.host ? [{ url: d.host }] : void 0,
      security: d.security,
      tags: d.tags,
      "x-samchon-emended": !0,
    });
    const e = (d) => (i) => ({
        ...i,
        ...(i.get ? { get: t(d)(i)(i.get) } : void 0),
        ...(i.put ? { put: t(d)(i)(i.put) } : void 0),
        ...(i.post ? { post: t(d)(i)(i.post) } : void 0),
        ...(i.delete ? { delete: t(d)(i)(i.delete) } : void 0),
        ...(i.options ? { options: t(d)(i)(i.options) } : void 0),
        ...(i.head ? { head: t(d)(i)(i.head) } : void 0),
        ...(i.patch ? { patch: t(d)(i)(i.patch) } : void 0),
        ...(i.trace ? { trace: t(d)(i)(i.trace) } : void 0),
      }),
      t = (d) => (i) => (u) => ({
        ...u,
        parameters:
          i.parameters !== void 0 || u.parameters !== void 0
            ? [...(i.parameters ?? []), ...(u.parameters ?? [])]
                .map((r) => {
                  var f;
                  return l.isReference(r)
                    ? (f = d.parameters) == null
                      ? void 0
                      : f[r.$ref.split("/").pop() ?? ""]
                    : r;
                })
                .filter((r) => r !== void 0 && r.in !== "body" && r.schema === void 0)
                .map(s(d.definitions ?? {}))
            : void 0,
        requestBody: (() => {
          var f;
          const r =
            (f = u.parameters) == null
              ? void 0
              : f.find((m) => {
                  var b;
                  return (
                    l.isReference(m) && (m = (b = d.parameters) == null ? void 0 : b[m.$ref.split("/").pop() ?? ""]),
                    (m == null ? void 0 : m.schema) !== void 0
                  );
                });
          return r ? c(d.definitions ?? {})(r) : void 0;
        })(),
        responses: u.responses
          ? Object.fromEntries(
              Object.entries(u.responses)
                .filter(([r, f]) => f !== void 0)
                .map(([r, f]) => [r, h(d)(f)])
                .filter(([r, f]) => f !== void 0),
            )
          : void 0,
      }),
      s = (d) => (i) => ({
        name: i.name,
        in: i.in,
        description: i.description,
        schema: n.convertSchema(d)(i),
        required: !0,
      }),
      c = (d) => (i) => ({
        description: i.description,
        content: { "application/json": { schema: n.convertSchema(d)(i.schema) } },
      }),
      h = (d) => (i) => {
        var u;
        if (l.isReference(i)) {
          const r = (u = d.responses) == null ? void 0 : u[i.$ref.split("/").pop() ?? ""];
          if (r === void 0) return;
          i = r;
        }
        return {
          description: i.description,
          content: i.schema
            ? { "application/json": { schema: n.convertSchema(d.definitions ?? {})(i.schema), example: i.example } }
            : void 0,
          headers: i.headers
            ? Object.fromEntries(
                Object.entries(i.headers)
                  .filter(([r, f]) => f !== void 0)
                  .map(([r, f]) => [r, { schema: n.convertSchema(d.definitions ?? {})(f), in: "header" }]),
              )
            : void 0,
        };
      },
      o = (d) => ({
        schemas: Object.fromEntries(
          Object.entries(d.definitions ?? {})
            .filter(([i, u]) => u !== void 0)
            .map(([i, u]) => [i, n.convertSchema(d.definitions ?? {})(u)]),
        ),
        securitySchemes: d.securityDefinitions
          ? Object.fromEntries(
              Object.entries(d.securityDefinitions)
                .filter(([i, u]) => u !== void 0)
                .map(([i, u]) => [i, y(u)])
                .filter(([i, u]) => u !== void 0),
            )
          : void 0,
      }),
      y = (d) => {
        if (d.type === "apiKey") return d;
        if (d.type === "basic") return { type: "http", scheme: "basic", description: d.description };
        if (d.type === "oauth2")
          return d.flow === "implicit"
            ? {
                type: "oauth2",
                description: d.description,
                flows: { implicit: { authorizationUrl: d.authorizationUrl, scopes: d.scopes } },
              }
            : d.flow === "accessCode"
              ? {
                  type: "oauth2",
                  description: d.description,
                  flows: {
                    authorizationCode: { authorizationUrl: d.authorizationUrl, tokenUrl: d.tokenUrl, scopes: d.scopes },
                  },
                }
              : d.flow === "password"
                ? {
                    type: "oauth2",
                    description: d.description,
                    flows: { password: { tokenUrl: d.tokenUrl, scopes: d.scopes } },
                  }
                : d.flow === "application"
                  ? {
                      type: "oauth2",
                      description: d.description,
                      flows: { clientCredentials: { tokenUrl: d.tokenUrl, scopes: d.scopes } },
                    }
                  : void 0;
      };
    n.convertSchema = (d) => (i) => {
      const u = { value: !1, default: void 0 },
        r = [],
        f = {
          title: i.title,
          description: i.description,
          ...Object.fromEntries(Object.entries(i).filter(([b, p]) => b.startsWith("x-") && p !== void 0)),
          example: i.example,
          examples: i.examples ? Object.fromEntries(i.examples.map((b, p) => [p.toString(), b])) : void 0,
        },
        m = (b) => {
          var p, g, v;
          b["x-nullable"] === !0 && (u.value || (u.value = !0), b.default === null && (u.default = null)),
            Array.isArray(b.enum) &&
              (p = b.enum) != null &&
              p.length &&
              (g = b.enum) != null &&
              g.some((O) => O === null) &&
              (u.value || (u.value = !0)),
            l.isAnyOf(b)
              ? b["x-anyOf"].forEach(m)
              : l.isOneOf(b)
                ? b["x-oneOf"].forEach(m)
                : l.isAllOf(b)
                  ? b.allOf.length === 1
                    ? m(b.allOf[0])
                    : r.push(_(d)(b))
                  : l.isBoolean(b) || l.isInteger(b) || l.isNumber(b) || l.isString(b)
                    ? (v = b.enum) != null && v.length && b.enum.filter((O) => O !== null).length
                      ? r.push(...b.enum.filter((O) => O !== null).map((O) => ({ const: O })))
                      : r.push({
                          ...b,
                          default: b.default ?? void 0,
                          examples: b.examples
                            ? Object.fromEntries(b.examples.map((O, x) => [x.toString(), O]))
                            : void 0,
                          enum: void 0,
                        })
                    : l.isArray(b)
                      ? r.push({
                          ...b,
                          items: n.convertSchema(d)(b.items),
                          examples: b.examples
                            ? Object.fromEntries(b.examples.map((O, x) => [x.toString(), O]))
                            : void 0,
                        })
                      : l.isObject(b)
                        ? r.push({
                            ...b,
                            properties: b.properties
                              ? Object.fromEntries(
                                  Object.entries(b.properties)
                                    .filter(([O, x]) => x !== void 0)
                                    .map(([O, x]) => [O, n.convertSchema(d)(x)]),
                                )
                              : {},
                            additionalProperties: b.additionalProperties
                              ? typeof b.additionalProperties == "object" && b.additionalProperties !== null
                                ? n.convertSchema(d)(b.additionalProperties)
                                : b.additionalProperties
                              : void 0,
                            examples: b.examples
                              ? Object.fromEntries(b.examples.map((O, x) => [x.toString(), O]))
                              : void 0,
                            required: b.required ?? [],
                          })
                        : l.isReference(b)
                          ? r.push({
                              ...b,
                              $ref: b.$ref.replace("#/definitions/", "#/components/schemas/"),
                              examples: b.examples
                                ? Object.fromEntries(b.examples.map((O, x) => [x.toString(), O]))
                                : void 0,
                            })
                          : r.push({
                              ...b,
                              examples: b.examples
                                ? Object.fromEntries(b.examples.map((O, x) => [x.toString(), O]))
                                : void 0,
                            });
        };
      if (
        (m(i),
        u.value === !0 && !r.some((b) => b.type === "null") && r.push({ type: "null", default: u.default }),
        r.length === 2 && r.filter((b) => w.isNull(b)).length === 1)
      ) {
        const b = r.filter((p) => w.isNull(p) === !1)[0];
        for (const p of ["title", "description", "deprecated", "example", "examples"]) b[p] !== void 0 && delete b[p];
      }
      return {
        ...(r.length === 0
          ? { type: void 0 }
          : r.length === 1
            ? { ...r[0] }
            : { oneOf: r.map((b) => ({ ...b, "x-nullable": void 0 })) }),
        ...f,
        "x-nullable": void 0,
      };
    };
    const _ = (d) => (i) => {
        const u = i.allOf.map((r) => a(d)(r));
        return u.some((r) => r === null)
          ? { type: void 0, allOf: void 0 }
          : {
              ...i,
              type: "object",
              properties: Object.fromEntries(
                u
                  .map((r) => Object.entries((r == null ? void 0 : r.properties) ?? {}))
                  .flat()
                  .map(([r, f]) => [r, n.convertSchema(d)(f)]),
              ),
              allOf: void 0,
              required: [...new Set(u.map((r) => (r == null ? void 0 : r.required) ?? []).flat())],
            };
      },
      a =
        (d) =>
        (i, u = new Set()) =>
          l.isObject(i)
            ? i.properties !== void 0 && !i.additionalProperties
              ? i
              : null
            : u.has(i)
              ? null
              : (u.add(i),
                l.isReference(i) ? a(d)((d == null ? void 0 : d[i.$ref.split("/").pop() ?? ""]) ?? {}, u) : null);
    let l;
    (function (d) {
      (d.isBoolean = (i) => i.type === "boolean"),
        (d.isInteger = (i) => i.type === "integer"),
        (d.isNumber = (i) => i.type === "number"),
        (d.isString = (i) => i.type === "string"),
        (d.isArray = (i) => i.type === "array"),
        (d.isObject = (i) => i.type === "object"),
        (d.isReference = (i) => i.$ref !== void 0),
        (d.isAllOf = (i) => i.allOf !== void 0),
        (d.isOneOf = (i) => i["x-oneOf"] !== void 0),
        (d.isAnyOf = (i) => i["x-anyOf"] !== void 0),
        (d.isNullOnly = (i) => i.type === "null");
    })(l || (l = {}));
  })(Wt || (Wt = {}));
  var Ut;
  (function (n) {
    function e(s) {
      if (et.is(s)) return Ht.convert(s);
      if (Te.is(s)) return Ft.convert(s);
      if (tt.is(s)) return Wt.convert(s);
      throw new TypeError("Unrecognized Swagger/OpenAPI version.");
    }
    n.convert = e;
    function t(s, c) {
      if (c === "2.0") return Dt.downgrade(s);
      if (c === "3.0") return rt.downgrade(s);
      throw new TypeError("Unrecognized Swagger/OpenAPI version.");
    }
    n.downgrade = t;
  })(Ut || (Ut = {}));
  class Fn extends Error {
    constructor(e, t, s, c, h) {
      super(h), (this.method = e), (this.path = t), (this.status = s), (this.headers = c), (this.body_ = Hn);
      const o = new.target.prototype;
      Object.setPrototypeOf ? Object.setPrototypeOf(this, o) : (this.__proto__ = o);
    }
    toJSON() {
      if (this.body_ === Hn)
        try {
          this.body_ = JSON.parse(this.message);
        } catch {
          this.body_ = this.message;
        }
      return { method: this.method, path: this.path, status: this.status, headers: this.headers, message: this.body_ };
    }
  }
  const Hn = {};
  var Jt;
  (function (n) {
    function e(h) {
      const o = [];
      for (let _ = 0; _ < h.length; _++) {
        const a = h.charCodeAt(_);
        65 <= a && a <= 90 && o.push(_);
      }
      for (let _ = o.length - 1; _ > 0; --_) {
        const a = o[_],
          l = o[_ - 1];
        a - l === 1 && o.splice(_, 1);
      }
      if ((o.length !== 0 && o[0] === 0 && o.splice(0, 1), o.length === 0)) return h.toLowerCase();
      let y = "";
      for (let _ = 0; _ < o.length; _++) {
        const a = _ === 0 ? 0 : o[_ - 1],
          l = o[_];
        (y += h.substring(a, l).toLowerCase()), (y += "_");
      }
      return (y += h.substring(o[o.length - 1]).toLowerCase()), y;
    }
    n.snake = e;
    function t(h) {
      return c((o) => (o.length === 0 ? o : o[0] === o[0].toUpperCase() ? o[0].toLowerCase() + o.substring(1) : o))(h);
    }
    n.camel = t;
    function s(h) {
      return c((o) => (o.length === 0 ? o : o[0] === o[0].toLowerCase() ? o[0].toUpperCase() + o.substring(1) : o))(h);
    }
    n.pascal = s;
    const c = (h) => (o) => {
      let y = "";
      for (let i = 0; i < o.length && o[i] === "_"; i++) y += "_";
      y.length !== 0 && (o = o.substring(y.length));
      const _ = [];
      for (let i = 0; i < o.length; i++) {
        if (o[i] !== "_") continue;
        const r = _[_.length - 1];
        r === void 0 || r[0] + r[1] !== i ? _.push([i, 1]) : ++r[1];
      }
      if (_.length === 0) return y + h(o);
      let a = "";
      for (let i = 0; i < _.length; i++) {
        const [u] = _[i];
        if (i === 0) u === 0 ? (a += "_") : (a += o.substring(0, u));
        else {
          const [r, f] = _[i - 1],
            m = o.substring(r + f, u);
          m.length && (a += Dn(m));
        }
      }
      const l = _[_.length - 1],
        d = o.substring(l[0] + l[1]);
      return l.length && (a += Dn(d)), y + h(a);
    };
  })(Jt || (Jt = {}));
  const Dn = (n) => (n.length !== 0 ? n[0].toUpperCase() + n.slice(1).toLowerCase() : n);
  var A;
  (function (n) {
    (n.capitalize = (e) => (e.length !== 0 ? e[0].toUpperCase() + e.slice(1).toLowerCase() : e)),
      (n.pascal = (e) =>
        n
          .splitWithNormalization(e)
          .filter((t) => t[0] !== "{")
          .map(Jt.pascal)
          .join("")),
      (n.splitWithNormalization = (e) =>
        e
          .split("/")
          .map((t) => n.normalize(t.trim()))
          .filter((t) => !!t.length)),
      (n.reJoinWithDecimalParameters = (e) =>
        e
          .split("/")
          .filter((t) => !!t.length)
          .map((t) => (t[0] === "{" && t[t.length - 1] === "}" ? `:${t.substring(1, t.length - 1)}` : t))
          .join("/")),
      (n.normalize = (e) => (
        (e = e.split(".").join("_").split("-").join("_").trim()),
        Tr.has(e) ? `_${e}` : (e.length !== 0 && "0" <= e[0] && e[0] <= "9" && (e = `_${e}`), e)
      )),
      (n.escapeDuplicate = (e) => (t) => (e.includes(t) ? n.escapeDuplicate(e)(`_${t}`) : t));
  })(A || (A = {}));
  const Tr = new Set([
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "module",
    "new",
    "null",
    "package",
    "public",
    "private",
    "protected",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
  ]);
  var De;
  (function (n) {
    (n.variable = (e) => n.reserved(e) === !1 && /^[a-zA-Z_$][a-zA-Z_$0-9]*$/g.test(e)),
      (n.reserved = (e) => es.has(e));
  })(De || (De = {}));
  const es = new Set([
    "break",
    "case",
    "catch",
    "class",
    "const",
    "continue",
    "debugger",
    "default",
    "delete",
    "do",
    "else",
    "enum",
    "export",
    "extends",
    "false",
    "finally",
    "for",
    "function",
    "if",
    "import",
    "in",
    "instanceof",
    "new",
    "null",
    "package",
    "return",
    "super",
    "switch",
    "this",
    "throw",
    "true",
    "try",
    "typeof",
    "var",
    "void",
    "while",
    "with",
  ]);
  var Qt;
  (function (n) {
    n.overwrite = (c) => {
      const h = s(c),
        o = e((y) =>
          y.emendedPath
            .split("/")
            .filter((_) => !!_.length && _[0] !== ":")
            .map(A.normalize)
            .map((_) => (De.variable(_) ? _ : `_${_}`)),
        )(c);
      for (const y of o.values())
        y.entries.forEach((_, a) => {
          _.alias = A.escapeDuplicate(
            [...y.children, ...y.entries.filter((i, u) => a !== u).map((i) => i.alias)].map(A.normalize),
          )(A.normalize(_.alias));
          const l = [
            ..._.route.parameters,
            ...(_.route.body ? [_.route.body] : []),
            ...(_.route.headers ? [_.route.headers] : []),
            ...(_.route.query ? [_.route.query] : []),
          ];
          l.forEach(
            (i, u) =>
              (i.key = A.escapeDuplicate(["connection", _.alias, ...l.filter((r, f) => u !== f).map((r) => r.key)])(
                i.key,
              )),
          );
          const d = _.route.operation()["x-samchon-accessor"];
          d !== void 0 && h.get(d.join(".")) === 1
            ? (_.route.accessor = d)
            : (_.route.accessor = [...y.namespace, _.alias]);
        });
    };
    const e = (c) => (h) => {
        const o = new Map();
        for (const y of h) {
          const _ = c(y);
          let a = be.take(o)(_.join("."))(() => ({ namespace: _, children: new Set(), entries: [] }));
          a.entries.push({ route: y, alias: t(y) }),
            _.slice(0, -1).forEach((d, i, u) => {
              const r = _.slice(0, u.length - i);
              be.take(o)(r.join("."))(() => ({ namespace: r, children: new Set(), entries: [] })).children.add(
                a.namespace.at(-1),
              );
            });
          const l = be.take(o)("")(() => ({ namespace: [], children: new Set(), entries: [] }));
          _.length && l.children.add(_[0]);
        }
        return o;
      },
      t = (c) => {
        const h = c.method === "delete" ? "erase" : c.method;
        return c.parameters.length === 0 ? h : h + "By" + c.parameters.map((o) => A.capitalize(o.key)).join("And");
      },
      s = (c) => {
        var o;
        const h = new Map();
        for (const y of c) {
          const _ = (o = y.operation()["x-samchon-accessor"]) == null ? void 0 : o.join(".");
          _ !== void 0 && (h.has(_) ? h.set(_, h.get(_) + 1) : h.set(_, 1));
        }
        return h;
      };
  })(Qt || (Qt = {}));
  var Lt;
  (function (n) {
    n.compose = (o) => {
      const y = s("request")((f) =>
          c({
            document: o.document,
            name: A.pascal(`I/Api/${o.path}`) + "." + A.pascal(`${o.method}/Body`),
            schema: f,
          }),
        )(o.operation.requestBody),
        _ = (() => {
          var m, b, p, g, v;
          const f = s("response")((O) =>
            c({
              document: o.document,
              name: A.pascal(`I/Api/${o.path}`) + "." + A.pascal(`${o.method}/Response`),
              schema: O,
            }),
          )(
            ((m = o.operation.responses) == null ? void 0 : m["201"]) ??
              ((b = o.operation.responses) == null ? void 0 : b["200"]) ??
              ((p = o.operation.responses) == null ? void 0 : p.default),
          );
          return (
            f && {
              ...f,
              status:
                (g = o.operation.responses) != null && g["201"]
                  ? "201"
                  : (v = o.operation.responses) != null && v["200"]
                    ? "200"
                    : "default",
            }
          );
        })(),
        a = [];
      y === !1 &&
        a.push(
          'supports only "application/json", "application/x-www-form-urlencoded", "multipart/form-data" and "text/plain" content type in the request body.',
        ),
        _ === !1 &&
          a.push(
            'supports only "application/json", "application/x-www-form-urlencoded" and "text/plain" content type in the response body.',
          );
      const [l, d] = ["header", "query"].map((f) => {
          const m = (o.operation.parameters ?? []).filter((x) => x.in === f);
          if (m.length === 0) return null;
          const b = m
              .map((x) => {
                var Q;
                return w.isObject(x.schema) ||
                  (w.isReference(x.schema) &&
                    w.isObject(
                      ((Q = o.document.components.schemas) == null
                        ? void 0
                        : Q[x.schema.$ref.replace("#/components/schemas/", "")]) ?? {},
                    ))
                  ? x.schema
                  : null;
              })
              .filter((x) => !!x),
            p = m.filter(
              (x) =>
                w.isBoolean(x.schema) ||
                w.isInteger(x.schema) ||
                w.isNumber(x.schema) ||
                w.isString(x.schema) ||
                w.isArray(x.schema) ||
                w.isTuple(x.schema),
            ),
            g = (x) => ({
              ...x,
              name: f,
              key: f,
              title: () => x.title,
              description: () => x.description,
              example: () => x.example,
              examples: () => x.examples,
            });
          if (b.length === 1 && p.length === 0) return g(m[0]);
          if (b.length > 1) return a.push(`${f} typed parameters must be only one object type`), !1;
          const v = b[0]
              ? w.isObject(b[0])
                ? b[0]
                : (o.document.components.schemas ?? {})[b[0].$ref.replace("#/components/schemas/", "")]
              : null,
            O = [
              ...b.map((x) => {
                var Q;
                return w.isObject(x)
                  ? x
                  : (Q = o.document.components.schemas) == null
                    ? void 0
                    : Q[x.$ref.replace("#/components/schemas/", "")];
              }),
              {
                type: "object",
                properties: Object.fromEntries([
                  ...p.map((x) => [x.name, { ...x.schema, description: x.schema.description ?? x.description }]),
                  ...(v ? Object.entries(v.properties ?? {}) : []),
                ]),
                required: [
                  ...new Set([
                    ...p.filter((x) => x.required).map((x) => x.name),
                    ...((v == null ? void 0 : v.required) ?? []),
                  ]),
                ],
              },
            ];
          return m.length === 0
            ? null
            : g({
                schema: c({
                  document: o.document,
                  name: A.pascal(`I/Api/${o.path}`) + "." + A.pascal(`${o.method}/${f}`),
                  schema: {
                    type: "object",
                    properties: Object.fromEntries([
                      ...new Map(
                        O.map((x) =>
                          Object.entries(x.properties ?? {}).map(([Q, ee]) => [
                            Q,
                            { ...ee, description: ee.description ?? ee.description },
                          ]),
                        ).flat(),
                      ),
                    ]),
                    required: [...new Set(O.map((x) => x.required ?? []).flat())],
                  },
                }),
              });
        }),
        i = A.splitWithNormalization(o.emendedPath)
          .filter((f) => f[0] === ":")
          .map((f) => f.substring(1)),
        u = (o.operation.parameters ?? []).filter((f) => f.in === "path");
      if (i.length !== u.length)
        if (u.length < i.length && u.every((f) => f.name !== void 0 && i.includes(f.name))) {
          for (const f of i)
            u.find((m) => m.name === f) === void 0 && u.push({ name: f, in: "path", schema: { type: "string" } });
          u.sort((f, m) => i.indexOf(f.name) - i.indexOf(m.name)),
            (o.operation.parameters = [...u, ...(o.operation.parameters ?? []).filter((f) => f.in !== "path")]);
        } else a.push("number of path parameters are not matched with its full path.");
      if (a.length) return a;
      const r = (o.operation.parameters ?? [])
        .filter((f) => f.in === "path")
        .map((f, m) => ({
          name: i[m],
          key: (() => {
            let b = A.normalize(i[m]);
            if (De.variable(b)) return b;
            for (;;) if (((b = "_" + b), !i.some((p) => p === b))) return b;
          })(),
          schema: f.schema,
          parameter: () => f,
        }));
      return {
        method: o.method,
        path: o.path,
        emendedPath: o.emendedPath,
        accessor: ["@lazy"],
        parameters: (o.operation.parameters ?? [])
          .filter((f) => f.in === "path")
          .map((f, m) => ({
            name: i[m],
            key: (() => {
              let b = A.normalize(i[m]);
              if (De.variable(b)) return b;
              for (;;) if (((b = "_" + b), !i.some((p) => p === b))) return b;
            })(),
            schema: f.schema,
            parameter: () => f,
          })),
        headers: l || null,
        query: d || null,
        body: y || null,
        success: _ || null,
        exceptions: Object.fromEntries(
          Object.entries(o.operation.responses ?? {})
            .filter(([f]) => f !== "200" && f !== "201" && f !== "default")
            .map(([f, m]) => {
              var b, p;
              return [
                f,
                {
                  schema:
                    ((p = (b = m.content) == null ? void 0 : b["application/json"]) == null ? void 0 : p.schema) ?? {},
                  response: () => m,
                  media: () => {
                    var g;
                    return ((g = m.content) == null ? void 0 : g["application/json"]) ?? {};
                  },
                },
              ];
            }),
        ),
        comment: () => e({ operation: o.operation, parameters: r, query: d || null, body: y || null }),
        operation: () => o.operation,
      };
    };
    const e = (o) => {
        var l, d;
        const y = [],
          _ = (i) => {
            y.every((u) => u !== i) && y.push(i);
          };
        let a = o.operation.description ?? "";
        if (o.operation.summary) {
          const i = o.operation.summary.endsWith(".") ? o.operation.summary : o.operation.summary + ".";
          a.length &&
            !a.startsWith(o.operation.summary) &&
            (a = `${i}
${a}`);
        }
        a = a
          .split(
            `
`,
          )
          .map((i) => i.trim()).join(`
`);
        for (const i of o.parameters ?? []) {
          const u = i.parameter();
          if (u.description || u.title) {
            const r = u.description ?? u.title;
            _(`@param ${i.name} ${t(r, i.name.length + 8)}`);
          }
        }
        (d = (l = o.body) == null ? void 0 : l.description()) != null &&
          d.length &&
          _(`@param body ${t(o.body.description(), 12)}`);
        for (const i of o.operation.security ?? [])
          for (const [u, r] of Object.entries(i)) _(`@security ${[u, ...r].join("")}`);
        return (
          o.operation.tags && o.operation.tags.forEach((i) => _(`@tag ${i}`)),
          o.operation.deprecated && _("@deprecated"),
          (a = a.length
            ? y.length
              ? `${a}

${y.join(`
`)}`
              : a
            : y.join(`
`)),
          (a = a.split("*/").join("*\\/")),
          a
        );
      },
      t = (o, y) =>
        o
          .split(
            `
`,
          )
          .map((_) => _.trim())
          .map((_, a) => (a === 0 ? _ : `${" ".repeat(y)}${_}`)).join(`
`),
      s = (o) => (y) => (_) => {
        if (!(_ != null && _.content)) return null;
        const a = Object.entries(_.content).filter(([u, r]) => !!r),
          l = a.find((u) =>
            _["x-nestia-encrypted"] === !0
              ? u[0].includes("text/plain") || u[0].includes("application/json")
              : u[0].includes("application/json") || u[0].includes("*/*"),
          );
        if (l) {
          const { schema: u } = l[1];
          return u || o === "response"
            ? {
                type: "application/json",
                name: "body",
                key: "body",
                schema: u ? (h(u) ? u : y(u)) : {},
                description: () => _.description,
                media: () => l[1],
                "x-nestia-encrypted": _["x-nestia-encrypted"],
              }
            : null;
        }
        const d = a.find((u) => u[0].includes("application/x-www-form-urlencoded"));
        if (d) {
          const { schema: u } = d[1];
          return u || o === "response"
            ? {
                type: "application/x-www-form-urlencoded",
                name: "body",
                key: "body",
                schema: u ? (h(u) ? u : y(u)) : {},
                description: () => _.description,
                media: () => d[1],
              }
            : null;
        }
        const i = a.find((u) => u[0].includes("text/plain"));
        if (i)
          return {
            type: "text/plain",
            name: "body",
            key: "body",
            schema: { type: "string" },
            description: () => _.description,
            media: () => i[1],
          };
        if (o === "request") {
          const u = a.find((r) => r[0].includes("multipart/form-data"));
          if (u) {
            const { schema: r } = u[1];
            return {
              type: "multipart/form-data",
              name: "body",
              key: "body",
              schema: r ? (h(r) ? r : y(r)) : {},
              description: () => _.description,
              media: () => u[1],
            };
          }
        }
        return !1;
      },
      c = (o) => {
        var y;
        return (
          (y = o.document.components).schemas ?? (y.schemas = {}),
          (o.document.components.schemas[o.name] = o.schema),
          { $ref: `#/components/schemas/${o.name}` }
        );
      },
      h = (o) =>
        w.isReference(o) ||
        w.isBoolean(o) ||
        w.isNumber(o) ||
        w.isString(o) ||
        w.isUnknown(o) ||
        (w.isOneOf(o) && o.oneOf.every(h)) ||
        (w.isArray(o) && h(o.items));
  })(Lt || (Lt = {}));
  var Kt;
  (function (n) {
    n.compose = (e) => {
      const t = [],
        c = Object.entries({ ...(e.paths ?? {}), ...(e.webhooks ?? {}) })
          .map(([h, o]) =>
            ["head", "get", "post", "put", "patch", "delete"]
              .filter((y) => o[y] !== void 0)
              .map((y) => {
                const _ = o[y],
                  a = Lt.compose({
                    document: e,
                    method: y,
                    path: h,
                    emendedPath: A.reJoinWithDecimalParameters(h),
                    operation: _,
                  });
                return Array.isArray(a) ? (t.push({ method: y, path: h, operation: () => _, messages: a }), null) : a;
              }),
          )
          .flat()
          .filter((h) => !!h);
      return Qt.overwrite(c), { document: () => e, routes: c, errors: t };
    };
  })(Kt || (Kt = {}));
  var je;
  (function (n) {
    (n.execute = async (e) => {
      var s;
      const t = await Wn("request", e);
      if (((s = e.route.success) == null || s.media, t.status !== 200 && t.status !== 201))
        throw new Fn(e.route.method.toUpperCase(), e.route.path, t.status, t.headers, t.body);
      return t.body;
    }),
      (n.propagate = (e) => Wn("propagate", e));
  })(je || (je = {}));
  const Wn = async (n, e) => {
      var l, d, i, u;
      const t = (r) => new Error(`Error on MigrateRouteFetcher.${n}(): ${r}`);
      if (Array.isArray(e.parameters)) {
        if (e.route.parameters.length !== e.parameters.length) throw t("number of parameters is not matched.");
      } else if (e.route.parameters.every((r) => e.parameters[r.key] !== void 0) === !1)
        throw t("number of parameters is not matched.");
      if (!!e.route.query != !!e.query) throw t("query is not matched.");
      if (!!e.route.body != (e.body !== void 0)) throw t("body is not matched.");
      const s = {
          ...(e.connection.headers ?? {}),
          ...((l = e.route.body) != null && l.type && e.route.body.type !== "multipart/form-data"
            ? { "Content-Type": e.route.body.type }
            : {}),
        },
        c = {
          ...(e.connection.options ?? {}),
          method: e.route.method.toUpperCase(),
          headers: (() => {
            const r = [];
            for (const [f, m] of Object.entries(s))
              if (m !== void 0)
                if (Array.isArray(m)) for (const b of m) r.push([f, String(b)]);
                else r.push([f, String(m)]);
            return r;
          })(),
        };
      e.body !== void 0 &&
        (c.body =
          ((d = e.route.body) == null ? void 0 : d.type) === "application/x-www-form-urlencoded"
            ? ns(e.body)
            : ((i = e.route.body) == null ? void 0 : i.type) === "multipart/form-data"
              ? rs(e.body)
              : ((u = e.route.body) == null ? void 0 : u.type) === "application/json"
                ? JSON.stringify(e.body)
                : e.body);
      const h =
          e.connection.host[e.connection.host.length - 1] !== "/" && e.route.path[0] !== "/" ? `/${Un(e)}` : Un(e),
        o = new URL(`${e.connection.host}/${h}`),
        y = await (e.connection.fetch ?? fetch)(o, c),
        _ = y.status,
        a = (r) => ({ status: _, headers: ss(y.headers), body: r });
      if (_ === 200 || _ === 201) {
        if (e.route.method.toUpperCase() === "HEAD") return a(void 0);
        if (e.route.success === null || e.route.success.type === "text/plain") return a(await y.text());
        if (e.route.success.type === "application/json") {
          const r = await y.text();
          return a(r.length ? JSON.parse(r) : void 0);
        } else {
          if (e.route.success.type === "application/x-www-form-urlencoded")
            return a(new URLSearchParams(await y.text()));
          if (e.route.success.type === "multipart/form-data") return a(await y.formData());
        }
        throw t("Unsupported response body type.");
      } else {
        const r = (y.headers.get("content-type") ?? y.headers.get("Content-Type") ?? "").split(";")[0].trim();
        return r === "" || r.startsWith("text/")
          ? a(await y.text())
          : a(
              r === "application/json"
                ? await y.json()
                : r === "application/x-www-form-urlencoded"
                  ? new URLSearchParams(await y.text())
                  : r === "multipart/form-data"
                    ? await y.formData()
                    : r === "application/octet-stream"
                      ? await y.blob()
                      : await y.text(),
            );
      }
    },
    Un = (n) => {
      let e = n.route.emendedPath;
      return (
        n.route.parameters.forEach((t, s) => {
          e = e.replace(
            `:${t.key}`,
            encodeURIComponent(String((Array.isArray(n.parameters) ? n.parameters[s] : n.parameters[t.key]) ?? "null")),
          );
        }),
        n.route.query && (e += ts(n.query ?? {})),
        e
      );
    },
    ts = (n) => {
      const e = new URLSearchParams();
      for (const [t, s] of Object.entries(n))
        s !== void 0 && (Array.isArray(s) ? s.forEach((c) => e.append(t, String(c))) : e.set(t, String(s)));
      return e.size === 0 ? "" : `?${e.toString()}`;
    },
    ns = (n) => {
      const e = new URLSearchParams();
      for (const [t, s] of Object.entries(n))
        s !== void 0 && (Array.isArray(s) ? s.forEach((c) => e.append(t, String(c))) : e.set(t, String(s)));
      return e;
    },
    rs = (n) => {
      const e = new FormData(),
        t = (s) => (c) => {
          c !== void 0 && (typeof File == "function" && c instanceof File ? e.append(s, c, c.name) : e.append(s, c));
        };
      for (const [s, c] of Object.entries(n)) Array.isArray(c) ? c.map(t(s)) : t(s)(c);
      return e;
    },
    ss = (n) => {
      const e = {};
      return (
        n.forEach((t, s) => {
          s === "set-cookie" ? (e[s] ?? (e[s] = []), e[s].push(...t.split(";").map((c) => c.trim()))) : (e[s] = t);
        }),
        e
      );
    };
  var st;
  (function (n) {
    (n.application = (e) => Kt.compose(e)), (n.execute = (e) => je.execute(e)), (n.propagate = (e) => je.propagate(e));
  })(st || (st = {}));
  var Bt;
  Bt || (Bt = {});
  var Zt;
  Zt || (Zt = {});
  var Yt;
  Yt || (Yt = {});
  var se;
  (function (n) {
    (n.isNull = (i) => i.type === "null"),
      (n.isUnknown = (i) => i.type === void 0 && !n.isAnyOf(i) && !n.isReference(i)),
      (n.isBoolean = (i) => i.type === "boolean"),
      (n.isInteger = (i) => i.type === "integer"),
      (n.isNumber = (i) => i.type === "number"),
      (n.isString = (i) => i.type === "string"),
      (n.isArray = (i) => i.type === "array" && i.items !== void 0),
      (n.isObject = (i) => i.type === "object"),
      (n.isReference = (i) => i.$ref !== void 0),
      (n.isAnyOf = (i) => i.anyOf !== void 0),
      (n.visit = (i) => {
        const u = new Set(),
          r = i.refAccessor ?? "$input.$defs",
          f = (m, b) => {
            var p;
            if ((i.closure(m, b), n.isReference(m))) {
              const g = m.$ref.split("#/$defs/").pop();
              if (u.has(g) === !0) return;
              u.add(g);
              const v = (p = i.$defs) == null ? void 0 : p[g];
              v !== void 0 && f(v, `${r}[${g}]`);
            } else if (n.isAnyOf(m)) m.anyOf.forEach((g, v) => f(g, `${b}.anyOf[${v}]`));
            else if (n.isObject(m)) {
              for (const [g, v] of Object.entries(m.properties)) f(v, `${b}.properties[${JSON.stringify(g)}]`);
              typeof m.additionalProperties == "object" &&
                m.additionalProperties !== null &&
                f(m.additionalProperties, `${b}.additionalProperties`);
            } else n.isArray(m) && f(m.items, `${b}.items`);
          };
        f(i.schema, i.accessor ?? "$input.schemas");
      }),
      (n.covers = (i) => e({ $defs: i.$defs, x: i.x, y: i.y, visited: new Map() }));
    const e = (i) => {
        var m;
        const u = (m = i.visited.get(i.x)) == null ? void 0 : m.get(i.y);
        if (u !== void 0) return u;
        const r = be.take(i.visited)(i.x)(() => new Map());
        r.set(i.y, !0);
        const f = t(i);
        return r.set(i.y, f), f;
      },
      t = (i) => {
        if (i.x === i.y) return !0;
        if (n.isReference(i.x) && n.isReference(i.y) && i.x.$ref === i.y.$ref) return !0;
        const u = l(i.$defs, i.x),
          r = l(i.$defs, i.y);
        return u.some((f) => n.isUnknown(f))
          ? !0
          : r.some((f) => n.isUnknown(f))
            ? !1
            : r.every((f) => u.some((m) => s({ $defs: i.$defs, visited: i.visited, x: m, y: f })));
      },
      s = (i) =>
        i.x === i.y || n.isUnknown(i.x)
          ? !0
          : n.isUnknown(i.y)
            ? !1
            : n.isNull(i.x)
              ? n.isNull(i.y)
              : n.isBoolean(i.x)
                ? n.isBoolean(i.y) && o(i.x, i.y)
                : n.isInteger(i.x)
                  ? n.isInteger(i.y) && y(i.x, i.y)
                  : n.isNumber(i.x)
                    ? n.isNumber(i.y) && _(i.x, i.y)
                    : n.isString(i.x)
                      ? n.isString(i.y) && a(i.x, i.y)
                      : n.isArray(i.x)
                        ? n.isArray(i.y) && c({ $defs: i.$defs, visited: i.visited, x: i.x, y: i.y })
                        : n.isObject(i.x)
                          ? n.isObject(i.y) && h({ $defs: i.$defs, visited: i.visited, x: i.x, y: i.y })
                          : n.isReference(i.x)
                            ? n.isReference(i.y) && i.x.$ref === i.y.$ref
                            : !1,
      c = (i) => e({ $defs: i.$defs, visited: i.visited, x: i.x.items, y: i.y.items }),
      h = (i) =>
        (!i.x.additionalProperties && i.y.additionalProperties) ||
        (i.x.additionalProperties &&
          i.y.additionalProperties &&
          ((typeof i.x.additionalProperties == "object" && i.y.additionalProperties === !0) ||
            (typeof i.x.additionalProperties == "object" &&
              typeof i.y.additionalProperties == "object" &&
              !e({ $defs: i.$defs, visited: i.visited, x: i.x.additionalProperties, y: i.y.additionalProperties }))))
          ? !1
          : Object.entries(i.y.properties ?? {}).every(([u, r]) => {
              var m, b, p;
              const f = (m = i.x.properties) == null ? void 0 : m[u];
              return f === void 0 ||
                ((((b = i.x.required) == null ? void 0 : b.includes(u)) ?? !1) === !0 &&
                  (((p = i.y.required) == null ? void 0 : p.includes(u)) ?? !1) === !1)
                ? !1
                : e({ $defs: i.$defs, visited: i.visited, x: f, y: r });
            }),
      o = (i, u) => {
        var r, f;
        return (r = i.enum) != null && r.length
          ? !!((f = u.enum) != null && f.length) && u.enum.every((m) => i.enum.includes(m))
          : !0;
      },
      y = (i, u) => {
        var r, f;
        return (r = i.enum) != null && r.length
          ? !!((f = u.enum) != null && f.length) && u.enum.every((m) => i.enum.includes(m))
          : i.type === u.type;
      },
      _ = (i, u) => {
        var r, f;
        return (r = i.enum) != null && r.length
          ? !!((f = u.enum) != null && f.length) && u.enum.every((m) => i.enum.includes(m))
          : i.type === u.type || (i.type === "number" && u.type === "integer");
      },
      a = (i, u) => {
        var r, f;
        return (r = i.enum) != null && r.length
          ? !!((f = u.enum) != null && f.length) && u.enum.every((m) => i.enum.includes(m))
          : i.type === u.type;
      },
      l = (i, u) => ((u = d(i, u)), n.isAnyOf(u) ? u.anyOf.map((r) => l(i, r)).flat() : [u]),
      d = (i, u) => (n.isReference(u) ? d(i, i[u.$ref.replace("#/$defs/", "")]) : u);
  })(se || (se = {}));
  var F;
  (function (n) {
    (n.isNull = (e) => $.isNull(e)),
      (n.isUnknown = (e) => $.isUnknown(e)),
      (n.isConstant = (e) => $.isConstant(e)),
      (n.isBoolean = (e) => $.isBoolean(e)),
      (n.isInteger = (e) => $.isInteger(e)),
      (n.isNumber = (e) => $.isNumber(e)),
      (n.isString = (e) => $.isString(e)),
      (n.isArray = (e) => $.isArray(e)),
      (n.isObject = (e) => $.isObject(e)),
      (n.isReference = (e) => $.isReference(e)),
      (n.isOneOf = (e) => $.isOneOf(e)),
      (n.isRecursiveReference = (e) =>
        $.isRecursiveReference({ prefix: "#/$defs/", components: { schemas: e.$defs }, schema: e.schema })),
      (n.covers = (e) => $.covers({ prefix: "#/$defs/", components: { schemas: e.$defs }, x: e.x, y: e.y })),
      (n.visit = (e) =>
        $.visit({ prefix: "#/$defs/", components: { schemas: e.$defs }, closure: e.closure, schema: e.schema }));
  })(F || (F = {}));
  var Jn = F,
    it;
  (function (n) {
    (n.visit = (y) => {
      const _ = y.accessor ?? "$input.schema";
      y.closure(y.schema, _),
        n.isObject(y.schema)
          ? Object.entries(y.schema.properties ?? {}).forEach(([a, l]) =>
              n.visit({ closure: y.closure, schema: l, accessor: `${_}.properties[${JSON.stringify(a)}]` }),
            )
          : n.isArray(y.schema) && n.visit({ closure: y.closure, schema: y.schema.items, accessor: `${_}.items` });
    }),
      (n.covers = (y, _) =>
        y === _ || n.isUnknown(y)
          ? !0
          : n.isUnknown(_)
            ? !1
            : n.isNullOnly(y)
              ? n.isNullOnly(_)
              : n.isNullOnly(_)
                ? y.nullable === !0
                : y.nullable === !0 && !_.nullable
                  ? !1
                  : n.isBoolean(y)
                    ? n.isBoolean(_) && e(y, _)
                    : n.isInteger(y)
                      ? n.isInteger(_) && t(y, _)
                      : n.isNumber(y)
                        ? (n.isNumber(_) || n.isInteger(_)) && s(y, _)
                        : n.isString(y)
                          ? n.isString(_) && c(y, _)
                          : n.isArray(y)
                            ? n.isArray(_) && h(y, _)
                            : n.isObject(y)
                              ? n.isObject(_) && o(y, _)
                              : !1);
    const e = (y, _) => y.enum === void 0 || (_.enum !== void 0 && y.enum.every((a) => _.enum.includes(a))),
      t = (y, _) =>
        y.enum !== void 0 ? _.enum !== void 0 && y.enum.every((a) => _.enum.includes(a)) : y.type === _.type,
      s = (y, _) =>
        y.enum !== void 0 ? _.enum !== void 0 && y.enum.every((a) => _.enum.includes(a)) : y.type === _.type,
      c = (y, _) =>
        y.enum !== void 0 ? _.enum !== void 0 && y.enum.every((a) => _.enum.includes(a)) : y.type === _.type,
      h = (y, _) => n.covers(y.items, _.items),
      o = (y, _) =>
        Object.entries(_.properties ?? {}).every(([a, l]) => {
          var i, u, r;
          const d = (i = y.properties) == null ? void 0 : i[a];
          return d === void 0 ||
            ((((u = y.required) == null ? void 0 : u.includes(a)) ?? !1) === !0 &&
              (((r = _.required) == null ? void 0 : r.includes(a)) ?? !1) === !1)
            ? !1
            : n.covers(d, l);
        });
    (n.isBoolean = (y) => y.type === "boolean"),
      (n.isInteger = (y) => y.type === "integer"),
      (n.isNumber = (y) => y.type === "number"),
      (n.isString = (y) => y.type === "string"),
      (n.isArray = (y) => y.type === "array"),
      (n.isObject = (y) => y.type === "object"),
      (n.isNullOnly = (y) => y.type === "null"),
      (n.isNullable = (y) => !n.isUnknown(y) && (n.isNullOnly(y) || y.nullable === !0)),
      (n.isUnknown = (y) => y.type === void 0);
  })(it || (it = {}));
  var Qn = F,
    H;
  (function (n) {
    (n.visit = (a) => {
      const l = a.accessor ?? "$input.schema";
      if ((a.closure(a.schema, l), n.isOneOf(a.schema)))
        a.schema.oneOf.forEach((d, i) => n.visit({ closure: a.closure, schema: d, accessor: `${l}.oneOf[${i}]` }));
      else if (n.isObject(a.schema)) {
        for (const [d, i] of Object.entries(a.schema.properties))
          n.visit({ closure: a.closure, schema: i, accessor: `${l}.properties[${JSON.stringify(d)}]` });
        typeof a.schema.additionalProperties == "object" &&
          a.schema.additionalProperties !== null &&
          n.visit({ closure: a.closure, schema: a.schema.additionalProperties, accessor: `${l}.additionalProperties` });
      } else n.isArray(a.schema) && n.visit({ closure: a.closure, schema: a.schema.items, accessor: `${l}.items` });
    }),
      (n.covers = (a, l) => {
        const d = _(a),
          i = _(l);
        return d.some((u) => n.isUnknown(u))
          ? !0
          : i.some((u) => n.isUnknown(u))
            ? !1
            : i.every((u) =>
                d.some((r) => {
                  if (r === u) return !0;
                  if (n.isUnknown(r)) return !0;
                  if (n.isUnknown(u)) return !1;
                  if (n.isNullOnly(r)) return n.isNullOnly(u);
                  if (n.isNullOnly(u)) return n.isNullable(r);
                  if (n.isNullable(r) && !n.isNullable(u)) return !1;
                  if (n.isBoolean(r)) return n.isBoolean(u) && e(r, u);
                  if (n.isInteger(r)) return n.isInteger(u) && t(r, u);
                  if (n.isNumber(r)) return (n.isNumber(u) || n.isInteger(u)) && s(r, u);
                  if (n.isString(r)) return n.isString(u) && c(r, u);
                  if (n.isArray(r)) return n.isArray(u) && o(r, u);
                  if (n.isObject(r)) return n.isObject(u) && y(r, u);
                  if (n.isOneOf(r)) return !1;
                }),
              );
      });
    const e = (a, l) => a.enum === void 0 || (l.enum !== void 0 && a.enum.every((d) => l.enum.includes(d))),
      t = (a, l) =>
        a.enum !== void 0
          ? l.enum !== void 0 && a.enum.every((d) => l.enum.includes(d))
          : [
              a.type === l.type,
              a.minimum === void 0 || (l.minimum !== void 0 && a.minimum <= l.minimum),
              a.maximum === void 0 || (l.maximum !== void 0 && a.maximum >= l.maximum),
              a.exclusiveMinimum !== !0 ||
                a.minimum === void 0 ||
                (l.minimum !== void 0 && (l.exclusiveMinimum === !0 || a.minimum < l.minimum)),
              a.exclusiveMaximum !== !0 ||
                a.maximum === void 0 ||
                (l.maximum !== void 0 && (l.exclusiveMaximum === !0 || a.maximum > l.maximum)),
              a.multipleOf === void 0 ||
                (l.multipleOf !== void 0 && l.multipleOf / a.multipleOf === Math.floor(l.multipleOf / a.multipleOf)),
            ].every((d) => d),
      s = (a, l) =>
        a.enum !== void 0
          ? l.enum !== void 0 && a.enum.every((d) => l.enum.includes(d))
          : [
              a.type === l.type || (a.type === "number" && l.type === "integer"),
              a.minimum === void 0 || (l.minimum !== void 0 && a.minimum <= l.minimum),
              a.maximum === void 0 || (l.maximum !== void 0 && a.maximum >= l.maximum),
              a.exclusiveMinimum !== !0 ||
                a.minimum === void 0 ||
                (l.minimum !== void 0 && (l.exclusiveMinimum === !0 || a.minimum < l.minimum)),
              a.exclusiveMaximum !== !0 ||
                a.maximum === void 0 ||
                (l.maximum !== void 0 && (l.exclusiveMaximum === !0 || a.maximum > l.maximum)),
              a.multipleOf === void 0 ||
                (l.multipleOf !== void 0 && l.multipleOf / a.multipleOf === Math.floor(l.multipleOf / a.multipleOf)),
            ].every((d) => d),
      c = (a, l) =>
        a.enum !== void 0
          ? l.enum !== void 0 && a.enum.every((d) => l.enum.includes(d))
          : [
              a.type === l.type,
              a.format === void 0 || (l.format !== void 0 && h(a.format, l.format)),
              a.pattern === void 0 || a.pattern === l.pattern,
              a.minLength === void 0 || (l.minLength !== void 0 && a.minLength <= l.minLength),
              a.maxLength === void 0 || (l.maxLength !== void 0 && a.maxLength >= l.maxLength),
            ].every((d) => d),
      h = (a, l) =>
        a === l ||
        (a === "idn-email" && l === "email") ||
        (a === "idn-hostname" && l === "hostname") ||
        (["uri", "iri"].includes(a) && l === "url") ||
        (a === "iri" && l === "uri") ||
        (a === "iri-reference" && l === "uri-reference"),
      o = (a, l) => n.covers(a.items, l.items),
      y = (a, l) =>
        (!a.additionalProperties && l.additionalProperties) ||
        (a.additionalProperties &&
          l.additionalProperties &&
          typeof a.additionalProperties == "object" &&
          l.additionalProperties === !0) ||
        (typeof a.additionalProperties == "object" &&
          typeof l.additionalProperties == "object" &&
          !n.covers(a.additionalProperties, l.additionalProperties))
          ? !1
          : Object.entries(l.properties ?? {}).every(([d, i]) => {
              var r, f, m;
              const u = (r = a.properties) == null ? void 0 : r[d];
              return u === void 0 ||
                ((((f = a.required) == null ? void 0 : f.includes(d)) ?? !1) === !0 &&
                  (((m = l.required) == null ? void 0 : m.includes(d)) ?? !1) === !1)
                ? !1
                : n.covers(u, i);
            }),
      _ = (a) => (n.isOneOf(a) ? a.oneOf.flatMap(_) : [a]);
    (n.isOneOf = (a) => a.oneOf !== void 0),
      (n.isObject = (a) => a.type === "object"),
      (n.isArray = (a) => a.type === "array"),
      (n.isBoolean = (a) => a.type === "boolean"),
      (n.isInteger = (a) => a.type === "integer"),
      (n.isNumber = (a) => a.type === "number"),
      (n.isString = (a) => a.type === "string"),
      (n.isNullOnly = (a) => a.type === "null"),
      (n.isNullable = (a) =>
        !n.isUnknown(a) && (n.isNullOnly(a) || (n.isOneOf(a) ? a.oneOf.some(n.isNullable) : a.nullable === !0))),
      (n.isUnknown = (a) => !n.isOneOf(a) && a.type === void 0);
  })(H || (H = {}));
  var fe;
  (function (n) {
    (n.shiftArray = (e) => {
      const t = [];
      return (
        e.minItems !== void 0 && (t.push(`@minItems ${e.minItems}`), delete e.minItems),
        e.maxItems !== void 0 && (t.push(`@maxItems ${e.maxItems}`), delete e.maxItems),
        e.uniqueItems !== void 0 && (e.uniqueItems === !0 && t.push("@uniqueItems"), delete e.uniqueItems),
        (e.description = Xt({ description: e.description, tags: t })),
        e
      );
    }),
      (n.shiftNumeric = (e) => {
        const t = [];
        return (
          e.minimum !== void 0 && (t.push(`@minimum ${e.minimum}`), delete e.minimum),
          e.maximum !== void 0 && (t.push(`@maximum ${e.maximum}`), delete e.maximum),
          e.exclusiveMinimum !== void 0 &&
            (t.push(`@exclusiveMinimum ${e.exclusiveMinimum}`), delete e.exclusiveMinimum),
          e.exclusiveMaximum !== void 0 &&
            (t.push(`@exclusiveMaximum ${e.exclusiveMaximum}`), delete e.exclusiveMaximum),
          e.multipleOf !== void 0 && (t.push(`@multipleOf ${e.multipleOf}`), delete e.multipleOf),
          e.default !== void 0 && (t.push(`@default ${e.default}`), delete e.default),
          (e.description = Xt({ description: e.description, tags: t })),
          e
        );
      }),
      (n.shiftString = (e) => {
        const t = [];
        return (
          e.minLength !== void 0 && (t.push(`@minLength ${e.minLength}`), delete e.minLength),
          e.maxLength !== void 0 && (t.push(`@maxLength ${e.maxLength}`), delete e.maxLength),
          e.format !== void 0 && (t.push(`@format ${e.format}`), delete e.format),
          e.pattern !== void 0 && (t.push(`@pattern ${e.pattern}`), delete e.pattern),
          e.contentMediaType !== void 0 &&
            (t.push(`@contentMediaType ${e.contentMediaType}`), delete e.contentMediaType),
          e.default !== void 0 && (t.push(`@default ${e.default}`), delete e.default),
          (e.description = Xt({ description: e.description, tags: t })),
          e
        );
      });
  })(fe || (fe = {}));
  const Xt = (n) => {
    var e;
    return n.tags.length === 0
      ? n.description
      : [
          ...((e = n.description) != null && e.length
            ? [
                n.description,
                `
`,
              ]
            : []),
          ...n.tags,
        ].join(`
`);
  };
  var We;
  (function (n) {
    n.parameters = (t) => {
      const s = w.unreference(t);
      return s.success === !1
        ? s
        : w.isObject(s.value) === !1
          ? e({ ...t, message: "LLM only accepts object type as parameters." })
          : s.value.additionalProperties
            ? e({ ...t, message: "LLM does not allow additional properties on parameters." })
            : { success: !0, value: s.value };
    };
    const e = (t) => ({
      success: !1,
      error: {
        method: t.method,
        message: "failed to compose LLM schema.",
        reasons: [{ schema: t.schema, message: t.message, accessor: t.accessor ?? "$input.schema" }],
      },
    });
  })(We || (We = {}));
  var V;
  (function (n) {
    (n.parameters = (o) => {
      const y = We.parameters({ ...o, method: "LlmSchemaV3_1Composer.parameters" });
      if (y.success === !1) return y;
      const _ = {},
        a = n.schema({ ...o, $defs: _, schema: y.value });
      return a.success === !1 ? a : { success: !0, value: { ...a.value, additionalProperties: !1, $defs: _ } };
    }),
      (n.schema = (o) => {
        const y = [],
          _ = {
            title: o.schema.title,
            description: o.schema.description,
            example: o.schema.example,
            examples: o.schema.examples,
            ...Object.fromEntries(Object.entries(o.schema).filter(([d, i]) => d.startsWith("x-") && i !== void 0)),
          },
          a = [];
        if (
          (w.visit({
            closure: (d, i) => {
              var u;
              if ((o.validate && a.push(...o.validate(d, i)), w.isTuple(d)))
                a.push({ schema: d, accessor: i, message: "LLM does not allow tuple type." });
              else if (w.isReference(d)) {
                const r = d.$ref.split("#/components/schemas/")[1];
                ((u = o.components.schemas) == null ? void 0 : u[r]) === void 0 &&
                  a.push({ schema: d, accessor: i, message: `unable to find reference type ${JSON.stringify(r)}.` });
              }
            },
            components: o.components,
            schema: o.schema,
            accessor: o.accessor,
            refAccessor: o.refAccessor,
          }),
          a.length > 0)
        )
          return {
            success: !1,
            error: {
              method: "LlmSchemaV3_1Composer.schema",
              message: "Failed to compose LLM schema of v3.1",
              reasons: a,
            },
          };
        const l = (d, i) => {
          var u;
          if (w.isOneOf(d)) return d.oneOf.forEach((r, f) => l(r, `${i}.oneOf[${f}]`)), 0;
          if (w.isReference(d)) {
            const r = d.$ref.split("#/components/schemas/")[1],
              f = (u = o.components.schemas) == null ? void 0 : u[r];
            if (f === void 0) return y.push(null);
            if (o.config.reference === !0 || w.isRecursiveReference({ components: o.components, schema: d })) {
              const m = () => y.push({ ...d, $ref: `#/$defs/${r}` });
              if (o.$defs[r] !== void 0) return m();
              o.$defs[r] = {};
              const b = n.schema({
                config: o.config,
                components: o.components,
                $defs: o.$defs,
                schema: f,
                refAccessor: o.refAccessor,
                accessor: `${o.refAccessor ?? "$def"}[${JSON.stringify(r)}]`,
              });
              return b.success === !1 ? y.push(null) : ((o.$defs[r] = b.value), m());
            } else {
              const m = y.length;
              return (
                l(f, i),
                m === y.length - 1 && y[y.length - 1] !== null
                  ? (y[y.length - 1] = {
                      ...y[y.length - 1],
                      description: Pe.cascade({
                        prefix: "#/components/schemas/",
                        components: o.components,
                        $ref: d.$ref,
                        description: y[y.length - 1].description,
                        escape: !0,
                      }),
                    })
                  : (_.description = Pe.cascade({
                      prefix: "#/components/schemas/",
                      components: o.components,
                      $ref: d.$ref,
                      description: _.description,
                      escape: !0,
                    })),
                y.length
              );
            }
          } else if (w.isObject(d)) {
            const r = Object.entries(d.properties ?? {}).reduce((m, [b, p]) => {
              const g = n.schema({
                config: o.config,
                components: o.components,
                $defs: o.$defs,
                schema: p,
                refAccessor: o.refAccessor,
                accessor: `${i}.properties[${JSON.stringify(b)}]`,
              });
              return (m[b] = g.success ? g.value : null), g.success === !1 && a.push(...g.error.reasons), m;
            }, {});
            if (Object.values(r).some((m) => m === null)) return y.push(null);
            const f = (() => {
              if (typeof d.additionalProperties == "object" && d.additionalProperties !== null) {
                const m = n.schema({
                  config: o.config,
                  components: o.components,
                  $defs: o.$defs,
                  schema: d.additionalProperties,
                  refAccessor: o.refAccessor,
                  accessor: `${i}.additionalProperties`,
                });
                return m.success === !1 ? (a.push(...m.error.reasons), null) : m.value;
              }
              return d.additionalProperties;
            })();
            return f === null
              ? y.push(null)
              : y.push({ ...d, properties: r, additionalProperties: f, required: d.required ?? [] });
          } else if (w.isArray(d)) {
            const r = n.schema({
              config: o.config,
              components: o.components,
              $defs: o.$defs,
              schema: d.items,
              refAccessor: o.refAccessor,
              accessor: `${i}.items`,
            });
            return r.success === !1
              ? (a.push(...r.error.reasons), y.push(null))
              : y.push((o.config.constraint ? (f) => f : (f) => fe.shiftArray(f))({ ...d, items: r.value }));
          } else
            return w.isString(d)
              ? y.push((o.config.constraint ? (r) => r : (r) => fe.shiftString(r))({ ...d }))
              : w.isNumber(d) || w.isInteger(d)
                ? y.push((o.config.constraint ? (r) => r : (r) => fe.shiftNumeric(r))({ ...d }))
                : w.isTuple(d)
                  ? y.push(null)
                  : y.push({ ...d });
        };
        return (
          l(o.schema, o.accessor ?? "$input.schema"),
          y.some((d) => d === null)
            ? {
                success: !1,
                error: {
                  method: "LlmSchemaV3_1Composer.schema",
                  message: "Failed to compose LLM schema of v3.1",
                  reasons: a,
                },
              }
            : y.length === 0
              ? { success: !0, value: { ..._, type: void 0 } }
              : y.length === 1
                ? {
                    success: !0,
                    value: { ..._, ...y[0], description: F.isReference(y[0]) ? void 0 : y[0].description },
                  }
                : {
                    success: !0,
                    value: {
                      ..._,
                      oneOf: y.map((d) => ({ ...d, description: F.isReference(d) ? void 0 : d.description })),
                    },
                  }
        );
      }),
      (n.separateParameters = (o) => {
        const [y, _] = s({ $defs: o.parameters.$defs, predicate: o.predicate, schema: o.parameters });
        if (y === null || _ === null) return { llm: y, human: _ };
        const a = {
          llm: {
            ...y,
            $defs: Object.fromEntries(Object.entries(o.parameters.$defs).filter(([l]) => l.endsWith(".Llm"))),
            additionalProperties: !1,
          },
          human: {
            ..._,
            $defs: Object.fromEntries(Object.entries(o.parameters.$defs).filter(([l]) => l.endsWith(".Human"))),
            additionalProperties: !1,
          },
        };
        for (const l of Object.keys(o.parameters.$defs))
          l.endsWith(".Llm") === !1 && l.endsWith(".Human") === !1 && delete o.parameters.$defs[l];
        return a;
      });
    const e = (o) =>
        o.predicate(o.schema) === !0
          ? [null, o.schema]
          : F.isUnknown(o.schema) || F.isOneOf(o.schema)
            ? [o.schema, null]
            : F.isObject(o.schema)
              ? s({ $defs: o.$defs, predicate: o.predicate, schema: o.schema })
              : F.isArray(o.schema)
                ? t({ $defs: o.$defs, predicate: o.predicate, schema: o.schema })
                : F.isReference(o.schema)
                  ? c({ $defs: o.$defs, predicate: o.predicate, schema: o.schema })
                  : [o.schema, null],
      t = (o) => {
        const [y, _] = e({ $defs: o.$defs, predicate: o.predicate, schema: o.schema.items });
        return [y !== null ? { ...o.schema, items: y } : null, _ !== null ? { ...o.schema, items: _ } : null];
      },
      s = (o) => {
        if (Object.keys(o.schema.properties ?? {}).length === 0 && !o.schema.additionalProperties)
          return [o.schema, null];
        const y = { ...o.schema, properties: {}, additionalProperties: o.schema.additionalProperties },
          _ = { ...o.schema, properties: {} };
        for (const [a, l] of Object.entries(o.schema.properties ?? {})) {
          const [d, i] = e({ $defs: o.$defs, predicate: o.predicate, schema: l });
          d !== null && (y.properties[a] = d), i !== null && (_.properties[a] = i);
        }
        if (typeof o.schema.additionalProperties == "object" && o.schema.additionalProperties !== null) {
          const [a, l] = e({ $defs: o.$defs, predicate: o.predicate, schema: o.schema.additionalProperties });
          (y.additionalProperties = a ?? !1), (_.additionalProperties = l ?? !1);
        }
        return [
          Object.keys(y.properties).length || y.additionalProperties ? h(y) : null,
          Object.keys(_.properties).length || _.additionalProperties ? h(_) : null,
        ];
      },
      c = (o) => {
        var d, i, u, r, f;
        const y = o.schema.$ref.split("#/$defs/")[1];
        if (((d = o.$defs) != null && d[`${y}.Human`]) || ((i = o.$defs) != null && i[`${y}.Llm`]))
          return [
            (u = o.$defs) != null && u[`${y}.Llm`] ? { ...o.schema, $ref: `#/$defs/${y}.Llm` } : null,
            (r = o.$defs) != null && r[`${y}.Human`] ? { ...o.schema, $ref: `#/$defs/${y}.Human` } : null,
          ];
        (o.$defs[`${y}.Llm`] = {}), (o.$defs[`${y}.Human`] = {});
        const _ = (f = o.$defs) == null ? void 0 : f[y],
          [a, l] = e({ $defs: o.$defs, predicate: o.predicate, schema: _ });
        return a === null || l === null
          ? (delete o.$defs[`${y}.Llm`], delete o.$defs[`${y}.Human`], a === null ? [null, o.schema] : [o.schema, null])
          : [
              a !== null ? { ...o.schema, $ref: `#/$defs/${y}.Llm` } : null,
              l !== null ? { ...o.schema, $ref: `#/$defs/${y}.Human` } : null,
            ];
      },
      h = (o) => (
        o.required !== void 0 &&
          (o.required = o.required.filter((y) => {
            var _;
            return ((_ = o.properties) == null ? void 0 : _[y]) !== void 0;
          })),
        o
      );
  })(V || (V = {}));
  var Ue;
  (function (n) {
    (n.parameters = (_) => {
      var a;
      (a = _.config).strict ?? (a.strict = !1);
      const l = V.parameters({
        ..._,
        config: { reference: _.config.reference, constraint: !1 },
        validate: _.config.strict === !0 ? e : void 0,
      });
      if (l.success === !1) return l;
      for (const d of Object.keys(l.value.$defs)) l.value.$defs[d] = t(l.value.$defs[d]);
      return { success: !0, value: t(l.value) };
    }),
      (n.schema = (_) => {
        var a;
        (a = _.config).strict ?? (a.strict = !1);
        const l = new Set(Object.keys(_.$defs)),
          d = V.schema({
            ..._,
            config: { reference: _.config.reference, constraint: !1 },
            validate: _.config.strict === !0 ? e : void 0,
          });
        if (d.success === !1) return d;
        for (const i of Object.keys(_.$defs)) l.has(i) === !1 && (_.$defs[i] = t(_.$defs[i]));
        return { success: !0, value: t(d.value) };
      });
    const e = (_, a) => {
        var d;
        const l = [];
        if (w.isObject(_)) {
          _.additionalProperties &&
            l.push({
              schema: _,
              accessor: `${a}.additionalProperties`,
              message: "ChatGPT does not allow additionalProperties in strict mode, the dynamic key typed object.",
            });
          for (const i of Object.keys(_.properties ?? {}))
            ((d = _.required) == null ? void 0 : d.includes(i)) === !1 &&
              l.push({
                schema: _,
                accessor: `${a}.properties.${i}`,
                message: "ChatGPT does not allow optional properties in strict mode.",
              });
        }
        return l;
      },
      t = (_) => {
        const a = [],
          l = {
            title: _.title,
            description: _.description,
            example: _.example,
            examples: _.examples,
            ...Object.fromEntries(Object.entries(_).filter(([u, r]) => u.startsWith("x-") && r !== void 0)),
          },
          d = (u) => {
            F.isOneOf(u)
              ? u.oneOf.forEach(d)
              : F.isArray(u)
                ? a.push({ ...u, items: t(u.items) })
                : F.isObject(u)
                  ? a.push({
                      ...u,
                      properties: Object.fromEntries(Object.entries(u.properties).map(([r, f]) => [r, t(f)])),
                      additionalProperties:
                        typeof u.additionalProperties == "object" && u.additionalProperties !== null
                          ? t(u.additionalProperties)
                          : u.additionalProperties,
                    })
                  : F.isConstant(u) === !1 && a.push(u);
          },
          i = (u) => {
            const r = (f) => {
              const m = a.find((b) => (b == null ? void 0 : b.type) === typeof f);
              m !== void 0 ? (m.enum ?? (m.enum = []), m.enum.push(f)) : a.push({ type: typeof f, enum: [f] });
            };
            w.isConstant(u) ? r(u.const) : w.isOneOf(u) && u.oneOf.forEach(i);
          };
        return (
          d(_),
          i(_),
          a.length === 0
            ? { ...l, type: void 0 }
            : a.length === 1
              ? { ...l, ...a[0], description: se.isReference(a[0]) ? void 0 : a[0].description }
              : { ...l, anyOf: a.map((u) => ({ ...u, description: se.isReference(u) ? void 0 : u.description })) }
        );
      };
    n.separateParameters = (_) => {
      const [a, l] = h({ $defs: _.parameters.$defs, predicate: _.predicate, schema: _.parameters });
      if (a === null || l === null) return { llm: a, human: l };
      const d = {
        llm: {
          ...a,
          $defs: Object.fromEntries(Object.entries(_.parameters.$defs).filter(([i]) => i.endsWith(".Llm"))),
          additionalProperties: !1,
        },
        human: {
          ...l,
          $defs: Object.fromEntries(Object.entries(_.parameters.$defs).filter(([i]) => i.endsWith(".Human"))),
          additionalProperties: !1,
        },
      };
      for (const i of Object.keys(_.parameters.$defs))
        i.endsWith(".Llm") === !1 && i.endsWith(".Human") === !1 && delete _.parameters.$defs[i];
      return d;
    };
    const s = (_) =>
        _.predicate(_.schema) === !0
          ? [null, _.schema]
          : se.isUnknown(_.schema) || se.isAnyOf(_.schema)
            ? [_.schema, null]
            : se.isObject(_.schema)
              ? h({ $defs: _.$defs, predicate: _.predicate, schema: _.schema })
              : se.isArray(_.schema)
                ? c({ $defs: _.$defs, predicate: _.predicate, schema: _.schema })
                : se.isReference(_.schema)
                  ? o({ $defs: _.$defs, predicate: _.predicate, schema: _.schema })
                  : [_.schema, null],
      c = (_) => {
        const [a, l] = s({ $defs: _.$defs, predicate: _.predicate, schema: _.schema.items });
        return [a !== null ? { ..._.schema, items: a } : null, l !== null ? { ..._.schema, items: l } : null];
      },
      h = (_) => {
        if (Object.keys(_.schema.properties ?? {}).length === 0 && !_.schema.additionalProperties)
          return [_.schema, null];
        const a = { ..._.schema, properties: {}, additionalProperties: _.schema.additionalProperties },
          l = { ..._.schema, properties: {} };
        for (const [d, i] of Object.entries(_.schema.properties ?? {})) {
          const [u, r] = s({ $defs: _.$defs, predicate: _.predicate, schema: i });
          u !== null && (a.properties[d] = u), r !== null && (l.properties[d] = r);
        }
        if (typeof _.schema.additionalProperties == "object" && _.schema.additionalProperties !== null) {
          const [d, i] = s({ $defs: _.$defs, predicate: _.predicate, schema: _.schema.additionalProperties });
          (a.additionalProperties = d ?? !1), (l.additionalProperties = i ?? !1);
        }
        return [
          Object.keys(a.properties).length || a.additionalProperties ? y(a) : null,
          Object.keys(l.properties).length || l.additionalProperties ? y(l) : null,
        ];
      },
      o = (_) => {
        var u, r, f, m, b;
        const a = _.schema.$ref.split("#/$defs/")[1];
        if (((u = _.$defs) != null && u[`${a}.Human`]) || ((r = _.$defs) != null && r[`${a}.Llm`]))
          return [
            (f = _.$defs) != null && f[`${a}.Llm`] ? { ..._.schema, $ref: `#/$defs/${a}.Llm` } : null,
            (m = _.$defs) != null && m[`${a}.Human`] ? { ..._.schema, $ref: `#/$defs/${a}.Human` } : null,
          ];
        (_.$defs[`${a}.Llm`] = {}), (_.$defs[`${a}.Human`] = {});
        const l = (b = _.$defs) == null ? void 0 : b[a],
          [d, i] = s({ $defs: _.$defs, predicate: _.predicate, schema: l });
        return d === null || i === null
          ? (delete _.$defs[`${a}.Llm`], delete _.$defs[`${a}.Human`], d === null ? [null, _.schema] : [_.schema, null])
          : [
              d !== null ? { ..._.schema, $ref: `#/$defs/${a}.Llm` } : null,
              i !== null ? { ..._.schema, $ref: `#/$defs/${a}.Human` } : null,
            ];
      },
      y = (_) => (
        (_.required = _.required.filter((a) => {
          var l;
          return ((l = _.properties) == null ? void 0 : l[a]) !== void 0;
        })),
        _
      );
  })(Ue || (Ue = {}));
  var Je;
  (function (n) {
    (n.parameters = (e) => V.parameters({ ...e, config: { reference: e.config.reference, constraint: !0 } })),
      (n.schema = (e) => V.schema({ ...e, config: { reference: e.config.reference, constraint: !0 } })),
      (n.separateParameters = (e) => V.separateParameters(e));
  })(Je || (Je = {}));
  var ge;
  (function (n) {
    (n.parameters = (h) => {
      const o = We.parameters({ ...h, method: "LlmSchemaV3Composer.parameters" });
      if (o.success === !1) return o;
      const y = n.schema({ ...h, schema: o.value });
      return y.success === !1 ? y : { success: !0, value: { ...y.value, additionalProperties: !1 } };
    }),
      (n.schema = (h) => {
        const o = [];
        if (
          (w.visit({
            closure: (a, l) => {
              var d;
              if ((h.validate && o.push(...h.validate(a, l)), w.isTuple(a)))
                o.push({ accessor: l, schema: a, message: "LLM does not allow tuple type." });
              else if (w.isReference(a)) {
                const i = a.$ref.split("#/components/schemas/")[1];
                ((d = h.components.schemas) == null ? void 0 : d[i]) === void 0 &&
                  o.push({
                    schema: a,
                    message: `${l}: unable to find reference type ${JSON.stringify(i)}.`,
                    accessor: l,
                  });
              }
            },
            components: h.components,
            schema: h.schema,
            accessor: h.accessor,
            refAccessor: h.refAccessor,
          }),
          o.length > 0)
        )
          return {
            success: !1,
            error: { method: "LlmSchemaV3Composer.schema", message: "Failed to compose LLM schema of v3", reasons: o },
          };
        const y = w.escape({ ...h, recursive: h.config.recursive });
        if (y.success === !1)
          return {
            success: !1,
            error: {
              method: "LlmSchemaV3Composer.schema",
              message: "Failed to compose LLM schema of v3",
              reasons: y.error.reasons,
            },
          };
        const _ = rt.downgradeSchema({ original: { schemas: {} }, downgraded: {} })(y.value);
        return (
          H.visit({
            closure: (a) => {
              H.isOneOf(a) && a.discriminator !== void 0
                ? delete a.discriminator
                : H.isObject(a) && (a.properties ?? (a.properties = {}), a.required ?? (a.required = [])),
                h.config.constraint === !1 &&
                  (H.isInteger(a) || H.isNumber(a)
                    ? fe.shiftNumeric(a)
                    : H.isString(a)
                      ? fe.shiftString(a)
                      : H.isArray(a) && fe.shiftArray(a));
            },
            schema: _,
          }),
          { success: !0, value: _ }
        );
      }),
      (n.separateParameters = (h) => {
        const [o, y] = s({ predicate: h.predicate, schema: h.parameters });
        return { llm: o, human: y };
      });
    const e = (h) =>
        h.predicate(h.schema) === !0
          ? [null, h.schema]
          : H.isUnknown(h.schema) || H.isOneOf(h.schema)
            ? [h.schema, null]
            : H.isObject(h.schema)
              ? s({ predicate: h.predicate, schema: h.schema })
              : H.isArray(h.schema)
                ? t({ predicate: h.predicate, schema: h.schema })
                : [h.schema, null],
      t = (h) => {
        const [o, y] = e({ predicate: h.predicate, schema: h.schema.items });
        return [o !== null ? { ...h.schema, items: o } : null, y !== null ? { ...h.schema, items: y } : null];
      },
      s = (h) => {
        if (Object.keys(h.schema.properties ?? {}).length === 0 && !h.schema.additionalProperties)
          return [h.schema, null];
        const o = { ...h.schema, properties: {}, additionalProperties: h.schema.additionalProperties },
          y = { ...h.schema, properties: {}, additionalProperties: h.schema.additionalProperties };
        for (const [_, a] of Object.entries(h.schema.properties ?? {})) {
          const [l, d] = e({ predicate: h.predicate, schema: a });
          l !== null && (o.properties[_] = l), d !== null && (y.properties[_] = d);
        }
        if (typeof h.schema.additionalProperties == "object" && h.schema.additionalProperties !== null) {
          const [_, a] = e({ predicate: h.predicate, schema: h.schema.additionalProperties });
          (o.additionalProperties = _ ?? !1), (y.additionalProperties = a ?? !1);
        }
        return [
          Object.keys(o.properties).length || o.additionalProperties ? c(o) : null,
          Object.keys(y.properties).length || y.additionalProperties ? c(y) : null,
        ];
      },
      c = (h) => ((h.required = h.required.filter((o) => h.properties[o] !== void 0)), h);
  })(ge || (ge = {}));
  var Qe;
  (function (n) {
    (n.parameters = (e) => {
      const t = We.parameters({ ...e, method: "GeminiSchemaComposer.parameters" });
      return t.success === !1 ? t : n.schema({ ...e, schema: t.value });
    }),
      (n.schema = (e) => {
        const t = ge.schema({
          ...e,
          config: { recursive: e.config.recursive, constraint: !1 },
          validate: (s, c) => {
            if (w.isObject(s)) {
              if (s.additionalProperties)
                return [
                  {
                    schema: s,
                    accessor: `${c}.additionalProperties`,
                    message: "Gemini does not allow additionalProperties.",
                  },
                ];
            } else if (w.isOneOf(s) && is(e.components)(s))
              return [{ schema: s, accessor: c, message: "Gemini does not allow union type." }];
            return [];
          },
        });
        return (
          t.success === !1 ||
            H.visit({
              schema: t.value,
              closure: (s) => {
                if (s.title !== void 0) {
                  if (s.description === void 0) s.description = s.title;
                  else {
                    const c = s.title.endsWith(".") ? s.title.substring(0, s.title.length - 1) : s.title;
                    s.description = s.description.startsWith(c)
                      ? s.description
                      : `${c}.

${s.description}`;
                  }
                  delete s.title;
                }
                H.isObject(s) && s.additionalProperties !== void 0 && delete s.additionalProperties;
              },
            }),
          t
        );
      }),
      (n.separateParameters = (e) => ge.separateParameters(e));
  })(Qe || (Qe = {}));
  const is = (n) => (e) => {
    const t = [],
      s = new Set(),
      c = (o) => {
        var y;
        if (w.isBoolean(o) || w.isInteger(o) || w.isNumber(o) || w.isString(o)) t.push({ ...o });
        else if (w.isArray(o) || w.isTuple(o) || w.isObject(o)) t.push(o);
        else if (w.isOneOf(o)) o.oneOf.forEach(c);
        else if (w.isReference(o))
          if (s.has(o.$ref)) t.push(o);
          else {
            s.add(o.$ref);
            const _ = (y = n.schemas) == null ? void 0 : y[o.$ref.split("/").pop()];
            _ === void 0 ? t.push(o) : c(_);
          }
      },
      h = (o) => {
        const y = (_) => {
          const a = t.find((l) => l.type === typeof _);
          a !== void 0 ? (a.enum ?? (a.enum = []), a.enum.push(_)) : t.push({ type: typeof _, enum: [_] });
        };
        if (w.isConstant(o)) y(o.const);
        else if (w.isOneOf(o)) for (const _ of o.oneOf) w.isConstant(_) && y(_.const);
      };
    return c(e), h(e), t.length > 1;
  };
  var Le;
  (function (n) {
    (n.parameters = (e) => V.parameters({ ...e, config: { reference: e.config.reference, constraint: !0 } })),
      (n.schema = (e) => V.schema({ ...e, config: { reference: e.config.reference, constraint: !0 } })),
      (n.separateParameters = (e) => V.separateParameters(e));
  })(Le || (Le = {}));
  var Ke;
  (function (n) {
    (n.parameters = (e) => as[e]),
      (n.schema = (e) => os[e]),
      (n.defaultConfig = (e) => ls[e]),
      (n.typeChecker = (e) => cs[e]),
      (n.separateParameters = (e) => us[e]);
  })(Ke || (Ke = {}));
  const as = {
      chatgpt: Ue.parameters,
      claude: Je.parameters,
      gemini: Qe.parameters,
      llama: Le.parameters,
      "3.0": ge.parameters,
      3.1: V.parameters,
    },
    os = {
      chatgpt: Ue.schema,
      claude: Je.schema,
      gemini: Qe.schema,
      llama: Le.schema,
      "3.0": ge.schema,
      3.1: V.schema,
    },
    us = {
      chatgpt: Ue.separateParameters,
      claude: Je.separateParameters,
      gemini: Qe.separateParameters,
      llama: Le.separateParameters,
      "3.0": ge.separateParameters,
      3.1: V.separateParameters,
    },
    ls = {
      chatgpt: { reference: !1, strict: !1 },
      claude: { reference: !1 },
      gemini: { recursive: 3 },
      llama: { reference: !1 },
      "3.0": { constraint: !0, recursive: 3 },
      3.1: { constraint: !0, reference: !1 },
    },
    cs = { chatgpt: se, claude: Jn, gemini: it, llama: Qn, "3.0": H, 3.1: F };
  var Gt;
  (function (n) {
    n.application = (t) => {
      const s = t.migrate.errors
          .filter((h) => h.operation()["x-samchon-human"] !== !0)
          .map((h) => ({
            method: h.method,
            path: h.path,
            messages: h.messages,
            operation: () => h.operation(),
            route: () => {},
          })),
        c = t.migrate.routes
          .filter((h) => h.operation()["x-samchon-human"] !== !0)
          .map((h, o) => {
            var a, l;
            if (h.method === "head")
              return (
                s.push({
                  method: h.method,
                  path: h.path,
                  messages: ["HEAD method is not supported in the LLM application."],
                  operation: () => h.operation(),
                  route: () => h,
                }),
                null
              );
            if (
              ((a = h.body) == null ? void 0 : a.type) === "multipart/form-data" ||
              ((l = h.success) == null ? void 0 : l.type) === "multipart/form-data"
            )
              return (
                s.push({
                  method: h.method,
                  path: h.path,
                  messages: ['The "multipart/form-data" content type is not supported in the LLM application.'],
                  operation: () => h.operation(),
                  route: () => h,
                }),
                null
              );
            const y = [],
              _ = e({
                model: t.model,
                options: t.options,
                components: t.migrate.document().components,
                route: h,
                errors: y,
                index: o,
              });
            return (
              _ === null &&
                s.push({ method: h.method, path: h.path, messages: y, operation: () => h.operation(), route: () => h }),
              _
            );
          })
          .filter((h) => h !== null);
      return { model: t.model, options: t.options, functions: c, errors: s };
    };
    const e = (t) => {
      const s = {},
        c = (u, r) => {
          const f = Ke.schema(t.model)({
            config: t.options,
            schema: u,
            components: t.components,
            $defs: s,
            accessor: r,
            refAccessor: "$input.components.schemas",
          });
          return f.success === !1
            ? (t.errors.push(...f.error.reasons.map((m) => `${m.accessor}: ${m.message}`)), null)
            : f.value;
        },
        h = `$input.paths[${JSON.stringify(t.route.path)}][${JSON.stringify(t.route.method)}]`,
        o = t.route.success
          ? c(
              t.route.success.schema,
              `${h}.responses[${JSON.stringify(t.route.success.status)}][${JSON.stringify(t.route.success.type)}].schema`,
            )
          : void 0,
        y = [
          ...t.route.parameters.map((u) => [
            u.key,
            c(
              {
                ...u.schema,
                title: u.parameter().title ?? u.schema.title,
                description: u.parameter().description ?? u.schema.description,
              },
              `${h}.parameters[${JSON.stringify(u.key)}].schema`,
            ),
          ]),
          ...(t.route.query
            ? [
                [
                  t.route.query.key,
                  c(
                    {
                      ...t.route.query.schema,
                      title: t.route.query.title() ?? t.route.query.schema.title,
                      description: t.route.query.description() ?? t.route.query.schema.description,
                    },
                    `${h}.parameters[${JSON.stringify(t.route.query.key)}].schema`,
                  ),
                ],
              ]
            : []),
          ...(t.route.body
            ? [
                [
                  t.route.body.key,
                  c(
                    {
                      ...t.route.body.schema,
                      description: t.route.body.description() ?? t.route.body.schema.description,
                    },
                    `${h}.requestBody.content[${JSON.stringify(t.route.body.type)}].schema`,
                  ),
                ],
              ]
            : []),
        ],
        _ = t.route.accessor.join("_"),
        a = /^[a-zA-Z0-9_-]+$/.test(_),
        l = /^[0-9]/.test(_[0] ?? "");
      if (
        (a === !1 &&
          t.errors.push(
            "Elements of path (separated by '/') must be composed with alphabets, numbers, underscores, and hyphens",
          ),
        o === null || y.some(([u, r]) => r === null) || a === !1 || l === !0)
      )
        return null;
      const d = {
        type: "object",
        properties: Object.fromEntries(y),
        additionalProperties: !1,
        required: y.map(([u]) => u),
      };
      Object.keys(s).length && (d.$defs = s);
      const i = t.route.operation();
      return {
        method: t.route.method,
        path: t.route.path,
        name: _,
        parameters: d,
        separated: t.options.separate
          ? Ke.separateParameters(t.model)({ predicate: t.options.separate, parameters: d })
          : void 0,
        output: o,
        description: (() => {
          var r, f;
          if (!((r = i.summary) != null && r.length) || !((f = i.description) != null && f.length))
            return i.summary || i.description;
          const u = i.summary.endsWith(".") ? i.summary.slice(0, -1) : i.summary;
          return i.description.startsWith(u)
            ? i.description
            : u +
                `.

` +
                i.description;
        })(),
        deprecated: i.deprecated,
        tags: i.tags,
        route: () => t.route,
        operation: () => t.route.operation(),
      };
    };
  })(Gt || (Gt = {}));
  var at;
  (function (n) {
    (n.execute = (t) => je.execute(e("execute", t))), (n.propagate = (t) => je.propagate(e("propagate", t)));
    const e = (t, s) => {
      const c = s.function.route(),
        h = s.input;
      if ((typeof h == "object" && h !== null) === !1)
        throw new Error(`Error on HttpLlmFunctionFetcher.${t}(): keyworded arguments must be an object`);
      return {
        connection: s.connection,
        route: c,
        parameters: Object.fromEntries(c.parameters.map((y) => [y.key, h[y.key]])),
        query: h.query,
        body: h.body,
      };
    };
  })(at || (at = {}));
  var ot;
  (function (n) {
    (n.parameters = (t) => {
      if (t.function.separated === void 0)
        throw new Error("Error on OpenAiDataComposer.parameters(): the function parameters are not separated.");
      return n.value(t.llm, t.human);
    }),
      (n.value = (t, s) =>
        typeof t == "object" && typeof s == "object" && t !== null && s !== null
          ? e(t, s)
          : Array.isArray(t) && Array.isArray(s)
            ? new Array(Math.max(t.length, s.length)).fill(0).map((c, h) => n.value(t[h], s[h]))
            : (s ?? t));
    const e = (t, s) => {
      const c = { ...t };
      for (const [h, o] of Object.entries(s)) c[h] = n.value(t[h], o);
      return c;
    };
  })(ot || (ot = {}));
  var Vt;
  (function (n) {
    (n.application = (e) => {
      var s;
      const t = st.application(e.document);
      return Gt.application({
        migrate: t,
        model: e.model,
        options: { ...Ke.defaultConfig(e.model), separate: ((s = e.options) == null ? void 0 : s.separate) ?? null },
      });
    }),
      (n.execute = (e) => at.execute(e)),
      (n.propagate = (e) => at.propagate(e)),
      (n.mergeParameters = (e) => ot.parameters(e)),
      (n.mergeValue = (e, t) => ot.value(e, t));
  })(Vt || (Vt = {}));
  const ds = Vr(
    Object.freeze(
      Object.defineProperty(
        {
          __proto__: null,
          get ChatGptTypeChecker() {
            return se;
          },
          ClaudeTypeChecker: Jn,
          get GeminiTypeChecker() {
            return it;
          },
          HttpError: Fn,
          get HttpLlm() {
            return Vt;
          },
          get HttpMigration() {
            return st;
          },
          get IClaudeSchema() {
            return Zt;
          },
          get IHttpLlmApplication() {
            return Bt;
          },
          get ILlamaSchema() {
            return Yt;
          },
          LlamaTypeChecker: Qn,
          get LlmTypeCheckerV3() {
            return H;
          },
          get LlmTypeCheckerV3_1() {
            return F;
          },
          get OpenApi() {
            return Ut;
          },
          get OpenApiTypeChecker() {
            return w;
          },
          get OpenApiV3() {
            return Te;
          },
          get OpenApiV3_1() {
            return et;
          },
          get SwaggerV2() {
            return tt;
          },
        },
        Symbol.toStringTag,
        { value: "Module" },
      ),
    ),
  );
  var Ln;
  function Ct() {
    return (
      Ln ||
        ((Ln = 1),
        (function (n) {
          Object.defineProperty(n, "__esModule", { value: !0 }), (n.HttpError = void 0);
          var e = ds;
          Object.defineProperty(n, "HttpError", {
            enumerable: !0,
            get: function () {
              return e.HttpError;
            },
          });
        })(Mt)),
      Mt
    );
  }
  var Tt = {},
    Kn;
  function fs() {
    return Kn || ((Kn = 1), Object.defineProperty(Tt, "__esModule", { value: !0 })), Tt;
  }
  var en = {},
    Bn;
  function hs() {
    return Bn || ((Bn = 1), Object.defineProperty(en, "__esModule", { value: !0 })), en;
  }
  var tn = {},
    Zn;
  function _s() {
    return Zn || ((Zn = 1), Object.defineProperty(tn, "__esModule", { value: !0 })), tn;
  }
  var nn = {},
    Yn;
  function ms() {
    return Yn || ((Yn = 1), Object.defineProperty(nn, "__esModule", { value: !0 })), nn;
  }
  var rn = {},
    Xn;
  function ys() {
    return Xn || ((Xn = 1), Object.defineProperty(rn, "__esModule", { value: !0 })), rn;
  }
  var Gn;
  function bs() {
    return (
      Gn ||
        ((Gn = 1),
        (function (n) {
          var e =
              (ye && ye.__createBinding) ||
              (Object.create
                ? function (s, c, h, o) {
                    o === void 0 && (o = h);
                    var y = Object.getOwnPropertyDescriptor(c, h);
                    (!y || ("get" in y ? !c.__esModule : y.writable || y.configurable)) &&
                      (y = {
                        enumerable: !0,
                        get: function () {
                          return c[h];
                        },
                      }),
                      Object.defineProperty(s, o, y);
                  }
                : function (s, c, h, o) {
                    o === void 0 && (o = h), (s[o] = c[h]);
                  }),
            t =
              (ye && ye.__exportStar) ||
              function (s, c) {
                for (var h in s) h !== "default" && !Object.prototype.hasOwnProperty.call(c, h) && e(c, s, h);
              };
          Object.defineProperty(n, "__esModule", { value: !0 }),
            t(Cr(), n),
            t(Ct(), n),
            t(fs(), n),
            t(hs(), n),
            t(_s(), n),
            t(ms(), n),
            t(ys(), n);
        })(ye)),
      ye
    );
  }
  var Vn = bs(),
    le = {},
    D = {},
    Cn;
  function gs() {
    if (Cn) return D;
    Cn = 1;
    var n =
        (D && D.__assign) ||
        function () {
          return (
            (n =
              Object.assign ||
              function (d) {
                for (var i, u = 1, r = arguments.length; u < r; u++) {
                  i = arguments[u];
                  for (var f in i) Object.prototype.hasOwnProperty.call(i, f) && (d[f] = i[f]);
                }
                return d;
              }),
            n.apply(this, arguments)
          );
        },
      e =
        (D && D.__awaiter) ||
        function (d, i, u, r) {
          function f(m) {
            return m instanceof u
              ? m
              : new u(function (b) {
                  b(m);
                });
          }
          return new (u || (u = Promise))(function (m, b) {
            function p(O) {
              try {
                v(r.next(O));
              } catch (x) {
                b(x);
              }
            }
            function g(O) {
              try {
                v(r.throw(O));
              } catch (x) {
                b(x);
              }
            }
            function v(O) {
              O.done ? m(O.value) : f(O.value).then(p, g);
            }
            v((r = r.apply(d, i || [])).next());
          });
        },
      t =
        (D && D.__generator) ||
        function (d, i) {
          var u = {
              label: 0,
              sent: function () {
                if (m[0] & 1) throw m[1];
                return m[1];
              },
              trys: [],
              ops: [],
            },
            r,
            f,
            m,
            b = Object.create((typeof Iterator == "function" ? Iterator : Object).prototype);
          return (
            (b.next = p(0)),
            (b.throw = p(1)),
            (b.return = p(2)),
            typeof Symbol == "function" &&
              (b[Symbol.iterator] = function () {
                return this;
              }),
            b
          );
          function p(v) {
            return function (O) {
              return g([v, O]);
            };
          }
          function g(v) {
            if (r) throw new TypeError("Generator is already executing.");
            for (; b && ((b = 0), v[0] && (u = 0)), u; )
              try {
                if (
                  ((r = 1),
                  f &&
                    (m = v[0] & 2 ? f.return : v[0] ? f.throw || ((m = f.return) && m.call(f), 0) : f.next) &&
                    !(m = m.call(f, v[1])).done)
                )
                  return m;
                switch (((f = 0), m && (v = [v[0] & 2, m.value]), v[0])) {
                  case 0:
                  case 1:
                    m = v;
                    break;
                  case 4:
                    return u.label++, { value: v[1], done: !1 };
                  case 5:
                    u.label++, (f = v[1]), (v = [0]);
                    continue;
                  case 7:
                    (v = u.ops.pop()), u.trys.pop();
                    continue;
                  default:
                    if (((m = u.trys), !(m = m.length > 0 && m[m.length - 1]) && (v[0] === 6 || v[0] === 2))) {
                      u = 0;
                      continue;
                    }
                    if (v[0] === 3 && (!m || (v[1] > m[0] && v[1] < m[3]))) {
                      u.label = v[1];
                      break;
                    }
                    if (v[0] === 6 && u.label < m[1]) {
                      (u.label = m[1]), (m = v);
                      break;
                    }
                    if (m && u.label < m[2]) {
                      (u.label = m[2]), u.ops.push(v);
                      break;
                    }
                    m[2] && u.ops.pop(), u.trys.pop();
                    continue;
                }
                v = i.call(d, u);
              } catch (O) {
                (v = [6, O]), (f = 0);
              } finally {
                r = m = 0;
              }
            if (v[0] & 5) throw v[1];
            return { value: v[0] ? v[1] : void 0, done: !0 };
          }
        },
      s =
        (D && D.__values) ||
        function (d) {
          var i = typeof Symbol == "function" && Symbol.iterator,
            u = i && d[i],
            r = 0;
          if (u) return u.call(d);
          if (d && typeof d.length == "number")
            return {
              next: function () {
                return d && r >= d.length && (d = void 0), { value: d && d[r++], done: !d };
              },
            };
          throw new TypeError(i ? "Object is not iterable." : "Symbol.iterator is not defined.");
        },
      c =
        (D && D.__read) ||
        function (d, i) {
          var u = typeof Symbol == "function" && d[Symbol.iterator];
          if (!u) return d;
          var r = u.call(d),
            f,
            m = [],
            b;
          try {
            for (; (i === void 0 || i-- > 0) && !(f = r.next()).done; ) m.push(f.value);
          } catch (p) {
            b = { error: p };
          } finally {
            try {
              f && !f.done && (u = r.return) && u.call(r);
            } finally {
              if (b) throw b.error;
            }
          }
          return m;
        },
      h =
        (D && D.__spreadArray) ||
        function (d, i, u) {
          if (u || arguments.length === 2)
            for (var r = 0, f = i.length, m; r < f; r++)
              (m || !(r in i)) && (m || (m = Array.prototype.slice.call(i, 0, r)), (m[r] = i[r]));
          return d.concat(m || Array.prototype.slice.call(i));
        };
    Object.defineProperty(D, "__esModule", { value: !0 }), (D.FetcherBase = void 0);
    var o = Ct(),
      y;
    (function (d) {
      var i = this;
      (d.request = function (r) {
        return function (f, m, b, p) {
          return e(i, void 0, void 0, function () {
            var g;
            return t(this, function (v) {
              switch (v.label) {
                case 0:
                  return [4, u("fetch")(r)(f, m, b, p)];
                case 1:
                  if (((g = v.sent()), g.success === !1))
                    throw new o.HttpError(m.method, m.path, g.status, g.headers, g.data);
                  return [2, g.data];
              }
            });
          });
        };
      }),
        (d.propagate = function (r) {
          return function (f, m, b, p) {
            return e(i, void 0, void 0, function () {
              return t(this, function (g) {
                return [2, u("propagate")(r)(f, m, b, p)];
              });
            });
          };
        });
      var u = function (r) {
        return function (f) {
          return function (m, b, p, g) {
            return e(i, void 0, void 0, function () {
              var v, O, x, Q, ee, L, K, q, j, On, $n, Jr, Qr, Lr, Kr, Br, qn, En, Sn, Pn, jn, In, kn, Rn, An;
              return t(this, function (X) {
                switch (X.label) {
                  case 0:
                    if (((v = n({}, (qn = m.headers) !== null && qn !== void 0 ? qn : {})), p !== void 0)) {
                      if (((En = b.request) === null || En === void 0 ? void 0 : En.type) === void 0)
                        throw new Error("Error on ".concat(f.className, ".fetch(): no content-type being configured."));
                      b.request.type !== "multipart/form-data" && (v["Content-Type"] = b.request.type);
                    } else p === void 0 && v["Content-Type"] !== void 0 && delete v["Content-Type"];
                    (O = n(n({}, (Sn = m.options) !== null && Sn !== void 0 ? Sn : {}), {
                      method: b.method,
                      headers: (function () {
                        var It,
                          Zr,
                          kt,
                          Yr,
                          zn = [];
                        try {
                          for (var Rt = s(Object.entries(v)), Ve = Rt.next(); !Ve.done; Ve = Rt.next()) {
                            var Xr = c(Ve.value, 2),
                              Gr = Xr[0],
                              At = Xr[1];
                            if (At !== void 0)
                              if (Array.isArray(At))
                                try {
                                  for (var zt = ((kt = void 0), s(At)), Ce = zt.next(); !Ce.done; Ce = zt.next()) {
                                    var Ho = Ce.value;
                                    zn.push([Gr, String(Ho)]);
                                  }
                                } catch (Nn) {
                                  kt = { error: Nn };
                                } finally {
                                  try {
                                    Ce && !Ce.done && (Yr = zt.return) && Yr.call(zt);
                                  } finally {
                                    if (kt) throw kt.error;
                                  }
                                }
                              else zn.push([Gr, String(At)]);
                          }
                        } catch (Nn) {
                          It = { error: Nn };
                        } finally {
                          try {
                            Ve && !Ve.done && (Zr = Rt.return) && Zr.call(Rt);
                          } finally {
                            if (It) throw It.error;
                          }
                        }
                        return zn;
                      })(),
                    })),
                      p !== void 0 &&
                        (O.body = f.encode(
                          ((Pn = b.request) === null || Pn === void 0 ? void 0 : Pn.type) ===
                            "application/x-www-form-urlencoded"
                            ? _(p)
                            : ((jn = b.request) === null || jn === void 0 ? void 0 : jn.type) === "multipart/form-data"
                              ? a(p)
                              : ((In = b.request) === null || In === void 0 ? void 0 : In.type) !== "text/plain"
                                ? (g ?? JSON.stringify)(p)
                                : p,
                          v,
                        )),
                      (x = m.host[m.host.length - 1] !== "/" && b.path[0] !== "/" ? "/".concat(b.path) : b.path),
                      (Q = new URL("".concat(m.host).concat(x))),
                      (ee = {
                        route: b,
                        path: x,
                        status: null,
                        input: p,
                        output: void 0,
                        started_at: new Date(),
                        respond_at: null,
                        completed_at: null,
                      }),
                      (X.label = 1);
                  case 1:
                    return (
                      X.trys.push([1, 12, 13, 18]),
                      [4, ((kn = m.fetch) !== null && kn !== void 0 ? kn : fetch)(Q.href, O)]
                    );
                  case 2:
                    return (
                      (L = X.sent()),
                      (ee.respond_at = new Date()),
                      (ee.status = L.status),
                      (K = {
                        success: L.status === 200 || L.status === 201 || L.status === b.status,
                        status: L.status,
                        headers: l(L.headers),
                        data: void 0,
                      }),
                      K.success !== !1 ? [3, 4] : ((q = K), [4, L.text()])
                    );
                  case 3:
                    if (
                      ((q.data = X.sent()),
                      (j = L.headers.get("content-type")),
                      r !== "fetch" && j && j.indexOf("application/json") !== -1)
                    )
                      try {
                        K.data = JSON.parse(K.data);
                      } catch {}
                    return [3, 11];
                  case 4:
                    return b.method !== "HEAD" ? [3, 5] : ((K.data = void 0), [3, 11]);
                  case 5:
                    return ((Rn = b.response) === null || Rn === void 0 ? void 0 : Rn.type) !== "application/json"
                      ? [3, 7]
                      : [4, L.text()];
                  case 6:
                    return (On = X.sent()), (K.data = On.length ? JSON.parse(On) : void 0), [3, 11];
                  case 7:
                    return ((An = b.response) === null || An === void 0 ? void 0 : An.type) !==
                      "application/x-www-form-urlencoded"
                      ? [3, 9]
                      : ((Jr = URLSearchParams.bind), [4, L.text()]);
                  case 8:
                    return (
                      ($n = new (Jr.apply(URLSearchParams, [void 0, X.sent()]))()),
                      (K.data = b.parseQuery ? b.parseQuery($n) : $n),
                      [3, 11]
                    );
                  case 9:
                    return (Qr = K), (Kr = (Lr = f).decode), [4, L.text()];
                  case 10:
                    (Qr.data = Kr.apply(Lr, [X.sent(), K.headers])), (X.label = 11);
                  case 11:
                    return (ee.output = K.data), [2, K];
                  case 12:
                    throw ((Br = X.sent()), Br);
                  case 13:
                    if (((ee.completed_at = new Date()), !m.logger)) return [3, 17];
                    X.label = 14;
                  case 14:
                    return X.trys.push([14, 16, , 17]), [4, m.logger(ee)];
                  case 15:
                    return X.sent(), [3, 17];
                  case 16:
                    return X.sent(), [3, 17];
                  case 17:
                    return [7];
                  case 18:
                    return [2];
                }
              });
            });
          };
        };
      };
    })(y || (D.FetcherBase = y = {}));
    var _ = function (d) {
        var i,
          u,
          r = new URLSearchParams(),
          f = function (O, x) {
            if (x === void 0) return "continue";
            Array.isArray(x)
              ? x.forEach(function (Q) {
                  return r.append(O, String(Q));
                })
              : r.set(O, String(x));
          };
        try {
          for (var m = s(Object.entries(d)), b = m.next(); !b.done; b = m.next()) {
            var p = c(b.value, 2),
              g = p[0],
              v = p[1];
            f(g, v);
          }
        } catch (O) {
          i = { error: O };
        } finally {
          try {
            b && !b.done && (u = m.return) && u.call(m);
          } finally {
            if (i) throw i.error;
          }
        }
        return r;
      },
      a = function (d) {
        var i,
          u,
          r = new FormData(),
          f = function (O) {
            return function (x) {
              x !== void 0 &&
                (typeof File == "function" && x instanceof File ? r.append(O, x, x.name) : r.append(O, x));
            };
          };
        try {
          for (var m = s(Object.entries(d)), b = m.next(); !b.done; b = m.next()) {
            var p = c(b.value, 2),
              g = p[0],
              v = p[1];
            Array.isArray(v) ? v.map(f(g)) : f(g)(v);
          }
        } catch (O) {
          i = { error: O };
        } finally {
          try {
            b && !b.done && (u = m.return) && u.call(m);
          } finally {
            if (i) throw i.error;
          }
        }
        return r;
      },
      l = function (d) {
        var i = {};
        return (
          d.forEach(function (u, r) {
            var f, m;
            r === "set-cookie"
              ? (((m = i[r]) !== null && m !== void 0) || (i[r] = []),
                (f = i[r]).push.apply(
                  f,
                  h(
                    [],
                    c(
                      u.split(";").map(function (b) {
                        return b.trim();
                      }),
                    ),
                    !1,
                  ),
                ))
              : (i[r] = u);
          }),
          i
        );
      };
    return D;
  }
  var Tn;
  function ps() {
    if (Tn) return le;
    Tn = 1;
    var n =
        (le && le.__awaiter) ||
        function (c, h, o, y) {
          function _(a) {
            return a instanceof o
              ? a
              : new o(function (l) {
                  l(a);
                });
          }
          return new (o || (o = Promise))(function (a, l) {
            function d(r) {
              try {
                u(y.next(r));
              } catch (f) {
                l(f);
              }
            }
            function i(r) {
              try {
                u(y.throw(r));
              } catch (f) {
                l(f);
              }
            }
            function u(r) {
              r.done ? a(r.value) : _(r.value).then(d, i);
            }
            u((y = y.apply(c, h || [])).next());
          });
        },
      e =
        (le && le.__generator) ||
        function (c, h) {
          var o = {
              label: 0,
              sent: function () {
                if (a[0] & 1) throw a[1];
                return a[1];
              },
              trys: [],
              ops: [],
            },
            y,
            _,
            a,
            l = Object.create((typeof Iterator == "function" ? Iterator : Object).prototype);
          return (
            (l.next = d(0)),
            (l.throw = d(1)),
            (l.return = d(2)),
            typeof Symbol == "function" &&
              (l[Symbol.iterator] = function () {
                return this;
              }),
            l
          );
          function d(u) {
            return function (r) {
              return i([u, r]);
            };
          }
          function i(u) {
            if (y) throw new TypeError("Generator is already executing.");
            for (; l && ((l = 0), u[0] && (o = 0)), o; )
              try {
                if (
                  ((y = 1),
                  _ &&
                    (a = u[0] & 2 ? _.return : u[0] ? _.throw || ((a = _.return) && a.call(_), 0) : _.next) &&
                    !(a = a.call(_, u[1])).done)
                )
                  return a;
                switch (((_ = 0), a && (u = [u[0] & 2, a.value]), u[0])) {
                  case 0:
                  case 1:
                    a = u;
                    break;
                  case 4:
                    return o.label++, { value: u[1], done: !1 };
                  case 5:
                    o.label++, (_ = u[1]), (u = [0]);
                    continue;
                  case 7:
                    (u = o.ops.pop()), o.trys.pop();
                    continue;
                  default:
                    if (((a = o.trys), !(a = a.length > 0 && a[a.length - 1]) && (u[0] === 6 || u[0] === 2))) {
                      o = 0;
                      continue;
                    }
                    if (u[0] === 3 && (!a || (u[1] > a[0] && u[1] < a[3]))) {
                      o.label = u[1];
                      break;
                    }
                    if (u[0] === 6 && o.label < a[1]) {
                      (o.label = a[1]), (a = u);
                      break;
                    }
                    if (a && o.label < a[2]) {
                      (o.label = a[2]), o.ops.push(u);
                      break;
                    }
                    a[2] && o.ops.pop(), o.trys.pop();
                    continue;
                }
                u = h.call(c, o);
              } catch (r) {
                (u = [6, r]), (_ = 0);
              } finally {
                y = a = 0;
              }
            if (u[0] & 5) throw u[1];
            return { value: u[0] ? u[1] : void 0, done: !0 };
          }
        };
    Object.defineProperty(le, "__esModule", { value: !0 }), (le.PlainFetcher = void 0);
    var t = gs(),
      s;
    return (
      (function (c) {
        function h(y, _, a, l) {
          return n(this, void 0, void 0, function () {
            var d, i;
            return e(this, function (u) {
              if (
                ((d = _.request) === null || d === void 0 ? void 0 : d.encrypted) === !0 ||
                ((i = _.response) === null || i === void 0 ? void 0 : i.encrypted) === !0
              )
                throw new Error(
                  "Error on PlainFetcher.fetch(): PlainFetcher doesn't have encryption ability. Use EncryptedFetcher instead.",
                );
              return [
                2,
                t.FetcherBase.request({
                  className: "PlainFetcher",
                  encode: function (r) {
                    return r;
                  },
                  decode: function (r) {
                    return r;
                  },
                })(y, _, a, l),
              ];
            });
          });
        }
        c.fetch = h;
        function o(y, _, a, l) {
          return n(this, void 0, void 0, function () {
            var d, i;
            return e(this, function (u) {
              if (
                ((d = _.request) === null || d === void 0 ? void 0 : d.encrypted) === !0 ||
                ((i = _.response) === null || i === void 0 ? void 0 : i.encrypted) === !0
              )
                throw new Error(
                  "Error on PlainFetcher.propagate(): PlainFetcher doesn't have encryption ability. Use EncryptedFetcher instead.",
                );
              return [
                2,
                t.FetcherBase.propagate({
                  className: "PlainFetcher",
                  encode: function (r) {
                    return r;
                  },
                  decode: function (r) {
                    return r;
                  },
                })(y, _, a, l),
              ];
            });
          });
        }
        c.propagate = o;
      })(s || (le.PlainFetcher = s = {})),
      le
    );
  }
  var Ie = ps();
  function vs() {
    z("assertFunction");
  }
  function ws() {
    z("assertParameters");
  }
  function xs() {
    z("assertReturn");
  }
  function Os() {
    z("assertEqualsFunction");
  }
  function $s() {
    z("assertEqualsParameters");
  }
  function qs() {
    z("assertEqualsReturn");
  }
  function Es() {
    z("isFunction");
  }
  function Ss() {
    z("isParameters");
  }
  function Ps() {
    z("isReturn");
  }
  function js() {
    z("equalsFunction");
  }
  function Is() {
    z("equalsParameters");
  }
  function ks() {
    z("equalsReturn");
  }
  function Rs() {
    z("validateFunction");
  }
  function As() {
    z("validateReturn");
  }
  function zs() {
    z("validateReturn");
  }
  function Ns() {
    z("validateEqualsFunction");
  }
  function Ms() {
    z("validateEqualsParameters");
  }
  function Fs() {
    z("validateEqualsReturn");
  }
  function z(n) {
    throw new Error(
      `Error on typia.functional.${n}(): no transform has been configured. Read and follow https://typia.io/docs/setup please.`,
    );
  }
  var Hs = Object.freeze({
    __proto__: null,
    assertEqualsFunction: Os,
    assertEqualsParameters: $s,
    assertEqualsReturn: qs,
    assertFunction: vs,
    assertParameters: ws,
    assertReturn: xs,
    equalsFunction: js,
    equalsParameters: Is,
    equalsReturn: ks,
    isFunction: Es,
    isParameters: Ss,
    isReturn: Ps,
    validateEqualsFunction: Ns,
    validateEqualsParameters: Ms,
    validateEqualsReturn: Fs,
    validateFunction: Rs,
    validateParameters: As,
    validateReturn: zs,
  });
  function Ds() {
    E("formData");
  }
  function Ws() {
    E("assertFormData");
  }
  function Us() {
    E("isFormData");
  }
  function Js() {
    E("validateFormData");
  }
  function Qs() {
    E("query");
  }
  function Ls() {
    E("assertQuery");
  }
  function Ks() {
    E("isQuery");
  }
  function Bs() {
    E("validateQuery");
  }
  function Zs() {
    E("headers");
  }
  function Ys() {
    E("assertHeaders");
  }
  function Xs() {
    E("isHeaders");
  }
  function Gs() {
    E("validateHeaders");
  }
  function Vs() {
    E("parameter");
  }
  function Cs() {
    E("createFormData");
  }
  function Ts() {
    E("createAssertFormData");
  }
  function ei() {
    E("createIsFormData");
  }
  function ti() {
    E("createValidateFormData");
  }
  function ni() {
    E("createQuery");
  }
  function ri() {
    E("createAssertQuery");
  }
  function si() {
    E("createIsQuery");
  }
  function ii() {
    E("createValidateQuery");
  }
  function ai() {
    E("createHeaders");
  }
  function oi() {
    E("createAssertHeaders");
  }
  function ui() {
    E("createIsHeaders");
  }
  function li() {
    E("createValidateHeaders");
  }
  function ci() {
    E("createParameter");
  }
  function E(n) {
    throw new Error(
      `Error on typia.http.${n}(): no transform has been configured. Read and follow https://typia.io/docs/setup please.`,
    );
  }
  var di = Object.freeze({
    __proto__: null,
    assertFormData: Ws,
    assertHeaders: Ys,
    assertQuery: Ls,
    createAssertFormData: Ts,
    createAssertHeaders: oi,
    createAssertQuery: ri,
    createFormData: Cs,
    createHeaders: ai,
    createIsFormData: ei,
    createIsHeaders: ui,
    createIsQuery: si,
    createParameter: ci,
    createQuery: ni,
    createValidateFormData: ti,
    createValidateHeaders: li,
    createValidateQuery: ii,
    formData: Ds,
    headers: Zs,
    isFormData: Us,
    isHeaders: Xs,
    isQuery: Ks,
    parameter: Vs,
    query: Qs,
    validateFormData: Js,
    validateHeaders: Gs,
    validateQuery: Bs,
  });
  function fi() {
    ut("applicationOfValidate");
  }
  function hi() {
    ut("application");
  }
  function _i() {
    ut("parameters");
  }
  function mi() {
    ut("schema");
  }
  function ut(n) {
    throw new Error(
      `Error on typia.llm.${n}(): no transform has been configured. Read and follow https://typia.io/docs/setup please.`,
    );
  }
  var yi = Object.freeze({ __proto__: null, application: hi, applicationOfValidate: fi, parameters: _i, schema: mi });
  function bi() {
    J("schemas");
  }
  function gi() {
    J("application");
  }
  function pi() {
    J("assertParse");
  }
  function vi() {
    J("isParse");
  }
  function wi() {
    J("validateParse");
  }
  function xi() {
    J("stringify");
  }
  function Oi() {
    J("assertStringify");
  }
  function $i() {
    J("isStringify");
  }
  function qi() {
    J("validateStringify");
  }
  function Ei() {
    J("createIsParse");
  }
  function Si() {
    J("createAssertParse");
  }
  function Pi() {
    J("createValidateParse");
  }
  function ji() {
    J("createStringify");
  }
  function Ii() {
    J("createAssertStringify");
  }
  function ki() {
    J("createIsStringify");
  }
  function Ri() {
    J("createValidateStringify");
  }
  function J(n) {
    throw new Error(
      `Error on typia.json.${n}(): no transform has been configured. Read and follow https://typia.io/docs/setup please.`,
    );
  }
  var Ai = Object.freeze({
    __proto__: null,
    application: gi,
    assertParse: pi,
    assertStringify: Oi,
    createAssertParse: Si,
    createAssertStringify: Ii,
    createIsParse: Ei,
    createIsStringify: ki,
    createStringify: ji,
    createValidateParse: Pi,
    createValidateStringify: Ri,
    isParse: vi,
    isStringify: $i,
    schemas: bi,
    stringify: xi,
    validateParse: wi,
    validateStringify: qi,
  });
  function zi() {
    W("literals");
  }
  function Ni() {
    W("clone");
  }
  function Mi() {
    W("assertClone");
  }
  function Fi() {
    W("isClone");
  }
  function Hi() {
    W("validateClone");
  }
  function Di() {
    W("prune");
  }
  function Wi() {
    W("assertPrune");
  }
  function Ui() {
    W("isPrune");
  }
  function Ji() {
    W("validatePrune");
  }
  function Qi() {
    W("createClone");
  }
  function Li() {
    W("createAssertClone");
  }
  function Ki() {
    W("createIsClone");
  }
  function Bi() {
    W("createValidateClone");
  }
  function Zi() {
    W("createPrune");
  }
  function Yi() {
    W("createAssertPrune");
  }
  function Xi() {
    W("createIsPrune");
  }
  function Gi() {
    W("createValidatePrune");
  }
  function W(n) {
    throw new Error(
      `Error on typia.misc.${n}(): no transform has been configured. Read and follow https://typia.io/docs/setup please.`,
    );
  }
  var Vi = Object.freeze({
    __proto__: null,
    assertClone: Mi,
    assertPrune: Wi,
    clone: Ni,
    createAssertClone: Li,
    createAssertPrune: Yi,
    createClone: Qi,
    createIsClone: Ki,
    createIsPrune: Xi,
    createPrune: Zi,
    createValidateClone: Bi,
    createValidatePrune: Gi,
    isClone: Fi,
    isPrune: Ui,
    literals: zi,
    prune: Di,
    validateClone: Hi,
    validatePrune: Ji,
  });
  function Ci() {
    return S("camel");
  }
  function Ti() {
    return S("assertCamel");
  }
  function ea() {
    return S("isCamel");
  }
  function ta() {
    return S("validateCamel");
  }
  function na() {
    return S("pascal");
  }
  function ra() {
    return S("assertPascal");
  }
  function sa() {
    return S("isPascal");
  }
  function ia() {
    return S("validatePascal");
  }
  function aa() {
    return S("snake");
  }
  function oa() {
    return S("assertSnake");
  }
  function ua() {
    return S("isSnake");
  }
  function la() {
    return S("validateSnake");
  }
  function ca() {
    S("createCamel");
  }
  function da() {
    S("createAssertCamel");
  }
  function fa() {
    S("createIsCamel");
  }
  function ha() {
    S("createValidateCamel");
  }
  function _a() {
    S("createPascal");
  }
  function ma() {
    S("createAssertPascal");
  }
  function ya() {
    S("createIsPascal");
  }
  function ba() {
    S("createValidatePascal");
  }
  function ga() {
    S("createSnake");
  }
  function pa() {
    S("createAssertSnake");
  }
  function va() {
    S("createIsSnake");
  }
  function wa() {
    S("createValidateSnake");
  }
  function S(n) {
    throw new Error(
      `Error on typia.notations.${n}(): no transform has been configured. Read and follow https://typia.io/docs/setup please.`,
    );
  }
  var xa = Object.freeze({
    __proto__: null,
    assertCamel: Ti,
    assertPascal: ra,
    assertSnake: oa,
    camel: Ci,
    createAssertCamel: da,
    createAssertPascal: ma,
    createAssertSnake: pa,
    createCamel: ca,
    createIsCamel: fa,
    createIsPascal: ya,
    createIsSnake: va,
    createPascal: _a,
    createSnake: ga,
    createValidateCamel: ha,
    createValidatePascal: ba,
    createValidateSnake: wa,
    isCamel: ea,
    isPascal: sa,
    isSnake: ua,
    pascal: na,
    snake: aa,
    validateCamel: ta,
    validatePascal: ia,
    validateSnake: la,
  });
  function Oa() {
    U("message");
  }
  function $a() {
    U("decode");
  }
  function qa() {
    U("assertDecode");
  }
  function Ea() {
    U("isDecode");
  }
  function Sa() {
    U("validateDecode");
  }
  function Pa() {
    U("encode");
  }
  function ja() {
    U("assertEncode");
  }
  function Ia() {
    U("isEncode");
  }
  function ka() {
    U("validateEncode");
  }
  function Ra() {
    U("createDecode");
  }
  function Aa() {
    U("createIsDecode");
  }
  function za() {
    U("createAssertDecode");
  }
  function Na() {
    U("createValidateDecode");
  }
  function Ma() {
    U("createEncode");
  }
  function Fa() {
    U("createIsEncode");
  }
  function Ha() {
    U("createAssertEncode");
  }
  function Da() {
    U("createValidateEncode");
  }
  function U(n) {
    throw new Error(
      `Error on typia.protobuf.${n}(): no transform has been configured. Read and follow https://typia.io/docs/setup please.`,
    );
  }
  var Wa = Object.freeze({
    __proto__: null,
    assertDecode: qa,
    assertEncode: ja,
    createAssertDecode: za,
    createAssertEncode: Ha,
    createDecode: Ra,
    createEncode: Ma,
    createIsDecode: Aa,
    createIsEncode: Fa,
    createValidateDecode: Na,
    createValidateEncode: Da,
    decode: $a,
    encode: Pa,
    isDecode: Ea,
    isEncode: Ia,
    message: Oa,
    validateDecode: Sa,
    validateEncode: ka,
  });
  function Ua() {
    er("metadata");
  }
  function Ja() {
    er("name");
  }
  function er(n) {
    throw new Error(
      `Error on typia.reflect.${n}(): no transform has been configured. Read and follow https://typia.io/docs/setup please.`,
    );
  }
  var Qa = Object.freeze({ __proto__: null, metadata: Ua, name: Ja }),
    La = Object.freeze({ __proto__: null }),
    sn;
  sn || (sn = {});
  var an;
  an || (an = {});
  class Ka extends Error {
    constructor(t) {
      super(
        t.message || `Error on ${t.method}(): invalid type${t.path ? ` on ${t.path}` : ""}, expect to be ${t.expected}`,
      );
      He(this, "method");
      He(this, "path");
      He(this, "expected");
      He(this, "value");
      He(this, "fake_expected_typed_value_");
      const s = new.target.prototype;
      Object.setPrototypeOf ? Object.setPrototypeOf(this, s) : (this.__proto__ = s),
        (this.method = t.method),
        (this.path = t.path),
        (this.expected = t.expected),
        (this.value = t.value);
    }
  }
  function Ba() {
    N("assert");
  }
  function Za() {
    N("assertGuard");
  }
  function Ya() {
    N("is");
  }
  function Xa() {
    N("validate");
  }
  function Ga() {
    N("assertEquals");
  }
  function Va() {
    N("assertGuardEquals");
  }
  function Ca() {
    N("equals");
  }
  function Ta() {
    N("validateEquals");
  }
  function eo() {
    N("random");
  }
  function to() {
    N("createAssert");
  }
  function no() {
    N("createAssertGuard");
  }
  function ro() {
    N("createIs");
  }
  function so() {
    N("createValidate");
  }
  function io() {
    N("createAssertEquals");
  }
  function ao() {
    N("createAssertGuardEquals");
  }
  function oo() {
    N("createEquals");
  }
  function uo() {
    N("createValidateEquals");
  }
  function lo() {
    N("createRandom");
  }
  function N(n) {
    throw new Error(
      `Error on typia.${n}(): no transform has been configured. Read and follow https://typia.io/docs/setup please.`,
    );
  }
  var pe = Object.freeze({
    __proto__: null,
    get ILlmApplicationOfValidate() {
      return sn;
    },
    get ILlmFunctionOfValidate() {
      return an;
    },
    TypeGuardError: Ka,
    assert: Ba,
    assertEquals: Ga,
    assertGuard: Za,
    assertGuardEquals: Va,
    createAssert: to,
    createAssertEquals: io,
    createAssertGuard: no,
    createAssertGuardEquals: ao,
    createEquals: oo,
    createIs: ro,
    createRandom: lo,
    createValidate: so,
    createValidateEquals: uo,
    equals: Ca,
    functional: Hs,
    http: di,
    is: Ya,
    json: Ai,
    llm: yi,
    misc: Vi,
    notations: xa,
    protobuf: Wa,
    random: eo,
    reflect: Qa,
    tags: La,
    validate: Xa,
    validateEquals: Ta,
  });
  async function ve(n) {
    return n.simulate
      ? ve.simulate(n)
      : Ie.PlainFetcher.fetch(n, { ...ve.METADATA, template: ve.METADATA.path, path: ve.path() });
  }
  ((n) => {
    (n.METADATA = {
      method: "GET",
      path: "/monitors/health",
      request: null,
      response: { type: "application/json", encrypted: !1 },
      status: 200,
    }),
      (n.path = () => "/monitors/health"),
      (n.random = (e) => pe.random(e)),
      (n.simulate = (e) => (0, n.random)(typeof e.simulate == "object" && e.simulate !== null ? e.simulate : void 0));
  })(ve || (ve = {}));
  const co = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        get get() {
          return ve;
        },
      },
      Symbol.toStringTag,
      { value: "Module" },
    ),
  );
  async function we(n) {
    return n.simulate
      ? we.simulate(n)
      : Ie.PlainFetcher.fetch(n, { ...we.METADATA, template: we.METADATA.path, path: we.path() });
  }
  ((n) => {
    (n.METADATA = {
      method: "GET",
      path: "/monitors/performance",
      request: null,
      response: { type: "application/json", encrypted: !1 },
      status: 200,
    }),
      (n.path = () => "/monitors/performance"),
      (n.random = (e) => pe.random(e)),
      (n.simulate = (e) => (0, n.random)(typeof e.simulate == "object" && e.simulate !== null ? e.simulate : void 0));
  })(we || (we = {}));
  const fo = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        get get() {
          return we;
        },
      },
      Symbol.toStringTag,
      { value: "Module" },
    ),
  );
  async function xe(n) {
    return n.simulate
      ? xe.simulate(n)
      : Ie.PlainFetcher.fetch(n, { ...xe.METADATA, template: xe.METADATA.path, path: xe.path() });
  }
  ((n) => {
    (n.METADATA = {
      method: "GET",
      path: "/monitors/system",
      request: null,
      response: { type: "application/json", encrypted: !1 },
      status: 200,
    }),
      (n.path = () => "/monitors/system"),
      (n.random = (e) => pe.random(e)),
      (n.simulate = (e) => (0, n.random)(typeof e.simulate == "object" && e.simulate !== null ? e.simulate : void 0));
  })(xe || (xe = {}));
  async function Oe(n) {
    return n.simulate
      ? Oe.simulate(n)
      : Ie.PlainFetcher.fetch(n, { ...Oe.METADATA, template: Oe.METADATA.path, path: Oe.path() });
  }
  ((n) => {
    (n.METADATA = {
      method: "GET",
      path: "/monitors/system/internal_server_error",
      request: null,
      response: { type: "application/json", encrypted: !1 },
      status: 200,
    }),
      (n.path = () => "/monitors/system/internal_server_error"),
      (n.random = (e) => pe.random(e)),
      (n.simulate = (e) => (0, n.random)(typeof e.simulate == "object" && e.simulate !== null ? e.simulate : void 0));
  })(Oe || (Oe = {}));
  async function $e(n) {
    return n.simulate
      ? $e.simulate(n)
      : Ie.PlainFetcher.fetch(n, { ...$e.METADATA, template: $e.METADATA.path, path: $e.path() });
  }
  ((n) => {
    (n.METADATA = {
      method: "GET",
      path: "/monitors/system/uncaught_exception",
      request: null,
      response: { type: "application/json", encrypted: !1 },
      status: 200,
    }),
      (n.path = () => "/monitors/system/uncaught_exception"),
      (n.random = (e) => pe.random(e)),
      (n.simulate = (e) => (0, n.random)(typeof e.simulate == "object" && e.simulate !== null ? e.simulate : void 0));
  })($e || ($e = {}));
  const ho = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        health: co,
        performance: fo,
        system: Object.freeze(
          Object.defineProperty(
            {
              __proto__: null,
              get get() {
                return xe;
              },
              get internal_server_error() {
                return Oe;
              },
              get uncaught_exception() {
                return $e;
              },
            },
            Symbol.toStringTag,
            { value: "Module" },
          ),
        ),
      },
      Symbol.toStringTag,
      { value: "Module" },
    ),
  );
  var Be = {},
    tr;
  function _o() {
    if (tr) return Be;
    (tr = 1), Object.defineProperty(Be, "__esModule", { value: !0 }), (Be.NestiaSimulator = void 0);
    var n = Ct(),
      e;
    (function (s) {
      s.assert = function (_) {
        return { param: c(_), query: h(_), body: o(_) };
      };
      var c = function (_) {
          return function (a) {
            return function (l) {
              y(function (d) {
                return 'URL parameter "'.concat(a, '" is not ').concat(d.expected, " type.");
              })(_)(l);
            };
          };
        },
        h = function (_) {
          return function (a) {
            return y(function () {
              return "Request query parameters are not following the promised type.";
            })(_)(a);
          };
        },
        o = function (_) {
          return function (a) {
            return y(function () {
              return "Request body is not following the promised type.";
            })(_)(a);
          };
        },
        y = function (_, a) {
          return function (l) {
            return function (d) {
              try {
                d();
              } catch (i) {
                throw t(i)
                  ? new n.HttpError(
                      l.method,
                      l.host + l.path,
                      400,
                      { "Content-Type": l.contentType },
                      JSON.stringify({
                        method: i.method,
                        path: i.path,
                        expected: i.expected,
                        value: i.value,
                        message: _(i),
                      }),
                    )
                  : i;
              }
            };
          };
        };
    })(e || (Be.NestiaSimulator = e = {}));
    var t = function (s) {
      return (
        typeof s.method == "string" &&
        (s.path === void 0 || typeof s.path == "string") &&
        typeof s.expected == "string" &&
        typeof s.name == "string" &&
        typeof s.message == "string" &&
        (s.stack === void 0 || typeof s.stack == "string")
      );
    };
    return Be;
  }
  var mo = _o();
  async function qe(n, e) {
    return n.simulate
      ? qe.simulate(n, e)
      : Ie.PlainFetcher.fetch(n, { ...qe.METADATA, template: qe.METADATA.path, path: qe.path(e) });
  }
  ((n) => {
    (n.METADATA = {
      method: "GET",
      path: "/wanted",
      request: null,
      response: { type: "application/json", encrypted: !1 },
      status: 200,
    }),
      (n.path = (e) => {
        const t = new URLSearchParams();
        for (const [c, h] of Object.entries(e))
          h !== void 0 && (Array.isArray(h) ? h.forEach((o) => t.append(c, String(o))) : t.set(c, String(h)));
        const s = "/wanted";
        return t.size === 0 ? s : `${s}?${t.toString()}`;
      }),
      (n.random = (e) => pe.random(e)),
      (n.simulate = (e, t) => (
        mo.NestiaSimulator.assert({
          method: n.METADATA.method,
          host: e.host,
          path: (0, n.path)(t),
          contentType: "application/json",
        }).query(() => pe.assert(t)),
        (0, n.random)(typeof e.simulate == "object" && e.simulate !== null ? e.simulate : void 0)
      ));
  })(qe || (qe = {}));
  const yo = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        get search() {
          return qe;
        },
      },
      Symbol.toStringTag,
      { value: "Module" },
    ),
  );
  class nr {
    constructor(e, t) {
      (this.it_ = e), (this.last_ = t);
    }
    next() {
      if (this.it_.equals(this.last_)) return { done: !0, value: void 0 };
      {
        const e = this.it_;
        return (this.it_ = this.it_.next()), { done: !1, value: e.value };
      }
    }
    [Symbol.iterator]() {
      return this;
    }
  }
  class lt {
    empty() {
      return this.size() === 0;
    }
    rbegin() {
      return this.end().reverse();
    }
    rend() {
      return this.begin().reverse();
    }
    [Symbol.iterator]() {
      return new nr(this.begin(), this.end());
    }
    toJSON() {
      const e = [];
      for (const t of this) e.push(t);
      return e;
    }
  }
  class Z {
    constructor(e, t) {
      (this.data_ = e), (this.index_ = t);
    }
    index() {
      return this.index_;
    }
    get value() {
      return this.data_[this.index_];
    }
    prev() {
      return --this.index_, this;
    }
    next() {
      return ++this.index_, this;
    }
    advance(e) {
      return (this.index_ += e), this;
    }
    equals(e) {
      return this.data_ === e.data_ && this.index_ === e.index_;
    }
    swap(e) {
      ([this.data_, e.data_] = [e.data_, this.data_]), ([this.index_, e.index_] = [e.index_, this.index_]);
    }
  }
  class rr extends lt {
    constructor(e) {
      super(), (this.data_ = e(this));
    }
    assign(e, t) {
      this.clear(), this.insert(e, t);
    }
    clear() {
      this.data_.clear();
    }
    begin() {
      return this.data_.begin();
    }
    end() {
      return this.data_.end();
    }
    has(e) {
      return !this.find(e).equals(this.end());
    }
    size() {
      return this.data_.size();
    }
    push(...e) {
      if (e.length === 0) return this.size();
      const t = new Z(e, 0),
        s = new Z(e, e.length);
      return this._Insert_by_range(t, s), this.size();
    }
    insert(...e) {
      return e.length === 1
        ? this._Insert_by_key(e[0])
        : e[0].next instanceof Function && e[1].next instanceof Function
          ? this._Insert_by_range(e[0], e[1])
          : this._Insert_by_hint(e[0], e[1]);
    }
    erase(...e) {
      return e.length === 1 && !(e[0] instanceof this.end().constructor && e[0].source() === this)
        ? this._Erase_by_val(e[0])
        : e.length === 1
          ? this._Erase_by_range(e[0])
          : this._Erase_by_range(e[0], e[1]);
    }
    _Erase_by_range(e, t = e.next()) {
      const s = this.data_.erase(e, t);
      return this._Handle_erase(e, t), s;
    }
  }
  class sr extends Error {
    constructor(e) {
      super(e);
      const t = new.target.prototype;
      Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : (this.__proto__ = t);
    }
    get name() {
      return this.constructor.name;
    }
    what() {
      return this.message;
    }
    toJSON() {
      return { name: this.name, message: this.message, stack: this.stack };
    }
  }
  class ir extends sr {
    constructor(e) {
      super(e);
    }
  }
  class Ze extends ir {
    constructor(e) {
      super(e);
    }
  }
  class he extends ir {
    constructor(e) {
      super(e);
    }
  }
  var P;
  (function (n) {
    function e(l) {
      if (typeof l == "string") return l;
      let d = l.constructor.name;
      return l.constructor.__MODULE && (d = `${l.constructor.__MODULE}.${d}`), `std.${d}`;
    }
    n.get_class_name = e;
    function t(l, d) {
      return new he(`Error on ${e(l)}.${d}(): it's empty container.`);
    }
    n.empty = t;
    function s(l, d, i) {
      return new he(`Error on ${e(l)}.${d}(): parametric index is negative -> (index = ${i}).`);
    }
    n.negative_index = s;
    function c(l, d, i, u) {
      return new he(
        `Error on ${e(l)}.${d}(): parametric index is equal or greater than size -> (index = ${i}, size: ${u}).`,
      );
    }
    n.excessive_index = c;
    function h(l, d) {
      return new Ze(`Error on ${e(l)}.${d}(): parametric iterator is not this container's own.`);
    }
    n.not_my_iterator = h;
    function o(l, d) {
      return new Ze(`Error on ${e(l)}.${d}(): parametric iterator, it already has been erased.`);
    }
    n.erased_iterator = o;
    function y(l, d, i) {
      return new he(`Error on ${e(l)}.${d}(): parametric iterator is directing negative position -> (index = ${i}).`);
    }
    n.negative_iterator = y;
    function _(l, d = "end") {
      const i = e(l);
      return new he(`Error on ${i}.Iterator.value: cannot access to the ${i}.${d}().value.`);
    }
    n.iterator_end_value = _;
    function a(l, d, i) {
      throw new he(`Error on ${e(l)}.${d}(): unable to find the matched key -> ${i}`);
    }
    n.key_nout_found = a;
  })(P || (P = {}));
  class ar extends rr {
    count(e) {
      return this.find(e).equals(this.end()) ? 0 : 1;
    }
    insert(...e) {
      return super.insert(...e);
    }
    _Insert_by_range(e, t) {
      for (; !e.equals(t); e = e.next()) this._Insert_by_key(e.value);
    }
    extract(e) {
      return e instanceof this.end().constructor ? this._Extract_by_iterator(e) : this._Extract_by_val(e);
    }
    _Extract_by_val(e) {
      const t = this.find(e);
      if (t.equals(this.end()) === !0) throw P.key_nout_found(this, "extract", e);
      return this._Erase_by_range(t), e;
    }
    _Extract_by_iterator(e) {
      return e.equals(this.end()) === !0 || this.has(e.value) === !1 ? this.end() : (this._Erase_by_range(e), e);
    }
    _Erase_by_val(e) {
      const t = this.find(e);
      return t.equals(this.end()) === !0 ? 0 : (this._Erase_by_range(t), 1);
    }
    merge(e) {
      for (let t = e.begin(); !t.equals(e.end()); )
        this.has(t.value) === !1 ? (this.insert(t.value), (t = e.erase(t))) : (t = t.next());
    }
  }
  class or extends rr {
    insert(...e) {
      return super.insert(...e);
    }
    _Erase_by_val(e) {
      const t = this.find(e);
      if (t.equals(this.end()) === !0) return 0;
      let s = t.next(),
        c = 1;
      for (; !s.equals(this.end()) && this._Key_eq(e, s.value); ) (s = s.next()), ++c;
      return this._Erase_by_range(t, s), c;
    }
    merge(e) {
      this.insert(e.begin(), e.end()), e.clear();
    }
  }
  class ur extends lt {
    constructor(e) {
      super(), (this.data_ = e(this));
    }
    assign(e, t) {
      this.clear(), this.insert(e, t);
    }
    clear() {
      this.data_.clear();
    }
    begin() {
      return this.data_.begin();
    }
    end() {
      return this.data_.end();
    }
    has(e) {
      return !this.find(e).equals(this.end());
    }
    size() {
      return this.data_.size();
    }
    push(...e) {
      const t = new Z(e, 0),
        s = new Z(e, e.length);
      return this.insert(t, s), this.size();
    }
    insert(...e) {
      return e.length === 1
        ? this.emplace(e[0].first, e[0].second)
        : e[0].next instanceof Function && e[1].next instanceof Function
          ? this._Insert_by_range(e[0], e[1])
          : this.emplace_hint(e[0], e[1].first, e[1].second);
    }
    erase(...e) {
      return e.length === 1 && (!(e[0] instanceof this.end().constructor) || e[0].source() !== this)
        ? this._Erase_by_key(e[0])
        : e.length === 1
          ? this._Erase_by_range(e[0])
          : this._Erase_by_range(e[0], e[1]);
    }
    _Erase_by_range(e, t = e.next()) {
      const s = this.data_.erase(e, t);
      return this._Handle_erase(e, t), s;
    }
  }
  class lr extends ur {
    count(e) {
      return this.find(e).equals(this.end()) ? 0 : 1;
    }
    get(e) {
      const t = this.find(e);
      if (t.equals(this.end()) === !0) throw P.key_nout_found(this, "get", e);
      return t.second;
    }
    take(e, t) {
      const s = this.find(e);
      return s.equals(this.end()) ? this.emplace(e, t()).first.second : s.second;
    }
    set(e, t) {
      this.insert_or_assign(e, t);
    }
    insert(...e) {
      return super.insert(...e);
    }
    _Insert_by_range(e, t) {
      for (let s = e; !s.equals(t); s = s.next()) this.emplace(s.value.first, s.value.second);
    }
    insert_or_assign(...e) {
      if (e.length === 2) return this._Insert_or_assign_with_key_value(e[0], e[1]);
      if (e.length === 3) return this._Insert_or_assign_with_hint(e[0], e[1], e[2]);
    }
    _Insert_or_assign_with_key_value(e, t) {
      const s = this.emplace(e, t);
      return s.second === !1 && (s.first.second = t), s;
    }
    _Insert_or_assign_with_hint(e, t, s) {
      const c = this.emplace_hint(e, t, s);
      return c.second !== s && (c.second = s), c;
    }
    extract(e) {
      return e instanceof this.end().constructor ? this._Extract_by_iterator(e) : this._Extract_by_key(e);
    }
    _Extract_by_key(e) {
      const t = this.find(e);
      if (t.equals(this.end()) === !0) throw P.key_nout_found(this, "extract", e);
      const s = t.value;
      return this._Erase_by_range(t), s;
    }
    _Extract_by_iterator(e) {
      return e.equals(this.end()) === !0 ? this.end() : (this._Erase_by_range(e), e);
    }
    _Erase_by_key(e) {
      const t = this.find(e);
      return t.equals(this.end()) === !0 ? 0 : (this._Erase_by_range(t), 1);
    }
    merge(e) {
      for (let t = e.begin(); !t.equals(e.end()); )
        this.has(t.first) === !1 ? (this.insert(t.value), (t = e.erase(t))) : (t = t.next());
    }
  }
  class cr extends ur {
    insert(...e) {
      return super.insert(...e);
    }
    _Erase_by_key(e) {
      const t = this.find(e);
      if (t.equals(this.end()) === !0) return 0;
      let s = t.next(),
        c = 1;
      for (; !s.equals(this.end()) && this._Key_eq(e, s.first); ) (s = s.next()), ++c;
      return this._Erase_by_range(t, s), c;
    }
    merge(e) {
      this.insert(e.begin(), e.end()), e.clear();
    }
  }
  var ct;
  (function (n) {
    function e(t, ...s) {
      let c, h;
      return (
        s.length >= 1 && s[0] instanceof Array
          ? ((c = () => {
              const o = s[0];
              t.push(...o);
            }),
            (h = s.slice(1)))
          : s.length >= 2 && s[0].next instanceof Function && s[1].next instanceof Function
            ? ((c = () => {
                const o = s[0],
                  y = s[1];
                t.assign(o, y);
              }),
              (h = s.slice(2)))
            : ((c = null), (h = s)),
        { ramda: c, tail: h }
      );
    }
    n.construct = e;
  })(ct || (ct = {}));
  function on() {
    return un === null && (un = typeof global == "object" && bo(global)), un;
  }
  function bo(n) {
    return (
      n !== null &&
      typeof n.process == "object" &&
      n.process !== null &&
      typeof n.process.versions == "object" &&
      n.process.versions !== null &&
      typeof n.process.versions.node < "u"
    );
  }
  let un = null;
  function go() {
    return Ye === null && ((Ye = on() ? global : self), Ye.__s_iUID === void 0 && (Ye.__s_iUID = 0)), Ye;
  }
  let Ye = null;
  function ce(n) {
    if (n instanceof Object) {
      if (n.hasOwnProperty("__get_m_iUID") === !1) {
        const e = ++go().__s_iUID;
        Object.defineProperty(n, "__get_m_iUID", {
          value: function () {
            return e;
          },
        });
      }
      return n.__get_m_iUID();
    } else return n === void 0 ? -1 : 0;
  }
  function ie(n, e) {
    return (
      (n = n && n.valueOf()),
      (e = e && e.valueOf()),
      n instanceof Object && n.equals instanceof Function ? n.equals(e) : n === e
    );
  }
  function po(n, e) {
    return !ie(n, e);
  }
  function ae(n, e) {
    return (
      (n = n.valueOf()),
      (e = e.valueOf()),
      n instanceof Object ? (n.less instanceof Function ? n.less(e) : ce(n) < ce(e)) : n < e
    );
  }
  var Y;
  (function (n) {
    function e(s, c, h, ...o) {
      let y = null,
        _ = ae;
      if (o.length === 1 && o[0] instanceof c) {
        const a = o[0];
        (_ = a.key_comp()),
          (y = () => {
            const l = a.begin(),
              d = a.end();
            s.assign(l, d);
          });
      } else {
        const a = ct.construct(s, ...o);
        (y = a.ramda), a.tail.length >= 1 && (_ = a.tail[0]);
      }
      h(_), y !== null && y();
    }
    n.construct = e;
    function t(s, c, h) {
      const o = c.prev();
      let y = o.equals(s.end()) || s.value_comp()(o.value, h);
      return (y = y && (c.equals(s.end()) || s.value_comp()(h, c.value))), y;
    }
    n.emplacable = t;
  })(Y || (Y = {}));
  function ln(...n) {
    let e = wo;
    for (let t of n) {
      t = t && t.valueOf();
      const s = typeof t;
      if (s === "boolean") e = vo(t, e);
      else if (s === "number" || s === "bigint") e = dr(t, e);
      else if (s === "string") e = fr(t, e);
      else if (t instanceof Object && t.hashCode instanceof Function) {
        const c = t.hashCode();
        if (n.length === 1) return c;
        (e = e ^ c), (e *= cn);
      } else e = dr(ce(t), e);
    }
    return Math.abs(e);
  }
  function vo(n, e) {
    return (e ^= n ? 1 : 0), (e *= cn), e;
  }
  function dr(n, e) {
    return fr(n.toString(), e);
  }
  function fr(n, e) {
    for (let t = 0; t < n.length; ++t) (e ^= n.charCodeAt(t)), (e *= cn);
    return Math.abs(e);
  }
  const wo = 2166136261,
    cn = 16777619;
  class R {
    constructor(e, t) {
      (this.first = e), (this.second = t);
    }
    equals(e) {
      return ie(this.first, e.first) && ie(this.second, e.second);
    }
    less(e) {
      return ie(this.first, e.first) === !1 ? ae(this.first, e.first) : ae(this.second, e.second);
    }
    hashCode() {
      return ln(this.first, this.second);
    }
  }
  class hr extends ar {
    find(e) {
      const t = this.lower_bound(e);
      return !t.equals(this.end()) && this._Key_eq(e, t.value) ? t : this.end();
    }
    equal_range(e) {
      const t = this.lower_bound(e);
      return new R(t, !t.equals(this.end()) && this._Key_eq(e, t.value) ? t.next() : t);
    }
    value_comp() {
      return this.key_comp();
    }
    _Key_eq(e, t) {
      return !this.key_comp()(e, t) && !this.key_comp()(t, e);
    }
    _Insert_by_key(e) {
      let t = this.lower_bound(e);
      return !t.equals(this.end()) && this._Key_eq(t.value, e)
        ? new R(t, !1)
        : ((t = this.data_.insert(t, e)), this._Handle_insert(t, t.next()), new R(t, !0));
    }
    _Insert_by_hint(e, t) {
      if (Y.emplacable(this, e, t)) {
        const c = this.data_.insert(e, t);
        return this._Handle_insert(c, c.next()), c;
      } else return this._Insert_by_key(t).first;
    }
  }
  class xo extends sr {
    constructor(e) {
      super(e);
    }
  }
  class Oo extends xo {
    constructor(e) {
      super(e);
    }
  }
  class ke {
    constructor(e, t) {
      (this.index_ = e), (this.value_ = t);
    }
    index() {
      return this.index_;
    }
    get value() {
      return this.value_;
    }
    next() {
      return ++this.index_, this;
    }
    equals(e) {
      return this.index_ === e.index_;
    }
  }
  class dn extends lt {
    begin() {
      return this.nth(0);
    }
    end() {
      return this.nth(this.size());
    }
    at(e) {
      return this._At(e);
    }
    set(e, t) {
      if (e < 0) throw P.negative_index(this.source(), "at", e);
      if (e >= this.size()) throw P.excessive_index(this.source(), "at", e, this.size());
      this._Set(e, t);
    }
    front(e) {
      if (arguments.length === 0) return this.at(0);
      this.set(0, e);
    }
    back(e) {
      const t = this.size() - 1;
      if (arguments.length === 0) return this.at(t);
      this.set(t, e);
    }
    insert(e, ...t) {
      if (e._Get_array() !== this) throw P.not_my_iterator(this.source(), "insert");
      if (e.index() < 0) throw P.negative_iterator(this.source(), "insert", e.index());
      return (
        e.index() > this.size() && (e = this.end()),
        t.length === 1
          ? this._Insert_by_repeating_val(e, 1, t[0])
          : t.length === 2 && typeof t[0] == "number"
            ? this._Insert_by_repeating_val(e, t[0], t[1])
            : this._Insert_by_range(e, t[0], t[1])
      );
    }
    _Insert_by_repeating_val(e, t, s) {
      const c = new ke(0, s),
        h = new ke(t);
      return this._Insert_by_range(e, c, h);
    }
    pop_back() {
      if (this.empty() === !0) throw P.empty(this.source(), "pop_back");
      this._Pop_back();
    }
    erase(e, t = e.next()) {
      if (e._Get_array() !== this || t._Get_array() !== this) throw P.not_my_iterator(this.source(), "erase");
      if (e.index() < 0) throw P.negative_iterator(this.source(), "erase", e.index());
      if (e.index() > t.index())
        throw new Oo(
          `Error on ${P.get_class_name(this.source())}.erase(): first iterator has greater index than last -> (first = ${e.index()}, last = ${t.index()}).`,
        );
      return e.index() >= this.size() ? this.end() : this._Erase_by_range(e, t);
    }
  }
  class fn extends dn {
    constructor() {
      super();
    }
    assign(e, t) {
      this.clear(), this.insert(this.end(), e, t);
    }
    clear() {
      this.data_.splice(0, this.data_.length);
    }
    resize(e) {
      this.data_.length = e;
    }
    size() {
      return this.data_.length;
    }
    _At(e) {
      return this.data_[e];
    }
    _Set(e, t) {
      this.data_[e] = t;
    }
    data() {
      return this.data_;
    }
    [Symbol.iterator]() {
      return this.data_[Symbol.iterator]();
    }
    push(...e) {
      return this.data_.push(...e);
    }
    push_back(e) {
      this.data_.push(e);
    }
    _Insert_by_range(e, t, s) {
      if (e.index() >= this.size()) {
        const c = this.size();
        for (; !t.equals(s); t = t.next()) this.data_.push(t.value);
        return this.nth(c);
      } else {
        const c = this.data_.splice(e.index());
        for (; !t.equals(s); t = t.next()) this.data_.push(t.value);
        return this.data_.push(...c), e;
      }
    }
    _Pop_back() {
      this.data_.pop();
    }
    _Erase_by_range(e, t) {
      return e.index() >= this.size()
        ? e
        : t.index() >= this.size()
          ? (this.data_.splice(e.index()), this.end())
          : (this.data_.splice(e.index(), t.index() - e.index()), e);
    }
    equals(e) {
      return this.data_ === e.data_;
    }
    swap(e) {
      [this.data_, e.data_] = [e.data_, this.data_];
    }
    toJSON() {
      return this.data_;
    }
  }
  class hn {
    constructor(e, t) {
      (this.array_ = e), (this.index_ = t);
    }
    _Get_array() {
      return this.array_;
    }
    index() {
      return this.index_;
    }
    get value() {
      return this.array_.at(this.index_);
    }
    set value(e) {
      this.array_.set(this.index_, e);
    }
    prev() {
      return this.advance(-1);
    }
    next() {
      return this.advance(1);
    }
    advance(e) {
      return this.array_.nth(this.index_ + e);
    }
    equals(e) {
      return ie(this.array_, e.array_) && this.index_ === e.index_;
    }
  }
  let dt = class {
    constructor(e) {
      this.base_ = e.prev();
    }
    source() {
      return this.base_.source();
    }
    base() {
      return this.base_.next();
    }
    get value() {
      return this.base_.value;
    }
    prev() {
      return this._Create_neighbor(this.base().next());
    }
    next() {
      return this._Create_neighbor(this.base_);
    }
    equals(e) {
      return this.base_.equals(e.base_);
    }
  };
  class _n extends dt {
    advance(e) {
      return this._Create_neighbor(this.base().advance(-e));
    }
    index() {
      return this.base_.index();
    }
    get value() {
      return this.base_.value;
    }
    set value(e) {
      this.base_.value = e;
    }
  }
  class te extends fn {
    constructor(e) {
      super(), (this.data_ = []), (this.associative_ = e);
    }
    nth(e) {
      return new te.Iterator(this, e);
    }
    static _Swap_associative(e, t) {
      [e.associative_, t.associative_] = [t.associative_, e.associative_];
    }
    source() {
      return this.associative_;
    }
  }
  (function (n) {
    class e extends hn {
      source() {
        return this._Get_array().source();
      }
      reverse() {
        return new t(this);
      }
    }
    n.Iterator = e;
    class t extends _n {
      _Create_neighbor(c) {
        return new t(c);
      }
    }
    n.ReverseIterator = t;
  })(te || (te = {}));
  function ft(n, e) {
    if (n.index instanceof Function) return $o(n, e);
    let t = 0;
    for (; !n.equals(e); n = n.next()) ++t;
    return t;
  }
  function $o(n, e) {
    const t = n.index(),
      s = e.index();
    return n.base instanceof Function ? t - s : s - t;
  }
  function ht(n, e) {
    if (e === 0) return n;
    if (n.advance instanceof Function) return n.advance(e);
    let t;
    if (e < 0) {
      if (!(n.prev instanceof Function))
        throw new Ze(
          "Error on std.advance(): parametric iterator is not a bi-directional iterator, thus advancing to negative direction is not possible.",
        );
      (t = (s) => s.prev()), (e = -e);
    } else t = (s) => s.next();
    for (; e-- > 0; ) n = t(n);
    return n;
  }
  function _t(n, e, t, s = ae) {
    let c = ft(n, e);
    for (; c > 0; ) {
      const h = Math.floor(c / 2),
        o = ht(n, h);
      s(o.value, t) ? ((n = o.next()), (c -= h + 1)) : (c = h);
    }
    return n;
  }
  function mt(n, e, t, s = ae) {
    let c = ft(n, e);
    for (; c > 0; ) {
      const h = Math.floor(c / 2),
        o = ht(n, h);
      s(t, o.value) ? (c = h) : ((n = o.next()), (c -= h + 1));
    }
    return n;
  }
  class yt extends hr {
    constructor(...e) {
      super((t) => new te(t)),
        Y.construct(
          this,
          yt,
          (t) => {
            this.key_comp_ = t;
          },
          ...e,
        );
    }
    swap(e) {
      ([this.data_, e.data_] = [e.data_, this.data_]),
        te._Swap_associative(this.data_, e.data_),
        ([this.key_comp_, e.key_comp_] = [e.key_comp_, this.key_comp_]);
    }
    nth(e) {
      return this.data_.nth(e);
    }
    key_comp() {
      return this.key_comp_;
    }
    lower_bound(e) {
      return _t(this.begin(), this.end(), e, this.value_comp());
    }
    upper_bound(e) {
      return mt(this.begin(), this.end(), e, this.value_comp());
    }
    _Handle_insert({}, {}) {}
    _Handle_erase({}, {}) {}
  }
  (function (n) {
    (n.Iterator = te.Iterator), (n.ReverseIterator = te.ReverseIterator), (n.__MODULE = "experimental");
  })(yt || (yt = {}));
  class _r extends or {
    find(e) {
      const t = this.lower_bound(e);
      return !t.equals(this.end()) && this._Key_eq(e, t.value) ? t : this.end();
    }
    count(e) {
      let t = this.find(e),
        s = 0;
      for (; !t.equals(this.end()) && this._Key_eq(t.value, e); t = t.next()) ++s;
      return s;
    }
    equal_range(e) {
      return new R(this.lower_bound(e), this.upper_bound(e));
    }
    value_comp() {
      return this.key_comp();
    }
    _Key_eq(e, t) {
      return !this.key_comp()(e, t) && !this.key_comp()(t, e);
    }
    _Insert_by_key(e) {
      let t = this.upper_bound(e);
      return (t = this.data_.insert(t, e)), this._Handle_insert(t, t.next()), t;
    }
    _Insert_by_hint(e, t) {
      if (Y.emplacable(this, e, t)) {
        const c = this.data_.insert(e, t);
        return this._Handle_insert(c, c.next()), c;
      } else return this._Insert_by_key(t);
    }
    _Insert_by_range(e, t) {
      for (let s = e; !s.equals(t); s = s.next()) this._Insert_by_key(s.value);
    }
  }
  class bt extends _r {
    constructor(...e) {
      super((t) => new te(t)),
        Y.construct(
          this,
          bt,
          (t) => {
            this.key_comp_ = t;
          },
          ...e,
        );
    }
    swap(e) {
      ([this.data_, e.data_] = [e.data_, this.data_]),
        te._Swap_associative(this.data_, e.data_),
        ([this.key_comp_, e.key_comp_] = [e.key_comp_, this.key_comp_]);
    }
    nth(e) {
      return this.data_.nth(e);
    }
    key_comp() {
      return this.key_comp_;
    }
    lower_bound(e) {
      return _t(this.begin(), this.end(), e, this.value_comp());
    }
    upper_bound(e) {
      return mt(this.begin(), this.end(), e, this.value_comp());
    }
    _Handle_insert({}, {}) {}
    _Handle_erase({}, {}) {}
  }
  (function (n) {
    (n.Iterator = te.Iterator), (n.ReverseIterator = te.ReverseIterator), (n.__MODULE = "experimental");
  })(bt || (bt = {}));
  class de {
    constructor(e, t) {
      (this.first = e), (this.second = t);
    }
    equals(e) {
      return ie(this.first, e.first);
    }
    less(e) {
      return ae(this.first, e.first);
    }
    hashCode() {
      return ln(this.first);
    }
  }
  class mr extends lr {
    find(e) {
      const t = this.lower_bound(e);
      return !t.equals(this.end()) && this._Key_eq(e, t.first) ? t : this.end();
    }
    equal_range(e) {
      const t = this.lower_bound(e);
      return new R(t, !t.equals(this.end()) && this._Key_eq(e, t.first) ? t.next() : t);
    }
    value_comp() {
      return (e, t) => this.key_comp()(e.first, t.first);
    }
    _Key_eq(e, t) {
      return !this.key_comp()(e, t) && !this.key_comp()(t, e);
    }
    emplace(e, t) {
      let s = this.lower_bound(e);
      return !s.equals(this.end()) && this._Key_eq(s.first, e)
        ? new R(s, !1)
        : ((s = this.data_.insert(s, new de(e, t))), this._Handle_insert(s, s.next()), new R(s, !0));
    }
    emplace_hint(e, t, s) {
      const c = new de(t, s);
      if (Y.emplacable(this, e, c)) {
        const o = this.data_.insert(e, c);
        return this._Handle_insert(o, o.next()), o;
      } else return this.emplace(t, s).first;
    }
  }
  class ne extends fn {
    constructor(e) {
      super(), (this.data_ = []), (this.associative_ = e);
    }
    nth(e) {
      return new ne.Iterator(this, e);
    }
    static _Swap_associative(e, t) {
      [e.associative_, t.associative_] = [t.associative_, e.associative_];
    }
    source() {
      return this.associative_;
    }
  }
  (function (n) {
    class e extends hn {
      source() {
        return this._Get_array().source();
      }
      reverse() {
        return new t(this);
      }
      get first() {
        return this.value.first;
      }
      get second() {
        return this.value.second;
      }
      set second(c) {
        this.value.second = c;
      }
    }
    n.Iterator = e;
    class t extends _n {
      _Create_neighbor(c) {
        return new t(c);
      }
      get first() {
        return this.value.first;
      }
      get second() {
        return this.value.second;
      }
      set second(c) {
        this.value.second = c;
      }
    }
    n.ReverseIterator = t;
  })(ne || (ne = {}));
  class gt extends mr {
    constructor(...e) {
      super((t) => new ne(t)),
        Y.construct(
          this,
          gt,
          (t) => {
            this.key_comp_ = t;
          },
          ...e,
        );
    }
    swap(e) {
      ([this.data_, e.data_] = [e.data_, this.data_]),
        ne._Swap_associative(this.data_, e.data_),
        ([this.key_comp_, e.key_comp_] = [e.key_comp_, this.key_comp_]);
    }
    nth(e) {
      return this.data_.nth(e);
    }
    key_comp() {
      return this.key_comp_;
    }
    lower_bound(e) {
      return _t(this.begin(), this.end(), this._Capsule_key(e), this.value_comp());
    }
    upper_bound(e) {
      return mt(this.begin(), this.end(), this._Capsule_key(e), this.value_comp());
    }
    _Capsule_key(e) {
      return { first: e };
    }
    _Handle_insert({}, {}) {}
    _Handle_erase({}, {}) {}
  }
  (function (n) {
    (n.Iterator = ne.Iterator), (n.ReverseIterator = ne.ReverseIterator), (n.__MODULE = "experimental");
  })(gt || (gt = {}));
  class yr extends cr {
    find(e) {
      const t = this.lower_bound(e);
      return !t.equals(this.end()) && this._Key_eq(e, t.first) ? t : this.end();
    }
    count(e) {
      let t = this.find(e),
        s = 0;
      for (; !t.equals(this.end()) && this._Key_eq(t.first, e); t = t.next()) ++s;
      return s;
    }
    equal_range(e) {
      return new R(this.lower_bound(e), this.upper_bound(e));
    }
    value_comp() {
      return (e, t) => this.key_comp()(e.first, t.first);
    }
    _Key_eq(e, t) {
      return !this.key_comp()(e, t) && !this.key_comp()(t, e);
    }
    emplace(e, t) {
      let s = this.upper_bound(e);
      return (s = this.data_.insert(s, new de(e, t))), this._Handle_insert(s, s.next()), s;
    }
    emplace_hint(e, t, s) {
      const c = new de(t, s);
      if (Y.emplacable(this, e, c)) {
        const o = this.data_.insert(e, c);
        return this._Handle_insert(o, o.next()), o;
      } else return this.emplace(t, s);
    }
    _Insert_by_range(e, t) {
      for (let s = e; !s.equals(t); s = s.next()) this.emplace(s.value.first, s.value.second);
    }
  }
  class pt extends yr {
    constructor(...e) {
      super((t) => new ne(t)),
        Y.construct(
          this,
          pt,
          (t) => {
            this.key_comp_ = t;
          },
          ...e,
        );
    }
    swap(e) {
      ([this.data_, e.data_] = [e.data_, this.data_]),
        ne._Swap_associative(this.data_, e.data_),
        ([this.key_comp_, e.key_comp_] = [e.key_comp_, this.key_comp_]);
    }
    nth(e) {
      return this.data_.nth(e);
    }
    key_comp() {
      return this.key_comp_;
    }
    lower_bound(e) {
      return _t(this.begin(), this.end(), this._Capsule_key(e), this.value_comp());
    }
    upper_bound(e) {
      return mt(this.begin(), this.end(), this._Capsule_key(e), this.value_comp());
    }
    _Capsule_key(e) {
      return { first: e };
    }
    _Handle_insert({}, {}) {}
    _Handle_erase({}, {}) {}
  }
  (function (n) {
    (n.Iterator = ne.Iterator), (n.ReverseIterator = ne.ReverseIterator), (n.__MODULE = "experimental");
  })(pt || (pt = {}));
  class Re extends _n {
    _Create_neighbor(e) {
      return new Re(e);
    }
  }
  class mn extends hn {
    reverse() {
      return new Re(this);
    }
    source() {
      return this._Get_array();
    }
  }
  class _e extends fn {
    constructor(...e) {
      if ((super(), e.length === 0)) this.data_ = [];
      else if (e[0] instanceof Array) {
        const t = e[0];
        this.data_ = e[1] === !0 ? t : t.slice();
      } else if (e.length === 1 && e[0] instanceof _e) {
        const t = e[0];
        this.data_ = t.data_.slice();
      } else e.length === 2 && ((this.data_ = []), this.assign(e[0], e[1]));
    }
    static wrap(e) {
      return new _e(e, !0);
    }
    nth(e) {
      return new _e.Iterator(this, e);
    }
    source() {
      return this;
    }
  }
  (function (n) {
    (n.Iterator = mn), (n.ReverseIterator = Re);
  })(_e || (_e = {}));
  function yn(n, e, t = ae) {
    const s = e.index() - n.index();
    if (s <= 0) return;
    const c = n.advance(Math.floor(s / 2)),
      h = c.value;
    c.index() !== n.index() && bn(n, c);
    let o = 1;
    for (let y = 1; y < s; ++y) {
      const _ = n.advance(y);
      t(_.value, h) && (bn(_, n.advance(o)), ++o);
    }
    bn(n, n.advance(o - 1)), yn(n, n.advance(o - 1), t), yn(n.advance(o), e, t);
  }
  function bn(n, e) {
    [n.value, e.value] = [e.value, n.value];
  }
  class M extends dn {
    constructor(...e) {
      if ((super(), e.length === 0 && this.clear(), e.length === 1 && e[0] instanceof Array)) {
        const t = e[0],
          s = new Z(t, 0),
          c = new Z(t, t.length);
        this.assign(s, c);
      } else if (e.length === 1 && e[0] instanceof M) {
        const t = e[0];
        this.assign(t.begin(), t.end());
      } else e.length === 2 && this.assign(e[0], e[1]);
    }
    assign(e, t) {
      this.clear(), this.insert(this.end(), e, t);
    }
    clear() {
      (this.matrix_ = [[]]), (this.size_ = 0), (this.capacity_ = M.MIN_CAPACITY);
    }
    resize(e) {
      e = M._Emend(e, "resize");
      const t = e - this.size();
      t > 0 ? this.insert(this.end(), t, void 0) : t < 0 && this.erase(this.end().advance(-t), this.end());
    }
    reserve(e) {
      this._Reserve(M._Emend(e, "reserve"));
    }
    _Reserve(e) {
      const t = [[]],
        s = this._Compute_col_size(e);
      for (let c = 0; c < this.matrix_.length; ++c) {
        const h = this.matrix_[c];
        for (let o = 0; o < h.length; ++o) {
          let y = t[t.length - 1];
          t.length < M.ROW_SIZE && y.length === s && ((y = []), t.push(y)), y.push(h[o]);
        }
      }
      (this.matrix_ = t), (this.capacity_ = e);
    }
    shrink_to_fit() {
      this._Reserve(this.size());
    }
    swap(e) {
      this._Swap(e);
    }
    _Swap(e) {
      ([this.matrix_, e.matrix_] = [e.matrix_, this.matrix_]),
        ([this.size_, e.size_] = [e.size_, this.size_]),
        ([this.capacity_, e.capacity_] = [e.capacity_, this.capacity_]);
    }
    static _Emend(e, t) {
      if (((e = Math.floor(e)), e <= 0))
        throw new Ze(`Error on Deque.${t}(): n must be positive integer -> (n = ${e})`);
      return e;
    }
    size() {
      return this.size_;
    }
    capacity() {
      return this.capacity_;
    }
    nth(e) {
      return new M.Iterator(this, e);
    }
    [Symbol.iterator]() {
      return new M.ForOfAdaptor(this.matrix_);
    }
    source() {
      return this;
    }
    _At(e) {
      const t = this._Fetch_index(e);
      return this.matrix_[t.first][t.second];
    }
    _Set(e, t) {
      const s = this._Fetch_index(e);
      this.matrix_[s.first][s.second] = t;
    }
    _Fetch_index(e) {
      let t;
      for (t = 0; t < this.matrix_.length; t++) {
        const s = this.matrix_[t];
        if (e < s.length) break;
        e -= s.length;
      }
      return t === this.matrix_.length && t--, new R(t, e);
    }
    _Compute_col_size(e = this.capacity_) {
      return Math.floor(e / M.ROW_SIZE);
    }
    push(...e) {
      if (e.length === 0) return this.size();
      const t = new Z(e, 0),
        s = new Z(e, e.length);
      return this._Insert_by_range(this.end(), t, s), this.size();
    }
    push_front(e) {
      this._Try_expand_capacity(this.size_ + 1), this._Try_add_row_at_front(), this.matrix_[0].unshift(e), ++this.size_;
    }
    push_back(e) {
      this._Try_expand_capacity(this.size_ + 1),
        this._Try_add_row_at_back(),
        this.matrix_[this.matrix_.length - 1].push(e),
        ++this.size_;
    }
    pop_front() {
      if (this.empty() === !0) throw P.empty(this.constructor, "pop_front");
      this.matrix_[0].shift(),
        this.matrix_[0].length === 0 && this.matrix_.length > 1 && this.matrix_.shift(),
        this.size_--;
    }
    _Pop_back() {
      const e = this.matrix_[this.matrix_.length - 1];
      e.pop(), e.length === 0 && this.matrix_.length > 1 && this.matrix_.pop(), this.size_--;
    }
    _Insert_by_range(e, t, s) {
      const c = this.size_ + ft(t, s);
      if (c === this.size_) return e;
      if (e.equals(this.end()) === !0)
        this._Try_expand_capacity(c), this._Insert_to_end(t, s), (e = this.nth(this.size_));
      else if (c > this.capacity_) {
        const h = new M();
        h._Reserve(Math.max(c, Math.floor(this.capacity_ * M.MAGNIFIER))),
          h._Insert_to_end(this.begin(), e),
          h._Insert_to_end(t, s),
          h._Insert_to_end(e, this.end()),
          this._Swap(h);
      } else this._Insert_to_middle(e, t, s);
      return (this.size_ = c), e;
    }
    _Insert_to_middle(e, t, s) {
      const c = this._Compute_col_size(),
        h = this._Fetch_index(e.index());
      let o = this.matrix_[h.first];
      const y = h.second,
        _ = o.splice(y);
      for (; !t.equals(s); t = t.next()) {
        if (o.length === c && this.matrix_.length < M.ROW_SIZE) {
          o = new Array();
          const a = this.matrix_.splice(++h.first);
          this.matrix_.push(o), this.matrix_.push(...a);
        }
        o.push(t.value);
      }
      for (let a = 0; a < _.length; ++a) {
        if (o.length === c && this.matrix_.length < M.ROW_SIZE) {
          o = new Array();
          const l = this.matrix_.splice(++h.first);
          this.matrix_.push(o), this.matrix_.push(...l);
        }
        o.push(_[a]);
      }
    }
    _Insert_to_end(e, t) {
      for (; !e.equals(t); e = e.next())
        this._Try_add_row_at_back(), this.matrix_[this.matrix_.length - 1].push(e.value);
    }
    _Try_expand_capacity(e) {
      return e <= this.capacity_
        ? !1
        : ((e = Math.max(e, Math.floor(this.capacity_ * M.MAGNIFIER))), this._Reserve(e), !0);
    }
    _Try_add_row_at_front() {
      const e = this._Compute_col_size();
      return this.matrix_[0].length >= e && this.matrix_.length < M.ROW_SIZE
        ? ((this.matrix_ = [[]].concat(...this.matrix_)), !0)
        : !1;
    }
    _Try_add_row_at_back() {
      const e = this._Compute_col_size();
      return this.matrix_[this.matrix_.length - 1].length >= e && this.matrix_.length < M.ROW_SIZE
        ? (this.matrix_.push([]), !0)
        : !1;
    }
    _Erase_by_range(e, t) {
      if (e.index() >= this.size()) return e;
      let s;
      t.index() >= this.size() ? (s = this.size() - e.index()) : (s = t.index() - e.index()), (this.size_ -= s);
      let c = null,
        h = null,
        o = 0;
      for (; s !== 0; ) {
        const y = this._Fetch_index(e.index()),
          _ = this.matrix_[y.first],
          a = y.second,
          l = Math.min(s, _.length - a);
        _.splice(a, l),
          _.length !== 0 && (o === 0 ? (c = _) : (h = _)),
          _.length === 0 && this.matrix_.length > 1 && this.matrix_.splice(y.first, 1),
          (s -= l),
          ++o;
      }
      return (
        c !== null &&
          h !== null &&
          c.length + h.length <= this._Compute_col_size() &&
          (c.push(...h), this.matrix_.splice(this.matrix_.indexOf(h), 1)),
        e
      );
    }
  }
  (function (n) {
    (n.Iterator = mn), (n.ReverseIterator = Re), (n.ROW_SIZE = 8), (n.MIN_CAPACITY = 36), (n.MAGNIFIER = 1.5);
    class e {
      constructor(s) {
        (this.matrix_ = s), (this.row_ = 0), (this.col_ = 0);
      }
      next() {
        if (this.row_ === this.matrix_.length) return { done: !0, value: void 0 };
        {
          const s = this.matrix_[this.row_][this.col_];
          return (
            ++this.col_ === this.matrix_[this.row_].length && (++this.row_, (this.col_ = 0)), { done: !1, value: s }
          );
        }
      }
      [Symbol.iterator]() {
        return this;
      }
    }
    n.ForOfAdaptor = e;
  })(M || (M = {}));
  class oe {
    constructor(e, t, s) {
      (this.prev_ = e), (this.next_ = t), (this.value_ = s);
    }
    static _Set_prev(e, t) {
      e.prev_ = t;
    }
    static _Set_next(e, t) {
      e.next_ = t;
    }
    prev() {
      return this.prev_;
    }
    next() {
      return this.next_;
    }
    get value() {
      return this._Try_value(), this.value_;
    }
    _Try_value() {
      if (this.value_ === void 0 && this.equals(this.source().end()) === !0) throw P.iterator_end_value(this.source());
    }
    equals(e) {
      return this === e;
    }
  }
  class gn extends lt {
    constructor() {
      super(), (this.end_ = this._Create_iterator(null, null)), this.clear();
    }
    assign(e, t) {
      this.clear(), this.insert(this.end(), e, t);
    }
    clear() {
      oe._Set_prev(this.end_, this.end_),
        oe._Set_next(this.end_, this.end_),
        (this.begin_ = this.end_),
        (this.size_ = 0);
    }
    resize(e) {
      const t = e - this.size();
      t > 0 ? this.insert(this.end(), t, void 0) : t < 0 && this.erase(ht(this.end(), -t), this.end());
    }
    begin() {
      return this.begin_;
    }
    end() {
      return this.end_;
    }
    size() {
      return this.size_;
    }
    push_front(e) {
      this.insert(this.begin_, e);
    }
    push_back(e) {
      this.insert(this.end_, e);
    }
    pop_front() {
      if (this.empty() === !0) throw P.empty(this.end_.source().constructor.name, "pop_front");
      this.erase(this.begin_);
    }
    pop_back() {
      if (this.empty() === !0) throw P.empty(this.end_.source().constructor.name, "pop_back");
      this.erase(this.end_.prev());
    }
    push(...e) {
      if (e.length === 0) return this.size();
      const t = new Z(e, 0),
        s = new Z(e, e.length);
      return this._Insert_by_range(this.end(), t, s), this.size();
    }
    insert(e, ...t) {
      if (e.source() !== this.end_.source()) throw P.not_my_iterator(this.end_.source(), "insert");
      if (e.erased_ === !0) throw P.erased_iterator(this.end_.source(), "insert");
      return t.length === 1
        ? this._Insert_by_repeating_val(e, 1, t[0])
        : t.length === 2 && typeof t[0] == "number"
          ? this._Insert_by_repeating_val(e, t[0], t[1])
          : this._Insert_by_range(e, t[0], t[1]);
    }
    _Insert_by_repeating_val(e, t, s) {
      const c = new ke(0, s),
        h = new ke(t);
      return this._Insert_by_range(e, c, h);
    }
    _Insert_by_range(e, t, s) {
      let c = e.prev(),
        h = null,
        o = 0;
      for (let y = t; y.equals(s) === !1; y = y.next()) {
        const _ = this._Create_iterator(c, null, y.value);
        o === 0 && (h = _), oe._Set_next(c, _), (c = _), ++o;
      }
      return (
        e.equals(this.begin()) === !0 && (this.begin_ = h), oe._Set_next(c, e), oe._Set_prev(e, c), (this.size_ += o), h
      );
    }
    erase(e, t = e.next()) {
      return this._Erase_by_range(e, t);
    }
    _Erase_by_range(e, t) {
      if (e.source() !== this.end_.source()) throw P.not_my_iterator(this.end_.source(), "insert");
      if (e.erased_ === !0) throw P.erased_iterator(this.end_.source(), "insert");
      if (e.equals(this.end_)) return this.end_;
      const s = e.prev();
      oe._Set_next(s, t), oe._Set_prev(t, s);
      for (let c = e; !c.equals(t); c = c.next()) (c.erased_ = !0), --this.size_;
      return e.equals(this.begin_) && (this.begin_ = t), t;
    }
    swap(e) {
      ([this.begin_, e.begin_] = [e.begin_, this.begin_]),
        ([this.end_, e.end_] = [e.end_, this.end_]),
        ([this.size_, e.size_] = [e.size_, this.size_]);
    }
  }
  class re extends gn {
    constructor(...e) {
      if ((super(), (this.ptr_ = { value: this }), re.Iterator._Set_source_ptr(this.end_, this.ptr_), e.length !== 0))
        if (e.length === 1 && e[0] instanceof Array) {
          const t = e[0];
          this.push(...t);
        } else if (e.length === 1 && e[0] instanceof re) {
          const t = e[0];
          this.assign(t.begin(), t.end());
        } else e.length === 2 && this.assign(e[0], e[1]);
    }
    _Create_iterator(e, t, s) {
      return re.Iterator.create(this.ptr_, e, t, s);
    }
    front(e) {
      if (arguments.length === 0) return this.begin_.value;
      this.begin_.value = e;
    }
    back(e) {
      const t = this.end().prev();
      if (arguments.length === 0) return t.value;
      t.value = e;
    }
    unique(e = ie) {
      let t = this.begin().next();
      for (; !t.equals(this.end()); ) e(t.value, t.prev().value) === !0 ? (t = this.erase(t)) : (t = t.next());
    }
    remove(e) {
      return this.remove_if((t) => ie(t, e));
    }
    remove_if(e) {
      let t = this.begin();
      for (; !t.equals(this.end()); ) e(t.value) === !0 ? (t = this.erase(t)) : (t = t.next());
    }
    merge(e, t = ae) {
      if (this === e) return;
      let s = this.begin();
      for (; e.empty() === !1; ) {
        const c = e.begin();
        for (; !s.equals(this.end()) && t(s.value, c.value) === !0; ) s = s.next();
        this.splice(s, e, c);
      }
    }
    splice(e, t, s, c) {
      s === void 0 ? ((s = t.begin()), (c = t.end())) : c === void 0 && (c = s.next()),
        this.insert(e, s, c),
        t.erase(s, c);
    }
    sort(e = ae) {
      this._Quick_sort(this.begin(), this.end().prev(), e);
    }
    _Quick_sort(e, t, s) {
      if (!e.equals(t) && !t.equals(this.end()) && !e.equals(t.next())) {
        const c = this._Quick_sort_partition(e, t, s);
        this._Quick_sort(e, c.prev(), s), this._Quick_sort(c.next(), t, s);
      }
    }
    _Quick_sort_partition(e, t, s) {
      const c = t.value;
      let h = e.prev(),
        o = e;
      for (; !o.equals(t); o = o.next())
        s(o.value, c) && ((h = h.equals(this.end()) ? e : h.next()), ([h.value, o.value] = [o.value, h.value]));
      return (h = h.equals(this.end()) ? e : h.next()), ([h.value, o.value] = [o.value, h.value]), h;
    }
    reverse() {
      const e = this.end_.prev(),
        t = this.begin();
      for (let s = this.begin(); !s.equals(this.end()); ) {
        const c = s.prev(),
          h = s.next();
        re.Iterator._Set_prev(s, h), re.Iterator._Set_next(s, c), (s = h);
      }
      (this.begin_ = e), re.Iterator._Set_prev(this.end_, t), re.Iterator._Set_next(this.end_, e);
    }
    swap(e) {
      super.swap(e),
        ([this.ptr_, e.ptr_] = [e.ptr_, this.ptr_]),
        ([this.ptr_.value, e.ptr_.value] = [e.ptr_.value, this.ptr_.value]);
    }
  }
  (function (n) {
    class e extends oe {
      constructor(c, h, o, y) {
        super(h, o, y), (this.source_ptr_ = c);
      }
      static create(c, h, o, y) {
        return new e(c, h, o, y);
      }
      reverse() {
        return new t(this);
      }
      static _Set_source_ptr(c, h) {
        c.source_ptr_ = h;
      }
      source() {
        return this.source_ptr_.value;
      }
      get value() {
        return this._Try_value(), this.value_;
      }
      set value(c) {
        this._Try_value(), (this.value_ = c);
      }
      equals(c) {
        return this === c;
      }
    }
    n.Iterator = e;
    class t extends dt {
      _Create_neighbor(c) {
        return new t(c);
      }
      get value() {
        return this.base_.value;
      }
      set value(c) {
        this.base_.value = c;
      }
    }
    n.ReverseIterator = t;
  })(re || (re = {}));
  class I extends gn {
    constructor(e) {
      super(), (this.associative_ = e);
    }
    _Create_iterator(e, t, s) {
      return I.Iterator.create(this, e, t, s);
    }
    static _Swap_associative(e, t) {
      [e.associative_, t.associative_] = [t.associative_, e.associative_];
    }
    associative() {
      return this.associative_;
    }
  }
  (function (n) {
    class e extends oe {
      constructor(c, h, o, y) {
        super(h, o, y), (this.list_ = c);
      }
      static create(c, h, o, y) {
        return new e(c, h, o, y);
      }
      reverse() {
        return new t(this);
      }
      source() {
        return this.list_.associative();
      }
      get first() {
        return this.value.first;
      }
      get second() {
        return this.value.second;
      }
      set second(c) {
        this.value.second = c;
      }
    }
    n.Iterator = e;
    class t extends dt {
      _Create_neighbor(c) {
        return new t(c);
      }
      get first() {
        return this.base_.first;
      }
      get second() {
        return this.base_.second;
      }
      set second(c) {
        this.base_.second = c;
      }
    }
    n.ReverseIterator = t;
  })(I || (I = {}));
  class qo {
    constructor(e, t) {
      (this.value = e), (this.color = t), (this.parent = null), (this.left = null), (this.right = null);
    }
    get grand() {
      return this.parent.parent;
    }
    get sibling() {
      return this === this.parent.left ? this.parent.right : this.parent.left;
    }
    get uncle() {
      return this.parent.sibling;
    }
  }
  class br {
    constructor(e) {
      (this.root_ = null),
        (this.comp_ = e),
        (this.equal_ = function (t, s) {
          return !e(t, s) && !e(s, t);
        });
    }
    clear() {
      this.root_ = null;
    }
    root() {
      return this.root_;
    }
    get(e) {
      const t = this.nearest(e);
      return t === null || !this.equal_(e, t.value) ? null : t;
    }
    nearest(e) {
      if (this.root_ === null) return null;
      let t = this.root_;
      for (;;) {
        let s = null;
        if (this.comp_(e, t.value)) s = t.left;
        else if (this.comp_(t.value, e)) s = t.right;
        else return t;
        if (s !== null) t = s;
        else break;
      }
      return t;
    }
    _Fetch_maximum(e) {
      for (; e.right !== null; ) e = e.right;
      return e;
    }
    insert(e) {
      const t = this.nearest(e),
        s = new qo(e, 1);
      t === null ? (this.root_ = s) : ((s.parent = t), this.comp_(s.value, t.value) ? (t.left = s) : (t.right = s)),
        this._Insert_case1(s);
    }
    _Insert_case1(e) {
      e.parent === null ? (e.color = 0) : this._Insert_case2(e);
    }
    _Insert_case2(e) {
      this._Fetch_color(e.parent) !== 0 && this._Insert_case3(e);
    }
    _Insert_case3(e) {
      this._Fetch_color(e.uncle) === 1
        ? ((e.parent.color = 0), (e.uncle.color = 0), (e.grand.color = 1), this._Insert_case1(e.grand))
        : this._Insert_case4(e);
    }
    _Insert_case4(e) {
      e === e.parent.right && e.parent === e.grand.left
        ? (this._Rotate_left(e.parent), (e = e.left))
        : e === e.parent.left && e.parent === e.grand.right && (this._Rotate_right(e.parent), (e = e.right)),
        this._Insert_case5(e);
    }
    _Insert_case5(e) {
      (e.parent.color = 0),
        (e.grand.color = 1),
        e === e.parent.left && e.parent === e.grand.left ? this._Rotate_right(e.grand) : this._Rotate_left(e.grand);
    }
    erase(e) {
      let t = this.get(e);
      if (t === null) return;
      if (t.left !== null && t.right !== null) {
        const c = this._Fetch_maximum(t.left);
        (t.value = c.value), (t = c);
      }
      const s = t.right === null ? t.left : t.right;
      this._Fetch_color(t) === 0 && ((t.color = this._Fetch_color(s)), this._Erase_case1(t)),
        this._Replace_node(t, s),
        this._Fetch_color(this.root_) === 1 && (this.root_.color = 0);
    }
    _Erase_case1(e) {
      e.parent !== null && this._Erase_case2(e);
    }
    _Erase_case2(e) {
      this._Fetch_color(e.sibling) === 1 &&
        ((e.parent.color = 1),
        (e.sibling.color = 0),
        e === e.parent.left ? this._Rotate_left(e.parent) : this._Rotate_right(e.parent)),
        this._Erase_case3(e);
    }
    _Erase_case3(e) {
      this._Fetch_color(e.parent) === 0 &&
      this._Fetch_color(e.sibling) === 0 &&
      this._Fetch_color(e.sibling.left) === 0 &&
      this._Fetch_color(e.sibling.right) === 0
        ? ((e.sibling.color = 1), this._Erase_case1(e.parent))
        : this._Erase_case4(e);
    }
    _Erase_case4(e) {
      this._Fetch_color(e.parent) === 1 &&
      e.sibling !== null &&
      this._Fetch_color(e.sibling) === 0 &&
      this._Fetch_color(e.sibling.left) === 0 &&
      this._Fetch_color(e.sibling.right) === 0
        ? ((e.sibling.color = 1), (e.parent.color = 0))
        : this._Erase_case5(e);
    }
    _Erase_case5(e) {
      e === e.parent.left &&
      e.sibling !== null &&
      this._Fetch_color(e.sibling) === 0 &&
      this._Fetch_color(e.sibling.left) === 1 &&
      this._Fetch_color(e.sibling.right) === 0
        ? ((e.sibling.color = 1), (e.sibling.left.color = 0), this._Rotate_right(e.sibling))
        : e === e.parent.right &&
          e.sibling !== null &&
          this._Fetch_color(e.sibling) === 0 &&
          this._Fetch_color(e.sibling.left) === 0 &&
          this._Fetch_color(e.sibling.right) === 1 &&
          ((e.sibling.color = 1), (e.sibling.right.color = 0), this._Rotate_left(e.sibling)),
        this._Erase_case6(e);
    }
    _Erase_case6(e) {
      (e.sibling.color = this._Fetch_color(e.parent)),
        (e.parent.color = 0),
        e === e.parent.left
          ? ((e.sibling.right.color = 0), this._Rotate_left(e.parent))
          : ((e.sibling.left.color = 0), this._Rotate_right(e.parent));
    }
    _Rotate_left(e) {
      const t = e.right;
      this._Replace_node(e, t),
        (e.right = t.left),
        t.left !== null && (t.left.parent = e),
        (t.left = e),
        (e.parent = t);
    }
    _Rotate_right(e) {
      const t = e.left;
      this._Replace_node(e, t),
        (e.left = t.right),
        t.right !== null && (t.right.parent = e),
        (t.right = e),
        (e.parent = t);
    }
    _Replace_node(e, t) {
      e.parent === null ? (this.root_ = t) : e === e.parent.left ? (e.parent.left = t) : (e.parent.right = t),
        t !== null && (t.parent = e.parent);
    }
    _Fetch_color(e) {
      return e === null ? 0 : e.color;
    }
  }
  class gr extends br {
    constructor(e, t, s) {
      super(s),
        (this.source_ = e),
        (this.key_compare_ = t),
        (this.key_eq_ = function (c, h) {
          return !t(c, h) && !t(h, c);
        }),
        (this.value_compare_ = function (c, h) {
          return t(c.first, h.first);
        });
    }
    static _Swap_source(e, t) {
      [e.source_, t.source_] = [t.source_, e.source_];
    }
    get_by_key(e) {
      const t = this.nearest_by_key(e);
      return t === null || !this.key_eq_(e, t.value.first) ? null : t;
    }
    lower_bound(e) {
      const t = this.nearest_by_key(e);
      return t === null ? this.source().end() : this.key_comp()(t.value.first, e) ? t.value.next() : t.value;
    }
    equal_range(e) {
      return new R(this.lower_bound(e), this.upper_bound(e));
    }
    source() {
      return this.source_;
    }
    key_comp() {
      return this.key_compare_;
    }
    key_eq() {
      return this.key_eq_;
    }
    value_comp() {
      return this.value_compare_;
    }
  }
  class pr extends gr {
    constructor(e, t) {
      super(e, t, (s, c) => t(s.first, c.first));
    }
    nearest_by_key(e) {
      if (this.root_ === null) return null;
      let t = this.root_;
      for (;;) {
        const s = t.value;
        let c = null;
        if (this.key_comp()(e, s.first)) c = t.left;
        else if (this.key_comp()(s.first, e)) c = t.right;
        else return t;
        if (c === null) break;
        t = c;
      }
      return t;
    }
    upper_bound(e) {
      const t = this.nearest_by_key(e);
      if (t === null) return this.source().end();
      const s = t.value;
      return this.key_comp()(e, s.first) ? s : s.next();
    }
  }
  class Ae extends mr {
    constructor(...e) {
      super((t) => new I(t)),
        Y.construct(
          this,
          Ae,
          (t) => {
            this.tree_ = new pr(this, t);
          },
          ...e,
        );
    }
    clear() {
      super.clear(), this.tree_.clear();
    }
    swap(e) {
      ([this.data_, e.data_] = [e.data_, this.data_]),
        I._Swap_associative(this.data_, e.data_),
        pr._Swap_source(this.tree_, e.tree_),
        ([this.tree_, e.tree_] = [e.tree_, this.tree_]);
    }
    key_comp() {
      return this.tree_.key_comp();
    }
    lower_bound(e) {
      return this.tree_.lower_bound(e);
    }
    upper_bound(e) {
      return this.tree_.upper_bound(e);
    }
    _Handle_insert(e, t) {
      for (; !e.equals(t); e = e.next()) this.tree_.insert(e);
    }
    _Handle_erase(e, t) {
      for (; !e.equals(t); e = e.next()) this.tree_.erase(e);
    }
  }
  (function (n) {
    (n.Iterator = I.Iterator), (n.ReverseIterator = I.ReverseIterator);
  })(Ae || (Ae = {}));
  class Xe extends dn {
    constructor(...e) {
      if ((super(), e.length === 1 && e[0] instanceof Xe)) {
        const t = e[0];
        (this.data_ = new Ae(t.data_.begin(), t.data_.end())), (this.size_ = t.size_);
      } else
        e.length === 1 && e[0] instanceof Array
          ? (this.clear(), this.push(...e[0]))
          : e.length === 2
            ? this.assign(e[0], e[1])
            : this.clear();
    }
    assign(e, t) {
      this.clear(), this.insert(this.end(), e, t);
    }
    clear() {
      (this.data_ = new Ae()), (this.size_ = 0);
    }
    resize(e) {
      const t = e - this.size();
      t > 0 ? this.insert(this.end(), t, !1) : t < 0 && this.erase(this.end().advance(-t), this.end());
    }
    flip() {
      for (const e of this.data_) e.second = !e.second;
    }
    swap(e) {
      ([this.data_, e.data_] = [e.data_, this.data_]), ([this.size_, e.size_] = [e.size_, this.size_]);
    }
    source() {
      return this;
    }
    size() {
      return this.size_;
    }
    _At(e) {
      return this._Find_node(e).second;
    }
    _Set(e, t) {
      t = !!t;
      let s = this._Find_node(e);
      if (
        s.second === t ||
        (s.first === e ? (s.second = t) : (s = this.data_.emplace(e, t).first), e === this.size() - 1)
      )
        return;
      const c = s.prev(),
        h = s.next();
      po(c, this.data_.end()) && c.second === s.second && this.data_.erase(s),
        h.equals(this.data_.end()) === !0 || h.first !== e + 1 || h.second !== t
          ? this.data_.emplace(e + 1, !t)
          : this.data_.erase(h);
    }
    nth(e) {
      return new Xe.Iterator(this, e);
    }
    _Find_node(e) {
      return this.data_.upper_bound(e).prev();
    }
    push(...e) {
      if (e.length === 0) return this.size();
      const t = new Z(e, 0),
        s = new Z(e, e.length);
      return this._Insert_by_range(this.end(), t, s), this.size();
    }
    push_back(e) {
      const t = this.data_.rbegin(),
        s = this.size_++;
      (e = !!e), (this.data_.empty() || t.second !== e) && this.data_.emplace(s, e);
    }
    _Pop_back() {
      const e = this.data_.rbegin(),
        t = --this.size_;
      e.first === t && this.data_.erase(e.base());
    }
    _Insert_by_repeating_val(e, t, s) {
      const c = [];
      return c.push(new R(t, s)), e.equals(this.end()) === !0 ? this._Insert_to_end(c) : this._Insert_to_middle(e, c);
    }
    _Insert_by_range(e, t, s) {
      const c = [];
      for (let h = t; !h.equals(s); h = h.next())
        c.length === 0 || c[c.length - 1].second !== h.value ? c.push(new R(1, h.value)) : ++c[c.length - 1].first;
      return e.equals(this.end()) === !0 ? this._Insert_to_end(c) : this._Insert_to_middle(e, c);
    }
    _Insert_to_middle(e, t) {
      const s = this._Find_node(e.index());
      for (let c = s; !c.equals(this.data_.end()); c = c.next()) {
        const h = c.next(),
          o = c.first < e.index() ? e.index() : c.first,
          _ = (h.equals(this.data_.end()) ? this.size() : h.first) - o,
          a = !!c.second;
        t.push(new R(_, a));
      }
      return (
        (this.size_ = e.index()),
        this.data_.erase(s.first === e.index() ? s : s.next(), this.data_.end()),
        this._Insert_to_end(t)
      );
    }
    _Insert_to_end(e) {
      const t = this.size(),
        s = this.data_.empty() ? null : this.data_.rbegin().second;
      for (let c = 0; c < e.length; ++c) {
        const h = e[c],
          o = this.size(),
          y = !!h.second;
        (this.size_ += h.first), !(c === 0 && y === s) && this.data_.emplace(o, y);
      }
      return this.begin().advance(t);
    }
    _Erase_by_range(e, t) {
      const s = [];
      if (t.equals(this.end()) === !1) {
        const c = Math.min(this.size(), t.index());
        for (let h = this._Find_node(c); !h.equals(this.data_.end()); h = h.next()) {
          const o = h.next(),
            y = Math.max(h.first, c),
            a = (o.equals(this.data_.end()) ? this.size() : o.first) - y,
            l = h.second;
          s.push(new R(a, l));
        }
      }
      return (
        (this.size_ = e.index()),
        this.data_.erase(this.data_.lower_bound(this.size_), this.data_.end()),
        this._Insert_to_end(s)
      );
    }
  }
  (function (n) {
    (n.Iterator = mn), (n.ReverseIterator = Re);
  })(Xe || (Xe = {}));
  class C {
    constructor(...e) {
      if (
        ((this.ptr_ = { value: this }),
        (this.end_ = C.Iterator.create(this.ptr_, null)),
        (this.before_begin_ = C.Iterator.create(this.ptr_, this.end_)),
        (this.size_ = 0),
        e.length === 1 && e[0] instanceof Array)
      ) {
        const t = e[0];
        let s = this.before_begin();
        for (const c of t) s = this.insert_after(s, c);
      } else
        e.length === 1 && e[0] instanceof C
          ? this.assign(e[0].begin(), e[0].end())
          : e.length === 2 && this.assign(e[0], e[1]);
    }
    assign(e, t) {
      this.clear(), this.insert_after(this.before_begin_, e, t);
    }
    clear() {
      C.Iterator._Set_next(this.before_begin_, this.end_), (this.size_ = 0);
    }
    size() {
      return this.size_;
    }
    empty() {
      return this.size_ === 0;
    }
    front(e) {
      const t = this.begin();
      if (arguments.length === 0) return t.value;
      t.value = e;
    }
    before_begin() {
      return this.before_begin_;
    }
    begin() {
      return this.before_begin_.next();
    }
    end() {
      return this.end_;
    }
    [Symbol.iterator]() {
      return new nr(this.begin(), this.end());
    }
    push_front(e) {
      this.insert_after(this.before_begin_, e);
    }
    insert_after(e, ...t) {
      let s;
      return (
        t.length === 1
          ? (s = this._Insert_by_repeating_val(e, 1, t[0]))
          : typeof t[0] == "number"
            ? (s = this._Insert_by_repeating_val(e, t[0], t[1]))
            : (s = this._Insert_by_range(e, t[0], t[1])),
        s
      );
    }
    _Insert_by_repeating_val(e, t, s) {
      const c = new ke(0, s),
        h = new ke(t);
      return this._Insert_by_range(e, c, h);
    }
    _Insert_by_range(e, t, s) {
      const c = [];
      let h = 0;
      for (; !t.equals(s); t = t.next()) {
        const o = C.Iterator.create(this.ptr_, null, t.value);
        c.push(o), ++h;
      }
      if (h === 0) return e;
      for (let o = 0; o < h - 1; ++o) C.Iterator._Set_next(c[o], c[o + 1]);
      return (
        C.Iterator._Set_next(c[c.length - 1], e.next()),
        C.Iterator._Set_next(e, c[0]),
        (this.size_ += h),
        c[c.length - 1]
      );
    }
    pop_front() {
      this.erase_after(this.before_begin());
    }
    erase_after(e, t = ht(e, 2)) {
      return (this.size_ -= Math.max(0, ft(e, t) - 1)), C.Iterator._Set_next(e, t), t;
    }
    unique(e = ie) {
      for (let t = this.begin().next(); !t.equals(this.end()); t = t.next()) {
        const s = t.next();
        if (s.equals(this.end())) break;
        e(t.value, s.value) && this.erase_after(t);
      }
    }
    remove(e) {
      return this.remove_if((t) => ie(t, e));
    }
    remove_if(e) {
      let t = 0;
      for (let s = this.before_begin(); !s.next().equals(this.end()); s = s.next())
        e(s.next().value) === !0 && (C.Iterator._Set_next(s, s.next().next()), ++t);
      this.size_ -= t;
    }
    merge(e, t = ae) {
      if (this === e) return;
      let s = this.before_begin();
      for (; e.empty() === !1; ) {
        const c = e.begin().value;
        for (; !s.next().equals(this.end()) && t(s.next().value, c); ) s = s.next();
        this.splice_after(s, e, e.before_begin());
      }
    }
    splice_after(e, t, s = t.before_begin(), c = s.next().next()) {
      c === null && (c = t.end()), this.insert_after(e, s.next(), c), t.erase_after(s, c);
    }
    sort(e = ae) {
      const t = new _e(this.begin(), this.end());
      yn(t.begin(), t.end(), e), this.assign(t.begin(), t.end());
    }
    reverse() {
      const e = new _e(this.begin(), this.end());
      this.assign(e.rbegin(), e.rend());
    }
    swap(e) {
      ([this.size_, e.size_] = [e.size_, this.size_]),
        ([this.before_begin_, e.before_begin_] = [e.before_begin_, this.before_begin_]),
        ([this.end_, e.end_] = [e.end_, this.end_]),
        ([this.ptr_, e.ptr_] = [e.ptr_, this.ptr_]),
        ([this.ptr_.value, e.ptr_.value] = [e.ptr_.value, this.ptr_.value]);
    }
    toJSON() {
      const e = [];
      for (const t of this) e.push(t);
      return e;
    }
  }
  (function (n) {
    class e {
      constructor(s, c, h) {
        (this.source_ptr_ = s), (this.next_ = c), (this.value_ = h);
      }
      static create(s, c, h) {
        return new e(s, c, h);
      }
      source() {
        return this.source_ptr_.value;
      }
      get value() {
        return this._Try_value(), this.value_;
      }
      set value(s) {
        this._Try_value(), (this.value_ = s);
      }
      _Try_value() {
        if (this.value_ === void 0) {
          const s = this.source();
          if (this.equals(s.end()) === !0) throw P.iterator_end_value(s);
          if (this.equals(s.before_begin()) === !0) throw P.iterator_end_value(s, "before_begin");
        }
      }
      next() {
        return this.next_;
      }
      equals(s) {
        return this === s;
      }
      static _Set_next(s, c) {
        s.next_ = c;
      }
    }
    n.Iterator = e;
  })(C || (C = {}));
  class k extends gn {
    constructor(e) {
      super(), (this.associative_ = e);
    }
    _Create_iterator(e, t, s) {
      return k.Iterator.create(this, e, t, s);
    }
    static _Swap_associative(e, t) {
      [e.associative_, t.associative_] = [t.associative_, e.associative_];
    }
    associative() {
      return this.associative_;
    }
  }
  (function (n) {
    class e extends oe {
      constructor(c, h, o, y) {
        super(h, o, y), (this.source_ = c);
      }
      static create(c, h, o, y) {
        return new e(c, h, o, y);
      }
      reverse() {
        return new t(this);
      }
      source() {
        return this.source_.associative();
      }
    }
    n.Iterator = e;
    class t extends dt {
      _Create_neighbor(c) {
        return new t(c);
      }
    }
    n.ReverseIterator = t;
  })(k || (k = {}));
  class vr extends br {
    constructor(e, t, s) {
      super(s), (this.source_ = e), (this.key_comp_ = t), (this.key_eq_ = (c, h) => !t(c, h) && !t(h, c));
    }
    static _Swap_source(e, t) {
      [e.source_, t.source_] = [t.source_, e.source_];
    }
    get_by_key(e) {
      const t = this.nearest_by_key(e);
      return t === null || !this.key_eq_(e, t.value.value) ? null : t;
    }
    lower_bound(e) {
      const t = this.nearest_by_key(e);
      return t === null ? this.source_.end() : this.key_comp_(t.value.value, e) ? t.value.next() : t.value;
    }
    equal_range(e) {
      return new R(this.lower_bound(e), this.upper_bound(e));
    }
    source() {
      return this.source_;
    }
    key_comp() {
      return this.key_comp_;
    }
    key_eq() {
      return this.key_eq_;
    }
    value_comp() {
      return this.key_comp_;
    }
  }
  class wr extends vr {
    constructor(e, t) {
      super(e, t, (s, c) => t(s.value, c.value));
    }
    nearest_by_key(e) {
      if (this.root_ === null) return null;
      let t = this.root_;
      for (;;) {
        const s = t.value;
        let c = null;
        if (this.key_comp()(e, s.value)) c = t.left;
        else if (this.key_comp()(s.value, e)) c = t.right;
        else return t;
        if (c === null) break;
        t = c;
      }
      return t;
    }
    upper_bound(e) {
      const t = this.nearest_by_key(e);
      if (t === null) return this.source().end();
      const s = t.value;
      return this.key_comp()(e, s.value) ? s : s.next();
    }
  }
  class vt extends hr {
    constructor(...e) {
      super((t) => new k(t)),
        Y.construct(
          this,
          vt,
          (t) => {
            this.tree_ = new wr(this, t);
          },
          ...e,
        );
    }
    clear() {
      super.clear(), this.tree_.clear();
    }
    swap(e) {
      ([this.data_, e.data_] = [e.data_, this.data_]),
        k._Swap_associative(this.data_, e.data_),
        wr._Swap_source(this.tree_, e.tree_),
        ([this.tree_, e.tree_] = [e.tree_, this.tree_]);
    }
    key_comp() {
      return this.tree_.key_comp();
    }
    lower_bound(e) {
      return this.tree_.lower_bound(e);
    }
    upper_bound(e) {
      return this.tree_.upper_bound(e);
    }
    _Handle_insert(e, t) {
      for (; !e.equals(t); e = e.next()) this.tree_.insert(e);
    }
    _Handle_erase(e, t) {
      for (; !e.equals(t); e = e.next()) this.tree_.erase(e);
    }
  }
  (function (n) {
    (n.Iterator = k.Iterator), (n.ReverseIterator = k.ReverseIterator);
  })(vt || (vt = {}));
  var ze;
  (function (n) {
    function e(t, s, c, ...h) {
      let o = null,
        y = ln,
        _ = ie;
      if (h.length === 1 && h[0] instanceof s) {
        const a = h[0];
        (y = a.hash_function()),
          (_ = a.key_eq()),
          (o = () => {
            const l = a.begin(),
              d = a.end();
            t.assign(l, d);
          });
      } else {
        const a = ct.construct(t, ...h);
        (o = a.ramda), a.tail.length >= 1 && (y = a.tail[0]), a.tail.length >= 2 && (_ = a.tail[1]);
      }
      c(y, _), o !== null && o();
    }
    n.construct = e;
  })(ze || (ze = {}));
  class xr {
    constructor(e, t) {
      (this.fetcher_ = e),
        (this.hasher_ = t),
        (this.max_load_factor_ = Eo),
        (this.data_ = []),
        (this.size_ = 0),
        this.initialize();
    }
    clear() {
      (this.data_ = []), (this.size_ = 0), this.initialize();
    }
    rehash(e) {
      e = Math.max(e, Or);
      const t = [];
      for (let s = 0; s < e; ++s) t.push([]);
      for (const s of this.data_)
        for (const c of s) {
          const h = this.hasher_(this.fetcher_(c)) % t.length;
          t[h].push(c);
        }
      this.data_ = t;
    }
    reserve(e) {
      e > this.capacity() && ((e = Math.floor(e / this.max_load_factor_)), this.rehash(e));
    }
    initialize() {
      for (let e = 0; e < Or; ++e) this.data_.push([]);
    }
    length() {
      return this.data_.length;
    }
    capacity() {
      return this.data_.length * this.max_load_factor_;
    }
    at(e) {
      return this.data_[e];
    }
    load_factor() {
      return this.size_ / this.length();
    }
    max_load_factor(e = null) {
      if (e === null) return this.max_load_factor_;
      this.max_load_factor_ = e;
    }
    hash_function() {
      return this.hasher_;
    }
    index(e) {
      return this.hasher_(this.fetcher_(e)) % this.length();
    }
    insert(e) {
      const t = this.capacity();
      ++this.size_ > t && this.reserve(t * 2);
      const s = this.index(e);
      this.data_[s].push(e);
    }
    erase(e) {
      const t = this.index(e),
        s = this.data_[t];
      for (let c = 0; c < s.length; ++c)
        if (s[c] === e) {
          s.splice(c, 1), --this.size_;
          break;
        }
    }
  }
  const Or = 10,
    Eo = 1;
  class wt extends xr {
    constructor(e, t, s) {
      super(So, t), (this.source_ = e), (this.key_eq_ = s);
    }
    static _Swap_source(e, t) {
      [e.source_, t.source_] = [t.source_, e.source_];
    }
    key_eq() {
      return this.key_eq_;
    }
    find(e) {
      const t = this.hash_function()(e) % this.length(),
        s = this.at(t);
      for (const c of s) if (this.key_eq_(c.value, e)) return c;
      return this.source_.end();
    }
  }
  function So(n) {
    return n.value;
  }
  class Ge extends ar {
    constructor(...e) {
      super((t) => new k(t)),
        ze.construct(
          this,
          Ge,
          (t, s) => {
            this.buckets_ = new wt(this, t, s);
          },
          ...e,
        );
    }
    clear() {
      this.buckets_.clear(), super.clear();
    }
    swap(e) {
      ([this.data_, e.data_] = [e.data_, this.data_]),
        k._Swap_associative(this.data_, e.data_),
        wt._Swap_source(this.buckets_, e.buckets_),
        ([this.buckets_, e.buckets_] = [e.buckets_, this.buckets_]);
    }
    find(e) {
      return this.buckets_.find(e);
    }
    begin(e = null) {
      return e === null ? super.begin() : this.buckets_.at(e)[0];
    }
    end(e = null) {
      if (e === null) return super.end();
      {
        const t = this.buckets_.at(e);
        return t[t.length - 1].next();
      }
    }
    rbegin(e = null) {
      return this.end(e).reverse();
    }
    rend(e = null) {
      return this.begin(e).reverse();
    }
    bucket_count() {
      return this.buckets_.length();
    }
    bucket_size(e) {
      return this.buckets_.at(e).length;
    }
    load_factor() {
      return this.buckets_.load_factor();
    }
    hash_function() {
      return this.buckets_.hash_function();
    }
    key_eq() {
      return this.buckets_.key_eq();
    }
    bucket(e) {
      return this.hash_function()(e) % this.buckets_.length();
    }
    max_load_factor(e = null) {
      return this.buckets_.max_load_factor(e);
    }
    reserve(e) {
      this.buckets_.reserve(e);
    }
    rehash(e) {
      this.buckets_.rehash(e);
    }
    _Insert_by_key(e) {
      let t = this.find(e);
      return t.equals(this.end()) === !1
        ? new R(t, !1)
        : (this.data_.push(e), (t = t.prev()), this._Handle_insert(t, t.next()), new R(t, !0));
    }
    _Insert_by_hint(e, t) {
      let s = this.find(t);
      return s.equals(this.end()) === !0 && ((s = this.data_.insert(e, t)), this._Handle_insert(s, s.next())), s;
    }
    _Handle_insert(e, t) {
      for (; !e.equals(t); e = e.next()) this.buckets_.insert(e);
    }
    _Handle_erase(e, t) {
      for (; !e.equals(t); e = e.next()) this.buckets_.erase(e);
    }
  }
  (function (n) {
    (n.Iterator = k.Iterator), (n.ReverseIterator = k.ReverseIterator);
  })(Ge || (Ge = {}));
  class $r extends vr {
    constructor(e, t) {
      super(e, t, function (s, c) {
        const h = t(s.value, c.value);
        return !h && !t(c.value, s.value) ? ce(s) < ce(c) : h;
      });
    }
    insert(e) {
      ce(e), super.insert(e);
    }
    _Nearest_by_key(e, t) {
      if (this.root_ === null) return null;
      let s = this.root_,
        c = null;
      for (;;) {
        const h = s.value;
        let o = null;
        if (
          (this.key_comp()(e, h.value)
            ? (o = s.left)
            : this.key_comp()(h.value, e)
              ? (o = s.right)
              : ((c = s), (o = t(s))),
          o === null)
        )
          break;
        s = o;
      }
      return c !== null ? c : s;
    }
    nearest_by_key(e) {
      return this._Nearest_by_key(e, function (t) {
        return t.left;
      });
    }
    upper_bound(e) {
      const t = this._Nearest_by_key(e, function (c) {
        return c.right;
      });
      if (t === null) return this.source().end();
      const s = t.value;
      return this.key_comp()(e, s.value) ? s : s.next();
    }
  }
  class xt extends _r {
    constructor(...e) {
      super((t) => new k(t)),
        Y.construct(
          this,
          xt,
          (t) => {
            this.tree_ = new $r(this, t);
          },
          ...e,
        );
    }
    clear() {
      super.clear(), this.tree_.clear();
    }
    swap(e) {
      ([this.data_, e.data_] = [e.data_, this.data_]),
        k._Swap_associative(this.data_, e.data_),
        $r._Swap_source(this.tree_, e.tree_),
        ([this.tree_, e.tree_] = [e.tree_, this.tree_]);
    }
    key_comp() {
      return this.tree_.key_comp();
    }
    lower_bound(e) {
      return this.tree_.lower_bound(e);
    }
    upper_bound(e) {
      return this.tree_.upper_bound(e);
    }
    _Handle_insert(e, t) {
      for (; !e.equals(t); e = e.next()) this.tree_.insert(e);
    }
    _Handle_erase(e, t) {
      for (; !e.equals(t); e = e.next()) this.tree_.erase(e);
    }
  }
  (function (n) {
    (n.Iterator = k.Iterator), (n.ReverseIterator = k.ReverseIterator);
  })(xt || (xt = {}));
  class Ot extends or {
    constructor(...e) {
      super((t) => new k(t)),
        ze.construct(
          this,
          Ot,
          (t, s) => {
            this.buckets_ = new wt(this, t, s);
          },
          ...e,
        );
    }
    clear() {
      this.buckets_.clear(), super.clear();
    }
    swap(e) {
      ([this.data_, e.data_] = [e.data_, this.data_]),
        k._Swap_associative(this.data_, e.data_),
        wt._Swap_source(this.buckets_, e.buckets_),
        ([this.buckets_, e.buckets_] = [e.buckets_, this.buckets_]);
    }
    find(e) {
      return this.buckets_.find(e);
    }
    count(e) {
      const t = this.bucket(e),
        s = this.buckets_.at(t);
      let c = 0;
      for (let h of s) this.buckets_.key_eq()(h.value, e) && ++c;
      return c;
    }
    begin(e = null) {
      return e === null ? super.begin() : this.buckets_.at(e)[0];
    }
    end(e = null) {
      if (e === null) return super.end();
      {
        const t = this.buckets_.at(e);
        return t[t.length - 1].next();
      }
    }
    rbegin(e = null) {
      return this.end(e).reverse();
    }
    rend(e = null) {
      return this.begin(e).reverse();
    }
    bucket_count() {
      return this.buckets_.length();
    }
    bucket_size(e) {
      return this.buckets_.at(e).length;
    }
    load_factor() {
      return this.buckets_.load_factor();
    }
    hash_function() {
      return this.buckets_.hash_function();
    }
    key_eq() {
      return this.buckets_.key_eq();
    }
    bucket(e) {
      return this.hash_function()(e) % this.buckets_.length();
    }
    max_load_factor(e = null) {
      return this.buckets_.max_load_factor(e);
    }
    reserve(e) {
      this.buckets_.rehash(Math.ceil(e * this.max_load_factor()));
    }
    rehash(e) {
      e <= this.bucket_count() || this.buckets_.rehash(e);
    }
    _Key_eq(e, t) {
      return this.key_eq()(e, t);
    }
    _Insert_by_key(e) {
      const t = this.data_.insert(this.data_.end(), e);
      return this._Handle_insert(t, t.next()), t;
    }
    _Insert_by_hint(e, t) {
      const s = this.data_.insert(e, t);
      return this._Handle_insert(s, s.next()), s;
    }
    _Insert_by_range(e, t) {
      const s = this.data_.insert(this.data_.end(), e, t);
      this.size() > this.buckets_.capacity() && this.reserve(Math.max(this.size(), this.buckets_.capacity() * 2)),
        this._Handle_insert(s, this.end());
    }
    _Handle_insert(e, t) {
      for (; !e.equals(t); e = e.next()) this.buckets_.insert(e);
    }
    _Handle_erase(e, t) {
      for (; !e.equals(t); e = e.next()) this.buckets_.erase(e);
    }
  }
  (function (n) {
    (n.Iterator = k.Iterator), (n.ReverseIterator = k.ReverseIterator);
  })(Ot || (Ot = {}));
  class $t extends xr {
    constructor(e, t, s) {
      super(Po, t), (this.source_ = e), (this.key_eq_ = s);
    }
    static _Swap_source(e, t) {
      [e.source_, t.source_] = [t.source_, e.source_];
    }
    key_eq() {
      return this.key_eq_;
    }
    find(e) {
      const t = this.hash_function()(e) % this.length(),
        s = this.at(t);
      for (const c of s) if (this.key_eq_(c.first, e)) return c;
      return this.source_.end();
    }
  }
  function Po(n) {
    return n.first;
  }
  class Ne extends lr {
    constructor(...e) {
      super((t) => new I(t)),
        ze.construct(
          this,
          Ne,
          (t, s) => {
            this.buckets_ = new $t(this, t, s);
          },
          ...e,
        );
    }
    clear() {
      this.buckets_.clear(), super.clear();
    }
    swap(e) {
      ([this.data_, e.data_] = [e.data_, this.data_]),
        I._Swap_associative(this.data_, e.data_),
        $t._Swap_source(this.buckets_, e.buckets_),
        ([this.buckets_, e.buckets_] = [e.buckets_, this.buckets_]);
    }
    find(e) {
      return this.buckets_.find(e);
    }
    begin(e = null) {
      return e === null ? super.begin() : this.buckets_.at(e)[0];
    }
    end(e = null) {
      if (e === null) return super.end();
      {
        const t = this.buckets_.at(e);
        return t[t.length - 1].next();
      }
    }
    rbegin(e = null) {
      return this.end(e).reverse();
    }
    rend(e = null) {
      return this.begin(e).reverse();
    }
    bucket_count() {
      return this.buckets_.length();
    }
    bucket_size(e) {
      return this.buckets_.at(e).length;
    }
    load_factor() {
      return this.buckets_.load_factor();
    }
    hash_function() {
      return this.buckets_.hash_function();
    }
    key_eq() {
      return this.buckets_.key_eq();
    }
    bucket(e) {
      return this.hash_function()(e) % this.buckets_.length();
    }
    max_load_factor(e = null) {
      return this.buckets_.max_load_factor(e);
    }
    reserve(e) {
      this.buckets_.reserve(e);
    }
    rehash(e) {
      this.buckets_.rehash(e);
    }
    emplace(e, t) {
      let s = this.find(e);
      return s.equals(this.end()) === !1
        ? new R(s, !1)
        : (this.data_.push(new de(e, t)), (s = s.prev()), this._Handle_insert(s, s.next()), new R(s, !0));
    }
    emplace_hint(e, t, s) {
      let c = this.find(t);
      return (
        c.equals(this.end()) === !0 && ((c = this.data_.insert(e, new de(t, s))), this._Handle_insert(c, c.next())), c
      );
    }
    _Handle_insert(e, t) {
      for (; !e.equals(t); e = e.next()) this.buckets_.insert(e);
    }
    _Handle_erase(e, t) {
      for (; !e.equals(t); e = e.next()) this.buckets_.erase(e);
    }
  }
  (function (n) {
    (n.Iterator = I.Iterator), (n.ReverseIterator = I.ReverseIterator);
  })(Ne || (Ne = {}));
  class qr extends gr {
    constructor(e, t) {
      super(e, t, function (s, c) {
        const h = t(s.first, c.first);
        return !h && !t(c.first, s.first) ? ce(s) < ce(c) : h;
      });
    }
    insert(e) {
      ce(e), super.insert(e);
    }
    _Nearest_by_key(e, t) {
      if (this.root_ === null) return null;
      let s = this.root_,
        c = null;
      for (;;) {
        const h = s.value;
        let o = null;
        if (
          (this.key_comp()(e, h.first)
            ? (o = s.left)
            : this.key_comp()(h.first, e)
              ? (o = s.right)
              : ((c = s), (o = t(s))),
          o === null)
        )
          break;
        s = o;
      }
      return c !== null ? c : s;
    }
    nearest_by_key(e) {
      return this._Nearest_by_key(e, function (t) {
        return t.left;
      });
    }
    upper_bound(e) {
      const t = this._Nearest_by_key(e, function (c) {
        return c.right;
      });
      if (t === null) return this.source().end();
      const s = t.value;
      return this.key_comp()(e, s.first) ? s : s.next();
    }
  }
  class qt extends yr {
    constructor(...e) {
      super((t) => new I(t)),
        Y.construct(
          this,
          qt,
          (t) => {
            this.tree_ = new qr(this, t);
          },
          ...e,
        );
    }
    clear() {
      super.clear(), this.tree_.clear();
    }
    swap(e) {
      ([this.data_, e.data_] = [e.data_, this.data_]),
        I._Swap_associative(this.data_, e.data_),
        qr._Swap_source(this.tree_, e.tree_),
        ([this.tree_, e.tree_] = [e.tree_, this.tree_]);
    }
    key_comp() {
      return this.tree_.key_comp();
    }
    lower_bound(e) {
      return this.tree_.lower_bound(e);
    }
    upper_bound(e) {
      return this.tree_.upper_bound(e);
    }
    _Handle_insert(e, t) {
      for (; !e.equals(t); e = e.next()) this.tree_.insert(e);
    }
    _Handle_erase(e, t) {
      for (; !e.equals(t); e = e.next()) this.tree_.erase(e);
    }
  }
  (function (n) {
    (n.Iterator = I.Iterator), (n.ReverseIterator = I.ReverseIterator);
  })(qt || (qt = {}));
  class Et extends cr {
    constructor(...e) {
      super((t) => new I(t)),
        ze.construct(
          this,
          Et,
          (t, s) => {
            this.buckets_ = new $t(this, t, s);
          },
          ...e,
        );
    }
    clear() {
      this.buckets_.clear(), super.clear();
    }
    swap(e) {
      ([this.data_, e.data_] = [e.data_, this.data_]),
        I._Swap_associative(this.data_, e.data_),
        $t._Swap_source(this.buckets_, e.buckets_),
        ([this.buckets_, e.buckets_] = [e.buckets_, this.buckets_]);
    }
    find(e) {
      return this.buckets_.find(e);
    }
    count(e) {
      const t = this.bucket(e),
        s = this.buckets_.at(t);
      let c = 0;
      for (let h of s) this.buckets_.key_eq()(h.first, e) && ++c;
      return c;
    }
    begin(e = null) {
      return e === null ? super.begin() : this.buckets_.at(e)[0];
    }
    end(e = null) {
      if (e === null) return super.end();
      {
        const t = this.buckets_.at(e);
        return t[t.length - 1].next();
      }
    }
    rbegin(e = null) {
      return this.end(e).reverse();
    }
    rend(e = null) {
      return this.begin(e).reverse();
    }
    bucket_count() {
      return this.buckets_.length();
    }
    bucket_size(e) {
      return this.buckets_.at(e).length;
    }
    load_factor() {
      return this.buckets_.load_factor();
    }
    hash_function() {
      return this.buckets_.hash_function();
    }
    key_eq() {
      return this.buckets_.key_eq();
    }
    bucket(e) {
      return this.hash_function()(e) % this.buckets_.length();
    }
    max_load_factor(e = null) {
      return this.buckets_.max_load_factor(e);
    }
    reserve(e) {
      this.buckets_.reserve(e);
    }
    rehash(e) {
      e <= this.bucket_count() || this.buckets_.rehash(e);
    }
    _Key_eq(e, t) {
      return this.key_eq()(e, t);
    }
    emplace(e, t) {
      const s = this.data_.insert(this.data_.end(), new de(e, t));
      return this._Handle_insert(s, s.next()), s;
    }
    emplace_hint(e, t, s) {
      const c = this.data_.insert(e, new de(t, s));
      return this._Handle_insert(c, c.next()), c;
    }
    _Insert_by_range(e, t) {
      const s = [];
      for (let h = e; !h.equals(t); h = h.next()) s.push(new de(h.value.first, h.value.second));
      const c = this.data_.insert(this.data_.end(), new Z(s, 0), new Z(s, s.length));
      this.size() > this.buckets_.capacity() && this.reserve(Math.max(this.size(), this.buckets_.capacity() * 2)),
        this._Handle_insert(c, this.end());
    }
    _Handle_insert(e, t) {
      for (; !e.equals(t); e = e.next()) this.buckets_.insert(e);
    }
    _Handle_erase(e, t) {
      for (; !e.equals(t); e = e.next()) this.buckets_.erase(e);
    }
  }
  (function (n) {
    (n.Iterator = I.Iterator), (n.ReverseIterator = I.ReverseIterator);
  })(Et || (Et = {}));
  var Er;
  (function (n) {
    function e(h) {
      if (c.length <= h) for (let o = c.length; o <= h; ++o) c.push(c[o - 1] * o);
      return c[h];
    }
    n.factorial = e;
    function t(h, o, y, _ = 100 * 1e3) {
      if (o > y) [o, y] = [y, o];
      else if (o === y) return 0;
      const a = (y - o) / _;
      let l = 0;
      for (; o < y; o += a) l += h(o) * a;
      return l;
    }
    n.integral = t;
    function s(h, o, y) {
      let _ = 0;
      for (; o <= y; ++o) _ += h(o);
      return _;
    }
    n.sigma = s;
    const c = [1, 1];
  })(Er || (Er = {}));
  function pn(n) {
    return new Promise((e) => {
      setTimeout(e, n);
    });
  }
  function Sr(n) {
    const e = new Date(),
      t = n.getTime() - e.getTime();
    return pn(t);
  }
  class jo {
    constructor() {
      this.resolvers_ = new re();
    }
    async wait(e) {
      if (!e) return await this._Wait();
      for (; !(await e()); ) await this._Wait();
    }
    wait_for(e, t) {
      const s = new Date(Date.now() + e);
      return this.wait_until(s, t);
    }
    async wait_until(e, t) {
      if (!t) return await this._Wait_until(e);
      for (; !(await t()); ) if (!(await this._Wait_until(e))) return await t();
      return !0;
    }
    _Wait() {
      return new Promise((e) => {
        this.resolvers_.push_back({ handler: e, lockType: 0 });
      });
    }
    _Wait_until(e) {
      return new Promise((t) => {
        const s = this.resolvers_.insert(this.resolvers_.end(), { handler: t, lockType: 1 });
        Sr(e).then(() => {
          s.erased_ !== !0 && (this.resolvers_.erase(s), t(!1));
        });
      });
    }
    async notify_one() {
      if (this.resolvers_.empty()) return;
      const e = this.resolvers_.begin();
      this.resolvers_.erase(e), e.value.lockType === 0 ? e.value.handler() : e.value.handler(!0);
    }
    async notify_all() {
      if (this.resolvers_.empty()) return;
      const e = this.resolvers_.toJSON();
      this.resolvers_.clear();
      for (const t of e) t.lockType === 0 ? t.handler() : t.handler(!0);
    }
  }
  var ue;
  (function (n) {
    async function e(c, h, o) {
      await c(), await s(h, o);
    }
    n.lock = e;
    async function t(c, h, o) {
      return (await c()) === !1 ? !1 : (await s(h, o), !0);
    }
    n.try_lock = t;
    async function s(c, h) {
      try {
        await h();
      } catch (o) {
        throw (await c(), o);
      }
      await c();
    }
  })(ue || (ue = {}));
  class Pr {}
  (function (n) {
    function e(h, o) {
      return ue.lock(
        () => h.lock(),
        () => h.unlock(),
        o,
      );
    }
    n.lock = e;
    function t(h, o) {
      return ue.try_lock(
        () => h.try_lock(),
        () => h.unlock(),
        o,
      );
    }
    n.try_lock = t;
    function s(h, o, y) {
      return ue.try_lock(
        () => h.try_lock_for(o),
        () => h.unlock(),
        y,
      );
    }
    n.try_lock_for = s;
    function c(h, o, y) {
      return ue.try_lock(
        () => h.try_lock_until(o),
        () => h.unlock(),
        y,
      );
    }
    n.try_lock_until = c;
  })(Pr || (Pr = {}));
  class jr {}
  (function (n) {
    function e(h, o) {
      return ue.lock(
        () => h.lock_shared(),
        () => h.unlock_shared(),
        o,
      );
    }
    n.lock = e;
    function t(h, o) {
      return ue.try_lock(
        () => h.try_lock_shared(),
        () => h.unlock_shared(),
        o,
      );
    }
    n.try_lock = t;
    function s(h, o, y) {
      return ue.try_lock(
        () => h.try_lock_shared_for(o),
        () => h.unlock_shared(),
        y,
      );
    }
    n.try_lock_for = s;
    function c(h, o, y) {
      return ue.try_lock(
        () => h.try_lock_shared_until(o),
        () => h.unlock_shared(),
        y,
      );
    }
    n.try_lock_until = c;
  })(jr || (jr = {}));
  class Ir {
    constructor(e) {
      (this.queue_ = new re()), (this.acquiring_ = 0), (this.max_ = e);
    }
    max() {
      return this.max_;
    }
    acquire() {
      return new Promise((e) => {
        this.acquiring_ < this.max_ ? (++this.acquiring_, e()) : this.queue_.push_back({ handler: e, lockType: 0 });
      });
    }
    async try_acquire() {
      return this.acquiring_ < this.max_ ? (++this.acquiring_, !0) : !1;
    }
    async try_acquire_for(e) {
      return new Promise((t) => {
        if (this.acquiring_ < this.max_) ++this.acquiring_, t(!0);
        else {
          const s = this.queue_.insert(this.queue_.end(), { handler: t, lockType: 1 });
          pn(e).then(() => {
            s.value.handler !== null && this._Cancel(s);
          });
        }
      });
    }
    try_acquire_until(e) {
      const t = new Date(),
        s = e.getTime() - t.getTime();
      return this.try_acquire_for(s);
    }
    async release(e = 1) {
      if (e < 1) throw new Ze(`Error on std.Semaphore.release(): parametric n is less than 1 -> (n = ${e}).`);
      if (e > this.max_)
        throw new he(
          `Error on std.Semaphore.release(): parametric n is greater than max -> (n = ${e}, max = ${this.max_}).`,
        );
      if (e > this.acquiring_)
        throw new he(
          `Error on std.Semaphore.release(): parametric n is greater than acquiring -> (n = ${e}, acquiring = ${this.acquiring_}).`,
        );
      const t = [];
      for (; this.queue_.empty() === !1 && t.length < e; ) {
        const s = this.queue_.front();
        s.handler !== null && t.push({ ...s }), this.queue_.pop_front(), (s.handler = null);
      }
      this.acquiring_ -= e - t.length;
      for (const s of t) s.lockType === 0 ? s.handler() : s.handler(!0);
    }
    _Cancel(e) {
      const t = e.value.handler;
      (e.value.handler = null), this.queue_.erase(e), t(!1);
    }
  }
  (function (n) {
    function e(s) {
      return new t(s);
    }
    n.get_lockable = e;
    class t {
      constructor(c) {
        this.semahpore_ = c;
      }
      lock() {
        return this.semahpore_.acquire();
      }
      unlock() {
        return this.semahpore_.release();
      }
      try_lock() {
        return this.semahpore_.try_acquire();
      }
      try_lock_for(c) {
        return this.semahpore_.try_acquire_for(c);
      }
      try_lock_until(c) {
        return this.semahpore_.try_acquire_until(c);
      }
    }
    n.Lockable = t;
  })(Ir || (Ir = {}));
  class Ee {
    constructor(e) {
      (this.closure_ = e), (this.value_ = kr);
    }
    get(...e) {
      return this.value_ === kr && (this.value_ = this.closure_(...e)), this.value_;
    }
  }
  const kr = {};
  var vn, Rr;
  function Io() {
    return (
      Rr ||
        ((Rr = 1),
        (vn = function (n) {
          return import(n);
        })),
      vn
    );
  }
  var ko = Io();
  const Me = me(ko),
    Ro = class {},
    Ao = (n) =>
      typeof n == "object" && n !== null && typeof n.toJSON == "function"
        ? n.toJSON()
        : n instanceof Error
          ? { ...n, name: n.name, stack: n.stack, message: n.message }
          : n;
  class St {
    constructor(e) {
      (this.provider_ = e),
        (this.driver_ = new Proxy(new Ro(), { get: ({}, t) => (t === "then" ? null : this._Proxy_func(t)) })),
        (this.promises_ = new Ne()),
        (this.join_cv_ = new jo()),
        (this.event_listeners_ = new Ne());
    }
    on(e, t) {
      this.event_listeners_.take(e, () => new Ge()).insert(t);
    }
    off(e, t) {
      const s = this.event_listeners_.find(e);
      s.equals(this.event_listeners_.end()) === !1 && s.second.erase(t),
        s.second.empty() && this.event_listeners_.erase(s);
    }
    async destructor(e) {
      const t = e || new Error("Connection has been closed.");
      for (const s of this.promises_) {
        const c = s.second.reject;
        c(t);
      }
      this.promises_.clear(), await this.join_cv_.notify_all();
    }
    _Proxy_func(e) {
      const t = (...s) => this._Call_function(e, ...s);
      return new Proxy(t, {
        get: ({}, s) =>
          s === "bind"
            ? (c, ...h) => t.bind(c, ...h)
            : s === "call"
              ? (c, ...h) => t.call(c, ...h)
              : s === "apply"
                ? (c, h) => t.apply(c, h)
                : this._Proxy_func(`${e}.${s}`),
      });
    }
    _Call_function(e, ...t) {
      return new Promise(async (s, c) => {
        const h = this.inspectReady("Communicator._Call_fuction");
        if (h) {
          c(h);
          return;
        }
        const o = { uid: ++St.SEQUENCE, listener: e, parameters: t.map((_) => ({ type: typeof _, value: _ })) },
          y = this.event_listeners_.find("send");
        if (y.equals(this.event_listeners_.end()) === !1) {
          const _ = { type: "send", time: new Date(), function: o };
          for (const a of y.second)
            try {
              a(_);
            } catch {}
        }
        this.promises_.emplace(o.uid, { function: o, time: new Date(), resolve: s, reject: c }), await this.sendData(o);
      });
    }
    setProvider(e) {
      this.provider_ = e;
    }
    getProvider() {
      return this.provider_;
    }
    getDriver() {
      return this.driver_;
    }
    async join(e) {
      const t = this.inspectReady(`${this.constructor.name}.join`);
      if (t) throw t;
      if (e === void 0) await this.join_cv_.wait();
      else return e instanceof Date ? await this.join_cv_.wait_until(e) : await this.join_cv_.wait_for(e);
    }
    replyData(e) {
      e.listener ? this._Handle_function(e).catch(() => {}) : this._Handle_complete(e);
    }
    async _Handle_function(e) {
      const t = e.uid,
        s = new Date();
      try {
        if (this.provider_ === void 0)
          throw new Error("Error on Communicator._Handle_function(): the provider is not specified yet.");
        if (this.provider_ === null)
          throw new Error("Error on Communicator._Handle_function(): the provider would not be.");
        let c = this.provider_,
          h;
        const o = e.listener.split(".");
        for (const l of o) {
          if (((h = c), (c = h[l]), l[0] === "_"))
            throw new Error(
              `Error on Communicator._Handle_function(): RFC does not allow access to a member starting with the underscore: Provider.${e.listener}()`,
            );
          if (l[l.length - 1] === "_")
            throw new Error(
              `Error on Communicator._Handle_function(): RFC does not allow access to a member ending with the underscore: Provider.${e.listener}().`,
            );
          if (l === "toString" && c === Function.toString)
            throw new Error(
              `Error on Communicator._Handle_function(): RFC on Function.toString() is not allowed: Provider.${e.listener}().`,
            );
          if (l === "constructor" || l === "prototype")
            throw new Error(
              `Error on Communicator._Handle_function(): RFC does not allow access to ${l}: Provider.${e.listener}().`,
            );
        }
        c = c.bind(h);
        const y = this.event_listeners_.find("receive");
        if (y.equals(this.event_listeners_.end()) === !1) {
          const l = { type: "receive", time: s, function: e };
          for (const d of y.second)
            try {
              d(l);
            } catch {}
        }
        const _ = e.parameters.map((l) => l.value),
          a = await c(..._);
        await this._Send_return({ invoke: e, time: s, return: { uid: t, success: !0, value: a } });
      } catch (c) {
        await this._Send_return({ invoke: e, time: s, return: { uid: t, success: !1, value: c } });
      }
    }
    _Handle_complete(e) {
      const t = this.promises_.find(e.uid);
      if (t.equals(this.promises_.end())) return;
      const s = this.event_listeners_.find("complete");
      if (s.equals(this.event_listeners_.end()) === !1) {
        const h = {
          type: "complete",
          function: t.second.function,
          return: e,
          requested_at: t.second.time,
          completed_at: new Date(),
        };
        for (const o of s.second)
          try {
            o(h);
          } catch {}
      }
      const c = e.success ? t.second.resolve : t.second.reject;
      this.promises_.erase(t), c(e.value);
    }
    async _Send_return(e) {
      const t = this.event_listeners_.find("return");
      if (t.equals(this.event_listeners_.end()) === !1) {
        const s = {
          type: "return",
          function: e.invoke,
          return: e.return,
          requested_at: e.time,
          completed_at: new Date(),
        };
        for (const c of t.second)
          try {
            c(s);
          } catch {}
      }
      e.return.success === !1 && e.return.value instanceof Error && (e.return.value = Ao(e.return.value)),
        await this.sendData(e.return);
    }
  }
  St.SEQUENCE = 0;
  class Se extends Error {
    constructor(e, t) {
      super(t);
      const s = new.target.prototype;
      Object.setPrototypeOf ? Object.setPrototypeOf(this, s) : (this.__proto__ = s), (this.status = e);
    }
  }
  class Ar extends St {
    constructor(e, t) {
      super(t), (this.header_ = e), (this.state_ = -1);
    }
    get header() {
      return this.header_;
    }
    get state() {
      return this.state_;
    }
    inspectReady(e) {
      return this.state_ === 1
        ? null
        : this.state_ === -1
          ? new Error(`Error on ${this.constructor.name}.${e}(): connect first.`)
          : this.state_ === 0
            ? new Error(`Error on ${this.constructor.name}.${e}(): it's on connecting, wait for a second.`)
            : this.state_ === 2
              ? new Error(`Error on ${this.constructor.name}.${e}(): the connection is on closing.`)
              : this.state_ === 3
                ? new Error(`Error on ${this.constructor.name}.${e}(): the connection has been closed.`)
                : new Error(`Error on ${this.constructor.name}.${e}(): unknown error, but not connected.`);
    }
  }
  var Pt;
  (function (n) {
    function e(t) {
      return { header: t };
    }
    n.wrap = e;
  })(Pt || (Pt = {}));
  function Fe(n) {
    let e = !1,
      t;
    return (...s) => (e === !1 && ((t = n(...s)), (e = !0)), t);
  }
  var T;
  (function (n) {
    (n.cp = new Ee(() => Me("child_process"))),
      (n.fs = new Ee(() => Me("fs"))),
      (n.http = new Ee(() => Me("http"))),
      (n.https = new Ee(() => Me("https"))),
      (n.os = new Ee(() => Me("os"))),
      (n.thread = new Ee(() => Me("worker_threads"))),
      (n.ws = new Ee(() => Promise.resolve().then(() => Fo))),
      (n.process = () => {
        if (zr === void 0) throw new Error("Not a node environment");
        return zr.process;
      });
  })(T || (T = {}));
  const zr = on() ? global : void 0;
  async function zo() {
    return (await T.ws.get()).default;
  }
  class wn extends Ar {
    async connect(e, t = {}) {
      if (this.socket_ && this.state !== 3)
        throw this.socket_.readyState === 0
          ? new Error("Error on WebSocketConnector.connect(): already connecting.")
          : this.socket_.readyState === 1
            ? new Error("Error on WebSocketConnector.connect(): already connected.")
            : new Error("Error on WebSocketConnector.connect(): already closing.");
      this.state_ = 0;
      try {
        const s = on() ? await zo() : self.WebSocket;
        if (
          ((this.socket_ = new s(e)),
          await this._Wait_connection(),
          this.socket_.send(JSON.stringify(Pt.wrap(this.header))),
          (await this._Handshake(t.timeout)) !== "1")
        )
          throw new Se(
            1008,
            "Error on WebSocketConnector.connect(): target server may not be opened by TGrid. It's not following the TGrid's own handshake rule.",
          );
        (this.state_ = 1),
          (this.socket_.onmessage = this._Handle_message.bind(this)),
          (this.socket_.onclose = this._Handle_close.bind(this)),
          (this.socket_.onerror = () => {});
      } catch (s) {
        throw (
          ((this.state_ = -1),
          this.socket_ && this.socket_.readyState === 1 && ((this.socket_.onclose = () => {}), this.socket_.close()),
          s)
        );
      }
    }
    _Wait_connection() {
      return new Promise((e, t) => {
        (this.socket_.onopen = () => e(this.socket_)),
          (this.socket_.onclose = Fe((s) => {
            t(new Se(s.code, s.reason));
          })),
          (this.socket_.onerror = Fe((s) => {
            t(
              new Se(
                1006,
                `Error on WebSocketConnector.connect(): ${(s == null ? void 0 : s.message) ?? "connection refused."}`,
              ),
            );
          }));
      });
    }
    async close(e, t) {
      const s = this.inspectReady("close");
      if (s) throw s;
      const c = this.join();
      (this.state_ = 2), this.socket_.close(e, t), await c;
    }
    _Handshake(e) {
      return new Promise((t, s) => {
        let c = !1,
          h = !1;
        e !== void 0 &&
          pn(e).then(() => {
            c === !1 &&
              (s(
                new Se(
                  1008,
                  `Error on WebSocketConnector.connect(): target server is not sending handshake data over ${e} milliseconds.`,
                ),
              ),
              (h = !0));
          }),
          (this.socket_.onmessage = Fe((o) => {
            h === !1 && ((c = !0), t(o.data));
          })),
          (this.socket_.onclose = Fe((o) => {
            h === !1 && ((c = !0), s(new Se(o.code, o.reason)));
          })),
          (this.socket_.onerror = Fe(() => {
            h === !1 && ((c = !0), s(new Se(1006, "Error on WebSocketConnector.connect(): connection refused.")));
          }));
      });
    }
    get url() {
      return this.socket_ ? this.socket_.url : void 0;
    }
    get state() {
      return this.state_;
    }
    async sendData(e) {
      this.socket_.send(JSON.stringify(e));
    }
    _Handle_message(e) {
      if (typeof e.data == "string") {
        const t = JSON.parse(e.data);
        this.replyData(t);
      }
    }
    async _Handle_close(e) {
      const t = !e.code || e.code !== 1e3 ? new Se(e.code, e.reason) : void 0;
      (this.state_ = 3), await this.destructor(t);
    }
  }
  wn || (wn = {});
  async function Nr() {
    const { parentPort: n } = await T.thread.get();
    if (!n) throw new Error("This is not a worker thread.");
    const e = T.process();
    class t {
      static postMessage(c) {
        n.postMessage(c);
      }
      static close() {
        e.exit(0);
      }
      static set onmessage(c) {
        n.on("message", (h) => {
          c({ data: h });
        });
      }
      static get document() {
        return null;
      }
      static is_worker_server() {
        return !0;
      }
    }
    return t;
  }
  (function (n) {
    async function e() {
      const { parentPort: t } = await T.thread.get();
      return !!t;
    }
    n.isWorkerThread = e;
  })(Nr || (Nr = {}));
  var Mr;
  (function (n) {
    async function e(a) {
      const { exists: l } = await T.fs.get();
      return new Promise((d) => {
        l(a, d);
      });
    }
    n.exists = e;
    async function t(a) {
      const { readdir: l } = await T.fs.get();
      return new Promise((d, i) => {
        l(a, (u, r) => {
          u ? i(u) : d(r);
        });
      });
    }
    n.dir = t;
    async function s(a) {
      const { lstat: l } = await T.fs.get();
      return new Promise((d, i) => {
        l(a, (u, r) => {
          u ? i(u) : d(r);
        });
      });
    }
    n.lstat = s;
    async function c(a, l) {
      const { readFile: d } = await T.fs.get();
      return new Promise((i, u) => {
        const r = (f, m) => {
          f ? u(f) : i(m);
        };
        l === void 0 ? d(a, r) : d(a, l, r);
      });
    }
    n.read = c;
    async function h(a) {
      (await e(a)) === !1 && (await o(a));
    }
    n.mkdir = h;
    async function o(a) {
      const { mkdir: l } = await T.fs.get();
      return new Promise((d, i) => {
        l(a, (u) => {
          u ? i(u) : d();
        });
      });
    }
    async function y(a, l) {
      const { writeFile: d } = await T.fs.get();
      return new Promise((i, u) => {
        const r = (f) => {
          f ? u(f) : i();
        };
        l instanceof Buffer ? d(a, l, r) : d(a, l, "utf8", r);
      });
    }
    n.write = y;
    async function _(a) {
      const { unlink: l } = await T.fs.get();
      return new Promise((d, i) => {
        l(a, (u) => {
          u ? i(u) : d();
        });
      });
    }
    n.unlink = _;
  })(Mr || (Mr = {}));
  const Fr = async () => ({
    compile: async (n) => {
      const e = new Blob([n], { type: "application/javascript" });
      return self.URL.createObjectURL(e);
    },
    remove: async (n) => {
      try {
        self.URL.revokeObjectURL(n);
      } catch {}
    },
    execute: async (n) => new Worker(n),
  });
  class Hr extends Ar {
    async connect(e, t = {}) {
      if (this.port_ && this.state_ !== 3)
        throw this.state_ === 0
          ? new Error("Error on SharedWorkerConnector.connect(): on connecting.")
          : this.state_ === 1
            ? new Error("Error on SharedWorkerConnector.connect(): already connected.")
            : new Error("Error on SharedWorkerConnector.connect(): closing.");
      const s = t.timeout !== void 0 ? new Date(Date.now() + t.timeout) : void 0;
      this.state_ = 0;
      try {
        const c = new SharedWorker(e);
        if (((this.port_ = c.port), (await this._Handshake(t.timeout, s)) !== 0))
          throw new Error(
            "Error on SharedWorkerConnector.connect(): target shared-worker may not be opened by TGrid. It's not following the TGrid's own handshake rule when connecting.",
          );
        this.port_.postMessage(JSON.stringify(Pt.wrap(this.header)));
        const h = await this._Handshake(t.timeout, s);
        if (h === 1)
          (this.state_ = 1),
            (this.port_.onmessage = this._Handle_message.bind(this)),
            (this.port_.onmessageerror = () => {});
        else {
          let o = null;
          try {
            o = JSON.parse(h);
          } catch {}
          throw o && o.name === "reject" && typeof o.message == "string"
            ? new Error(o.message)
            : new Error(
                "Error on SharedWorkerConnector.connect(): target shared-worker may not be opened by TGrid. It's not following the TGrid's own handshake rule.",
              );
        }
      } catch (c) {
        try {
          this.port_ && this.port_.close();
        } catch {}
        throw ((this.state_ = -1), c);
      }
    }
    _Handshake(e, t) {
      return new Promise((s, c) => {
        let h = !1,
          o = !1;
        t !== void 0 &&
          Sr(t).then(() => {
            h === !1 &&
              (c(
                new Error(
                  `Error on SharedWorkerConnector.connect(): target shared-worker is not sending handshake data over ${e} milliseconds.`,
                ),
              ),
              (o = !0));
          }),
          (this.port_.onmessage = Fe((y) => {
            o === !1 && ((h = !0), s(y.data));
          }));
      });
    }
    async close() {
      const e = this.inspectReady("close");
      if (e) throw e;
      const t = this.join();
      (this.state_ = 2), this.port_.postMessage(2), await t;
    }
    async sendData(e) {
      this.port_.postMessage(JSON.stringify(e));
    }
    _Handle_message(e) {
      if (e.data === 2) this._Handle_close();
      else {
        const t = JSON.parse(e.data);
        this.replyData(t);
      }
    }
    async _Handle_close() {
      await this.destructor(), (this.state_ = 3);
    }
  }
  (function (n) {
    async function e(s) {
      const { compile: c } = await Fr();
      return c(s);
    }
    n.compile = e;
    async function t(s) {
      const { remove: c } = await Fr();
      await c(s);
    }
    n.remove = t;
  })(Hr || (Hr = {}));
  async function jt(n, e) {
    const t = new wn(n.headers ?? {}, e);
    await t.connect(`${n.host.endsWith("/") ? n.host.substring(0, n.host.length - 1) : n.host}${jt.path()}`);
    const s = t.getDriver();
    return { connector: t, driver: s };
  }
  ((n) => {
    n.path = () => "/chatting/start";
  })(jt || (jt = {}));
  const Dr = Object.freeze(
      Object.defineProperty(
        {
          __proto__: null,
          chatting: Object.freeze(
            Object.defineProperty(
              {
                __proto__: null,
                get start() {
                  return jt;
                },
              },
              Symbol.toStringTag,
              { value: "Module" },
            ),
          ),
          monitors: ho,
          wanted: yo,
        },
        Symbol.toStringTag,
        { value: "Module" },
      ),
    ),
    No = Object.freeze(
      Object.defineProperty({ __proto__: null, HttpError: Vn.HttpError, functional: Dr }, Symbol.toStringTag, {
        value: "Module",
      }),
    );
  var xn, Wr;
  function Mo() {
    return (
      Wr ||
        ((Wr = 1),
        (xn = function () {
          throw new Error("ws does not work in the browser. Browser clients must use the native WebSocket object");
        })),
      xn
    );
  }
  var Ur = Mo();
  const Fo = G({ __proto__: null, default: me(Ur) }, [Ur]);
  (B.HttpError = Vn.HttpError),
    (B.default = No),
    (B.functional = Dr),
    Object.defineProperties(B, { __esModule: { value: !0 }, [Symbol.toStringTag]: { value: "Module" } });
});
