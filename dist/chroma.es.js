var K = Object.defineProperty;
var G = (a, i, u) => i in a ? K(a, i, { enumerable: !0, configurable: !0, writable: !0, value: u }) : a[i] = u;
var B = (a, i, u) => G(a, typeof i != "symbol" ? i + "" : i, u);
function J(a) {
  if (document.getElementById(`${a.id}-helper`) != null)
    return;
  const i = document.createElement("div");
  a.parentNode.insertBefore(i, a.nextSibling), i.id = `${a.id}-helper`, i.setAttribute("_chroma", "picker"), i.innerHTML = `
    <div>
      <canvas _chroma="picker:spectrum" width="200" height="200"></canvas>
      <canvas _chroma="picker:hue" width="30" height="200"></canvas>
    </div>
  `;
  const u = i.querySelector('[_chroma="picker:spectrum"]'), m = i.querySelector('[_chroma="picker:hue"]');
  let S = !1, A = !1, y = { r: 255, g: 0, b: 0 }, b = 0, h = 0, l = 0, g, w = 0, f = 0, p = 0, k = 0;
  const O = 300, j = 600;
  let F = 0, P = 0, E = !1;
  const x = a.value;
  if (x.match(/^#[0-9A-Fa-f]{6}$/)) {
    const t = parseInt(x.substring(1, 3), 16), e = parseInt(x.substring(3, 5), 16), n = parseInt(x.substring(5, 7), 16), { h: r, s, v: o } = R(t, e, n);
    b = r, h = s, l = 1 - o, w = r, f = s, p = 1 - o, y = C(b);
  }
  a.style.setProperty(
    "--chroma-data-computedwidth",
    i.offsetWidth + "px"
  ), Y(), I();
  function Y() {
    const t = m.getContext("2d");
    t.clearRect(0, 0, m.width, m.height);
    for (let e = 0; e < m.height; e++) {
      const n = e / m.height, r = C(n);
      t.fillStyle = `rgb(${r.r}, ${r.g}, ${r.b})`, t.fillRect(0, e, m.width, 1);
    }
    z();
  }
  function z() {
    const t = m.getContext("2d");
    t.fillStyle = "white", t.fillRect(
      0,
      b * m.height - 1.5,
      m.width,
      3
    );
  }
  function C(t) {
    t *= 6;
    const e = Math.floor(t), n = t - e;
    switch (e) {
      case 0:
        return { r: 255, g: Math.round(n * 255), b: 0 };
      case 1:
        return { r: Math.round((1 - n) * 255), g: 255, b: 0 };
      case 2:
        return { r: 0, g: 255, b: Math.round(n * 255) };
      case 3:
        return { r: 0, g: Math.round((1 - n) * 255), b: 255 };
      case 4:
        return { r: Math.round(n * 255), g: 0, b: 255 };
      case 5:
        return { r: 255, g: 0, b: Math.round((1 - n) * 255) };
      default:
        return { r: 255, g: 0, b: 0 };
    }
  }
  function I() {
    const t = u.getContext("2d"), e = u.width, n = u.height, r = t.createImageData(e, n), s = r.data;
    for (let o = 0; o < e; o++)
      for (let d = 0; d < n; d++) {
        const v = (d * e + o) * 4, c = o / e, M = 1 - d / n;
        s[v] = Math.round(
          y.r * c * M + (1 - c) * 255 * M
        ), s[v + 1] = Math.round(
          y.g * c * M + (1 - c) * 255 * M
        ), s[v + 2] = Math.round(
          y.b * c * M + (1 - c) * 255 * M
        ), s[v + 3] = 255;
      }
    t.putImageData(r, 0, 0), W();
  }
  function W() {
    const t = u.getContext("2d"), e = h * u.width, n = l * u.height;
    t.beginPath(), t.arc(e, n, 4, 0, 2 * Math.PI), t.strokeStyle = l > 0.5 ? "white" : "black", t.lineWidth = 2, t.stroke();
  }
  function H(t) {
    k || (k = t);
    const e = t - k, n = (o) => o < 0.5 ? 2 * o * o : -1 + (4 - 2 * o) * o;
    let r = !0, s = !0;
    if (f !== h || p !== l) {
      const o = Math.min(e / O, 1);
      h = h + (f - h) * n(o), l = l + (p - l) * n(o), r = o === 1;
    }
    if (w !== b) {
      const o = Math.min(e / j, 1);
      b = b + (w - b) * n(o), y = C(b), s = o === 1;
    }
    w !== b && Y(), I(), !r || !s ? g = requestAnimationFrame(H) : k = 0;
  }
  const D = () => {
    g && cancelAnimationFrame(g), a.style.removeProperty("--chroma-data-computedwidth"), document.removeEventListener("mousemove", $), document.removeEventListener("mouseup", N), document.removeEventListener("click", X), document.removeEventListener("keydown", _);
  }, X = (t) => {
    !i.contains(t.target) && t.target !== a && (D(), i.remove());
  }, _ = (t) => {
    t.key === "Escape" && (D(), i.remove());
  }, $ = (t) => {
    (S || A) && (Math.abs(t.clientX - F) > 1 || Math.abs(t.clientY - P) > 1) && (E = !0), S && T(t, !1), A && q(t, !1);
  }, N = (t) => {
    S && (S = !1, T(t, !E)), A && (A = !1, q(t, !E));
  };
  document.addEventListener("click", X), document.addEventListener("keydown", _), document.addEventListener("mousemove", $), document.addEventListener("mouseup", N);
  function R(t, e, n) {
    t /= 255, e /= 255, n /= 255;
    const r = Math.max(t, e, n), s = Math.min(t, e, n);
    let o, d, v = r;
    const c = r - s;
    if (d = r === 0 ? 0 : c / r, r === s)
      o = 0;
    else {
      switch (r) {
        case t:
          o = (e - n) / c + (e < n ? 6 : 0);
          break;
        case e:
          o = (n - t) / c + 2;
          break;
        case n:
          o = (t - e) / c + 4;
          break;
      }
      o /= 6;
    }
    return { h: o, s: d, v };
  }
  a.addEventListener("input", (t) => {
    if (t.target.value.match(/^#[0-9A-Fa-f]{6}$/)) {
      const e = t.target.value.substring(1), n = parseInt(e.substring(0, 2), 16), r = parseInt(e.substring(2, 4), 16), s = parseInt(e.substring(4, 6), 16);
      a.previousElementSibling.style.backgroundColor = t.target.value, a.style.setProperty("--chroma-data-color", t.target.value);
      const { h: o, s: d, v } = R(n, r, s);
      w = o, f = d, p = 1 - v, g && cancelAnimationFrame(g), k = 0, g = requestAnimationFrame(H);
    }
  }), u.addEventListener("mousedown", (t) => {
    S = !0, E = !1, F = t.clientX, P = t.clientY;
  }), m.addEventListener("mousedown", (t) => {
    A = !0, E = !1, F = t.clientX, P = t.clientY;
  });
  function T(t, e = !0) {
    const n = u.getBoundingClientRect(), r = (t.clientX - n.left) / u.width, s = (t.clientY - n.top) / u.height;
    f = Math.max(0, Math.min(1, r)), p = Math.max(0, Math.min(1, s));
    const o = Math.round(
      y.r * f * (1 - p) + (1 - f) * 255 * (1 - p)
    ), d = Math.round(
      y.g * f * (1 - p) + (1 - f) * 255 * (1 - p)
    ), v = Math.round(
      y.b * f * (1 - p) + (1 - f) * 255 * (1 - p)
    ), c = "#" + [o, d, v].map((M) => M.toString(16).padStart(2, "0")).join("");
    a.value = c, a.previousElementSibling.style.backgroundColor = c, a.style.setProperty("--chroma-data-color", c), e ? (g && cancelAnimationFrame(g), k = 0, g = requestAnimationFrame(H)) : (h = f, l = p, I());
  }
  function q(t, e = !0) {
    const n = m.getBoundingClientRect(), r = (t.clientY - n.top) / m.height;
    w = Math.max(0, Math.min(1, r));
    const s = C(w), o = Math.round(
      s.r * h * (1 - l) + (1 - h) * 255 * (1 - l)
    ), d = Math.round(
      s.g * h * (1 - l) + (1 - h) * 255 * (1 - l)
    ), v = Math.round(
      s.b * h * (1 - l) + (1 - h) * 255 * (1 - l)
    ), c = "#" + [o, d, v].map((M) => M.toString(16).padStart(2, "0")).join("");
    a.value = c, a.previousElementSibling.style.backgroundColor = c, a.style.setProperty("--chroma-data-color", c), e ? (g && cancelAnimationFrame(g), k = 0, g = requestAnimationFrame(H)) : (b = w, y = s, Y(), I());
  }
}
const L = class L {
  constructor(i, u = {}) {
    this.element = document.querySelector(i), this.options = {
      ...L.defaults,
      ...u
    }, this.init();
  }
  init() {
    console.log("Initializing on", this.element), this.element.setAttribute("_chroma", "input");
    const i = document.createElement("label");
    return i.setAttribute("_chroma", "input"), this.element.id || (this.element.id = `chroma-input-${Math.random().toString(36).substr(2, 9)}`), i.setAttribute("for", this.element.id), this.element.parentNode.insertBefore(i, this.element), this.element.value || (this.element.value = this.options.initialColor), this.element.value.match(/^#[0-9A-Fa-f]{6}$/) && (i.style.backgroundColor = this.element.value, this.element.style.setProperty("--chroma-data-color", this.element.value)), this.element.addEventListener("click", () => {
      J(this.element);
    }), [];
  }
};
B(L, "defaults", {
  initialColor: "#000000"
  // Default black if no color specified
});
let U = L;
export {
  U as default
};
