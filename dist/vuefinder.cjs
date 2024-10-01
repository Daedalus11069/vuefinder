"use strict";
var br = Object.defineProperty;
var yr = (n, t, o) =>
  t in n
    ? br(n, t, { enumerable: !0, configurable: !0, writable: !0, value: o })
    : (n[t] = o);
var Fn = (n, t, o) => yr(n, typeof t != "symbol" ? t + "" : t, o);
const e = require("vue"),
  Er = require("mitt"),
  Vr = require("dragselect"),
  Sr = require("@uppy/core"),
  Nr = require("@uppy/xhr-upload"),
  xr = require("vanilla-lazyload");
require("cropperjs/dist/cropper.css");
const Br = require("cropperjs");
var ro;
const Kt =
  (ro = document.querySelector('meta[name="csrf-token"]')) == null
    ? void 0
    : ro.getAttribute("content");
class $r {
  constructor(t) {
    Fn(this, "config");
    this.config = t;
  }
  get config() {
    return this.config;
  }
  transformRequestParams(t) {
    const o = this.config,
      s = {};
    Kt != null && Kt !== "" && (s[o.xsrfHeaderName] = Kt);
    const r = Object.assign({}, o.headers, s, t.headers),
      c = Object.assign({}, o.params, t.params),
      a = t.body,
      i = o.baseUrl + t.url,
      l = t.method;
    let d;
    l !== "get" &&
      (a instanceof FormData
        ? ((d = a),
          o.body != null &&
            Object.entries(this.config.body).forEach(([u, _]) => {
              d.append(u, _);
            }))
        : ((d = { ...a }),
          o.body != null && Object.assign(d, this.config.body)));
    const m = { url: i, method: l, headers: r, params: c, body: d };
    if (o.transformRequest != null) {
      const u = o.transformRequest({
        url: i,
        method: l,
        headers: r,
        params: c,
        body: d
      });
      u.url != null && (m.url = u.url),
        u.method != null && (m.method = u.method),
        u.params != null && (m.params = u.params ?? {}),
        u.headers != null && (m.headers = u.headers ?? {}),
        u.body != null && (m.body = u.body);
    }
    return m;
  }
  getDownloadUrl(t, o) {
    if (o.url != null) return o.url;
    const s = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "download", adapter: t, path: o.path }
    });
    return s.url + "?" + new URLSearchParams(s.params).toString();
  }
  getPreviewUrl(t, o) {
    if (o.url != null) return o.url;
    const s = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "preview", adapter: t, path: o.path }
    });
    return s.url + "?" + new URLSearchParams(s.params).toString();
  }
  async send(t) {
    const o = this.transformRequestParams(t),
      s = t.responseType || "json",
      r = { method: t.method, headers: o.headers, signal: t.abortSignal },
      c = o.url + "?" + new URLSearchParams(o.params);
    if (o.method !== "get" && o.body != null) {
      let i;
      o.body instanceof FormData
        ? (i = t.body)
        : ((i = JSON.stringify(o.body)),
          (r.headers["Content-Type"] = "application/json")),
        (r.body = i);
    }
    const a = await fetch(c, r);
    if (a.ok) return await a[s]();
    throw await a.json();
  }
}
function Cr(n) {
  const t = {
    baseUrl: "",
    headers: {},
    params: {},
    body: {},
    xsrfHeaderName: "X-CSRF-Token"
  };
  return (
    typeof n == "string"
      ? Object.assign(t, { baseUrl: n })
      : Object.assign(t, n),
    new $r(t)
  );
}
function Dr(n) {
  let t = localStorage.getItem(n + "_storage");
  const o = e.reactive(JSON.parse(t ?? "{}"));
  e.watch(o, s);
  function s() {
    Object.keys(o).length
      ? localStorage.setItem(n + "_storage", JSON.stringify(o))
      : localStorage.removeItem(n + "_storage");
  }
  function r(l, d) {
    o[l] = d;
  }
  function c(l) {
    delete o[l];
  }
  function a() {
    Object.keys(o).map(l => c(l));
  }
  return {
    getStore: (l, d = null) => (o.hasOwnProperty(l) ? o[l] : d),
    setStore: r,
    removeStore: c,
    clearStore: a
  };
}
async function Tr(n, t) {
  const o = t[n];
  return typeof o == "function" ? (await o()).default : o;
}
function Mr(n, t, o, s) {
  const { getStore: r, setStore: c } = n,
    a = e.ref({}),
    i = e.ref(r("locale", t)),
    l = (u, _ = t) => {
      Tr(u, s)
        .then(f => {
          (a.value = f),
            c("locale", u),
            (i.value = u),
            c("translations", f),
            Object.values(s).length > 1 &&
              (o.emit("vf-toast-push", {
                label: "The language is set to " + u
              }),
              o.emit("vf-language-saved"));
        })
        .catch(f => {
          _
            ? (o.emit("vf-toast-push", {
                label: "The selected locale is not yet supported!",
                type: "error"
              }),
              l(_, null))
            : o.emit("vf-toast-push", {
                label: "Locale cannot be loaded!",
                type: "error"
              });
        });
    };
  e.watch(i, u => {
    l(u);
  }),
    !r("locale") && !s.length ? l(t) : (a.value = r("translations"));
  const d = (u, ..._) =>
    _.length ? d((u = u.replace("%s", _.shift())), ..._) : u;
  function m(u, ..._) {
    return a.value && a.value.hasOwnProperty(u)
      ? d(a.value[u], ..._)
      : d(u, ..._);
  }
  return e.reactive({ t: m, locale: i });
}
const Z = {
    EDIT: "edit",
    NEW_FILE: "newfile",
    NEW_FOLDER: "newfolder",
    PREVIEW: "preview",
    ARCHIVE: "archive",
    UNARCHIVE: "unarchive",
    SEARCH: "search",
    RENAME: "rename",
    UPLOAD: "upload",
    DELETE: "delete",
    FULL_SCREEN: "fullscreen",
    DOWNLOAD: "download",
    LANGUAGE: "language"
  },
  Ar = Object.values(Z),
  Lr = "2.5.16";
function so(n, t, o, s, r) {
  return (
    ((t = Math),
    (o = t.log),
    (s = 1024),
    (r = (o(n) / o(s)) | 0),
    n / t.pow(s, r)).toFixed(0) +
    " " +
    (r ? "KMGTPEZY"[--r] + "iB" : "B")
  );
}
function lo(n, t, o, s, r) {
  return (
    ((t = Math),
    (o = t.log),
    (s = 1e3),
    (r = (o(n) / o(s)) | 0),
    n / t.pow(s, r)).toFixed(0) +
    " " +
    (r ? "KMGTPEZY"[--r] + "B" : "B")
  );
}
function Or(n) {
  const t = { k: 1, m: 2, g: 3, t: 4 },
    s = /(\d+(?:\.\d+)?)\s?(k|m|g|t)?b?/i.exec(n);
  return s[1] * Math.pow(1024, t[s[2].toLowerCase()]);
}
const Fe = { SYSTEM: "system", LIGHT: "light", DARK: "dark" };
function Fr(n, t) {
  const o = e.ref(Fe.SYSTEM),
    s = e.ref(Fe.LIGHT);
  o.value = n.getStore("theme", t ?? Fe.SYSTEM);
  const r = window.matchMedia("(prefers-color-scheme: dark)"),
    c = a => {
      o.value === Fe.DARK || (o.value === Fe.SYSTEM && a.matches)
        ? (s.value = Fe.DARK)
        : (s.value = Fe.LIGHT);
    };
  return (
    c(r),
    r.addEventListener("change", c),
    {
      value: o,
      actualValue: s,
      set(a) {
        (o.value = a),
          a !== Fe.SYSTEM ? n.setStore("theme", a) : n.removeStore("theme"),
          c(r);
      }
    }
  );
}
function Hr() {
  const n = e.shallowRef(null),
    t = e.ref(!1),
    o = e.ref();
  return {
    visible: t,
    type: n,
    data: o,
    open: (c, a = null) => {
      (document.querySelector("body").style.overflow = "hidden"),
        (t.value = !0),
        (n.value = c),
        (o.value = a);
    },
    close: () => {
      (document.querySelector("body").style.overflow = ""),
        (t.value = !1),
        (n.value = null);
    }
  };
}
/*!
 * OverlayScrollbars
 * Version: 2.10.0
 *
 * Copyright (c) Rene Haas | KingSora.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 */ const ve = (n, t) => {
    const { o, i: s, u: r } = n;
    let c = o,
      a;
    const i = (m, u) => {
      const _ = c,
        f = m,
        v = u || (s ? !s(_, f) : _ !== f);
      return (v || r) && ((c = f), (a = _)), [c, v, a];
    };
    return [t ? m => i(t(c, a), m) : i, m => [c, !!m, a]];
  },
  Rr = typeof window < "u" && typeof HTMLElement < "u" && !!window.document,
  _e = Rr ? window : {},
  ao = Math.max,
  zr = Math.min,
  Qt = Math.round,
  St = Math.abs,
  Hn = Math.sign,
  co = _e.cancelAnimationFrame,
  hn = _e.requestAnimationFrame,
  Nt = _e.setTimeout,
  en = _e.clearTimeout,
  Mt = n => (typeof _e[n] < "u" ? _e[n] : void 0),
  Ir = Mt("MutationObserver"),
  Rn = Mt("IntersectionObserver"),
  xt = Mt("ResizeObserver"),
  bt = Mt("ScrollTimeline"),
  gn = n => n === void 0,
  At = n => n === null,
  Se = n => typeof n == "number",
  ct = n => typeof n == "string",
  kn = n => typeof n == "boolean",
  we = n => typeof n == "function",
  Ne = n => Array.isArray(n),
  Bt = n => typeof n == "object" && !Ne(n) && !At(n),
  wn = n => {
    const t = !!n && n.length,
      o = Se(t) && t > -1 && t % 1 == 0;
    return Ne(n) || (!we(n) && o) ? (t > 0 && Bt(n) ? t - 1 in n : !0) : !1;
  },
  $t = n => !!n && n.constructor === Object,
  Ct = n => n instanceof HTMLElement,
  Lt = n => n instanceof Element;
function Y(n, t) {
  if (wn(n)) for (let o = 0; o < n.length && t(n[o], o, n) !== !1; o++);
  else n && Y(Object.keys(n), o => t(n[o], o, n));
  return n;
}
const io = (n, t) => n.indexOf(t) >= 0,
  st = (n, t) => n.concat(t),
  ne = (n, t, o) => (
    !ct(t) && wn(t) ? Array.prototype.push.apply(n, t) : n.push(t), n
  ),
  ze = n => Array.from(n || []),
  bn = n => (Ne(n) ? n : !ct(n) && wn(n) ? ze(n) : [n]),
  tn = n => !!n && !n.length,
  nn = n => ze(new Set(n)),
  ge = (n, t, o) => {
    Y(n, r => (r ? r.apply(void 0, t || []) : !0)), !o && (n.length = 0);
  },
  uo = "paddingTop",
  mo = "paddingRight",
  fo = "paddingLeft",
  _o = "paddingBottom",
  vo = "marginLeft",
  po = "marginRight",
  ho = "marginBottom",
  go = "overflowX",
  ko = "overflowY",
  Ot = "width",
  Ft = "height",
  He = "visible",
  Ue = "hidden",
  Je = "scroll",
  Ur = n => {
    const t = String(n || "");
    return t ? t[0].toUpperCase() + t.slice(1) : "";
  },
  Ht = (n, t, o, s) => {
    if (n && t) {
      let r = !0;
      return (
        Y(o, c => {
          const a = n[c],
            i = t[c];
          a !== i && (r = !1);
        }),
        r
      );
    }
    return !1;
  },
  wo = (n, t) => Ht(n, t, ["w", "h"]),
  yt = (n, t) => Ht(n, t, ["x", "y"]),
  qr = (n, t) => Ht(n, t, ["t", "r", "b", "l"]),
  qe = () => {},
  U = (n, ...t) => n.bind(0, ...t),
  Ke = n => {
    let t;
    const o = n ? Nt : hn,
      s = n ? en : co;
    return [
      r => {
        s(t), (t = o(() => r(), we(n) ? n() : n));
      },
      () => s(t)
    ];
  },
  on = (n, t) => {
    const { _: o, v: s, p: r, S: c } = t || {};
    let a,
      i,
      l,
      d,
      m = qe;
    const u = function (p) {
        m(), en(a), (d = a = i = void 0), (m = qe), n.apply(this, p);
      },
      _ = k => (c && i ? c(i, k) : k),
      f = () => {
        m !== qe && u(_(l) || l);
      },
      v = function () {
        const p = ze(arguments),
          S = we(o) ? o() : o;
        if (Se(S) && S >= 0) {
          const C = we(s) ? s() : s,
            w = Se(C) && C >= 0,
            N = S > 0 ? Nt : hn,
            B = S > 0 ? en : co,
            x = _(p) || p,
            b = u.bind(0, x);
          let h;
          m(),
            r && !d
              ? (b(), (d = !0), (h = N(() => (d = void 0), S)))
              : ((h = N(b, S)), w && !a && (a = Nt(f, C))),
            (m = () => B(h)),
            (i = l = x);
        } else u(p);
      };
    return (v.m = f), v;
  },
  bo = (n, t) => Object.prototype.hasOwnProperty.call(n, t),
  be = n => (n ? Object.keys(n) : []),
  W = (n, t, o, s, r, c, a) => {
    const i = [t, o, s, r, c, a];
    return (
      (typeof n != "object" || At(n)) && !we(n) && (n = {}),
      Y(i, l => {
        Y(l, (d, m) => {
          const u = l[m];
          if (n === u) return !0;
          const _ = Ne(u);
          if (u && $t(u)) {
            const f = n[m];
            let v = f;
            _ && !Ne(f) ? (v = []) : !_ && !$t(f) && (v = {}), (n[m] = W(v, u));
          } else n[m] = _ ? u.slice() : u;
        });
      }),
      n
    );
  },
  yo = (n, t) =>
    Y(W({}, n), (o, s, r) => {
      o === void 0 ? delete r[s] : o && $t(o) && (r[s] = yo(o));
    }),
  yn = n => !be(n).length,
  Eo = (n, t, o) => ao(n, zr(t, o)),
  je = n => nn((Ne(n) ? n : (n || "").split(" ")).filter(t => t)),
  En = (n, t) => n && n.getAttribute(t),
  zn = (n, t) => n && n.hasAttribute(t),
  Te = (n, t, o) => {
    Y(je(t), s => {
      n && n.setAttribute(s, String(o || ""));
    });
  },
  Ee = (n, t) => {
    Y(je(t), o => n && n.removeAttribute(o));
  },
  Rt = (n, t) => {
    const o = je(En(n, t)),
      s = U(Te, n, t),
      r = (c, a) => {
        const i = new Set(o);
        return (
          Y(je(c), l => {
            i[a](l);
          }),
          ze(i).join(" ")
        );
      };
    return {
      O: c => s(r(c, "delete")),
      $: c => s(r(c, "add")),
      C: c => {
        const a = je(c);
        return a.reduce((i, l) => i && o.includes(l), a.length > 0);
      }
    };
  },
  Vo = (n, t, o) => (Rt(n, t).O(o), U(Vn, n, t, o)),
  Vn = (n, t, o) => (Rt(n, t).$(o), U(Vo, n, t, o)),
  Dt = (n, t, o, s) => (s ? Vn : Vo)(n, t, o),
  Sn = (n, t, o) => Rt(n, t).C(o),
  So = n => Rt(n, "class"),
  No = (n, t) => {
    So(n).O(t);
  },
  Nn = (n, t) => (So(n).$(t), U(No, n, t)),
  xo = (n, t) => {
    const o = t ? Lt(t) && t : document;
    return o ? ze(o.querySelectorAll(n)) : [];
  },
  jr = (n, t) => {
    const o = t ? Lt(t) && t : document;
    return o && o.querySelector(n);
  },
  rn = (n, t) => Lt(n) && n.matches(t),
  Bo = n => rn(n, "body"),
  sn = n => (n ? ze(n.childNodes) : []),
  lt = n => n && n.parentElement,
  We = (n, t) => Lt(n) && n.closest(t),
  ln = n => document.activeElement,
  Pr = (n, t, o) => {
    const s = We(n, t),
      r = n && jr(o, s),
      c = We(r, t) === s;
    return s && r ? s === n || r === n || (c && We(We(n, o), t) !== s) : !1;
  },
  Ze = n => {
    Y(bn(n), t => {
      const o = lt(t);
      t && o && o.removeChild(t);
    });
  },
  pe = (n, t) =>
    U(
      Ze,
      n &&
        t &&
        Y(bn(t), o => {
          o && n.appendChild(o);
        })
    ),
  Ye = n => {
    const t = document.createElement("div");
    return Te(t, "class", n), t;
  },
  $o = n => {
    const t = Ye();
    return (t.innerHTML = n.trim()), Y(sn(t), o => Ze(o));
  },
  In = (n, t) => n.getPropertyValue(t) || n[t] || "",
  Co = n => {
    const t = n || 0;
    return isFinite(t) ? t : 0;
  },
  gt = n => Co(parseFloat(n || "")),
  an = n => Math.round(n * 1e4) / 1e4,
  Do = n => `${an(Co(n))}px`;
function at(n, t) {
  n &&
    t &&
    Y(t, (o, s) => {
      try {
        const r = n.style,
          c = At(o) || kn(o) ? "" : Se(o) ? Do(o) : o;
        s.indexOf("--") === 0 ? r.setProperty(s, c) : (r[s] = c);
      } catch {}
    });
}
function Ae(n, t, o) {
  const s = ct(t);
  let r = s ? "" : {};
  if (n) {
    const c = _e.getComputedStyle(n, o) || n.style;
    r = s ? In(c, t) : ze(t).reduce((a, i) => ((a[i] = In(c, i)), a), r);
  }
  return r;
}
const Un = (n, t, o) => {
    const s = t ? `${t}-` : "",
      r = o ? `-${o}` : "",
      c = `${s}top${r}`,
      a = `${s}right${r}`,
      i = `${s}bottom${r}`,
      l = `${s}left${r}`,
      d = Ae(n, [c, a, i, l]);
    return { t: gt(d[c]), r: gt(d[a]), b: gt(d[i]), l: gt(d[l]) };
  },
  Gr = (n, t) => `translate${Bt(n) ? `(${n.x},${n.y})` : `Y(${n})`}`,
  Kr = n => !!(n.offsetWidth || n.offsetHeight || n.getClientRects().length),
  Wr = { w: 0, h: 0 },
  zt = (n, t) => (t ? { w: t[`${n}Width`], h: t[`${n}Height`] } : Wr),
  Yr = n => zt("inner", n || _e),
  Xe = U(zt, "offset"),
  To = U(zt, "client"),
  Tt = U(zt, "scroll"),
  xn = n => {
    const t = parseFloat(Ae(n, Ot)) || 0,
      o = parseFloat(Ae(n, Ft)) || 0;
    return { w: t - Qt(t), h: o - Qt(o) };
  },
  Wt = n => n.getBoundingClientRect(),
  Xr = n => !!n && Kr(n),
  cn = n => !!(n && (n[Ft] || n[Ot])),
  Mo = (n, t) => {
    const o = cn(n);
    return !cn(t) && o;
  },
  qn = (n, t, o, s) => {
    Y(je(t), r => {
      n && n.removeEventListener(r, o, s);
    });
  },
  Q = (n, t, o, s) => {
    var r;
    const c = (r = s && s.H) != null ? r : !0,
      a = (s && s.I) || !1,
      i = (s && s.A) || !1,
      l = { passive: c, capture: a };
    return U(
      ge,
      je(t).map(d => {
        const m = i
          ? u => {
              qn(n, d, m, a), o && o(u);
            }
          : o;
        return n && n.addEventListener(d, m, l), U(qn, n, d, m, a);
      })
    );
  },
  Ao = n => n.stopPropagation(),
  dn = n => n.preventDefault(),
  Lo = n => Ao(n) || dn(n),
  Ve = (n, t) => {
    const { x: o, y: s } = Se(t) ? { x: t, y: t } : t || {};
    Se(o) && (n.scrollLeft = o), Se(s) && (n.scrollTop = s);
  },
  he = n => ({ x: n.scrollLeft, y: n.scrollTop }),
  Oo = () => ({ D: { x: 0, y: 0 }, M: { x: 0, y: 0 } }),
  Jr = (n, t) => {
    const { D: o, M: s } = n,
      { w: r, h: c } = t,
      a = (u, _, f) => {
        let v = Hn(u) * f,
          k = Hn(_) * f;
        if (v === k) {
          const p = St(u),
            S = St(_);
          (k = p > S ? 0 : k), (v = p < S ? 0 : v);
        }
        return (v = v === k ? 0 : v), [v + 0, k + 0];
      },
      [i, l] = a(o.x, s.x, r),
      [d, m] = a(o.y, s.y, c);
    return { D: { x: i, y: d }, M: { x: l, y: m } };
  },
  jn = ({ D: n, M: t }) => {
    const o = (s, r) => s === 0 && s <= r;
    return { x: o(n.x, t.x), y: o(n.y, t.y) };
  },
  Pn = ({ D: n, M: t }, o) => {
    const s = (r, c, a) => Eo(0, 1, (r - a) / (r - c) || 0);
    return { x: s(n.x, t.x, o.x), y: s(n.y, t.y, o.y) };
  },
  un = n => {
    n && n.focus && n.focus({ preventScroll: !0 });
  },
  Gn = (n, t) => {
    Y(bn(t), n);
  },
  mn = n => {
    const t = new Map(),
      o = (c, a) => {
        if (c) {
          const i = t.get(c);
          Gn(l => {
            i && i[l ? "delete" : "clear"](l);
          }, a);
        } else
          t.forEach(i => {
            i.clear();
          }),
            t.clear();
      },
      s = (c, a) => {
        if (ct(c)) {
          const d = t.get(c) || new Set();
          return (
            t.set(c, d),
            Gn(m => {
              we(m) && d.add(m);
            }, a),
            U(o, c, a)
          );
        }
        kn(a) && a && o();
        const i = be(c),
          l = [];
        return (
          Y(i, d => {
            const m = c[d];
            m && ne(l, s(d, m));
          }),
          U(ge, l)
        );
      },
      r = (c, a) => {
        Y(ze(t.get(c)), i => {
          a && !tn(a) ? i.apply(0, a) : i();
        });
      };
    return s(n || {}), [s, o, r];
  },
  Kn = n =>
    JSON.stringify(n, (t, o) => {
      if (we(o)) throw 0;
      return o;
    }),
  Wn = (n, t) =>
    n
      ? `${t}`.split(".").reduce((o, s) => (o && bo(o, s) ? o[s] : void 0), n)
      : void 0,
  Zr = {
    paddingAbsolute: !1,
    showNativeOverlaidScrollbars: !1,
    update: {
      elementEvents: [["img", "load"]],
      debounce: [0, 33],
      attributes: null,
      ignoreMutation: null
    },
    overflow: { x: "scroll", y: "scroll" },
    scrollbars: {
      theme: "os-theme-dark",
      visibility: "auto",
      autoHide: "never",
      autoHideDelay: 1300,
      autoHideSuspend: !1,
      dragScroll: !0,
      clickScroll: !1,
      pointers: ["mouse", "touch", "pen"]
    }
  },
  Fo = (n, t) => {
    const o = {},
      s = st(be(t), be(n));
    return (
      Y(s, r => {
        const c = n[r],
          a = t[r];
        if (Bt(c) && Bt(a)) W((o[r] = {}), Fo(c, a)), yn(o[r]) && delete o[r];
        else if (bo(t, r) && a !== c) {
          let i = !0;
          if (Ne(c) || Ne(a))
            try {
              Kn(c) === Kn(a) && (i = !1);
            } catch {}
          i && (o[r] = a);
        }
      }),
      o
    );
  },
  Yn = (n, t, o) => s => [Wn(n, s), o || Wn(t, s) !== void 0],
  et = "data-overlayscrollbars",
  Et = "os-environment",
  kt = `${Et}-scrollbar-hidden`,
  Yt = `${et}-initialize`,
  Vt = "noClipping",
  Xn = `${et}-body`,
  Re = et,
  Qr = "host",
  Me = `${et}-viewport`,
  es = go,
  ts = ko,
  ns = "arrange",
  Ho = "measuring",
  os = "scrolling",
  Ro = "scrollbarHidden",
  rs = "noContent",
  fn = `${et}-padding`,
  Jn = `${et}-content`,
  Bn = "os-size-observer",
  ss = `${Bn}-appear`,
  ls = `${Bn}-listener`,
  as = "os-trinsic-observer",
  cs = "os-theme-none",
  ke = "os-scrollbar",
  is = `${ke}-rtl`,
  ds = `${ke}-horizontal`,
  us = `${ke}-vertical`,
  zo = `${ke}-track`,
  $n = `${ke}-handle`,
  ms = `${ke}-visible`,
  fs = `${ke}-cornerless`,
  Zn = `${ke}-interaction`,
  Qn = `${ke}-unusable`,
  _n = `${ke}-auto-hide`,
  eo = `${_n}-hidden`,
  to = `${ke}-wheel`,
  _s = `${zo}-interactive`,
  vs = `${$n}-interactive`;
let Io;
const ps = () => Io,
  hs = n => {
    Io = n;
  };
let Xt;
const gs = () => {
    const n = (w, N, B) => {
        pe(document.body, w), pe(document.body, w);
        const F = To(w),
          x = Xe(w),
          b = xn(N);
        return B && Ze(w), { x: x.h - F.h + b.h, y: x.w - F.w + b.w };
      },
      t = w => {
        let N = !1;
        const B = Nn(w, kt);
        try {
          N =
            Ae(w, "scrollbar-width") === "none" ||
            Ae(w, "display", "::-webkit-scrollbar") === "none";
        } catch {}
        return B(), N;
      },
      o = `.${Et}{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.${Et} div{width:200%;height:200%;margin:10px 0}.${kt}{scrollbar-width:none!important}.${kt}::-webkit-scrollbar,.${kt}::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}`,
      r = $o(`<div class="${Et}"><div></div><style>${o}</style></div>`)[0],
      c = r.firstChild,
      a = r.lastChild,
      i = ps();
    i && (a.nonce = i);
    const [l, , d] = mn(),
      [m, u] = ve({ o: n(r, c), i: yt }, U(n, r, c, !0)),
      [_] = u(),
      f = t(r),
      v = { x: _.x === 0, y: _.y === 0 },
      k = {
        elements: {
          host: null,
          padding: !f,
          viewport: w => f && Bo(w) && w,
          content: !1
        },
        scrollbars: { slot: !0 },
        cancel: { nativeScrollbarsOverlaid: !1, body: null }
      },
      p = W({}, Zr),
      S = U(W, {}, p),
      T = U(W, {}, k),
      C = {
        T: _,
        k: v,
        R: f,
        V: !!bt,
        L: U(l, "r"),
        U: T,
        P: w => W(k, w) && T(),
        N: S,
        q: w => W(p, w) && S(),
        B: W({}, k),
        F: W({}, p)
      };
    if (
      (Ee(r, "style"),
      Ze(r),
      Q(_e, "resize", () => {
        d("r", []);
      }),
      we(_e.matchMedia) && !f && (!v.x || !v.y))
    ) {
      const w = N => {
        const B = _e.matchMedia(`(resolution: ${_e.devicePixelRatio}dppx)`);
        Q(
          B,
          "change",
          () => {
            N(), w(N);
          },
          { A: !0 }
        );
      };
      w(() => {
        const [N, B] = m();
        W(C.T, N), d("r", [B]);
      });
    }
    return C;
  },
  Be = () => (Xt || (Xt = gs()), Xt),
  Uo = (n, t) => (we(t) ? t.apply(0, n) : t),
  ks = (n, t, o, s) => {
    const r = gn(s) ? o : s;
    return Uo(n, r) || t.apply(0, n);
  },
  qo = (n, t, o, s) => {
    const r = gn(s) ? o : s,
      c = Uo(n, r);
    return !!c && (Ct(c) ? c : t.apply(0, n));
  },
  ws = (n, t) => {
    const { nativeScrollbarsOverlaid: o, body: s } = t || {},
      { k: r, R: c, U: a } = Be(),
      { nativeScrollbarsOverlaid: i, body: l } = a().cancel,
      d = o ?? i,
      m = gn(s) ? l : s,
      u = (r.x || r.y) && d,
      _ = n && (At(m) ? !c : m);
    return !!u || !!_;
  },
  Cn = new WeakMap(),
  bs = (n, t) => {
    Cn.set(n, t);
  },
  ys = n => {
    Cn.delete(n);
  },
  jo = n => Cn.get(n),
  Es = (n, t, o) => {
    let s = !1;
    const r = o ? new WeakMap() : !1,
      c = () => {
        s = !0;
      },
      a = i => {
        if (r && o) {
          const l = o.map(d => {
            const [m, u] = d || [];
            return [u && m ? (i || xo)(m, n) : [], u];
          });
          Y(l, d =>
            Y(d[0], m => {
              const u = d[1],
                _ = r.get(m) || [];
              if (n.contains(m) && u) {
                const v = Q(m, u, k => {
                  s ? (v(), r.delete(m)) : t(k);
                });
                r.set(m, ne(_, v));
              } else ge(_), r.delete(m);
            })
          );
        }
      };
    return a(), [c, a];
  },
  no = (n, t, o, s) => {
    let r = !1;
    const { j: c, X: a, Y: i, W: l, J: d, G: m } = s || {},
      u = on(() => r && o(!0), { _: 33, v: 99 }),
      [_, f] = Es(n, u, i),
      v = c || [],
      k = a || [],
      p = st(v, k),
      S = (C, w) => {
        if (!tn(w)) {
          const N = d || qe,
            B = m || qe,
            F = [],
            x = [];
          let b = !1,
            h = !1;
          if (
            (Y(w, y => {
              const {
                  attributeName: E,
                  target: M,
                  type: g,
                  oldValue: L,
                  addedNodes: O,
                  removedNodes: j
                } = y,
                K = g === "attributes",
                G = g === "childList",
                oe = n === M,
                $ = K && E,
                D = $ && En(M, E || ""),
                A = ct(D) ? D : null,
                H = $ && L !== A,
                V = io(k, E) && H;
              if (t && (G || !oe)) {
                const z = K && H,
                  R = z && l && rn(M, l),
                  P = (R ? !N(M, E, L, A) : !K || z) && !B(y, !!R, n, s);
                Y(O, X => ne(F, X)), Y(j, X => ne(F, X)), (h = h || P);
              }
              !t && oe && H && !N(M, E, L, A) && (ne(x, E), (b = b || V));
            }),
            f(y =>
              nn(F).reduce(
                (E, M) => (ne(E, xo(y, M)), rn(M, y) ? ne(E, M) : E),
                []
              )
            ),
            t)
          )
            return !C && h && o(!1), [!1];
          if (!tn(x) || b) {
            const y = [nn(x), b];
            return !C && o.apply(0, y), y;
          }
        }
      },
      T = new Ir(U(S, !1));
    return [
      () => (
        T.observe(n, {
          attributes: !0,
          attributeOldValue: !0,
          attributeFilter: p,
          subtree: t,
          childList: t,
          characterData: t
        }),
        (r = !0),
        () => {
          r && (_(), T.disconnect(), (r = !1));
        }
      ),
      () => {
        if (r) return u.m(), S(!0, T.takeRecords());
      }
    ];
  },
  Po = {},
  Go = {},
  Vs = n => {
    Y(n, t =>
      Y(t, (o, s) => {
        Po[s] = t[s];
      })
    );
  },
  Ko = (n, t, o) =>
    be(n).map(s => {
      const { static: r, instance: c } = n[s],
        [a, i, l] = o || [],
        d = o ? c : r;
      if (d) {
        const m = o ? d(a, i, t) : d(t);
        return ((l || Go)[s] = m);
      }
    }),
  it = n => Go[n],
  Ss = "__osOptionsValidationPlugin",
  Ns = "__osSizeObserverPlugin",
  xs = (n, t) => {
    const { k: o } = t,
      [s, r] = n("showNativeOverlaidScrollbars");
    return [s && o.x && o.y, r];
  },
  Qe = n => n.indexOf(He) === 0,
  Bs = (n, t) => {
    const o = (r, c, a, i) => {
        const l = r === He ? Ue : r.replace(`${He}-`, ""),
          d = Qe(r),
          m = Qe(a);
        return !c && !i
          ? Ue
          : d && m
          ? He
          : d
          ? c && i
            ? l
            : c
            ? He
            : Ue
          : c
          ? l
          : m && i
          ? He
          : Ue;
      },
      s = { x: o(t.x, n.x, t.y, n.y), y: o(t.y, n.y, t.x, n.x) };
    return { K: s, Z: { x: s.x === Je, y: s.y === Je } };
  },
  Wo = "__osScrollbarsHidingPlugin",
  $s = "__osClickScrollPlugin",
  Yo = (n, t, o) => {
    const { dt: s } = o || {},
      r = it(Ns),
      [c] = ve({ o: !1, u: !0 });
    return () => {
      const a = [],
        l = $o(`<div class="${Bn}"><div class="${ls}"></div></div>`)[0],
        d = l.firstChild,
        m = u => {
          const _ = u instanceof ResizeObserverEntry;
          let f = !1,
            v = !1;
          if (_) {
            const [k, , p] = c(u.contentRect),
              S = cn(k);
            (v = Mo(k, p)), (f = !v && !S);
          } else v = u === !0;
          f || t({ ft: !0, dt: v });
        };
      if (xt) {
        const u = new xt(_ => m(_.pop()));
        u.observe(d),
          ne(a, () => {
            u.disconnect();
          });
      } else if (r) {
        const [u, _] = r(d, m, s);
        ne(a, st([Nn(l, ss), Q(l, "animationstart", u)], _));
      } else return qe;
      return U(ge, ne(a, pe(n, l)));
    };
  },
  Cs = (n, t) => {
    let o;
    const s = l => l.h === 0 || l.isIntersecting || l.intersectionRatio > 0,
      r = Ye(as),
      [c] = ve({ o: !1 }),
      a = (l, d) => {
        if (l) {
          const m = c(s(l)),
            [, u] = m;
          return u && !d && t(m) && [m];
        }
      },
      i = (l, d) => a(d.pop(), l);
    return [
      () => {
        const l = [];
        if (Rn)
          (o = new Rn(U(i, !1), { root: n })),
            o.observe(r),
            ne(l, () => {
              o.disconnect();
            });
        else {
          const d = () => {
            const m = Xe(r);
            a(m);
          };
          ne(l, Yo(r, d)()), d();
        }
        return U(ge, ne(l, pe(n, r)));
      },
      () => o && i(!0, o.takeRecords())
    ];
  },
  Ds = (n, t, o, s) => {
    let r, c, a, i, l, d;
    const m = `[${Re}]`,
      u = `[${Me}]`,
      _ = ["id", "class", "style", "open", "wrap", "cols", "rows"],
      {
        vt: f,
        ht: v,
        ot: k,
        gt: p,
        bt: S,
        nt: T,
        wt: C,
        yt: w,
        St: N,
        Ot: B
      } = n,
      F = V => Ae(V, "direction") === "rtl",
      x = { $t: !1, ct: F(f) },
      b = Be(),
      h = it(Wo),
      [y] = ve({ i: wo, o: { w: 0, h: 0 } }, () => {
        const V = h && h.tt(n, t, x, b, o).ut,
          R = !(C && T) && Sn(v, Re, Vt),
          I = !T && w(ns),
          P = I && he(p),
          X = P && B(),
          se = N(Ho, R),
          ee = I && V && V()[0],
          ie = Tt(k),
          q = xn(k);
        return (
          ee && ee(),
          Ve(p, P),
          X && X(),
          R && se(),
          { w: ie.w + q.w, h: ie.h + q.h }
        );
      }),
      E = on(s, {
        _: () => r,
        v: () => c,
        S(V, z) {
          const [R] = V,
            [I] = z;
          return [
            st(be(R), be(I)).reduce((P, X) => ((P[X] = R[X] || I[X]), P), {})
          ];
        }
      }),
      M = V => {
        const z = F(f);
        W(V, { Ct: d !== z }), W(x, { ct: z }), (d = z);
      },
      g = (V, z) => {
        const [R, I] = V,
          P = { xt: I };
        return W(x, { $t: R }), !z && s(P), P;
      },
      L = ({ ft: V, dt: z }) => {
        const I = !(V && !z) && b.R ? E : s,
          P = { ft: V || z, dt: z };
        M(P), I(P);
      },
      O = (V, z) => {
        const [, R] = y(),
          I = { Ht: R };
        return M(I), R && !z && (V ? s : E)(I), I;
      },
      j = (V, z, R) => {
        const I = { Et: z };
        return M(I), z && !R && E(I), I;
      },
      [K, G] = S ? Cs(v, g) : [],
      oe = !T && Yo(v, L, { dt: !0 }),
      [$, D] = no(v, !1, j, { X: _, j: _ }),
      A =
        T &&
        xt &&
        new xt(V => {
          const z = V[V.length - 1].contentRect;
          L({ ft: !0, dt: Mo(z, l) }), (l = z);
        }),
      H = on(
        () => {
          const [, V] = y();
          s({ Ht: V });
        },
        { _: 222, p: !0 }
      );
    return [
      () => {
        A && A.observe(v);
        const V = oe && oe(),
          z = K && K(),
          R = $(),
          I = b.L(P => {
            P ? E({ zt: P }) : H();
          });
        return () => {
          A && A.disconnect(), V && V(), z && z(), i && i(), R(), I();
        };
      },
      ({ It: V, At: z, Dt: R }) => {
        const I = {},
          [P] = V("update.ignoreMutation"),
          [X, se] = V("update.attributes"),
          [ee, ie] = V("update.elementEvents"),
          [q, de] = V("update.debounce"),
          me = ie || se,
          ae = z || R,
          ue = re => we(P) && P(re);
        if (me) {
          a && a(), i && i();
          const [re, le] = no(S || k, !0, O, {
            j: st(_, X || []),
            Y: ee,
            W: m,
            G: (J, te) => {
              const { target: ce, attributeName: fe } = J;
              return (
                (!te && fe && !T ? Pr(ce, m, u) : !1) ||
                !!We(ce, `.${ke}`) ||
                !!ue(J)
              );
            }
          });
          (i = re()), (a = le);
        }
        if (de)
          if ((E.m(), Ne(q))) {
            const re = q[0],
              le = q[1];
            (r = Se(re) && re), (c = Se(le) && le);
          } else Se(q) ? ((r = q), (c = !1)) : ((r = !1), (c = !1));
        if (ae) {
          const re = D(),
            le = G && G(),
            J = a && a();
          re && W(I, j(re[0], re[1], ae)),
            le && W(I, g(le[0], ae)),
            J && W(I, O(J[0], ae));
        }
        return M(I), I;
      },
      x
    ];
  },
  Ts = (n, t, o, s) => {
    const r = "--os-viewport-percent",
      c = "--os-scroll-percent",
      a = "--os-scroll-direction",
      { U: i } = Be(),
      { scrollbars: l } = i(),
      { slot: d } = l,
      { vt: m, ht: u, ot: _, Mt: f, gt: v, wt: k, nt: p } = t,
      { scrollbars: S } = f ? {} : n,
      { slot: T } = S || {},
      C = [],
      w = [],
      N = [],
      B = qo([m, u, _], () => (p && k ? m : u), d, T),
      F = $ => {
        if (bt) {
          const D = new bt({ source: v, axis: $ });
          return {
            kt: H => {
              const V = H.Tt.animate(
                { clear: ["left"], [c]: [0, 1] },
                { timeline: D }
              );
              return () => V.cancel();
            }
          };
        }
      },
      x = { x: F("x"), y: F("y") },
      b = () => {
        const { Rt: $, Vt: D } = o,
          A = (H, V) => Eo(0, 1, H / (H + V) || 0);
        return { x: A(D.x, $.x), y: A(D.y, $.y) };
      },
      h = ($, D, A) => {
        const H = A ? Nn : No;
        Y($, V => {
          H(V.Tt, D);
        });
      },
      y = ($, D) => {
        Y($, A => {
          const [H, V] = D(A);
          at(H, V);
        });
      },
      E = ($, D, A) => {
        const H = kn(A),
          V = H ? A : !0,
          z = H ? !A : !0;
        V && h(w, $, D), z && h(N, $, D);
      },
      M = () => {
        const $ = b(),
          D = A => H => [H.Tt, { [r]: an(A) + "" }];
        y(w, D($.x)), y(N, D($.y));
      },
      g = () => {
        if (!bt) {
          const { Lt: $ } = o,
            D = Pn($, he(v)),
            A = H => V => [V.Tt, { [c]: an(H) + "" }];
          y(w, A(D.x)), y(N, A(D.y));
        }
      },
      L = () => {
        const { Lt: $ } = o,
          D = jn($),
          A = H => V => [V.Tt, { [a]: H ? "0" : "1" }];
        y(w, A(D.x)), y(N, A(D.y));
      },
      O = () => {
        if (p && !k) {
          const { Rt: $, Lt: D } = o,
            A = jn(D),
            H = Pn(D, he(v)),
            V = z => {
              const { Tt: R } = z,
                I = lt(R) === _ && R,
                P = (X, se, ee) => {
                  const ie = se * X;
                  return Do(ee ? ie : -ie);
                };
              return [
                I,
                I && {
                  transform: Gr({ x: P(H.x, $.x, A.x), y: P(H.y, $.y, A.y) })
                }
              ];
            };
          y(w, V), y(N, V);
        }
      },
      j = $ => {
        const D = $ ? "x" : "y",
          H = Ye(`${ke} ${$ ? ds : us}`),
          V = Ye(zo),
          z = Ye($n),
          R = { Tt: H, Ut: V, Pt: z },
          I = x[D];
        return (
          ne($ ? w : N, R),
          ne(C, [pe(H, V), pe(V, z), U(Ze, H), I && I.kt(R), s(R, E, $)]),
          R
        );
      },
      K = U(j, !0),
      G = U(j, !1),
      oe = () => (pe(B, w[0].Tt), pe(B, N[0].Tt), U(ge, C));
    return (
      K(),
      G(),
      [
        {
          Nt: M,
          qt: g,
          Bt: L,
          Ft: O,
          jt: E,
          Xt: { Yt: w, Wt: K, Jt: U(y, w) },
          Gt: { Yt: N, Wt: G, Jt: U(y, N) }
        },
        oe
      ]
    );
  },
  Ms = (n, t, o, s) => (r, c, a) => {
    const { ht: i, ot: l, nt: d, gt: m, Kt: u, Ot: _ } = t,
      { Tt: f, Ut: v, Pt: k } = r,
      [p, S] = Ke(333),
      [T, C] = Ke(444),
      w = F => {
        we(m.scrollBy) &&
          m.scrollBy({ behavior: "smooth", left: F.x, top: F.y });
      },
      N = () => {
        const F = "pointerup pointercancel lostpointercapture",
          x = `client${a ? "X" : "Y"}`,
          b = a ? Ot : Ft,
          h = a ? "left" : "top",
          y = a ? "w" : "h",
          E = a ? "x" : "y",
          M = (L, O) => j => {
            const { Rt: K } = o,
              G = Xe(v)[y] - Xe(k)[y],
              $ = ((O * j) / G) * K[E];
            Ve(m, { [E]: L + $ });
          },
          g = [];
        return Q(v, "pointerdown", L => {
          const O = We(L.target, `.${$n}`) === k,
            j = O ? k : v,
            K = n.scrollbars,
            G = K[O ? "dragScroll" : "clickScroll"],
            { button: oe, isPrimary: $, pointerType: D } = L,
            { pointers: A } = K;
          if (oe === 0 && $ && G && (A || []).includes(D)) {
            ge(g), C();
            const V = !O && (L.shiftKey || G === "instant"),
              z = U(Wt, k),
              R = U(Wt, v),
              I = (te, ce) => (te || z())[h] - (ce || R())[h],
              P = Qt(Wt(m)[b]) / Xe(m)[y] || 1,
              X = M(he(m)[E], 1 / P),
              se = L[x],
              ee = z(),
              ie = R(),
              q = ee[b],
              de = I(ee, ie) + q / 2,
              me = se - ie[h],
              ae = O ? 0 : me - de,
              ue = te => {
                ge(J), j.releasePointerCapture(te.pointerId);
              },
              re = O || V,
              le = _(),
              J = [
                Q(u, F, ue),
                Q(u, "selectstart", te => dn(te), { H: !1 }),
                Q(v, F, ue),
                re && Q(v, "pointermove", te => X(ae + (te[x] - se))),
                re &&
                  (() => {
                    const te = he(m);
                    le();
                    const ce = he(m),
                      fe = { x: ce.x - te.x, y: ce.y - te.y };
                    (St(fe.x) > 3 || St(fe.y) > 3) &&
                      (_(), Ve(m, te), w(fe), T(le));
                  })
              ];
            if ((j.setPointerCapture(L.pointerId), V)) X(ae);
            else if (!O) {
              const te = it($s);
              if (te) {
                const ce = te(X, ae, q, fe => {
                  fe ? le() : ne(J, le);
                });
                ne(J, ce), ne(g, U(ce, !0));
              }
            }
          }
        });
      };
    let B = !0;
    return U(ge, [
      Q(k, "pointermove pointerleave", s),
      Q(f, "pointerenter", () => {
        c(Zn, !0);
      }),
      Q(f, "pointerleave pointercancel", () => {
        c(Zn, !1);
      }),
      !d &&
        Q(f, "mousedown", () => {
          const F = ln();
          (zn(F, Me) || zn(F, Re) || F === document.body) && Nt(U(un, l), 25);
        }),
      Q(
        f,
        "wheel",
        F => {
          const { deltaX: x, deltaY: b, deltaMode: h } = F;
          B && h === 0 && lt(f) === i && w({ x, y: b }),
            (B = !1),
            c(to, !0),
            p(() => {
              (B = !0), c(to);
            }),
            dn(F);
        },
        { H: !1, I: !0 }
      ),
      Q(f, "pointerdown", U(Q, u, "click", Lo, { A: !0, I: !0, H: !1 }), {
        I: !0
      }),
      N(),
      S,
      C
    ]);
  },
  As = (n, t, o, s, r, c) => {
    let a,
      i,
      l,
      d,
      m,
      u = qe,
      _ = 0;
    const f = $ => $.pointerType === "mouse",
      [v, k] = Ke(),
      [p, S] = Ke(100),
      [T, C] = Ke(100),
      [w, N] = Ke(() => _),
      [B, F] = Ts(
        n,
        r,
        s,
        Ms(t, r, s, $ => f($) && j())
      ),
      { ht: x, Qt: b, wt: h } = r,
      { jt: y, Nt: E, qt: M, Bt: g, Ft: L } = B,
      O = ($, D) => {
        if ((N(), $)) y(eo);
        else {
          const A = U(y, eo, !0);
          _ > 0 && !D ? w(A) : A();
        }
      },
      j = () => {
        (l ? !a : !d) &&
          (O(!0),
          p(() => {
            O(!1);
          }));
      },
      K = $ => {
        y(_n, $, !0), y(_n, $, !1);
      },
      G = $ => {
        f($) && ((a = l), l && O(!0));
      },
      oe = [
        N,
        S,
        C,
        k,
        () => u(),
        Q(x, "pointerover", G, { A: !0 }),
        Q(x, "pointerenter", G),
        Q(x, "pointerleave", $ => {
          f($) && ((a = !1), l && O(!1));
        }),
        Q(x, "pointermove", $ => {
          f($) && i && j();
        }),
        Q(b, "scroll", $ => {
          v(() => {
            M(), j();
          }),
            c($),
            L();
        })
      ];
    return [
      () => U(ge, ne(oe, F())),
      ({ It: $, Dt: D, Zt: A, tn: H }) => {
        const { nn: V, sn: z, en: R, cn: I } = H || {},
          { Ct: P, dt: X } = A || {},
          { ct: se } = o,
          { k: ee } = Be(),
          { K: ie, rn: q } = s,
          [de, me] = $("showNativeOverlaidScrollbars"),
          [ae, ue] = $("scrollbars.theme"),
          [re, le] = $("scrollbars.visibility"),
          [J, te] = $("scrollbars.autoHide"),
          [ce, fe] = $("scrollbars.autoHideSuspend"),
          [tt] = $("scrollbars.autoHideDelay"),
          [dt, ut] = $("scrollbars.dragScroll"),
          [mt, Ie] = $("scrollbars.clickScroll"),
          [Pe, Ut] = $("overflow"),
          qt = X && !D,
          jt = q.x || q.y,
          Pt = V || z || I || P || D,
          ye = R || le || Ut,
          Gt = de && ee.x && ee.y,
          nt = (ot, Oe, ft) => {
            const rt =
              ot.includes(Je) && (re === He || (re === "auto" && Oe === Je));
            return y(ms, rt, ft), rt;
          };
        if (
          ((_ = tt),
          qt &&
            (ce && jt
              ? (K(!1),
                u(),
                T(() => {
                  u = Q(b, "scroll", U(K, !0), { A: !0 });
                }))
              : K(!0)),
          me && y(cs, Gt),
          ue && (y(m), y(ae, !0), (m = ae)),
          fe && !ce && K(!0),
          te &&
            ((i = J === "move"),
            (l = J === "leave"),
            (d = J === "never"),
            O(d, !0)),
          ut && y(vs, dt),
          Ie && y(_s, !!mt),
          ye)
        ) {
          const ot = nt(Pe.x, ie.x, !0),
            Oe = nt(Pe.y, ie.y, !1);
          y(fs, !(ot && Oe));
        }
        Pt &&
          (M(),
          E(),
          L(),
          I && g(),
          y(Qn, !q.x, !0),
          y(Qn, !q.y, !1),
          y(is, se && !h));
      },
      {},
      B
    ];
  },
  Ls = n => {
    const t = Be(),
      { U: o, R: s } = t,
      { elements: r } = o(),
      { padding: c, viewport: a, content: i } = r,
      l = Ct(n),
      d = l ? {} : n,
      { elements: m } = d,
      { padding: u, viewport: _, content: f } = m || {},
      v = l ? n : d.target,
      k = Bo(v),
      p = v.ownerDocument,
      S = p.documentElement,
      T = () => p.defaultView || _e,
      C = U(ks, [v]),
      w = U(qo, [v]),
      N = U(Ye, ""),
      B = U(C, N, a),
      F = U(w, N, i),
      x = q => {
        const de = Xe(q),
          me = Tt(q),
          ae = Ae(q, go),
          ue = Ae(q, ko);
        return (me.w - de.w > 0 && !Qe(ae)) || (me.h - de.h > 0 && !Qe(ue));
      },
      b = B(_),
      h = b === v,
      y = h && k,
      E = !h && F(f),
      M = !h && b === E,
      g = y ? S : b,
      L = y ? g : v,
      O = !h && w(N, c, u),
      j = !M && E,
      K = [j, g, O, L].map(q => Ct(q) && !lt(q) && q),
      G = q => q && io(K, q),
      oe = !G(g) && x(g) ? g : v,
      $ = y ? S : g,
      A = {
        vt: v,
        ht: L,
        ot: g,
        ln: O,
        bt: j,
        gt: $,
        Qt: y ? p : g,
        an: k ? S : oe,
        Kt: p,
        wt: k,
        Mt: l,
        nt: h,
        un: T,
        yt: q => Sn(g, Me, q),
        St: (q, de) => Dt(g, Me, q, de),
        Ot: () => Dt($, Me, os, !0)
      },
      { vt: H, ht: V, ln: z, ot: R, bt: I } = A,
      P = [
        () => {
          Ee(V, [Re, Yt]), Ee(H, Yt), k && Ee(S, [Yt, Re]);
        }
      ];
    let X = sn([I, R, z, V, H].find(q => q && !G(q)));
    const se = y ? H : I || R,
      ee = U(ge, P);
    return [
      A,
      () => {
        const q = T(),
          de = ln(),
          me = J => {
            pe(lt(J), sn(J)), Ze(J);
          },
          ae = J => Q(J, "focusin focusout focus blur", Lo, { I: !0, H: !1 }),
          ue = "tabindex",
          re = En(R, ue),
          le = ae(de);
        return (
          Te(V, Re, h ? "" : Qr),
          Te(z, fn, ""),
          Te(R, Me, ""),
          Te(I, Jn, ""),
          h || (Te(R, ue, re || "-1"), k && Te(S, Xn, "")),
          pe(se, X),
          pe(V, z),
          pe(z || V, !h && R),
          pe(R, I),
          ne(P, [
            le,
            () => {
              const J = ln(),
                te = G(R),
                ce = te && J === R ? H : J,
                fe = ae(ce);
              Ee(z, fn),
                Ee(I, Jn),
                Ee(R, Me),
                k && Ee(S, Xn),
                re ? Te(R, ue, re) : Ee(R, ue),
                G(I) && me(I),
                te && me(R),
                G(z) && me(z),
                un(ce),
                fe();
            }
          ]),
          s && !h && (Vn(R, Me, Ro), ne(P, U(Ee, R, Me))),
          un(!h && k && de === H && q.top === q ? R : de),
          le(),
          (X = 0),
          ee
        );
      },
      ee
    ];
  },
  Os =
    ({ bt: n }) =>
    ({ Zt: t, _n: o, Dt: s }) => {
      const { xt: r } = t || {},
        { $t: c } = o;
      n && (r || s) && at(n, { [Ft]: c && "100%" });
    },
  Fs = ({ ht: n, ln: t, ot: o, nt: s }, r) => {
    const [c, a] = ve({ i: qr, o: Un() }, U(Un, n, "padding", ""));
    return ({ It: i, Zt: l, _n: d, Dt: m }) => {
      let [u, _] = a(m);
      const { R: f } = Be(),
        { ft: v, Ht: k, Ct: p } = l || {},
        { ct: S } = d,
        [T, C] = i("paddingAbsolute");
      (v || _ || m || k) && ([u, _] = c(m));
      const N = !s && (C || p || _);
      if (N) {
        const B = !T || (!t && !f),
          F = u.r + u.l,
          x = u.t + u.b,
          b = {
            [po]: B && !S ? -F : 0,
            [ho]: B ? -x : 0,
            [vo]: B && S ? -F : 0,
            top: B ? -u.t : 0,
            right: B ? (S ? -u.r : "auto") : 0,
            left: B ? (S ? "auto" : -u.l) : 0,
            [Ot]: B && `calc(100% + ${F}px)`
          },
          h = {
            [uo]: B ? u.t : 0,
            [mo]: B ? u.r : 0,
            [_o]: B ? u.b : 0,
            [fo]: B ? u.l : 0
          };
        at(t || o, b),
          at(o, h),
          W(r, { ln: u, dn: !B, rt: t ? h : W({}, b, h) });
      }
      return { fn: N };
    };
  },
  Hs = (n, t) => {
    const o = Be(),
      { ht: s, ln: r, ot: c, nt: a, Qt: i, gt: l, wt: d, St: m, un: u } = n,
      { R: _ } = o,
      f = d && a,
      v = U(ao, 0),
      k = {
        display: () => !1,
        direction: D => D !== "ltr",
        flexDirection: D => D.endsWith("-reverse"),
        writingMode: D => D !== "horizontal-tb"
      },
      p = be(k),
      S = { i: wo, o: { w: 0, h: 0 } },
      T = { i: yt, o: {} },
      C = D => {
        m(Ho, !f && D);
      },
      w = D => {
        if (
          !p.some(se => {
            const ee = D[se];
            return ee && k[se](ee);
          })
        )
          return { D: { x: 0, y: 0 }, M: { x: 1, y: 1 } };
        C(!0);
        const H = he(l),
          V = m(rs, !0),
          z = Q(
            i,
            Je,
            se => {
              const ee = he(l);
              se.isTrusted && ee.x === H.x && ee.y === H.y && Ao(se);
            },
            { I: !0, A: !0 }
          );
        Ve(l, { x: 0, y: 0 }), V();
        const R = he(l),
          I = Tt(l);
        Ve(l, { x: I.w, y: I.h });
        const P = he(l);
        Ve(l, { x: P.x - R.x < 1 && -I.w, y: P.y - R.y < 1 && -I.h });
        const X = he(l);
        return Ve(l, H), hn(() => z()), { D: R, M: X };
      },
      N = (D, A) => {
        const H = _e.devicePixelRatio % 1 !== 0 ? 1 : 0,
          V = { w: v(D.w - A.w), h: v(D.h - A.h) };
        return { w: V.w > H ? V.w : 0, h: V.h > H ? V.h : 0 };
      },
      [B, F] = ve(S, U(xn, c)),
      [x, b] = ve(S, U(Tt, c)),
      [h, y] = ve(S),
      [E] = ve(T),
      [M, g] = ve(S),
      [L] = ve(T),
      [O] = ve({ i: (D, A) => Ht(D, A, p), o: {} }, () =>
        Xr(c) ? Ae(c, p) : {}
      ),
      [j, K] = ve({ i: (D, A) => yt(D.D, A.D) && yt(D.M, A.M), o: Oo() }),
      G = it(Wo),
      oe = (D, A) => `${A ? es : ts}${Ur(D)}`,
      $ = D => {
        const A = V => [He, Ue, Je].map(z => oe(z, V)),
          H = A(!0).concat(A()).join(" ");
        m(H),
          m(
            be(D)
              .map(V => oe(D[V], V === "x"))
              .join(" "),
            !0
          );
      };
    return ({ It: D, Zt: A, _n: H, Dt: V }, { fn: z }) => {
      const { ft: R, Ht: I, Ct: P, dt: X, zt: se } = A || {},
        ee = G && G.tt(n, t, H, o, D),
        { it: ie, ut: q, _t: de } = ee || {},
        [me, ae] = xs(D, o),
        [ue, re] = D("overflow"),
        le = Qe(ue.x),
        J = Qe(ue.y),
        te = !0;
      let ce = F(V),
        fe = b(V),
        tt = y(V),
        dt = g(V);
      ae && _ && m(Ro, !me);
      {
        Sn(s, Re, Vt) && C(!0);
        const [Ln] = q ? q() : [],
          [_t] = (ce = B(V)),
          [vt] = (fe = x(V)),
          pt = To(c),
          ht = f && Yr(u()),
          wr = { w: v(vt.w + _t.w), h: v(vt.h + _t.h) },
          On = {
            w: v((ht ? ht.w : pt.w + v(pt.w - vt.w)) + _t.w),
            h: v((ht ? ht.h : pt.h + v(pt.h - vt.h)) + _t.h)
          };
        Ln && Ln(), (dt = M(On)), (tt = h(N(wr, On), V));
      }
      const [ut, mt] = dt,
        [Ie, Pe] = tt,
        [Ut, qt] = fe,
        [jt, Pt] = ce,
        [ye, Gt] = E({ x: Ie.w > 0, y: Ie.h > 0 }),
        nt =
          (le && J && (ye.x || ye.y)) ||
          (le && ye.x && !ye.y) ||
          (J && ye.y && !ye.x),
        ot = z || P || se || Pt || qt || mt || Pe || re || ae || te,
        Oe = Bs(ye, ue),
        [ft, rt] = L(Oe.K),
        [pr, hr] = O(V),
        An = P || X || hr || Gt || V,
        [gr, kr] = An ? j(w(pr), V) : K();
      return (
        ot && (rt && $(Oe.K), de && ie && at(c, de(Oe, H, ie(Oe, Ut, jt)))),
        C(!1),
        Dt(s, Re, Vt, nt),
        Dt(r, fn, Vt, nt),
        W(t, {
          K: ft,
          Vt: { x: ut.w, y: ut.h },
          Rt: { x: Ie.w, y: Ie.h },
          rn: ye,
          Lt: Jr(gr, Ie)
        }),
        { en: rt, nn: mt, sn: Pe, cn: kr || Pe, vn: An }
      );
    };
  },
  Rs = n => {
    const [t, o, s] = Ls(n),
      r = {
        ln: { t: 0, r: 0, b: 0, l: 0 },
        dn: !1,
        rt: { [po]: 0, [ho]: 0, [vo]: 0, [uo]: 0, [mo]: 0, [_o]: 0, [fo]: 0 },
        Vt: { x: 0, y: 0 },
        Rt: { x: 0, y: 0 },
        K: { x: Ue, y: Ue },
        rn: { x: !1, y: !1 },
        Lt: Oo()
      },
      { vt: c, gt: a, nt: i, Ot: l } = t,
      { R: d, k: m } = Be(),
      u = !d && (m.x || m.y),
      _ = [Os(t), Fs(t, r), Hs(t, r)];
    return [
      o,
      f => {
        const v = {},
          p = u && he(a),
          S = p && l();
        return (
          Y(_, T => {
            W(v, T(f, v) || {});
          }),
          Ve(a, p),
          S && S(),
          !i && Ve(c, 0),
          v
        );
      },
      r,
      t,
      s
    ];
  },
  zs = (n, t, o, s, r) => {
    let c = !1;
    const a = Yn(t, {}),
      [i, l, d, m, u] = Rs(n),
      [_, f, v] = Ds(m, d, a, w => {
        C({}, w);
      }),
      [k, p, , S] = As(n, t, v, d, m, r),
      T = w => be(w).some(N => !!w[N]),
      C = (w, N) => {
        if (o()) return !1;
        const { pn: B, Dt: F, At: x, hn: b } = w,
          h = B || {},
          y = !!F || !c,
          E = { It: Yn(t, h, y), pn: h, Dt: y };
        if (b) return p(E), !1;
        const M = N || f(W({}, E, { At: x })),
          g = l(W({}, E, { _n: v, Zt: M }));
        p(W({}, E, { Zt: M, tn: g }));
        const L = T(M),
          O = T(g),
          j = L || O || !yn(h) || y;
        return (c = !0), j && s(w, { Zt: M, tn: g }), j;
      };
    return [
      () => {
        const { an: w, gt: N, Ot: B } = m,
          F = he(w),
          x = [_(), i(), k()],
          b = B();
        return Ve(N, F), b(), U(ge, x);
      },
      C,
      () => ({ gn: v, bn: d }),
      { wn: m, yn: S },
      u
    ];
  },
  xe = (n, t, o) => {
    const { N: s } = Be(),
      r = Ct(n),
      c = r ? n : n.target,
      a = jo(c);
    if (t && !a) {
      let i = !1;
      const l = [],
        d = {},
        m = h => {
          const y = yo(h),
            E = it(Ss);
          return E ? E(y, !0) : y;
        },
        u = W({}, s(), m(t)),
        [_, f, v] = mn(),
        [k, p, S] = mn(o),
        T = (h, y) => {
          S(h, y), v(h, y);
        },
        [C, w, N, B, F] = zs(
          n,
          u,
          () => i,
          ({ pn: h, Dt: y }, { Zt: E, tn: M }) => {
            const { ft: g, Ct: L, xt: O, Ht: j, Et: K, dt: G } = E,
              { nn: oe, sn: $, en: D, cn: A } = M;
            T("updated", [
              b,
              {
                updateHints: {
                  sizeChanged: !!g,
                  directionChanged: !!L,
                  heightIntrinsicChanged: !!O,
                  overflowEdgeChanged: !!oe,
                  overflowAmountChanged: !!$,
                  overflowStyleChanged: !!D,
                  scrollCoordinatesChanged: !!A,
                  contentMutation: !!j,
                  hostMutation: !!K,
                  appear: !!G
                },
                changedOptions: h || {},
                force: !!y
              }
            ]);
          },
          h => T("scroll", [b, h])
        ),
        x = h => {
          ys(c), ge(l), (i = !0), T("destroyed", [b, h]), f(), p();
        },
        b = {
          options(h, y) {
            if (h) {
              const E = y ? s() : {},
                M = Fo(u, W(E, m(h)));
              yn(M) || (W(u, M), w({ pn: M }));
            }
            return W({}, u);
          },
          on: k,
          off: (h, y) => {
            h && y && p(h, y);
          },
          state() {
            const { gn: h, bn: y } = N(),
              { ct: E } = h,
              { Vt: M, Rt: g, K: L, rn: O, ln: j, dn: K, Lt: G } = y;
            return W(
              {},
              {
                overflowEdge: M,
                overflowAmount: g,
                overflowStyle: L,
                hasOverflow: O,
                scrollCoordinates: { start: G.D, end: G.M },
                padding: j,
                paddingAbsolute: K,
                directionRTL: E,
                destroyed: i
              }
            );
          },
          elements() {
            const { vt: h, ht: y, ln: E, ot: M, bt: g, gt: L, Qt: O } = B.wn,
              { Xt: j, Gt: K } = B.yn,
              G = $ => {
                const { Pt: D, Ut: A, Tt: H } = $;
                return { scrollbar: H, track: A, handle: D };
              },
              oe = $ => {
                const { Yt: D, Wt: A } = $,
                  H = G(D[0]);
                return W({}, H, {
                  clone: () => {
                    const V = G(A());
                    return w({ hn: !0 }), V;
                  }
                });
              };
            return W(
              {},
              {
                target: h,
                host: y,
                padding: E || M,
                viewport: M,
                content: g || M,
                scrollOffsetElement: L,
                scrollEventElement: O,
                scrollbarHorizontal: oe(j),
                scrollbarVertical: oe(K)
              }
            );
          },
          update: h => w({ Dt: h, At: !0 }),
          destroy: U(x, !1),
          plugin: h => d[be(h)[0]]
        };
      return (
        ne(l, [F]),
        bs(c, b),
        Ko(Po, xe, [b, _, d]),
        ws(B.wn.wt, !r && n.cancel)
          ? (x(!0), b)
          : (ne(l, C()), T("initialized", [b]), b.update(), b)
      );
    }
    return a;
  };
xe.plugin = n => {
  const t = Ne(n),
    o = t ? n : [n],
    s = o.map(r => Ko(r, xe)[0]);
  return Vs(o), t ? s : s[0];
};
xe.valid = n => {
  const t = n && n.elements,
    o = we(t) && t();
  return $t(o) && !!jo(o.target);
};
xe.env = () => {
  const { T: n, k: t, R: o, V: s, B: r, F: c, U: a, P: i, N: l, q: d } = Be();
  return W(
    {},
    {
      scrollbarsSize: n,
      scrollbarsOverlaid: t,
      scrollbarsHiding: o,
      scrollTimeline: s,
      staticDefaultInitialization: r,
      staticDefaultOptions: c,
      getDefaultInitialization: a,
      setDefaultInitialization: i,
      getDefaultOptions: l,
      setDefaultOptions: d
    }
  );
};
xe.nonce = hs;
function Is() {
  let n;
  const t = e.ref(null),
    o = Math.floor(Math.random() * 2 ** 32),
    s = e.ref(!1),
    r = e.ref([]),
    c = () => r.value,
    a = () => n.getSelection(),
    i = () => r.value.length,
    l = () => n.clearSelection(!0),
    d = e.ref(),
    m = e.ref(null),
    u = e.ref(null),
    _ = e.ref(null),
    f = e.ref(null);
  function v() {
    (n = new Vr({
      area: t.value,
      keyboardDrag: !1,
      selectedClass: "vf-explorer-selected",
      selectorClass: "vf-explorer-selector"
    })),
      n.subscribe("DS:start:pre", ({ items: N, event: B, isDragging: F }) => {
        if (F) n.Interaction._reset(B);
        else {
          s.value = !1;
          const x = t.value.offsetWidth - B.offsetX,
            b = t.value.offsetHeight - B.offsetY;
          x < 15 && b < 15 && n.Interaction._reset(B),
            B.target.classList.contains("os-scrollbar-handle") &&
              n.Interaction._reset(B);
        }
      }),
      document.addEventListener("dragleave", N => {
        !N.buttons && s.value && (s.value = !1);
      });
  }
  const k = () =>
      e.nextTick(() => {
        n.addSelection(n.getSelectables()), p();
      }),
    p = () => {
      (r.value = n.getSelection().map(N => JSON.parse(N.dataset.item))),
        d.value(r.value);
    },
    S = () =>
      e.nextTick(() => {
        const N = c().map(B => B.path);
        l(),
          n.setSettings({
            selectables: document.getElementsByClassName("vf-item-" + o)
          }),
          n.addSelection(
            n
              .getSelectables()
              .filter(B => N.includes(JSON.parse(B.dataset.item).path))
          ),
          p(),
          C();
      }),
    T = N => {
      (d.value = N),
        n.subscribe("DS:end", ({ items: B, event: F, isDragging: x }) => {
          (r.value = B.map(b => JSON.parse(b.dataset.item))),
            N(B.map(b => JSON.parse(b.dataset.item)));
        });
    },
    C = () => {
      m.value &&
        (t.value.getBoundingClientRect().height < t.value.scrollHeight
          ? ((u.value.style.height = t.value.scrollHeight + "px"),
            (u.value.style.display = "block"))
          : ((u.value.style.height = "100%"),
            (u.value.style.display = "none")));
    },
    w = N => {
      if (!m.value) return;
      const { scrollOffsetElement: B } = m.value.elements();
      B.scrollTo({ top: t.value.scrollTop, left: 0 });
    };
  return (
    e.onMounted(() => {
      xe(
        _.value,
        {
          scrollbars: { theme: "vf-theme-dark dark:vf-theme-light" },
          plugins: { OverlayScrollbars: xe }
        },
        {
          initialized: N => {
            m.value = N;
          },
          scroll: (N, B) => {
            const { scrollOffsetElement: F } = N.elements();
            t.value.scrollTo({ top: F.scrollTop, left: 0 });
          }
        }
      ),
        v(),
        C(),
        (f.value = new ResizeObserver(C)),
        f.value.observe(t.value),
        t.value.addEventListener("scroll", w),
        n.subscribe("DS:scroll", ({ isDragging: N }) => N || w());
    }),
    e.onUnmounted(() => {
      n && n.stop(), f.value && f.value.disconnect();
    }),
    e.onUpdated(() => {
      n && n.Area.reset();
    }),
    {
      area: t,
      explorerId: o,
      isDraggingRef: s,
      scrollBar: u,
      scrollBarContainer: _,
      getSelected: c,
      getSelection: a,
      selectAll: k,
      clearSelection: l,
      refreshSelection: S,
      getCount: i,
      onSelect: T
    }
  );
}
function Us(n, t) {
  const o = e.ref(n),
    s = e.ref(t),
    r = e.ref([]),
    c = e.ref([]),
    a = e.ref([]),
    i = e.ref(!1),
    l = e.ref(5);
  let d = !1,
    m = !1;
  const u = e.reactive({ adapter: o, storages: [], dirname: s, files: [] });
  function _() {
    let T = [],
      C = [],
      w = s.value ?? o.value + "://";
    w.length === 0 && (r.value = []),
      w
        .replace(o.value + "://", "")
        .split("/")
        .forEach(function (F) {
          T.push(F),
            T.join("/") !== "" &&
              C.push({
                basename: F,
                name: F,
                path: o.value + "://" + T.join("/"),
                type: "dir"
              });
        }),
      (c.value = C);
    const [N, B] = v(C, l.value);
    (a.value = B), (r.value = N);
  }
  function f(T) {
    (l.value = T), _();
  }
  function v(T, C) {
    return T.length > C ? [T.slice(-C), T.slice(0, -C)] : [T, []];
  }
  function k(T = null) {
    i.value = T ?? !i.value;
  }
  function p() {
    return r.value && r.value.length && !m;
  }
  const S = e.computed(() => {
    var T;
    return (
      ((T = r.value[r.value.length - 2]) == null ? void 0 : T.path) ??
      o.value + "://"
    );
  });
  return (
    e.onMounted(() => {}),
    e.watch(s, _),
    e.onMounted(_),
    {
      adapter: o,
      path: s,
      loading: d,
      searchMode: m,
      data: u,
      breadcrumbs: r,
      breadcrumbItems: c,
      limitBreadcrumbItems: f,
      hiddenBreadcrumbs: a,
      showHiddenBreadcrumbs: i,
      toggleHiddenBreadcrumbs: k,
      isGoUpAvailable: p,
      parentFolderPath: S
    }
  );
}
const qs = (n, t) => {
    const o = Dr(n.id),
      s = Er(),
      r = o.getStore("metricUnits", !1),
      c = Fr(o, n.theme),
      a = t.i18n,
      i = n.locale ?? t.locale,
      l = o.getStore("adapter"),
      d = _ => (Array.isArray(_) ? _ : Ar),
      m = o.getStore("persist-path", n.persist),
      u = m ? o.getStore("path", n.path) : n.path;
    return e.reactive({
      version: Lr,
      root: null,
      debug: n.debug,
      emitter: s,
      storage: o,
      i18n: Mr(o, i, s, a),
      modal: Hr(),
      dragSelect: e.computed(() => Is()),
      requester: Cr(n.request),
      features: d(n.features),
      view: o.getStore("viewport", "grid"),
      fullScreen: o.getStore("full-screen", n.fullScreen),
      showTreeView: o.getStore("show-tree-view", n.showTreeView),
      pinnedFolders: o.getStore("pinned-folders", n.pinnedFolders),
      treeViewData: [],
      selectButton: n.selectButton,
      maxFileSize: n.maxFileSize,
      theme: c,
      metricUnits: r,
      filesize: r ? lo : so,
      compactListView: o.getStore("compact-list-view", !0),
      persist: m,
      showThumbnails: o.getStore("show-thumbnails", n.showThumbnails),
      fs: Us(l, u)
    });
  },
  js = e.createElementVNode(
    "div",
    { class: "vuefinder__modal-layout__overlay" },
    null,
    -1
  ),
  Ps = { class: "vuefinder__modal-layout__container" },
  Gs = { class: "vuefinder__modal-layout__content" },
  Ks = { class: "vuefinder__modal-layout__footer" },
  $e = {
    __name: "ModalLayout",
    setup(n) {
      const t = e.ref(null),
        o = e.inject("ServiceContainer");
      return (
        e.onMounted(() => {
          const s = document.querySelector(".v-f-modal input");
          s && s.focus(),
            e.nextTick(() => {
              if (
                document.querySelector(".v-f-modal input") &&
                window.innerWidth < 768
              ) {
                const r = t.value.getBoundingClientRect().bottom + 16;
                window.scrollTo({ top: r, left: 0, behavior: "smooth" });
              }
            });
        }),
        (s, r) => (
          e.openBlock(),
          e.createElementBlock(
            "div",
            {
              class: "vuefinder__modal-layout",
              "aria-labelledby": "modal-title",
              role: "dialog",
              "aria-modal": "true",
              onKeyup:
                r[1] ||
                (r[1] = e.withKeys(c => e.unref(o).modal.close(), ["esc"])),
              tabindex: "0"
            },
            [
              js,
              e.createElementVNode("div", Ps, [
                e.createElementVNode(
                  "div",
                  {
                    class: "vuefinder__modal-layout__wrapper",
                    onMousedown:
                      r[0] ||
                      (r[0] = e.withModifiers(
                        c => e.unref(o).modal.close(),
                        ["self"]
                      ))
                  },
                  [
                    e.createElementVNode(
                      "div",
                      {
                        ref_key: "modalBody",
                        ref: t,
                        class: "vuefinder__modal-layout__body"
                      },
                      [
                        e.createElementVNode("div", Gs, [
                          e.renderSlot(s.$slots, "default")
                        ]),
                        e.createElementVNode("div", Ks, [
                          e.renderSlot(s.$slots, "buttons")
                        ])
                      ],
                      512
                    )
                  ],
                  32
                )
              ])
            ],
            32
          )
        )
      );
    }
  },
  Ws = (n, t) => {
    const o = n.__vccOpts || n;
    for (const [s, r] of t) o[s] = r;
    return o;
  },
  Ys = {
    props: { on: { type: String, required: !0 } },
    setup(n, { emit: t, slots: o }) {
      const s = e.inject("ServiceContainer"),
        r = e.ref(!1),
        { t: c } = s.i18n;
      let a = null;
      const i = () => {
        clearTimeout(a),
          (r.value = !0),
          (a = setTimeout(() => {
            r.value = !1;
          }, 2e3));
      };
      return (
        e.onMounted(() => {
          s.emitter.on(n.on, i);
        }),
        e.onUnmounted(() => {
          clearTimeout(a);
        }),
        { shown: r, t: c }
      );
    }
  },
  Xs = { key: 1 };
function Js(n, t, o, s, r, c) {
  return (
    e.openBlock(),
    e.createElementBlock(
      "div",
      {
        class: e.normalizeClass([
          "vuefinder__action-message",
          { "vuefinder__action-message--hidden": !s.shown }
        ])
      },
      [
        n.$slots.default
          ? e.renderSlot(n.$slots, "default", { key: 0 })
          : (e.openBlock(),
            e.createElementBlock(
              "span",
              Xs,
              e.toDisplayString(s.t("Saved.")),
              1
            ))
      ],
      2
    )
  );
}
const Ge = Ws(Ys, [["render", Js]]),
  Zs = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "1.5",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    viewBox: "0 0 24 24"
  },
  Qs = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87q.11.06.22.127c.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a8 8 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a7 7 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a7 7 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a7 7 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124q.108-.066.22-.128c.332-.183.582-.495.644-.869z"
    },
    null,
    -1
  ),
  el = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
    },
    null,
    -1
  ),
  tl = [Qs, el];
function nl(n, t) {
  return e.openBlock(), e.createElementBlock("svg", Zs, [...tl]);
}
const ol = { render: nl },
  rl = { class: "vuefinder__modal-header" },
  sl = { class: "vuefinder__modal-header__icon-container" },
  ll = { class: "vuefinder__modal-header__title", id: "modal-title" },
  Le = {
    __name: "ModalHeader",
    props: {
      title: { type: String, required: !0 },
      icon: { type: Object, required: !0 }
    },
    setup(n) {
      return (t, o) => (
        e.openBlock(),
        e.createElementBlock("div", rl, [
          e.createElementVNode("div", sl, [
            (e.openBlock(),
            e.createBlock(e.resolveDynamicComponent(n.icon), {
              class: "vuefinder__modal-header__icon"
            }))
          ]),
          e.createElementVNode("h3", ll, e.toDisplayString(n.title), 1)
        ])
      );
    }
  },
  al = { class: "vuefinder__about-modal__content" },
  cl = { class: "vuefinder__about-modal__main" },
  il = { class: "vuefinder__about-modal__tabs", "aria-label": "Tabs" },
  dl = ["onClick", "aria-current"],
  ul = { key: 0, class: "vuefinder__about-modal__tab-content" },
  ml = { class: "vuefinder__about-modal__description" },
  fl = {
    href: "https://vuefinder.ozdemir.be",
    class: "vuefinder__about-modal__link",
    target: "_blank"
  },
  _l = {
    href: "https://github.com/n1crack/vuefinder",
    class: "vuefinder__about-modal__link",
    target: "_blank"
  },
  vl = { key: 1, class: "vuefinder__about-modal__tab-content" },
  pl = { class: "vuefinder__about-modal__description" },
  hl = { class: "vuefinder__about-modal__settings" },
  gl = { class: "vuefinder__about-modal__setting flex" },
  kl = { class: "vuefinder__about-modal__setting-input" },
  wl = { class: "vuefinder__about-modal__setting-label" },
  bl = { for: "metric_unit", class: "vuefinder__about-modal__label" },
  yl = { class: "vuefinder__about-modal__setting flex" },
  El = { class: "vuefinder__about-modal__setting-input" },
  Vl = { class: "vuefinder__about-modal__setting-label" },
  Sl = { for: "large_icons", class: "vuefinder__about-modal__label" },
  Nl = { class: "vuefinder__about-modal__setting flex" },
  xl = { class: "vuefinder__about-modal__setting-input" },
  Bl = { class: "vuefinder__about-modal__setting-label" },
  $l = { for: "persist_path", class: "vuefinder__about-modal__label" },
  Cl = { class: "vuefinder__about-modal__setting flex" },
  Dl = { class: "vuefinder__about-modal__setting-input" },
  Tl = { class: "vuefinder__about-modal__setting-label" },
  Ml = { for: "show_thumbnails", class: "vuefinder__about-modal__label" },
  Al = { class: "vuefinder__about-modal__setting" },
  Ll = { class: "vuefinder__about-modal__setting-input" },
  Ol = { for: "theme", class: "vuefinder__about-modal__label" },
  Fl = { class: "vuefinder__about-modal__setting-label" },
  Hl = ["label"],
  Rl = ["value"],
  zl = { key: 0, class: "vuefinder__about-modal__setting" },
  Il = { class: "vuefinder__about-modal__setting-input" },
  Ul = { for: "language", class: "vuefinder__about-modal__label" },
  ql = { class: "vuefinder__about-modal__setting-label" },
  jl = ["label"],
  Pl = ["value"],
  Gl = { key: 2, class: "vuefinder__about-modal__tab-content" },
  Kl = { class: "vuefinder__about-modal__shortcuts" },
  Wl = { class: "vuefinder__about-modal__shortcut" },
  Yl = e.createElementVNode("kbd", null, "F2", -1),
  Xl = { class: "vuefinder__about-modal__shortcut" },
  Jl = e.createElementVNode("kbd", null, "F5", -1),
  Zl = { class: "vuefinder__about-modal__shortcut" },
  Ql = e.createElementVNode("kbd", null, "Del", -1),
  ea = { class: "vuefinder__about-modal__shortcut" },
  ta = e.createElementVNode(
    "div",
    null,
    [e.createElementVNode("kbd", null, "Esc")],
    -1
  ),
  na = { class: "vuefinder__about-modal__shortcut" },
  oa = e.createElementVNode(
    "div",
    null,
    [
      e.createElementVNode("kbd", null, "Ctrl"),
      e.createTextVNode(" + "),
      e.createElementVNode("kbd", null, "A")
    ],
    -1
  ),
  ra = { class: "vuefinder__about-modal__shortcut" },
  sa = e.createElementVNode(
    "div",
    null,
    [
      e.createElementVNode("kbd", null, "Ctrl"),
      e.createTextVNode(" + "),
      e.createElementVNode("kbd", null, "F")
    ],
    -1
  ),
  la = { class: "vuefinder__about-modal__shortcut" },
  aa = e.createElementVNode(
    "div",
    null,
    [
      e.createElementVNode("kbd", null, "Ctrl"),
      e.createTextVNode(" + "),
      e.createElementVNode("kbd", null, "E")
    ],
    -1
  ),
  ca = { class: "vuefinder__about-modal__shortcut" },
  ia = e.createElementVNode(
    "div",
    null,
    [
      e.createElementVNode("kbd", null, "Ctrl"),
      e.createTextVNode(" + "),
      e.createElementVNode("kbd", null, ",")
    ],
    -1
  ),
  da = { class: "vuefinder__about-modal__shortcut" },
  ua = e.createElementVNode(
    "div",
    null,
    [
      e.createElementVNode("kbd", null, "Ctrl"),
      e.createTextVNode(" + "),
      e.createElementVNode("kbd", null, "Enter")
    ],
    -1
  ),
  ma = { key: 3, class: "vuefinder__about-modal__tab-content" },
  fa = { class: "vuefinder__about-modal__description" },
  Xo = {
    __name: "ModalAbout",
    setup(n) {
      const t = e.inject("ServiceContainer"),
        { setStore: o, clearStore: s } = t.storage,
        { t: r } = t.i18n,
        c = {
          ABOUT: "about",
          SETTINGS: "settings",
          SHORTCUTS: "shortcuts",
          RESET: "reset"
        },
        a = e.computed(() => [
          { name: r("About"), key: c.ABOUT },
          { name: r("Settings"), key: c.SETTINGS },
          { name: r("Shortcuts"), key: c.SHORTCUTS },
          { name: r("Reset"), key: c.RESET }
        ]),
        i = e.ref("about"),
        l = async () => {
          s(), location.reload();
        },
        d = T => {
          t.theme.set(T), t.emitter.emit("vf-theme-saved");
        },
        m = () => {
          (t.metricUnits = !t.metricUnits),
            (t.filesize = t.metricUnits ? lo : so),
            o("metricUnits", t.metricUnits),
            t.emitter.emit("vf-metric-units-saved");
        },
        u = () => {
          (t.compactListView = !t.compactListView),
            o("compactListView", t.compactListView),
            t.emitter.emit("vf-compact-view-saved");
        },
        _ = () => {
          (t.showThumbnails = !t.showThumbnails),
            o("show-thumbnails", t.showThumbnails),
            t.emitter.emit("vf-show-thumbnails-saved");
        },
        f = () => {
          (t.persist = !t.persist),
            o("persist-path", t.persist),
            t.emitter.emit("vf-persist-path-saved");
        },
        { i18n: v } = e.inject("VueFinderOptions"),
        p = Object.fromEntries(
          Object.entries({
            en: "English",
            fr: "French (Français)",
            de: "German (Deutsch)",
            fa: "Persian (فارسی)",
            he: "Hebrew (עִברִית)",
            hi: "Hindi (हिंदी)",
            ru: "Russian (Pусский)",
            sv: "Swedish (Svenska)",
            tr: "Turkish (Türkçe)",
            zhCN: "Simplified Chinese (简体中文)",
            zhTW: "Traditional Chinese (繁體中文)"
          }).filter(([T]) => Object.keys(v).includes(T))
        ),
        S = e.computed(() => ({
          system: r("System"),
          light: r("Light"),
          dark: r("Dark")
        }));
      return (T, C) => (
        e.openBlock(),
        e.createBlock($e, null, {
          buttons: e.withCtx(() => [
            e.createElementVNode(
              "button",
              {
                type: "button",
                onClick: C[7] || (C[7] = w => e.unref(t).modal.close()),
                class: "vf-btn vf-btn-secondary"
              },
              e.toDisplayString(e.unref(r)("Close")),
              1
            )
          ]),
          default: e.withCtx(() => [
            e.createElementVNode("div", al, [
              e.createVNode(
                Le,
                { icon: e.unref(ol), title: "Vuefinder " + e.unref(t).version },
                null,
                8,
                ["icon", "title"]
              ),
              e.createElementVNode("div", cl, [
                e.createElementVNode("div", null, [
                  e.createElementVNode("div", null, [
                    e.createElementVNode("nav", il, [
                      (e.openBlock(!0),
                      e.createElementBlock(
                        e.Fragment,
                        null,
                        e.renderList(
                          a.value,
                          w => (
                            e.openBlock(),
                            e.createElementBlock(
                              "button",
                              {
                                key: w.name,
                                onClick: N => (i.value = w.key),
                                class: e.normalizeClass([
                                  w.key === i.value
                                    ? "vuefinder__about-modal__tab--active"
                                    : "vuefinder__about-modal__tab--inactive",
                                  "vuefinder__about-modal__tab"
                                ]),
                                "aria-current": w.current ? "page" : void 0
                              },
                              e.toDisplayString(w.name),
                              11,
                              dl
                            )
                          )
                        ),
                        128
                      ))
                    ])
                  ])
                ]),
                i.value === c.ABOUT
                  ? (e.openBlock(),
                    e.createElementBlock("div", ul, [
                      e.createElementVNode(
                        "div",
                        ml,
                        e.toDisplayString(
                          e.unref(r)(
                            "Vuefinder is a simple, lightweight, and fast file manager library for Vue.js applications"
                          )
                        ),
                        1
                      ),
                      e.createElementVNode(
                        "a",
                        fl,
                        e.toDisplayString(e.unref(r)("Project home")),
                        1
                      ),
                      e.createElementVNode(
                        "a",
                        _l,
                        e.toDisplayString(e.unref(r)("Follow on GitHub")),
                        1
                      )
                    ]))
                  : e.createCommentVNode("", !0),
                i.value === c.SETTINGS
                  ? (e.openBlock(),
                    e.createElementBlock("div", vl, [
                      e.createElementVNode(
                        "div",
                        pl,
                        e.toDisplayString(
                          e.unref(r)(
                            "Customize your experience with the following settings"
                          )
                        ),
                        1
                      ),
                      e.createElementVNode("div", hl, [
                        e.createElementVNode("fieldset", null, [
                          e.createElementVNode("div", gl, [
                            e.createElementVNode("div", kl, [
                              e.withDirectives(
                                e.createElementVNode(
                                  "input",
                                  {
                                    id: "metric_unit",
                                    name: "metric_unit",
                                    type: "checkbox",
                                    "onUpdate:modelValue":
                                      C[0] ||
                                      (C[0] = w =>
                                        (e.unref(t).metricUnits = w)),
                                    onClick: m,
                                    class: "vuefinder__about-modal__checkbox"
                                  },
                                  null,
                                  512
                                ),
                                [[e.vModelCheckbox, e.unref(t).metricUnits]]
                              )
                            ]),
                            e.createElementVNode("div", wl, [
                              e.createElementVNode("label", bl, [
                                e.createTextVNode(
                                  e.toDisplayString(
                                    e.unref(r)("Use Metric Units")
                                  ) + " ",
                                  1
                                ),
                                e.createVNode(
                                  Ge,
                                  {
                                    class: "ms-3",
                                    on: "vf-metric-units-saved"
                                  },
                                  {
                                    default: e.withCtx(() => [
                                      e.createTextVNode(
                                        e.toDisplayString(e.unref(r)("Saved.")),
                                        1
                                      )
                                    ]),
                                    _: 1
                                  }
                                )
                              ])
                            ])
                          ]),
                          e.createElementVNode("div", yl, [
                            e.createElementVNode("div", El, [
                              e.withDirectives(
                                e.createElementVNode(
                                  "input",
                                  {
                                    id: "large_icons",
                                    name: "large_icons",
                                    type: "checkbox",
                                    "onUpdate:modelValue":
                                      C[1] ||
                                      (C[1] = w =>
                                        (e.unref(t).compactListView = w)),
                                    onClick: u,
                                    class: "vuefinder__about-modal__checkbox"
                                  },
                                  null,
                                  512
                                ),
                                [[e.vModelCheckbox, e.unref(t).compactListView]]
                              )
                            ]),
                            e.createElementVNode("div", Vl, [
                              e.createElementVNode("label", Sl, [
                                e.createTextVNode(
                                  e.toDisplayString(
                                    e.unref(r)("Compact list view")
                                  ) + " ",
                                  1
                                ),
                                e.createVNode(
                                  Ge,
                                  {
                                    class: "ms-3",
                                    on: "vf-compact-view-saved"
                                  },
                                  {
                                    default: e.withCtx(() => [
                                      e.createTextVNode(
                                        e.toDisplayString(e.unref(r)("Saved.")),
                                        1
                                      )
                                    ]),
                                    _: 1
                                  }
                                )
                              ])
                            ])
                          ]),
                          e.createElementVNode("div", Nl, [
                            e.createElementVNode("div", xl, [
                              e.withDirectives(
                                e.createElementVNode(
                                  "input",
                                  {
                                    id: "persist_path",
                                    name: "persist_path",
                                    type: "checkbox",
                                    "onUpdate:modelValue":
                                      C[2] ||
                                      (C[2] = w => (e.unref(t).persist = w)),
                                    onClick: f,
                                    class: "vuefinder__about-modal__checkbox"
                                  },
                                  null,
                                  512
                                ),
                                [[e.vModelCheckbox, e.unref(t).persist]]
                              )
                            ]),
                            e.createElementVNode("div", Bl, [
                              e.createElementVNode("label", $l, [
                                e.createTextVNode(
                                  e.toDisplayString(
                                    e.unref(r)("Persist path on reload")
                                  ) + " ",
                                  1
                                ),
                                e.createVNode(
                                  Ge,
                                  {
                                    class: "ms-3",
                                    on: "vf-persist-path-saved"
                                  },
                                  {
                                    default: e.withCtx(() => [
                                      e.createTextVNode(
                                        e.toDisplayString(e.unref(r)("Saved.")),
                                        1
                                      )
                                    ]),
                                    _: 1
                                  }
                                )
                              ])
                            ])
                          ]),
                          e.createElementVNode("div", Cl, [
                            e.createElementVNode("div", Dl, [
                              e.withDirectives(
                                e.createElementVNode(
                                  "input",
                                  {
                                    id: "show_thumbnails",
                                    name: "show_thumbnails",
                                    type: "checkbox",
                                    "onUpdate:modelValue":
                                      C[3] ||
                                      (C[3] = w =>
                                        (e.unref(t).showThumbnails = w)),
                                    onClick: _,
                                    class: "vuefinder__about-modal__checkbox"
                                  },
                                  null,
                                  512
                                ),
                                [[e.vModelCheckbox, e.unref(t).showThumbnails]]
                              )
                            ]),
                            e.createElementVNode("div", Tl, [
                              e.createElementVNode("label", Ml, [
                                e.createTextVNode(
                                  e.toDisplayString(
                                    e.unref(r)("Show thumbnails")
                                  ) + " ",
                                  1
                                ),
                                e.createVNode(
                                  Ge,
                                  {
                                    class: "ms-3",
                                    on: "vf-show-thumbnails-saved"
                                  },
                                  {
                                    default: e.withCtx(() => [
                                      e.createTextVNode(
                                        e.toDisplayString(e.unref(r)("Saved.")),
                                        1
                                      )
                                    ]),
                                    _: 1
                                  }
                                )
                              ])
                            ])
                          ]),
                          e.createElementVNode("div", Al, [
                            e.createElementVNode("div", Ll, [
                              e.createElementVNode(
                                "label",
                                Ol,
                                e.toDisplayString(e.unref(r)("Theme")),
                                1
                              )
                            ]),
                            e.createElementVNode("div", Fl, [
                              e.withDirectives(
                                e.createElementVNode(
                                  "select",
                                  {
                                    id: "theme",
                                    "onUpdate:modelValue":
                                      C[4] ||
                                      (C[4] = w =>
                                        (e.unref(t).theme.value = w)),
                                    onChange:
                                      C[5] || (C[5] = w => d(w.target.value)),
                                    class: "vuefinder__about-modal__select"
                                  },
                                  [
                                    e.createElementVNode(
                                      "optgroup",
                                      { label: e.unref(r)("Theme") },
                                      [
                                        (e.openBlock(!0),
                                        e.createElementBlock(
                                          e.Fragment,
                                          null,
                                          e.renderList(
                                            S.value,
                                            (w, N) => (
                                              e.openBlock(),
                                              e.createElementBlock(
                                                "option",
                                                { value: N },
                                                e.toDisplayString(w),
                                                9,
                                                Rl
                                              )
                                            )
                                          ),
                                          256
                                        ))
                                      ],
                                      8,
                                      Hl
                                    )
                                  ],
                                  544
                                ),
                                [[e.vModelSelect, e.unref(t).theme.value]]
                              ),
                              e.createVNode(
                                Ge,
                                { class: "ms-3", on: "vf-theme-saved" },
                                {
                                  default: e.withCtx(() => [
                                    e.createTextVNode(
                                      e.toDisplayString(e.unref(r)("Saved.")),
                                      1
                                    )
                                  ]),
                                  _: 1
                                }
                              )
                            ])
                          ]),
                          e.unref(t).features.includes(e.unref(Z).LANGUAGE) &&
                          Object.keys(e.unref(p)).length > 1
                            ? (e.openBlock(),
                              e.createElementBlock("div", zl, [
                                e.createElementVNode("div", Il, [
                                  e.createElementVNode(
                                    "label",
                                    Ul,
                                    e.toDisplayString(e.unref(r)("Language")),
                                    1
                                  )
                                ]),
                                e.createElementVNode("div", ql, [
                                  e.withDirectives(
                                    e.createElementVNode(
                                      "select",
                                      {
                                        id: "language",
                                        "onUpdate:modelValue":
                                          C[6] ||
                                          (C[6] = w =>
                                            (e.unref(t).i18n.locale = w)),
                                        class: "vuefinder__about-modal__select"
                                      },
                                      [
                                        e.createElementVNode(
                                          "optgroup",
                                          { label: e.unref(r)("Language") },
                                          [
                                            (e.openBlock(!0),
                                            e.createElementBlock(
                                              e.Fragment,
                                              null,
                                              e.renderList(
                                                e.unref(p),
                                                (w, N) => (
                                                  e.openBlock(),
                                                  e.createElementBlock(
                                                    "option",
                                                    { value: N },
                                                    e.toDisplayString(w),
                                                    9,
                                                    Pl
                                                  )
                                                )
                                              ),
                                              256
                                            ))
                                          ],
                                          8,
                                          jl
                                        )
                                      ],
                                      512
                                    ),
                                    [[e.vModelSelect, e.unref(t).i18n.locale]]
                                  ),
                                  e.createVNode(
                                    Ge,
                                    { class: "ms-3", on: "vf-language-saved" },
                                    {
                                      default: e.withCtx(() => [
                                        e.createTextVNode(
                                          e.toDisplayString(
                                            e.unref(r)("Saved.")
                                          ),
                                          1
                                        )
                                      ]),
                                      _: 1
                                    }
                                  )
                                ])
                              ]))
                            : e.createCommentVNode("", !0)
                        ])
                      ])
                    ]))
                  : e.createCommentVNode("", !0),
                i.value === c.SHORTCUTS
                  ? (e.openBlock(),
                    e.createElementBlock("div", Gl, [
                      e.createElementVNode("div", Kl, [
                        e.createElementVNode("div", Wl, [
                          e.createElementVNode(
                            "div",
                            null,
                            e.toDisplayString(e.unref(r)("Rename")),
                            1
                          ),
                          Yl
                        ]),
                        e.createElementVNode("div", Xl, [
                          e.createElementVNode(
                            "div",
                            null,
                            e.toDisplayString(e.unref(r)("Refresh")),
                            1
                          ),
                          Jl
                        ]),
                        e.createElementVNode("div", Zl, [
                          e.createTextVNode(
                            e.toDisplayString(e.unref(r)("Delete")) + " ",
                            1
                          ),
                          Ql
                        ]),
                        e.createElementVNode("div", ea, [
                          e.createTextVNode(
                            e.toDisplayString(e.unref(r)("Escape")) + " ",
                            1
                          ),
                          ta
                        ]),
                        e.createElementVNode("div", na, [
                          e.createTextVNode(
                            e.toDisplayString(e.unref(r)("Select All")) + " ",
                            1
                          ),
                          oa
                        ]),
                        e.createElementVNode("div", ra, [
                          e.createTextVNode(
                            e.toDisplayString(e.unref(r)("Search")) + " ",
                            1
                          ),
                          sa
                        ]),
                        e.createElementVNode("div", la, [
                          e.createTextVNode(
                            e.toDisplayString(e.unref(r)("Toggle Sidebar")) +
                              " ",
                            1
                          ),
                          aa
                        ]),
                        e.createElementVNode("div", ca, [
                          e.createTextVNode(
                            e.toDisplayString(e.unref(r)("Open Settings")) +
                              " ",
                            1
                          ),
                          ia
                        ]),
                        e.createElementVNode("div", da, [
                          e.createTextVNode(
                            e.toDisplayString(
                              e.unref(r)("Toggle Full Screen")
                            ) + " ",
                            1
                          ),
                          ua
                        ])
                      ])
                    ]))
                  : e.createCommentVNode("", !0),
                i.value === c.RESET
                  ? (e.openBlock(),
                    e.createElementBlock("div", ma, [
                      e.createElementVNode(
                        "div",
                        fa,
                        e.toDisplayString(
                          e.unref(r)("Reset all settings to default")
                        ),
                        1
                      ),
                      e.createElementVNode(
                        "button",
                        {
                          onClick: l,
                          type: "button",
                          class: "vf-btn vf-btn-secondary"
                        },
                        e.toDisplayString(e.unref(r)("Reset Settings")),
                        1
                      )
                    ]))
                  : e.createCommentVNode("", !0)
              ])
            ])
          ]),
          _: 1
        })
      );
    }
  },
  _a = ["title"],
  va = e.createElementVNode(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      "stroke-width": "1.5",
      stroke: "currentColor",
      class: "vuefinder__message__icon"
    },
    [
      e.createElementVNode("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        d: "M6 18L18 6M6 6l12 12"
      })
    ],
    -1
  ),
  pa = [va],
  Ce = {
    __name: "Message",
    props: { error: { type: Boolean, default: !1 } },
    emits: ["hidden"],
    setup(n, { emit: t }) {
      var d;
      const o = t,
        s = e.inject("ServiceContainer"),
        { t: r } = s.i18n,
        c = e.ref(!1),
        a = e.ref(null),
        i = e.ref((d = a.value) == null ? void 0 : d.strMessage);
      e.watch(i, () => (c.value = !1));
      const l = () => {
        o("hidden"), (c.value = !0);
      };
      return (m, u) => (
        e.openBlock(),
        e.createElementBlock("div", null, [
          c.value
            ? e.createCommentVNode("", !0)
            : (e.openBlock(),
              e.createElementBlock(
                "div",
                {
                  key: 0,
                  ref_key: "strMessage",
                  ref: a,
                  class: e.normalizeClass([
                    "vuefinder__message",
                    n.error
                      ? "vuefinder__message--error"
                      : "vuefinder__message--success"
                  ])
                },
                [
                  e.renderSlot(m.$slots, "default"),
                  e.createElementVNode(
                    "div",
                    {
                      class: "vuefinder__message__close",
                      onClick: l,
                      title: e.unref(r)("Close")
                    },
                    pa,
                    8,
                    _a
                  )
                ],
                2
              ))
        ])
      );
    }
  },
  ha = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    "stroke-width": "1.5",
    class: "h-6 w-6 md:h-8 md:w-8 m-auto",
    viewBox: "0 0 24 24"
  },
  ga = e.createElementVNode(
    "path",
    {
      d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21q.512.078 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48 48 0 0 0-3.478-.397m-12 .562q.51-.089 1.022-.165m0 0a48 48 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a52 52 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a49 49 0 0 0-7.5 0"
    },
    null,
    -1
  ),
  ka = [ga];
function wa(n, t) {
  return e.openBlock(), e.createElementBlock("svg", ha, [...ka]);
}
const Jo = { render: wa },
  ba = { class: "vuefinder__delete-modal__content" },
  ya = { class: "vuefinder__delete-modal__form" },
  Ea = { class: "vuefinder__delete-modal__description" },
  Va = { class: "vuefinder__delete-modal__files vf-scrollbar" },
  Sa = { class: "vuefinder__delete-modal__file" },
  Na = {
    key: 0,
    class: "vuefinder__delete-modal__icon vuefinder__delete-modal__icon--dir",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "stroke-width": "1"
  },
  xa = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    },
    null,
    -1
  ),
  Ba = [xa],
  $a = {
    key: 1,
    class: "vuefinder__delete-modal__icon",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "stroke-width": "1"
  },
  Ca = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    },
    null,
    -1
  ),
  Da = [Ca],
  Ta = { class: "vuefinder__delete-modal__file-name" },
  Ma = { class: "vuefinder__delete-modal__warning" },
  Dn = {
    __name: "ModalDelete",
    setup(n) {
      const t = e.inject("ServiceContainer"),
        { t: o } = t.i18n,
        s = e.ref(t.modal.data.items),
        r = e.ref(""),
        c = () => {
          s.value.length &&
            t.emitter.emit("vf-fetch", {
              params: {
                q: "delete",
                m: "post",
                adapter: t.fs.adapter,
                path: t.fs.data.dirname
              },
              body: {
                items: s.value.map(({ path: a, type: i }) => ({
                  path: a,
                  type: i
                }))
              },
              onSuccess: () => {
                t.emitter.emit("vf-toast-push", { label: o("Files deleted.") });
              },
              onError: a => {
                r.value = o(a.message);
              }
            });
        };
      return (a, i) => (
        e.openBlock(),
        e.createBlock($e, null, {
          buttons: e.withCtx(() => [
            e.createElementVNode(
              "button",
              { type: "button", onClick: c, class: "vf-btn vf-btn-danger" },
              e.toDisplayString(e.unref(o)("Yes, Delete!")),
              1
            ),
            e.createElementVNode(
              "button",
              {
                type: "button",
                onClick: i[1] || (i[1] = l => e.unref(t).modal.close()),
                class: "vf-btn vf-btn-secondary"
              },
              e.toDisplayString(e.unref(o)("Cancel")),
              1
            ),
            e.createElementVNode(
              "div",
              Ma,
              e.toDisplayString(e.unref(o)("This action cannot be undone.")),
              1
            )
          ]),
          default: e.withCtx(() => [
            e.createElementVNode("div", null, [
              e.createVNode(
                Le,
                { icon: e.unref(Jo), title: e.unref(o)("Delete files") },
                null,
                8,
                ["icon", "title"]
              ),
              e.createElementVNode("div", ba, [
                e.createElementVNode("div", ya, [
                  e.createElementVNode(
                    "p",
                    Ea,
                    e.toDisplayString(
                      e.unref(o)("Are you sure you want to delete these files?")
                    ),
                    1
                  ),
                  e.createElementVNode("div", Va, [
                    (e.openBlock(!0),
                    e.createElementBlock(
                      e.Fragment,
                      null,
                      e.renderList(
                        s.value,
                        l => (
                          e.openBlock(),
                          e.createElementBlock("p", Sa, [
                            l.type === "dir"
                              ? (e.openBlock(),
                                e.createElementBlock("svg", Na, Ba))
                              : (e.openBlock(),
                                e.createElementBlock("svg", $a, Da)),
                            e.createElementVNode(
                              "span",
                              Ta,
                              e.toDisplayString(l.basename),
                              1
                            )
                          ])
                        )
                      ),
                      256
                    ))
                  ]),
                  r.value.length
                    ? (e.openBlock(),
                      e.createBlock(
                        Ce,
                        {
                          key: 0,
                          onHidden: i[0] || (i[0] = l => (r.value = "")),
                          error: ""
                        },
                        {
                          default: e.withCtx(() => [
                            e.createTextVNode(e.toDisplayString(r.value), 1)
                          ]),
                          _: 1
                        }
                      ))
                    : e.createCommentVNode("", !0)
                ])
              ])
            ])
          ]),
          _: 1
        })
      );
    }
  },
  Aa = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    "stroke-width": "1.5",
    class: "h-6 w-6 md:h-8 md:w-8 m-auto",
    viewBox: "0 0 24 24"
  },
  La = e.createElementVNode(
    "path",
    {
      d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
    },
    null,
    -1
  ),
  Oa = [La];
function Fa(n, t) {
  return e.openBlock(), e.createElementBlock("svg", Aa, [...Oa]);
}
const Zo = { render: Fa },
  Ha = { class: "vuefinder__rename-modal__content" },
  Ra = { class: "vuefinder__rename-modal__item" },
  za = { class: "vuefinder__rename-modal__item-info" },
  Ia = {
    key: 0,
    class: "vuefinder__rename-modal__icon vuefinder__rename-modal__icon--dir",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "stroke-width": "1"
  },
  Ua = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    },
    null,
    -1
  ),
  qa = [Ua],
  ja = {
    key: 1,
    class: "vuefinder__rename-modal__icon",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "stroke-width": "1"
  },
  Pa = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    },
    null,
    -1
  ),
  Ga = [Pa],
  Ka = { class: "vuefinder__rename-modal__item-name" },
  Tn = {
    __name: "ModalRename",
    setup(n) {
      const t = e.inject("ServiceContainer"),
        { t: o } = t.i18n,
        s = e.ref(t.modal.data.items[0]),
        r = e.ref(t.modal.data.items[0].basename),
        c = e.ref(""),
        a = () => {
          r.value != "" &&
            t.emitter.emit("vf-fetch", {
              params: {
                q: "rename",
                m: "post",
                adapter: t.fs.adapter,
                path: t.fs.data.dirname
              },
              body: { item: s.value.path, name: r.value },
              onSuccess: () => {
                t.emitter.emit("vf-toast-push", {
                  label: o("%s is renamed.", r.value)
                });
              },
              onError: i => {
                c.value = o(i.message);
              }
            });
        };
      return (i, l) => (
        e.openBlock(),
        e.createBlock($e, null, {
          buttons: e.withCtx(() => [
            e.createElementVNode(
              "button",
              { type: "button", onClick: a, class: "vf-btn vf-btn-primary" },
              e.toDisplayString(e.unref(o)("Rename")),
              1
            ),
            e.createElementVNode(
              "button",
              {
                type: "button",
                onClick: l[2] || (l[2] = d => e.unref(t).modal.close()),
                class: "vf-btn vf-btn-secondary"
              },
              e.toDisplayString(e.unref(o)("Cancel")),
              1
            )
          ]),
          default: e.withCtx(() => [
            e.createElementVNode("div", null, [
              e.createVNode(
                Le,
                { icon: e.unref(Zo), title: e.unref(o)("Rename") },
                null,
                8,
                ["icon", "title"]
              ),
              e.createElementVNode("div", Ha, [
                e.createElementVNode("div", Ra, [
                  e.createElementVNode("p", za, [
                    s.value.type === "dir"
                      ? (e.openBlock(), e.createElementBlock("svg", Ia, qa))
                      : (e.openBlock(), e.createElementBlock("svg", ja, Ga)),
                    e.createElementVNode(
                      "span",
                      Ka,
                      e.toDisplayString(s.value.basename),
                      1
                    )
                  ]),
                  e.withDirectives(
                    e.createElementVNode(
                      "input",
                      {
                        "onUpdate:modelValue":
                          l[0] || (l[0] = d => (r.value = d)),
                        onKeyup: e.withKeys(a, ["enter"]),
                        class: "vuefinder__rename-modal__input",
                        placeholder: "Name",
                        type: "text"
                      },
                      null,
                      544
                    ),
                    [[e.vModelText, r.value]]
                  ),
                  c.value.length
                    ? (e.openBlock(),
                      e.createBlock(
                        Ce,
                        {
                          key: 0,
                          onHidden: l[1] || (l[1] = d => (c.value = "")),
                          error: ""
                        },
                        {
                          default: e.withCtx(() => [
                            e.createTextVNode(e.toDisplayString(c.value), 1)
                          ]),
                          _: 1
                        }
                      ))
                    : e.createCommentVNode("", !0)
                ])
              ])
            ])
          ]),
          _: 1
        })
      );
    }
  },
  De = {
    ESCAPE: "Escape",
    F2: "F2",
    F5: "F5",
    DELETE: "Delete",
    ENTER: "Enter",
    BACKSLASH: "Backslash",
    KEY_A: "KeyA",
    KEY_E: "KeyE",
    KEY_F: "KeyF"
  };
function Wa(n) {
  const t = o => {
    o.code === De.ESCAPE && (n.modal.close(), n.root.focus()),
      !n.modal.visible &&
        (n.fs.searchMode ||
          (o.code === De.F2 &&
            n.features.includes(Z.RENAME) &&
            (n.dragSelect.getCount() !== 1 ||
              n.modal.open(Tn, { items: n.dragSelect.getSelected() })),
          o.code === De.F5 &&
            n.emitter.emit("vf-fetch", {
              params: {
                q: "index",
                adapter: n.fs.adapter,
                path: n.fs.data.dirname
              }
            }),
          o.code === De.DELETE &&
            (!n.dragSelect.getCount() ||
              n.modal.open(Dn, { items: n.dragSelect.getSelected() })),
          o.metaKey && o.code === De.BACKSLASH && n.modal.open(Xo),
          o.metaKey &&
            o.code === De.KEY_F &&
            n.features.includes(Z.SEARCH) &&
            ((n.fs.searchMode = !0), o.preventDefault()),
          o.metaKey &&
            o.code === De.KEY_E &&
            ((n.showTreeView = !n.showTreeView),
            n.storage.setStore("show-tree-view", n.showTreeView)),
          o.metaKey &&
            o.code === De.ENTER &&
            ((n.fullScreen = !n.fullScreen), n.root.focus()),
          o.metaKey &&
            o.code === De.KEY_A &&
            (n.dragSelect.selectAll(), o.preventDefault())));
  };
  e.onMounted(() => {
    n.root.addEventListener("keydown", t);
  });
}
const Ya = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    "stroke-width": "1.5",
    class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
    viewBox: "0 0 24 24"
  },
  Xa = e.createElementVNode(
    "path",
    {
      d: "M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44z"
    },
    null,
    -1
  ),
  Ja = [Xa];
function Za(n, t) {
  return e.openBlock(), e.createElementBlock("svg", Ya, [...Ja]);
}
const Qo = { render: Za },
  Qa = { class: "vuefinder__new-folder-modal__content" },
  ec = { class: "vuefinder__new-folder-modal__form" },
  tc = { class: "vuefinder__new-folder-modal__description" },
  nc = ["placeholder"],
  er = {
    __name: "ModalNewFolder",
    setup(n) {
      const t = e.inject("ServiceContainer");
      t.storage;
      const { t: o } = t.i18n,
        s = e.ref(""),
        r = e.ref(""),
        c = () => {
          s.value !== "" &&
            t.emitter.emit("vf-fetch", {
              params: {
                q: "newfolder",
                m: "post",
                adapter: t.fs.adapter,
                path: t.fs.data.dirname
              },
              body: { name: s.value },
              onSuccess: () => {
                t.emitter.emit("vf-toast-push", {
                  label: o("%s is created.", s.value)
                });
              },
              onError: a => {
                r.value = o(a.message);
              }
            });
        };
      return (a, i) => (
        e.openBlock(),
        e.createBlock($e, null, {
          buttons: e.withCtx(() => [
            e.createElementVNode(
              "button",
              { type: "button", onClick: c, class: "vf-btn vf-btn-primary" },
              e.toDisplayString(e.unref(o)("Create")),
              1
            ),
            e.createElementVNode(
              "button",
              {
                type: "button",
                onClick: i[2] || (i[2] = l => e.unref(t).modal.close()),
                class: "vf-btn vf-btn-secondary"
              },
              e.toDisplayString(e.unref(o)("Cancel")),
              1
            )
          ]),
          default: e.withCtx(() => [
            e.createElementVNode("div", null, [
              e.createVNode(
                Le,
                { icon: e.unref(Qo), title: e.unref(o)("New Folder") },
                null,
                8,
                ["icon", "title"]
              ),
              e.createElementVNode("div", Qa, [
                e.createElementVNode("div", ec, [
                  e.createElementVNode(
                    "p",
                    tc,
                    e.toDisplayString(e.unref(o)("Create a new folder")),
                    1
                  ),
                  e.withDirectives(
                    e.createElementVNode(
                      "input",
                      {
                        "onUpdate:modelValue":
                          i[0] || (i[0] = l => (s.value = l)),
                        onKeyup: e.withKeys(c, ["enter"]),
                        class: "vuefinder__new-folder-modal__input",
                        placeholder: e.unref(o)("Folder Name"),
                        type: "text"
                      },
                      null,
                      40,
                      nc
                    ),
                    [[e.vModelText, s.value]]
                  ),
                  r.value.length
                    ? (e.openBlock(),
                      e.createBlock(
                        Ce,
                        {
                          key: 0,
                          onHidden: i[1] || (i[1] = l => (r.value = "")),
                          error: ""
                        },
                        {
                          default: e.withCtx(() => [
                            e.createTextVNode(e.toDisplayString(r.value), 1)
                          ]),
                          _: 1
                        }
                      ))
                    : e.createCommentVNode("", !0)
                ])
              ])
            ])
          ]),
          _: 1
        })
      );
    }
  },
  oc = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    "stroke-width": "1.5",
    class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
    viewBox: "0 0 24 24"
  },
  rc = e.createElementVNode(
    "path",
    {
      d: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9"
    },
    null,
    -1
  ),
  sc = [rc];
function lc(n, t) {
  return e.openBlock(), e.createElementBlock("svg", oc, [...sc]);
}
const tr = { render: lc },
  ac = { class: "vuefinder__new-file-modal__content" },
  cc = { class: "vuefinder__new-file-modal__form" },
  ic = { class: "vuefinder__new-file-modal__description" },
  dc = ["placeholder"],
  uc = {
    __name: "ModalNewFile",
    setup(n) {
      const t = e.inject("ServiceContainer");
      t.storage;
      const { t: o } = t.i18n,
        s = e.ref(""),
        r = e.ref(""),
        c = () => {
          s.value !== "" &&
            t.emitter.emit("vf-fetch", {
              params: {
                q: "newfile",
                m: "post",
                adapter: t.fs.adapter,
                path: t.fs.data.dirname
              },
              body: { name: s.value },
              onSuccess: () => {
                t.emitter.emit("vf-toast-push", {
                  label: o("%s is created.", s.value)
                });
              },
              onError: a => {
                r.value = o(a.message);
              }
            });
        };
      return (a, i) => (
        e.openBlock(),
        e.createBlock($e, null, {
          buttons: e.withCtx(() => [
            e.createElementVNode(
              "button",
              { type: "button", onClick: c, class: "vf-btn vf-btn-primary" },
              e.toDisplayString(e.unref(o)("Create")),
              1
            ),
            e.createElementVNode(
              "button",
              {
                type: "button",
                onClick: i[2] || (i[2] = l => e.unref(t).modal.close()),
                class: "vf-btn vf-btn-secondary"
              },
              e.toDisplayString(e.unref(o)("Cancel")),
              1
            )
          ]),
          default: e.withCtx(() => [
            e.createElementVNode("div", null, [
              e.createVNode(
                Le,
                { icon: e.unref(tr), title: e.unref(o)("New File") },
                null,
                8,
                ["icon", "title"]
              ),
              e.createElementVNode("div", ac, [
                e.createElementVNode("div", cc, [
                  e.createElementVNode(
                    "p",
                    ic,
                    e.toDisplayString(e.unref(o)("Create a new file")),
                    1
                  ),
                  e.withDirectives(
                    e.createElementVNode(
                      "input",
                      {
                        "onUpdate:modelValue":
                          i[0] || (i[0] = l => (s.value = l)),
                        onKeyup: e.withKeys(c, ["enter"]),
                        class: "vuefinder__new-file-modal__input",
                        placeholder: e.unref(o)("File Name"),
                        type: "text"
                      },
                      null,
                      40,
                      dc
                    ),
                    [[e.vModelText, s.value]]
                  ),
                  r.value.length
                    ? (e.openBlock(),
                      e.createBlock(
                        Ce,
                        {
                          key: 0,
                          onHidden: i[1] || (i[1] = l => (r.value = "")),
                          error: ""
                        },
                        {
                          default: e.withCtx(() => [
                            e.createTextVNode(e.toDisplayString(r.value), 1)
                          ]),
                          _: 1
                        }
                      ))
                    : e.createCommentVNode("", !0)
                ])
              ])
            ])
          ]),
          _: 1
        })
      );
    }
  };
function vn(n, t = 14) {
  let o = `((?=([\\w\\W]{0,${t}}))([\\w\\W]{${t + 1},})([\\w\\W]{8,}))`;
  return n.replace(new RegExp(o), "$2..$4");
}
const mc = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    "stroke-width": "1.5",
    class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
    viewBox: "0 0 24 24"
  },
  fc = e.createElementVNode(
    "path",
    {
      d: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
    },
    null,
    -1
  ),
  _c = [fc];
function vc(n, t) {
  return e.openBlock(), e.createElementBlock("svg", mc, [..._c]);
}
const nr = { render: vc },
  pc = { class: "vuefinder__upload-modal__content" },
  hc = { key: 0, class: "pointer-events-none" },
  gc = { key: 1, class: "pointer-events-none" },
  kc = ["disabled"],
  wc = ["disabled"],
  bc = { class: "vuefinder__upload-modal__file-list vf-scrollbar" },
  yc = ["textContent"],
  Ec = { class: "vuefinder__upload-modal__file-info" },
  Vc = { class: "vuefinder__upload-modal__file-name hidden md:block" },
  Sc = { class: "vuefinder__upload-modal__file-name md:hidden" },
  Nc = { key: 0, class: "ml-auto" },
  xc = ["title", "disabled", "onClick"],
  Bc = e.createElementVNode(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24",
      "stroke-width": "1.5",
      stroke: "currentColor",
      class: "vuefinder__upload-modal__file-remove-icon"
    },
    [
      e.createElementVNode("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        d: "M6 18L18 6M6 6l12 12"
      })
    ],
    -1
  ),
  $c = [Bc],
  Cc = { key: 0, class: "py-2" },
  Dc = ["disabled"],
  Tc = {
    __name: "ModalUpload",
    setup(n) {
      const t = e.inject("ServiceContainer"),
        { t: o } = t.i18n,
        s = o("uppy"),
        r = { PENDING: 0, CANCELED: 1, UPLOADING: 2, ERROR: 3, DONE: 10 },
        c = e.ref({ QUEUE_ENTRY_STATUS: r }),
        a = e.ref(null),
        i = e.ref(null),
        l = e.ref(null),
        d = e.ref(null),
        m = e.ref(null),
        u = e.ref(null),
        _ = e.ref([]),
        f = e.ref(""),
        v = e.ref(!1),
        k = e.ref(!1);
      let p;
      function S(E) {
        return _.value.findIndex(M => M.id === E);
      }
      function T(E, M = null) {
        (M = M ?? (E.webkitRelativePath || E.name)),
          p.addFile({ name: M, type: E.type, data: E, source: "Local" });
      }
      function C(E) {
        switch (E.status) {
          case r.DONE:
            return "text-green-600";
          case r.ERROR:
            return "text-red-600";
          case r.CANCELED:
            return "text-red-600";
          case r.PENDING:
          default:
            return "";
        }
      }
      const w = E => {
        switch (E.status) {
          case r.DONE:
            return "✓";
          case r.ERROR:
          case r.CANCELED:
            return "!";
          case r.PENDING:
          default:
            return "...";
        }
      };
      function N() {
        d.value.click();
      }
      function B() {
        if (!v.value) {
          if (!_.value.filter(E => E.status !== r.DONE).length) {
            f.value = o("Please select file to upload first.");
            return;
          }
          (f.value = ""), p.retryAll(), p.upload();
        }
      }
      function F() {
        p.cancelAll({ reason: "user" }),
          _.value.forEach(E => {
            E.status !== r.DONE &&
              ((E.status = r.CANCELED), (E.statusName = o("Canceled")));
          }),
          (v.value = !1);
      }
      function x(E) {
        v.value ||
          (p.removeFile(E.id, "removed-by-user"), _.value.splice(S(E.id), 1));
      }
      function b(E) {
        if (!v.value) {
          if ((p.cancelAll({ reason: "user" }), E)) {
            const M = [];
            _.value.forEach(g => {
              g.status !== r.DONE && M.push(g);
            }),
              (_.value = []),
              M.forEach(g => {
                T(g.originalFile, g.name);
              });
            return;
          }
          _.value.splice(0);
        }
      }
      function h() {
        t.modal.close();
      }
      function y() {
        return t.requester.transformRequestParams({
          url: "",
          method: "post",
          params: {
            q: "upload",
            adapter: t.fs.adapter,
            path: t.fs.data.dirname
          }
        });
      }
      return (
        e.onMounted(async () => {
          (p = new Sr({
            debug: t.debug,
            restrictions: { maxFileSize: Or(t.maxFileSize) },
            locale: s,
            onBeforeFileAdded(g, L) {
              if (L[g.id] != null) {
                const j = S(g.id);
                _.value[j].status === r.PENDING &&
                  (f.value = p.i18n("noDuplicates", { fileName: g.name })),
                  (_.value = _.value.filter(K => K.id !== g.id));
              }
              return (
                _.value.push({
                  id: g.id,
                  name: g.name,
                  size: t.filesize(g.size),
                  status: r.PENDING,
                  statusName: o("Pending upload"),
                  percent: null,
                  originalFile: g.data
                }),
                !0
              );
            }
          })),
            p.use(Nr, {
              endpoint: "WILL_BE_REPLACED_BEFORE_UPLOAD",
              limit: 5,
              timeout: 0,
              getResponseError(g, L) {
                let O;
                try {
                  O = JSON.parse(g).message;
                } catch {
                  O = o("Cannot parse server response.");
                }
                return new Error(O);
              }
            }),
            p.on("restriction-failed", (g, L) => {
              const O = _.value[S(g.id)];
              x(O), (f.value = L.message);
            }),
            p.on("upload", () => {
              const g = y();
              p.setMeta({ ...g.body });
              const L = p.getPlugin("XHRUpload");
              (L.opts.method = g.method),
                (L.opts.endpoint = g.url + "?" + new URLSearchParams(g.params)),
                (L.opts.headers = g.headers),
                delete g.headers["Content-Type"],
                (v.value = !0),
                _.value.forEach(O => {
                  O.status !== r.DONE &&
                    ((O.percent = null),
                    (O.status = r.UPLOADING),
                    (O.statusName = o("Pending upload")));
                });
            }),
            p.on("upload-progress", (g, L) => {
              const O = Math.floor((L.bytesUploaded / L.bytesTotal) * 100);
              _.value[S(g.id)].percent = `${O}%`;
            }),
            p.on("upload-success", g => {
              const L = _.value[S(g.id)];
              (L.status = r.DONE), (L.statusName = o("Done"));
            }),
            p.on("upload-error", (g, L) => {
              const O = _.value[S(g.id)];
              (O.percent = null),
                (O.status = r.ERROR),
                L.isNetworkError
                  ? (O.statusName = o(
                      "Network Error, Unable establish connection to the server or interrupted."
                    ))
                  : (O.statusName = L ? L.message : o("Unknown Error"));
            }),
            p.on("error", g => {
              (f.value = g.message),
                (v.value = !1),
                t.emitter.emit("vf-fetch", {
                  params: {
                    q: "index",
                    adapter: t.fs.adapter,
                    path: t.fs.data.dirname
                  },
                  noCloseModal: !0
                });
            }),
            p.on("complete", () => {
              (v.value = !1),
                t.emitter.emit("vf-fetch", {
                  params: {
                    q: "index",
                    adapter: t.fs.adapter,
                    path: t.fs.data.dirname
                  },
                  noCloseModal: !0
                });
            }),
            d.value.addEventListener("click", () => {
              i.value.click();
            }),
            m.value.addEventListener("click", () => {
              l.value.click();
            }),
            u.value.addEventListener("dragover", g => {
              g.preventDefault(), (k.value = !0);
            }),
            u.value.addEventListener("dragleave", g => {
              g.preventDefault(), (k.value = !1);
            });
          function E(g, L) {
            L.isFile && L.file(O => g(L, O)),
              L.isDirectory &&
                L.createReader().readEntries(O => {
                  O.forEach(j => {
                    E(g, j);
                  });
                });
          }
          u.value.addEventListener("drop", g => {
            g.preventDefault(), (k.value = !1);
            const L = /^[/\\](.+)/;
            [...g.dataTransfer.items].forEach(O => {
              O.kind === "file" &&
                E((j, K) => {
                  const G = L.exec(j.fullPath);
                  T(K, G[1]);
                }, O.webkitGetAsEntry());
            });
          });
          const M = ({ target: g }) => {
            const L = g.files;
            for (const O of L) T(O);
            g.value = "";
          };
          i.value.addEventListener("change", M),
            l.value.addEventListener("change", M);
        }),
        e.onBeforeUnmount(() => {
          p == null || p.close({ reason: "unmount" });
        }),
        (E, M) => (
          e.openBlock(),
          e.createBlock($e, null, {
            buttons: e.withCtx(() => [
              e.createElementVNode(
                "button",
                {
                  type: "button",
                  class: "vf-btn vf-btn-primary",
                  disabled: v.value,
                  onClick: e.withModifiers(B, ["prevent"])
                },
                e.toDisplayString(e.unref(o)("Upload")),
                9,
                Dc
              ),
              v.value
                ? (e.openBlock(),
                  e.createElementBlock(
                    "button",
                    {
                      key: 0,
                      type: "button",
                      class: "vf-btn vf-btn-secondary",
                      onClick: e.withModifiers(F, ["prevent"])
                    },
                    e.toDisplayString(e.unref(o)("Cancel")),
                    1
                  ))
                : (e.openBlock(),
                  e.createElementBlock(
                    "button",
                    {
                      key: 1,
                      type: "button",
                      class: "vf-btn vf-btn-secondary",
                      onClick: e.withModifiers(h, ["prevent"])
                    },
                    e.toDisplayString(e.unref(o)("Close")),
                    1
                  ))
            ]),
            default: e.withCtx(() => [
              e.createElementVNode("div", null, [
                e.createVNode(
                  Le,
                  { icon: e.unref(nr), title: e.unref(o)("Upload Files") },
                  null,
                  8,
                  ["icon", "title"]
                ),
                e.createElementVNode("div", pc, [
                  e.createElementVNode(
                    "div",
                    {
                      class: "vuefinder__upload-modal__drop-area",
                      ref_key: "dropArea",
                      ref: u,
                      onClick: N
                    },
                    [
                      k.value
                        ? (e.openBlock(),
                          e.createElementBlock(
                            "div",
                            hc,
                            e.toDisplayString(
                              e.unref(o)("Release to drop these files.")
                            ),
                            1
                          ))
                        : (e.openBlock(),
                          e.createElementBlock(
                            "div",
                            gc,
                            e.toDisplayString(
                              e.unref(o)(
                                "Drag and drop the files/folders to here or click here."
                              )
                            ),
                            1
                          ))
                    ],
                    512
                  ),
                  e.createElementVNode(
                    "div",
                    {
                      ref_key: "container",
                      ref: a,
                      class: "vuefinder__upload-modal__buttons"
                    },
                    [
                      e.createElementVNode(
                        "button",
                        {
                          ref_key: "pickFiles",
                          ref: d,
                          type: "button",
                          class: "vf-btn vf-btn-secondary"
                        },
                        e.toDisplayString(e.unref(o)("Select Files")),
                        513
                      ),
                      e.createElementVNode(
                        "button",
                        {
                          ref_key: "pickFolders",
                          ref: m,
                          type: "button",
                          class: "vf-btn vf-btn-secondary"
                        },
                        e.toDisplayString(e.unref(o)("Select Folders")),
                        513
                      ),
                      e.createElementVNode(
                        "button",
                        {
                          type: "button",
                          class: "vf-btn vf-btn-secondary",
                          disabled: v.value,
                          onClick: M[0] || (M[0] = g => b(!1))
                        },
                        e.toDisplayString(e.unref(o)("Clear all")),
                        9,
                        kc
                      ),
                      e.createElementVNode(
                        "button",
                        {
                          type: "button",
                          class: "vf-btn vf-btn-secondary",
                          disabled: v.value,
                          onClick: M[1] || (M[1] = g => b(!0))
                        },
                        e.toDisplayString(e.unref(o)("Clear only successful")),
                        9,
                        wc
                      )
                    ],
                    512
                  ),
                  e.createElementVNode("div", bc, [
                    (e.openBlock(!0),
                    e.createElementBlock(
                      e.Fragment,
                      null,
                      e.renderList(
                        _.value,
                        g => (
                          e.openBlock(),
                          e.createElementBlock(
                            "div",
                            {
                              class: "vuefinder__upload-modal__file-entry",
                              key: g.id
                            },
                            [
                              e.createElementVNode(
                                "span",
                                {
                                  class: e.normalizeClass([
                                    "vuefinder__upload-modal__file-icon",
                                    C(g)
                                  ])
                                },
                                [
                                  e.createElementVNode(
                                    "span",
                                    {
                                      class:
                                        "vuefinder__upload-modal__file-icon-text",
                                      textContent: e.toDisplayString(w(g))
                                    },
                                    null,
                                    8,
                                    yc
                                  )
                                ],
                                2
                              ),
                              e.createElementVNode("div", Ec, [
                                e.createElementVNode(
                                  "div",
                                  Vc,
                                  e.toDisplayString(e.unref(vn)(g.name, 40)) +
                                    " (" +
                                    e.toDisplayString(g.size) +
                                    ")",
                                  1
                                ),
                                e.createElementVNode(
                                  "div",
                                  Sc,
                                  e.toDisplayString(e.unref(vn)(g.name, 16)) +
                                    " (" +
                                    e.toDisplayString(g.size) +
                                    ")",
                                  1
                                ),
                                e.createElementVNode(
                                  "div",
                                  {
                                    class: e.normalizeClass([
                                      "vuefinder__upload-modal__file-status",
                                      C(g)
                                    ])
                                  },
                                  [
                                    e.createTextVNode(
                                      e.toDisplayString(g.statusName) + " ",
                                      1
                                    ),
                                    g.status ===
                                    c.value.QUEUE_ENTRY_STATUS.UPLOADING
                                      ? (e.openBlock(),
                                        e.createElementBlock(
                                          "b",
                                          Nc,
                                          e.toDisplayString(g.percent),
                                          1
                                        ))
                                      : e.createCommentVNode("", !0)
                                  ],
                                  2
                                )
                              ]),
                              e.createElementVNode(
                                "button",
                                {
                                  type: "button",
                                  class: e.normalizeClass([
                                    "vuefinder__upload-modal__file-remove",
                                    v.value ? "disabled" : ""
                                  ]),
                                  title: e.unref(o)("Delete"),
                                  disabled: v.value,
                                  onClick: L => x(g)
                                },
                                $c,
                                10,
                                xc
                              )
                            ]
                          )
                        )
                      ),
                      128
                    )),
                    _.value.length
                      ? e.createCommentVNode("", !0)
                      : (e.openBlock(),
                        e.createElementBlock(
                          "div",
                          Cc,
                          e.toDisplayString(e.unref(o)("No files selected!")),
                          1
                        ))
                  ]),
                  f.value.length
                    ? (e.openBlock(),
                      e.createBlock(
                        Ce,
                        {
                          key: 0,
                          onHidden: M[2] || (M[2] = g => (f.value = "")),
                          error: ""
                        },
                        {
                          default: e.withCtx(() => [
                            e.createTextVNode(e.toDisplayString(f.value), 1)
                          ]),
                          _: 1
                        }
                      ))
                    : e.createCommentVNode("", !0)
                ])
              ]),
              e.createElementVNode(
                "input",
                {
                  ref_key: "internalFileInput",
                  ref: i,
                  type: "file",
                  multiple: "",
                  class: "hidden"
                },
                null,
                512
              ),
              e.createElementVNode(
                "input",
                {
                  ref_key: "internalFolderInput",
                  ref: l,
                  type: "file",
                  multiple: "",
                  webkitdirectory: "",
                  class: "hidden"
                },
                null,
                512
              )
            ]),
            _: 1
          })
        )
      );
    }
  },
  Mc = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    "stroke-width": "1.5",
    class: "h-6 w-6 md:h-8 md:w-8 m-auto",
    viewBox: "0 0 24 24"
  },
  Ac = e.createElementVNode(
    "path",
    {
      d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125"
    },
    null,
    -1
  ),
  Lc = [Ac];
function Oc(n, t) {
  return e.openBlock(), e.createElementBlock("svg", Mc, [...Lc]);
}
const or = { render: Oc },
  Fc = { class: "vuefinder__unarchive-modal__content" },
  Hc = { class: "vuefinder__unarchive-modal__items" },
  Rc = { class: "vuefinder__unarchive-modal__item" },
  zc = {
    key: 0,
    class:
      "vuefinder__unarchive-modal__icon vuefinder__unarchive-modal__icon--dir",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "stroke-width": "1"
  },
  Ic = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    },
    null,
    -1
  ),
  Uc = [Ic],
  qc = {
    key: 1,
    class:
      "vuefinder__unarchive-modal__icon vuefinder__unarchive-modal__icon--file",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "stroke-width": "1"
  },
  jc = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    },
    null,
    -1
  ),
  Pc = [jc],
  Gc = { class: "vuefinder__unarchive-modal__item-name" },
  Kc = { class: "vuefinder__unarchive-modal__info" },
  rr = {
    __name: "ModalUnarchive",
    setup(n) {
      const t = e.inject("ServiceContainer"),
        { t: o } = t.i18n,
        s = e.ref(t.modal.data.items[0]),
        r = e.ref(""),
        c = e.ref([]),
        a = () => {
          t.emitter.emit("vf-fetch", {
            params: {
              q: "unarchive",
              m: "post",
              adapter: t.fs.adapter,
              path: t.fs.data.dirname
            },
            body: { item: s.value.path },
            onSuccess: () => {
              t.emitter.emit("vf-toast-push", {
                label: o("The file unarchived.")
              });
            },
            onError: i => {
              r.value = o(i.message);
            }
          });
        };
      return (i, l) => (
        e.openBlock(),
        e.createBlock($e, null, {
          buttons: e.withCtx(() => [
            e.createElementVNode(
              "button",
              { type: "button", onClick: a, class: "vf-btn vf-btn-primary" },
              e.toDisplayString(e.unref(o)("Unarchive")),
              1
            ),
            e.createElementVNode(
              "button",
              {
                type: "button",
                onClick: l[1] || (l[1] = d => e.unref(t).modal.close()),
                class: "vf-btn vf-btn-secondary"
              },
              e.toDisplayString(e.unref(o)("Cancel")),
              1
            )
          ]),
          default: e.withCtx(() => [
            e.createElementVNode("div", null, [
              e.createVNode(
                Le,
                { icon: e.unref(or), title: e.unref(o)("Unarchive") },
                null,
                8,
                ["icon", "title"]
              ),
              e.createElementVNode("div", Fc, [
                e.createElementVNode("div", Hc, [
                  (e.openBlock(!0),
                  e.createElementBlock(
                    e.Fragment,
                    null,
                    e.renderList(
                      c.value,
                      d => (
                        e.openBlock(),
                        e.createElementBlock("p", Rc, [
                          d.type === "dir"
                            ? (e.openBlock(),
                              e.createElementBlock("svg", zc, Uc))
                            : (e.openBlock(),
                              e.createElementBlock("svg", qc, Pc)),
                          e.createElementVNode(
                            "span",
                            Gc,
                            e.toDisplayString(d.basename),
                            1
                          )
                        ])
                      )
                    ),
                    256
                  )),
                  e.createElementVNode(
                    "p",
                    Kc,
                    e.toDisplayString(
                      e.unref(o)("The archive will be unarchived at")
                    ) +
                      " (" +
                      e.toDisplayString(e.unref(t).fs.data.dirname) +
                      ")",
                    1
                  ),
                  r.value.length
                    ? (e.openBlock(),
                      e.createBlock(
                        Ce,
                        {
                          key: 0,
                          onHidden: l[0] || (l[0] = d => (r.value = "")),
                          error: ""
                        },
                        {
                          default: e.withCtx(() => [
                            e.createTextVNode(e.toDisplayString(r.value), 1)
                          ]),
                          _: 1
                        }
                      ))
                    : e.createCommentVNode("", !0)
                ])
              ])
            ])
          ]),
          _: 1
        })
      );
    }
  },
  Wc = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    "stroke-width": "1.5",
    class: "h-6 w-6 md:h-8 md:w-8 m-auto",
    viewBox: "0 0 24 24"
  },
  Yc = e.createElementVNode(
    "path",
    {
      d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125"
    },
    null,
    -1
  ),
  Xc = [Yc];
function Jc(n, t) {
  return e.openBlock(), e.createElementBlock("svg", Wc, [...Xc]);
}
const sr = { render: Jc },
  Zc = { class: "vuefinder__archive-modal__content" },
  Qc = { class: "vuefinder__archive-modal__form" },
  ei = { class: "vuefinder__archive-modal__files vf-scrollbar" },
  ti = { class: "vuefinder__archive-modal__file" },
  ni = {
    key: 0,
    class: "vuefinder__archive-modal__icon vuefinder__archive-modal__icon--dir",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "stroke-width": "1"
  },
  oi = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    },
    null,
    -1
  ),
  ri = [oi],
  si = {
    key: 1,
    class: "vuefinder__archive-modal__icon",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "stroke-width": "1"
  },
  li = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    },
    null,
    -1
  ),
  ai = [li],
  ci = { class: "vuefinder__archive-modal__file-name" },
  ii = ["placeholder"],
  lr = {
    __name: "ModalArchive",
    setup(n) {
      const t = e.inject("ServiceContainer"),
        { t: o } = t.i18n,
        s = e.ref(""),
        r = e.ref(""),
        c = e.ref(t.modal.data.items),
        a = () => {
          c.value.length &&
            t.emitter.emit("vf-fetch", {
              params: {
                q: "archive",
                m: "post",
                adapter: t.fs.adapter,
                path: t.fs.data.dirname
              },
              body: {
                items: c.value.map(({ path: i, type: l }) => ({
                  path: i,
                  type: l
                })),
                name: s.value
              },
              onSuccess: () => {
                t.emitter.emit("vf-toast-push", {
                  label: o("The file(s) archived.")
                });
              },
              onError: i => {
                r.value = o(i.message);
              }
            });
        };
      return (i, l) => (
        e.openBlock(),
        e.createBlock($e, null, {
          buttons: e.withCtx(() => [
            e.createElementVNode(
              "button",
              { type: "button", onClick: a, class: "vf-btn vf-btn-primary" },
              e.toDisplayString(e.unref(o)("Archive")),
              1
            ),
            e.createElementVNode(
              "button",
              {
                type: "button",
                onClick: l[2] || (l[2] = d => e.unref(t).modal.close()),
                class: "vf-btn vf-btn-secondary"
              },
              e.toDisplayString(e.unref(o)("Cancel")),
              1
            )
          ]),
          default: e.withCtx(() => [
            e.createElementVNode("div", null, [
              e.createVNode(
                Le,
                { icon: e.unref(sr), title: e.unref(o)("Archive the files") },
                null,
                8,
                ["icon", "title"]
              ),
              e.createElementVNode("div", Zc, [
                e.createElementVNode("div", Qc, [
                  e.createElementVNode("div", ei, [
                    (e.openBlock(!0),
                    e.createElementBlock(
                      e.Fragment,
                      null,
                      e.renderList(
                        c.value,
                        d => (
                          e.openBlock(),
                          e.createElementBlock("p", ti, [
                            d.type === "dir"
                              ? (e.openBlock(),
                                e.createElementBlock("svg", ni, ri))
                              : (e.openBlock(),
                                e.createElementBlock("svg", si, ai)),
                            e.createElementVNode(
                              "span",
                              ci,
                              e.toDisplayString(d.basename),
                              1
                            )
                          ])
                        )
                      ),
                      256
                    ))
                  ]),
                  e.withDirectives(
                    e.createElementVNode(
                      "input",
                      {
                        "onUpdate:modelValue":
                          l[0] || (l[0] = d => (s.value = d)),
                        onKeyup: e.withKeys(a, ["enter"]),
                        class: "vuefinder__archive-modal__input",
                        placeholder: e.unref(o)(
                          "Archive name. (.zip file will be created)"
                        ),
                        type: "text"
                      },
                      null,
                      40,
                      ii
                    ),
                    [[e.vModelText, s.value]]
                  ),
                  r.value.length
                    ? (e.openBlock(),
                      e.createBlock(
                        Ce,
                        {
                          key: 0,
                          onHidden: l[1] || (l[1] = d => (r.value = "")),
                          error: ""
                        },
                        {
                          default: e.withCtx(() => [
                            e.createTextVNode(e.toDisplayString(r.value), 1)
                          ]),
                          _: 1
                        }
                      ))
                    : e.createCommentVNode("", !0)
                ])
              ])
            ])
          ]),
          _: 1
        })
      );
    }
  },
  di = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    class: "animate-spin p-0.5 h-5 w-5 text-white ml-auto",
    viewBox: "0 0 24 24"
  },
  ui = e.createElementVNode(
    "circle",
    {
      cx: "12",
      cy: "12",
      r: "10",
      stroke: "currentColor",
      "stroke-width": "4",
      class: "opacity-25 stroke-blue-900 dark:stroke-blue-100"
    },
    null,
    -1
  ),
  mi = e.createElementVNode(
    "path",
    {
      fill: "currentColor",
      d: "M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12zm2 5.291A7.96 7.96 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938z",
      class: "opacity-75"
    },
    null,
    -1
  ),
  fi = [ui, mi];
function _i(n, t) {
  return e.openBlock(), e.createElementBlock("svg", di, [...fi]);
}
const Mn = { render: _i },
  vi = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    "stroke-width": "1.5",
    class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
    viewBox: "0 0 24 24"
  },
  pi = e.createElementVNode(
    "path",
    {
      d: "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
    },
    null,
    -1
  ),
  hi = [pi];
function gi(n, t) {
  return e.openBlock(), e.createElementBlock("svg", vi, [...hi]);
}
const ki = { render: gi },
  wi = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    "stroke-width": "1.5",
    class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
    viewBox: "0 0 24 24"
  },
  bi = e.createElementVNode(
    "path",
    {
      d: "M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25"
    },
    null,
    -1
  ),
  yi = [bi];
function Ei(n, t) {
  return e.openBlock(), e.createElementBlock("svg", wi, [...yi]);
}
const Vi = { render: Ei },
  Si = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    "stroke-width": "1.5",
    class: "h-6 w-6 md:h-8 md:w-8 m-auto",
    viewBox: "0 0 24 24"
  },
  Ni = e.createElementVNode(
    "path",
    {
      d: "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25zm0 9.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18zM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25zm0 9.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18z"
    },
    null,
    -1
  ),
  xi = [Ni];
function Bi(n, t) {
  return e.openBlock(), e.createElementBlock("svg", Si, [...xi]);
}
const $i = { render: Bi },
  Ci = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    "stroke-width": "1.5",
    class: "h-6 w-6 md:h-8 md:w-8 m-auto",
    viewBox: "0 0 24 24"
  },
  Di = e.createElementVNode(
    "path",
    {
      d: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75"
    },
    null,
    -1
  ),
  Ti = [Di];
function Mi(n, t) {
  return e.openBlock(), e.createElementBlock("svg", Ci, [...Ti]);
}
const Ai = { render: Mi },
  Li = { class: "vuefinder__toolbar" },
  Oi = { key: 0, class: "vuefinder__toolbar__actions" },
  Fi = ["title"],
  Hi = ["title"],
  Ri = ["title"],
  zi = ["title"],
  Ii = ["title"],
  Ui = ["title"],
  qi = ["title"],
  ji = { key: 1, class: "vuefinder__toolbar__search-results" },
  Pi = { class: "pl-2" },
  Gi = { class: "dark:bg-gray-700 bg-gray-200 text-xs px-2 py-1 rounded" },
  Ki = { class: "vuefinder__toolbar__controls" },
  Wi = ["title"],
  Yi = ["title"],
  Xi = {
    __name: "Toolbar",
    setup(n) {
      const t = e.inject("ServiceContainer"),
        { setStore: o } = t.storage,
        { t: s } = t.i18n,
        r = t.dragSelect,
        c = e.ref("");
      t.emitter.on("vf-search-query", ({ newQuery: l }) => {
        c.value = l;
      });
      const a = () => {
        t.fullScreen = !t.fullScreen;
      };
      e.watch(
        () => t.fullScreen,
        () => {
          t.fullScreen
            ? (document.querySelector("body").style.overflow = "hidden")
            : (document.querySelector("body").style.overflow = ""),
            o("full-screen", t.fullScreen),
            t.emitter.emit("vf-fullscreen-toggle");
        }
      );
      const i = () => {
        (t.view = t.view === "list" ? "grid" : "list"),
          r.refreshSelection(),
          o("viewport", t.view);
      };
      return (l, d) => (
        e.openBlock(),
        e.createElementBlock("div", Li, [
          c.value.length
            ? (e.openBlock(),
              e.createElementBlock("div", ji, [
                e.createElementVNode("div", Pi, [
                  e.createTextVNode(
                    e.toDisplayString(e.unref(s)("Search results for")) + " ",
                    1
                  ),
                  e.createElementVNode(
                    "span",
                    Gi,
                    e.toDisplayString(c.value),
                    1
                  )
                ]),
                e.unref(t).fs.loading
                  ? (e.openBlock(), e.createBlock(e.unref(Mn), { key: 0 }))
                  : e.createCommentVNode("", !0)
              ]))
            : (e.openBlock(),
              e.createElementBlock("div", Oi, [
                e.unref(t).features.includes(e.unref(Z).NEW_FOLDER)
                  ? (e.openBlock(),
                    e.createElementBlock(
                      "div",
                      {
                        key: 0,
                        class: "mx-1.5",
                        title: e.unref(s)("New Folder"),
                        onClick:
                          d[0] ||
                          (d[0] = m =>
                            e
                              .unref(t)
                              .modal.open(er, {
                                items: e.unref(r).getSelected()
                              }))
                      },
                      [e.createVNode(e.unref(Qo))],
                      8,
                      Fi
                    ))
                  : e.createCommentVNode("", !0),
                e.unref(t).features.includes(e.unref(Z).NEW_FILE)
                  ? (e.openBlock(),
                    e.createElementBlock(
                      "div",
                      {
                        key: 1,
                        class: "mx-1.5",
                        title: e.unref(s)("New File"),
                        onClick:
                          d[1] ||
                          (d[1] = m =>
                            e
                              .unref(t)
                              .modal.open(uc, {
                                items: e.unref(r).getSelected()
                              }))
                      },
                      [e.createVNode(e.unref(tr))],
                      8,
                      Hi
                    ))
                  : e.createCommentVNode("", !0),
                e.unref(t).features.includes(e.unref(Z).RENAME)
                  ? (e.openBlock(),
                    e.createElementBlock(
                      "div",
                      {
                        key: 2,
                        class: "mx-1.5",
                        title: e.unref(s)("Rename"),
                        onClick:
                          d[2] ||
                          (d[2] = m =>
                            e.unref(r).getCount() !== 1 ||
                            e
                              .unref(t)
                              .modal.open(Tn, {
                                items: e.unref(r).getSelected()
                              }))
                      },
                      [
                        e.createVNode(
                          e.unref(Zo),
                          {
                            class: e.normalizeClass(
                              e.unref(r).getCount() === 1
                                ? "vf-toolbar-icon"
                                : "vf-toolbar-icon-disabled"
                            )
                          },
                          null,
                          8,
                          ["class"]
                        )
                      ],
                      8,
                      Ri
                    ))
                  : e.createCommentVNode("", !0),
                e.unref(t).features.includes(e.unref(Z).DELETE)
                  ? (e.openBlock(),
                    e.createElementBlock(
                      "div",
                      {
                        key: 3,
                        class: "mx-1.5",
                        title: e.unref(s)("Delete"),
                        onClick:
                          d[3] ||
                          (d[3] = m =>
                            !e.unref(r).getCount() ||
                            e
                              .unref(t)
                              .modal.open(Dn, {
                                items: e.unref(r).getSelected()
                              }))
                      },
                      [
                        e.createVNode(
                          e.unref(Jo),
                          {
                            class: e.normalizeClass(
                              e.unref(r).getCount()
                                ? "vf-toolbar-icon"
                                : "vf-toolbar-icon-disabled"
                            )
                          },
                          null,
                          8,
                          ["class"]
                        )
                      ],
                      8,
                      zi
                    ))
                  : e.createCommentVNode("", !0),
                e.unref(t).features.includes(e.unref(Z).UPLOAD)
                  ? (e.openBlock(),
                    e.createElementBlock(
                      "div",
                      {
                        key: 4,
                        class: "mx-1.5",
                        title: e.unref(s)("Upload"),
                        onClick:
                          d[4] ||
                          (d[4] = m =>
                            e
                              .unref(t)
                              .modal.open(Tc, {
                                items: e.unref(r).getSelected()
                              }))
                      },
                      [e.createVNode(e.unref(nr))],
                      8,
                      Ii
                    ))
                  : e.createCommentVNode("", !0),
                e.unref(t).features.includes(e.unref(Z).UNARCHIVE) &&
                e.unref(r).getCount() === 1 &&
                e.unref(r).getSelected()[0].mime_type === "application/zip"
                  ? (e.openBlock(),
                    e.createElementBlock(
                      "div",
                      {
                        key: 5,
                        class: "mx-1.5",
                        title: e.unref(s)("Unarchive"),
                        onClick:
                          d[5] ||
                          (d[5] = m =>
                            !e.unref(r).getCount() ||
                            e
                              .unref(t)
                              .modal.open(rr, {
                                items: e.unref(r).getSelected()
                              }))
                      },
                      [
                        e.createVNode(
                          e.unref(or),
                          {
                            class: e.normalizeClass(
                              e.unref(r).getCount()
                                ? "vf-toolbar-icon"
                                : "vf-toolbar-icon-disabled"
                            )
                          },
                          null,
                          8,
                          ["class"]
                        )
                      ],
                      8,
                      Ui
                    ))
                  : e.createCommentVNode("", !0),
                e.unref(t).features.includes(e.unref(Z).ARCHIVE)
                  ? (e.openBlock(),
                    e.createElementBlock(
                      "div",
                      {
                        key: 6,
                        class: "mx-1.5",
                        title: e.unref(s)("Archive"),
                        onClick:
                          d[6] ||
                          (d[6] = m =>
                            !e.unref(r).getCount() ||
                            e
                              .unref(t)
                              .modal.open(lr, {
                                items: e.unref(r).getSelected()
                              }))
                      },
                      [
                        e.createVNode(
                          e.unref(sr),
                          {
                            class: e.normalizeClass(
                              e.unref(r).getCount()
                                ? "vf-toolbar-icon"
                                : "vf-toolbar-icon-disabled"
                            )
                          },
                          null,
                          8,
                          ["class"]
                        )
                      ],
                      8,
                      qi
                    ))
                  : e.createCommentVNode("", !0)
              ])),
          e.createElementVNode("div", Ki, [
            e.unref(t).features.includes(e.unref(Z).FULL_SCREEN)
              ? (e.openBlock(),
                e.createElementBlock(
                  "div",
                  {
                    key: 0,
                    onClick: a,
                    class: "mx-1.5",
                    title: e.unref(s)("Toggle Full Screen")
                  },
                  [
                    e.unref(t).fullScreen
                      ? (e.openBlock(), e.createBlock(e.unref(Vi), { key: 0 }))
                      : (e.openBlock(), e.createBlock(e.unref(ki), { key: 1 }))
                  ],
                  8,
                  Wi
                ))
              : e.createCommentVNode("", !0),
            e.createElementVNode(
              "div",
              {
                class: "mx-1.5",
                title: e.unref(s)("Change View"),
                onClick: d[7] || (d[7] = m => c.value.length || i())
              },
              [
                e.unref(t).view === "grid"
                  ? (e.openBlock(),
                    e.createBlock(
                      e.unref($i),
                      {
                        key: 0,
                        class: e.normalizeClass([
                          "vf-toolbar-icon",
                          c.value.length ? "vf-toolbar-icon-disabled" : ""
                        ])
                      },
                      null,
                      8,
                      ["class"]
                    ))
                  : e.createCommentVNode("", !0),
                e.unref(t).view === "list"
                  ? (e.openBlock(),
                    e.createBlock(
                      e.unref(Ai),
                      {
                        key: 1,
                        class: e.normalizeClass([
                          "vf-toolbar-icon",
                          c.value.length ? "vf-toolbar-icon-disabled" : ""
                        ])
                      },
                      null,
                      8,
                      ["class"]
                    ))
                  : e.createCommentVNode("", !0)
              ],
              8,
              Yi
            )
          ])
        ])
      );
    }
  },
  Ji = (n, t = 0, o = !1) => {
    let s;
    return (...r) => {
      o && !s && n(...r),
        clearTimeout(s),
        (s = setTimeout(() => {
          n(...r);
        }, t));
    };
  },
  oo = (n, t, o) => {
    const s = e.ref(n);
    return e.customRef((r, c) => ({
      get() {
        return r(), s.value;
      },
      set: Ji(
        a => {
          (s.value = a), c();
        },
        t,
        o
      )
    }));
  },
  Zi = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    "aria-hidden": "true",
    class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
    viewBox: "0 0 24 24"
  },
  Qi = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3"
    },
    null,
    -1
  ),
  ed = [Qi];
function td(n, t) {
  return e.openBlock(), e.createElementBlock("svg", Zi, [...ed]);
}
const nd = { render: td },
  od = { class: "vuefinder__move-modal__content" },
  rd = { class: "vuefinder__move-modal__description" },
  sd = { class: "vuefinder__move-modal__files vf-scrollbar" },
  ld = { class: "vuefinder__move-modal__file" },
  ad = {
    key: 0,
    class: "vuefinder__move-modal__icon vuefinder__move-modal__icon--dir",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "stroke-width": "1"
  },
  cd = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    },
    null,
    -1
  ),
  id = [cd],
  dd = {
    key: 1,
    class: "vuefinder__move-modal__icon",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "stroke-width": "1"
  },
  ud = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    },
    null,
    -1
  ),
  md = [ud],
  fd = { class: "vuefinder__move-modal__file-name" },
  _d = { class: "vuefinder__move-modal__target-title" },
  vd = { class: "vuefinder__move-modal__target-directory" },
  pd = e.createElementVNode(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      class: "vuefinder__move-modal__icon vuefinder__move-modal__icon--dir",
      fill: "none",
      viewBox: "0 0 24 24",
      stroke: "currentColor",
      "stroke-width": "1"
    },
    [
      e.createElementVNode("path", {
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      })
    ],
    -1
  ),
  hd = { class: "vuefinder__move-modal__target-path" },
  gd = { class: "vuefinder__move-modal__selected-items" },
  pn = {
    __name: "ModalMove",
    setup(n) {
      const t = e.inject("ServiceContainer"),
        { t: o } = t.i18n,
        s = e.ref(t.modal.data.items.from),
        r = e.ref(""),
        c = () => {
          s.value.length &&
            t.emitter.emit("vf-fetch", {
              params: {
                q: "move",
                m: "post",
                adapter: t.fs.adapter,
                path: t.fs.data.dirname
              },
              body: {
                items: s.value.map(({ path: a, type: i }) => ({
                  path: a,
                  type: i
                })),
                item: t.modal.data.items.to.path
              },
              onSuccess: () => {
                t.emitter.emit("vf-toast-push", {
                  label: o("Files moved.", t.modal.data.items.to.name)
                });
              },
              onError: a => {
                r.value = o(a.message);
              }
            });
        };
      return (a, i) => (
        e.openBlock(),
        e.createBlock($e, null, {
          buttons: e.withCtx(() => [
            e.createElementVNode(
              "button",
              { type: "button", onClick: c, class: "vf-btn vf-btn-primary" },
              e.toDisplayString(e.unref(o)("Yes, Move!")),
              1
            ),
            e.createElementVNode(
              "button",
              {
                type: "button",
                onClick: i[1] || (i[1] = l => e.unref(t).modal.close()),
                class: "vf-btn vf-btn-secondary"
              },
              e.toDisplayString(e.unref(o)("Cancel")),
              1
            ),
            e.createElementVNode(
              "div",
              gd,
              e.toDisplayString(
                e.unref(o)("%s item(s) selected.", s.value.length)
              ),
              1
            )
          ]),
          default: e.withCtx(() => [
            e.createElementVNode("div", null, [
              e.createVNode(
                Le,
                { icon: e.unref(nd), title: e.unref(o)("Move files") },
                null,
                8,
                ["icon", "title"]
              ),
              e.createElementVNode("div", od, [
                e.createElementVNode(
                  "p",
                  rd,
                  e.toDisplayString(
                    e.unref(o)("Are you sure you want to move these files?")
                  ),
                  1
                ),
                e.createElementVNode("div", sd, [
                  (e.openBlock(!0),
                  e.createElementBlock(
                    e.Fragment,
                    null,
                    e.renderList(
                      s.value,
                      l => (
                        e.openBlock(),
                        e.createElementBlock("div", ld, [
                          e.createElementVNode("div", null, [
                            l.type === "dir"
                              ? (e.openBlock(),
                                e.createElementBlock("svg", ad, id))
                              : (e.openBlock(),
                                e.createElementBlock("svg", dd, md))
                          ]),
                          e.createElementVNode(
                            "div",
                            fd,
                            e.toDisplayString(l.path),
                            1
                          )
                        ])
                      )
                    ),
                    256
                  ))
                ]),
                e.createElementVNode(
                  "h4",
                  _d,
                  e.toDisplayString(e.unref(o)("Target Directory")),
                  1
                ),
                e.createElementVNode("p", vd, [
                  pd,
                  e.createElementVNode(
                    "span",
                    hd,
                    e.toDisplayString(e.unref(t).modal.data.items.to.path),
                    1
                  )
                ]),
                r.value.length
                  ? (e.openBlock(),
                    e.createBlock(
                      Ce,
                      {
                        key: 0,
                        onHidden: i[0] || (i[0] = l => (r.value = "")),
                        error: ""
                      },
                      {
                        default: e.withCtx(() => [
                          e.createTextVNode(e.toDisplayString(r.value), 1)
                        ]),
                        _: 1
                      }
                    ))
                  : e.createCommentVNode("", !0)
              ])
            ])
          ]),
          _: 1
        })
      );
    }
  },
  kd = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "currentColor",
    class:
      "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer",
    viewBox: "-40 -40 580 580"
  },
  wd = e.createElementVNode(
    "path",
    {
      d: "M463.5 224h8.5c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2S461.9 48.1 455 55l-41.6 41.6c-87.6-86.5-228.7-86.2-315.8 1-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2S334.3 224 344 224z"
    },
    null,
    -1
  ),
  bd = [wd];
function yd(n, t) {
  return e.openBlock(), e.createElementBlock("svg", kd, [...bd]);
}
const Ed = { render: yd },
  Vd = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "currentColor",
    class: "h-6 w-6 p-0.5 rounded",
    viewBox: "0 0 20 20"
  },
  Sd = e.createElementVNode(
    "path",
    {
      "fill-rule": "evenodd",
      d: "M5.293 9.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L11 7.414V15a1 1 0 1 1-2 0V7.414L6.707 9.707a1 1 0 0 1-1.414 0",
      class: "pointer-events-none",
      "clip-rule": "evenodd"
    },
    null,
    -1
  ),
  Nd = [Sd];
function xd(n, t) {
  return e.openBlock(), e.createElementBlock("svg", Vd, [...Nd]);
}
const Bd = { render: xd },
  $d = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "1.5",
    class:
      "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer",
    viewBox: "0 0 24 24"
  },
  Cd = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M6 18 18 6M6 6l12 12"
    },
    null,
    -1
  ),
  Dd = [Cd];
function Td(n, t) {
  return e.openBlock(), e.createElementBlock("svg", $d, [...Dd]);
}
const Md = { render: Td },
  Ad = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "currentColor",
    class:
      "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
    viewBox: "0 0 20 20"
  },
  Ld = e.createElementVNode(
    "path",
    {
      d: "M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414z",
      class: "pointer-events-none"
    },
    null,
    -1
  ),
  Od = [Ld];
function Fd(n, t) {
  return e.openBlock(), e.createElementBlock("svg", Ad, [...Od]);
}
const Hd = { render: Fd },
  Rd = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "currentColor",
    class:
      "h-6 w-6 p-1 m-auto stroke-gray-400 fill-gray-100 dark:stroke-gray-400 dark:fill-gray-400/20",
    viewBox: "0 0 20 20"
  },
  zd = e.createElementVNode(
    "path",
    {
      d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607"
    },
    null,
    -1
  ),
  Id = [zd];
function Ud(n, t) {
  return e.openBlock(), e.createElementBlock("svg", Rd, [...Id]);
}
const qd = { render: Ud },
  jd = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "1.5",
    class: "w-6 h-6 cursor-pointer",
    viewBox: "0 0 24 24"
  },
  Pd = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M6 18 18 6M6 6l12 12"
    },
    null,
    -1
  ),
  Gd = [Pd];
function Kd(n, t) {
  return e.openBlock(), e.createElementBlock("svg", jd, [...Gd]);
}
const Wd = { render: Kd },
  Yd = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "currentColor",
    class:
      "text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
    viewBox: "0 0 24 24"
  },
  Xd = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2"
    },
    null,
    -1
  ),
  Jd = [Xd];
function Zd(n, t) {
  return e.openBlock(), e.createElementBlock("svg", Yd, [...Jd]);
}
const It = { render: Zd },
  Qd = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "currentColor",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "2",
    class:
      "h-6 w-6 p-1 rounded text-slate-700 dark:text-neutral-300 cursor-pointer",
    viewBox: "0 0 24 24"
  },
  eu = e.createElementVNode(
    "path",
    { stroke: "none", d: "M0 0h24v24H0z" },
    null,
    -1
  ),
  tu = e.createElementVNode(
    "path",
    { d: "M9 6h11M12 12h8M15 18h5M5 6v.01M8 12v.01M11 18v.01" },
    null,
    -1
  ),
  nu = [eu, tu];
function ou(n, t) {
  return e.openBlock(), e.createElementBlock("svg", Qd, [...nu]);
}
const ru = { render: ou },
  su = {
    xmlns: "http://www.w3.org/2000/svg",
    class:
      "h-6 w-6 rounded text-slate-700 hover:bg-neutral-100 dark:fill-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
    viewBox: "0 0 448 512"
  },
  lu = e.createElementVNode(
    "path",
    {
      d: "M8 256a56 56 0 1 1 112 0 56 56 0 1 1-112 0m160 0a56 56 0 1 1 112 0 56 56 0 1 1-112 0m216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112"
    },
    null,
    -1
  ),
  au = [lu];
function cu(n, t) {
  return e.openBlock(), e.createElementBlock("svg", su, [...au]);
}
const iu = { render: cu },
  du = { class: "vuefinder__breadcrumb__container" },
  uu = ["title"],
  mu = ["title"],
  fu = ["title"],
  _u = ["title"],
  vu = { class: "vuefinder__breadcrumb__list" },
  pu = { key: 0, class: "vuefinder__breadcrumb__hidden-list" },
  hu = e.createElementVNode(
    "div",
    { class: "vuefinder__breadcrumb__separator" },
    "/",
    -1
  ),
  gu = { class: "relative" },
  ku = e.createElementVNode(
    "span",
    { class: "vuefinder__breadcrumb__separator" },
    "/",
    -1
  ),
  wu = ["onDragover", "onDragleave", "onDrop", "title", "onClick"],
  bu = { class: "vuefinder__breadcrumb__search-mode" },
  yu = ["placeholder"],
  Eu = { class: "vuefinder__breadcrumb__hidden-dropdown" },
  Vu = ["onDrop", "onClick"],
  Su = { class: "vuefinder__breadcrumb__hidden-item-content" },
  Nu = { class: "vuefinder__breadcrumb__hidden-item-text" },
  xu = {
    __name: "Breadcrumb",
    setup(n) {
      const t = e.inject("ServiceContainer"),
        { t: o } = t.i18n,
        s = t.dragSelect,
        { setStore: r } = t.storage,
        c = e.ref(null),
        a = oo(0, 100);
      e.watch(a, x => {
        const b = c.value.children;
        let h = 0,
          y = 0,
          E = 5,
          M = 1;
        t.fs.limitBreadcrumbItems(E),
          e.nextTick(() => {
            for (
              let g = b.length - 1;
              g >= 0 && !(h + b[g].offsetWidth > a.value - 40);
              g--
            )
              (h += parseInt(b[g].offsetWidth, 10)), y++;
            y < M && (y = M), y > E && (y = E), t.fs.limitBreadcrumbItems(y);
          });
      });
      const i = () => {
        a.value = c.value.offsetWidth;
      };
      let l = e.ref(null);
      e.onMounted(() => {
        (l.value = new ResizeObserver(i)), l.value.observe(c.value);
      }),
        e.onUnmounted(() => {
          l.value.disconnect();
        });
      const d = (x, b = null) => {
          x.preventDefault(),
            (s.isDraggingRef.value = !1),
            _(x),
            b ?? (b = t.fs.hiddenBreadcrumbs.length - 1);
          let h = JSON.parse(x.dataTransfer.getData("items"));
          if (h.find(y => y.storage !== t.fs.adapter)) {
            alert(
              "Moving items between different storages is not supported yet."
            );
            return;
          }
          t.modal.open(pn, {
            items: {
              from: h,
              to: t.fs.hiddenBreadcrumbs[b] ?? { path: t.fs.adapter + "://" }
            }
          });
        },
        m = (x, b = null) => {
          x.preventDefault(),
            (s.isDraggingRef.value = !1),
            _(x),
            b ?? (b = t.fs.breadcrumbs.length - 2);
          let h = JSON.parse(x.dataTransfer.getData("items"));
          if (h.find(y => y.storage !== t.fs.adapter)) {
            alert(
              "Moving items between different storages is not supported yet."
            );
            return;
          }
          t.modal.open(pn, {
            items: {
              from: h,
              to: t.fs.breadcrumbs[b] ?? { path: t.fs.adapter + "://" }
            }
          });
        },
        u = x => {
          x.preventDefault(),
            t.fs.isGoUpAvailable()
              ? ((x.dataTransfer.dropEffect = "copy"),
                x.currentTarget.classList.add(
                  "bg-blue-200",
                  "dark:bg-slate-600"
                ))
              : ((x.dataTransfer.dropEffect = "none"),
                (x.dataTransfer.effectAllowed = "none"));
        },
        _ = x => {
          x.preventDefault(),
            x.currentTarget.classList.remove(
              "bg-blue-200",
              "dark:bg-slate-600"
            ),
            t.fs.isGoUpAvailable() &&
              x.currentTarget.classList.remove(
                "bg-blue-200",
                "dark:bg-slate-600"
              );
        },
        f = () => {
          B(),
            t.emitter.emit("vf-fetch", {
              params: {
                q: "index",
                adapter: t.fs.adapter,
                path: t.fs.data.dirname
              }
            });
        },
        v = () => {
          B(),
            !t.fs.isGoUpAvailable() ||
              t.emitter.emit("vf-fetch", {
                params: {
                  q: "index",
                  adapter: t.fs.adapter,
                  path: t.fs.parentFolderPath
                }
              });
        },
        k = x => {
          t.emitter.emit("vf-fetch", {
            params: { q: "index", adapter: t.fs.adapter, path: x.path }
          }),
            t.fs.toggleHiddenBreadcrumbs(!1);
        },
        p = () => {
          t.fs.showHiddenBreadcrumbs && t.fs.toggleHiddenBreadcrumbs(!1);
        },
        S = {
          mounted(x, b, h, y) {
            (x.clickOutsideEvent = function (E) {
              x === E.target || x.contains(E.target) || b.value();
            }),
              document.body.addEventListener("click", x.clickOutsideEvent);
          },
          beforeUnmount(x, b, h, y) {
            document.body.removeEventListener("click", x.clickOutsideEvent);
          }
        },
        T = () => {
          t.showTreeView = !t.showTreeView;
        };
      e.watch(
        () => t.showTreeView,
        (x, b) => {
          x !== b && r("show-tree-view", x);
        }
      );
      const C = e.ref(null),
        w = () => {
          t.features.includes(Z.SEARCH) &&
            ((t.fs.searchMode = !0), e.nextTick(() => C.value.focus()));
        },
        N = oo("", 400);
      e.watch(N, x => {
        t.emitter.emit("vf-toast-clear"),
          t.emitter.emit("vf-search-query", { newQuery: x });
      }),
        e.watch(
          () => t.fs.searchMode,
          x => {
            x && e.nextTick(() => C.value.focus());
          }
        );
      const B = () => {
        (t.fs.searchMode = !1), (N.value = "");
      };
      t.emitter.on("vf-search-exit", () => {
        B();
      });
      const F = () => {
        N.value === "" && B();
      };
      return (x, b) => (
        e.openBlock(),
        e.createElementBlock("div", du, [
          e.createElementVNode(
            "span",
            { title: e.unref(o)("Toggle Tree View") },
            [
              e.createVNode(
                e.unref(ru),
                {
                  onClick: T,
                  class: e.normalizeClass([
                    "vuefinder__breadcrumb__toggle-tree",
                    e.unref(t).showTreeView
                      ? "vuefinder__breadcrumb__toggle-tree--active"
                      : ""
                  ])
                },
                null,
                8,
                ["class"]
              )
            ],
            8,
            uu
          ),
          e.createElementVNode(
            "span",
            { title: e.unref(o)("Go up a directory") },
            [
              e.createVNode(
                e.unref(Bd),
                {
                  onDragover: b[0] || (b[0] = h => u(h)),
                  onDragleave: b[1] || (b[1] = h => _(h)),
                  onDrop: b[2] || (b[2] = h => m(h)),
                  onClick: v,
                  class: e.normalizeClass(
                    e.unref(t).fs.isGoUpAvailable()
                      ? "vuefinder__breadcrumb__go-up--active"
                      : "vuefinder__breadcrumb__go-up--inactive"
                  )
                },
                null,
                8,
                ["class"]
              )
            ],
            8,
            mu
          ),
          e.unref(t).fs.loading
            ? (e.openBlock(),
              e.createElementBlock(
                "span",
                { key: 1, title: e.unref(o)("Cancel") },
                [
                  e.createVNode(e.unref(Md), {
                    onClick:
                      b[3] ||
                      (b[3] = h => e.unref(t).emitter.emit("vf-fetch-abort"))
                  })
                ],
                8,
                _u
              ))
            : (e.openBlock(),
              e.createElementBlock(
                "span",
                { key: 0, title: e.unref(o)("Refresh") },
                [e.createVNode(e.unref(Ed), { onClick: f })],
                8,
                fu
              )),
          e.withDirectives(
            e.createElementVNode(
              "div",
              {
                onClick: e.withModifiers(w, ["self"]),
                class: "group vuefinder__breadcrumb__search-container"
              },
              [
                e.createElementVNode("div", null, [
                  e.createVNode(e.unref(Hd), {
                    onDragover: b[4] || (b[4] = h => u(h)),
                    onDragleave: b[5] || (b[5] = h => _(h)),
                    onDrop: b[6] || (b[6] = h => m(h, -1)),
                    onClick:
                      b[7] ||
                      (b[7] = h =>
                        e
                          .unref(t)
                          .emitter.emit("vf-fetch", {
                            params: {
                              q: "index",
                              adapter: e.unref(t).fs.adapter
                            }
                          }))
                  })
                ]),
                e.createElementVNode("div", vu, [
                  e.unref(t).fs.hiddenBreadcrumbs.length
                    ? e.withDirectives(
                        (e.openBlock(),
                        e.createElementBlock("div", pu, [
                          hu,
                          e.createElementVNode("div", gu, [
                            e.createElementVNode(
                              "span",
                              {
                                onDragenter:
                                  b[8] ||
                                  (b[8] = h =>
                                    e.unref(t).fs.toggleHiddenBreadcrumbs(!0)),
                                onClick:
                                  b[9] ||
                                  (b[9] = h =>
                                    e.unref(t).fs.toggleHiddenBreadcrumbs()),
                                class: "vuefinder__breadcrumb__hidden-toggle"
                              },
                              [
                                e.createVNode(e.unref(iu), {
                                  class:
                                    "vuefinder__breadcrumb__hidden-toggle-icon"
                                })
                              ],
                              32
                            )
                          ])
                        ])),
                        [[S, p]]
                      )
                    : e.createCommentVNode("", !0)
                ]),
                e.createElementVNode(
                  "div",
                  {
                    ref_key: "breadcrumbContainer",
                    ref: c,
                    class: "vuefinder__breadcrumb__visible-list",
                    onClick: e.withModifiers(w, ["self"])
                  },
                  [
                    (e.openBlock(!0),
                    e.createElementBlock(
                      e.Fragment,
                      null,
                      e.renderList(
                        e.unref(t).fs.breadcrumbs,
                        (h, y) => (
                          e.openBlock(),
                          e.createElementBlock("div", { key: y }, [
                            ku,
                            e.createElementVNode(
                              "span",
                              {
                                onDragover: E =>
                                  y === e.unref(t).fs.breadcrumbs.length - 1 ||
                                  u(E),
                                onDragleave: E =>
                                  y === e.unref(t).fs.breadcrumbs.length - 1 ||
                                  _(E),
                                onDrop: E =>
                                  y === e.unref(t).fs.breadcrumbs.length - 1 ||
                                  m(E, y),
                                class: "vuefinder__breadcrumb__item",
                                title: h.basename,
                                onClick: E =>
                                  e
                                    .unref(t)
                                    .emitter.emit("vf-fetch", {
                                      params: {
                                        q: "index",
                                        adapter: e.unref(t).fs.adapter,
                                        path: h.path
                                      }
                                    })
                              },
                              e.toDisplayString(h.name),
                              41,
                              wu
                            )
                          ])
                        )
                      ),
                      128
                    ))
                  ],
                  512
                ),
                e.unref(t).fs.loading
                  ? (e.openBlock(), e.createBlock(e.unref(Mn), { key: 0 }))
                  : e.createCommentVNode("", !0)
              ],
              512
            ),
            [[e.vShow, !e.unref(t).fs.searchMode]]
          ),
          e.withDirectives(
            e.createElementVNode(
              "div",
              bu,
              [
                e.createElementVNode("div", null, [e.createVNode(e.unref(qd))]),
                e.withDirectives(
                  e.createElementVNode(
                    "input",
                    {
                      ref_key: "searchInput",
                      ref: C,
                      onKeydown: e.withKeys(B, ["esc"]),
                      onBlur: F,
                      "onUpdate:modelValue":
                        b[10] ||
                        (b[10] = h => (e.isRef(N) ? (N.value = h) : null)),
                      placeholder: e.unref(o)("Search anything.."),
                      class: "vuefinder__breadcrumb__search-input",
                      type: "text"
                    },
                    null,
                    40,
                    yu
                  ),
                  [[e.vModelText, e.unref(N)]]
                ),
                e.createVNode(e.unref(Wd), { onClick: B })
              ],
              512
            ),
            [[e.vShow, e.unref(t).fs.searchMode]]
          ),
          e.withDirectives(
            e.createElementVNode(
              "div",
              Eu,
              [
                (e.openBlock(!0),
                e.createElementBlock(
                  e.Fragment,
                  null,
                  e.renderList(
                    e.unref(t).fs.hiddenBreadcrumbs,
                    (h, y) => (
                      e.openBlock(),
                      e.createElementBlock(
                        "div",
                        {
                          key: y,
                          onDragover: b[11] || (b[11] = E => u(E)),
                          onDragleave: b[12] || (b[12] = E => _(E)),
                          onDrop: E => d(E, y),
                          onClick: E => k(h),
                          class: "vuefinder__breadcrumb__hidden-item"
                        },
                        [
                          e.createElementVNode("div", Su, [
                            e.createElementVNode("span", null, [
                              e.createVNode(e.unref(It), {
                                class: "vuefinder__breadcrumb__hidden-item-icon"
                              })
                            ]),
                            e.createTextVNode(),
                            e.createElementVNode(
                              "span",
                              Nu,
                              e.toDisplayString(h.name),
                              1
                            )
                          ])
                        ],
                        40,
                        Vu
                      )
                    )
                  ),
                  128
                ))
              ],
              512
            ),
            [[e.vShow, e.unref(t).fs.showHiddenBreadcrumbs]]
          )
        ])
      );
    }
  },
  ar = (n, t = null) =>
    new Date(n * 1e3).toLocaleString(t ?? navigator.language ?? "en-US"),
  Bu = ["onClick"],
  $u = {
    __name: "Toast",
    setup(n) {
      const t = e.inject("ServiceContainer"),
        { getStore: o } = t.storage,
        s = e.ref(o("full-screen", !1)),
        r = e.ref([]),
        c = l =>
          l === "error"
            ? "text-red-400 border-red-400 dark:text-red-300 dark:border-red-300"
            : "text-lime-600 border-lime-600 dark:text-lime-300 dark:border-lime-1300",
        a = l => {
          r.value.splice(l, 1);
        },
        i = l => {
          let d = r.value.findIndex(m => m.id === l);
          d !== -1 && a(d);
        };
      return (
        t.emitter.on("vf-toast-clear", () => {
          r.value = [];
        }),
        t.emitter.on("vf-toast-push", l => {
          let d = new Date()
            .getTime()
            .toString(36)
            .concat(performance.now().toString(), Math.random().toString())
            .replace(/\./g, "");
          (l.id = d),
            r.value.push(l),
            setTimeout(() => {
              i(d);
            }, 5e3);
        }),
        (l, d) => (
          e.openBlock(),
          e.createElementBlock(
            "div",
            {
              class: e.normalizeClass([
                "vuefinder__toast",
                s.value.value
                  ? "vuefinder__toast--fixed"
                  : "vuefinder__toast--absolute"
              ])
            },
            [
              e.createVNode(
                e.TransitionGroup,
                {
                  name: "vuefinder__toast-item",
                  "enter-active-class": "vuefinder__toast-item--enter-active",
                  "leave-active-class": "vuefinder__toast-item--leave-active",
                  "leave-to-class": "vuefinder__toast-item--leave-to"
                },
                {
                  default: e.withCtx(() => [
                    (e.openBlock(!0),
                    e.createElementBlock(
                      e.Fragment,
                      null,
                      e.renderList(
                        r.value,
                        (m, u) => (
                          e.openBlock(),
                          e.createElementBlock(
                            "div",
                            {
                              key: u,
                              onClick: _ => a(u),
                              class: e.normalizeClass([
                                "vuefinder__toast__message",
                                c(m.type)
                              ])
                            },
                            e.toDisplayString(m.label),
                            11,
                            Bu
                          )
                        )
                      ),
                      128
                    ))
                  ]),
                  _: 1
                }
              )
            ],
            2
          )
        )
      );
    }
  },
  Cu = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "currentColor",
    class: "h-5 w-5",
    viewBox: "0 0 20 20"
  },
  Du = e.createElementVNode(
    "path",
    {
      "fill-rule": "evenodd",
      d: "M5.293 7.293a1 1 0 0 1 1.414 0L10 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414",
      "clip-rule": "evenodd"
    },
    null,
    -1
  ),
  Tu = [Du];
function Mu(n, t) {
  return e.openBlock(), e.createElementBlock("svg", Cu, [...Tu]);
}
const Au = { render: Mu },
  Lu = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "currentColor",
    class: "h-5 w-5",
    viewBox: "0 0 20 20"
  },
  Ou = e.createElementVNode(
    "path",
    {
      "fill-rule": "evenodd",
      d: "M14.707 12.707a1 1 0 0 1-1.414 0L10 9.414l-3.293 3.293a1 1 0 0 1-1.414-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414",
      "clip-rule": "evenodd"
    },
    null,
    -1
  ),
  Fu = [Ou];
function Hu(n, t) {
  return e.openBlock(), e.createElementBlock("svg", Lu, [...Fu]);
}
const Ru = { render: Hu },
  wt = {
    __name: "SortIcon",
    props: { direction: String },
    setup(n) {
      return (t, o) => (
        e.openBlock(),
        e.createElementBlock("div", null, [
          n.direction === "asc"
            ? (e.openBlock(), e.createBlock(e.unref(Au), { key: 0 }))
            : e.createCommentVNode("", !0),
          n.direction === "desc"
            ? (e.openBlock(), e.createBlock(e.unref(Ru), { key: 1 }))
            : e.createCommentVNode("", !0)
        ])
      );
    }
  },
  zu = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "currentColor",
    class: "text-neutral-500",
    viewBox: "0 0 24 24"
  },
  Iu = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2"
    },
    null,
    -1
  ),
  Uu = [Iu];
function qu(n, t) {
  return e.openBlock(), e.createElementBlock("svg", zu, [...Uu]);
}
const ju = { render: qu },
  Pu = { class: "vuefinder__item-icon" },
  Jt = {
    __name: "ItemIcon",
    props: {
      type: { type: String, required: !0 },
      small: { type: Boolean, default: !1 }
    },
    setup(n) {
      return (t, o) => (
        e.openBlock(),
        e.createElementBlock("span", Pu, [
          n.type === "dir"
            ? (e.openBlock(),
              e.createBlock(
                e.unref(It),
                {
                  key: 0,
                  class: e.normalizeClass(
                    n.small
                      ? "vuefinder__item-icon--small"
                      : "vuefinder__item-icon--large"
                  )
                },
                null,
                8,
                ["class"]
              ))
            : (e.openBlock(),
              e.createBlock(
                e.unref(ju),
                {
                  key: 1,
                  class: e.normalizeClass(
                    n.small
                      ? "vuefinder__item-icon--small"
                      : "vuefinder__item-icon--large"
                  )
                },
                null,
                8,
                ["class"]
              ))
        ])
      );
    }
  },
  Gu = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "currentColor",
    class:
      "absolute h-6 w-6 md:h-12 md:w-12 m-auto stroke-neutral-500 fill-white dark:fill-gray-700 dark:stroke-gray-600 z-10",
    viewBox: "0 0 24 24"
  },
  Ku = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2"
    },
    null,
    -1
  ),
  Wu = [Ku];
function Yu(n, t) {
  return e.openBlock(), e.createElementBlock("svg", Gu, [...Wu]);
}
const Xu = { render: Yu },
  Ju = { class: "vuefinder__drag-item__container" },
  Zu = { class: "vuefinder__drag-item__count" },
  Qu = {
    __name: "DragItem",
    props: { count: { type: Number, default: 0 } },
    setup(n) {
      const t = n;
      return (o, s) => (
        e.openBlock(),
        e.createElementBlock("div", Ju, [
          e.createVNode(e.unref(Xu)),
          e.createElementVNode("div", Zu, e.toDisplayString(t.count), 1)
        ])
      );
    }
  },
  em = { class: "vuefinder__text-preview" },
  tm = { class: "vuefinder__text-preview__header" },
  nm = ["title"],
  om = { class: "vuefinder__text-preview__actions" },
  rm = { key: 0, class: "vuefinder__text-preview__content" },
  sm = { key: 1 },
  lm = {
    __name: "Text",
    emits: ["success"],
    setup(n, { emit: t }) {
      const o = t,
        s = e.ref(""),
        r = e.ref(""),
        c = e.ref(null),
        a = e.ref(!1),
        i = e.ref(""),
        l = e.ref(!1),
        d = e.inject("ServiceContainer"),
        { t: m } = d.i18n;
      e.onMounted(() => {
        d.requester
          .send({
            url: "",
            method: "get",
            params: {
              q: "preview",
              adapter: d.modal.data.adapter,
              path: d.modal.data.item.path
            },
            responseType: "text"
          })
          .then(f => {
            (s.value = f), o("success");
          });
      });
      const u = () => {
          (a.value = !a.value), (r.value = s.value);
        },
        _ = () => {
          (i.value = ""),
            (l.value = !1),
            d.requester
              .send({
                url: "",
                method: "post",
                params: {
                  q: "save",
                  adapter: d.modal.data.adapter,
                  path: d.modal.data.item.path
                },
                body: { content: r.value },
                responseType: "text"
              })
              .then(f => {
                (i.value = m("Updated.")),
                  (s.value = f),
                  o("success"),
                  (a.value = !a.value);
              })
              .catch(f => {
                (i.value = m(f.message)), (l.value = !0);
              });
        };
      return (f, v) => (
        e.openBlock(),
        e.createElementBlock("div", em, [
          e.createElementVNode("div", tm, [
            e.createElementVNode(
              "div",
              {
                class: "vuefinder__text-preview__title",
                id: "modal-title",
                title: e.unref(d).modal.data.item.path
              },
              e.toDisplayString(e.unref(d).modal.data.item.basename),
              9,
              nm
            ),
            e.createElementVNode("div", om, [
              a.value
                ? (e.openBlock(),
                  e.createElementBlock(
                    "button",
                    {
                      key: 0,
                      onClick: _,
                      class: "vuefinder__text-preview__save-button"
                    },
                    e.toDisplayString(e.unref(m)("Save")),
                    1
                  ))
                : e.createCommentVNode("", !0),
              e.unref(d).features.includes(e.unref(Z).EDIT)
                ? (e.openBlock(),
                  e.createElementBlock(
                    "button",
                    {
                      key: 1,
                      class: "vuefinder__text-preview__edit-button",
                      onClick: v[0] || (v[0] = k => u())
                    },
                    e.toDisplayString(
                      a.value ? e.unref(m)("Cancel") : e.unref(m)("Edit")
                    ),
                    1
                  ))
                : e.createCommentVNode("", !0)
            ])
          ]),
          e.createElementVNode("div", null, [
            a.value
              ? (e.openBlock(),
                e.createElementBlock("div", sm, [
                  e.withDirectives(
                    e.createElementVNode(
                      "textarea",
                      {
                        ref_key: "editInput",
                        ref: c,
                        "onUpdate:modelValue":
                          v[1] || (v[1] = k => (r.value = k)),
                        class: "vuefinder__text-preview__textarea",
                        name: "text",
                        cols: "30",
                        rows: "10"
                      },
                      null,
                      512
                    ),
                    [[e.vModelText, r.value]]
                  )
                ]))
              : (e.openBlock(),
                e.createElementBlock("pre", rm, e.toDisplayString(s.value), 1)),
            i.value.length
              ? (e.openBlock(),
                e.createBlock(
                  Ce,
                  {
                    key: 2,
                    onHidden: v[2] || (v[2] = k => (i.value = "")),
                    error: l.value
                  },
                  {
                    default: e.withCtx(() => [
                      e.createTextVNode(e.toDisplayString(i.value), 1)
                    ]),
                    _: 1
                  },
                  8,
                  ["error"]
                ))
              : e.createCommentVNode("", !0)
          ])
        ])
      );
    }
  },
  am = { class: "vuefinder__image-preview" },
  cm = { class: "vuefinder__image-preview__header" },
  im = ["title"],
  dm = { class: "vuefinder__image-preview__actions" },
  um = { class: "vuefinder__image-preview__image-container" },
  mm = ["src"],
  fm = {
    __name: "Image",
    emits: ["success"],
    setup(n, { emit: t }) {
      const o = t,
        s = e.inject("ServiceContainer"),
        { t: r } = s.i18n,
        c = e.ref(null),
        a = e.ref(null),
        i = e.ref(!1),
        l = e.ref(""),
        d = e.ref(!1),
        m = () => {
          (i.value = !i.value),
            i.value
              ? (a.value = new Br(c.value, { crop(_) {} }))
              : a.value.destroy();
        },
        u = () => {
          a.value.getCroppedCanvas({ width: 795, height: 341 }).toBlob(_ => {
            (l.value = ""), (d.value = !1);
            const f = new FormData();
            f.set("file", _),
              s.requester
                .send({
                  url: "",
                  method: "post",
                  params: {
                    q: "upload",
                    adapter: s.modal.data.adapter,
                    path: s.modal.data.item.path
                  },
                  body: f
                })
                .then(v => {
                  (l.value = r("Updated.")),
                    (c.value.src = s.requester.getPreviewUrl(
                      s.modal.data.adapter,
                      s.modal.data.item
                    )),
                    m(),
                    o("success");
                })
                .catch(v => {
                  (l.value = r(v.message)), (d.value = !0);
                });
          });
        };
      return (
        e.onMounted(() => {
          o("success");
        }),
        (_, f) => (
          e.openBlock(),
          e.createElementBlock("div", am, [
            e.createElementVNode("div", cm, [
              e.createElementVNode(
                "h3",
                {
                  class: "vuefinder__image-preview__title",
                  id: "modal-title",
                  title: e.unref(s).modal.data.item.path
                },
                e.toDisplayString(e.unref(s).modal.data.item.basename),
                9,
                im
              ),
              e.createElementVNode("div", dm, [
                i.value
                  ? (e.openBlock(),
                    e.createElementBlock(
                      "button",
                      {
                        key: 0,
                        onClick: u,
                        class: "vuefinder__image-preview__crop-button"
                      },
                      e.toDisplayString(e.unref(r)("Crop")),
                      1
                    ))
                  : e.createCommentVNode("", !0),
                e.unref(s).features.includes(e.unref(Z).EDIT)
                  ? (e.openBlock(),
                    e.createElementBlock(
                      "button",
                      {
                        key: 1,
                        class: "vuefinder__image-preview__edit-button",
                        onClick: f[0] || (f[0] = v => m())
                      },
                      e.toDisplayString(
                        i.value ? e.unref(r)("Cancel") : e.unref(r)("Edit")
                      ),
                      1
                    ))
                  : e.createCommentVNode("", !0)
              ])
            ]),
            e.createElementVNode("div", um, [
              e.createElementVNode(
                "img",
                {
                  ref_key: "image",
                  ref: c,
                  class: "vuefinder__image-preview__image",
                  src: e
                    .unref(s)
                    .requester.getPreviewUrl(
                      e.unref(s).modal.data.adapter,
                      e.unref(s).modal.data.item
                    ),
                  alt: ""
                },
                null,
                8,
                mm
              )
            ]),
            l.value.length
              ? (e.openBlock(),
                e.createBlock(
                  Ce,
                  {
                    key: 0,
                    onHidden: f[1] || (f[1] = v => (l.value = "")),
                    error: d.value
                  },
                  {
                    default: e.withCtx(() => [
                      e.createTextVNode(e.toDisplayString(l.value), 1)
                    ]),
                    _: 1
                  },
                  8,
                  ["error"]
                ))
              : e.createCommentVNode("", !0)
          ])
        )
      );
    }
  },
  _m = { class: "vuefinder__default-preview" },
  vm = { class: "vuefinder__default-preview__header" },
  pm = ["title"],
  hm = e.createElementVNode("div", null, null, -1),
  gm = {
    __name: "Default",
    emits: ["success"],
    setup(n, { emit: t }) {
      const o = e.inject("ServiceContainer"),
        s = t;
      return (
        e.onMounted(() => {
          s("success");
        }),
        (r, c) => (
          e.openBlock(),
          e.createElementBlock("div", _m, [
            e.createElementVNode("div", vm, [
              e.createElementVNode(
                "h3",
                {
                  class: "vuefinder__default-preview__title",
                  id: "modal-title",
                  title: e.unref(o).modal.data.item.path
                },
                e.toDisplayString(e.unref(o).modal.data.item.basename),
                9,
                pm
              )
            ]),
            hm
          ])
        )
      );
    }
  },
  km = { class: "vuefinder__video-preview" },
  wm = ["title"],
  bm = { class: "vuefinder__video-preview__video", preload: "", controls: "" },
  ym = ["src"],
  Em = {
    __name: "Video",
    emits: ["success"],
    setup(n, { emit: t }) {
      const o = e.inject("ServiceContainer"),
        s = t,
        r = () =>
          o.requester.getPreviewUrl(o.modal.data.adapter, o.modal.data.item);
      return (
        e.onMounted(() => {
          s("success");
        }),
        (c, a) => (
          e.openBlock(),
          e.createElementBlock("div", km, [
            e.createElementVNode(
              "h3",
              {
                class: "vuefinder__video-preview__title",
                id: "modal-title",
                title: e.unref(o).modal.data.item.path
              },
              e.toDisplayString(e.unref(o).modal.data.item.basename),
              9,
              wm
            ),
            e.createElementVNode("div", null, [
              e.createElementVNode("video", bm, [
                e.createElementVNode(
                  "source",
                  { src: r(), type: "video/mp4" },
                  null,
                  8,
                  ym
                ),
                e.createTextVNode(
                  " Your browser does not support the video tag. "
                )
              ])
            ])
          ])
        )
      );
    }
  },
  Vm = { class: "vuefinder__audio-preview" },
  Sm = ["title"],
  Nm = { class: "vuefinder__audio-preview__audio", controls: "" },
  xm = ["src"],
  Bm = {
    __name: "Audio",
    emits: ["success"],
    setup(n, { emit: t }) {
      const o = t,
        s = e.inject("ServiceContainer"),
        r = () =>
          s.requester.getPreviewUrl(s.modal.data.adapter, s.modal.data.item);
      return (
        e.onMounted(() => {
          o("success");
        }),
        (c, a) => (
          e.openBlock(),
          e.createElementBlock("div", Vm, [
            e.createElementVNode(
              "h3",
              {
                class: "vuefinder__audio-preview__title",
                id: "modal-title",
                title: e.unref(s).modal.data.item.path
              },
              e.toDisplayString(e.unref(s).modal.data.item.basename),
              9,
              Sm
            ),
            e.createElementVNode("div", null, [
              e.createElementVNode("audio", Nm, [
                e.createElementVNode(
                  "source",
                  { src: r(), type: "audio/mpeg" },
                  null,
                  8,
                  xm
                ),
                e.createTextVNode(
                  " Your browser does not support the audio element. "
                )
              ])
            ])
          ])
        )
      );
    }
  },
  $m = { class: "vuefinder__pdf-preview" },
  Cm = ["title"],
  Dm = ["data"],
  Tm = ["src"],
  Mm = e.createElementVNode(
    "p",
    null,
    [
      e.createTextVNode(" Your browser does not support PDFs. "),
      e.createElementVNode(
        "a",
        { href: "https://example.com/test.pdf" },
        "Download the PDF"
      ),
      e.createTextVNode(". ")
    ],
    -1
  ),
  Am = [Mm],
  Lm = {
    __name: "Pdf",
    emits: ["success"],
    setup(n, { emit: t }) {
      const o = e.inject("ServiceContainer"),
        s = t,
        r = () =>
          o.requester.getPreviewUrl(o.modal.data.adapter, o.modal.data.item);
      return (
        e.onMounted(() => {
          s("success");
        }),
        (c, a) => (
          e.openBlock(),
          e.createElementBlock("div", $m, [
            e.createElementVNode(
              "h3",
              {
                class: "vuefinder__pdf-preview__title",
                id: "modal-title",
                title: e.unref(o).modal.data.item.path
              },
              e.toDisplayString(e.unref(o).modal.data.item.basename),
              9,
              Cm
            ),
            e.createElementVNode("div", null, [
              e.createElementVNode(
                "object",
                {
                  class: "vuefinder__pdf-preview__object",
                  data: r(),
                  type: "application/pdf",
                  width: "100%",
                  height: "100%"
                },
                [
                  e.createElementVNode(
                    "iframe",
                    {
                      class: "vuefinder__pdf-preview__iframe",
                      src: r(),
                      width: "100%",
                      height: "100%"
                    },
                    Am,
                    8,
                    Tm
                  )
                ],
                8,
                Dm
              )
            ])
          ])
        )
      );
    }
  },
  Om = { class: "vuefinder__preview-modal__content" },
  Fm = { key: 0 },
  Hm = { class: "vuefinder__preview-modal__loading" },
  Rm = { key: 0, class: "vuefinder__preview-modal__loading-indicator" },
  zm = e.createElementVNode(
    "svg",
    {
      class: "vuefinder__preview-modal__spinner",
      xmlns: "http://www.w3.org/2000/svg",
      fill: "none",
      viewBox: "0 0 24 24"
    },
    [
      e.createElementVNode("circle", {
        class: "vuefinder__preview-modal__spinner-circle",
        cx: "12",
        cy: "12",
        r: "10",
        stroke: "currentColor",
        "stroke-width": "4"
      }),
      e.createElementVNode("path", {
        class: "vuefinder__preview-modal__spinner-path",
        fill: "currentColor",
        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      })
    ],
    -1
  ),
  Im = { class: "vuefinder__preview-modal__details" },
  Um = { class: "font-bold" },
  qm = { class: "font-bold pl-2" },
  jm = { key: 0, class: "vuefinder__preview-modal__note" },
  Pm = ["download", "href"],
  cr = {
    __name: "ModalPreview",
    setup(n) {
      const t = e.inject("ServiceContainer"),
        { t: o } = t.i18n,
        s = e.ref(!1),
        r = a => (t.modal.data.item.mime_type ?? "").startsWith(a),
        c = t.features.includes(Z.PREVIEW);
      return (
        c || (s.value = !0),
        (a, i) => (
          e.openBlock(),
          e.createBlock($e, null, {
            buttons: e.withCtx(() => [
              e.createElementVNode(
                "button",
                {
                  type: "button",
                  onClick: i[6] || (i[6] = l => e.unref(t).modal.close()),
                  class: "vf-btn vf-btn-secondary"
                },
                e.toDisplayString(e.unref(o)("Close")),
                1
              ),
              e.unref(t).features.includes(e.unref(Z).DOWNLOAD)
                ? (e.openBlock(),
                  e.createElementBlock(
                    "a",
                    {
                      key: 0,
                      target: "_blank",
                      class: "vf-btn vf-btn-primary",
                      download: e
                        .unref(t)
                        .requester.getDownloadUrl(
                          e.unref(t).modal.data.adapter,
                          e.unref(t).modal.data.item
                        ),
                      href: e
                        .unref(t)
                        .requester.getDownloadUrl(
                          e.unref(t).modal.data.adapter,
                          e.unref(t).modal.data.item
                        )
                    },
                    e.toDisplayString(e.unref(o)("Download")),
                    9,
                    Pm
                  ))
                : e.createCommentVNode("", !0)
            ]),
            default: e.withCtx(() => [
              e.createElementVNode("div", null, [
                e.createElementVNode("div", Om, [
                  e.unref(c)
                    ? (e.openBlock(),
                      e.createElementBlock("div", Fm, [
                        r("text")
                          ? (e.openBlock(),
                            e.createBlock(lm, {
                              key: 0,
                              onSuccess: i[0] || (i[0] = l => (s.value = !0))
                            }))
                          : r("image")
                          ? (e.openBlock(),
                            e.createBlock(fm, {
                              key: 1,
                              onSuccess: i[1] || (i[1] = l => (s.value = !0))
                            }))
                          : r("video")
                          ? (e.openBlock(),
                            e.createBlock(Em, {
                              key: 2,
                              onSuccess: i[2] || (i[2] = l => (s.value = !0))
                            }))
                          : r("audio")
                          ? (e.openBlock(),
                            e.createBlock(Bm, {
                              key: 3,
                              onSuccess: i[3] || (i[3] = l => (s.value = !0))
                            }))
                          : r("application/pdf")
                          ? (e.openBlock(),
                            e.createBlock(Lm, {
                              key: 4,
                              onSuccess: i[4] || (i[4] = l => (s.value = !0))
                            }))
                          : (e.openBlock(),
                            e.createBlock(gm, {
                              key: 5,
                              onSuccess: i[5] || (i[5] = l => (s.value = !0))
                            }))
                      ]))
                    : e.createCommentVNode("", !0),
                  e.createElementVNode("div", Hm, [
                    s.value === !1
                      ? (e.openBlock(),
                        e.createElementBlock("div", Rm, [
                          zm,
                          e.createElementVNode(
                            "span",
                            null,
                            e.toDisplayString(e.unref(o)("Loading")),
                            1
                          )
                        ]))
                      : e.createCommentVNode("", !0)
                  ])
                ])
              ]),
              e.createElementVNode("div", Im, [
                e.createElementVNode("div", null, [
                  e.createElementVNode(
                    "span",
                    Um,
                    e.toDisplayString(e.unref(o)("File Size")) + ": ",
                    1
                  ),
                  e.createTextVNode(
                    e.toDisplayString(
                      e.unref(t).filesize(e.unref(t).modal.data.item.file_size)
                    ),
                    1
                  )
                ]),
                e.createElementVNode("div", null, [
                  e.createElementVNode(
                    "span",
                    qm,
                    e.toDisplayString(e.unref(o)("Last Modified")) + ": ",
                    1
                  ),
                  e.createTextVNode(
                    " " +
                      e.toDisplayString(
                        e.unref(ar)(e.unref(t).modal.data.item.last_modified)
                      ),
                    1
                  )
                ])
              ]),
              e.unref(t).features.includes(e.unref(Z).DOWNLOAD)
                ? (e.openBlock(),
                  e.createElementBlock("div", jm, [
                    e.createElementVNode(
                      "span",
                      null,
                      e.toDisplayString(
                        e.unref(o)(
                          `Download doesn't work? You can try right-click "Download" button, select "Save link as...".`
                        )
                      ),
                      1
                    )
                  ]))
                : e.createCommentVNode("", !0)
            ]),
            _: 1
          })
        )
      );
    }
  },
  Gm = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "currentColor",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "2",
    class: "h-5 w-5",
    viewBox: "0 0 24 24"
  },
  Km = e.createElementVNode(
    "path",
    { stroke: "none", d: "M0 0h24v24H0z" },
    null,
    -1
  ),
  Wm = e.createElementVNode(
    "path",
    {
      d: "m15 4.5-4 4L7 10l-1.5 1.5 7 7L14 17l1.5-4 4-4M9 15l-4.5 4.5M14.5 4 20 9.5"
    },
    null,
    -1
  ),
  Ym = [Km, Wm];
function Xm(n, t) {
  return e.openBlock(), e.createElementBlock("svg", Gm, [...Ym]);
}
const ir = { render: Xm },
  Jm = ["data-type", "data-item", "data-index"],
  Zt = {
    __name: "Item",
    props: {
      item: { type: Object },
      index: { type: Number },
      dragImage: { type: Object }
    },
    setup(n) {
      const t = e.inject("ServiceContainer"),
        o = t.dragSelect,
        s = n,
        r = f => {
          f.type === "dir"
            ? (t.emitter.emit("vf-search-exit"),
              t.emitter.emit("vf-fetch", {
                params: { q: "index", adapter: t.fs.adapter, path: f.path }
              }))
            : t.modal.open(cr, { adapter: t.fs.adapter, item: f });
        },
        c = {
          mounted(f, v, k, p) {
            k.props.draggable &&
              (f.addEventListener("dragstart", S => a(S, v.value)),
              f.addEventListener("dragover", S => l(S, v.value)),
              f.addEventListener("drop", S => i(S, v.value)));
          },
          beforeUnmount(f, v, k, p) {
            k.props.draggable &&
              (f.removeEventListener("dragstart", a),
              f.removeEventListener("dragover", l),
              f.removeEventListener("drop", i));
          }
        },
        a = (f, v) => {
          if (f.altKey || f.ctrlKey || f.metaKey) return f.preventDefault(), !1;
          (o.isDraggingRef.value = !0),
            f.dataTransfer.setDragImage(s.dragImage.$el, 0, 15),
            (f.dataTransfer.effectAllowed = "all"),
            (f.dataTransfer.dropEffect = "copy"),
            f.dataTransfer.setData("items", JSON.stringify(o.getSelected()));
        },
        i = (f, v) => {
          f.preventDefault(), (o.isDraggingRef.value = !1);
          let k = JSON.parse(f.dataTransfer.getData("items"));
          if (k.find(p => p.storage !== t.fs.adapter)) {
            alert(
              "Moving items between different storages is not supported yet."
            );
            return;
          }
          t.modal.open(pn, { items: { from: k, to: v } });
        },
        l = (f, v) => {
          f.preventDefault(),
            !v ||
            v.type !== "dir" ||
            o.getSelection().find(k => k === f.currentTarget)
              ? ((f.dataTransfer.dropEffect = "none"),
                (f.dataTransfer.effectAllowed = "none"))
              : (f.dataTransfer.dropEffect = "copy");
        };
      let d = null,
        m = !1;
      const u = () => {
          d && clearTimeout(d);
        },
        _ = f => {
          if (!m) (m = !0), setTimeout(() => (m = !1), 300);
          else return (m = !1), r(s.item), clearTimeout(d), !1;
          d = setTimeout(() => {
            const v = new MouseEvent("contextmenu", {
              bubbles: !0,
              cancelable: !1,
              view: window,
              button: 2,
              buttons: 0,
              clientX: f.target.getBoundingClientRect().x,
              clientY: f.target.getBoundingClientRect().y
            });
            f.target.dispatchEvent(v);
          }, 500);
        };
      return (f, v) =>
        e.withDirectives(
          (e.openBlock(),
          e.createElementBlock(
            "div",
            {
              style: e.normalizeStyle({
                opacity:
                  e.unref(o).isDraggingRef.value &&
                  e
                    .unref(o)
                    .getSelection()
                    .find(k => f.$el === k)
                    ? "0.5 !important"
                    : ""
              }),
              class: e.normalizeClass([
                "vuefinder__item",
                "vf-item-" + e.unref(o).explorerId
              ]),
              "data-type": n.item.type,
              key: n.item.path,
              "data-item": JSON.stringify(n.item),
              "data-index": n.index,
              onDblclick: v[0] || (v[0] = k => r(n.item)),
              onTouchstart: v[1] || (v[1] = k => _(k)),
              onTouchend: v[2] || (v[2] = k => u()),
              onContextmenu:
                v[3] ||
                (v[3] = e.withModifiers(
                  k =>
                    e
                      .unref(t)
                      .emitter.emit("vf-contextmenu-show", {
                        event: k,
                        items: e.unref(o).getSelected(),
                        target: n.item
                      }),
                  ["prevent"]
                ))
            },
            [
              e.renderSlot(f.$slots, "default"),
              e.unref(t).pinnedFolders.find(k => k.path === n.item.path)
                ? (e.openBlock(),
                  e.createBlock(e.unref(ir), {
                    key: 0,
                    class: "vuefinder__item--pinned"
                  }))
                : e.createCommentVNode("", !0)
            ],
            46,
            Jm
          )),
          [[c, n.item]]
        );
    }
  },
  Zm = { class: "vuefinder__explorer__container" },
  Qm = { key: 0, class: "vuefinder__explorer__header" },
  ef = { class: "vuefinder__explorer__drag-item" },
  tf = { class: "vuefinder__explorer__item-list-content" },
  nf = { class: "vuefinder__explorer__item-list-name" },
  of = { class: "vuefinder__explorer__item-name" },
  rf = { class: "vuefinder__explorer__item-path" },
  sf = { class: "vuefinder__explorer__item-list-content" },
  lf = { class: "vuefinder__explorer__item-list-name" },
  af = { class: "vuefinder__explorer__item-name" },
  cf = { class: "vuefinder__explorer__item-size" },
  df = { class: "vuefinder__explorer__item-date" },
  uf = { class: "vuefinder__explorer__item-grid-content" },
  mf = ["data-src", "alt"],
  ff = { key: 2, class: "vuefinder__explorer__item-extension" },
  _f = { class: "vuefinder__explorer__item-title break-all" },
  vf = {
    __name: "Explorer",
    setup(n) {
      const t = e.inject("ServiceContainer"),
        { t: o } = t.i18n,
        s = u => (u == null ? void 0 : u.substring(0, 3)),
        r = e.ref(null),
        c = e.ref(""),
        a = t.dragSelect;
      let i;
      t.emitter.on("vf-fullscreen-toggle", () => {
        a.area.value.style.height = null;
      }),
        t.emitter.on("vf-search-query", ({ newQuery: u }) => {
          (c.value = u),
            u
              ? t.emitter.emit("vf-fetch", {
                  params: {
                    q: "search",
                    adapter: t.fs.adapter,
                    path: t.fs.data.dirname,
                    filter: u
                  },
                  onSuccess: _ => {
                    _.files.length ||
                      t.emitter.emit("vf-toast-push", {
                        label: o("No search result found.")
                      });
                  }
                })
              : t.emitter.emit("vf-fetch", {
                  params: {
                    q: "index",
                    adapter: t.fs.adapter,
                    path: t.fs.data.dirname
                  }
                });
        });
      const l = e.reactive({ active: !1, column: "", order: "" }),
        d = (u = !0) => {
          let _ = [...t.fs.data.files],
            f = l.column,
            v = l.order === "asc" ? 1 : -1;
          if (!u) return _;
          const k = (p, S) =>
            typeof p == "string" && typeof S == "string"
              ? p.toLowerCase().localeCompare(S.toLowerCase())
              : p < S
              ? -1
              : p > S
              ? 1
              : 0;
          return (
            l.active && (_ = _.slice().sort((p, S) => k(p[f], S[f]) * v)), _
          );
        },
        m = u => {
          l.active && l.column === u
            ? ((l.active = l.order === "asc"),
              (l.column = u),
              (l.order = "desc"))
            : ((l.active = !0), (l.column = u), (l.order = "asc"));
        };
      return (
        e.onMounted(() => {
          i = new xr(a.area.value);
        }),
        e.onUpdated(() => {
          i.update();
        }),
        e.onBeforeUnmount(() => {
          i.destroy();
        }),
        (u, _) => (
          e.openBlock(),
          e.createElementBlock("div", Zm, [
            e.unref(t).view === "list" || c.value.length
              ? (e.openBlock(),
                e.createElementBlock("div", Qm, [
                  e.createElementVNode(
                    "div",
                    {
                      onClick: _[0] || (_[0] = f => m("basename")),
                      class:
                        "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--name vf-sort-button"
                    },
                    [
                      e.createTextVNode(
                        e.toDisplayString(e.unref(o)("Name")) + " ",
                        1
                      ),
                      e.withDirectives(
                        e.createVNode(wt, { direction: l.order }, null, 8, [
                          "direction"
                        ]),
                        [[e.vShow, l.active && l.column === "basename"]]
                      )
                    ]
                  ),
                  c.value.length
                    ? e.createCommentVNode("", !0)
                    : (e.openBlock(),
                      e.createElementBlock(
                        "div",
                        {
                          key: 0,
                          onClick: _[1] || (_[1] = f => m("file_size")),
                          class:
                            "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--size vf-sort-button"
                        },
                        [
                          e.createTextVNode(
                            e.toDisplayString(e.unref(o)("Size")) + " ",
                            1
                          ),
                          e.withDirectives(
                            e.createVNode(wt, { direction: l.order }, null, 8, [
                              "direction"
                            ]),
                            [[e.vShow, l.active && l.column === "file_size"]]
                          )
                        ]
                      )),
                  c.value.length
                    ? e.createCommentVNode("", !0)
                    : (e.openBlock(),
                      e.createElementBlock(
                        "div",
                        {
                          key: 1,
                          onClick: _[2] || (_[2] = f => m("last_modified")),
                          class:
                            "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--date vf-sort-button"
                        },
                        [
                          e.createTextVNode(
                            e.toDisplayString(e.unref(o)("Date")) + " ",
                            1
                          ),
                          e.withDirectives(
                            e.createVNode(wt, { direction: l.order }, null, 8, [
                              "direction"
                            ]),
                            [
                              [
                                e.vShow,
                                l.active && l.column === "last_modified"
                              ]
                            ]
                          )
                        ]
                      )),
                  c.value.length
                    ? (e.openBlock(),
                      e.createElementBlock(
                        "div",
                        {
                          key: 2,
                          onClick: _[3] || (_[3] = f => m("path")),
                          class:
                            "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--path vf-sort-button"
                        },
                        [
                          e.createTextVNode(
                            e.toDisplayString(e.unref(o)("Filepath")) + " ",
                            1
                          ),
                          e.withDirectives(
                            e.createVNode(wt, { direction: l.order }, null, 8, [
                              "direction"
                            ]),
                            [[e.vShow, l.active && l.column === "path"]]
                          )
                        ]
                      ))
                    : e.createCommentVNode("", !0)
                ]))
              : e.createCommentVNode("", !0),
            e.createElementVNode("div", ef, [
              e.createVNode(
                Qu,
                { ref_key: "dragImage", ref: r, count: e.unref(a).getCount() },
                null,
                8,
                ["count"]
              )
            ]),
            e.createElementVNode(
              "div",
              {
                ref: e.unref(a).scrollBarContainer,
                class: e.normalizeClass([
                  "vf-explorer-scrollbar-container vuefinder__explorer__scrollbar-container",
                  [
                    { "grid-view": e.unref(t).view === "grid" },
                    { "search-active": c.value.length }
                  ]
                ])
              },
              [
                e.createElementVNode(
                  "div",
                  {
                    ref: e.unref(a).scrollBar,
                    class: "vuefinder__explorer__scrollbar"
                  },
                  null,
                  512
                )
              ],
              2
            ),
            e.createElementVNode(
              "div",
              {
                ref: e.unref(a).area,
                class:
                  "vuefinder__explorer__selector-area vf-explorer-scrollbar vf-selector-area",
                onContextmenu:
                  _[4] ||
                  (_[4] = e.withModifiers(
                    f =>
                      e
                        .unref(t)
                        .emitter.emit("vf-contextmenu-show", {
                          event: f,
                          items: e.unref(a).getSelected()
                        }),
                    ["self", "prevent"]
                  ))
              },
              [
                c.value.length
                  ? (e.openBlock(!0),
                    e.createElementBlock(
                      e.Fragment,
                      { key: 0 },
                      e.renderList(
                        d(),
                        (f, v) => (
                          e.openBlock(),
                          e.createBlock(
                            Zt,
                            {
                              item: f,
                              index: v,
                              dragImage: r.value,
                              class: "vf-item vf-item-list"
                            },
                            {
                              default: e.withCtx(() => [
                                e.createElementVNode("div", tf, [
                                  e.createElementVNode("div", nf, [
                                    e.createVNode(
                                      Jt,
                                      {
                                        type: f.type,
                                        small: e.unref(t).compactListView
                                      },
                                      null,
                                      8,
                                      ["type", "small"]
                                    ),
                                    e.createElementVNode(
                                      "span",
                                      of,
                                      e.toDisplayString(f.basename),
                                      1
                                    )
                                  ]),
                                  e.createElementVNode(
                                    "div",
                                    rf,
                                    e.toDisplayString(f.path),
                                    1
                                  )
                                ])
                              ]),
                              _: 2
                            },
                            1032,
                            ["item", "index", "dragImage"]
                          )
                        )
                      ),
                      256
                    ))
                  : e.createCommentVNode("", !0),
                e.unref(t).view === "list" && !c.value.length
                  ? (e.openBlock(!0),
                    e.createElementBlock(
                      e.Fragment,
                      { key: 1 },
                      e.renderList(
                        d(),
                        (f, v) => (
                          e.openBlock(),
                          e.createBlock(
                            Zt,
                            {
                              item: f,
                              index: v,
                              dragImage: r.value,
                              class: "vf-item vf-item-list",
                              draggable: "true",
                              key: f.path
                            },
                            {
                              default: e.withCtx(() => [
                                e.createElementVNode("div", sf, [
                                  e.createElementVNode("div", lf, [
                                    e.createVNode(
                                      Jt,
                                      {
                                        type: f.type,
                                        small: e.unref(t).compactListView
                                      },
                                      null,
                                      8,
                                      ["type", "small"]
                                    ),
                                    e.createElementVNode(
                                      "span",
                                      af,
                                      e.toDisplayString(f.basename),
                                      1
                                    )
                                  ]),
                                  e.createElementVNode(
                                    "div",
                                    cf,
                                    e.toDisplayString(
                                      f.file_size
                                        ? e.unref(t).filesize(f.file_size)
                                        : ""
                                    ),
                                    1
                                  ),
                                  e.createElementVNode(
                                    "div",
                                    df,
                                    e.toDisplayString(
                                      e.unref(ar)(f.last_modified)
                                    ),
                                    1
                                  )
                                ])
                              ]),
                              _: 2
                            },
                            1032,
                            ["item", "index", "dragImage"]
                          )
                        )
                      ),
                      128
                    ))
                  : e.createCommentVNode("", !0),
                e.unref(t).view === "grid" && !c.value.length
                  ? (e.openBlock(!0),
                    e.createElementBlock(
                      e.Fragment,
                      { key: 2 },
                      e.renderList(
                        d(!1),
                        (f, v) => (
                          e.openBlock(),
                          e.createBlock(
                            Zt,
                            {
                              item: f,
                              index: v,
                              dragImage: r.value,
                              class: "vf-item vf-item-grid",
                              draggable: "true"
                            },
                            {
                              default: e.withCtx(() => [
                                e.createElementVNode("div", null, [
                                  e.createElementVNode("div", uf, [
                                    (f.mime_type ?? "").startsWith("image") &&
                                    e.unref(t).showThumbnails
                                      ? (e.openBlock(),
                                        e.createElementBlock(
                                          "img",
                                          {
                                            src: "data:image/png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
                                            class:
                                              "vuefinder__explorer__item-thumbnail lazy",
                                            "data-src": e
                                              .unref(t)
                                              .requester.getPreviewUrl(
                                                e.unref(t).fs.adapter,
                                                f
                                              ),
                                            alt: f.basename,
                                            key: f.path
                                          },
                                          null,
                                          8,
                                          mf
                                        ))
                                      : (e.openBlock(),
                                        e.createBlock(
                                          Jt,
                                          { key: 1, type: f.type },
                                          null,
                                          8,
                                          ["type"]
                                        )),
                                    !(
                                      (f.mime_type ?? "").startsWith("image") &&
                                      e.unref(t).showThumbnails
                                    ) && f.type !== "dir"
                                      ? (e.openBlock(),
                                        e.createElementBlock(
                                          "div",
                                          ff,
                                          e.toDisplayString(s(f.extension)),
                                          1
                                        ))
                                      : e.createCommentVNode("", !0)
                                  ]),
                                  e.createElementVNode(
                                    "span",
                                    _f,
                                    e.toDisplayString(e.unref(vn)(f.basename)),
                                    1
                                  )
                                ])
                              ]),
                              _: 2
                            },
                            1032,
                            ["item", "index", "dragImage"]
                          )
                        )
                      ),
                      256
                    ))
                  : e.createCommentVNode("", !0)
              ],
              544
            ),
            e.createVNode($u)
          ])
        )
      );
    }
  },
  pf = ["href", "download"],
  hf = ["onClick"],
  gf = {
    __name: "ContextMenu",
    setup(n) {
      const t = e.inject("ServiceContainer"),
        { t: o } = t.i18n,
        s = e.ref(null),
        r = e.ref([]),
        c = e.ref(""),
        a = e.reactive({
          active: !1,
          items: [],
          positions: { left: 0, top: 0 }
        }),
        i = e.computed(() =>
          a.items.filter(u => u.key == null || t.features.includes(u.key))
        );
      t.emitter.on("vf-context-selected", u => {
        r.value = u;
      });
      const l = {
          newfolder: {
            key: Z.NEW_FOLDER,
            title: () => o("New Folder"),
            action: () => t.modal.open(er)
          },
          selectAll: {
            title: () => o("Select All"),
            action: () => t.dragSelect.selectAll()
          },
          pinFolder: {
            title: () => o("Pin Folder"),
            action: () => {
              (t.pinnedFolders = t.pinnedFolders.concat(r.value)),
                t.storage.setStore("pinned-folders", t.pinnedFolders);
            }
          },
          unpinFolder: {
            title: () => o("Unpin Folder"),
            action: () => {
              (t.pinnedFolders = t.pinnedFolders.filter(
                u => !r.value.find(_ => _.path === u.path)
              )),
                t.storage.setStore("pinned-folders", t.pinnedFolders);
            }
          },
          delete: {
            key: Z.DELETE,
            title: () => o("Delete"),
            action: () => {
              t.modal.open(Dn, { items: r });
            }
          },
          refresh: {
            title: () => o("Refresh"),
            action: () => {
              t.emitter.emit("vf-fetch", {
                params: {
                  q: "index",
                  adapter: t.fs.adapter,
                  path: t.fs.data.dirname
                }
              });
            }
          },
          preview: {
            key: Z.PREVIEW,
            title: () => o("Preview"),
            action: () =>
              t.modal.open(cr, { adapter: t.fs.adapter, item: r.value[0] })
          },
          open: {
            title: () => o("Open"),
            action: () => {
              t.emitter.emit("vf-search-exit"),
                t.emitter.emit("vf-fetch", {
                  params: {
                    q: "index",
                    adapter: t.fs.adapter,
                    path: r.value[0].path
                  }
                });
            }
          },
          openDir: {
            title: () => o("Open containing folder"),
            action: () => {
              t.emitter.emit("vf-search-exit"),
                t.emitter.emit("vf-fetch", {
                  params: {
                    q: "index",
                    adapter: t.fs.adapter,
                    path: r.value[0].dir
                  }
                });
            }
          },
          download: {
            key: Z.DOWNLOAD,
            link: e.computed(() =>
              t.requester.getDownloadUrl(t.fs.adapter, r.value[0])
            ),
            title: () => o("Download"),
            action: () => {}
          },
          archive: {
            key: Z.ARCHIVE,
            title: () => o("Archive"),
            action: () => t.modal.open(lr, { items: r })
          },
          unarchive: {
            key: Z.UNARCHIVE,
            title: () => o("Unarchive"),
            action: () => t.modal.open(rr, { items: r })
          },
          rename: {
            key: Z.RENAME,
            title: () => o("Rename"),
            action: () => t.modal.open(Tn, { items: r })
          }
        },
        d = u => {
          t.emitter.emit("vf-contextmenu-hide"), u.action();
        };
      t.emitter.on("vf-search-query", ({ newQuery: u }) => {
        c.value = u;
      }),
        t.emitter.on(
          "vf-contextmenu-show",
          ({ event: u, items: _, target: f = null }) => {
            if (((a.items = []), c.value))
              if (f)
                a.items.push(l.openDir),
                  t.emitter.emit("vf-context-selected", [f]);
              else return;
            else
              !f && !c.value
                ? (a.items.push(l.refresh),
                  a.items.push(l.selectAll),
                  a.items.push(l.newfolder),
                  t.emitter.emit("vf-context-selected", []))
                : _.length > 1 && _.some(v => v.path === f.path)
                ? (a.items.push(l.refresh),
                  a.items.push(l.archive),
                  a.items.push(l.delete),
                  t.emitter.emit("vf-context-selected", _))
                : (f.type === "dir"
                    ? (a.items.push(l.open),
                      t.pinnedFolders.findIndex(v => v.path === f.path) !== -1
                        ? a.items.push(l.unpinFolder)
                        : a.items.push(l.pinFolder))
                    : (a.items.push(l.preview), a.items.push(l.download)),
                  a.items.push(l.rename),
                  f.mime_type === "application/zip"
                    ? a.items.push(l.unarchive)
                    : a.items.push(l.archive),
                  a.items.push(l.delete),
                  t.emitter.emit("vf-context-selected", [f]));
            m(u);
          }
        ),
        t.emitter.on("vf-contextmenu-hide", () => {
          a.active = !1;
        });
      const m = u => {
        const _ = t.dragSelect.area.value,
          f = t.root.getBoundingClientRect(),
          v = _.getBoundingClientRect();
        let k = u.clientX - f.left,
          p = u.clientY - f.top;
        (a.active = !0),
          e.nextTick(() => {
            var w;
            const S =
              (w = s.value) == null ? void 0 : w.getBoundingClientRect();
            let T = (S == null ? void 0 : S.height) ?? 0,
              C = (S == null ? void 0 : S.width) ?? 0;
            (k = v.right - u.pageX + window.scrollX < C ? k - C : k),
              (p = v.bottom - u.pageY + window.scrollY < T ? p - T : p),
              (a.positions = { left: k + "px", top: p + "px" });
          });
      };
      return (u, _) =>
        e.withDirectives(
          (e.openBlock(),
          e.createElementBlock(
            "ul",
            {
              ref_key: "contextmenu",
              ref: s,
              style: e.normalizeStyle(a.positions),
              class: "vuefinder__context-menu"
            },
            [
              (e.openBlock(!0),
              e.createElementBlock(
                e.Fragment,
                null,
                e.renderList(
                  i.value,
                  f => (
                    e.openBlock(),
                    e.createElementBlock(
                      "li",
                      { class: "vuefinder__context-menu__item", key: f.title },
                      [
                        f.link
                          ? (e.openBlock(),
                            e.createElementBlock(
                              "a",
                              {
                                key: 0,
                                class: "vuefinder__context-menu__link",
                                target: "_blank",
                                href: f.link,
                                download: f.link,
                                onClick:
                                  _[0] ||
                                  (_[0] = v =>
                                    e
                                      .unref(t)
                                      .emitter.emit("vf-contextmenu-hide"))
                              },
                              [
                                e.createElementVNode(
                                  "span",
                                  null,
                                  e.toDisplayString(f.title()),
                                  1
                                )
                              ],
                              8,
                              pf
                            ))
                          : (e.openBlock(),
                            e.createElementBlock(
                              "div",
                              {
                                key: 1,
                                class: "vuefinder__context-menu__action",
                                onClick: v => d(f)
                              },
                              [
                                e.createElementVNode(
                                  "span",
                                  null,
                                  e.toDisplayString(f.title()),
                                  1
                                )
                              ],
                              8,
                              hf
                            ))
                      ]
                    )
                  )
                ),
                128
              ))
            ],
            4
          )),
          [[e.vShow, a.active]]
        );
    }
  },
  kf = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "currentColor",
    class: "h-5 w-5",
    viewBox: "0 0 24 24"
  },
  wf = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
    },
    null,
    -1
  ),
  bf = [wf];
function yf(n, t) {
  return e.openBlock(), e.createElementBlock("svg", kf, [...bf]);
}
const dr = { render: yf },
  Ef = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "2",
    class: "h-5 w-5 stroke-slate-500 cursor-pointer",
    viewBox: "0 0 24 24"
  },
  Vf = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0"
    },
    null,
    -1
  ),
  Sf = [Vf];
function Nf(n, t) {
  return e.openBlock(), e.createElementBlock("svg", Ef, [...Sf]);
}
const xf = { render: Nf },
  Bf = { class: "vuefinder__status-bar__wrapper" },
  $f = { class: "vuefinder__status-bar__storage" },
  Cf = ["title"],
  Df = { class: "vuefinder__status-bar__storage-icon" },
  Tf = ["value"],
  Mf = { class: "vuefinder__status-bar__info" },
  Af = { key: 0 },
  Lf = { class: "vuefinder__status-bar__selected-count" },
  Of = { class: "vuefinder__status-bar__actions" },
  Ff = ["disabled"],
  Hf = ["title"],
  Rf = {
    __name: "Statusbar",
    setup(n) {
      const t = e.inject("ServiceContainer"),
        { t: o } = t.i18n,
        { setStore: s } = t.storage,
        r = t.dragSelect,
        c = () => {
          t.emitter.emit("vf-search-exit"),
            t.emitter.emit("vf-fetch", {
              params: { q: "index", adapter: t.fs.adapter }
            }),
            s("adapter", t.fs.adapter);
        },
        a = e.ref("");
      t.emitter.on("vf-search-query", ({ newQuery: l }) => {
        a.value = l;
      });
      const i = e.computed(() => {
        const l = t.selectButton.multiple
          ? r.getSelected().length > 0
          : r.getSelected().length === 1;
        return t.selectButton.active && l;
      });
      return (l, d) => (
        e.openBlock(),
        e.createElementBlock("div", Bf, [
          e.createElementVNode("div", $f, [
            e.createElementVNode(
              "div",
              {
                class: "vuefinder__status-bar__storage-container",
                title: e.unref(o)("Storage")
              },
              [
                e.createElementVNode("div", Df, [e.createVNode(e.unref(dr))]),
                e.withDirectives(
                  e.createElementVNode(
                    "select",
                    {
                      "onUpdate:modelValue":
                        d[0] || (d[0] = m => (e.unref(t).fs.adapter = m)),
                      onChange: c,
                      class: "vuefinder__status-bar__storage-select",
                      tabindex: "-1"
                    },
                    [
                      (e.openBlock(!0),
                      e.createElementBlock(
                        e.Fragment,
                        null,
                        e.renderList(
                          e.unref(t).fs.data.storages,
                          m => (
                            e.openBlock(),
                            e.createElementBlock(
                              "option",
                              { value: m },
                              e.toDisplayString(m),
                              9,
                              Tf
                            )
                          )
                        ),
                        256
                      ))
                    ],
                    544
                  ),
                  [[e.vModelSelect, e.unref(t).fs.adapter]]
                )
              ],
              8,
              Cf
            ),
            e.createElementVNode("div", Mf, [
              a.value.length
                ? (e.openBlock(),
                  e.createElementBlock(
                    "span",
                    Af,
                    e.toDisplayString(e.unref(t).fs.data.files.length) +
                      " items found. ",
                    1
                  ))
                : e.createCommentVNode("", !0),
              e.createElementVNode(
                "span",
                Lf,
                e.toDisplayString(
                  e.unref(t).dragSelect.getCount() > 0
                    ? e.unref(o)(
                        "%s item(s) selected.",
                        e.unref(t).dragSelect.getCount()
                      )
                    : ""
                ),
                1
              )
            ])
          ]),
          e.createElementVNode("div", Of, [
            e.unref(t).selectButton.active
              ? (e.openBlock(),
                e.createElementBlock(
                  "button",
                  {
                    key: 0,
                    class: e.normalizeClass([
                      "vf-btn py-0 vf-btn-primary",
                      { disabled: !i.value }
                    ]),
                    disabled: !i.value,
                    onClick:
                      d[1] ||
                      (d[1] = m =>
                        e
                          .unref(t)
                          .selectButton.click(e.unref(r).getSelected(), m))
                  },
                  e.toDisplayString(e.unref(o)("Select")),
                  11,
                  Ff
                ))
              : e.createCommentVNode("", !0),
            e.createElementVNode(
              "span",
              {
                class: "vuefinder__status-bar__about",
                title: e.unref(o)("About"),
                onClick: d[2] || (d[2] = m => e.unref(t).modal.open(Xo))
              },
              [e.createVNode(e.unref(xf))],
              8,
              Hf
            )
          ])
        ])
      );
    }
  },
  zf = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": "1.5",
    class:
      "text-neutral-500 fill-sky-500 stroke-gray-100/50 dark:stroke-slate-700/50 dark:fill-slate-500",
    viewBox: "0 0 24 24"
  },
  If = e.createElementVNode(
    "path",
    {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3.75 9.776q.168-.026.344-.026h15.812q.176 0 .344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
    },
    null,
    -1
  ),
  Uf = [If];
function qf(n, t) {
  return e.openBlock(), e.createElementBlock("svg", zf, [...Uf]);
}
const ur = { render: qf },
  jf = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "currentColor",
    class: "h-5 w-5",
    viewBox: "0 0 24 24"
  },
  Pf = e.createElementVNode(
    "path",
    { fill: "none", d: "M0 0h24v24H0z" },
    null,
    -1
  ),
  Gf = e.createElementVNode(
    "path",
    {
      d: "M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m3.6 5.2a1 1 0 0 0-1.4.2L12 10.333 9.8 7.4a1 1 0 1 0-1.6 1.2l2.55 3.4-2.55 3.4a1 1 0 1 0 1.6 1.2l2.2-2.933 2.2 2.933a1 1 0 0 0 1.6-1.2L13.25 12l2.55-3.4a1 1 0 0 0-.2-1.4"
    },
    null,
    -1
  ),
  Kf = [Pf, Gf];
function Wf(n, t) {
  return e.openBlock(), e.createElementBlock("svg", jf, [...Kf]);
}
const Yf = { render: Wf },
  Xf = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "currentColor",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "2",
    viewBox: "0 0 24 24"
  },
  Jf = e.createElementVNode(
    "path",
    { stroke: "none", d: "M0 0h24v24H0z" },
    null,
    -1
  ),
  Zf = e.createElementVNode("path", { d: "M15 12H9M12 9v6" }, null, -1),
  Qf = [Jf, Zf];
function e_(n, t) {
  return e.openBlock(), e.createElementBlock("svg", Xf, [...Qf]);
}
const mr = { render: e_ },
  t_ = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    stroke: "currentColor",
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "2",
    viewBox: "0 0 24 24"
  },
  n_ = e.createElementVNode(
    "path",
    { stroke: "none", d: "M0 0h24v24H0z" },
    null,
    -1
  ),
  o_ = e.createElementVNode("path", { d: "M9 12h6" }, null, -1),
  r_ = [n_, o_];
function s_(n, t) {
  return e.openBlock(), e.createElementBlock("svg", t_, [...r_]);
}
const fr = { render: s_ };
function _r(n, t) {
  const o = n.findIndex(s => s.path === t.path);
  o > -1 ? (n[o] = t) : n.push(t);
}
const l_ = { class: "vuefinder__folder-loader-indicator" },
  a_ = { key: 1, class: "vuefinder__folder-loader-indicator--icon" },
  vr = {
    __name: "FolderLoaderIndicator",
    props: e.mergeModels(
      {
        adapter: { type: String, required: !0 },
        path: { type: String, required: !0 }
      },
      { modelValue: {}, modelModifiers: {} }
    ),
    emits: ["update:modelValue"],
    setup(n) {
      const t = n,
        o = e.inject("ServiceContainer");
      o.i18n;
      const s = e.useModel(n, "modelValue"),
        r = e.ref(!1);
      e.watch(
        () => s.value,
        () => {
          var i;
          return ((i = c()) == null ? void 0 : i.folders.length) || a();
        }
      );
      function c() {
        return o.treeViewData.find(i => i.path === t.path);
      }
      const a = () => {
        (r.value = !0),
          o.requester
            .send({
              url: "",
              method: "get",
              params: { q: "subfolders", adapter: t.adapter, path: t.path }
            })
            .then(i => {
              _r(o.treeViewData, { path: t.path, ...i });
            })
            .catch(i => {})
            .finally(() => {
              r.value = !1;
            });
      };
      return (i, l) => {
        var d;
        return (
          e.openBlock(),
          e.createElementBlock("div", l_, [
            r.value
              ? (e.openBlock(),
                e.createBlock(e.unref(Mn), {
                  key: 0,
                  class: "vuefinder__folder-loader-indicator--loading"
                }))
              : (e.openBlock(),
                e.createElementBlock("div", a_, [
                  s.value && (d = c()) != null && d.folders.length
                    ? (e.openBlock(),
                      e.createBlock(e.unref(fr), {
                        key: 0,
                        class: "vuefinder__folder-loader-indicator--minus"
                      }))
                    : e.createCommentVNode("", !0),
                  s.value
                    ? e.createCommentVNode("", !0)
                    : (e.openBlock(),
                      e.createBlock(e.unref(mr), {
                        key: 1,
                        class: "vuefinder__folder-loader-indicator--plus"
                      }))
                ]))
          ])
        );
      };
    }
  },
  c_ = { class: "vuefinder__treesubfolderlist__item-content" },
  i_ = ["onClick"],
  d_ = ["title", "onClick"],
  u_ = { class: "vuefinder__treesubfolderlist__item-icon" },
  m_ = { class: "vuefinder__treesubfolderlist__subfolder" },
  f_ = {
    __name: "TreeSubfolderList",
    props: {
      adapter: { type: String, required: !0 },
      path: { type: String, required: !0 }
    },
    setup(n) {
      const t = e.inject("ServiceContainer"),
        o = e.ref([]),
        s = n,
        r = e.ref(null);
      e.onMounted(() => {
        s.path === s.adapter + "://" &&
          xe(r.value, {
            scrollbars: { theme: "vf-theme-dark dark:vf-theme-light" }
          });
      });
      const c = e.computed(() => {
        var a;
        return (
          ((a = t.treeViewData.find(i => i.path === s.path)) == null
            ? void 0
            : a.folders) || []
        );
      });
      return (a, i) => {
        const l = e.resolveComponent("TreeSubfolderList", !0);
        return (
          e.openBlock(),
          e.createElementBlock(
            "ul",
            {
              ref_key: "parentSubfolderList",
              ref: r,
              class: "vuefinder__treesubfolderlist__container"
            },
            [
              (e.openBlock(!0),
              e.createElementBlock(
                e.Fragment,
                null,
                e.renderList(
                  c.value,
                  (d, m) => (
                    e.openBlock(),
                    e.createElementBlock(
                      "li",
                      {
                        key: d.path,
                        class: "vuefinder__treesubfolderlist__item"
                      },
                      [
                        e.createElementVNode("div", c_, [
                          e.createElementVNode(
                            "div",
                            {
                              class:
                                "vuefinder__treesubfolderlist__item-toggle",
                              onClick: u => (o.value[d.path] = !o.value[d.path])
                            },
                            [
                              e.createVNode(
                                vr,
                                {
                                  adapter: n.adapter,
                                  path: d.path,
                                  modelValue: o.value[d.path],
                                  "onUpdate:modelValue": u =>
                                    (o.value[d.path] = u)
                                },
                                null,
                                8,
                                [
                                  "adapter",
                                  "path",
                                  "modelValue",
                                  "onUpdate:modelValue"
                                ]
                              )
                            ],
                            8,
                            i_
                          ),
                          e.createElementVNode(
                            "div",
                            {
                              class: "vuefinder__treesubfolderlist__item-link",
                              title: d.path,
                              onClick: u =>
                                e
                                  .unref(t)
                                  .emitter.emit("vf-fetch", {
                                    params: {
                                      q: "index",
                                      adapter: s.adapter,
                                      path: d.path
                                    }
                                  })
                            },
                            [
                              e.createElementVNode("div", u_, [
                                e.unref(t).fs.path === d.path
                                  ? (e.openBlock(),
                                    e.createBlock(e.unref(ur), { key: 0 }))
                                  : (e.openBlock(),
                                    e.createBlock(e.unref(It), { key: 1 }))
                              ]),
                              e.createElementVNode(
                                "div",
                                {
                                  class: e.normalizeClass([
                                    "vuefinder__treesubfolderlist__item-text",
                                    {
                                      "vuefinder__treesubfolderlist__item-text--active":
                                        e.unref(t).fs.path === d.path
                                    }
                                  ])
                                },
                                e.toDisplayString(d.basename),
                                3
                              )
                            ],
                            8,
                            d_
                          )
                        ]),
                        e.createElementVNode("div", m_, [
                          e.withDirectives(
                            e.createVNode(
                              l,
                              { adapter: s.adapter, path: d.path },
                              null,
                              8,
                              ["adapter", "path"]
                            ),
                            [[e.vShow, o.value[d.path]]]
                          )
                        ])
                      ]
                    )
                  )
                ),
                128
              ))
            ],
            512
          )
        );
      };
    }
  },
  __ = { class: "vuefinder__treestorageitem__loader" },
  v_ = {
    __name: "TreeStorageItem",
    props: { storage: { type: String, required: !0 } },
    setup(n) {
      const t = e.inject("ServiceContainer"),
        o = e.ref(!1);
      return (s, r) => (
        e.openBlock(),
        e.createElementBlock(
          e.Fragment,
          null,
          [
            e.createElementVNode(
              "div",
              {
                onClick: r[1] || (r[1] = c => (o.value = !o.value)),
                class: "vuefinder__treestorageitem__header"
              },
              [
                e.createElementVNode(
                  "div",
                  {
                    class: e.normalizeClass([
                      "vuefinder__treestorageitem__info",
                      n.storage === e.unref(t).fs.adapter
                        ? "vuefinder__treestorageitem__info--active"
                        : ""
                    ])
                  },
                  [
                    e.createElementVNode(
                      "div",
                      {
                        class: e.normalizeClass([
                          "vuefinder__treestorageitem__icon",
                          n.storage === e.unref(t).fs.adapter
                            ? "vuefinder__treestorageitem__icon--active"
                            : ""
                        ])
                      },
                      [e.createVNode(e.unref(dr))],
                      2
                    ),
                    e.createElementVNode(
                      "div",
                      null,
                      e.toDisplayString(n.storage),
                      1
                    )
                  ],
                  2
                ),
                e.createElementVNode("div", __, [
                  e.createVNode(
                    vr,
                    {
                      adapter: n.storage,
                      path: n.storage + "://",
                      modelValue: o.value,
                      "onUpdate:modelValue": r[0] || (r[0] = c => (o.value = c))
                    },
                    null,
                    8,
                    ["adapter", "path", "modelValue"]
                  )
                ])
              ]
            ),
            e.withDirectives(
              e.createVNode(
                f_,
                {
                  adapter: n.storage,
                  path: n.storage + "://",
                  class: "vuefinder__treestorageitem__subfolder"
                },
                null,
                8,
                ["adapter", "path"]
              ),
              [[e.vShow, o.value]]
            )
          ],
          64
        )
      );
    }
  },
  p_ = { class: "vuefinder__folder-indicator" },
  h_ = { class: "vuefinder__folder-indicator--icon" },
  g_ = {
    __name: "FolderIndicator",
    props: { modelValue: {}, modelModifiers: {} },
    emits: ["update:modelValue"],
    setup(n) {
      const t = e.useModel(n, "modelValue");
      return (o, s) => (
        e.openBlock(),
        e.createElementBlock("div", p_, [
          e.createElementVNode("div", h_, [
            t.value
              ? (e.openBlock(),
                e.createBlock(e.unref(fr), {
                  key: 0,
                  class: "vuefinder__folder-indicator--minus"
                }))
              : e.createCommentVNode("", !0),
            t.value
              ? e.createCommentVNode("", !0)
              : (e.openBlock(),
                e.createBlock(e.unref(mr), {
                  key: 1,
                  class: "vuefinder__folder-indicator--plus"
                }))
          ])
        ])
      );
    }
  },
  k_ = { class: "vuefinder__treeview__header" },
  w_ = { class: "vuefinder__treeview__pinned-label" },
  b_ = { class: "vuefinder__treeview__pin-text text-nowrap" },
  y_ = { key: 0, class: "vuefinder__treeview__pinned-list" },
  E_ = { class: "vuefinder__treeview__pinned-item" },
  V_ = ["onClick"],
  S_ = ["title"],
  N_ = ["onClick"],
  x_ = { key: 0 },
  B_ = { class: "vuefinder__treeview__no-pinned" },
  $_ = { class: "vuefinder__treeview__storage" },
  C_ = {
    __name: "TreeView",
    setup(n) {
      const t = e.inject("ServiceContainer"),
        { t: o } = t.i18n,
        { getStore: s, setStore: r } = t.storage,
        c = e.ref(190),
        a = e.ref(s("pinned-folders-opened", !0));
      e.watch(a, m => r("pinned-folders-opened", m));
      const i = m => {
          (t.pinnedFolders = t.pinnedFolders.filter(u => u.path !== m.path)),
            t.storage.setStore("pinned-folders", t.pinnedFolders);
        },
        l = m => {
          const u = m.clientX,
            _ = m.target.parentElement,
            f = _.getBoundingClientRect().width;
          _.classList.remove("transition-[width]"),
            _.classList.add("transition-none");
          const v = p => {
              (c.value = f + p.clientX - u),
                c.value < 50 && ((c.value = 0), (t.showTreeView = !1)),
                c.value > 50 && (t.showTreeView = !0);
            },
            k = () => {
              const p = _.getBoundingClientRect();
              (c.value = p.width),
                _.classList.add("transition-[width]"),
                _.classList.remove("transition-none"),
                window.removeEventListener("mousemove", v),
                window.removeEventListener("mouseup", k);
            };
          window.addEventListener("mousemove", v),
            window.addEventListener("mouseup", k);
        },
        d = e.ref(null);
      return (
        e.onMounted(() => {
          xe(d.value, {
            overflow: { x: "hidden" },
            scrollbars: { theme: "vf-theme-dark dark:vf-theme-light" }
          });
        }),
        e.watch(t.fs.data, (m, u) => {
          const _ = m.files.filter(f => f.type === "dir");
          _r(t.treeViewData, {
            path: t.fs.path,
            folders: _.map(f => ({
              adapter: f.storage,
              path: f.path,
              basename: f.basename
            }))
          });
        }),
        (m, u) => (
          e.openBlock(),
          e.createElementBlock(
            e.Fragment,
            null,
            [
              e.createElementVNode(
                "div",
                {
                  onClick:
                    u[0] ||
                    (u[0] = _ =>
                      (e.unref(t).showTreeView = !e.unref(t).showTreeView)),
                  class: e.normalizeClass([
                    "vuefinder__treeview__overlay",
                    e.unref(t).showTreeView
                      ? "vuefinder__treeview__backdrop"
                      : "hidden"
                  ])
                },
                null,
                2
              ),
              e.createElementVNode(
                "div",
                {
                  style: e.normalizeStyle(
                    e.unref(t).showTreeView
                      ? "min-width:100px;max-width:75%; width: " +
                          c.value +
                          "px"
                      : "width: 0"
                  ),
                  class: "vuefinder__treeview__container"
                },
                [
                  e.createElementVNode(
                    "div",
                    {
                      ref_key: "treeViewScrollElement",
                      ref: d,
                      class: "vuefinder__treeview__scroll"
                    },
                    [
                      e.createElementVNode("div", k_, [
                        e.createElementVNode(
                          "div",
                          {
                            onClick: u[2] || (u[2] = _ => (a.value = !a.value)),
                            class: "vuefinder__treeview__pinned-toggle"
                          },
                          [
                            e.createElementVNode("div", w_, [
                              e.createVNode(e.unref(ir), {
                                class: "vuefinder__treeview__pin-icon"
                              }),
                              e.createElementVNode(
                                "div",
                                b_,
                                e.toDisplayString(e.unref(o)("Pinned Folders")),
                                1
                              )
                            ]),
                            e.createVNode(
                              g_,
                              {
                                modelValue: a.value,
                                "onUpdate:modelValue":
                                  u[1] || (u[1] = _ => (a.value = _))
                              },
                              null,
                              8,
                              ["modelValue"]
                            )
                          ]
                        ),
                        a.value
                          ? (e.openBlock(),
                            e.createElementBlock("ul", y_, [
                              (e.openBlock(!0),
                              e.createElementBlock(
                                e.Fragment,
                                null,
                                e.renderList(
                                  e.unref(t).pinnedFolders,
                                  _ => (
                                    e.openBlock(),
                                    e.createElementBlock("li", E_, [
                                      e.createElementVNode(
                                        "div",
                                        {
                                          class:
                                            "vuefinder__treeview__pinned-folder",
                                          onClick: f =>
                                            e
                                              .unref(t)
                                              .emitter.emit("vf-fetch", {
                                                params: {
                                                  q: "index",
                                                  adapter: _.storage,
                                                  path: _.path
                                                }
                                              })
                                        },
                                        [
                                          e.unref(t).fs.path !== _.path
                                            ? (e.openBlock(),
                                              e.createBlock(e.unref(It), {
                                                key: 0,
                                                class:
                                                  "vuefinder__treeview__folder-icon"
                                              }))
                                            : e.createCommentVNode("", !0),
                                          e.unref(t).fs.path === _.path
                                            ? (e.openBlock(),
                                              e.createBlock(e.unref(ur), {
                                                key: 1,
                                                class:
                                                  "vuefinder__treeview__open-folder-icon"
                                              }))
                                            : e.createCommentVNode("", !0),
                                          e.createElementVNode(
                                            "div",
                                            {
                                              title: _.path,
                                              class: e.normalizeClass([
                                                "vuefinder__treeview__folder-name text-nowrap",
                                                {
                                                  "vuefinder__treeview__folder-name--active":
                                                    e.unref(t).fs.path ===
                                                    _.path
                                                }
                                              ])
                                            },
                                            e.toDisplayString(_.basename),
                                            11,
                                            S_
                                          )
                                        ],
                                        8,
                                        V_
                                      ),
                                      e.createElementVNode(
                                        "div",
                                        {
                                          class:
                                            "vuefinder__treeview__remove-favorite",
                                          onClick: f => i(_)
                                        },
                                        [
                                          e.createVNode(e.unref(Yf), {
                                            class:
                                              "vuefinder__treeview__remove-icon"
                                          })
                                        ],
                                        8,
                                        N_
                                      )
                                    ])
                                  )
                                ),
                                256
                              )),
                              e.unref(t).pinnedFolders.length
                                ? e.createCommentVNode("", !0)
                                : (e.openBlock(),
                                  e.createElementBlock("li", x_, [
                                    e.createElementVNode(
                                      "div",
                                      B_,
                                      e.toDisplayString(
                                        e.unref(o)("No folders pinned")
                                      ),
                                      1
                                    )
                                  ]))
                            ]))
                          : e.createCommentVNode("", !0)
                      ]),
                      (e.openBlock(!0),
                      e.createElementBlock(
                        e.Fragment,
                        null,
                        e.renderList(
                          e.unref(t).fs.data.storages,
                          _ => (
                            e.openBlock(),
                            e.createElementBlock("div", $_, [
                              e.createVNode(v_, { storage: _ }, null, 8, [
                                "storage"
                              ])
                            ])
                          )
                        ),
                        256
                      ))
                    ],
                    512
                  ),
                  e.createElementVNode(
                    "div",
                    {
                      onMousedown: l,
                      class: e.normalizeClass([
                        (e.unref(t).showTreeView, ""),
                        "vuefinder__treeview__resize-handle"
                      ])
                    },
                    null,
                    34
                  )
                ],
                4
              )
            ],
            64
          )
        )
      );
    }
  },
  D_ = { class: "vuefinder__main__content" },
  T_ = {
    __name: "VueFinder",
    props: {
      id: { type: String, default: "vf" },
      request: { type: [String, Object], required: !0 },
      persist: { type: Boolean, default: !1 },
      path: { type: String, default: "" },
      features: { type: [Array, Boolean], default: !0 },
      debug: { type: Boolean, default: !1 },
      theme: { type: String, default: "system" },
      locale: { type: String, default: null },
      maxHeight: { type: String, default: "600px" },
      maxFileSize: { type: String, default: "10mb" },
      fullScreen: { type: Boolean, default: !1 },
      showTreeView: { type: Boolean, default: !1 },
      pinnedFolders: { type: Array, default: [] },
      showThumbnails: { type: Boolean, default: !0 },
      selectButton: {
        type: Object,
        default(n) {
          return { active: !1, multiple: !1, click: t => {}, ...n };
        }
      }
    },
    emits: ["select"],
    setup(n, { emit: t }) {
      const o = t,
        r = qs(n, e.inject("VueFinderOptions"));
      e.provide("ServiceContainer", r);
      const { setStore: c } = r.storage,
        a = e.ref(null);
      r.root = a;
      const i = r.dragSelect;
      Wa(r);
      const l = m => {
        Object.assign(r.fs.data, m), i.clearSelection(), i.refreshSelection();
      };
      let d;
      return (
        r.emitter.on("vf-fetch-abort", () => {
          d.abort(), (r.fs.loading = !1);
        }),
        r.emitter.on(
          "vf-fetch",
          ({
            params: m,
            body: u = null,
            onSuccess: _ = null,
            onError: f = null,
            noCloseModal: v = !1
          }) => {
            ["index", "search"].includes(m.q) &&
              (d && d.abort(), (r.fs.loading = !0)),
              (d = new AbortController());
            const k = d.signal;
            r.requester
              .send({
                url: "",
                method: m.m || "get",
                params: m,
                body: u,
                abortSignal: k
              })
              .then(p => {
                (r.fs.adapter = p.adapter),
                  r.persist && ((r.fs.path = p.dirname), c("path", r.fs.path)),
                  ["index", "search"].includes(m.q) && (r.fs.loading = !1),
                  v || r.modal.close(),
                  l(p),
                  _ && _(p);
              })
              .catch(p => {
                console.error(p), f && f(p);
              });
          }
        ),
        e.onMounted(() => {
          let m = {};
          r.fs.path.includes("://") &&
            (m = { adapter: r.fs.path.split("://")[0], path: r.fs.path }),
            r.emitter.emit("vf-fetch", {
              params: { q: "index", adapter: r.fs.adapter, ...m }
            }),
            i.onSelect(u => {
              o("select", u);
            });
        }),
        (m, u) => (
          e.openBlock(),
          e.createElementBlock(
            "div",
            { class: "vuefinder", ref_key: "root", ref: a, tabindex: "0" },
            [
              e.createElementVNode(
                "div",
                { class: e.normalizeClass(e.unref(r).theme.actualValue) },
                [
                  e.createElementVNode(
                    "div",
                    {
                      class: e.normalizeClass([
                        e.unref(r).fullScreen
                          ? "vuefinder__main__fixed"
                          : "vuefinder__main__relative",
                        "vuefinder__main__container"
                      ]),
                      style: e.normalizeStyle(
                        e.unref(r).fullScreen
                          ? ""
                          : "max-height: " + n.maxHeight
                      ),
                      onMousedown:
                        u[0] ||
                        (u[0] = _ =>
                          e.unref(r).emitter.emit("vf-contextmenu-hide")),
                      onTouchstart:
                        u[1] ||
                        (u[1] = _ =>
                          e.unref(r).emitter.emit("vf-contextmenu-hide"))
                    },
                    [
                      e.createVNode(Xi),
                      e.createVNode(xu),
                      e.createElementVNode("div", D_, [
                        e.createVNode(C_),
                        e.createVNode(vf)
                      ]),
                      e.createVNode(Rf)
                    ],
                    38
                  ),
                  e.createVNode(
                    e.Transition,
                    { name: "fade" },
                    {
                      default: e.withCtx(() => [
                        e.unref(r).modal.visible
                          ? (e.openBlock(),
                            e.createBlock(
                              e.resolveDynamicComponent(e.unref(r).modal.type),
                              { key: 0 }
                            ))
                          : e.createCommentVNode("", !0)
                      ]),
                      _: 1
                    }
                  ),
                  e.createVNode(gf)
                ],
                2
              )
            ],
            512
          )
        )
      );
    }
  },
  M_ = {
    install(n, t = {}) {
      t.i18n = t.i18n ?? {};
      let [o] = Object.keys(t.i18n);
      (t.locale = t.locale ?? o ?? "en"),
        n.provide("VueFinderOptions", t),
        n.component("VueFinder", T_);
    }
  };
module.exports = M_;
