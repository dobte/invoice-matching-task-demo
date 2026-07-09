(() => {
  var ce = globalThis;
  function te(t) {
    return (ce.__Zone_symbol_prefix || "__zone_symbol__") + t;
  }
  function ht() {
    let t = ce.performance;
    function n(I) {
      t && t.mark && t.mark(I);
    }
    function a(I, s) {
      t && t.measure && t.measure(I, s);
    }
    n("Zone");
    class e {
      static __symbol__ = te;
      static assertZonePatched() {
        if (ce.Promise !== S.ZoneAwarePromise) throw new Error("Zone.js has detected that ZoneAwarePromise `(window|global).Promise` has been overwritten.\nMost likely cause is that a Promise polyfill has been loaded after Zone.js (Polyfilling Promise api is not necessary when zone.js is loaded. If you must load one, do so before loading zone.js.)");
      }
      static get root() {
        let s = e.current;
        for (; s.parent; ) s = s.parent;
        return s;
      }
      static get current() {
        return b.zone;
      }
      static get currentTask() {
        return D;
      }
      static __load_patch(s, i, r = false) {
        if (S.hasOwnProperty(s)) {
          let E = ce[te("forceDuplicateZoneCheck")] === true;
          if (!r && E) throw Error("Already loaded patch: " + s);
        } else if (!ce["__Zone_disable_" + s]) {
          let E = "Zone:" + s;
          n(E), S[s] = i(ce, e, R), a(E, E);
        }
      }
      get parent() {
        return this._parent;
      }
      get name() {
        return this._name;
      }
      _parent;
      _name;
      _properties;
      _zoneDelegate;
      constructor(s, i) {
        this._parent = s, this._name = i ? i.name || "unnamed" : "<root>", this._properties = i && i.properties || {}, this._zoneDelegate = new f(this, this._parent && this._parent._zoneDelegate, i);
      }
      get(s) {
        let i = this.getZoneWith(s);
        if (i) return i._properties[s];
      }
      getZoneWith(s) {
        let i = this;
        for (; i; ) {
          if (i._properties.hasOwnProperty(s)) return i;
          i = i._parent;
        }
        return null;
      }
      fork(s) {
        if (!s) throw new Error("ZoneSpec required!");
        return this._zoneDelegate.fork(this, s);
      }
      wrap(s, i) {
        if (typeof s != "function") throw new Error("Expecting function got: " + s);
        let r = this._zoneDelegate.intercept(this, s, i), E = this;
        return function() {
          return E.runGuarded(r, this, arguments, i);
        };
      }
      run(s, i, r, E) {
        b = { parent: b, zone: this };
        try {
          return this._zoneDelegate.invoke(this, s, i, r, E);
        } finally {
          b = b.parent;
        }
      }
      runGuarded(s, i = null, r, E) {
        b = { parent: b, zone: this };
        try {
          try {
            return this._zoneDelegate.invoke(this, s, i, r, E);
          } catch (x) {
            if (this._zoneDelegate.handleError(this, x)) throw x;
          }
        } finally {
          b = b.parent;
        }
      }
      runTask(s, i, r) {
        if (s.zone != this) throw new Error("A task can only be run in the zone of creation! (Creation: " + (s.zone || J).name + "; Execution: " + this.name + ")");
        let E = s, { type: x, data: { isPeriodic: ee = false, isRefreshable: M = false } = {} } = s;
        if (s.state === q && (x === U || x === k)) return;
        let he = s.state != A;
        he && E._transitionTo(A, d);
        let _e = D;
        D = E, b = { parent: b, zone: this };
        try {
          x == k && s.data && !ee && !M && (s.cancelFn = void 0);
          try {
            return this._zoneDelegate.invokeTask(this, E, i, r);
          } catch (Q) {
            if (this._zoneDelegate.handleError(this, Q)) throw Q;
          }
        } finally {
          let Q = s.state;
          if (Q !== q && Q !== X) if (x == U || ee || M && Q === p) he && E._transitionTo(d, A, p);
          else {
            let Te = E._zoneDelegates;
            this._updateTaskCount(E, -1), he && E._transitionTo(q, A, q), M && (E._zoneDelegates = Te);
          }
          b = b.parent, D = _e;
        }
      }
      scheduleTask(s) {
        if (s.zone && s.zone !== this) {
          let r = this;
          for (; r; ) {
            if (r === s.zone) throw Error(`can not reschedule task to ${this.name} which is descendants of the original zone ${s.zone.name}`);
            r = r.parent;
          }
        }
        s._transitionTo(p, q);
        let i = [];
        s._zoneDelegates = i, s._zone = this;
        try {
          s = this._zoneDelegate.scheduleTask(this, s);
        } catch (r) {
          throw s._transitionTo(X, p, q), this._zoneDelegate.handleError(this, r), r;
        }
        return s._zoneDelegates === i && this._updateTaskCount(s, 1), s.state == p && s._transitionTo(d, p), s;
      }
      scheduleMicroTask(s, i, r, E) {
        return this.scheduleTask(new g(F, s, i, r, E, void 0));
      }
      scheduleMacroTask(s, i, r, E, x) {
        return this.scheduleTask(new g(k, s, i, r, E, x));
      }
      scheduleEventTask(s, i, r, E, x) {
        return this.scheduleTask(new g(U, s, i, r, E, x));
      }
      cancelTask(s) {
        if (s.zone != this) throw new Error("A task can only be cancelled in the zone of creation! (Creation: " + (s.zone || J).name + "; Execution: " + this.name + ")");
        if (!(s.state !== d && s.state !== A)) {
          s._transitionTo(V, d, A);
          try {
            this._zoneDelegate.cancelTask(this, s);
          } catch (i) {
            throw s._transitionTo(X, V), this._zoneDelegate.handleError(this, i), i;
          }
          return this._updateTaskCount(s, -1), s._transitionTo(q, V), s.runCount = -1, s;
        }
      }
      _updateTaskCount(s, i) {
        let r = s._zoneDelegates;
        i == -1 && (s._zoneDelegates = null);
        for (let E = 0; E < r.length; E++) r[E]._updateTaskCount(s.type, i);
      }
    }
    let c = { name: "", onHasTask: (I, s, i, r) => I.hasTask(i, r), onScheduleTask: (I, s, i, r) => I.scheduleTask(i, r), onInvokeTask: (I, s, i, r, E, x) => I.invokeTask(i, r, E, x), onCancelTask: (I, s, i, r) => I.cancelTask(i, r) };
    class f {
      get zone() {
        return this._zone;
      }
      _zone;
      _taskCounts = { microTask: 0, macroTask: 0, eventTask: 0 };
      _parentDelegate;
      _forkDlgt;
      _forkZS;
      _forkCurrZone;
      _interceptDlgt;
      _interceptZS;
      _interceptCurrZone;
      _invokeDlgt;
      _invokeZS;
      _invokeCurrZone;
      _handleErrorDlgt;
      _handleErrorZS;
      _handleErrorCurrZone;
      _scheduleTaskDlgt;
      _scheduleTaskZS;
      _scheduleTaskCurrZone;
      _invokeTaskDlgt;
      _invokeTaskZS;
      _invokeTaskCurrZone;
      _cancelTaskDlgt;
      _cancelTaskZS;
      _cancelTaskCurrZone;
      _hasTaskDlgt;
      _hasTaskDlgtOwner;
      _hasTaskZS;
      _hasTaskCurrZone;
      constructor(s, i, r) {
        this._zone = s, this._parentDelegate = i, this._forkZS = r && (r && r.onFork ? r : i._forkZS), this._forkDlgt = r && (r.onFork ? i : i._forkDlgt), this._forkCurrZone = r && (r.onFork ? this._zone : i._forkCurrZone), this._interceptZS = r && (r.onIntercept ? r : i._interceptZS), this._interceptDlgt = r && (r.onIntercept ? i : i._interceptDlgt), this._interceptCurrZone = r && (r.onIntercept ? this._zone : i._interceptCurrZone), this._invokeZS = r && (r.onInvoke ? r : i._invokeZS), this._invokeDlgt = r && (r.onInvoke ? i : i._invokeDlgt), this._invokeCurrZone = r && (r.onInvoke ? this._zone : i._invokeCurrZone), this._handleErrorZS = r && (r.onHandleError ? r : i._handleErrorZS), this._handleErrorDlgt = r && (r.onHandleError ? i : i._handleErrorDlgt), this._handleErrorCurrZone = r && (r.onHandleError ? this._zone : i._handleErrorCurrZone), this._scheduleTaskZS = r && (r.onScheduleTask ? r : i._scheduleTaskZS), this._scheduleTaskDlgt = r && (r.onScheduleTask ? i : i._scheduleTaskDlgt), this._scheduleTaskCurrZone = r && (r.onScheduleTask ? this._zone : i._scheduleTaskCurrZone), this._invokeTaskZS = r && (r.onInvokeTask ? r : i._invokeTaskZS), this._invokeTaskDlgt = r && (r.onInvokeTask ? i : i._invokeTaskDlgt), this._invokeTaskCurrZone = r && (r.onInvokeTask ? this._zone : i._invokeTaskCurrZone), this._cancelTaskZS = r && (r.onCancelTask ? r : i._cancelTaskZS), this._cancelTaskDlgt = r && (r.onCancelTask ? i : i._cancelTaskDlgt), this._cancelTaskCurrZone = r && (r.onCancelTask ? this._zone : i._cancelTaskCurrZone), this._hasTaskZS = null, this._hasTaskDlgt = null, this._hasTaskDlgtOwner = null, this._hasTaskCurrZone = null;
        let E = r && r.onHasTask, x = i && i._hasTaskZS;
        (E || x) && (this._hasTaskZS = E ? r : c, this._hasTaskDlgt = i, this._hasTaskDlgtOwner = this, this._hasTaskCurrZone = this._zone, r.onScheduleTask || (this._scheduleTaskZS = c, this._scheduleTaskDlgt = i, this._scheduleTaskCurrZone = this._zone), r.onInvokeTask || (this._invokeTaskZS = c, this._invokeTaskDlgt = i, this._invokeTaskCurrZone = this._zone), r.onCancelTask || (this._cancelTaskZS = c, this._cancelTaskDlgt = i, this._cancelTaskCurrZone = this._zone));
      }
      fork(s, i) {
        return this._forkZS ? this._forkZS.onFork(this._forkDlgt, this.zone, s, i) : new e(s, i);
      }
      intercept(s, i, r) {
        return this._interceptZS ? this._interceptZS.onIntercept(this._interceptDlgt, this._interceptCurrZone, s, i, r) : i;
      }
      invoke(s, i, r, E, x) {
        return this._invokeZS ? this._invokeZS.onInvoke(this._invokeDlgt, this._invokeCurrZone, s, i, r, E, x) : i.apply(r, E);
      }
      handleError(s, i) {
        return this._handleErrorZS ? this._handleErrorZS.onHandleError(this._handleErrorDlgt, this._handleErrorCurrZone, s, i) : true;
      }
      scheduleTask(s, i) {
        let r = i;
        if (this._scheduleTaskZS) this._hasTaskZS && r._zoneDelegates.push(this._hasTaskDlgtOwner), r = this._scheduleTaskZS.onScheduleTask(this._scheduleTaskDlgt, this._scheduleTaskCurrZone, s, i), r || (r = i);
        else if (i.scheduleFn) i.scheduleFn(i);
        else if (i.type == F) z(i);
        else throw new Error("Task is missing scheduleFn.");
        return r;
      }
      invokeTask(s, i, r, E) {
        return this._invokeTaskZS ? this._invokeTaskZS.onInvokeTask(this._invokeTaskDlgt, this._invokeTaskCurrZone, s, i, r, E) : i.callback.apply(r, E);
      }
      cancelTask(s, i) {
        let r;
        if (this._cancelTaskZS) r = this._cancelTaskZS.onCancelTask(this._cancelTaskDlgt, this._cancelTaskCurrZone, s, i);
        else {
          if (!i.cancelFn) throw Error("Task is not cancelable");
          r = i.cancelFn(i);
        }
        return r;
      }
      hasTask(s, i) {
        try {
          this._hasTaskZS && this._hasTaskZS.onHasTask(this._hasTaskDlgt, this._hasTaskCurrZone, s, i);
        } catch (r) {
          this.handleError(s, r);
        }
      }
      _updateTaskCount(s, i) {
        let r = this._taskCounts, E = r[s], x = r[s] = E + i;
        if (x < 0) throw new Error("More tasks executed then were scheduled.");
        if (E == 0 || x == 0) {
          let ee = { microTask: r.microTask > 0, macroTask: r.macroTask > 0, eventTask: r.eventTask > 0, change: s };
          this.hasTask(this._zone, ee);
        }
      }
    }
    class g {
      type;
      source;
      invoke;
      callback;
      data;
      scheduleFn;
      cancelFn;
      _zone = null;
      runCount = 0;
      _zoneDelegates = null;
      _state = "notScheduled";
      constructor(s, i, r, E, x, ee) {
        if (this.type = s, this.source = i, this.data = E, this.scheduleFn = x, this.cancelFn = ee, !r) throw new Error("callback is not defined");
        this.callback = r;
        let M = this;
        s === U && E && E.useG ? this.invoke = g.invokeTask : this.invoke = function() {
          return g.invokeTask.call(ce, M, this, arguments);
        };
      }
      static invokeTask(s, i, r) {
        s || (s = this), K++;
        try {
          return s.runCount++, s.zone.runTask(s, i, r);
        } finally {
          K == 1 && $(), K--;
        }
      }
      get zone() {
        return this._zone;
      }
      get state() {
        return this._state;
      }
      cancelScheduleRequest() {
        this._transitionTo(q, p);
      }
      _transitionTo(s, i, r) {
        if (this._state === i || this._state === r) this._state = s, s == q && (this._zoneDelegates = null);
        else throw new Error(`${this.type} '${this.source}': can not transition to '${s}', expecting state '${i}'${r ? " or '" + r + "'" : ""}, was '${this._state}'.`);
      }
      toString() {
        return this.data && typeof this.data.handleId < "u" ? this.data.handleId.toString() : Object.prototype.toString.call(this);
      }
      toJSON() {
        return { type: this.type, state: this.state, source: this.source, zone: this.zone.name, runCount: this.runCount };
      }
    }
    let T = te("setTimeout"), y = te("Promise"), w = te("then"), _ = [], P = false, L;
    function H(I) {
      if (L || ce[y] && (L = ce[y].resolve(0)), L) {
        let s = L[w];
        s || (s = L.then), s.call(L, I);
      } else ce[T](I, 0);
    }
    function z(I) {
      K === 0 && _.length === 0 && H($), I && _.push(I);
    }
    function $() {
      if (!P) {
        for (P = true; _.length; ) {
          let I = _;
          _ = [];
          for (let s = 0; s < I.length; s++) {
            let i = I[s];
            try {
              i.zone.runTask(i, null, null);
            } catch (r) {
              R.onUnhandledError(r);
            }
          }
        }
        R.microtaskDrainDone(), P = false;
      }
    }
    let J = { name: "NO ZONE" }, q = "notScheduled", p = "scheduling", d = "scheduled", A = "running", V = "canceling", X = "unknown", F = "microTask", k = "macroTask", U = "eventTask", S = {}, R = { symbol: te, currentZoneFrame: () => b, onUnhandledError: W, microtaskDrainDone: W, scheduleMicroTask: z, showUncaughtError: () => !e[te("ignoreConsoleErrorUncaughtError")], patchEventTarget: () => [], patchOnProperties: W, patchMethod: () => W, bindArguments: () => [], patchThen: () => W, patchMacroTask: () => W, patchEventPrototype: () => W, isIEOrEdge: () => false, getGlobalObjects: () => {
    }, ObjectDefineProperty: () => W, ObjectGetOwnPropertyDescriptor: () => {
    }, ObjectCreate: () => {
    }, ArraySlice: () => [], patchClass: () => W, wrapWithCurrentZone: () => W, filterProperties: () => [], attachOriginToPatched: () => W, _redefineProperty: () => W, patchCallbacks: () => W, nativeScheduleMicroTask: H }, b = { parent: null, zone: new e(null, null) }, D = null, K = 0;
    function W() {
    }
    return a("Zone", "Zone"), e;
  }
  function dt() {
    let t = globalThis, n = t[te("forceDuplicateZoneCheck")] === true;
    if (t.Zone && (n || typeof t.Zone.__symbol__ != "function")) throw new Error("Zone already loaded.");
    return t.Zone ??= ht(), t.Zone;
  }
  var pe = Object.getOwnPropertyDescriptor;
  var Me = Object.defineProperty;
  var Ae = Object.getPrototypeOf;
  var _t = Object.create;
  var Tt = Array.prototype.slice;
  var je = "addEventListener";
  var He = "removeEventListener";
  var Ne = te(je);
  var Ze = te(He);
  var ae = "true";
  var le = "false";
  var ve = te("");
  function Ve(t, n) {
    return Zone.current.wrap(t, n);
  }
  function xe(t, n, a, e, c) {
    return Zone.current.scheduleMacroTask(t, n, a, e, c);
  }
  var j = te;
  var we = typeof window < "u";
  var be = we ? window : void 0;
  var Y = we && be || globalThis;
  var Et = "removeAttribute";
  function Fe(t, n) {
    for (let a = t.length - 1; a >= 0; a--) typeof t[a] == "function" && (t[a] = Ve(t[a], n + "_" + a));
    return t;
  }
  function gt(t, n) {
    let a = t.constructor.name;
    for (let e = 0; e < n.length; e++) {
      let c = n[e], f = t[c];
      if (f) {
        let g = pe(t, c);
        if (!et(g)) continue;
        t[c] = ((T) => {
          let y = function() {
            return T.apply(this, Fe(arguments, a + "." + c));
          };
          return fe(y, T), y;
        })(f);
      }
    }
  }
  function et(t) {
    return t ? t.writable === false ? false : !(typeof t.get == "function" && typeof t.set > "u") : true;
  }
  var tt = typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope;
  var De = !("nw" in Y) && typeof Y.process < "u" && Y.process.toString() === "[object process]";
  var Ge = !De && !tt && !!(we && be.HTMLElement);
  var nt = typeof Y.process < "u" && Y.process.toString() === "[object process]" && !tt && !!(we && be.HTMLElement);
  var Ce = {};
  var kt = j("enable_beforeunload");
  var Xe = function(t) {
    if (t = t || Y.event, !t) return;
    let n = Ce[t.type];
    n || (n = Ce[t.type] = j("ON_PROPERTY" + t.type));
    let a = this || t.target || Y, e = a[n], c;
    if (Ge && a === be && t.type === "error") {
      let f = t;
      c = e && e.call(this, f.message, f.filename, f.lineno, f.colno, f.error), c === true && t.preventDefault();
    } else c = e && e.apply(this, arguments), t.type === "beforeunload" && Y[kt] && typeof c == "string" ? t.returnValue = c : c != null && !c && t.preventDefault();
    return c;
  };
  function Ye(t, n, a) {
    let e = pe(t, n);
    if (!e && a && pe(a, n) && (e = { enumerable: true, configurable: true }), !e || !e.configurable) return;
    let c = j("on" + n + "patched");
    if (t.hasOwnProperty(c) && t[c]) return;
    delete e.writable, delete e.value;
    let f = e.get, g = e.set, T = n.slice(2), y = Ce[T];
    y || (y = Ce[T] = j("ON_PROPERTY" + T)), e.set = function(w) {
      let _ = this;
      if (!_ && t === Y && (_ = Y), !_) return;
      typeof _[y] == "function" && _.removeEventListener(T, Xe), g?.call(_, null), _[y] = w, typeof w == "function" && _.addEventListener(T, Xe, false);
    }, e.get = function() {
      let w = this;
      if (!w && t === Y && (w = Y), !w) return null;
      let _ = w[y];
      if (_) return _;
      if (f) {
        let P = f.call(this);
        if (P) return e.set.call(this, P), typeof w[Et] == "function" && w.removeAttribute(n), P;
      }
      return null;
    }, Me(t, n, e), t[c] = true;
  }
  function rt(t, n, a) {
    if (n) for (let e = 0; e < n.length; e++) Ye(t, "on" + n[e], a);
    else {
      let e = [];
      for (let c in t) c.slice(0, 2) == "on" && e.push(c);
      for (let c = 0; c < e.length; c++) Ye(t, e[c], a);
    }
  }
  var oe = j("originalInstance");
  function ye(t) {
    let n = Y[t];
    if (!n) return;
    Y[j(t)] = n, Y[t] = function() {
      let c = Fe(arguments, t);
      switch (c.length) {
        case 0:
          this[oe] = new n();
          break;
        case 1:
          this[oe] = new n(c[0]);
          break;
        case 2:
          this[oe] = new n(c[0], c[1]);
          break;
        case 3:
          this[oe] = new n(c[0], c[1], c[2]);
          break;
        case 4:
          this[oe] = new n(c[0], c[1], c[2], c[3]);
          break;
        default:
          throw new Error("Arg list too long.");
      }
    }, fe(Y[t], n);
    let a = new n(function() {
    }), e;
    for (e in a) t === "XMLHttpRequest" && e === "responseBlob" || (function(c) {
      typeof a[c] == "function" ? Y[t].prototype[c] = function() {
        return this[oe][c].apply(this[oe], arguments);
      } : Me(Y[t].prototype, c, { set: function(f) {
        typeof f == "function" ? (this[oe][c] = Ve(f, t + "." + c), fe(this[oe][c], f)) : this[oe][c] = f;
      }, get: function() {
        return this[oe][c];
      } });
    })(e);
    for (e in n) e !== "prototype" && n.hasOwnProperty(e) && (Y[t][e] = n[e]);
  }
  function ue(t, n, a) {
    let e = t;
    for (; e && !e.hasOwnProperty(n); ) e = Ae(e);
    !e && t[n] && (e = t);
    let c = j(n), f = null;
    if (e && (!(f = e[c]) || !e.hasOwnProperty(c))) {
      f = e[c] = e[n];
      let g = e && pe(e, n);
      if (et(g)) {
        let T = a(f, c, n);
        e[n] = function() {
          return T(this, arguments);
        }, fe(e[n], f);
      }
    }
    return f;
  }
  function mt(t, n, a) {
    let e = null;
    function c(f) {
      let g = f.data;
      return g.args[g.cbIdx] = function() {
        f.invoke.apply(this, arguments);
      }, e.apply(g.target, g.args), f;
    }
    e = ue(t, n, (f) => function(g, T) {
      let y = a(g, T);
      return y.cbIdx >= 0 && typeof T[y.cbIdx] == "function" ? xe(y.name, T[y.cbIdx], y, c) : f.apply(g, T);
    });
  }
  function fe(t, n) {
    t[j("OriginalDelegate")] = n;
  }
  var $e = false;
  var Le = false;
  function yt() {
    if ($e) return Le;
    $e = true;
    try {
      let t = be.navigator.userAgent;
      (t.indexOf("MSIE ") !== -1 || t.indexOf("Trident/") !== -1 || t.indexOf("Edge/") !== -1) && (Le = true);
    } catch {
    }
    return Le;
  }
  function Je(t) {
    return typeof t == "function";
  }
  function Ke(t) {
    return typeof t == "number";
  }
  var pt = { useG: true };
  var ne = {};
  var ot = {};
  var st = new RegExp("^" + ve + "(\\w+)(true|false)$");
  var it = j("propagationStopped");
  function ct(t, n) {
    let a = (n ? n(t) : t) + le, e = (n ? n(t) : t) + ae, c = ve + a, f = ve + e;
    ne[t] = {}, ne[t][le] = c, ne[t][ae] = f;
  }
  function vt(t, n, a, e) {
    let c = e && e.add || je, f = e && e.rm || He, g = e && e.listeners || "eventListeners", T = e && e.rmAll || "removeAllListeners", y = j(c), w = "." + c + ":", _ = "prependListener", P = "." + _ + ":", L = function(p, d, A) {
      if (p.isRemoved) return;
      let V = p.callback;
      typeof V == "object" && V.handleEvent && (p.callback = (k) => V.handleEvent(k), p.originalDelegate = V);
      let X;
      try {
        p.invoke(p, d, [A]);
      } catch (k) {
        X = k;
      }
      let F = p.options;
      if (F && typeof F == "object" && F.once) {
        let k = p.originalDelegate ? p.originalDelegate : p.callback;
        d[f].call(d, A.type, k, F);
      }
      return X;
    };
    function H(p, d, A) {
      if (d = d || t.event, !d) return;
      let V = p || d.target || t, X = V[ne[d.type][A ? ae : le]];
      if (X) {
        let F = [];
        if (X.length === 1) {
          let k = L(X[0], V, d);
          k && F.push(k);
        } else {
          let k = X.slice();
          for (let U = 0; U < k.length && !(d && d[it] === true); U++) {
            let S = L(k[U], V, d);
            S && F.push(S);
          }
        }
        if (F.length === 1) throw F[0];
        for (let k = 0; k < F.length; k++) {
          let U = F[k];
          n.nativeScheduleMicroTask(() => {
            throw U;
          });
        }
      }
    }
    let z = function(p) {
      return H(this, p, false);
    }, $ = function(p) {
      return H(this, p, true);
    };
    function J(p, d) {
      if (!p) return false;
      let A = true;
      d && d.useG !== void 0 && (A = d.useG);
      let V = d && d.vh, X = true;
      d && d.chkDup !== void 0 && (X = d.chkDup);
      let F = false;
      d && d.rt !== void 0 && (F = d.rt);
      let k = p;
      for (; k && !k.hasOwnProperty(c); ) k = Ae(k);
      if (!k && p[c] && (k = p), !k || k[y]) return false;
      let U = d && d.eventNameToString, S = {}, R = k[y] = k[c], b = k[j(f)] = k[f], D = k[j(g)] = k[g], K = k[j(T)] = k[T], W;
      d && d.prepend && (W = k[j(d.prepend)] = k[d.prepend]);
      function I(o, u) {
        return u ? typeof o == "boolean" ? { capture: o, passive: true } : o ? typeof o == "object" && o.passive !== false ? { ...o, passive: true } : o : { passive: true } : o;
      }
      let s = function(o) {
        if (!S.isExisting) return R.call(S.target, S.eventName, S.capture ? $ : z, S.options);
      }, i = function(o) {
        if (!o.isRemoved) {
          let u = ne[o.eventName], v;
          u && (v = u[o.capture ? ae : le]);
          let C = v && o.target[v];
          if (C) {
            for (let m = 0; m < C.length; m++) if (C[m] === o) {
              C.splice(m, 1), o.isRemoved = true, o.removeAbortListener && (o.removeAbortListener(), o.removeAbortListener = null), C.length === 0 && (o.allRemoved = true, o.target[v] = null);
              break;
            }
          }
        }
        if (o.allRemoved) return b.call(o.target, o.eventName, o.capture ? $ : z, o.options);
      }, r = function(o) {
        return R.call(S.target, S.eventName, o.invoke, S.options);
      }, E = function(o) {
        return W.call(S.target, S.eventName, o.invoke, S.options);
      }, x = function(o) {
        return b.call(o.target, o.eventName, o.invoke, o.options);
      }, ee = A ? s : r, M = A ? i : x, he = function(o, u) {
        let v = typeof u;
        return v === "function" && o.callback === u || v === "object" && o.originalDelegate === u;
      }, _e = d?.diff || he, Q = Zone[j("UNPATCHED_EVENTS")], Te = t[j("PASSIVE_EVENTS")];
      function h(o) {
        if (typeof o == "object" && o !== null) {
          let u = { ...o };
          return o.signal && (u.signal = o.signal), u;
        }
        return o;
      }
      let l = function(o, u, v, C, m = false, O = false) {
        return function() {
          let N = this || t, Z = arguments[0];
          d && d.transferEventName && (Z = d.transferEventName(Z));
          let G = arguments[1];
          if (!G) return o.apply(this, arguments);
          if (De && Z === "uncaughtException") return o.apply(this, arguments);
          let B = false;
          if (typeof G != "function") {
            if (!G.handleEvent) return o.apply(this, arguments);
            B = true;
          }
          if (V && !V(o, G, N, arguments)) return;
          let de = !!Te && Te.indexOf(Z) !== -1, se = h(I(arguments[2], de)), Ee = se?.signal;
          if (Ee?.aborted) return;
          if (Q) {
            for (let ie = 0; ie < Q.length; ie++) if (Z === Q[ie]) return de ? o.call(N, Z, G, se) : o.apply(this, arguments);
          }
          let Se = se ? typeof se == "boolean" ? true : se.capture : false, Be = se && typeof se == "object" ? se.once : false, ft = Zone.current, Oe = ne[Z];
          Oe || (ct(Z, U), Oe = ne[Z]);
          let ze = Oe[Se ? ae : le], ge = N[ze], Ue = false;
          if (ge) {
            if (Ue = true, X) {
              for (let ie = 0; ie < ge.length; ie++) if (_e(ge[ie], G)) return;
            }
          } else ge = N[ze] = [];
          let Pe, We = N.constructor.name, qe = ot[We];
          qe && (Pe = qe[Z]), Pe || (Pe = We + u + (U ? U(Z) : Z)), S.options = se, Be && (S.options.once = false), S.target = N, S.capture = Se, S.eventName = Z, S.isExisting = Ue;
          let me = A ? pt : void 0;
          me && (me.taskData = S), Ee && (S.options.signal = void 0);
          let re = ft.scheduleEventTask(Pe, G, me, v, C);
          if (Ee) {
            S.options.signal = Ee;
            let ie = () => re.zone.cancelTask(re);
            o.call(Ee, "abort", ie, { once: true }), re.removeAbortListener = () => Ee.removeEventListener("abort", ie);
          }
          if (S.target = null, me && (me.taskData = null), Be && (S.options.once = true), typeof re.options != "boolean" && (re.options = se), re.target = N, re.capture = Se, re.eventName = Z, B && (re.originalDelegate = G), O ? ge.unshift(re) : ge.push(re), m) return N;
        };
      };
      return k[c] = l(R, w, ee, M, F), W && (k[_] = l(W, P, E, M, F, true)), k[f] = function() {
        let o = this || t, u = arguments[0];
        d && d.transferEventName && (u = d.transferEventName(u));
        let v = arguments[2], C = v ? typeof v == "boolean" ? true : v.capture : false, m = arguments[1];
        if (!m) return b.apply(this, arguments);
        if (V && !V(b, m, o, arguments)) return;
        let O = ne[u], N;
        O && (N = O[C ? ae : le]);
        let Z = N && o[N];
        if (Z) for (let G = 0; G < Z.length; G++) {
          let B = Z[G];
          if (_e(B, m)) {
            if (Z.splice(G, 1), B.isRemoved = true, Z.length === 0 && (B.allRemoved = true, o[N] = null, !C && typeof u == "string")) {
              let de = ve + "ON_PROPERTY" + u;
              o[de] = null;
            }
            return B.zone.cancelTask(B), F ? o : void 0;
          }
        }
        return b.apply(this, arguments);
      }, k[g] = function() {
        let o = this || t, u = arguments[0];
        d && d.transferEventName && (u = d.transferEventName(u));
        let v = [], C = at(o, U ? U(u) : u);
        for (let m = 0; m < C.length; m++) {
          let O = C[m], N = O.originalDelegate ? O.originalDelegate : O.callback;
          v.push(N);
        }
        return v;
      }, k[T] = function() {
        let o = this || t, u = arguments[0];
        if (u) {
          d && d.transferEventName && (u = d.transferEventName(u));
          let v = ne[u];
          if (v) {
            let C = v[le], m = v[ae], O = o[C], N = o[m];
            if (O) {
              let Z = O.slice();
              for (let G = 0; G < Z.length; G++) {
                let B = Z[G], de = B.originalDelegate ? B.originalDelegate : B.callback;
                this[f].call(this, u, de, B.options);
              }
            }
            if (N) {
              let Z = N.slice();
              for (let G = 0; G < Z.length; G++) {
                let B = Z[G], de = B.originalDelegate ? B.originalDelegate : B.callback;
                this[f].call(this, u, de, B.options);
              }
            }
          }
        } else {
          let v = Object.keys(o);
          for (let C = 0; C < v.length; C++) {
            let m = v[C], O = st.exec(m), N = O && O[1];
            N && N !== "removeListener" && this[T].call(this, N);
          }
          this[T].call(this, "removeListener");
        }
        if (F) return this;
      }, fe(k[c], R), fe(k[f], b), K && fe(k[T], K), D && fe(k[g], D), true;
    }
    let q = [];
    for (let p = 0; p < a.length; p++) q[p] = J(a[p], e);
    return q;
  }
  function at(t, n) {
    if (!n) {
      let f = [];
      for (let g in t) {
        let T = st.exec(g), y = T && T[1];
        if (y && (!n || y === n)) {
          let w = t[g];
          if (w) for (let _ = 0; _ < w.length; _++) f.push(w[_]);
        }
      }
      return f;
    }
    let a = ne[n];
    a || (ct(n), a = ne[n]);
    let e = t[a[le]], c = t[a[ae]];
    return e ? c ? e.concat(c) : e.slice() : c ? c.slice() : [];
  }
  function bt(t, n) {
    let a = t.Event;
    a && a.prototype && n.patchMethod(a.prototype, "stopImmediatePropagation", (e) => function(c, f) {
      c[it] = true, e && e.apply(c, f);
    });
  }
  function Pt(t, n) {
    n.patchMethod(t, "queueMicrotask", (a) => function(e, c) {
      Zone.current.scheduleMicroTask("queueMicrotask", c[0]);
    });
  }
  var Re = j("zoneTask");
  function ke(t, n, a, e) {
    let c = null, f = null;
    n += e, a += e;
    let g = {};
    function T(w) {
      let _ = w.data;
      _.args[0] = function() {
        return w.invoke.apply(this, arguments);
      };
      let P = c.apply(t, _.args);
      return Ke(P) ? _.handleId = P : (_.handle = P, _.isRefreshable = Je(P.refresh)), w;
    }
    function y(w) {
      let { handle: _, handleId: P } = w.data;
      return f.call(t, _ ?? P);
    }
    c = ue(t, n, (w) => function(_, P) {
      if (Je(P[0])) {
        let L = { isRefreshable: false, isPeriodic: e === "Interval", delay: e === "Timeout" || e === "Interval" ? P[1] || 0 : void 0, args: P }, H = P[0];
        P[0] = function() {
          try {
            return H.apply(this, arguments);
          } finally {
            let { handle: A, handleId: V, isPeriodic: X, isRefreshable: F } = L;
            !X && !F && (V ? delete g[V] : A && (A[Re] = null));
          }
        };
        let z = xe(n, P[0], L, T, y);
        if (!z) return z;
        let { handleId: $, handle: J, isRefreshable: q, isPeriodic: p } = z.data;
        if ($) g[$] = z;
        else if (J && (J[Re] = z, q && !p)) {
          let d = J.refresh;
          J.refresh = function() {
            let { zone: A, state: V } = z;
            return V === "notScheduled" ? (z._state = "scheduled", A._updateTaskCount(z, 1)) : V === "running" && (z._state = "scheduling"), d.call(this);
          };
        }
        return J ?? $ ?? z;
      } else return w.apply(t, P);
    }), f = ue(t, a, (w) => function(_, P) {
      let L = P[0], H;
      Ke(L) ? (H = g[L], delete g[L]) : (H = L?.[Re], H ? L[Re] = null : H = L), H?.type ? H.cancelFn && H.zone.cancelTask(H) : w.apply(t, P);
    });
  }
  function Rt(t, n) {
    let { isBrowser: a, isMix: e } = n.getGlobalObjects();
    if (!a && !e || !t.customElements || !("customElements" in t)) return;
    let c = ["connectedCallback", "disconnectedCallback", "adoptedCallback", "attributeChangedCallback", "formAssociatedCallback", "formDisabledCallback", "formResetCallback", "formStateRestoreCallback"];
    n.patchCallbacks(n, t.customElements, "customElements", "define", c);
  }
  function Ct(t, n) {
    if (Zone[n.symbol("patchEventTarget")]) return;
    let { eventNames: a, zoneSymbolEventNames: e, TRUE_STR: c, FALSE_STR: f, ZONE_SYMBOL_PREFIX: g } = n.getGlobalObjects();
    for (let y = 0; y < a.length; y++) {
      let w = a[y], _ = w + f, P = w + c, L = g + _, H = g + P;
      e[w] = {}, e[w][f] = L, e[w][c] = H;
    }
    let T = t.EventTarget;
    if (!(!T || !T.prototype)) return n.patchEventTarget(t, n, [T && T.prototype]), true;
  }
  function wt(t, n) {
    n.patchEventPrototype(t, n);
  }
  function lt(t, n, a) {
    if (!a || a.length === 0) return n;
    let e = a.filter((f) => f.target === t);
    if (e.length === 0) return n;
    let c = e[0].ignoreProperties;
    return n.filter((f) => c.indexOf(f) === -1);
  }
  function Qe(t, n, a, e) {
    if (!t) return;
    let c = lt(t, n, a);
    rt(t, c, e);
  }
  function Ie(t) {
    return Object.getOwnPropertyNames(t).filter((n) => n.startsWith("on") && n.length > 2).map((n) => n.substring(2));
  }
  function Dt(t, n) {
    if (De && !nt || Zone[t.symbol("patchEvents")]) return;
    let a = n.__Zone_ignore_on_properties, e = [];
    if (Ge) {
      let c = window;
      e = e.concat(["Document", "SVGElement", "Element", "HTMLElement", "HTMLBodyElement", "HTMLMediaElement", "HTMLFrameSetElement", "HTMLFrameElement", "HTMLIFrameElement", "HTMLMarqueeElement", "Worker"]);
      let f = [];
      Qe(c, Ie(c), a && a.concat(f), Ae(c));
    }
    e = e.concat(["XMLHttpRequest", "XMLHttpRequestEventTarget", "IDBIndex", "IDBRequest", "IDBOpenDBRequest", "IDBDatabase", "IDBTransaction", "IDBCursor", "WebSocket"]);
    for (let c = 0; c < e.length; c++) {
      let f = n[e[c]];
      f?.prototype && Qe(f.prototype, Ie(f.prototype), a);
    }
  }
  function St(t) {
    t.__load_patch("legacy", (n) => {
      let a = n[t.__symbol__("legacyPatch")];
      a && a();
    }), t.__load_patch("timers", (n) => {
      let e = "clear";
      ke(n, "set", e, "Timeout"), ke(n, "set", e, "Interval"), ke(n, "set", e, "Immediate");
    }), t.__load_patch("requestAnimationFrame", (n) => {
      ke(n, "request", "cancel", "AnimationFrame"), ke(n, "mozRequest", "mozCancel", "AnimationFrame"), ke(n, "webkitRequest", "webkitCancel", "AnimationFrame");
    }), t.__load_patch("blocking", (n, a) => {
      let e = ["alert", "prompt", "confirm"];
      for (let c = 0; c < e.length; c++) {
        let f = e[c];
        ue(n, f, (g, T, y) => function(w, _) {
          return a.current.run(g, n, _, y);
        });
      }
    }), t.__load_patch("EventTarget", (n, a, e) => {
      wt(n, e), Ct(n, e);
      let c = n.XMLHttpRequestEventTarget;
      c && c.prototype && e.patchEventTarget(n, e, [c.prototype]);
    }), t.__load_patch("MutationObserver", (n, a, e) => {
      ye("MutationObserver"), ye("WebKitMutationObserver");
    }), t.__load_patch("IntersectionObserver", (n, a, e) => {
      ye("IntersectionObserver");
    }), t.__load_patch("FileReader", (n, a, e) => {
      ye("FileReader");
    }), t.__load_patch("on_property", (n, a, e) => {
      Dt(e, n);
    }), t.__load_patch("customElements", (n, a, e) => {
      Rt(n, e);
    }), t.__load_patch("XHR", (n, a) => {
      w(n);
      let e = j("xhrTask"), c = j("xhrSync"), f = j("xhrListener"), g = j("xhrScheduled"), T = j("xhrURL"), y = j("xhrErrorBeforeScheduled");
      function w(_) {
        let P = _.XMLHttpRequest;
        if (!P) return;
        let L = P.prototype;
        function H(R) {
          return R[e];
        }
        let z = L[Ne], $ = L[Ze];
        if (!z) {
          let R = _.XMLHttpRequestEventTarget;
          if (R) {
            let b = R.prototype;
            z = b[Ne], $ = b[Ze];
          }
        }
        let J = "readystatechange", q = "scheduled";
        function p(R) {
          let b = R.data, D = b.target;
          D[g] = false, D[y] = false;
          let K = D[f];
          z || (z = D[Ne], $ = D[Ze]), K && $.call(D, J, K);
          let W = D[f] = () => {
            if (D.readyState === D.DONE) if (!b.aborted && D[g] && R.state === q) {
              let s = D[a.__symbol__("loadfalse")];
              if (D.status !== 0 && s && s.length > 0) {
                let i = R.invoke;
                R.invoke = function() {
                  let r = D[a.__symbol__("loadfalse")];
                  for (let E = 0; E < r.length; E++) r[E] === R && r.splice(E, 1);
                  !b.aborted && R.state === q && i.call(R);
                }, s.push(R);
              } else R.invoke();
            } else !b.aborted && D[g] === false && (D[y] = true);
          };
          return z.call(D, J, W), D[e] || (D[e] = R), U.apply(D, b.args), D[g] = true, R;
        }
        function d() {
        }
        function A(R) {
          let b = R.data;
          return b.aborted = true, S.apply(b.target, b.args);
        }
        let V = ue(L, "open", () => function(R, b) {
          return R[c] = b[2] == false, R[T] = b[1], V.apply(R, b);
        }), X = "XMLHttpRequest.send", F = j("fetchTaskAborting"), k = j("fetchTaskScheduling"), U = ue(L, "send", () => function(R, b) {
          if (a.current[k] === true || R[c]) return U.apply(R, b);
          {
            let D = { target: R, url: R[T], isPeriodic: false, args: b, aborted: false }, K = xe(X, d, D, p, A);
            R && R[y] === true && !D.aborted && K.state === q && K.invoke();
          }
        }), S = ue(L, "abort", () => function(R, b) {
          let D = H(R);
          if (D && typeof D.type == "string") {
            if (D.cancelFn == null || D.data && D.data.aborted) return;
            D.zone.cancelTask(D);
          } else if (a.current[F] === true) return S.apply(R, b);
        });
      }
    }), t.__load_patch("geolocation", (n) => {
      n.navigator && n.navigator.geolocation && gt(n.navigator.geolocation, ["getCurrentPosition", "watchPosition"]);
    }), t.__load_patch("PromiseRejectionEvent", (n, a) => {
      function e(c) {
        return function(f) {
          at(n, c).forEach((T) => {
            let y = n.PromiseRejectionEvent;
            if (y) {
              let w = new y(c, { promise: f.promise, reason: f.rejection });
              T.invoke(w);
            }
          });
        };
      }
      n.PromiseRejectionEvent && (a[j("unhandledPromiseRejectionHandler")] = e("unhandledrejection"), a[j("rejectionHandledHandler")] = e("rejectionhandled"));
    }), t.__load_patch("queueMicrotask", (n, a, e) => {
      Pt(n, e);
    });
  }
  function Ot(t) {
    t.__load_patch("ZoneAwarePromise", (n, a, e) => {
      let c = Object.getOwnPropertyDescriptor, f = Object.defineProperty;
      function g(h) {
        if (h && h.toString === Object.prototype.toString) {
          let l = h.constructor && h.constructor.name;
          return (l || "") + ": " + JSON.stringify(h);
        }
        return h ? h.toString() : Object.prototype.toString.call(h);
      }
      let T = e.symbol, y = [], w = n[T("DISABLE_WRAPPING_UNCAUGHT_PROMISE_REJECTION")] !== false, _ = T("Promise"), P = T("then"), L = "__creationTrace__";
      e.onUnhandledError = (h) => {
        if (e.showUncaughtError()) {
          let l = h && h.rejection;
          l ? console.error("Unhandled Promise rejection:", l instanceof Error ? l.message : l, "; Zone:", h.zone.name, "; Task:", h.task && h.task.source, "; Value:", l, l instanceof Error ? l.stack : void 0) : console.error(h);
        }
      }, e.microtaskDrainDone = () => {
        for (; y.length; ) {
          let h = y.shift();
          try {
            h.zone.runGuarded(() => {
              throw h.throwOriginal ? h.rejection : h;
            });
          } catch (l) {
            z(l);
          }
        }
      };
      let H = T("unhandledPromiseRejectionHandler");
      function z(h) {
        e.onUnhandledError(h);
        try {
          let l = a[H];
          typeof l == "function" && l.call(this, h);
        } catch {
        }
      }
      function $(h) {
        return h && typeof h.then == "function";
      }
      function J(h) {
        return h;
      }
      function q(h) {
        return M.reject(h);
      }
      let p = T("state"), d = T("value"), A = T("finally"), V = T("parentPromiseValue"), X = T("parentPromiseState"), F = "Promise.then", k = null, U = true, S = false, R = 0;
      function b(h, l) {
        return (o) => {
          try {
            I(h, l, o);
          } catch (u) {
            I(h, false, u);
          }
        };
      }
      let D = function() {
        let h = false;
        return function(o) {
          return function() {
            h || (h = true, o.apply(null, arguments));
          };
        };
      }, K = "Promise resolved with itself", W = T("currentTaskTrace");
      function I(h, l, o) {
        let u = D();
        if (h === o) throw new TypeError(K);
        if (h[p] === k) {
          let v = null;
          try {
            (typeof o == "object" || typeof o == "function") && (v = o && o.then);
          } catch (C) {
            return u(() => {
              I(h, false, C);
            })(), h;
          }
          if (l !== S && o instanceof M && o.hasOwnProperty(p) && o.hasOwnProperty(d) && o[p] !== k) i(o), I(h, o[p], o[d]);
          else if (l !== S && typeof v == "function") try {
            v.call(o, u(b(h, l)), u(b(h, false)));
          } catch (C) {
            u(() => {
              I(h, false, C);
            })();
          }
          else {
            h[p] = l;
            let C = h[d];
            if (h[d] = o, h[A] === A && l === U && (h[p] = h[X], h[d] = h[V]), l === S && o instanceof Error) {
              let m = a.currentTask && a.currentTask.data && a.currentTask.data[L];
              m && f(o, W, { configurable: true, enumerable: false, writable: true, value: m });
            }
            for (let m = 0; m < C.length; ) r(h, C[m++], C[m++], C[m++], C[m++]);
            if (C.length == 0 && l == S) {
              h[p] = R;
              let m = o;
              try {
                throw new Error("Uncaught (in promise): " + g(o) + (o && o.stack ? `
` + o.stack : ""));
              } catch (O) {
                m = O;
              }
              w && (m.throwOriginal = true), m.rejection = o, m.promise = h, m.zone = a.current, m.task = a.currentTask, y.push(m), e.scheduleMicroTask();
            }
          }
        }
        return h;
      }
      let s = T("rejectionHandledHandler");
      function i(h) {
        if (h[p] === R) {
          try {
            let l = a[s];
            l && typeof l == "function" && l.call(this, { rejection: h[d], promise: h });
          } catch {
          }
          h[p] = S;
          for (let l = 0; l < y.length; l++) h === y[l].promise && y.splice(l, 1);
        }
      }
      function r(h, l, o, u, v) {
        i(h);
        let C = h[p], m = C ? typeof u == "function" ? u : J : typeof v == "function" ? v : q;
        l.scheduleMicroTask(F, () => {
          try {
            let O = h[d], N = !!o && A === o[A];
            N && (o[V] = O, o[X] = C);
            let Z = l.run(m, void 0, N && m !== q && m !== J ? [] : [O]);
            I(o, true, Z);
          } catch (O) {
            I(o, false, O);
          }
        }, o);
      }
      let E = "function ZoneAwarePromise() { [native code] }", x = function() {
      }, ee = n.AggregateError;
      class M {
        static toString() {
          return E;
        }
        static resolve(l) {
          return l instanceof M ? l : I(new this(null), U, l);
        }
        static reject(l) {
          return I(new this(null), S, l);
        }
        static withResolvers() {
          let l = {};
          return l.promise = new M((o, u) => {
            l.resolve = o, l.reject = u;
          }), l;
        }
        static any(l) {
          if (!l || typeof l[Symbol.iterator] != "function") return Promise.reject(new ee([], "All promises were rejected"));
          let o = [], u = 0;
          try {
            for (let m of l) u++, o.push(M.resolve(m));
          } catch {
            return Promise.reject(new ee([], "All promises were rejected"));
          }
          if (u === 0) return Promise.reject(new ee([], "All promises were rejected"));
          let v = false, C = [];
          return new M((m, O) => {
            for (let N = 0; N < o.length; N++) o[N].then((Z) => {
              v || (v = true, m(Z));
            }, (Z) => {
              C.push(Z), u--, u === 0 && (v = true, O(new ee(C, "All promises were rejected")));
            });
          });
        }
        static race(l) {
          let o, u, v = new this((O, N) => {
            o = O, u = N;
          });
          function C(O) {
            o(O);
          }
          function m(O) {
            u(O);
          }
          for (let O of l) $(O) || (O = this.resolve(O)), O.then(C, m);
          return v;
        }
        static all(l) {
          return M.allWithCallback(l);
        }
        static allSettled(l) {
          return (this && this.prototype instanceof M ? this : M).allWithCallback(l, { thenCallback: (u) => ({ status: "fulfilled", value: u }), errorCallback: (u) => ({ status: "rejected", reason: u }) });
        }
        static allWithCallback(l, o) {
          let u, v, C = new this((Z, G) => {
            u = Z, v = G;
          }), m = 2, O = 0, N = [];
          for (let Z of l) {
            $(Z) || (Z = this.resolve(Z));
            let G = O;
            try {
              Z.then((B) => {
                N[G] = o ? o.thenCallback(B) : B, m--, m === 0 && u(N);
              }, (B) => {
                o ? (N[G] = o.errorCallback(B), m--, m === 0 && u(N)) : v(B);
              });
            } catch (B) {
              v(B);
            }
            m++, O++;
          }
          return m -= 2, m === 0 && u(N), C;
        }
        constructor(l) {
          let o = this;
          if (!(o instanceof M)) throw new Error("Must be an instanceof Promise.");
          o[p] = k, o[d] = [];
          try {
            let u = D();
            l && l(u(b(o, U)), u(b(o, S)));
          } catch (u) {
            I(o, false, u);
          }
        }
        get [Symbol.toStringTag]() {
          return "Promise";
        }
        get [Symbol.species]() {
          return M;
        }
        then(l, o) {
          let u = this.constructor?.[Symbol.species];
          (!u || typeof u != "function") && (u = this.constructor || M);
          let v = new u(x), C = a.current;
          return this[p] == k ? this[d].push(C, v, l, o) : r(this, C, v, l, o), v;
        }
        catch(l) {
          return this.then(null, l);
        }
        finally(l) {
          let o = this.constructor?.[Symbol.species];
          (!o || typeof o != "function") && (o = M);
          let u = new o(x);
          u[A] = A;
          let v = a.current;
          return this[p] == k ? this[d].push(v, u, l, l) : r(this, v, u, l, l), u;
        }
      }
      M.resolve = M.resolve, M.reject = M.reject, M.race = M.race, M.all = M.all;
      let he = n[_] = n.Promise;
      n.Promise = M;
      let _e = T("thenPatched");
      function Q(h) {
        let l = h.prototype, o = c(l, "then");
        if (o && (o.writable === false || !o.configurable)) return;
        let u = l.then;
        l[P] = u, h.prototype.then = function(v, C) {
          return new M((O, N) => {
            u.call(this, O, N);
          }).then(v, C);
        }, h[_e] = true;
      }
      e.patchThen = Q;
      function Te(h) {
        return function(l, o) {
          let u = h.apply(l, o);
          if (u instanceof M) return u;
          let v = u.constructor;
          return v[_e] || Q(v), u;
        };
      }
      return he && (Q(he), ue(n, "fetch", (h) => Te(h))), Promise[a.__symbol__("uncaughtPromiseErrors")] = y, M;
    });
  }
  function Nt(t) {
    t.__load_patch("toString", (n) => {
      let a = Function.prototype.toString, e = j("OriginalDelegate"), c = j("Promise"), f = j("Error"), g = function() {
        if (typeof this == "function") {
          let _ = this[e];
          if (_) return typeof _ == "function" ? a.call(_) : Object.prototype.toString.call(_);
          if (this === Promise) {
            let P = n[c];
            if (P) return a.call(P);
          }
          if (this === Error) {
            let P = n[f];
            if (P) return a.call(P);
          }
        }
        return a.call(this);
      };
      g[e] = a, Function.prototype.toString = g;
      let T = Object.prototype.toString, y = "[object Promise]";
      Object.prototype.toString = function() {
        return typeof Promise == "function" && this instanceof Promise ? y : T.call(this);
      };
    });
  }
  function Zt(t, n, a, e, c) {
    let f = Zone.__symbol__(e);
    if (n[f]) return;
    let g = n[f] = n[e];
    n[e] = function(T, y, w) {
      return y && y.prototype && c.forEach(function(_) {
        let P = `${a}.${e}::` + _, L = y.prototype;
        try {
          if (L.hasOwnProperty(_)) {
            let H = t.ObjectGetOwnPropertyDescriptor(L, _);
            H && H.value ? (H.value = t.wrapWithCurrentZone(H.value, P), t._redefineProperty(y.prototype, _, H)) : L[_] && (L[_] = t.wrapWithCurrentZone(L[_], P));
          } else L[_] && (L[_] = t.wrapWithCurrentZone(L[_], P));
        } catch {
        }
      }), g.call(n, T, y, w);
    }, t.attachOriginToPatched(n[e], g);
  }
  function Lt(t) {
    t.__load_patch("util", (n, a, e) => {
      let c = Ie(n);
      e.patchOnProperties = rt, e.patchMethod = ue, e.bindArguments = Fe, e.patchMacroTask = mt;
      let f = a.__symbol__("BLACK_LISTED_EVENTS"), g = a.__symbol__("UNPATCHED_EVENTS");
      n[g] && (n[f] = n[g]), n[f] && (a[f] = a[g] = n[f]), e.patchEventPrototype = bt, e.patchEventTarget = vt, e.isIEOrEdge = yt, e.ObjectDefineProperty = Me, e.ObjectGetOwnPropertyDescriptor = pe, e.ObjectCreate = _t, e.ArraySlice = Tt, e.patchClass = ye, e.wrapWithCurrentZone = Ve, e.filterProperties = lt, e.attachOriginToPatched = fe, e._redefineProperty = Object.defineProperty, e.patchCallbacks = Zt, e.getGlobalObjects = () => ({ globalSources: ot, zoneSymbolEventNames: ne, eventNames: c, isBrowser: Ge, isMix: nt, isNode: De, TRUE_STR: ae, FALSE_STR: le, ZONE_SYMBOL_PREFIX: ve, ADD_EVENT_LISTENER_STR: je, REMOVE_EVENT_LISTENER_STR: He });
    });
  }
  function It(t) {
    Ot(t), Nt(t), Lt(t);
  }
  var ut = dt();
  It(ut);
  St(ut);
})();

;
(() => {
  var Dd = Object.defineProperty;
  var Ed = Object.defineProperties;
  var wd = Object.getOwnPropertyDescriptors;
  var Zs = Object.getOwnPropertySymbols;
  var Cd = Object.prototype.hasOwnProperty;
  var Md = Object.prototype.propertyIsEnumerable;
  var Qs = (e, t, n) => t in e ? Dd(e, t, { enumerable: true, configurable: true, writable: true, value: n }) : e[t] = n;
  var E = (e, t) => {
    for (var n in t ||= {}) Cd.call(t, n) && Qs(e, n, t[n]);
    if (Zs) for (var n of Zs(t)) Md.call(t, n) && Qs(e, n, t[n]);
    return e;
  };
  var B = (e, t) => Ed(e, wd(t));
  var g = (e, t) => () => (e && (t = e(e = 0)), t);
  var Sd = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports);
  var cn = (e, t, n) => new Promise((r, o) => {
    var i = (l) => {
      try {
        a(n.next(l));
      } catch (c) {
        o(c);
      }
    }, s = (l) => {
      try {
        a(n.throw(l));
      } catch (c) {
        o(c);
      }
    }, a = (l) => l.done ? r(l.value) : Promise.resolve(l.value).then(i, s);
    a((n = n.apply(e, t)).next());
  });
  function Hr(e, t) {
    return Object.is(e, t);
  }
  function y(e) {
    let t = j;
    return j = e, t;
  }
  function Br() {
    return j;
  }
  function fn(e) {
    if (un) throw new Error("");
    if (j === null) return;
    j.consumerOnSignalRead(e);
    let t = j.nextProducerIndex++;
    if (gn(j), t < j.producerNode.length && j.producerNode[t] !== e && Dt(j)) {
      let n = j.producerNode[t];
      pn(n, j.producerIndexOfThis[t]);
    }
    j.producerNode[t] !== e && (j.producerNode[t] = e, j.producerIndexOfThis[t] = Dt(j) ? Ks(e, j, t) : 0), j.producerLastReadVersion[t] = e.version;
  }
  function Ys() {
    $r++;
  }
  function Ur(e) {
    if (!(Dt(e) && !e.dirty) && !(!e.dirty && e.lastCleanEpoch === $r)) {
      if (!e.producerMustRecompute(e) && !qr(e)) {
        jr(e);
        return;
      }
      e.producerRecomputeValue(e), jr(e);
    }
  }
  function Gr(e) {
    if (e.liveConsumerNode === void 0) return;
    let t = un;
    un = true;
    try {
      for (let n of e.liveConsumerNode) n.dirty || Td(n);
    } finally {
      un = t;
    }
  }
  function zr() {
    return j?.consumerAllowSignalWrites !== false;
  }
  function Td(e) {
    e.dirty = true, Gr(e), e.consumerMarkedDirty?.(e);
  }
  function jr(e) {
    e.dirty = false, e.lastCleanEpoch = $r;
  }
  function hn(e) {
    return e && (e.nextProducerIndex = 0), y(e);
  }
  function Wr(e, t) {
    if (y(t), !(!e || e.producerNode === void 0 || e.producerIndexOfThis === void 0 || e.producerLastReadVersion === void 0)) {
      if (Dt(e)) for (let n = e.nextProducerIndex; n < e.producerNode.length; n++) pn(e.producerNode[n], e.producerIndexOfThis[n]);
      for (; e.producerNode.length > e.nextProducerIndex; ) e.producerNode.pop(), e.producerLastReadVersion.pop(), e.producerIndexOfThis.pop();
    }
  }
  function qr(e) {
    gn(e);
    for (let t = 0; t < e.producerNode.length; t++) {
      let n = e.producerNode[t], r = e.producerLastReadVersion[t];
      if (r !== n.version || (Ur(n), r !== n.version)) return true;
    }
    return false;
  }
  function Zr(e) {
    if (gn(e), Dt(e)) for (let t = 0; t < e.producerNode.length; t++) pn(e.producerNode[t], e.producerIndexOfThis[t]);
    e.producerNode.length = e.producerLastReadVersion.length = e.producerIndexOfThis.length = 0, e.liveConsumerNode && (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0);
  }
  function Ks(e, t, n) {
    if (Js(e), e.liveConsumerNode.length === 0 && Xs(e)) for (let r = 0; r < e.producerNode.length; r++) e.producerIndexOfThis[r] = Ks(e.producerNode[r], e, r);
    return e.liveConsumerIndexOfThis.push(n), e.liveConsumerNode.push(t) - 1;
  }
  function pn(e, t) {
    if (Js(e), e.liveConsumerNode.length === 1 && Xs(e)) for (let r = 0; r < e.producerNode.length; r++) pn(e.producerNode[r], e.producerIndexOfThis[r]);
    let n = e.liveConsumerNode.length - 1;
    if (e.liveConsumerNode[t] = e.liveConsumerNode[n], e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n], e.liveConsumerNode.length--, e.liveConsumerIndexOfThis.length--, t < e.liveConsumerNode.length) {
      let r = e.liveConsumerIndexOfThis[t], o = e.liveConsumerNode[t];
      gn(o), o.producerIndexOfThis[r] = t;
    }
  }
  function Dt(e) {
    return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0;
  }
  function gn(e) {
    e.producerNode ??= [], e.producerIndexOfThis ??= [], e.producerLastReadVersion ??= [];
  }
  function Js(e) {
    e.liveConsumerNode ??= [], e.liveConsumerIndexOfThis ??= [];
  }
  function Xs(e) {
    return e.producerNode !== void 0;
  }
  function Qr(e, t) {
    let n = Object.create(xd);
    n.computation = e, t !== void 0 && (n.equal = t);
    let r = () => {
      if (Ur(n), fn(n), n.value === dn) throw n.error;
      return n.value;
    };
    return r[ce] = n, r;
  }
  function Nd() {
    throw new Error();
  }
  function ta(e) {
    ea(e);
  }
  function Yr(e) {
    ea = e;
  }
  function Kr(e, t) {
    let n = Object.create(Xr);
    n.value = e, t !== void 0 && (n.equal = t);
    let r = () => (fn(n), n.value);
    return r[ce] = n, r;
  }
  function mn(e, t) {
    zr() || ta(e), e.equal(e.value, t) || (e.value = t, Ad(e));
  }
  function Jr(e, t) {
    zr() || ta(e), mn(e, t(e.value));
  }
  function Ad(e) {
    e.version++, Ys(), Gr(e), kd?.();
  }
  var j;
  var un;
  var $r;
  var ce;
  var Et;
  var Lr;
  var Vr;
  var dn;
  var xd;
  var ea;
  var kd;
  var Xr;
  var eo = g(() => {
    "use strict";
    j = null, un = false, $r = 1, ce = /* @__PURE__ */ Symbol("SIGNAL");
    Et = { version: 0, lastCleanEpoch: 0, dirty: false, producerNode: void 0, producerLastReadVersion: void 0, producerIndexOfThis: void 0, nextProducerIndex: 0, liveConsumerNode: void 0, liveConsumerIndexOfThis: void 0, consumerAllowSignalWrites: false, consumerIsAlwaysLive: false, kind: "unknown", producerMustRecompute: () => false, producerRecomputeValue: () => {
    }, consumerMarkedDirty: () => {
    }, consumerOnSignalRead: () => {
    } };
    Lr = /* @__PURE__ */ Symbol("UNSET"), Vr = /* @__PURE__ */ Symbol("COMPUTING"), dn = /* @__PURE__ */ Symbol("ERRORED"), xd = B(E({}, Et), { value: Lr, dirty: true, error: null, equal: Hr, kind: "computed", producerMustRecompute(e) {
      return e.value === Lr || e.value === Vr;
    }, producerRecomputeValue(e) {
      if (e.value === Vr) throw new Error("Detected cycle in computations.");
      let t = e.value;
      e.value = Vr;
      let n = hn(e), r, o = false;
      try {
        r = e.computation(), y(null), o = t !== Lr && t !== dn && r !== dn && e.equal(t, r);
      } catch (i) {
        r = dn, e.error = i;
      } finally {
        Wr(e, n);
      }
      if (o) {
        e.value = t;
        return;
      }
      e.value = r, e.version++;
    } });
    ea = Nd;
    kd = null;
    Xr = B(E({}, Et), { equal: Hr, value: void 0, kind: "signal" });
  });
  function wt() {
    return to;
  }
  function Ie(e) {
    let t = to;
    return to = e, t;
  }
  var to;
  var vn;
  var no = g(() => {
    "use strict";
    vn = /* @__PURE__ */ Symbol("NotFound");
  });
  var na = g(() => {
    "use strict";
    eo();
  });
  function M(e) {
    return typeof e == "function";
  }
  var q = g(() => {
    "use strict";
  });
  function yn(e) {
    let n = e((r) => {
      Error.call(r), r.stack = new Error().stack;
    });
    return n.prototype = Object.create(Error.prototype), n.prototype.constructor = n, n;
  }
  var ro = g(() => {
    "use strict";
  });
  var _n;
  var ra = g(() => {
    "use strict";
    ro();
    _n = yn((e) => function(n) {
      e(this), this.message = n ? `${n.length} errors occurred during unsubscription:
${n.map((r, o) => `${o + 1}) ${r.toString()}`).join(`
  `)}` : "", this.name = "UnsubscriptionError", this.errors = n;
    });
  });
  function Ct(e, t) {
    if (e) {
      let n = e.indexOf(t);
      0 <= n && e.splice(n, 1);
    }
  }
  var oo = g(() => {
    "use strict";
  });
  function In(e) {
    return e instanceof G || e && "closed" in e && M(e.remove) && M(e.add) && M(e.unsubscribe);
  }
  function oa(e) {
    M(e) ? e() : e.unsubscribe();
  }
  var G;
  var io;
  var Mt = g(() => {
    "use strict";
    q();
    ra();
    oo();
    G = class e {
      constructor(t) {
        this.initialTeardown = t, this.closed = false, this._parentage = null, this._finalizers = null;
      }
      unsubscribe() {
        let t;
        if (!this.closed) {
          this.closed = true;
          let { _parentage: n } = this;
          if (n) if (this._parentage = null, Array.isArray(n)) for (let i of n) i.remove(this);
          else n.remove(this);
          let { initialTeardown: r } = this;
          if (M(r)) try {
            r();
          } catch (i) {
            t = i instanceof _n ? i.errors : [i];
          }
          let { _finalizers: o } = this;
          if (o) {
            this._finalizers = null;
            for (let i of o) try {
              oa(i);
            } catch (s) {
              t = t ?? [], s instanceof _n ? t = [...t, ...s.errors] : t.push(s);
            }
          }
          if (t) throw new _n(t);
        }
      }
      add(t) {
        var n;
        if (t && t !== this) if (this.closed) oa(t);
        else {
          if (t instanceof e) {
            if (t.closed || t._hasParent(this)) return;
            t._addParent(this);
          }
          (this._finalizers = (n = this._finalizers) !== null && n !== void 0 ? n : []).push(t);
        }
      }
      _hasParent(t) {
        let { _parentage: n } = this;
        return n === t || Array.isArray(n) && n.includes(t);
      }
      _addParent(t) {
        let { _parentage: n } = this;
        this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t;
      }
      _removeParent(t) {
        let { _parentage: n } = this;
        n === t ? this._parentage = null : Array.isArray(n) && Ct(n, t);
      }
      remove(t) {
        let { _finalizers: n } = this;
        n && Ct(n, t), t instanceof e && t._removeParent(this);
      }
    };
    G.EMPTY = (() => {
      let e = new G();
      return e.closed = true, e;
    })();
    io = G.EMPTY;
  });
  var oe;
  var St = g(() => {
    "use strict";
    oe = { onUnhandledError: null, onStoppedNotification: null, Promise: void 0, useDeprecatedSynchronousErrorHandling: false, useDeprecatedNextContext: false };
  });
  var Ye;
  var so = g(() => {
    "use strict";
    Ye = { setTimeout(e, t, ...n) {
      let { delegate: r } = Ye;
      return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n);
    }, clearTimeout(e) {
      let { delegate: t } = Ye;
      return (t?.clearTimeout || clearTimeout)(e);
    }, delegate: void 0 };
  });
  function bn(e) {
    Ye.setTimeout(() => {
      let { onUnhandledError: t } = oe;
      if (t) t(e);
      else throw e;
    });
  }
  var ao = g(() => {
    "use strict";
    St();
    so();
  });
  function lo() {
  }
  var ia = g(() => {
    "use strict";
  });
  function aa(e) {
    return co("E", void 0, e);
  }
  function la(e) {
    return co("N", e, void 0);
  }
  function co(e, t, n) {
    return { kind: e, value: t, error: n };
  }
  var sa;
  var ca = g(() => {
    "use strict";
    sa = co("C", void 0, void 0);
  });
  function Ke(e) {
    if (oe.useDeprecatedSynchronousErrorHandling) {
      let t = !Oe;
      if (t && (Oe = { errorThrown: false, error: null }), e(), t) {
        let { errorThrown: n, error: r } = Oe;
        if (Oe = null, n) throw r;
      }
    } else e();
  }
  function ua(e) {
    oe.useDeprecatedSynchronousErrorHandling && Oe && (Oe.errorThrown = true, Oe.error = e);
  }
  var Oe;
  var Dn = g(() => {
    "use strict";
    St();
    Oe = null;
  });
  function uo(e, t) {
    return Ld.call(e, t);
  }
  function En(e) {
    oe.useDeprecatedSynchronousErrorHandling ? ua(e) : bn(e);
  }
  function Vd(e) {
    throw e;
  }
  function fo(e, t) {
    let { onStoppedNotification: n } = oe;
    n && Ye.setTimeout(() => n(e, t));
  }
  var Pe;
  var Ld;
  var ho;
  var Je;
  var jd;
  var po = g(() => {
    "use strict";
    q();
    Mt();
    St();
    ao();
    ia();
    ca();
    so();
    Dn();
    Pe = class extends G {
      constructor(t) {
        super(), this.isStopped = false, t ? (this.destination = t, In(t) && t.add(this)) : this.destination = jd;
      }
      static create(t, n, r) {
        return new Je(t, n, r);
      }
      next(t) {
        this.isStopped ? fo(la(t), this) : this._next(t);
      }
      error(t) {
        this.isStopped ? fo(aa(t), this) : (this.isStopped = true, this._error(t));
      }
      complete() {
        this.isStopped ? fo(sa, this) : (this.isStopped = true, this._complete());
      }
      unsubscribe() {
        this.closed || (this.isStopped = true, super.unsubscribe(), this.destination = null);
      }
      _next(t) {
        this.destination.next(t);
      }
      _error(t) {
        try {
          this.destination.error(t);
        } finally {
          this.unsubscribe();
        }
      }
      _complete() {
        try {
          this.destination.complete();
        } finally {
          this.unsubscribe();
        }
      }
    }, Ld = Function.prototype.bind;
    ho = class {
      constructor(t) {
        this.partialObserver = t;
      }
      next(t) {
        let { partialObserver: n } = this;
        if (n.next) try {
          n.next(t);
        } catch (r) {
          En(r);
        }
      }
      error(t) {
        let { partialObserver: n } = this;
        if (n.error) try {
          n.error(t);
        } catch (r) {
          En(r);
        }
        else En(t);
      }
      complete() {
        let { partialObserver: t } = this;
        if (t.complete) try {
          t.complete();
        } catch (n) {
          En(n);
        }
      }
    }, Je = class extends Pe {
      constructor(t, n, r) {
        super();
        let o;
        if (M(t) || !t) o = { next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0 };
        else {
          let i;
          this && oe.useDeprecatedNextContext ? (i = Object.create(t), i.unsubscribe = () => this.unsubscribe(), o = { next: t.next && uo(t.next, i), error: t.error && uo(t.error, i), complete: t.complete && uo(t.complete, i) }) : o = t;
        }
        this.destination = new ho(o);
      }
    };
    jd = { closed: true, next: lo, error: Vd, complete: lo };
  });
  var Xe;
  var wn = g(() => {
    "use strict";
    Xe = typeof Symbol == "function" && Symbol.observable || "@@observable";
  });
  function Cn(e) {
    return e;
  }
  var go = g(() => {
    "use strict";
  });
  function da(e) {
    return e.length === 0 ? Cn : e.length === 1 ? e[0] : function(n) {
      return e.reduce((r, o) => o(r), n);
    };
  }
  var fa = g(() => {
    "use strict";
    go();
  });
  function ha(e) {
    var t;
    return (t = e ?? oe.Promise) !== null && t !== void 0 ? t : Promise;
  }
  function Hd(e) {
    return e && M(e.next) && M(e.error) && M(e.complete);
  }
  function $d(e) {
    return e && e instanceof Pe || Hd(e) && In(e);
  }
  var O;
  var Se = g(() => {
    "use strict";
    po();
    Mt();
    wn();
    fa();
    St();
    q();
    Dn();
    O = (() => {
      class e {
        constructor(n) {
          n && (this._subscribe = n);
        }
        lift(n) {
          let r = new e();
          return r.source = this, r.operator = n, r;
        }
        subscribe(n, r, o) {
          let i = $d(n) ? n : new Je(n, r, o);
          return Ke(() => {
            let { operator: s, source: a } = this;
            i.add(s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i));
          }), i;
        }
        _trySubscribe(n) {
          try {
            return this._subscribe(n);
          } catch (r) {
            n.error(r);
          }
        }
        forEach(n, r) {
          return r = ha(r), new r((o, i) => {
            let s = new Je({ next: (a) => {
              try {
                n(a);
              } catch (l) {
                i(l), s.unsubscribe();
              }
            }, error: i, complete: o });
            this.subscribe(s);
          });
        }
        _subscribe(n) {
          var r;
          return (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(n);
        }
        [Xe]() {
          return this;
        }
        pipe(...n) {
          return da(n)(this);
        }
        toPromise(n) {
          return n = ha(n), new n((r, o) => {
            let i;
            this.subscribe((s) => i = s, (s) => o(s), () => r(i));
          });
        }
      }
      return e.create = (t) => new e(t), e;
    })();
  });
  function Bd(e) {
    return M(e?.lift);
  }
  function ue(e) {
    return (t) => {
      if (Bd(t)) return t.lift(function(n) {
        try {
          return e(n, this);
        } catch (r) {
          this.error(r);
        }
      });
      throw new TypeError("Unable to lift unknown Observable type");
    };
  }
  var et = g(() => {
    "use strict";
    q();
  });
  function de(e, t, n, r, o) {
    return new mo(e, t, n, r, o);
  }
  var mo;
  var Tt = g(() => {
    "use strict";
    po();
    mo = class extends Pe {
      constructor(t, n, r, o, i, s) {
        super(t), this.onFinalize = i, this.shouldUnsubscribe = s, this._next = n ? function(a) {
          try {
            n(a);
          } catch (l) {
            t.error(l);
          }
        } : super._next, this._error = o ? function(a) {
          try {
            o(a);
          } catch (l) {
            t.error(l);
          } finally {
            this.unsubscribe();
          }
        } : super._error, this._complete = r ? function() {
          try {
            r();
          } catch (a) {
            t.error(a);
          } finally {
            this.unsubscribe();
          }
        } : super._complete;
      }
      unsubscribe() {
        var t;
        if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
          let { closed: n } = this;
          super.unsubscribe(), !n && ((t = this.onFinalize) === null || t === void 0 || t.call(this));
        }
      }
    };
  });
  var pa;
  var ga = g(() => {
    "use strict";
    ro();
    pa = yn((e) => function() {
      e(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed";
    });
  });
  var be;
  var Mn;
  var Sn = g(() => {
    "use strict";
    Se();
    Mt();
    ga();
    oo();
    Dn();
    be = (() => {
      class e extends O {
        constructor() {
          super(), this.closed = false, this.currentObservers = null, this.observers = [], this.isStopped = false, this.hasError = false, this.thrownError = null;
        }
        lift(n) {
          let r = new Mn(this, this);
          return r.operator = n, r;
        }
        _throwIfClosed() {
          if (this.closed) throw new pa();
        }
        next(n) {
          Ke(() => {
            if (this._throwIfClosed(), !this.isStopped) {
              this.currentObservers || (this.currentObservers = Array.from(this.observers));
              for (let r of this.currentObservers) r.next(n);
            }
          });
        }
        error(n) {
          Ke(() => {
            if (this._throwIfClosed(), !this.isStopped) {
              this.hasError = this.isStopped = true, this.thrownError = n;
              let { observers: r } = this;
              for (; r.length; ) r.shift().error(n);
            }
          });
        }
        complete() {
          Ke(() => {
            if (this._throwIfClosed(), !this.isStopped) {
              this.isStopped = true;
              let { observers: n } = this;
              for (; n.length; ) n.shift().complete();
            }
          });
        }
        unsubscribe() {
          this.isStopped = this.closed = true, this.observers = this.currentObservers = null;
        }
        get observed() {
          var n;
          return ((n = this.observers) === null || n === void 0 ? void 0 : n.length) > 0;
        }
        _trySubscribe(n) {
          return this._throwIfClosed(), super._trySubscribe(n);
        }
        _subscribe(n) {
          return this._throwIfClosed(), this._checkFinalizedStatuses(n), this._innerSubscribe(n);
        }
        _innerSubscribe(n) {
          let { hasError: r, isStopped: o, observers: i } = this;
          return r || o ? io : (this.currentObservers = null, i.push(n), new G(() => {
            this.currentObservers = null, Ct(i, n);
          }));
        }
        _checkFinalizedStatuses(n) {
          let { hasError: r, thrownError: o, isStopped: i } = this;
          r ? n.error(o) : i && n.complete();
        }
        asObservable() {
          let n = new O();
          return n.source = this, n;
        }
      }
      return e.create = (t, n) => new Mn(t, n), e;
    })(), Mn = class extends be {
      constructor(t, n) {
        super(), this.destination = t, this.source = n;
      }
      next(t) {
        var n, r;
        (r = (n = this.destination) === null || n === void 0 ? void 0 : n.next) === null || r === void 0 || r.call(n, t);
      }
      error(t) {
        var n, r;
        (r = (n = this.destination) === null || n === void 0 ? void 0 : n.error) === null || r === void 0 || r.call(n, t);
      }
      complete() {
        var t, n;
        (n = (t = this.destination) === null || t === void 0 ? void 0 : t.complete) === null || n === void 0 || n.call(t);
      }
      _subscribe(t) {
        var n, r;
        return (r = (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(t)) !== null && r !== void 0 ? r : io;
      }
    };
  });
  var xt;
  var ma = g(() => {
    "use strict";
    Sn();
    xt = class extends be {
      constructor(t) {
        super(), this._value = t;
      }
      get value() {
        return this.getValue();
      }
      _subscribe(t) {
        let n = super._subscribe(t);
        return !n.closed && t.next(this._value), n;
      }
      getValue() {
        let { hasError: t, thrownError: n, _value: r } = this;
        if (t) throw n;
        return this._throwIfClosed(), r;
      }
      next(t) {
        super.next(this._value = t);
      }
    };
  });
  var vo;
  var va = g(() => {
    "use strict";
    vo = { now() {
      return (vo.delegate || Date).now();
    }, delegate: void 0 };
  });
  var Nt;
  var ya = g(() => {
    "use strict";
    Sn();
    va();
    Nt = class extends be {
      constructor(t = 1 / 0, n = 1 / 0, r = vo) {
        super(), this._bufferSize = t, this._windowTime = n, this._timestampProvider = r, this._buffer = [], this._infiniteTimeWindow = true, this._infiniteTimeWindow = n === 1 / 0, this._bufferSize = Math.max(1, t), this._windowTime = Math.max(1, n);
      }
      next(t) {
        let { isStopped: n, _buffer: r, _infiniteTimeWindow: o, _timestampProvider: i, _windowTime: s } = this;
        n || (r.push(t), !o && r.push(i.now() + s)), this._trimBuffer(), super.next(t);
      }
      _subscribe(t) {
        this._throwIfClosed(), this._trimBuffer();
        let n = this._innerSubscribe(t), { _infiniteTimeWindow: r, _buffer: o } = this, i = o.slice();
        for (let s = 0; s < i.length && !t.closed; s += r ? 1 : 2) t.next(i[s]);
        return this._checkFinalizedStatuses(t), n;
      }
      _trimBuffer() {
        let { _bufferSize: t, _timestampProvider: n, _buffer: r, _infiniteTimeWindow: o } = this, i = (o ? 1 : 2) * t;
        if (t < 1 / 0 && i < r.length && r.splice(0, r.length - i), !o) {
          let s = n.now(), a = 0;
          for (let l = 1; l < r.length && r[l] <= s; l += 2) a = l;
          a && r.splice(0, a + 1);
        }
      }
    };
  });
  var _a;
  var Ia = g(() => {
    "use strict";
    Se();
    _a = new O((e) => e.complete());
  });
  function ba(e) {
    return e && M(e.schedule);
  }
  var Da = g(() => {
    "use strict";
    q();
  });
  function Ea(e) {
    return e[e.length - 1];
  }
  function wa(e) {
    return ba(Ea(e)) ? e.pop() : void 0;
  }
  function Ca(e, t) {
    return typeof Ea(e) == "number" ? e.pop() : t;
  }
  var Ma = g(() => {
    "use strict";
    Da();
  });
  function Ta(e, t, n, r) {
    function o(i) {
      return i instanceof n ? i : new n(function(s) {
        s(i);
      });
    }
    return new (n || (n = Promise))(function(i, s) {
      function a(u) {
        try {
          c(r.next(u));
        } catch (f) {
          s(f);
        }
      }
      function l(u) {
        try {
          c(r.throw(u));
        } catch (f) {
          s(f);
        }
      }
      function c(u) {
        u.done ? i(u.value) : o(u.value).then(a, l);
      }
      c((r = r.apply(e, t || [])).next());
    });
  }
  function Sa(e) {
    var t = typeof Symbol == "function" && Symbol.iterator, n = t && e[t], r = 0;
    if (n) return n.call(e);
    if (e && typeof e.length == "number") return { next: function() {
      return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e };
    } };
    throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function Fe(e) {
    return this instanceof Fe ? (this.v = e, this) : new Fe(e);
  }
  function xa(e, t, n) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var r = n.apply(e, t || []), o, i = [];
    return o = Object.create((typeof AsyncIterator == "function" ? AsyncIterator : Object).prototype), a("next"), a("throw"), a("return", s), o[Symbol.asyncIterator] = function() {
      return this;
    }, o;
    function s(d) {
      return function(p) {
        return Promise.resolve(p).then(d, f);
      };
    }
    function a(d, p) {
      r[d] && (o[d] = function(m) {
        return new Promise(function(T, I) {
          i.push([d, m, T, I]) > 1 || l(d, m);
        });
      }, p && (o[d] = p(o[d])));
    }
    function l(d, p) {
      try {
        c(r[d](p));
      } catch (m) {
        h(i[0][3], m);
      }
    }
    function c(d) {
      d.value instanceof Fe ? Promise.resolve(d.value.v).then(u, f) : h(i[0][2], d);
    }
    function u(d) {
      l("next", d);
    }
    function f(d) {
      l("throw", d);
    }
    function h(d, p) {
      d(p), i.shift(), i.length && l(i[0][0], i[0][1]);
    }
  }
  function Na(e) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var t = e[Symbol.asyncIterator], n;
    return t ? t.call(e) : (e = typeof Sa == "function" ? Sa(e) : e[Symbol.iterator](), n = {}, r("next"), r("throw"), r("return"), n[Symbol.asyncIterator] = function() {
      return this;
    }, n);
    function r(i) {
      n[i] = e[i] && function(s) {
        return new Promise(function(a, l) {
          s = e[i](s), o(a, l, s.done, s.value);
        });
      };
    }
    function o(i, s, a, l) {
      Promise.resolve(l).then(function(c) {
        i({ value: c, done: a });
      }, s);
    }
  }
  var yo = g(() => {
    "use strict";
  });
  var Tn;
  var _o = g(() => {
    "use strict";
    Tn = (e) => e && typeof e.length == "number" && typeof e != "function";
  });
  function xn(e) {
    return M(e?.then);
  }
  var Io = g(() => {
    "use strict";
    q();
  });
  function Nn(e) {
    return M(e[Xe]);
  }
  var bo = g(() => {
    "use strict";
    wn();
    q();
  });
  function kn(e) {
    return Symbol.asyncIterator && M(e?.[Symbol.asyncIterator]);
  }
  var Do = g(() => {
    "use strict";
    q();
  });
  function An(e) {
    return new TypeError(`You provided ${e !== null && typeof e == "object" ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`);
  }
  var Eo = g(() => {
    "use strict";
  });
  function Ud() {
    return typeof Symbol != "function" || !Symbol.iterator ? "@@iterator" : Symbol.iterator;
  }
  var Rn;
  var wo = g(() => {
    "use strict";
    Rn = Ud();
  });
  function On(e) {
    return M(e?.[Rn]);
  }
  var Co = g(() => {
    "use strict";
    wo();
    q();
  });
  function Pn(e) {
    return xa(this, arguments, function* () {
      let n = e.getReader();
      try {
        for (; ; ) {
          let { value: r, done: o } = yield Fe(n.read());
          if (o) return yield Fe(void 0);
          yield yield Fe(r);
        }
      } finally {
        n.releaseLock();
      }
    });
  }
  function Fn(e) {
    return M(e?.getReader);
  }
  var Ln = g(() => {
    "use strict";
    yo();
    q();
  });
  function Z(e) {
    if (e instanceof O) return e;
    if (e != null) {
      if (Nn(e)) return Gd(e);
      if (Tn(e)) return zd(e);
      if (xn(e)) return Wd(e);
      if (kn(e)) return ka(e);
      if (On(e)) return qd(e);
      if (Fn(e)) return Zd(e);
    }
    throw An(e);
  }
  function Gd(e) {
    return new O((t) => {
      let n = e[Xe]();
      if (M(n.subscribe)) return n.subscribe(t);
      throw new TypeError("Provided object does not correctly implement Symbol.observable");
    });
  }
  function zd(e) {
    return new O((t) => {
      for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
      t.complete();
    });
  }
  function Wd(e) {
    return new O((t) => {
      e.then((n) => {
        t.closed || (t.next(n), t.complete());
      }, (n) => t.error(n)).then(null, bn);
    });
  }
  function qd(e) {
    return new O((t) => {
      for (let n of e) if (t.next(n), t.closed) return;
      t.complete();
    });
  }
  function ka(e) {
    return new O((t) => {
      Qd(e, t).catch((n) => t.error(n));
    });
  }
  function Zd(e) {
    return ka(Pn(e));
  }
  function Qd(e, t) {
    var n, r, o, i;
    return Ta(this, void 0, void 0, function* () {
      try {
        for (n = Na(e); r = yield n.next(), !r.done; ) {
          let s = r.value;
          if (t.next(s), t.closed) return;
        }
      } catch (s) {
        o = { error: s };
      } finally {
        try {
          r && !r.done && (i = n.return) && (yield i.call(n));
        } finally {
          if (o) throw o.error;
        }
      }
      t.complete();
    });
  }
  var Te = g(() => {
    "use strict";
    yo();
    _o();
    Io();
    Se();
    bo();
    Do();
    Eo();
    Co();
    Ln();
    q();
    ao();
    wn();
  });
  function Y(e, t, n, r = 0, o = false) {
    let i = t.schedule(function() {
      n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe();
    }, r);
    if (e.add(i), !o) return i;
  }
  var kt = g(() => {
    "use strict";
  });
  function Vn(e, t = 0) {
    return ue((n, r) => {
      n.subscribe(de(r, (o) => Y(r, e, () => r.next(o), t), () => Y(r, e, () => r.complete(), t), (o) => Y(r, e, () => r.error(o), t)));
    });
  }
  var Mo = g(() => {
    "use strict";
    kt();
    et();
    Tt();
  });
  function jn(e, t = 0) {
    return ue((n, r) => {
      r.add(e.schedule(() => n.subscribe(r), t));
    });
  }
  var So = g(() => {
    "use strict";
    et();
  });
  function Aa(e, t) {
    return Z(e).pipe(jn(t), Vn(t));
  }
  var Ra = g(() => {
    "use strict";
    Te();
    Mo();
    So();
  });
  function Oa(e, t) {
    return Z(e).pipe(jn(t), Vn(t));
  }
  var Pa = g(() => {
    "use strict";
    Te();
    Mo();
    So();
  });
  function Fa(e, t) {
    return new O((n) => {
      let r = 0;
      return t.schedule(function() {
        r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule());
      });
    });
  }
  var La = g(() => {
    "use strict";
    Se();
  });
  function Va(e, t) {
    return new O((n) => {
      let r;
      return Y(n, t, () => {
        r = e[Rn](), Y(n, t, () => {
          let o, i;
          try {
            ({ value: o, done: i } = r.next());
          } catch (s) {
            n.error(s);
            return;
          }
          i ? n.complete() : n.next(o);
        }, 0, true);
      }), () => M(r?.return) && r.return();
    });
  }
  var ja = g(() => {
    "use strict";
    Se();
    wo();
    q();
    kt();
  });
  function Hn(e, t) {
    if (!e) throw new Error("Iterable cannot be null");
    return new O((n) => {
      Y(n, t, () => {
        let r = e[Symbol.asyncIterator]();
        Y(n, t, () => {
          r.next().then((o) => {
            o.done ? n.complete() : n.next(o.value);
          });
        }, 0, true);
      });
    });
  }
  var To = g(() => {
    "use strict";
    Se();
    kt();
  });
  function Ha(e, t) {
    return Hn(Pn(e), t);
  }
  var $a = g(() => {
    "use strict";
    To();
    Ln();
  });
  function Ba(e, t) {
    if (e != null) {
      if (Nn(e)) return Aa(e, t);
      if (Tn(e)) return Fa(e, t);
      if (xn(e)) return Oa(e, t);
      if (kn(e)) return Hn(e, t);
      if (On(e)) return Va(e, t);
      if (Fn(e)) return Ha(e, t);
    }
    throw An(e);
  }
  var Ua = g(() => {
    "use strict";
    Ra();
    Pa();
    La();
    ja();
    To();
    bo();
    Io();
    _o();
    Co();
    Do();
    Eo();
    Ln();
    $a();
  });
  function Ga(e, t) {
    return t ? Ba(e, t) : Z(e);
  }
  var za = g(() => {
    "use strict";
    Ua();
    Te();
  });
  function At(e, t) {
    return ue((n, r) => {
      let o = 0;
      n.subscribe(de(r, (i) => {
        r.next(e.call(t, i, o++));
      }));
    });
  }
  var xo = g(() => {
    "use strict";
    et();
    Tt();
  });
  function Wa(e, t, n, r, o, i, s, a) {
    let l = [], c = 0, u = 0, f = false, h = () => {
      f && !l.length && !c && t.complete();
    }, d = (m) => c < r ? p(m) : l.push(m), p = (m) => {
      i && t.next(m), c++;
      let T = false;
      Z(n(m, u++)).subscribe(de(t, (I) => {
        o?.(I), i ? d(I) : t.next(I);
      }, () => {
        T = true;
      }, void 0, () => {
        if (T) try {
          for (c--; l.length && c < r; ) {
            let I = l.shift();
            s ? Y(t, s, () => p(I)) : p(I);
          }
          h();
        } catch (I) {
          t.error(I);
        }
      }));
    };
    return e.subscribe(de(t, d, () => {
      f = true, h();
    })), () => {
      a?.();
    };
  }
  var qa = g(() => {
    "use strict";
    Te();
    kt();
    Tt();
  });
  function No(e, t, n = 1 / 0) {
    return M(t) ? No((r, o) => At((i, s) => t(r, i, o, s))(Z(e(r, o))), n) : (typeof t == "number" && (n = t), ue((r, o) => Wa(r, o, e, n)));
  }
  var Za = g(() => {
    "use strict";
    xo();
    Te();
    et();
    qa();
    q();
  });
  function Qa(e = 1 / 0) {
    return No(Cn, e);
  }
  var Ya = g(() => {
    "use strict";
    Za();
    go();
  });
  function ko(...e) {
    let t = wa(e), n = Ca(e, 1 / 0), r = e;
    return r.length ? r.length === 1 ? Z(r[0]) : Qa(n)(Ga(r, t)) : _a;
  }
  var Ka = g(() => {
    "use strict";
    Ya();
    Te();
    Ia();
    Ma();
    za();
  });
  var Ja = g(() => {
    "use strict";
  });
  function Ao(e, t) {
    return ue((n, r) => {
      let o = null, i = 0, s = false, a = () => s && !o && r.complete();
      n.subscribe(de(r, (l) => {
        o?.unsubscribe();
        let c = 0, u = i++;
        Z(e(l, u)).subscribe(o = de(r, (f) => r.next(t ? t(l, f, u, c++) : f), () => {
          o = null, a();
        }));
      }, () => {
        s = true, a();
      }));
    });
  }
  var Xa = g(() => {
    "use strict";
    Te();
    et();
    Tt();
  });
  var Ro = g(() => {
    "use strict";
    Se();
    Sn();
    ma();
    ya();
    Mt();
    Ka();
    Ja();
  });
  var Oo = g(() => {
    "use strict";
    xo();
    Xa();
  });
  function Kd(e) {
    return `NG0${Math.abs(e)}`;
  }
  function Jd(e, t) {
    return `${Kd(e)}${t ? ": " + t : ""}`;
  }
  function jl(e) {
    return { toString: e }.toString();
  }
  function A(e) {
    for (let t in e) if (e[t] === A) return t;
    throw Error("Could not find renamed property on target object.");
  }
  function J(e) {
    if (typeof e == "string") return e;
    if (Array.isArray(e)) return `[${e.map(J).join(", ")}]`;
    if (e == null) return "" + e;
    let t = e.overriddenName || e.name;
    if (t) return `${t}`;
    let n = e.toString();
    if (n == null) return "" + n;
    let r = n.indexOf(`
`);
    return r >= 0 ? n.slice(0, r) : n;
  }
  function el(e, t) {
    return e ? t ? `${e} ${t}` : e : t || "";
  }
  function Pi(e) {
    return e.__forward_ref__ = Pi, e.toString = function() {
      return J(this());
    }, e;
  }
  function se(e) {
    return ef(e) ? e() : e;
  }
  function ef(e) {
    return typeof e == "function" && e.hasOwnProperty(Xd) && e.__forward_ref__ === Pi;
  }
  function P(e) {
    return { token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0 };
  }
  function ur(e) {
    return { providers: e.providers || [], imports: e.imports || [] };
  }
  function Fi(e) {
    return tl(e, Hl) || tl(e, $l);
  }
  function tl(e, t) {
    return e.hasOwnProperty(t) ? e[t] : null;
  }
  function tf(e) {
    let t = e && (e[Hl] || e[$l]);
    return t || null;
  }
  function nl(e) {
    return e && (e.hasOwnProperty(rl) || e.hasOwnProperty(nf)) ? e[rl] : null;
  }
  function Bl(e) {
    return e && !!e.\u0275providers;
  }
  function Li(e) {
    return typeof e == "string" ? e : e == null ? "" : String(e);
  }
  function af(e) {
    return typeof e == "function" ? e.name || e.toString() : typeof e == "object" && e != null && typeof e.type == "function" ? e.type.name || e.type.toString() : Li(e);
  }
  function Ul(e, t) {
    throw new w(-200, e);
  }
  function Vi(e, t) {
    throw new w(-201, false);
  }
  function Gl() {
    return Wo;
  }
  function K(e) {
    let t = Wo;
    return Wo = e, t;
  }
  function zl(e, t, n) {
    let r = Fi(e);
    if (r && r.providedIn == "root") return r.value === void 0 ? r.value = r.factory() : r.value;
    if (n & _.Optional) return null;
    if (t !== void 0) return t;
    Vi(e, "Injector");
  }
  function hf(e, t = _.Default) {
    if (wt() === void 0) throw new w(-203, false);
    if (wt() === null) return zl(e, void 0, t);
    {
      let n = wt(), r;
      return n instanceof qn ? r = n.injector : r = n, r.get(e, t & _.Optional ? null : void 0, t);
    }
  }
  function N(e, t = _.Default) {
    return (Gl() || hf)(se(e), t);
  }
  function S(e, t = _.Default) {
    return N(e, dr(t));
  }
  function dr(e) {
    return typeof e > "u" || typeof e == "number" ? e : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4);
  }
  function qo(e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
      let r = se(e[n]);
      if (Array.isArray(r)) {
        if (r.length === 0) throw new w(900, false);
        let o, i = _.Default;
        for (let s = 0; s < r.length; s++) {
          let a = r[s], l = pf(a);
          typeof l == "number" ? l === -1 ? o = a.token : i |= l : o = a;
        }
        t.push(N(o, i));
      } else t.push(N(r));
    }
    return t;
  }
  function pf(e) {
    return e[cf];
  }
  function gf(e, t, n, r) {
    let o = e[Zn];
    throw t[sl] && o.unshift(t[sl]), e.message = mf(`
` + e.message, o, n, r), e[uf] = o, e[Zn] = null, e;
  }
  function mf(e, t, n, r = null) {
    e = e && e.charAt(0) === `
` && e.charAt(1) == ff ? e.slice(2) : e;
    let o = J(t);
    if (Array.isArray(t)) o = t.map(J).join(" -> ");
    else if (typeof t == "object") {
      let i = [];
      for (let s in t) if (t.hasOwnProperty(s)) {
        let a = t[s];
        i.push(s + ":" + (typeof a == "string" ? JSON.stringify(a) : J(a)));
      }
      o = `{${i.join(", ")}}`;
    }
    return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(df, `
  `)}`;
  }
  function Lt(e, t) {
    let n = e.hasOwnProperty(ol);
    return n ? e[ol] : null;
  }
  function ji(e, t) {
    e.forEach((n) => Array.isArray(n) ? ji(n, t) : t(n));
  }
  function vf(e, t, n) {
    t >= e.length ? e.push(n) : e.splice(t, 0, n);
  }
  function Wl(e, t) {
    return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0];
  }
  function yf(e, t, n, r) {
    let o = e.length;
    if (o == t) e.push(n, r);
    else if (o === 1) e.push(r, e[0]), e[0] = n;
    else {
      for (o--, e.push(e[o - 1], e[o]); o > t; ) {
        let i = o - 2;
        e[o] = e[i], o--;
      }
      e[t] = n, e[t + 1] = r;
    }
  }
  function _f(e, t, n) {
    let r = Gt(e, t);
    return r >= 0 ? e[r | 1] = n : (r = ~r, yf(e, r, t, n)), r;
  }
  function Po(e, t) {
    let n = Gt(e, t);
    if (n >= 0) return e[n | 1];
  }
  function Gt(e, t) {
    return If(e, t, 1);
  }
  function If(e, t, n) {
    let r = 0, o = e.length >> n;
    for (; o !== r; ) {
      let i = r + (o - r >> 1), s = e[i << n];
      if (t === s) return i << n;
      s > t ? o = i : r = i + 1;
    }
    return ~(o << n);
  }
  function Hi(e) {
    return e[rf] || null;
  }
  function bf(e) {
    return e[of] || null;
  }
  function Df(e) {
    return e[sf] || null;
  }
  function Ef(e) {
    return { \u0275providers: e };
  }
  function wf(...e) {
    return { \u0275providers: Ql(true, e), \u0275fromNgModule: true };
  }
  function Ql(e, ...t) {
    let n = [], r = /* @__PURE__ */ new Set(), o, i = (s) => {
      n.push(s);
    };
    return ji(t, (s) => {
      let a = s;
      Zo(a, i, [], r) && (o ||= [], o.push(a));
    }), o !== void 0 && Yl(o, i), n;
  }
  function Yl(e, t) {
    for (let n = 0; n < e.length; n++) {
      let { ngModule: r, providers: o } = e[n];
      $i(o, (i) => {
        t(i, r);
      });
    }
  }
  function Zo(e, t, n, r) {
    if (e = se(e), !e) return false;
    let o = null, i = nl(e), s = !i && Hi(e);
    if (!i && !s) {
      let l = e.ngModule;
      if (i = nl(l), i) o = l;
      else return false;
    } else {
      if (s && !s.standalone) return false;
      o = e;
    }
    let a = r.has(o);
    if (s) {
      if (a) return false;
      if (r.add(o), s.dependencies) {
        let l = typeof s.dependencies == "function" ? s.dependencies() : s.dependencies;
        for (let c of l) Zo(c, t, n, r);
      }
    } else if (i) {
      if (i.imports != null && !a) {
        r.add(o);
        let c;
        ji(i.imports, (u) => {
          Zo(u, t, n, r) && (c ||= [], c.push(u));
        }), c !== void 0 && Yl(c, t);
      }
      if (!a) {
        let c = Lt(o) || (() => new o());
        t({ provide: o, useFactory: c, deps: ae }, o), t({ provide: Zl, useValue: o, multi: true }, o), t({ provide: Qn, useValue: () => N(o), multi: true }, o);
      }
      let l = i.providers;
      if (l != null && !a) {
        let c = e;
        $i(l, (u) => {
          t(u, c);
        });
      }
    } else return false;
    return o !== e && e.providers !== void 0;
  }
  function $i(e, t) {
    for (let n of e) Bl(n) && (n = n.\u0275providers), Array.isArray(n) ? $i(n, t) : t(n);
  }
  function Kl(e) {
    return e !== null && typeof e == "object" && Cf in e;
  }
  function Mf(e) {
    return !!(e && e.useExisting);
  }
  function Sf(e) {
    return !!(e && e.useFactory);
  }
  function Qo(e) {
    return typeof e == "function";
  }
  function Bi() {
    return Fo === void 0 && (Fo = new Yn()), Fo;
  }
  function Yo(e) {
    let t = Fi(e), n = t !== null ? t.factory : Lt(e);
    if (n !== null) return n;
    if (e instanceof C) throw new w(204, false);
    if (e instanceof Function) return Tf(e);
    throw new w(204, false);
  }
  function Tf(e) {
    if (e.length > 0) throw new w(204, false);
    let n = tf(e);
    return n !== null ? () => n.factory(e) : () => new e();
  }
  function xf(e) {
    if (Kl(e)) return tt(void 0, e.useValue);
    {
      let t = Nf(e);
      return tt(t, Bn);
    }
  }
  function Nf(e, t, n) {
    let r;
    if (Qo(e)) {
      let o = se(e);
      return Lt(o) || Yo(o);
    } else if (Kl(e)) r = () => se(e.useValue);
    else if (Sf(e)) r = () => e.useFactory(...qo(e.deps || []));
    else if (Mf(e)) r = (o, i) => N(se(e.useExisting), i !== void 0 && i & _.Optional ? _.Optional : void 0);
    else {
      let o = se(e && (e.useClass || e.provide));
      if (kf(e)) r = () => new o(...qo(e.deps));
      else return Lt(o) || Yo(o);
    }
    return r;
  }
  function Ot(e) {
    if (e.destroyed) throw new w(205, false);
  }
  function tt(e, t, n = false) {
    return { factory: e, value: t, multi: n ? [] : void 0 };
  }
  function kf(e) {
    return !!e.deps;
  }
  function Af(e) {
    return e !== null && typeof e == "object" && typeof e.ngOnDestroy == "function";
  }
  function Rf(e) {
    return typeof e == "function" || typeof e == "object" && e instanceof C;
  }
  function Ko(e, t) {
    for (let n of e) Array.isArray(n) ? Ko(n, t) : n && Bl(n) ? Ko(n.\u0275providers, t) : t(n);
  }
  function Jl(e, t) {
    let n;
    e instanceof Vt ? (Ot(e), n = e) : n = new qn(e);
    let r, o = Ie(n), i = K(void 0);
    try {
      return t();
    } finally {
      Ie(o), K(i);
    }
  }
  function Of() {
    return Gl() !== void 0 || wt() != null;
  }
  function Ve(e) {
    return Array.isArray(e) && typeof e[ec] == "object";
  }
  function ze(e) {
    return Array.isArray(e) && e[ec] === true;
  }
  function tc(e) {
    return (e.flags & 4) !== 0;
  }
  function zt(e) {
    return e.componentOffset > -1;
  }
  function Ui(e) {
    return (e.flags & 1) === 1;
  }
  function We(e) {
    return !!e.template;
  }
  function er(e) {
    return (e[v] & 512) !== 0;
  }
  function ht(e) {
    return (e[v] & 256) === 256;
  }
  function nc(e, t, n, r) {
    t !== null ? t.applyValueToInputSignal(t, r) : e[n] = r;
  }
  function Ff(e) {
    return e.type.prototype.ngOnChanges && (e.setInput = Vf), Lf;
  }
  function Lf() {
    let e = oc(this), t = e?.current;
    if (t) {
      let n = e.previous;
      if (n === it) e.previous = t;
      else for (let r in t) n[r] = t[r];
      e.current = null, this.ngOnChanges(t);
    }
  }
  function Vf(e, t, n, r, o) {
    let i = this.declaredInputs[r], s = oc(e) || jf(e, { previous: it, current: null }), a = s.current || (s.current = {}), l = s.previous, c = l[i];
    a[i] = new Jo(c && c.currentValue, n, l === it), nc(e, t, o, n);
  }
  function oc(e) {
    return e[rc] || null;
  }
  function jf(e, t) {
    return e[rc] = t;
  }
  function Ee(e) {
    for (; Array.isArray(e); ) e = e[Ce];
    return e;
  }
  function ic(e, t) {
    return Ee(t[e]);
  }
  function Me(e, t) {
    return Ee(t[e.index]);
  }
  function Gi(e, t) {
    return e.data[t];
  }
  function ke(e, t) {
    let n = t[e];
    return Ve(n) ? n : n[Ce];
  }
  function zi(e) {
    return (e[v] & 128) === 128;
  }
  function ct(e, t) {
    return t == null ? null : e[t];
  }
  function sc(e) {
    e[nt] = 0;
  }
  function Wi(e) {
    e[v] & 1024 || (e[v] |= 1024, zi(e) && pr(e));
  }
  function Bf(e, t) {
    for (; e > 0; ) t = t[ft], e--;
    return t;
  }
  function Wt(e) {
    return !!(e[v] & 9216 || e[X]?.dirty);
  }
  function Xo(e) {
    e[Ne].changeDetectionScheduler?.notify(8), e[v] & 64 && (e[v] |= 1024), Wt(e) && pr(e);
  }
  function pr(e) {
    e[Ne].changeDetectionScheduler?.notify(0);
    let t = He(e);
    for (; t !== null && !(t[v] & 8192 || (t[v] |= 8192, !zi(t))); ) t = He(t);
  }
  function ac(e, t) {
    if (ht(e)) throw new w(911, false);
    e[xe] === null && (e[xe] = []), e[xe].push(t);
  }
  function Uf(e, t) {
    if (e[xe] === null) return;
    let n = e[xe].indexOf(t);
    n !== -1 && e[xe].splice(n, 1);
  }
  function He(e) {
    let t = e[ee];
    return ze(t) ? t[ee] : t;
  }
  function lc(e) {
    return e[Kn] ??= [];
  }
  function cc(e) {
    return e.cleanup ??= [];
  }
  function Gf() {
    return D.lFrame.elementDepthCount;
  }
  function zf() {
    D.lFrame.elementDepthCount++;
  }
  function Wf() {
    D.lFrame.elementDepthCount--;
  }
  function uc() {
    return D.bindingsEnabled;
  }
  function qf() {
    return D.skipHydrationRootTNode !== null;
  }
  function Zf(e) {
    return D.skipHydrationRootTNode === e;
  }
  function Qf() {
    D.skipHydrationRootTNode = null;
  }
  function L() {
    return D.lFrame.lView;
  }
  function me() {
    return D.lFrame.tView;
  }
  function qi(e) {
    return D.lFrame.contextLView = e, e[H];
  }
  function Zi(e) {
    return D.lFrame.contextLView = null, e;
  }
  function pt() {
    let e = dc();
    for (; e !== null && e.type === 64; ) e = e.parent;
    return e;
  }
  function dc() {
    return D.lFrame.currentTNode;
  }
  function Yf() {
    let e = D.lFrame, t = e.currentTNode;
    return e.isParent ? t : t.parent;
  }
  function qt(e, t) {
    let n = D.lFrame;
    n.currentTNode = e, n.isParent = t;
  }
  function fc() {
    return D.lFrame.isParent;
  }
  function Kf() {
    D.lFrame.isParent = false;
  }
  function hc() {
    return ei;
  }
  function ul(e) {
    let t = ei;
    return ei = e, t;
  }
  function Jf(e) {
    return D.lFrame.bindingIndex = e;
  }
  function Zt() {
    return D.lFrame.bindingIndex++;
  }
  function Xf(e) {
    let t = D.lFrame, n = t.bindingIndex;
    return t.bindingIndex = t.bindingIndex + e, n;
  }
  function eh() {
    return D.lFrame.inI18n;
  }
  function th(e, t) {
    let n = D.lFrame;
    n.bindingIndex = n.bindingRootIndex = e, ti(t);
  }
  function nh() {
    return D.lFrame.currentDirectiveIndex;
  }
  function ti(e) {
    D.lFrame.currentDirectiveIndex = e;
  }
  function rh(e) {
    let t = D.lFrame.currentDirectiveIndex;
    return t === -1 ? null : e[t];
  }
  function pc(e) {
    D.lFrame.currentQueryIndex = e;
  }
  function oh(e) {
    let t = e[b];
    return t.type === 2 ? t.declTNode : t.type === 1 ? e[ge] : null;
  }
  function gc(e, t, n) {
    if (n & _.SkipSelf) {
      let o = t, i = e;
      for (; o = o.parent, o === null && !(n & _.Host); ) if (o = oh(i), o === null || (i = i[ft], o.type & 10)) break;
      if (o === null) return false;
      t = o, e = i;
    }
    let r = D.lFrame = mc();
    return r.currentTNode = t, r.lView = e, true;
  }
  function Qi(e) {
    let t = mc(), n = e[b];
    D.lFrame = t, t.currentTNode = n.firstChild, t.lView = e, t.tView = n, t.contextLView = e, t.bindingIndex = n.bindingStartIndex, t.inI18n = false;
  }
  function mc() {
    let e = D.lFrame, t = e === null ? null : e.child;
    return t === null ? vc(e) : t;
  }
  function vc(e) {
    let t = { currentTNode: null, isParent: true, lView: null, tView: null, selectedIndex: -1, contextLView: null, elementDepthCount: 0, currentNamespace: null, currentDirectiveIndex: -1, bindingRootIndex: -1, bindingIndex: -1, currentQueryIndex: 0, parent: e, child: null, inI18n: false };
    return e !== null && (e.child = t), t;
  }
  function yc() {
    let e = D.lFrame;
    return D.lFrame = e.parent, e.currentTNode = null, e.lView = null, e;
  }
  function Yi() {
    let e = yc();
    e.isParent = true, e.tView = null, e.selectedIndex = -1, e.contextLView = null, e.elementDepthCount = 0, e.currentDirectiveIndex = -1, e.currentNamespace = null, e.bindingRootIndex = -1, e.bindingIndex = -1, e.currentQueryIndex = 0;
  }
  function ih(e) {
    return (D.lFrame.contextLView = Bf(e, D.lFrame.contextLView))[H];
  }
  function qe() {
    return D.lFrame.selectedIndex;
  }
  function $e(e) {
    D.lFrame.selectedIndex = e;
  }
  function Ic() {
    let e = D.lFrame;
    return Gi(e.tView, e.selectedIndex);
  }
  function sh() {
    return D.lFrame.currentNamespace;
  }
  function Ki() {
    return bc;
  }
  function Ji(e) {
    bc = e;
  }
  function ah(e, t, n) {
    let { ngOnChanges: r, ngOnInit: o, ngDoCheck: i } = t.type.prototype;
    if (r) {
      let s = Ff(t);
      (n.preOrderHooks ??= []).push(e, s), (n.preOrderCheckHooks ??= []).push(e, s);
    }
    o && (n.preOrderHooks ??= []).push(0 - e, o), i && ((n.preOrderHooks ??= []).push(e, i), (n.preOrderCheckHooks ??= []).push(e, i));
  }
  function Dc(e, t) {
    for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
      let i = e.data[n].type.prototype, { ngAfterContentInit: s, ngAfterContentChecked: a, ngAfterViewInit: l, ngAfterViewChecked: c, ngOnDestroy: u } = i;
      s && (e.contentHooks ??= []).push(-n, s), a && ((e.contentHooks ??= []).push(n, a), (e.contentCheckHooks ??= []).push(n, a)), l && (e.viewHooks ??= []).push(-n, l), c && ((e.viewHooks ??= []).push(n, c), (e.viewCheckHooks ??= []).push(n, c)), u != null && (e.destroyHooks ??= []).push(n, u);
    }
  }
  function Un(e, t, n) {
    Ec(e, t, 3, n);
  }
  function Gn(e, t, n, r) {
    (e[v] & 3) === n && Ec(e, t, n, r);
  }
  function jo(e, t) {
    let n = e[v];
    (n & 3) === t && (n &= 16383, n += 1, e[v] = n);
  }
  function Ec(e, t, n, r) {
    let o = r !== void 0 ? e[nt] & 65535 : 0, i = r ?? -1, s = t.length - 1, a = 0;
    for (let l = o; l < s; l++) if (typeof t[l + 1] == "number") {
      if (a = t[l], r != null && a >= r) break;
    } else t[l] < 0 && (e[nt] += 65536), (a < i || i == -1) && (lh(e, n, t, l), e[nt] = (e[nt] & 4294901760) + l + 2), l++;
  }
  function dl(e, t) {
    k(4, e, t);
    let n = y(null);
    try {
      t.call(e);
    } finally {
      y(n), k(5, e, t);
    }
  }
  function lh(e, t, n, r) {
    let o = n[r] < 0, i = n[r + 1], s = o ? -n[r] : n[r], a = e[s];
    o ? e[v] >> 14 < e[nt] >> 16 && (e[v] & 3) === t && (e[v] += 16384, dl(a, i)) : dl(a, i);
  }
  function ch(e) {
    return (e.flags & 8) !== 0;
  }
  function uh(e) {
    return (e.flags & 16) !== 0;
  }
  function dh(e, t, n) {
    let r = 0;
    for (; r < n.length; ) {
      let o = n[r];
      if (typeof o == "number") {
        if (o !== 0) break;
        r++;
        let i = n[r++], s = n[r++], a = n[r++];
        e.setAttribute(t, s, a, i);
      } else {
        let i = o, s = n[++r];
        hh(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++;
      }
    }
    return r;
  }
  function fh(e) {
    return e === 3 || e === 4 || e === 6;
  }
  function hh(e) {
    return e.charCodeAt(0) === 64;
  }
  function Xi(e, t) {
    if (!(t === null || t.length === 0)) if (e === null || e.length === 0) e = t.slice();
    else {
      let n = -1;
      for (let r = 0; r < t.length; r++) {
        let o = t[r];
        typeof o == "number" ? n = o : n === 0 || (n === -1 || n === 2 ? fl(e, n, o, null, t[++r]) : fl(e, n, o, null, null));
      }
    }
    return e;
  }
  function fl(e, t, n, r, o) {
    let i = 0, s = e.length;
    if (t === -1) s = -1;
    else for (; i < e.length; ) {
      let a = e[i++];
      if (typeof a == "number") {
        if (a === t) {
          s = -1;
          break;
        } else if (a > t) {
          s = i - 1;
          break;
        }
      }
    }
    for (; i < e.length; ) {
      let a = e[i];
      if (typeof a == "number") break;
      if (a === n) {
        o !== null && (e[i + 1] = o);
        return;
      }
      i++, o !== null && i++;
    }
    s !== -1 && (e.splice(s, 0, t), i = s + 1), e.splice(i++, 0, n), o !== null && e.splice(i++, 0, o);
  }
  function ph(e) {
    return e !== ot;
  }
  function ni(e) {
    return e & 32767;
  }
  function gh(e) {
    return e >> 16;
  }
  function ri(e, t) {
    let n = gh(e), r = t;
    for (; n > 0; ) r = r[ft], n--;
    return r;
  }
  function hl(e) {
    let t = oi;
    return oi = e, t;
  }
  function yh(e, t, n) {
    let r;
    typeof n == "string" ? r = n.charCodeAt(0) || 0 : n.hasOwnProperty(Ft) && (r = n[Ft]), r == null && (r = n[Ft] = vh++);
    let o = r & wc, i = 1 << o;
    t.data[e + (o >> Cc)] |= i;
  }
  function Mc(e, t) {
    let n = Sc(e, t);
    if (n !== -1) return n;
    let r = t[b];
    r.firstCreatePass && (e.injectorIndex = t.length, Ho(r.data, e), Ho(t, null), Ho(r.blueprint, null));
    let o = Tc(e, t), i = e.injectorIndex;
    if (ph(o)) {
      let s = ni(o), a = ri(o, t), l = a[b].data;
      for (let c = 0; c < 8; c++) t[i + c] = a[s + c] | l[s + c];
    }
    return t[i + 8] = o, i;
  }
  function Ho(e, t) {
    e.push(0, 0, 0, 0, 0, 0, 0, 0, t);
  }
  function Sc(e, t) {
    return e.injectorIndex === -1 || e.parent && e.parent.injectorIndex === e.injectorIndex || t[e.injectorIndex + 8] === null ? -1 : e.injectorIndex;
  }
  function Tc(e, t) {
    if (e.parent && e.parent.injectorIndex !== -1) return e.parent.injectorIndex;
    let n = 0, r = null, o = t;
    for (; o !== null; ) {
      if (r = Rc(o), r === null) return ot;
      if (n++, o = o[ft], r.injectorIndex !== -1) return r.injectorIndex | n << 16;
    }
    return ot;
  }
  function _h(e, t, n) {
    yh(e, t, n);
  }
  function xc(e, t, n) {
    if (n & _.Optional || e !== void 0) return e;
    Vi(t, "NodeInjector");
  }
  function Nc(e, t, n, r) {
    if (n & _.Optional && r === void 0 && (r = null), (n & (_.Self | _.Host)) === 0) {
      let o = e[st], i = K(void 0);
      try {
        return o ? o.get(t, r, n & _.Optional) : zl(t, r, n & _.Optional);
      } finally {
        K(i);
      }
    }
    return xc(r, t, n);
  }
  function kc(e, t, n, r = _.Default, o) {
    if (e !== null) {
      if (t[v] & 2048 && !(r & _.Self)) {
        let s = wh(e, t, n, r, fe);
        if (s !== fe) return s;
      }
      let i = Ac(e, t, n, r, fe);
      if (i !== fe) return i;
    }
    return Nc(t, n, r, o);
  }
  function Ac(e, t, n, r, o) {
    let i = Dh(n);
    if (typeof i == "function") {
      if (!gc(t, e, r)) return r & _.Host ? xc(o, n, r) : Nc(t, n, r, o);
      try {
        let s;
        if (s = i(r), s == null && !(r & _.Optional)) Vi(n);
        else return s;
      } finally {
        _c();
      }
    } else if (typeof i == "number") {
      let s = null, a = Sc(e, t), l = ot, c = r & _.Host ? t[he][ge] : null;
      for ((a === -1 || r & _.SkipSelf) && (l = a === -1 ? Tc(e, t) : t[a + 8], l === ot || !gl(r, false) ? a = -1 : (s = t[b], a = ni(l), t = ri(l, t))); a !== -1; ) {
        let u = t[b];
        if (pl(i, a, u.data)) {
          let f = Ih(a, t, n, s, r, c);
          if (f !== fe) return f;
        }
        l = t[a + 8], l !== ot && gl(r, t[b].data[a + 8] === c) && pl(i, a, t) ? (s = u, a = ni(l), t = ri(l, t)) : a = -1;
      }
    }
    return o;
  }
  function Ih(e, t, n, r, o, i) {
    let s = t[b], a = s.data[e + 8], l = r == null ? zt(a) && oi : r != s && (a.type & 3) !== 0, c = o & _.Host && i === a, u = bh(a, s, n, l, c);
    return u !== null ? ii(t, s, u, a, o) : fe;
  }
  function bh(e, t, n, r, o) {
    let i = e.providerIndexes, s = t.data, a = i & 1048575, l = e.directiveStart, c = e.directiveEnd, u = i >> 20, f = r ? a : a + u, h = o ? a + u : c;
    for (let d = f; d < h; d++) {
      let p = s[d];
      if (d < l && n === p || d >= l && p.type === n) return d;
    }
    if (o) {
      let d = s[l];
      if (d && We(d) && d.type === n) return l;
    }
    return null;
  }
  function ii(e, t, n, r, o) {
    let i = e[n], s = t.data;
    if (i instanceof Bt) {
      let a = i;
      a.resolving && Ul(af(s[n]));
      let l = hl(a.canSeeViewProviders);
      a.resolving = true;
      let c, u = a.injectImpl ? K(a.injectImpl) : null, f = gc(e, r, _.Default);
      try {
        i = e[n] = a.factory(void 0, o, s, e, r), t.firstCreatePass && n >= r.directiveStart && ah(n, s[n], t);
      } finally {
        u !== null && K(u), hl(l), a.resolving = false, _c();
      }
    }
    return i;
  }
  function Dh(e) {
    if (typeof e == "string") return e.charCodeAt(0) || 0;
    let t = e.hasOwnProperty(Ft) ? e[Ft] : void 0;
    return typeof t == "number" ? t >= 0 ? t & wc : Eh : t;
  }
  function pl(e, t, n) {
    let r = 1 << e;
    return !!(n[t + (e >> Cc)] & r);
  }
  function gl(e, t) {
    return !(e & _.Self) && !(e & _.Host && t);
  }
  function Eh() {
    return new tr(pt(), L());
  }
  function wh(e, t, n, r, o) {
    let i = e, s = t;
    for (; i !== null && s !== null && s[v] & 2048 && !er(s); ) {
      let a = Ac(i, s, n, r | _.Self, fe);
      if (a !== fe) return a;
      let l = i.parent;
      if (!l) {
        let c = s[Xl];
        if (c) {
          let u = c.get(n, fe, r);
          if (u !== fe) return u;
        }
        l = Rc(s), s = s[ft];
      }
      i = l;
    }
    return o;
  }
  function Rc(e) {
    let t = e[b], n = t.type;
    return n === 2 ? t.declTNode : n === 1 ? e[ge] : null;
  }
  function ml(e, t = null, n = null, r) {
    let o = Ch(e, t, n, r);
    return o.resolveInjectorInitializers(), o;
  }
  function Ch(e, t = null, n = null, r, o = /* @__PURE__ */ new Set()) {
    let i = [n || ae, wf(e)];
    return r = r || (typeof e == "object" ? void 0 : J(e)), new Vt(i, t || Bi(), r || null, o);
  }
  function Sh() {
    return new si(L());
  }
  function nr(...e) {
  }
  function Vc(e) {
    let t, n;
    function r() {
      e = nr;
      try {
        n !== void 0 && typeof cancelAnimationFrame == "function" && cancelAnimationFrame(n), t !== void 0 && clearTimeout(t);
      } catch {
      }
    }
    return t = setTimeout(() => {
      e(), r();
    }), typeof requestAnimationFrame == "function" && (n = requestAnimationFrame(() => {
      e(), r();
    })), () => r();
  }
  function vl(e) {
    return queueMicrotask(() => e()), () => {
      e = nr;
    };
  }
  function ns(e) {
    if (e._nesting == 0 && !e.hasPendingMicrotasks && !e.isStable) try {
      e._nesting++, e.onMicrotaskEmpty.emit(null);
    } finally {
      if (e._nesting--, !e.hasPendingMicrotasks) try {
        e.runOutsideAngular(() => e.onStable.emit(null));
      } finally {
        e.isStable = true;
      }
    }
  }
  function Nh(e) {
    if (e.isCheckStableRunning || e.callbackScheduled) return;
    e.callbackScheduled = true;
    function t() {
      Vc(() => {
        e.callbackScheduled = false, li(e), e.isCheckStableRunning = true, ns(e), e.isCheckStableRunning = false;
      });
    }
    e.scheduleInRootZone ? Zone.root.run(() => {
      t();
    }) : e._outer.run(() => {
      t();
    }), li(e);
  }
  function kh(e) {
    let t = () => {
      Nh(e);
    }, n = Th++;
    e._inner = e._inner.fork({ name: "angular", properties: { [ts]: true, [rr]: n, [rr + n]: true }, onInvokeTask: (r, o, i, s, a, l) => {
      if (Ah(l)) return r.invokeTask(i, s, a, l);
      try {
        return yl(e), r.invokeTask(i, s, a, l);
      } finally {
        (e.shouldCoalesceEventChangeDetection && s.type === "eventTask" || e.shouldCoalesceRunChangeDetection) && t(), _l(e);
      }
    }, onInvoke: (r, o, i, s, a, l, c) => {
      try {
        return yl(e), r.invoke(i, s, a, l, c);
      } finally {
        e.shouldCoalesceRunChangeDetection && !e.callbackScheduled && !Rh(l) && t(), _l(e);
      }
    }, onHasTask: (r, o, i, s) => {
      r.hasTask(i, s), o === i && (s.change == "microTask" ? (e._hasPendingMicrotasks = s.microTask, li(e), ns(e)) : s.change == "macroTask" && (e.hasPendingMacrotasks = s.macroTask));
    }, onHandleError: (r, o, i, s) => (r.handleError(i, s), e.runOutsideAngular(() => e.onError.emit(s)), false) });
  }
  function li(e) {
    e._hasPendingMicrotasks || (e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) && e.callbackScheduled === true ? e.hasPendingMicrotasks = true : e.hasPendingMicrotasks = false;
  }
  function yl(e) {
    e._nesting++, e.isStable && (e.isStable = false, e.onUnstable.emit(null));
  }
  function _l(e) {
    e._nesting--, ns(e);
  }
  function Ah(e) {
    return jc(e, "__ignore_ng_zone__");
  }
  function Rh(e) {
    return jc(e, "__scheduler_tick__");
  }
  function jc(e, t) {
    return !Array.isArray(e) || e.length !== 1 ? false : e[0]?.data?.[t] === true;
  }
  function Ph() {
    return Hc(pt(), L());
  }
  function Hc(e, t) {
    return new mr(Me(e, t));
  }
  function ve(e, t) {
    let n = Kr(e, t?.equal), r = n[ce];
    return n.set = (o) => mn(r, o), n.update = (o) => Jr(r, o), n.asReadonly = Fh.bind(n), n;
  }
  function Fh() {
    let e = this[ce];
    if (e.readonlyFn === void 0) {
      let t = () => this();
      t[ce] = e, e.readonlyFn = t;
    }
    return e.readonlyFn;
  }
  function $c(e) {
    return (e.flags & 128) === 128;
  }
  function Vh() {
    return Lh++;
  }
  function jh(e) {
    Uc.set(e[hr], e);
  }
  function ui(e) {
    Uc.delete(e[hr]);
  }
  function Qt(e, t) {
    Ve(t) ? (e[Il] = t[hr], jh(t)) : e[Il] = t;
  }
  function Gc(e) {
    return Wc(e[Ht]);
  }
  function zc(e) {
    return Wc(e[le]);
  }
  function Wc(e) {
    for (; e !== null && !ze(e); ) e = e[le];
    return e;
  }
  function qc(e) {
    di = e;
  }
  function Hh() {
    if (di !== void 0) return di;
    if (typeof document < "u") return document;
    throw new w(210, false);
  }
  function yr(e) {
    bl.has(e) || (bl.add(e), performance?.mark?.("mark_feature_usage", { detail: { feature: e } }));
  }
  function qh(e, t, n, r) {
    Wh(e, t, n, r);
  }
  function Yc(e, t, n = false) {
    return Zh(e, t, n);
  }
  function Kc(e, t) {
    let n = e.contentQueries;
    if (n !== null) {
      let r = y(null);
      try {
        for (let o = 0; o < n.length; o += 2) {
          let i = n[o], s = n[o + 1];
          if (s !== -1) {
            let a = e.data[s];
            pc(i), a.contentQueries(2, t[s], s);
          }
        }
      } finally {
        y(r);
      }
    }
  }
  function fi(e, t, n) {
    pc(0);
    let r = y(null);
    try {
      t(e, n);
    } finally {
      y(r);
    }
  }
  function Jc(e, t, n) {
    if (tc(t)) {
      let r = y(null);
      try {
        let o = t.directiveStart, i = t.directiveEnd;
        for (let s = o; s < i; s++) {
          let a = e.data[s];
          if (a.contentQueries) {
            let l = n[s];
            a.contentQueries(1, l, s);
          }
        }
      } finally {
        y(r);
      }
    }
  }
  function Qh(e) {
    return e instanceof hi ? e.changingThisBreaksApplicationSecurity : e;
  }
  function Yh(e, t) {
    return e.createText(t);
  }
  function Kh(e, t, n) {
    e.setValue(t, n);
  }
  function Xc(e, t, n) {
    return e.createElement(t, n);
  }
  function pi(e, t, n, r, o) {
    e.insertBefore(t, n, r, o);
  }
  function eu(e, t, n) {
    e.appendChild(t, n);
  }
  function Dl(e, t, n, r, o) {
    r !== null ? pi(e, t, n, r, o) : eu(e, t, n);
  }
  function Jh(e, t, n) {
    e.removeChild(null, t, n);
  }
  function Xh(e, t, n) {
    e.setAttribute(t, "style", n);
  }
  function ep(e, t, n) {
    n === "" ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n);
  }
  function tu(e, t, n) {
    let { mergedAttrs: r, classes: o, styles: i } = n;
    r !== null && dh(e, t, r), o !== null && ep(e, t, o), i !== null && Xh(e, t, i);
  }
  function tp(e) {
    if (e.toLowerCase().startsWith("on")) throw new w(306, false);
  }
  function np(e, t, n) {
    let r = e.length;
    for (; ; ) {
      let o = e.indexOf(t, n);
      if (o === -1) return o;
      if (o === 0 || e.charCodeAt(o - 1) <= 32) {
        let i = t.length;
        if (o + i === r || e.charCodeAt(o + i) <= 32) return o;
      }
      n = o + 1;
    }
  }
  function rp(e, t, n, r) {
    let o = 0;
    if (r) {
      for (; o < t.length && typeof t[o] == "string"; o += 2) if (t[o] === "class" && np(t[o + 1].toLowerCase(), n, 0) !== -1) return true;
    } else if (ss(e)) return false;
    if (o = t.indexOf(1, o), o > -1) {
      let i;
      for (; ++o < t.length && typeof (i = t[o]) == "string"; ) if (i.toLowerCase() === n) return true;
    }
    return false;
  }
  function ss(e) {
    return e.type === 4 && e.value !== nu;
  }
  function op(e, t, n) {
    let r = e.type === 4 && !n ? nu : e.value;
    return t === r;
  }
  function ip(e, t, n) {
    let r = 4, o = e.attrs, i = o !== null ? lp(o) : 0, s = false;
    for (let a = 0; a < t.length; a++) {
      let l = t[a];
      if (typeof l == "number") {
        if (!s && !ie(r) && !ie(l)) return false;
        if (s && ie(l)) continue;
        s = false, r = l | r & 1;
        continue;
      }
      if (!s) if (r & 4) {
        if (r = 2 | r & 1, l !== "" && !op(e, l, n) || l === "" && t.length === 1) {
          if (ie(r)) return false;
          s = true;
        }
      } else if (r & 8) {
        if (o === null || !rp(e, o, l, n)) {
          if (ie(r)) return false;
          s = true;
        }
      } else {
        let c = t[++a], u = sp(l, o, ss(e), n);
        if (u === -1) {
          if (ie(r)) return false;
          s = true;
          continue;
        }
        if (c !== "") {
          let f;
          if (u > i ? f = "" : f = o[u + 1].toLowerCase(), r & 2 && c !== f) {
            if (ie(r)) return false;
            s = true;
          }
        }
      }
    }
    return ie(r) || s;
  }
  function ie(e) {
    return (e & 1) === 0;
  }
  function sp(e, t, n, r) {
    if (t === null) return -1;
    let o = 0;
    if (r || !n) {
      let i = false;
      for (; o < t.length; ) {
        let s = t[o];
        if (s === e) return o;
        if (s === 3 || s === 6) i = true;
        else if (s === 1 || s === 2) {
          let a = t[++o];
          for (; typeof a == "string"; ) a = t[++o];
          continue;
        } else {
          if (s === 4) break;
          if (s === 0) {
            o += 4;
            continue;
          }
        }
        o += i ? 1 : 2;
      }
      return -1;
    } else return cp(t, e);
  }
  function ap(e, t, n = false) {
    for (let r = 0; r < t.length; r++) if (ip(e, t[r], n)) return true;
    return false;
  }
  function lp(e) {
    for (let t = 0; t < e.length; t++) {
      let n = e[t];
      if (fh(n)) return t;
    }
    return e.length;
  }
  function cp(e, t) {
    let n = e.indexOf(4);
    if (n > -1) for (n++; n < e.length; ) {
      let r = e[n];
      if (typeof r == "number") return -1;
      if (r === t) return n;
      n++;
    }
    return -1;
  }
  function El(e, t) {
    return e ? ":not(" + t.trim() + ")" : t;
  }
  function up(e) {
    let t = e[0], n = 1, r = 2, o = "", i = false;
    for (; n < e.length; ) {
      let s = e[n];
      if (typeof s == "string") if (r & 2) {
        let a = e[++n];
        o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]";
      } else r & 8 ? o += "." + s : r & 4 && (o += " " + s);
      else o !== "" && !ie(s) && (t += El(i, o), o = ""), r = s, i = i || !ie(r);
      n++;
    }
    return o !== "" && (t += El(i, o)), t;
  }
  function dp(e) {
    return e.map(up).join(",");
  }
  function fp(e) {
    let t = [], n = [], r = 1, o = 2;
    for (; r < e.length; ) {
      let i = e[r];
      if (typeof i == "string") o === 2 ? i !== "" && t.push(i, e[++r]) : o === 8 && n.push(i);
      else {
        if (!ie(o)) break;
        o = i;
      }
      r++;
    }
    return n.length && t.push(1, ...n), t;
  }
  function as(e, t, n, r, o, i, s, a, l, c, u) {
    let f = te + r, h = f + o, d = hp(f, h), p = typeof c == "function" ? c() : c;
    return d[b] = { type: e, blueprint: d, template: n, queries: null, viewQuery: a, declTNode: t, data: d.slice().fill(null, f), bindingStartIndex: f, expandoStartIndex: h, hostBindingOpCodes: null, firstCreatePass: true, firstUpdatePass: true, staticViewQueries: false, staticContentQueries: false, preOrderHooks: null, preOrderCheckHooks: null, contentHooks: null, contentCheckHooks: null, viewHooks: null, viewCheckHooks: null, destroyHooks: null, cleanup: null, contentQueries: null, components: null, directiveRegistry: typeof i == "function" ? i() : i, pipeRegistry: typeof s == "function" ? s() : s, firstChild: null, schemas: l, consts: p, incompleteFirstPass: false, ssrId: u };
  }
  function hp(e, t) {
    let n = [];
    for (let r = 0; r < t; r++) n.push(r < e ? null : Ze);
    return n;
  }
  function pp(e) {
    let t = e.tView;
    return t === null || t.incompleteFirstPass ? e.tView = as(1, null, e.template, e.decls, e.vars, e.directiveDefs, e.pipeDefs, e.viewQuery, e.schemas, e.consts, e.id) : t;
  }
  function ls(e, t, n, r, o, i, s, a, l, c, u) {
    let f = t.blueprint.slice();
    return f[Ce] = o, f[v] = r | 4 | 128 | 8 | 64 | 1024, (c !== null || e && e[v] & 2048) && (f[v] |= 2048), sc(f), f[ee] = f[ft] = e, f[H] = n, f[Ne] = s || e && e[Ne], f[z] = a || e && e[z], f[st] = l || e && e[st] || null, f[ge] = i, f[hr] = Vh(), f[jt] = u, f[Xl] = c, f[he] = t.type == 2 ? e[he] : f, f;
  }
  function gp(e, t, n) {
    let r = Me(t, e), o = pp(n), i = e[Ne].rendererFactory, s = iu(e, ls(e, o, null, ru(n), r, t, null, i.createRenderer(r, n), null, null, null));
    return e[t.index] = s;
  }
  function ru(e) {
    let t = 16;
    return e.signals ? t = 4096 : e.onPush && (t = 64), t;
  }
  function ou(e, t, n, r) {
    if (n === 0) return -1;
    let o = t.length;
    for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
    return o;
  }
  function iu(e, t) {
    return e[Ht] ? e[ll][le] = t : e[Ht] = t, e[ll] = t, t;
  }
  function W(e = 1) {
    su(me(), L(), qe() + e, false);
  }
  function su(e, t, n, r) {
    if (!r) if ((t[v] & 3) === 3) {
      let i = e.preOrderCheckHooks;
      i !== null && Un(t, i, n);
    } else {
      let i = e.preOrderHooks;
      i !== null && Gn(t, i, 0, n);
    }
    $e(n);
  }
  function gi(e, t, n, r) {
    let o = y(null);
    try {
      let [i, s, a] = e.inputs[n], l = null;
      (s & _r.SignalBased) !== 0 && (l = t[i][ce]), l !== null && l.transformFn !== void 0 ? r = l.transformFn(r) : a !== null && (r = a.call(t, r)), e.setInput !== null ? e.setInput(t, l, r, n, i) : nc(t, l, i, r);
    } finally {
      y(o);
    }
  }
  function au(e, t, n, r, o) {
    let i = qe(), s = r & 2;
    try {
      $e(-1), s && t.length > te && su(e, t, te, false), k(s ? 2 : 0, o), n(r, o);
    } finally {
      $e(i), k(s ? 3 : 1, o);
    }
  }
  function cs(e, t, n) {
    Dp(e, t, n), (n.flags & 64) === 64 && Ep(e, t, n);
  }
  function lu(e, t, n = Me) {
    let r = t.localNames;
    if (r !== null) {
      let o = t.index + 1;
      for (let i = 0; i < r.length; i += 2) {
        let s = r[i + 1], a = s === -1 ? n(t, e) : e[s];
        e[o++] = a;
      }
    }
  }
  function mp(e, t, n, r) {
    let i = r.get(Gh, Zc) || n === pe.ShadowDom, s = e.selectRootElement(t, i);
    return vp(s), s;
  }
  function vp(e) {
    yp(e);
  }
  function _p(e) {
    return e === "class" ? "className" : e === "for" ? "htmlFor" : e === "formaction" ? "formAction" : e === "innerHtml" ? "innerHTML" : e === "readonly" ? "readOnly" : e === "tabindex" ? "tabIndex" : e;
  }
  function Ip(e, t, n, r, o, i, s, a) {
    if (!a && us(t, e, n, r, o)) {
      zt(t) && bp(n, t.index);
      return;
    }
    if (t.type & 3) {
      let l = Me(t, n);
      r = _p(r), o = s != null ? s(o, t.value || "", r) : o, i.setProperty(l, r, o);
    } else t.type & 12;
  }
  function bp(e, t) {
    let n = ke(t, e);
    n[v] & 16 || (n[v] |= 64);
  }
  function Dp(e, t, n) {
    let r = n.directiveStart, o = n.directiveEnd;
    zt(n) && gp(t, n, e.data[r + n.componentOffset]), e.firstCreatePass || Mc(n, t);
    let i = n.initialInputs;
    for (let s = r; s < o; s++) {
      let a = e.data[s], l = ii(t, e, s, n);
      if (Qt(l, t), i !== null && Sp(t, s - r, l, a, n, i), We(a)) {
        let c = ke(n.index, t);
        c[H] = ii(t, e, s, n);
      }
    }
  }
  function Ep(e, t, n) {
    let r = n.directiveStart, o = n.directiveEnd, i = n.index, s = nh();
    try {
      $e(i);
      for (let a = r; a < o; a++) {
        let l = e.data[a], c = t[a];
        ti(a), (l.hostBindings !== null || l.hostVars !== 0 || l.hostAttrs !== null) && wp(l, c);
      }
    } finally {
      $e(-1), ti(s);
    }
  }
  function wp(e, t) {
    e.hostBindings !== null && e.hostBindings(1, t);
  }
  function cu(e, t) {
    let n = e.directiveRegistry, r = null;
    if (n) for (let o = 0; o < n.length; o++) {
      let i = n[o];
      ap(t, i.selectors, false) && (r ??= [], We(i) ? r.unshift(i) : r.push(i));
    }
    return r;
  }
  function Cp(e, t, n, r, o, i) {
    t[b].firstUpdatePass && tp(n);
    let s = Me(e, t);
    Mp(t[z], s, i, e.value, n, r, o);
  }
  function Mp(e, t, n, r, o, i, s) {
    if (i == null) e.removeAttribute(t, o, n);
    else {
      let a = s == null ? Li(i) : s(i, r || "", o);
      e.setAttribute(t, o, a, n);
    }
  }
  function Sp(e, t, n, r, o, i) {
    let s = i[t];
    if (s !== null) for (let a = 0; a < s.length; a += 2) {
      let l = s[a], c = s[a + 1];
      gi(r, n, l, c);
    }
  }
  function Tp(e, t) {
    let n = e[st], r = n ? n.get(we, null) : null;
    r && r.handleError(t);
  }
  function us(e, t, n, r, o) {
    let i = e.inputs?.[r], s = e.hostDirectiveInputs?.[r], a = false;
    if (s) for (let l = 0; l < s.length; l += 2) {
      let c = s[l], u = s[l + 1], f = t.data[c];
      gi(f, n[c], u, o), a = true;
    }
    if (i) for (let l of i) {
      let c = n[l], u = t.data[l];
      gi(u, c, r, o), a = true;
    }
    return a;
  }
  function xp(e, t) {
    let n = ke(t, e), r = n[b];
    Np(r, n);
    let o = n[Ce];
    o !== null && n[jt] === null && (n[jt] = Yc(o, n[st])), k(18), ds(r, n, n[H]), k(19, n[H]);
  }
  function Np(e, t) {
    for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n]);
  }
  function ds(e, t, n) {
    Qi(t);
    try {
      let r = e.viewQuery;
      r !== null && fi(1, r, n);
      let o = e.template;
      o !== null && au(e, t, o, 1, n), e.firstCreatePass && (e.firstCreatePass = false), t[lt]?.finishViewCreation(e), e.staticContentQueries && Kc(e, t), e.staticViewQueries && fi(2, e.viewQuery, n);
      let i = e.components;
      i !== null && kp(t, i);
    } catch (r) {
      throw e.firstCreatePass && (e.incompleteFirstPass = true, e.firstCreatePass = false), r;
    } finally {
      t[v] &= -5, Yi();
    }
  }
  function kp(e, t) {
    for (let n = 0; n < t.length; n++) xp(e, t[n]);
  }
  function fs(e, t, n, r) {
    let o = y(null);
    try {
      let i = t.tView, a = e[v] & 4096 ? 4096 : 16, l = ls(e, i, n, a, null, t, null, null, r?.injector ?? null, r?.embeddedViewInjector ?? null, r?.dehydratedView ?? null), c = e[t.index];
      l[at] = c;
      let u = e[lt];
      return u !== null && (l[lt] = u.createEmbeddedView(i)), ds(i, l, n), l;
    } finally {
      y(o);
    }
  }
  function hs(e, t) {
    return !t || t.firstChild === null || $c(e);
  }
  function ps(e, t) {
    return Ap(e, t);
  }
  function uu(e) {
    return (e.flags & 32) === 32;
  }
  function rt(e, t, n, r, o) {
    if (r != null) {
      let i, s = false;
      ze(r) ? i = r : Ve(r) && (s = true, r = r[Ce]);
      let a = Ee(r);
      e === 0 && n !== null ? o == null ? eu(t, n, a) : pi(t, n, a, o || null, true) : e === 1 && n !== null ? pi(t, n, a, o || null, true) : e === 2 ? Jh(t, a, s) : e === 3 && t.destroyNode(a), i != null && Gp(t, e, i, n, o);
    }
  }
  function Rp(e, t) {
    du(e, t), t[Ce] = null, t[ge] = null;
  }
  function Op(e, t, n, r, o, i) {
    r[Ce] = o, r[ge] = t, Ir(e, r, n, 1, o, i);
  }
  function du(e, t) {
    t[Ne].changeDetectionScheduler?.notify(9), Ir(e, t, t[z], 2, null, null);
  }
  function Pp(e) {
    let t = e[Ht];
    if (!t) return $o(e[b], e);
    for (; t; ) {
      let n = null;
      if (Ve(t)) n = t[Ht];
      else {
        let r = t[Q];
        r && (n = r);
      }
      if (!n) {
        for (; t && !t[le] && t !== e; ) Ve(t) && $o(t[b], t), t = t[ee];
        t === null && (t = e), Ve(t) && $o(t[b], t), n = t && t[le];
      }
      t = n;
    }
  }
  function gs(e, t) {
    let n = e[Xn], r = n.indexOf(t);
    n.splice(r, 1);
  }
  function ms(e, t) {
    if (ht(t)) return;
    let n = t[z];
    n.destroyNode && Ir(e, t, n, 3, null, null), Pp(t);
  }
  function $o(e, t) {
    if (ht(t)) return;
    let n = y(null);
    try {
      t[v] &= -129, t[v] |= 256, t[X] && Zr(t[X]), Lp(e, t), Fp(e, t), t[b].type === 1 && t[z].destroy();
      let r = t[at];
      if (r !== null && ze(t[ee])) {
        r !== t[ee] && gs(r, t);
        let o = t[lt];
        o !== null && o.detachView(e);
      }
      ui(t);
    } finally {
      y(n);
    }
  }
  function Fp(e, t) {
    let n = e.cleanup, r = t[Kn];
    if (n !== null) for (let s = 0; s < n.length - 1; s += 2) if (typeof n[s] == "string") {
      let a = n[s + 3];
      a >= 0 ? r[a]() : r[-a].unsubscribe(), s += 2;
    } else {
      let a = r[n[s + 1]];
      n[s].call(a);
    }
    r !== null && (t[Kn] = null);
    let o = t[xe];
    if (o !== null) {
      t[xe] = null;
      for (let s = 0; s < o.length; s++) {
        let a = o[s];
        a();
      }
    }
    let i = t[Jn];
    if (i !== null) {
      t[Jn] = null;
      for (let s of i) s.destroy();
    }
  }
  function Lp(e, t) {
    let n;
    if (e != null && (n = e.destroyHooks) != null) for (let r = 0; r < n.length; r += 2) {
      let o = t[n[r]];
      if (!(o instanceof Bt)) {
        let i = n[r + 1];
        if (Array.isArray(i)) for (let s = 0; s < i.length; s += 2) {
          let a = o[i[s]], l = i[s + 1];
          k(4, a, l);
          try {
            l.call(a);
          } finally {
            k(5, a, l);
          }
        }
        else {
          k(4, o, i);
          try {
            i.call(o);
          } finally {
            k(5, o, i);
          }
        }
      }
    }
  }
  function Vp(e, t, n) {
    return jp(e, t.parent, n);
  }
  function jp(e, t, n) {
    let r = t;
    for (; r !== null && r.type & 168; ) t = r, r = t.parent;
    if (r === null) return n[Ce];
    if (zt(r)) {
      let { encapsulation: o } = e.data[r.directiveStart + r.componentOffset];
      if (o === pe.None || o === pe.Emulated) return null;
    }
    return Me(r, n);
  }
  function Hp(e, t, n) {
    return Bp(e, t, n);
  }
  function $p(e, t, n) {
    return e.type & 40 ? Me(e, n) : null;
  }
  function vs(e, t, n, r) {
    let o = Vp(e, r, t), i = t[z], s = r.parent || t[ge], a = Hp(s, r, t);
    if (o != null) if (Array.isArray(n)) for (let l = 0; l < n.length; l++) Dl(i, o, n[l], a, false);
    else Dl(i, o, n, a, false);
    wl !== void 0 && wl(i, r, t, n, o);
  }
  function Pt(e, t) {
    if (t !== null) {
      let n = t.type;
      if (n & 3) return Me(t, e);
      if (n & 4) return mi(-1, e[t.index]);
      if (n & 8) {
        let r = t.child;
        if (r !== null) return Pt(e, r);
        {
          let o = e[t.index];
          return ze(o) ? mi(-1, o) : Ee(o);
        }
      } else {
        if (n & 128) return Pt(e, t.next);
        if (n & 32) return ps(t, e)() || Ee(e[t.index]);
        {
          let r = fu(e, t);
          if (r !== null) {
            if (Array.isArray(r)) return r[0];
            let o = He(e[he]);
            return Pt(o, r);
          } else return Pt(e, t.next);
        }
      }
    }
    return null;
  }
  function fu(e, t) {
    if (t !== null) {
      let r = e[he][ge], o = t.projection;
      return r.projection[o];
    }
    return null;
  }
  function mi(e, t) {
    let n = Q + e + 1;
    if (n < t.length) {
      let r = t[n], o = r[b].firstChild;
      if (o !== null) return Pt(r, o);
    }
    return t[$t];
  }
  function ys(e, t, n, r, o, i, s) {
    for (; n != null; ) {
      if (n.type === 128) {
        n = n.next;
        continue;
      }
      let a = r[n.index], l = n.type;
      if (s && t === 0 && (a && Qt(Ee(a), r), n.flags |= 2), !uu(n)) if (l & 8) ys(e, t, n.child, r, o, i, false), rt(t, e, o, a, i);
      else if (l & 32) {
        let c = ps(n, r), u;
        for (; u = c(); ) rt(t, e, o, u, i);
        rt(t, e, o, a, i);
      } else l & 16 ? Up(e, t, r, n, o, i) : rt(t, e, o, a, i);
      n = s ? n.projectionNext : n.next;
    }
  }
  function Ir(e, t, n, r, o, i) {
    ys(n, r, e.firstChild, t, o, i, false);
  }
  function Up(e, t, n, r, o, i) {
    let s = n[he], l = s[ge].projection[r.projection];
    if (Array.isArray(l)) for (let c = 0; c < l.length; c++) {
      let u = l[c];
      rt(t, e, o, u, i);
    }
    else {
      let c = l, u = s[ee];
      $c(r) && (c.flags |= 128), ys(e, t, c, u, o, i, true);
    }
  }
  function Gp(e, t, n, r, o) {
    let i = n[$t], s = Ee(n);
    i !== s && rt(t, e, r, i, o);
    for (let a = Q; a < n.length; a++) {
      let l = n[a];
      Ir(l[b], l, e, t, r, i);
    }
  }
  function zp(e, t, n, r, o) {
    if (t) o ? e.addClass(n, r) : e.removeClass(n, r);
    else {
      let i = r.indexOf("-") === -1 ? void 0 : Re.DashCase;
      o == null ? e.removeStyle(n, r, i) : (typeof o == "string" && o.endsWith("!important") && (o = o.slice(0, -10), i |= Re.Important), e.setStyle(n, r, o, i));
    }
  }
  function or(e, t, n, r, o = false) {
    for (; n !== null; ) {
      if (n.type === 128) {
        n = o ? n.projectionNext : n.next;
        continue;
      }
      let i = t[n.index];
      i !== null && r.push(Ee(i)), ze(i) && Wp(i, r);
      let s = n.type;
      if (s & 8) or(e, t, n.child, r);
      else if (s & 32) {
        let a = ps(n, t), l;
        for (; l = a(); ) r.push(l);
      } else if (s & 16) {
        let a = fu(t, n);
        if (Array.isArray(a)) r.push(...a);
        else {
          let l = He(t[he]);
          or(l[b], l, a, r, true);
        }
      }
      n = o ? n.projectionNext : n.next;
    }
    return r;
  }
  function Wp(e, t) {
    for (let n = Q; n < e.length; n++) {
      let r = e[n], o = r[b].firstChild;
      o !== null && or(r[b], r, o, t);
    }
    e[$t] !== e[Ce] && t.push(e[$t]);
  }
  function hu(e) {
    if (e[Vo] !== null) {
      for (let t of e[Vo]) t.impl.addSequence(t);
      e[Vo].length = 0;
    }
  }
  function qp(e) {
    return e[X] ?? Zp(e);
  }
  function Zp(e) {
    let t = pu.pop() ?? Object.create(Yp);
    return t.lView = e, t;
  }
  function Qp(e) {
    e.lView[X] !== e && (e.lView = null, pu.push(e));
  }
  function Kp(e) {
    let t = e[X] ?? Object.create(Jp);
    return t.lView = e, t;
  }
  function gu(e) {
    return e.type !== 2;
  }
  function mu(e) {
    if (e[Jn] === null) return;
    let t = true;
    for (; t; ) {
      let n = false;
      for (let r of e[Jn]) r.dirty && (n = true, r.zone === null || Zone.current === r.zone ? r.run() : r.zone.run(() => r.run()));
      t = n && !!(e[v] & 8192);
    }
  }
  function vu(e, t = true, n = 0) {
    let o = e[Ne].rendererFactory, i = false;
    i || o.begin?.();
    try {
      eg(e, n);
    } catch (s) {
      throw t && Tp(e, s), s;
    } finally {
      i || o.end?.();
    }
  }
  function eg(e, t) {
    let n = hc();
    try {
      ul(true), vi(e, t);
      let r = 0;
      for (; Wt(e); ) {
        if (r === Xp) throw new w(103, false);
        r++, vi(e, 1);
      }
    } finally {
      ul(n);
    }
  }
  function tg(e, t, n, r) {
    if (ht(t)) return;
    let o = t[v], i = false, s = false;
    Qi(t);
    let a = true, l = null, c = null;
    i || (gu(e) ? (c = qp(t), l = hn(c)) : Br() === null ? (a = false, c = Kp(t), l = hn(c)) : t[X] && (Zr(t[X]), t[X] = null));
    try {
      sc(t), Jf(e.bindingStartIndex), n !== null && au(e, t, n, 2, r);
      let u = (o & 3) === 3;
      if (!i) if (u) {
        let d = e.preOrderCheckHooks;
        d !== null && Un(t, d, null);
      } else {
        let d = e.preOrderHooks;
        d !== null && Gn(t, d, 0, null), jo(t, 0);
      }
      if (s || ng(t), mu(t), yu(t, 0), e.contentQueries !== null && Kc(e, t), !i) if (u) {
        let d = e.contentCheckHooks;
        d !== null && Un(t, d);
      } else {
        let d = e.contentHooks;
        d !== null && Gn(t, d, 1), jo(t, 1);
      }
      og(e, t);
      let f = e.components;
      f !== null && Iu(t, f, 0);
      let h = e.viewQuery;
      if (h !== null && fi(2, h, r), !i) if (u) {
        let d = e.viewCheckHooks;
        d !== null && Un(t, d);
      } else {
        let d = e.viewHooks;
        d !== null && Gn(t, d, 2), jo(t, 2);
      }
      if (e.firstUpdatePass === true && (e.firstUpdatePass = false), t[Lo]) {
        for (let d of t[Lo]) d();
        t[Lo] = null;
      }
      i || (hu(t), t[v] &= -73);
    } catch (u) {
      throw i || pr(t), u;
    } finally {
      c !== null && (Wr(c, l), a && Qp(c)), Yi();
    }
  }
  function yu(e, t) {
    for (let n = Gc(e); n !== null; n = zc(n)) for (let r = Q; r < n.length; r++) {
      let o = n[r];
      _u(o, t);
    }
  }
  function ng(e) {
    for (let t = Gc(e); t !== null; t = zc(t)) {
      if (!(t[v] & 2)) continue;
      let n = t[Xn];
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        Wi(o);
      }
    }
  }
  function rg(e, t, n) {
    k(18);
    let r = ke(t, e);
    _u(r, n), k(19, r[H]);
  }
  function _u(e, t) {
    zi(e) && vi(e, t);
  }
  function vi(e, t) {
    let r = e[b], o = e[v], i = e[X], s = !!(t === 0 && o & 16);
    if (s ||= !!(o & 64 && t === 0), s ||= !!(o & 1024), s ||= !!(i?.dirty && qr(i)), s ||= false, i && (i.dirty = false), e[v] &= -9217, s) tg(r, e, r.template, e[H]);
    else if (o & 8192) {
      mu(e), yu(e, 1);
      let a = r.components;
      a !== null && Iu(e, a, 1), hu(e);
    }
  }
  function Iu(e, t, n) {
    for (let r = 0; r < t.length; r++) rg(e, t[r], n);
  }
  function og(e, t) {
    let n = e.hostBindingOpCodes;
    if (n !== null) try {
      for (let r = 0; r < n.length; r++) {
        let o = n[r];
        if (o < 0) $e(~o);
        else {
          let i = o, s = n[++r], a = n[++r];
          th(s, i);
          let l = t[i];
          k(24, l), a(2, l), k(25, l);
        }
      }
    } finally {
      $e(-1);
    }
  }
  function _s(e, t) {
    let n = hc() ? 64 : 1088;
    for (e[Ne].changeDetectionScheduler?.notify(t); e; ) {
      e[v] |= n;
      let r = He(e);
      if (er(e) && !r) return e;
      e = r;
    }
    return null;
  }
  function ig(e, t, n, r) {
    return [e, true, 0, t, null, r, null, n, null, null];
  }
  function bu(e, t) {
    let n = Q + t;
    if (n < e.length) return e[n];
  }
  function Is(e, t, n, r = true) {
    let o = t[b];
    if (sg(o, t, e, n), r) {
      let s = mi(n, e), a = t[z], l = a.parentNode(e[$t]);
      l !== null && Op(o, e[ge], a, t, l, s);
    }
    let i = t[jt];
    i !== null && i.firstChild !== null && (i.firstChild = null);
  }
  function Du(e, t) {
    let n = bs(e, t);
    return n !== void 0 && ms(n[b], n), n;
  }
  function bs(e, t) {
    if (e.length <= Q) return;
    let n = Q + t, r = e[n];
    if (r) {
      let o = r[at];
      o !== null && o !== e && gs(o, r), t > 0 && (e[n - 1][le] = r[le]);
      let i = Wl(e, Q + t);
      Rp(r[b], r);
      let s = i[lt];
      s !== null && s.detachView(i[b]), r[ee] = null, r[le] = null, r[v] &= -129;
    }
    return r;
  }
  function sg(e, t, n, r) {
    let o = Q + r, i = n.length;
    r > 0 && (n[o - 1][le] = t), r < i - Q ? (t[le] = n[o], vf(n, Q + r, t)) : (n.push(t), t[le] = null), t[ee] = n;
    let s = t[at];
    s !== null && n !== s && Eu(s, t);
    let a = t[lt];
    a !== null && a.insertView(e), Xo(t), t[v] |= 128;
  }
  function Eu(e, t) {
    let n = e[Xn], r = t[ee];
    if (Ve(r)) e[v] |= 2;
    else {
      let o = r[ee][he];
      t[he] !== o && (e[v] |= 2);
    }
    n === null ? e[Xn] = [t] : n.push(t);
  }
  function wu(e) {
    return Wt(e._lView) || !!(e._lView[v] & 64);
  }
  function Cu(e) {
    Wi(e._cdRefInjectingView || e._lView);
  }
  function Ds(e, t, n, r, o) {
    let i = e.data[t];
    if (i === null) i = lg(e, t, n, r, o), eh() && (i.flags |= 32);
    else if (i.type & 64) {
      i.type = n, i.value = r, i.attrs = o;
      let s = Yf();
      i.injectorIndex = s === null ? -1 : s.injectorIndex;
    }
    return qt(i, true), i;
  }
  function lg(e, t, n, r, o) {
    let i = dc(), s = fc(), a = s ? i : i && i.parent, l = e.data[t] = ug(e, a, n, t, r, o);
    return cg(e, l, i, s), l;
  }
  function cg(e, t, n, r) {
    e.firstChild === null && (e.firstChild = t), n !== null && (r ? n.child == null && t.parent !== null && (n.child = t) : n.next === null && (n.next = t, t.prev = n));
  }
  function ug(e, t, n, r, o, i) {
    let s = t ? t.injectorIndex : -1, a = 0;
    return qf() && (a |= 128), { type: n, index: r, insertBeforeIndex: null, injectorIndex: s, directiveStart: -1, directiveEnd: -1, directiveStylingLast: -1, componentOffset: -1, propertyBindings: null, flags: a, providerIndexes: 0, value: o, attrs: i, mergedAttrs: null, localNames: null, initialInputs: null, inputs: null, hostDirectiveInputs: null, outputs: null, hostDirectiveOutputs: null, directiveToIndex: null, tView: null, next: null, prev: null, projectionNext: null, child: null, parent: t, projection: null, styles: null, stylesWithoutHost: null, residualStyles: void 0, classes: null, classesWithoutHost: null, residualClasses: void 0, classBindings: 0, styleBindings: 0 };
  }
  function Es(e, t) {
    return dg(e, t);
  }
  function Cl(e, t, n) {
    let r = n ? e.styles : null, o = n ? e.classes : null, i = 0;
    if (t !== null) for (let s = 0; s < t.length; s++) {
      let a = t[s];
      if (typeof a == "number") i = a;
      else if (i == 1) o = el(o, a);
      else if (i == 2) {
        let l = a, c = t[++s];
        r = el(r, l + ": " + c + ";");
      }
    }
    n ? e.styles = r : e.stylesWithoutHost = r, n ? e.classes = o : e.classesWithoutHost = o;
  }
  function Su(e, t = _.Default) {
    let n = L();
    if (n === null) return N(e, t);
    let r = pt();
    return kc(r, n, se(e), t);
  }
  function Tu(e, t, n, r, o) {
    let i = r === null ? null : { "": -1 }, s = o(e, n);
    if (s !== null) {
      let a, l = null, c = null, u = gg(s);
      u === null ? a = s : [a, l, c] = u, yg(e, t, n, a, i, l, c);
    }
    i !== null && r !== null && pg(n, r, i);
  }
  function pg(e, t, n) {
    let r = e.localNames = [];
    for (let o = 0; o < t.length; o += 2) {
      let i = n[t[o + 1]];
      if (i == null) throw new w(-301, false);
      r.push(t[o], i);
    }
  }
  function gg(e) {
    let t = null, n = false;
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (s === 0 && We(a) && (t = a), a.findHostDirectiveDefs !== null) {
        n = true;
        break;
      }
    }
    if (!n) return null;
    let r = null, o = null, i = null;
    for (let s of e) s.findHostDirectiveDefs !== null && (r ??= [], o ??= /* @__PURE__ */ new Map(), i ??= /* @__PURE__ */ new Map(), mg(s, r, i, o)), s === t && (r ??= [], r.push(s));
    return r !== null ? (r.push(...t === null ? e : e.slice(1)), [r, o, i]) : null;
  }
  function mg(e, t, n, r) {
    let o = t.length;
    e.findHostDirectiveDefs(e, t, r), n.set(e, [o, t.length - 1]);
  }
  function vg(e, t, n) {
    t.componentOffset = n, (e.components ??= []).push(t.index);
  }
  function yg(e, t, n, r, o, i, s) {
    let a = r.length, l = false;
    for (let h = 0; h < a; h++) {
      let d = r[h];
      !l && We(d) && (l = true, vg(e, n, h)), _h(Mc(n, t), e, d.type);
    }
    wg(n, e.data.length, a);
    for (let h = 0; h < a; h++) {
      let d = r[h];
      d.providersResolver && d.providersResolver(d);
    }
    let c = false, u = false, f = ou(e, t, a, null);
    a > 0 && (n.directiveToIndex = /* @__PURE__ */ new Map());
    for (let h = 0; h < a; h++) {
      let d = r[h];
      if (n.mergedAttrs = Xi(n.mergedAttrs, d.hostAttrs), Ig(e, n, t, f, d), Eg(f, d, o), s !== null && s.has(d)) {
        let [m, T] = s.get(d);
        n.directiveToIndex.set(d.type, [f, m + n.directiveStart, T + n.directiveStart]);
      } else (i === null || !i.has(d)) && n.directiveToIndex.set(d.type, f);
      d.contentQueries !== null && (n.flags |= 4), (d.hostBindings !== null || d.hostAttrs !== null || d.hostVars !== 0) && (n.flags |= 64);
      let p = d.type.prototype;
      !c && (p.ngOnChanges || p.ngOnInit || p.ngDoCheck) && ((e.preOrderHooks ??= []).push(n.index), c = true), !u && (p.ngOnChanges || p.ngDoCheck) && ((e.preOrderCheckHooks ??= []).push(n.index), u = true), f++;
    }
    _g(e, n, i);
  }
  function _g(e, t, n) {
    for (let r = t.directiveStart; r < t.directiveEnd; r++) {
      let o = e.data[r];
      if (n === null || !n.has(o)) Ml(0, t, o, r), Ml(1, t, o, r), Tl(t, r, false);
      else {
        let i = n.get(o);
        Sl(0, t, i, r), Sl(1, t, i, r), Tl(t, r, true);
      }
    }
  }
  function Ml(e, t, n, r) {
    let o = e === 0 ? n.inputs : n.outputs;
    for (let i in o) if (o.hasOwnProperty(i)) {
      let s;
      e === 0 ? s = t.inputs ??= {} : s = t.outputs ??= {}, s[i] ??= [], s[i].push(r), xu(t, i);
    }
  }
  function Sl(e, t, n, r) {
    let o = e === 0 ? n.inputs : n.outputs;
    for (let i in o) if (o.hasOwnProperty(i)) {
      let s = o[i], a;
      e === 0 ? a = t.hostDirectiveInputs ??= {} : a = t.hostDirectiveOutputs ??= {}, a[s] ??= [], a[s].push(r, i), xu(t, s);
    }
  }
  function xu(e, t) {
    t === "class" ? e.flags |= 8 : t === "style" && (e.flags |= 16);
  }
  function Tl(e, t, n) {
    let { attrs: r, inputs: o, hostDirectiveInputs: i } = e;
    if (r === null || !n && o === null || n && i === null || ss(e)) {
      e.initialInputs ??= [], e.initialInputs.push(null);
      return;
    }
    let s = null, a = 0;
    for (; a < r.length; ) {
      let l = r[a];
      if (l === 0) {
        a += 4;
        continue;
      } else if (l === 5) {
        a += 2;
        continue;
      } else if (typeof l == "number") break;
      if (!n && o.hasOwnProperty(l)) {
        let c = o[l];
        for (let u of c) if (u === t) {
          s ??= [], s.push(l, r[a + 1]);
          break;
        }
      } else if (n && i.hasOwnProperty(l)) {
        let c = i[l];
        for (let u = 0; u < c.length; u += 2) if (c[u] === t) {
          s ??= [], s.push(c[u + 1], r[a + 1]);
          break;
        }
      }
      a += 2;
    }
    e.initialInputs ??= [], e.initialInputs.push(s);
  }
  function Ig(e, t, n, r, o) {
    e.data[r] = o;
    let i = o.factory || (o.factory = Lt(o.type, true)), s = new Bt(i, We(o), Su);
    e.blueprint[r] = s, n[r] = s, bg(e, t, r, ou(e, n, o.hostVars, Ze), o);
  }
  function bg(e, t, n, r, o) {
    let i = o.hostBindings;
    if (i) {
      let s = e.hostBindingOpCodes;
      s === null && (s = e.hostBindingOpCodes = []);
      let a = ~t.index;
      Dg(s) != a && s.push(a), s.push(n, r, i);
    }
  }
  function Dg(e) {
    let t = e.length;
    for (; t > 0; ) {
      let n = e[--t];
      if (typeof n == "number" && n < 0) return n;
    }
    return 0;
  }
  function Eg(e, t, n) {
    if (n) {
      if (t.exportAs) for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
      We(t) && (n[""] = e);
    }
  }
  function wg(e, t, n) {
    e.flags |= 1, e.directiveStart = t, e.directiveEnd = t + n, e.providerIndexes = t;
  }
  function Nu(e, t, n, r, o, i, s, a) {
    let l = t.consts, c = ct(l, s), u = Ds(t, e, 2, r, c);
    return i && Tu(t, n, u, ct(l, a), o), u.mergedAttrs = Xi(u.mergedAttrs, u.attrs), u.attrs !== null && Cl(u, u.attrs, false), u.mergedAttrs !== null && Cl(u, u.mergedAttrs, true), t.queries !== null && t.queries.elementStart(t, u), u;
  }
  function ku(e, t) {
    Dc(e, t), tc(t) && e.queries.elementEnd(t);
  }
  function Cg(e) {
    return Object.keys(e).map((t) => {
      let [n, r, o] = e[t], i = { propName: n, templateName: t, isSignal: (r & _r.SignalBased) !== 0 };
      return o && (i.transform = o), i;
    });
  }
  function Mg(e) {
    return Object.keys(e).map((t) => ({ propName: e[t], templateName: t }));
  }
  function Sg(e, t, n) {
    let r = t instanceof je ? t : t?.injector;
    return r && e.getStandaloneInjector !== null && (r = e.getStandaloneInjector(r) || r), r ? new _i(n, r) : n;
  }
  function Tg(e) {
    let t = e.get(ut, null);
    if (t === null) throw new w(407, false);
    let n = e.get(hg, null), r = e.get(Be, null);
    return { rendererFactory: t, sanitizer: n, changeDetectionScheduler: r };
  }
  function xg(e, t) {
    let n = (e.selectors[0][0] || "div").toLowerCase();
    return Xc(t, n, n === "svg" ? Hf : n === "math" ? $f : null);
  }
  function Ng(e, t, n) {
    let r = e.projection = [];
    for (let o = 0; o < t.length; o++) {
      let i = n[o];
      r.push(i != null && i.length ? Array.from(i) : null);
    }
  }
  function Ag(e, t, n) {
    return kg(e, t, n);
  }
  function Rg(e, t, n = null) {
    return new ir({ providers: e, parent: t, debugName: n, runEnvironmentInitializers: true }).injector;
  }
  function Au(e) {
    return jl(() => {
      let t = jg(e), n = B(E({}, t), { decls: e.decls, vars: e.vars, template: e.template, consts: e.consts || null, ngContentSelectors: e.ngContentSelectors, onPush: e.changeDetection === Bc.OnPush, directiveDefs: null, pipeDefs: null, dependencies: t.standalone && e.dependencies || null, getStandaloneInjector: t.standalone ? (o) => o.get(Og).getOrCreateStandaloneInjector(n) : null, getExternalStyles: null, signals: e.signals ?? false, data: e.data || {}, encapsulation: e.encapsulation || pe.Emulated, styles: e.styles || ae, _: null, schemas: e.schemas || null, tView: null, id: "" });
      t.standalone && yr("NgStandalone"), Hg(n);
      let r = e.dependencies;
      return n.directiveDefs = xl(r, false), n.pipeDefs = xl(r, true), n.id = $g(n), n;
    });
  }
  function Pg(e) {
    return Hi(e) || bf(e);
  }
  function Fg(e) {
    return e !== null;
  }
  function br(e) {
    return jl(() => ({ type: e.type, bootstrap: e.bootstrap || ae, declarations: e.declarations || ae, imports: e.imports || ae, exports: e.exports || ae, transitiveCompileScopes: null, schemas: e.schemas || null, id: e.id || null }));
  }
  function Lg(e, t) {
    if (e == null) return it;
    let n = {};
    for (let r in e) if (e.hasOwnProperty(r)) {
      let o = e[r], i, s, a, l;
      Array.isArray(o) ? (a = o[0], i = o[1], s = o[2] ?? i, l = o[3] || null) : (i = o, s = o, a = _r.None, l = null), n[i] = [r, a, l], t[i] = s;
    }
    return n;
  }
  function Vg(e) {
    if (e == null) return it;
    let t = {};
    for (let n in e) e.hasOwnProperty(n) && (t[e[n]] = n);
    return t;
  }
  function jg(e) {
    let t = {};
    return { type: e.type, providersResolver: null, factory: null, hostBindings: e.hostBindings || null, hostVars: e.hostVars || 0, hostAttrs: e.hostAttrs || null, contentQueries: e.contentQueries || null, declaredInputs: t, inputConfig: e.inputs || it, exportAs: e.exportAs || null, standalone: e.standalone ?? true, signals: e.signals === true, selectors: e.selectors || ae, viewQuery: e.viewQuery || null, features: e.features || null, setInput: null, findHostDirectiveDefs: null, hostDirectives: null, inputs: Lg(e.inputs, t), outputs: Vg(e.outputs), debugInfo: null };
  }
  function Hg(e) {
    e.features?.forEach((t) => t(e));
  }
  function xl(e, t) {
    if (!e) return null;
    let n = t ? Df : Pg;
    return () => (typeof e == "function" ? e() : e).map((r) => n(r)).filter(Fg);
  }
  function $g(e) {
    let t = 0, n = typeof e.consts == "function" ? "" : e.consts, r = [e.selectors, e.ngContentSelectors, e.hostVars, e.hostAttrs, n, e.vars, e.decls, e.encapsulation, e.standalone, e.signals, e.exportAs, JSON.stringify(e.inputs), JSON.stringify(e.outputs), Object.getOwnPropertyNames(e.type.prototype), !!e.contentQueries, !!e.viewQuery];
    for (let i of r.join("|")) t = Math.imul(31, t) + i.charCodeAt(0) << 0;
    return t += 2147483648, "c" + t;
  }
  function mt(e, t, n) {
    let r = e[t];
    return Object.is(r, n) ? false : (e[t] = n, true);
  }
  function Bg(e, t, n, r, o, i, s, a, l) {
    let c = t.consts, u = Ds(t, e, 4, s || null, a || null);
    uc() && Tu(t, n, u, ct(c, l), cu), u.mergedAttrs = Xi(u.mergedAttrs, u.attrs), Dc(t, u);
    let f = u.tView = as(2, u, r, o, i, t.directiveRegistry, t.pipeRegistry, null, t.schemas, c, null);
    return t.queries !== null && (t.queries.template(t, u), f.queries = t.queries.embeddedTView(u)), u;
  }
  function wi(e, t, n, r, o, i, s, a, l, c) {
    let u = n + te, f = t.firstCreatePass ? Bg(u, t, e, r, o, i, s, a, l) : t.data[u];
    qt(f, false);
    let h = Ug(t, e, f, n);
    Ki() && vs(t, e, h, f), Qt(h, e);
    let d = ig(h, e, h, f);
    return e[u] = d, iu(e, d), Ag(d, f, e), Ui(f) && cs(t, e, f), l != null && lu(e, f, c), f;
  }
  function Kt(e, t, n, r, o, i, s, a) {
    let l = L(), c = me(), u = ct(c.consts, i);
    return wi(l, c, e, t, n, r, o, u, s, a), Kt;
  }
  function Gg(e, t, n, r) {
    return Ji(true), t[z].createComment("");
  }
  function ws(e) {
    return !!e && typeof e.then == "function";
  }
  function Wg(e) {
    return !!e && typeof e.subscribe == "function";
  }
  function Qg() {
    Yr(() => {
      throw new w(600, false);
    });
  }
  function Yg(e) {
    return e.isBoundToModule;
  }
  function zn(e, t) {
    let n = e.indexOf(t);
    n > -1 && e.splice(n, 1);
  }
  function Jg(e, t, n, r) {
    if (!n && !Wt(e)) return;
    vu(e, t, n && !r ? 0 : 1);
  }
  function Dr(e, t, n, r) {
    let o = L(), i = Zt();
    if (mt(o, i, t)) {
      let s = me(), a = Ic();
      Cp(a, o, e, t, n, r);
    }
    return Dr;
  }
  function Xg(e, t, n, r) {
    return mt(e, Zt(), n) ? t + Li(n) + r : Ze;
  }
  function $n(e, t) {
    return e << 17 | t << 2;
  }
  function Ge(e) {
    return e >> 17 & 32767;
  }
  function em(e) {
    return (e & 2) == 2;
  }
  function tm(e, t) {
    return e & 131071 | t << 17;
  }
  function Mi(e) {
    return e | 2;
  }
  function dt(e) {
    return (e & 131068) >> 2;
  }
  function Uo(e, t) {
    return e & -131069 | t << 2;
  }
  function nm(e) {
    return (e & 1) === 1;
  }
  function Si(e) {
    return e | 1;
  }
  function rm(e, t, n, r, o, i) {
    let s = i ? t.classBindings : t.styleBindings, a = Ge(s), l = dt(s);
    e[r] = n;
    let c = false, u;
    if (Array.isArray(n)) {
      let f = n;
      u = f[1], (u === null || Gt(f, u) > 0) && (c = true);
    } else u = n;
    if (o) if (l !== 0) {
      let h = Ge(e[a + 1]);
      e[r + 1] = $n(h, a), h !== 0 && (e[h + 1] = Uo(e[h + 1], r)), e[a + 1] = tm(e[a + 1], r);
    } else e[r + 1] = $n(a, 0), a !== 0 && (e[a + 1] = Uo(e[a + 1], r)), a = r;
    else e[r + 1] = $n(l, 0), a === 0 ? a = r : e[l + 1] = Uo(e[l + 1], r), l = r;
    c && (e[r + 1] = Mi(e[r + 1])), Nl(e, u, r, true), Nl(e, u, r, false), om(t, u, e, r, i), s = $n(a, l), i ? t.classBindings = s : t.styleBindings = s;
  }
  function om(e, t, n, r, o) {
    let i = o ? e.residualClasses : e.residualStyles;
    i != null && typeof t == "string" && Gt(i, t) >= 0 && (n[r + 1] = Si(n[r + 1]));
  }
  function Nl(e, t, n, r) {
    let o = e[n + 1], i = t === null, s = r ? Ge(o) : dt(o), a = false;
    for (; s !== 0 && (a === false || i); ) {
      let l = e[s], c = e[s + 1];
      im(l, t) && (a = true, e[s + 1] = r ? Si(c) : Mi(c)), s = r ? Ge(c) : dt(c);
    }
    a && (e[n + 1] = r ? Mi(o) : Si(o));
  }
  function im(e, t) {
    return e === null || t == null || (Array.isArray(e) ? e[1] : e) === t ? true : Array.isArray(e) && typeof t == "string" ? Gt(e, t) >= 0 : false;
  }
  function Er(e, t, n) {
    let r = L(), o = Zt();
    if (mt(r, o, t)) {
      let i = me(), s = Ic();
      Ip(i, s, r, e, t, r[z], n, false);
    }
    return Er;
  }
  function kl(e, t, n, r, o) {
    us(t, e, n, o ? "class" : "style", r);
  }
  function Jt(e, t) {
    return sm(e, t, null, true), Jt;
  }
  function sm(e, t, n, r) {
    let o = L(), i = me(), s = Xf(2);
    if (i.firstUpdatePass && lm(i, e, s, r), t !== Ze && mt(o, s, t)) {
      let a = i.data[qe()];
      hm(i, a, o, o[z], e, o[s + 1] = pm(t, n), r, s);
    }
  }
  function am(e, t) {
    return t >= e.expandoStartIndex;
  }
  function lm(e, t, n, r) {
    let o = e.data;
    if (o[n + 1] === null) {
      let i = o[qe()], s = am(e, n);
      gm(i, r) && t === null && !s && (t = false), t = cm(o, i, t, r), rm(o, i, t, n, s, r);
    }
  }
  function cm(e, t, n, r) {
    let o = rh(e), i = r ? t.residualClasses : t.residualStyles;
    if (o === null) (r ? t.classBindings : t.styleBindings) === 0 && (n = Go(null, e, t, n, r), n = Ut(n, t.attrs, r), i = null);
    else {
      let s = t.directiveStylingLast;
      if (s === -1 || e[s] !== o) if (n = Go(o, e, t, n, r), i === null) {
        let l = um(e, t, r);
        l !== void 0 && Array.isArray(l) && (l = Go(null, e, t, l[1], r), l = Ut(l, t.attrs, r), dm(e, t, r, l));
      } else i = fm(e, t, r);
    }
    return i !== void 0 && (r ? t.residualClasses = i : t.residualStyles = i), n;
  }
  function um(e, t, n) {
    let r = n ? t.classBindings : t.styleBindings;
    if (dt(r) !== 0) return e[Ge(r)];
  }
  function dm(e, t, n, r) {
    let o = n ? t.classBindings : t.styleBindings;
    e[Ge(o)] = r;
  }
  function fm(e, t, n) {
    let r, o = t.directiveEnd;
    for (let i = 1 + t.directiveStylingLast; i < o; i++) {
      let s = e[i].hostAttrs;
      r = Ut(r, s, n);
    }
    return Ut(r, t.attrs, n);
  }
  function Go(e, t, n, r, o) {
    let i = null, s = n.directiveEnd, a = n.directiveStylingLast;
    for (a === -1 ? a = n.directiveStart : a++; a < s && (i = t[a], r = Ut(r, i.hostAttrs, o), i !== e); ) a++;
    return e !== null && (n.directiveStylingLast = a), r;
  }
  function Ut(e, t, n) {
    let r = n ? 1 : 2, o = -1;
    if (t !== null) for (let i = 0; i < t.length; i++) {
      let s = t[i];
      typeof s == "number" ? o = s : o === r && (Array.isArray(e) || (e = e === void 0 ? [] : ["", e]), _f(e, s, n ? true : t[++i]));
    }
    return e === void 0 ? null : e;
  }
  function hm(e, t, n, r, o, i, s, a) {
    if (!(t.type & 3)) return;
    let l = e.data, c = l[a + 1], u = nm(c) ? Al(l, t, n, o, dt(c), s) : void 0;
    if (!sr(u)) {
      sr(i) || em(c) && (i = Al(l, null, n, o, a, s));
      let f = ic(qe(), n);
      zp(r, s, f, o, i);
    }
  }
  function Al(e, t, n, r, o, i) {
    let s = t === null, a;
    for (; o > 0; ) {
      let l = e[o], c = Array.isArray(l), u = c ? l[1] : l, f = u === null, h = n[o + 1];
      h === Ze && (h = f ? ae : void 0);
      let d = f ? Po(h, r) : u === r ? h : void 0;
      if (c && !sr(d) && (d = Po(l, r)), sr(d) && (a = d, s)) return a;
      let p = e[o + 1];
      o = s ? Ge(p) : dt(p);
    }
    if (t !== null) {
      let l = i ? t.residualClasses : t.residualStyles;
      l != null && (a = Po(l, r));
    }
    return a;
  }
  function sr(e) {
    return e !== void 0;
  }
  function pm(e, t) {
    return e == null || e === "" || (typeof t == "string" ? e = e + t : typeof e == "object" && (e = J(Qh(e)))), e;
  }
  function gm(e, t) {
    return (e.flags & (t ? 8 : 16)) !== 0;
  }
  function zo(e, t, n, r, o) {
    return e === n && Object.is(t, r) ? 1 : Object.is(o(e, t), o(n, r)) ? -1 : 0;
  }
  function mm(e, t, n) {
    let r, o, i = 0, s = e.length - 1, a = void 0;
    if (Array.isArray(t)) {
      let l = t.length - 1;
      for (; i <= s && i <= l; ) {
        let c = e.at(i), u = t[i], f = zo(i, c, i, u, n);
        if (f !== 0) {
          f < 0 && e.updateValue(i, u), i++;
          continue;
        }
        let h = e.at(s), d = t[l], p = zo(s, h, l, d, n);
        if (p !== 0) {
          p < 0 && e.updateValue(s, d), s--, l--;
          continue;
        }
        let m = n(i, c), T = n(s, h), I = n(i, u);
        if (Object.is(I, T)) {
          let re = n(l, d);
          Object.is(re, m) ? (e.swap(i, s), e.updateValue(s, d), l--, s--) : e.move(s, i), e.updateValue(i, u), i++;
          continue;
        }
        if (r ??= new ar(), o ??= Ol(e, i, s, n), xi(e, r, i, I)) e.updateValue(i, u), i++, s++;
        else if (o.has(I)) r.set(m, e.detach(i)), s--;
        else {
          let re = e.create(i, t[i]);
          e.attach(i, re), i++, s++;
        }
      }
      for (; i <= l; ) Rl(e, r, n, i, t[i]), i++;
    } else if (t != null) {
      let l = t[Symbol.iterator](), c = l.next();
      for (; !c.done && i <= s; ) {
        let u = e.at(i), f = c.value, h = zo(i, u, i, f, n);
        if (h !== 0) h < 0 && e.updateValue(i, f), i++, c = l.next();
        else {
          r ??= new ar(), o ??= Ol(e, i, s, n);
          let d = n(i, f);
          if (xi(e, r, i, d)) e.updateValue(i, f), i++, s++, c = l.next();
          else if (!o.has(d)) e.attach(i, e.create(i, f)), i++, s++, c = l.next();
          else {
            let p = n(i, u);
            r.set(p, e.detach(i)), s--;
          }
        }
      }
      for (; !c.done; ) Rl(e, r, n, e.length, c.value), c = l.next();
    }
    for (; i <= s; ) e.destroy(e.detach(s--));
    r?.forEach((l) => {
      e.destroy(l);
    });
  }
  function xi(e, t, n, r) {
    return t !== void 0 && t.has(r) ? (e.attach(n, t.get(r)), t.delete(r), true) : false;
  }
  function Rl(e, t, n, r, o) {
    if (xi(e, t, r, n(r, o))) e.updateValue(r, o);
    else {
      let i = e.create(r, o);
      e.attach(r, i);
    }
  }
  function Ol(e, t, n, r) {
    let o = /* @__PURE__ */ new Set();
    for (let i = t; i <= n; i++) o.add(r(i, e.at(i)));
    return o;
  }
  function vt(e, t) {
    yr("NgControlFlow");
    let n = L(), r = Zt(), o = n[r] !== Ze ? n[r] : -1, i = o !== -1 ? lr(n, te + o) : void 0, s = 0;
    if (mt(n, r, e)) {
      let a = y(null);
      try {
        if (i !== void 0 && Du(i, s), e !== -1) {
          let l = te + e, c = lr(n, l), u = Ri(n[b], l), f = Es(c, u.tView.ssrId), h = fs(n, u, t, { dehydratedView: f });
          Is(c, h, s, hs(u, f));
        }
      } finally {
        y(a);
      }
    } else if (i !== void 0) {
      let a = bu(i, s);
      a !== void 0 && (a[H] = t);
    }
  }
  function Pu(e, t, n, r, o, i, s, a, l, c, u, f, h) {
    yr("NgControlFlow");
    let d = L(), p = me(), m = l !== void 0, T = L(), I = a ? s.bind(T[he][H]) : s, re = new ki(m, I);
    T[te + e] = re, wi(d, p, e + 1, t, n, r, o, ct(p.consts, i)), m && wi(d, p, e + 2, l, c, u, f, ct(p.consts, h));
  }
  function Fu(e) {
    let t = y(null), n = qe();
    try {
      let r = L(), o = r[b], i = r[n], s = n + 1, a = lr(r, s);
      if (i.liveCollection === void 0) {
        let c = Ri(o, s);
        i.liveCollection = new Ai(a, r, c);
      } else i.liveCollection.reset();
      let l = i.liveCollection;
      if (mm(l, e, i.trackByFn), l.updateIndexes(), i.hasEmptyBlock) {
        let c = Zt(), u = l.length === 0;
        if (mt(r, c, u)) {
          let f = n + 2, h = lr(r, f);
          if (u) {
            let d = Ri(o, f), p = Es(h, d.tView.ssrId), m = fs(r, d, void 0, { dehydratedView: p });
            Is(h, m, 0, hs(d, p));
          } else Du(h, 0);
        }
      }
    } finally {
      y(t);
    }
  }
  function lr(e, t) {
    return e[t];
  }
  function vm(e, t) {
    return bs(e, t);
  }
  function ym(e, t) {
    return bu(e, t);
  }
  function Ri(e, t) {
    return Gi(e, t);
  }
  function F(e, t, n, r) {
    let o = L(), i = me(), s = te + e, a = o[z], l = i.firstCreatePass ? Nu(s, i, o, t, cu, uc(), n, r) : i.data[s], c = _m(i, o, l, a, t, e);
    o[s] = c;
    let u = Ui(l);
    return qt(l, true), tu(a, c, l), !uu(l) && Ki() && vs(i, o, c, l), (Gf() === 0 || u) && Qt(c, o), zf(), u && (cs(i, o, l), Jc(i, l, o)), r !== null && lu(o, l), F;
  }
  function V() {
    let e = pt();
    fc() ? Kf() : (e = e.parent, qt(e, false));
    let t = e;
    Zf(t) && Qf(), Wf();
    let n = me();
    return n.firstCreatePass && ku(n, t), t.classesWithoutHost != null && ch(t) && kl(n, t, L(), t.classesWithoutHost, true), t.stylesWithoutHost != null && uh(t) && kl(n, t, L(), t.stylesWithoutHost, false), V;
  }
  function Cs() {
    return L();
  }
  function bm(e) {
    typeof e == "string" && (Im = e.toLowerCase().replace(/_/g, "-"));
  }
  function Pl(e, t, n) {
    return function r(o) {
      if (o === Function) return n;
      let i = zt(e) ? ke(e.index, t) : t;
      _s(i, 5);
      let s = t[H], a = Fl(t, s, n, o), l = r.__ngNextListenerFn__;
      for (; l; ) a = Fl(t, s, l, o) && a, l = l.__ngNextListenerFn__;
      return a;
    };
  }
  function Fl(e, t, n, r) {
    let o = y(null);
    try {
      return k(6, t, n), n(r) !== false;
    } catch (i) {
      return Dm(e, i), false;
    } finally {
      k(7, t, n), y(o);
    }
  }
  function Dm(e, t) {
    let n = e[st], r = n ? n.get(we, null) : null;
    r && r.handleError(t);
  }
  function Ll(e, t, n, r, o, i) {
    let s = t[n], a = t[b], c = a.data[n].outputs[r], u = s[c], f = a.firstCreatePass ? cc(a) : null, h = lc(t), d = u.subscribe(i), p = h.length;
    h.push(i, d), f && f.push(o, e.index, p, -(p + 1));
  }
  function Xt(e, t, n, r) {
    let o = L(), i = me(), s = pt();
    return wm(i, o, o[z], s, e, t, r), Xt;
  }
  function Em(e, t, n, r) {
    let o = e.cleanup;
    if (o != null) for (let i = 0; i < o.length - 1; i += 2) {
      let s = o[i];
      if (s === n && o[i + 1] === r) {
        let a = t[Kn], l = o[i + 2];
        return a.length > l ? a[l] : null;
      }
      typeof s == "string" && (i += 2);
    }
    return null;
  }
  function wm(e, t, n, r, o, i, s) {
    let a = Ui(r), c = e.firstCreatePass ? cc(e) : null, u = lc(t), f = true;
    if (r.type & 3 || s) {
      let h = Me(r, t), d = s ? s(h) : h, p = u.length, m = s ? (I) => s(Ee(I[r.index])) : r.index, T = null;
      if (!s && a && (T = Em(e, t, o, r.index)), T !== null) {
        let I = T.__ngLastListenerFn__ || T;
        I.__ngNextListenerFn__ = i, T.__ngLastListenerFn__ = i, f = false;
      } else {
        i = Pl(r, t, i), qh(t, d, o, i);
        let I = n.listen(d, o, i);
        u.push(i, I), c && c.push(o, m, p, p + 1);
      }
    } else i = Pl(r, t, i);
    if (f) {
      let h = r.outputs?.[o], d = r.hostDirectiveOutputs?.[o];
      if (d && d.length) for (let p = 0; p < d.length; p += 2) {
        let m = d[p], T = d[p + 1];
        Ll(r, t, m, T, o, i);
      }
      if (h && h.length) for (let p of h) Ll(r, t, p, o, o, i);
    }
  }
  function ye(e = 1) {
    return ih(e);
  }
  function U(e, t = "") {
    let n = L(), r = me(), o = e + te, i = r.firstCreatePass ? Ds(r, o, 1, t, null) : r.data[o], s = Cm(r, n, i, t, e);
    n[o] = s, Ki() && vs(r, n, s, i), qt(i, false);
  }
  function yt(e) {
    return _t("", e, ""), yt;
  }
  function _t(e, t, n) {
    let r = L(), o = Xg(r, e, t, n);
    return o !== Ze && Mm(r, qe(), o), _t;
  }
  function Mm(e, t, n) {
    let r = ic(t, e);
    Kh(e[z], r, n);
  }
  function Lu({ ngZoneFactory: e, ignoreChangesOutsideZone: t, scheduleInRootZone: n }) {
    return e ??= () => new $(B(E({}, ju()), { scheduleInRootZone: n })), [{ provide: $, useFactory: e }, { provide: Qn, multi: true, useFactory: () => {
      let r = S(Sm, { optional: true });
      return () => r.initialize();
    } }, { provide: Qn, multi: true, useFactory: () => {
      let r = S(xm);
      return () => {
        r.initialize();
      };
    } }, t === true ? { provide: Fc, useValue: true } : [], { provide: Lc, useValue: n ?? Oc }];
  }
  function Vu(e) {
    let t = e?.ignoreChangesOutsideZone, n = e?.scheduleInRootZone, r = Lu({ ngZoneFactory: () => {
      let o = ju(e);
      return o.scheduleInRootZone = n, o.shouldCoalesceEventChangeDetection && yr("NgZone_CoalesceEvent"), new $(o);
    }, ignoreChangesOutsideZone: t, scheduleInRootZone: n });
    return Ef([{ provide: Tm, useValue: true }, { provide: es, useValue: false }, r]);
  }
  function ju(e) {
    return { enableLongStackTrace: false, shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? false, shouldCoalesceRunChangeDetection: e?.runCoalescing ?? false };
  }
  function km() {
    return typeof $localize < "u" && $localize.locale || cr;
  }
  function Rt(e) {
    return !e.moduleRef;
  }
  function Rm(e) {
    let t = Rt(e) ? e.r3Injector : e.moduleRef.injector, n = t.get($);
    return n.run(() => {
      Rt(e) ? e.r3Injector.resolveInjectorInitializers() : e.moduleRef.resolveInjectorInitializers();
      let r = t.get(we, null), o;
      if (n.runOutsideAngular(() => {
        o = n.onError.subscribe({ next: (i) => {
          r.handleError(i);
        } });
      }), Rt(e)) {
        let i = () => t.destroy(), s = e.platformInjector.get(Oi);
        s.add(i), t.onDestroy(() => {
          o.unsubscribe(), s.delete(i);
        });
      } else {
        let i = () => e.moduleRef.destroy(), s = e.platformInjector.get(Oi);
        s.add(i), e.moduleRef.onDestroy(() => {
          zn(e.allPlatformModules, e.moduleRef), o.unsubscribe(), s.delete(i);
        });
      }
      return Pm(r, n, () => {
        let i = t.get(Ou);
        return i.runInitializers(), i.donePromise.then(() => {
          let s = t.get(Hu, cr);
          if (bm(s || cr), !t.get(Am, true)) return Rt(e) ? t.get(Ue) : (e.allPlatformModules.push(e.moduleRef), e.moduleRef);
          if (Rt(e)) {
            let l = t.get(Ue);
            return e.rootComponent !== void 0 && l.bootstrap(e.rootComponent), l;
          } else return Om(e.moduleRef, e.allPlatformModules), e.moduleRef;
        });
      });
    });
  }
  function Om(e, t) {
    let n = e.injector.get(Ue);
    if (e._bootstrapComponents.length > 0) e._bootstrapComponents.forEach((r) => n.bootstrap(r));
    else if (e.instance.ngDoBootstrap) e.instance.ngDoBootstrap(n);
    else throw new w(-403, false);
    t.push(e);
  }
  function Pm(e, t, n) {
    try {
      let r = n();
      return ws(r) ? r.catch((o) => {
        throw t.runOutsideAngular(() => e.handleError(o)), o;
      }) : r;
    } catch (r) {
      throw t.runOutsideAngular(() => e.handleError(r)), r;
    }
  }
  function Fm(e = [], t) {
    return Ae.create({ name: t, providers: [{ provide: fr, useValue: "platform" }, { provide: Oi, useValue: /* @__PURE__ */ new Set([() => Wn = null]) }, ...e] });
  }
  function Lm(e = []) {
    if (Wn) return Wn;
    let t = Fm(e);
    return Wn = t, Qg(), Vm(t), t;
  }
  function Vm(e) {
    let t = e.get(os, null);
    Jl(e, () => {
      t?.forEach((n) => n());
    });
  }
  function $u(e) {
    let { rootComponent: t, appProviders: n, platformProviders: r, platformRef: o } = e;
    k(8);
    try {
      let i = o?.injector ?? Lm(r), s = [Lu({}), { provide: Be, useExisting: Nm }, ...n || []], a = new ir({ providers: s, parent: i, debugName: "", runEnvironmentInitializers: false });
      return Rm({ r3Injector: a.injector, platformInjector: i, rootComponent: t });
    } catch (i) {
      return Promise.reject(i);
    } finally {
      k(9);
    }
  }
  function wr(e, t) {
    return Qr(e, t?.equal);
  }
  var Yd;
  var w;
  var Xd;
  var Hl;
  var rl;
  var $l;
  var nf;
  var C;
  var rf;
  var of;
  var sf;
  var ol;
  var Ft;
  var il;
  var _;
  var Wo;
  var lf;
  var Le;
  var cf;
  var qn;
  var Zn;
  var uf;
  var df;
  var ff;
  var sl;
  var it;
  var ae;
  var Qn;
  var ql;
  var Zl;
  var Yn;
  var Cf;
  var fr;
  var Bn;
  var al;
  var Fo;
  var je;
  var Vt;
  var Ce;
  var b;
  var v;
  var ee;
  var le;
  var ge;
  var jt;
  var Kn;
  var H;
  var st;
  var Ne;
  var z;
  var Ht;
  var ll;
  var ft;
  var he;
  var at;
  var nt;
  var lt;
  var hr;
  var Xl;
  var xe;
  var Lo;
  var Jn;
  var X;
  var Vo;
  var te;
  var ec;
  var $t;
  var Pf;
  var Xn;
  var Q;
  var Jo;
  var rc;
  var cl;
  var k;
  var Hf;
  var $f;
  var D;
  var ei;
  var _c;
  var bc;
  var ot;
  var Bt;
  var oi;
  var mh;
  var wc;
  var Cc;
  var vh;
  var fe;
  var tr;
  var Ae;
  var Mh;
  var Oc;
  var Pc;
  var si;
  var Be;
  var es;
  var Fc;
  var Lc;
  var gr;
  var ai;
  var De;
  var ts;
  var rr;
  var Th;
  var $;
  var xh;
  var ci;
  var we;
  var Oh;
  var mr;
  var Bc;
  var Uc;
  var Lh;
  var Il;
  var di;
  var rs;
  var $h;
  var os;
  var Yt;
  var is;
  var Bh;
  var Uh;
  var Zc;
  var Gh;
  var Qc;
  var vr;
  var bl;
  var zh;
  var Wh;
  var Zh;
  var pe;
  var hi;
  var nu;
  var Ze;
  var _r;
  var yp;
  var Ap;
  var Re;
  var Bp;
  var wl;
  var pu;
  var Yp;
  var Jp;
  var Xp;
  var ag;
  var Db;
  var dg;
  var fg;
  var Mu;
  var yi;
  var gt;
  var ut;
  var hg;
  var Bo;
  var _i;
  var Ii;
  var bi;
  var Di;
  var kg;
  var Ei;
  var ir;
  var Og;
  var Ug;
  var Ru;
  var zg;
  var Ci;
  var qg;
  var Ou;
  var Zg;
  var Kg;
  var Ue;
  var Ti;
  var ar;
  var Ni;
  var ki;
  var Ai;
  var _m;
  var cr;
  var Im;
  var Cm;
  var Sm;
  var Tm;
  var xm;
  var Nm;
  var Hu;
  var Oi;
  var Am;
  var Wn;
  var Vl;
  var ne = g(() => {
    "use strict";
    eo();
    no();
    na();
    no();
    Ro();
    Oo();
    Yd = "https://angular.dev/best-practices/security#preventing-cross-site-scripting-xss", w = class extends Error {
      code;
      constructor(t, n) {
        super(Jd(t, n)), this.code = t;
      }
    };
    Xd = A({ __forward_ref__: A });
    Hl = A({ \u0275prov: A }), rl = A({ \u0275inj: A }), $l = A({ ngInjectableDef: A }), nf = A({ ngInjectorDef: A }), C = class {
      _desc;
      ngMetadataName = "InjectionToken";
      \u0275prov;
      constructor(t, n) {
        this._desc = t, this.\u0275prov = void 0, typeof n == "number" ? this.__NG_ELEMENT_ID__ = n : n !== void 0 && (this.\u0275prov = P({ token: this, providedIn: n.providedIn || "root", factory: n.factory }));
      }
      get multi() {
        return this;
      }
      toString() {
        return `InjectionToken ${this._desc}`;
      }
    };
    rf = A({ \u0275cmp: A }), of = A({ \u0275dir: A }), sf = A({ \u0275pipe: A }), ol = A({ \u0275fac: A }), Ft = A({ __NG_ELEMENT_ID__: A }), il = A({ __NG_ENV_ID__: A });
    _ = (function(e) {
      return e[e.Default = 0] = "Default", e[e.Host = 1] = "Host", e[e.Self = 2] = "Self", e[e.SkipSelf = 4] = "SkipSelf", e[e.Optional = 8] = "Optional", e;
    })(_ || {});
    lf = {}, Le = lf, cf = "__NG_DI_FLAG__", qn = class {
      injector;
      constructor(t) {
        this.injector = t;
      }
      retrieve(t, n) {
        let r = n;
        return this.injector.get(t, r.optional ? vn : Le, r);
      }
    }, Zn = "ngTempTokenPath", uf = "ngTokenPath", df = /\n/gm, ff = "\u0275", sl = "__source";
    it = {}, ae = [], Qn = new C(""), ql = new C("", -1), Zl = new C(""), Yn = class {
      get(t, n = Le) {
        if (n === Le) {
          let r = new Error(`NullInjectorError: No provider for ${J(t)}!`);
          throw r.name = "NullInjectorError", r;
        }
        return n;
      }
    };
    Cf = A({ provide: String, useValue: A });
    fr = new C(""), Bn = {}, al = {};
    je = class {
    }, Vt = class extends je {
      parent;
      source;
      scopes;
      records = /* @__PURE__ */ new Map();
      _ngOnDestroyHooks = /* @__PURE__ */ new Set();
      _onDestroyHooks = [];
      get destroyed() {
        return this._destroyed;
      }
      _destroyed = false;
      injectorDefTypes;
      constructor(t, n, r, o) {
        super(), this.parent = n, this.source = r, this.scopes = o, Ko(t, (s) => this.processProvider(s)), this.records.set(ql, tt(void 0, this)), o.has("environment") && this.records.set(je, tt(void 0, this));
        let i = this.records.get(fr);
        i != null && typeof i.value == "string" && this.scopes.add(i.value), this.injectorDefTypes = new Set(this.get(Zl, ae, _.Self));
      }
      retrieve(t, n) {
        let r = n;
        return this.get(t, r.optional ? vn : Le, r);
      }
      destroy() {
        Ot(this), this._destroyed = true;
        let t = y(null);
        try {
          for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
          let n = this._onDestroyHooks;
          this._onDestroyHooks = [];
          for (let r of n) r();
        } finally {
          this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear(), y(t);
        }
      }
      onDestroy(t) {
        return Ot(this), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t);
      }
      runInContext(t) {
        Ot(this);
        let n = Ie(this), r = K(void 0), o;
        try {
          return t();
        } finally {
          Ie(n), K(r);
        }
      }
      get(t, n = Le, r = _.Default) {
        if (Ot(this), t.hasOwnProperty(il)) return t[il](this);
        r = dr(r);
        let o, i = Ie(this), s = K(void 0);
        try {
          if (!(r & _.SkipSelf)) {
            let l = this.records.get(t);
            if (l === void 0) {
              let c = Rf(t) && Fi(t);
              c && this.injectableDefInScope(c) ? l = tt(Yo(t), Bn) : l = null, this.records.set(t, l);
            }
            if (l != null) return this.hydrate(t, l, r);
          }
          let a = r & _.Self ? Bi() : this.parent;
          return n = r & _.Optional && n === Le ? null : n, a.get(t, n);
        } catch (a) {
          if (a.name === "NullInjectorError") {
            if ((a[Zn] = a[Zn] || []).unshift(J(t)), i) throw a;
            return gf(a, t, "R3InjectorError", this.source);
          } else throw a;
        } finally {
          K(s), Ie(i);
        }
      }
      resolveInjectorInitializers() {
        let t = y(null), n = Ie(this), r = K(void 0), o;
        try {
          let i = this.get(Qn, ae, _.Self);
          for (let s of i) s();
        } finally {
          Ie(n), K(r), y(t);
        }
      }
      toString() {
        let t = [], n = this.records;
        for (let r of n.keys()) t.push(J(r));
        return `R3Injector[${t.join(", ")}]`;
      }
      processProvider(t) {
        t = se(t);
        let n = Qo(t) ? t : se(t && t.provide), r = xf(t);
        if (!Qo(t) && t.multi === true) {
          let o = this.records.get(n);
          o || (o = tt(void 0, Bn, true), o.factory = () => qo(o.multi), this.records.set(n, o)), n = t, o.multi.push(t);
        }
        this.records.set(n, r);
      }
      hydrate(t, n, r) {
        let o = y(null);
        try {
          return n.value === al ? Ul(J(t)) : n.value === Bn && (n.value = al, n.value = n.factory(void 0, r)), typeof n.value == "object" && n.value && Af(n.value) && this._ngOnDestroyHooks.add(n.value), n.value;
        } finally {
          y(o);
        }
      }
      injectableDefInScope(t) {
        if (!t.providedIn) return false;
        let n = se(t.providedIn);
        return typeof n == "string" ? n === "any" || this.scopes.has(n) : this.injectorDefTypes.has(n);
      }
      removeOnDestroy(t) {
        let n = this._onDestroyHooks.indexOf(t);
        n !== -1 && this._onDestroyHooks.splice(n, 1);
      }
    };
    Ce = 0, b = 1, v = 2, ee = 3, le = 4, ge = 5, jt = 6, Kn = 7, H = 8, st = 9, Ne = 10, z = 11, Ht = 12, ll = 13, ft = 14, he = 15, at = 16, nt = 17, lt = 18, hr = 19, Xl = 20, xe = 21, Lo = 22, Jn = 23, X = 24, Vo = 25, te = 26, ec = 1, $t = 7, Pf = 8, Xn = 9, Q = 10;
    Jo = class {
      previousValue;
      currentValue;
      firstChange;
      constructor(t, n, r) {
        this.previousValue = t, this.currentValue = n, this.firstChange = r;
      }
      isFirstChange() {
        return this.firstChange;
      }
    };
    rc = "__ngSimpleChanges__";
    cl = null, k = function(e, t = null, n) {
      cl?.(e, t, n);
    }, Hf = "svg", $f = "math";
    D = { lFrame: vc(null), bindingsEnabled: true, skipHydrationRootTNode: null }, ei = false;
    _c = yc;
    bc = true;
    ot = -1, Bt = class {
      factory;
      injectImpl;
      resolving = false;
      canSeeViewProviders;
      multi;
      componentProviders;
      index;
      providerFactory;
      constructor(t, n, r) {
        this.factory = t, this.canSeeViewProviders = n, this.injectImpl = r;
      }
    };
    oi = true;
    mh = 256, wc = mh - 1, Cc = 5, vh = 0, fe = {};
    tr = class {
      _tNode;
      _lView;
      constructor(t, n) {
        this._tNode = t, this._lView = n;
      }
      get(t, n, r) {
        return kc(this._tNode, this._lView, t, dr(r), n);
      }
    };
    Ae = class e {
      static THROW_IF_NOT_FOUND = Le;
      static NULL = new Yn();
      static create(t, n) {
        if (Array.isArray(t)) return ml({ name: "" }, n, t, "");
        {
          let r = t.name ?? "";
          return ml({ name: r }, t.parent, t.providers, r);
        }
      }
      static \u0275prov = P({ token: e, providedIn: "any", factory: () => N(ql) });
      static __NG_ELEMENT_ID__ = -1;
    };
    Mh = new C("");
    Mh.__NG_ELEMENT_ID__ = (e) => {
      let t = pt();
      if (t === null) throw new w(204, false);
      if (t.type & 2) return t.value;
      if (e & _.Optional) return null;
      throw new w(204, false);
    };
    Oc = false, Pc = /* @__PURE__ */ (() => {
      class e {
        static __NG_ELEMENT_ID__ = Sh;
        static __NG_ENV_ID__ = (n) => n;
      }
      return e;
    })(), si = class extends Pc {
      _lView;
      constructor(t) {
        super(), this._lView = t;
      }
      onDestroy(t) {
        let n = this._lView;
        return ht(n) ? (t(), () => {
        }) : (ac(n, t), () => Uf(n, t));
      }
    };
    Be = class {
    }, es = new C("", { providedIn: "root", factory: () => false }), Fc = new C(""), Lc = new C(""), gr = (() => {
      class e {
        taskId = 0;
        pendingTasks = /* @__PURE__ */ new Set();
        get _hasPendingTasks() {
          return this.hasPendingTasks.value;
        }
        hasPendingTasks = new xt(false);
        add() {
          this._hasPendingTasks || this.hasPendingTasks.next(true);
          let n = this.taskId++;
          return this.pendingTasks.add(n), n;
        }
        has(n) {
          return this.pendingTasks.has(n);
        }
        remove(n) {
          this.pendingTasks.delete(n), this.pendingTasks.size === 0 && this._hasPendingTasks && this.hasPendingTasks.next(false);
        }
        ngOnDestroy() {
          this.pendingTasks.clear(), this._hasPendingTasks && this.hasPendingTasks.next(false);
        }
        static \u0275prov = P({ token: e, providedIn: "root", factory: () => new e() });
      }
      return e;
    })(), ai = class extends be {
      __isAsync;
      destroyRef = void 0;
      pendingTasks = void 0;
      constructor(t = false) {
        super(), this.__isAsync = t, Of() && (this.destroyRef = S(Pc, { optional: true }) ?? void 0, this.pendingTasks = S(gr, { optional: true }) ?? void 0);
      }
      emit(t) {
        let n = y(null);
        try {
          super.next(t);
        } finally {
          y(n);
        }
      }
      subscribe(t, n, r) {
        let o = t, i = n || (() => null), s = r;
        if (t && typeof t == "object") {
          let l = t;
          o = l.next?.bind(l), i = l.error?.bind(l), s = l.complete?.bind(l);
        }
        this.__isAsync && (i = this.wrapInTimeout(i), o && (o = this.wrapInTimeout(o)), s && (s = this.wrapInTimeout(s)));
        let a = super.subscribe({ next: o, error: i, complete: s });
        return t instanceof G && t.add(a), a;
      }
      wrapInTimeout(t) {
        return (n) => {
          let r = this.pendingTasks?.add();
          setTimeout(() => {
            try {
              t(n);
            } finally {
              r !== void 0 && this.pendingTasks?.remove(r);
            }
          });
        };
      }
    }, De = ai;
    ts = "isAngularZone", rr = ts + "_ID", Th = 0, $ = class e {
      hasPendingMacrotasks = false;
      hasPendingMicrotasks = false;
      isStable = true;
      onUnstable = new De(false);
      onMicrotaskEmpty = new De(false);
      onStable = new De(false);
      onError = new De(false);
      constructor(t) {
        let { enableLongStackTrace: n = false, shouldCoalesceEventChangeDetection: r = false, shouldCoalesceRunChangeDetection: o = false, scheduleInRootZone: i = Oc } = t;
        if (typeof Zone > "u") throw new w(908, false);
        Zone.assertZonePatched();
        let s = this;
        s._nesting = 0, s._outer = s._inner = Zone.current, Zone.TaskTrackingZoneSpec && (s._inner = s._inner.fork(new Zone.TaskTrackingZoneSpec())), n && Zone.longStackTraceZoneSpec && (s._inner = s._inner.fork(Zone.longStackTraceZoneSpec)), s.shouldCoalesceEventChangeDetection = !o && r, s.shouldCoalesceRunChangeDetection = o, s.callbackScheduled = false, s.scheduleInRootZone = i, kh(s);
      }
      static isInAngularZone() {
        return typeof Zone < "u" && Zone.current.get(ts) === true;
      }
      static assertInAngularZone() {
        if (!e.isInAngularZone()) throw new w(909, false);
      }
      static assertNotInAngularZone() {
        if (e.isInAngularZone()) throw new w(909, false);
      }
      run(t, n, r) {
        return this._inner.run(t, n, r);
      }
      runTask(t, n, r, o) {
        let i = this._inner, s = i.scheduleEventTask("NgZoneEvent: " + o, t, xh, nr, nr);
        try {
          return i.runTask(s, n, r);
        } finally {
          i.cancelTask(s);
        }
      }
      runGuarded(t, n, r) {
        return this._inner.runGuarded(t, n, r);
      }
      runOutsideAngular(t) {
        return this._outer.run(t);
      }
    }, xh = {};
    ci = class {
      hasPendingMicrotasks = false;
      hasPendingMacrotasks = false;
      isStable = true;
      onUnstable = new De();
      onMicrotaskEmpty = new De();
      onStable = new De();
      onError = new De();
      run(t, n, r) {
        return t.apply(n, r);
      }
      runGuarded(t, n, r) {
        return t.apply(n, r);
      }
      runOutsideAngular(t) {
        return t();
      }
      runTask(t, n, r, o) {
        return t.apply(n, r);
      }
    };
    we = class {
      _console = console;
      handleError(t) {
        this._console.error("ERROR", t);
      }
    }, Oh = new C("", { providedIn: "root", factory: () => {
      let e = S($), t = S(we);
      return (n) => e.runOutsideAngular(() => t.handleError(n));
    } });
    mr = /* @__PURE__ */ (() => {
      class e {
        nativeElement;
        constructor(n) {
          this.nativeElement = n;
        }
        static __NG_ELEMENT_ID__ = Ph;
      }
      return e;
    })();
    Bc = (function(e) {
      return e[e.OnPush = 0] = "OnPush", e[e.Default = 1] = "Default", e;
    })(Bc || {}), Uc = /* @__PURE__ */ new Map(), Lh = 0;
    Il = "__ngContext__";
    rs = new C("", { providedIn: "root", factory: () => $h }), $h = "ng", os = new C(""), Yt = new C("", { providedIn: "platform", factory: () => "unknown" }), is = new C("", { providedIn: "root", factory: () => Hh().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") || null }), Bh = "h", Uh = "b", Zc = false, Gh = new C("", { providedIn: "root", factory: () => Zc }), Qc = (function(e) {
      return e[e.CHANGE_DETECTION = 0] = "CHANGE_DETECTION", e[e.AFTER_NEXT_RENDER = 1] = "AFTER_NEXT_RENDER", e;
    })(Qc || {}), vr = new C(""), bl = /* @__PURE__ */ new Set();
    zh = (() => {
      class e {
        impl = null;
        execute() {
          this.impl?.execute();
        }
        static \u0275prov = P({ token: e, providedIn: "root", factory: () => new e() });
      }
      return e;
    })();
    Wh = (e, t, n, r) => {
    };
    Zh = () => null;
    pe = (function(e) {
      return e[e.Emulated = 0] = "Emulated", e[e.None = 2] = "None", e[e.ShadowDom = 3] = "ShadowDom", e;
    })(pe || {}), hi = class {
      changingThisBreaksApplicationSecurity;
      constructor(t) {
        this.changingThisBreaksApplicationSecurity = t;
      }
      toString() {
        return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${Yd})`;
      }
    };
    nu = "ng-template";
    Ze = {};
    _r = (function(e) {
      return e[e.None = 0] = "None", e[e.SignalBased = 1] = "SignalBased", e[e.HasDecoratorInputTransform = 2] = "HasDecoratorInputTransform", e;
    })(_r || {});
    yp = () => null;
    Re = (function(e) {
      return e[e.Important = 1] = "Important", e[e.DashCase = 2] = "DashCase", e;
    })(Re || {});
    Bp = $p;
    pu = [];
    Yp = B(E({}, Et), { consumerIsAlwaysLive: true, kind: "template", consumerMarkedDirty: (e) => {
      pr(e.lView);
    }, consumerOnSignalRead() {
      this.lView[X] = this;
    } });
    Jp = B(E({}, Et), { consumerIsAlwaysLive: true, kind: "template", consumerMarkedDirty: (e) => {
      let t = He(e.lView);
      for (; t && !gu(t[b]); ) t = He(t);
      t && Wi(t);
    }, consumerOnSignalRead() {
      this.lView[X] = this;
    } });
    Xp = 100;
    ag = class {
      _lView;
      _cdRefInjectingView;
      notifyErrorHandler;
      _appRef = null;
      _attachedToViewContainer = false;
      get rootNodes() {
        let t = this._lView, n = t[b];
        return or(n, t, n.firstChild, []);
      }
      constructor(t, n, r = true) {
        this._lView = t, this._cdRefInjectingView = n, this.notifyErrorHandler = r;
      }
      get context() {
        return this._lView[H];
      }
      set context(t) {
        this._lView[H] = t;
      }
      get destroyed() {
        return ht(this._lView);
      }
      destroy() {
        if (this._appRef) this._appRef.detachView(this);
        else if (this._attachedToViewContainer) {
          let t = this._lView[ee];
          if (ze(t)) {
            let n = t[Pf], r = n ? n.indexOf(this) : -1;
            r > -1 && (bs(t, r), Wl(n, r));
          }
          this._attachedToViewContainer = false;
        }
        ms(this._lView[b], this._lView);
      }
      onDestroy(t) {
        ac(this._lView, t);
      }
      markForCheck() {
        _s(this._cdRefInjectingView || this._lView, 4);
      }
      detach() {
        this._lView[v] &= -129;
      }
      reattach() {
        Xo(this._lView), this._lView[v] |= 128;
      }
      detectChanges() {
        this._lView[v] |= 1024, vu(this._lView, this.notifyErrorHandler);
      }
      checkNoChanges() {
      }
      attachToViewContainerRef() {
        if (this._appRef) throw new w(902, false);
        this._attachedToViewContainer = true;
      }
      detachFromAppRef() {
        this._appRef = null;
        let t = er(this._lView), n = this._lView[at];
        n !== null && !t && gs(n, this._lView), du(this._lView[b], this._lView);
      }
      attachToAppRef(t) {
        if (this._attachedToViewContainer) throw new w(902, false);
        this._appRef = t;
        let n = er(this._lView), r = this._lView[at];
        r !== null && !n && Eu(r, this._lView), Xo(this._lView);
      }
    };
    Db = new RegExp(`^(\\d+)*(${Uh}|${Bh})*(.*)`), dg = () => null;
    fg = class {
    }, Mu = class {
    }, yi = class {
      resolveComponentFactory(t) {
        throw Error(`No component factory found for ${J(t)}.`);
      }
    }, gt = class {
      static NULL = new yi();
    }, ut = class {
    }, hg = (() => {
      class e {
        static \u0275prov = P({ token: e, providedIn: "root", factory: () => null });
      }
      return e;
    })(), Bo = {}, _i = class {
      injector;
      parentInjector;
      constructor(t, n) {
        this.injector = t, this.parentInjector = n;
      }
      get(t, n, r) {
        r = dr(r);
        let o = this.injector.get(t, Bo, r);
        return o !== Bo || n === Bo ? o : this.parentInjector.get(t, n, r);
      }
    };
    Ii = class extends gt {
      ngModule;
      constructor(t) {
        super(), this.ngModule = t;
      }
      resolveComponentFactory(t) {
        let n = Hi(t);
        return new bi(n, this.ngModule);
      }
    };
    bi = class extends Mu {
      componentDef;
      ngModule;
      selector;
      componentType;
      ngContentSelectors;
      isBoundToModule;
      cachedInputs = null;
      cachedOutputs = null;
      get inputs() {
        return this.cachedInputs ??= Cg(this.componentDef.inputs), this.cachedInputs;
      }
      get outputs() {
        return this.cachedOutputs ??= Mg(this.componentDef.outputs), this.cachedOutputs;
      }
      constructor(t, n) {
        super(), this.componentDef = t, this.ngModule = n, this.componentType = t.type, this.selector = dp(t.selectors), this.ngContentSelectors = t.ngContentSelectors ?? [], this.isBoundToModule = !!n;
      }
      create(t, n, r, o) {
        k(22);
        let i = y(null);
        try {
          let s = this.componentDef, a = r ? ["ng-version", "19.2.22"] : fp(this.componentDef.selectors[0]), l = as(0, null, null, 1, 0, null, null, null, null, [a], null), c = Sg(s, o || this.ngModule, t), u = Tg(c), f = u.rendererFactory.createRenderer(null, s), h = r ? mp(f, r, s.encapsulation, c) : xg(s, f), d = ls(null, l, null, 512 | ru(s), null, null, u, f, c, null, Yc(h, c, true));
          d[te] = h, Qi(d);
          let p = null;
          try {
            let m = Nu(te, l, d, "#host", () => [this.componentDef], true, 0);
            h && (tu(f, h, m), Qt(h, d)), cs(l, d, m), Jc(l, m, d), ku(l, m), n !== void 0 && Ng(m, this.ngContentSelectors, n), p = ke(m.index, d), d[H] = p[H], ds(l, d, null);
          } catch (m) {
            throw p !== null && ui(p), ui(d), m;
          } finally {
            k(23), Yi();
          }
          return new Di(this.componentType, d);
        } finally {
          y(i);
        }
      }
    }, Di = class extends fg {
      _rootLView;
      instance;
      hostView;
      changeDetectorRef;
      componentType;
      location;
      previousInputValues = null;
      _tNode;
      constructor(t, n) {
        super(), this._rootLView = n, this._tNode = Gi(n[b], te), this.location = Hc(this._tNode, n), this.instance = ke(this._tNode.index, n)[H], this.hostView = this.changeDetectorRef = new ag(n, void 0, false), this.componentType = t;
      }
      setInput(t, n) {
        let r = this._tNode;
        if (this.previousInputValues ??= /* @__PURE__ */ new Map(), this.previousInputValues.has(t) && Object.is(this.previousInputValues.get(t), n)) return;
        let o = this._rootLView, i = us(r, o[b], o, t, n);
        this.previousInputValues.set(t, n);
        let s = ke(r.index, o);
        _s(s, 1);
      }
      get injector() {
        return new tr(this._tNode, this._rootLView);
      }
      destroy() {
        this.hostView.destroy();
      }
      onDestroy(t) {
        this.hostView.onDestroy(t);
      }
    };
    kg = () => false;
    Ei = class {
    }, ir = class extends Ei {
      injector;
      componentFactoryResolver = new Ii(this);
      instance = null;
      constructor(t) {
        super();
        let n = new Vt([...t.providers, { provide: Ei, useValue: this }, { provide: gt, useValue: this.componentFactoryResolver }], t.parent || Bi(), t.debugName, /* @__PURE__ */ new Set(["environment"]));
        this.injector = n, t.runEnvironmentInitializers && n.resolveInjectorInitializers();
      }
      destroy() {
        this.injector.destroy();
      }
      onDestroy(t) {
        this.injector.onDestroy(t);
      }
    };
    Og = (() => {
      class e {
        _injector;
        cachedInjectors = /* @__PURE__ */ new Map();
        constructor(n) {
          this._injector = n;
        }
        getOrCreateStandaloneInjector(n) {
          if (!n.standalone) return null;
          if (!this.cachedInjectors.has(n)) {
            let r = Ql(false, n.type), o = r.length > 0 ? Rg([r], this._injector, `Standalone[${n.type.name}]`) : null;
            this.cachedInjectors.set(n, o);
          }
          return this.cachedInjectors.get(n);
        }
        ngOnDestroy() {
          try {
            for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
          } finally {
            this.cachedInjectors.clear();
          }
        }
        static \u0275prov = P({ token: e, providedIn: "environment", factory: () => new e(N(je)) });
      }
      return e;
    })();
    Ug = Gg;
    Ru = new C(""), zg = (() => {
      class e {
        static \u0275prov = P({ token: e, providedIn: "root", factory: () => new Ci() });
      }
      return e;
    })(), Ci = class {
      queuedEffectCount = 0;
      queues = /* @__PURE__ */ new Map();
      schedule(t) {
        this.enqueue(t);
      }
      remove(t) {
        let n = t.zone, r = this.queues.get(n);
        r.has(t) && (r.delete(t), this.queuedEffectCount--);
      }
      enqueue(t) {
        let n = t.zone;
        this.queues.has(n) || this.queues.set(n, /* @__PURE__ */ new Set());
        let r = this.queues.get(n);
        r.has(t) || (this.queuedEffectCount++, r.add(t));
      }
      flush() {
        for (; this.queuedEffectCount > 0; ) for (let [t, n] of this.queues) t === null ? this.flushQueue(n) : t.run(() => this.flushQueue(n));
      }
      flushQueue(t) {
        for (let n of t) t.delete(n), this.queuedEffectCount--, n.run();
      }
    };
    qg = new C(""), Ou = (() => {
      class e {
        resolve;
        reject;
        initialized = false;
        done = false;
        donePromise = new Promise((n, r) => {
          this.resolve = n, this.reject = r;
        });
        appInits = S(qg, { optional: true }) ?? [];
        injector = S(Ae);
        constructor() {
        }
        runInitializers() {
          if (this.initialized) return;
          let n = [];
          for (let o of this.appInits) {
            let i = Jl(this.injector, o);
            if (ws(i)) n.push(i);
            else if (Wg(i)) {
              let s = new Promise((a, l) => {
                i.subscribe({ complete: a, error: l });
              });
              n.push(s);
            }
          }
          let r = () => {
            this.done = true, this.resolve();
          };
          Promise.all(n).then(() => {
            r();
          }).catch((o) => {
            this.reject(o);
          }), n.length === 0 && r(), this.initialized = true;
        }
        static \u0275fac = function(r) {
          return new (r || e)();
        };
        static \u0275prov = P({ token: e, factory: e.\u0275fac, providedIn: "root" });
      }
      return e;
    })(), Zg = new C("");
    Kg = 10, Ue = (() => {
      class e {
        _runningTick = false;
        _destroyed = false;
        _destroyListeners = [];
        _views = [];
        internalErrorHandler = S(Oh);
        afterRenderManager = S(zh);
        zonelessEnabled = S(es);
        rootEffectScheduler = S(zg);
        dirtyFlags = 0;
        tracingSnapshot = null;
        externalTestViews = /* @__PURE__ */ new Set();
        afterTick = new be();
        get allViews() {
          return [...this.externalTestViews.keys(), ...this._views];
        }
        get destroyed() {
          return this._destroyed;
        }
        componentTypes = [];
        components = [];
        isStable = S(gr).hasPendingTasks.pipe(At((n) => !n));
        constructor() {
          S(vr, { optional: true });
        }
        whenStable() {
          let n;
          return new Promise((r) => {
            n = this.isStable.subscribe({ next: (o) => {
              o && r();
            } });
          }).finally(() => {
            n.unsubscribe();
          });
        }
        _injector = S(je);
        _rendererFactory = null;
        get injector() {
          return this._injector;
        }
        bootstrap(n, r) {
          return this.bootstrapImpl(n, r);
        }
        bootstrapImpl(n, r, o = Ae.NULL) {
          k(10);
          let i = n instanceof Mu;
          if (!this._injector.get(Ou).done) {
            let d = "";
            throw new w(405, d);
          }
          let a;
          i ? a = n : a = this._injector.get(gt).resolveComponentFactory(n), this.componentTypes.push(a.componentType);
          let l = Yg(a) ? void 0 : this._injector.get(Ei), c = r || a.selector, u = a.create(o, [], c, l), f = u.location.nativeElement, h = u.injector.get(Ru, null);
          return h?.registerApplication(f), u.onDestroy(() => {
            this.detachView(u.hostView), zn(this.components, u), h?.unregisterApplication(f);
          }), this._loadComponent(u), k(11, u), u;
        }
        tick() {
          this.zonelessEnabled || (this.dirtyFlags |= 1), this._tick();
        }
        _tick() {
          k(12), this.tracingSnapshot !== null ? this.tracingSnapshot.run(Qc.CHANGE_DETECTION, this.tickImpl) : this.tickImpl();
        }
        tickImpl = () => {
          if (this._runningTick) throw new w(101, false);
          let n = y(null);
          try {
            this._runningTick = true, this.synchronize();
          } catch (r) {
            this.internalErrorHandler(r);
          } finally {
            this._runningTick = false, this.tracingSnapshot?.dispose(), this.tracingSnapshot = null, y(n), this.afterTick.next(), k(13);
          }
        };
        synchronize() {
          this._rendererFactory === null && !this._injector.destroyed && (this._rendererFactory = this._injector.get(ut, null, { optional: true }));
          let n = 0;
          for (; this.dirtyFlags !== 0 && n++ < Kg; ) k(14), this.synchronizeOnce(), k(15);
        }
        synchronizeOnce() {
          if (this.dirtyFlags & 16 && (this.dirtyFlags &= -17, this.rootEffectScheduler.flush()), this.dirtyFlags & 7) {
            let n = !!(this.dirtyFlags & 1);
            this.dirtyFlags &= -8, this.dirtyFlags |= 8;
            for (let { _lView: r, notifyErrorHandler: o } of this.allViews) Jg(r, o, n, this.zonelessEnabled);
            if (this.dirtyFlags &= -5, this.syncDirtyFlagsWithViews(), this.dirtyFlags & 23) return;
          } else this._rendererFactory?.begin?.(), this._rendererFactory?.end?.();
          this.dirtyFlags & 8 && (this.dirtyFlags &= -9, this.afterRenderManager.execute()), this.syncDirtyFlagsWithViews();
        }
        syncDirtyFlagsWithViews() {
          if (this.allViews.some(({ _lView: n }) => Wt(n))) {
            this.dirtyFlags |= 2;
            return;
          } else this.dirtyFlags &= -8;
        }
        attachView(n) {
          let r = n;
          this._views.push(r), r.attachToAppRef(this);
        }
        detachView(n) {
          let r = n;
          zn(this._views, r), r.detachFromAppRef();
        }
        _loadComponent(n) {
          this.attachView(n.hostView), this.tick(), this.components.push(n), this._injector.get(Zg, []).forEach((o) => o(n));
        }
        ngOnDestroy() {
          if (!this._destroyed) try {
            this._destroyListeners.forEach((n) => n()), this._views.slice().forEach((n) => n.destroy());
          } finally {
            this._destroyed = true, this._views = [], this._destroyListeners = [];
          }
        }
        onDestroy(n) {
          return this._destroyListeners.push(n), () => zn(this._destroyListeners, n);
        }
        destroy() {
          if (this._destroyed) throw new w(406, false);
          let n = this._injector;
          n.destroy && !n.destroyed && n.destroy();
        }
        get viewCount() {
          return this._views.length;
        }
        static \u0275fac = function(r) {
          return new (r || e)();
        };
        static \u0275prov = P({ token: e, factory: e.\u0275fac, providedIn: "root" });
      }
      return e;
    })();
    Ti = class {
      destroy(t) {
      }
      updateValue(t, n) {
      }
      swap(t, n) {
        let r = Math.min(t, n), o = Math.max(t, n), i = this.detach(o);
        if (o - r > 1) {
          let s = this.detach(r);
          this.attach(r, i), this.attach(o, s);
        } else this.attach(r, i);
      }
      move(t, n) {
        this.attach(n, this.detach(t));
      }
    };
    ar = class {
      kvMap = /* @__PURE__ */ new Map();
      _vMap = void 0;
      has(t) {
        return this.kvMap.has(t);
      }
      delete(t) {
        if (!this.has(t)) return false;
        let n = this.kvMap.get(t);
        return this._vMap !== void 0 && this._vMap.has(n) ? (this.kvMap.set(t, this._vMap.get(n)), this._vMap.delete(n)) : this.kvMap.delete(t), true;
      }
      get(t) {
        return this.kvMap.get(t);
      }
      set(t, n) {
        if (this.kvMap.has(t)) {
          let r = this.kvMap.get(t);
          this._vMap === void 0 && (this._vMap = /* @__PURE__ */ new Map());
          let o = this._vMap;
          for (; o.has(r); ) r = o.get(r);
          o.set(r, n);
        } else this.kvMap.set(t, n);
      }
      forEach(t) {
        for (let [n, r] of this.kvMap) if (t(r, n), this._vMap !== void 0) {
          let o = this._vMap;
          for (; o.has(r); ) r = o.get(r), t(r, n);
        }
      }
    };
    Ni = class {
      lContainer;
      $implicit;
      $index;
      constructor(t, n, r) {
        this.lContainer = t, this.$implicit = n, this.$index = r;
      }
      get $count() {
        return this.lContainer.length - Q;
      }
    }, ki = class {
      hasEmptyBlock;
      trackByFn;
      liveCollection;
      constructor(t, n, r) {
        this.hasEmptyBlock = t, this.trackByFn = n, this.liveCollection = r;
      }
    };
    Ai = class extends Ti {
      lContainer;
      hostLView;
      templateTNode;
      operationsCounter = void 0;
      needsIndexUpdate = false;
      constructor(t, n, r) {
        super(), this.lContainer = t, this.hostLView = n, this.templateTNode = r;
      }
      get length() {
        return this.lContainer.length - Q;
      }
      at(t) {
        return this.getLView(t)[H].$implicit;
      }
      attach(t, n) {
        let r = n[jt];
        this.needsIndexUpdate ||= t !== this.length, Is(this.lContainer, n, t, hs(this.templateTNode, r));
      }
      detach(t) {
        return this.needsIndexUpdate ||= t !== this.length - 1, vm(this.lContainer, t);
      }
      create(t, n) {
        let r = Es(this.lContainer, this.templateTNode.tView.ssrId), o = fs(this.hostLView, this.templateTNode, new Ni(this.lContainer, n, t), { dehydratedView: r });
        return this.operationsCounter?.recordCreate(), o;
      }
      destroy(t) {
        ms(t[b], t), this.operationsCounter?.recordDestroy();
      }
      updateValue(t, n) {
        this.getLView(t)[H].$implicit = n;
      }
      reset() {
        this.needsIndexUpdate = false, this.operationsCounter?.reset();
      }
      updateIndexes() {
        if (this.needsIndexUpdate) for (let t = 0; t < this.length; t++) this.getLView(t)[H].$index = t;
      }
      getLView(t) {
        return ym(this.lContainer, t);
      }
    };
    _m = (e, t, n, r, o, i) => (Ji(true), Xc(r, o, sh()));
    cr = "en-US", Im = cr;
    Cm = (e, t, n, r, o) => (Ji(true), Yh(t[z], r));
    Sm = (() => {
      class e {
        zone = S($);
        changeDetectionScheduler = S(Be);
        applicationRef = S(Ue);
        _onMicrotaskEmptySubscription;
        initialize() {
          this._onMicrotaskEmptySubscription || (this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({ next: () => {
            this.changeDetectionScheduler.runningTick || this.zone.run(() => {
              this.applicationRef.tick();
            });
          } }));
        }
        ngOnDestroy() {
          this._onMicrotaskEmptySubscription?.unsubscribe();
        }
        static \u0275fac = function(r) {
          return new (r || e)();
        };
        static \u0275prov = P({ token: e, factory: e.\u0275fac, providedIn: "root" });
      }
      return e;
    })(), Tm = new C("", { factory: () => false });
    xm = (() => {
      class e {
        subscription = new G();
        initialized = false;
        zone = S($);
        pendingTasks = S(gr);
        initialize() {
          if (this.initialized) return;
          this.initialized = true;
          let n = null;
          !this.zone.isStable && !this.zone.hasPendingMacrotasks && !this.zone.hasPendingMicrotasks && (n = this.pendingTasks.add()), this.zone.runOutsideAngular(() => {
            this.subscription.add(this.zone.onStable.subscribe(() => {
              $.assertNotInAngularZone(), queueMicrotask(() => {
                n !== null && !this.zone.hasPendingMacrotasks && !this.zone.hasPendingMicrotasks && (this.pendingTasks.remove(n), n = null);
              });
            }));
          }), this.subscription.add(this.zone.onUnstable.subscribe(() => {
            $.assertInAngularZone(), n ??= this.pendingTasks.add();
          }));
        }
        ngOnDestroy() {
          this.subscription.unsubscribe();
        }
        static \u0275fac = function(r) {
          return new (r || e)();
        };
        static \u0275prov = P({ token: e, factory: e.\u0275fac, providedIn: "root" });
      }
      return e;
    })(), Nm = (() => {
      class e {
        appRef = S(Ue);
        taskService = S(gr);
        ngZone = S($);
        zonelessEnabled = S(es);
        tracing = S(vr, { optional: true });
        disableScheduling = S(Fc, { optional: true }) ?? false;
        zoneIsDefined = typeof Zone < "u" && !!Zone.root.run;
        schedulerTickApplyArgs = [{ data: { __scheduler_tick__: true } }];
        subscriptions = new G();
        angularZoneId = this.zoneIsDefined ? this.ngZone._inner?.get(rr) : null;
        scheduleInRootZone = !this.zonelessEnabled && this.zoneIsDefined && (S(Lc, { optional: true }) ?? false);
        cancelScheduledCallback = null;
        useMicrotaskScheduler = false;
        runningTick = false;
        pendingRenderTaskId = null;
        constructor() {
          this.subscriptions.add(this.appRef.afterTick.subscribe(() => {
            this.runningTick || this.cleanup();
          })), this.subscriptions.add(this.ngZone.onUnstable.subscribe(() => {
            this.runningTick || this.cleanup();
          })), this.disableScheduling ||= !this.zonelessEnabled && (this.ngZone instanceof ci || !this.zoneIsDefined);
        }
        notify(n) {
          if (!this.zonelessEnabled && n === 5) return;
          let r = false;
          switch (n) {
            case 0: {
              this.appRef.dirtyFlags |= 2;
              break;
            }
            case 3:
            case 2:
            case 4:
            case 5:
            case 1: {
              this.appRef.dirtyFlags |= 4;
              break;
            }
            case 6: {
              this.appRef.dirtyFlags |= 2, r = true;
              break;
            }
            case 12: {
              this.appRef.dirtyFlags |= 16, r = true;
              break;
            }
            case 13: {
              this.appRef.dirtyFlags |= 2, r = true;
              break;
            }
            case 11: {
              r = true;
              break;
            }
            default:
              this.appRef.dirtyFlags |= 8;
          }
          if (this.appRef.tracingSnapshot = this.tracing?.snapshot(this.appRef.tracingSnapshot) ?? null, !this.shouldScheduleTick(r)) return;
          let o = this.useMicrotaskScheduler ? vl : Vc;
          this.pendingRenderTaskId = this.taskService.add(), this.scheduleInRootZone ? this.cancelScheduledCallback = Zone.root.run(() => o(() => this.tick())) : this.cancelScheduledCallback = this.ngZone.runOutsideAngular(() => o(() => this.tick()));
        }
        shouldScheduleTick(n) {
          return !(this.disableScheduling && !n || this.appRef.destroyed || this.pendingRenderTaskId !== null || this.runningTick || this.appRef._runningTick || !this.zonelessEnabled && this.zoneIsDefined && Zone.current.get(rr + this.angularZoneId));
        }
        tick() {
          if (this.runningTick || this.appRef.destroyed) return;
          if (this.appRef.dirtyFlags === 0) {
            this.cleanup();
            return;
          }
          !this.zonelessEnabled && this.appRef.dirtyFlags & 7 && (this.appRef.dirtyFlags |= 1);
          let n = this.taskService.add();
          try {
            this.ngZone.run(() => {
              this.runningTick = true, this.appRef._tick();
            }, void 0, this.schedulerTickApplyArgs);
          } catch (r) {
            throw this.taskService.remove(n), r;
          } finally {
            this.cleanup();
          }
          this.useMicrotaskScheduler = true, vl(() => {
            this.useMicrotaskScheduler = false, this.taskService.remove(n);
          });
        }
        ngOnDestroy() {
          this.subscriptions.unsubscribe(), this.cleanup();
        }
        cleanup() {
          if (this.runningTick = false, this.cancelScheduledCallback?.(), this.cancelScheduledCallback = null, this.pendingRenderTaskId !== null) {
            let n = this.pendingRenderTaskId;
            this.pendingRenderTaskId = null, this.taskService.remove(n);
          }
        }
        static \u0275fac = function(r) {
          return new (r || e)();
        };
        static \u0275prov = P({ token: e, factory: e.\u0275fac, providedIn: "root" });
      }
      return e;
    })();
    Hu = new C("", { providedIn: "root", factory: () => S(Hu, _.Optional | _.SkipSelf) || km() }), Oi = new C(""), Am = new C("");
    Wn = null;
    Vl = class {
      [ce];
      constructor(t) {
        this[ce] = t;
      }
      destroy() {
        this[ce].destroy();
      }
    };
  });
  var _e;
  var Bu = g(() => {
    "use strict";
    ne();
    _e = new C("");
  });
  function tn() {
    return Uu;
  }
  function Ms(e) {
    Uu ??= e;
  }
  var Uu;
  var en;
  var Gu = g(() => {
    "use strict";
    Uu = null;
    en = class {
    };
  });
  function Ss(e, t) {
    t = encodeURIComponent(t);
    for (let n of e.split(";")) {
      let r = n.indexOf("="), [o, i] = r == -1 ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
      if (o.trim() === t) return decodeURIComponent(i);
    }
    return null;
  }
  function Mr(e) {
    return e === zu;
  }
  var Ts;
  var zu;
  var nn;
  var Wu = g(() => {
    "use strict";
    Ts = "browser", zu = "server";
    nn = class {
    };
  });
  var xs = g(() => {
    "use strict";
    Wu();
    Bu();
    Gu();
  });
  function qu(e) {
    for (let t of e) t.remove();
  }
  function Zu(e, t) {
    let n = t.createElement("style");
    return n.textContent = e, n;
  }
  function jm(e, t, n, r) {
    let o = e.head?.querySelectorAll(`style[${Sr}="${t}"],link[${Sr}="${t}"]`);
    if (o) for (let i of o) i.removeAttribute(Sr), i instanceof HTMLLinkElement ? r.set(i.href.slice(i.href.lastIndexOf("/") + 1), { usage: 0, elements: [i] }) : i.textContent && n.set(i.textContent, { usage: 0, elements: [i] });
  }
  function ks(e, t) {
    let n = t.createElement("link");
    return n.setAttribute("rel", "stylesheet"), n.setAttribute("href", e), n;
  }
  function Gm(e) {
    return $m.replace(Ps, e);
  }
  function zm(e) {
    return Hm.replace(Ps, e);
  }
  function Ku(e, t) {
    return t.map((n) => n.replace(Ps, e));
  }
  function Qu(e) {
    return e.tagName === "TEMPLATE" && e.content !== void 0;
  }
  var xr;
  var Rs;
  var rn;
  var Sr;
  var Os;
  var Ns;
  var Ps;
  var Yu;
  var Hm;
  var $m;
  var Bm;
  var Um;
  var Fs;
  var on;
  var As;
  var sn;
  var Tr;
  var Ju = g(() => {
    "use strict";
    xs();
    ne();
    ne();
    xr = new C(""), Rs = (() => {
      class e {
        _zone;
        _plugins;
        _eventNameToPlugin = /* @__PURE__ */ new Map();
        constructor(n, r) {
          this._zone = r, n.forEach((o) => {
            o.manager = this;
          }), this._plugins = n.slice().reverse();
        }
        addEventListener(n, r, o, i) {
          return this._findPluginFor(r).addEventListener(n, r, o, i);
        }
        getZone() {
          return this._zone;
        }
        _findPluginFor(n) {
          let r = this._eventNameToPlugin.get(n);
          if (r) return r;
          if (r = this._plugins.find((i) => i.supports(n)), !r) throw new w(5101, false);
          return this._eventNameToPlugin.set(n, r), r;
        }
        static \u0275fac = function(r) {
          return new (r || e)(N(xr), N($));
        };
        static \u0275prov = P({ token: e, factory: e.\u0275fac });
      }
      return e;
    })(), rn = class {
      _doc;
      constructor(t) {
        this._doc = t;
      }
      manager;
    }, Sr = "ng-app-id";
    Os = (() => {
      class e {
        doc;
        appId;
        nonce;
        inline = /* @__PURE__ */ new Map();
        external = /* @__PURE__ */ new Map();
        hosts = /* @__PURE__ */ new Set();
        isServer;
        constructor(n, r, o, i = {}) {
          this.doc = n, this.appId = r, this.nonce = o, this.isServer = Mr(i), jm(n, r, this.inline, this.external), this.hosts.add(n.head);
        }
        addStyles(n, r) {
          for (let o of n) this.addUsage(o, this.inline, Zu);
          r?.forEach((o) => this.addUsage(o, this.external, ks));
        }
        removeStyles(n, r) {
          for (let o of n) this.removeUsage(o, this.inline);
          r?.forEach((o) => this.removeUsage(o, this.external));
        }
        addUsage(n, r, o) {
          let i = r.get(n);
          i ? i.usage++ : r.set(n, { usage: 1, elements: [...this.hosts].map((s) => this.addElement(s, o(n, this.doc))) });
        }
        removeUsage(n, r) {
          let o = r.get(n);
          o && (o.usage--, o.usage <= 0 && (qu(o.elements), r.delete(n)));
        }
        ngOnDestroy() {
          for (let [, { elements: n }] of [...this.inline, ...this.external]) qu(n);
          this.hosts.clear();
        }
        addHost(n) {
          this.hosts.add(n);
          for (let [r, { elements: o }] of this.inline) o.push(this.addElement(n, Zu(r, this.doc)));
          for (let [r, { elements: o }] of this.external) o.push(this.addElement(n, ks(r, this.doc)));
        }
        removeHost(n) {
          this.hosts.delete(n);
        }
        addElement(n, r) {
          return this.nonce && r.setAttribute("nonce", this.nonce), this.isServer && r.setAttribute(Sr, this.appId), n.appendChild(r);
        }
        static \u0275fac = function(r) {
          return new (r || e)(N(_e), N(rs), N(is, 8), N(Yt));
        };
        static \u0275prov = P({ token: e, factory: e.\u0275fac });
      }
      return e;
    })(), Ns = { svg: "http://www.w3.org/2000/svg", xhtml: "http://www.w3.org/1999/xhtml", xlink: "http://www.w3.org/1999/xlink", xml: "http://www.w3.org/XML/1998/namespace", xmlns: "http://www.w3.org/2000/xmlns/", math: "http://www.w3.org/1998/Math/MathML" }, Ps = /%COMP%/g, Yu = "%COMP%", Hm = `_nghost-${Yu}`, $m = `_ngcontent-${Yu}`, Bm = true, Um = new C("", { providedIn: "root", factory: () => Bm });
    Fs = (() => {
      class e {
        eventManager;
        sharedStylesHost;
        appId;
        removeStylesOnCompDestroy;
        doc;
        platformId;
        ngZone;
        nonce;
        tracingService;
        rendererByCompId = /* @__PURE__ */ new Map();
        defaultRenderer;
        platformIsServer;
        constructor(n, r, o, i, s, a, l, c = null, u = null) {
          this.eventManager = n, this.sharedStylesHost = r, this.appId = o, this.removeStylesOnCompDestroy = i, this.doc = s, this.platformId = a, this.ngZone = l, this.nonce = c, this.tracingService = u, this.platformIsServer = Mr(a), this.defaultRenderer = new on(n, s, l, this.platformIsServer, this.tracingService);
        }
        createRenderer(n, r) {
          if (!n || !r) return this.defaultRenderer;
          this.platformIsServer && r.encapsulation === pe.ShadowDom && (r = B(E({}, r), { encapsulation: pe.Emulated }));
          let o = this.getOrCreateRenderer(n, r);
          return o instanceof Tr ? o.applyToHost(n) : o instanceof sn && o.applyStyles(), o;
        }
        getOrCreateRenderer(n, r) {
          let o = this.rendererByCompId, i = o.get(r.id);
          if (!i) {
            let s = this.doc, a = this.ngZone, l = this.eventManager, c = this.sharedStylesHost, u = this.removeStylesOnCompDestroy, f = this.platformIsServer, h = this.tracingService;
            switch (r.encapsulation) {
              case pe.Emulated:
                i = new Tr(l, c, r, this.appId, u, s, a, f, h);
                break;
              case pe.ShadowDom:
                return new As(l, c, n, r, s, a, this.nonce, f, h);
              default:
                i = new sn(l, c, r, u, s, a, f, h);
                break;
            }
            o.set(r.id, i);
          }
          return i;
        }
        ngOnDestroy() {
          this.rendererByCompId.clear();
        }
        componentReplaced(n) {
          this.rendererByCompId.delete(n);
        }
        static \u0275fac = function(r) {
          return new (r || e)(N(Rs), N(Os), N(rs), N(Um), N(_e), N(Yt), N($), N(is), N(vr, 8));
        };
        static \u0275prov = P({ token: e, factory: e.\u0275fac });
      }
      return e;
    })(), on = class {
      eventManager;
      doc;
      ngZone;
      platformIsServer;
      tracingService;
      data = /* @__PURE__ */ Object.create(null);
      throwOnSyntheticProps = true;
      constructor(t, n, r, o, i) {
        this.eventManager = t, this.doc = n, this.ngZone = r, this.platformIsServer = o, this.tracingService = i;
      }
      destroy() {
      }
      destroyNode = null;
      createElement(t, n) {
        return n ? this.doc.createElementNS(Ns[n] || n, t) : this.doc.createElement(t);
      }
      createComment(t) {
        return this.doc.createComment(t);
      }
      createText(t) {
        return this.doc.createTextNode(t);
      }
      appendChild(t, n) {
        (Qu(t) ? t.content : t).appendChild(n);
      }
      insertBefore(t, n, r) {
        t && (Qu(t) ? t.content : t).insertBefore(n, r);
      }
      removeChild(t, n) {
        n.remove();
      }
      selectRootElement(t, n) {
        let r = typeof t == "string" ? this.doc.querySelector(t) : t;
        if (!r) throw new w(-5104, false);
        return n || (r.textContent = ""), r;
      }
      parentNode(t) {
        return t.parentNode;
      }
      nextSibling(t) {
        return t.nextSibling;
      }
      setAttribute(t, n, r, o) {
        if (o) {
          n = o + ":" + n;
          let i = Ns[o];
          i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r);
        } else t.setAttribute(n, r);
      }
      removeAttribute(t, n, r) {
        if (r) {
          let o = Ns[r];
          o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`);
        } else t.removeAttribute(n);
      }
      addClass(t, n) {
        t.classList.add(n);
      }
      removeClass(t, n) {
        t.classList.remove(n);
      }
      setStyle(t, n, r, o) {
        o & (Re.DashCase | Re.Important) ? t.style.setProperty(n, r, o & Re.Important ? "important" : "") : t.style[n] = r;
      }
      removeStyle(t, n, r) {
        r & Re.DashCase ? t.style.removeProperty(n) : t.style[n] = "";
      }
      setProperty(t, n, r) {
        t != null && (t[n] = r);
      }
      setValue(t, n) {
        t.nodeValue = n;
      }
      listen(t, n, r, o) {
        if (typeof t == "string" && (t = tn().getGlobalEventTarget(this.doc, t), !t)) throw new w(5102, false);
        let i = this.decoratePreventDefault(r);
        return this.tracingService?.wrapEventListener && (i = this.tracingService.wrapEventListener(t, n, i)), this.eventManager.addEventListener(t, n, i, o);
      }
      decoratePreventDefault(t) {
        return (n) => {
          if (n === "__ngUnwrap__") return t;
          (this.platformIsServer ? this.ngZone.runGuarded(() => t(n)) : t(n)) === false && n.preventDefault();
        };
      }
    };
    As = class extends on {
      sharedStylesHost;
      hostEl;
      shadowRoot;
      constructor(t, n, r, o, i, s, a, l, c) {
        super(t, i, s, l, c), this.sharedStylesHost = n, this.hostEl = r, this.shadowRoot = r.attachShadow({ mode: "open" }), this.sharedStylesHost.addHost(this.shadowRoot);
        let u = o.styles;
        u = Ku(o.id, u);
        for (let h of u) {
          let d = document.createElement("style");
          a && d.setAttribute("nonce", a), d.textContent = h, this.shadowRoot.appendChild(d);
        }
        let f = o.getExternalStyles?.();
        if (f) for (let h of f) {
          let d = ks(h, i);
          a && d.setAttribute("nonce", a), this.shadowRoot.appendChild(d);
        }
      }
      nodeOrShadowRoot(t) {
        return t === this.hostEl ? this.shadowRoot : t;
      }
      appendChild(t, n) {
        return super.appendChild(this.nodeOrShadowRoot(t), n);
      }
      insertBefore(t, n, r) {
        return super.insertBefore(this.nodeOrShadowRoot(t), n, r);
      }
      removeChild(t, n) {
        return super.removeChild(null, n);
      }
      parentNode(t) {
        return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)));
      }
      destroy() {
        this.sharedStylesHost.removeHost(this.shadowRoot);
      }
    }, sn = class extends on {
      sharedStylesHost;
      removeStylesOnCompDestroy;
      styles;
      styleUrls;
      constructor(t, n, r, o, i, s, a, l, c) {
        super(t, i, s, a, l), this.sharedStylesHost = n, this.removeStylesOnCompDestroy = o;
        let u = r.styles;
        this.styles = c ? Ku(c, u) : u, this.styleUrls = r.getExternalStyles?.(c);
      }
      applyStyles() {
        this.sharedStylesHost.addStyles(this.styles, this.styleUrls);
      }
      destroy() {
        this.removeStylesOnCompDestroy && this.sharedStylesHost.removeStyles(this.styles, this.styleUrls);
      }
    }, Tr = class extends sn {
      contentAttr;
      hostAttr;
      constructor(t, n, r, o, i, s, a, l, c) {
        let u = o + "-" + r.id;
        super(t, n, r, i, s, a, l, c, u), this.contentAttr = Gm(u), this.hostAttr = zm(u);
      }
      applyToHost(t) {
        this.applyStyles(), this.setAttribute(t, this.hostAttr, "");
      }
      createElement(t, n) {
        let r = super.createElement(t, n);
        return super.setAttribute(r, this.contentAttr, ""), r;
      }
    };
  });
  function Wm() {
    return an = an || document.head.querySelector("base"), an ? an.getAttribute("href") : null;
  }
  function qm(e) {
    return new URL(e, document.baseURI).pathname;
  }
  function Ls(e) {
    return $u(Km(e));
  }
  function Km(e) {
    return { appProviders: [...nv, ...e?.providers ?? []], platformProviders: tv };
  }
  function Jm() {
    Nr.makeCurrent();
  }
  function Xm() {
    return new we();
  }
  function ev() {
    return qc(document), document;
  }
  var Nr;
  var an;
  var Zm;
  var ed;
  var Xu;
  var Qm;
  var Ym;
  var td;
  var tv;
  var nv;
  var nd = g(() => {
    "use strict";
    xs();
    ne();
    ne();
    Ju();
    Nr = class e extends en {
      supportsDOMEvents = true;
      static makeCurrent() {
        Ms(new e());
      }
      onAndCancel(t, n, r, o) {
        return t.addEventListener(n, r, o), () => {
          t.removeEventListener(n, r, o);
        };
      }
      dispatchEvent(t, n) {
        t.dispatchEvent(n);
      }
      remove(t) {
        t.remove();
      }
      createElement(t, n) {
        return n = n || this.getDefaultDocument(), n.createElement(t);
      }
      createHtmlDocument() {
        return document.implementation.createHTMLDocument("fakeTitle");
      }
      getDefaultDocument() {
        return document;
      }
      isElementNode(t) {
        return t.nodeType === Node.ELEMENT_NODE;
      }
      isShadowRoot(t) {
        return t instanceof DocumentFragment;
      }
      getGlobalEventTarget(t, n) {
        return n === "window" ? window : n === "document" ? t : n === "body" ? t.body : null;
      }
      getBaseHref(t) {
        let n = Wm();
        return n == null ? null : qm(n);
      }
      resetBaseElement() {
        an = null;
      }
      getUserAgent() {
        return window.navigator.userAgent;
      }
      getCookie(t) {
        return Ss(document.cookie, t);
      }
    }, an = null;
    Zm = (() => {
      class e {
        build() {
          return new XMLHttpRequest();
        }
        static \u0275fac = function(r) {
          return new (r || e)();
        };
        static \u0275prov = P({ token: e, factory: e.\u0275fac });
      }
      return e;
    })(), ed = (() => {
      class e extends rn {
        constructor(n) {
          super(n);
        }
        supports(n) {
          return true;
        }
        addEventListener(n, r, o, i) {
          return n.addEventListener(r, o, i), () => this.removeEventListener(n, r, o, i);
        }
        removeEventListener(n, r, o, i) {
          return n.removeEventListener(r, o, i);
        }
        static \u0275fac = function(r) {
          return new (r || e)(N(_e));
        };
        static \u0275prov = P({ token: e, factory: e.\u0275fac });
      }
      return e;
    })(), Xu = ["alt", "control", "meta", "shift"], Qm = { "\b": "Backspace", "	": "Tab", "\x7F": "Delete", "\x1B": "Escape", Del: "Delete", Esc: "Escape", Left: "ArrowLeft", Right: "ArrowRight", Up: "ArrowUp", Down: "ArrowDown", Menu: "ContextMenu", Scroll: "ScrollLock", Win: "OS" }, Ym = { alt: (e) => e.altKey, control: (e) => e.ctrlKey, meta: (e) => e.metaKey, shift: (e) => e.shiftKey }, td = (() => {
      class e extends rn {
        constructor(n) {
          super(n);
        }
        supports(n) {
          return e.parseEventName(n) != null;
        }
        addEventListener(n, r, o, i) {
          let s = e.parseEventName(r), a = e.eventCallback(s.fullKey, o, this.manager.getZone());
          return this.manager.getZone().runOutsideAngular(() => tn().onAndCancel(n, s.domEventName, a, i));
        }
        static parseEventName(n) {
          let r = n.toLowerCase().split("."), o = r.shift();
          if (r.length === 0 || !(o === "keydown" || o === "keyup")) return null;
          let i = e._normalizeKey(r.pop()), s = "", a = r.indexOf("code");
          if (a > -1 && (r.splice(a, 1), s = "code."), Xu.forEach((c) => {
            let u = r.indexOf(c);
            u > -1 && (r.splice(u, 1), s += c + ".");
          }), s += i, r.length != 0 || i.length === 0) return null;
          let l = {};
          return l.domEventName = o, l.fullKey = s, l;
        }
        static matchEventFullKeyCode(n, r) {
          let o = Qm[n.key] || n.key, i = "";
          return r.indexOf("code.") > -1 && (o = n.code, i = "code."), o == null || !o ? false : (o = o.toLowerCase(), o === " " ? o = "space" : o === "." && (o = "dot"), Xu.forEach((s) => {
            if (s !== o) {
              let a = Ym[s];
              a(n) && (i += s + ".");
            }
          }), i += o, i === r);
        }
        static eventCallback(n, r, o) {
          return (i) => {
            e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i));
          };
        }
        static _normalizeKey(n) {
          return n === "esc" ? "escape" : n;
        }
        static \u0275fac = function(r) {
          return new (r || e)(N(_e));
        };
        static \u0275prov = P({ token: e, factory: e.\u0275fac });
      }
      return e;
    })();
    tv = [{ provide: Yt, useValue: Ts }, { provide: os, useValue: Jm, multi: true }, { provide: _e, useFactory: ev }], nv = [{ provide: fr, useValue: "root" }, { provide: we, useFactory: Xm }, { provide: xr, useClass: ed, multi: true, deps: [_e] }, { provide: xr, useClass: td, multi: true, deps: [_e] }, Fs, Os, Rs, { provide: ut, useExisting: Fs }, { provide: nn, useClass: Zm }, []];
  });
  var rd = g(() => {
    "use strict";
    nd();
  });
  function iv(e) {
    return e.replace(/[A-Z]/g, (t) => `-${t.toLowerCase()}`);
  }
  function sv(e) {
    return !!e && e.nodeType === Node.ELEMENT_NODE;
  }
  function av(e, t) {
    if (!Vs) {
      let n = Element.prototype;
      Vs = n.matches || n.matchesSelector || n.mozMatchesSelector || n.msMatchesSelector || n.oMatchesSelector || n.webkitMatchesSelector;
    }
    return e.nodeType === Node.ELEMENT_NODE ? Vs.call(e, t) : false;
  }
  function lv(e) {
    let t = {};
    return e.forEach(({ propName: n, templateName: r, transform: o }) => {
      t[iv(r)] = [n, o];
    }), t;
  }
  function cv(e, t) {
    return t.get(gt).resolveComponentFactory(e).inputs;
  }
  function uv(e, t) {
    let n = e.childNodes, r = t.map(() => []), o = -1;
    t.some((i, s) => i === "*" ? (o = s, true) : false);
    for (let i = 0, s = n.length; i < s; ++i) {
      let a = n[i], l = dv(a, t, o);
      l !== -1 && r[l].push(a);
    }
    return r;
  }
  function dv(e, t, n) {
    let r = n;
    return sv(e) && t.some((o, i) => o !== "*" && av(e, o) ? (r = i, true) : false), r;
  }
  function od(e, t) {
    let n = cv(e, t.injector), r = t.strategyFactory || new js(e, t.injector), o = lv(n);
    class i extends $s {
      injector;
      static observedAttributes = Object.keys(o);
      get ngElementStrategy() {
        if (!this._ngElementStrategy) {
          let a = this._ngElementStrategy = r.create(this.injector || t.injector);
          n.forEach(({ propName: l, transform: c }) => {
            if (!this.hasOwnProperty(l)) return;
            let u = this[l];
            delete this[l], a.setInputValue(l, u, c);
          });
        }
        return this._ngElementStrategy;
      }
      _ngElementStrategy;
      constructor(a) {
        super(), this.injector = a;
      }
      attributeChangedCallback(a, l, c, u) {
        let [f, h] = o[a];
        this.ngElementStrategy.setInputValue(f, c, h);
      }
      connectedCallback() {
        let a = false;
        this.ngElementStrategy.events && (this.subscribeToEvents(), a = true), this.ngElementStrategy.connect(this), a || this.subscribeToEvents();
      }
      disconnectedCallback() {
        this._ngElementStrategy && this._ngElementStrategy.disconnect(), this.ngElementEventsSubscription && (this.ngElementEventsSubscription.unsubscribe(), this.ngElementEventsSubscription = null);
      }
      subscribeToEvents() {
        this.ngElementEventsSubscription = this.ngElementStrategy.events.subscribe((a) => {
          let l = new CustomEvent(a.name, { detail: a.value });
          this.dispatchEvent(l);
        });
      }
    }
    return n.forEach(({ propName: s, transform: a }) => {
      Object.defineProperty(i.prototype, s, { get() {
        return this.ngElementStrategy.getInputValue(s);
      }, set(l) {
        this.ngElementStrategy.setInputValue(s, l, a);
      }, configurable: true, enumerable: true });
    }), i;
  }
  var ov;
  var Vs;
  var fv;
  var js;
  var Hs;
  var $s;
  var id = g(() => {
    "use strict";
    ne();
    Ro();
    Oo();
    ov = { schedule(e, t) {
      let n = setTimeout(e, t);
      return () => clearTimeout(n);
    } };
    fv = 10, js = class {
      componentFactory;
      inputMap = /* @__PURE__ */ new Map();
      constructor(t, n) {
        this.componentFactory = n.get(gt).resolveComponentFactory(t);
        for (let r of this.componentFactory.inputs) this.inputMap.set(r.propName, r.templateName);
      }
      create(t) {
        return new Hs(this.componentFactory, t, this.inputMap);
      }
    }, Hs = class {
      componentFactory;
      injector;
      inputMap;
      eventEmitters = new Nt(1);
      events = this.eventEmitters.pipe(Ao((t) => ko(...t)));
      componentRef = null;
      scheduledDestroyFn = null;
      initialInputValues = /* @__PURE__ */ new Map();
      ngZone;
      elementZone;
      appRef;
      cdScheduler;
      constructor(t, n, r) {
        this.componentFactory = t, this.injector = n, this.inputMap = r, this.ngZone = this.injector.get($), this.appRef = this.injector.get(Ue), this.cdScheduler = n.get(Be), this.elementZone = typeof Zone > "u" ? null : this.ngZone.run(() => Zone.current);
      }
      connect(t) {
        this.runInZone(() => {
          if (this.scheduledDestroyFn !== null) {
            this.scheduledDestroyFn(), this.scheduledDestroyFn = null;
            return;
          }
          this.componentRef === null && this.initializeComponent(t);
        });
      }
      disconnect() {
        this.runInZone(() => {
          this.componentRef === null || this.scheduledDestroyFn !== null || (this.scheduledDestroyFn = ov.schedule(() => {
            this.componentRef !== null && (this.componentRef.destroy(), this.componentRef = null);
          }, fv));
        });
      }
      getInputValue(t) {
        return this.runInZone(() => this.componentRef === null ? this.initialInputValues.get(t) : this.componentRef.instance[t]);
      }
      setInputValue(t, n) {
        if (this.componentRef === null) {
          this.initialInputValues.set(t, n);
          return;
        }
        this.runInZone(() => {
          this.componentRef.setInput(this.inputMap.get(t) ?? t, n), wu(this.componentRef.hostView) && (Cu(this.componentRef.changeDetectorRef), this.cdScheduler.notify(6));
        });
      }
      initializeComponent(t) {
        let n = Ae.create({ providers: [], parent: this.injector }), r = uv(t, this.componentFactory.ngContentSelectors);
        this.componentRef = this.componentFactory.create(n, r, t), this.initializeInputs(), this.initializeOutputs(this.componentRef), this.appRef.attachView(this.componentRef.hostView), this.componentRef.hostView.detectChanges();
      }
      initializeInputs() {
        for (let [t, n] of this.initialInputValues) this.setInputValue(t, n);
        this.initialInputValues.clear();
      }
      initializeOutputs(t) {
        let n = this.componentFactory.outputs.map(({ propName: r, templateName: o }) => {
          let i = t.instance[r];
          return new O((s) => {
            let a = i.subscribe((l) => s.next({ name: o, value: l }));
            return () => a.unsubscribe();
          });
        });
        this.eventEmitters.next(n);
      }
      runInZone(t) {
        return this.elementZone && Zone.current !== this.elementZone ? this.ngZone.run(t) : t();
      }
    }, $s = class extends HTMLElement {
      ngElementEventsSubscription = null;
    };
  });
  var hv;
  var qD;
  var pv;
  var sd;
  var gv;
  var ad;
  var ld = g(() => {
    "use strict";
    ne();
    ne();
    hv = { "[class.ng-untouched]": "isUntouched", "[class.ng-touched]": "isTouched", "[class.ng-pristine]": "isPristine", "[class.ng-dirty]": "isDirty", "[class.ng-valid]": "isValid", "[class.ng-invalid]": "isInvalid", "[class.ng-pending]": "isPending" }, qD = B(E({}, hv), { "[class.ng-submitted]": "isSubmitted" }), pv = new C("", { providedIn: "root", factory: () => sd }), sd = "always", gv = (() => {
      class e {
        static \u0275fac = function(r) {
          return new (r || e)();
        };
        static \u0275mod = br({ type: e });
        static \u0275inj = ur({});
      }
      return e;
    })(), ad = (() => {
      class e {
        static withConfig(n) {
          return { ngModule: e, providers: [{ provide: pv, useValue: n.callSetDisabledState ?? sd }] };
        }
        static \u0275fac = function(r) {
          return new (r || e)();
        };
        static \u0275mod = br({ type: e });
        static \u0275inj = ur({ imports: [gv] });
      }
      return e;
    })();
  });
  var x;
  var Bs = g(() => {
    "use strict";
    x = { taskDuration: 300, roundDuration: null, sessionId: null, autoStart: false, startDifficulty: 1, minDifficulty: 1, maxDifficulty: 3, adaptiveDifficulty: true, correctStreakForLevelUp: 4, wrongStreakForLevelDown: 4, numberOfOptions: 8, invoiceOrder: "random", randomSeed: null, maxSubmissions: null, maxCorrectSubmissions: null, showTimer: true, showFeedback: true, showDifficulty: false, completedMessage: "You have completed all invoice matching tasks.", logLevel: "basic", mutedEvents: [] };
  });
  function fd(e) {
    return e.replace(/[A-Z]/g, (t) => "-" + t.toLowerCase());
  }
  function Qe(e) {
    if (typeof e == "number") return Number.isFinite(e) && Number.isInteger(e) ? e : void 0;
    if (typeof e == "string") {
      let t = e.trim();
      if (t === "") return;
      let n = Number(t);
      return Number.isFinite(n) && Number.isInteger(n) ? n : void 0;
    }
  }
  function yv(e) {
    if (typeof e == "boolean") return e;
    if (typeof e == "string") {
      let t = e.trim().toLowerCase();
      if (t === "" || t === "true") return true;
      if (t === "false") return false;
    }
  }
  function Rr(e, t, n) {
    return Math.min(n, Math.max(t, e));
  }
  function _v(e) {
    if (e === null) return { value: null };
    let t = Qe(e);
    return t === void 0 ? { value: x.taskDuration, problem: R("invalid_type", e, x.taskDuration, "taskDuration must be an integer number of seconds") } : t < 0 ? { value: 0, problem: R("out_of_range", e, 0, "taskDuration cannot be negative; using 0 (no time limit)") } : { value: t };
  }
  function Iv(e) {
    if (e === null) return { value: null };
    let t = Qe(e);
    return t === void 0 ? { value: x.roundDuration, problem: R("invalid_type", e, x.roundDuration, "roundDuration must be an integer number of seconds") } : t < 0 ? { value: 0, problem: R("out_of_range", e, 0, "roundDuration cannot be negative; using 0 (no per-round limit)") } : { value: t };
  }
  function cd(e, t) {
    return e == null ? { value: null } : typeof e == "string" ? { value: e.trim() === "" ? null : e } : { value: null, problem: R("invalid_type", e, null, `${t} must be a string or null`) };
  }
  function ln(e, t, n) {
    let r = yv(e);
    return r === void 0 ? { value: n, problem: R("invalid_type", e, n, `${t} must be a boolean`) } : { value: r };
  }
  function Us(e, t, n) {
    let r = Qe(e);
    if (r === void 0) return { value: n, problem: R("invalid_type", e, n, `${t} must be an integer in [1, 6]`) };
    if (r < 1 || r > 6) {
      let o = Rr(r, 1, 6);
      return { value: o, problem: R("out_of_range", e, o, `${t} must be in [1, 6]`) };
    }
    return { value: r };
  }
  function hd(e, t, n) {
    let r = Qe(e);
    if (r === void 0) return { value: null, problem: R("invalid_type", e, null, "setDifficulty(level) requires an integer") };
    if (r < t || r > n) {
      let o = Rr(r, t, n);
      return { value: o, problem: R("out_of_range", e, o, `difficulty must be in [${t}, ${n}]`) };
    }
    return { value: r };
  }
  function ud(e, t, n) {
    let r = Qe(e);
    return r === void 0 ? { value: n, problem: R("invalid_type", e, n, `${t} must be an integer >= 1`) } : r < 1 ? { value: 1, problem: R("out_of_range", e, 1, `${t} must be >= 1`) } : { value: r };
  }
  function bv(e) {
    let t = Qe(e);
    if (t === void 0) return { value: x.numberOfOptions, problem: R("invalid_type", e, x.numberOfOptions, "numberOfOptions must be an integer in [3, 12]") };
    if (t < 3 || t > 12) {
      let n = Rr(t, 3, 12);
      return { value: n, problem: R("out_of_range", e, n, "numberOfOptions must be in [3, 12]") };
    }
    return { value: t };
  }
  function Dv(e) {
    return e === "fixed" || e === "random" ? { value: e } : { value: x.invoiceOrder, problem: R("invalid_enum", e, x.invoiceOrder, 'invoiceOrder must be "fixed" or "random"') };
  }
  function dd(e, t) {
    if (e == null) return { value: null };
    let n = Qe(e);
    return n === void 0 ? { value: null, problem: R("invalid_type", e, null, `${t} must be a positive integer or null`) } : n < 1 ? { value: 1, problem: R("out_of_range", e, 1, `${t} must be >= 1; use null to disable`) } : { value: n };
  }
  function Ev(e) {
    return typeof e == "string" ? { value: e } : { value: x.completedMessage, problem: R("invalid_type", e, x.completedMessage, "completedMessage must be a string") };
  }
  function wv(e) {
    return e === "basic" || e === "detailed" || e === "debug" ? { value: e } : { value: x.logLevel, problem: R("invalid_enum", e, x.logLevel, 'logLevel must be "basic", "detailed" or "debug"') };
  }
  function Cv(e) {
    if (e == null) return { value: [] };
    let t;
    if (Array.isArray(e)) try {
      t = [...e];
    } catch {
      return { value: [], problem: R("invalid_type", e, [], "mutedEvents array could not be read (its iterator or an element accessor threw)") };
    }
    else if (typeof e == "string") t = e.split(",").map((i) => i.trim()).filter((i) => i !== "");
    else return { value: [], problem: R("invalid_type", e, [], "mutedEvents must be an array of event-type names (or a comma-separated string)") };
    let n = [], r = [], o = false;
    for (let i of t) {
      if (typeof i != "string") {
        o = true;
        continue;
      }
      let s = i.trim();
      s !== "" && (mv.has(s) ? n.includes(s) || n.push(s) : vv.has(s) || r.push(s));
    }
    return o ? { value: n, problem: R("invalid_type", e, n, "mutedEvents entries must be event-type strings") } : r.length > 0 ? { value: n, problem: R("invalid_enum", e, n, `mutedEvents contains unknown event type(s): ${r.join(", ")}`) } : { value: n };
  }
  function R(e, t, n, r) {
    return { code: e, option: null, received: t, usedValue: n, message: r };
  }
  function bt(e, t) {
    let n;
    switch (e) {
      case "taskDuration":
        n = _v(t);
        break;
      case "roundDuration":
        n = Iv(t);
        break;
      case "sessionId":
        n = cd(t, "sessionId");
        break;
      case "randomSeed":
        n = cd(t, "randomSeed");
        break;
      case "autoStart":
        n = ln(t, "autoStart", x.autoStart);
        break;
      case "adaptiveDifficulty":
        n = ln(t, "adaptiveDifficulty", x.adaptiveDifficulty);
        break;
      case "showTimer":
        n = ln(t, "showTimer", x.showTimer);
        break;
      case "showFeedback":
        n = ln(t, "showFeedback", x.showFeedback);
        break;
      case "showDifficulty":
        n = ln(t, "showDifficulty", x.showDifficulty);
        break;
      case "startDifficulty":
        n = Us(t, "startDifficulty", x.startDifficulty);
        break;
      case "minDifficulty":
        n = Us(t, "minDifficulty", x.minDifficulty);
        break;
      case "maxDifficulty":
        n = Us(t, "maxDifficulty", x.maxDifficulty);
        break;
      case "correctStreakForLevelUp":
        n = ud(t, "correctStreakForLevelUp", x.correctStreakForLevelUp);
        break;
      case "wrongStreakForLevelDown":
        n = ud(t, "wrongStreakForLevelDown", x.wrongStreakForLevelDown);
        break;
      case "numberOfOptions":
        n = bv(t);
        break;
      case "invoiceOrder":
        n = Dv(t);
        break;
      case "maxSubmissions":
        n = dd(t, "maxSubmissions");
        break;
      case "maxCorrectSubmissions":
        n = dd(t, "maxCorrectSubmissions");
        break;
      case "completedMessage":
        n = Ev(t);
        break;
      case "logLevel":
        n = wv(t);
        break;
      case "mutedEvents":
        n = Cv(t);
        break;
      default:
        n = { value: x[e] };
    }
    return n.problem && (n.problem.option = e), n;
  }
  function pd(e) {
    let t = E({}, x), n = [];
    for (let r of It) {
      if (!(r in e) || e[r] === void 0) continue;
      let { value: o, problem: i } = bt(r, e[r]);
      t[r] = o, i && n.push(i);
    }
    if (t.minDifficulty > t.maxDifficulty) {
      let r = t.minDifficulty, o = t.maxDifficulty;
      t.minDifficulty = o, t.maxDifficulty = r, n.push({ code: "range_inverted", option: "minDifficulty", received: { minDifficulty: r, maxDifficulty: o }, usedValue: { minDifficulty: o, maxDifficulty: r }, message: "minDifficulty was greater than maxDifficulty; values swapped" });
    }
    if (t.startDifficulty < t.minDifficulty || t.startDifficulty > t.maxDifficulty) {
      let r = Rr(t.startDifficulty, t.minDifficulty, t.maxDifficulty);
      n.push({ code: "out_of_range", option: "startDifficulty", received: t.startDifficulty, usedValue: r, message: "startDifficulty must be within [minDifficulty, maxDifficulty]" }), t.startDifficulty = r;
    }
    return t.maxDifficulty >= 5 && t.numberOfOptions < 4 && (n.push({ code: "out_of_range", option: "numberOfOptions", received: t.numberOfOptions, usedValue: 4, message: "numberOfOptions must be at least 4 when maxDifficulty >= 5" }), t.numberOfOptions = 4), { config: t, problems: n };
  }
  var It;
  var kr;
  var mv;
  var vv;
  var Gs;
  var Ar;
  var zs;
  var gd = g(() => {
    "use strict";
    Bs();
    It = ["taskDuration", "roundDuration", "sessionId", "autoStart", "startDifficulty", "minDifficulty", "maxDifficulty", "adaptiveDifficulty", "correctStreakForLevelUp", "wrongStreakForLevelDown", "numberOfOptions", "invoiceOrder", "randomSeed", "maxSubmissions", "maxCorrectSubmissions", "showTimer", "showFeedback", "showDifficulty", "completedMessage", "logLevel", "mutedEvents"], kr = /* @__PURE__ */ new Set(["sessionId", "adaptiveDifficulty", "correctStreakForLevelUp", "wrongStreakForLevelDown", "maxSubmissions", "maxCorrectSubmissions", "showTimer", "showFeedback", "showDifficulty", "completedMessage", "logLevel", "mutedEvents"]), mv = /* @__PURE__ */ new Set(["roundStarted", "selectionChanged", "roundSubmitted", "difficultyChanged", "taskPaused", "taskResumed"]), vv = /* @__PURE__ */ new Set(["taskStarted", "taskFinished", "taskCompleted", "configChanged", "error"]), Gs = /* @__PURE__ */ new Set(["taskDuration", "roundDuration", "startDifficulty", "minDifficulty", "maxDifficulty", "numberOfOptions", "invoiceOrder", "randomSeed"]);
    Ar = It.reduce((e, t) => (e[fd(t)] = t, e), {}), zs = It.map(fd);
  });
  function Mv(e) {
    let t = 2166136261;
    for (let n = 0; n < e.length; n++) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
    return t >>> 0;
  }
  function Sv(e) {
    let t = e;
    return function() {
      t |= 0, t = t + 1831565813 | 0;
      let n = Math.imul(t ^ t >>> 15, 1 | t);
      return n = n + Math.imul(n ^ n >>> 7, 61 | n) ^ n, ((n ^ n >>> 14) >>> 0) / 4294967296;
    };
  }
  function md(e, t, n) {
    return e + Math.floor(n() * (t - e + 1));
  }
  function Tv(e, t) {
    let n = [...e];
    for (let r = n.length - 1; r > 0; r--) {
      let o = Math.floor(t() * (r + 1));
      [n[r], n[o]] = [n[o], n[r]];
    }
    return n;
  }
  function xv(e, t, n) {
    let { slots: r } = qs[t], o = r.length, i = new Array(o + 1).fill(0), s = new Array(o + 1).fill(0);
    for (let d = o - 1; d >= 0; d--) i[d] = i[d + 1] + r[d].min, s[d] = s[d + 1] + r[d].max;
    let a = /* @__PURE__ */ new Map();
    function l(d, p) {
      if (d === o) return p === 0 ? 1 : 0;
      if (p < i[d] || p > s[d]) return 0;
      let m = d * 1e3 + p, T = a.get(m);
      if (T !== void 0) return T;
      let I = Math.max(r[d].min, p - s[d + 1]), re = Math.min(r[d].max, p - i[d + 1]), Pr = 0;
      for (let Fr = I; Fr <= re; Fr++) Pr += l(d + 1, p - Fr);
      return a.set(m, Pr), Pr;
    }
    let c = l(0, e);
    if (c === 0) return null;
    let u = Math.floor(n() * c), f = [], h = e;
    for (let d = 0; d < o - 1; d++) {
      let p = Math.max(r[d].min, h - s[d + 1]), m = Math.min(r[d].max, h - i[d + 1]);
      for (let T = p; T <= m; T++) {
        let I = l(d + 1, h - T);
        if (u < I) {
          f.push(T), h -= T;
          break;
        }
        u -= I;
      }
    }
    return f.push(h), f;
  }
  function Nv(e, t, n) {
    let r = e.length;
    for (let o = 0; o < 1 << r; o++) {
      let i = t;
      for (let s = 0; s < r && !(o & 1 << s && (i += e[s], i > n)); s++) ;
      if (i === n) return true;
    }
    return false;
  }
  function kv(e, t, n, r, o) {
    let { distractorMin: i, distractorMax: s } = qs[n], a = r - e.length, l = [];
    for (let c = 0; c < a; c++) {
      let u = 0, f = false;
      for (; u < 1e3; ) {
        let h = md(i, s, o), d = [...e, ...l];
        if (!d.includes(h) && !Nv(d, h, t)) {
          l.push(h), f = true;
          break;
        }
        u++;
      }
      if (!f) return null;
    }
    return l;
  }
  function vd(e, t, n) {
    let { slots: r } = qs[e], o = r.length, i = Math.max(t, o), s = r.reduce((c, u) => c + u.min, 0), a = r.reduce((c, u) => c + u.max, 0), l = false;
    for (let c = 0; c < 100; c++) {
      let u = md(s, a, n), f = xv(u, e, n);
      if (!f || new Set(f).size < f.length) continue;
      let h = kv(f, u, e, i, n);
      if (!h) {
        l = true;
        continue;
      }
      let d = [...f.map((I) => ({ amount: I, isCorrect: true })), ...h.map((I) => ({ amount: I, isCorrect: false }))], p = Tv(d, n), m = p.map((I, re) => ({ id: `inv-${re + 1}`, amount: I.amount })), T = p.map((I, re) => I.isCorrect ? `inv-${re + 1}` : null).filter((I) => I !== null);
      return { round: { targetAmount: u, visibleInvoices: m, correctInvoiceIds: T }, hadRetries: l };
    }
    throw new Ws();
  }
  function yd(e, t) {
    return e === "fixed" ? Sv(Mv(t ?? "0")) : Math.random;
  }
  var qs;
  var Ws;
  var _d = g(() => {
    "use strict";
    qs = { 1: { slots: [{ min: 10, max: 99 }, { min: 1, max: 9 }], distractorMin: 1, distractorMax: 99 }, 2: { slots: [{ min: 10, max: 99 }, { min: 10, max: 99 }], distractorMin: 10, distractorMax: 99 }, 3: { slots: [{ min: 10, max: 99 }, { min: 10, max: 99 }, { min: 1, max: 9 }], distractorMin: 1, distractorMax: 99 }, 4: { slots: [{ min: 10, max: 99 }, { min: 10, max: 99 }, { min: 10, max: 99 }], distractorMin: 10, distractorMax: 99 }, 5: { slots: [{ min: 10, max: 99 }, { min: 10, max: 99 }, { min: 10, max: 99 }, { min: 1, max: 9 }], distractorMin: 1, distractorMax: 99 }, 6: { slots: [{ min: 10, max: 99 }, { min: 10, max: 99 }, { min: 10, max: 99 }, { min: 10, max: 99 }], distractorMin: 10, distractorMax: 99 } };
    Ws = class extends Error {
      constructor() {
        super("Round generation failed after 100 attempts \u2014 emit error + end task");
      }
    };
  });
  function Rv(e, t) {
    if (e & 1 && (F(0, "div", 3)(1, "span", 16), U(2, "Time remaining"), V(), F(3, "span", 17), U(4), V()()), e & 2) {
      let n = ye(2);
      W(4), yt(n.formatClock(n.remainingSeconds()));
    }
  }
  function Ov(e, t) {
    e & 1 && (F(0, "div", 4)(1, "span", 16), U(2, "No time limit"), V()());
  }
  function Pv(e, t) {
    if (e & 1 && (F(0, "div", 5)(1, "span", 16), U(2, "Round time"), V(), F(3, "span", 17), U(4), V()()), e & 2) {
      let n = ye(2);
      W(4), yt(n.formatClock(n.roundRemainingSeconds()));
    }
  }
  function Fv(e, t) {
    if (e & 1 && (F(0, "div", 6)(1, "span", 18), U(2, "Level"), V(), F(3, "span", 19), U(4), V()()), e & 2) {
      let n = ye(2);
      W(4), yt(n.currentLevel);
    }
  }
  function Lv(e, t) {
    if (e & 1) {
      let n = Cs();
      F(0, "li", 20)(1, "label", 21)(2, "input", 22), Xt("change", function() {
        let o = qi(n).$implicit, i = ye(2);
        return Zi(i.toggleInvoice(o.id));
      }), V(), F(3, "span", 23), U(4, "ACQUISITIONS Inc."), V(), F(5, "span", 24), U(6), V()()();
    }
    if (e & 2) {
      let n = t.$implicit, r = t.$index, o = ye(2);
      Jt("imt-invoice-row--selected", o.isSelected(n.id)), W(2), Er("checked", o.isSelected(n.id))("disabled", !o.isRunning || o.feedbackState !== null), Dr("aria-label", "Invoice " + (r + 1) + ", \u20AC " + n.amount), W(4), _t("\u20AC ", n.amount, "");
    }
  }
  function Vv(e, t) {
    if (e & 1 && (F(0, "div", 25), U(1), V()), e & 2) {
      let n = ye(2);
      Jt("imt-feedback--correct", n.feedbackState === "correct")("imt-feedback--wrong", n.feedbackState === "wrong"), W(), _t(" ", n.feedbackState === "correct" ? "Correct" : "Incorrect", " ");
    }
  }
  function jv(e, t) {
    if (e & 1) {
      let n = Cs();
      Kt(0, Rv, 5, 1, "div", 3)(1, Ov, 3, 0, "div", 4)(2, Pv, 5, 1, "div", 5)(3, Fv, 5, 1, "div", 6), F(4, "div", 7)(5, "span", 8), U(6, "Payment Amount"), V(), F(7, "span", 9), U(8), V()(), F(9, "div", 10)(10, "ul", 11), Pu(11, Lv, 7, 6, "li", 12, Av), V(), F(13, "div", 13), Kt(14, Vv, 2, 5, "div", 14), F(15, "button", 15), Xt("click", function() {
        qi(n);
        let o = ye();
        return Zi(o.onPost());
      }), U(16, " Post "), V()()();
    }
    if (e & 2) {
      let n = ye();
      vt(n.showTimerDisplay ? 0 : n.showNoTimeLimitLabel ? 1 : -1), W(2), vt(n.showRoundTimerDisplay ? 2 : -1), W(), vt(n.showDifficultyIndicator ? 3 : -1), W(5), _t("\u20AC ", n.targetAmount(), ""), W(3), Fu(n.invoices()), W(3), vt(n.feedbackState !== null ? 14 : -1), W(), Er("disabled", !n.isRunning || n.feedbackState !== null);
    }
  }
  function Hv(e, t) {
    if (e & 1 && (F(0, "div", 1)(1, "span", 26), U(2), V()()), e & 2) {
      let n = ye();
      W(2), yt(n.completedMessage);
    }
  }
  function $v(e, t) {
    e & 1 && (F(0, "div", 2)(1, "span", 27), U(2, "Ready"), V()());
  }
  var Av;
  var Or;
  var Id = g(() => {
    "use strict";
    ne();
    ld();
    Bs();
    gd();
    _d();
    ne();
    Av = (e, t) => t.id;
    Or = class e {
      elementRef = S(mr);
      targetAmount = ve(0);
      invoices = ve([]);
      _selectedIds = ve(/* @__PURE__ */ new Set());
      _state = ve("idle");
      _remainingMs = ve(0);
      remainingSeconds = wr(() => Math.ceil(this._remainingMs() / 1e3));
      _roundRemainingMs = ve(0);
      roundRemainingSeconds = wr(() => Math.ceil(this._roundRemainingMs() / 1e3));
      _feedbackState = ve(null);
      _config = ve(E({}, x));
      get _effectiveConfig() {
        return this._config();
      }
      static _COPY_FAILED = Object.freeze({ __invoiceTask: "uncopyable_array" });
      _inputConfig = {};
      _attributeObserver = null;
      _rng = Math.random;
      _generator = vd;
      _sequence = 0;
      _taskStartedAt = -1;
      _roundIndex = -1;
      _currentDifficulty = x.startDifficulty;
      _pendingDifficulty = null;
      _correctStreak = 0;
      _wrongStreak = 0;
      _roundStartedAt = 0;
      _correctInvoiceIds = [];
      _totalSubmissions = 0;
      _totalCorrect = 0;
      _totalWrong = 0;
      _totalPausedMs = 0;
      _pausedAt = 0;
      _roundPausedMs = 0;
      _finalDurationMs = -1;
      _durationTimerId = null;
      _feedbackTimerId = null;
      _pendingRoundLoad = false;
      get isRunning() {
        return this._state() === "running";
      }
      get feedbackState() {
        return this._feedbackState();
      }
      get hasActiveRound() {
        let t = this._state();
        return t === "running" || t === "paused";
      }
      get isCompleted() {
        return this._state() === "completed";
      }
      get completedMessage() {
        return this._effectiveConfig.completedMessage;
      }
      get showTimerDisplay() {
        return this._effectiveConfig.showTimer && !!this._effectiveConfig.taskDuration && this._effectiveConfig.taskDuration > 0 && this._state() === "running";
      }
      get showNoTimeLimitLabel() {
        let { showTimer: t, taskDuration: n } = this._effectiveConfig;
        return t && (!n || n <= 0) && this._state() === "running";
      }
      get showRoundTimerDisplay() {
        let { showTimer: t, roundDuration: n } = this._effectiveConfig;
        return t && !!n && n > 0 && this._state() === "running";
      }
      get showDifficultyIndicator() {
        return this._effectiveConfig.showDifficulty && this.hasActiveRound;
      }
      get currentLevel() {
        return this._currentDifficulty;
      }
      formatClock(t) {
        let n = Math.max(0, Math.floor(t)), r = Math.floor(n / 60), o = n % 60;
        return `${r}:${String(o).padStart(2, "0")}`;
      }
      isSelected(t) {
        return this._selectedIds().has(t);
      }
      toggleInvoice(t) {
        if (this._selectedIds.update((s) => {
          let a = new Set(s);
          return a.has(t) ? a.delete(t) : a.add(t), a;
        }), this._state() !== "running") return;
        let { logLevel: n } = this._effectiveConfig;
        if (n !== "detailed" && n !== "debug") return;
        let r = this._selectedIds(), o = this.invoices().filter((s) => r.has(s.id)).map((s) => s.id), i = this.invoices().filter((s) => r.has(s.id)).reduce((s, a) => s + a.amount, 0);
        this._emit({ eventType: "selectionChanged", invoiceId: t, isChecked: r.has(t), currentSelection: o, currentSum: i, roundRelativeTimeMs: Math.max(0, Math.round(performance.now() - this._roundStartedAt)) });
      }
      onPost() {
        this._state() === "running" && this._submitRound(false);
      }
      _submitRound(t) {
        let n = this._selectedIds(), r = this.invoices(), o = r.filter((f) => n.has(f.id)).map((f) => f.id), i = r.filter((f) => n.has(f.id)).reduce((f, h) => f + h.amount, 0), s = new Set(this._correctInvoiceIds), a = s.size === o.length && o.every((f) => s.has(f)), l = Math.max(0, Math.round(performance.now() - this._roundStartedAt - this._roundPausedMs));
        if (this._totalSubmissions++, a ? this._totalCorrect++ : this._totalWrong++, this._emit({ eventType: "roundSubmitted", targetAmount: this.targetAmount(), selectedInvoiceIds: o, correctInvoiceIds: [...this._correctInvoiceIds], selectedSum: i, isCorrect: a, reactionTimeMs: l, totalSubmissions: this._totalSubmissions, totalCorrect: this._totalCorrect, totalWrong: this._totalWrong, timedOut: t }), this._effectiveConfig.adaptiveDifficulty) {
          a ? (this._correctStreak++, this._wrongStreak = 0) : (this._wrongStreak++, this._correctStreak = 0);
          let { correctStreakForLevelUp: f, wrongStreakForLevelDown: h, minDifficulty: d, maxDifficulty: p } = this._effectiveConfig;
          if (this._correctStreak >= f) {
            if (this._currentDifficulty < p) {
              let m = this._currentDifficulty;
              this._currentDifficulty = this._currentDifficulty + 1, this._emit({ eventType: "difficultyChanged", fromLevel: m, toLevel: this._currentDifficulty, reason: "streak_up" });
            }
            this._correctStreak = 0, this._wrongStreak = 0;
          } else if (this._wrongStreak >= h) {
            if (this._currentDifficulty > d) {
              let m = this._currentDifficulty;
              this._currentDifficulty = this._currentDifficulty - 1, this._emit({ eventType: "difficultyChanged", fromLevel: m, toLevel: this._currentDifficulty, reason: "streak_down" });
            }
            this._correctStreak = 0, this._wrongStreak = 0;
          }
        }
        let { maxSubmissions: c, maxCorrectSubmissions: u } = this._effectiveConfig;
        if (c !== null && this._totalSubmissions >= c) {
          this._endTaskNaturally("max_submissions");
          return;
        }
        if (u !== null && this._totalCorrect >= u) {
          this._endTaskNaturally("max_correct_submissions");
          return;
        }
        this._effectiveConfig.showFeedback ? (this._feedbackState.set(a ? "correct" : "wrong"), this._feedbackTimerId = setTimeout(() => {
          this._feedbackTimerId = null, this._feedbackState.set(null), this._loadNewRound();
        }, 600)) : this._loadNewRound();
      }
      ngOnInit() {
        let t = this.elementRef.nativeElement;
        t.start = () => this.start(), t.pause = () => this.pause(), t.resume = () => this.resume(), t.stop = () => this.stop(), t.reset = () => this.reset(), t.getSummary = () => this.getSummary(), t.setDifficulty = (r) => this.setDifficulty(r), this._attachConfigAccessors(t), this._observeAttributes();
        let n = this._readAttributes().autoStart;
        n !== void 0 && bt("autoStart", n).value === true && this.start();
      }
      ngOnDestroy() {
        this._clearTimer(), this._attributeObserver?.disconnect(), this._attributeObserver = null;
      }
      _attachConfigAccessors(t) {
        for (let n of It) Object.defineProperty(t, n, { configurable: true, enumerable: true, get: () => this._readOption(n), set: (r) => this._writeOption(n, r) });
        Object.defineProperty(t, "config", { configurable: true, enumerable: true, get: () => {
          let n = this._inputConfig.mutedEvents, r = E(E({}, this._effectiveConfig), this._inputConfig);
          if (n === e._COPY_FAILED) r.mutedEvents = [];
          else if (Array.isArray(r.mutedEvents)) try {
            r.mutedEvents = [...r.mutedEvents];
          } catch {
            r.mutedEvents = [];
          }
          return r;
        }, set: (n) => this.setConfig(n) });
      }
      _observeAttributes() {
        let t = this.elementRef.nativeElement;
        typeof MutationObserver > "u" || (this._attributeObserver = new MutationObserver((n) => {
          for (let r of n) r.type !== "attributes" || r.attributeName === null || !Ar[r.attributeName] || this._onAttributeChanged(r.attributeName, t.getAttribute(r.attributeName));
        }), this._attributeObserver.observe(t, { attributes: true, attributeFilter: [...zs] }));
      }
      _readAttributes() {
        let t = this.elementRef.nativeElement, n = {};
        for (let r of zs) {
          if (!t.hasAttribute(r)) continue;
          let o = Ar[r];
          n[o] = t.getAttribute(r) ?? "";
        }
        return n;
      }
      _onAttributeChanged(t, n) {
        let r = Ar[t];
        if (r) {
          if (n === null) {
            if (delete this._inputConfig[r], this._state() !== "idle" && kr.has(r)) {
              let o = this._applyLiveOption(r, x[r]);
              o && this._emit({ eventType: "configChanged", changes: [o] });
            }
            return;
          }
          this._writeOption(r, n);
        }
      }
      _readOption(t) {
        if (this._state() === "idle" && t in this._inputConfig && this._inputConfig[t] !== void 0) {
          let n = this._inputConfig[t];
          return n === e._COPY_FAILED ? [] : this._cloneOptionValue(n);
        }
        return this._cloneOptionValue(this._effectiveConfig[t]);
      }
      _writeOption(t, n) {
        if (this._inputConfig[t] = this._cloneOptionValue(n), t === "autoStart") {
          this._state() === "idle" && bt("autoStart", n).value === true && this.start();
          return;
        }
        if (this._state() !== "idle" && !Gs.has(t) && kr.has(t)) {
          let r = this._applyLiveOption(t, n);
          r && this._emit({ eventType: "configChanged", changes: [r] });
        }
      }
      setConfig(t) {
        if (t === null || typeof t != "object") return;
        let n = [], r = this._state() !== "idle", o = false;
        for (let i of Object.keys(t)) {
          if (!It.includes(i)) {
            this._emitError("unknown_option", "warning", i, `Unknown config option "${i}"`, { received: t[i], usedValue: null });
            continue;
          }
          let s = i, a = t[s];
          if (this._inputConfig[s] = this._cloneOptionValue(a), s === "autoStart") {
            this._state() === "idle" && bt("autoStart", a).value === true && (o = true);
            continue;
          }
          if (!(!r || Gs.has(s)) && kr.has(s)) {
            let l = this._applyLiveOption(s, a);
            l && n.push(l);
          }
        }
        n.length > 0 && this._emit({ eventType: "configChanged", changes: n }), o && this.start();
      }
      _applyLiveOption(t, n) {
        let { value: r, problem: o } = bt(t, n);
        o && this._emitConfigProblem(o);
        let i = this._effectiveConfig[t];
        return this._optionValuesEqual(i, r) ? null : (this._config.set(B(E({}, this._effectiveConfig), { [t]: r })), (t === "adaptiveDifficulty" || t === "correctStreakForLevelUp" || t === "wrongStreakForLevelDown") && (this._correctStreak = 0, this._wrongStreak = 0), t === "adaptiveDifficulty" && r === true && (this._pendingDifficulty = null), { option: t, oldValue: this._cloneOptionValue(i), newValue: this._cloneOptionValue(r) });
      }
      _optionValuesEqual(t, n) {
        return t === n ? true : Array.isArray(t) && Array.isArray(n) ? t.length === n.length && t.every((r, o) => r === n[o]) : false;
      }
      _cloneOptionValue(t) {
        if (!Array.isArray(t)) return t;
        try {
          return [...t];
        } catch {
          return e._COPY_FAILED;
        }
      }
      _cloneConfig(t) {
        return B(E({}, t), { mutedEvents: [...t.mutedEvents] });
      }
      _emit(t) {
        let n = t.eventType;
        if (this._effectiveConfig.mutedEvents.includes(n)) return;
        let r = this._state(), o = this._taskStartedAt >= 0 ? Math.max(0, Math.round(performance.now() - this._taskStartedAt)) : 0, i = Date.now(), s = E({ sequence: ++this._sequence, timestamp: new Date(i).toISOString(), unixMs: i, relativeTimeMs: o, sessionId: this._effectiveConfig.sessionId, roundIndex: this._roundIndex >= 0 ? this._roundIndex : null, currentDifficulty: r === "running" || r === "paused" ? this._currentDifficulty : null }, t);
        this.elementRef.nativeElement.dispatchEvent(new CustomEvent("invoiceTaskEvent", { detail: s, bubbles: false, composed: false }));
      }
      _emitError(t, n, r, o, i = {}) {
        let s = {};
        "received" in i && (s.received = this._toJsonSafe(i.received)), "usedValue" in i && (s.usedValue = this._toJsonSafe(i.usedValue)), this._emit(E({ eventType: "error", code: t, severity: n, option: r, message: o }, s));
      }
      _toJsonSafe(t, n = /* @__PURE__ */ new WeakSet()) {
        if (t === null) return null;
        let r = typeof t;
        if (r === "string" || r === "boolean") return t;
        if (r === "number") return Number.isFinite(t) ? t : String(t);
        if (r === "bigint") return t.toString();
        if (r === "undefined") return "[undefined]";
        if (r === "symbol" || r === "function") return String(t);
        let o = t;
        if (n.has(o)) return "[Circular]";
        if (n.add(o), Array.isArray(t)) return t.map((s) => {
          try {
            return this._toJsonSafe(s, n);
          } catch {
            return "[Unserializable]";
          }
        });
        let i = {};
        for (let s of Object.keys(o)) try {
          i[s] = this._toJsonSafe(o[s], n);
        } catch {
          i[s] = "[Unserializable]";
        }
        return i;
      }
      _emitConfigProblem(t) {
        this._emitError(t.code, "warning", t.option, t.message, { received: this._cloneOptionValue(t.received), usedValue: this._cloneOptionValue(t.usedValue) });
      }
      _emitTaskFinished(t, n, r = {}) {
        let o = this._pausedAt > 0 ? Math.max(0, Math.round(performance.now() - this._pausedAt)) : 0, i = this._taskStartedAt >= 0 ? Math.max(0, Math.round(performance.now() - this._taskStartedAt - this._totalPausedMs - o)) : 0;
        this._emit(E({ eventType: "taskFinished", reason: t, totalDurationMs: i, totals: { submissions: this._totalSubmissions, correct: this._totalCorrect, wrong: this._totalWrong }, endingLevel: this._currentDifficulty, unsubmittedSelection: n }, r));
      }
      _clearState() {
        this._clearTimer(), this._feedbackTimerId !== null && (clearTimeout(this._feedbackTimerId), this._feedbackTimerId = null), this._feedbackState.set(null), this._pendingRoundLoad = false, this._totalPausedMs = 0, this._pausedAt = 0, this._roundPausedMs = 0, this._finalDurationMs = -1, this._sequence = 0, this._taskStartedAt = -1, this._roundIndex = -1, this._roundStartedAt = 0, this._totalSubmissions = 0, this._totalCorrect = 0, this._totalWrong = 0, this._currentDifficulty = this._effectiveConfig.startDifficulty, this._pendingDifficulty = null, this._correctStreak = 0, this._wrongStreak = 0, this._correctInvoiceIds = [], this._selectedIds.set(/* @__PURE__ */ new Set()), this.targetAmount.set(0), this.invoices.set([]);
      }
      _clearTimer() {
        this._durationTimerId !== null && (clearInterval(this._durationTimerId), this._durationTimerId = null), this._remainingMs.set(0), this._roundRemainingMs.set(0);
      }
      _onDurationTick() {
        if (this._state() !== "running") return;
        let { taskDuration: t, roundDuration: n } = this._effectiveConfig;
        if (t && t > 0) {
          let o = this._taskStartedAt + t * 1e3 + this._totalPausedMs - performance.now();
          if (this._remainingMs.set(Math.max(0, o)), o <= 0) {
            this._endTaskNaturally("duration_elapsed");
            return;
          }
        }
        if (this._feedbackTimerId === null && n && n > 0 && this._roundIndex >= 0) {
          let o = this._roundStartedAt + n * 1e3 + this._roundPausedMs - performance.now();
          this._roundRemainingMs.set(Math.max(0, o)), o <= 0 && this._submitRound(true);
        }
      }
      _endTaskNaturally(t) {
        this._feedbackTimerId !== null && (clearTimeout(this._feedbackTimerId), this._feedbackTimerId = null), this._feedbackState.set(null), this._clearTimer();
        let n = this._selectedIds(), r = this.invoices().filter((a) => n.has(a.id)).map((a) => a.id), o = this._taskStartedAt >= 0 ? Math.max(0, Math.round(performance.now() - this._taskStartedAt - this._totalPausedMs)) : 0, i = { reason: t, totalDurationMs: o, totals: { submissions: this._totalSubmissions, correct: this._totalCorrect, wrong: this._totalWrong }, endingLevel: this._currentDifficulty, unsubmittedSelection: r }, s = { currentDifficulty: this._currentDifficulty, roundIndex: this._roundIndex >= 0 ? this._roundIndex : null };
        this._finalDurationMs = o, this._state.set("completed"), this._emit(E(E({ eventType: "taskFinished" }, s), i)), this._emit(E(E({ eventType: "taskCompleted" }, s), i));
      }
      _loadNewRound() {
        if (this._roundPausedMs = 0, this._selectedIds.set(/* @__PURE__ */ new Set()), this._pendingDifficulty !== null) {
          let i = this._pendingDifficulty;
          if (this._pendingDifficulty = null, i !== this._currentDifficulty) {
            let s = this._currentDifficulty;
            this._currentDifficulty = i, this._emit({ eventType: "difficultyChanged", fromLevel: s, toLevel: i, reason: "host_set" });
          }
        }
        let t, n;
        try {
          let i = this._generator(this._currentDifficulty, this._effectiveConfig.numberOfOptions, this._rng);
          t = i.round, n = i.hadRetries;
        } catch (i) {
          let s = i instanceof Error ? i.message : "Unexpected internal error during round generation", a = { currentDifficulty: this._currentDifficulty, roundIndex: this._roundIndex >= 0 ? this._roundIndex : null };
          this._finalDurationMs = this._taskStartedAt >= 0 ? Math.max(0, Math.round(performance.now() - this._taskStartedAt - this._totalPausedMs)) : 0, this._clearTimer(), this._state.set("error"), this._emitTaskFinished("error", [], a), this._emit(E({ eventType: "error", code: "internal_error", severity: "error", option: null, message: s }, a));
          return;
        }
        this._roundIndex++, n && this._emitError("internal_error", "warning", null, "Round generation required retries; a valid round was eventually found."), this._roundStartedAt = performance.now();
        let { roundDuration: r } = this._effectiveConfig;
        r && r > 0 && this._roundRemainingMs.set(r * 1e3), this.targetAmount.set(t.targetAmount), this.invoices.set(t.visibleInvoices), this._correctInvoiceIds = t.correctInvoiceIds;
        let o = this._taskStartedAt >= 0 ? Math.max(0, Math.round(this._roundStartedAt - this._taskStartedAt)) : 0;
        this._emit({ eventType: "roundStarted", relativeTimeMs: o, targetAmount: t.targetAmount, visibleInvoices: t.visibleInvoices.map((i) => E({}, i)), correctInvoiceIds: [...t.correctInvoiceIds] });
      }
      start() {
        if (this._state() !== "idle") {
          this._emitError("invalid_state_transition", "warning", null, "start() called outside of idle state");
          return;
        }
        let t = E(E({}, this._readAttributes()), this._inputConfig), { config: n, problems: r } = pd(t);
        this._config.set(n), this._rng = yd(n.invoiceOrder, n.randomSeed), this._sequence = 0, this._roundIndex = -1, this._currentDifficulty = n.startDifficulty, this._pendingDifficulty = null, this._correctStreak = 0, this._wrongStreak = 0, this._totalSubmissions = 0, this._totalCorrect = 0, this._totalWrong = 0, this._totalPausedMs = 0, this._finalDurationMs = -1, this._taskStartedAt = performance.now(), this._state.set("running");
        let { taskDuration: o, roundDuration: i } = this._effectiveConfig;
        (o && o > 0 || i && i > 0) && (o && o > 0 && this._remainingMs.set(o * 1e3), this._durationTimerId = setInterval(() => this._onDurationTick(), 250));
        let s = Date.now();
        this.elementRef.nativeElement.dispatchEvent(new CustomEvent("invoiceTaskEvent", { detail: { eventType: "taskStarted", sequence: ++this._sequence, timestamp: new Date(s).toISOString(), unixMs: s, relativeTimeMs: 0, sessionId: this._effectiveConfig.sessionId, roundIndex: null, currentDifficulty: this._currentDifficulty, effectiveConfig: this._cloneConfig(this._effectiveConfig) }, bubbles: false, composed: false }));
        for (let a of r) this._emitConfigProblem(a);
        this._loadNewRound();
      }
      pause() {
        if (this._state() !== "running") {
          this._emitError("invalid_state_transition", "warning", null, "pause() called outside of running state");
          return;
        }
        this._feedbackTimerId !== null && (clearTimeout(this._feedbackTimerId), this._feedbackTimerId = null, this._feedbackState.set(null), this._pendingRoundLoad = true), this._pausedAt = performance.now(), this._state.set("paused");
        let t = this._selectedIds(), n = this.invoices().filter((o) => t.has(o.id)).map((o) => o.id), { logLevel: r } = this._effectiveConfig;
        (r === "detailed" || r === "debug") && this._emit({ eventType: "taskPaused", currentSelection: n });
      }
      resume() {
        if (this._state() !== "paused") {
          this._emitError("invalid_state_transition", "warning", null, "resume() called outside of paused state");
          return;
        }
        let t = Math.max(0, Math.round(performance.now() - this._pausedAt));
        this._totalPausedMs += t, this._roundPausedMs += t, this._pausedAt = 0, this._state.set("running");
        let { logLevel: n } = this._effectiveConfig;
        (n === "detailed" || n === "debug") && this._emit({ eventType: "taskResumed", pausedDurationMs: t }), this._pendingRoundLoad && (this._pendingRoundLoad = false, this._loadNewRound());
      }
      stop() {
        let t = this._state();
        if (t !== "running" && t !== "paused") {
          this._emitError("invalid_state_transition", "warning", null, "stop() called outside of running or paused state");
          return;
        }
        let n = { currentDifficulty: this._currentDifficulty, roundIndex: this._roundIndex >= 0 ? this._roundIndex : null }, r = this._selectedIds(), o = this.invoices().filter((i) => r.has(i.id)).map((i) => i.id);
        this._state.set("idle"), this._emitTaskFinished("stopped", o, n), this._clearState();
      }
      reset() {
        let t = this._state();
        if (t === "running" || t === "paused") {
          let n = { currentDifficulty: this._currentDifficulty, roundIndex: this._roundIndex >= 0 ? this._roundIndex : null }, r = this._selectedIds(), o = this.invoices().filter((i) => r.has(i.id)).map((i) => i.id);
          this._state.set("idle"), this._emitTaskFinished("reset", o, n);
        } else this._state.set("idle");
        this._clearState();
      }
      getSummary() {
        let t = this._state(), n = t === "paused" && this._pausedAt > 0 ? Math.max(0, performance.now() - this._pausedAt) : 0, r = this._finalDurationMs >= 0 ? this._finalDurationMs : this._taskStartedAt >= 0 ? Math.max(0, Math.round(performance.now() - this._taskStartedAt - this._totalPausedMs - n)) : 0;
        return { state: t, roundIndex: this._roundIndex >= 0 ? this._roundIndex : null, currentDifficulty: t === "running" || t === "paused" ? this._currentDifficulty : null, totals: { submissions: this._totalSubmissions, correct: this._totalCorrect, wrong: this._totalWrong }, effectiveConfig: this._cloneConfig(this._effectiveConfig), sessionId: this._effectiveConfig.sessionId, elapsedMs: r };
      }
      setDifficulty(t) {
        let n = this._state();
        if (n !== "running" && n !== "paused") {
          this._emitError("invalid_state_transition", "warning", null, "setDifficulty() called outside of running or paused state", { received: t, usedValue: null });
          return;
        }
        if (this._effectiveConfig.adaptiveDifficulty) {
          this._emitError("adaptive_difficulty_enabled", "warning", null, "setDifficulty() is ignored while adaptiveDifficulty is enabled; set adaptiveDifficulty:false to control difficulty externally", { received: t, usedValue: null });
          return;
        }
        let { minDifficulty: r, maxDifficulty: o } = this._effectiveConfig, { value: i, problem: s } = hd(t, r, o);
        s && this._emitConfigProblem(s), s?.code !== "invalid_type" && (this._pendingDifficulty = i);
      }
      static \u0275fac = function(n) {
        return new (n || e)();
      };
      static \u0275cmp = Au({ type: e, selectors: [["app-invoice-matching-task"]], decls: 4, vars: 1, consts: [[1, "imt-container"], [1, "imt-completed"], [1, "imt-ready"], ["role", "timer", "aria-live", "off", 1, "imt-timer"], ["role", "status", 1, "imt-timer", "imt-timer--no-limit"], ["role", "timer", "aria-live", "off", 1, "imt-timer", "imt-timer--round"], ["role", "status", 1, "imt-difficulty"], [1, "imt-target-panel"], [1, "imt-target-label"], [1, "imt-target-amount"], [1, "imt-invoices-panel"], ["role", "group", "aria-label", "Invoice options", 1, "imt-invoice-list"], [1, "imt-invoice-row", 3, "imt-invoice-row--selected"], [1, "imt-footer"], ["role", "status", "aria-live", "polite", 1, "imt-feedback", 3, "imt-feedback--correct", "imt-feedback--wrong"], ["type", "button", 1, "imt-post-button", 3, "click", "disabled"], [1, "imt-timer-label"], [1, "imt-timer-value"], [1, "imt-difficulty-label"], [1, "imt-difficulty-value"], [1, "imt-invoice-row"], [1, "imt-invoice-label"], ["type", "checkbox", 1, "imt-invoice-checkbox", 3, "change", "checked", "disabled"], [1, "imt-invoice-customer"], [1, "imt-invoice-amount"], ["role", "status", "aria-live", "polite", 1, "imt-feedback"], [1, "imt-completed-message"], [1, "imt-ready-label"]], template: function(n, r) {
        n & 1 && (F(0, "div", 0), Kt(1, jv, 17, 6)(2, Hv, 3, 1, "div", 1)(3, $v, 3, 0, "div", 2), V()), n & 2 && (W(), vt(r.hasActiveRound ? 1 : r.isCompleted ? 2 : 3));
      }, dependencies: [ad], styles: ["[_nghost-%COMP%]{display:block;font-family:var(--invoice-task-font-family, system-ui, sans-serif);background:var(--invoice-task-background, #ffffff);color:#222;border:1px solid var(--invoice-task-border-color, #e0e0e0);border-radius:6px;overflow:hidden;max-width:640px}.imt-container[_ngcontent-%COMP%]{display:flex;flex-direction:column}.imt-target-panel[_ngcontent-%COMP%]{padding:1.25rem 1.5rem;background:#f5f5f5;border-bottom:1px solid var(--invoice-task-border-color, #e0e0e0);display:flex;align-items:baseline;gap:1rem}.imt-target-label[_ngcontent-%COMP%]{font-size:.78rem;font-weight:600;text-transform:uppercase;letter-spacing:.07em;color:#888;white-space:nowrap}.imt-target-amount[_ngcontent-%COMP%]{font-size:2rem;font-weight:700;color:#111}.imt-invoices-panel[_ngcontent-%COMP%]{display:flex;flex-direction:column;padding:.75rem}.imt-invoice-list[_ngcontent-%COMP%]{flex:1;list-style:none;margin:0;padding:0;overflow-y:auto}.imt-invoice-row[_ngcontent-%COMP%]{border-bottom:1px solid var(--invoice-task-border-color, #e0e0e0)}.imt-invoice-row[_ngcontent-%COMP%]:last-child{border-bottom:none}.imt-invoice-row--selected[_ngcontent-%COMP%]{background:var(--invoice-task-highlight-color, #f0f0f0)}.imt-invoice-label[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem;padding:.5rem;cursor:pointer;-webkit-user-select:none;user-select:none}.imt-invoice-label[_ngcontent-%COMP%]:hover{background:var(--invoice-task-highlight-color, #f0f0f0)}.imt-invoice-checkbox[_ngcontent-%COMP%]{width:1.1rem;height:1.1rem;flex-shrink:0;cursor:pointer;accent-color:var(--invoice-task-primary-color, #111111)}.imt-invoice-checkbox[_ngcontent-%COMP%]:focus-visible, .imt-post-button[_ngcontent-%COMP%]:focus-visible{outline:2px solid var(--invoice-task-primary-color, #111111);outline-offset:2px}.imt-invoice-label[_ngcontent-%COMP%]:focus-within{background:var(--invoice-task-highlight-color, #f0f0f0)}.imt-invoice-customer[_ngcontent-%COMP%]{flex:1;font-size:.875rem;color:#666}.imt-invoice-amount[_ngcontent-%COMP%]{font-size:.9rem;font-weight:600;color:#222;min-width:4rem;text-align:right}.imt-footer[_ngcontent-%COMP%]{display:flex;justify-content:flex-end;padding-top:.75rem;border-top:1px solid var(--invoice-task-border-color, #e0e0e0);margin-top:.5rem}.imt-post-button[_ngcontent-%COMP%]{padding:.45rem 1.5rem;background:var(--invoice-task-primary-color, #111111);color:#fff;border:none;border-radius:4px;font-size:.9rem;font-weight:600;cursor:pointer}.imt-post-button[_ngcontent-%COMP%]:disabled{opacity:.4;cursor:not-allowed}.imt-post-button[_ngcontent-%COMP%]:not(:disabled):hover{filter:brightness(1.4)}.imt-post-button[_ngcontent-%COMP%]:not(:disabled):active{filter:brightness(.95)}.imt-feedback[_ngcontent-%COMP%]{flex:1;padding:.3rem .75rem;border-radius:4px;font-size:.85rem;font-weight:600;align-self:center}.imt-feedback--correct[_ngcontent-%COMP%]{background:#d4edda;color:#155724}.imt-feedback--wrong[_ngcontent-%COMP%]{background:#f8d7da;color:#721c24}.imt-timer[_ngcontent-%COMP%]{display:flex;justify-content:flex-end;align-items:center;gap:.5rem;padding:.35rem 1.5rem;background:var(--invoice-task-background, #ffffff);border-bottom:1px solid var(--invoice-task-border-color, #e0e0e0);font-size:.8rem}.imt-timer-label[_ngcontent-%COMP%]{color:#777}.imt-timer-value[_ngcontent-%COMP%]{font-weight:700;color:#222;min-width:3rem;text-align:right}.imt-timer--no-limit[_ngcontent-%COMP%]{justify-content:flex-start}.imt-timer--round[_ngcontent-%COMP%]{background:var(--invoice-task-highlight-color, #f5f5f5);color:#444}.imt-difficulty[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.4rem;padding:.3rem 1.5rem;background:var(--invoice-task-background, #ffffff);border-bottom:1px solid var(--invoice-task-border-color, #e0e0e0);font-size:.8rem}.imt-difficulty-label[_ngcontent-%COMP%]{text-transform:uppercase;letter-spacing:.05em;color:#777;font-size:.7rem}.imt-difficulty-value[_ngcontent-%COMP%]{font-weight:700;color:var(--invoice-task-primary-color, #111111)}.imt-completed[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;padding:2.5rem 1.5rem;text-align:center}.imt-completed-message[_ngcontent-%COMP%]{font-size:1rem;color:#333;line-height:1.5}.imt-ready[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;padding:2.5rem 1.5rem}.imt-ready-label[_ngcontent-%COMP%]{font-size:1rem;color:#999;letter-spacing:.04em}"] });
    };
  });
  var Bv = Sd((bd) => {
    ne();
    rd();
    id();
    Id();
    cn(null, null, function* () {
      let e = yield Ls({ providers: [Vu({ eventCoalescing: true })] }), t = od(Or, { injector: e.injector });
      customElements.define("invoice-matching-task", t);
    }).catch(console.error);
  });
  var stdin_default = Bv();
})();
