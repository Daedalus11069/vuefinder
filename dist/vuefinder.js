var ir = Object.defineProperty;
var cr = (t, e, n) => e in t ? ir(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var ps = (t, e, n) => cr(t, typeof e != "symbol" ? e + "" : e, n);
import { reactive as Lt, watch as Me, ref as M, shallowRef as dr, onMounted as xe, onUnmounted as Yn, onUpdated as Us, nextTick as dt, computed as Fe, readonly as ur, getCurrentScope as vr, onScopeDispose as fr, unref as r, getCurrentInstance as _r, inject as re, openBlock as f, createElementBlock as b, withKeys as kt, createElementVNode as l, withModifiers as ot, renderSlot as Tt, normalizeClass as le, toDisplayString as w, createBlock as K, resolveDynamicComponent as Ps, withCtx as Q, createVNode as z, Fragment as ge, renderList as ye, createCommentVNode as I, withDirectives as ue, vModelCheckbox as jt, createTextVNode as X, vModelSelect as Dn, vModelText as St, onBeforeUnmount as zs, customRef as mr, vShow as Pe, isRef as pr, TransitionGroup as hr, mergeModels as Qt, useModel as Mt, normalizeStyle as dn, resolveComponent as gr, provide as br, Transition as wr } from "vue";
import yr from "mitt";
import kr from "dragselect";
import Sr from "@uppy/core";
import xr from "@uppy/xhr-upload";
import $r from "vanilla-lazyload";
import "cropperjs/dist/cropper.css";
import Cr from "cropperjs";
var Ns;
const $n = (Ns = document.querySelector('meta[name="csrf-token"]')) == null ? void 0 : Ns.getAttribute("content");
class Er {
  /** @param {RequestConfig} config */
  constructor(e) {
    /** @type {RequestConfig} */
    ps(this, "config");
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
    const n = this.config, o = {};
    $n != null && $n !== "" && (o[n.xsrfHeaderName] = $n);
    const s = Object.assign({}, n.headers, o, e.headers), c = Object.assign({}, n.params, e.params), a = e.body, d = n.baseUrl + e.url, i = e.method;
    let u;
    i !== "get" && (a instanceof FormData ? (u = a, n.body != null && Object.entries(this.config.body).forEach(([v, m]) => {
      u.append(v, m);
    })) : (u = { ...a }, n.body != null && Object.assign(u, this.config.body)));
    const _ = {
      url: d,
      method: i,
      headers: s,
      params: c,
      body: u
    };
    if (n.transformRequest != null) {
      const v = n.transformRequest({
        url: d,
        method: i,
        headers: s,
        params: c,
        body: u
      });
      v.url != null && (_.url = v.url), v.method != null && (_.method = v.method), v.params != null && (_.params = v.params ?? {}), v.headers != null && (_.headers = v.headers ?? {}), v.body != null && (_.body = v.body);
    }
    return _;
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
    const o = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "download", adapter: e, path: n.path }
    });
    return o.url + "?" + new URLSearchParams(o.params).toString();
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
    const o = this.transformRequestParams({
      url: "",
      method: "get",
      params: { q: "preview", adapter: e, path: n.path }
    });
    return o.url + "?" + new URLSearchParams(o.params).toString();
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
    const n = this.transformRequestParams(e), o = e.responseType || "json", s = {
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
      return await a[o]();
    throw await a.json();
  }
}
function Ar(t) {
  const e = {
    baseUrl: "",
    headers: {},
    params: {},
    body: {},
    xsrfHeaderName: "X-CSRF-Token"
  };
  return typeof t == "string" ? Object.assign(e, { baseUrl: t }) : Object.assign(e, t), new Er(e);
}
function Tr(t) {
  let e = localStorage.getItem(t + "_storage");
  const n = Lt(JSON.parse(e ?? "{}"));
  Me(n, o);
  function o() {
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
async function Mr(t, e) {
  const n = e[t];
  return typeof n == "function" ? (await n()).default : n;
}
function Dr(t, e, n, o) {
  const { getStore: s, setStore: c } = t, a = M({}), d = M(s("locale", e)), i = (v, m = e) => {
    Mr(v, o).then((p) => {
      a.value = p, c("locale", v), d.value = v, c("translations", p), Object.values(o).length > 1 && (n.emit("vf-toast-push", { label: "The language is set to " + v }), n.emit("vf-language-saved"));
    }).catch((p) => {
      m ? (n.emit("vf-toast-push", { label: "The selected locale is not yet supported!", type: "error" }), i(m, null)) : n.emit("vf-toast-push", { label: "Locale cannot be loaded!", type: "error" });
    });
  };
  Me(d, (v) => {
    i(v);
  }), !s("locale") && !o.length ? i(e) : a.value = s("translations");
  const u = (v, ...m) => m.length ? u(v = v.replace("%s", m.shift()), ...m) : v;
  function _(v, ...m) {
    return a.value && a.value.hasOwnProperty(v) ? u(a.value[v], ...m) : u(v, ...m);
  }
  return Lt({ t: _, locale: d });
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
}, Or = Object.values(de), Vr = "2.5.16";
function qs(t, e, n, o, s) {
  return (e = Math, n = e.log, o = 1024, s = n(t) / n(o) | 0, t / e.pow(o, s)).toFixed(0) + " " + (s ? "KMGTPEZY"[--s] + "iB" : "B");
}
function js(t, e, n, o, s) {
  return (e = Math, n = e.log, o = 1e3, s = n(t) / n(o) | 0, t / e.pow(o, s)).toFixed(0) + " " + (s ? "KMGTPEZY"[--s] + "B" : "B");
}
function Lr(t) {
  const e = { k: 1, m: 2, g: 3, t: 4 }, o = /(\d+(?:\.\d+)?)\s?(k|m|g|t)?b?/i.exec(t);
  return o[1] * Math.pow(1024, e[o[2].toLowerCase()]);
}
const nt = {
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark"
};
function Fr(t, e) {
  const n = M(nt.SYSTEM), o = M(nt.LIGHT);
  n.value = t.getStore("theme", e ?? nt.SYSTEM);
  const s = window.matchMedia("(prefers-color-scheme: dark)"), c = (a) => {
    n.value === nt.DARK || n.value === nt.SYSTEM && a.matches ? o.value = nt.DARK : o.value = nt.LIGHT;
  };
  return c(s), s.addEventListener("change", c), {
    /**
     * @type {import('vue').Ref<Theme>}
     */
    value: n,
    /**
     * @type {import('vue').Ref<Theme>}
     */
    actualValue: o,
    /**
     * @param {Theme} value
     */
    set(a) {
      n.value = a, a !== nt.SYSTEM ? t.setStore("theme", a) : t.removeStore("theme"), c(s);
    }
  };
}
function Rr() {
  const t = dr(null), e = M(!1), n = M();
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
const Oe = (t, e) => {
  const { o: n, i: o, u: s } = t;
  let c = n, a;
  const d = (_, v) => {
    const m = c, p = _, g = v || (o ? !o(m, p) : m !== p);
    return (g || s) && (c = p, a = m), [c, g, a];
  };
  return [e ? (_) => d(e(c, a), _) : d, (_) => [c, !!_, a]];
}, Br = typeof window < "u" && typeof HTMLElement < "u" && !!window.document, De = Br ? window : {}, Gs = Math.max, Hr = Math.min, On = Math.round, en = Math.abs, hs = Math.sign, Ws = De.cancelAnimationFrame, Jn = De.requestAnimationFrame, tn = De.setTimeout, Vn = De.clearTimeout, un = (t) => typeof De[t] < "u" ? De[t] : void 0, Ir = un("MutationObserver"), gs = un("IntersectionObserver"), nn = un("ResizeObserver"), Yt = un("ScrollTimeline"), Xn = (t) => t === void 0, vn = (t) => t === null, qe = (t) => typeof t == "number", Ft = (t) => typeof t == "string", Zn = (t) => typeof t == "boolean", He = (t) => typeof t == "function", je = (t) => Array.isArray(t), sn = (t) => typeof t == "object" && !je(t) && !vn(t), Qn = (t) => {
  const e = !!t && t.length, n = qe(e) && e > -1 && e % 1 == 0;
  return je(t) || !He(t) && n ? e > 0 && sn(t) ? e - 1 in t : !0 : !1;
}, on = (t) => !!t && t.constructor === Object, rn = (t) => t instanceof HTMLElement, fn = (t) => t instanceof Element;
function ae(t, e) {
  if (Qn(t))
    for (let n = 0; n < t.length && e(t[n], n, t) !== !1; n++)
      ;
  else t && ae(Object.keys(t), (n) => e(t[n], n, t));
  return t;
}
const Ks = (t, e) => t.indexOf(e) >= 0, Dt = (t, e) => t.concat(e), me = (t, e, n) => (!Ft(e) && Qn(e) ? Array.prototype.push.apply(t, e) : t.push(e), t), lt = (t) => Array.from(t || []), es = (t) => je(t) ? t : !Ft(t) && Qn(t) ? lt(t) : [t], Ln = (t) => !!t && !t.length, Fn = (t) => lt(new Set(t)), Re = (t, e, n) => {
  ae(t, (s) => s ? s.apply(void 0, e || []) : !0), !n && (t.length = 0);
}, Ys = "paddingTop", Js = "paddingRight", Xs = "paddingLeft", Zs = "paddingBottom", Qs = "marginLeft", eo = "marginRight", to = "marginBottom", no = "overflowX", so = "overflowY", _n = "width", mn = "height", st = "visible", ct = "hidden", bt = "scroll", Nr = (t) => {
  const e = String(t || "");
  return e ? e[0].toUpperCase() + e.slice(1) : "";
}, pn = (t, e, n, o) => {
  if (t && e) {
    let s = !0;
    return ae(n, (c) => {
      const a = t[c], d = e[c];
      a !== d && (s = !1);
    }), s;
  }
  return !1;
}, oo = (t, e) => pn(t, e, ["w", "h"]), Jt = (t, e) => pn(t, e, ["x", "y"]), Ur = (t, e) => pn(t, e, ["t", "r", "b", "l"]), ut = () => {
}, J = (t, ...e) => t.bind(0, ...e), mt = (t) => {
  let e;
  const n = t ? tn : Jn, o = t ? Vn : Ws;
  return [(s) => {
    o(e), e = n(() => s(), He(t) ? t() : t);
  }, () => o(e)];
}, Rn = (t, e) => {
  const { _: n, v: o, p: s, S: c } = e || {};
  let a, d, i, u, _ = ut;
  const v = function(y) {
    _(), Vn(a), u = a = d = void 0, _ = ut, t.apply(this, y);
  }, m = (h) => c && d ? c(d, h) : h, p = () => {
    _ !== ut && v(m(i) || i);
  }, g = function() {
    const y = lt(arguments), E = He(n) ? n() : n;
    if (qe(E) && E >= 0) {
      const k = He(o) ? o() : o, S = qe(k) && k >= 0, O = E > 0 ? tn : Jn, L = E > 0 ? Vn : Ws, V = m(y) || y, $ = v.bind(0, V);
      let x;
      _(), s && !u ? ($(), u = !0, x = O(() => u = void 0, E)) : (x = O($, E), S && !a && (a = tn(p, k))), _ = () => L(x), d = i = V;
    } else
      v(y);
  };
  return g.m = p, g;
}, ro = (t, e) => Object.prototype.hasOwnProperty.call(t, e), Ie = (t) => t ? Object.keys(t) : [], oe = (t, e, n, o, s, c, a) => {
  const d = [e, n, o, s, c, a];
  return (typeof t != "object" || vn(t)) && !He(t) && (t = {}), ae(d, (i) => {
    ae(i, (u, _) => {
      const v = i[_];
      if (t === v)
        return !0;
      const m = je(v);
      if (v && on(v)) {
        const p = t[_];
        let g = p;
        m && !je(p) ? g = [] : !m && !on(p) && (g = {}), t[_] = oe(g, v);
      } else
        t[_] = m ? v.slice() : v;
    });
  }), t;
}, lo = (t, e) => ae(oe({}, t), (n, o, s) => {
  n === void 0 ? delete s[o] : n && on(n) && (s[o] = lo(n));
}), ts = (t) => !Ie(t).length, ao = (t, e, n) => Gs(t, Hr(e, n)), vt = (t) => Fn((je(t) ? t : (t || "").split(" ")).filter((e) => e)), ns = (t, e) => t && t.getAttribute(e), bs = (t, e) => t && t.hasAttribute(e), Xe = (t, e, n) => {
  ae(vt(e), (o) => {
    t && t.setAttribute(o, String(n || ""));
  });
}, Ue = (t, e) => {
  ae(vt(e), (n) => t && t.removeAttribute(n));
}, hn = (t, e) => {
  const n = vt(ns(t, e)), o = J(Xe, t, e), s = (c, a) => {
    const d = new Set(n);
    return ae(vt(c), (i) => {
      d[a](i);
    }), lt(d).join(" ");
  };
  return {
    O: (c) => o(s(c, "delete")),
    $: (c) => o(s(c, "add")),
    C: (c) => {
      const a = vt(c);
      return a.reduce((d, i) => d && n.includes(i), a.length > 0);
    }
  };
}, io = (t, e, n) => (hn(t, e).O(n), J(ss, t, e, n)), ss = (t, e, n) => (hn(t, e).$(n), J(io, t, e, n)), ln = (t, e, n, o) => (o ? ss : io)(t, e, n), os = (t, e, n) => hn(t, e).C(n), co = (t) => hn(t, "class"), uo = (t, e) => {
  co(t).O(e);
}, rs = (t, e) => (co(t).$(e), J(uo, t, e)), vo = (t, e) => {
  const n = e ? fn(e) && e : document;
  return n ? lt(n.querySelectorAll(t)) : [];
}, Pr = (t, e) => {
  const n = e ? fn(e) && e : document;
  return n && n.querySelector(t);
}, Bn = (t, e) => fn(t) && t.matches(e), fo = (t) => Bn(t, "body"), Hn = (t) => t ? lt(t.childNodes) : [], Ot = (t) => t && t.parentElement, pt = (t, e) => fn(t) && t.closest(e), In = (t) => document.activeElement, zr = (t, e, n) => {
  const o = pt(t, e), s = t && Pr(n, o), c = pt(s, e) === o;
  return o && s ? o === t || s === t || c && pt(pt(t, n), e) !== o : !1;
}, wt = (t) => {
  ae(es(t), (e) => {
    const n = Ot(e);
    e && n && n.removeChild(e);
  });
}, Ve = (t, e) => J(wt, t && e && ae(es(e), (n) => {
  n && t.appendChild(n);
})), ht = (t) => {
  const e = document.createElement("div");
  return Xe(e, "class", t), e;
}, _o = (t) => {
  const e = ht();
  return e.innerHTML = t.trim(), ae(Hn(e), (n) => wt(n));
}, ws = (t, e) => t.getPropertyValue(e) || t[e] || "", mo = (t) => {
  const e = t || 0;
  return isFinite(e) ? e : 0;
}, Gt = (t) => mo(parseFloat(t || "")), Nn = (t) => Math.round(t * 1e4) / 1e4, po = (t) => `${Nn(mo(t))}px`;
function Vt(t, e) {
  t && e && ae(e, (n, o) => {
    try {
      const s = t.style, c = vn(n) || Zn(n) ? "" : qe(n) ? po(n) : n;
      o.indexOf("--") === 0 ? s.setProperty(o, c) : s[o] = c;
    } catch {
    }
  });
}
function Qe(t, e, n) {
  const o = Ft(e);
  let s = o ? "" : {};
  if (t) {
    const c = De.getComputedStyle(t, n) || t.style;
    s = o ? ws(c, e) : lt(e).reduce((a, d) => (a[d] = ws(c, d), a), s);
  }
  return s;
}
const ys = (t, e, n) => {
  const o = e ? `${e}-` : "", s = n ? `-${n}` : "", c = `${o}top${s}`, a = `${o}right${s}`, d = `${o}bottom${s}`, i = `${o}left${s}`, u = Qe(t, [c, a, d, i]);
  return {
    t: Gt(u[c]),
    r: Gt(u[a]),
    b: Gt(u[d]),
    l: Gt(u[i])
  };
}, qr = (t, e) => `translate${sn(t) ? `(${t.x},${t.y})` : `Y(${t})`}`, jr = (t) => !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length), Gr = {
  w: 0,
  h: 0
}, gn = (t, e) => e ? {
  w: e[`${t}Width`],
  h: e[`${t}Height`]
} : Gr, Wr = (t) => gn("inner", t || De), gt = J(gn, "offset"), ho = J(gn, "client"), an = J(gn, "scroll"), ls = (t) => {
  const e = parseFloat(Qe(t, _n)) || 0, n = parseFloat(Qe(t, mn)) || 0;
  return {
    w: e - On(e),
    h: n - On(n)
  };
}, Cn = (t) => t.getBoundingClientRect(), Kr = (t) => !!t && jr(t), Un = (t) => !!(t && (t[mn] || t[_n])), go = (t, e) => {
  const n = Un(t);
  return !Un(e) && n;
}, ks = (t, e, n, o) => {
  ae(vt(e), (s) => {
    t && t.removeEventListener(s, n, o);
  });
}, ve = (t, e, n, o) => {
  var s;
  const c = (s = o && o.H) != null ? s : !0, a = o && o.I || !1, d = o && o.A || !1, i = {
    passive: c,
    capture: a
  };
  return J(Re, vt(e).map((u) => {
    const _ = d ? (v) => {
      ks(t, u, _, a), n && n(v);
    } : n;
    return t && t.addEventListener(u, _, i), J(ks, t, u, _, a);
  }));
}, bo = (t) => t.stopPropagation(), Pn = (t) => t.preventDefault(), wo = (t) => bo(t) || Pn(t), ze = (t, e) => {
  const { x: n, y: o } = qe(e) ? {
    x: e,
    y: e
  } : e || {};
  qe(n) && (t.scrollLeft = n), qe(o) && (t.scrollTop = o);
}, Le = (t) => ({
  x: t.scrollLeft,
  y: t.scrollTop
}), yo = () => ({
  D: {
    x: 0,
    y: 0
  },
  M: {
    x: 0,
    y: 0
  }
}), Yr = (t, e) => {
  const { D: n, M: o } = t, { w: s, h: c } = e, a = (v, m, p) => {
    let g = hs(v) * p, h = hs(m) * p;
    if (g === h) {
      const y = en(v), E = en(m);
      h = y > E ? 0 : h, g = y < E ? 0 : g;
    }
    return g = g === h ? 0 : g, [g + 0, h + 0];
  }, [d, i] = a(n.x, o.x, s), [u, _] = a(n.y, o.y, c);
  return {
    D: {
      x: d,
      y: u
    },
    M: {
      x: i,
      y: _
    }
  };
}, Ss = ({ D: t, M: e }) => {
  const n = (o, s) => o === 0 && o <= s;
  return {
    x: n(t.x, e.x),
    y: n(t.y, e.y)
  };
}, xs = ({ D: t, M: e }, n) => {
  const o = (s, c, a) => ao(0, 1, (s - a) / (s - c) || 0);
  return {
    x: o(t.x, e.x, n.x),
    y: o(t.y, e.y, n.y)
  };
}, zn = (t) => {
  t && t.focus && t.focus({
    preventScroll: !0
  });
}, $s = (t, e) => {
  ae(es(e), t);
}, qn = (t) => {
  const e = /* @__PURE__ */ new Map(), n = (c, a) => {
    if (c) {
      const d = e.get(c);
      $s((i) => {
        d && d[i ? "delete" : "clear"](i);
      }, a);
    } else
      e.forEach((d) => {
        d.clear();
      }), e.clear();
  }, o = (c, a) => {
    if (Ft(c)) {
      const u = e.get(c) || /* @__PURE__ */ new Set();
      return e.set(c, u), $s((_) => {
        He(_) && u.add(_);
      }, a), J(n, c, a);
    }
    Zn(a) && a && n();
    const d = Ie(c), i = [];
    return ae(d, (u) => {
      const _ = c[u];
      _ && me(i, o(u, _));
    }), J(Re, i);
  }, s = (c, a) => {
    ae(lt(e.get(c)), (d) => {
      a && !Ln(a) ? d.apply(0, a) : d();
    });
  };
  return o(t || {}), [o, n, s];
}, Cs = (t) => JSON.stringify(t, (e, n) => {
  if (He(n))
    throw 0;
  return n;
}), Es = (t, e) => t ? `${e}`.split(".").reduce((n, o) => n && ro(n, o) ? n[o] : void 0, t) : void 0, Jr = {
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
}, ko = (t, e) => {
  const n = {}, o = Dt(Ie(e), Ie(t));
  return ae(o, (s) => {
    const c = t[s], a = e[s];
    if (sn(c) && sn(a))
      oe(n[s] = {}, ko(c, a)), ts(n[s]) && delete n[s];
    else if (ro(e, s) && a !== c) {
      let d = !0;
      if (je(c) || je(a))
        try {
          Cs(c) === Cs(a) && (d = !1);
        } catch {
        }
      d && (n[s] = a);
    }
  }), n;
}, As = (t, e, n) => (o) => [Es(t, o), n || Es(e, o) !== void 0], xt = "data-overlayscrollbars", Xt = "os-environment", Wt = `${Xt}-scrollbar-hidden`, En = `${xt}-initialize`, Zt = "noClipping", Ts = `${xt}-body`, rt = xt, Xr = "host", Ze = `${xt}-viewport`, Zr = no, Qr = so, el = "arrange", So = "measuring", tl = "scrolling", xo = "scrollbarHidden", nl = "noContent", jn = `${xt}-padding`, Ms = `${xt}-content`, as = "os-size-observer", sl = `${as}-appear`, ol = `${as}-listener`, rl = "os-trinsic-observer", ll = "os-theme-none", Be = "os-scrollbar", al = `${Be}-rtl`, il = `${Be}-horizontal`, cl = `${Be}-vertical`, $o = `${Be}-track`, is = `${Be}-handle`, dl = `${Be}-visible`, ul = `${Be}-cornerless`, Ds = `${Be}-interaction`, Os = `${Be}-unusable`, Gn = `${Be}-auto-hide`, Vs = `${Gn}-hidden`, Ls = `${Be}-wheel`, vl = `${$o}-interactive`, fl = `${is}-interactive`;
let Co;
const _l = () => Co, ml = (t) => {
  Co = t;
};
let An;
const pl = () => {
  const t = (S, O, L) => {
    Ve(document.body, S), Ve(document.body, S);
    const G = ho(S), V = gt(S), $ = ls(O);
    return L && wt(S), {
      x: V.h - G.h + $.h,
      y: V.w - G.w + $.w
    };
  }, e = (S) => {
    let O = !1;
    const L = rs(S, Wt);
    try {
      O = Qe(S, "scrollbar-width") === "none" || Qe(S, "display", "::-webkit-scrollbar") === "none";
    } catch {
    }
    return L(), O;
  }, n = `.${Xt}{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.${Xt} div{width:200%;height:200%;margin:10px 0}.${Wt}{scrollbar-width:none!important}.${Wt}::-webkit-scrollbar,.${Wt}::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}`, s = _o(`<div class="${Xt}"><div></div><style>${n}</style></div>`)[0], c = s.firstChild, a = s.lastChild, d = _l();
  d && (a.nonce = d);
  const [i, , u] = qn(), [_, v] = Oe({
    o: t(s, c),
    i: Jt
  }, J(t, s, c, !0)), [m] = v(), p = e(s), g = {
    x: m.x === 0,
    y: m.y === 0
  }, h = {
    elements: {
      host: null,
      padding: !p,
      viewport: (S) => p && fo(S) && S,
      content: !1
    },
    scrollbars: {
      slot: !0
    },
    cancel: {
      nativeScrollbarsOverlaid: !1,
      body: null
    }
  }, y = oe({}, Jr), E = J(oe, {}, y), H = J(oe, {}, h), k = {
    T: m,
    k: g,
    R: p,
    V: !!Yt,
    L: J(i, "r"),
    U: H,
    P: (S) => oe(h, S) && H(),
    N: E,
    q: (S) => oe(y, S) && E(),
    B: oe({}, h),
    F: oe({}, y)
  };
  if (Ue(s, "style"), wt(s), ve(De, "resize", () => {
    u("r", []);
  }), He(De.matchMedia) && !p && (!g.x || !g.y)) {
    const S = (O) => {
      const L = De.matchMedia(`(resolution: ${De.devicePixelRatio}dppx)`);
      ve(L, "change", () => {
        O(), S(O);
      }, {
        A: !0
      });
    };
    S(() => {
      const [O, L] = _();
      oe(k.T, O), u("r", [L]);
    });
  }
  return k;
}, We = () => (An || (An = pl()), An), Eo = (t, e) => He(e) ? e.apply(0, t) : e, hl = (t, e, n, o) => {
  const s = Xn(o) ? n : o;
  return Eo(t, s) || e.apply(0, t);
}, Ao = (t, e, n, o) => {
  const s = Xn(o) ? n : o, c = Eo(t, s);
  return !!c && (rn(c) ? c : e.apply(0, t));
}, gl = (t, e) => {
  const { nativeScrollbarsOverlaid: n, body: o } = e || {}, { k: s, R: c, U: a } = We(), { nativeScrollbarsOverlaid: d, body: i } = a().cancel, u = n ?? d, _ = Xn(o) ? i : o, v = (s.x || s.y) && u, m = t && (vn(_) ? !c : _);
  return !!v || !!m;
}, cs = /* @__PURE__ */ new WeakMap(), bl = (t, e) => {
  cs.set(t, e);
}, wl = (t) => {
  cs.delete(t);
}, To = (t) => cs.get(t), yl = (t, e, n) => {
  let o = !1;
  const s = n ? /* @__PURE__ */ new WeakMap() : !1, c = () => {
    o = !0;
  }, a = (d) => {
    if (s && n) {
      const i = n.map((u) => {
        const [_, v] = u || [];
        return [v && _ ? (d || vo)(_, t) : [], v];
      });
      ae(i, (u) => ae(u[0], (_) => {
        const v = u[1], m = s.get(_) || [];
        if (t.contains(_) && v) {
          const g = ve(_, v, (h) => {
            o ? (g(), s.delete(_)) : e(h);
          });
          s.set(_, me(m, g));
        } else
          Re(m), s.delete(_);
      }));
    }
  };
  return a(), [c, a];
}, Fs = (t, e, n, o) => {
  let s = !1;
  const { j: c, X: a, Y: d, W: i, J: u, G: _ } = o || {}, v = Rn(() => s && n(!0), {
    _: 33,
    v: 99
  }), [m, p] = yl(t, v, d), g = c || [], h = a || [], y = Dt(g, h), E = (k, S) => {
    if (!Ln(S)) {
      const O = u || ut, L = _ || ut, G = [], V = [];
      let $ = !1, x = !1;
      if (ae(S, (A) => {
        const { attributeName: T, target: R, type: C, oldValue: U, addedNodes: P, removedNodes: ee } = A, se = C === "attributes", ne = C === "childList", pe = t === R, F = se && T, B = F && ns(R, T || ""), N = Ft(B) ? B : null, q = F && U !== N, D = Ks(h, T) && q;
        if (e && (ne || !pe)) {
          const W = se && q, j = W && i && Bn(R, i), te = (j ? !O(R, T, U, N) : !se || W) && !L(A, !!j, t, o);
          ae(P, (ie) => me(G, ie)), ae(ee, (ie) => me(G, ie)), x = x || te;
        }
        !e && pe && q && !O(R, T, U, N) && (me(V, T), $ = $ || D);
      }), p((A) => Fn(G).reduce((T, R) => (me(T, vo(A, R)), Bn(R, A) ? me(T, R) : T), [])), e)
        return !k && x && n(!1), [!1];
      if (!Ln(V) || $) {
        const A = [Fn(V), $];
        return !k && n.apply(0, A), A;
      }
    }
  }, H = new Ir(J(E, !1));
  return [() => (H.observe(t, {
    attributes: !0,
    attributeOldValue: !0,
    attributeFilter: y,
    subtree: e,
    childList: e,
    characterData: e
  }), s = !0, () => {
    s && (m(), H.disconnect(), s = !1);
  }), () => {
    if (s)
      return v.m(), E(!0, H.takeRecords());
  }];
}, Mo = {}, Do = {}, kl = (t) => {
  ae(t, (e) => ae(e, (n, o) => {
    Mo[o] = e[o];
  }));
}, Oo = (t, e, n) => Ie(t).map((o) => {
  const { static: s, instance: c } = t[o], [a, d, i] = n || [], u = n ? c : s;
  if (u) {
    const _ = n ? u(a, d, e) : u(e);
    return (i || Do)[o] = _;
  }
}), Rt = (t) => Do[t], Sl = "__osOptionsValidationPlugin", xl = "__osSizeObserverPlugin", $l = (t, e) => {
  const { k: n } = e, [o, s] = t("showNativeOverlaidScrollbars");
  return [o && n.x && n.y, s];
}, yt = (t) => t.indexOf(st) === 0, Cl = (t, e) => {
  const n = (s, c, a, d) => {
    const i = s === st ? ct : s.replace(`${st}-`, ""), u = yt(s), _ = yt(a);
    return !c && !d ? ct : u && _ ? st : u ? c && d ? i : c ? st : ct : c ? i : _ && d ? st : ct;
  }, o = {
    x: n(e.x, t.x, e.y, t.y),
    y: n(e.y, t.y, e.x, t.x)
  };
  return {
    K: o,
    Z: {
      x: o.x === bt,
      y: o.y === bt
    }
  };
}, Vo = "__osScrollbarsHidingPlugin", El = "__osClickScrollPlugin", Lo = (t, e, n) => {
  const { dt: o } = n || {}, s = Rt(xl), [c] = Oe({
    o: !1,
    u: !0
  });
  return () => {
    const a = [], i = _o(`<div class="${as}"><div class="${ol}"></div></div>`)[0], u = i.firstChild, _ = (v) => {
      const m = v instanceof ResizeObserverEntry;
      let p = !1, g = !1;
      if (m) {
        const [h, , y] = c(v.contentRect), E = Un(h);
        g = go(h, y), p = !g && !E;
      } else
        g = v === !0;
      p || e({
        ft: !0,
        dt: g
      });
    };
    if (nn) {
      const v = new nn((m) => _(m.pop()));
      v.observe(u), me(a, () => {
        v.disconnect();
      });
    } else if (s) {
      const [v, m] = s(u, _, o);
      me(a, Dt([rs(i, sl), ve(i, "animationstart", v)], m));
    } else
      return ut;
    return J(Re, me(a, Ve(t, i)));
  };
}, Al = (t, e) => {
  let n;
  const o = (i) => i.h === 0 || i.isIntersecting || i.intersectionRatio > 0, s = ht(rl), [c] = Oe({
    o: !1
  }), a = (i, u) => {
    if (i) {
      const _ = c(o(i)), [, v] = _;
      return v && !u && e(_) && [_];
    }
  }, d = (i, u) => a(u.pop(), i);
  return [() => {
    const i = [];
    if (gs)
      n = new gs(J(d, !1), {
        root: t
      }), n.observe(s), me(i, () => {
        n.disconnect();
      });
    else {
      const u = () => {
        const _ = gt(s);
        a(_);
      };
      me(i, Lo(s, u)()), u();
    }
    return J(Re, me(i, Ve(t, s)));
  }, () => n && d(!0, n.takeRecords())];
}, Tl = (t, e, n, o) => {
  let s, c, a, d, i, u;
  const _ = `[${rt}]`, v = `[${Ze}]`, m = ["id", "class", "style", "open", "wrap", "cols", "rows"], { vt: p, ht: g, ot: h, gt: y, bt: E, nt: H, wt: k, yt: S, St: O, Ot: L } = t, G = (D) => Qe(D, "direction") === "rtl", V = {
    $t: !1,
    ct: G(p)
  }, $ = We(), x = Rt(Vo), [A] = Oe({
    i: oo,
    o: {
      w: 0,
      h: 0
    }
  }, () => {
    const D = x && x.tt(t, e, V, $, n).ut, j = !(k && H) && os(g, rt, Zt), Y = !H && S(el), te = Y && Le(y), ie = te && L(), be = O(So, j), fe = Y && D && D()[0], $e = an(h), Z = ls(h);
    return fe && fe(), ze(y, te), ie && ie(), j && be(), {
      w: $e.w + Z.w,
      h: $e.h + Z.h
    };
  }), T = Rn(o, {
    _: () => s,
    v: () => c,
    S(D, W) {
      const [j] = D, [Y] = W;
      return [Dt(Ie(j), Ie(Y)).reduce((te, ie) => (te[ie] = j[ie] || Y[ie], te), {})];
    }
  }), R = (D) => {
    const W = G(p);
    oe(D, {
      Ct: u !== W
    }), oe(V, {
      ct: W
    }), u = W;
  }, C = (D, W) => {
    const [j, Y] = D, te = {
      xt: Y
    };
    return oe(V, {
      $t: j
    }), !W && o(te), te;
  }, U = ({ ft: D, dt: W }) => {
    const Y = !(D && !W) && $.R ? T : o, te = {
      ft: D || W,
      dt: W
    };
    R(te), Y(te);
  }, P = (D, W) => {
    const [, j] = A(), Y = {
      Ht: j
    };
    return R(Y), j && !W && (D ? o : T)(Y), Y;
  }, ee = (D, W, j) => {
    const Y = {
      Et: W
    };
    return R(Y), W && !j && T(Y), Y;
  }, [se, ne] = E ? Al(g, C) : [], pe = !H && Lo(g, U, {
    dt: !0
  }), [F, B] = Fs(g, !1, ee, {
    X: m,
    j: m
  }), N = H && nn && new nn((D) => {
    const W = D[D.length - 1].contentRect;
    U({
      ft: !0,
      dt: go(W, i)
    }), i = W;
  }), q = Rn(() => {
    const [, D] = A();
    o({
      Ht: D
    });
  }, {
    _: 222,
    p: !0
  });
  return [() => {
    N && N.observe(g);
    const D = pe && pe(), W = se && se(), j = F(), Y = $.L((te) => {
      te ? T({
        zt: te
      }) : q();
    });
    return () => {
      N && N.disconnect(), D && D(), W && W(), d && d(), j(), Y();
    };
  }, ({ It: D, At: W, Dt: j }) => {
    const Y = {}, [te] = D("update.ignoreMutation"), [ie, be] = D("update.attributes"), [fe, $e] = D("update.elementEvents"), [Z, Ce] = D("update.debounce"), Ae = $e || be, ke = W || j, Ee = (he) => He(te) && te(he);
    if (Ae) {
      a && a(), d && d();
      const [he, we] = Fs(E || h, !0, P, {
        j: Dt(m, ie || []),
        Y: fe,
        W: _,
        G: (ce, _e) => {
          const { target: Se, attributeName: Te } = ce;
          return (!_e && Te && !H ? zr(Se, _, v) : !1) || !!pt(Se, `.${Be}`) || !!Ee(ce);
        }
      });
      d = he(), a = we;
    }
    if (Ce)
      if (T.m(), je(Z)) {
        const he = Z[0], we = Z[1];
        s = qe(he) && he, c = qe(we) && we;
      } else qe(Z) ? (s = Z, c = !1) : (s = !1, c = !1);
    if (ke) {
      const he = B(), we = ne && ne(), ce = a && a();
      he && oe(Y, ee(he[0], he[1], ke)), we && oe(Y, C(we[0], ke)), ce && oe(Y, P(ce[0], ke));
    }
    return R(Y), Y;
  }, V];
}, Ml = (t, e, n, o) => {
  const s = "--os-viewport-percent", c = "--os-scroll-percent", a = "--os-scroll-direction", { U: d } = We(), { scrollbars: i } = d(), { slot: u } = i, { vt: _, ht: v, ot: m, Mt: p, gt: g, wt: h, nt: y } = e, { scrollbars: E } = p ? {} : t, { slot: H } = E || {}, k = [], S = [], O = [], L = Ao([_, v, m], () => y && h ? _ : v, u, H), G = (F) => {
    if (Yt) {
      const B = new Yt({
        source: g,
        axis: F
      });
      return {
        kt: (q) => {
          const D = q.Tt.animate({
            clear: ["left"],
            [c]: [0, 1]
          }, {
            timeline: B
          });
          return () => D.cancel();
        }
      };
    }
  }, V = {
    x: G("x"),
    y: G("y")
  }, $ = () => {
    const { Rt: F, Vt: B } = n, N = (q, D) => ao(0, 1, q / (q + D) || 0);
    return {
      x: N(B.x, F.x),
      y: N(B.y, F.y)
    };
  }, x = (F, B, N) => {
    const q = N ? rs : uo;
    ae(F, (D) => {
      q(D.Tt, B);
    });
  }, A = (F, B) => {
    ae(F, (N) => {
      const [q, D] = B(N);
      Vt(q, D);
    });
  }, T = (F, B, N) => {
    const q = Zn(N), D = q ? N : !0, W = q ? !N : !0;
    D && x(S, F, B), W && x(O, F, B);
  }, R = () => {
    const F = $(), B = (N) => (q) => [q.Tt, {
      [s]: Nn(N) + ""
    }];
    A(S, B(F.x)), A(O, B(F.y));
  }, C = () => {
    if (!Yt) {
      const { Lt: F } = n, B = xs(F, Le(g)), N = (q) => (D) => [D.Tt, {
        [c]: Nn(q) + ""
      }];
      A(S, N(B.x)), A(O, N(B.y));
    }
  }, U = () => {
    const { Lt: F } = n, B = Ss(F), N = (q) => (D) => [D.Tt, {
      [a]: q ? "0" : "1"
    }];
    A(S, N(B.x)), A(O, N(B.y));
  }, P = () => {
    if (y && !h) {
      const { Rt: F, Lt: B } = n, N = Ss(B), q = xs(B, Le(g)), D = (W) => {
        const { Tt: j } = W, Y = Ot(j) === m && j, te = (ie, be, fe) => {
          const $e = be * ie;
          return po(fe ? $e : -$e);
        };
        return [Y, Y && {
          transform: qr({
            x: te(q.x, F.x, N.x),
            y: te(q.y, F.y, N.y)
          })
        }];
      };
      A(S, D), A(O, D);
    }
  }, ee = (F) => {
    const B = F ? "x" : "y", q = ht(`${Be} ${F ? il : cl}`), D = ht($o), W = ht(is), j = {
      Tt: q,
      Ut: D,
      Pt: W
    }, Y = V[B];
    return me(F ? S : O, j), me(k, [Ve(q, D), Ve(D, W), J(wt, q), Y && Y.kt(j), o(j, T, F)]), j;
  }, se = J(ee, !0), ne = J(ee, !1), pe = () => (Ve(L, S[0].Tt), Ve(L, O[0].Tt), J(Re, k));
  return se(), ne(), [{
    Nt: R,
    qt: C,
    Bt: U,
    Ft: P,
    jt: T,
    Xt: {
      Yt: S,
      Wt: se,
      Jt: J(A, S)
    },
    Gt: {
      Yt: O,
      Wt: ne,
      Jt: J(A, O)
    }
  }, pe];
}, Dl = (t, e, n, o) => (s, c, a) => {
  const { ht: d, ot: i, nt: u, gt: _, Kt: v, Ot: m } = e, { Tt: p, Ut: g, Pt: h } = s, [y, E] = mt(333), [H, k] = mt(444), S = (G) => {
    He(_.scrollBy) && _.scrollBy({
      behavior: "smooth",
      left: G.x,
      top: G.y
    });
  }, O = () => {
    const G = "pointerup pointercancel lostpointercapture", V = `client${a ? "X" : "Y"}`, $ = a ? _n : mn, x = a ? "left" : "top", A = a ? "w" : "h", T = a ? "x" : "y", R = (U, P) => (ee) => {
      const { Rt: se } = n, ne = gt(g)[A] - gt(h)[A], F = P * ee / ne * se[T];
      ze(_, {
        [T]: U + F
      });
    }, C = [];
    return ve(g, "pointerdown", (U) => {
      const P = pt(U.target, `.${is}`) === h, ee = P ? h : g, se = t.scrollbars, ne = se[P ? "dragScroll" : "clickScroll"], { button: pe, isPrimary: F, pointerType: B } = U, { pointers: N } = se;
      if (pe === 0 && F && ne && (N || []).includes(B)) {
        Re(C), k();
        const D = !P && (U.shiftKey || ne === "instant"), W = J(Cn, h), j = J(Cn, g), Y = (_e, Se) => (_e || W())[x] - (Se || j())[x], te = On(Cn(_)[$]) / gt(_)[A] || 1, ie = R(Le(_)[T], 1 / te), be = U[V], fe = W(), $e = j(), Z = fe[$], Ce = Y(fe, $e) + Z / 2, Ae = be - $e[x], ke = P ? 0 : Ae - Ce, Ee = (_e) => {
          Re(ce), ee.releasePointerCapture(_e.pointerId);
        }, he = P || D, we = m(), ce = [ve(v, G, Ee), ve(v, "selectstart", (_e) => Pn(_e), {
          H: !1
        }), ve(g, G, Ee), he && ve(g, "pointermove", (_e) => ie(ke + (_e[V] - be))), he && (() => {
          const _e = Le(_);
          we();
          const Se = Le(_), Te = {
            x: Se.x - _e.x,
            y: Se.y - _e.y
          };
          (en(Te.x) > 3 || en(Te.y) > 3) && (m(), ze(_, _e), S(Te), H(we));
        })];
        if (ee.setPointerCapture(U.pointerId), D)
          ie(ke);
        else if (!P) {
          const _e = Rt(El);
          if (_e) {
            const Se = _e(ie, ke, Z, (Te) => {
              Te ? we() : me(ce, we);
            });
            me(ce, Se), me(C, J(Se, !0));
          }
        }
      }
    });
  };
  let L = !0;
  return J(Re, [ve(h, "pointermove pointerleave", o), ve(p, "pointerenter", () => {
    c(Ds, !0);
  }), ve(p, "pointerleave pointercancel", () => {
    c(Ds, !1);
  }), !u && ve(p, "mousedown", () => {
    const G = In();
    (bs(G, Ze) || bs(G, rt) || G === document.body) && tn(J(zn, i), 25);
  }), ve(p, "wheel", (G) => {
    const { deltaX: V, deltaY: $, deltaMode: x } = G;
    L && x === 0 && Ot(p) === d && S({
      x: V,
      y: $
    }), L = !1, c(Ls, !0), y(() => {
      L = !0, c(Ls);
    }), Pn(G);
  }, {
    H: !1,
    I: !0
  }), ve(p, "pointerdown", J(ve, v, "click", wo, {
    A: !0,
    I: !0,
    H: !1
  }), {
    I: !0
  }), O(), E, k]);
}, Ol = (t, e, n, o, s, c) => {
  let a, d, i, u, _, v = ut, m = 0;
  const p = (F) => F.pointerType === "mouse", [g, h] = mt(), [y, E] = mt(100), [H, k] = mt(100), [S, O] = mt(() => m), [L, G] = Ml(t, s, o, Dl(e, s, o, (F) => p(F) && ee())), { ht: V, Qt: $, wt: x } = s, { jt: A, Nt: T, qt: R, Bt: C, Ft: U } = L, P = (F, B) => {
    if (O(), F)
      A(Vs);
    else {
      const N = J(A, Vs, !0);
      m > 0 && !B ? S(N) : N();
    }
  }, ee = () => {
    (i ? !a : !u) && (P(!0), y(() => {
      P(!1);
    }));
  }, se = (F) => {
    A(Gn, F, !0), A(Gn, F, !1);
  }, ne = (F) => {
    p(F) && (a = i, i && P(!0));
  }, pe = [O, E, k, h, () => v(), ve(V, "pointerover", ne, {
    A: !0
  }), ve(V, "pointerenter", ne), ve(V, "pointerleave", (F) => {
    p(F) && (a = !1, i && P(!1));
  }), ve(V, "pointermove", (F) => {
    p(F) && d && ee();
  }), ve($, "scroll", (F) => {
    g(() => {
      R(), ee();
    }), c(F), U();
  })];
  return [() => J(Re, me(pe, G())), ({ It: F, Dt: B, Zt: N, tn: q }) => {
    const { nn: D, sn: W, en: j, cn: Y } = q || {}, { Ct: te, dt: ie } = N || {}, { ct: be } = n, { k: fe } = We(), { K: $e, rn: Z } = o, [Ce, Ae] = F("showNativeOverlaidScrollbars"), [ke, Ee] = F("scrollbars.theme"), [he, we] = F("scrollbars.visibility"), [ce, _e] = F("scrollbars.autoHide"), [Se, Te] = F("scrollbars.autoHideSuspend"), [$t] = F("scrollbars.autoHideDelay"), [Bt, Ht] = F("scrollbars.dragScroll"), [It, at] = F("scrollbars.clickScroll"), [ft, wn] = F("overflow"), yn = ie && !B, kn = Z.x || Z.y, Sn = D || W || Y || te || B, Ne = j || we || wn, xn = Ce && fe.x && fe.y, Ct = (Et, tt, Nt) => {
      const At = Et.includes(bt) && (he === st || he === "auto" && tt === bt);
      return A(dl, At, Nt), At;
    };
    if (m = $t, yn && (Se && kn ? (se(!1), v(), H(() => {
      v = ve($, "scroll", J(se, !0), {
        A: !0
      });
    })) : se(!0)), Ae && A(ll, xn), Ee && (A(_), A(ke, !0), _ = ke), Te && !Se && se(!0), _e && (d = ce === "move", i = ce === "leave", u = ce === "never", P(u, !0)), Ht && A(fl, Bt), at && A(vl, !!It), Ne) {
      const Et = Ct(ft.x, $e.x, !0), tt = Ct(ft.y, $e.y, !1);
      A(ul, !(Et && tt));
    }
    Sn && (R(), T(), U(), Y && C(), A(Os, !Z.x, !0), A(Os, !Z.y, !1), A(al, be && !x));
  }, {}, L];
}, Vl = (t) => {
  const e = We(), { U: n, R: o } = e, { elements: s } = n(), { padding: c, viewport: a, content: d } = s, i = rn(t), u = i ? {} : t, { elements: _ } = u, { padding: v, viewport: m, content: p } = _ || {}, g = i ? t : u.target, h = fo(g), y = g.ownerDocument, E = y.documentElement, H = () => y.defaultView || De, k = J(hl, [g]), S = J(Ao, [g]), O = J(ht, ""), L = J(k, O, a), G = J(S, O, d), V = (Z) => {
    const Ce = gt(Z), Ae = an(Z), ke = Qe(Z, no), Ee = Qe(Z, so);
    return Ae.w - Ce.w > 0 && !yt(ke) || Ae.h - Ce.h > 0 && !yt(Ee);
  }, $ = L(m), x = $ === g, A = x && h, T = !x && G(p), R = !x && $ === T, C = A ? E : $, U = A ? C : g, P = !x && S(O, c, v), ee = !R && T, se = [ee, C, P, U].map((Z) => rn(Z) && !Ot(Z) && Z), ne = (Z) => Z && Ks(se, Z), pe = !ne(C) && V(C) ? C : g, F = A ? E : C, N = {
    vt: g,
    ht: U,
    ot: C,
    ln: P,
    bt: ee,
    gt: F,
    Qt: A ? y : C,
    an: h ? E : pe,
    Kt: y,
    wt: h,
    Mt: i,
    nt: x,
    un: H,
    yt: (Z) => os(C, Ze, Z),
    St: (Z, Ce) => ln(C, Ze, Z, Ce),
    Ot: () => ln(F, Ze, tl, !0)
  }, { vt: q, ht: D, ln: W, ot: j, bt: Y } = N, te = [() => {
    Ue(D, [rt, En]), Ue(q, En), h && Ue(E, [En, rt]);
  }];
  let ie = Hn([Y, j, W, D, q].find((Z) => Z && !ne(Z)));
  const be = A ? q : Y || j, fe = J(Re, te);
  return [N, () => {
    const Z = H(), Ce = In(), Ae = (ce) => {
      Ve(Ot(ce), Hn(ce)), wt(ce);
    }, ke = (ce) => ve(ce, "focusin focusout focus blur", wo, {
      I: !0,
      H: !1
    }), Ee = "tabindex", he = ns(j, Ee), we = ke(Ce);
    return Xe(D, rt, x ? "" : Xr), Xe(W, jn, ""), Xe(j, Ze, ""), Xe(Y, Ms, ""), x || (Xe(j, Ee, he || "-1"), h && Xe(E, Ts, "")), Ve(be, ie), Ve(D, W), Ve(W || D, !x && j), Ve(j, Y), me(te, [we, () => {
      const ce = In(), _e = ne(j), Se = _e && ce === j ? q : ce, Te = ke(Se);
      Ue(W, jn), Ue(Y, Ms), Ue(j, Ze), h && Ue(E, Ts), he ? Xe(j, Ee, he) : Ue(j, Ee), ne(Y) && Ae(Y), _e && Ae(j), ne(W) && Ae(W), zn(Se), Te();
    }]), o && !x && (ss(j, Ze, xo), me(te, J(Ue, j, Ze))), zn(!x && h && Ce === q && Z.top === Z ? j : Ce), we(), ie = 0, fe;
  }, fe];
}, Ll = ({ bt: t }) => ({ Zt: e, _n: n, Dt: o }) => {
  const { xt: s } = e || {}, { $t: c } = n;
  t && (s || o) && Vt(t, {
    [mn]: c && "100%"
  });
}, Fl = ({ ht: t, ln: e, ot: n, nt: o }, s) => {
  const [c, a] = Oe({
    i: Ur,
    o: ys()
  }, J(ys, t, "padding", ""));
  return ({ It: d, Zt: i, _n: u, Dt: _ }) => {
    let [v, m] = a(_);
    const { R: p } = We(), { ft: g, Ht: h, Ct: y } = i || {}, { ct: E } = u, [H, k] = d("paddingAbsolute");
    (g || m || (_ || h)) && ([v, m] = c(_));
    const O = !o && (k || y || m);
    if (O) {
      const L = !H || !e && !p, G = v.r + v.l, V = v.t + v.b, $ = {
        [eo]: L && !E ? -G : 0,
        [to]: L ? -V : 0,
        [Qs]: L && E ? -G : 0,
        top: L ? -v.t : 0,
        right: L ? E ? -v.r : "auto" : 0,
        left: L ? E ? "auto" : -v.l : 0,
        [_n]: L && `calc(100% + ${G}px)`
      }, x = {
        [Ys]: L ? v.t : 0,
        [Js]: L ? v.r : 0,
        [Zs]: L ? v.b : 0,
        [Xs]: L ? v.l : 0
      };
      Vt(e || n, $), Vt(n, x), oe(s, {
        ln: v,
        dn: !L,
        rt: e ? x : oe({}, $, x)
      });
    }
    return {
      fn: O
    };
  };
}, Rl = (t, e) => {
  const n = We(), { ht: o, ln: s, ot: c, nt: a, Qt: d, gt: i, wt: u, St: _, un: v } = t, { R: m } = n, p = u && a, g = J(Gs, 0), h = {
    display: () => !1,
    direction: (B) => B !== "ltr",
    flexDirection: (B) => B.endsWith("-reverse"),
    writingMode: (B) => B !== "horizontal-tb"
  }, y = Ie(h), E = {
    i: oo,
    o: {
      w: 0,
      h: 0
    }
  }, H = {
    i: Jt,
    o: {}
  }, k = (B) => {
    _(So, !p && B);
  }, S = (B) => {
    if (!y.some((be) => {
      const fe = B[be];
      return fe && h[be](fe);
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
    k(!0);
    const q = Le(i), D = _(nl, !0), W = ve(d, bt, (be) => {
      const fe = Le(i);
      be.isTrusted && fe.x === q.x && fe.y === q.y && bo(be);
    }, {
      I: !0,
      A: !0
    });
    ze(i, {
      x: 0,
      y: 0
    }), D();
    const j = Le(i), Y = an(i);
    ze(i, {
      x: Y.w,
      y: Y.h
    });
    const te = Le(i);
    ze(i, {
      x: te.x - j.x < 1 && -Y.w,
      y: te.y - j.y < 1 && -Y.h
    });
    const ie = Le(i);
    return ze(i, q), Jn(() => W()), {
      D: j,
      M: ie
    };
  }, O = (B, N) => {
    const q = De.devicePixelRatio % 1 !== 0 ? 1 : 0, D = {
      w: g(B.w - N.w),
      h: g(B.h - N.h)
    };
    return {
      w: D.w > q ? D.w : 0,
      h: D.h > q ? D.h : 0
    };
  }, [L, G] = Oe(E, J(ls, c)), [V, $] = Oe(E, J(an, c)), [x, A] = Oe(E), [T] = Oe(H), [R, C] = Oe(E), [U] = Oe(H), [P] = Oe({
    i: (B, N) => pn(B, N, y),
    o: {}
  }, () => Kr(c) ? Qe(c, y) : {}), [ee, se] = Oe({
    i: (B, N) => Jt(B.D, N.D) && Jt(B.M, N.M),
    o: yo()
  }), ne = Rt(Vo), pe = (B, N) => `${N ? Zr : Qr}${Nr(B)}`, F = (B) => {
    const N = (D) => [st, ct, bt].map((W) => pe(W, D)), q = N(!0).concat(N()).join(" ");
    _(q), _(Ie(B).map((D) => pe(B[D], D === "x")).join(" "), !0);
  };
  return ({ It: B, Zt: N, _n: q, Dt: D }, { fn: W }) => {
    const { ft: j, Ht: Y, Ct: te, dt: ie, zt: be } = N || {}, fe = ne && ne.tt(t, e, q, n, B), { it: $e, ut: Z, _t: Ce } = fe || {}, [Ae, ke] = $l(B, n), [Ee, he] = B("overflow"), we = yt(Ee.x), ce = yt(Ee.y), _e = !0;
    let Se = G(D), Te = $(D), $t = A(D), Bt = C(D);
    ke && m && _(xo, !Ae);
    {
      os(o, rt, Zt) && k(!0);
      const [_s] = Z ? Z() : [], [Ut] = Se = L(D), [Pt] = Te = V(D), zt = ho(c), qt = p && Wr(v()), ar = {
        w: g(Pt.w + Ut.w),
        h: g(Pt.h + Ut.h)
      }, ms = {
        w: g((qt ? qt.w : zt.w + g(zt.w - Pt.w)) + Ut.w),
        h: g((qt ? qt.h : zt.h + g(zt.h - Pt.h)) + Ut.h)
      };
      _s && _s(), Bt = R(ms), $t = x(O(ar, ms), D);
    }
    const [Ht, It] = Bt, [at, ft] = $t, [wn, yn] = Te, [kn, Sn] = Se, [Ne, xn] = T({
      x: at.w > 0,
      y: at.h > 0
    }), Ct = we && ce && (Ne.x || Ne.y) || we && Ne.x && !Ne.y || ce && Ne.y && !Ne.x, Et = W || te || be || Sn || yn || It || ft || he || ke || _e, tt = Cl(Ne, Ee), [Nt, At] = U(tt.K), [sr, or] = P(D), fs = te || ie || or || xn || D, [rr, lr] = fs ? ee(S(sr), D) : se();
    return Et && (At && F(tt.K), Ce && $e && Vt(c, Ce(tt, q, $e(tt, wn, kn)))), k(!1), ln(o, rt, Zt, Ct), ln(s, jn, Zt, Ct), oe(e, {
      K: Nt,
      Vt: {
        x: Ht.w,
        y: Ht.h
      },
      Rt: {
        x: at.w,
        y: at.h
      },
      rn: Ne,
      Lt: Yr(rr, at)
    }), {
      en: At,
      nn: It,
      sn: ft,
      cn: lr || ft,
      vn: fs
    };
  };
}, Bl = (t) => {
  const [e, n, o] = Vl(t), s = {
    ln: {
      t: 0,
      r: 0,
      b: 0,
      l: 0
    },
    dn: !1,
    rt: {
      [eo]: 0,
      [to]: 0,
      [Qs]: 0,
      [Ys]: 0,
      [Js]: 0,
      [Zs]: 0,
      [Xs]: 0
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
    Lt: yo()
  }, { vt: c, gt: a, nt: d, Ot: i } = e, { R: u, k: _ } = We(), v = !u && (_.x || _.y), m = [Ll(e), Fl(e, s), Rl(e, s)];
  return [n, (p) => {
    const g = {}, y = v && Le(a), E = y && i();
    return ae(m, (H) => {
      oe(g, H(p, g) || {});
    }), ze(a, y), E && E(), !d && ze(c, 0), g;
  }, s, e, o];
}, Hl = (t, e, n, o, s) => {
  let c = !1;
  const a = As(e, {}), [d, i, u, _, v] = Bl(t), [m, p, g] = Tl(_, u, a, (S) => {
    k({}, S);
  }), [h, y, , E] = Ol(t, e, g, u, _, s), H = (S) => Ie(S).some((O) => !!S[O]), k = (S, O) => {
    if (n())
      return !1;
    const { pn: L, Dt: G, At: V, hn: $ } = S, x = L || {}, A = !!G || !c, T = {
      It: As(e, x, A),
      pn: x,
      Dt: A
    };
    if ($)
      return y(T), !1;
    const R = O || p(oe({}, T, {
      At: V
    })), C = i(oe({}, T, {
      _n: g,
      Zt: R
    }));
    y(oe({}, T, {
      Zt: R,
      tn: C
    }));
    const U = H(R), P = H(C), ee = U || P || !ts(x) || A;
    return c = !0, ee && o(S, {
      Zt: R,
      tn: C
    }), ee;
  };
  return [() => {
    const { an: S, gt: O, Ot: L } = _, G = Le(S), V = [m(), d(), h()], $ = L();
    return ze(O, G), $(), J(Re, V);
  }, k, () => ({
    gn: g,
    bn: u
  }), {
    wn: _,
    yn: E
  }, v];
}, Ge = (t, e, n) => {
  const { N: o } = We(), s = rn(t), c = s ? t : t.target, a = To(c);
  if (e && !a) {
    let d = !1;
    const i = [], u = {}, _ = (x) => {
      const A = lo(x), T = Rt(Sl);
      return T ? T(A, !0) : A;
    }, v = oe({}, o(), _(e)), [m, p, g] = qn(), [h, y, E] = qn(n), H = (x, A) => {
      E(x, A), g(x, A);
    }, [k, S, O, L, G] = Hl(t, v, () => d, ({ pn: x, Dt: A }, { Zt: T, tn: R }) => {
      const { ft: C, Ct: U, xt: P, Ht: ee, Et: se, dt: ne } = T, { nn: pe, sn: F, en: B, cn: N } = R;
      H("updated", [$, {
        updateHints: {
          sizeChanged: !!C,
          directionChanged: !!U,
          heightIntrinsicChanged: !!P,
          overflowEdgeChanged: !!pe,
          overflowAmountChanged: !!F,
          overflowStyleChanged: !!B,
          scrollCoordinatesChanged: !!N,
          contentMutation: !!ee,
          hostMutation: !!se,
          appear: !!ne
        },
        changedOptions: x || {},
        force: !!A
      }]);
    }, (x) => H("scroll", [$, x])), V = (x) => {
      wl(c), Re(i), d = !0, H("destroyed", [$, x]), p(), y();
    }, $ = {
      options(x, A) {
        if (x) {
          const T = A ? o() : {}, R = ko(v, oe(T, _(x)));
          ts(R) || (oe(v, R), S({
            pn: R
          }));
        }
        return oe({}, v);
      },
      on: h,
      off: (x, A) => {
        x && A && y(x, A);
      },
      state() {
        const { gn: x, bn: A } = O(), { ct: T } = x, { Vt: R, Rt: C, K: U, rn: P, ln: ee, dn: se, Lt: ne } = A;
        return oe({}, {
          overflowEdge: R,
          overflowAmount: C,
          overflowStyle: U,
          hasOverflow: P,
          scrollCoordinates: {
            start: ne.D,
            end: ne.M
          },
          padding: ee,
          paddingAbsolute: se,
          directionRTL: T,
          destroyed: d
        });
      },
      elements() {
        const { vt: x, ht: A, ln: T, ot: R, bt: C, gt: U, Qt: P } = L.wn, { Xt: ee, Gt: se } = L.yn, ne = (F) => {
          const { Pt: B, Ut: N, Tt: q } = F;
          return {
            scrollbar: q,
            track: N,
            handle: B
          };
        }, pe = (F) => {
          const { Yt: B, Wt: N } = F, q = ne(B[0]);
          return oe({}, q, {
            clone: () => {
              const D = ne(N());
              return S({
                hn: !0
              }), D;
            }
          });
        };
        return oe({}, {
          target: x,
          host: A,
          padding: T || R,
          viewport: R,
          content: C || R,
          scrollOffsetElement: U,
          scrollEventElement: P,
          scrollbarHorizontal: pe(ee),
          scrollbarVertical: pe(se)
        });
      },
      update: (x) => S({
        Dt: x,
        At: !0
      }),
      destroy: J(V, !1),
      plugin: (x) => u[Ie(x)[0]]
    };
    return me(i, [G]), bl(c, $), Oo(Mo, Ge, [$, m, u]), gl(L.wn.wt, !s && t.cancel) ? (V(!0), $) : (me(i, k()), H("initialized", [$]), $.update(), $);
  }
  return a;
};
Ge.plugin = (t) => {
  const e = je(t), n = e ? t : [t], o = n.map((s) => Oo(s, Ge)[0]);
  return kl(n), e ? o : o[0];
};
Ge.valid = (t) => {
  const e = t && t.elements, n = He(e) && e();
  return on(n) && !!To(n.target);
};
Ge.env = () => {
  const { T: t, k: e, R: n, V: o, B: s, F: c, U: a, P: d, N: i, q: u } = We();
  return oe({}, {
    scrollbarsSize: t,
    scrollbarsOverlaid: e,
    scrollbarsHiding: n,
    scrollTimeline: o,
    staticDefaultInitialization: s,
    staticDefaultOptions: c,
    getDefaultInitialization: a,
    setDefaultInitialization: d,
    getDefaultOptions: i,
    setDefaultOptions: u
  });
};
Ge.nonce = ml;
function Il() {
  let t;
  const e = M(null), n = Math.floor(Math.random() * 2 ** 32), o = M(!1), s = M([]), c = () => s.value, a = () => t.getSelection(), d = () => s.value.length, i = () => t.clearSelection(!0), u = M(), _ = M(null), v = M(null), m = M(null), p = M(null);
  function g() {
    t = new kr({
      area: e.value,
      keyboardDrag: !1,
      selectedClass: "vf-explorer-selected",
      selectorClass: "vf-explorer-selector"
    }), t.subscribe(
      "DS:start:pre",
      ({ items: O, event: L, isDragging: G }) => {
        if (G)
          t.Interaction._reset(L);
        else {
          o.value = !1;
          const V = e.value.offsetWidth - L.offsetX, $ = e.value.offsetHeight - L.offsetY;
          V < 15 && $ < 15 && t.Interaction._reset(L), L.target.classList.contains("os-scrollbar-handle") && t.Interaction._reset(L);
        }
      }
    ), document.addEventListener("dragleave", (O) => {
      !O.buttons && o.value && (o.value = !1);
    });
  }
  const h = () => dt(() => {
    t.addSelection(t.getSelectables()), y();
  }), y = () => {
    s.value = t.getSelection().map((O) => JSON.parse(O.dataset.item)), u.value(s.value);
  }, E = () => dt(() => {
    const O = c().map((L) => L.path);
    i(), t.setSettings({
      selectables: document.getElementsByClassName("vf-item-" + n)
    }), t.addSelection(
      t.getSelectables().filter(
        (L) => O.includes(JSON.parse(L.dataset.item).path)
      )
    ), y(), k();
  }), H = (O) => {
    u.value = O, t.subscribe("DS:end", ({ items: L, event: G, isDragging: V }) => {
      s.value = L.map(($) => JSON.parse($.dataset.item)), O(
        L.map(($) => JSON.parse($.dataset.item)),
        ($) => {
          typeof $ < "u" && (L.forEach((x) => {
            const A = JSON.parse(x.dataset.item), T = $.find((R) => R.path === A.path);
            typeof T < "u" && (Object.keys(A).forEach((R) => {
              A[R] = T[R];
            }), x.dataset.item = JSON.stringify(A));
          }), s.value = L.map((x) => JSON.parse(x.dataset.item)));
        }
      );
    });
  }, k = () => {
    _.value && (e.value.getBoundingClientRect().height < e.value.scrollHeight ? (v.value.style.height = e.value.scrollHeight + "px", v.value.style.display = "block") : (v.value.style.height = "100%", v.value.style.display = "none"));
  }, S = (O) => {
    if (!_.value)
      return;
    const { scrollOffsetElement: L } = _.value.elements();
    L.scrollTo({
      top: e.value.scrollTop,
      left: 0
    });
  };
  return xe(() => {
    Ge(
      m.value,
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
        initialized: (O) => {
          _.value = O;
        },
        scroll: (O, L) => {
          const { scrollOffsetElement: G } = O.elements();
          e.value.scrollTo({
            top: G.scrollTop,
            left: 0
          });
        }
      }
    ), g(), k(), p.value = new ResizeObserver(k), p.value.observe(e.value), e.value.addEventListener("scroll", S), t.subscribe(
      "DS:scroll",
      ({ isDragging: O }) => O || S()
    );
  }), Yn(() => {
    t && t.stop(), p.value && p.value.disconnect();
  }), Us(() => {
    t && t.Area.reset();
  }), {
    area: e,
    explorerId: n,
    isDraggingRef: o,
    scrollBar: v,
    scrollBarContainer: m,
    getSelected: c,
    getSelection: a,
    selectAll: h,
    clearSelection: i,
    refreshSelection: E,
    getCount: d,
    onSelect: H
  };
}
function Nl(t, e) {
  const n = M(t), o = M(e), s = M([]), c = M([]), a = M([]), d = M(!1), i = M(5);
  let u = !1, _ = !1;
  const v = Lt({
    adapter: n,
    storages: [],
    dirname: o,
    files: [],
    cache: {}
  });
  function m(k) {
    k.files = k.files.map((S) => {
      const O = S.path;
      return typeof v.cache[O] < "u" ? v.cache[O] : S;
    }), Object.assign(v, k);
  }
  function p() {
    let k = [], S = [], O = o.value ?? n.value + "://";
    O.length === 0 && (s.value = []), O.replace(n.value + "://", "").split("/").forEach(function(V) {
      k.push(V), k.join("/") !== "" && S.push({
        basename: V,
        name: V,
        path: n.value + "://" + k.join("/"),
        type: "dir"
      });
    }), c.value = S;
    const [L, G] = h(
      S,
      i.value
    );
    a.value = G, s.value = L;
  }
  function g(k) {
    i.value = k, p();
  }
  function h(k, S) {
    return k.length > S ? [k.slice(-S), k.slice(0, -S)] : [k, []];
  }
  function y(k = null) {
    d.value = k ?? !d.value;
  }
  function E() {
    return s.value && s.value.length && !_;
  }
  const H = Fe(() => {
    var k;
    return ((k = s.value[s.value.length - 2]) == null ? void 0 : k.path) ?? n.value + "://";
  });
  return xe(() => {
  }), Me(o, p), xe(p), {
    adapter: n,
    path: o,
    loading: u,
    searchMode: _,
    data: v,
    updateData: m,
    breadcrumbs: s,
    breadcrumbItems: c,
    limitBreadcrumbItems: g,
    hiddenBreadcrumbs: a,
    showHiddenBreadcrumbs: d,
    toggleHiddenBreadcrumbs: y,
    isGoUpAvailable: E,
    parentFolderPath: H
  };
}
function Ul(t) {
  return vr() ? (fr(t), !0) : !1;
}
function cn(t) {
  return typeof t == "function" ? t() : r(t);
}
const Pl = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const zl = (t) => t != null, Rs = () => {
};
function Fo(t, e) {
  function n(...o) {
    return new Promise((s, c) => {
      Promise.resolve(t(() => e.apply(this, o), { fn: e, thisArg: this, args: o })).then(s).catch(c);
    });
  }
  return n;
}
const Ro = (t) => t();
function ql(t, e = {}) {
  let n, o, s = Rs;
  const c = (d) => {
    clearTimeout(d), s(), s = Rs;
  };
  return (d) => {
    const i = cn(t), u = cn(e.maxWait);
    return n && c(n), i <= 0 || u !== void 0 && u <= 0 ? (o && (c(o), o = null), Promise.resolve(d())) : new Promise((_, v) => {
      s = e.rejectOnCancel ? v : _, u && !o && (o = setTimeout(() => {
        n && c(n), o = null, _(d());
      }, u)), n = setTimeout(() => {
        o && c(o), o = null, _(d());
      }, i);
    });
  };
}
function jl(t = Ro) {
  const e = M(!0);
  function n() {
    e.value = !1;
  }
  function o() {
    e.value = !0;
  }
  const s = (...c) => {
    e.value && t(...c);
  };
  return { isActive: ur(e), pause: n, resume: o, eventFilter: s };
}
function Gl(t, e = 200, n = {}) {
  return Fo(
    ql(e, n),
    t
  );
}
function Wl(t, e, n = {}) {
  const {
    eventFilter: o = Ro,
    ...s
  } = n;
  return Me(
    t,
    Fo(
      o,
      e
    ),
    s
  );
}
function Bs(t, e, n = {}) {
  const {
    eventFilter: o,
    ...s
  } = n, { eventFilter: c, pause: a, resume: d, isActive: i } = jl(o);
  return { stop: Wl(
    t,
    e,
    {
      ...s,
      eventFilter: c
    }
  ), pause: a, resume: d, isActive: i };
}
function Hs(t, e, ...[n]) {
  const {
    flush: o = "sync",
    deep: s = !1,
    immediate: c = !0,
    direction: a = "both",
    transform: d = {}
  } = n || {}, i = [], u = "ltr" in d && d.ltr || ((m) => m), _ = "rtl" in d && d.rtl || ((m) => m);
  return (a === "both" || a === "ltr") && i.push(Bs(
    t,
    (m) => {
      i.forEach((p) => p.pause()), e.value = u(m), i.forEach((p) => p.resume());
    },
    { flush: o, deep: s, immediate: c }
  )), (a === "both" || a === "rtl") && i.push(Bs(
    e,
    (m) => {
      i.forEach((p) => p.pause()), t.value = _(m), i.forEach((p) => p.resume());
    },
    { flush: o, deep: s, immediate: c }
  )), () => {
    i.forEach((m) => m.stop());
  };
}
function Kl(t) {
  var e;
  const n = cn(t);
  return (e = n == null ? void 0 : n.$el) != null ? e : n;
}
const Yl = Pl ? window : void 0;
function Jl() {
  const t = M(!1), e = _r();
  return e && xe(() => {
    t.value = !0;
  }, e), t;
}
function Xl(t) {
  const e = Jl();
  return Fe(() => (e.value, !!t()));
}
function Zl(t, e, n = {}) {
  const { window: o = Yl, ...s } = n;
  let c;
  const a = Xl(() => o && "MutationObserver" in o), d = () => {
    c && (c.disconnect(), c = void 0);
  }, i = Fe(() => {
    const m = cn(t), p = (Array.isArray(m) ? m : [m]).map(Kl).filter(zl);
    return new Set(p);
  }), u = Me(
    () => i.value,
    (m) => {
      d(), a.value && m.size && (c = new MutationObserver(e), m.forEach((p) => c.observe(p, s)));
    },
    { immediate: !0, flush: "post" }
  ), _ = () => c == null ? void 0 : c.takeRecords(), v = () => {
    u(), d();
  };
  return Ul(v), {
    isSupported: a,
    stop: v,
    takeRecords: _
  };
}
const Ql = (t, e, n) => {
  const o = Tr(t.id), s = yr(), c = o.getStore("metricUnits", !1), a = Fr(o, t.theme), d = n.i18n, i = t.locale ?? n.locale, u = o.getStore("adapter"), _ = (y) => Array.isArray(y) ? y : Or, v = o.getStore("persist-path", t.persist), m = v ? o.getStore("path", t.path) : t.path, p = Lt({
    /**
     * Core properties
     * */
    // app version
    version: Vr,
    // root element
    root: null,
    // app id
    debug: t.debug,
    // Event Bus
    emitter: s,
    // storage
    storage: o,
    // localization object
    i18n: Dr(o, i, s, d),
    // modal state
    modal: Rr(),
    // dragSelect object, it is responsible for selecting items
    dragSelect: Fe(() => Il()),
    // http object
    requester: Ar(t.request),
    // active features
    features: _(t.features),
    // view state
    view: o.getStore("viewport", e.view.value),
    // fullscreen state
    fullScreen: o.getStore("full-screen", t.fullScreen),
    // show tree view
    showTreeView: o.getStore("show-tree-view", t.showTreeView),
    // pinnedFolders
    pinnedFolders: o.getStore("pinned-folders", t.pinnedFolders),
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
    filesize: c ? js : qs,
    // show large icons in list view
    compactListView: o.getStore("compact-list-view", !0),
    // persist state
    persist: v,
    // show thumbnails
    showThumbnails: o.getStore("show-thumbnails", t.showThumbnails),
    // file system
    fs: Nl(u, m),
    // Sorting
    sortActive: !1,
    sortColumn: "",
    sortOrder: "",
    // Additional select buttons
    additionalButtons: t.additionalButtons
  }), g = Fe({
    get() {
      return p.view;
    },
    set(y) {
      p.view = y;
    }
  }), h = Fe({
    get() {
      return {
        active: p.sortActive,
        column: p.sortColumn,
        order: p.sortOrder
      };
    },
    set(y) {
      y && (p.sortActive = y.active, p.sortColumn = y.column, p.sortOrder = y.order);
    }
  });
  return Hs(e.view, g), Hs(e.sort, h), p;
}, ea = { class: "vuefinder__modal-layout__container" }, ta = { class: "vuefinder__modal-layout__content" }, na = { class: "vuefinder__modal-layout__footer" }, Ke = {
  __name: "ModalLayout",
  setup(t) {
    const e = M(null), n = re("ServiceContainer");
    return xe(() => {
      const o = document.querySelector(".v-f-modal input");
      o && o.focus(), dt(() => {
        if (document.querySelector(".v-f-modal input") && window.innerWidth < 768) {
          const s = e.value.getBoundingClientRect().bottom + 16;
          window.scrollTo({
            top: s,
            left: 0,
            behavior: "smooth"
          });
        }
      });
    }), (o, s) => (f(), b("div", {
      class: "vuefinder__modal-layout",
      "aria-labelledby": "modal-title",
      role: "dialog",
      "aria-modal": "true",
      onKeyup: s[1] || (s[1] = kt((c) => r(n).modal.close(), ["esc"])),
      tabindex: "0"
    }, [
      s[2] || (s[2] = l("div", { class: "vuefinder__modal-layout__overlay" }, null, -1)),
      l("div", ea, [
        l("div", {
          class: "vuefinder__modal-layout__wrapper",
          onMousedown: s[0] || (s[0] = ot((c) => r(n).modal.close(), ["self"]))
        }, [
          l("div", {
            ref_key: "modalBody",
            ref: e,
            class: "vuefinder__modal-layout__body"
          }, [
            l("div", ta, [
              Tt(o.$slots, "default")
            ]),
            l("div", na, [
              Tt(o.$slots, "buttons")
            ])
          ], 512)
        ], 32)
      ])
    ], 32));
  }
}, sa = (t, e) => {
  const n = t.__vccOpts || t;
  for (const [o, s] of e)
    n[o] = s;
  return n;
}, oa = {
  props: {
    on: { type: String, required: !0 }
  },
  setup(t, { emit: e, slots: n }) {
    const o = re("ServiceContainer"), s = M(!1), { t: c } = o.i18n;
    let a = null;
    const d = () => {
      clearTimeout(a), s.value = !0, a = setTimeout(() => {
        s.value = !1;
      }, 2e3);
    };
    return xe(() => {
      o.emitter.on(t.on, d);
    }), Yn(() => {
      clearTimeout(a);
    }), {
      shown: s,
      t: c
    };
  }
}, ra = { key: 1 };
function la(t, e, n, o, s, c) {
  return f(), b("div", {
    class: le(["vuefinder__action-message", { "vuefinder__action-message--hidden": !o.shown }])
  }, [
    t.$slots.default ? Tt(t.$slots, "default", { key: 0 }) : (f(), b("span", ra, w(o.t("Saved.")), 1))
  ], 2);
}
const _t = /* @__PURE__ */ sa(oa, [["render", la]]), aa = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
  viewBox: "0 0 24 24"
};
function ia(t, e) {
  return f(), b("svg", aa, e[0] || (e[0] = [
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
const ca = { render: ia }, da = { class: "vuefinder__modal-header" }, ua = { class: "vuefinder__modal-header__icon-container" }, va = {
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
    return (e, n) => (f(), b("div", da, [
      l("div", ua, [
        (f(), K(Ps(t.icon), { class: "vuefinder__modal-header__icon" }))
      ]),
      l("h3", va, w(t.title), 1)
    ]));
  }
}, fa = { class: "vuefinder__about-modal__content" }, _a = { class: "vuefinder__about-modal__main" }, ma = {
  class: "vuefinder__about-modal__tabs",
  "aria-label": "Tabs"
}, pa = ["onClick", "aria-current"], ha = {
  key: 0,
  class: "vuefinder__about-modal__tab-content"
}, ga = { class: "vuefinder__about-modal__description" }, ba = {
  href: "https://vuefinder.ozdemir.be",
  class: "vuefinder__about-modal__link",
  target: "_blank"
}, wa = {
  href: "https://github.com/n1crack/vuefinder",
  class: "vuefinder__about-modal__link",
  target: "_blank"
}, ya = {
  key: 1,
  class: "vuefinder__about-modal__tab-content"
}, ka = { class: "vuefinder__about-modal__description" }, Sa = { class: "vuefinder__about-modal__settings" }, xa = { class: "vuefinder__about-modal__setting flex" }, $a = { class: "vuefinder__about-modal__setting-input" }, Ca = { class: "vuefinder__about-modal__setting-label" }, Ea = {
  for: "metric_unit",
  class: "vuefinder__about-modal__label"
}, Aa = { class: "vuefinder__about-modal__setting flex" }, Ta = { class: "vuefinder__about-modal__setting-input" }, Ma = { class: "vuefinder__about-modal__setting-label" }, Da = {
  for: "large_icons",
  class: "vuefinder__about-modal__label"
}, Oa = { class: "vuefinder__about-modal__setting flex" }, Va = { class: "vuefinder__about-modal__setting-input" }, La = { class: "vuefinder__about-modal__setting-label" }, Fa = {
  for: "persist_path",
  class: "vuefinder__about-modal__label"
}, Ra = { class: "vuefinder__about-modal__setting flex" }, Ba = { class: "vuefinder__about-modal__setting-input" }, Ha = { class: "vuefinder__about-modal__setting-label" }, Ia = {
  for: "show_thumbnails",
  class: "vuefinder__about-modal__label"
}, Na = { class: "vuefinder__about-modal__setting" }, Ua = { class: "vuefinder__about-modal__setting-input" }, Pa = {
  for: "theme",
  class: "vuefinder__about-modal__label"
}, za = { class: "vuefinder__about-modal__setting-label" }, qa = ["label"], ja = ["value"], Ga = {
  key: 0,
  class: "vuefinder__about-modal__setting"
}, Wa = { class: "vuefinder__about-modal__setting-input" }, Ka = {
  for: "language",
  class: "vuefinder__about-modal__label"
}, Ya = { class: "vuefinder__about-modal__setting-label" }, Ja = ["label"], Xa = ["value"], Za = {
  key: 2,
  class: "vuefinder__about-modal__tab-content"
}, Qa = { class: "vuefinder__about-modal__shortcuts" }, ei = { class: "vuefinder__about-modal__shortcut" }, ti = { class: "vuefinder__about-modal__shortcut" }, ni = { class: "vuefinder__about-modal__shortcut" }, si = { class: "vuefinder__about-modal__shortcut" }, oi = { class: "vuefinder__about-modal__shortcut" }, ri = { class: "vuefinder__about-modal__shortcut" }, li = { class: "vuefinder__about-modal__shortcut" }, ai = { class: "vuefinder__about-modal__shortcut" }, ii = { class: "vuefinder__about-modal__shortcut" }, ci = {
  key: 3,
  class: "vuefinder__about-modal__tab-content"
}, di = { class: "vuefinder__about-modal__description" }, Bo = {
  __name: "ModalAbout",
  setup(t) {
    const e = re("ServiceContainer"), { setStore: n, clearStore: o } = e.storage, { t: s } = e.i18n, c = {
      ABOUT: "about",
      SETTINGS: "settings",
      SHORTCUTS: "shortcuts",
      RESET: "reset"
    }, a = Fe(() => [
      { name: s("About"), key: c.ABOUT },
      { name: s("Settings"), key: c.SETTINGS },
      { name: s("Shortcuts"), key: c.SHORTCUTS },
      { name: s("Reset"), key: c.RESET }
    ]), d = M("about"), i = async () => {
      o(), location.reload();
    }, u = (H) => {
      e.theme.set(H), e.emitter.emit("vf-theme-saved");
    }, _ = () => {
      e.metricUnits = !e.metricUnits, e.filesize = e.metricUnits ? js : qs, n("metricUnits", e.metricUnits), e.emitter.emit("vf-metric-units-saved");
    }, v = () => {
      e.compactListView = !e.compactListView, n("compactListView", e.compactListView), e.emitter.emit("vf-compact-view-saved");
    }, m = () => {
      e.showThumbnails = !e.showThumbnails, n("show-thumbnails", e.showThumbnails), e.emitter.emit("vf-show-thumbnails-saved");
    }, p = () => {
      e.persist = !e.persist, n("persist-path", e.persist), e.emitter.emit("vf-persist-path-saved");
    }, { i18n: g } = re("VueFinderOptions"), y = Object.fromEntries(
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
      }).filter(([H]) => Object.keys(g).includes(H))
    ), E = Fe(() => ({
      system: s("System"),
      light: s("Light"),
      dark: s("Dark")
    }));
    return (H, k) => (f(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          onClick: k[7] || (k[7] = (S) => r(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, w(r(s)("Close")), 1)
      ]),
      default: Q(() => [
        l("div", fa, [
          z(et, {
            icon: r(ca),
            title: "Vuefinder " + r(e).version
          }, null, 8, ["icon", "title"]),
          l("div", _a, [
            l("div", null, [
              l("div", null, [
                l("nav", ma, [
                  (f(!0), b(ge, null, ye(a.value, (S) => (f(), b("button", {
                    key: S.name,
                    onClick: (O) => d.value = S.key,
                    class: le([S.key === d.value ? "vuefinder__about-modal__tab--active" : "vuefinder__about-modal__tab--inactive", "vuefinder__about-modal__tab"]),
                    "aria-current": S.current ? "page" : void 0
                  }, w(S.name), 11, pa))), 128))
                ])
              ])
            ]),
            d.value === c.ABOUT ? (f(), b("div", ha, [
              l("div", ga, w(r(s)("Vuefinder is a simple, lightweight, and fast file manager library for Vue.js applications")), 1),
              l("a", ba, w(r(s)("Project home")), 1),
              l("a", wa, w(r(s)("Follow on GitHub")), 1)
            ])) : I("", !0),
            d.value === c.SETTINGS ? (f(), b("div", ya, [
              l("div", ka, w(r(s)("Customize your experience with the following settings")), 1),
              l("div", Sa, [
                l("fieldset", null, [
                  l("div", xa, [
                    l("div", $a, [
                      ue(l("input", {
                        id: "metric_unit",
                        name: "metric_unit",
                        type: "checkbox",
                        "onUpdate:modelValue": k[0] || (k[0] = (S) => r(e).metricUnits = S),
                        onClick: _,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [jt, r(e).metricUnits]
                      ])
                    ]),
                    l("div", Ca, [
                      l("label", Ea, [
                        X(w(r(s)("Use Metric Units")) + " ", 1),
                        z(_t, {
                          class: "ms-3",
                          on: "vf-metric-units-saved"
                        }, {
                          default: Q(() => [
                            X(w(r(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  l("div", Aa, [
                    l("div", Ta, [
                      ue(l("input", {
                        id: "large_icons",
                        name: "large_icons",
                        type: "checkbox",
                        "onUpdate:modelValue": k[1] || (k[1] = (S) => r(e).compactListView = S),
                        onClick: v,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [jt, r(e).compactListView]
                      ])
                    ]),
                    l("div", Ma, [
                      l("label", Da, [
                        X(w(r(s)("Compact list view")) + " ", 1),
                        z(_t, {
                          class: "ms-3",
                          on: "vf-compact-view-saved"
                        }, {
                          default: Q(() => [
                            X(w(r(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  l("div", Oa, [
                    l("div", Va, [
                      ue(l("input", {
                        id: "persist_path",
                        name: "persist_path",
                        type: "checkbox",
                        "onUpdate:modelValue": k[2] || (k[2] = (S) => r(e).persist = S),
                        onClick: p,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [jt, r(e).persist]
                      ])
                    ]),
                    l("div", La, [
                      l("label", Fa, [
                        X(w(r(s)("Persist path on reload")) + " ", 1),
                        z(_t, {
                          class: "ms-3",
                          on: "vf-persist-path-saved"
                        }, {
                          default: Q(() => [
                            X(w(r(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  l("div", Ra, [
                    l("div", Ba, [
                      ue(l("input", {
                        id: "show_thumbnails",
                        name: "show_thumbnails",
                        type: "checkbox",
                        "onUpdate:modelValue": k[3] || (k[3] = (S) => r(e).showThumbnails = S),
                        onClick: m,
                        class: "vuefinder__about-modal__checkbox"
                      }, null, 512), [
                        [jt, r(e).showThumbnails]
                      ])
                    ]),
                    l("div", Ha, [
                      l("label", Ia, [
                        X(w(r(s)("Show thumbnails")) + " ", 1),
                        z(_t, {
                          class: "ms-3",
                          on: "vf-show-thumbnails-saved"
                        }, {
                          default: Q(() => [
                            X(w(r(s)("Saved.")), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ]),
                  l("div", Na, [
                    l("div", Ua, [
                      l("label", Pa, w(r(s)("Theme")), 1)
                    ]),
                    l("div", za, [
                      ue(l("select", {
                        id: "theme",
                        "onUpdate:modelValue": k[4] || (k[4] = (S) => r(e).theme.value = S),
                        onChange: k[5] || (k[5] = (S) => u(S.target.value)),
                        class: "vuefinder__about-modal__select"
                      }, [
                        l("optgroup", {
                          label: r(s)("Theme")
                        }, [
                          (f(!0), b(ge, null, ye(E.value, (S, O) => (f(), b("option", { value: O }, w(S), 9, ja))), 256))
                        ], 8, qa)
                      ], 544), [
                        [Dn, r(e).theme.value]
                      ]),
                      z(_t, {
                        class: "ms-3",
                        on: "vf-theme-saved"
                      }, {
                        default: Q(() => [
                          X(w(r(s)("Saved.")), 1)
                        ]),
                        _: 1
                      })
                    ])
                  ]),
                  r(e).features.includes(r(de).LANGUAGE) && Object.keys(r(y)).length > 1 ? (f(), b("div", Ga, [
                    l("div", Wa, [
                      l("label", Ka, w(r(s)("Language")), 1)
                    ]),
                    l("div", Ya, [
                      ue(l("select", {
                        id: "language",
                        "onUpdate:modelValue": k[6] || (k[6] = (S) => r(e).i18n.locale = S),
                        class: "vuefinder__about-modal__select"
                      }, [
                        l("optgroup", {
                          label: r(s)("Language")
                        }, [
                          (f(!0), b(ge, null, ye(r(y), (S, O) => (f(), b("option", { value: O }, w(S), 9, Xa))), 256))
                        ], 8, Ja)
                      ], 512), [
                        [Dn, r(e).i18n.locale]
                      ]),
                      z(_t, {
                        class: "ms-3",
                        on: "vf-language-saved"
                      }, {
                        default: Q(() => [
                          X(w(r(s)("Saved.")), 1)
                        ]),
                        _: 1
                      })
                    ])
                  ])) : I("", !0)
                ])
              ])
            ])) : I("", !0),
            d.value === c.SHORTCUTS ? (f(), b("div", Za, [
              l("div", Qa, [
                l("div", ei, [
                  l("div", null, w(r(s)("Rename")), 1),
                  k[8] || (k[8] = l("kbd", null, "F2", -1))
                ]),
                l("div", ti, [
                  l("div", null, w(r(s)("Refresh")), 1),
                  k[9] || (k[9] = l("kbd", null, "F5", -1))
                ]),
                l("div", ni, [
                  X(w(r(s)("Delete")) + " ", 1),
                  k[10] || (k[10] = l("kbd", null, "Del", -1))
                ]),
                l("div", si, [
                  X(w(r(s)("Escape")) + " ", 1),
                  k[11] || (k[11] = l("div", null, [
                    l("kbd", null, "Esc")
                  ], -1))
                ]),
                l("div", oi, [
                  X(w(r(s)("Select All")) + " ", 1),
                  k[12] || (k[12] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    X(" + "),
                    l("kbd", null, "A")
                  ], -1))
                ]),
                l("div", ri, [
                  X(w(r(s)("Search")) + " ", 1),
                  k[13] || (k[13] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    X(" + "),
                    l("kbd", null, "F")
                  ], -1))
                ]),
                l("div", li, [
                  X(w(r(s)("Toggle Sidebar")) + " ", 1),
                  k[14] || (k[14] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    X(" + "),
                    l("kbd", null, "E")
                  ], -1))
                ]),
                l("div", ai, [
                  X(w(r(s)("Open Settings")) + " ", 1),
                  k[15] || (k[15] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    X(" + "),
                    l("kbd", null, ",")
                  ], -1))
                ]),
                l("div", ii, [
                  X(w(r(s)("Toggle Full Screen")) + " ", 1),
                  k[16] || (k[16] = l("div", null, [
                    l("kbd", null, "Ctrl"),
                    X(" + "),
                    l("kbd", null, "Enter")
                  ], -1))
                ])
              ])
            ])) : I("", !0),
            d.value === c.RESET ? (f(), b("div", ci, [
              l("div", di, w(r(s)("Reset all settings to default")), 1),
              l("button", {
                onClick: i,
                type: "button",
                class: "vf-btn vf-btn-secondary"
              }, w(r(s)("Reset Settings")), 1)
            ])) : I("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}, ui = ["title"], Ye = {
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
    const n = e, o = re("ServiceContainer"), { t: s } = o.i18n, c = M(!1), a = M(null), d = M((u = a.value) == null ? void 0 : u.strMessage);
    Me(d, () => c.value = !1);
    const i = () => {
      n("hidden"), c.value = !0;
    };
    return (_, v) => (f(), b("div", null, [
      c.value ? I("", !0) : (f(), b("div", {
        key: 0,
        ref_key: "strMessage",
        ref: a,
        class: le(["vuefinder__message", t.error ? "vuefinder__message--error" : "vuefinder__message--success"])
      }, [
        Tt(_.$slots, "default"),
        l("div", {
          class: "vuefinder__message__close",
          onClick: i,
          title: r(s)("Close")
        }, v[0] || (v[0] = [
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
        ]), 8, ui)
      ], 2))
    ]));
  }
}, vi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function fi(t, e) {
  return f(), b("svg", vi, e[0] || (e[0] = [
    l("path", { d: "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21q.512.078 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48 48 0 0 0-3.478-.397m-12 .562q.51-.089 1.022-.165m0 0a48 48 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a52 52 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a49 49 0 0 0-7.5 0" }, null, -1)
  ]));
}
const Ho = { render: fi }, _i = { class: "vuefinder__delete-modal__content" }, mi = { class: "vuefinder__delete-modal__form" }, pi = { class: "vuefinder__delete-modal__description" }, hi = { class: "vuefinder__delete-modal__files vf-scrollbar" }, gi = { class: "vuefinder__delete-modal__file" }, bi = {
  key: 0,
  class: "vuefinder__delete-modal__icon vuefinder__delete-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, wi = {
  key: 1,
  class: "vuefinder__delete-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, yi = { class: "vuefinder__delete-modal__file-name" }, ki = { class: "vuefinder__delete-modal__warning" }, ds = {
  __name: "ModalDelete",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, o = M(e.modal.data.items), s = M(""), c = () => {
      o.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "delete",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          items: o.value.map(({ path: a, type: d }) => ({ path: a, type: d }))
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("Files deleted.") });
        },
        onError: (a) => {
          s.value = n(a.message);
        }
      });
    };
    return (a, d) => (f(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-danger"
        }, w(r(n)("Yes, Delete!")), 1),
        l("button", {
          type: "button",
          onClick: d[1] || (d[1] = (i) => r(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, w(r(n)("Cancel")), 1),
        l("div", ki, w(r(n)("This action cannot be undone.")), 1)
      ]),
      default: Q(() => [
        l("div", null, [
          z(et, {
            icon: r(Ho),
            title: r(n)("Delete files")
          }, null, 8, ["icon", "title"]),
          l("div", _i, [
            l("div", mi, [
              l("p", pi, w(r(n)("Are you sure you want to delete these files?")), 1),
              l("div", hi, [
                (f(!0), b(ge, null, ye(o.value, (i) => (f(), b("p", gi, [
                  i.type === "dir" ? (f(), b("svg", bi, d[2] || (d[2] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (f(), b("svg", wi, d[3] || (d[3] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ]))),
                  l("span", yi, w(i.basename), 1)
                ]))), 256))
              ]),
              s.value.length ? (f(), K(Ye, {
                key: 0,
                onHidden: d[0] || (d[0] = (i) => s.value = ""),
                error: ""
              }, {
                default: Q(() => [
                  X(w(s.value), 1)
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
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function xi(t, e) {
  return f(), b("svg", Si, e[0] || (e[0] = [
    l("path", { d: "m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" }, null, -1)
  ]));
}
const Io = { render: xi }, $i = { class: "vuefinder__rename-modal__content" }, Ci = { class: "vuefinder__rename-modal__item" }, Ei = { class: "vuefinder__rename-modal__item-info" }, Ai = {
  key: 0,
  class: "vuefinder__rename-modal__icon vuefinder__rename-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Ti = {
  key: 1,
  class: "vuefinder__rename-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, Mi = { class: "vuefinder__rename-modal__item-name" }, us = {
  __name: "ModalRename",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, o = M(e.modal.data.items[0]), s = M(e.modal.data.items[0].basename), c = M(""), a = () => {
      s.value != "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "rename",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          item: o.value.path,
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
    return (d, i) => (f(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          onClick: a,
          class: "vf-btn vf-btn-primary"
        }, w(r(n)("Rename")), 1),
        l("button", {
          type: "button",
          onClick: i[2] || (i[2] = (u) => r(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, w(r(n)("Cancel")), 1)
      ]),
      default: Q(() => [
        l("div", null, [
          z(et, {
            icon: r(Io),
            title: r(n)("Rename")
          }, null, 8, ["icon", "title"]),
          l("div", $i, [
            l("div", Ci, [
              l("p", Ei, [
                o.value.type === "dir" ? (f(), b("svg", Ai, i[3] || (i[3] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  }, null, -1)
                ]))) : (f(), b("svg", Ti, i[4] || (i[4] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  }, null, -1)
                ]))),
                l("span", Mi, w(o.value.basename), 1)
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
              c.value.length ? (f(), K(Ye, {
                key: 0,
                onHidden: i[1] || (i[1] = (u) => c.value = ""),
                error: ""
              }, {
                default: Q(() => [
                  X(w(c.value), 1)
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
}, Je = {
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
function Di(t) {
  const e = (n) => {
    n.code === Je.ESCAPE && (t.modal.close(), t.root.focus()), !t.modal.visible && (t.fs.searchMode || (n.code === Je.F2 && t.features.includes(de.RENAME) && (t.dragSelect.getCount() !== 1 || t.modal.open(us, { items: t.dragSelect.getSelected() })), n.code === Je.F5 && t.emitter.emit("vf-fetch", { params: { q: "index", adapter: t.fs.adapter, path: t.fs.data.dirname } }), n.code === Je.DELETE && (!t.dragSelect.getCount() || t.modal.open(ds, { items: t.dragSelect.getSelected() })), n.metaKey && n.code === Je.BACKSLASH && t.modal.open(Bo), n.metaKey && n.code === Je.KEY_F && t.features.includes(de.SEARCH) && (t.fs.searchMode = !0, n.preventDefault()), n.metaKey && n.code === Je.KEY_E && (t.showTreeView = !t.showTreeView, t.storage.setStore("show-tree-view", t.showTreeView)), n.metaKey && n.code === Je.ENTER && (t.fullScreen = !t.fullScreen, t.root.focus()), n.metaKey && n.code === Je.KEY_A && (t.dragSelect.selectAll(), n.preventDefault())));
  };
  xe(() => {
    t.root.addEventListener("keydown", e);
  });
}
const Oi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function Vi(t, e) {
  return f(), b("svg", Oi, e[0] || (e[0] = [
    l("path", { d: "M12 10.5v6m3-3H9m4.06-7.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44z" }, null, -1)
  ]));
}
const No = { render: Vi }, Li = { class: "vuefinder__new-folder-modal__content" }, Fi = { class: "vuefinder__new-folder-modal__form" }, Ri = { class: "vuefinder__new-folder-modal__description" }, Bi = ["placeholder"], Uo = {
  __name: "ModalNewFolder",
  setup(t) {
    const e = re("ServiceContainer");
    e.storage;
    const { t: n } = e.i18n, o = M(""), s = M(""), c = () => {
      o.value !== "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfolder",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          name: o.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("%s is created.", o.value) });
        },
        onError: (a) => {
          s.value = n(a.message);
        }
      });
    };
    return (a, d) => (f(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, w(r(n)("Create")), 1),
        l("button", {
          type: "button",
          onClick: d[2] || (d[2] = (i) => r(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, w(r(n)("Cancel")), 1)
      ]),
      default: Q(() => [
        l("div", null, [
          z(et, {
            icon: r(No),
            title: r(n)("New Folder")
          }, null, 8, ["icon", "title"]),
          l("div", Li, [
            l("div", Fi, [
              l("p", Ri, w(r(n)("Create a new folder")), 1),
              ue(l("input", {
                "onUpdate:modelValue": d[0] || (d[0] = (i) => o.value = i),
                onKeyup: kt(c, ["enter"]),
                class: "vuefinder__new-folder-modal__input",
                placeholder: r(n)("Folder Name"),
                type: "text"
              }, null, 40, Bi), [
                [St, o.value]
              ]),
              s.value.length ? (f(), K(Ye, {
                key: 0,
                onHidden: d[1] || (d[1] = (i) => s.value = ""),
                error: ""
              }, {
                default: Q(() => [
                  X(w(s.value), 1)
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
}, Hi = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function Ii(t, e) {
  return f(), b("svg", Hi, e[0] || (e[0] = [
    l("path", { d: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9" }, null, -1)
  ]));
}
const Po = { render: Ii }, Ni = { class: "vuefinder__new-file-modal__content" }, Ui = { class: "vuefinder__new-file-modal__form" }, Pi = { class: "vuefinder__new-file-modal__description" }, zi = ["placeholder"], qi = {
  __name: "ModalNewFile",
  setup(t) {
    const e = re("ServiceContainer");
    e.storage;
    const { t: n } = e.i18n, o = M(""), s = M(""), c = () => {
      o.value !== "" && e.emitter.emit("vf-fetch", {
        params: {
          q: "newfile",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          name: o.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("%s is created.", o.value) });
        },
        onError: (a) => {
          s.value = n(a.message);
        }
      });
    };
    return (a, d) => (f(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, w(r(n)("Create")), 1),
        l("button", {
          type: "button",
          onClick: d[2] || (d[2] = (i) => r(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, w(r(n)("Cancel")), 1)
      ]),
      default: Q(() => [
        l("div", null, [
          z(et, {
            icon: r(Po),
            title: r(n)("New File")
          }, null, 8, ["icon", "title"]),
          l("div", Ni, [
            l("div", Ui, [
              l("p", Pi, w(r(n)("Create a new file")), 1),
              ue(l("input", {
                "onUpdate:modelValue": d[0] || (d[0] = (i) => o.value = i),
                onKeyup: kt(c, ["enter"]),
                class: "vuefinder__new-file-modal__input",
                placeholder: r(n)("File Name"),
                type: "text"
              }, null, 40, zi), [
                [St, o.value]
              ]),
              s.value.length ? (f(), K(Ye, {
                key: 0,
                onHidden: d[1] || (d[1] = (i) => s.value = ""),
                error: ""
              }, {
                default: Q(() => [
                  X(w(s.value), 1)
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
function Wn(t, e = 14) {
  let n = `((?=([\\w\\W]{0,${e}}))([\\w\\W]{${e + 1},})([\\w\\W]{8,}))`;
  return t.replace(new RegExp(n), "$2..$4");
}
const ji = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function Gi(t, e) {
  return f(), b("svg", ji, e[0] || (e[0] = [
    l("path", { d: "M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" }, null, -1)
  ]));
}
const zo = { render: Gi }, Wi = { class: "vuefinder__upload-modal__content" }, Ki = {
  key: 0,
  class: "pointer-events-none"
}, Yi = {
  key: 1,
  class: "pointer-events-none"
}, Ji = ["disabled"], Xi = ["disabled"], Zi = { class: "vuefinder__upload-modal__file-list vf-scrollbar" }, Qi = ["textContent"], ec = { class: "vuefinder__upload-modal__file-info" }, tc = { class: "vuefinder__upload-modal__file-name hidden md:block" }, nc = { class: "vuefinder__upload-modal__file-name md:hidden" }, sc = {
  key: 0,
  class: "ml-auto"
}, oc = ["title", "disabled", "onClick"], rc = {
  key: 0,
  class: "py-2"
}, lc = ["disabled"], ac = {
  __name: "ModalUpload",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, o = n("uppy"), s = {
      PENDING: 0,
      CANCELED: 1,
      UPLOADING: 2,
      ERROR: 3,
      DONE: 10
    }, c = M({ QUEUE_ENTRY_STATUS: s }), a = M(null), d = M(null), i = M(null), u = M(null), _ = M(null), v = M(null), m = M([]), p = M(""), g = M(!1), h = M(!1);
    let y;
    function E(T) {
      return m.value.findIndex((R) => R.id === T);
    }
    function H(T, R = null) {
      R = R ?? (T.webkitRelativePath || T.name), y.addFile({
        name: R,
        type: T.type,
        data: T,
        source: "Local"
      });
    }
    function k(T) {
      switch (T.status) {
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
    const S = (T) => {
      switch (T.status) {
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
    function O() {
      u.value.click();
    }
    function L() {
      if (!g.value) {
        if (!m.value.filter((T) => T.status !== s.DONE).length) {
          p.value = n("Please select file to upload first.");
          return;
        }
        p.value = "", y.retryAll(), y.upload();
      }
    }
    function G() {
      y.cancelAll({ reason: "user" }), m.value.forEach((T) => {
        T.status !== s.DONE && (T.status = s.CANCELED, T.statusName = n("Canceled"));
      }), g.value = !1;
    }
    function V(T) {
      g.value || (y.removeFile(T.id, "removed-by-user"), m.value.splice(E(T.id), 1));
    }
    function $(T) {
      if (!g.value) {
        if (y.cancelAll({ reason: "user" }), T) {
          const R = [];
          m.value.forEach((C) => {
            C.status !== s.DONE && R.push(C);
          }), m.value = [], R.forEach((C) => {
            H(C.originalFile, C.name);
          });
          return;
        }
        m.value.splice(0);
      }
    }
    function x() {
      e.modal.close();
    }
    function A() {
      return e.requester.transformRequestParams({
        url: "",
        method: "post",
        params: { q: "upload", adapter: e.fs.adapter, path: e.fs.data.dirname }
      });
    }
    return xe(async () => {
      y = new Sr({
        debug: e.debug,
        restrictions: {
          maxFileSize: Lr(e.maxFileSize)
          //maxNumberOfFiles
          //allowedFileTypes
        },
        locale: o,
        onBeforeFileAdded(C, U) {
          if (U[C.id] != null) {
            const ee = E(C.id);
            m.value[ee].status === s.PENDING && (p.value = y.i18n("noDuplicates", { fileName: C.name })), m.value = m.value.filter((se) => se.id !== C.id);
          }
          return m.value.push({
            id: C.id,
            name: C.name,
            size: e.filesize(C.size),
            status: s.PENDING,
            statusName: n("Pending upload"),
            percent: null,
            originalFile: C.data
          }), !0;
        }
      }), y.use(xr, {
        endpoint: "WILL_BE_REPLACED_BEFORE_UPLOAD",
        limit: 5,
        timeout: 0,
        getResponseError(C, U) {
          let P;
          try {
            P = JSON.parse(C).message;
          } catch {
            P = n("Cannot parse server response.");
          }
          return new Error(P);
        }
      }), y.on("restriction-failed", (C, U) => {
        const P = m.value[E(C.id)];
        V(P), p.value = U.message;
      }), y.on("upload", () => {
        const C = A();
        y.setMeta({ ...C.body });
        const U = y.getPlugin("XHRUpload");
        U.opts.method = C.method, U.opts.endpoint = C.url + "?" + new URLSearchParams(C.params), U.opts.headers = C.headers, delete C.headers["Content-Type"], g.value = !0, m.value.forEach((P) => {
          P.status !== s.DONE && (P.percent = null, P.status = s.UPLOADING, P.statusName = n("Pending upload"));
        });
      }), y.on("upload-progress", (C, U) => {
        const P = Math.floor(U.bytesUploaded / U.bytesTotal * 100);
        m.value[E(C.id)].percent = `${P}%`;
      }), y.on("upload-success", (C) => {
        const U = m.value[E(C.id)];
        U.status = s.DONE, U.statusName = n("Done");
      }), y.on("upload-error", (C, U) => {
        const P = m.value[E(C.id)];
        P.percent = null, P.status = s.ERROR, U.isNetworkError ? P.statusName = n("Network Error, Unable establish connection to the server or interrupted.") : P.statusName = U ? U.message : n("Unknown Error");
      }), y.on("error", (C) => {
        p.value = C.message, g.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname },
          noCloseModal: !0
        });
      }), y.on("complete", () => {
        g.value = !1, e.emitter.emit("vf-fetch", {
          params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname },
          noCloseModal: !0
        });
      }), u.value.addEventListener("click", () => {
        d.value.click();
      }), _.value.addEventListener("click", () => {
        i.value.click();
      }), v.value.addEventListener("dragover", (C) => {
        C.preventDefault(), h.value = !0;
      }), v.value.addEventListener("dragleave", (C) => {
        C.preventDefault(), h.value = !1;
      });
      function T(C, U) {
        U.isFile && U.file((P) => C(U, P)), U.isDirectory && U.createReader().readEntries((P) => {
          P.forEach((ee) => {
            T(C, ee);
          });
        });
      }
      v.value.addEventListener("drop", (C) => {
        C.preventDefault(), h.value = !1;
        const U = /^[/\\](.+)/;
        [...C.dataTransfer.items].forEach((P) => {
          P.kind === "file" && T((ee, se) => {
            const ne = U.exec(ee.fullPath);
            H(se, ne[1]);
          }, P.webkitGetAsEntry());
        });
      });
      const R = ({ target: C }) => {
        const U = C.files;
        for (const P of U)
          H(P);
        C.value = "";
      };
      d.value.addEventListener("change", R), i.value.addEventListener("change", R);
    }), zs(() => {
      y == null || y.close({ reason: "unmount" });
    }), (T, R) => (f(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          class: "vf-btn vf-btn-primary",
          disabled: g.value,
          onClick: ot(L, ["prevent"])
        }, w(r(n)("Upload")), 9, lc),
        g.value ? (f(), b("button", {
          key: 0,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: ot(G, ["prevent"])
        }, w(r(n)("Cancel")), 1)) : (f(), b("button", {
          key: 1,
          type: "button",
          class: "vf-btn vf-btn-secondary",
          onClick: ot(x, ["prevent"])
        }, w(r(n)("Close")), 1))
      ]),
      default: Q(() => [
        l("div", null, [
          z(et, {
            icon: r(zo),
            title: r(n)("Upload Files")
          }, null, 8, ["icon", "title"]),
          l("div", Wi, [
            l("div", {
              class: "vuefinder__upload-modal__drop-area",
              ref_key: "dropArea",
              ref: v,
              onClick: O
            }, [
              h.value ? (f(), b("div", Ki, w(r(n)("Release to drop these files.")), 1)) : (f(), b("div", Yi, w(r(n)("Drag and drop the files/folders to here or click here.")), 1))
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
              }, w(r(n)("Select Files")), 513),
              l("button", {
                ref_key: "pickFolders",
                ref: _,
                type: "button",
                class: "vf-btn vf-btn-secondary"
              }, w(r(n)("Select Folders")), 513),
              l("button", {
                type: "button",
                class: "vf-btn vf-btn-secondary",
                disabled: g.value,
                onClick: R[0] || (R[0] = (C) => $(!1))
              }, w(r(n)("Clear all")), 9, Ji),
              l("button", {
                type: "button",
                class: "vf-btn vf-btn-secondary",
                disabled: g.value,
                onClick: R[1] || (R[1] = (C) => $(!0))
              }, w(r(n)("Clear only successful")), 9, Xi)
            ], 512),
            l("div", Zi, [
              (f(!0), b(ge, null, ye(m.value, (C) => (f(), b("div", {
                class: "vuefinder__upload-modal__file-entry",
                key: C.id
              }, [
                l("span", {
                  class: le(["vuefinder__upload-modal__file-icon", k(C)])
                }, [
                  l("span", {
                    class: "vuefinder__upload-modal__file-icon-text",
                    textContent: w(S(C))
                  }, null, 8, Qi)
                ], 2),
                l("div", ec, [
                  l("div", tc, w(r(Wn)(C.name, 40)) + " (" + w(C.size) + ")", 1),
                  l("div", nc, w(r(Wn)(C.name, 16)) + " (" + w(C.size) + ")", 1),
                  l("div", {
                    class: le(["vuefinder__upload-modal__file-status", k(C)])
                  }, [
                    X(w(C.statusName) + " ", 1),
                    C.status === c.value.QUEUE_ENTRY_STATUS.UPLOADING ? (f(), b("b", sc, w(C.percent), 1)) : I("", !0)
                  ], 2)
                ]),
                l("button", {
                  type: "button",
                  class: le(["vuefinder__upload-modal__file-remove", g.value ? "disabled" : ""]),
                  title: r(n)("Delete"),
                  disabled: g.value,
                  onClick: (U) => V(C)
                }, R[3] || (R[3] = [
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
                ]), 10, oc)
              ]))), 128)),
              m.value.length ? I("", !0) : (f(), b("div", rc, w(r(n)("No files selected!")), 1))
            ]),
            p.value.length ? (f(), K(Ye, {
              key: 0,
              onHidden: R[2] || (R[2] = (C) => p.value = ""),
              error: ""
            }, {
              default: Q(() => [
                X(w(p.value), 1)
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
}, ic = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function cc(t, e) {
  return f(), b("svg", ic, e[0] || (e[0] = [
    l("path", { d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125" }, null, -1)
  ]));
}
const qo = { render: cc }, dc = { class: "vuefinder__unarchive-modal__content" }, uc = { class: "vuefinder__unarchive-modal__items" }, vc = { class: "vuefinder__unarchive-modal__item" }, fc = {
  key: 0,
  class: "vuefinder__unarchive-modal__icon vuefinder__unarchive-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, _c = {
  key: 1,
  class: "vuefinder__unarchive-modal__icon vuefinder__unarchive-modal__icon--file",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, mc = { class: "vuefinder__unarchive-modal__item-name" }, pc = { class: "vuefinder__unarchive-modal__info" }, jo = {
  __name: "ModalUnarchive",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, o = M(e.modal.data.items[0]), s = M(""), c = M([]), a = () => {
      e.emitter.emit("vf-fetch", {
        params: {
          q: "unarchive",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          item: o.value.path
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("The file unarchived.") });
        },
        onError: (d) => {
          s.value = n(d.message);
        }
      });
    };
    return (d, i) => (f(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          onClick: a,
          class: "vf-btn vf-btn-primary"
        }, w(r(n)("Unarchive")), 1),
        l("button", {
          type: "button",
          onClick: i[1] || (i[1] = (u) => r(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, w(r(n)("Cancel")), 1)
      ]),
      default: Q(() => [
        l("div", null, [
          z(et, {
            icon: r(qo),
            title: r(n)("Unarchive")
          }, null, 8, ["icon", "title"]),
          l("div", dc, [
            l("div", uc, [
              (f(!0), b(ge, null, ye(c.value, (u) => (f(), b("p", vc, [
                u.type === "dir" ? (f(), b("svg", fc, i[2] || (i[2] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  }, null, -1)
                ]))) : (f(), b("svg", _c, i[3] || (i[3] = [
                  l("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  }, null, -1)
                ]))),
                l("span", mc, w(u.basename), 1)
              ]))), 256)),
              l("p", pc, w(r(n)("The archive will be unarchived at")) + " (" + w(r(e).fs.data.dirname) + ")", 1),
              s.value.length ? (f(), K(Ye, {
                key: 0,
                onHidden: i[0] || (i[0] = (u) => s.value = ""),
                error: ""
              }, {
                default: Q(() => [
                  X(w(s.value), 1)
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
}, hc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function gc(t, e) {
  return f(), b("svg", hc, e[0] || (e[0] = [
    l("path", { d: "m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125" }, null, -1)
  ]));
}
const Go = { render: gc }, bc = { class: "vuefinder__archive-modal__content" }, wc = { class: "vuefinder__archive-modal__form" }, yc = { class: "vuefinder__archive-modal__files vf-scrollbar" }, kc = { class: "vuefinder__archive-modal__file" }, Sc = {
  key: 0,
  class: "vuefinder__archive-modal__icon vuefinder__archive-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, xc = {
  key: 1,
  class: "vuefinder__archive-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, $c = { class: "vuefinder__archive-modal__file-name" }, Cc = ["placeholder"], Wo = {
  __name: "ModalArchive",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, o = M(""), s = M(""), c = M(e.modal.data.items), a = () => {
      c.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "archive",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          items: c.value.map(({ path: d, type: i }) => ({ path: d, type: i })),
          name: o.value
        },
        onSuccess: () => {
          e.emitter.emit("vf-toast-push", { label: n("The file(s) archived.") });
        },
        onError: (d) => {
          s.value = n(d.message);
        }
      });
    };
    return (d, i) => (f(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          onClick: a,
          class: "vf-btn vf-btn-primary"
        }, w(r(n)("Archive")), 1),
        l("button", {
          type: "button",
          onClick: i[2] || (i[2] = (u) => r(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, w(r(n)("Cancel")), 1)
      ]),
      default: Q(() => [
        l("div", null, [
          z(et, {
            icon: r(Go),
            title: r(n)("Archive the files")
          }, null, 8, ["icon", "title"]),
          l("div", bc, [
            l("div", wc, [
              l("div", yc, [
                (f(!0), b(ge, null, ye(c.value, (u) => (f(), b("p", kc, [
                  u.type === "dir" ? (f(), b("svg", Sc, i[3] || (i[3] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (f(), b("svg", xc, i[4] || (i[4] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ]))),
                  l("span", $c, w(u.basename), 1)
                ]))), 256))
              ]),
              ue(l("input", {
                "onUpdate:modelValue": i[0] || (i[0] = (u) => o.value = u),
                onKeyup: kt(a, ["enter"]),
                class: "vuefinder__archive-modal__input",
                placeholder: r(n)("Archive name. (.zip file will be created)"),
                type: "text"
              }, null, 40, Cc), [
                [St, o.value]
              ]),
              s.value.length ? (f(), K(Ye, {
                key: 0,
                onHidden: i[1] || (i[1] = (u) => s.value = ""),
                error: ""
              }, {
                default: Q(() => [
                  X(w(s.value), 1)
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
}, Ec = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  class: "animate-spin p-0.5 h-5 w-5 text-white ml-auto",
  viewBox: "0 0 24 24"
};
function Ac(t, e) {
  return f(), b("svg", Ec, e[0] || (e[0] = [
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
const vs = { render: Ac }, Tc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function Mc(t, e) {
  return f(), b("svg", Tc, e[0] || (e[0] = [
    l("path", { d: "M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" }, null, -1)
  ]));
}
const Dc = { render: Mc }, Oc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto vf-toolbar-icon",
  viewBox: "0 0 24 24"
};
function Vc(t, e) {
  return f(), b("svg", Oc, e[0] || (e[0] = [
    l("path", { d: "M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" }, null, -1)
  ]));
}
const Lc = { render: Vc }, Fc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function Rc(t, e) {
  return f(), b("svg", Fc, e[0] || (e[0] = [
    l("path", { d: "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25zm0 9.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18zM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25zm0 9.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18z" }, null, -1)
  ]));
}
const Bc = { render: Rc }, Hc = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  "stroke-width": "1.5",
  class: "h-6 w-6 md:h-8 md:w-8 m-auto",
  viewBox: "0 0 24 24"
};
function Ic(t, e) {
  return f(), b("svg", Hc, e[0] || (e[0] = [
    l("path", { d: "M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75" }, null, -1)
  ]));
}
const Nc = { render: Ic }, Uc = { class: "vuefinder__toolbar" }, Pc = {
  key: 0,
  class: "vuefinder__toolbar__actions"
}, zc = ["title"], qc = ["title"], jc = ["title"], Gc = ["title"], Wc = ["title"], Kc = ["title"], Yc = ["title"], Jc = {
  key: 1,
  class: "vuefinder__toolbar__search-results"
}, Xc = { class: "pl-2" }, Zc = { class: "dark:bg-gray-700 bg-gray-200 text-xs px-2 py-1 rounded" }, Qc = { class: "vuefinder__toolbar__controls" }, ed = ["title"], td = ["title"], nd = {
  __name: "Toolbar",
  setup(t) {
    const e = re("ServiceContainer"), { setStore: n } = e.storage, { t: o } = e.i18n, s = e.dragSelect, c = M("");
    e.emitter.on("vf-search-query", ({ newQuery: i }) => {
      c.value = i;
    });
    const a = () => {
      e.fullScreen = !e.fullScreen;
    };
    Me(
      () => e.fullScreen,
      () => {
        e.fullScreen ? document.querySelector("body").style.overflow = "hidden" : document.querySelector("body").style.overflow = "", n("full-screen", e.fullScreen), e.emitter.emit("vf-fullscreen-toggle");
      }
    );
    const d = () => {
      e.view = e.view === "list" ? "grid" : "list", s.refreshSelection(), n("viewport", e.view);
    };
    return (i, u) => (f(), b("div", Uc, [
      c.value.length ? (f(), b("div", Jc, [
        l("div", Xc, [
          X(w(r(o)("Search results for")) + " ", 1),
          l("span", Zc, w(c.value), 1)
        ]),
        r(e).fs.loading ? (f(), K(r(vs), { key: 0 })) : I("", !0)
      ])) : (f(), b("div", Pc, [
        r(e).features.includes(r(de).NEW_FOLDER) ? (f(), b("div", {
          key: 0,
          class: "mx-1.5",
          title: r(o)("New Folder"),
          onClick: u[0] || (u[0] = (_) => r(e).modal.open(Uo, { items: r(s).getSelected() }))
        }, [
          z(r(No))
        ], 8, zc)) : I("", !0),
        r(e).features.includes(r(de).NEW_FILE) ? (f(), b("div", {
          key: 1,
          class: "mx-1.5",
          title: r(o)("New File"),
          onClick: u[1] || (u[1] = (_) => r(e).modal.open(qi, { items: r(s).getSelected() }))
        }, [
          z(r(Po))
        ], 8, qc)) : I("", !0),
        r(e).features.includes(r(de).RENAME) ? (f(), b("div", {
          key: 2,
          class: "mx-1.5",
          title: r(o)("Rename"),
          onClick: u[2] || (u[2] = (_) => r(s).getCount() !== 1 || r(e).modal.open(us, { items: r(s).getSelected() }))
        }, [
          z(r(Io), {
            class: le(
              r(s).getCount() === 1 ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled"
            )
          }, null, 8, ["class"])
        ], 8, jc)) : I("", !0),
        r(e).features.includes(r(de).DELETE) ? (f(), b("div", {
          key: 3,
          class: "mx-1.5",
          title: r(o)("Delete"),
          onClick: u[3] || (u[3] = (_) => !r(s).getCount() || r(e).modal.open(ds, { items: r(s).getSelected() }))
        }, [
          z(r(Ho), {
            class: le(
              r(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled"
            )
          }, null, 8, ["class"])
        ], 8, Gc)) : I("", !0),
        r(e).features.includes(r(de).UPLOAD) ? (f(), b("div", {
          key: 4,
          class: "mx-1.5",
          title: r(o)("Upload"),
          onClick: u[4] || (u[4] = (_) => r(e).modal.open(ac, { items: r(s).getSelected() }))
        }, [
          z(r(zo))
        ], 8, Wc)) : I("", !0),
        r(e).features.includes(r(de).UNARCHIVE) && r(s).getCount() === 1 && (r(s).getSelected()[0].mime_type || r(s).getSelected()[0].mimeType) === "application/zip" ? (f(), b("div", {
          key: 5,
          class: "mx-1.5",
          title: r(o)("Unarchive"),
          onClick: u[5] || (u[5] = (_) => !r(s).getCount() || r(e).modal.open(jo, { items: r(s).getSelected() }))
        }, [
          z(r(qo), {
            class: le(
              r(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled"
            )
          }, null, 8, ["class"])
        ], 8, Kc)) : I("", !0),
        r(e).features.includes(r(de).ARCHIVE) ? (f(), b("div", {
          key: 6,
          class: "mx-1.5",
          title: r(o)("Archive"),
          onClick: u[6] || (u[6] = (_) => !r(s).getCount() || r(e).modal.open(Wo, { items: r(s).getSelected() }))
        }, [
          z(r(Go), {
            class: le(
              r(s).getCount() ? "vf-toolbar-icon" : "vf-toolbar-icon-disabled"
            )
          }, null, 8, ["class"])
        ], 8, Yc)) : I("", !0)
      ])),
      l("div", Qc, [
        r(e).features.includes(r(de).FULL_SCREEN) ? (f(), b("div", {
          key: 0,
          onClick: a,
          class: "mx-1.5",
          title: r(o)("Toggle Full Screen")
        }, [
          r(e).fullScreen ? (f(), K(r(Lc), { key: 0 })) : (f(), K(r(Dc), { key: 1 }))
        ], 8, ed)) : I("", !0),
        l("div", {
          class: "mx-1.5",
          title: r(o)("Change View"),
          onClick: u[7] || (u[7] = (_) => c.value.length || d())
        }, [
          r(e).view === "grid" ? (f(), K(r(Bc), {
            key: 0,
            class: le(["vf-toolbar-icon", c.value.length ? "vf-toolbar-icon-disabled" : ""])
          }, null, 8, ["class"])) : I("", !0),
          r(e).view === "list" ? (f(), K(r(Nc), {
            key: 1,
            class: le(["vf-toolbar-icon", c.value.length ? "vf-toolbar-icon-disabled" : ""])
          }, null, 8, ["class"])) : I("", !0)
        ], 8, td)
      ])
    ]));
  }
}, sd = (t, e = 0, n = !1) => {
  let o;
  return (...s) => {
    n && !o && t(...s), clearTimeout(o), o = setTimeout(() => {
      t(...s);
    }, e);
  };
}, Is = (t, e, n) => {
  const o = M(t);
  return mr((s, c) => ({
    get() {
      return s(), o.value;
    },
    set: sd(
      (a) => {
        o.value = a, c();
      },
      e,
      n
    )
  }));
}, od = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "aria-hidden": "true",
  class: "h-6 w-6 stroke-blue-600 dark:stroke-blue-100",
  viewBox: "0 0 24 24"
};
function rd(t, e) {
  return f(), b("svg", od, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3"
    }, null, -1)
  ]));
}
const ld = { render: rd }, ad = { class: "vuefinder__move-modal__content" }, id = { class: "vuefinder__move-modal__description" }, cd = { class: "vuefinder__move-modal__files vf-scrollbar" }, dd = { class: "vuefinder__move-modal__file" }, ud = {
  key: 0,
  class: "vuefinder__move-modal__icon vuefinder__move-modal__icon--dir",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, vd = {
  key: 1,
  class: "vuefinder__move-modal__icon",
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  viewBox: "0 0 24 24",
  stroke: "currentColor",
  "stroke-width": "1"
}, fd = { class: "vuefinder__move-modal__file-name" }, _d = { class: "vuefinder__move-modal__target-title" }, md = { class: "vuefinder__move-modal__target-directory" }, pd = { class: "vuefinder__move-modal__target-path" }, hd = { class: "vuefinder__move-modal__selected-items" }, Kn = {
  __name: "ModalMove",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, o = M(e.modal.data.items.from), s = M(""), c = () => {
      o.value.length && e.emitter.emit("vf-fetch", {
        params: {
          q: "move",
          m: "post",
          adapter: e.fs.adapter,
          path: e.fs.data.dirname
        },
        body: {
          items: o.value.map(({ path: a, type: d }) => ({ path: a, type: d })),
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
    return (a, d) => (f(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          onClick: c,
          class: "vf-btn vf-btn-primary"
        }, w(r(n)("Yes, Move!")), 1),
        l("button", {
          type: "button",
          onClick: d[1] || (d[1] = (i) => r(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, w(r(n)("Cancel")), 1),
        l("div", hd, w(r(n)("%s item(s) selected.", o.value.length)), 1)
      ]),
      default: Q(() => [
        l("div", null, [
          z(et, {
            icon: r(ld),
            title: r(n)("Move files")
          }, null, 8, ["icon", "title"]),
          l("div", ad, [
            l("p", id, w(r(n)("Are you sure you want to move these files?")), 1),
            l("div", cd, [
              (f(!0), b(ge, null, ye(o.value, (i) => (f(), b("div", dd, [
                l("div", null, [
                  i.type === "dir" ? (f(), b("svg", ud, d[2] || (d[2] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                    }, null, -1)
                  ]))) : (f(), b("svg", vd, d[3] || (d[3] = [
                    l("path", {
                      "stroke-linecap": "round",
                      "stroke-linejoin": "round",
                      d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    }, null, -1)
                  ])))
                ]),
                l("div", fd, w(i.path), 1)
              ]))), 256))
            ]),
            l("h4", _d, w(r(n)("Target Directory")), 1),
            l("p", md, [
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
              l("span", pd, w(r(e).modal.data.items.to.path), 1)
            ]),
            s.value.length ? (f(), K(Ye, {
              key: 0,
              onHidden: d[0] || (d[0] = (i) => s.value = ""),
              error: ""
            }, {
              default: Q(() => [
                X(w(s.value), 1)
              ]),
              _: 1
            })) : I("", !0)
          ])
        ])
      ]),
      _: 1
    }));
  }
}, gd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer",
  viewBox: "-40 -40 580 580"
};
function bd(t, e) {
  return f(), b("svg", gd, e[0] || (e[0] = [
    l("path", { d: "M463.5 224h8.5c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2S461.9 48.1 455 55l-41.6 41.6c-87.6-86.5-228.7-86.2-315.8 1-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2S334.3 224 344 224z" }, null, -1)
  ]));
}
const wd = { render: bd }, yd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-0.5 rounded",
  viewBox: "0 0 20 20"
};
function kd(t, e) {
  return f(), b("svg", yd, e[0] || (e[0] = [
    l("path", {
      "fill-rule": "evenodd",
      d: "M5.293 9.707a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1-1.414 1.414L11 7.414V15a1 1 0 1 1-2 0V7.414L6.707 9.707a1 1 0 0 1-1.414 0",
      class: "pointer-events-none",
      "clip-rule": "evenodd"
    }, null, -1)
  ]));
}
const Sd = { render: kd }, xd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-300 dark:text-neutral-200 dark:hover:bg-gray-700 cursor-pointer",
  viewBox: "0 0 24 24"
};
function $d(t, e) {
  return f(), b("svg", xd, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M6 18 18 6M6 6l12 12"
    }, null, -1)
  ]));
}
const Cd = { render: $d }, Ed = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 rounded text-slate-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
  viewBox: "0 0 20 20"
};
function Ad(t, e) {
  return f(), b("svg", Ed, e[0] || (e[0] = [
    l("path", {
      d: "M10.707 2.293a1 1 0 0 0-1.414 0l-7 7a1 1 0 0 0 1.414 1.414L4 10.414V17a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-6.586l.293.293a1 1 0 0 0 1.414-1.414z",
      class: "pointer-events-none"
    }, null, -1)
  ]));
}
const Td = { render: Ad }, Md = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-6 w-6 p-1 m-auto stroke-gray-400 fill-gray-100 dark:stroke-gray-400 dark:fill-gray-400/20",
  viewBox: "0 0 20 20"
};
function Dd(t, e) {
  return f(), b("svg", Md, e[0] || (e[0] = [
    l("path", { d: "m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607" }, null, -1)
  ]));
}
const Od = { render: Dd }, Vd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "w-6 h-6 cursor-pointer",
  viewBox: "0 0 24 24"
};
function Ld(t, e) {
  return f(), b("svg", Vd, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M6 18 18 6M6 6l12 12"
    }, null, -1)
  ]));
}
const Fd = { render: Ld }, Rd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "text-neutral-500 fill-sky-500 stroke-sky-500 dark:fill-slate-500 dark:stroke-slate-500",
  viewBox: "0 0 24 24"
};
function Bd(t, e) {
  return f(), b("svg", Rd, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2"
    }, null, -1)
  ]));
}
const bn = { render: Bd }, Hd = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "h-6 w-6 p-1 rounded text-slate-700 dark:text-neutral-300 cursor-pointer",
  viewBox: "0 0 24 24"
};
function Id(t, e) {
  return f(), b("svg", Hd, e[0] || (e[0] = [
    l("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "M9 6h11M12 12h8M15 18h5M5 6v.01M8 12v.01M11 18v.01" }, null, -1)
  ]));
}
const Nd = { render: Id }, Ud = {
  xmlns: "http://www.w3.org/2000/svg",
  class: "h-6 w-6 rounded text-slate-700 hover:bg-neutral-100 dark:fill-neutral-300 dark:hover:bg-gray-800 cursor-pointer",
  viewBox: "0 0 448 512"
};
function Pd(t, e) {
  return f(), b("svg", Ud, e[0] || (e[0] = [
    l("path", { d: "M8 256a56 56 0 1 1 112 0 56 56 0 1 1-112 0m160 0a56 56 0 1 1 112 0 56 56 0 1 1-112 0m216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112" }, null, -1)
  ]));
}
const zd = { render: Pd }, qd = { class: "vuefinder__breadcrumb__container" }, jd = ["title"], Gd = ["title"], Wd = ["title"], Kd = ["title"], Yd = { class: "vuefinder__breadcrumb__list" }, Jd = {
  key: 0,
  class: "vuefinder__breadcrumb__hidden-list"
}, Xd = { class: "relative" }, Zd = ["onDragover", "onDragleave", "onDrop", "title", "onClick"], Qd = { class: "vuefinder__breadcrumb__search-mode" }, eu = ["placeholder"], tu = { class: "vuefinder__breadcrumb__hidden-dropdown" }, nu = ["onDrop", "onClick"], su = { class: "vuefinder__breadcrumb__hidden-item-content" }, ou = { class: "vuefinder__breadcrumb__hidden-item-text" }, ru = {
  __name: "Breadcrumb",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, o = e.dragSelect, { setStore: s } = e.storage, c = M(null), a = Is(0, 100);
    Me(a, (V) => {
      const $ = c.value.children;
      let x = 0, A = 0, T = 5, R = 1;
      e.fs.limitBreadcrumbItems(T), dt(() => {
        for (let C = $.length - 1; C >= 0 && !(x + $[C].offsetWidth > a.value - 40); C--)
          x += parseInt($[C].offsetWidth, 10), A++;
        A < R && (A = R), A > T && (A = T), e.fs.limitBreadcrumbItems(A);
      });
    });
    const d = () => {
      a.value = c.value.offsetWidth;
    };
    let i = M(null);
    xe(() => {
      i.value = new ResizeObserver(d), i.value.observe(c.value);
    }), Yn(() => {
      i.value.disconnect();
    });
    const u = (V, $ = null) => {
      V.preventDefault(), o.isDraggingRef.value = !1, m(V), $ ?? ($ = e.fs.hiddenBreadcrumbs.length - 1);
      let x = JSON.parse(V.dataTransfer.getData("items"));
      if (x.find((A) => A.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(Kn, {
        items: {
          from: x,
          to: e.fs.hiddenBreadcrumbs[$] ?? { path: e.fs.adapter + "://" }
        }
      });
    }, _ = (V, $ = null) => {
      V.preventDefault(), o.isDraggingRef.value = !1, m(V), $ ?? ($ = e.fs.breadcrumbs.length - 2);
      let x = JSON.parse(V.dataTransfer.getData("items"));
      if (x.find((A) => A.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(Kn, {
        items: {
          from: x,
          to: e.fs.breadcrumbs[$] ?? { path: e.fs.adapter + "://" }
        }
      });
    }, v = (V) => {
      V.preventDefault(), e.fs.isGoUpAvailable() ? (V.dataTransfer.dropEffect = "copy", V.currentTarget.classList.add("bg-blue-200", "dark:bg-slate-600")) : (V.dataTransfer.dropEffect = "none", V.dataTransfer.effectAllowed = "none");
    }, m = (V) => {
      V.preventDefault(), V.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-600"), e.fs.isGoUpAvailable() && V.currentTarget.classList.remove("bg-blue-200", "dark:bg-slate-600");
    }, p = () => {
      L(), e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname } });
    }, g = () => {
      L(), !e.fs.isGoUpAvailable() || e.emitter.emit("vf-fetch", {
        params: {
          q: "index",
          adapter: e.fs.adapter,
          path: e.fs.parentFolderPath
        }
      });
    }, h = (V) => {
      e.emitter.emit("vf-fetch", { params: { q: "index", adapter: e.fs.adapter, path: V.path } }), e.fs.toggleHiddenBreadcrumbs(!1);
    }, y = () => {
      e.fs.showHiddenBreadcrumbs && e.fs.toggleHiddenBreadcrumbs(!1);
    }, E = {
      mounted(V, $, x, A) {
        V.clickOutsideEvent = function(T) {
          V === T.target || V.contains(T.target) || $.value();
        }, document.body.addEventListener("click", V.clickOutsideEvent);
      },
      beforeUnmount(V, $, x, A) {
        document.body.removeEventListener("click", V.clickOutsideEvent);
      }
    }, H = () => {
      e.showTreeView = !e.showTreeView;
    };
    Me(() => e.showTreeView, (V, $) => {
      V !== $ && s("show-tree-view", V);
    });
    const k = M(null), S = () => {
      e.features.includes(de.SEARCH) && (e.fs.searchMode = !0, dt(() => k.value.focus()));
    }, O = Is("", 400);
    Me(O, (V) => {
      e.emitter.emit("vf-toast-clear"), e.emitter.emit("vf-search-query", { newQuery: V });
    }), Me(() => e.fs.searchMode, (V) => {
      V && dt(() => k.value.focus());
    });
    const L = () => {
      e.fs.searchMode = !1, O.value = "";
    };
    e.emitter.on("vf-search-exit", () => {
      L();
    });
    const G = () => {
      O.value === "" && L();
    };
    return (V, $) => (f(), b("div", qd, [
      l("span", {
        title: r(n)("Toggle Tree View")
      }, [
        z(r(Nd), {
          onClick: H,
          class: le(["vuefinder__breadcrumb__toggle-tree", r(e).showTreeView ? "vuefinder__breadcrumb__toggle-tree--active" : ""])
        }, null, 8, ["class"])
      ], 8, jd),
      l("span", {
        title: r(n)("Go up a directory")
      }, [
        z(r(Sd), {
          onDragover: $[0] || ($[0] = (x) => v(x)),
          onDragleave: $[1] || ($[1] = (x) => m(x)),
          onDrop: $[2] || ($[2] = (x) => _(x)),
          onClick: g,
          class: le(r(e).fs.isGoUpAvailable() ? "vuefinder__breadcrumb__go-up--active" : "vuefinder__breadcrumb__go-up--inactive")
        }, null, 8, ["class"])
      ], 8, Gd),
      r(e).fs.loading ? (f(), b("span", {
        key: 1,
        title: r(n)("Cancel")
      }, [
        z(r(Cd), {
          onClick: $[3] || ($[3] = (x) => r(e).emitter.emit("vf-fetch-abort"))
        })
      ], 8, Kd)) : (f(), b("span", {
        key: 0,
        title: r(n)("Refresh")
      }, [
        z(r(wd), { onClick: p })
      ], 8, Wd)),
      ue(l("div", {
        onClick: ot(S, ["self"]),
        class: "group vuefinder__breadcrumb__search-container"
      }, [
        l("div", null, [
          z(r(Td), {
            onDragover: $[4] || ($[4] = (x) => v(x)),
            onDragleave: $[5] || ($[5] = (x) => m(x)),
            onDrop: $[6] || ($[6] = (x) => _(x, -1)),
            onClick: $[7] || ($[7] = (x) => r(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: r(e).fs.adapter } }))
          })
        ]),
        l("div", Yd, [
          r(e).fs.hiddenBreadcrumbs.length ? ue((f(), b("div", Jd, [
            $[13] || ($[13] = l("div", { class: "vuefinder__breadcrumb__separator" }, "/", -1)),
            l("div", Xd, [
              l("span", {
                onDragenter: $[8] || ($[8] = (x) => r(e).fs.toggleHiddenBreadcrumbs(!0)),
                onClick: $[9] || ($[9] = (x) => r(e).fs.toggleHiddenBreadcrumbs()),
                class: "vuefinder__breadcrumb__hidden-toggle"
              }, [
                z(r(zd), { class: "vuefinder__breadcrumb__hidden-toggle-icon" })
              ], 32)
            ])
          ])), [
            [E, y]
          ]) : I("", !0)
        ]),
        l("div", {
          ref_key: "breadcrumbContainer",
          ref: c,
          class: "vuefinder__breadcrumb__visible-list",
          onClick: ot(S, ["self"])
        }, [
          (f(!0), b(ge, null, ye(r(e).fs.breadcrumbs, (x, A) => (f(), b("div", { key: A }, [
            $[14] || ($[14] = l("span", { class: "vuefinder__breadcrumb__separator" }, "/", -1)),
            l("span", {
              onDragover: (T) => A === r(e).fs.breadcrumbs.length - 1 || v(T),
              onDragleave: (T) => A === r(e).fs.breadcrumbs.length - 1 || m(T),
              onDrop: (T) => A === r(e).fs.breadcrumbs.length - 1 || _(T, A),
              class: "vuefinder__breadcrumb__item",
              title: x.basename,
              onClick: (T) => r(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: r(e).fs.adapter, path: x.path } })
            }, w(x.name), 41, Zd)
          ]))), 128))
        ], 512),
        r(e).fs.loading ? (f(), K(r(vs), { key: 0 })) : I("", !0)
      ], 512), [
        [Pe, !r(e).fs.searchMode]
      ]),
      ue(l("div", Qd, [
        l("div", null, [
          z(r(Od))
        ]),
        ue(l("input", {
          ref_key: "searchInput",
          ref: k,
          onKeydown: kt(L, ["esc"]),
          onBlur: G,
          "onUpdate:modelValue": $[10] || ($[10] = (x) => pr(O) ? O.value = x : null),
          placeholder: r(n)("Search anything.."),
          class: "vuefinder__breadcrumb__search-input",
          type: "text"
        }, null, 40, eu), [
          [St, r(O)]
        ]),
        z(r(Fd), { onClick: L })
      ], 512), [
        [Pe, r(e).fs.searchMode]
      ]),
      ue(l("div", tu, [
        (f(!0), b(ge, null, ye(r(e).fs.hiddenBreadcrumbs, (x, A) => (f(), b("div", {
          key: A,
          onDragover: $[11] || ($[11] = (T) => v(T)),
          onDragleave: $[12] || ($[12] = (T) => m(T)),
          onDrop: (T) => u(T, A),
          onClick: (T) => h(x),
          class: "vuefinder__breadcrumb__hidden-item"
        }, [
          l("div", su, [
            l("span", null, [
              z(r(bn), { class: "vuefinder__breadcrumb__hidden-item-icon" })
            ]),
            $[15] || ($[15] = X()),
            l("span", ou, w(x.name), 1)
          ])
        ], 40, nu))), 128))
      ], 512), [
        [Pe, r(e).fs.showHiddenBreadcrumbs]
      ])
    ]));
  }
};
function lu(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
function au(t) {
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
  let n = t.toString(), o = 0;
  return o = e - n.length + 1, n = new Array(o).join("0").concat(n), n;
}
function iu(t, e) {
  return e ? t < 0 ? "-" : "" : t <= -1e3 ? "-" : "";
}
function cu(t, e) {
  const n = e && e.leading, o = e && e.ms, s = t < 0 ? -t : t, c = iu(t, o), a = au(s), d = it(a.seconds);
  let i = "";
  return a.days && !i && (i = c + a.days + ":" + it(a.hours) + ":" + it(a.minutes) + ":" + d), a.hours && !i && (i = c + (n ? it(a.hours) : a.hours) + ":" + it(a.minutes) + ":" + d), i || (i = c + (n ? it(a.minutes) : a.minutes) + ":" + d), o && (i += "." + it(a.ms, 3)), i;
}
var du = cu;
const uu = /* @__PURE__ */ lu(du), Ko = (t, e = null) => new Date(t * 1e3).toLocaleString(e ?? navigator.language ?? "en-US"), vu = ["onClick"], fu = {
  __name: "Toast",
  setup(t) {
    const e = re("ServiceContainer"), { getStore: n } = e.storage, o = M(n("full-screen", !1)), s = M([]), c = (i) => i === "error" ? "text-red-400 border-red-400 dark:text-red-300 dark:border-red-300" : "text-lime-600 border-lime-600 dark:text-lime-300 dark:border-lime-1300", a = (i) => {
      s.value.splice(i, 1);
    }, d = (i) => {
      let u = s.value.findIndex((_) => _.id === i);
      u !== -1 && a(u);
    };
    return e.emitter.on("vf-toast-clear", () => {
      s.value = [];
    }), e.emitter.on("vf-toast-push", (i) => {
      let u = (/* @__PURE__ */ new Date()).getTime().toString(36).concat(performance.now().toString(), Math.random().toString()).replace(/\./g, "");
      i.id = u, s.value.push(i), setTimeout(() => {
        d(u);
      }, 5e3);
    }), (i, u) => (f(), b("div", {
      class: le(["vuefinder__toast", o.value.value ? "vuefinder__toast--fixed" : "vuefinder__toast--absolute"])
    }, [
      z(hr, {
        name: "vuefinder__toast-item",
        "enter-active-class": "vuefinder__toast-item--enter-active",
        "leave-active-class": "vuefinder__toast-item--leave-active",
        "leave-to-class": "vuefinder__toast-item--leave-to"
      }, {
        default: Q(() => [
          (f(!0), b(ge, null, ye(s.value, (_, v) => (f(), b("div", {
            key: v,
            onClick: (m) => a(v),
            class: le(["vuefinder__toast__message", c(_.type)])
          }, w(_.label), 11, vu))), 128))
        ]),
        _: 1
      })
    ], 2));
  }
}, _u = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 20 20"
};
function mu(t, e) {
  return f(), b("svg", _u, e[0] || (e[0] = [
    l("path", {
      "fill-rule": "evenodd",
      d: "M5.293 7.293a1 1 0 0 1 1.414 0L10 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414",
      "clip-rule": "evenodd"
    }, null, -1)
  ]));
}
const pu = { render: mu }, hu = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 20 20"
};
function gu(t, e) {
  return f(), b("svg", hu, e[0] || (e[0] = [
    l("path", {
      "fill-rule": "evenodd",
      d: "M14.707 12.707a1 1 0 0 1-1.414 0L10 9.414l-3.293 3.293a1 1 0 0 1-1.414-1.414l4-4a1 1 0 0 1 1.414 0l4 4a1 1 0 0 1 0 1.414",
      "clip-rule": "evenodd"
    }, null, -1)
  ]));
}
const bu = { render: gu }, Kt = {
  __name: "SortIcon",
  props: { direction: String },
  setup(t) {
    return (e, n) => (f(), b("div", null, [
      t.direction === "asc" ? (f(), K(r(pu), { key: 0 })) : I("", !0),
      t.direction === "desc" ? (f(), K(r(bu), { key: 1 })) : I("", !0)
    ]));
  }
}, wu = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "text-neutral-500",
  viewBox: "0 0 24 24"
};
function yu(t, e) {
  return f(), b("svg", wu, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2"
    }, null, -1)
  ]));
}
const ku = { render: yu }, Su = { class: "vuefinder__item-icon" }, Tn = {
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
    return (e, n) => (f(), b("span", Su, [
      t.type === "dir" ? (f(), K(r(bn), {
        key: 0,
        class: le(
          t.small ? "vuefinder__item-icon--small" : "vuefinder__item-icon--large"
        )
      }, null, 8, ["class"])) : (f(), K(r(ku), {
        key: 1,
        class: le(
          t.small ? "vuefinder__item-icon--small" : "vuefinder__item-icon--large"
        )
      }, null, 8, ["class"]))
    ]));
  }
}, xu = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "absolute h-6 w-6 md:h-12 md:w-12 m-auto stroke-neutral-500 fill-white dark:fill-gray-700 dark:stroke-gray-600 z-10",
  viewBox: "0 0 24 24"
};
function $u(t, e) {
  return f(), b("svg", xu, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M7 21h10a2 2 0 0 0 2-2V9.414a1 1 0 0 0-.293-.707l-5.414-5.414A1 1 0 0 0 12.586 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2"
    }, null, -1)
  ]));
}
const Cu = { render: $u }, Eu = { class: "vuefinder__drag-item__container" }, Au = { class: "vuefinder__drag-item__count" }, Tu = {
  __name: "DragItem",
  props: {
    count: {
      type: Number,
      default: 0
    }
  },
  setup(t) {
    const e = t;
    return (n, o) => (f(), b("div", Eu, [
      z(r(Cu)),
      l("div", Au, w(e.count), 1)
    ]));
  }
}, Mu = { class: "vuefinder__text-preview" }, Du = { class: "vuefinder__text-preview__header" }, Ou = ["title"], Vu = { class: "vuefinder__text-preview__actions" }, Lu = {
  key: 0,
  class: "vuefinder__text-preview__content"
}, Fu = { key: 1 }, Ru = {
  __name: "Text",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = e, o = M(""), s = M(""), c = M(null), a = M(!1), d = M(""), i = M(!1), u = re("ServiceContainer"), { t: _ } = u.i18n;
    xe(() => {
      u.requester.send({
        url: "",
        method: "get",
        params: { q: "preview", adapter: u.modal.data.adapter, path: u.modal.data.item.path },
        responseType: "text"
      }).then((p) => {
        o.value = p, n("success");
      });
    });
    const v = () => {
      a.value = !a.value, s.value = o.value;
    }, m = () => {
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
      }).then((p) => {
        d.value = _("Updated."), o.value = p, n("success"), a.value = !a.value;
      }).catch((p) => {
        d.value = _(p.message), i.value = !0;
      });
    };
    return (p, g) => (f(), b("div", Mu, [
      l("div", Du, [
        l("div", {
          class: "vuefinder__text-preview__title",
          id: "modal-title",
          title: r(u).modal.data.item.path
        }, w(r(u).modal.data.item.basename), 9, Ou),
        l("div", Vu, [
          a.value ? (f(), b("button", {
            key: 0,
            onClick: m,
            class: "vuefinder__text-preview__save-button"
          }, w(r(_)("Save")), 1)) : I("", !0),
          r(u).features.includes(r(de).EDIT) ? (f(), b("button", {
            key: 1,
            class: "vuefinder__text-preview__edit-button",
            onClick: g[0] || (g[0] = (h) => v())
          }, w(a.value ? r(_)("Cancel") : r(_)("Edit")), 1)) : I("", !0)
        ])
      ]),
      l("div", null, [
        a.value ? (f(), b("div", Fu, [
          ue(l("textarea", {
            ref_key: "editInput",
            ref: c,
            "onUpdate:modelValue": g[1] || (g[1] = (h) => s.value = h),
            class: "vuefinder__text-preview__textarea",
            name: "text",
            cols: "30",
            rows: "10"
          }, null, 512), [
            [St, s.value]
          ])
        ])) : (f(), b("pre", Lu, w(o.value), 1)),
        d.value.length ? (f(), K(Ye, {
          key: 2,
          onHidden: g[2] || (g[2] = (h) => d.value = ""),
          error: i.value
        }, {
          default: Q(() => [
            X(w(d.value), 1)
          ]),
          _: 1
        }, 8, ["error"])) : I("", !0)
      ])
    ]));
  }
}, Bu = { class: "vuefinder__image-preview" }, Hu = { class: "vuefinder__image-preview__header" }, Iu = ["title"], Nu = { class: "vuefinder__image-preview__actions" }, Uu = { class: "vuefinder__image-preview__image-container" }, Pu = ["src"], zu = {
  __name: "Image",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = e, o = re("ServiceContainer"), { t: s } = o.i18n, c = M(null), a = M(null), d = M(!1), i = M(""), u = M(!1), _ = () => {
      d.value = !d.value, d.value ? a.value = new Cr(c.value, {
        crop(m) {
        }
      }) : a.value.destroy();
    }, v = () => {
      a.value.getCroppedCanvas({
        width: 795,
        height: 341
      }).toBlob(
        (m) => {
          i.value = "", u.value = !1;
          const p = new FormData();
          p.set("file", m), o.requester.send({
            url: "",
            method: "post",
            params: {
              q: "upload",
              adapter: o.modal.data.adapter,
              path: o.modal.data.item.path
            },
            body: p
          }).then((g) => {
            i.value = s("Updated."), c.value.src = o.requester.getPreviewUrl(o.modal.data.adapter, o.modal.data.item), _(), n("success");
          }).catch((g) => {
            i.value = s(g.message), u.value = !0;
          });
        }
      );
    };
    return xe(() => {
      n("success");
    }), (m, p) => (f(), b("div", Bu, [
      l("div", Hu, [
        l("h3", {
          class: "vuefinder__image-preview__title",
          id: "modal-title",
          title: r(o).modal.data.item.path
        }, w(r(o).modal.data.item.basename), 9, Iu),
        l("div", Nu, [
          d.value ? (f(), b("button", {
            key: 0,
            onClick: v,
            class: "vuefinder__image-preview__crop-button"
          }, w(r(s)("Crop")), 1)) : I("", !0),
          r(o).features.includes(r(de).EDIT) ? (f(), b("button", {
            key: 1,
            class: "vuefinder__image-preview__edit-button",
            onClick: p[0] || (p[0] = (g) => _())
          }, w(d.value ? r(s)("Cancel") : r(s)("Edit")), 1)) : I("", !0)
        ])
      ]),
      l("div", Uu, [
        l("img", {
          ref_key: "image",
          ref: c,
          class: "vuefinder__image-preview__image",
          src: r(o).requester.getPreviewUrl(r(o).modal.data.adapter, r(o).modal.data.item),
          alt: ""
        }, null, 8, Pu)
      ]),
      i.value.length ? (f(), K(Ye, {
        key: 0,
        onHidden: p[1] || (p[1] = (g) => i.value = ""),
        error: u.value
      }, {
        default: Q(() => [
          X(w(i.value), 1)
        ]),
        _: 1
      }, 8, ["error"])) : I("", !0)
    ]));
  }
}, qu = { class: "vuefinder__default-preview" }, ju = { class: "vuefinder__default-preview__header" }, Gu = ["title"], Wu = {
  __name: "Default",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = re("ServiceContainer"), o = e;
    return xe(() => {
      o("success");
    }), (s, c) => (f(), b("div", qu, [
      l("div", ju, [
        l("h3", {
          class: "vuefinder__default-preview__title",
          id: "modal-title",
          title: r(n).modal.data.item.path
        }, w(r(n).modal.data.item.basename), 9, Gu)
      ]),
      c[0] || (c[0] = l("div", null, null, -1))
    ]));
  }
}, Ku = { class: "vuefinder__video-preview" }, Yu = ["title"], Ju = {
  class: "vuefinder__video-preview__video",
  preload: "",
  controls: ""
}, Xu = ["src"], Zu = {
  __name: "Video",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = re("ServiceContainer"), o = e, s = () => n.requester.getPreviewUrl(n.modal.data.adapter, n.modal.data.item);
    return xe(() => {
      o("success");
    }), (c, a) => (f(), b("div", Ku, [
      l("h3", {
        class: "vuefinder__video-preview__title",
        id: "modal-title",
        title: r(n).modal.data.item.path
      }, w(r(n).modal.data.item.basename), 9, Yu),
      l("div", null, [
        l("video", Ju, [
          l("source", {
            src: s(),
            type: "video/mp4"
          }, null, 8, Xu),
          a[0] || (a[0] = X(" Your browser does not support the video tag. "))
        ])
      ])
    ]));
  }
}, Qu = { class: "vuefinder__audio-preview" }, ev = ["title"], tv = {
  class: "vuefinder__audio-preview__audio",
  controls: ""
}, nv = ["src"], sv = {
  __name: "Audio",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = e, o = re("ServiceContainer"), s = () => o.requester.getPreviewUrl(o.modal.data.adapter, o.modal.data.item);
    return xe(() => {
      n("success");
    }), (c, a) => (f(), b("div", Qu, [
      l("h3", {
        class: "vuefinder__audio-preview__title",
        id: "modal-title",
        title: r(o).modal.data.item.path
      }, w(r(o).modal.data.item.basename), 9, ev),
      l("div", null, [
        l("audio", tv, [
          l("source", {
            src: s(),
            type: "audio/mpeg"
          }, null, 8, nv),
          a[0] || (a[0] = X(" Your browser does not support the audio element. "))
        ])
      ])
    ]));
  }
}, ov = { class: "vuefinder__pdf-preview" }, rv = ["title"], lv = ["data"], av = ["src", "srcdoc"], iv = {
  __name: "Pdf",
  emits: ["success"],
  setup(t, { emit: e }) {
    const n = re("ServiceContainer"), o = e, s = () => n.requester.getPreviewUrl(
      n.modal.data.adapter,
      n.modal.data.item
    );
    return xe(() => {
      o("success");
    }), (c, a) => (f(), b("div", ov, [
      l("h3", {
        class: "vuefinder__pdf-preview__title",
        id: "modal-title",
        title: r(n).modal.data.item.path
      }, w(r(n).modal.data.item.basename), 9, rv),
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
          }, null, 8, av)
        ], 8, lv)
      ])
    ]));
  }
}, cv = { class: "vuefinder__preview-modal__content" }, dv = { key: 0 }, uv = { class: "vuefinder__preview-modal__loading" }, vv = {
  key: 0,
  class: "vuefinder__preview-modal__loading-indicator"
}, fv = {
  key: 0,
  class: "vuefinder__preview-modal__details"
}, _v = { class: "vuefinder__preview-modal__details" }, mv = { class: "font-bold" }, pv = { class: "font-bold pl-2" }, hv = {
  key: 1,
  class: "vuefinder__preview-modal__note"
}, gv = ["download", "href"], Yo = {
  __name: "ModalPreview",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, o = M(!1), s = (d) => ((e.modal.data.item.mime_type || e.modal.data.item.mimeType) ?? "").startsWith(d), c = e.features.includes(de.PREVIEW);
    c || (o.value = !0);
    const a = (d) => {
      let i = "";
      return d.artist && (i += `${d.artist}`, d.title && (i += ` - ${d.title}`)), i;
    };
    return (d, i) => (f(), K(Ke, null, {
      buttons: Q(() => [
        l("button", {
          type: "button",
          onClick: i[6] || (i[6] = (u) => r(e).modal.close()),
          class: "vf-btn vf-btn-secondary"
        }, w(r(n)("Close")), 1),
        r(e).features.includes(r(de).DOWNLOAD) ? (f(), b("a", {
          key: 0,
          target: "_blank",
          class: "vf-btn vf-btn-primary",
          download: r(e).requester.getDownloadUrl(
            r(e).modal.data.adapter,
            r(e).modal.data.item
          ),
          href: r(e).requester.getDownloadUrl(
            r(e).modal.data.adapter,
            r(e).modal.data.item
          )
        }, w(r(n)("Download")), 9, gv)) : I("", !0)
      ]),
      default: Q(() => [
        l("div", null, [
          l("div", cv, [
            r(c) ? (f(), b("div", dv, [
              s("text") ? (f(), K(Ru, {
                key: 0,
                onSuccess: i[0] || (i[0] = (u) => o.value = !0)
              })) : s("image") ? (f(), K(zu, {
                key: 1,
                onSuccess: i[1] || (i[1] = (u) => o.value = !0)
              })) : s("video") ? (f(), K(Zu, {
                key: 2,
                onSuccess: i[2] || (i[2] = (u) => o.value = !0)
              })) : s("audio") ? (f(), K(sv, {
                key: 3,
                onSuccess: i[3] || (i[3] = (u) => o.value = !0)
              })) : s("application/pdf") ? (f(), K(iv, {
                key: 4,
                onSuccess: i[4] || (i[4] = (u) => o.value = !0)
              })) : (f(), K(Wu, {
                key: 5,
                onSuccess: i[5] || (i[5] = (u) => o.value = !0)
              }))
            ])) : I("", !0),
            l("div", uv, [
              o.value === !1 ? (f(), b("div", vv, [
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
                l("span", null, w(r(n)("Loading")), 1)
              ])) : I("", !0)
            ])
          ])
        ]),
        ((r(e).modal.data.item.mime_type || r(e).modal.data.item.mimeType) ?? "").startsWith("audio") ? (f(), b("div", fv, w(a(r(e).modal.data.item)), 1)) : I("", !0),
        l("div", _v, [
          l("div", null, [
            l("span", mv, w(r(n)("File Size")) + ": ", 1),
            X(w(r(e).filesize(r(e).modal.data.item.file_size)), 1)
          ]),
          l("div", null, [
            l("span", pv, w(r(n)("Last Modified")) + ": ", 1),
            X(" " + w(r(Ko)(r(e).modal.data.item.last_modified)), 1)
          ])
        ]),
        r(e).features.includes(r(de).DOWNLOAD) ? (f(), b("div", hv, [
          l("span", null, w(r(n)(
            `Download doesn't work? You can try right-click "Download" button, select "Save link as...".`
          )), 1)
        ])) : I("", !0)
      ]),
      _: 1
    }));
  }
}, bv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
};
function wv(t, e) {
  return f(), b("svg", bv, e[0] || (e[0] = [
    l("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "m15 4.5-4 4L7 10l-1.5 1.5 7 7L14 17l1.5-4 4-4M9 15l-4.5 4.5M14.5 4 20 9.5" }, null, -1)
  ]));
}
const Jo = { render: wv }, yv = ["data-type", "data-item", "data-index"], Mn = {
  __name: "Item",
  props: /* @__PURE__ */ Qt({
    index: { type: Number },
    dragImage: { type: Object }
  }, {
    item: { type: Object },
    itemModifiers: {}
  }),
  emits: ["update:item"],
  setup(t) {
    const e = re("ServiceContainer"), n = e.dragSelect, o = t, s = Mt(t, "item"), c = M();
    Zl(
      c,
      ([h]) => {
        h.attributeName === "data-item" && (s.value = JSON.parse(c.value.dataset.item));
      },
      {
        attributes: !0
      }
    );
    const a = (h) => {
      h.type === "dir" ? (e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", {
        params: { q: "index", adapter: e.fs.adapter, path: h.path }
      })) : e.modal.open(Yo, { adapter: e.fs.adapter, item: h });
    }, d = {
      mounted(h, y, E, H) {
        E.props.draggable && (h.addEventListener(
          "dragstart",
          (k) => i(k, y.value)
        ), h.addEventListener(
          "dragover",
          (k) => _(k, y.value)
        ), h.addEventListener(
          "drop",
          (k) => u(k, y.value)
        ));
      },
      beforeUnmount(h, y, E, H) {
        E.props.draggable && (h.removeEventListener("dragstart", i), h.removeEventListener("dragover", _), h.removeEventListener("drop", u));
      }
    }, i = (h, y) => {
      if (h.altKey || h.ctrlKey || h.metaKey)
        return h.preventDefault(), !1;
      n.isDraggingRef.value = !0, h.dataTransfer.setDragImage(o.dragImage.$el, 0, 15), h.dataTransfer.effectAllowed = "all", h.dataTransfer.dropEffect = "copy", h.dataTransfer.setData("items", JSON.stringify(n.getSelected()));
    }, u = (h, y) => {
      h.preventDefault(), n.isDraggingRef.value = !1;
      let E = JSON.parse(h.dataTransfer.getData("items"));
      if (E.find((H) => H.storage !== e.fs.adapter)) {
        alert("Moving items between different storages is not supported yet.");
        return;
      }
      e.modal.open(Kn, { items: { from: E, to: y } });
    }, _ = (h, y) => {
      h.preventDefault(), !y || y.type !== "dir" || n.getSelection().find((E) => E === h.currentTarget) ? (h.dataTransfer.dropEffect = "none", h.dataTransfer.effectAllowed = "none") : h.dataTransfer.dropEffect = "copy";
    };
    let v = null, m = !1;
    const p = () => {
      v && clearTimeout(v);
    }, g = (h) => {
      if (!m)
        m = !0, setTimeout(() => m = !1, 300);
      else
        return m = !1, a(s.value), clearTimeout(v), !1;
      v = setTimeout(() => {
        const y = new MouseEvent("contextmenu", {
          bubbles: !0,
          cancelable: !1,
          view: window,
          button: 2,
          buttons: 0,
          clientX: h.target.getBoundingClientRect().x,
          clientY: h.target.getBoundingClientRect().y
        });
        h.target.dispatchEvent(y);
      }, 500);
    };
    return (h, y) => ue((f(), b("div", {
      style: dn({
        opacity: r(n).isDraggingRef.value && r(n).getSelection().find((E) => h.$el === E) ? "0.5 !important" : ""
      }),
      class: le(["vuefinder__item", "vf-item-" + r(n).explorerId]),
      "data-type": s.value.type,
      key: s.value.path,
      "data-item": JSON.stringify(s.value),
      "data-index": t.index,
      onDblclick: y[0] || (y[0] = (E) => a(s.value)),
      onTouchstartPassive: y[1] || (y[1] = (E) => g(E)),
      onTouchend: y[2] || (y[2] = (E) => p()),
      onContextmenu: y[3] || (y[3] = ot((E) => r(e).emitter.emit("vf-contextmenu-show", {
        event: E,
        items: r(n).getSelected(),
        target: s.value
      }), ["prevent"])),
      ref_key: "itemRef",
      ref: c
    }, [
      Tt(h.$slots, "default"),
      r(e).pinnedFolders.find((E) => E.path === s.value.path) ? (f(), K(r(Jo), {
        key: 0,
        class: "vuefinder__item--pinned"
      })) : I("", !0)
    ], 46, yv)), [
      [d, s.value]
    ]);
  }
}, kv = { class: "vuefinder__explorer__container" }, Sv = {
  key: 0,
  class: "vuefinder__explorer__header"
}, xv = { class: "vuefinder__explorer__drag-item" }, $v = { class: "vuefinder__explorer__item-list-content" }, Cv = { class: "vuefinder__explorer__item-list-name" }, Ev = { class: "vuefinder__explorer__item-name" }, Av = { class: "vuefinder__explorer__item-path" }, Tv = { class: "vuefinder__explorer__item-list-content" }, Mv = { class: "vuefinder__explorer__item-list-name" }, Dv = ["title"], Ov = { key: 0 }, Vv = { key: 0 }, Lv = { class: "vuefinder__explorer__item-size" }, Fv = { key: 0 }, Rv = { class: "vuefinder__explorer__item-date" }, Bv = { class: "vuefinder__explorer__item-grid-content" }, Hv = ["data-src", "alt"], Iv = {
  key: 2,
  class: "vuefinder__explorer__item-extension"
}, Nv = { class: "vuefinder__explorer__item-title break-all" }, Uv = {
  __name: "Explorer",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, o = (p) => p == null ? void 0 : p.substring(0, 3), s = M(null), c = M(""), a = e.dragSelect;
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
        onSuccess: (g) => {
          g.files.length || e.emitter.emit("vf-toast-push", {
            label: n("No search result found.")
          });
        }
      }) : e.emitter.emit("vf-fetch", {
        params: { q: "index", adapter: e.fs.adapter, path: e.fs.data.dirname }
      });
    });
    const i = Fe(() => ({
      active: e.sortActive,
      column: e.sortColumn,
      order: e.sortOrder
    })), u = (p = !0) => {
      let g = [...e.fs.data.files.filter((k) => !k.isFile)], h = [...e.fs.data.files.filter((k) => k.isFile)], y = i.value.column, E = i.value.order === "asc" ? 1 : -1;
      if (!p)
        return [...g, ...h];
      const H = (k, S) => typeof k == "string" && typeof S == "string" ? k.toLowerCase().localeCompare(S.toLowerCase()) : k < S ? -1 : k > S ? 1 : 0;
      return i.value.active && (g = g.slice().sort((k, S) => H(k[y], S[y]) * E), h = h.slice().sort((k, S) => H(k[y], S[y]) * E)), [...g, ...h];
    }, _ = (p) => {
      e.sortActive && i.value.column === p ? (e.sortActive = i.value.order === "asc", e.sortColumn = p, e.sortOrder = "desc") : (e.sortActive = !0, e.sortColumn = p, e.sortOrder = "asc");
    }, v = (p) => {
      let g = p.basename;
      return p.artist && (g += ` (${p.artist}`, p.title && (g += ` - ${p.title}`), g += ")"), g;
    }, m = Gl((p, g) => {
      const h = e.fs.data.cache[p.path];
      Object.assign(p, g), typeof h > "u" && (e.fs.data.cache[p.path] = p);
    }, 1e3);
    return xe(() => {
      d = new $r(a.area.value);
    }), Us(() => {
      d.update();
    }), zs(() => {
      d.destroy();
    }), (p, g) => (f(), b("div", kv, [
      r(e).view === "list" || c.value.length ? (f(), b("div", Sv, [
        l("div", {
          onClick: g[0] || (g[0] = (h) => _("basename")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--name vf-sort-button"
        }, [
          X(w(r(n)("Name")) + " ", 1),
          ue(z(Kt, {
            direction: i.value.order
          }, null, 8, ["direction"]), [
            [Pe, i.value.active && i.value.column === "basename"]
          ])
        ]),
        c.value.length ? I("", !0) : (f(), b("div", {
          key: 0,
          onClick: g[1] || (g[1] = (h) => _("file_size")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--size vf-sort-button"
        }, [
          X(w(r(n)("Size")) + " ", 1),
          ue(z(Kt, {
            direction: i.value.order
          }, null, 8, ["direction"]), [
            [Pe, i.value.active && i.value.column === "file_size"]
          ])
        ])),
        c.value.length ? I("", !0) : (f(), b("div", {
          key: 1,
          onClick: g[2] || (g[2] = (h) => _("last_modified")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--date vf-sort-button"
        }, [
          X(w(r(n)("Date")) + " ", 1),
          ue(z(Kt, {
            direction: i.value.order
          }, null, 8, ["direction"]), [
            [Pe, i.value.active && i.value.column === "last_modified"]
          ])
        ])),
        c.value.length ? (f(), b("div", {
          key: 2,
          onClick: g[3] || (g[3] = (h) => _("path")),
          class: "vuefinder__explorer__sort-button vuefinder__explorer__sort-button--path vf-sort-button"
        }, [
          X(w(r(n)("Filepath")) + " ", 1),
          ue(z(Kt, {
            direction: i.value.order
          }, null, 8, ["direction"]), [
            [Pe, i.value.active && i.value.column === "path"]
          ])
        ])) : I("", !0)
      ])) : I("", !0),
      l("div", xv, [
        z(Tu, {
          ref_key: "dragImage",
          ref: s,
          count: r(a).getCount()
        }, null, 8, ["count"])
      ]),
      l("div", {
        ref: r(a).scrollBarContainer,
        class: le(["vf-explorer-scrollbar-container vuefinder__explorer__scrollbar-container", [
          { "grid-view": r(e).view === "grid" },
          { "search-active": c.value.length }
        ]])
      }, [
        l("div", {
          ref: r(a).scrollBar,
          class: "vuefinder__explorer__scrollbar"
        }, null, 512)
      ], 2),
      l("div", {
        ref: r(a).area,
        class: "vuefinder__explorer__selector-area vf-explorer-scrollbar vf-selector-area",
        onContextmenu: g[4] || (g[4] = ot((h) => r(e).emitter.emit("vf-contextmenu-show", {
          event: h,
          items: r(a).getSelected()
        }), ["self", "prevent"]))
      }, [
        c.value.length ? (f(!0), b(ge, { key: 0 }, ye(u(), (h, y) => (f(), K(Mn, {
          item: h,
          index: y,
          dragImage: s.value,
          class: "vf-item vf-item-list",
          "onUpdate:item": (E) => r(m)(h, E)
        }, {
          default: Q(() => [
            l("div", $v, [
              l("div", Cv, [
                z(Tn, {
                  type: h.type,
                  small: r(e).compactListView
                }, null, 8, ["type", "small"]),
                l("span", Ev, w(h.basename), 1)
              ]),
              l("div", Av, w(h.path), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage", "onUpdate:item"]))), 256)) : I("", !0),
        r(e).view === "list" && !c.value.length ? (f(!0), b(ge, { key: 1 }, ye(u(), (h, y) => (f(), K(Mn, {
          item: h,
          index: y,
          dragImage: s.value,
          class: "vf-item vf-item-list",
          draggable: "true",
          key: h.path,
          "onUpdate:item": (E) => r(m)(h, E)
        }, {
          default: Q(() => [
            l("div", Tv, [
              l("div", Mv, [
                z(Tn, {
                  type: h.type,
                  small: r(e).compactListView
                }, null, 8, ["type", "small"]),
                l("span", {
                  class: "vuefinder__explorer__item-name",
                  title: v(h)
                }, [
                  X(w(h.basename) + " ", 1),
                  ((h.mime_type || h.mimeType) ?? "").startsWith(
                    "audio"
                  ) && h.artist ? (f(), b("span", Ov, [
                    X(" (" + w(h.artist) + " ", 1),
                    h.title ? (f(), b("span", Vv, " - " + w(h.title), 1)) : I("", !0),
                    g[5] || (g[5] = X(") "))
                  ])) : I("", !0)
                ], 8, Dv)
              ]),
              l("div", Lv, [
                X(w(h.file_size ? r(e).filesize(h.file_size) : "") + " ", 1),
                ((h.mime_type || h.mimeType) ?? "").startsWith("audio") ? (f(), b("span", Fv, " (" + w(r(uu)(h.duration * 1e3)) + ") ", 1)) : I("", !0)
              ]),
              l("div", Rv, w(r(Ko)(h.last_modified)), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage", "onUpdate:item"]))), 128)) : I("", !0),
        r(e).view === "grid" && !c.value.length ? (f(!0), b(ge, { key: 2 }, ye(u(!1), (h, y) => (f(), K(Mn, {
          item: h,
          index: y,
          dragImage: s.value,
          class: "vf-item vf-item-grid",
          draggable: "true",
          "onUpdate:item": (E) => r(m)(h, E)
        }, {
          default: Q(() => [
            l("div", null, [
              l("div", Bv, [
                ((h.mime_type || h.mimeType) ?? "").startsWith("image") && r(e).showThumbnails ? (f(), b("img", {
                  src: "data:image/png;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
                  class: "vuefinder__explorer__item-thumbnail lazy",
                  "data-src": r(e).requester.getPreviewUrl(r(e).fs.adapter, h),
                  alt: h.basename,
                  key: h.path
                }, null, 8, Hv)) : (f(), K(Tn, {
                  key: 1,
                  type: h.type
                }, null, 8, ["type"])),
                !(((h.mime_type || h.mimeType) ?? "").startsWith(
                  "image"
                ) && r(e).showThumbnails) && h.type !== "dir" ? (f(), b("div", Iv, w(o(h.extension)), 1)) : I("", !0)
              ]),
              l("span", Nv, w(r(Wn)(h.basename)), 1)
            ])
          ]),
          _: 2
        }, 1032, ["item", "index", "dragImage", "onUpdate:item"]))), 256)) : I("", !0)
      ], 544),
      z(fu)
    ]));
  }
}, Pv = ["href", "download"], zv = ["onClick"], qv = {
  __name: "ContextMenu",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, o = M(null), s = M([]), c = M(""), a = Lt({
      active: !1,
      items: [],
      positions: {
        left: 0,
        top: 0
      }
    }), d = Fe(() => a.items.filter(
      (v) => v.key == null || e.features.includes(v.key)
    ));
    e.emitter.on("vf-context-selected", (v) => {
      s.value = v;
    });
    const i = {
      newfolder: {
        key: de.NEW_FOLDER,
        title: () => n("New Folder"),
        action: () => e.modal.open(Uo)
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
            (v) => !s.value.find((m) => m.path === v.path)
          ), e.storage.setStore("pinned-folders", e.pinnedFolders);
        }
      },
      delete: {
        key: de.DELETE,
        title: () => n("Delete"),
        action: () => {
          e.modal.open(ds, { items: s });
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
        action: () => e.modal.open(Yo, {
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
        link: Fe(
          () => e.requester.getDownloadUrl(e.fs.adapter, s.value[0])
        ),
        title: () => n("Download"),
        action: () => {
        }
      },
      archive: {
        key: de.ARCHIVE,
        title: () => n("Archive"),
        action: () => e.modal.open(Wo, { items: s })
      },
      unarchive: {
        key: de.UNARCHIVE,
        title: () => n("Unarchive"),
        action: () => e.modal.open(jo, { items: s })
      },
      rename: {
        key: de.RENAME,
        title: () => n("Rename"),
        action: () => e.modal.open(us, { items: s })
      }
    }, u = (v) => {
      e.emitter.emit("vf-contextmenu-hide"), v.action();
    };
    e.emitter.on("vf-search-query", ({ newQuery: v }) => {
      c.value = v;
    }), e.emitter.on("vf-contextmenu-show", ({ event: v, items: m, target: p = null }) => {
      if (a.items = [], c.value)
        if (p)
          a.items.push(i.openDir), e.emitter.emit("vf-context-selected", [p]);
        else
          return;
      else !p && !c.value ? (a.items.push(i.refresh), a.items.push(i.selectAll), a.items.push(i.newfolder), e.emitter.emit("vf-context-selected", [])) : m.length > 1 && m.some((g) => g.path === p.path) ? (a.items.push(i.refresh), a.items.push(i.archive), a.items.push(i.delete), e.emitter.emit("vf-context-selected", m)) : (p.type === "dir" ? (a.items.push(i.open), e.pinnedFolders.findIndex((g) => g.path === p.path) !== -1 ? a.items.push(i.unpinFolder) : a.items.push(i.pinFolder)) : (a.items.push(i.preview), a.items.push(i.download)), a.items.push(i.rename), (p.mime_type || p.mimeType) === "application/zip" ? a.items.push(i.unarchive) : a.items.push(i.archive), a.items.push(i.delete), e.emitter.emit("vf-context-selected", [p]));
      _(v);
    }), e.emitter.on("vf-contextmenu-hide", () => {
      a.active = !1;
    });
    const _ = (v) => {
      const m = e.dragSelect.area.value, p = e.root.getBoundingClientRect(), g = m.getBoundingClientRect();
      let h = v.clientX - p.left, y = v.clientY - p.top;
      a.active = !0, dt(() => {
        var S;
        const E = (S = o.value) == null ? void 0 : S.getBoundingClientRect();
        let H = (E == null ? void 0 : E.height) ?? 0, k = (E == null ? void 0 : E.width) ?? 0;
        h = g.right - v.pageX + window.scrollX < k ? h - k : h, y = g.bottom - v.pageY + window.scrollY < H ? y - H : y, a.positions = {
          left: h + "px",
          top: y + "px"
        };
      });
    };
    return (v, m) => ue((f(), b("ul", {
      ref_key: "contextmenu",
      ref: o,
      style: dn(a.positions),
      class: "vuefinder__context-menu"
    }, [
      (f(!0), b(ge, null, ye(d.value, (p) => (f(), b("li", {
        class: "vuefinder__context-menu__item",
        key: p.title
      }, [
        p.link ? (f(), b("a", {
          key: 0,
          class: "vuefinder__context-menu__link",
          target: "_blank",
          href: p.link,
          download: p.link,
          onClick: m[0] || (m[0] = (g) => r(e).emitter.emit("vf-contextmenu-hide"))
        }, [
          l("span", null, w(p.title()), 1)
        ], 8, Pv)) : (f(), b("div", {
          key: 1,
          class: "vuefinder__context-menu__action",
          onClick: (g) => u(p)
        }, [
          l("span", null, w(p.title()), 1)
        ], 8, zv))
      ]))), 128))
    ], 4)), [
      [Pe, a.active]
    ]);
  }
}, jv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
};
function Gv(t, e) {
  return f(), b("svg", jv, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
    }, null, -1)
  ]));
}
const Xo = { render: Gv }, Wv = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  class: "h-5 w-5 stroke-slate-500 cursor-pointer",
  viewBox: "0 0 24 24"
};
function Kv(t, e) {
  return f(), b("svg", Wv, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0"
    }, null, -1)
  ]));
}
const Yv = { render: Kv }, Jv = { class: "vuefinder__status-bar__wrapper" }, Xv = { class: "vuefinder__status-bar__storage" }, Zv = ["title"], Qv = { class: "vuefinder__status-bar__storage-icon" }, ef = ["value"], tf = { class: "vuefinder__status-bar__info" }, nf = { key: 0 }, sf = { class: "vuefinder__status-bar__selected-count" }, of = { class: "vuefinder__status-bar__actions" }, rf = ["disabled", "onClick"], lf = ["disabled"], af = ["title"], cf = {
  __name: "Statusbar",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, { setStore: o } = e.storage, s = e.dragSelect, c = () => {
      e.emitter.emit("vf-search-exit"), e.emitter.emit("vf-fetch", {
        params: { q: "index", adapter: e.fs.adapter }
      }), o("adapter", e.fs.adapter);
    }, a = M("");
    e.emitter.on("vf-search-query", ({ newQuery: u }) => {
      a.value = u;
    });
    const d = (u) => {
      const _ = e.selectButton.multiple ? s.getSelected().length > 0 : s.getSelected().length === 1;
      return u.isActive() && _;
    }, i = Fe(() => {
      const u = e.selectButton.multiple ? s.getSelected().length > 0 : s.getSelected().length === 1;
      return e.selectButton.active && u;
    });
    return (u, _) => (f(), b("div", Jv, [
      l("div", Xv, [
        l("div", {
          class: "vuefinder__status-bar__storage-container",
          title: r(n)("Storage")
        }, [
          l("div", Qv, [
            z(r(Xo))
          ]),
          ue(l("select", {
            "onUpdate:modelValue": _[0] || (_[0] = (v) => r(e).fs.adapter = v),
            onChange: c,
            class: "vuefinder__status-bar__storage-select",
            tabindex: "-1"
          }, [
            (f(!0), b(ge, null, ye(r(e).fs.data.storages, (v) => (f(), b("option", { value: v }, w(v), 9, ef))), 256))
          ], 544), [
            [Dn, r(e).fs.adapter]
          ])
        ], 8, Zv),
        l("div", tf, [
          a.value.length ? (f(), b("span", nf, w(r(e).fs.data.files.length) + " items found. ", 1)) : I("", !0),
          l("span", sf, w(r(e).dragSelect.getCount() > 0 ? r(n)("%s item(s) selected.", r(e).dragSelect.getCount()) : ""), 1)
        ])
      ]),
      l("div", of, [
        (f(!0), b(ge, null, ye(r(e).additionalButtons, (v) => (f(), b("button", {
          class: le(["vf-btn py-0 vf-btn-primary", { disabled: !d(v) }]),
          disabled: !d(v),
          onClick: (m) => v.click(r(s).getSelected(), m)
        }, w(v.label), 11, rf))), 256)),
        r(e).selectButton.active ? (f(), b("button", {
          key: 0,
          class: le(["vf-btn py-0 vf-btn-primary", { disabled: !i.value }]),
          disabled: !i.value,
          onClick: _[1] || (_[1] = (v) => r(e).selectButton.click(r(s).getSelected(), v))
        }, w(r(n)("Select")), 11, lf)) : I("", !0),
        l("span", {
          class: "vuefinder__status-bar__about",
          title: r(n)("About"),
          onClick: _[2] || (_[2] = (v) => r(e).modal.open(Bo))
        }, [
          z(r(Yv))
        ], 8, af)
      ])
    ]));
  }
}, df = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.5",
  class: "text-neutral-500 fill-sky-500 stroke-gray-100/50 dark:stroke-slate-700/50 dark:fill-slate-500",
  viewBox: "0 0 24 24"
};
function uf(t, e) {
  return f(), b("svg", df, e[0] || (e[0] = [
    l("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      d: "M3.75 9.776q.168-.026.344-.026h15.812q.176 0 .344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776"
    }, null, -1)
  ]));
}
const Zo = { render: uf }, vf = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "currentColor",
  class: "h-5 w-5",
  viewBox: "0 0 24 24"
};
function ff(t, e) {
  return f(), b("svg", vf, e[0] || (e[0] = [
    l("path", {
      fill: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2m3.6 5.2a1 1 0 0 0-1.4.2L12 10.333 9.8 7.4a1 1 0 1 0-1.6 1.2l2.55 3.4-2.55 3.4a1 1 0 1 0 1.6 1.2l2.2-2.933 2.2 2.933a1 1 0 0 0 1.6-1.2L13.25 12l2.55-3.4a1 1 0 0 0-.2-1.4" }, null, -1)
  ]));
}
const _f = { render: ff }, mf = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  viewBox: "0 0 24 24"
};
function pf(t, e) {
  return f(), b("svg", mf, e[0] || (e[0] = [
    l("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "M15 12H9M12 9v6" }, null, -1)
  ]));
}
const Qo = { render: pf }, hf = {
  xmlns: "http://www.w3.org/2000/svg",
  fill: "none",
  stroke: "currentColor",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
  "stroke-width": "2",
  viewBox: "0 0 24 24"
};
function gf(t, e) {
  return f(), b("svg", hf, e[0] || (e[0] = [
    l("path", {
      stroke: "none",
      d: "M0 0h24v24H0z"
    }, null, -1),
    l("path", { d: "M9 12h6" }, null, -1)
  ]));
}
const er = { render: gf };
function tr(t, e) {
  const n = t.findIndex((o) => o.path === e.path);
  n > -1 ? t[n] = e : t.push(e);
}
const bf = { class: "vuefinder__folder-loader-indicator" }, wf = {
  key: 1,
  class: "vuefinder__folder-loader-indicator--icon"
}, nr = {
  __name: "FolderLoaderIndicator",
  props: /* @__PURE__ */ Qt({
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
    const o = Mt(t, "modelValue"), s = M(!1);
    Me(
      () => o.value,
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
        tr(n.treeViewData, { path: e.path, ...d });
      }).catch((d) => {
      }).finally(() => {
        s.value = !1;
      });
    };
    return (d, i) => {
      var u;
      return f(), b("div", bf, [
        s.value ? (f(), K(r(vs), {
          key: 0,
          class: "vuefinder__folder-loader-indicator--loading"
        })) : (f(), b("div", wf, [
          o.value && ((u = c()) != null && u.folders.length) ? (f(), K(r(er), {
            key: 0,
            class: "vuefinder__folder-loader-indicator--minus"
          })) : I("", !0),
          o.value ? I("", !0) : (f(), K(r(Qo), {
            key: 1,
            class: "vuefinder__folder-loader-indicator--plus"
          }))
        ]))
      ]);
    };
  }
}, yf = { class: "vuefinder__treesubfolderlist__item-content" }, kf = ["onClick"], Sf = ["title", "onClick"], xf = { class: "vuefinder__treesubfolderlist__item-icon" }, $f = { class: "vuefinder__treesubfolderlist__subfolder" }, Cf = {
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
    const e = re("ServiceContainer"), n = M([]), o = t, s = M(null);
    xe(() => {
      o.path === o.adapter + "://" && Ge(s.value, {
        scrollbars: {
          theme: "vf-theme-dark dark:vf-theme-light"
        }
      });
    });
    const c = Fe(() => {
      var a;
      return ((a = e.treeViewData.find((d) => d.path === o.path)) == null ? void 0 : a.folders) || [];
    });
    return (a, d) => {
      const i = gr("TreeSubfolderList", !0);
      return f(), b("ul", {
        ref_key: "parentSubfolderList",
        ref: s,
        class: "vuefinder__treesubfolderlist__container"
      }, [
        (f(!0), b(ge, null, ye(c.value, (u, _) => (f(), b("li", {
          key: u.path,
          class: "vuefinder__treesubfolderlist__item"
        }, [
          l("div", yf, [
            l("div", {
              class: "vuefinder__treesubfolderlist__item-toggle",
              onClick: (v) => n.value[u.path] = !n.value[u.path]
            }, [
              z(nr, {
                adapter: t.adapter,
                path: u.path,
                modelValue: n.value[u.path],
                "onUpdate:modelValue": (v) => n.value[u.path] = v
              }, null, 8, ["adapter", "path", "modelValue", "onUpdate:modelValue"])
            ], 8, kf),
            l("div", {
              class: "vuefinder__treesubfolderlist__item-link",
              title: u.path,
              onClick: (v) => r(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: o.adapter, path: u.path } })
            }, [
              l("div", xf, [
                r(e).fs.path === u.path ? (f(), K(r(Zo), { key: 0 })) : (f(), K(r(bn), { key: 1 }))
              ]),
              l("div", {
                class: le(["vuefinder__treesubfolderlist__item-text", {
                  "vuefinder__treesubfolderlist__item-text--active": r(e).fs.path === u.path
                }])
              }, w(u.basename), 3)
            ], 8, Sf)
          ]),
          l("div", $f, [
            ue(z(i, {
              adapter: o.adapter,
              path: u.path
            }, null, 8, ["adapter", "path"]), [
              [Pe, n.value[u.path]]
            ])
          ])
        ]))), 128))
      ], 512);
    };
  }
}, Ef = { class: "vuefinder__treestorageitem__loader" }, Af = {
  __name: "TreeStorageItem",
  props: {
    storage: {
      type: String,
      required: !0
    }
  },
  setup(t) {
    const e = re("ServiceContainer"), n = M(!1);
    return (o, s) => (f(), b(ge, null, [
      l("div", {
        onClick: s[1] || (s[1] = (c) => n.value = !n.value),
        class: "vuefinder__treestorageitem__header"
      }, [
        l("div", {
          class: le(["vuefinder__treestorageitem__info", t.storage === r(e).fs.adapter ? "vuefinder__treestorageitem__info--active" : ""])
        }, [
          l("div", {
            class: le(["vuefinder__treestorageitem__icon", t.storage === r(e).fs.adapter ? "vuefinder__treestorageitem__icon--active" : ""])
          }, [
            z(r(Xo))
          ], 2),
          l("div", null, w(t.storage), 1)
        ], 2),
        l("div", Ef, [
          z(nr, {
            adapter: t.storage,
            path: t.storage + "://",
            modelValue: n.value,
            "onUpdate:modelValue": s[0] || (s[0] = (c) => n.value = c)
          }, null, 8, ["adapter", "path", "modelValue"])
        ])
      ]),
      ue(z(Cf, {
        adapter: t.storage,
        path: t.storage + "://",
        class: "vuefinder__treestorageitem__subfolder"
      }, null, 8, ["adapter", "path"]), [
        [Pe, n.value]
      ])
    ], 64));
  }
}, Tf = { class: "vuefinder__folder-indicator" }, Mf = { class: "vuefinder__folder-indicator--icon" }, Df = {
  __name: "FolderIndicator",
  props: {
    modelValue: {},
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(t) {
    const e = Mt(t, "modelValue");
    return (n, o) => (f(), b("div", Tf, [
      l("div", Mf, [
        e.value ? (f(), K(r(er), {
          key: 0,
          class: "vuefinder__folder-indicator--minus"
        })) : I("", !0),
        e.value ? I("", !0) : (f(), K(r(Qo), {
          key: 1,
          class: "vuefinder__folder-indicator--plus"
        }))
      ])
    ]));
  }
}, Of = { class: "vuefinder__treeview__header" }, Vf = { class: "vuefinder__treeview__pinned-label" }, Lf = { class: "vuefinder__treeview__pin-text text-nowrap" }, Ff = {
  key: 0,
  class: "vuefinder__treeview__pinned-list"
}, Rf = { class: "vuefinder__treeview__pinned-item" }, Bf = ["onClick"], Hf = ["title"], If = ["onClick"], Nf = { key: 0 }, Uf = { class: "vuefinder__treeview__no-pinned" }, Pf = { class: "vuefinder__treeview__storage" }, zf = {
  __name: "TreeView",
  setup(t) {
    const e = re("ServiceContainer"), { t: n } = e.i18n, { getStore: o, setStore: s } = e.storage, c = M(190), a = M(o("pinned-folders-opened", !0));
    Me(a, (_) => s("pinned-folders-opened", _));
    const d = (_) => {
      e.pinnedFolders = e.pinnedFolders.filter((v) => v.path !== _.path), e.storage.setStore("pinned-folders", e.pinnedFolders);
    }, i = (_) => {
      const v = _.clientX, m = _.target.parentElement, p = m.getBoundingClientRect().width;
      m.classList.remove("transition-[width]"), m.classList.add("transition-none");
      const g = (y) => {
        c.value = p + y.clientX - v, c.value < 50 && (c.value = 0, e.showTreeView = !1), c.value > 50 && (e.showTreeView = !0);
      }, h = () => {
        const y = m.getBoundingClientRect();
        c.value = y.width, m.classList.add("transition-[width]"), m.classList.remove("transition-none"), window.removeEventListener("mousemove", g), window.removeEventListener("mouseup", h);
      };
      window.addEventListener("mousemove", g), window.addEventListener("mouseup", h);
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
    }), Me(e.fs.data, (_, v) => {
      const m = _.files.filter((p) => p.type === "dir");
      tr(e.treeViewData, { path: e.fs.path, folders: m.map((p) => ({
        adapter: p.storage,
        path: p.path,
        basename: p.basename
      })) });
    }), (_, v) => (f(), b(ge, null, [
      l("div", {
        onClick: v[0] || (v[0] = (m) => r(e).showTreeView = !r(e).showTreeView),
        class: le(["vuefinder__treeview__overlay", r(e).showTreeView ? "vuefinder__treeview__backdrop" : "hidden"])
      }, null, 2),
      l("div", {
        style: dn(r(e).showTreeView ? "min-width:100px;max-width:75%; width: " + c.value + "px" : "width: 0"),
        class: "vuefinder__treeview__container"
      }, [
        l("div", {
          ref_key: "treeViewScrollElement",
          ref: u,
          class: "vuefinder__treeview__scroll"
        }, [
          l("div", Of, [
            l("div", {
              onClick: v[2] || (v[2] = (m) => a.value = !a.value),
              class: "vuefinder__treeview__pinned-toggle"
            }, [
              l("div", Vf, [
                z(r(Jo), { class: "vuefinder__treeview__pin-icon" }),
                l("div", Lf, w(r(n)("Pinned Folders")), 1)
              ]),
              z(Df, {
                modelValue: a.value,
                "onUpdate:modelValue": v[1] || (v[1] = (m) => a.value = m)
              }, null, 8, ["modelValue"])
            ]),
            a.value ? (f(), b("ul", Ff, [
              (f(!0), b(ge, null, ye(r(e).pinnedFolders, (m) => (f(), b("li", Rf, [
                l("div", {
                  class: "vuefinder__treeview__pinned-folder",
                  onClick: (p) => r(e).emitter.emit("vf-fetch", { params: { q: "index", adapter: m.storage, path: m.path } })
                }, [
                  r(e).fs.path !== m.path ? (f(), K(r(bn), {
                    key: 0,
                    class: "vuefinder__treeview__folder-icon"
                  })) : I("", !0),
                  r(e).fs.path === m.path ? (f(), K(r(Zo), {
                    key: 1,
                    class: "vuefinder__treeview__open-folder-icon"
                  })) : I("", !0),
                  l("div", {
                    title: m.path,
                    class: le(["vuefinder__treeview__folder-name text-nowrap", {
                      "vuefinder__treeview__folder-name--active": r(e).fs.path === m.path
                    }])
                  }, w(m.basename), 11, Hf)
                ], 8, Bf),
                l("div", {
                  class: "vuefinder__treeview__remove-favorite",
                  onClick: (p) => d(m)
                }, [
                  z(r(_f), { class: "vuefinder__treeview__remove-icon" })
                ], 8, If)
              ]))), 256)),
              r(e).pinnedFolders.length ? I("", !0) : (f(), b("li", Nf, [
                l("div", Uf, w(r(n)("No folders pinned")), 1)
              ]))
            ])) : I("", !0)
          ]),
          (f(!0), b(ge, null, ye(r(e).fs.data.storages, (m) => (f(), b("div", Pf, [
            z(Af, { storage: m }, null, 8, ["storage"])
          ]))), 256))
        ], 512),
        l("div", {
          onMousedown: i,
          class: le([(r(e).showTreeView, ""), "vuefinder__treeview__resize-handle"])
        }, null, 34)
      ], 4)
    ], 64));
  }
}, qf = { class: "vuefinder__main__content" }, jf = {
  __name: "VueFinder",
  props: /* @__PURE__ */ Qt({
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
  emits: /* @__PURE__ */ Qt(["select"], ["update:view", "update:sort"]),
  setup(t, { emit: e }) {
    const n = e, o = t, s = Mt(t, "view"), c = Mt(t, "sort"), a = Ql(o, { view: s, sort: c }, re("VueFinderOptions"));
    br("ServiceContainer", a);
    const { setStore: d } = a.storage, i = M(null);
    a.root = i;
    const u = a.dragSelect;
    Di(a);
    const _ = (m) => {
      a.fs.updateData(m), u.clearSelection(), u.refreshSelection();
    };
    let v;
    return a.emitter.on("vf-fetch-abort", () => {
      v.abort(), a.fs.loading = !1;
    }), a.emitter.on(
      "vf-fetch",
      ({
        params: m,
        body: p = null,
        onSuccess: g = null,
        onError: h = null,
        noCloseModal: y = !1
      }) => {
        ["index", "search"].includes(m.q) && (v && v.abort(), a.fs.loading = !0), v = new AbortController();
        const E = v.signal;
        a.requester.send({
          url: "",
          method: m.m || "get",
          params: m,
          body: p,
          abortSignal: E
        }).then((H) => {
          a.fs.adapter = H.adapter, a.persist && (a.fs.path = H.dirname, d("path", a.fs.path)), ["index", "search"].includes(m.q) && (a.fs.loading = !1), y || a.modal.close(), _(H), g && g(H);
        }).catch((H) => {
          console.error(H), h && h(H);
        });
      }
    ), xe(() => {
      let m = {};
      a.fs.path.includes("://") && (m = {
        adapter: a.fs.path.split("://")[0],
        path: a.fs.path
      }), a.emitter.emit("vf-fetch", {
        params: { q: "index", adapter: a.fs.adapter, ...m }
      }), u.onSelect((p, g) => {
        n("select", p, g);
      });
    }), (m, p) => (f(), b("div", {
      class: "vuefinder",
      ref_key: "root",
      ref: i,
      tabindex: "0"
    }, [
      l("div", {
        class: le(r(a).theme.actualValue)
      }, [
        l("div", {
          class: le([
            r(a).fullScreen ? "vuefinder__main__fixed" : "vuefinder__main__relative",
            "vuefinder__main__container"
          ]),
          style: dn(r(a).fullScreen ? "" : "max-height: " + t.maxHeight),
          onMousedown: p[0] || (p[0] = (g) => r(a).emitter.emit("vf-contextmenu-hide")),
          onTouchstartPassive: p[1] || (p[1] = (g) => r(a).emitter.emit("vf-contextmenu-hide"))
        }, [
          z(nd),
          z(ru),
          l("div", qf, [
            z(zf),
            z(Uv)
          ]),
          z(cf)
        ], 38),
        z(wr, { name: "fade" }, {
          default: Q(() => [
            r(a).modal.visible ? (f(), K(Ps(r(a).modal.type), { key: 0 })) : I("", !0)
          ]),
          _: 1
        }),
        z(qv)
      ], 2)
    ], 512));
  }
}, t_ = {
  /**
   * @param {import('vue').App} app
   * @param options
   */
  install(t, e = {}) {
    e.i18n = e.i18n ?? {};
    let [n] = Object.keys(e.i18n);
    e.locale = e.locale ?? n ?? "en", t.provide("VueFinderOptions", e), t.component("VueFinder", jf);
  }
};
export {
  t_ as default
};
