var rr = Object.defineProperty;
var lr = (t, e, n) => e in t ? rr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var ms = (t, e, n) => lr(t, typeof e != "symbol" ? e + "" : e, n);
import { reactive as Vt, watch as Le, ref as M, shallowRef as ar, onMounted as xe, onUnmounted as Kn, onUpdated as Is, nextTick as dt, computed as He, readonly as ir, inject as re, openBlock as _, createElementBlock as g, withKeys as kt, unref as o, createElementVNode as l, withModifiers as ot, renderSlot as Tt, normalizeClass as le, toDisplayString as b, createBlock as K, resolveDynamicComponent as Ns, withCtx as Q, createVNode as q, Fragment as ge, renderList as ye, createCommentVNode as I, withDirectives as ue, vModelCheckbox as zt, createTextVNode as Z, vModelSelect as Tn, vModelText as St, onBeforeUnmount as Us, customRef as cr, vShow as Pe, isRef as dr, TransitionGroup as ur, normalizeStyle as an, mergeModels as Mn, useModel as Jt, resolveComponent as vr, provide as _r, Transition as fr } from "vue";
import mr from "mitt";
import pr from "dragselect";
import hr from "@uppy/core";
import gr from "@uppy/xhr-upload";
import br from "vanilla-lazyload";
import "cropperjs/dist/cropper.css";
import wr from "cropperjs";
var Hs;
const Sn = (Hs = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : Hs.getAttribute("content");
class yr {
  /** @param {RequestConfig} config */
  constructor(e) {
    /** @type {RequestConfig} */
    ms(this, "config");
    this.config = e;
  }
  /** @type {RequestConfig} */
  get config() {
    return this.config;
  }
  /**
   * Transform request params
   * @param {Object} input
   * @param {String} input.url
   * @param {'get'|'post'|'put'|'patch'|'delete'} input.method
   * @param {Record<String,String>=} input.headers
   * @param {Record<String,?String>=} input.params
   * @param {Record<String,?String>|FormData=} input.body
   * @return {RequestTransformResultInternal}
   */
  transformRequestParams(e) {
    const n = this.config, r = {};
    Sn != null && Sn !== "" && (r[n.xsrfHeaderName] = Sn);
    const s = Object.assign({}, n.headers, r, e.headers), c = Object.assign({}, n.params, e.params), a = e.body, d = n.baseUrl + e.url, i = e.method;
    let u;
    i !== "get" && (a instanceof FormData ? (u = a, n.body != null && Object.entries(this.config.body).forEach(([f, p]) => {
      u.append(f, p);
    })) : (u = { ...a }, n.body != null && Object.assign(u, this.config.body)));
    const h = {
      url: d,
      method: i,
      headers: s,
      params: c,
      body: u
    };
    if (n.transformRequest != null) {
      const f = n.transformRequest({
        url: d,
        method: i,
        headers: s,
        params: c,
        body: u
      });
      f.url != null && (h.url = f.url), f.method != null && (h.method = f.method), f.params != null && (h.params = f.params ?? {}), f.headers != null && (h.headers = f.headers ?? {}), f.body != null && (h.body = f.body);
    }
    return h;
  }
  /**
   * Get download url
   * @param {String} adapter
   * @param {String} node
   * @param {String} node.path
   * @param {String=} node.url
   * @return {String}
   */
  getDownloadUrl(e, n) {
    if (n.url != null)
      return n.url;
    const r = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "download", adapter: e, path: n.path }
    });
    return r.url + "?" + new URLSearchParams(r.params).toString();
  }
  /**
   * Get preview url
   * @param {String} adapter
   * @param {String} node
   * @param {String} node.path
   * @param {String=} node.url
   * @return {String}
   */
  getPreviewUrl(e, n) {
    if (n.url != null)
      return n.url;
    const r = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "preview", adapter: e, path: n.path }
    });
    return r.url + "?" + new URLSearchParams(r.params).toString();
  }
  /**
   * Send request
   * @param {Object} input
   * @param {String} input.url
   * @param {'get'|'post'|'put'|'patch'|'delete'} input.method
   * @param {Record<String,String>=} input.headers
   * @param {Record<String,?String>=} input.params
   * @param {(Record<String,?String>|FormData|null)=} input.body
   * @param {'arrayBuffer'|'blob'|'json'|'text'=} input.responseType
   * @param {AbortSignal=} input.abortSignal
   * @returns {Promise<(ArrayBuffer|Blob|Record<String,?String>|String|null)>}
   * @throws {Record<String,?String>|null} resp json error
   */
  async send(e) {
    const n = this.transformRequestParams(e), r = e.responseType || "json", s = {
      method: e.method,
      headers: n.headers,
      signal: e.abortSignal
    }, c = n.url + "?" + new URLSearchParams(n.params);
    if (n.method !== "get" && n.body != null) {
      let d;
      n.body instanceof FormData ? d = e.body : (d = JSON.stringify(n.body), s.headers["Content-Type"] = "application/json"), s.body = d;
    }
    const a = await fetch(c, s);
    if (a.ok)
      return await a[r]();
    throw await a.json();
  }
}
function kr(t) {
  const e = {
    baseUrl: "",
    headers: {},
    params: {},
    body: {},
    xsrfHeaderName: "X-CSRF-Token"
  };
  return typeof t == "string" ? Object.assign(e, { baseUrl: t }) : Object.assign(e, t), new yr(e);
}
function Sr(t) {
  let e = localStorage.getItem(t + "_storage");
  const n = Vt(JSON.parse(e ?? "{}"));
  Le(n, r);
  function r() {
    Object.keys(n).length ? localStorage.setItem(t + "_storage", JSON.stringify(n)) : localStorage.removeItem(t + "_storage");
  }
  function s(i, u) {
    n[i] = u;
  }
  function c(i) {
    delete n[i];
  }
  function a() {
    Object.keys(n).map((i) => c(i));
  }
  return { getStore: (i, u = null) => n.hasOwnProperty(i) ? n[i] : u, setStore: s, removeStore: c, clearStore: a };
}
async function xr(t, e) {
  const n = e[t];
  return typeof n == "function" ? (await n()).default : n;
}
function $r(t, e, n, r) {
  const { getStore: s, setStore: c } = t, a = M({}), d = M(s("locale", e)), i = (f, p = e) => {
    xr(f, r).then((v) => {
      a.value = v, c("locale", f), d.value = f, c("translations", v), Object.values(r).length > 1 && (n.emit("vf-toast-push", { label: "The language is set to " + f }), n.emit("vf-language-saved"));
    }).catch((v) => {
      p ? (n.emit("vf-toast-push", { label: "The selected locale is not yet supported!", type: "error" }), i(p, null)) : n.emit("vf-toast-push", { label: "Locale cannot be loaded!", type: "error" });
    });
  };
  Le(d, (f) => {
    i(f);
  }), !s("locale") && !r.length ? i(e) : a.value = s("translations");
  const u = (f, ...p) => p.length ? u(f = f.replace("%s", p.shift()), ...p) : f;
  function h(f, ...p) {
    return a.value && a.value.hasOwnProperty(f) ? u(a.value[f], ...p) : u(f, ...p);
  }
  return Vt({ t: h, locale: d });
}
const de = {
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
}, Cr = Object.values(de), Er = "2.5.16";
function Ps(t, e, n, r, s) {
  return (e = Math, n = e.log, r = 1024, s = n(t) / n(r) | 0, t / e.pow(r, s)).toFixed(0) + " " + (s ? "KMGTPEZY"[--s] + "iB" : "B");
}
function qs(t, e, n, r, s) {
  return (e = Math, n = e.log, r = 1e3, s = n(t) / n(r) | 0, t / e.pow(r, s)).toFixed(0) + " " + (s ? "KMGTPEZY"[--s] + "B" : "B");
}
function Ar(t) {
  const e = { k: 1, m: 2, g: 3, t: 4 }, r = /(\d+(?:\.\d+)?)\s?(k|m|g|t)?b?/i.exec(t);
  return r[1] * Math.pow(1024, e[r[2].toLowerCase()]);
}
const nt = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark"
};
function Tr(t, e) {
  const n = M(nt.SYSTEM), r = M(nt.LIGHT);
  n.value = t.getStore("theme", e ?? nt.SYSTEM);
  const s = window.matchMedia("(prefers-color-scheme: dark)"), c = (a) => {
    n.value === nt.DARK || n.value === nt.SYSTEM && a.matches ? r.value = nt.DARK : r.value = nt.LIGHT;
  };
  return c(s), s.addEventListener("change", c), {
    /**
     * @type {import('vue').Ref<Theme>}
     */
    value: n,
    /**
     * @type {import('vue').Ref<Theme>}
     */
    actualValue: r,
    /**
     * @param {Theme} value
     */
    set(a) {
      n.value = a, a !== nt.SYSTEM ? t.setStore("theme", a) : t.removeStore("theme"), c(s);
    }
  };
}
function Mr() {
  const t = ar(null), e = M(!1), n = M();
  return { visible: e, type: t, data: n, open: (c, a = null) => {
    document.querySelector("body").style.overflow = "hidden", e.value = !0, t.value = c, n.value = a;
  }, close: () => {
    document.querySelector("body").style.overflow = "", e.value = !1, t.value = null;
  } };
}
/*!
 * OverlayScrollbars
 * Version: 2.10.0
 *
 * Copyright (c) Rene Haas | KingSora.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 */
const De = (t, e) => {
  const { o: n, i: r, u: s } = t;
  let c = n, a;
  const d = (h, f) => {
    const p = c, v = h, m = f || (r ? !r(p, v) : p !== v);
    return (m || s) && (c = v, a = p), [c, m, a];
  };
  return [e ? (h) => d(e(c, a), h) : d, (h) => [c, !!h, a]];
}, Dr = typeof window < "u" && typeof HTMLElement < "u" && !!window.document, Me = Dr ? window : {}, zs = Math.max, Or = Math.min, Dn = Math.round, Qt = Math.abs, ps = Math.sign, js = Me.cancelAnimationFrame, Yn = Me.requestAnimationFrame, en = Me.setTimeout, On = Me.clearTimeout, cn = (t) => typeof Me[t] < "u" ? Me[t] : void 0, Vr = cn("MutationObserver"), hs = cn("IntersectionObserver"), tn = cn("ResizeObserver"), Kt = cn("ScrollTimeline"), Xn = (t) => t === void 0, dn = (t) => t === null, ze = (t) => typeof t == "number", Lt = (t) => typeof t == "string", Zn = (t) => typeof t == "boolean", Be = (t) => typeof t == "function", je = (t) => Array.isArray(t), nn = (t) => typeof t == "object" && !je(t) && !dn(t), Jn = (t) => {
  const e = !!t && t.length, n = ze(e) && e > -1 && e % 1 == 0;
  return je(t) || !Be(t) && n ? e > 0 && nn(t) ? e - 1 in t : !0 : !1;
}, sn = (t) => !!t && t.constructor === Object, on = (t) => t instanceof HTMLElement, un = (t) => t instanceof Element;
function ae(t, e) {
  if (Jn(t))
    for (let n = 0; n < t.length && e(t[n], n, t) !== !1; n++)
      ;
  else t && ae(Object.keys(t), (n) => e(t[n], n, t));
  return t;
}
const Gs = (t, e) => t.indexOf(e) >= 0, Mt = (t, e) => t.concat(e), me = (t, e, n) => (!Lt(e) && Jn(e) ? Array.prototype.push.apply(t, e) : t.push(e), t), lt = (t) => Array.from(t || []), Qn = (t) => je(t) ? t : !Lt(t) && Jn(t) ? lt(t) : [t], Vn = (t) => !!t && !t.length, Ln = (t) => lt(new Set(t)), Fe = (t, e, n) => {
  ae(t, (s) => s ? s.apply(void 0, e || []) : !0), !n && (t.length = 0);
}, Ws = "paddingTop", Ks = "paddingRight", Ys = "paddingLeft", Xs = "paddingBottom", Zs = "marginLeft", Js = "marginRight", Qs = "marginBottom", eo = "overflowX", to = "overflowY", vn = "width", _n = "height", st = "visible", ct = "hidden", bt = "scroll", Lr = (t) => {
  const e = String(t || "");
  return e ? e[0].toUpperCase() + e.slice(1) : "";
}, fn = (t, e, n, r) => {
  if (t && e) {
    let s = !0;
    return ae(n, (c) => {
      const a = t[c], d = e[c];
      a !== d && (s = !1);
    }), s;
  }
  return !1;
}, no = (t, e) => fn(t, e, ["w", "h"]), Yt = (t, e) => fn(t, e, ["x", "y"]), Fr = (t, e) => fn(t, e, ["t", "r", "b", "l"]), ut = () => {
}, X = (t, ...e) => t.bind(0, ...e), mt = (t) => {
  let e;
  const n = t ? en : Yn, r = t ? On : js;
  return [(s) => {
    r(e), e = n(() => s(), Be(t) ? t() : t);
  }, () => r(e)];
}, Fn = (t, e) => {
  const { _: n, v: r, p: s, S: c } = e || {};
  let a, d, i, u, h = ut;
  const f = function(y) {
    h(), On(a), u = a = d = void 0, h = ut, t.apply(this, y);
  }, p = (w) => c && d ? c(d, w) : w, v = () => {
    h !== ut && f(p(i) || i);
  }, m = function() {
    const y = lt(arguments), O = Be(n) ? n() : n;
    if (ze(O) && O >= 0) {
      const C = Be(r) ? r() : r, $ = ze(C) && C >= 0, V = O > 0 ? en : Yn, F = O > 0 ? On : js, L = p(y) || y, S = f.bind(0, L);
      let k;
      h(), s && !u ? (S(), u = !0, k = V(() => u = void 0, O)) : (k = V(S, O), $ && !a && (a = en(v, C))), h = () => F(k), d = i = L;
    } else
      f(y);
  };
  return m.m = v, m;
}, so = (t, e) => Object.prototype.hasOwnProperty.call(t, e), Ie = (t) => t ? Object.keys(t) : [], oe = (t, e, n, r, s, c, a) => {
  const d = [e, n, r, s, c, a];
  return (typeof t != "object" || dn(t)) && !Be(t) && (t = {}), ae(d, (i) => {
    ae(i, (u, h) => {
      const f = i[h];
      if (t === f)
        return !0;
      const p = je(f);
      if (f && sn(f)) {
        const v = t[h];
        let m = v;
        p && !je(v) ? m = [] : !p && !sn(v) && (m = {}), t[h] = oe(m, f);
      } else
        t[h] = p ? f.slice() : f;
    });
  }), t;
}, oo = (t, e) => ae(oe({}, t), (n, r, s) => {
  n === void 0 ? delete s[r] : n && sn(n) && (s[r] = oo(n));
}), es = (t) => !Ie(t).length, ro = (t, e, n) => zs(t, Or(e, n)), vt = (t) => Ln((je(t) ? t : (t || "").split(" ")).filter((e) => e)), ts = (t, e) => t && t.getAttribute(e), gs = (t, e) => t && t.hasAttribute(e), Ze = (t, e, n) => {
  ae(vt(e), (r) => {
    t && t.setAttribute(r, String(n || ""));
  });
}, Ue = (t, e) => {
  ae(vt(e), (n) => t && t.removeAttribute(n));
}, mn = (t, e) => {
  const n = vt(ts(t, e)), r = X(Ze, t, e), s = (c, a) => {
    const d = new Set(n);
    return ae(vt(c), (i) => {
      d[a](i);
    }), lt(d).join(" ");
  };
  return {
    O: (c) => r(s(c, "delete")),
    $: (c) => r(s(c, "add")),
    C: (c) => {
      const a = vt(c);
      return a.reduce((d, i) => d && n.includes(i), a.length > 0);
    }
  };
}, lo = (t, e, n) => (mn(t, e).O(n), X(ns, t, e, n)), ns = (t, e, n) => (mn(t, e).$(n), X(lo, t, e, n)), rn = (t, e, n, r) => (r ? ns : lo)(t, e, n), ss = (t, e, n) => mn(t, e).C(n), ao = (t) => mn(t, "class"), io = (t, e) => {
  ao(t).O(e);
}, os = (t, e) => (ao(t).$(e), X(io, t, e)), co = (t, e) => {
  const n = e ? un(e) && e : document;
  return n ? lt(n.querySelectorAll(t)) : [];
}, Rr = (t, e) => {
  const n = e ? un(e) && e : document;
  return n && n.querySelector(t);
}, Rn = (t, e) => un(t) && t.matches(e), uo = (t) => Rn(t, "body"), Bn = (t) => t ? lt(t.childNodes) : [], Dt = (t) => t && t.parentElement, pt = (t, e) => un(t) && t.closest(e), Hn = (t) => document.activeElement, Br = (t, e, n) => {
  const r = pt(t, e), s = t && Rr(n, r), c = pt(s, e) === r;
  return r && s ? r === t || s === t || c && pt(pt(t, n), e) !== r : !1;
}, wt = (t) => {
  ae(Qn(t), (e) => {
    const n = Dt(e);
    e && n && n.removeChild(e);
  });
}, Oe = (t, e) => X(wt, t && e && ae(Qn(e), (n) => {
  n && t.appendChild(n);
})), ht = (t) => {
  const e = document.createElement("div");
  return Ze(e, "class", t), e;
}, vo = (t) => {
  const e = ht();
  return e.innerHTML = t.trim(), ae(Bn(e), (n) => wt(n));
}, bs = (t, e) => t.getPropertyValue(e) || t[e] || "", _o = (t) => {
  const e = t || 0;
  return isFinite(e) ? e : 0;
}, jt = (t) => _o(parseFloat(t || "")), In = (t) => Math.round(t * 1e4) / 1e4, fo = (t) => `${In(_o(t))}px`;
function Ot(t, e) {
  t && e && ae(e, (n, r) => {
    try {
      const s = t.style, c = dn(n) || Zn(n) ? "" : ze(n) ? fo(n) : n;
      r.indexOf("--") === 0 ? s.setProperty(r, c) : s[r] = c;
    } catch {
    }
  });
}
function Qe(t, e, n) {
  const r = Lt(e);
  let s = r ? "" : {};
  if (t) {
    const c = Me.getComputedStyle(t, n) || t.style;
    s = r ? bs(c, e) : lt(e).reduce((a, d) => (a[d] = bs(c, d), a), s);
  }
  return s;
}
const ws = (t, e, n) => {
  const r = e ? `${e}-` : "", s = n ? `-${n}` : "", c = `${r}top${s}`, a = `${r}right${s}`, d = `${r}bottom${s}`, i = `${r}left${s}`, u = Qe(t, [c, a, d, i]);
  return {
    t: jt(u[c]),
    r: jt(u[a]),
    b: jt(u[d]),
    l: jt(u[i])
  };
}, Hr = (t, e) => `translate${nn(t) ? `(${t.x},${t.y})` : `Y(${t})`}`, Ir = (t) => !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length), Nr = {
  w: 0,
  h: 0
}, pn = (t, e) => e ? {
  w: e[`${t}Width`],
  h: e[`${t}Height`]
} : Nr, Ur = (t) => pn("inner", t || Me), gt = X(pn, "offset"), mo = X(pn, "client"), ln = X(pn, "scroll"), rs = (t) => {
  const e = parseFloat(Qe(t, vn)) || 0, n = parseFloat(Qe(t, _n)) || 0;
  return {
    w: e - Dn(e),
    h: n - Dn(n)
  };
}, xn = (t) => t.getBoundingClientRect(), Pr = (t) => !!t && Ir(t), Nn = (t) => !!(t && (t[_n] || t[vn])), po = (t, e) => {
  const n = Nn(t);
  return !Nn(e) && n;
}, ys = (t, e, n, r) => {
  ae(vt(e), (s) => {
    t && t.removeEventListener(s, n, r);
  });
}, ve = (t, e, n, r) => {
  var s;
  const c = (s = r && r.H) != null ? s : !0, a = r && r.I || !1, d = r && r.A || !1, i = {
    passive: c,
    capture: a
  };
  return X(Fe, vt(e).map((u) => {
    const h = d ? (f) => {
      ys(t, u, h, a), n && n(f);
    } : n;
    return t && t.addEventListener(u, h, i), X(ys, t, u, h, a);
  }));
}, ho = (t) => t.stopPropagation(), Un = (t) => t.preventDefault(), go = (t) => ho(t) || Un(t), qe = (t, e) => {
  const { x: n, y: r } = ze(e) ? {
    x: e,
    y: e
  } : e || {};
  ze(n) && (t.scrollLeft = n), ze(r) && (t.scrollTop = r);
}, Ve = (t) => ({
  x: t.scrollLeft,
  y: t.scrollTop
}), bo = () => ({
  D: {
    x: 0,
    y: 0
  },
  M: {
    x: 0,
    y: 0
  }
}), qr = (t, e) => {
  const { D: n, M: r } = t, { w: s, h: c } = e, a = (f, p, v) => {
    let m = ps(f) * v, w = ps(p) * v;
    if (m === w) {
      const y = Qt(f), O = Qt(p);
      w = y > O ? 0 : w, m = y < O ? 0 : m;
    }
    return m = m === w ? 0 : m, [m + 0, w + 0];
  }, [d, i] = a(n.x, r.x, s), [u, h] = a(n.y, r.y, c);
  return {
    D: {
      x: d,
      y: u
    },
    M: {
      x: i,
      y: h
    }
  };
}, ks = ({ D: t, M: e }) => {
  const n = (r, s) => r === 0 && r <= s;
  return {
    x: n(t.x, e.x),
    y: n(t.y, e.y)
  };
}, Ss = ({ D: t, M: e }, n) => {
  const r = (s, c, a) => ro(0, 1, (s - a) / (s - c) || 0);
  return {
    x: r(t.x, e.x, n.x),
    y: r(t.y, e.y, n.y)
  };
}, Pn = (t) => {
  t && t.focus && t.focus({
    preventScroll: !0
  });
}, xs = (t, e) => {
  ae(Qn(e), t);
}, qn = (t) => {
  const e = /* @__PURE__ */ new Map(), n = (c, a) => {
    if (c) {
      const d = e.get(c);
      xs((i) => {
        d && d[i ? "delete" : "clear"](i);
      }, a);
    } else
      e.forEach((d) => {
        d.clear();
      }), e.clear();
  }, r = (c, a) => {
    if (Lt(c)) {
      const u = e.get(c) || /* @__PURE__ */ new Set();
      return e.set(c, u), xs((h) => {
        Be(h) && u.add(h);
      }, a), X(n, c, a);
    }
    Zn(a) && a && n();
    const d = Ie(c), i = [];
    return ae(d, (u) => {
      const h = c[u];
      h && me(i, r(u, h));
    }), X(Fe, i);
  }, s = (c, a) => {
    ae(lt(e.get(c)), (d) => {
      a && !Vn(a) ? d.apply(0, a) : d();
    });
  };
  return r(t || {}), [r, n, s];
}, $s = (t) => JSON.stringify(t, (e, n) => {
  if (Be(n))
    throw 0;
  return n;
}), Cs = (t, e) => t ? `${e}`.split(".").reduce((n, r) => n && so(n, r) ? n[r] : void 0, t) : void 0, zr = {
  paddingAbsolute: !1,
  showNativeOverlaidScrollbars: !1,
  update: {
    elementEvents: [["img", "load"]],
    debounce: [0, 33],
    attributes: null,
    ignoreMutation: null
  },
  overflow: {
    x: "scroll",
    y: "scroll"
  },
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
}, wo = (t, e) => {
  const n = {}, r = Mt(Ie(e), Ie(t));
  return ae(r, (s) => {
    const c = t[s], a = e[s];
    if (nn(c) && nn(a))
      oe(n[s] = {}, wo(c, a)), es(n[s]) && delete n[s];
    else if (so(e, s) && a !== c) {
      let d = !0;
      if (je(c) || je(a))
        try {
          $s(c) === $s(a) && (d = !1);
        } catch {
        }
      d && (n[s] = a);
    }
  }), n;
}, Es = (t, e, n) => (r) => [Cs(t, r), n || Cs(e, r) !== void 0], xt = "data-overlayscrollbars", Xt = "os-environment", Gt = `${Xt}-scrollbar-hidden`, $n = `${xt}-initialize`, Zt = "noClipping", As = `${xt}-body`, rt = xt, jr = "host", Je = `${xt}-viewport`, Gr = eo, Wr = to, Kr = "arrange", yo = "measuring", Yr = "scrolling", ko = "scrollbarHidden", Xr = "noContent", zn = `${xt}-padding`, Ts = `${xt}-content`, ls = "os-size-observer", Zr = `${ls}-appear`, Jr = `${ls}-listener`, Qr = "os-trinsic-observer", el = "os-theme-none", Re = "os-scrollbar", tl = `${Re}-rtl`, nl = `${Re}-horizontal`, sl = `${Re}-vertical`, So = `${Re}-track`, as = `${Re}-handle`, ol = `${Re}-visible`, rl = `${Re}-cornerless`, Ms = `${Re}-interaction`, Ds = `${Re}-unusable`, jn = `${Re}-auto-hide`, Os = `${jn}-hidden`, Vs = `${Re}-wheel`, ll = `${So}-interactive`, al = `${as}-interactive`;
let xo;
const il = () => xo, cl = (t) => {
  xo = t;
};
let Cn;
const dl = () => {
  const t = ($, V, F) => {
    Oe(document.body, $), Oe(document.body, $);
    const z = mo($), L = gt($), S = rs(V);
    return F && wt($), {
      x: L.h - z.h + S.h,
      y: L.w - z.w + S.w
    };
  }, e = ($) => {
    let V = !1;
    const F = os($, Gt);
    try {
      V = Qe($, "scrollbar-width") === "none" || Qe($, "display", "::-webkit-scrollbar") === "none";
    } catch {
    }
    return F(), V;
  }, n = `.${Xt}{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.${Xt} div{width:200%;height:200%;margin:10px 0}.${Gt}{scrollbar-width:none!important}.${Gt}::-webkit-scrollbar,.${Gt}::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}`, s = vo(`<div class="${Xt}"><div></div><style>${n}</style></div>`)[0], c = s.firstChild, a = s.lastChild, d = il();
  d && (a.nonce = d);
  const [i, , u] = qn(), [h, f] = De({
    o: t(s, c),
    i: Yt
  }, X(t, s, c, !0)), [p] = f(), v = e(s), m = {
    x: p.x === 0,
    y: p.y === 0
  }, w = {
    elements: {
      host: null,
      padding: !v,
      viewport: ($) => v && uo($) && $,
      content: !1
    },
    scrollbars: {
      slot: !0
    },
    cancel: {
      nativeScrollbarsOverlaid: !1,
      body: null
    }
  }, y = oe({}, zr), O = X(oe, {}, y), T = X(oe, {}, w), C = {
    T: p,
    k: m,
    R: v,
    V: !!Kt,
    L: X(i, "r"),
    U: T,
    P: ($) => oe(w, $) && T(),
    N: O,
    q: ($) => oe(y, $) && O(),
    B: oe({}, w),
    F: oe({}, y)
  };
  if (Ue(s, "style"), wt(s), ve(Me, "resize", () => {
    u("r", []);
  }), Be(Me.matchMedia) && !v && (!m.x || !m.y)) {
    const $ = (V) => {
      const F = Me.matchMedia(`(resolution: ${Me.devicePixelRatio}dppx)`);
      ve(F, "change", () => {
        V(), $(V);
      }, {
        A: !0
      });
    };
    $(() => {
      const [V, F] = h();
      oe(C.T, V), u("r", [F]);
    });
  }
  return C;
}, We = () => (Cn || (Cn = dl()), Cn), $o = (t, e) => Be(e) ? e.apply(0, t) : e, ul = (t, e, n, r) => {
  const s = Xn(r) ? n : r;
  return $o(t, s) || e.apply(0, t);
}, Co = (t, e, n, r) => {
  const s = Xn(r) ? n : r, c = $o(t, s);
  return !!c && (on(c) ? c : e.apply(0, t));
}, vl = (t, e) => {
  const { nativeScrollbarsOverlaid: n, body: r } = e || {}, { k: s, R: c, U: a } = We(), { nativeScrollbarsOverlaid: d, body: i } = a().cancel, u = n ?? d, h = Xn(r) ? i : r, f = (s.x || s.y) && u, p = t && (dn(h) ? !c : h);
  return !!f || !!p;
}, is = /* @__PURE__ */ new WeakMap(), _l = (t, e) => {
  is.set(t, e);
}, fl = (t) => {
  is.delete(t);
}, Eo = (t) => is.get(t), ml = (t, e, n) => {
  let r = !1;
  const s = n ? /* @__PURE__ */ new WeakMap() : !1, c = () => {
    r = !0;
  }, a = (d) => {
    if (s && n) {
      const i = n.map((u) => {
        const [h, f] = u || [];
        return [f && h ? (d || co)(h, t) : [], f];
      });
      ae(i, (u) => ae(u[0], (h) => {
        const f = u[1], p = s.get(h) || [];
        if (t.contains(h) && f) {
          const m = ve(h, f, (w) => {
            r ? (m(), s.delete(h)) : e(w);
          });
          s.set(h, me(p, m));
        } else
          Fe(p), s.delete(h);
      }));
    }
  };
  return a(), [c, a];
}, Ls = (t, e, n, r) => {
  let s = !1;
  const { j: c, X: a, Y: d, W: i, J: u, G: h } = r || {}, f = Fn(() => s && n(!0), {
    _: 33,
    v: 99
  }), [p, v] = ml(t, f, d), m = c || [], w = a || [], y = Mt(m, w), O = (C, $) => {
    if (!Vn($)) {
      const V = u || ut, F = h || ut, z = [], L = [];
      let S = !1, k = !1;
      if (ae($, (E) => {
        const { attributeName: A, target: H, type: x, oldValue: U, addedNodes: P, removedNodes: ee } = E, se = x === "attributes", ne = x === "childList", pe = t === H, R = se && A, B = R && ts(H, A || ""), N = Lt(B) ? B : null, j = R && U !== N, D = Gs(w, A) && j;
        if (e && (ne || !pe)) {
          const W = se && j, G = W && i && Rn(H, i), te = (G ? !V(H, A, U, N) : !se || W) && !F(E, !!G, t, r);
          ae(P, (ie) => me(z, ie)), ae(ee, (ie) => me(z, ie)), k = k || te;
        }
        !e && pe && j && !V(H, A, U, N) && (me(L, A), S = S || D);
      }), v((E) => Ln(z).reduce((A, H) => (me(A, co(E, H)), Rn(H, E) ? me(A, H) : A), [])), e)
        return !C && k && n(!1), [!1];
      if (!Vn(L) || S) {
        const E = [Ln(L), S];
        return !C && n.apply(0, E), E;
      }
    }
  }, T = new Vr(X(O, !1));
  return [() => (T.observe(t, {
    attributes: !0,
    attributeOldValue: !0,
    attributeFilter: y,
    subtree: e,
    childList: e,
    characterData: e
  }), s = !0, () => {
    s && (p(), T.disconnect(), s = !1);
  }), () => {
    if (s)
      return f.m(), O(!0, T.takeRecords());
  }];
}, Ao = {}, To = {}, pl = (t) => {
  ae(t, (e) => ae(e, (n, r) => {
    Ao[r] = e[r];
  }));
}, Mo = (t, e, n) => Ie(t).map((r) => {
  const { static: s, instance: c } = t[r], [a, d, i] = n || [], u = n ? c : s;
  if (u) {
    const h = n ? u(a, d, e) : u(e);
    return (i || To)[r] = h;
  }
}), Ft = (t) => To[t], hl = "__osOptionsValidationPlugin", gl = "__osSizeObserverPlugin", bl = (t, e) => {
  const { k: n } = e, [r, s] = t("showNativeOverlaidScrollbars");
  return [r && n.x && n.y, s];
}, yt = (t) => t.indexOf(st) === 0, wl = (t, e) => {
  const n = (s, c, a, d) => {
    const i = s === st ? ct : s.replace(`${st}-`, ""), u = yt(s), h = yt(a);
    return !c && !d ? ct : u && h ? st : u ? c && d ? i : c ? st : ct : c ? i : h && d ? st : ct;
  }, r = {
    x: n(e.x, t.x, e.y, t.y),
    y: n(e.y, t.y, e.x, t.x)
  };
  return {
    K: r,
    Z: {
      x: r.x === bt,
      y: r.y === bt
    }
  };
}, Do = "__osScrollbarsHidingPlugin", yl = "__osClickScrollPlugin", Oo = (t, e, n) => {
  const { dt: r } = n || {}, s = Ft(gl), [c] = De({
    o: !1,
    u: !0
  });
  return () => {
    const a = [], i = vo(`<div class="${ls}"><div class="${Jr}"></div></div>`)[0], u = i.firstChild, h = (f) => {
      const p = f instanceof ResizeObserverEntry;
      let v = !1, m = !1;
      if (p) {
        const [w, , y] = c(f.contentRect), O = Nn(w);
        m = po(w, y), v = !m && !O;
      } else
        m = f === !0;
      v || e({
        ft: !0,
        dt: m
      });
    };
    if (tn) {
      const f = new tn((p) => h(p.pop()));
      f.observe(u), me(a, () => {
        f.disconnect();
      });
    } else if (s) {
      const [f, p] = s(u, h, r);
      me(a, Mt([os(i, Zr), ve(i, "animationstart", f)], p));
    } else
      return ut;
    return X(Fe, me(a, Oe(t, i)));
  };
}, kl = (t, e) => {
  let n;
  const r = (i) => i.h === 0 || i.isIntersecting || i.intersectionRatio > 0, s = ht(Qr), [c] = De({
    o: !1
  }), a = (i, u) => {
    if (i) {
      const h = c(r(i)), [, f] = h;
      return f && !u && e(h) && [h];
    }
  }, d = (i, u) => a(u.pop(), i);
  return [() => {
    const i = [];
    if (hs)
      n = new hs(X(d, !1), {
        root: t
      }), n.observe(s), me(i, () => {
        n.disconnect();
      });
    else {
      const u = () => {
        const h = gt(s);
        a(h);
      };
      me(i, Oo(s, u)()), u();
    }
    return X(Fe, me(i, Oe(t, s)));
  }, () => n && d(!0, n.takeRecords())];
}, Sl = (t, e, n, r) => {
  let s, c, a, d, i, u;
  const h = `[${rt}]`, f = `[${Je}]`, p = ["id", "class", "style", "open", "wrap", "cols", "rows"], { vt: v, ht: m, ot: w, gt: y, bt: O, nt: T, wt: C, yt: $, St: V, Ot: F } = t, z = (D) => Qe(D, "direction") === "rtl", L = {
    $t: !1,
    ct: z(v)
  }, S = We(), k = Ft(Do), [E] = De({
    i: no,
    o: {
      w: 0,
      h: 0
    }
  }, () => {
    const D = k && k.tt(t, e, L, S, n).ut, G = !(C && T) && ss(m, rt, Zt), Y = !T && $(Kr), te = Y && Ve(y), ie = te && F(), be = V(yo, G), _e = Y && D && D()[0], $e = ln(w), J = rs(w);
    return _e && _e(), qe(y, te), ie && ie(), G && be(), {
      w: $e.w + J.w,
      h: $e.h + J.h
    };
  }), A = Fn(r, {
    _: () => s,
    v: () => c,
    S(D, W) {
      const [G] = D, [Y] = W;
      return [Mt(Ie(G), Ie(Y)).reduce((te, ie) => (te[ie] = G[ie] || Y[ie], te), {})];
    }
  }), H = (D) => {
    const W = z(v);
    oe(D, {
      Ct: u !== W
    }), oe(L, {
      ct: W
    }), u = W;
  }, x = (D, W) => {
    const [G, Y] = D, te = {
      xt: Y
    };
    return oe(L, {
      $t: G
    }), !W && r(te), te;
  }, U = ({ ft: D, dt: W }) => {
    const Y = !(D && !W) && S.R ? A : r, te = {
      ft: D || W,
      dt: W
    };
    H(te), Y(te);
  }, P = (D, W) => {
    const [, G] = E(), Y = {
      Ht: G
    };
    return H(Y), G && !W && (D ? r : A)(Y), Y;
  }, ee = (D, W, G) => {
    const Y = {
      Et: W
    };
    return H(Y), W && !G && A(Y), Y;
  }, [se, ne] = O ? kl(m, x) : [], pe = !T && Oo(m, U, {
    dt: !0
  }), [R, B] = Ls(m, !1, ee, {
    X: p,
    j: p
  }), N = T && tn && new tn((D) => {
    const W = D[D.length - 1].contentRect;
    U({
      ft: !0,
      dt: po(W, i)
    }), i = W;
  }), j = Fn(() => {
    const [, D] = E();
    r({
      Ht: D
    });
  }, {
    _: 222,
    p: !0
  });
  return [() => {
    N && N.observe(m);
    const D = pe && pe(), W = se && se(), G = R(), Y = S.L((te) => {
      te ? A({
        zt: te
      }) : j();
    });
    return () => {
      N && N.disconnect(), D && D(), W && W(), d && d(), G(), Y();
    };
  }, ({ It: D, At: W, Dt: G }) => {
    const Y = {}, [te] = D("update.ignoreMutation"), [ie, be] = D("update.attributes"), [_e, $e] = D("update.elementEvents"), [J, Ce] = D("update.debounce"), Ae = $e || be, ke = W || G, Ee = (he) => Be(te) && te(he);
    if (Ae) {
      a && a(), d && d();
      const [he, we] = Ls(O || w, !0, P, {
        j: Mt(p, ie || []),
        Y: _e,
        W: h,
        G: (ce, fe) => {
          const { target: Se, attributeName: Te } = ce;
          return (!fe && Te && !T ? Br(Se, h, f) : !1) || !!pt(Se, `.${Re}`) || !!Ee(ce);
        }
      });
      d = he(), a = we;
    }
    if (Ce)
      if (A.m(), je(J)) {
        const he = J[0], we = J[1];
        s = ze(he) && he, c = ze(we) && we;
      } else ze(J) ? (s = J, c = !1) : (s = !1, c = !1);
    if (ke) {
      const he = B(), we = ne && ne(), ce = a && a();
      he && oe(Y, ee(he[0], he[1], ke)), we && oe(Y, x(we[0], ke)), ce && oe(Y, P(ce[0], ke));
    }
    return H(Y), Y;
  }, L];
}, xl = (t, e, n, r) => {
  const s = "--os-viewport-percent", c = "--os-scroll-percent", a = "--os-scroll-direction", { U: d } = We(), { scrollbars: i } = d(), { slot: u } = i, { vt: h, ht: f, ot: p, Mt: v, gt: m, wt: w, nt: y } = e, { scrollbars: O } = v ? {} : t, { slot: T } = O || {}, C = [], $ = [], V = [], F = Co([h, f, p], () => y && w ? h : f, u, T), z = (R) => {
    if (Kt) {
      const B = new Kt({
        source: m,
        axis: R
      });
      return {
        kt: (j) => {
          const D = j.Tt.animate({
            clear: ["left"],
            [c]: [0, 1]
          }, {
            timeline: B
          });
          return () => D.cancel();
        }
      };
    }
  }, L = {
    x: z("x"),
    y: z("y")
  }, S = () => {
    const { Rt: R, Vt: B } = n, N = (j, D) => ro(0, 1, j / (j + D) || 0);
    return {
      x: N(B.x, R.x),
      y: N(B.y, R.y)
    };
  }, k = (R, B, N) => {
    const j = N ? os : io;
    ae(R, (D) => {
      j(D.Tt, B);
    });
  }, E = (R, B) => {
    ae(R, (N) => {
      const [j, D] = B(N);
      Ot(j, D);
    });
  }, A = (R, B, N) => {
    const j = Zn(N), D = j ? N : !0, W = j ? !N : !0;
    D && k($, R, B), W && k(V, R, B);
  }, H = () => {
    const R = S(), B = (N) => (j) => [j.Tt, {
      [s]: In(N) + ""
    }];
    E($, B(R.x)), E(V, B(R.y));
  }, x = () => {
    if (!Kt) {
      const { Lt: R } = n, B = Ss(R, Ve(m)), N = (j) => (D) => [D.Tt, {
        [c]: In(j) + ""
      }];
      E($, N(B.x)), E(V, N(B.y));
    }
  }, U = () => {
    const { Lt: R } = n, B = ks(R), N = (j) => (D) => [D.Tt, {
      [a]: j ? "0" : "1"
    }];
    E($, N(B.x)), E(V, N(B.y));
  }, P = () => {
    if (y && !w) {
      const { Rt: R, Lt: B } = n, N = ks(B), j = Ss(B, Ve(m)), D = (W) => {
        const { Tt: G } = W, Y = Dt(G) === p && G, te = (ie, be, _e) => {
          const $e = be * ie;
          return fo(_e ? $e : -$e);
        };
        return [Y, Y && {
          transform: Hr({
            x: te(j.x, R.x, N.x),
            y: te(j.y, R.y, N.y)
          })
        }];
      };
      E($, D), E(V, D);
    }
  }, ee = (R) => {
    const B = R ? "x" : "y", j = ht(`${Re} ${R ? nl : sl}`), D = ht(So), W = ht(as), G = {
      Tt: j,
      Ut: D,
      Pt: W
    }, Y = L[B];
    return me(R ? $ : V, G), me(C, [Oe(j, D), Oe(D, W), X(wt, j), Y && Y.kt(G), r(G, A, R)]), G;
  }, se = X(ee, !0), ne = X(ee, !1), pe = () => (Oe(F, $[0].Tt), Oe(F, V[0].Tt), X(Fe, C));
  return se(), ne(), [{
    Nt: H,
    qt: x,
    Bt: U,
    Ft: P,
    jt: A,
    Xt: {
      Yt: $,
      Wt: se,
      Jt: X(E, $)
    },
    Gt: {
      Yt: V,
      Wt: ne,
      Jt: X(E, V)
    }
  }, pe];
}, $l = (t, e, n, r) => (s, c, a) => {
  const { ht: d, ot: i, nt: u, gt: h, Kt: f, Ot: p } = e, { Tt: v, Ut: m, Pt: w } = s, [y, O] = mt(333), [T, C] = mt(444), $ = (z) => {
    Be(h.scrollBy) && h.scrollBy({
      behavior: "smooth",
      left: z.x,
      top: z.y
    });
  }, V = () => {
    const z = "pointerup pointercancel lostpointercapture", L = `client${a ? "X" : "Y"}`, S = a ? vn : _n, k = a ? "left" : "top", E = a ? "w" : "h", A = a ? "x" : "y", H = (U, P) => (ee) => {
      const { Rt: se } = n, ne = gt(m)[E] - gt(w)[E], R = P * ee / ne * se[A];
      qe(h, {
        [A]: U + R
      });
    }, x = [];
    return ve(m, "pointerdown", (U) => {
      const P = pt(U.target, `.${as}`) === w, ee = P ? w : m, se = t.scrollbars, ne = se[P ? "dragScroll" : "clickScroll"], { button: pe, isPrimary: R, pointerType: B } = U, { pointers: N } = se;
      if (pe === 0 && R && ne && (N || []).includes(B)) {
        Fe(x), C();
        const D = !P && (U.shiftKey || ne === "instant"), W = X(xn, w), G = X(xn, m), Y = (fe, Se) => (fe || W())[k] - (Se || G())[k], te = Dn(xn(h)[S]) / gt(h)[E] || 1, ie = H(Ve(h)[A], 1 / te), be = U[L], _e = W(), $e = G(), J = _e[S], Ce = Y(_e, $e) + J / 2, Ae = be - $e[k], ke = P ? 0 : Ae - Ce, Ee = (fe) => {
          Fe(ce), ee.releasePointerCapture(fe.pointerId);
        }, he = P || D, we = p(), ce = [ve(f, z, Ee), ve(f, "selectstart", (fe) => Un(fe), {
          H: !1
        }), ve(m, z, Ee), he && ve(m, "pointermove", (fe) => ie(ke + (fe[L] - be))), he && (() => {
          const fe = Ve(h);
          we();
          const Se = Ve(h), Te = {
            x: Se.x - fe.x,
            y: Se.y - fe.y
          };
          (Qt(Te.x) > 3 || Qt(Te.y) > 3) && (p(), qe(h, fe), $(Te), T(we));
        })];
        if (ee.setPointerCapture(U.pointerId), D)
          ie(ke);
        else if (!P) {
          const fe = Ft(yl);
          if (fe) {
            const Se = fe(ie, ke, J, (Te) => {
              Te ? we() : me(ce, we);
            });
            me(ce, Se), me(x, X(Se, !0));
          }
        }
      }
    });
  };
  let F = !0;
  return X(Fe, [ve(w, "pointermove pointerleave", r), ve(v, "pointerenter", () => {
    c(Ms, !0);
  }), ve(v, "pointerleave pointercancel", () => {
    c(Ms, !1);
  }), !u && ve(v, "mousedown", () => {
    const z = Hn();
    (gs(z, Je) || gs(z, rt) || z === document.body) && en(X(Pn, i), 25);
  }), ve(v, "wheel", (z) => {
    const { deltaX: L, deltaY: S, deltaMode: k } = z;
    F && k === 0 && Dt(v) === d && $({
      x: L,
      y: S
    }), F = !1, c(Vs, !0), y(() => {
      F = !0, c(Vs);
    }), Un(z);
  }, {
    H: !1,
    I: !0
  }), ve(v, "pointerdown", X(ve, f, "click", go, {
    A: !0,
    I: !0,
    H: !1
  }), {
    I: !0
  }), V(), O, C]);
}, Cl = (t, e, n, r, s, c) => {
  let a, d, i, u, h, f = ut, p = 0;
  const v = (R) => R.pointerType === "mouse", [m, w] = mt(), [y, O] = mt(100), [T, C] = mt(100), [$, V] = mt(() => p), [F, z] = xl(t, s, r, $l(e, s, r, (R) => v(R) && ee())), { ht: L, Qt: S, wt: k } = s, { jt: E, Nt: A, qt: H, Bt: x, Ft: U } = F, P = (R, B) => {
    if (V(), R)
      E(Os);
    else {
      const N = X(E, Os, !0);
      p > 0 && !B ? $(N) : N();
    }
  }, ee = () => {
    (i ? !a : !u) && (P(!0), y(() => {
      P(!1);
    }));
  }, se = (R) => {
    E(jn, R, !0), E(jn, R, !1);
  }, ne = (R) => {
    v(R) && (a = i, i && P(!0));
  }, pe = [V, O, C, w, () => f(), ve(L, "pointerover", ne, {
    A: !0
  }), ve(L, "pointerenter", ne), ve(L, "pointerleave", (R) => {
    v(R) && (a = !1, i && P(!1));
  }), ve(L, "pointermove", (R) => {
    v(R) && d && ee();
  }), ve(S, "scroll", (R) => {
    m(() => {
      H(), ee();
    }), c(R), U();
  })];
  return [() => X(Fe, me(pe, z())), ({ It: R, Dt: B, Zt: N, tn: j }) => {
    const { nn: D, sn: W, en: G, cn: Y } = j || {}, { Ct: te, dt: ie } = N || {}, { ct: be } = n, { k: _e } = We(), { K: $e, rn: J } = r, [Ce, Ae] = R("showNativeOverlaidScrollbars"), [ke, Ee] = R("scrollbars.theme"), [he, we] = R("scrollbars.visibility"), [ce, fe] = R("scrollbars.autoHide"), [Se, Te] = R("scrollbars.autoHideSuspend"), [$t] = R("scrollbars.autoHideDelay"), [Rt, Bt] = R("scrollbars.dragScroll"), [Ht, at] = R("scrollbars.clickScroll"), [_t, gn] = R("overflow"), bn = ie && !B, wn = J.x || J.y, yn = D || W || Y || te || B, Ne = G || we || gn, kn = Ce && _e.x && _e.y, Ct = (Et, tt, It) => {
      const At = Et.includes(bt) && (he === st || he === "auto" && tt === bt);
      return E(ol, At, It), At;
    };
    if (p = $t, bn && (Se && wn ? (se(!1), f(), T(() => {
      f = ve(S, "scroll", X(se, !0), {
        A: !0
      });
    })) : se(!0)), Ae && E(el, kn), Ee && (E(h), E(ke, !0), h = ke), Te && !Se && se(!0), fe && (d = ce === "move", i = ce === "leave", u = ce === "never", P(u, !0)), Bt && E(al, Rt), at && E(ll, !!Ht), Ne) {
      const Et = Ct(_t.x, $e.x, !0), tt = Ct(_t.y, $e.y, !1);
      E(rl, !(Et && tt));
    }
    yn && (H(), A(), U(), Y && x(), E(Ds, !J.x, !0), E(Ds, !J.y, !1), E(tl, be && !k));
  }, {}, F];
}, El = (t) => {
  const e = We(), { U: n, R: r } = e, { elements: s } = n(), { padding: c, viewport: a, content: d } = s, i = on(t), u = i ? {} : t, { elements: h } = u, { padding: f, viewport: p, content: v } = h || {}, m = i ? t : u.target, w = uo(m), y = m.ownerDocument, O = y.documentElement, T = () => y.defaultView || Me, C = X(ul, [m]), $ = X(Co, [m]), V = X(ht, ""), F = X(C, V, a), z = X($, V, d), L = (J) => {
    const Ce = gt(J), Ae = ln(J), ke = Qe(J, eo), Ee = Qe(J, to);
    return Ae.w - Ce.w > 0 && !yt(ke) || Ae.h - Ce.h > 0 && !yt(Ee);
  }, S = F(p), k = S === m, E = k && w, A = !k && z(v), H = !k && S === A, x = E ? O : S, U = E ? x : m, P = !k && $(V, c, f), ee = !H && A, se = [ee, x, P, U].map((J) => on(J) && !Dt(J) && J), ne = (J) => J && Gs(se, J), pe = !ne(x) && L(x) ? x : m, R = E ? O : x, N = {
    vt: m,
    ht: U,
    ot: x,
    ln: P,
    bt: ee,
    gt: R,
    Qt: E ? y : x,
    an: w ? O : pe,
    Kt: y,
    wt: w,
    Mt: i,
    nt: k,
    un: T,
    yt: (J) => ss(x, Je, J),
    St: (J, Ce) => rn(x, Je, J, Ce),
    Ot: () => rn(R, Je, Yr, !0)
  }, { vt: j, ht: D, ln: W, ot: G, bt: Y } = N, te = [() => {
    Ue(D, [rt, $n]), Ue(j, $n), w && Ue(O, [$n, rt]);
  }];
  let ie = Bn([Y, G, W, D, j].find((J) => J && !ne(J)));
  const be = E ? j : Y || G, _e = X(Fe, te);
  return [N, () => {
    const J = T(), Ce = Hn(), Ae = (ce) => {
      Oe(Dt(ce), Bn(ce)), wt(ce);
    }, ke = (ce) => ve(ce, "focusin focusout focus blur", go, {
      I: !0,
      H: !1
    }), Ee = "tabindex", he = ts(G, Ee), we = ke(Ce);
    return Ze(D, rt, k ? "" : jr), Ze(W, zn, ""), Ze(G, Je, ""), Ze(Y, Ts, ""), k || (Ze(G, Ee, he || "-1"), w && Ze(O, As, "")), Oe(be, ie), Oe(D, W), Oe(W || D, !k && G), Oe(G, Y), me(te, [we, () => {
      const ce = Hn(), fe = ne(G), Se = fe && ce === G ? j : ce, Te = ke(Se);
      Ue(W, zn), Ue(Y, Ts), Ue(G, Je), w && Ue(O, As), he ? Ze(G, Ee, he) : Ue(G, Ee), ne(Y) && Ae(Y), fe && Ae(G), ne(W) && Ae(W), Pn(Se), Te();
    }]), r && !k && (ns(G, Je, ko), me(te, X(Ue, G, Je))), Pn(!k && w && Ce === j && J.top === J ? G : Ce), we(), ie = 0, _e;
  }, _e];
}, Al = ({ bt: t }) => ({ Zt: e, _n: n, Dt: r }) => {
  const { xt: s } = e || {}, { $t: c } = n;
  t && (s || r) && Ot(t, {
    [_n]: c && "100%"
  });
}, Tl = ({ ht: t, ln: e, ot: n, nt: r }, s) => {
  const [c, a] = De({
    i: Fr,
    o: ws()
  }, X(ws, t, "padding", ""));
  return ({ It: d, Zt: i, _n: u, Dt: h }) => {
    let [f, p] = a(h);
    const { R: v } = We(), { ft: m, Ht: w, Ct: y } = i || {}, { ct: O } = u, [T, C] = d("paddingAbsolute");
    (m || p || (h || w)) && ([f, p] = c(h));
    const V = !r && (C || y || p);
    if (V) {
      const F = !T || !e && !v, z = f.r + f.l, L = f.t + f.b, S = {
        [Js]: F && !O ? -z : 0,
        [Qs]: F ? -L : 0,
        [Zs]: F && O ? -z : 0,
        top: F ? -f.t : 0,
        right: F ? O ? -f.r : "auto" : 0,
        left: F ? O ? "auto" : -f.l : 0,
        [vn]: F && `calc(100% + ${z}px)`
      }, k = {
        [Ws]: F ? f.t : 0,
        [Ks]: F ? f.r : 0,
        [Xs]: F ? f.b : 0,
        [Ys]: F ? f.l : 0
      };
      Ot(e || n, S), Ot(n, k), oe(s, {
        ln: f,
        dn: !F,
        rt: e ? k : oe({}, S, k)
      });
    }
    return {
      fn: V
    };
  };
}, Ml = (t, e) => {
  const n = We(), { ht: r, ln: s, ot: c, nt: a, Qt: d, gt: i, wt: u, St: h, un: f } = t, { R: p } = n, v = u && a, m = X(zs, 0), w = {
    display: () => !1,
    direction: (B) => B !== "ltr",
    flexDirection: (B) => B.endsWith("-reverse"),
    writingMode: (B) => B !== "horizontal-tb"
  }, y = Ie(w), O = {
    i: no,
    o: {
      w: 0,
      h: 0
    }
  }, T = {
    i: Yt,
    o: {}
  }, C = (B) => {
    h(yo, !v && B);
  }, $ = (B) => {
    if (!y.some((be) => {
      const _e = B[be];
      return _e && w[be](_e);
    }))
      return {
        D: {
          x: 0,
          y: 0
        },
        M: {
          x: 1,
          y: 1
        }
      };
    C(!0);
    const j = Ve(i), D = h(Xr, !0), W = ve(d, bt, (be) => {
      const _e = Ve(i);
      be.isTrusted && _e.x === j.x && _e.y === j.y && ho(be);
    }, {
      I: !0,
      A: !0
    });
    qe(i, {
      x: 0,
      y: 0
    }), D();
    const G = Ve(i), Y = ln(i);
    qe(i, {
      x: Y.w,
      y: Y.h
    });
    const te = Ve(i);
    qe(i, {
      x: te.x - G.x < 1 && -Y.w,
      y: te.y - G.y < 1 && -Y.h
    });
    const ie = Ve(i);
    return qe(i, j), Yn(() => W()), {
      D: G,
      M: ie
    };
  }, V = (B, N) => {
    const j = Me.devicePixelRatio % 1 !== 0 ? 1 : 0, D = {
      w: m(B.w - N.w),
      h: m(B.h - N.h)
    };
    return {
      w: D.w > j ? D.w : 0,
      h: D.h > j ? D.h : 0
    };
  }, [F, z] = De(O, X(rs, c)), [L, S] = De(O, X(ln, c)), [k, E] = De(O), [A] = De(T), [H, x] = De(O), [U] = De(T), [P] = De({
    i: (B, N) => fn(B, N, y),
    o: {}
  }, () => Pr(c) ? Qe(c, y) : {}), [ee, se] = De({
    i: (B, N) => Yt(B.D, N.D) && Yt(B.M, N.M),
    o: bo()
  }), ne = Ft(Do), pe = (B, N) => `${N ? Gr : Wr}${Lr(B)}`, R = (B) => {
    const N = (D) => [st, ct, bt].map((W) => pe(W, D)), j = N(!0).concat(N()).join(" ");
    h(j), h(Ie(B).map((D) => pe(B[D], D === "x")).join(" "), !0);
  };
  return ({ It: B, Zt: N, _n: j, Dt: D }, { fn: W }) => {
    const { ft: G, Ht: Y, Ct: te, dt: ie, zt: be } = N || {}, _e = ne && ne.tt(t, e, j, n, B), { it: $e, ut: J, _t: Ce } = _e || {}, [Ae, ke] = bl(B, n), [Ee, he] = B("overflow"), we = yt(Ee.x), ce = yt(Ee.y), fe = !0;
    let Se = z(D), Te = S(D), $t = E(D), Rt = x(D);
    ke && p && h(ko, !Ae);
    {
      ss(r, rt, Zt) && C(!0);
      const [_s] = J ? J() : [], [Nt] = Se = F(D), [Ut] = Te = L(D), Pt = mo(c), qt = v && Ur(f()), or = {
        w: m(Ut.w + Nt.w),
        h: m(Ut.h + Nt.h)
      }, fs = {
        w: m((qt ? qt.w : Pt.w + m(Pt.w - Ut.w)) + Nt.w),
        h: m((qt ? qt.h : Pt.h + m(Pt.h - Ut.h)) + Nt.h)
      };
      _s && _s(), Rt = H(fs), $t = k(V(or, fs), D);
    }
    const [Bt, Ht] = Rt, [at, _t] = $t, [gn, bn] = Te, [wn, yn] = Se, [Ne, kn] = A({
      x: at.w > 0,
      y: at.h > 0
    }), Ct = we && ce && (Ne.x || Ne.y) || we && Ne.x && !Ne.y || ce && Ne.y && !Ne.x, Et = W || te || be || yn || bn || Ht || _t || he || ke || fe, tt = wl(Ne, Ee), [It, At] = U(tt.K), [er, tr] = P(D), vs = te || ie || tr || kn || D, [nr, sr] = vs ? ee($(er), D) : se();
    return Et && (At && R(tt.K), Ce && $e && Ot(c, Ce(tt, j, $e(tt, gn, wn)))), C(!1), rn(r, rt, Zt, Ct), rn(s, zn, Zt, Ct), oe(e, {
      K: It,
      Vt: {
        x: Bt.w,
        y: Bt.h
      },
      Rt: {
        x: at.w,
        y: at.h
      },
      rn: Ne,
      Lt: qr(nr, at)
    }), {
      en: At,
      nn: Ht,
      sn: _t,
      cn: sr || _t,
      vn: vs
    };
  };
}, Dl = (t) => {
  const [e, n, r] = El(t), s = {
    ln: {
      t: 0,
      r: 0,
      b: 0,
      l: 0
    },
    dn: !1,
    rt: {
      [Js]: 0,
      [Qs]: 0,
      [Zs]: 0,
      [Ws]: 0,
      [Ks]: 0,
      [Xs]: 0,
      [Ys]: 0
    },
    Vt: {
      x: 0,
      y: 0
    },
    Rt: {
      x: 0,
      y: 0
    },
    K: {
      x: ct,
      y: ct
    },
    rn: {
      x: !1,
      y: !1
    },
    Lt: bo()
  }, { vt: c, gt: a, nt: d, Ot: i } = e, { R: u, k: h } = We(), f = !u && (h.x || h.y), p = [Al(e), Tl(e, s), Ml(e, s)];
  return [n, (v) => {
    const m = {}, y = f && Ve(a), O = y && i();
    return ae(p, (T) => {
      oe(m, T(v, m) || {});
    }), qe(a, y), O && O(), !d && qe(c, 0), m;
  }, s, e, r];
}, Ol = (t, e, n, r, s) => {
  let c = !1;
  const a = Es(e, {}), [d, i, u, h, f] = Dl(t), [p, v, m] = Sl(h, u, a, ($) => {
    C({}, $);
  }), [w, y, , O] = Cl(t, e, m, u, h, s), T = ($) => Ie($).some((V) => !!$[V]), C = ($, V) => {
    if (n())
      return !1;
    const { pn: F, Dt: z, At: L, hn: S } = $, k = F || {}, E = !!z || !c, A = {
      It: Es(e, k, E),
      pn: k,
      Dt: E
    };
    if (S)
      return y(A), !1;
    const H = V || v(oe({}, A, {
      At: L
    })), x = i(oe({}, A, {
      _n: m,
      Zt: H
    }));
    y(oe({}, A, {
      Zt: H,
      tn: x
    }));
    const U = T(H), P = T(x), ee = U || P || !es(k) || E;
    return c = !0, ee && r($, {
      Zt: H,
      tn: x
    }), ee;
  };
  return [() => {
    const { an: $, gt: V, Ot: F } = h, z = Ve($), L = [p(), d(), w()], S = F();
    return qe(V, z), S(), X(Fe, L);
  }, C, () => ({
    gn: m,
    bn: u
  }), {
    wn: h,
    yn: O
  }, f];
}, Ge = (t, e, n) => {
  const { N: r } = We(), s = on(t), c = s ? t : t.target, a = Eo(c);
  if (e && !a) {
    let d = !1;
    const i = [], u = {}, h = (k) => {
      const E = oo(k), A = Ft(hl);
      return A ? A(E, !0) : E;
    }, f = oe({}, r(), h(e)), [p, v, m] = qn(), [w, y, O] = qn(n), T = (k, E) => {
      O(k, E), m(k, E);
    }, [C, $, V, F, z] = Ol(t, f, () => d, ({ pn: k, Dt: E }, { Zt: A, tn: H }) => {
      const { ft: x, Ct: U, xt: P, Ht: ee, Et: se, dt: ne } = A, { nn: pe, sn: R, en: B, cn: N } = H;
      T("updated", [S, {
        updateHints: {
          sizeChanged: !!x,
          directionChanged: !!U,
          heightIntrinsicChanged: !!P,
          overflowEdgeChanged: !!pe,
          overflowAmountChanged: !!R,
          overflowStyleChanged: !!B,
          scrollCoordinatesChanged: !!N,
          contentMutation: !!ee,
          hostMutation: !!se,
          appear: !!ne
        },
        changedOptions: k || {},
        force: !!E
      }]);
    }, (k) => T("scroll", [S, k])), L = (k) => {
      fl(c), Fe(i), d = !0, T("destroyed", [S, k]), v(), y();
    }, S = {
      options(k, E) {
        if (k) {
          const A = E ? r() : {}, H = wo(f, oe(A, h(k)));
          es(H) || (oe(f, H), $({
            pn: H
          }));
        }
        return oe({}, f);
      },
      on: w,
      off: (k, E) => {
        k && E && y(k, E);
      },
      state() {
        const { gn: k, bn: E } = V(), { ct: A } = k, { Vt: H, Rt: x, K: U, rn: P, ln: ee, dn: se, Lt: ne } = E;
        return oe({}, {
          overflowEdge: H,
          overflowAmount: x,
          overflowStyle: U,
          hasOverflow: P,
          scrollCoordinates: {
            start: ne.D,
            end: ne.M
          },
          padding: ee,
          paddingAbsolute: se,
          directionRTL: A,
          destroyed: d
        });
      },
      elements() {
        const { vt: k, ht: E, ln: A, ot: H, bt: x, gt: U, Qt: P } = F.wn, { Xt: ee, Gt: se } = F.yn, ne = (R) => {
          const { Pt: B, Ut: N, Tt: j } = R;
          return {
            scrollbar: j,
            track: N,
            handle: B
          };
        }, pe = (R) => {
          const { Yt: B, Wt: N } = R, j = ne(B[0]);
          return oe({}, j, {
            clone: () => {
              const D = ne(N());
              return $({
                hn: !0
              }), D;
            }
          });
        };
        return oe({}, {
          target: k,
          host: E,
          padding: A || H,
          viewport: H,
          content: x || H,
          scrollOffsetElement: U,
          scrollEventElement: P,
          scrollbarHorizontal: pe(ee),
          scrollbarVertical: pe(se)
        });
      },
      update: (k) => $({
        Dt: k,
        At: !0
      }),
      destroy: X(L, !1),
      plugin: (k) => u[Ie(k)[0]]
    };
    return me(i, [z]), _l(c, S), Mo(Ao, Ge, [S, p, u]), vl(F.wn.wt, !s && t.cancel) ? (L(!0), S) : (me(i, C()), T("initialized", [S]), S.update(), S);
  }
  return a;
};
Ge.plugin = (t) => {
  const e = je(t), n = e ? t : [t], r = n.map((s) => Mo(s, Ge)[0]);
  return pl(n), e ? r : r[0];
};
Ge.valid = (t) => {
  const e = t && t.elements, n = Be(e) && e();
  return sn(n) && !!Eo(n.target);
};
Ge.env = () => {
  const { T: t, k: e, R: n, V: r, B: s, F: c, U: a, P: d, N: i, q: u } = We();
  return oe({}, {
    scrollbarsSize: t,
    scrollbarsOverlaid: e,
    scrollbarsHiding: n,
    scrollTimeline: r,
    staticDefaultInitialization: s,
    staticDefaultOptions: c,
    getDefaultInitialization: a,
    setDefaultInitialization: d,
    getDefaultOptions: i,
    setDefaultOptions: u
  });
};
Ge.nonce = cl;
function Vl() {
  let t;
  const e = M(null), n = Math.floor(Math.random() * 2 ** 32), r = M(!1), s = M([]), c = () => s.value, a = () => t.getSelection(), d = () => s.value.length, i = () => t.clearSelection(!0), u = M(), h = M(null), f = M(null), p = M(null), v = M(null);
  function m() {
    t = new pr({
      area: e.value,
      keyboardDrag: !1,
      selectedClass: "vf-explorer-selected",
      selectorClass: "vf-explorer-selector"
    }), t.subscribe(
      "DS:start:pre",
      ({ items: V, event: F, isDragging: z }) => {
        if (z)
          t.Interaction._reset(F);
        else {
          r.value = !1;
          const L = e.value.offsetWidth - F.offsetX, S = e.value.offsetHeight - F.offsetY;
          L < 15 && S < 15 && t.Interaction._reset(F), F.target.classList.contains("os-scrollbar-handle") && t.Interaction._reset(F);
        }
      }
    ), document.addEventListener("dragleave", (V) => {
      !V.buttons && r.value && (r.value = !1);
    });
  }
  const w = () => dt(() => {
    t.addSelection(t.getSelectables()), y();
  }), y = () => {
    s.value = t.getSelection().map((V) => JSON.parse(V.dataset.item)), u.value(s.value);
  }, O = () => dt(() => {
    const V = c().map((F) => F.path);
    i(), t.setSettings({
      selectables: document.getElementsByClassName("vf-item-" + n)
    }), t.addSelection(
      t.getSelectables().filter(
        (F) => V.includes(JSON.parse(F.dataset.item).path)
      )
    ), y(), C();
  }), T = (V) => {
    u.value = V, t.subscribe("DS:end", ({ items: F, event: z, isDragging: L }) => {
      s.value = F.map((S) => JSON.parse(S.dataset.item)), V(F.map((S) => JSON.parse(S.dataset.item)));
    });
  }, C = () => {
    h.value && (e.value.getBoundingClientRect().height < e.value.scrollHeight ? (f.value.style.height = e.value.scrollHeight + "px", f.value.style.display = "block") : (f.value.style.height = "100%", f.value.style.display = "none"));
  }, $ = (V) => {
    if (!h.value)
      return;
    const { scrollOffsetElement: F } = h.value.elements();
    F.scrollTo({
      top: e.value.scrollTop,
      left: 0
    });
  };
  return xe(() => {
    Ge(
      p.value,
      {
        scrollbars: {
          theme: "vf-theme-dark dark:vf-theme-light"
        },
        plugins: {
          OverlayScrollbars: Ge
          // ScrollbarsHidingPlugin,
          // SizeObserverPlugin,
          // ClickScrollPlugin
        }
      },
      {
        initialized: (V) => {
          h.value = V;
        },
        scroll: (V, F) => {
          const { scrollOffsetElement: z } = V.elements();
          e.value.scrollTo({
            top: z.scrollTop,
            left: 0
          });
        }
      }
    ), m(), C(), v.value = new ResizeObserver(C), v.value.observe(e.value), e.value.addEventListener("scroll", $), t.subscribe(
      "DS:scroll",
      ({ isDragging: V }) => V || $()
    );
  }), Kn(() => {
    t && t.stop(), v.value && v.value.disconnect();
  }), Is(() => {
    t && t.Area.reset();
  }), {
    area: e,
    explorerId: n,
    isDraggingRef: r,
    scrollBar: f,
    scrollBarContainer: p,
    getSelected: c,
    getSelection: a,
    selectAll: w,
    clearSelection: i,
    refreshSelection: O,
    getCount: d,
    onSelect: T
  };
}
function Ll(t, e) {
  const n = M(t), r = M(e), s = M([]), c = M([]), a = M([]), d = M(!1), i = M(5);
  let u = !1, h = !1;
  const f = Vt({
    adapter: n,
    storages: [],
    dirname: r,
    files: []
  });
  function p() {
    let T = [], C = [], $ = r.value ?? n.value + "://";
    $.length === 0 && (s.value = []), $.replace(n.value + "://", "").split("/").forEach(function(z) {
      T.push(z), T.join("/") !== "" && C.push({
        basename: z,
        name: z,
        path: n.value + "://" + T.join("/"),
        type: "dir"
      });
    }), c.value = C;
    const [V, F] = m(
      C,
      i.value
    );
    a.value = F, s.value = V;
  }
  function v(T) {
    i.value = T, p();
  }
  function m(T, C) {
    return T.length > C ? [T.slice(-C), T.slice(0, -C)] : [T, []];
  }
  function w(T = null) {
    d.value = T ?? !d.value;
  }
  function y() {
    return s.value && s.value.length && !h;
  }
  const O = He(() => {
    var T;
    return ((T = s.value[s.value.length - 2]) == null ? void 0 : T.path) ?? n.value + "://";
  });
  return xe(() => {
  }), Le(r, p), xe(p), {
    adapter: n,
    path: r,
    loading: u,
    searchMode: h,
    data: f,
    breadcrumbs: s,
    breadcrumbItems: c,
    limitBreadcrumbItems: v,
    hiddenBreadcrumbs: a,
    showHiddenBreadcrumbs: d,
    toggleHiddenBreadcrumbs: w,
    isGoUpAvailable: y,
    parentFolderPath: O
  };
}
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
function Fl(t, e) {
  function n(...r) {
    return new Promise((s, c) => {
      Promise.resolve(t(() => e.apply(this, r), { fn: e, thisArg: this, args: r })).then(s).catch(c);
    });
  }
  return n;
}
const Vo = (t) => t();
function Rl(t = Vo) {
  const e = M(!0);
  function n() {
    e.value = !1;
  }
  function r() {
    e.value = !0;
  }
  const s = (...c) => {
    e.value && t(...c);
  };
  return { isActive: ir(e), pause: n, resume: r, eventFilter: s };
}
function Bl(t, e, n = {}) {
  const {
    eventFilter: r = Vo,
    ...s
  } = n;
  return Le(
    t,
    Fl(
      r,
      e
    ),
    s
  );
}
function Fs(t, e, n = {}) {
  const {
    eventFilter: r,
    ...s
  } = n, { eventFilter: c, pause: a, resume: d, isActive: i } = Rl(r);
  return { stop: Bl(
    t,
    e,
    {
      ...s,
      eventFilter: c
    }
  ), pause: a, resume: d, isActive: i };
}
function Rs(t, e, ...[n]) {
  const {
    flush: r = "sync",
    deep: s = !1,
    immediate: c = !0,
    direction: a = "both",
    transform: d = {}
  } = n || {}, i = [], u = "ltr" in d && d.ltr || ((p) => p), h = "rtl" in d && d.rtl || ((p) => p);
  return (a === "both" || a === "ltr") && i.push(Fs(
    t,
    (p) => {
      i.forEach((v) => v.pause()), e.value = u(p), i.forEach((v) => v.resume());
    },
    { flush: r, deep: s, immediate: c }
  )), (a === "both" || a === "rtl") && i.push(Fs(
    e,
    (p) => {
      i.forEach((v) => v.pause()), t.value = h(p), i.forEach((v) => v.resume());
    },
    { flush: r, deep: s, immediate: c }
  )), () => {
    i.forEach((p) => p.stop());
  };
}
const Hl = (t, e, n) => {
  const r = Sr(t.id), s = mr(), c = r.getStore("metricUnits", !1), a = Tr(r, t.theme), d = n.i18n, i = t.locale ?? n.locale, u = r.getStore("adapter"), h = (y) => Array.isArray(y) ? y : Cr, f = r.getStore("persist-path", t.persist), p = f ? r.getStore("path", t.path) : t.path, v = Vt({
    /**
     * Core properties
     * */
    // app version
    version: Er,
    // root element
    root: null,
    // app id
    debug: t.debug,
    // Event Bus
    emitter: s,
    // storage
    storage: r,
    // localization object
    i18n: $r(r, i, s, d),
    // modal state
    modal: Mr(),
    // dragSelect object, it is responsible for selecting items
    dragSelect: He(() => Vl()),
    // http object
    requester: kr(t.request),
    // active features
    features: h(t.features),
    // view state
    view: r.getStore("viewport", e.view.value),
    // fullscreen state
    fullScreen: r.getStore("full-screen", t.fullScreen),
    // show tree view
    showTreeView: r.getStore("show-tree-view", t.showTreeView),
    // pinnedFolders
    pinnedFolders: r.getStore("pinned-folders", t.pinnedFolders),
    // treeViewData
    treeViewData: [],
    // selectButton state
    selectButton: t.selectButton,
    // max file size
    maxFileSize: t.maxFileSize,
    /**
     * Settings
     * */
    // theme state
    theme: a,
    // unit state - for example: GB or GiB
    metricUnits: c,
    // human readable file sizes
    filesize: c ? qs : Ps,
    // show large icons in list view
    compactListView: r.getStore("compact-list-view", !0),
    // persist state
    persist: f,
    // show thumbnails
    showThumbnails: r.getStore("show-thumbnails", t.showThumbnails),
    // file system
    fs: Ll(u, p),
    // Sorting
    sortActive: !1,
    sortColumn: "",
    sortOrder: "",
    // Additional select buttons
    additionalButtons: t.additionalButtons
  }), m = He({
    get() {
      return v.view;
    },
    set(y) {
      v.view = y;
    }
  }), w = He({
    get() {
      return {
        active: v.sortActive,
        column: v.sortColumn,
        order: v.sortOrder
      };
    },
    set(y) {
      y && (v.sortActive = y.active, v.sortColumn = y.column, v.sortOrder = y.order);
    }
  });
  return Rs(e.view, m), Rs(e.sort, w), v;
}, Il = { class: "vuefinder__modal-layout__container" }, Nl = { class: "vuefinder__modal-layout__content" }, Ul = { class: "vuefinder__modal-layout__footer" }, Ke = {
  __name: "ModalLayout",
  setup(t) {
    const e = M(null), n = re("ServiceContainer");
    return xe(() => {
      const r = document.querySelector(".v-f-modal input");
      r && r.focus(), dt(() => {
        if (document.querySelector(".v-f-modal input") && window.innerWidth < 768) {
          const s = e.value.getBoundingClientRect().bottom + 16;
          window.scrollTo({
            top: s,
            left: 0,
            behavior: "smooth"
          });
        }
      });
    }), (r, s) => (_(), g("div", {
      class: "vuefinder__modal-layout",
      "aria-labelledby": "modal-title",
      role: "dialog",
      "aria-modal": "true",
      onKeyup: s[1] || (s[1] = kt((c) => o(n).modal.close(), ["esc"])),
      tabindex: "0"
    }, [
      s[2] || (s[2] = l("div", { class: "vuefinder__modal-layout__overlay" }, null, -1)),
      l("div", Il, [
        l("div", {
          class: "vuefinder__modal-layout__wrapper",
          onMousedown: s[0] || (s[0] = ot((c) => o(n).modal.close(), ["self"]))
        }, [
          l("div", {
            ref_key: "modalBody",
            ref: e,
            class: "vuefinder__modal-layout__body"
          }, [
            l("div", Nl, [
              Tt(r.$slots, "default")
            ]),
            l("div", Ul, [
              Tt(r.$slots, "buttons")
            ])
          ], 512)
        ], 32)
      ])
    ], 32));
  }
}, Pl = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [r, s] of e)
    n[r] = s;
  return n;
}, ql = {
  props: {
    on: { type: String, required: !0 }
  },
  setup(t, { emit: e, slots: n }) {
    const r = re("ServiceContainer"), s = M(!1), { t: c } = r.i18n;
    let a = null;
    const d = () => {
      clearTimeout(a), s.value = !0, a = setTimeout(() => {
        s.value = !1;
      }, 2e3);
    };
    return xe(() => {
      r.emitter.on(t.on, d);
    }), Kn(() => {
      clearTimeout(a);
    }), {
      shown: s,
      t: c
    };
  }
}, zl = { key: 1 };
function jl(t, e, n, r, s, c) {
  return _(), g("div", {
    class: le(["vuefinder__action-message", { "vuefinder__action-message--hidden": !r.shown }])
  }, [
    t.$slots.default ? Tt(t.$slots, "default", { key: 0 }) : (_(), g("span", zl, b(r.t("Saved.")), 1))
  ], 2);
}
const ft = /* @__PURE__ */ Pl(ql, [["render", jl]]), Gl = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
  viewBox: "0 0 24 24"
};
function Wl(t, e) {
  return _(), g("svg", Gl, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87q.11.06.22.127c.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a8 8 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a7 7 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a7 7 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a7 7 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124q.108-.066.22-.128c.332-.183.582-.495.644-.869z"
    }, null, -1),
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0"
    }, null, -1)
  ]));
}
const Kl = { render: Wl }, Yl = { class: "vuefinder__modal-header" }, Xl = { class: "vuefinder__modal-header__icon-container" }, Zl = {
  class: "vuefinder__modal-header__title",
  id: "modal-title"
}, et = {
  __name: "ModalHeader",
  props: {
    title: {
      type: String,
      required: !0
    },
    icon: {
      type: Object,
      required: !0
    }
  },
  setup(t) {
    return (e, n) => (_(), g("div", Yl, [
      l("div", Xl, [
        (_(), K(Ns(t.icon), { class: "vuefinder__modal-header__icon" }))
      ]),
      l("h3", Zl, b(t.title), 1)
    ]));
  }
}, Jl = { class: "vuefinder__about-modal__content" }, Ql = { class: "vuefinder__about-modal__main" }, ea = {
  class: "vuefinder__about-modal__tabs",
  "aria-label": "Tabs"
}, ta = ["onClick", "aria-current"], na = {
  key: 0,
  class: "vuefinder__about-modal__tab-content"
}, sa = { class: "vuefinder__about-modal__description" }, oa = {
  href: "https://vuefinder.ozdemir.be",
  class: "vuefinder__about-modal__link",
  target: "_blank"
}, ra = {
  href: "https://github.com/n1crack/vuefinder",
  class: "vuefinder__about-modal__link",
  target: "_blank"
}, la = {
  key: 1,
  class: "vuefinder__about-modal__tab-content"
}, aa = { class: "vuefinder__about-modal__description" }, ia = { class: "vuefinder__about-modal__settings" }, ca = { class: "vuefinder__about-modal__setting flex" }, da = { class: "vuefinder__about-modal__setting-input" }, ua = { class: "vuefinder__about-modal__setting-label" }, va = {
  for: "metric_unit",
  class: "vuefinder__about-modal__label"
}, _a = { class: "vuefinder__about-modal__setting flex" }, fa = { class: "vuefinder__about-modal__setting-input" }, ma = { class: "vuefinder__about-modal__setting-label" }, pa = {
  for: "large_icons",
  class: "vuefinder__about-modal__label"
}, ha = { class: "vuefinder__about-modal__setting flex" }, ga = { class: "vuefinder__about-modal__setting-input" }, ba = { class: "vuefinder__about-modal__setting-label" }, wa = {
  for: "persist_path",
  class: "vuefinder__about-modal__label"
}, ya = { class: "vuefinder__about-modal__setting flex" }, ka = { class: "vuefinder__about-modal__setting-input" }, Sa = { class: "vuefinder__about-modal__setting-label" }, xa = {
  for: "show_thumbnails",
  class: "vuefinder__about-modal__label"
}, $a = { class: "vuefinder__about-modal__setting" }, Ca = { class: "vuefinder__about-modal__setting-input" }, Ea = {
  for: "theme",
  class: "vuefinder__about-modal__label"
}, Aa = { class: "vuefinder__about-modal__setting-label" }, Ta = ["label"], Ma = ["value"], Da = {
  key: 0,
  class: "vuefinder__about-modal__setting"
}, Oa = { class: "vuefinder__about-modal__setting-input" }, Va = {
  for: "language",
  class: "vuefinder__about-modal__label"
}, La = { class: "vuefinder__about-modal__setting-label" }, Fa = ["label"], Ra = ["value"], Ba = {
  key: 2,
  class: "vuefinder__about-modal__tab-content"
}, Ha = { class: "vuefinder__about-modal__shortcuts" }, Ia = { class: "vuefinder__about-modal__shortcut" }, Na = { class: "vuefinder__about-modal__shortcut" }, Ua = { class: "vuefinder__about-modal__shortcut" }, Pa = { class: "vuefinder__about-modal__shortcut" }, qa = { class: "vuefinder__about-modal__shortcut" }, za = { class: "vuefinder__about-modal__shortcut" }, ja = { class: "vuefinder__about-modal__shortcut" }, Ga = { class: "vuefinder__about-modal__shortcut" }, Wa = { class: "vuefinder__about-modal__shortcut" }, Ka = {
  key: 3,
  class: "vuefinder__about-modal__tab-content"
}, Ya = { class: "vuefinder__about-modal__description" }, Lo = {
  __name: "ModalAbout",
  setup(t) {
    const e = re("ServiceContainer"), { setStore: n, clearStore: r } = e.storage, { t: s } = e.i18n, c = {
      ABOUT: "about",
      SETTINGS: "settings",
      SHORTCUTS: "shortcuts",
      RESET: "reset"
    }, a = He(() => [
      { name: s("About"), key: c.ABOUT },
      { name: s("Settings"), key: c.SETTINGS },
      { name: s("Shortcuts"), key: c.SHORTCUTS },
      { name: s("Reset"), key: c.RESET }
    ]), d = M("about"), i = async () => {
      r(), location.reload();
    }, u = (T) => {
      e.theme.set(T), e.emitter.emit("vf-theme-saved");
    }, h = () => {
      e.metricUnits = !e.metricUnits, e.filesize = e.metricUnits ? qs : Ps, n("metricUnits", e.metricUnits), e.emitter.emit("vf-metric-units-saved");
    }, f = () => {
      e.compactListView = !e.compactListView, n("compactListView", e.compactListView), e.emitter.emit("vf-compact-view-saved");
    }, p = () => {
      e.showThumbnails = !e.showThumbnails, n("show-thumbnails", e.showThumbnails), e.emitter.emit("vf-show-thumbnails-saved");
    }, v = () => {
      e.persist = !e.persist, n("persist-path", e.persist), e.emitter.emit("vf-persist-path-saved");
    }, { i18n: m } = re("VueFinderOptions"), y = Object.fromEntries(
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
      }).filter(([T]) => Object.keys(m).includes(T))
    ), O = He(() => ({
      system: s("System"),
      light: s("Light"),
      dark: s("Dark")
    }));
    return (T, C) => (_(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          onClick: C[7] || (C[7] = ($) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(s)("Close")), 1)
      ]),
      default: Q(() => [
        l("div", Jl, [
          q(et, {
            icon: o(Kl),
            title: "Vuefinder " + o(e).version
          }, null, 8, ["icon", "title"]),
          l("div", Ql, [
            l("div", null, [
              l("div", null, [
                l("nav", ea, [
                  (_(!0), g(ge, null, ye(a.value, ($) => (_(), g("button", {
                    key: $.name,
                    onClick: (V) => d.value = $.key,
                    class: le([$.key === d.value ? "vuefinder__about-modal__tab--active" : "vuefinder__about-modal__tab--inactive", "vuefinder__about-modal__tab"]),
                    "aria-current": $.current ? "page" : void 0
                  }, b($.name), 11, ta))), 128))
                ])
              ])
            ]),
            d.value === c.ABOUT ? (_(), g("div", na, [
              l("div", sa, b(o(s)("Vuefinder is a simple, lightweight, and fast file manager library for Vue.js applications")), 1),
              l("a", oa, b(o(s)("Project home")), 1),
              l("a", ra, b(o(s)("Follow on GitHub")), 1)
            ])) : I("", !0),
            d.value === c.SETTINGS ? (_(), g("div", la, [
              l("div", aa, b(o(s)("Customize your experience with the following settings")), 1),
              l("div", ia, [
                l("fieldset", null, [
                  l("div", ca, [
                    l("div", da, [
                      ue(l("input", {
                        id: "metric_unit",
                        name: "metric_unit",
                        type: "checkbox",
                        "onUpdate:modelValue": C[0] || (C[0] = ($) => o(e).metricUnits = $),
                        onClick: h,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [zt, o(e).metricUnits]
                      ])
                    ]),
                    l("div", ua, [
                      l("label", va, [
                        Z(b(o(s)("Use Metric Units")) + " ", 1),
                        q(ft, {
                          class: "ms-3",
                          on: "vf-metric-units-saved"
                        }, {
                          default: Q(() => [
                            Z(b(o(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  l("div", _a, [
                    l("div", fa, [
                      ue(l("input", {
                        id: "large_icons",
                        name: "large_icons",
                        type: "checkbox",
                        "onUpdate:modelValue": C[1] || (C[1] = ($) => o(e).compactListView = $),
                        onClick: f,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [zt, o(e).compactListView]
                      ])
                    ]),
                    l("div", ma, [
                      l("label", pa, [
                        Z(b(o(s)("Compact list view")) + " ", 1),
                        q(ft, {
                          class: "ms-3",
                          on: "vf-compact-view-saved"
                        }, {
                          default: Q(() => [
                            Z(b(o(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  l("div", ha, [
                    l("div", ga, [
                      ue(l("input", {
                        id: "persist_path",
                        name: "persist_path",
                        type: "checkbox",
                        "onUpdate:modelValue": C[2] || (C[2] = ($) => o(e).persist = $),
                        onClick: v,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [zt, o(e).persist]
                      ])
                    ]),
                    l("div", ba, [
                      l("label", wa, [
                        Z(b(o(s)("Persist path on reload")) + " ", 1),
                        q(ft, {
                          class: "ms-3",
                          on: "vf-persist-path-saved"
                        }, {
                          default: Q(() => [
                            Z(b(o(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  l("div", ya, [
                    l("div", ka, [
                      ue(l("input", {
                        id: "show_thumbnails",
                        name: "show_thumbnails",
                        type: "checkbox",
                        "onUpdate:modelValue": C[3] || (C[3] = ($) => o(e).showThumbnails = $),
                        onClick: p,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [zt, o(e).showThumbnails]
                      ])
                    ]),
                    l("div", Sa, [
                      l("label", xa, [
                        Z(b(o(s)("Show thumbnails")) + " ", 1),
                        q(ft, {
                          class: "ms-3",
                          on: "vf-show-thumbnails-saved"
                        }, {
                          default: Q(() => [
                            Z(b(o(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  l("div", $a, [
                    l("div", Ca, [
                      l("label", Ea, b(o(s)("Theme")), 1)
                    ]),
                    l("div", Aa, [
                      ue(l("select", {
                        id: "theme",
                        "onUpdate:modelValue": C[4] || (C[4] = ($) => o(e).theme.value = $),
                        onChange: C[5] || (C[5] = ($) => u($.target.value)),
                        class: "vuefinder__about-modal__select"
                      }, [
                        l("optgroup", {
                          label: o(s)("Theme")
                        }, [
                          (_(!0), g(ge, null, ye(O.value, ($, V) => (_(), g("option", { value: V }, b($), 9, Ma))), 256))
                        ], 8, Ta)
                      ], 544), [
                        [Tn, o(e).theme.value]
                      ]),
                      q(ft, {
                        class: "ms-3",
                        on: "vf-theme-saved"
                      }, {
                        default: Q(() => [
                          Z(b(o(s)("Saved.")), 1)
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  o(e).features.includes(o(de).LANGUAGE) && Object.keys(o(y)).length > 1 ? (_(), g("div", Da, [
                    l("div", Oa, [
                      l("label", Va, b(o(s)("Language")), 1)
                    ]),
                    l("div", La, [
                      ue(l("select", {
                        id: "language",
                        "onUpdate:modelValue": C[6] || (C[6] = ($) => o(e).i18n.locale = $),
                        class: "vuefinder__about-modal__select"
                      }, [
                        l("optgroup", {
                          label: o(s)("Language")
                        }, [
                          (_(!0), g(ge, null, ye(o(y), ($, V) => (_(), g("option", { value: V }, b($), 9, Ra))), 256))
                        ], 8, Fa)
                      ], 512), [
                        [Tn, o(e).i18n.locale]
                      ]),
                      q(ft, {
                        class: "ms-3",
                        on: "vf-language-saved"
                      }, {
                        default: Q(() => [
                          Z(b(o(s)("Saved.")), 1)
                        ]),
                        _: 1
                      })
                    ])
                  ])) : I("", !0)
                ])
              ])
            ])) : I("", !0),
            d.value === c.SHORTCUTS ? (_(), g("div", Ba, [
              l("div", Ha, [
                l("div", Ia, [
                  l("div", null, b(o(s)("Rename")), 1),
                  C[8] || (C[8] = l("kbd", null, "F2", -1))
                ]),
                l("div", Na, [
                  l("div", null, b(o(s)("Refresh")), 1),
                  C[9] || (C[9] = l("kbd", null, "F5", -1))
                ]),
                l("div", Ua, [
                  Z(b(o(s)("Delete")) + " ", 1),
                  C[10] || (C[10] = l("kbd", null, "Del", -1))
                ]),
                l("div", Pa, [
                  Z(b(o(s)("Escape")) + " ", 1),
                  C[11] || (C[11] = l("div", null, [
                    l("kbd", null, "Esc")
                  ], -1))
                ]),
                l("div", qa, [
                  Z(b(o(s)("Select All")) + " ", 1),
                  C[12] || (C[12] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, "A")
                  ], -1))
                ]),
                l("div", za, [
                  Z(b(o(s)("Search")) + " ", 1),
                  C[13] || (C[13] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, "F")
                  ], -1))
                ]),
                l("div", ja, [
                  Z(b(o(s)("Toggle Sidebar")) + " ", 1),
                  C[14] || (C[14] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, "E")
                  ], -1))
                ]),
                l("div", Ga, [
                  Z(b(o(s)("Open Settings")) + " ", 1),
                  C[15] || (C[15] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, ",")
                  ], -1))
                ]),
                l("div", Wa, [
                  Z(b(o(s)("Toggle Full Screen")) + " ", 1),
                  C[16] || (C[16] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    Z(" + "),
                    l("kbd", null, "Enter")
                  ], -1))
                ])
              ])
            ])) : I("", !0),
            d.value === c.RESET ? (_(), g("div", Ka, [
              l("div", Ya, b(o(s)("Reset all settings to default")), 1),
              l("button", {
                onClick: i,
                type: "button",
                class: "vf-btn vf-btn-secondary"
              }, b(o(s)("Reset Settings")), 1)
            ])) : I("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Xa = ["title"], Ye = {
  __name: "Message",
  props: {
    error: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["hidden"],
  setup(t, { emit: e }) {
    var u;
    const n = e, r = re("ServiceContainer"), { t: s } = r.i18n, c = M(!1), a = M(null), d = M((u = a.value) == null ? void 0 : u.strMessage);
    Le(d, () => c.value = !1);
    const i = () => {
      n("hidden"), c.value = !0;
    };
    return (h, f) => (_(), g("div", null, [
      c.value ? I("", !0) : (_(), g("div", {
        key: 0,
        ref_key: "strMessage",
        ref: a,
        class: le(["vuefinder__message", t.error ? "vuefinder__message--error" : "vuefinder__message--success"])
      }, [
        Tt(h.$slots, "default"),
        l("div", {
          class: "vuefinder__message__close",
          onClick: i,
          title: o(s)("Close")
        }, f[0] || (f[0] = [
          l("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            fill: "none",
            viewBox: "0 0 24 24",
            "stroke-width": "1.5",
            stroke: "currentColor",
            class: "vuefinder__message__icon"
          }, [
            l("path", {
              "stroke-linecap": "round",
              "stroke-linejoin": "round",
              d: "M6 18L18 6M6 6l12 12"
            })
          ], -1)
        ]), 8, Xa)
      ], 2))
    ]));
  }
}, Za = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function Ja(t, e) {
  return _(), g("svg", Za, e[0] || (e[0] = [
    l("path", { d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21q.512.078 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48 48 0 0 0-3.478-.397m-12 .562q.51-.089 1.022-.165m0 0a48 48 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a52 52 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a49 49 0 0 0-7.5 0" }, null, -1)
  ]));
}
const Fo = { render: Ja }, Qa = { class: "vuefinder__delete-modal__content" }, ei = { class: "vuefinder__delete-modal__form" }, ti = { class: "vuefinder__delete-modal__description" }, ni = { class: "vuefinder__delete-modal__files vf-scrollbar" }, si = { class: "vuefinder__delete-modal__file" }, oi = {
  key: 0,
  class: "vuefinder__delete-modal__icon vuefinder__delete-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, ri = {
  key: 1,
  class: "vuefinder__delete-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, li = { class: "vuefinder__delete-modal__file-name" }, ai = { class: "vuefinder__delete-modal__warning" }, cs = {
  __name: "ModalDelete",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = M(e.modal.data.items), s = M(""), c = () => {
      r.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "delete",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          items: r.value.map(({ path: a, type: d }) => ({ path: a, type: d }))
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("Files deleted.") });
        },
        onError: (a) => {
          s.value = n(a.message);
        }
      });
    };
    return (a, d) => (_(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-danger"
        }, b(o(n)("Yes, Delete!")), 1),
        l("button", {
          type: "button",
          onClick: d[1] || (d[1] = (i) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1),
        l("div", ai, b(o(n)("This action cannot be undone.")), 1)
      ]),
      default: Q(() => [
        l("div", null, [
          q(et, {
            icon: o(Fo),
            title: o(n)("Delete files")
          }, null, 8, ["icon", "title"]),
          l("div", Qa, [
            l("div", ei, [
              l("p", ti, b(o(n)("Are you sure you want to delete these files?")), 1),
              l("div", ni, [
                (_(!0), g(ge, null, ye(r.value, (i) => (_(), g("p", si, [
                  i.type === "dir" ? (_(), g("svg", oi, d[2] || (d[2] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (_(), g("svg", ri, d[3] || (d[3] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ]))),
                  l("span", li, b(i.basename), 1)
                ]))), 256))
              ]),
              s.value.length ? (_(), K(Ye, {
                key: 0,
                onHidden: d[0] || (d[0] = (i) => s.value = ""),
                error: ""
              }, {
                default: Q(() => [
                  Z(b(s.value), 1)
                ]),
                _: 1
              })) : I("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, ii = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function ci(t, e) {
  return _(), g("svg", ii, e[0] || (e[0] = [
    l("path", { d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" }, null, -1)
  ]));
}
const Ro = { render: ci }, di = { class: "vuefinder__rename-modal__content" }, ui = { class: "vuefinder__rename-modal__item" }, vi = { class: "vuefinder__rename-modal__item-info" }, _i = {
  key: 0,
  class: "vuefinder__rename-modal__icon vuefinder__rename-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, fi = {
  key: 1,
  class: "vuefinder__rename-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, mi = { class: "vuefinder__rename-modal__item-name" }, ds = {
  __name: "ModalRename",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = M(e.modal.data.items[0]), s = M(e.modal.data.items[0].basename), c = M(""), a = () => {
      s.value != "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "rename",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          item: r.value.path,
          name: s.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("%s is renamed.", s.value) });
        },
        onError: (d) => {
          c.value = n(d.message);
        }
      });
    };
    return (d, i) => (_(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          onClick: a,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Rename")), 1),
        l("button", {
          type: "button",
          onClick: i[2] || (i[2] = (u) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: Q(() => [
        l("div", null, [
          q(et, {
            icon: o(Ro),
            title: o(n)("Rename")
          }, null, 8, ["icon", "title"]),
          l("div", di, [
            l("div", ui, [
              l("p", vi, [
                r.value.type === "dir" ? (_(), g("svg", _i, i[3] || (i[3] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  }, null, -1)
                ]))) : (_(), g("svg", fi, i[4] || (i[4] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  }, null, -1)
                ]))),
                l("span", mi, b(r.value.basename), 1)
              ]),
              ue(l("input", {
                "onUpdate:modelValue": i[0] || (i[0] = (u) => s.value = u),
                onKeyup: kt(a, ["enter"]),
                class: "vuefinder__rename-modal__input",
                placeholder: "Name",
                type: "text"
              }, null, 544), [
                [St, s.value]
              ]),
              c.value.length ? (_(), K(Ye, {
                key: 0,
                onHidden: i[1] || (i[1] = (u) => c.value = ""),
                error: ""
              }, {
                default: Q(() => [
                  Z(b(c.value), 1)
                ]),
                _: 1
              })) : I("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Xe = {
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
function pi(t) {
  const e = (n) => {
    n.code === Xe.ESCAPE && (t.modal.close(), t.root.focus()), !t.modal.visible && (t.fs.searchMode || (n.code === Xe.F2 && t.features.includes(de.RENAME) && (t.dragSelect.getCount() !== 1 || t.modal.open(ds, { items: t.dragSelect.getSelected() })), n.code === Xe.F5 && t.emitter.emit("vf-fetch", { params: { q: "index", adapter: t.fs.adapter, path: t.fs.data.dirname } }), n.code === Xe.DELETE && (!t.dragSelect.getCount() || t.modal.open(cs, { items: t.dragSelect.getSelected() })), n.metaKey && n.code === Xe.BACKSLASH && t.modal.open(Lo), n.metaKey && n.code === Xe.KEY_F && t.features.includes(de.SEARCH) && (t.fs.searchMode = !0, n.preventDefault()), n.metaKey && n.code === Xe.KEY_E && (t.showTreeView = !t.showTreeView, t.storage.setStore("show-tree-view", t.showTreeView)), n.metaKey && n.code === Xe.ENTER && (t.fullScreen = !t.fullScreen, t.root.focus()), n.metaKey && n.code === Xe.KEY_A && (t.dragSelect.selectAll(), n.preventDefault())));
  };
  xe(() => {
    t.root.addEventListener("keydown", e);
  });
}
const hi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function gi(t, e) {
  return _(), g("svg", hi, e[0] || (e[0] = [
    l("path", { d: "M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44z" }, null, -1)
  ]));
}
const Bo = { render: gi }, bi = { class: "vuefinder__new-folder-modal__content" }, wi = { class: "vuefinder__new-folder-modal__form" }, yi = { class: "vuefinder__new-folder-modal__description" }, ki = ["placeholder"], Ho = {
  __name: "ModalNewFolder",
  setup(t) {
    const e = re("ServiceContainer");
    e.storage;
    const { t: n } = e.i18n, r = M(""), s = M(""), c = () => {
      r.value !== "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfolder",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          name: r.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("%s is created.", r.value) });
        },
        onError: (a) => {
          s.value = n(a.message);
        }
      });
    };
    return (a, d) => (_(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Create")), 1),
        l("button", {
          type: "button",
          onClick: d[2] || (d[2] = (i) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: Q(() => [
        l("div", null, [
          q(et, {
            icon: o(Bo),
            title: o(n)("New Folder")
          }, null, 8, ["icon", "title"]),
          l("div", bi, [
            l("div", wi, [
              l("p", yi, b(o(n)("Create a new folder")), 1),
              ue(l("input", {
                "onUpdate:modelValue": d[0] || (d[0] = (i) => r.value = i),
                onKeyup: kt(c, ["enter"]),
                class: "vuefinder__new-folder-modal__input",
                placeholder: o(n)("Folder Name"),
                type: "text"
              }, null, 40, ki), [
                [St, r.value]
              ]),
              s.value.length ? (_(), K(Ye, {
                key: 0,
                onHidden: d[1] || (d[1] = (i) => s.value = ""),
                error: ""
              }, {
                default: Q(() => [
                  Z(b(s.value), 1)
                ]),
                _: 1
              })) : I("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Si = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function xi(t, e) {
  return _(), g("svg", Si, e[0] || (e[0] = [
    l("path", { d: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9" }, null, -1)
  ]));
}
const Io = { render: xi }, $i = { class: "vuefinder__new-file-modal__content" }, Ci = { class: "vuefinder__new-file-modal__form" }, Ei = { class: "vuefinder__new-file-modal__description" }, Ai = ["placeholder"], Ti = {
  __name: "ModalNewFile",
  setup(t) {
    const e = re("ServiceContainer");
    e.storage;
    const { t: n } = e.i18n, r = M(""), s = M(""), c = () => {
      r.value !== "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfile",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          name: r.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("%s is created.", r.value) });
        },
        onError: (a) => {
          s.value = n(a.message);
        }
      });
    };
    return (a, d) => (_(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Create")), 1),
        l("button", {
          type: "button",
          onClick: d[2] || (d[2] = (i) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: Q(() => [
        l("div", null, [
          q(et, {
            icon: o(Io),
            title: o(n)("New File")
          }, null, 8, ["icon", "title"]),
          l("div", $i, [
            l("div", Ci, [
              l("p", Ei, b(o(n)("Create a new file")), 1),
              ue(l("input", {
                "onUpdate:modelValue": d[0] || (d[0] = (i) => r.value = i),
                onKeyup: kt(c, ["enter"]),
                class: "vuefinder__new-file-modal__input",
                placeholder: o(n)("File Name"),
                type: "text"
              }, null, 40, Ai), [
                [St, r.value]
              ]),
              s.value.length ? (_(), K(Ye, {
                key: 0,
                onHidden: d[1] || (d[1] = (i) => s.value = ""),
                error: ""
              }, {
                default: Q(() => [
                  Z(b(s.value), 1)
                ]),
                _: 1
              })) : I("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
};
function Gn(t, e = 14) {
  let n = `((?=([\\w\\W]{0,${e}}))([\\w\\W]{${e + 1},})([\\w\\W]{8,}))`;
  return t.replace(new RegExp(n), "$2..$4");
}
const Mi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function Di(t, e) {
  return _(), g("svg", Mi, e[0] || (e[0] = [
    l("path", { d: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" }, null, -1)
  ]));
}
const No = { render: Di }, Oi = { class: "vuefinder__upload-modal__content" }, Vi = {
  key: 0,
  class: "pointer-events-none"
}, Li = {
  key: 1,
  class: "pointer-events-none"
}, Fi = ["disabled"], Ri = ["disabled"], Bi = { class: "vuefinder__upload-modal__file-list vf-scrollbar" }, Hi = ["textContent"], Ii = { class: "vuefinder__upload-modal__file-info" }, Ni = { class: "vuefinder__upload-modal__file-name hidden md:block" }, Ui = { class: "vuefinder__upload-modal__file-name md:hidden" }, Pi = {
  key: 0,
  class: "ml-auto"
}, qi = ["title", "disabled", "onClick"], zi = {
  key: 0,
  class: "py-2"
}, ji = ["disabled"], Gi = {
  __name: "ModalUpload",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = n("uppy"), s = {
      PENDING: 0,
      CANCELED: 1,
      UPLOADING: 2,
      ERROR: 3,
      DONE: 10
    }, c = M({ QUEUE_ENTRY_STATUS: s }), a = M(null), d = M(null), i = M(null), u = M(null), h = M(null), f = M(null), p = M([]), v = M(""), m = M(!1), w = M(!1);
    let y;
    function O(A) {
      return p.value.findIndex((H) => H.id === A);
    }
    function T(A, H = null) {
      H = H ?? (A.webkitRelativePath || A.name), y.addFile({
        name: H,
        type: A.type,
        data: A,
        source: "Local"
      });
    }
    function C(A) {
      switch (A.status) {
        case s.DONE:
          return "text-green-600";
        case s.ERROR:
          return "text-red-600";
        case s.CANCELED:
          return "text-red-600";
        case s.PENDING:
        default:
          return "";
      }
    }
    const $ = (A) => {
      switch (A.status) {
        case s.DONE:
          return "✓";
        case s.ERROR:
        case s.CANCELED:
          return "!";
        case s.PENDING:
        default:
          return "...";
      }
    };
    function V() {
      u.value.click();
    }
    function F() {
      if (!m.value) {
        if (!p.value.filter((A) => A.status !== s.DONE).length) {
          v.value = n("Please select file to upload first.");
          return;
        }
        v.value = "", y.retryAll(), y.upload();
      }
    }
    function z() {
      y.cancelAll({ reason: "user" }), p.value.forEach((A) => {
        A.status !== s.DONE && (A.status = s.CANCELED, A.statusName = n("Canceled"));
      }), m.value = !1;
    }
    function L(A) {
      m.value || (y.removeFile(A.id, "removed-by-user"), p.value.splice(O(A.id), 1));
    }
    function S(A) {
      if (!m.value) {
        if (y.cancelAll({ reason: "user" }), A) {
          const H = [];
          p.value.forEach((x) => {
            x.status !== s.DONE && H.push(x);
          }), p.value = [], H.forEach((x) => {
            T(x.originalFile, x.name);
          });
          return;
        }
        p.value.splice(0);
      }
    }
    function k() {
      e.modal.close();
    }
    function E() {
      return e.requester.transformRequestParams({
        url: "",
        method: "post",
        params: { q: "upload", adapter: e.fs.adapter, path: e.fs.data.dirname }
      });
    }
    return xe(async () => {
      y = new hr({
        debug: e.debug,
        restrictions: {
          maxFileSize: Ar(e.maxFileSize)
          //maxNumberOfFiles
          //allowedFileTypes
        },
        locale: r,
        onBeforeFileAdded(x, U) {
          if (U[x.id] != null) {
            const ee = O(x.id);
            p.value[ee].status === s.PENDING && (v.value = y.i18n("noDuplicates", { fileName: x.name })), p.value = p.value.filter((se) => se.id !== x.id);
          }
          return p.value.push({
            id: x.id,
            name: x.name,
            size: e.filesize(x.size),
            status: s.PENDING,
            statusName: n("Pending upload"),
            percent: null,
            originalFile: x.data
          }), !0;
        }
      }), y.use(gr, {
        endpoint: "WILL_BE_REPLACED_BEFORE_UPLOAD",
        limit: 5,
        timeout: 0,
        getResponseError(x, U) {
          let P;
          try {
            P = JSON.parse(x).message;
          } catch {
            P = n("Cannot parse server response.");
          }
          return new Error(P);
        }
      }), y.on("restriction-failed", (x, U) => {
        const P = p.value[O(x.id)];
        L(P), v.value = U.message;
      }), y.on("upload", () => {
        const x = E();
        y.setMeta({ ...x.body });
        const U = y.getPlugin("XHRUpload");
        U.opts.method = x.method, U.opts.endpoint = x.url + "?" + new URLSearchParams(x.params), U.opts.headers = x.headers, delete x.headers["Content-Type"], m.value = !0, p.value.forEach((P) => {
          P.status !== s.DONE && (P.percent = null, P.status = s.UPLOADING, P.statusName = n("Pending upload"));
        });
      }), y.on("upload-progress", (x, U) => {
        const P = Math.floor(U.bytesUploaded / U.bytesTotal * 100);
        p.value[O(x.id)].percent = `${P}%`;
      }), y.on("upload-success", (x) => {
        const U = p.value[O(x.id)];
        U.status = s.DONE, U.statusName = n("Done");
      }), y.on("upload-error", (x, U) => {
        const P = p.value[O(x.id)];
        P.percent = null, P.status = s.ERROR, U.isNetworkError ? P.statusName = n("Network Error, Unable establish connection to the server or interrupted.") : P.statusName = U ? U.message : n("Unknown Error");
      }), y.on("error", (x) => {
        v.value = x.message, m.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname },
          noCloseModal: !0
        });
      }), y.on("complete", () => {
        m.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname },
          noCloseModal: !0
        });
      }), u.value.addEventListener("click", () => {
        d.value.click();
      }), h.value.addEventListener("click", () => {
        i.value.click();
      }), f.value.addEventListener("dragover", (x) => {
        x.preventDefault(), w.value = !0;
      }), f.value.addEventListener("dragleave", (x) => {
        x.preventDefault(), w.value = !1;
      });
      function A(x, U) {
        U.isFile && U.file((P) => x(U, P)), U.isDirectory && U.createReader().readEntries((P) => {
          P.forEach((ee) => {
            A(x, ee);
          });
        });
      }
      f.value.addEventListener("drop", (x) => {
        x.preventDefault(), w.value = !1;
        const U = /^[/\\](.+)/;
        [...x.dataTransfer.items].forEach((P) => {
          P.kind === "file" && A((ee, se) => {
            const ne = U.exec(ee.fullPath);
            T(se, ne[1]);
          }, P.webkitGetAsEntry());
        });
      });
      const H = ({ target: x }) => {
        const U = x.files;
        for (const P of U)
          T(P);
        x.value = "";
      };
      d.value.addEventListener("change", H), i.value.addEventListener("change", H);
    }), Us(() => {
      y == null || y.close({ reason: "unmount" });
    }), (A, H) => (_(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          class: "vf-btn vf-btn-primary",
          disabled: m.value,
          onClick: ot(F, ["prevent"])
        }, b(o(n)("Upload")), 9, ji),
        m.value ? (_(), g("button", {
          key: 0,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: ot(z, ["prevent"])
        }, b(o(n)("Cancel")), 1)) : (_(), g("button", {
          key: 1,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: ot(k, ["prevent"])
        }, b(o(n)("Close")), 1))
      ]),
      default: Q(() => [
        l("div", null, [
          q(et, {
            icon: o(No),
            title: o(n)("Upload Files")
          }, null, 8, ["icon", "title"]),
          l("div", Oi, [
            l("div", {
              class: "vuefinder__upload-modal__drop-area",
              ref_key: "dropArea",
              ref: f,
              onClick: V
            }, [
              w.value ? (_(), g("div", Vi, b(o(n)("Release to drop these files.")), 1)) : (_(), g("div", Li, b(o(n)("Drag and drop the files/folders to here or click here.")), 1))
            ], 512),
            l("div", {
              ref_key: "container",
              ref: a,
              class: "vuefinder__upload-modal__buttons"
            }, [
              l("button", {
                ref_key: "pickFiles",
                ref: u,
                type: "button",
                class: "vf-btn vf-btn-secondary"
              }, b(o(n)("Select Files")), 513),
              l("button", {
                ref_key: "pickFolders",
                ref: h,
                type: "button",
                class: "vf-btn vf-btn-secondary"
              }, b(o(n)("Select Folders")), 513),
              l("button", {
                type: "button",
                class: "vf-btn vf-btn-secondary",
                disabled: m.value,
                onClick: H[0] || (H[0] = (x) => S(!1))
              }, b(o(n)("Clear all")), 9, Fi),
              l("button", {
                type: "button",
                class: "vf-btn vf-btn-secondary",
                disabled: m.value,
                onClick: H[1] || (H[1] = (x) => S(!0))
              }, b(o(n)("Clear only successful")), 9, Ri)
            ], 512),
            l("div", Bi, [
              (_(!0), g(ge, null, ye(p.value, (x) => (_(), g("div", {
                class: "vuefinder__upload-modal__file-entry",
                key: x.id
              }, [
                l("span", {
                  class: le(["vuefinder__upload-modal__file-icon", C(x)])
                }, [
                  l("span", {
                    class: "vuefinder__upload-modal__file-icon-text",
                    textContent: b($(x))
                  }, null, 8, Hi)
                ], 2),
                l("div", Ii, [
                  l("div", Ni, b(o(Gn)(x.name, 40)) + " (" + b(x.size) + ")", 1),
                  l("div", Ui, b(o(Gn)(x.name, 16)) + " (" + b(x.size) + ")", 1),
                  l("div", {
                    class: le(["vuefinder__upload-modal__file-status", C(x)])
                  }, [
                    Z(b(x.statusName) + " ", 1),
                    x.status === c.value.QUEUE_ENTRY_STATUS.UPLOADING ? (_(), g("b", Pi, b(x.percent), 1)) : I("", !0)
                  ], 2)
                ]),
                l("button", {
                  type: "button",
                  class: le(["vuefinder__upload-modal__file-remove", m.value ? "disabled" : ""]),
                  title: o(n)("Delete"),
                  disabled: m.value,
                  onClick: (U) => L(x)
                }, H[3] || (H[3] = [
                  l("svg", {
                    xmlns: "http://www.w3.org/2000/svg",
                    fill: "none",
                    viewBox: "0 0 24 24",
                    "stroke-width": "1.5",
                    stroke: "currentColor",
                    class: "vuefinder__upload-modal__file-remove-icon"
                  }, [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M6 18L18 6M6 6l12 12"
                    })
                  ], -1)
                ]), 10, qi)
              ]))), 128)),
              p.value.length ? I("", !0) : (_(), g("div", zi, b(o(n)("No files selected!")), 1))
            ]),
            v.value.length ? (_(), K(Ye, {
              key: 0,
              onHidden: H[2] || (H[2] = (x) => v.value = ""),
              error: ""
            }, {
              default: Q(() => [
                Z(b(v.value), 1)
              ]),
              _: 1
            })) : I("", !0)
          ])
        ]),
        l("input", {
          ref_key: "internalFileInput",
          ref: d,
          type: "file",
          multiple: "",
          class: "hidden"
        }, null, 512),
        l("input", {
          ref_key: "internalFolderInput",
          ref: i,
          type: "file",
          multiple: "",
          webkitdirectory: "",
          class: "hidden"
        }, null, 512)
      ]),
      _: 1
    }));
  }
}, Wi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function Ki(t, e) {
  return _(), g("svg", Wi, e[0] || (e[0] = [
    l("path", { d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125" }, null, -1)
  ]));
}
const Uo = { render: Ki }, Yi = { class: "vuefinder__unarchive-modal__content" }, Xi = { class: "vuefinder__unarchive-modal__items" }, Zi = { class: "vuefinder__unarchive-modal__item" }, Ji = {
  key: 0,
  class: "vuefinder__unarchive-modal__icon vuefinder__unarchive-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Qi = {
  key: 1,
  class: "vuefinder__unarchive-modal__icon vuefinder__unarchive-modal__icon--file",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, ec = { class: "vuefinder__unarchive-modal__item-name" }, tc = { class: "vuefinder__unarchive-modal__info" }, Po = {
  __name: "ModalUnarchive",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = M(e.modal.data.items[0]), s = M(""), c = M([]), a = () => {
      e.emitter.emit("vf-fetch", {
        params: {
          q: "unarchive",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          item: r.value.path
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("The file unarchived.") });
        },
        onError: (d) => {
          s.value = n(d.message);
        }
      });
    };
    return (d, i) => (_(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          onClick: a,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Unarchive")), 1),
        l("button", {
          type: "button",
          onClick: i[1] || (i[1] = (u) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: Q(() => [
        l("div", null, [
          q(et, {
            icon: o(Uo),
            title: o(n)("Unarchive")
          }, null, 8, ["icon", "title"]),
          l("div", Yi, [
            l("div", Xi, [
              (_(!0), g(ge, null, ye(c.value, (u) => (_(), g("p", Zi, [
                u.type === "dir" ? (_(), g("svg", Ji, i[2] || (i[2] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  }, null, -1)
                ]))) : (_(), g("svg", Qi, i[3] || (i[3] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  }, null, -1)
                ]))),
                l("span", ec, b(u.basename), 1)
              ]))), 256)),
              l("p", tc, b(o(n)("The archive will be unarchived at")) + " (" + b(o(e).fs.data.dirname) + ")", 1),
              s.value.length ? (_(), K(Ye, {
                key: 0,
                onHidden: i[0] || (i[0] = (u) => s.value = ""),
                error: ""
              }, {
                default: Q(() => [
                  Z(b(s.value), 1)
                ]),
                _: 1
              })) : I("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, nc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function sc(t, e) {
  return _(), g("svg", nc, e[0] || (e[0] = [
    l("path", { d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125" }, null, -1)
  ]));
}
const qo = { render: sc }, oc = { class: "vuefinder__archive-modal__content" }, rc = { class: "vuefinder__archive-modal__form" }, lc = { class: "vuefinder__archive-modal__files vf-scrollbar" }, ac = { class: "vuefinder__archive-modal__file" }, ic = {
  key: 0,
  class: "vuefinder__archive-modal__icon vuefinder__archive-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, cc = {
  key: 1,
  class: "vuefinder__archive-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, dc = { class: "vuefinder__archive-modal__file-name" }, uc = ["placeholder"], zo = {
  __name: "ModalArchive",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = M(""), s = M(""), c = M(e.modal.data.items), a = () => {
      c.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "archive",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          items: c.value.map(({ path: d, type: i }) => ({ path: d, type: i })),
          name: r.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("The file(s) archived.") });
        },
        onError: (d) => {
          s.value = n(d.message);
        }
      });
    };
    return (d, i) => (_(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          onClick: a,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Archive")), 1),
        l("button", {
          type: "button",
          onClick: i[2] || (i[2] = (u) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1)
      ]),
      default: Q(() => [
        l("div", null, [
          q(et, {
            icon: o(qo),
            title: o(n)("Archive the files")
          }, null, 8, ["icon", "title"]),
          l("div", oc, [
            l("div", rc, [
              l("div", lc, [
                (_(!0), g(ge, null, ye(c.value, (u) => (_(), g("p", ac, [
                  u.type === "dir" ? (_(), g("svg", ic, i[3] || (i[3] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (_(), g("svg", cc, i[4] || (i[4] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ]))),
                  l("span", dc, b(u.basename), 1)
                ]))), 256))
              ]),
              ue(l("input", {
                "onUpdate:modelValue": i[0] || (i[0] = (u) => r.value = u),
                onKeyup: kt(a, ["enter"]),
                class: "vuefinder__archive-modal__input",
                placeholder: o(n)("Archive name. (.zip file will be created)"),
                type: "text"
              }, null, 40, uc), [
                [St, r.value]
              ]),
              s.value.length ? (_(), K(Ye, {
                key: 0,
                onHidden: i[1] || (i[1] = (u) => s.value = ""),
                error: ""
              }, {
                default: Q(() => [
                  Z(b(s.value), 1)
                ]),
                _: 1
              })) : I("", !0)
            ])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, vc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  class: "animate-spin p-0.5 h-5 w-5 text-white ml-auto",
  viewBox: "0 0 24 24"
};
function _c(t, e) {
  return _(), g("svg", vc, e[0] || (e[0] = [
    l("circle", {
      cx: "12",
      cy: "12",
      r: "10",
      stroke: "currentColor",
      "stroke-width": "4",
      class: "opacity-25 stroke-blue-900 dark:stroke-blue-100"
    }, null, -1),
    l("path", {
      fill: "currentColor",
      d: "M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12zm2 5.291A7.96 7.96 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938z",
      class: "opacity-75"
    }, null, -1)
  ]));
}
const us = { render: _c }, fc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function mc(t, e) {
  return _(), g("svg", fc, e[0] || (e[0] = [
    l("path", { d: "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" }, null, -1)
  ]));
}
const pc = { render: mc }, hc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function gc(t, e) {
  return _(), g("svg", hc, e[0] || (e[0] = [
    l("path", { d: "M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" }, null, -1)
  ]));
}
const bc = { render: gc }, wc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function yc(t, e) {
  return _(), g("svg", wc, e[0] || (e[0] = [
    l("path", { d: "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25zm0 9.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18zM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25zm0 9.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18z" }, null, -1)
  ]));
}
const kc = { render: yc }, Sc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function xc(t, e) {
  return _(), g("svg", Sc, e[0] || (e[0] = [
    l("path", { d: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75" }, null, -1)
  ]));
}
const $c = { render: xc }, Cc = { class: "vuefinder__toolbar" }, Ec = {
  key: 0,
  class: "vuefinder__toolbar__actions"
}, Ac = ["title"], Tc = ["title"], Mc = ["title"], Dc = ["title"], Oc = ["title"], Vc = ["title"], Lc = ["title"], Fc = {
  key: 1,
  class: "vuefinder__toolbar__search-results"
}, Rc = { class: "pl-2" }, Bc = { class: "dark:bg-gray-700 bg-gray-200 text-xs px-2 py-1 rounded" }, Hc = { class: "vuefinder__toolbar__controls" }, Ic = ["title"], Nc = ["title"], Uc = {
  __name: "Toolbar",
  setup(t) {
    const e = re("ServiceContainer"), { setStore: n } = e.storage, { t: r } = e.i18n, s = e.dragSelect, c = M("");
    e.emitter.on("vf-search-query", ({ newQuery: i }) => {
      c.value = i;
    });
    const a = () => {
      e.fullScreen = !e.fullScreen;
    };
    Le(
      () => e.fullScreen,
      () => {
        e.fullScreen ? document.querySelector("body").style.overflow = "hidden" : document.querySelector("body").style.overflow = "", n("full-screen", e.fullScreen), e.emitter.emit("vf-fullscreen-toggle");
      }
    );
    const d = () => {
      e.view = e.view === "list" ? "grid" : "list", s.refreshSelection(), n("viewport", e.view);
    };
    return (i, u) => (_(), g("div", Cc, [
      c.value.length ? (_(), g("div", Fc, [
        l("div", Rc, [
          Z(b(o(r)("Search results for")) + " ", 1),
          l("span", Bc, b(c.value), 1)
        ]),
        o(e).fs.loading ? (_(), K(o(us), { key: 0 })) : I("", !0)
      ])) : (_(), g("div", Ec, [
        o(e).features.includes(o(de).NEW_FOLDER) ? (_(), g("div", {
          key: 0,
          class: "mx-1.5",
          title: o(r)("New Folder"),
          onClick: u[0] || (u[0] = (h) => o(e).modal.open(Ho, { items: o(s).getSelected() }))
        }, [
          q(o(Bo))
        ], 8, Ac)) : I("", !0),
        o(e).features.includes(o(de).NEW_FILE) ? (_(), g("div", {
          key: 1,
          class: "mx-1.5",
          title: o(r)("New File"),
          onClick: u[1] || (u[1] = (h) => o(e).modal.open(Ti, { items: o(s).getSelected() }))
        }, [
          q(o(Io))
        ], 8, Tc)) : I("", !0),
        o(e).features.includes(o(de).RENAME) ? (_(), g("div", {
          key: 2,
          class: "mx-1.5",
          title: o(r)("Rename"),
          onClick: u[2] || (u[2] = (h) => o(s).getCount() !== 1 || o(e).modal.open(ds, { items: o(s).getSelected() }))
        }, [
          q(o(Ro), {
            class: le(
              o(s).getCount() === 1 ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled"
            )
          }, null, 8, ["class"])
        ], 8, Mc)) : I("", !0),
        o(e).features.includes(o(de).DELETE) ? (_(), g("div", {
          key: 3,
          class: "mx-1.5",
          title: o(r)("Delete"),
          onClick: u[3] || (u[3] = (h) => !o(s).getCount() || o(e).modal.open(cs, { items: o(s).getSelected() }))
        }, [
          q(o(Fo), {
            class: le(
              o(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled"
            )
          }, null, 8, ["class"])
        ], 8, Dc)) : I("", !0),
        o(e).features.includes(o(de).UPLOAD) ? (_(), g("div", {
          key: 4,
          class: "mx-1.5",
          title: o(r)("Upload"),
          onClick: u[4] || (u[4] = (h) => o(e).modal.open(Gi, { items: o(s).getSelected() }))
        }, [
          q(o(No))
        ], 8, Oc)) : I("", !0),
        o(e).features.includes(o(de).UNARCHIVE) && o(s).getCount() === 1 && (o(s).getSelected()[0].mime_type || o(s).getSelected()[0].mimeType) === "application/zip" ? (_(), g("div", {
          key: 5,
          class: "mx-1.5",
          title: o(r)("Unarchive"),
          onClick: u[5] || (u[5] = (h) => !o(s).getCount() || o(e).modal.open(Po, { items: o(s).getSelected() }))
        }, [
          q(o(Uo), {
            class: le(
              o(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled"
            )
          }, null, 8, ["class"])
        ], 8, Vc)) : I("", !0),
        o(e).features.includes(o(de).ARCHIVE) ? (_(), g("div", {
          key: 6,
          class: "mx-1.5",
          title: o(r)("Archive"),
          onClick: u[6] || (u[6] = (h) => !o(s).getCount() || o(e).modal.open(zo, { items: o(s).getSelected() }))
        }, [
          q(o(qo), {
            class: le(
              o(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled"
            )
          }, null, 8, ["class"])
        ], 8, Lc)) : I("", !0)
      ])),
      l("div", Hc, [
        o(e).features.includes(o(de).FULL_SCREEN) ? (_(), g("div", {
          key: 0,
          onClick: a,
          class: "mx-1.5",
          title: o(r)("Toggle Full Screen")
        }, [
          o(e).fullScreen ? (_(), K(o(bc), { key: 0 })) : (_(), K(o(pc), { key: 1 }))
        ], 8, Ic)) : I("", !0),
        l("div", {
          class: "mx-1.5",
          title: o(r)("Change View"),
          onClick: u[7] || (u[7] = (h) => c.value.length || d())
        }, [
          o(e).view === "grid" ? (_(), K(o(kc), {
            key: 0,
            class: le(["vf-toolbar-icon", c.value.length ? "vf-toolbar-icon-disabled" : ""])
          }, null, 8, ["class"])) : I("", !0),
          o(e).view === "list" ? (_(), K(o($c), {
            key: 1,
            class: le(["vf-toolbar-icon", c.value.length ? "vf-toolbar-icon-disabled" : ""])
          }, null, 8, ["class"])) : I("", !0)
        ], 8, Nc)
      ])
    ]));
  }
}, Pc = (t, e = 0, n = !1) => {
  let r;
  return (...s) => {
    n && !r && t(...s), clearTimeout(r), r = setTimeout(() => {
      t(...s);
    }, e);
  };
}, Bs = (t, e, n) => {
  const r = M(t);
  return cr((s, c) => ({
    get() {
      return s(), r.value;
    },
    set: Pc(
      (a) => {
        r.value = a, c();
      },
      e,
      n
    )
  }));
}, qc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true",
  class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
  viewBox: "0 0 24 24"
};
function zc(t, e) {
  return _(), g("svg", qc, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3"
    }, null, -1)
  ]));
}
const jc = { render: zc }, Gc = { class: "vuefinder__move-modal__content" }, Wc = { class: "vuefinder__move-modal__description" }, Kc = { class: "vuefinder__move-modal__files vf-scrollbar" }, Yc = { class: "vuefinder__move-modal__file" }, Xc = {
  key: 0,
  class: "vuefinder__move-modal__icon vuefinder__move-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Zc = {
  key: 1,
  class: "vuefinder__move-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Jc = { class: "vuefinder__move-modal__file-name" }, Qc = { class: "vuefinder__move-modal__target-title" }, ed = { class: "vuefinder__move-modal__target-directory" }, td = { class: "vuefinder__move-modal__target-path" }, nd = { class: "vuefinder__move-modal__selected-items" }, Wn = {
  __name: "ModalMove",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = M(e.modal.data.items.from), s = M(""), c = () => {
      r.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "move",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          items: r.value.map(({ path: a, type: d }) => ({ path: a, type: d })),
          item: e.modal.data.items.to.path
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("Files moved.", e.modal.data.items.to.name) });
        },
        onError: (a) => {
          s.value = n(a.message);
        }
      });
    };
    return (a, d) => (_(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, b(o(n)("Yes, Move!")), 1),
        l("button", {
          type: "button",
          onClick: d[1] || (d[1] = (i) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Cancel")), 1),
        l("div", nd, b(o(n)("%s item(s) selected.", r.value.length)), 1)
      ]),
      default: Q(() => [
        l("div", null, [
          q(et, {
            icon: o(jc),
            title: o(n)("Move files")
          }, null, 8, ["icon", "title"]),
          l("div", Gc, [
            l("p", Wc, b(o(n)("Are you sure you want to move these files?")), 1),
            l("div", Kc, [
              (_(!0), g(ge, null, ye(r.value, (i) => (_(), g("div", Yc, [
                l("div", null, [
                  i.type === "dir" ? (_(), g("svg", Xc, d[2] || (d[2] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (_(), g("svg", Zc, d[3] || (d[3] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ])))
                ]),
                l("div", Jc, b(i.path), 1)
              ]))), 256))
            ]),
            l("h4", Qc, b(o(n)("Target Directory")), 1),
            l("p", ed, [
              d[4] || (d[4] = l("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                class: "vuefinder__move-modal__icon vuefinder__move-modal__icon--dir",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                "stroke-width": "1"
              }, [
                l("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                })
              ], -1)),
              l("span", td, b(o(e).modal.data.items.to.path), 1)
            ]),
            s.value.length ? (_(), K(Ye, {
              key: 0,
              onHidden: d[0] || (d[0] = (i) => s.value = ""),
              error: ""
            }, {
              default: Q(() => [
                Z(b(s.value), 1)
              ]),
              _: 1
            })) : I("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}, sd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer",
  viewBox: "-40 -40 580 580"
};
function od(t, e) {
  return _(), g("svg", sd, e[0] || (e[0] = [
    l("path", { d: "M463.5 224h8.5c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2S461.9 48.1 455 55l-41.6 41.6c-87.6-86.5-228.7-86.2-315.8 1-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2S334.3 224 344 224z" }, null, -1)
  ]));
}
const rd = { render: od }, ld = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-0.5 rounded",
  viewBox: "0 0 20 20"
};
function ad(t, e) {
  return _(), g("svg", ld, e[0] || (e[0] = [
    l("path", {
      "fill-rule": "evenodd",
      d: "M5.293 9.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L11 7.414V15a1 1 0 1 1-2 0V7.414L6.707 9.707a1 1 0 0 1-1.414 0",
      class: "pointer-events-none",
      "clip-rule": "evenodd"
    }, null, -1)
  ]));
}
const id = { render: ad }, cd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer",
  viewBox: "0 0 24 24"
};
function dd(t, e) {
  return _(), g("svg", cd, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M6 18 18 6M6 6l12 12"
    }, null, -1)
  ]));
}
const ud = { render: dd }, vd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
  viewBox: "0 0 20 20"
};
function _d(t, e) {
  return _(), g("svg", vd, e[0] || (e[0] = [
    l("path", {
      d: "M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414z",
      class: "pointer-events-none"
    }, null, -1)
  ]));
}
const fd = { render: _d }, md = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 m-auto stroke-gray-400 fill-gray-100 dark:stroke-gray-400 dark:fill-gray-400/20",
  viewBox: "0 0 20 20"
};
function pd(t, e) {
  return _(), g("svg", md, e[0] || (e[0] = [
    l("path", { d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607" }, null, -1)
  ]));
}
const hd = { render: pd }, gd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "w-6 h-6 cursor-pointer",
  viewBox: "0 0 24 24"
};
function bd(t, e) {
  return _(), g("svg", gd, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M6 18 18 6M6 6l12 12"
    }, null, -1)
  ]));
}
const wd = { render: bd }, yd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  viewBox: "0 0 24 24"
};
function kd(t, e) {
  return _(), g("svg", yd, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2"
    }, null, -1)
  ]));
}
const hn = { render: kd }, Sd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "h-6 w-6 p-1 rounded text-slate-700 dark:text-neutral-300 cursor-pointer",
  viewBox: "0 0 24 24"
};
function xd(t, e) {
  return _(), g("svg", Sd, e[0] || (e[0] = [
    l("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "M9 6h11M12 12h8M15 18h5M5 6v.01M8 12v.01M11 18v.01" }, null, -1)
  ]));
}
const $d = { render: xd }, Cd = {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-6 w-6 rounded text-slate-700 hover:bg-neutral-100 dark:fill-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
  viewBox: "0 0 448 512"
};
function Ed(t, e) {
  return _(), g("svg", Cd, e[0] || (e[0] = [
    l("path", { d: "M8 256a56 56 0 1 1 112 0 56 56 0 1 1-112 0m160 0a56 56 0 1 1 112 0 56 56 0 1 1-112 0m216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112" }, null, -1)
  ]));
}
const Ad = { render: Ed }, Td = { class: "vuefinder__breadcrumb__container" }, Md = ["title"], Dd = ["title"], Od = ["title"], Vd = ["title"], Ld = { class: "vuefinder__breadcrumb__list" }, Fd = {
  key: 0,
  class: "vuefinder__breadcrumb__hidden-list"
}, Rd = { class: "relative" }, Bd = ["onDragover", "onDragleave", "onDrop", "title", "onClick"], Hd = { class: "vuefinder__breadcrumb__search-mode" }, Id = ["placeholder"], Nd = { class: "vuefinder__breadcrumb__hidden-dropdown" }, Ud = ["onDrop", "onClick"], Pd = { class: "vuefinder__breadcrumb__hidden-item-content" }, qd = { class: "vuefinder__breadcrumb__hidden-item-text" }, zd = {
  __name: "Breadcrumb",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = e.dragSelect, { setStore: s } = e.storage, c = M(null), a = Bs(0, 100);
    Le(a, (L) => {
      const S = c.value.children;
      let k = 0, E = 0, A = 5, H = 1;
      e.fs.limitBreadcrumbItems(A), dt(() => {
        for (let x = S.length - 1; x >= 0 && !(k + S[x].offsetWidth > a.value - 40); x--)
          k += parseInt(S[x].offsetWidth, 10), E++;
        E < H && (E = H), E > A && (E = A), e.fs.limitBreadcrumbItems(E);
      });
    });
    const d = () => {
      a.value = c.value.offsetWidth;
    };
    let i = M(null);
    xe(() => {
      i.value = new ResizeObserver(d), i.value.observe(c.value);
    }), Kn(() => {
      i.value.disconnect();
    });
    const u = (L, S = null) => {
      L.preventDefault(), r.isDraggingRef.value = !1, p(L), S ?? (S = e.fs.hiddenBreadcrumbs.length - 1);
      let k = JSON.parse(L.dataTransfer.getData("items"));
      if (k.find((E) => E.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(Wn, {
        items: {
          from: k,
          to: e.fs.hiddenBreadcrumbs[S] ?? { path: e.fs.adapter + "://" }
        }
      });
    }, h = (L, S = null) => {
      L.preventDefault(), r.isDraggingRef.value = !1, p(L), S ?? (S = e.fs.breadcrumbs.length - 2);
      let k = JSON.parse(L.dataTransfer.getData("items"));
      if (k.find((E) => E.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(Wn, {
        items: {
          from: k,
          to: e.fs.breadcrumbs[S] ?? { path: e.fs.adapter + "://" }
        }
      });
    }, f = (L) => {
      L.preventDefault(), e.fs.isGoUpAvailable() ? (L.dataTransfer.dropEffect = "copy", L.currentTarget.classList.add("bg-blue-200", "dark:bg-slate-600")) : (L.dataTransfer.dropEffect = "none", L.dataTransfer.effectAllowed = "none");
    }, p = (L) => {
      L.preventDefault(), L.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-600"), e.fs.isGoUpAvailable() && L.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-600");
    }, v = () => {
      F(), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname } });
    }, m = () => {
      F(), !e.fs.isGoUpAvailable() || e.emitter.emit("vf-fetch", {
        params: {
          q: "index",
          adapter: e.fs.adapter,
          path: e.fs.parentFolderPath
        }
      });
    }, w = (L) => {
      e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: L.path } }), e.fs.toggleHiddenBreadcrumbs(!1);
    }, y = () => {
      e.fs.showHiddenBreadcrumbs && e.fs.toggleHiddenBreadcrumbs(!1);
    }, O = {
      mounted(L, S, k, E) {
        L.clickOutsideEvent = function(A) {
          L === A.target || L.contains(A.target) || S.value();
        }, document.body.addEventListener("click", L.clickOutsideEvent);
      },
      beforeUnmount(L, S, k, E) {
        document.body.removeEventListener("click", L.clickOutsideEvent);
      }
    }, T = () => {
      e.showTreeView = !e.showTreeView;
    };
    Le(() => e.showTreeView, (L, S) => {
      L !== S && s("show-tree-view", L);
    });
    const C = M(null), $ = () => {
      e.features.includes(de.SEARCH) && (e.fs.searchMode = !0, dt(() => C.value.focus()));
    }, V = Bs("", 400);
    Le(V, (L) => {
      e.emitter.emit("vf-toast-clear"), e.emitter.emit("vf-search-query", { newQuery: L });
    }), Le(() => e.fs.searchMode, (L) => {
      L && dt(() => C.value.focus());
    });
    const F = () => {
      e.fs.searchMode = !1, V.value = "";
    };
    e.emitter.on("vf-search-exit", () => {
      F();
    });
    const z = () => {
      V.value === "" && F();
    };
    return (L, S) => (_(), g("div", Td, [
      l("span", {
        title: o(n)("Toggle Tree View")
      }, [
        q(o($d), {
          onClick: T,
          class: le(["vuefinder__breadcrumb__toggle-tree", o(e).showTreeView ? "vuefinder__breadcrumb__toggle-tree--active" : ""])
        }, null, 8, ["class"])
      ], 8, Md),
      l("span", {
        title: o(n)("Go up a directory")
      }, [
        q(o(id), {
          onDragover: S[0] || (S[0] = (k) => f(k)),
          onDragleave: S[1] || (S[1] = (k) => p(k)),
          onDrop: S[2] || (S[2] = (k) => h(k)),
          onClick: m,
          class: le(o(e).fs.isGoUpAvailable() ? "vuefinder__breadcrumb__go-up--active" : "vuefinder__breadcrumb__go-up--inactive")
        }, null, 8, ["class"])
      ], 8, Dd),
      o(e).fs.loading ? (_(), g("span", {
        key: 1,
        title: o(n)("Cancel")
      }, [
        q(o(ud), {
          onClick: S[3] || (S[3] = (k) => o(e).emitter.emit("vf-fetch-abort"))
        })
      ], 8, Vd)) : (_(), g("span", {
        key: 0,
        title: o(n)("Refresh")
      }, [
        q(o(rd), { onClick: v })
      ], 8, Od)),
      ue(l("div", {
        onClick: ot($, ["self"]),
        class: "group vuefinder__breadcrumb__search-container"
      }, [
        l("div", null, [
          q(o(fd), {
            onDragover: S[4] || (S[4] = (k) => f(k)),
            onDragleave: S[5] || (S[5] = (k) => p(k)),
            onDrop: S[6] || (S[6] = (k) => h(k, -1)),
            onClick: S[7] || (S[7] = (k) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: o(e).fs.adapter } }))
          })
        ]),
        l("div", Ld, [
          o(e).fs.hiddenBreadcrumbs.length ? ue((_(), g("div", Fd, [
            S[13] || (S[13] = l("div", { class: "vuefinder__breadcrumb__separator" }, "/", -1)),
            l("div", Rd, [
              l("span", {
                onDragenter: S[8] || (S[8] = (k) => o(e).fs.toggleHiddenBreadcrumbs(!0)),
                onClick: S[9] || (S[9] = (k) => o(e).fs.toggleHiddenBreadcrumbs()),
                class: "vuefinder__breadcrumb__hidden-toggle"
              }, [
                q(o(Ad), { class: "vuefinder__breadcrumb__hidden-toggle-icon" })
              ], 32)
            ])
          ])), [
            [O, y]
          ]) : I("", !0)
        ]),
        l("div", {
          ref_key: "breadcrumbContainer",
          ref: c,
          class: "vuefinder__breadcrumb__visible-list",
          onClick: ot($, ["self"])
        }, [
          (_(!0), g(ge, null, ye(o(e).fs.breadcrumbs, (k, E) => (_(), g("div", { key: E }, [
            S[14] || (S[14] = l("span", { class: "vuefinder__breadcrumb__separator" }, "/", -1)),
            l("span", {
              onDragover: (A) => E === o(e).fs.breadcrumbs.length - 1 || f(A),
              onDragleave: (A) => E === o(e).fs.breadcrumbs.length - 1 || p(A),
              onDrop: (A) => E === o(e).fs.breadcrumbs.length - 1 || h(A, E),
              class: "vuefinder__breadcrumb__item",
              title: k.basename,
              onClick: (A) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: o(e).fs.adapter, path: k.path } })
            }, b(k.name), 41, Bd)
          ]))), 128))
        ], 512),
        o(e).fs.loading ? (_(), K(o(us), { key: 0 })) : I("", !0)
      ], 512), [
        [Pe, !o(e).fs.searchMode]
      ]),
      ue(l("div", Hd, [
        l("div", null, [
          q(o(hd))
        ]),
        ue(l("input", {
          ref_key: "searchInput",
          ref: C,
          onKeydown: kt(F, ["esc"]),
          onBlur: z,
          "onUpdate:modelValue": S[10] || (S[10] = (k) => dr(V) ? V.value = k : null),
          placeholder: o(n)("Search anything.."),
          class: "vuefinder__breadcrumb__search-input",
          type: "text"
        }, null, 40, Id), [
          [St, o(V)]
        ]),
        q(o(wd), { onClick: F })
      ], 512), [
        [Pe, o(e).fs.searchMode]
      ]),
      ue(l("div", Nd, [
        (_(!0), g(ge, null, ye(o(e).fs.hiddenBreadcrumbs, (k, E) => (_(), g("div", {
          key: E,
          onDragover: S[11] || (S[11] = (A) => f(A)),
          onDragleave: S[12] || (S[12] = (A) => p(A)),
          onDrop: (A) => u(A, E),
          onClick: (A) => w(k),
          class: "vuefinder__breadcrumb__hidden-item"
        }, [
          l("div", Pd, [
            l("span", null, [
              q(o(hn), { class: "vuefinder__breadcrumb__hidden-item-icon" })
            ]),
            S[15] || (S[15] = Z()),
            l("span", qd, b(k.name), 1)
          ])
        ], 40, Ud))), 128))
      ], 512), [
        [Pe, o(e).fs.showHiddenBreadcrumbs]
      ])
    ]));
  }
};
function jd(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function Gd(t) {
  if (typeof t != "number")
    throw new TypeError("Expected a number");
  return {
    days: Math.trunc(t / 864e5),
    hours: Math.trunc(t / 36e5) % 24,
    minutes: Math.trunc(t / 6e4) % 60,
    seconds: Math.trunc(t / 1e3) % 60,
    ms: Math.trunc(t) % 1e3
  };
}
function it(t, e) {
  e = e || 2;
  let n = t.toString(), r = 0;
  return r = e - n.length + 1, n = new Array(r).join("0").concat(n), n;
}
function Wd(t, e) {
  return e ? t < 0 ? "-" : "" : t <= -1e3 ? "-" : "";
}
function Kd(t, e) {
  const n = e && e.leading, r = e && e.ms, s = t < 0 ? -t : t, c = Wd(t, r), a = Gd(s), d = it(a.seconds);
  let i = "";
  return a.days && !i && (i = c + a.days + ":" + it(a.hours) + ":" + it(a.minutes) + ":" + d), a.hours && !i && (i = c + (n ? it(a.hours) : a.hours) + ":" + it(a.minutes) + ":" + d), i || (i = c + (n ? it(a.minutes) : a.minutes) + ":" + d), r && (i += "." + it(a.ms, 3)), i;
}
var Yd = Kd;
const Xd = /* @__PURE__ */ jd(Yd), jo = (t, e = null) => new Date(t * 1e3).toLocaleString(e ?? navigator.language ?? "en-US"), Zd = ["onClick"], Jd = {
  __name: "Toast",
  setup(t) {
    const e = re("ServiceContainer"), { getStore: n } = e.storage, r = M(n("full-screen", !1)), s = M([]), c = (i) => i === "error" ? "text-red-400 border-red-400 dark:text-red-300 dark:border-red-300" : "text-lime-600 border-lime-600 dark:text-lime-300 dark:border-lime-1300", a = (i) => {
      s.value.splice(i, 1);
    }, d = (i) => {
      let u = s.value.findIndex((h) => h.id === i);
      u !== -1 && a(u);
    };
    return e.emitter.on("vf-toast-clear", () => {
      s.value = [];
    }), e.emitter.on("vf-toast-push", (i) => {
      let u = (/* @__PURE__ */ new Date()).getTime().toString(36).concat(performance.now().toString(), Math.random().toString()).replace(/\./g, "");
      i.id = u, s.value.push(i), setTimeout(() => {
        d(u);
      }, 5e3);
    }), (i, u) => (_(), g("div", {
      class: le(["vuefinder__toast", r.value.value ? "vuefinder__toast--fixed" : "vuefinder__toast--absolute"])
    }, [
      q(ur, {
        name: "vuefinder__toast-item",
        "enter-active-class": "vuefinder__toast-item--enter-active",
        "leave-active-class": "vuefinder__toast-item--leave-active",
        "leave-to-class": "vuefinder__toast-item--leave-to"
      }, {
        default: Q(() => [
          (_(!0), g(ge, null, ye(s.value, (h, f) => (_(), g("div", {
            key: f,
            onClick: (p) => a(f),
            class: le(["vuefinder__toast__message", c(h.type)])
          }, b(h.label), 11, Zd))), 128))
        ]),
        _: 1
      })
    ], 2));
  }
}, Qd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 20 20"
};
function eu(t, e) {
  return _(), g("svg", Qd, e[0] || (e[0] = [
    l("path", {
      "fill-rule": "evenodd",
      d: "M5.293 7.293a1 1 0 0 1 1.414 0L10 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414",
      "clip-rule": "evenodd"
    }, null, -1)
  ]));
}
const tu = { render: eu }, nu = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 20 20"
};
function su(t, e) {
  return _(), g("svg", nu, e[0] || (e[0] = [
    l("path", {
      "fill-rule": "evenodd",
      d: "M14.707 12.707a1 1 0 0 1-1.414 0L10 9.414l-3.293 3.293a1 1 0 0 1-1.414-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414",
      "clip-rule": "evenodd"
    }, null, -1)
  ]));
}
const ou = { render: su }, Wt = {
  __name: "SortIcon",
  props: { direction: String },
  setup(t) {
    return (e, n) => (_(), g("div", null, [
      t.direction === "asc" ? (_(), K(o(tu), { key: 0 })) : I("", !0),
      t.direction === "desc" ? (_(), K(o(ou), { key: 1 })) : I("", !0)
    ]));
  }
}, ru = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "text-neutral-500",
  viewBox: "0 0 24 24"
};
function lu(t, e) {
  return _(), g("svg", ru, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2"
    }, null, -1)
  ]));
}
const au = { render: lu }, iu = { class: "vuefinder__item-icon" }, En = {
  __name: "ItemIcon",
  props: {
    type: {
      type: String,
      required: !0
    },
    small: {
      type: Boolean,
      default: !1
    }
  },
  setup(t) {
    return (e, n) => (_(), g("span", iu, [
      t.type === "dir" ? (_(), K(o(hn), {
        key: 0,
        class: le(
          t.small ? "vuefinder__item-icon--small" : "vuefinder__item-icon--large"
        )
      }, null, 8, ["class"])) : (_(), K(o(au), {
        key: 1,
        class: le(
          t.small ? "vuefinder__item-icon--small" : "vuefinder__item-icon--large"
        )
      }, null, 8, ["class"]))
    ]));
  }
}, cu = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "absolute h-6 w-6 md:h-12 md:w-12 m-auto stroke-neutral-500 fill-white dark:fill-gray-700 dark:stroke-gray-600 z-10",
  viewBox: "0 0 24 24"
};
function du(t, e) {
  return _(), g("svg", cu, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2"
    }, null, -1)
  ]));
}
const uu = { render: du }, vu = { class: "vuefinder__drag-item__container" }, _u = { class: "vuefinder__drag-item__count" }, fu = {
  __name: "DragItem",
  props: {
    count: {
      type: Number,
      default: 0
    }
  },
  setup(t) {
    const e = t;
    return (n, r) => (_(), g("div", vu, [
      q(o(uu)),
      l("div", _u, b(e.count), 1)
    ]));
  }
}, mu = { class: "vuefinder__text-preview" }, pu = { class: "vuefinder__text-preview__header" }, hu = ["title"], gu = { class: "vuefinder__text-preview__actions" }, bu = {
  key: 0,
  class: "vuefinder__text-preview__content"
}, wu = { key: 1 }, yu = {
  __name: "Text",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = e, r = M(""), s = M(""), c = M(null), a = M(!1), d = M(""), i = M(!1), u = re("ServiceContainer"), { t: h } = u.i18n;
    xe(() => {
      u.requester.send({
        url: "",
        method: "get",
        params: { q: "preview", adapter: u.modal.data.adapter, path: u.modal.data.item.path },
        responseType: "text"
      }).then((v) => {
        r.value = v, n("success");
      });
    });
    const f = () => {
      a.value = !a.value, s.value = r.value;
    }, p = () => {
      d.value = "", i.value = !1, u.requester.send({
        url: "",
        method: "post",
        params: {
          q: "save",
          adapter: u.modal.data.adapter,
          path: u.modal.data.item.path
        },
        body: {
          content: s.value
        },
        responseType: "text"
      }).then((v) => {
        d.value = h("Updated."), r.value = v, n("success"), a.value = !a.value;
      }).catch((v) => {
        d.value = h(v.message), i.value = !0;
      });
    };
    return (v, m) => (_(), g("div", mu, [
      l("div", pu, [
        l("div", {
          class: "vuefinder__text-preview__title",
          id: "modal-title",
          title: o(u).modal.data.item.path
        }, b(o(u).modal.data.item.basename), 9, hu),
        l("div", gu, [
          a.value ? (_(), g("button", {
            key: 0,
            onClick: p,
            class: "vuefinder__text-preview__save-button"
          }, b(o(h)("Save")), 1)) : I("", !0),
          o(u).features.includes(o(de).EDIT) ? (_(), g("button", {
            key: 1,
            class: "vuefinder__text-preview__edit-button",
            onClick: m[0] || (m[0] = (w) => f())
          }, b(a.value ? o(h)("Cancel") : o(h)("Edit")), 1)) : I("", !0)
        ])
      ]),
      l("div", null, [
        a.value ? (_(), g("div", wu, [
          ue(l("textarea", {
            ref_key: "editInput",
            ref: c,
            "onUpdate:modelValue": m[1] || (m[1] = (w) => s.value = w),
            class: "vuefinder__text-preview__textarea",
            name: "text",
            cols: "30",
            rows: "10"
          }, null, 512), [
            [St, s.value]
          ])
        ])) : (_(), g("pre", bu, b(r.value), 1)),
        d.value.length ? (_(), K(Ye, {
          key: 2,
          onHidden: m[2] || (m[2] = (w) => d.value = ""),
          error: i.value
        }, {
          default: Q(() => [
            Z(b(d.value), 1)
          ]),
          _: 1
        }, 8, ["error"])) : I("", !0)
      ])
    ]));
  }
}, ku = { class: "vuefinder__image-preview" }, Su = { class: "vuefinder__image-preview__header" }, xu = ["title"], $u = { class: "vuefinder__image-preview__actions" }, Cu = { class: "vuefinder__image-preview__image-container" }, Eu = ["src"], Au = {
  __name: "Image",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = e, r = re("ServiceContainer"), { t: s } = r.i18n, c = M(null), a = M(null), d = M(!1), i = M(""), u = M(!1), h = () => {
      d.value = !d.value, d.value ? a.value = new wr(c.value, {
        crop(p) {
        }
      }) : a.value.destroy();
    }, f = () => {
      a.value.getCroppedCanvas({
        width: 795,
        height: 341
      }).toBlob(
        (p) => {
          i.value = "", u.value = !1;
          const v = new FormData();
          v.set("file", p), r.requester.send({
            url: "",
            method: "post",
            params: {
              q: "upload",
              adapter: r.modal.data.adapter,
              path: r.modal.data.item.path
            },
            body: v
          }).then((m) => {
            i.value = s("Updated."), c.value.src = r.requester.getPreviewUrl(r.modal.data.adapter, r.modal.data.item), h(), n("success");
          }).catch((m) => {
            i.value = s(m.message), u.value = !0;
          });
        }
      );
    };
    return xe(() => {
      n("success");
    }), (p, v) => (_(), g("div", ku, [
      l("div", Su, [
        l("h3", {
          class: "vuefinder__image-preview__title",
          id: "modal-title",
          title: o(r).modal.data.item.path
        }, b(o(r).modal.data.item.basename), 9, xu),
        l("div", $u, [
          d.value ? (_(), g("button", {
            key: 0,
            onClick: f,
            class: "vuefinder__image-preview__crop-button"
          }, b(o(s)("Crop")), 1)) : I("", !0),
          o(r).features.includes(o(de).EDIT) ? (_(), g("button", {
            key: 1,
            class: "vuefinder__image-preview__edit-button",
            onClick: v[0] || (v[0] = (m) => h())
          }, b(d.value ? o(s)("Cancel") : o(s)("Edit")), 1)) : I("", !0)
        ])
      ]),
      l("div", Cu, [
        l("img", {
          ref_key: "image",
          ref: c,
          class: "vuefinder__image-preview__image",
          src: o(r).requester.getPreviewUrl(o(r).modal.data.adapter, o(r).modal.data.item),
          alt: ""
        }, null, 8, Eu)
      ]),
      i.value.length ? (_(), K(Ye, {
        key: 0,
        onHidden: v[1] || (v[1] = (m) => i.value = ""),
        error: u.value
      }, {
        default: Q(() => [
          Z(b(i.value), 1)
        ]),
        _: 1
      }, 8, ["error"])) : I("", !0)
    ]));
  }
}, Tu = { class: "vuefinder__default-preview" }, Mu = { class: "vuefinder__default-preview__header" }, Du = ["title"], Ou = {
  __name: "Default",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = re("ServiceContainer"), r = e;
    return xe(() => {
      r("success");
    }), (s, c) => (_(), g("div", Tu, [
      l("div", Mu, [
        l("h3", {
          class: "vuefinder__default-preview__title",
          id: "modal-title",
          title: o(n).modal.data.item.path
        }, b(o(n).modal.data.item.basename), 9, Du)
      ]),
      c[0] || (c[0] = l("div", null, null, -1))
    ]));
  }
}, Vu = { class: "vuefinder__video-preview" }, Lu = ["title"], Fu = {
  class: "vuefinder__video-preview__video",
  preload: "",
  controls: ""
}, Ru = ["src"], Bu = {
  __name: "Video",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = re("ServiceContainer"), r = e, s = () => n.requester.getPreviewUrl(n.modal.data.adapter, n.modal.data.item);
    return xe(() => {
      r("success");
    }), (c, a) => (_(), g("div", Vu, [
      l("h3", {
        class: "vuefinder__video-preview__title",
        id: "modal-title",
        title: o(n).modal.data.item.path
      }, b(o(n).modal.data.item.basename), 9, Lu),
      l("div", null, [
        l("video", Fu, [
          l("source", {
            src: s(),
            type: "video/mp4"
          }, null, 8, Ru),
          a[0] || (a[0] = Z(" Your browser does not support the video tag. "))
        ])
      ])
    ]));
  }
}, Hu = { class: "vuefinder__audio-preview" }, Iu = ["title"], Nu = {
  class: "vuefinder__audio-preview__audio",
  controls: ""
}, Uu = ["src"], Pu = {
  __name: "Audio",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = e, r = re("ServiceContainer"), s = () => r.requester.getPreviewUrl(r.modal.data.adapter, r.modal.data.item);
    return xe(() => {
      n("success");
    }), (c, a) => (_(), g("div", Hu, [
      l("h3", {
        class: "vuefinder__audio-preview__title",
        id: "modal-title",
        title: o(r).modal.data.item.path
      }, b(o(r).modal.data.item.basename), 9, Iu),
      l("div", null, [
        l("audio", Nu, [
          l("source", {
            src: s(),
            type: "audio/mpeg"
          }, null, 8, Uu),
          a[0] || (a[0] = Z(" Your browser does not support the audio element. "))
        ])
      ])
    ]));
  }
}, qu = { class: "vuefinder__pdf-preview" }, zu = ["title"], ju = ["data"], Gu = ["src", "srcdoc"], Wu = {
  __name: "Pdf",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = re("ServiceContainer"), r = e, s = () => n.requester.getPreviewUrl(
      n.modal.data.adapter,
      n.modal.data.item
    );
    return xe(() => {
      r("success");
    }), (c, a) => (_(), g("div", qu, [
      l("h3", {
        class: "vuefinder__pdf-preview__title",
        id: "modal-title",
        title: o(n).modal.data.item.path
      }, b(o(n).modal.data.item.basename), 9, zu),
      l("div", null, [
        l("object", {
          class: "vuefinder__pdf-preview__object",
          data: s(),
          type: "application/pdf",
          width: "100%",
          height: "100%"
        }, [
          l("iframe", {
            class: "vuefinder__pdf-preview__iframe",
            src: s(),
            width: "100%",
            height: "100%",
            srcdoc: `<p>
          Your browser does not support PDFs.
          <a href="${s()}">Download the PDF</a>.
        </p>`
          }, null, 8, Gu)
        ], 8, ju)
      ])
    ]));
  }
}, Ku = { class: "vuefinder__preview-modal__content" }, Yu = { key: 0 }, Xu = { class: "vuefinder__preview-modal__loading" }, Zu = {
  key: 0,
  class: "vuefinder__preview-modal__loading-indicator"
}, Ju = {
  key: 0,
  class: "vuefinder__preview-modal__details"
}, Qu = { class: "vuefinder__preview-modal__details" }, ev = { class: "font-bold" }, tv = { class: "font-bold pl-2" }, nv = {
  key: 1,
  class: "vuefinder__preview-modal__note"
}, sv = ["download", "href"], Go = {
  __name: "ModalPreview",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = M(!1), s = (d) => ((e.modal.data.item.mime_type || e.modal.data.item.mimeType) ?? "").startsWith(d), c = e.features.includes(de.PREVIEW);
    c || (r.value = !0);
    const a = (d) => {
      let i = "";
      return d.artist && (i += `${d.artist}`, d.title && (i += ` - ${d.title}`)), i;
    };
    return (d, i) => (_(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          onClick: i[6] || (i[6] = (u) => o(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, b(o(n)("Close")), 1),
        o(e).features.includes(o(de).DOWNLOAD) ? (_(), g("a", {
          key: 0,
          target: "_blank",
          class: "vf-btn vf-btn-primary",
          download: o(e).requester.getDownloadUrl(
            o(e).modal.data.adapter,
            o(e).modal.data.item
          ),
          href: o(e).requester.getDownloadUrl(
            o(e).modal.data.adapter,
            o(e).modal.data.item
          )
        }, b(o(n)("Download")), 9, sv)) : I("", !0)
      ]),
      default: Q(() => [
        l("div", null, [
          l("div", Ku, [
            o(c) ? (_(), g("div", Yu, [
              s("text") ? (_(), K(yu, {
                key: 0,
                onSuccess: i[0] || (i[0] = (u) => r.value = !0)
              })) : s("image") ? (_(), K(Au, {
                key: 1,
                onSuccess: i[1] || (i[1] = (u) => r.value = !0)
              })) : s("video") ? (_(), K(Bu, {
                key: 2,
                onSuccess: i[2] || (i[2] = (u) => r.value = !0)
              })) : s("audio") ? (_(), K(Pu, {
                key: 3,
                onSuccess: i[3] || (i[3] = (u) => r.value = !0)
              })) : s("application/pdf") ? (_(), K(Wu, {
                key: 4,
                onSuccess: i[4] || (i[4] = (u) => r.value = !0)
              })) : (_(), K(Ou, {
                key: 5,
                onSuccess: i[5] || (i[5] = (u) => r.value = !0)
              }))
            ])) : I("", !0),
            l("div", Xu, [
              r.value === !1 ? (_(), g("div", Zu, [
                i[7] || (i[7] = l("svg", {
                  class: "vuefinder__preview-modal__spinner",
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24"
                }, [
                  l("circle", {
                    class: "vuefinder__preview-modal__spinner-circle",
                    cx: "12",
                    cy: "12",
                    r: "10",
                    stroke: "currentColor",
                    "stroke-width": "4"
                  }),
                  l("path", {
                    class: "vuefinder__preview-modal__spinner-path",
                    fill: "currentColor",
                    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  })
                ], -1)),
                l("span", null, b(o(n)("Loading")), 1)
              ])) : I("", !0)
            ])
          ])
        ]),
        ((o(e).modal.data.item.mime_type || o(e).modal.data.item.mimeType) ?? "").startsWith("audio") ? (_(), g("div", Ju, b(a(o(e).modal.data.item)), 1)) : I("", !0),
        l("div", Qu, [
          l("div", null, [
            l("span", ev, b(o(n)("File Size")) + ": ", 1),
            Z(b(o(e).filesize(o(e).modal.data.item.file_size)), 1)
          ]),
          l("div", null, [
            l("span", tv, b(o(n)("Last Modified")) + ": ", 1),
            Z(" " + b(o(jo)(o(e).modal.data.item.last_modified)), 1)
          ])
        ]),
        o(e).features.includes(o(de).DOWNLOAD) ? (_(), g("div", nv, [
          l("span", null, b(o(n)(
            `Download doesn't work? You can try right-click "Download" button, select "Save link as...".`
          )), 1)
        ])) : I("", !0)
      ]),
      _: 1
    }));
  }
}, ov = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
};
function rv(t, e) {
  return _(), g("svg", ov, e[0] || (e[0] = [
    l("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "m15 4.5-4 4L7 10l-1.5 1.5 7 7L14 17l1.5-4 4-4M9 15l-4.5 4.5M14.5 4 20 9.5" }, null, -1)
  ]));
}
const Wo = { render: rv }, lv = ["data-type", "data-item", "data-index"], An = {
  __name: "Item",
  props: {
    item: { type: Object },
    index: { type: Number },
    dragImage: { type: Object }
  },
  setup(t) {
    const e = re("ServiceContainer"), n = e.dragSelect, r = t, s = (v) => {
      v.type === "dir" ? (e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", {
        params: { q: "index", adapter: e.fs.adapter, path: v.path }
      })) : e.modal.open(Go, { adapter: e.fs.adapter, item: v });
    }, c = {
      mounted(v, m, w, y) {
        w.props.draggable && (v.addEventListener(
          "dragstart",
          (O) => a(O, m.value)
        ), v.addEventListener(
          "dragover",
          (O) => i(O, m.value)
        ), v.addEventListener(
          "drop",
          (O) => d(O, m.value)
        ));
      },
      beforeUnmount(v, m, w, y) {
        w.props.draggable && (v.removeEventListener("dragstart", a), v.removeEventListener("dragover", i), v.removeEventListener("drop", d));
      }
    }, a = (v, m) => {
      if (v.altKey || v.ctrlKey || v.metaKey)
        return v.preventDefault(), !1;
      n.isDraggingRef.value = !0, v.dataTransfer.setDragImage(r.dragImage.$el, 0, 15), v.dataTransfer.effectAllowed = "all", v.dataTransfer.dropEffect = "copy", v.dataTransfer.setData("items", JSON.stringify(n.getSelected()));
    }, d = (v, m) => {
      v.preventDefault(), n.isDraggingRef.value = !1;
      let w = JSON.parse(v.dataTransfer.getData("items"));
      if (w.find((y) => y.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(Wn, { items: { from: w, to: m } });
    }, i = (v, m) => {
      v.preventDefault(), !m || m.type !== "dir" || n.getSelection().find((w) => w === v.currentTarget) ? (v.dataTransfer.dropEffect = "none", v.dataTransfer.effectAllowed = "none") : v.dataTransfer.dropEffect = "copy";
    };
    let u = null, h = !1;
    const f = () => {
      u && clearTimeout(u);
    }, p = (v) => {
      if (!h)
        h = !0, setTimeout(() => h = !1, 300);
      else
        return h = !1, s(r.item), clearTimeout(u), !1;
      u = setTimeout(() => {
        const m = new MouseEvent("contextmenu", {
          bubbles: !0,
          cancelable: !1,
          view: window,
          button: 2,
          buttons: 0,
          clientX: v.target.getBoundingClientRect().x,
          clientY: v.target.getBoundingClientRect().y
        });
        v.target.dispatchEvent(m);
      }, 500);
    };
    return (v, m) => ue((_(), g("div", {
      style: an({
        opacity: o(n).isDraggingRef.value && o(n).getSelection().find((w) => v.$el === w) ? "0.5 !important" : ""
      }),
      class: le(["vuefinder__item", "vf-item-" + o(n).explorerId]),
      "data-type": t.item.type,
      key: t.item.path,
      "data-item": JSON.stringify(t.item),
      "data-index": t.index,
      onDblclick: m[0] || (m[0] = (w) => s(t.item)),
      onTouchstartPassive: m[1] || (m[1] = (w) => p(w)),
      onTouchend: m[2] || (m[2] = (w) => f()),
      onContextmenu: m[3] || (m[3] = ot((w) => o(e).emitter.emit("vf-contextmenu-show", {
        event: w,
        items: o(n).getSelected(),
        target: t.item
      }), ["prevent"]))
    }, [
      Tt(v.$slots, "default"),
      o(e).pinnedFolders.find((w) => w.path === t.item.path) ? (_(), K(o(Wo), {
        key: 0,
        class: "vuefinder__item--pinned"
      })) : I("", !0)
    ], 46, lv)), [
      [c, t.item]
    ]);
  }
}, av = { class: "vuefinder__explorer__container" }, iv = {
  key: 0,
  class: "vuefinder__explorer__header"
}, cv = { class: "vuefinder__explorer__drag-item" }, dv = { class: "vuefinder__explorer__item-list-content" }, uv = { class: "vuefinder__explorer__item-list-name" }, vv = { class: "vuefinder__explorer__item-name" }, _v = { class: "vuefinder__explorer__item-path" }, fv = { class: "vuefinder__explorer__item-list-content" }, mv = { class: "vuefinder__explorer__item-list-name" }, pv = ["title"], hv = { key: 0 }, gv = { key: 0 }, bv = { class: "vuefinder__explorer__item-size" }, wv = { key: 0 }, yv = { class: "vuefinder__explorer__item-date" }, kv = { class: "vuefinder__explorer__item-grid-content" }, Sv = ["data-src", "alt"], xv = {
  key: 2,
  class: "vuefinder__explorer__item-extension"
}, $v = { class: "vuefinder__explorer__item-title break-all" }, Cv = {
  __name: "Explorer",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = (p) => p == null ? void 0 : p.substring(0, 3), s = M(null), c = M(""), a = e.dragSelect;
    let d;
    e.emitter.on("vf-fullscreen-toggle", () => {
      a.area.value.style.height = null;
    }), e.emitter.on("vf-search-query", ({ newQuery: p }) => {
      c.value = p, p ? e.emitter.emit("vf-fetch", {
        params: {
          q: "search",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname,
          filter: p
        },
        onSuccess: (v) => {
          v.files.length || e.emitter.emit("vf-toast-push", {
            label: n("No search result found.")
          });
        }
      }) : e.emitter.emit("vf-fetch", {
        params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname }
      });
    });
    const i = He(() => ({
      active: e.sortActive,
      column: e.sortColumn,
      order: e.sortOrder
    })), u = (p = !0) => {
      let v = [...e.fs.data.files.filter((T) => !T.isFile)], m = [...e.fs.data.files.filter((T) => T.isFile)], w = i.value.column, y = i.value.order === "asc" ? 1 : -1;
      if (!p)
        return [...v, ...m];
      const O = (T, C) => typeof T == "string" && typeof C == "string" ? T.toLowerCase().localeCompare(C.toLowerCase()) : T < C ? -1 : T > C ? 1 : 0;
      return i.value.active && (v = v.slice().sort((T, C) => O(T[w], C[w]) * y), m = m.slice().sort((T, C) => O(T[w], C[w]) * y)), [...v, ...m];
    }, h = (p) => {
      e.sortActive && i.value.column === p ? (e.sortActive = i.value.order === "asc", e.sortColumn = p, e.sortOrder = "desc") : (e.sortActive = !0, e.sortColumn = p, e.sortOrder = "asc");
    }, f = (p) => {
      let v = p.basename;
      return p.artist && (v += ` (${p.artist}`, p.title && (v += ` - ${p.title}`), v += ")"), v;
    };
    return xe(() => {
      d = new br(a.area.value);
    }), Is(() => {
      d.update();
    }), Us(() => {
      d.destroy();
    }), (p, v) => (_(), g("div", av, [
      o(e).view === "list" || c.value.length ? (_(), g("div", iv, [
        l("div", {
          onClick: v[0] || (v[0] = (m) => h("basename")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--name vf-sort-button"
        }, [
          Z(b(o(n)("Name")) + " ", 1),
          ue(q(Wt, {
            direction: i.value.order
          }, null, 8, ["direction"]), [
            [Pe, i.value.active && i.value.column === "basename"]
          ])
        ]),
        c.value.length ? I("", !0) : (_(), g("div", {
          key: 0,
          onClick: v[1] || (v[1] = (m) => h("file_size")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--size vf-sort-button"
        }, [
          Z(b(o(n)("Size")) + " ", 1),
          ue(q(Wt, {
            direction: i.value.order
          }, null, 8, ["direction"]), [
            [Pe, i.value.active && i.value.column === "file_size"]
          ])
        ])),
        c.value.length ? I("", !0) : (_(), g("div", {
          key: 1,
          onClick: v[2] || (v[2] = (m) => h("last_modified")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--date vf-sort-button"
        }, [
          Z(b(o(n)("Date")) + " ", 1),
          ue(q(Wt, {
            direction: i.value.order
          }, null, 8, ["direction"]), [
            [Pe, i.value.active && i.value.column === "last_modified"]
          ])
        ])),
        c.value.length ? (_(), g("div", {
          key: 2,
          onClick: v[3] || (v[3] = (m) => h("path")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--path vf-sort-button"
        }, [
          Z(b(o(n)("Filepath")) + " ", 1),
          ue(q(Wt, {
            direction: i.value.order
          }, null, 8, ["direction"]), [
            [Pe, i.value.active && i.value.column === "path"]
          ])
        ])) : I("", !0)
      ])) : I("", !0),
      l("div", cv, [
        q(fu, {
          ref_key: "dragImage",
          ref: s,
          count: o(a).getCount()
        }, null, 8, ["count"])
      ]),
      l("div", {
        ref: o(a).scrollBarContainer,
        class: le(["vf-explorer-scrollbar-container vuefinder__explorer__scrollbar-container", [
          { "grid-view": o(e).view === "grid" },
          { "search-active": c.value.length }
        ]])
      }, [
        l("div", {
          ref: o(a).scrollBar,
          class: "vuefinder__explorer__scrollbar"
        }, null, 512)
      ], 2),
      l("div", {
        ref: o(a).area,
        class: "vuefinder__explorer__selector-area vf-explorer-scrollbar vf-selector-area",
        onContextmenu: v[4] || (v[4] = ot((m) => o(e).emitter.emit("vf-contextmenu-show", {
          event: m,
          items: o(a).getSelected()
        }), ["self", "prevent"]))
      }, [
        c.value.length ? (_(!0), g(ge, { key: 0 }, ye(u(), (m, w) => (_(), K(An, {
          item: m,
          index: w,
          dragImage: s.value,
          class: "vf-item vf-item-list"
        }, {
          default: Q(() => [
            l("div", dv, [
              l("div", uv, [
                q(En, {
                  type: m.type,
                  small: o(e).compactListView
                }, null, 8, ["type", "small"]),
                l("span", vv, b(m.basename), 1)
              ]),
              l("div", _v, b(m.path), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 256)) : I("", !0),
        o(e).view === "list" && !c.value.length ? (_(!0), g(ge, { key: 1 }, ye(u(), (m, w) => (_(), K(An, {
          item: m,
          index: w,
          dragImage: s.value,
          class: "vf-item vf-item-list",
          draggable: "true",
          key: m.path
        }, {
          default: Q(() => [
            l("div", fv, [
              l("div", mv, [
                q(En, {
                  type: m.type,
                  small: o(e).compactListView
                }, null, 8, ["type", "small"]),
                l("span", {
                  class: "vuefinder__explorer__item-name",
                  title: f(m)
                }, [
                  Z(b(m.basename) + " ", 1),
                  ((m.mime_type || m.mimeType) ?? "").startsWith(
                    "audio"
                  ) && m.artist ? (_(), g("span", hv, [
                    Z(" (" + b(m.artist) + " ", 1),
                    m.title ? (_(), g("span", gv, " - " + b(m.title), 1)) : I("", !0),
                    v[5] || (v[5] = Z(") "))
                  ])) : I("", !0)
                ], 8, pv)
              ]),
              l("div", bv, [
                Z(b(m.file_size ? o(e).filesize(m.file_size) : "") + " ", 1),
                ((m.mime_type || m.mimeType) ?? "").startsWith("audio") ? (_(), g("span", wv, " (" + b(o(Xd)(m.duration * 1e3)) + ") ", 1)) : I("", !0)
              ]),
              l("div", yv, b(o(jo)(m.last_modified)), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 128)) : I("", !0),
        o(e).view === "grid" && !c.value.length ? (_(!0), g(ge, { key: 2 }, ye(u(!1), (m, w) => (_(), K(An, {
          item: m,
          index: w,
          dragImage: s.value,
          class: "vf-item vf-item-grid",
          draggable: "true"
        }, {
          default: Q(() => [
            l("div", null, [
              l("div", kv, [
                ((m.mime_type || m.mimeType) ?? "").startsWith("image") && o(e).showThumbnails ? (_(), g("img", {
                  src: "data:image/png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
                  class: "vuefinder__explorer__item-thumbnail lazy",
                  "data-src": o(e).requester.getPreviewUrl(o(e).fs.adapter, m),
                  alt: m.basename,
                  key: m.path
                }, null, 8, Sv)) : (_(), K(En, {
                  key: 1,
                  type: m.type
                }, null, 8, ["type"])),
                !(((m.mime_type || m.mimeType) ?? "").startsWith(
                  "image"
                ) && o(e).showThumbnails) && m.type !== "dir" ? (_(), g("div", xv, b(r(m.extension)), 1)) : I("", !0)
              ]),
              l("span", $v, b(o(Gn)(m.basename)), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage"]))), 256)) : I("", !0)
      ], 544),
      q(Jd)
    ]));
  }
}, Ev = ["href", "download"], Av = ["onClick"], Tv = {
  __name: "ContextMenu",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, r = M(null), s = M([]), c = M(""), a = Vt({
      active: !1,
      items: [],
      positions: {
        left: 0,
        top: 0
      }
    }), d = He(() => a.items.filter(
      (f) => f.key == null || e.features.includes(f.key)
    ));
    e.emitter.on("vf-context-selected", (f) => {
      s.value = f;
    });
    const i = {
      newfolder: {
        key: de.NEW_FOLDER,
        title: () => n("New Folder"),
        action: () => e.modal.open(Ho)
      },
      selectAll: {
        title: () => n("Select All"),
        action: () => e.dragSelect.selectAll()
      },
      pinFolder: {
        title: () => n("Pin Folder"),
        action: () => {
          e.pinnedFolders = e.pinnedFolders.concat(s.value), e.storage.setStore("pinned-folders", e.pinnedFolders);
        }
      },
      unpinFolder: {
        title: () => n("Unpin Folder"),
        action: () => {
          e.pinnedFolders = e.pinnedFolders.filter(
            (f) => !s.value.find((p) => p.path === f.path)
          ), e.storage.setStore("pinned-folders", e.pinnedFolders);
        }
      },
      delete: {
        key: de.DELETE,
        title: () => n("Delete"),
        action: () => {
          e.modal.open(cs, { items: s });
        }
      },
      refresh: {
        title: () => n("Refresh"),
        action: () => {
          e.emitter.emit("vf-fetch", {
            params: {
              q: "index",
              adapter: e.fs.adapter,
              path: e.fs.data.dirname
            }
          });
        }
      },
      preview: {
        key: de.PREVIEW,
        title: () => n("Preview"),
        action: () => e.modal.open(Go, {
          adapter: e.fs.adapter,
          item: s.value[0]
        })
      },
      open: {
        title: () => n("Open"),
        action: () => {
          e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", {
            params: {
              q: "index",
              adapter: e.fs.adapter,
              path: s.value[0].path
            }
          });
        }
      },
      openDir: {
        title: () => n("Open containing folder"),
        action: () => {
          e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", {
            params: {
              q: "index",
              adapter: e.fs.adapter,
              path: s.value[0].dir
            }
          });
        }
      },
      download: {
        key: de.DOWNLOAD,
        link: He(
          () => e.requester.getDownloadUrl(e.fs.adapter, s.value[0])
        ),
        title: () => n("Download"),
        action: () => {
        }
      },
      archive: {
        key: de.ARCHIVE,
        title: () => n("Archive"),
        action: () => e.modal.open(zo, { items: s })
      },
      unarchive: {
        key: de.UNARCHIVE,
        title: () => n("Unarchive"),
        action: () => e.modal.open(Po, { items: s })
      },
      rename: {
        key: de.RENAME,
        title: () => n("Rename"),
        action: () => e.modal.open(ds, { items: s })
      }
    }, u = (f) => {
      e.emitter.emit("vf-contextmenu-hide"), f.action();
    };
    e.emitter.on("vf-search-query", ({ newQuery: f }) => {
      c.value = f;
    }), e.emitter.on("vf-contextmenu-show", ({ event: f, items: p, target: v = null }) => {
      if (a.items = [], c.value)
        if (v)
          a.items.push(i.openDir), e.emitter.emit("vf-context-selected", [v]);
        else
          return;
      else !v && !c.value ? (a.items.push(i.refresh), a.items.push(i.selectAll), a.items.push(i.newfolder), e.emitter.emit("vf-context-selected", [])) : p.length > 1 && p.some((m) => m.path === v.path) ? (a.items.push(i.refresh), a.items.push(i.archive), a.items.push(i.delete), e.emitter.emit("vf-context-selected", p)) : (v.type === "dir" ? (a.items.push(i.open), e.pinnedFolders.findIndex((m) => m.path === v.path) !== -1 ? a.items.push(i.unpinFolder) : a.items.push(i.pinFolder)) : (a.items.push(i.preview), a.items.push(i.download)), a.items.push(i.rename), (v.mime_type || v.mimeType) === "application/zip" ? a.items.push(i.unarchive) : a.items.push(i.archive), a.items.push(i.delete), e.emitter.emit("vf-context-selected", [v]));
      h(f);
    }), e.emitter.on("vf-contextmenu-hide", () => {
      a.active = !1;
    });
    const h = (f) => {
      const p = e.dragSelect.area.value, v = e.root.getBoundingClientRect(), m = p.getBoundingClientRect();
      let w = f.clientX - v.left, y = f.clientY - v.top;
      a.active = !0, dt(() => {
        var $;
        const O = ($ = r.value) == null ? void 0 : $.getBoundingClientRect();
        let T = (O == null ? void 0 : O.height) ?? 0, C = (O == null ? void 0 : O.width) ?? 0;
        w = m.right - f.pageX + window.scrollX < C ? w - C : w, y = m.bottom - f.pageY + window.scrollY < T ? y - T : y, a.positions = {
          left: w + "px",
          top: y + "px"
        };
      });
    };
    return (f, p) => ue((_(), g("ul", {
      ref_key: "contextmenu",
      ref: r,
      style: an(a.positions),
      class: "vuefinder__context-menu"
    }, [
      (_(!0), g(ge, null, ye(d.value, (v) => (_(), g("li", {
        class: "vuefinder__context-menu__item",
        key: v.title
      }, [
        v.link ? (_(), g("a", {
          key: 0,
          class: "vuefinder__context-menu__link",
          target: "_blank",
          href: v.link,
          download: v.link,
          onClick: p[0] || (p[0] = (m) => o(e).emitter.emit("vf-contextmenu-hide"))
        }, [
          l("span", null, b(v.title()), 1)
        ], 8, Ev)) : (_(), g("div", {
          key: 1,
          class: "vuefinder__context-menu__action",
          onClick: (m) => u(v)
        }, [
          l("span", null, b(v.title()), 1)
        ], 8, Av))
      ]))), 128))
    ], 4)), [
      [Pe, a.active]
    ]);
  }
}, Mv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
};
function Dv(t, e) {
  return _(), g("svg", Mv, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
    }, null, -1)
  ]));
}
const Ko = { render: Dv }, Ov = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  class: "h-5 w-5 stroke-slate-500 cursor-pointer",
  viewBox: "0 0 24 24"
};
function Vv(t, e) {
  return _(), g("svg", Ov, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0"
    }, null, -1)
  ]));
}
const Lv = { render: Vv }, Fv = { class: "vuefinder__status-bar__wrapper" }, Rv = { class: "vuefinder__status-bar__storage" }, Bv = ["title"], Hv = { class: "vuefinder__status-bar__storage-icon" }, Iv = ["value"], Nv = { class: "vuefinder__status-bar__info" }, Uv = { key: 0 }, Pv = { class: "vuefinder__status-bar__selected-count" }, qv = { class: "vuefinder__status-bar__actions" }, zv = ["disabled", "onClick"], jv = ["disabled"], Gv = ["title"], Wv = {
  __name: "Statusbar",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, { setStore: r } = e.storage, s = e.dragSelect, c = () => {
      e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", {
        params: { q: "index", adapter: e.fs.adapter }
      }), r("adapter", e.fs.adapter);
    }, a = M("");
    e.emitter.on("vf-search-query", ({ newQuery: u }) => {
      a.value = u;
    });
    const d = (u) => {
      const h = e.selectButton.multiple ? s.getSelected().length > 0 : s.getSelected().length === 1;
      return u.isActive() && h;
    }, i = He(() => {
      const u = e.selectButton.multiple ? s.getSelected().length > 0 : s.getSelected().length === 1;
      return e.selectButton.active && u;
    });
    return (u, h) => (_(), g("div", Fv, [
      l("div", Rv, [
        l("div", {
          class: "vuefinder__status-bar__storage-container",
          title: o(n)("Storage")
        }, [
          l("div", Hv, [
            q(o(Ko))
          ]),
          ue(l("select", {
            "onUpdate:modelValue": h[0] || (h[0] = (f) => o(e).fs.adapter = f),
            onChange: c,
            class: "vuefinder__status-bar__storage-select",
            tabindex: "-1"
          }, [
            (_(!0), g(ge, null, ye(o(e).fs.data.storages, (f) => (_(), g("option", { value: f }, b(f), 9, Iv))), 256))
          ], 544), [
            [Tn, o(e).fs.adapter]
          ])
        ], 8, Bv),
        l("div", Nv, [
          a.value.length ? (_(), g("span", Uv, b(o(e).fs.data.files.length) + " items found. ", 1)) : I("", !0),
          l("span", Pv, b(o(e).dragSelect.getCount() > 0 ? o(n)("%s item(s) selected.", o(e).dragSelect.getCount()) : ""), 1)
        ])
      ]),
      l("div", qv, [
        (_(!0), g(ge, null, ye(o(e).additionalButtons, (f) => (_(), g("button", {
          class: le(["vf-btn py-0 vf-btn-primary", { disabled: !d(f) }]),
          disabled: !d(f),
          onClick: (p) => f.click(o(s).getSelected(), p)
        }, b(f.label), 11, zv))), 256)),
        o(e).selectButton.active ? (_(), g("button", {
          key: 0,
          class: le(["vf-btn py-0 vf-btn-primary", { disabled: !i.value }]),
          disabled: !i.value,
          onClick: h[1] || (h[1] = (f) => o(e).selectButton.click(o(s).getSelected(), f))
        }, b(o(n)("Select")), 11, jv)) : I("", !0),
        l("span", {
          class: "vuefinder__status-bar__about",
          title: o(n)("About"),
          onClick: h[2] || (h[2] = (f) => o(e).modal.open(Lo))
        }, [
          q(o(Lv))
        ], 8, Gv)
      ])
    ]));
  }
}, Kv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "text-neutral-500 fill-sky-500 stroke-gray-100/50 dark:stroke-slate-700/50 dark:fill-slate-500",
  viewBox: "0 0 24 24"
};
function Yv(t, e) {
  return _(), g("svg", Kv, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3.75 9.776q.168-.026.344-.026h15.812q.176 0 .344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
    }, null, -1)
  ]));
}
const Yo = { render: Yv }, Xv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
};
function Zv(t, e) {
  return _(), g("svg", Xv, e[0] || (e[0] = [
    l("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m3.6 5.2a1 1 0 0 0-1.4.2L12 10.333 9.8 7.4a1 1 0 1 0-1.6 1.2l2.55 3.4-2.55 3.4a1 1 0 1 0 1.6 1.2l2.2-2.933 2.2 2.933a1 1 0 0 0 1.6-1.2L13.25 12l2.55-3.4a1 1 0 0 0-.2-1.4" }, null, -1)
  ]));
}
const Jv = { render: Zv }, Qv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  viewBox: "0 0 24 24"
};
function e_(t, e) {
  return _(), g("svg", Qv, e[0] || (e[0] = [
    l("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "M15 12H9M12 9v6" }, null, -1)
  ]));
}
const Xo = { render: e_ }, t_ = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  viewBox: "0 0 24 24"
};
function n_(t, e) {
  return _(), g("svg", t_, e[0] || (e[0] = [
    l("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "M9 12h6" }, null, -1)
  ]));
}
const Zo = { render: n_ };
function Jo(t, e) {
  const n = t.findIndex((r) => r.path === e.path);
  n > -1 ? t[n] = e : t.push(e);
}
const s_ = { class: "vuefinder__folder-loader-indicator" }, o_ = {
  key: 1,
  class: "vuefinder__folder-loader-indicator--icon"
}, Qo = {
  __name: "FolderLoaderIndicator",
  props: /* @__PURE__ */ Mn({
    adapter: {
      type: String,
      required: !0
    },
    path: {
      type: String,
      required: !0
    }
  }, {
    modelValue: {},
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(t) {
    const e = t, n = re("ServiceContainer");
    n.i18n;
    const r = Jt(t, "modelValue"), s = M(!1);
    Le(
      () => r.value,
      () => {
        var d;
        return ((d = c()) == null ? void 0 : d.folders.length) || a();
      }
    );
    function c() {
      return n.treeViewData.find((d) => d.path === e.path);
    }
    const a = () => {
      s.value = !0, n.requester.send({
        url: "",
        method: "get",
        params: {
          q: "subfolders",
          adapter: e.adapter,
          path: e.path
        }
      }).then((d) => {
        Jo(n.treeViewData, { path: e.path, ...d });
      }).catch((d) => {
      }).finally(() => {
        s.value = !1;
      });
    };
    return (d, i) => {
      var u;
      return _(), g("div", s_, [
        s.value ? (_(), K(o(us), {
          key: 0,
          class: "vuefinder__folder-loader-indicator--loading"
        })) : (_(), g("div", o_, [
          r.value && ((u = c()) != null && u.folders.length) ? (_(), K(o(Zo), {
            key: 0,
            class: "vuefinder__folder-loader-indicator--minus"
          })) : I("", !0),
          r.value ? I("", !0) : (_(), K(o(Xo), {
            key: 1,
            class: "vuefinder__folder-loader-indicator--plus"
          }))
        ]))
      ]);
    };
  }
}, r_ = { class: "vuefinder__treesubfolderlist__item-content" }, l_ = ["onClick"], a_ = ["title", "onClick"], i_ = { class: "vuefinder__treesubfolderlist__item-icon" }, c_ = { class: "vuefinder__treesubfolderlist__subfolder" }, d_ = {
  __name: "TreeSubfolderList",
  props: {
    adapter: {
      type: String,
      required: !0
    },
    path: {
      type: String,
      required: !0
    }
  },
  setup(t) {
    const e = re("ServiceContainer"), n = M([]), r = t, s = M(null);
    xe(() => {
      r.path === r.adapter + "://" && Ge(s.value, {
        scrollbars: {
          theme: "vf-theme-dark dark:vf-theme-light"
        }
      });
    });
    const c = He(() => {
      var a;
      return ((a = e.treeViewData.find((d) => d.path === r.path)) == null ? void 0 : a.folders) || [];
    });
    return (a, d) => {
      const i = vr("TreeSubfolderList", !0);
      return _(), g("ul", {
        ref_key: "parentSubfolderList",
        ref: s,
        class: "vuefinder__treesubfolderlist__container"
      }, [
        (_(!0), g(ge, null, ye(c.value, (u, h) => (_(), g("li", {
          key: u.path,
          class: "vuefinder__treesubfolderlist__item"
        }, [
          l("div", r_, [
            l("div", {
              class: "vuefinder__treesubfolderlist__item-toggle",
              onClick: (f) => n.value[u.path] = !n.value[u.path]
            }, [
              q(Qo, {
                adapter: t.adapter,
                path: u.path,
                modelValue: n.value[u.path],
                "onUpdate:modelValue": (f) => n.value[u.path] = f
              }, null, 8, ["adapter", "path", "modelValue", "onUpdate:modelValue"])
            ], 8, l_),
            l("div", {
              class: "vuefinder__treesubfolderlist__item-link",
              title: u.path,
              onClick: (f) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: r.adapter, path: u.path } })
            }, [
              l("div", i_, [
                o(e).fs.path === u.path ? (_(), K(o(Yo), { key: 0 })) : (_(), K(o(hn), { key: 1 }))
              ]),
              l("div", {
                class: le(["vuefinder__treesubfolderlist__item-text", {
                  "vuefinder__treesubfolderlist__item-text--active": o(e).fs.path === u.path
                }])
              }, b(u.basename), 3)
            ], 8, a_)
          ]),
          l("div", c_, [
            ue(q(i, {
              adapter: r.adapter,
              path: u.path
            }, null, 8, ["adapter", "path"]), [
              [Pe, n.value[u.path]]
            ])
          ])
        ]))), 128))
      ], 512);
    };
  }
}, u_ = { class: "vuefinder__treestorageitem__loader" }, v_ = {
  __name: "TreeStorageItem",
  props: {
    storage: {
      type: String,
      required: !0
    }
  },
  setup(t) {
    const e = re("ServiceContainer"), n = M(!1);
    return (r, s) => (_(), g(ge, null, [
      l("div", {
        onClick: s[1] || (s[1] = (c) => n.value = !n.value),
        class: "vuefinder__treestorageitem__header"
      }, [
        l("div", {
          class: le(["vuefinder__treestorageitem__info", t.storage === o(e).fs.adapter ? "vuefinder__treestorageitem__info--active" : ""])
        }, [
          l("div", {
            class: le(["vuefinder__treestorageitem__icon", t.storage === o(e).fs.adapter ? "vuefinder__treestorageitem__icon--active" : ""])
          }, [
            q(o(Ko))
          ], 2),
          l("div", null, b(t.storage), 1)
        ], 2),
        l("div", u_, [
          q(Qo, {
            adapter: t.storage,
            path: t.storage + "://",
            modelValue: n.value,
            "onUpdate:modelValue": s[0] || (s[0] = (c) => n.value = c)
          }, null, 8, ["adapter", "path", "modelValue"])
        ])
      ]),
      ue(q(d_, {
        adapter: t.storage,
        path: t.storage + "://",
        class: "vuefinder__treestorageitem__subfolder"
      }, null, 8, ["adapter", "path"]), [
        [Pe, n.value]
      ])
    ], 64));
  }
}, __ = { class: "vuefinder__folder-indicator" }, f_ = { class: "vuefinder__folder-indicator--icon" }, m_ = {
  __name: "FolderIndicator",
  props: {
    modelValue: {},
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(t) {
    const e = Jt(t, "modelValue");
    return (n, r) => (_(), g("div", __, [
      l("div", f_, [
        e.value ? (_(), K(o(Zo), {
          key: 0,
          class: "vuefinder__folder-indicator--minus"
        })) : I("", !0),
        e.value ? I("", !0) : (_(), K(o(Xo), {
          key: 1,
          class: "vuefinder__folder-indicator--plus"
        }))
      ])
    ]));
  }
}, p_ = { class: "vuefinder__treeview__header" }, h_ = { class: "vuefinder__treeview__pinned-label" }, g_ = { class: "vuefinder__treeview__pin-text text-nowrap" }, b_ = {
  key: 0,
  class: "vuefinder__treeview__pinned-list"
}, w_ = { class: "vuefinder__treeview__pinned-item" }, y_ = ["onClick"], k_ = ["title"], S_ = ["onClick"], x_ = { key: 0 }, $_ = { class: "vuefinder__treeview__no-pinned" }, C_ = { class: "vuefinder__treeview__storage" }, E_ = {
  __name: "TreeView",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, { getStore: r, setStore: s } = e.storage, c = M(190), a = M(r("pinned-folders-opened", !0));
    Le(a, (h) => s("pinned-folders-opened", h));
    const d = (h) => {
      e.pinnedFolders = e.pinnedFolders.filter((f) => f.path !== h.path), e.storage.setStore("pinned-folders", e.pinnedFolders);
    }, i = (h) => {
      const f = h.clientX, p = h.target.parentElement, v = p.getBoundingClientRect().width;
      p.classList.remove("transition-[width]"), p.classList.add("transition-none");
      const m = (y) => {
        c.value = v + y.clientX - f, c.value < 50 && (c.value = 0, e.showTreeView = !1), c.value > 50 && (e.showTreeView = !0);
      }, w = () => {
        const y = p.getBoundingClientRect();
        c.value = y.width, p.classList.add("transition-[width]"), p.classList.remove("transition-none"), window.removeEventListener("mousemove", m), window.removeEventListener("mouseup", w);
      };
      window.addEventListener("mousemove", m), window.addEventListener("mouseup", w);
    }, u = M(null);
    return xe(() => {
      Ge(u.value, {
        overflow: {
          x: "hidden"
        },
        scrollbars: {
          theme: "vf-theme-dark dark:vf-theme-light"
        }
      });
    }), Le(e.fs.data, (h, f) => {
      const p = h.files.filter((v) => v.type === "dir");
      Jo(e.treeViewData, { path: e.fs.path, folders: p.map((v) => ({
        adapter: v.storage,
        path: v.path,
        basename: v.basename
      })) });
    }), (h, f) => (_(), g(ge, null, [
      l("div", {
        onClick: f[0] || (f[0] = (p) => o(e).showTreeView = !o(e).showTreeView),
        class: le(["vuefinder__treeview__overlay", o(e).showTreeView ? "vuefinder__treeview__backdrop" : "hidden"])
      }, null, 2),
      l("div", {
        style: an(o(e).showTreeView ? "min-width:100px;max-width:75%; width: " + c.value + "px" : "width: 0"),
        class: "vuefinder__treeview__container"
      }, [
        l("div", {
          ref_key: "treeViewScrollElement",
          ref: u,
          class: "vuefinder__treeview__scroll"
        }, [
          l("div", p_, [
            l("div", {
              onClick: f[2] || (f[2] = (p) => a.value = !a.value),
              class: "vuefinder__treeview__pinned-toggle"
            }, [
              l("div", h_, [
                q(o(Wo), { class: "vuefinder__treeview__pin-icon" }),
                l("div", g_, b(o(n)("Pinned Folders")), 1)
              ]),
              q(m_, {
                modelValue: a.value,
                "onUpdate:modelValue": f[1] || (f[1] = (p) => a.value = p)
              }, null, 8, ["modelValue"])
            ]),
            a.value ? (_(), g("ul", b_, [
              (_(!0), g(ge, null, ye(o(e).pinnedFolders, (p) => (_(), g("li", w_, [
                l("div", {
                  class: "vuefinder__treeview__pinned-folder",
                  onClick: (v) => o(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: p.storage, path: p.path } })
                }, [
                  o(e).fs.path !== p.path ? (_(), K(o(hn), {
                    key: 0,
                    class: "vuefinder__treeview__folder-icon"
                  })) : I("", !0),
                  o(e).fs.path === p.path ? (_(), K(o(Yo), {
                    key: 1,
                    class: "vuefinder__treeview__open-folder-icon"
                  })) : I("", !0),
                  l("div", {
                    title: p.path,
                    class: le(["vuefinder__treeview__folder-name text-nowrap", {
                      "vuefinder__treeview__folder-name--active": o(e).fs.path === p.path
                    }])
                  }, b(p.basename), 11, k_)
                ], 8, y_),
                l("div", {
                  class: "vuefinder__treeview__remove-favorite",
                  onClick: (v) => d(p)
                }, [
                  q(o(Jv), { class: "vuefinder__treeview__remove-icon" })
                ], 8, S_)
              ]))), 256)),
              o(e).pinnedFolders.length ? I("", !0) : (_(), g("li", x_, [
                l("div", $_, b(o(n)("No folders pinned")), 1)
              ]))
            ])) : I("", !0)
          ]),
          (_(!0), g(ge, null, ye(o(e).fs.data.storages, (p) => (_(), g("div", C_, [
            q(v_, { storage: p }, null, 8, ["storage"])
          ]))), 256))
        ], 512),
        l("div", {
          onMousedown: i,
          class: le([(o(e).showTreeView, ""), "vuefinder__treeview__resize-handle"])
        }, null, 34)
      ], 4)
    ], 64));
  }
}, A_ = { class: "vuefinder__main__content" }, T_ = {
  __name: "VueFinder",
  props: /* @__PURE__ */ Mn({
    id: {
      type: String,
      default: "vf"
    },
    request: {
      type: [String, Object],
      required: !0
    },
    persist: {
      type: Boolean,
      default: !1
    },
    path: {
      type: String,
      default: ""
    },
    features: {
      type: [Array, Boolean],
      default: !0
    },
    debug: {
      type: Boolean,
      default: !1
    },
    theme: {
      type: String,
      default: "system"
    },
    locale: {
      type: String,
      default: null
    },
    maxHeight: {
      type: String,
      default: "600px"
    },
    maxFileSize: {
      type: String,
      default: "10mb"
    },
    fullScreen: {
      type: Boolean,
      default: !1
    },
    showTreeView: {
      type: Boolean,
      default: !1
    },
    pinnedFolders: {
      type: Array,
      default: []
    },
    showThumbnails: {
      type: Boolean,
      default: !0
    },
    selectButton: {
      type: Object,
      default(t) {
        return {
          active: !1,
          multiple: !1,
          click: (e) => {
          },
          ...t
        };
      }
    },
    additionalButtons: {
      type: Array,
      default() {
        return [];
      }
    }
  }, {
    view: { default: "grid" },
    viewModifiers: {},
    sort: {},
    sortModifiers: {}
  }),
  emits: /* @__PURE__ */ Mn(["select"], ["update:view", "update:sort"]),
  setup(t, { emit: e }) {
    const n = e, r = t, s = Jt(t, "view"), c = Jt(t, "sort"), a = Hl(r, { view: s, sort: c }, re("VueFinderOptions"));
    _r("ServiceContainer", a);
    const { setStore: d } = a.storage, i = M(null);
    a.root = i;
    const u = a.dragSelect;
    pi(a);
    const h = (p) => {
      Object.assign(a.fs.data, p), u.clearSelection(), u.refreshSelection();
    };
    let f;
    return a.emitter.on("vf-fetch-abort", () => {
      f.abort(), a.fs.loading = !1;
    }), a.emitter.on(
      "vf-fetch",
      ({
        params: p,
        body: v = null,
        onSuccess: m = null,
        onError: w = null,
        noCloseModal: y = !1
      }) => {
        ["index", "search"].includes(p.q) && (f && f.abort(), a.fs.loading = !0), f = new AbortController();
        const O = f.signal;
        a.requester.send({
          url: "",
          method: p.m || "get",
          params: p,
          body: v,
          abortSignal: O
        }).then((T) => {
          a.fs.adapter = T.adapter, a.persist && (a.fs.path = T.dirname, d("path", a.fs.path)), ["index", "search"].includes(p.q) && (a.fs.loading = !1), y || a.modal.close(), h(T), m && m(T);
        }).catch((T) => {
          console.error(T), w && w(T);
        });
      }
    ), xe(() => {
      let p = {};
      a.fs.path.includes("://") && (p = {
        adapter: a.fs.path.split("://")[0],
        path: a.fs.path
      }), a.emitter.emit("vf-fetch", {
        params: { q: "index", adapter: a.fs.adapter, ...p }
      }), u.onSelect((v) => {
        n("select", v);
      });
    }), (p, v) => (_(), g("div", {
      class: "vuefinder",
      ref_key: "root",
      ref: i,
      tabindex: "0"
    }, [
      l("div", {
        class: le(o(a).theme.actualValue)
      }, [
        l("div", {
          class: le([
            o(a).fullScreen ? "vuefinder__main__fixed" : "vuefinder__main__relative",
            "vuefinder__main__container"
          ]),
          style: an(o(a).fullScreen ? "" : "max-height: " + t.maxHeight),
          onMousedown: v[0] || (v[0] = (m) => o(a).emitter.emit("vf-contextmenu-hide")),
          onTouchstartPassive: v[1] || (v[1] = (m) => o(a).emitter.emit("vf-contextmenu-hide"))
        }, [
          q(Uc),
          q(zd),
          l("div", A_, [
            q(E_),
            q(Cv)
          ]),
          q(Wv)
        ], 38),
        q(fr, { name: "fade" }, {
          default: Q(() => [
            o(a).modal.visible ? (_(), K(Ns(o(a).modal.type), { key: 0 })) : I("", !0)
          ]),
          _: 1
        }),
        q(Tv)
      ], 2)
    ], 512));
  }
}, I_ = {
  /**
   * @param {import('vue').App} app
   * @param options
   */
  install(t, e = {}) {
    e.i18n = e.i18n ?? {};
    let [n] = Object.keys(e.i18n);
    e.locale = e.locale ?? n ?? "en", t.provide("VueFinderOptions", e), t.component("VueFinder", T_);
  }
};
export {
  I_ as default
};
