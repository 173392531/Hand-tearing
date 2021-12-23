!function(t, e) {
    t.__udeskIo = e()
}(this, function() {
    var t;
    return function e(t, n, o) {
        function r(s, a) {
            if (!n[s]) {
                if (!t[s]) {
                    var c = "function" == typeof require && require;
                    if (!a && c)
                        return c(s, !0);
                    if (i)
                        return i(s, !0);
                    throw new Error("Cannot find module '" + s + "'")
                }
                var p = n[s] = {
                    exports: {}
                };
                t[s][0].call(p.exports, function(e) {
                    var n = t[s][1][e];
                    return r(n ? n : e)
                }, p, p.exports, e, t, n, o)
            }
            return n[s].exports
        }
        for (var i = "function" == typeof require && require, s = 0; s < o.length; s++)
            r(o[s]);
        return r
    }({
        1: [function(t, e) {
            e.exports = t("./lib/")
        }
        , {
            "./lib/": 2
        }],
        2: [function(t, e, n) {
            function o(t, e) {
                "object" == typeof t && (e = t,
                t = void 0),
                e = e || {};
                var n, o = r(t), i = o.source, p = o.id;
                return e.forceNew || e["force new connection"] || !1 === e.multiplex ? (a("ignoring socket cache for %s", i),
                n = s(i, e)) : (c[p] || (a("new io instance for %s", i),
                c[p] = s(i, e)),
                n = c[p]),
                n.socket(o.path)
            }
            var r = t("./url")
              , i = t("socket.io-parser")
              , s = t("./manager")
              , a = t("debug")("socket.io-client");
            e.exports = n = o;
            var c = n.managers = {};
            n.protocol = i.protocol,
            n.connect = o,
            n.Manager = t("./manager"),
            n.Socket = t("./socket")
        }
        , {
            "./manager": 3,
            "./socket": 5,
            "./url": 6,
            debug: 10,
            "socket.io-parser": 44
        }],
        3: [function(t, e) {
            function n(t, e) {
                return this instanceof n ? (t && "object" == typeof t && (e = t,
                t = void 0),
                e = e || {},
                e.path = e.path || "/socket.io",
                this.nsps = {},
                this.subs = [],
                this.opts = e,
                this.reconnection(e.reconnection !== !1),
                this.reconnectionAttempts(e.reconnectionAttempts || 1 / 0),
                this.reconnectionDelay(e.reconnectionDelay || 1e3),
                this.reconnectionDelayMax(e.reconnectionDelayMax || 5e3),
                this.randomizationFactor(e.randomizationFactor || .5),
                this.backoff = new l({
                    min: this.reconnectionDelay(),
                    max: this.reconnectionDelayMax(),
                    jitter: this.randomizationFactor()
                }),
                this.timeout(null == e.timeout ? 2e4 : e.timeout),
                this.readyState = "closed",
                this.uri = t,
                this.connected = [],
                this.encoding = !1,
                this.packetBuffer = [],
                this.encoder = new s.Encoder,
                this.decoder = new s.Decoder,
                this.autoConnect = e.autoConnect !== !1,
                void (this.autoConnect && this.open())) : new n(t,e)
            }
            var o = (t("./url"),
            t("engine.io-client"))
              , r = t("./socket")
              , i = t("component-emitter")
              , s = t("socket.io-parser")
              , a = t("./on")
              , c = t("component-bind")
              , p = (t("object-component"),
            t("debug")("socket.io-client:manager"))
              , u = t("indexof")
              , l = t("backo2");
            e.exports = n,
            n.prototype.emitAll = function() {
                this.emit.apply(this, arguments);
                for (var t in this.nsps)
                    this.nsps[t].emit.apply(this.nsps[t], arguments)
            }
            ,
            n.prototype.updateSocketIds = function() {
                for (var t in this.nsps)
                    this.nsps[t].id = this.engine.id
            }
            ,
            i(n.prototype),
            n.prototype.reconnection = function(t) {
                return arguments.length ? (this._reconnection = !!t,
                this) : this._reconnection
            }
            ,
            n.prototype.reconnectionAttempts = function(t) {
                return arguments.length ? (this._reconnectionAttempts = t,
                this) : this._reconnectionAttempts
            }
            ,
            n.prototype.reconnectionDelay = function(t) {
                return arguments.length ? (this._reconnectionDelay = t,
                this.backoff && this.backoff.setMin(t),
                this) : this._reconnectionDelay
            }
            ,
            n.prototype.randomizationFactor = function(t) {
                return arguments.length ? (this._randomizationFactor = t,
                this.backoff && this.backoff.setJitter(t),
                this) : this._randomizationFactor
            }
            ,
            n.prototype.reconnectionDelayMax = function(t) {
                return arguments.length ? (this._reconnectionDelayMax = t,
                this.backoff && this.backoff.setMax(t),
                this) : this._reconnectionDelayMax
            }
            ,
            n.prototype.timeout = function(t) {
                return arguments.length ? (this._timeout = t,
                this) : this._timeout
            }
            ,
            n.prototype.maybeReconnectOnOpen = function() {
                !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect()
            }
            ,
            n.prototype.open = n.prototype.connect = function(t) {
                if (p("readyState %s", this.readyState),
                ~this.readyState.indexOf("open"))
                    return this;
                p("opening %s", this.uri),
                this.engine = o(this.uri, this.opts);
                var e = this.engine
                  , n = this;
                this.readyState = "opening",
                this.skipReconnect = !1;
                var r = a(e, "open", function() {
                    n.onopen(),
                    t && t()
                })
                  , i = a(e, "error", function(e) {
                    if (p("connect_error"),
                    n.cleanup(),
                    n.readyState = "closed",
                    n.emitAll("connect_error", e),
                    t) {
                        var o = new Error("Connection error");
                        o.data = e,
                        t(o)
                    } else
                        n.maybeReconnectOnOpen()
                });
                if (!1 !== this._timeout) {
                    var s = this._timeout;
                    p("connect attempt will timeout after %d", s);
                    var c = setTimeout(function() {
                        p("connect attempt timed out after %d", s),
                        r.destroy(),
                        e.close(),
                        e.emit("error", "timeout"),
                        n.emitAll("connect_timeout", s)
                    }, s);
                    this.subs.push({
                        destroy: function() {
                            clearTimeout(c)
                        }
                    })
                }
                return this.subs.push(r),
                this.subs.push(i),
                this
            }
            ,
            n.prototype.onopen = function() {
                p("open"),
                this.cleanup(),
                this.readyState = "open",
                this.emit("open");
                var t = this.engine;
                this.subs.push(a(t, "data", c(this, "ondata"))),
                this.subs.push(a(this.decoder, "decoded", c(this, "ondecoded"))),
                this.subs.push(a(t, "error", c(this, "onerror"))),
                this.subs.push(a(t, "close", c(this, "onclose")))
            }
            ,
            n.prototype.ondata = function(t) {
                this.decoder.add(t)
            }
            ,
            n.prototype.ondecoded = function(t) {
                this.emit("packet", t)
            }
            ,
            n.prototype.onerror = function(t) {
                p("error", t),
                this.emitAll("error", t)
            }
            ,
            n.prototype.socket = function(t) {
                var e = this.nsps[t];
                if (!e) {
                    e = new r(this,t),
                    this.nsps[t] = e;
                    var n = this;
                    e.on("connect", function() {
                        e.id = n.engine.id,
                        ~u(n.connected, e) || n.connected.push(e)
                    })
                }
                return e
            }
            ,
            n.prototype.destroy = function(t) {
                var e = u(this.connected, t);
                ~e && this.connected.splice(e, 1),
                this.connected.length || this.close()
            }
            ,
            n.prototype.packet = function(t) {
                p("writing packet %j", t);
                var e = this;
                e.encoding ? e.packetBuffer.push(t) : (e.encoding = !0,
                this.encoder.encode(t, function(t) {
                    for (var n = 0; n < t.length; n++)
                        e.engine.write(t[n]);
                    e.encoding = !1,
                    e.processPacketQueue()
                }))
            }
            ,
            n.prototype.processPacketQueue = function() {
                if (this.packetBuffer.length > 0 && !this.encoding) {
                    var t = this.packetBuffer.shift();
                    this.packet(t)
                }
            }
            ,
            n.prototype.cleanup = function() {
                for (var t; t = this.subs.shift(); )
                    t.destroy();
                this.packetBuffer = [],
                this.encoding = !1,
                this.decoder.destroy()
            }
            ,
            n.prototype.close = n.prototype.disconnect = function() {
                this.skipReconnect = !0,
                this.backoff.reset(),
                this.readyState = "closed",
                this.engine && this.engine.close()
            }
            ,
            n.prototype.onclose = function(t) {
                p("close"),
                this.cleanup(),
                this.backoff.reset(),
                this.readyState = "closed",
                this.emit("close", t),
                this._reconnection && !this.skipReconnect && this.reconnect()
            }
            ,
            n.prototype.reconnect = function() {
                if (this.reconnecting || this.skipReconnect)
                    return this;
                var t = this;
                if (this.backoff.attempts >= this._reconnectionAttempts)
                    p("reconnect failed"),
                    this.backoff.reset(),
                    this.emitAll("reconnect_failed"),
                    this.reconnecting = !1;
                else {
                    var e = this.backoff.duration();
                    p("will wait %dms before reconnect attempt", e),
                    this.reconnecting = !0;
                    var n = setTimeout(function() {
                        t.skipReconnect || (p("attempting reconnect"),
                        t.emitAll("reconnect_attempt", t.backoff.attempts),
                        t.emitAll("reconnecting", t.backoff.attempts),
                        t.skipReconnect || t.open(function(e) {
                            e ? (p("reconnect attempt error"),
                            t.reconnecting = !1,
                            t.reconnect(),
                            t.emitAll("reconnect_error", e.data)) : (p("reconnect success"),
                            t.onreconnect())
                        }))
                    }, e);
                    this.subs.push({
                        destroy: function() {
                            clearTimeout(n)
                        }
                    })
                }
            }
            ,
            n.prototype.onreconnect = function() {
                var t = this.backoff.attempts;
                this.reconnecting = !1,
                this.backoff.reset(),
                this.updateSocketIds(),
                this.emitAll("reconnect", t)
            }
        }
        , {
            "./on": 4,
            "./socket": 5,
            "./url": 6,
            backo2: 7,
            "component-bind": 8,
            "component-emitter": 9,
            debug: 10,
            "engine.io-client": 11,
            indexof: 40,
            "object-component": 41,
            "socket.io-parser": 44
        }],
        4: [function(t, e) {
            function n(t, e, n) {
                return t.on(e, n),
                {
                    destroy: function() {
                        t.removeListener(e, n)
                    }
                }
            }
            e.exports = n
        }
        , {}],
        5: [function(t, e, n) {
            function o(t, e) {
                this.io = t,
                this.nsp = e,
                this.json = this,
                this.ids = 0,
                this.acks = {},
                this.io.autoConnect && this.open(),
                this.receiveBuffer = [],
                this.sendBuffer = [],
                this.connected = !1,
                this.disconnected = !0
            }
            var r = t("socket.io-parser")
              , i = t("component-emitter")
              , s = t("to-array")
              , a = t("./on")
              , c = t("component-bind")
              , p = t("debug")("socket.io-client:socket")
              , u = t("has-binary");
            e.exports = n = o;
            var l = {
                connect: 1,
                connect_error: 1,
                connect_timeout: 1,
                disconnect: 1,
                error: 1,
                reconnect: 1,
                reconnect_attempt: 1,
                reconnect_failed: 1,
                reconnect_error: 1,
                reconnecting: 1
            }
              , f = i.prototype.emit;
            i(o.prototype),
            o.prototype.subEvents = function() {
                if (!this.subs) {
                    var t = this.io;
                    this.subs = [a(t, "open", c(this, "onopen")), a(t, "packet", c(this, "onpacket")), a(t, "close", c(this, "onclose"))]
                }
            }
            ,
            o.prototype.open = o.prototype.connect = function() {
                return this.connected ? this : (this.subEvents(),
                this.io.open(),
                "open" == this.io.readyState && this.onopen(),
                this)
            }
            ,
            o.prototype.send = function() {
                var t = s(arguments);
                return t.unshift("message"),
                this.emit.apply(this, t),
                this
            }
            ,
            o.prototype.emit = function(t) {
                if (l.hasOwnProperty(t))
                    return f.apply(this, arguments),
                    this;
                var e = s(arguments)
                  , n = r.EVENT;
                u(e) && (n = r.BINARY_EVENT);
                var o = {
                    type: n,
                    data: e
                };
                return "function" == typeof e[e.length - 1] && (p("emitting packet with ack id %d", this.ids),
                this.acks[this.ids] = e.pop(),
                o.id = this.ids++),
                this.connected ? this.packet(o) : this.sendBuffer.push(o),
                this
            }
            ,
            o.prototype.packet = function(t) {
                t.nsp = this.nsp,
                this.io.packet(t)
            }
            ,
            o.prototype.onopen = function() {
                p("transport is open - connecting"),
                "/" != this.nsp && this.packet({
                    type: r.CONNECT
                })
            }
            ,
            o.prototype.onclose = function(t) {
                p("close (%s)", t),
                this.connected = !1,
                this.disconnected = !0,
                delete this.id,
                this.emit("disconnect", t)
            }
            ,
            o.prototype.onpacket = function(t) {
                if (t.nsp == this.nsp)
                    switch (t.type) {
                    case r.CONNECT:
                        this.onconnect();
                        break;
                    case r.EVENT:
                        this.onevent(t);
                        break;
                    case r.BINARY_EVENT:
                        this.onevent(t);
                        break;
                    case r.ACK:
                        this.onack(t);
                        break;
                    case r.BINARY_ACK:
                        this.onack(t);
                        break;
                    case r.DISCONNECT:
                        this.ondisconnect();
                        break;
                    case r.ERROR:
                        this.emit("error", t.data)
                    }
            }
            ,
            o.prototype.onevent = function(t) {
                var e = t.data || [];
                p("emitting event %j", e),
                null != t.id && (p("attaching ack callback to event"),
                e.push(this.ack(t.id))),
                this.connected ? f.apply(this, e) : this.receiveBuffer.push(e)
            }
            ,
            o.prototype.ack = function(t) {
                var e = this
                  , n = !1;
                return function() {
                    if (!n) {
                        n = !0;
                        var o = s(arguments);
                        p("sending ack %j", o);
                        var i = u(o) ? r.BINARY_ACK : r.ACK;
                        e.packet({
                            type: i,
                            id: t,
                            data: o
                        })
                    }
                }
            }
            ,
            o.prototype.onack = function(t) {
                p("calling ack %s with %j", t.id, t.data);
                var e = this.acks[t.id];
                e.apply(this, t.data),
                delete this.acks[t.id]
            }
            ,
            o.prototype.onconnect = function() {
                this.connected = !0,
                this.disconnected = !1,
                this.emit("connect"),
                this.emitBuffered()
            }
            ,
            o.prototype.emitBuffered = function() {
                var t;
                for (t = 0; t < this.receiveBuffer.length; t++)
                    f.apply(this, this.receiveBuffer[t]);
                for (this.receiveBuffer = [],
                t = 0; t < this.sendBuffer.length; t++)
                    this.packet(this.sendBuffer[t]);
                this.sendBuffer = []
            }
            ,
            o.prototype.ondisconnect = function() {
                p("server disconnect (%s)", this.nsp),
                this.destroy(),
                this.onclose("io server disconnect")
            }
            ,
            o.prototype.destroy = function() {
                if (this.subs) {
                    for (var t = 0; t < this.subs.length; t++)
                        this.subs[t].destroy();
                    this.subs = null
                }
                this.io.destroy(this)
            }
            ,
            o.prototype.close = o.prototype.disconnect = function() {
                return this.connected && (p("performing disconnect (%s)", this.nsp),
                this.packet({
                    type: r.DISCONNECT
                })),
                this.destroy(),
                this.connected && this.onclose("io client disconnect"),
                this
            }
        }
        , {
            "./on": 4,
            "component-bind": 8,
            "component-emitter": 9,
            debug: 10,
            "has-binary": 36,
            "socket.io-parser": 44,
            "to-array": 48
        }],
        6: [function(t, e) {
            (function(n) {
                function o(t, e) {
                    var o = t
                      , e = e || n.location;
                    return null == t && (t = e.protocol + "//" + e.host),
                    "string" == typeof t && ("/" == t.charAt(0) && (t = "/" == t.charAt(1) ? e.protocol + t : e.hostname + t),
                    /^(https?|wss?):\/\//.test(t) || (i("protocol-less url %s", t),
                    t = "undefined" != typeof e ? e.protocol + "//" + t : "https://" + t),
                    i("parse %s", t),
                    o = r(t)),
                    o.port || (/^(http|ws)$/.test(o.protocol) ? o.port = "80" : /^(http|ws)s$/.test(o.protocol) && (o.port = "443")),
                    o.path = o.path || "/",
                    o.id = o.protocol + "://" + o.host + ":" + o.port,
                    o.href = o.protocol + "://" + o.host + (e && e.port == o.port ? "" : ":" + o.port),
                    o
                }
                var r = t("parseuri")
                  , i = t("debug")("socket.io-client:url");
                e.exports = o
            }
            ).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }
        , {
            debug: 10,
            parseuri: 42
        }],
        7: [function(t, e) {
            function n(t) {
                t = t || {},
                this.ms = t.min || 100,
                this.max = t.max || 1e4,
                this.factor = t.factor || 2,
                this.jitter = t.jitter > 0 && t.jitter <= 1 ? t.jitter : 0,
                this.attempts = 0
            }
            e.exports = n,
            n.prototype.duration = function() {
                var t = this.ms * Math.pow(this.factor, this.attempts++);
                if (this.jitter) {
                    var e = Math.random()
                      , n = Math.floor(e * this.jitter * t);
                    t = 0 == (1 & Math.floor(10 * e)) ? t - n : t + n
                }
                return 0 | Math.min(t, this.max)
            }
            ,
            n.prototype.reset = function() {
                this.attempts = 0
            }
            ,
            n.prototype.setMin = function(t) {
                this.ms = t
            }
            ,
            n.prototype.setMax = function(t) {
                this.max = t
            }
            ,
            n.prototype.setJitter = function(t) {
                this.jitter = t
            }
        }
        , {}],
        8: [function(t, e) {
            var n = [].slice;
            e.exports = function(t, e) {
                if ("string" == typeof e && (e = t[e]),
                "function" != typeof e)
                    throw new Error("bind() requires a function");
                var o = n.call(arguments, 2);
                return function() {
                    return e.apply(t, o.concat(n.call(arguments)))
                }
            }
        }
        , {}],
        9: [function(t, e) {
            function n(t) {
                return t ? o(t) : void 0
            }
            function o(t) {
                for (var e in n.prototype)
                    t[e] = n.prototype[e];
                return t
            }
            e.exports = n,
            n.prototype.on = n.prototype.addEventListener = function(t, e) {
                return this._callbacks = this._callbacks || {},
                (this._callbacks[t] = this._callbacks[t] || []).push(e),
                this
            }
            ,
            n.prototype.once = function(t, e) {
                function n() {
                    o.off(t, n),
                    e.apply(this, arguments)
                }
                var o = this;
                return this._callbacks = this._callbacks || {},
                n.fn = e,
                this.on(t, n),
                this
            }
            ,
            n.prototype.off = n.prototype.removeListener = n.prototype.removeAllListeners = n.prototype.removeEventListener = function(t, e) {
                if (this._callbacks = this._callbacks || {},
                0 == arguments.length)
                    return this._callbacks = {},
                    this;
                var n = this._callbacks[t];
                if (!n)
                    return this;
                if (1 == arguments.length)
                    return delete this._callbacks[t],
                    this;
                for (var o, r = 0; r < n.length; r++)
                    if (o = n[r],
                    o === e || o.fn === e) {
                        n.splice(r, 1);
                        break
                    }
                return this
            }
            ,
            n.prototype.emit = function(t) {
                this._callbacks = this._callbacks || {};
                var e = [].slice.call(arguments, 1)
                  , n = this._callbacks[t];
                if (n) {
                    n = n.slice(0);
                    for (var o = 0, r = n.length; r > o; ++o)
                        n[o].apply(this, e)
                }
                return this
            }
            ,
            n.prototype.listeners = function(t) {
                return this._callbacks = this._callbacks || {},
                this._callbacks[t] || []
            }
            ,
            n.prototype.hasListeners = function(t) {
                return !!this.listeners(t).length
            }
        }
        , {}],
        10: [function(t, e) {
            function n(t) {
                return n.enabled(t) ? function(e) {
                    e = o(e);
                    var r = new Date
                      , i = r - (n[t] || r);
                    n[t] = r,
                    e = t + " " + e + " +" + n.humanize(i),
                    window.console && console.log && Function.prototype.apply.call(console.log, console, arguments)
                }
                : function() {}
            }
            function o(t) {
                return t instanceof Error ? t.stack || t.message : t
            }
            e.exports = n,
            n.names = [],
            n.skips = [],
            n.enable = function(t) {
                try {
                    localStorage.debug = t
                } catch (e) {}
                for (var o = (t || "").split(/[\s,]+/), r = o.length, i = 0; r > i; i++)
                    t = o[i].replace("*", ".*?"),
                    "-" === t[0] ? n.skips.push(new RegExp("^" + t.substr(1) + "$")) : n.names.push(new RegExp("^" + t + "$"))
            }
            ,
            n.disable = function() {
                n.enable("")
            }
            ,
            n.humanize = function(t) {
                var e = 1e3
                  , n = 6e4
                  , o = 60 * n;
                return t >= o ? (t / o).toFixed(1) + "h" : t >= n ? (t / n).toFixed(1) + "m" : t >= e ? (t / e | 0) + "s" : t + "ms"
            }
            ,
            n.enabled = function(t) {
                for (var e = 0, o = n.skips.length; o > e; e++)
                    if (n.skips[e].test(t))
                        return !1;
                for (var e = 0, o = n.names.length; o > e; e++)
                    if (n.names[e].test(t))
                        return !0;
                return !1
            }
            ;
            try {
                window.localStorage && n.enable(localStorage.debug)
            } catch (r) {}
        }
        , {}],
        11: [function(t, e) {
            e.exports = t("./lib/")
        }
        , {
            "./lib/": 12
        }],
        12: [function(t, e) {
            e.exports = t("./socket"),
            e.exports.parser = t("engine.io-parser")
        }
        , {
            "./socket": 13,
            "engine.io-parser": 25
        }],
        13: [function(t, e) {
            (function(n) {
                function o(t, e) {
                    if (!(this instanceof o))
                        return new o(t,e);
                    if (e = e || {},
                    t && "object" == typeof t && (e = t,
                    t = null),
                    t && (t = u(t),
                    e.host = t.host,
                    e.secure = "https" == t.protocol || "wss" == t.protocol,
                    e.port = t.port,
                    t.query && (e.query = t.query)),
                    this.secure = null != e.secure ? e.secure : n.location && "https:" == location.protocol,
                    e.host) {
                        var r = e.host.split(":");
                        e.hostname = r.shift(),
                        r.length ? e.port = r.pop() : e.port || (e.port = this.secure ? "443" : "80")
                    }
                    this.agent = e.agent || !1,
                    this.hostname = e.hostname || (n.location ? location.hostname : "localhost"),
                    this.port = e.port || (n.location && location.port ? location.port : this.secure ? 443 : 80),
                    this.query = e.query || {},
                    "string" == typeof this.query && (this.query = f.decode(this.query)),
                    this.upgrade = !1 !== e.upgrade,
                    this.path = (e.path || "/engine.io").replace(/\/$/, "") + "/",
                    this.forceJSONP = !!e.forceJSONP,
                    this.jsonp = !1 !== e.jsonp,
                    this.forceBase64 = !!e.forceBase64,
                    this.enablesXDR = !!e.enablesXDR,
                    this.timestampParam = e.timestampParam || "t",
                    this.timestampRequests = e.timestampRequests,
                    this.transports = e.transports || ["polling", "websocket"],
                    this.readyState = "",
                    this.writeBuffer = [],
                    this.callbackBuffer = [],
                    this.policyPort = e.policyPort || 843,
                    this.rememberUpgrade = e.rememberUpgrade || !1,
                    this.binaryType = null,
                    this.onlyBinaryUpgrades = e.onlyBinaryUpgrades,
                    this.pfx = e.pfx || null,
                    this.key = e.key || null,
                    this.passphrase = e.passphrase || null,
                    this.cert = e.cert || null,
                    this.ca = e.ca || null,
                    this.ciphers = e.ciphers || null,
                    this.rejectUnauthorized = e.rejectUnauthorized || null,
                    this.open()
                }
                function r(t) {
                    var e = {};
                    for (var n in t)
                        t.hasOwnProperty(n) && (e[n] = t[n]);
                    return e
                }
                var i = t("./transports")
                  , s = t("component-emitter")
                  , a = t("debug")("engine.io-client:socket")
                  , c = t("indexof")
                  , p = t("engine.io-parser")
                  , u = t("parseuri")
                  , l = t("parsejson")
                  , f = t("parseqs");
                e.exports = o,
                o.priorWebsocketSuccess = !1,
                s(o.prototype),
                o.protocol = p.protocol,
                o.Socket = o,
                o.Transport = t("./transport"),
                o.transports = t("./transports"),
                o.parser = t("engine.io-parser"),
                o.prototype.createTransport = function(t) {
                    a('creating transport "%s"', t);
                    var e = r(this.query);
                    e.EIO = p.protocol,
                    e.transport = t,
                    this.id && (e.sid = this.id);
                    var n = new i[t]({
                        agent: this.agent,
                        hostname: this.hostname,
                        port: this.port,
                        secure: this.secure,
                        path: this.path,
                        query: e,
                        forceJSONP: this.forceJSONP,
                        jsonp: this.jsonp,
                        forceBase64: this.forceBase64,
                        enablesXDR: this.enablesXDR,
                        timestampRequests: this.timestampRequests,
                        timestampParam: this.timestampParam,
                        policyPort: this.policyPort,
                        socket: this,
                        pfx: this.pfx,
                        key: this.key,
                        passphrase: this.passphrase,
                        cert: this.cert,
                        ca: this.ca,
                        ciphers: this.ciphers,
                        rejectUnauthorized: this.rejectUnauthorized
                    });
                    return n
                }
                ,
                o.prototype.open = function() {
                    var t;
                    if (this.rememberUpgrade && o.priorWebsocketSuccess && -1 != this.transports.indexOf("websocket"))
                        t = "websocket";
                    else {
                        if (0 == this.transports.length) {
                            var e = this;
                            return void setTimeout(function() {
                                e.emit("error", "No transports available")
                            }, 0)
                        }
                        t = this.transports[0]
                    }
                    this.readyState = "opening";
                    var t;
                    try {
                        t = this.createTransport(t)
                    } catch (n) {
                        return this.transports.shift(),
                        void this.open()
                    }
                    t.open(),
                    this.setTransport(t)
                }
                ,
                o.prototype.setTransport = function(t) {
                    a("setting transport %s", t.name);
                    var e = this;
                    this.transport && (a("clearing existing transport %s", this.transport.name),
                    this.transport.removeAllListeners()),
                    this.transport = t,
                    t.on("drain", function() {
                        e.onDrain()
                    }).on("packet", function(t) {
                        e.onPacket(t)
                    }).on("error", function(t) {
                        e.onError(t)
                    }).on("close", function() {
                        e.onClose("transport close")
                    })
                }
                ,
                o.prototype.probe = function(t) {
                    function e() {
                        if (f.onlyBinaryUpgrades) {
                            var e = !this.supportsBinary && f.transport.supportsBinary;
                            l = l || e
                        }
                        l || (a('probe transport "%s" opened', t),
                        u.send([{
                            type: "ping",
                            data: "probe"
                        }]),
                        u.once("packet", function(e) {
                            if (!l)
                                if ("pong" == e.type && "probe" == e.data) {
                                    if (a('probe transport "%s" pong', t),
                                    f.upgrading = !0,
                                    f.emit("upgrading", u),
                                    !u)
                                        return;
                                    o.priorWebsocketSuccess = "websocket" == u.name,
                                    a('pausing current transport "%s"', f.transport.name),
                                    f.transport.pause(function() {
                                        l || "closed" != f.readyState && (a("changing transport and sending upgrade packet"),
                                        p(),
                                        f.setTransport(u),
                                        u.send([{
                                            type: "upgrade"
                                        }]),
                                        f.emit("upgrade", u),
                                        u = null,
                                        f.upgrading = !1,
                                        f.flush())
                                    })
                                } else {
                                    a('probe transport "%s" failed', t);
                                    var n = new Error("probe error");
                                    n.transport = u.name,
                                    f.emit("upgradeError", n)
                                }
                        }))
                    }
                    function n() {
                        l || (l = !0,
                        p(),
                        u.close(),
                        u = null)
                    }
                    function r(e) {
                        var o = new Error("probe error: " + e);
                        o.transport = u.name,
                        n(),
                        a('probe transport "%s" failed because of error: %s', t, e),
                        f.emit("upgradeError", o)
                    }
                    function i() {
                        r("transport closed")
                    }
                    function s() {
                        r("socket closed")
                    }
                    function c(t) {
                        u && t.name != u.name && (a('"%s" works - aborting "%s"', t.name, u.name),
                        n())
                    }
                    function p() {
                        u.removeListener("open", e),
                        u.removeListener("error", r),
                        u.removeListener("close", i),
                        f.removeListener("close", s),
                        f.removeListener("upgrading", c)
                    }
                    a('probing transport "%s"', t);
                    var u = this.createTransport(t, {
                        probe: 1
                    })
                      , l = !1
                      , f = this;
                    o.priorWebsocketSuccess = !1,
                    u.once("open", e),
                    u.once("error", r),
                    u.once("close", i),
                    this.once("close", s),
                    this.once("upgrading", c),
                    u.open()
                }
                ,
                o.prototype.onOpen = function() {
                    if (a("socket open"),
                    this.readyState = "open",
                    o.priorWebsocketSuccess = "websocket" == this.transport.name,
                    this.emit("open"),
                    this.flush(),
                    "open" == this.readyState && this.upgrade && this.transport.pause) {
                        a("starting upgrade probes");
                        for (var t = 0, e = this.upgrades.length; e > t; t++)
                            this.probe(this.upgrades[t])
                    }
                }
                ,
                o.prototype.onPacket = function(t) {
                    if ("opening" == this.readyState || "open" == this.readyState)
                        switch (a('socket receive: type "%s", data "%s"', t.type, t.data),
                        this.emit("packet", t),
                        this.emit("heartbeat"),
                        t.type) {
                        case "open":
                            this.onHandshake(l(t.data));
                            break;
                        case "pong":
                            this.setPing();
                            break;
                        case "error":
                            var e = new Error("server error");
                            e.code = t.data,
                            this.emit("error", e);
                            break;
                        case "message":
                            this.emit("data", t.data),
                            this.emit("message", t.data)
                        }
                    else
                        a('packet received with socket readyState "%s"', this.readyState)
                }
                ,
                o.prototype.onHandshake = function(t) {
                    this.emit("handshake", t),
                    this.id = t.sid,
                    this.transport.query.sid = t.sid,
                    this.upgrades = this.filterUpgrades(t.upgrades),
                    this.pingInterval = t.pingInterval,
                    this.pingTimeout = t.pingTimeout,
                    this.onOpen(),
                    "closed" != this.readyState && (this.setPing(),
                    this.removeListener("heartbeat", this.onHeartbeat),
                    this.on("heartbeat", this.onHeartbeat))
                }
                ,
                o.prototype.onHeartbeat = function(t) {
                    clearTimeout(this.pingTimeoutTimer);
                    var e = this;
                    e.pingTimeoutTimer = setTimeout(function() {
                        "closed" != e.readyState && e.onClose("ping timeout")
                    }, t || e.pingInterval + e.pingTimeout)
                }
                ,
                o.prototype.setPing = function() {
                    var t = this;
                    clearTimeout(t.pingIntervalTimer),
                    t.pingIntervalTimer = setTimeout(function() {
                        a("writing ping packet - expecting pong within %sms", t.pingTimeout),
                        t.ping(),
                        t.onHeartbeat(t.pingTimeout)
                    }, t.pingInterval)
                }
                ,
                o.prototype.ping = function() {
                    this.sendPacket("ping")
                }
                ,
                o.prototype.onDrain = function() {
                    for (var t = 0; t < this.prevBufferLen; t++)
                        this.callbackBuffer[t] && this.callbackBuffer[t]();
                    this.writeBuffer.splice(0, this.prevBufferLen),
                    this.callbackBuffer.splice(0, this.prevBufferLen),
                    this.prevBufferLen = 0,
                    0 == this.writeBuffer.length ? this.emit("drain") : this.flush()
                }
                ,
                o.prototype.flush = function() {
                    "closed" != this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (a("flushing %d packets in socket", this.writeBuffer.length),
                    this.transport.send(this.writeBuffer),
                    this.prevBufferLen = this.writeBuffer.length,
                    this.emit("flush"))
                }
                ,
                o.prototype.write = o.prototype.send = function(t, e) {
                    return this.sendPacket("message", t, e),
                    this
                }
                ,
                o.prototype.sendPacket = function(t, e, n) {
                    if ("closing" != this.readyState && "closed" != this.readyState) {
                        var o = {
                            type: t,
                            data: e
                        };
                        this.emit("packetCreate", o),
                        this.writeBuffer.push(o),
                        this.callbackBuffer.push(n),
                        this.flush()
                    }
                }
                ,
                o.prototype.close = function() {
                    function t() {
                        o.onClose("forced close"),
                        a("socket closing - telling transport to close"),
                        o.transport.close()
                    }
                    function e() {
                        o.removeListener("upgrade", e),
                        o.removeListener("upgradeError", e),
                        t()
                    }
                    function n() {
                        o.once("upgrade", e),
                        o.once("upgradeError", e)
                    }
                    if ("opening" == this.readyState || "open" == this.readyState) {
                        this.readyState = "closing";
                        var o = this;
                        this.writeBuffer.length ? this.once("drain", function() {
                            this.upgrading ? n() : t()
                        }) : this.upgrading ? n() : t()
                    }
                    return this
                }
                ,
                o.prototype.onError = function(t) {
                    a("socket error %j", t),
                    o.priorWebsocketSuccess = !1,
                    this.emit("error", t),
                    this.onClose("transport error", t)
                }
                ,
                o.prototype.onClose = function(t, e) {
                    if ("opening" == this.readyState || "open" == this.readyState || "closing" == this.readyState) {
                        a('socket close with reason: "%s"', t);
                        var n = this;
                        clearTimeout(this.pingIntervalTimer),
                        clearTimeout(this.pingTimeoutTimer),
                        setTimeout(function() {
                            n.writeBuffer = [],
                            n.callbackBuffer = [],
                            n.prevBufferLen = 0
                        }, 0),
                        this.transport.removeAllListeners("close"),
                        this.transport.close(),
                        this.transport.removeAllListeners(),
                        this.readyState = "closed",
                        this.id = null,
                        this.emit("close", t, e)
                    }
                }
                ,
                o.prototype.filterUpgrades = function(t) {
                    for (var e = [], n = 0, o = t.length; o > n; n++)
                        ~c(this.transports, t[n]) && e.push(t[n]);
                    return e
                }
            }
            ).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }
        , {
            "./transport": 14,
            "./transports": 15,
            "component-emitter": 9,
            debug: 22,
            "engine.io-parser": 25,
            indexof: 40,
            parsejson: 32,
            parseqs: 33,
            parseuri: 34
        }],
        14: [function(t, e) {
            function n(t) {
                this.path = t.path,
                this.hostname = t.hostname,
                this.port = t.port,
                this.secure = t.secure,
                this.query = t.query,
                this.timestampParam = t.timestampParam,
                this.timestampRequests = t.timestampRequests,
                this.readyState = "",
                this.agent = t.agent || !1,
                this.socket = t.socket,
                this.enablesXDR = t.enablesXDR,
                this.pfx = t.pfx,
                this.key = t.key,
                this.passphrase = t.passphrase,
                this.cert = t.cert,
                this.ca = t.ca,
                this.ciphers = t.ciphers,
                this.rejectUnauthorized = t.rejectUnauthorized
            }
            var o = t("engine.io-parser")
              , r = t("component-emitter");
            e.exports = n,
            r(n.prototype),
            n.timestamps = 0,
            n.prototype.onError = function(t, e) {
                var n = new Error(t);
                return n.type = "TransportError",
                n.description = e,
                this.emit("error", n),
                this
            }
            ,
            n.prototype.open = function() {
                return ("closed" == this.readyState || "" == this.readyState) && (this.readyState = "opening",
                this.doOpen()),
                this
            }
            ,
            n.prototype.close = function() {
                return ("opening" == this.readyState || "open" == this.readyState) && (this.doClose(),
                this.onClose()),
                this
            }
            ,
            n.prototype.send = function(t) {
                if ("open" != this.readyState)
                    throw new Error("Transport not open");
                this.write(t)
            }
            ,
            n.prototype.onOpen = function() {
                this.readyState = "open",
                this.writable = !0,
                this.emit("open")
            }
            ,
            n.prototype.onData = function(t) {
                var e = o.decodePacket(t, this.socket.binaryType);
                this.onPacket(e)
            }
            ,
            n.prototype.onPacket = function(t) {
                this.emit("packet", t)
            }
            ,
            n.prototype.onClose = function() {
                this.readyState = "closed",
                this.emit("close")
            }
        }
        , {
            "component-emitter": 9,
            "engine.io-parser": 25
        }],
        15: [function(t, e, n) {
            (function(e) {
                function o(t) {
                    var n, o = !1, a = !1, c = !1 !== t.jsonp;
                    if (e.location) {
                        var p = "https:" == location.protocol
                          , u = location.port;
                        u || (u = p ? 443 : 80),
                        o = t.hostname != location.hostname || u != t.port,
                        a = t.secure != p
                    }
                    if (t.xdomain = o,
                    t.xscheme = a,
                    n = new r(t),
                    "open"in n && !t.forceJSONP)
                        return new i(t);
                    if (!c)
                        throw new Error("JSONP disabled");
                    return new s(t)
                }
                var r = t("xmlhttprequest")
                  , i = t("./polling-xhr")
                  , s = t("./polling-jsonp")
                  , a = t("./websocket");
                n.polling = o,
                n.websocket = a
            }
            ).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }
        , {
            "./polling-jsonp": 16,
            "./polling-xhr": 17,
            "./websocket": 19,
            xmlhttprequest: 20
        }],
        16: [function(t, e) {
            (function(n) {
                function o() {}
                function r(t) {
                    i.call(this, t),
                    this.query = this.query || {},
                    a || (n.___eio || (n.___eio = []),
                    a = n.___eio),
                    this.index = a.length;
                    var e = this;
                    a.push(function(t) {
                        e.onData(t)
                    }),
                    this.query.j = this.index,
                    n.document && n.addEventListener && n.addEventListener("beforeunload", function() {
                        e.script && (e.script.onerror = o)
                    }, !1)
                }
                var i = t("./polling")
                  , s = t("component-inherit");
                e.exports = r;
                var a, c = /\n/g, p = /\\n/g;
                s(r, i),
                r.prototype.supportsBinary = !1,
                r.prototype.doClose = function() {
                    this.script && (this.script.parentNode.removeChild(this.script),
                    this.script = null),
                    this.form && (this.form.parentNode.removeChild(this.form),
                    this.form = null,
                    this.iframe = null),
                    i.prototype.doClose.call(this)
                }
                ,
                r.prototype.doPoll = function() {
                    var t = this
                      , e = document.createElement("script");
                    this.script && (this.script.parentNode.removeChild(this.script),
                    this.script = null),
                    e.async = !0,
                    e.src = this.uri(),
                    e.onerror = function(e) {
                        t.onError("jsonp poll error", e)
                    }
                    ;
                    var n = document.getElementsByTagName("script")[0];
                    n.parentNode.insertBefore(e, n),
                    this.script = e;
                    var o = "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent);
                    o && setTimeout(function() {
                        var t = document.createElement("iframe");
                        document.body.appendChild(t),
                        document.body.removeChild(t)
                    }, 100)
                }
                ,
                r.prototype.doWrite = function(t, e) {
                    function n() {
                        o(),
                        e()
                    }
                    function o() {
                        if (r.iframe)
                            try {
                                r.form.removeChild(r.iframe)
                            } catch (t) {
                                r.onError("jsonp polling iframe removal error", t)
                            }
                        try {
                            var e = '<iframe src="javascript:0" name="' + r.iframeId + '">';
                            i = document.createElement(e)
                        } catch (t) {
                            i = document.createElement("iframe"),
                            i.name = r.iframeId,
                            i.src = "javascript:0"
                        }
                        i.id = r.iframeId,
                        r.form.appendChild(i),
                        r.iframe = i
                    }
                    var r = this;
                    if (!this.form) {
                        var i, s = document.createElement("form"), a = document.createElement("textarea"), u = this.iframeId = "eio_iframe_" + this.index;
                        s.className = "socketio",
                        s.style.position = "absolute",
                        s.style.top = "-1000px",
                        s.style.left = "-1000px",
                        s.target = u,
                        s.method = "POST",
                        s.setAttribute("accept-charset", "utf-8"),
                        a.name = "d",
                        s.appendChild(a),
                        document.body.appendChild(s),
                        this.form = s,
                        this.area = a
                    }
                    this.form.action = this.uri(),
                    o(),
                    t = t.replace(p, "\\\n"),
                    this.area.value = t.replace(c, "\\n");
                    try {
                        this.form.submit()
                    } catch (l) {}
                    this.iframe.attachEvent ? this.iframe.onreadystatechange = function() {
                        "complete" == r.iframe.readyState && n()
                    }
                    : this.iframe.onload = n
                }
            }
            ).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }
        , {
            "./polling": 18,
            "component-inherit": 21
        }],
        17: [function(t, e) {
            (function(n) {
                function o() {}
                function r(t) {
                    if (c.call(this, t),
                    n.location) {
                        var e = "https:" == location.protocol
                          , o = location.port;
                        o || (o = e ? 443 : 80),
                        this.xd = t.hostname != n.location.hostname || o != t.port,
                        this.xs = t.secure != e
                    }
                }
                function i(t) {
                    this.method = t.method || "GET",
                    this.uri = t.uri,
                    this.xd = !!t.xd,
                    this.xs = !!t.xs,
                    this.async = !1 !== t.async,
                    this.data = void 0 != t.data ? t.data : null,
                    this.agent = t.agent,
                    this.isBinary = t.isBinary,
                    this.supportsBinary = t.supportsBinary,
                    this.enablesXDR = t.enablesXDR,
                    this.pfx = t.pfx,
                    this.key = t.key,
                    this.passphrase = t.passphrase,
                    this.cert = t.cert,
                    this.ca = t.ca,
                    this.ciphers = t.ciphers,
                    this.rejectUnauthorized = t.rejectUnauthorized,
                    this.create()
                }
                function s() {
                    for (var t in i.requests)
                        i.requests.hasOwnProperty(t) && i.requests[t].abort()
                }
                var a = t("xmlhttprequest")
                  , c = t("./polling")
                  , p = t("component-emitter")
                  , u = t("component-inherit")
                  , l = t("debug")("engine.io-client:polling-xhr");
                e.exports = r,
                e.exports.Request = i,
                u(r, c),
                r.prototype.supportsBinary = !0,
                r.prototype.request = function(t) {
                    return t = t || {},
                    t.uri = this.uri(),
                    t.xd = this.xd,
                    t.xs = this.xs,
                    t.agent = this.agent || !1,
                    t.supportsBinary = this.supportsBinary,
                    t.enablesXDR = this.enablesXDR,
                    t.pfx = this.pfx,
                    t.key = this.key,
                    t.passphrase = this.passphrase,
                    t.cert = this.cert,
                    t.ca = this.ca,
                    t.ciphers = this.ciphers,
                    t.rejectUnauthorized = this.rejectUnauthorized,
                    new i(t)
                }
                ,
                r.prototype.doWrite = function(t, e) {
                    var n = "string" != typeof t && void 0 !== t
                      , o = this.request({
                        method: "POST",
                        data: t,
                        isBinary: n
                    })
                      , r = this;
                    o.on("success", e),
                    o.on("error", function(t) {
                        r.onError("xhr post error", t)
                    }),
                    this.sendXhr = o
                }
                ,
                r.prototype.doPoll = function() {
                    l("xhr poll");
                    var t = this.request()
                      , e = this;
                    t.on("data", function(t) {
                        e.onData(t)
                    }),
                    t.on("error", function(t) {
                        e.onError("xhr poll error", t)
                    }),
                    this.pollXhr = t
                }
                ,
                p(i.prototype),
                i.prototype.create = function() {
                    var t = {
                        agent: this.agent,
                        xdomain: this.xd,
                        xscheme: this.xs,
                        enablesXDR: this.enablesXDR
                    };
                    t.pfx = this.pfx,
                    t.key = this.key,
                    t.passphrase = this.passphrase,
                    t.cert = this.cert,
                    t.ca = this.ca,
                    t.ciphers = this.ciphers,
                    t.rejectUnauthorized = this.rejectUnauthorized;
                    var e = this.xhr = new a(t)
                      , o = this;
                    try {
                        if (l("xhr open %s: %s", this.method, this.uri),
                        e.open(this.method, this.uri, this.async),
                        this.supportsBinary && (e.responseType = "arraybuffer"),
                        "POST" == this.method)
                            try {
                                this.isBinary ? e.setRequestHeader("Content-type", "application/octet-stream") : e.setRequestHeader("Content-type", "text/plain;charset=UTF-8")
                            } catch (r) {}
                        "withCredentials"in e && (e.withCredentials = !0),
                        this.hasXDR() ? (e.onload = function() {
                            o.onLoad()
                        }
                        ,
                        e.onerror = function() {
                            o.onError(e.responseText)
                        }
                        ) : e.onreadystatechange = function() {
                            4 == e.readyState && (200 == e.status || 1223 == e.status ? o.onLoad() : setTimeout(function() {
                                o.onError(e.status)
                            }, 0))
                        }
                        ,
                        l("xhr data %s", this.data),
                        e.send(this.data)
                    } catch (r) {
                        return void setTimeout(function() {
                            o.onError(r)
                        }, 0)
                    }
                    n.document && (this.index = i.requestsCount++,
                    i.requests[this.index] = this)
                }
                ,
                i.prototype.onSuccess = function() {
                    this.emit("success"),
                    this.cleanup()
                }
                ,
                i.prototype.onData = function(t) {
                    this.emit("data", t),
                    this.onSuccess()
                }
                ,
                i.prototype.onError = function(t) {
                    this.emit("error", t),
                    this.cleanup(!0)
                }
                ,
                i.prototype.cleanup = function(t) {
                    if ("undefined" != typeof this.xhr && null !== this.xhr) {
                        if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = o : this.xhr.onreadystatechange = o,
                        t)
                            try {
                                this.xhr.abort()
                            } catch (e) {}
                        n.document && delete i.requests[this.index],
                        this.xhr = null
                    }
                }
                ,
                i.prototype.onLoad = function() {
                    var t;
                    try {
                        var e;
                        try {
                            e = this.xhr.getResponseHeader("Content-Type").split(";")[0]
                        } catch (n) {}
                        t = "application/octet-stream" === e ? this.xhr.response : this.supportsBinary ? "ok" : this.xhr.responseText
                    } catch (n) {
                        this.onError(n)
                    }
                    null != t && this.onData(t)
                }
                ,
                i.prototype.hasXDR = function() {
                    return "undefined" != typeof n.XDomainRequest && !this.xs && this.enablesXDR
                }
                ,
                i.prototype.abort = function() {
                    this.cleanup()
                }
                ,
                n.document && (i.requestsCount = 0,
                i.requests = {},
                n.attachEvent ? n.attachEvent("onunload", s) : n.addEventListener && n.addEventListener("beforeunload", s, !1))
            }
            ).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }
        , {
            "./polling": 18,
            "component-emitter": 9,
            "component-inherit": 21,
            debug: 22,
            xmlhttprequest: 20
        }],
        18: [function(t, e) {
            function n(t) {
                var e = t && t.forceBase64;
                (!c || e) && (this.supportsBinary = !1),
                o.call(this, t)
            }
            var o = t("../transport")
              , r = t("parseqs")
              , i = t("engine.io-parser")
              , s = t("component-inherit")
              , a = t("debug")("engine.io-client:polling");
            e.exports = n;
            var c = function() {
                var e = t("xmlhttprequest")
                  , n = new e({
                    xdomain: !1
                });
                return null != n.responseType
            }();
            s(n, o),
            n.prototype.name = "polling",
            n.prototype.doOpen = function() {
                this.poll()
            }
            ,
            n.prototype.pause = function(t) {
                function e() {
                    a("paused"),
                    n.readyState = "paused",
                    t()
                }
                var n = this;
                if (this.readyState = "pausing",
                this.polling || !this.writable) {
                    var o = 0;
                    this.polling && (a("we are currently polling - waiting to pause"),
                    o++,
                    this.once("pollComplete", function() {
                        a("pre-pause polling complete"),
                        --o || e()
                    })),
                    this.writable || (a("we are currently writing - waiting to pause"),
                    o++,
                    this.once("drain", function() {
                        a("pre-pause writing complete"),
                        --o || e()
                    }))
                } else
                    e()
            }
            ,
            n.prototype.poll = function() {
                a("polling"),
                this.polling = !0,
                this.doPoll(),
                this.emit("poll")
            }
            ,
            n.prototype.onData = function(t) {
                var e = this;
                a("polling got data %s", t);
                var n = function(t) {
                    return "opening" == e.readyState && e.onOpen(),
                    "close" == t.type ? (e.onClose(),
                    !1) : void e.onPacket(t)
                };
                i.decodePayload(t, this.socket.binaryType, n),
                "closed" != this.readyState && (this.polling = !1,
                this.emit("pollComplete"),
                "open" == this.readyState ? this.poll() : a('ignoring poll - transport state "%s"', this.readyState))
            }
            ,
            n.prototype.doClose = function() {
                function t() {
                    a("writing close packet"),
                    e.write([{
                        type: "close"
                    }])
                }
                var e = this;
                "open" == this.readyState ? (a("transport open - closing"),
                t()) : (a("transport not open - deferring close"),
                this.once("open", t))
            }
            ,
            n.prototype.write = function(t) {
                var e = this;
                this.writable = !1;
                var n = function() {
                    e.writable = !0,
                    e.emit("drain")
                }
                  , e = this;
                i.encodePayload(t, this.supportsBinary, function(t) {
                    e.doWrite(t, n)
                })
            }
            ,
            n.prototype.uri = function() {
                var t = this.query || {}
                  , e = this.secure ? "https" : "http"
                  , n = "";
                return !1 !== this.timestampRequests && (t[this.timestampParam] = +new Date + "-" + o.timestamps++),
                this.supportsBinary || t.sid || (t.b64 = 1),
                t = r.encode(t),
                this.port && ("https" == e && 443 != this.port || "http" == e && 80 != this.port) && (n = ":" + this.port),
                t.length && (t = "?" + t),
                e + "://" + this.hostname + n + this.path + t
            }
        }
        , {
            "../transport": 14,
            "component-inherit": 21,
            debug: 22,
            "engine.io-parser": 25,
            parseqs: 33,
            xmlhttprequest: 20
        }],
        19: [function(t, e) {
            function n(t) {
                var e = t && t.forceBase64;
                e && (this.supportsBinary = !1),
                o.call(this, t)
            }
            var o = t("../transport")
              , r = t("engine.io-parser")
              , i = t("parseqs")
              , s = t("component-inherit")
              , a = t("debug")("engine.io-client:websocket")
              , c = t("ws");
            e.exports = n,
            s(n, o),
            n.prototype.name = "websocket",
            n.prototype.supportsBinary = !0,
            n.prototype.doOpen = function() {
                if (this.check()) {
                    var t = this.uri()
                      , e = void 0
                      , n = {
                        agent: this.agent
                    };
                    n.pfx = this.pfx,
                    n.key = this.key,
                    n.passphrase = this.passphrase,
                    n.cert = this.cert,
                    n.ca = this.ca,
                    n.ciphers = this.ciphers,
                    n.rejectUnauthorized = this.rejectUnauthorized,
                    this.ws = new c(t,e,n),
                    void 0 === this.ws.binaryType && (this.supportsBinary = !1),
                    this.ws.binaryType = "arraybuffer",
                    this.addEventListeners()
                }
            }
            ,
            n.prototype.addEventListeners = function() {
                var t = this;
                this.ws.onopen = function() {
                    t.onOpen()
                }
                ,
                this.ws.onclose = function() {
                    t.onClose()
                }
                ,
                this.ws.onmessage = function(e) {
                    t.onData(e.data)
                }
                ,
                this.ws.onerror = function(e) {
                    t.onError("websocket error", e)
                }
            }
            ,
            "undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent) && (n.prototype.onData = function(t) {
                var e = this;
                setTimeout(function() {
                    o.prototype.onData.call(e, t)
                }, 0)
            }
            ),
            n.prototype.write = function(t) {
                function e() {
                    n.writable = !0,
                    n.emit("drain")
                }
                var n = this;
                this.writable = !1;
                for (var o = 0, i = t.length; i > o; o++)
                    r.encodePacket(t[o], this.supportsBinary, function(t) {
                        try {
                            n.ws.send(t)
                        } catch (e) {
                            a("websocket closed before onclose event")
                        }
                    });
                setTimeout(e, 0)
            }
            ,
            n.prototype.onClose = function() {
                o.prototype.onClose.call(this)
            }
            ,
            n.prototype.doClose = function() {
                "undefined" != typeof this.ws && this.ws.close()
            }
            ,
            n.prototype.uri = function() {
                var t = this.query || {}
                  , e = this.secure ? "wss" : "ws"
                  , n = "";
                return this.port && ("wss" == e && 443 != this.port || "ws" == e && 80 != this.port) && (n = ":" + this.port),
                this.timestampRequests && (t[this.timestampParam] = +new Date),
                this.supportsBinary || (t.b64 = 1),
                t = i.encode(t),
                t.length && (t = "?" + t),
                e + "://" + this.hostname + n + this.path + t
            }
            ,
            n.prototype.check = function() {
                return !(!c || "__initialize"in c && this.name === n.prototype.name)
            }
        }
        , {
            "../transport": 14,
            "component-inherit": 21,
            debug: 22,
            "engine.io-parser": 25,
            parseqs: 33,
            ws: 35
        }],
        20: [function(t, e) {
            var n = t("has-cors");
            e.exports = function(t) {
                var e = t.xdomain
                  , o = t.xscheme
                  , r = t.enablesXDR;
                try {
                    if ("undefined" != typeof XMLHttpRequest && (!e || n))
                        return new XMLHttpRequest
                } catch (i) {}
                try {
                    if ("undefined" != typeof XDomainRequest && !o && r)
                        return new XDomainRequest
                } catch (i) {}
                if (!e)
                    try {
                        return new ActiveXObject("Microsoft.XMLHTTP")
                    } catch (i) {}
            }
        }
        , {
            "has-cors": 38
        }],
        21: [function(t, e) {
            e.exports = function(t, e) {
                var n = function() {};
                n.prototype = e.prototype,
                t.prototype = new n,
                t.prototype.constructor = t
            }
        }
        , {}],
        22: [function(t, e, n) {
            function o() {
                return "WebkitAppearance"in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31
            }
            function r() {
                var t = arguments
                  , e = this.useColors;
                if (t[0] = (e ? "%c" : "") + this.namespace + (e ? " %c" : " ") + t[0] + (e ? "%c " : " ") + "+" + n.humanize(this.diff),
                !e)
                    return t;
                var o = "color: " + this.color;
                t = [t[0], o, "color: inherit"].concat(Array.prototype.slice.call(t, 1));
                var r = 0
                  , i = 0;
                return t[0].replace(/%[a-z%]/g, function(t) {
                    "%%" !== t && (r++,
                    "%c" === t && (i = r))
                }),
                t.splice(i, 0, o),
                t
            }
            function i() {
                return "object" == typeof console && "function" == typeof console.log && Function.prototype.apply.call(console.log, console, arguments)
            }
            function s(t) {
                try {
                    null == t ? localStorage.removeItem("debug") : localStorage.debug = t
                } catch (e) {}
            }
            function a() {
                var t;
                try {
                    t = localStorage.debug
                } catch (e) {}
                return t
            }
            n = e.exports = t("./debug"),
            n.log = i,
            n.formatArgs = r,
            n.save = s,
            n.load = a,
            n.useColors = o,
            n.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"],
            n.formatters.j = function(t) {
                return JSON.stringify(t)
            }
            ,
            n.enable(a())
        }
        , {
            "./debug": 23
        }],
        23: [function(t, e, n) {
            function o() {
                return n.colors[u++ % n.colors.length]
            }
            function r(t) {
                function e() {}
                function r() {
                    var t = r
                      , e = +new Date
                      , i = e - (p || e);
                    t.diff = i,
                    t.prev = p,
                    t.curr = e,
                    p = e,
                    null == t.useColors && (t.useColors = n.useColors()),
                    null == t.color && t.useColors && (t.color = o());
                    var s = Array.prototype.slice.call(arguments);
                    s[0] = n.coerce(s[0]),
                    "string" != typeof s[0] && (s = ["%o"].concat(s));
                    var a = 0;
                    s[0] = s[0].replace(/%([a-z%])/g, function(e, o) {
                        if ("%%" === e)
                            return e;
                        a++;
                        var r = n.formatters[o];
                        if ("function" == typeof r) {
                            var i = s[a];
                            e = r.call(t, i),
                            s.splice(a, 1),
                            a--
                        }
                        return e
                    }),
                    "function" == typeof n.formatArgs && (s = n.formatArgs.apply(t, s));
                    var c = r.log || n.log || console.log.bind(console);
                    c.apply(t, s)
                }
                e.enabled = !1,
                r.enabled = !0;
                var i = n.enabled(t) ? r : e;
                return i.namespace = t,
                i
            }
            function i(t) {
                n.save(t);
                for (var e = (t || "").split(/[\s,]+/), o = e.length, r = 0; o > r; r++)
                    e[r] && (t = e[r].replace(/\*/g, ".*?"),
                    "-" === t[0] ? n.skips.push(new RegExp("^" + t.substr(1) + "$")) : n.names.push(new RegExp("^" + t + "$")))
            }
            function s() {
                n.enable("")
            }
            function a(t) {
                var e, o;
                for (e = 0,
                o = n.skips.length; o > e; e++)
                    if (n.skips[e].test(t))
                        return !1;
                for (e = 0,
                o = n.names.length; o > e; e++)
                    if (n.names[e].test(t))
                        return !0;
                return !1
            }
            function c(t) {
                return t instanceof Error ? t.stack || t.message : t
            }
            n = e.exports = r,
            n.coerce = c,
            n.disable = s,
            n.enable = i,
            n.enabled = a,
            n.humanize = t("ms"),
            n.names = [],
            n.skips = [],
            n.formatters = {};
            var p, u = 0
        }
        , {
            ms: 24
        }],
        24: [function(t, e) {
            function n(t) {
                var e = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(t);
                if (e) {
                    var n = parseFloat(e[1])
                      , o = (e[2] || "ms").toLowerCase();
                    switch (o) {
                    case "years":
                    case "year":
                    case "y":
                        return n * u;
                    case "days":
                    case "day":
                    case "d":
                        return n * p;
                    case "hours":
                    case "hour":
                    case "h":
                        return n * c;
                    case "minutes":
                    case "minute":
                    case "m":
                        return n * a;
                    case "seconds":
                    case "second":
                    case "s":
                        return n * s;
                    case "ms":
                        return n
                    }
                }
            }
            function o(t) {
                return t >= p ? Math.round(t / p) + "d" : t >= c ? Math.round(t / c) + "h" : t >= a ? Math.round(t / a) + "m" : t >= s ? Math.round(t / s) + "s" : t + "ms"
            }
            function r(t) {
                return i(t, p, "day") || i(t, c, "hour") || i(t, a, "minute") || i(t, s, "second") || t + " ms"
            }
            function i(t, e, n) {
                return e > t ? void 0 : 1.5 * e > t ? Math.floor(t / e) + " " + n : Math.ceil(t / e) + " " + n + "s"
            }
            var s = 1e3
              , a = 60 * s
              , c = 60 * a
              , p = 24 * c
              , u = 365.25 * p;
            e.exports = function(t, e) {
                return e = e || {},
                "string" == typeof t ? n(t) : e["long"] ? r(t) : o(t)
            }
        }
        , {}],
        25: [function(t, e, n) {
            (function(e) {
                function o(t, e) {
                    var o = "b" + n.packets[t.type] + t.data.data;
                    return e(o)
                }
                function r(t, e, o) {
                    if (!e)
                        return n.encodeBase64Packet(t, o);
                    var r = t.data
                      , i = new Uint8Array(r)
                      , s = new Uint8Array(1 + r.byteLength);
                    s[0] = y[t.type];
                    for (var a = 0; a < i.length; a++)
                        s[a + 1] = i[a];
                    return o(s.buffer)
                }
                function i(t, e, o) {
                    if (!e)
                        return n.encodeBase64Packet(t, o);
                    var r = new FileReader;
                    return r.onload = function() {
                        t.data = r.result,
                        n.encodePacket(t, e, !0, o)
                    }
                    ,
                    r.readAsArrayBuffer(t.data)
                }
                function s(t, e, o) {
                    if (!e)
                        return n.encodeBase64Packet(t, o);
                    if (m)
                        return i(t, e, o);
                    var r = new Uint8Array(1);
                    r[0] = y[t.type];
                    var s = new _([r.buffer, t.data]);
                    return o(s)
                }
                function a(t, e, n) {
                    for (var o = new Array(t.length), r = f(t.length, n), i = function(t, n, r) {
                        e(n, function(e, n) {
                            o[t] = n,
                            r(e, o)
                        })
                    }, s = 0; s < t.length; s++)
                        i(s, t[s], r)
                }
                var c = t("./keys")
                  , p = t("has-binary")
                  , u = t("arraybuffer.slice")
                  , l = t("base64-arraybuffer")
                  , f = t("after")
                  , h = t("utf8")
                  , d = navigator.userAgent.match(/Android/i)
                  , g = /PhantomJS/i.test(navigator.userAgent)
                  , m = d || g;
                n.protocol = 3;
                var y = n.packets = {
                    open: 0,
                    close: 1,
                    ping: 2,
                    pong: 3,
                    message: 4,
                    upgrade: 5,
                    noop: 6
                }
                  , v = c(y)
                  , b = {
                    type: "error",
                    data: "parser error"
                }
                  , _ = t("blob");
                n.encodePacket = function(t, n, i, a) {
                    "function" == typeof n && (a = n,
                    n = !1),
                    "function" == typeof i && (a = i,
                    i = null);
                    var c = void 0 === t.data ? void 0 : t.data.buffer || t.data;
                    if (e.ArrayBuffer && c instanceof ArrayBuffer)
                        return r(t, n, a);
                    if (_ && c instanceof e.Blob)
                        return s(t, n, a);
                    if (c && c.base64)
                        return o(t, a);
                    var p = y[t.type];
                    return void 0 !== t.data && (p += i ? h.encode(String(t.data)) : String(t.data)),
                    a("" + p)
                }
                ,
                n.encodeBase64Packet = function(t, o) {
                    var r = "b" + n.packets[t.type];
                    if (_ && t.data instanceof _) {
                        var i = new FileReader;
                        return i.onload = function() {
                            var t = i.result.split(",")[1];
                            o(r + t)
                        }
                        ,
                        i.readAsDataURL(t.data)
                    }
                    var s;
                    try {
                        s = String.fromCharCode.apply(null, new Uint8Array(t.data))
                    } catch (a) {
                        for (var c = new Uint8Array(t.data), p = new Array(c.length), u = 0; u < c.length; u++)
                            p[u] = c[u];
                        s = String.fromCharCode.apply(null, p)
                    }
                    return r += e.btoa(s),
                    o(r)
                }
                ,
                n.decodePacket = function(t, e, o) {
                    if ("string" == typeof t || void 0 === t) {
                        if ("b" == t.charAt(0))
                            return n.decodeBase64Packet(t.substr(1), e);
                        if (o)
                            try {
                                t = h.decode(t)
                            } catch (r) {
                                return b
                            }
                        var i = t.charAt(0);
                        return Number(i) == i && v[i] ? t.length > 1 ? {
                            type: v[i],
                            data: t.substring(1)
                        } : {
                            type: v[i]
                        } : b
                    }
                    var s = new Uint8Array(t)
                      , i = s[0]
                      , a = u(t, 1);
                    return _ && "blob" === e && (a = new _([a])),
                    {
                        type: v[i],
                        data: a
                    }
                }
                ,
                n.decodeBase64Packet = function(t, n) {
                    var o = v[t.charAt(0)];
                    if (!e.ArrayBuffer)
                        return {
                            type: o,
                            data: {
                                base64: !0,
                                data: t.substr(1)
                            }
                        };
                    var r = l.decode(t.substr(1));
                    return "blob" === n && _ && (r = new _([r])),
                    {
                        type: o,
                        data: r
                    }
                }
                ,
                n.encodePayload = function(t, e, o) {
                    function r(t) {
                        return t.length + ":" + t
                    }
                    function i(t, o) {
                        n.encodePacket(t, !!s && e, !0, function(t) {
                            o(null, r(t))
                        })
                    }
                    "function" == typeof e && (o = e,
                    e = null);
                    var s = p(t);
                    return e && s ? _ && !m ? n.encodePayloadAsBlob(t, o) : n.encodePayloadAsArrayBuffer(t, o) : t.length ? void a(t, i, function(t, e) {
                        return o(e.join(""))
                    }) : o("0:")
                }
                ,
                n.decodePayload = function(t, e, o) {
                    if ("string" != typeof t)
                        return n.decodePayloadAsBinary(t, e, o);
                    "function" == typeof e && (o = e,
                    e = null);
                    var r;
                    if ("" == t)
                        return o(b, 0, 1);
                    for (var i, s, a = "", c = 0, p = t.length; p > c; c++) {
                        var u = t.charAt(c);
                        if (":" != u)
                            a += u;
                        else {
                            if ("" == a || a != (i = Number(a)))
                                return o(b, 0, 1);
                            if (s = t.substr(c + 1, i),
                            a != s.length)
                                return o(b, 0, 1);
                            if (s.length) {
                                if (r = n.decodePacket(s, e, !0),
                                b.type == r.type && b.data == r.data)
                                    return o(b, 0, 1);
                                var l = o(r, c + i, p);
                                if (!1 === l)
                                    return
                            }
                            c += i,
                            a = ""
                        }
                    }
                    return "" != a ? o(b, 0, 1) : void 0
                }
                ,
                n.encodePayloadAsArrayBuffer = function(t, e) {
                    function o(t, e) {
                        n.encodePacket(t, !0, !0, function(t) {
                            return e(null, t)
                        })
                    }
                    return t.length ? void a(t, o, function(t, n) {
                        var o = n.reduce(function(t, e) {
                            var n;
                            return n = "string" == typeof e ? e.length : e.byteLength,
                            t + n.toString().length + n + 2
                        }, 0)
                          , r = new Uint8Array(o)
                          , i = 0;
                        return n.forEach(function(t) {
                            var e = "string" == typeof t
                              , n = t;
                            if (e) {
                                for (var o = new Uint8Array(t.length), s = 0; s < t.length; s++)
                                    o[s] = t.charCodeAt(s);
                                n = o.buffer
                            }
                            r[i++] = e ? 0 : 1;
                            for (var a = n.byteLength.toString(), s = 0; s < a.length; s++)
                                r[i++] = parseInt(a[s]);
                            r[i++] = 255;
                            for (var o = new Uint8Array(n), s = 0; s < o.length; s++)
                                r[i++] = o[s]
                        }),
                        e(r.buffer)
                    }) : e(new ArrayBuffer(0))
                }
                ,
                n.encodePayloadAsBlob = function(t, e) {
                    function o(t, e) {
                        n.encodePacket(t, !0, !0, function(t) {
                            var n = new Uint8Array(1);
                            if (n[0] = 1,
                            "string" == typeof t) {
                                for (var o = new Uint8Array(t.length), r = 0; r < t.length; r++)
                                    o[r] = t.charCodeAt(r);
                                t = o.buffer,
                                n[0] = 0
                            }
                            for (var i = t instanceof ArrayBuffer ? t.byteLength : t.size, s = i.toString(), a = new Uint8Array(s.length + 1), r = 0; r < s.length; r++)
                                a[r] = parseInt(s[r]);
                            if (a[s.length] = 255,
                            _) {
                                var c = new _([n.buffer, a.buffer, t]);
                                e(null, c)
                            }
                        })
                    }
                    a(t, o, function(t, n) {
                        return e(new _(n))
                    })
                }
                ,
                n.decodePayloadAsBinary = function(t, e, o) {
                    "function" == typeof e && (o = e,
                    e = null);
                    for (var r = t, i = [], s = !1; r.byteLength > 0; ) {
                        for (var a = new Uint8Array(r), c = 0 === a[0], p = "", l = 1; 255 != a[l]; l++) {
                            if (p.length > 310) {
                                s = !0;
                                break
                            }
                            p += a[l]
                        }
                        if (s)
                            return o(b, 0, 1);
                        r = u(r, 2 + p.length),
                        p = parseInt(p);
                        var f = u(r, 0, p);
                        if (c)
                            try {
                                f = String.fromCharCode.apply(null, new Uint8Array(f))
                            } catch (h) {
                                var d = new Uint8Array(f);
                                f = "";
                                for (var l = 0; l < d.length; l++)
                                    f += String.fromCharCode(d[l])
                            }
                        i.push(f),
                        r = u(r, p)
                    }
                    var g = i.length;
                    i.forEach(function(t, r) {
                        o(n.decodePacket(t, e, !0), r, g)
                    })
                }
            }
            ).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }
        , {
            "./keys": 26,
            after: 27,
            "arraybuffer.slice": 28,
            "base64-arraybuffer": 29,
            blob: 30,
            "has-binary": 36,
            utf8: 31
        }],
        26: [function(t, e) {
            e.exports = Object.keys || function(t) {
                var e = []
                  , n = Object.prototype.hasOwnProperty;
                for (var o in t)
                    n.call(t, o) && e.push(o);
                return e
            }
        }
        , {}],
        27: [function(t, e) {
            function n(t, e, n) {
                function r(t, o) {
                    if (r.count <= 0)
                        throw new Error("after called too many times");
                    --r.count,
                    t ? (i = !0,
                    e(t),
                    e = n) : 0 !== r.count || i || e(null, o)
                }
                var i = !1;
                return n = n || o,
                r.count = t,
                0 === t ? e() : r
            }
            function o() {}
            e.exports = n
        }
        , {}],
        28: [function(t, e) {
            e.exports = function(t, e, n) {
                var o = t.byteLength;
                if (e = e || 0,
                n = n || o,
                t.slice)
                    return t.slice(e, n);
                if (0 > e && (e += o),
                0 > n && (n += o),
                n > o && (n = o),
                e >= o || e >= n || 0 === o)
                    return new ArrayBuffer(0);
                for (var r = new Uint8Array(t), i = new Uint8Array(n - e), s = e, a = 0; n > s; s++,
                a++)
                    i[a] = r[s];
                return i.buffer
            }
        }
        , {}],
        29: [function(t, e, n) {
            !function(t) {
                "use strict";
                n.encode = function(e) {
                    var n, o = new Uint8Array(e), r = o.length, i = "";
                    for (n = 0; r > n; n += 3)
                        i += t[o[n] >> 2],
                        i += t[(3 & o[n]) << 4 | o[n + 1] >> 4],
                        i += t[(15 & o[n + 1]) << 2 | o[n + 2] >> 6],
                        i += t[63 & o[n + 2]];
                    return r % 3 === 2 ? i = i.substring(0, i.length - 1) + "=" : r % 3 === 1 && (i = i.substring(0, i.length - 2) + "=="),
                    i
                }
                ,
                n.decode = function(e) {
                    var n, o, r, i, s, a = .75 * e.length, c = e.length, p = 0;
                    "=" === e[e.length - 1] && (a--,
                    "=" === e[e.length - 2] && a--);
                    var u = new ArrayBuffer(a)
                      , l = new Uint8Array(u);
                    for (n = 0; c > n; n += 4)
                        o = t.indexOf(e[n]),
                        r = t.indexOf(e[n + 1]),
                        i = t.indexOf(e[n + 2]),
                        s = t.indexOf(e[n + 3]),
                        l[p++] = o << 2 | r >> 4,
                        l[p++] = (15 & r) << 4 | i >> 2,
                        l[p++] = (3 & i) << 6 | 63 & s;
                    return u
                }
            }("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")
        }
        , {}],
        30: [function(t, e) {
            (function(t) {
                function n(t) {
                    for (var e = 0; e < t.length; e++) {
                        var n = t[e];
                        if (n.buffer instanceof ArrayBuffer) {
                            var o = n.buffer;
                            if (n.byteLength !== o.byteLength) {
                                var r = new Uint8Array(n.byteLength);
                                r.set(new Uint8Array(o,n.byteOffset,n.byteLength)),
                                o = r.buffer
                            }
                            t[e] = o
                        }
                    }
                }
                function o(t, e) {
                    e = e || {};
                    var o = new i;
                    n(t);
                    for (var r = 0; r < t.length; r++)
                        o.append(t[r]);
                    return e.type ? o.getBlob(e.type) : o.getBlob()
                }
                function r(t, e) {
                    return n(t),
                    new Blob(t,e || {})
                }
                var i = t.BlobBuilder || t.WebKitBlobBuilder || t.MSBlobBuilder || t.MozBlobBuilder
                  , s = function() {
                    try {
                        var t = new Blob(["hi"]);
                        return 2 === t.size
                    } catch (e) {
                        return !1
                    }
                }()
                  , a = s && function() {
                    try {
                        var t = new Blob([new Uint8Array([1, 2])]);
                        return 2 === t.size
                    } catch (e) {
                        return !1
                    }
                }()
                  , c = i && i.prototype.append && i.prototype.getBlob;
                e.exports = function() {
                    return s ? a ? t.Blob : r : c ? o : void 0
                }()
            }
            ).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }
        , {}],
        31: [function(e, n, o) {
            (function(e) {
                !function(r) {
                    function i(t) {
                        for (var e, n, o = [], r = 0, i = t.length; i > r; )
                            e = t.charCodeAt(r++),
                            e >= 55296 && 56319 >= e && i > r ? (n = t.charCodeAt(r++),
                            56320 == (64512 & n) ? o.push(((1023 & e) << 10) + (1023 & n) + 65536) : (o.push(e),
                            r--)) : o.push(e);
                        return o
                    }
                    function s(t) {
                        for (var e, n = t.length, o = -1, r = ""; ++o < n; )
                            e = t[o],
                            e > 65535 && (e -= 65536,
                            r += _(e >>> 10 & 1023 | 55296),
                            e = 56320 | 1023 & e),
                            r += _(e);
                        return r
                    }
                    function a(t) {
                        if (t >= 55296 && 57343 >= t)
                            throw Error("Lone surrogate U+" + t.toString(16).toUpperCase() + " is not a scalar value")
                    }
                    function c(t, e) {
                        return _(t >> e & 63 | 128)
                    }
                    function p(t) {
                        if (0 == (4294967168 & t))
                            return _(t);
                        var e = "";
                        return 0 == (4294965248 & t) ? e = _(t >> 6 & 31 | 192) : 0 == (4294901760 & t) ? (a(t),
                        e = _(t >> 12 & 15 | 224),
                        e += c(t, 6)) : 0 == (4292870144 & t) && (e = _(t >> 18 & 7 | 240),
                        e += c(t, 12),
                        e += c(t, 6)),
                        e += _(63 & t | 128)
                    }
                    function u(t) {
                        for (var e, n = i(t), o = n.length, r = -1, s = ""; ++r < o; )
                            e = n[r],
                            s += p(e);
                        return s
                    }
                    function l() {
                        if (b >= v)
                            throw Error("Invalid byte index");
                        var t = 255 & y[b];
                        if (b++,
                        128 == (192 & t))
                            return 63 & t;
                        throw Error("Invalid continuation byte")
                    }
                    function f() {
                        var t, e, n, o, r;
                        if (b > v)
                            throw Error("Invalid byte index");
                        if (b == v)
                            return !1;
                        if (t = 255 & y[b],
                        b++,
                        0 == (128 & t))
                            return t;
                        if (192 == (224 & t)) {
                            var e = l();
                            if (r = (31 & t) << 6 | e,
                            r >= 128)
                                return r;
                            throw Error("Invalid continuation byte")
                        }
                        if (224 == (240 & t)) {
                            if (e = l(),
                            n = l(),
                            r = (15 & t) << 12 | e << 6 | n,
                            r >= 2048)
                                return a(r),
                                r;
                            throw Error("Invalid continuation byte")
                        }
                        if (240 == (248 & t) && (e = l(),
                        n = l(),
                        o = l(),
                        r = (15 & t) << 18 | e << 12 | n << 6 | o,
                        r >= 65536 && 1114111 >= r))
                            return r;
                        throw Error("Invalid UTF-8 detected")
                    }
                    function h(t) {
                        y = i(t),
                        v = y.length,
                        b = 0;
                        for (var e, n = []; (e = f()) !== !1; )
                            n.push(e);
                        return s(n)
                    }
                    var d = "object" == typeof o && o
                      , g = "object" == typeof n && n && n.exports == d && n
                      , m = "object" == typeof e && e;
                    (m.global === m || m.window === m) && (r = m);
                    var y, v, b, _ = String.fromCharCode, w = {
                        version: "2.0.0",
                        encode: u,
                        decode: h
                    };
                    if ("function" == typeof t && "object" == typeof t.amd && t.amd)
                        t(function() {
                            return w
                        });
                    else if (d && !d.nodeType)
                        if (g)
                            g.exports = w;
                        else {
                            var k = {}
                              , x = k.hasOwnProperty;
                            for (var C in w)
                                x.call(w, C) && (d[C] = w[C])
                        }
                    else
                        r.utf8 = w
                }(this)
            }
            ).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }
        , {}],
        32: [function(t, e) {
            (function(t) {
                var n = /^[\],:{}\s]*$/
                  , o = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g
                  , r = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g
                  , i = /(?:^|:|,)(?:\s*\[)+/g
                  , s = /^\s+/
                  , a = /\s+$/;
                e.exports = function(e) {
                    return "string" == typeof e && e ? (e = e.replace(s, "").replace(a, ""),
                    t.JSON && JSON.parse ? JSON.parse(e) : n.test(e.replace(o, "@").replace(r, "]").replace(i, "")) ? new Function("return " + e)() : void 0) : null
                }
            }
            ).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }
        , {}],
        33: [function(t, e, n) {
            n.encode = function(t) {
                var e = "";
                for (var n in t)
                    t.hasOwnProperty(n) && (e.length && (e += "&"),
                    e += encodeURIComponent(n) + "=" + encodeURIComponent(t[n]));
                return e
            }
            ,
            n.decode = function(t) {
                for (var e = {}, n = t.split("&"), o = 0, r = n.length; r > o; o++) {
                    var i = n[o].split("=");
                    e[decodeURIComponent(i[0])] = decodeURIComponent(i[1])
                }
                return e
            }
        }
        , {}],
        34: [function(t, e) {
            var n = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
              , o = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
            e.exports = function(t) {
                var e = t
                  , r = t.indexOf("[")
                  , i = t.indexOf("]");
                -1 != r && -1 != i && (t = t.substring(0, r) + t.substring(r, i).replace(/:/g, ";") + t.substring(i, t.length));
                for (var s = n.exec(t || ""), a = {}, c = 14; c--; )
                    a[o[c]] = s[c] || "";
                return -1 != r && -1 != i && (a.source = e,
                a.host = a.host.substring(1, a.host.length - 1).replace(/;/g, ":"),
                a.authority = a.authority.replace("[", "").replace("]", "").replace(/;/g, ":"),
                a.ipv6uri = !0),
                a
            }
        }
        , {}],
        35: [function(t, e) {
            function n(t, e) {
                var n;
                return n = e ? new r(t,e) : new r(t)
            }
            var o = function() {
                return this
            }()
              , r = o.WebSocket || o.MozWebSocket;
            e.exports = r ? n : null,
            r && (n.prototype = r.prototype)
        }
        , {}],
        36: [function(t, e) {
            (function(n) {
                function o(t) {
                    function e(t) {
                        if (!t)
                            return !1;
                        if (n.Buffer && n.Buffer.isBuffer(t) || n.ArrayBuffer && t instanceof ArrayBuffer || n.Blob && t instanceof Blob || n.File && t instanceof File)
                            return !0;
                        if (r(t)) {
                            for (var o = 0; o < t.length; o++)
                                if (e(t[o]))
                                    return !0
                        } else if (t && "object" == typeof t) {
                            t.toJSON && (t = t.toJSON());
                            for (var i in t)
                                if (Object.prototype.hasOwnProperty.call(t, i) && e(t[i]))
                                    return !0
                        }
                        return !1
                    }
                    return e(t)
                }
                var r = t("isarray");
                e.exports = o
            }
            ).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }
        , {
            isarray: 37
        }],
        37: [function(t, e) {
            e.exports = Array.isArray || function(t) {
                return "[object Array]" == Object.prototype.toString.call(t)
            }
        }
        , {}],
        38: [function(t, e) {
            var n = t("global");
            try {
                e.exports = "XMLHttpRequest"in n && "withCredentials"in new n.XMLHttpRequest
            } catch (o) {
                e.exports = !1
            }
        }
        , {
            global: 39
        }],
        39: [function(t, e) {
            e.exports = function() {
                return this
            }()
        }
        , {}],
        40: [function(t, e) {
            var n = [].indexOf;
            e.exports = function(t, e) {
                if (n)
                    return t.indexOf(e);
                for (var o = 0; o < t.length; ++o)
                    if (t[o] === e)
                        return o;
                return -1
            }
        }
        , {}],
        41: [function(t, e, n) {
            var o = Object.prototype.hasOwnProperty;
            n.keys = Object.keys || function(t) {
                var e = [];
                for (var n in t)
                    o.call(t, n) && e.push(n);
                return e
            }
            ,
            n.values = function(t) {
                var e = [];
                for (var n in t)
                    o.call(t, n) && e.push(t[n]);
                return e
            }
            ,
            n.merge = function(t, e) {
                for (var n in e)
                    o.call(e, n) && (t[n] = e[n]);
                return t
            }
            ,
            n.length = function(t) {
                return n.keys(t).length
            }
            ,
            n.isEmpty = function(t) {
                return 0 == n.length(t)
            }
        }
        , {}],
        42: [function(t, e) {
            var n = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
              , o = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
            e.exports = function(t) {
                for (var e = n.exec(t || ""), r = {}, i = 14; i--; )
                    r[o[i]] = e[i] || "";
                return r
            }
        }
        , {}],
        43: [function(t, e, n) {
            (function(e) {
                var o = t("isarray")
                  , r = t("./is-buffer");
                n.deconstructPacket = function(t) {
                    function e(t) {
                        if (!t)
                            return t;
                        if (r(t)) {
                            var i = {
                                _placeholder: !0,
                                num: n.length
                            };
                            return n.push(t),
                            i
                        }
                        if (o(t)) {
                            for (var s = new Array(t.length), a = 0; a < t.length; a++)
                                s[a] = e(t[a]);
                            return s
                        }
                        if ("object" == typeof t && !(t instanceof Date)) {
                            var s = {};
                            for (var c in t)
                                s[c] = e(t[c]);
                            return s
                        }
                        return t
                    }
                    var n = []
                      , i = t.data
                      , s = t;
                    return s.data = e(i),
                    s.attachments = n.length,
                    {
                        packet: s,
                        buffers: n
                    }
                }
                ,
                n.reconstructPacket = function(t, e) {
                    function n(t) {
                        if (t && t._placeholder) {
                            var r = e[t.num];
                            return r
                        }
                        if (o(t)) {
                            for (var i = 0; i < t.length; i++)
                                t[i] = n(t[i]);
                            return t
                        }
                        if (t && "object" == typeof t) {
                            for (var s in t)
                                t[s] = n(t[s]);
                            return t
                        }
                        return t
                    }
                    return t.data = n(t.data),
                    t.attachments = void 0,
                    t
                }
                ,
                n.removeBlobs = function(t, n) {
                    function i(t, c, p) {
                        if (!t)
                            return t;
                        if (e.Blob && t instanceof Blob || e.File && t instanceof File) {
                            s++;
                            var u = new FileReader;
                            u.onload = function() {
                                p ? p[c] = this.result : a = this.result,
                                --s || n(a)
                            }
                            ,
                            u.readAsArrayBuffer(t)
                        } else if (o(t))
                            for (var l = 0; l < t.length; l++)
                                i(t[l], l, t);
                        else if (t && "object" == typeof t && !r(t))
                            for (var f in t)
                                i(t[f], f, t)
                    }
                    var s = 0
                      , a = t;
                    i(a),
                    s || n(a)
                }
            }
            ).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }
        , {
            "./is-buffer": 45,
            isarray: 46
        }],
        44: [function(t, e, n) {
            function o() {}
            function r(t) {
                var e = ""
                  , o = !1;
                return e += t.type,
                (n.BINARY_EVENT == t.type || n.BINARY_ACK == t.type) && (e += t.attachments,
                e += "-"),
                t.nsp && "/" != t.nsp && (o = !0,
                e += t.nsp),
                null != t.id && (o && (e += ",",
                o = !1),
                e += t.id),
                null != t.data && (o && (e += ","),
                e += l.stringify(t.data)),
                u("encoded %j as %s", t, e),
                e
            }
            function i(t, e) {
                function n(t) {
                    var n = h.deconstructPacket(t)
                      , o = r(n.packet)
                      , i = n.buffers;
                    i.unshift(o),
                    e(i)
                }
                h.removeBlobs(t, n)
            }
            function s() {
                this.reconstructor = null
            }
            function a(t) {
                var e = {}
                  , o = 0;
                if (e.type = Number(t.charAt(0)),
                null == n.types[e.type])
                    return p();
                if (n.BINARY_EVENT == e.type || n.BINARY_ACK == e.type) {
                    for (var r = ""; "-" != t.charAt(++o) && (r += t.charAt(o),
                    o != t.length); )
                        ;
                    if (r != Number(r) || "-" != t.charAt(o))
                        throw new Error("Illegal attachments");
                    e.attachments = Number(r)
                }
                if ("/" == t.charAt(o + 1))
                    for (e.nsp = ""; ++o; ) {
                        var i = t.charAt(o);
                        if ("," == i)
                            break;
                        if (e.nsp += i,
                        o == t.length)
                            break
                    }
                else
                    e.nsp = "/";
                var s = t.charAt(o + 1);
                if ("" !== s && Number(s) == s) {
                    for (e.id = ""; ++o; ) {
                        var i = t.charAt(o);
                        if (null == i || Number(i) != i) {
                            --o;
                            break
                        }
                        if (e.id += t.charAt(o),
                        o == t.length)
                            break
                    }
                    e.id = Number(e.id)
                }
                if (t.charAt(++o))
                    try {
                        e.data = l.parse(t.substr(o))
                    } catch (a) {
                        return p()
                    }
                return u("decoded %s as %j", t, e),
                e
            }
            function c(t) {
                this.reconPack = t,
                this.buffers = []
            }
            function p() {
                return {
                    type: n.ERROR,
                    data: "parser error"
                }
            }
            var u = t("debug")("socket.io-parser")
              , l = t("json3")
              , f = (t("isarray"),
            t("component-emitter"))
              , h = t("./binary")
              , d = t("./is-buffer");
            n.protocol = 4,
            n.types = ["CONNECT", "DISCONNECT", "EVENT", "BINARY_EVENT", "ACK", "BINARY_ACK", "ERROR"],
            n.CONNECT = 0,
            n.DISCONNECT = 1,
            n.EVENT = 2,
            n.ACK = 3,
            n.ERROR = 4,
            n.BINARY_EVENT = 5,
            n.BINARY_ACK = 6,
            n.Encoder = o,
            n.Decoder = s,
            o.prototype.encode = function(t, e) {
                if (u("encoding packet %j", t),
                n.BINARY_EVENT == t.type || n.BINARY_ACK == t.type)
                    i(t, e);
                else {
                    var o = r(t);
                    e([o])
                }
            }
            ,
            f(s.prototype),
            s.prototype.add = function(t) {
                var e;
                if ("string" == typeof t)
                    e = a(t),
                    n.BINARY_EVENT == e.type || n.BINARY_ACK == e.type ? (this.reconstructor = new c(e),
                    0 === this.reconstructor.reconPack.attachments && this.emit("decoded", e)) : this.emit("decoded", e);
                else {
                    if (!d(t) && !t.base64)
                        throw new Error("Unknown type: " + t);
                    if (!this.reconstructor)
                        throw new Error("got binary data when not reconstructing a packet");
                    e = this.reconstructor.takeBinaryData(t),
                    e && (this.reconstructor = null,
                    this.emit("decoded", e))
                }
            }
            ,
            s.prototype.destroy = function() {
                this.reconstructor && this.reconstructor.finishedReconstruction()
            }
            ,
            c.prototype.takeBinaryData = function(t) {
                if (this.buffers.push(t),
                this.buffers.length == this.reconPack.attachments) {
                    var e = h.reconstructPacket(this.reconPack, this.buffers);
                    return this.finishedReconstruction(),
                    e
                }
                return null
            }
            ,
            c.prototype.finishedReconstruction = function() {
                this.reconPack = null,
                this.buffers = []
            }
        }
        , {
            "./binary": 43,
            "./is-buffer": 45,
            "component-emitter": 9,
            debug: 10,
            isarray: 46,
            json3: 47
        }],
        45: [function(t, e) {
            (function(t) {
                function n(e) {
                    return t.Buffer && t.Buffer.isBuffer(e) || t.ArrayBuffer && e instanceof ArrayBuffer
                }
                e.exports = n
            }
            ).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }
        , {}],
        46: [function(t, e) {
            e.exports = t(37)
        }
        , {}],
        47: [function(e, n, o) {
            !function(e) {
                function n(t) {
                    if (n[t] !== s)
                        return n[t];
                    var e;
                    if ("bug-string-char-index" == t)
                        e = "a" != "a"[0];
                    else if ("json" == t)
                        e = n("json-stringify") && n("json-parse");
                    else {
                        var o, r = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
                        if ("json-stringify" == t) {
                            var i = u.stringify
                              , c = "function" == typeof i && l;
                            if (c) {
                                (o = function() {
                                    return 1
                                }
                                ).toJSON = o;
                                try {
                                    c = "0" === i(0) && "0" === i(new Number) && '""' == i(new String) && i(a) === s && i(s) === s && i() === s && "1" === i(o) && "[1]" == i([o]) && "[null]" == i([s]) && "null" == i(null) && "[null,null,null]" == i([s, a, null]) && i({
                                        a: [o, !0, !1, null, "\0\b\n\f\r    "]
                                    }) == r && "1" === i(null, o) && "[\n 1,\n 2\n]" == i([1, 2], null, 1) && '"-271821-04-20T00:00:00.000Z"' == i(new Date((-864e13))) && '"+275760-09-13T00:00:00.000Z"' == i(new Date(864e13)) && '"-000001-01-01T00:00:00.000Z"' == i(new Date((-621987552e5))) && '"1969-12-31T23:59:59.999Z"' == i(new Date((-1)))
                                } catch (p) {
                                    c = !1
                                }
                            }
                            e = c
                        }
                        if ("json-parse" == t) {
                            var f = u.parse;
                            if ("function" == typeof f)
                                try {
                                    if (0 === f("0") && !f(!1)) {
                                        o = f(r);
                                        var h = 5 == o.a.length && 1 === o.a[0];
                                        if (h) {
                                            try {
                                                h = !f('" "')
                                            } catch (p) {}
                                            if (h)
                                                try {
                                                    h = 1 !== f("01")
                                                } catch (p) {}
                                            if (h)
                                                try {
                                                    h = 1 !== f("1.")
                                                } catch (p) {}
                                        }
                                    }
                                } catch (p) {
                                    h = !1
                                }
                            e = h
                        }
                    }
                    return n[t] = !!e
                }
                var r, i, s, a = {}.toString, c = "function" == typeof t && t.amd, p = "object" == typeof JSON && JSON, u = "object" == typeof o && o && !o.nodeType && o;
                u && p ? (u.stringify = p.stringify,
                u.parse = p.parse) : u = e.JSON = p || {};
                var l = new Date((-0xc782b5b800cec));
                try {
                    l = -109252 == l.getUTCFullYear() && 0 === l.getUTCMonth() && 1 === l.getUTCDate() && 10 == l.getUTCHours() && 37 == l.getUTCMinutes() && 6 == l.getUTCSeconds() && 708 == l.getUTCMilliseconds()
                } catch (f) {}
                if (!n("json")) {
                    var h = "[object Function]"
                      , d = "[object Date]"
                      , g = "[object Number]"
                      , m = "[object String]"
                      , y = "[object Array]"
                      , v = "[object Boolean]"
                      , b = n("bug-string-char-index");
                    if (!l)
                        var _ = Math.floor
                          , w = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
                          , k = function(t, e) {
                            return w[e] + 365 * (t - 1970) + _((t - 1969 + (e = +(e > 1))) / 4) - _((t - 1901 + e) / 100) + _((t - 1601 + e) / 400)
                        };
                    (r = {}.hasOwnProperty) || (r = function(t) {
                        var e, n = {};
                        return (n.__proto__ = null,
                        n.__proto__ = {
                            toString: 1
                        },
                        n).toString != a ? r = function(t) {
                            var e = this.__proto__
                              , n = t in (this.__proto__ = null,
                            this);
                            return this.__proto__ = e,
                            n
                        }
                        : (e = n.constructor,
                        r = function(t) {
                            var n = (this.constructor || e).prototype;
                            return t in this && !(t in n && this[t] === n[t])
                        }
                        ),
                        n = null,
                        r.call(this, t)
                    }
                    );
                    var x = {
                        "boolean": 1,
                        number: 1,
                        string: 1,
                        undefined: 1
                    }
                      , C = function(t, e) {
                        var n = typeof t[e];
                        return "object" == n ? !!t[e] : !x[n]
                    };
                    if (i = function(t, e) {
                        var n, o, s, c = 0;
                        (n = function() {
                            this.valueOf = 0
                        }
                        ).prototype.valueOf = 0,
                        o = new n;
                        for (s in o)
                            r.call(o, s) && c++;
                        return n = o = null,
                        c ? i = 2 == c ? function(t, e) {
                            var n, o = {}, i = a.call(t) == h;
                            for (n in t)
                                i && "prototype" == n || r.call(o, n) || !(o[n] = 1) || !r.call(t, n) || e(n)
                        }
                        : function(t, e) {
                            var n, o, i = a.call(t) == h;
                            for (n in t)
                                i && "prototype" == n || !r.call(t, n) || (o = "constructor" === n) || e(n);
                            (o || r.call(t, n = "constructor")) && e(n)
                        }
                        : (o = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"],
                        i = function p(t, e) {
                            var n, p, i = a.call(t) == h, s = !i && "function" != typeof t.constructor && C(t, "hasOwnProperty") ? t.hasOwnProperty : r;
                            for (n in t)
                                i && "prototype" == n || !s.call(t, n) || e(n);
                            for (p = o.length; n = o[--p]; s.call(t, n) && e(n))
                                ;
                        }
                        ),
                        i(t, e)
                    }
                    ,
                    !n("json-stringify")) {
                        var S = {
                            92: "\\\\",
                            34: '\\"',
                            8: "\\b",
                            12: "\\f",
                            10: "\\n",
                            13: "\\r",
                            9: "\\t"
                        }
                          , E = "000000"
                          , A = function(t, e) {
                            return (E + (e || 0)).slice(-t)
                        }
                          , T = "\\u00"
                          , j = function(t) {
                            var e, n = '"', o = 0, r = t.length, i = r > 10 && b;
                            for (i && (e = t.split("")); r > o; o++) {
                                var s = t.charCodeAt(o);
                                switch (s) {
                                case 8:
                                case 9:
                                case 10:
                                case 12:
                                case 13:
                                case 34:
                                case 92:
                                    n += S[s];
                                    break;
                                default:
                                    if (32 > s) {
                                        n += T + A(2, s.toString(16));
                                        break
                                    }
                                    n += i ? e[o] : b ? t.charAt(o) : t[o]
                                }
                            }
                            return n + '"'
                        }
                          , B = function q(t, e, n, o, c, p, u) {
                            var l, f, h, b, w, x, C, S, E, T, B, P, R, O, I, N;
                            try {
                                l = e[t]
                            } catch (U) {}
                            if ("object" == typeof l && l)
                                if (f = a.call(l),
                                f != d || r.call(l, "toJSON"))
                                    "function" == typeof l.toJSON && (f != g && f != m && f != y || r.call(l, "toJSON")) && (l = l.toJSON(t));
                                else if (l > -1 / 0 && 1 / 0 > l) {
                                    if (k) {
                                        for (w = _(l / 864e5),
                                        h = _(w / 365.2425) + 1970 - 1; k(h + 1, 0) <= w; h++)
                                            ;
                                        for (b = _((w - k(h, 0)) / 30.42); k(h, b + 1) <= w; b++)
                                            ;
                                        w = 1 + w - k(h, b),
                                        x = (l % 864e5 + 864e5) % 864e5,
                                        C = _(x / 36e5) % 24,
                                        S = _(x / 6e4) % 60,
                                        E = _(x / 1e3) % 60,
                                        T = x % 1e3
                                    } else
                                        h = l.getUTCFullYear(),
                                        b = l.getUTCMonth(),
                                        w = l.getUTCDate(),
                                        C = l.getUTCHours(),
                                        S = l.getUTCMinutes(),
                                        E = l.getUTCSeconds(),
                                        T = l.getUTCMilliseconds();
                                    l = (0 >= h || h >= 1e4 ? (0 > h ? "-" : "+") + A(6, 0 > h ? -h : h) : A(4, h)) + "-" + A(2, b + 1) + "-" + A(2, w) + "T" + A(2, C) + ":" + A(2, S) + ":" + A(2, E) + "." + A(3, T) + "Z"
                                } else
                                    l = null;
                            if (n && (l = n.call(e, t, l)),
                            null === l)
                                return "null";
                            if (f = a.call(l),
                            f == v)
                                return "" + l;
                            if (f == g)
                                return l > -1 / 0 && 1 / 0 > l ? "" + l : "null";
                            if (f == m)
                                return j("" + l);
                            if ("object" == typeof l) {
                                for (O = u.length; O--; )
                                    if (u[O] === l)
                                        throw TypeError();
                                if (u.push(l),
                                B = [],
                                I = p,
                                p += c,
                                f == y) {
                                    for (R = 0,
                                    O = l.length; O > R; R++)
                                        P = q(R, l, n, o, c, p, u),
                                        B.push(P === s ? "null" : P);
                                    N = B.length ? c ? "[\n" + p + B.join(",\n" + p) + "\n" + I + "]" : "[" + B.join(",") + "]" : "[]"
                                } else
                                    i(o || l, function(t) {
                                        var e = q(t, l, n, o, c, p, u);
                                        e !== s && B.push(j(t) + ":" + (c ? " " : "") + e)
                                    }),
                                    N = B.length ? c ? "{\n" + p + B.join(",\n" + p) + "\n" + I + "}" : "{" + B.join(",") + "}" : "{}";
                                return u.pop(),
                                N
                            }
                        };
                        u.stringify = function(t, e, n) {
                            var o, r, i, s;
                            if ("function" == typeof e || "object" == typeof e && e)
                                if ((s = a.call(e)) == h)
                                    r = e;
                                else if (s == y) {
                                    i = {};
                                    for (var c, p = 0, u = e.length; u > p; c = e[p++],
                                    s = a.call(c),
                                    (s == m || s == g) && (i[c] = 1))
                                        ;
                                }
                            if (n)
                                if ((s = a.call(n)) == g) {
                                    if ((n -= n % 1) > 0)
                                        for (o = "",
                                        n > 10 && (n = 10); o.length < n; o += " ")
                                            ;
                                } else
                                    s == m && (o = n.length <= 10 ? n : n.slice(0, 10));
                            return B("", (c = {},
                            c[""] = t,
                            c), r, i, o, "", [])
                        }
                    }
                    if (!n("json-parse")) {
                        var P, R, O = String.fromCharCode, I = {
                            92: "\\",
                            34: '"',
                            47: "/",
                            98: "\b",
                            116: " ",
                            110: "\n",
                            102: "\f",
                            114: "\r"
                        }, N = function() {
                            throw P = R = null,
                            SyntaxError()
                        }, U = function() {
                            for (var t, e, n, o, r, i = R, s = i.length; s > P; )
                                switch (r = i.charCodeAt(P)) {
                                case 9:
                                case 10:
                                case 13:
                                case 32:
                                    P++;
                                    break;
                                case 123:
                                case 125:
                                case 91:
                                case 93:
                                case 58:
                                case 44:
                                    return t = b ? i.charAt(P) : i[P],
                                    P++,
                                    t;
                                case 34:
                                    for (t = "@",
                                    P++; s > P; )
                                        if (r = i.charCodeAt(P),
                                        32 > r)
                                            N();
                                        else if (92 == r)
                                            switch (r = i.charCodeAt(++P)) {
                                            case 92:
                                            case 34:
                                            case 47:
                                            case 98:
                                            case 116:
                                            case 110:
                                            case 102:
                                            case 114:
                                                t += I[r],
                                                P++;
                                                break;
                                            case 117:
                                                for (e = ++P,
                                                n = P + 4; n > P; P++)
                                                    r = i.charCodeAt(P),
                                                    r >= 48 && 57 >= r || r >= 97 && 102 >= r || r >= 65 && 70 >= r || N();
                                                t += O("0x" + i.slice(e, P));
                                                break;
                                            default:
                                                N()
                                            }
                                        else {
                                            if (34 == r)
                                                break;
                                            for (r = i.charCodeAt(P),
                                            e = P; r >= 32 && 92 != r && 34 != r; )
                                                r = i.charCodeAt(++P);
                                            t += i.slice(e, P)
                                        }
                                    if (34 == i.charCodeAt(P))
                                        return P++,
                                        t;
                                    N();
                                default:
                                    if (e = P,
                                    45 == r && (o = !0,
                                    r = i.charCodeAt(++P)),
                                    r >= 48 && 57 >= r) {
                                        for (48 == r && (r = i.charCodeAt(P + 1),
                                        r >= 48 && 57 >= r) && N(),
                                        o = !1; s > P && (r = i.charCodeAt(P),
                                        r >= 48 && 57 >= r); P++)
                                            ;
                                        if (46 == i.charCodeAt(P)) {
                                            for (n = ++P; s > n && (r = i.charCodeAt(n),
                                            r >= 48 && 57 >= r); n++)
                                                ;
                                            n == P && N(),
                                            P = n
                                        }
                                        if (r = i.charCodeAt(P),
                                        101 == r || 69 == r) {
                                            for (r = i.charCodeAt(++P),
                                            (43 == r || 45 == r) && P++,
                                            n = P; s > n && (r = i.charCodeAt(n),
                                            r >= 48 && 57 >= r); n++)
                                                ;
                                            n == P && N(),
                                            P = n
                                        }
                                        return +i.slice(e, P)
                                    }
                                    if (o && N(),
                                    "true" == i.slice(P, P + 4))
                                        return P += 4,
                                        !0;
                                    if ("false" == i.slice(P, P + 5))
                                        return P += 5,
                                        !1;
                                    if ("null" == i.slice(P, P + 4))
                                        return P += 4,
                                        null;
                                    N()
                                }
                            return "$"
                        }, L = function z(t) {
                            var e, n;
                            if ("$" == t && N(),
                            "string" == typeof t) {
                                if ("@" == (b ? t.charAt(0) : t[0]))
                                    return t.slice(1);
                                if ("[" == t) {
                                    for (e = []; t = U(),
                                    "]" != t; n || (n = !0))
                                        n && ("," == t ? (t = U(),
                                        "]" == t && N()) : N()),
                                        "," == t && N(),
                                        e.push(z(t));
                                    return e
                                }
                                if ("{" == t) {
                                    for (e = {}; t = U(),
                                    "}" != t; n || (n = !0))
                                        n && ("," == t ? (t = U(),
                                        "}" == t && N()) : N()),
                                        ("," == t || "string" != typeof t || "@" != (b ? t.charAt(0) : t[0]) || ":" != U()) && N(),
                                        e[t.slice(1)] = z(U());
                                    return e
                                }
                                N()
                            }
                            return t
                        }, D = function(t, e, n) {
                            var o = M(t, e, n);
                            o === s ? delete t[e] : t[e] = o
                        }, M = function(t, e, n) {
                            var o, r = t[e];
                            if ("object" == typeof r && r)
                                if (a.call(r) == y)
                                    for (o = r.length; o--; )
                                        D(r, o, n);
                                else
                                    i(r, function(t) {
                                        D(r, t, n)
                                    });
                            return n.call(t, e, r)
                        };
                        u.parse = function(t, e) {
                            var n, o;
                            return P = 0,
                            R = "" + t,
                            n = L(U()),
                            "$" != U() && N(),
                            P = R = null,
                            e && a.call(e) == h ? M((o = {},
                            o[""] = n,
                            o), "", e) : n
                        }
                    }
                }
                c && t(function() {
                    return u
                })
            }(this)
        }
        , {}],
        48: [function(t, e) {
            function n(t, e) {
                var n = [];
                e = e || 0;
                for (var o = e || 0; o < t.length; o++)
                    n[o - e] = t[o];
                return n
            }
            e.exports = n
        }
        , {}]
    }, {}, [1])(1)
}),
window.console = window.console || {
    log: function() {},
    error: function() {},
    warn: function() {}
},
function(t, e, o) {
    function r(t) {
        var e, n = X, o = jt.extend({
            color: "#307AE8",
            isInvite: !0,
            onlineText: Ut.g("tips.callAgent"),
            offlineText: Ut.g("tips.leaveMsg")
        }, et ? {
            mode: "blank",
            pos_flag: "crb",
            css: {
                "margin-top": "18px",
                "margin-bottom": "18px",
                "margin-left": "18px",
                "margin-right": "18px"
            }
        } : {
            mode: "inner",
            pos_flag: "hrb",
            css: {
                "margin-top": "3px",
                "margin-bottom": "3px",
                "margin-left": "30px",
                "margin-right": "30px"
            }
        });
        if (n.code || n.link) {
            et && jt.extend(n, n.mobile),
            n.pop = n.pop || {},
            n.panel = n.panel || {},
            n.visitor_no = n.visitor_no || {},
            e = jt.urlParams(n.link),
            t && (et && jt.extend(t, t.mobile),
            n.pop = jt.extend(t.pop || {}, n.pop),
            n.panel = jt.extend(t.panel || {}, n.panel),
            n.visitor_no = jt.extend(t.visitor_no || {}, n.visitor_no),
            n = jt.extend(t, n)),
            n = jt.extend(o, n, e),
            "srb" === n.pos_flag && (n.pos_flag = "hrb"),
            "srm" === n.pos_flag && (n.pos_flag = "vrm");
            var r = location.href.indexOf(J + "/im_client/preview") > -1
              , i = e
              , s = {}
              , a = "";
            if (G ? (G.split(".")[1] || "").indexOf(location.host.split(".")[1]) == -1 && (jt.store("first_access", G),
            jt.store("first_url", location.href),
            a = location.href) : (jt.store("first_access", ""),
            jt.store("first_url", location.href),
            a = location.href),
            jt.extend(i, {
                cur_title: ft,
                web_plugin_id: W
            }),
            n.uba)
                for (var c in n.uba)
                    ["app_key"].indexOf(c) > -1 && (i["uba[" + c + "]"] = encodeURIComponent(n.uba[c]));
            if (!r) {
                var u = n.src_url ? encodeURIComponent(n.src_url) : jt.store("first_access") || G
                  , l = n.cur_url ? encodeURIComponent(n.cur_url) : Y
                  , f = encodeURIComponent(n.pre_url || jt.store("first_url") || a);
                jt.extend(i, {
                    src_url: u,
                    cur_url: l,
                    pre_url: f
                })
            }
            return n.linkParams = i,
            X = n,
            p({
                linkParams: i,
                feedParams: s
            }),
            n
        }
    }
    function i(t) {
        St.id = t.agent_id,
        St.group_id = t.group_id,
        St.avatar = J + "/im_client/images/default_head.png"
    }
    function s() {
        if (G) {
            var t = jt.urlParams(decodeURIComponent(G)) || {}
              , e = jt.urlParams(decodeURIComponent(X.src_url)) || {};
            return t.xst || e.xst || ""
        }
        return ""
    }
    function a(t) {
        var e = X.customer;
        if (e && e.nonce && e.timestamp && e.web_token && e.signature)
            return t && t();
        var n, o = s();
        return o ? (jt.jsonp(J + "/im/generate_webtoken_sign?xst=" + o, function(e) {
            return n = !0,
            e && e.signature && e.nonce && e.timestamp && e.web_token && e.customer_token && (X.customer = {
                signature: e.signature,
                nonce: e.nonce,
                timestamp: e.timestamp,
                web_token: e.web_token,
                customer_token: e.customer_token
            },
            X.xst = o),
            t && t()
        }),
        void setTimeout(function() {
            !n && t && t(),
            n = !0
        }, 2e3)) : (n = !0,
        t && t())
    }
    function c(t, e) {
        var n = X.link
          , o = X.customer || {}
          , r = X.ticket || {}
          , i = X.product || {}
          , s = l(o)
          , a = f(X.im_client_valid)
          , c = h(i)
          , p = X.robot || {}
          , u = X.encrypt || !1;
        X.session_key && (n += "&session_key=" + X.session_key),
        St.id && (n += "&agent_id=" + St.id),
        St.group_id && (n += "&group_id=" + St.group_id),
        Z && (n += "&udesk_wd=" + Z),
        V && (n += "&_INVITE_USER_KEY=" + V),
        St && !St.online && (n += "&free=noAgent"),
        X.h5push && (n += "&h5push=" + X.h5push),
        X.h5mode && (n += "&udesk_h5mode=1"),
        (X.hide_product || X.udesk_hide_product) && (n += "&udesk_hide_product=1");
        for (var d in o) {
            var g = o[d] || ""
              , m = d && "nonce" !== d && "timestamp" !== d && "web_token" !== d && "signature" !== d && "encryption_algorithm" !== d;
            m && (n += "&" + d + "=" + encodeURIComponent(g))
        }
        for (var d in r) {
            var y = r[d] || "";
            d && (n += "&" + d + "=" + encodeURIComponent(y))
        }
        for (var d in p)
            n += "&robot_" + d + "=" + p[d];
        if (n = n + s + a + c,
        "autoInvite" === t && (n += "&sender=sys"),
        X.xst && (n += "&xst=" + X.xst),
        u && e) {
            var v = ""
              , b = n.split("?")[1];
            b && (v = jt.encodeBase64(encodeURIComponent(b)),
            n = n.split("?")[0] + "?ud$" + v)
        }
        return n
    }
    function p(t) {
        t = t || {};
        var e, n = X, o = J + "/im_client" + (n.noCDN ? "_nocdn" : "") + "/", r = o + "feedback.html", i = jt.extend(jt.urlParams(n.link), n.linkParams, t.linkParams), s = jt.extend({}, t.feedParams);
        n.channel && (i.channel = n.channel),
        n.language && (i.language = n.language,
        s.language = n.language),
        "inner" === n.mode && (i.currentMode = n.mode,
        s.currentMode = n.mode),
        o += "?" + jt.urlString(i),
        e = jt.urlString(s),
        e && (r += "?" + e),
        jt.extend(n, {
            link: o,
            feedbackLink: r
        })
    }
    function u() {
        var t = {}
          , e = X.pop.direction || "top";
        return t[e] = !0,
        t
    }
    function l(t) {
        var e = "";
        return t.nonce && (e += "&nonce=" + t.nonce),
        t.timestamp && (e += "&timestamp=" + t.timestamp),
        t.web_token && (e += "&web_token=" + t.web_token),
        t.signature && (e += "&signature=" + t.signature),
        t.encryption_algorithm && (e += "&encryption_algorithm=" + t.encryption_algorithm),
        e
    }
    function f(t) {
        if (!t)
            return "";
        var e = "";
        return t.v_nonce && (e += "&v_nonce=" + t.v_nonce),
        t.v_timestamp && (e += "&v_timestamp=" + t.v_timestamp),
        t.v_signature && (e += "&v_signature=" + t.v_signature),
        e
    }
    function h(t) {
        var e = "";
        for (var n in t)
            e += "&product_" + n + "=" + encodeURIComponent(t[n]);
        return e
    }
    function d(t) {
        jt.jsonp(J + "/agents/free?im_web_plugin_id=" + (W || "") + "&session_key=" + (X.session_key || ""), function(e) {
            St.online = !!e.available,
            nt = !!e.chatting,
            t && t()
        })
    }
    function g() {
        if (St.online && Rt.autoGen) {
            var t = Rt.imgEl;
            if (t)
                X.onlineImgUrl && (t.src = X.onlineImgUrl);
            else {
                var e = X.pos_flag || []
                  , n = e[0];
                if ("v" === n) {
                    var o = X.onlineText.replace(/^\s+|\s+$/g, "").replace(/ +/g, '<b style="display:inline-block;height:5px;line-height:5px;">&nbsp;</b>');
                    Bt.html(Rt.textEl, o || X.onlineText)
                } else
                    Bt.text(Rt.textEl, X.onlineText)
            }
        }
    }
    function y() {
        Ot.loadSrc("autoInvite"),
        At ? jt.store("on_auto_chat") || (jt.store("on_auto_chat", +new Date),
        Rt.clickHandler("autoInvite")) : Rt.clickHandler("autoInvite")
    }
    function v() {
        if (At) {
            var t = jt.store("on_auto_chat") || 0
              , e = +new Date - t;
            e > 60 * parseInt(At) * 1e3 && jt.store("on_auto_chat", "")
        }
    }
    function b(t, e) {
        try {
            var n = navigator.mimeTypes;
            for (var o in n)
                if (n[o][t] == e)
                    return !0;
            return !1
        } catch (r) {
            return !1
        }
    }
    function _(t) {
        var e, n = X || {}, o = F + "key?_=";
        if (n.isInvite && (o += "&is_invite=1"),
        n.desc && (o += "&desc=" + n.desc),
        V && (o += "&key=" + V),
        o += "&" + Q + "&title=" + ft + "&scaleScreen=" + (window.screen.width + "*" + window.screen.height),
        wt.indexOf("chrome") > -1) {
            var r = b("type", "application/vnd.chromium.remoting-viewer");
            r && (o += "&browser_name=360")
        }
        jt.jsonp(o, function(n) {
            !e && t && t(n),
            e = !0
        }),
        setTimeout(function() {
            !e && t && t(),
            e = !0
        }, 2e3)
    }
    function w(t) {
        var e = X.customer || {}
          , n = J + "/spa1/im_web_plugins/" + (W || 0) + "/out_config?company_code=" + X.code + "&language=" + (X.language || "") + "&session_key=" + (X.session_key || "");
        e.nonce && e.timestamp && e.web_token && e.signature && (n += "&nonce=" + e.nonce + "&timestamp=" + e.timestamp + "&web_token=" + e.web_token + "&signature=" + e.signature,
        e.encryption_algorithm && (n = n + "&encryption_algorithm=" + e.encryption_algorithm)),
        X.group_id && (n += "&_log_group_id=" + X.group_id),
        X.agent_id && (n += "&_log_agent_id=" + X.agent_id),
        jt.jsonp(n, function(e) {
            e = e || {},
            vt = e.offline || {},
            Et.window = e.window,
            Et.im_client_valid_enable = e.im_client_valid_enable,
            Et.vistor = e.vistor || {},
            Tt.config = e,
            t(e.data)
        })
    }
    function k() {
        return Ot && Ot.iframeEl ? Ot.iframeEl.contentWindow : null
    }
    function x(t, e, n) {
        var o = k();
        t = t || "chatting";
        var r = {
            type: t,
            agent_id: St.id
        };
        e && (r.chat_creator = "agent"),
        st && (r.invited = !0),
        n && (r.reload = !0);
        try {
            o ? jt.sendMessage(r, o) : setTimeout(function() {
                x(t, e)
            }, 50)
        } catch (i) {}
    }
    function C(e) {
        rt ? "force_chat" === e && x("forceChat", !0) : (rt = !0,
        x("chatting", "force_chat" === e, !0)),
        setTimeout(function() {
            jt.store("on_go_chat", ""),
            jt.store("on_force_chat", "")
        }, 1e4),
        It.stopAutoStrategy(),
        "inner" === X.mode ? (Ot.show(e),
        x("autoSize")) : et ? ("force_chat" === e && tt && tt.emit("force_chatting"),
        a(function() {
            t.location.href = c(e)
        })) : E(e)
    }
    function S(t) {
        x("chatting", !1, !0),
        Ot._show(t),
        x("autoSize")
    }
    function E(t) {
        var e = X.window || {}
          , n = ("" + (e.width || 780)).replace("px", "")
          , o = ("" + (e.height || 560)).replace("px", "");
        if ("force_chat" === t) {
            var r = 100 * Math.ceil(30 * Math.random());
            setTimeout(function() {
                jt.store("on_go_chat") || (jt.store("on_go_chat", +new Date),
                tt && tt.emit("force_chatting"),
                A(n, o))
            }, r)
        } else
            "autoInvite" === t ? A(n, o, t) : A(n, o)
    }
    function A(e, n, r) {
        Rt.clearUnread(!0);
        var i, s = "newtab" === X.mode;
        a(function() {
            i = c(r, !0),
            s ? t.open(i) : t.open(i, "udesk_im", et ? o : "width=" + e + ",height=" + n + ",resizable=yes")
        })
    }
    function T(t, e) {
        if (!t)
            return "";
        e = e || "";
        var n, o = jt.urlParams(t), r = jt.urlParams(e), i = {
            baidu: {
                key: "wd|word"
            },
            bing: {
                key: "q|pq"
            },
            sogou: {
                key: "keyword|query"
            },
            yahoo: {
                key: "p"
            }
        }, s = e.split("/")[2] || "", a = s.split("."), c = a[a.length - 2], p = i[c];
        if (o.udesk_wd)
            return o.udesk_wd;
        if (p) {
            n = p.key.split("|");
            for (var u = 0, l = n.length; u < l; u++)
                if (r[n[u]])
                    return r[n[u]]
        } else if (r.q)
            return r.q;
        return ""
    }
    function j(t) {
        if (t.count) {
            for (var e = t.count || 0, n = t.im_logs || [], o = 0, r = n.length; o < r; o++)
                !function(t) {
                    Lt.push(setTimeout(function() {
                        var o, r = n[t], i = jt.parseJSON(r.content);
                        switch (i.type) {
                        case "redirect":
                        case "timeout":
                            return;
                        case "file":
                        case "audio":
                            o = "［" + Ut.g("tips.file") + "］";
                            break;
                        case "image":
                            o = "［" + Ut.g("tips.image") + "］";
                            break;
                        case "message":
                            o = i.data ? i.data.content : Ut.g("tips.newMsgTitle"),
                            o && o.search("emoji") > -1 && (o = o.replace(/\[emoji([^\].]+)\]/g, '<span class="udesk_im_client_emoji udesk_im_client_emoji$1"></span>'));
                            break;
                        default:
                            o = Ut.g("tips.newMsgTitle")
                        }
                        Rt.unreadHandler({
                            msg: o,
                            type: i.type,
                            count: e
                        })
                    }, 2e3 * t))
                }(o);
            Rt.unreadHandler({
                count: e
            })
        }
    }
    function B(t) {
        var e = t;
        return "string" == typeof t && (e = {},
        e[t] = arguments[1]),
        jt.extend(_t, e)
    }
    function P(t) {
        var e = X.customer || {}
          , n = J + "/spa1/im_user/chatting?company_code=" + X.code + "&language=" + (X.language || "") + "&session_key=" + (X.session_key || "");
        e.nonce && e.timestamp && e.web_token && e.signature && (n += "&nonce=" + e.nonce + "&timestamp=" + e.timestamp + "&web_token=" + e.web_token + "&signature=" + e.signature,
        e.encryption_algorithm && (n = n + "&encryption_algorithm=" + e.encryption_algorithm)),
        X.group_id && (n += "&group_id=" + X.group_id),
        X.agent_id && (n += "&agent_id=" + X.agent_id),
        jt.jsonp(n, function(e) {
            e = e || {},
            t && t(e.chatting)
        })
    }
    function R(t) {
        Nt.eachPushFn(t),
        jt.extend(X, t),
        p(X),
        it || Ot.opened || (rt = !1),
        Ot.loadSrc(),
        mt && "function" == typeof t.onReady && (t.onReady(),
        console.log("onReady", t.onReady))
    }
    function O() {
        var e = "不能为空"
          , n = function(t) {
            t && console.log("[Udesk dataTrace]", t)
        }
          , o = function(t) {
            t = t || {};
            var o = t.type
              , r = t.data
              , i = X.customer || {};
            if (!r)
                return void n("data" + e);
            switch (o) {
            case "product":
                return {
                    url: F + "vistor_data_trace",
                    data: {
                        key: V,
                        code: X.code,
                        type: o,
                        data: encodeURIComponent(JSON.stringify(r))
                    },
                    valid: function() {
                        var t = [];
                        return Tt.config.behavior_trace ? (!r.name && t.push("商品名称:" + e),
                        !t.length || (n(t.join("、")),
                        !1)) : (n("未开通商品浏览轨迹"),
                        !1)
                    }
                };
            case "order":
                return {
                    url: J + "/business_api/v1/web_customer_orders",
                    data: {
                        nonce: i.nonce,
                        timestamp: i.timestamp,
                        web_token: i.web_token,
                        customer_token: i.customer_token,
                        signature: i.signature,
                        encryption_algorithm: i.encryption_algorithm,
                        web_plugin_id: W,
                        order: encodeURIComponent(JSON.stringify(r))
                    },
                    valid: function() {
                        var t = [];
                        return Tt.config.customer_order ? i.signature ? (!r.order_no && t.push("订单编号:" + e),
                        !r.price && t.push("订单金额:" + e),
                        !t.length || (n(t.join("、")),
                        !1)) : (n("请传入客户身份认证请求参数"),
                        !1) : (n("未开通订单事件"),
                        !1)
                    },
                    cb: function(t) {
                        1e3 !== t.code && n(t.code_message)
                    }
                };
            default:
                n("type参数错误")
            }
        }
          , r = {
            init: function() {
                X.manualInit && L()
            },
            setProduct: function(t) {
                t = t || X.product,
                t && jt.sendMessage({
                    type: "setProduct",
                    product: t
                }, Ot.iframeEl.contentWindow)
            },
            showPanel: function() {
                C()
            },
            hidePanel: function() {
                Ot.hide()
            },
            isDrag: function() {
                $(".udesk-client-btn").addClass("drag")
            },
            noDrag: function() {
                $(".udesk-client-btn").removeClass("drag")
            },
            getVisitorNo: function() {
                return gt
            },
            dataTrace: function(t, e) {
                var n = o({
                    type: t,
                    data: e
                });
                n && n.valid(t, e) && jt.jsonp(n.url + "?" + jt.urlString(n.data), function(t) {
                    n.cb && n.cb(t)
                })
            }
        };
        t[t.UdeskApiObject] = function(t) {
            if (t) {
                var e, n = arguments, o = t, s = !0;
                if ("string" == typeof t && r.hasOwnProperty(t))
                    return r[n[0]].apply(null, [].slice.call(n, 1));
                "object" != typeof t && (o = {},
                o[n[0]] = n[1]),
                (o.channel || o.language || o.customer) && (e = !0),
                (o.agent_id || o.group_id) && (yt ? (s = !1,
                P(function(t) {
                    t ? (delete o.group_id,
                    delete o.agent_id,
                    console.warn("已经分配客服，不能再设置agent_id或group_id"),
                    e && R(o)) : (i(o),
                    R(o))
                })) : (i(o),
                e = !0)),
                s && e && R(o)
            }
        }
        ,
        _t = t[t.UdeskApiObject],
        B(r)
    }
    function I() {
        D = jt.isTestENV(),
        M = jt.ifIE(),
        Y = encodeURIComponent(location.href),
        G = encodeURIComponent(jt.getReferrer() || ""),
        ft = encodeURIComponent(e.title) || "",
        headEl = Bt.find("head", e)[0] || e.head || e.getElementsByTagName("head")[0] || {},
        V = jt.store("userkey"),
        ct = Bt.find("body", e)[0] || e.body || {},
        ht = (e.documentElement || ct).clientWidth || 1366,
        dt = (e.documentElement || ct).clientHeight,
        et = ht <= 768,
        V = jt.store("userkey"),
        jt.store("on_go_chat", ""),
        jt.store("on_force_chat", ""),
        jt.platform({
            iphone: function() {
                et = !0
            }
        }),
        Z = T(Y, decodeURIComponent(jt.store("first_access") || G || ""));
        var t = {};
        if (_t && jt.each(_t.d, function(e) {
            var n = e[0];
            "object" != typeof e[0] && (n = {},
            n[e[0]] = e[1]),
            Nt.eachPushFn(n),
            jt.extend(t, n)
        }),
        t.link) {
            var n = jt.parseUrl(t.link)
              , o = jt.urlParams(t.link);
            n.protocol && (kt = n.protocol),
            J = kt + "//" + n.host,
            W = o.web_plugin_id
        }
        t.manualInit = t.manualInit || t.manueInit || !1,
        At = t.auto_invite_interval,
        X = t
    }
    function N() {
        var t = document.createElement("link")
          , e = J + "/im_client/css/ui/emotion.css";
        t.type = "text/css",
        t.rel = "stylesheet",
        t.href = e,
        headEl.appendChild(t);
        var n = document.createElement("style")
          , o = 'url("' + J + '/im_client/images/im-emoji-big-1.png")'
          , r = "#udesk_pop_dialog .udesk_im_client_emoji { background-image: " + o + "}";
        n.type = "text/css",
        n.rel = "stylesheet";
        try {
            n.appendChild(document.createTextNode(r))
        } catch (i) {
            n.styleSheet.cssText = r
        }
        headEl.appendChild(n)
    }
    function U() {
        I(),
        v();
        var t = function(t) {
            var e = r(t)
              , n = Et.vistor || {};
            i(e),
            Q = "code=" + (e.code || "") + "&url=" + Y + "&referrer=" + (e.src_url || G) + "&keyword=" + Z,
            z = "https:" === kt ? "6002" : "6001",
            q = (D ? J.replace(kt + "//", "") : "basevistor.udesk.cn") + ":" + z,
            F = (n[kt.replace(":", "")] || kt + "//" + q) + "/customerApi/",
            H = (n["https:" === kt ? "wss" : "ws"] || kt + "//" + q) + "/customer"
        };
        return X.code && X.link ? void w(function(e) {
            t(e),
            O(),
            N();
            var n = X.manualInit;
            e.im_guest_enable && !X.noVisitor ? (V && !n && L(),
            _(function(t) {
                t = t || {},
                t.key && (V = t.key,
                jt.store("userkey", V),
                It.init(),
                gt = t.visitor_no,
                Rt.updateVisitorNo(gt)),
                !n && L()
            })) : !n && L(),
            n && (mt = !0,
            Nt.init(),
            Nt.execFn("onReady"))
        }) : void console.log("Udesk嵌入代码配置错误！")
    }
    function L() {
        ot || (ot = !0,
        Bt.ready(function() {
            pt = Bt.createEl({
                id: bt + "container"
            }),
            jt.isEmptyObj(ct) && (ct = Bt.find("body", e)[0] || e.body || {}),
            ct.appendChild(pt),
            Rt.init(),
            Ot.init(),
            Nt.init(),
            V && It.init(),
            j(vt),
            d(function() {
                Ot.loadSrc(),
                g(),
                St.online && It.startAutoStrategy(),
                X.manualInit || (mt = !0,
                Nt.execFn("onReady"))
            })
        }))
    }
    var D, M, q, z, F, H, J, W, X, V, Y, G, Z, Q, tt, et, nt, ot, rt, it, st, at, ct, pt, ut, lt, ft, ht, dt, gt, mt, yt, vt, bt = "udesk_", _t = t[t.UdeskApiObject], wt = navigator.userAgent.toLowerCase(), kt = "file:" === location.protocol ? "http:" : location.protocol, xt = 0, Ct = 999999999, St = {}, Et = {}, At = 0, Tt = {
        config: {}
    };
    if (!t.__udeskApiInit) {
        t.__udeskApiInit = !0;
        var jt = {
            isTestENV: function() {
                return "file:" === location.protocol || /(ud|tiyanudesk|(udesk(.+)?)).com$/i.test(location.host)
            },
            jsonp: function(n, o) {
                if (n) {
                    var r = bt + "jsonp" + xt++;
                    n += (n.indexOf("?") > -1 ? "&" : "?") + "callback=" + r;
                    var i = e.createElement("script");
                    headEl.appendChild(i),
                    t[r] = function(t) {
                        o && o(t)
                    }
                    ,
                    i.src = n,
                    i.onerror = function() {
                        console.log("error"),
                        o && o()
                    }
                }
            },
            replaceTpl: function(t, e) {
                if (!t)
                    return "";
                if (!e)
                    return t;
                var n = t;
                "function" == typeof t && (n = t(e));
                for (var o in e)
                    n = n.replace(new RegExp("{" + o + "}","gm"), e[o] || "");
                return n
            },
            parseJSON: function(e) {
                try {
                    return t.JSON.parse(e)
                } catch (n) {}
                return e
            },
            extend: function(t) {
                return t ? (jt.each(arguments, function(e, n) {
                    if (n > 0 && e)
                        for (var o in e)
                            t[o] = e[o]
                }),
                t) : t
            },
            each: function(t, e) {
                if (t) {
                    var n = t.length;
                    if (n !== o)
                        for (var r = 0; r < n && !1 !== e(t[r], r); r++)
                            ;
                    else
                        for (var i in t)
                            if (!1 === e(t[i], i))
                                break
                }
            },
            isEmptyObj: function(t) {
                if (!t)
                    return !1;
                for (var e in t)
                    return !1;
                return !0
            },
            getReferrer: function() {
                var e;
                try {
                    e = t.top.document.referrer
                } catch (n) {
                    try {
                        e = t.parent.document.referrer
                    } catch (n) {}
                }
                if (e || (e = document.referrer),
                !e && t.opener)
                    try {
                        e = t.opener.location.href
                    } catch (n) {}
                return e || ""
            },
            messageListener: function(e) {
                t.addEventListener ? t.addEventListener("message", function(t) {
                    var n = jt.parseJSON(t.data) || {};
                    e && e(n)
                }) : t.attachEvent("onmessage", function(t) {
                    var n = jt.parseJSON(t.data) || {};
                    e && e(n)
                })
            },
            sendMessage: function(t, e) {
                try {
                    t = JSON.stringify(t) || "",
                    e.postMessage(t, J)
                } catch (n) {
                    console.log("sendMessage失败")
                }
            },
            store: function Dt(e, n) {
                e = "UDESK_" + e;
                var Dt = t.localStorage;
                if (Dt)
                    try {
                        if (n === o)
                            return Dt[e] || "";
                        Dt[e] = n || ""
                    } catch (r) {}
            },
            sessionStore: function(e, n) {
                e = "UDESK_" + e;
                var r = t.sessionStorage;
                if (r)
                    try {
                        if (n === o)
                            return r[e] || "";
                        r[e] = n || ""
                    } catch (i) {}
            },
            storageListener: function(e) {
                try {
                    t.addEventListener ? t.addEventListener("storage", function(t) {
                        e && e(t)
                    }) : document.attachEvent && !K.Browser.opera ? document.attachEvent("onstorage", function(t) {
                        e && e(t)
                    }) : t.attachEvent("onstorage", function(t) {
                        e && e(t)
                    })
                } catch (n) {}
            },
            urlParams: function(t) {
                var e, n = {};
                if (!t)
                    return n;
                if (e = t.match(new RegExp("[?&][^?&]+=[^?&]+","g")))
                    for (var o = 0, r = e.length; o < r; o++) {
                        var i, s, a;
                        try {
                            i = e[o].substring(1).split("="),
                            s = decodeURIComponent(i[0]),
                            a = decodeURIComponent(i[1]),
                            n[s] = a
                        } catch (c) {
                            i && i[0] && (n[i[0]] = i[1] || "")
                        }
                    }
                return n
            },
            urlString: function(t, e) {
                var n = "";
                if (t)
                    for (var o in t)
                        n += "&" + o + "=" + (e ? encodeURIComponent(t[o] || "") : t[o] || "");
                return n ? n.substring(1) : ""
            },
            parseUrl: function(t) {
                t = t || "";
                var e = t.split("//")
                  , n = e[0] || ""
                  , o = (e[1] || "").split("/")[0];
                return {
                    protocol: n,
                    host: o
                }
            },
            ifIE: function(t, e) {
                var n = document.createElement("b");
                return n.innerHTML = "<!--[if " + (e || "") + " IE " + (t || "") + "]><i></i><![endif]-->",
                1 === n.getElementsByTagName("i").length
            },
            platform: function(t) {
                if (t) {
                    for (var e, n, o, r = new RegExp("(android|iphone|ipod|ios|ipad|webkit|windows phone|micromessenger)","g"); null != (n = r.exec(wt)); )
                        e = !0,
                        o = n[1],
                        t[o] && t[o](),
                        t.ios && /iphone|ipod|ipad/.test(o) && t.ios(),
                        t.wp && /windows phone/.test(o) && t.wp(),
                        t.weixin && /micromessenger/.test(o) && t.weixin();
                    !e && t.others && t.others()
                }
            },
            isRealMob: function() {
                var t = !1;
                return this.platform({
                    ios: function() {
                        t = !0
                    },
                    android: function() {
                        t = !0
                    },
                    wp: function() {
                        t = !0
                    }
                }),
                t
            },
            encodeBase64: function(t) {
                var e, n, o, r, i, s, a, c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", p = "", u = 0;
                for (t = this._utf8_encode(t); u < t.length; )
                    e = t.charCodeAt(u++),
                    n = t.charCodeAt(u++),
                    o = t.charCodeAt(u++),
                    r = e >> 2,
                    i = (3 & e) << 4 | n >> 4,
                    s = (15 & n) << 2 | o >> 6,
                    a = 63 & o,
                    isNaN(n) ? s = a = 64 : isNaN(o) && (a = 64),
                    p = p + c.charAt(r) + c.charAt(i) + c.charAt(s) + c.charAt(a);
                return p
            },
            _utf8_encode: function(t) {
                t = t.replace(/\r\n/g, "\n");
                for (var e = "", n = 0; n < t.length; n++) {
                    var o = t.charCodeAt(n);
                    o < 128 ? e += String.fromCharCode(o) : o > 127 && o < 2048 ? (e += String.fromCharCode(o >> 6 | 192),
                    e += String.fromCharCode(63 & o | 128)) : (e += String.fromCharCode(o >> 12 | 224),
                    e += String.fromCharCode(o >> 6 & 63 | 128),
                    e += String.fromCharCode(63 & o | 128))
                }
                return e
            },
            aryFindKeys: function(t, e) {
                if (!t && !e)
                    return !1;
                for (var o = 0, r = e.length; o < r; o++) {
                    var i = e[o]
                      , s = document.querySelectorAll(i);
                    for (m = 0,
                    n = s.length; m < n; m++)
                        if (s[m] === t)
                            return !0
                }
                return !1
            },
            assign: function(t, e) {
                "use strict";
                if (null === t || t === o)
                    throw new TypeError("Cannot convert undefined or null to object");
                for (var n = Object(t), r = 1; r < arguments.length; r++) {
                    var i = arguments[r];
                    if (null !== i && i !== o)
                        for (var s in i)
                            Object.prototype.hasOwnProperty.call(i, s) && (n[s] = i[s])
                }
                return n
            }
        }
          , Bt = {
            _isReady: !1,
            _readyList: [],
            ready: function(t) {
                if (this._isReady)
                    return t && t();
                if (!e.body)
                    return t && this._readyList.push(t),
                    setTimeout(function() {
                        Bt.ready()
                    });
                var n = this._readyList;
                this._isReady = !0;
                for (var o = 0, r = n.length; o < r; o++)
                    n[o]();
                t && t(),
                n.length = 0
            },
            find: function(t, e) {
                return (e || pt).querySelectorAll(t) || []
            },
            createEl: function(t, n) {
                "object" == typeof t && (n = t,
                t = ""),
                n = n || {};
                var o = e.createElement(t || "div")
                  , r = n.css;
                delete n.css;
                for (var i in n)
                    o[i] = n[i];
                return r && Bt.css(o, r),
                o
            },
            removeEl: function(t, e) {
                var n = this.find(t, e);
                jt.each(n, function(t) {
                    t.parentNode.removeChild(t)
                })
            },
            hasClass: function(t, e) {
                return RegExp("\\b" + (e || "") + "\\b").test(t || "")
            },
            css: function(e, n, r) {
                if (e && n)
                    if ("object" == typeof n)
                        for (var i in n)
                            if (i.indexOf("-") > -1) {
                                var s, a = i.split("-")[0], c = i.split("-")[1];
                                s = a + c.substring(0, 1).toUpperCase() + c.substring(1),
                                e.style[s] = n[i]
                            } else
                                e.style[i] = n[i];
                    else {
                        if (r === o) {
                            if (r = (t.getComputedStyle ? t.getComputedStyle(e, null) : e.currentStyle)[n] || "",
                            "auto" === r)
                                return 0;
                            if ("px" === r.slice(r.length - 2)) {
                                var p = parseFloat(r);
                                return isNaN(p) ? r : p
                            }
                            return r
                        }
                        e.style[n] = r
                    }
            },
            css3: function(t) {
                var e = "";
                return jt.each((t || "").split(";"), function(t) {
                    t && (e += t + ";",
                    jt.each(["-webkit-", "-moz-", "-ms-", "-o-"], function(n) {
                        e += n + t + ";"
                    }))
                }),
                e
            },
            cssJoin: function(t, e) {
                var n = {};
                if (t) {
                    e = (e || "").split(",");
                    for (var o = 0, r = e.length; o < r; o++)
                        n[e[o]] = Bt.css(t, e[o])
                }
                return n
            },
            outerWidth: function(t) {
                var e = 0
                  , n = Bt.cssJoin(t, "width,paddingLeft,paddingRight,borderLeft,borderRight");
                for (var o in n)
                    e += parseFloat(n[o]) || 0;
                return e
            },
            outerHeight: function(t) {
                var e = 0
                  , n = Bt.cssJoin(t, "height,paddingTop,paddingBottom,borderTop,borderBottom");
                for (var o in n)
                    e += parseFloat(n[o]) || 0;
                return e
            },
            getEvent: function(e) {
                return e || t.event
            },
            on: function(t, e, n) {
                t && (t.addEventListener ? t.addEventListener(e, n, !1) : t.attachEvent("on" + e, n))
            },
            un: function(t, e, n) {
                t && (t.removeEventListener ? t.removeEventListener(e, n, !1) : t.detachEvent("on" + e, n))
            },
            stopPropagation: function(t) {
                t = this.getEvent(t),
                t.stopPropagation ? t.stopPropagation() : t.cancelBubble = !0
            },
            getOffset: function(t) {
                for (var e = 0, n = 0; t && t != ct; )
                    e += t.offsetLeft,
                    n += t.offsetTop,
                    t = t.offsetParent;
                return {
                    top: n,
                    left: e
                }
            },
            formatSize: function(t) {
                return t && parseFloat(t) == t ? t + "px" : t
            },
            hide: function(t) {
                t && this.css(t, "display", "none")
            },
            show: function(t, e) {
                e = e || "block",
                t && this.css(t, "display", e)
            },
            text: function(t, e) {
                if (t)
                    return e === o ? "string" == typeof t.textContent ? t.textContent : t.innerText : void ("string" == typeof t.textContent ? t.textContent = e : t.innerText = e)
            },
            html: function(t, e) {
                t && e && (t.innerHTML = e)
            }
        }
          , Pt = function(t) {
            if (t = t || {},
            t.html) {
                t.type = t.type || "pop";
                var e, n, o, r, i, s, a = bt + t.type + "_dialog", c = jt.extend({}, X.pop), p = "pop" === t.type, l = u(), f = "position:fixed;z-index:" + ++Ct + ";font-size:14px;word-break:break-all;word-wrap:break-word;line-height:20px;" + Bt.css3("box-sizing:border-box;box-shadow:1px 1px 8px #eee"), h = {
                    pop: ['<div class="{btnChatClz}" style="{commonStyle}border:1px solid #eee;padding:10px 25px 10px 45px;color:#888;cursor:pointer;background-color:#fff;' + Bt.css3("transition: margin linear .3s") + '">', '    <img src="{avatar}" style="position:absolute;left:8px;width:24px;height:24px;' + Bt.css3("border-radius:12px") + '">', '    <b style="font-size:16px;color:#666;">{title}</b>', '    <div style="margin-left:-25px;margin-top:6px;">{html}</div>', '    <a class="{btnCloseClz}" style="position:absolute;right:6px;top:6px;font-size:18px;cursor:pointer;color:#bbb;text-decoration:none;">&times;</a>', "</div>"].join(""),
                    frame: ['<div style="{commonStyle}top:50%;left:50%;background-color:{frame_color};width:430px;padding:4px;">', '    <a class="{btnCloseClz}" style="position:absolute;right:8px;top:4px;font-size:18px;cursor:pointer;color:#fff;text-decoration:none;">&times;</a>', '    <div style="padding:2px 2px 5px 2px;color:#fff;">{title}</div>', '    <div style="font-size:13px;padding:12px ' + (c.is_custom_bg && c.bg_url ? "106px" : 0) + ' 12px 12px;background:#fff url({bg_url}) no-repeat right bottom;background-size:auto 136px;">', '        <div style="color:{color};min-height:' + (c.is_custom_bg && c.bg_url ? "60px" : 0) + ';line-height:26px;margin-bottom:20px;">{html}</div>', '        <a class="{btnChatClz}" style="display:inline-block;background-color:{btn_color};color:#fff;padding:4px 8px;cursor:pointer;text-decoration:none;">' + Ut.g("tips.beganSession") + "</a>", "    </div>", "</div>"].join(""),
                    mob_frame: ['<div style="{commonStyle}top:50%;left:50%;width:280px;text-align:center;background-color:#fff;border:1px solid #ccc;">', '    <div style="color:#333;padding:10px;">', '        <img src="{avatar}" style="width:24px;height:24px;' + Bt.css3("border-radius:12px") + '">', "        <b>{title}</b>", "    </div>", '    <div style="color:#333;padding:25px;border-top:1px solid #ccc;border-bottom:1px solid #ccc;">', "        {html}", "    </div>", '    <div style="height:50px;line-height:50px;">', '        <a class="{btnCloseClz}" style="float:left;width:49%;color:#307AE8;text-decoration:none;text-align:center;border-right:1px solid #ccc;">' + Ut.g("tips.cancel") + "</a>", '        <a class="{btnChatClz}" style="float:right;width:49%;color:#307AE8;text-decoration:none;text-align:center;">' + Ut.g("tips.beganSession") + "</a>", "    </div>", "</div>"].join("")
                }, d = jt.extend({
                    commonStyle: f,
                    btnCloseClz: bt + "btn_close",
                    btnChatClz: bt + "btn_chat"
                }, c, t);
                d.avatar = t.avatar || St.avatar || "",
                e = jt.replaceTpl(h[t.type], d);
                var g = jt.extend({
                    width: Bt.outerWidth(ut),
                    height: Bt.outerHeight(ut)
                }, Bt.getOffset(ut))
                  , m = function() {
                    var t = jt.extend({
                        top: g.top,
                        left: g.left,
                        width: M ? Bt.outerWidth(o) : Bt.css(o, "width"),
                        height: M ? Bt.outerHeight(o) : Bt.css(o, "height")
                    })
                      , e = X.pop.offset || {}
                      , n = parseFloat(e.top) || 0
                      , r = parseFloat(e.left) || 0
                      , i = 1;
                    jt.ifIE(8) && (t.width = Math.max(t.width, 320),
                    t.height = Math.max(t.height, 70)),
                    l.top && (n -= t.height + 20),
                    l.bottom && (n += g.height + 20),
                    l.left && (r -= t.width + 20),
                    l.right && (r += g.width + 20,
                    i = g.left + g.width + 20),
                    l.top || l.bottom ? (r -= (t.width - g.width) / 2,
                    g.left < t.width ? r = parseFloat(e.left) || 0 : ht - g.left < t.width && (r = ht - g.left - t.width + (parseFloat(e.left) || 0),
                    r -= 5)) : n -= (t.height - g.height) / 2,
                    setTimeout(function() {
                        Bt.css(o, {
                            marginTop: n + "px",
                            marginLeft: (et ? i || r : r) + "px"
                        })
                    }, 50)
                }
                  , y = function() {
                    var t, e, n, r, i, s = X.pop.arrow || {}, a = {}, c = {};
                    r = Bt.formatSize(s.left) || "50%",
                    et && (r = g.left + (g.width + 36) / 2 - 20 + "px"),
                    i = Bt.formatSize(s.top) || "50%",
                    l.top || l.bottom ? (t = l.top ? "bottom" : "top",
                    e = "border" + (l.top ? "Bottom" : "Top") + "Width",
                    n = "border" + (l.top ? "Top" : "Bottom") + "Color",
                    a = {
                        left: r,
                        marginLeft: "-11px"
                    },
                    c = {
                        marginLeft: "-8px"
                    }) : (t = l.left ? "right" : "left",
                    e = "border" + (l.left ? "Right" : "Left") + "Width",
                    n = "border" + (l.left ? "Left" : "Right") + "Color",
                    a = {
                        top: i,
                        marginTop: "-11px"
                    },
                    c = {
                        marginTop: "-8px"
                    }),
                    a[t] = "-10px",
                    a[e] = 0,
                    a[n] = "#eee",
                    c[t] = "2px",
                    c[e] = 0,
                    c[n] = "#fff";
                    var p = Bt.createEl("b", {
                        css: {
                            position: "absolute",
                            border: "10px solid transparent"
                        }
                    })
                      , u = Bt.createEl("b", {
                        css: {
                            position: "absolute",
                            border: "8px solid transparent"
                        }
                    });
                    Bt.css(p, a),
                    Bt.css(u, c),
                    p.appendChild(u),
                    o.appendChild(p)
                }
                  , v = function() {
                    var t = Bt.cssJoin(o, "width,height");
                    Bt.css(o, {
                        marginTop: -(t.height / 2) + "px",
                        marginLeft: -(t.width / 2) + "px"
                    })
                };
                Bt.removeEl("#" + a),
                n = Bt.createEl({
                    id: a,
                    innerHTML: e
                }),
                n.style.position = "absolute",
                o = n.firstChild,
                r = Bt.find("." + d.btnCloseClz, o)[0],
                i = p ? o : Bt.find("." + d.btnChatClz, o)[0],
                p ? (et && (l.left ? s = g.left - 10 + "px" : l.right && (s = ht - g.width - g.left - 30 + "px")),
                Bt.css(o, jt.extend(et ? {
                    width: s ? s : "100%"
                } : {
                    "min-width": "250px",
                    "max-width": "300px"
                }, c.css))) : Bt.css(o, c.css);
                for (var b in g)
                    "auto" === g[b] && (g[b] = 0);
                return $(pt).find(".udesk-client-btn").append(n),
                i.onclick = t.onclick,
                r.onclick = function(e) {
                    Bt.stopPropagation(e),
                    Bt.hide(n),
                    t.onclose && t.onclose()
                }
                ,
                p ? (m(),
                y()) : v(),
                {
                    show: function() {
                        Bt.show(n)
                    },
                    hide: function() {
                        Bt.hide(n)
                    }
                }
            }
        }
          , Rt = {
            _unread: 0,
            baseStyles: {
                btn: ["display:block;position:fixed;" + Bt.css3("box-sizing:border-box;"), "font-size:13px;color:#fff;text-align:center;cursor:pointer;text-decoration:none;", "z-index:" + ++Ct + ";", "width:fit-content;"],
                icon: ["display:block;float:left;width:24px;height:24px;margin:7px 7px 0;"],
                iconSrc: [kt + "//static-ud.udesk.cn/img/msg2@68x66.png"],
                line: ["display:block;float:left;width:1px;height:100%;background-color:rgba(0, 0, 0, .08);", "vertical-align:middle;", "background-color:#000\\9;filter:alpha(opacity=10)\\9;"],
                txt: ["display:block;float:left;height:40px;margin:0 10px;line-height:40px;", "overflow-y:hidden; font-size: 13px; color: #fff;"],
                mob_txt: ["display:block;float:none;height:40px;margin:0 10px;line-height:40px;", "overflow-y:hidden; font-size: 13px; color: #fff;"],
                circle: ["display:none;position:absolute;top:-13px;right:-13px;width:26px;height:26px;", "text-align:center;line-height:26px;font-size:14px;color:#fff;border-radius:15px;", "background-color: #ff3b30;"],
                img_circle: ["display:none;position:absolute;top:-13px;right:-13px;width:26px;height:26px;", "text-align:center;line-height:26px;font-size:14px;color:#fff;border-radius:15px;", "background-color: #ff3b30;"],
                visitor_no: ["position: fixed;z-index: " + Ct + ";color: #fff;text-align: center;font-family: 'Arial Normal', 'Arial';font-size: 13px;"],
                visitor_no_num: []
            },
            abjuctStyle: function() {
                var t = this.baseStyles
                  , e = (X.css || {},
                X.pos_flag || "")
                  , n = e[0]
                  , o = e[1]
                  , r = e[2]
                  , i = X.visitor_no.enable;
                switch ("i" !== n && (t.btn.push("border:1px solid rgba(0, 0, 0, .1);border-bottom:0;box-shadow:0 <0></0> 14px 0 rgba(0, 0, 0, .16);"),
                X.color && t.btn.push("background-color:" + X.color + ";")),
                n) {
                case "h":
                    t.btn.push("height:40px;"),
                    et && t.btn.push("width:100%;");
                    break;
                case "v":
                    t.btn.push("width:40px;height:auto;padding:10px 0px;"),
                    t.icon.push("margin:0 7px 10px;"),
                    t.line.push("width:100%;height:1px;"),
                    t.circle.push("left:-13px;"),
                    t.txt.push("width:40px;height:auto;word-break:break-all;word-wrap:break-word;line-height:20px;letter-spacing:24px;overflow-y:auto;overflow-x:hidden;margin-top:10px;padding-left: 2px;"),
                    t.mob_txt.push("width:40px;height:auto;float:left;word-break:break-all;word-wrap:break-word;line-height:20px;letter-spacing:24px;overflow-y:auto;overflow-x:hidden;margin-top:10px;padding-left: 2px;");
                    break;
                case "c":
                    t.btn.push("width:40px;height:40px;border-radius:20px;"),
                    t.line.push("display:none;"),
                    t.txt.push("display:none;"),
                    t.iconSrc.length = 0,
                    t.iconSrc.push(kt + "//static-ud.udesk.cn/img/msg@48x48.png");
                    break;
                case "i":
                    t.img_circle.push("left:-13px;top:-13px;right:auto;bottom:auto;")
                }
                switch (o) {
                case "l":
                    t.btn.push("left:0;");
                    break;
                case "r":
                    t.btn.push("right:0;")
                }
                switch (r) {
                case "t":
                    t.btn.push("top:0;");
                    break;
                case "b":
                    t.btn.push("bottom:" + (et && i ? "30px" : "0") + ";")
                }
                var s = X.visitor_no.color
                  , a = X.visitor_no.pos_flag || ""
                  , c = a[0]
                  , p = a[1];
                if (s || (s = et ? "#307AE8" : "#649ae8"),
                t.visitor_no.push("background-color:" + s + ";"),
                et)
                    t.visitor_no.push("width:100%;bottom:0;font-weight:bold;padding:5px 0;");
                else {
                    switch (t.visitor_no.push("width: 70px;height: 70px;line-height: 22px;border-radius: 2px;"),
                    t.visitor_no_num.push("font-size: 20px;margin-top: 14px;display: block;"),
                    c) {
                    case "l":
                        t.visitor_no.push("left:0;");
                        break;
                    case "r":
                        t.visitor_no.push("right:0;")
                    }
                    switch (p) {
                    case "t":
                        t.visitor_no.push("top:0;");
                        break;
                    case "b":
                        t.visitor_no.push("bottom:0;")
                    }
                }
            },
            tryCenter: function(t) {
                var e = X.pos_flag || ""
                  , n = e[0]
                  , o = e[1]
                  , r = e[2]
                  , i = X.visitor_no.pos_flag || ""
                  , s = i[0]
                  , a = i[1]
                  , c = function(e) {
                    var n, i = Bt.cssJoin(e, "width,height,margin-right");
                    Bt.cssJoin(lt, "width,height");
                    "m" === o && Bt.css(t, "left", (ht - parseFloat(i.width)) / 2 + "px"),
                    "m" === r && (n = (dt - parseFloat(i.height)) / 2,
                    Bt.css(t, "top", n + "px")),
                    "m" === s && Bt.css(lt, "left", (ht - parseFloat(i.width)) / 2 + "px"),
                    "m" === a && (n = (dt - parseFloat(i.height)) / 2,
                    !jt.isRealMob() && Bt.css(lt, "top", n + "px"))
                };
                if (c(t),
                "i" === n) {
                    var p = Bt.find("img", t)[0];
                    p.onload = function() {
                        c(p)
                    }
                }
            },
            genVisitorNoHtml: function() {
                var t = this.baseStyles
                  , e = ""
                  , n = Ut.g("tips.visitorNo");
                return gt = gt || "",
                X.im_guest_enable && X.visitor_no.enable && (e = jt.replaceTpl('<div id="{flag}visitor_no" style="{style}">{text}</div>', {
                    flag: bt,
                    style: t.visitor_no.join(""),
                    text: et ? n + "&nbsp<span>" + gt : "</span><b style='" + t.visitor_no_num.join("") + "'><span>" + gt + "</span></b>" + n
                })),
                e
            },
            genHtml: function() {
                var t, e, n = this.baseStyles, o = X.css || {}, r = X.pos_flag || "", i = r[0], s = X.unread_button || {}, a = "";
                if (this.abjuctStyle(),
                "i" !== i)
                    "v" === i && (t = X.offlineText.replace(/^\s+|\s+$/g, "").replace(/ +/g, '<b style="display:inline-block;height:5px;line-height:5px;">&nbsp;</b>')),
                    a = jt.replaceTpl('<span style="{iconStyle}"><img src="{iconSrc}" style="width:100%;height:100%;"/></span><span style="{lineStyle}"></span><span id="{flag}btn_text" style="{txtStyle}">{text}</span><span id="{flag}btn_circle" style="{circleStyle}"></span>', {
                        flag: bt,
                        text: t || X.offlineText || "",
                        iconStyle: n.icon.join(""),
                        iconSrc: n.iconSrc.join(""),
                        lineStyle: n.line.join(""),
                        txtStyle: n[et ? "mob_txt" : "txt"].join(""),
                        circleStyle: n.circle.join("")
                    });
                else if (e = '<img class="buttonImg" src="' + (X.offlineImgUrl || X.onlineImgUrl) + '" style="max-width:' + (o.width ? "unset;" : "200px;"),
                o.width && (e += "width: " + o.width + ";"),
                o.height && (e += "height: " + o.height + ";"),
                e += '">',
                s.enable) {
                    var o = s.css || {};
                    for (var c in o)
                        o[c] ? n.img_circle.push(c + ":" + o[c] + "px;") : n.img_circle.push(c + ":auto;");
                    a = ["<div>", e, '   <span id="' + bt + 'btn_circle" style="' + n.img_circle.join("") + '"></span>', "</div>"].join("")
                } else
                    a = e;
                return a = '<a class="udesk-client-btn" style="' + n.btn.join("") + '">' + a + "</a>",
                a += this.genVisitorNoHtml()
            },
            updateVisitorNo: function(t) {
                if (lt) {
                    var e = Bt.find("span", lt)[0];
                    e.innerText = t
                }
            },
            clickHandler: function(e) {
                try {
                    if ($(".udesk-client-btn").hasClass("drag"))
                        return;
                } catch (n) {
                    console.log("点击弹窗失败", n)
                }
                if ("autoInvite" === e ? C("autoInvite") : C(),
                t && t.uAnalytics) {
                    var o = t.uAnalytics.user().id()
                      , r = t.uAnalytics.user().traits()
                      , i = {
                        system: "im",
                        consult_url: t.location.href
                    };
                    jt.assign(i, r.userAttr),
                    t.uAnalytics.identify(o, i),
                    t.uAnalytics.track("onlineconsultclick")
                }
            },
            clearUnread: function(t) {
                if (this._unread) {
                    try {
                        if (Ot.iframeEl && Ot.iframeEl.contentWindow)
                            jt.sendMessage({
                                type: "clearUnread",
                                content: {
                                    clearHistory: t
                                }
                            }, Ot.iframeEl.contentWindow);
                        else {
                            var e = X.customer;
                            $.post(J + "/spa1/sdk_offline_messages/customer_clear_message", {
                                platform: "web",
                                session_key: X.session_key,
                                web_token: e.web_token,
                                nonce: e.nonce,
                                signature: e.signature,
                                timestamp: e.timestamp,
                                encryption_algorithm: e.encryption_algorithm
                            })
                        }
                        $.each(Lt, function(t, e) {
                            clearTimeout(e)
                        }
                        .bind(this))
                    } catch (n) {
                        console.log("clearUnread失败", n)
                    }
                    this._unread = 0,
                    Bt.hide(this.circleEl),
                    X.noBubble || this.popObj && this.popObj.hide()
                }
            },
            unreadHandler: function(t) {
                if (!Ot.opened || !Ot.uiOpened) {
                    var e = this;
                    if (t.count ? this._unread = t.count : this._unread += 1,
                    Bt.text(this.circleEl, this._unread),
                    Bt.show(this.circleEl),
                    Nt.execFn("onUnread", {
                        count: this._unread
                    }),
                    !X.noBubble && t.msg) {
                        var n = function() {
                            try {
                                if ($(".udesk-client-btn").hasClass("drag"))
                                    return
                            } catch (t) {
                                console.log("点击未读失败", t)
                            }
                            e.clickHandler(),
                            o && o.hide(),
                            e.popObj = !1
                        }
                          , o = Pt({
                            type: "pop",
                            title: St.nick || Ut.g("tips.agent"),
                            avatar: St.avatar,
                            html: t.msg || Ut.g("tips.newMsg"),
                            onclick: n,
                            onclose: function() {
                                e.popObj = !1,
                                e.clearUnread(!0)
                            }
                        });
                        this.popObj = o,
                        ut.onclick = n
                    }
                }
            },
            bindSelector: function(t, n) {
                Bt.on(e, "click", function(e) {
                    e = e || window.event;
                    for (var o = e.target, r = t.split(","), i = !1; o && o !== this; ) {
                        if (jt.aryFindKeys(o, r)) {
                            i = !0;
                            break
                        }
                        o = o.parentNode
                    }
                    i && n && n()
                })
            },
            init: function() {
                var t = this
                  , n = X.selector;
                n && t.bindSelector(n, function() {
                    C()
                });
                var o = Bt.find(X.targetSelector, e)[0];
                X.targetSelector && !o && t.bindSelector(X.targetSelector, function() {
                    t.clickHandler()
                }),
                o || (o = Bt.createEl({
                    id: bt + "btn",
                    innerHTML: this.genHtml()
                }),
                pt.appendChild(o),
                o = Bt.find("a", o)[0],
                lt = Bt.find("#" + bt + "visitor_no")[0],
                Rt.autoGen = !0,
                this.tryCenter(o),
                this.textEl = Bt.find("#" + bt + "btn_text", o)[0],
                this.circleEl = Bt.find("#" + bt + "btn_circle", o)[0],
                this.imgEl = Bt.find(".buttonImg", o)[0],
                Bt.css(o, X.css),
                Bt.css(lt, X.visitor_no.css)),
                o && (this.el = o,
                ut = o,
                ut.onclick = this.clickHandler)
            }
        }
          , Ot = {
            opened: !1,
            uiOpened: !1,
            _baseStyles: {
                panel: ["position:fixed;bottom:-574px;right:60px;z-index:-1;width:364px;height:572px;", "overflow:hidden;display:none;background-color:transparent;", "box-shadow:0px 4px 12px 0px rgba(8,23,26,0.2);", "border-radius: 3px 3px 0px 0px;", "-webkit-overflow-scrolling:touch;", "border:1px solid #ddd\\9;", Bt.css3("transition:bottom 0.3s;")],
                frame: ["width:1px;min-width:100%;*width:100%;height:0;", "border:none;padding:0;margin:0;float:none;background:none;", Bt.css3("transition:height 0.1s;")]
            },
            _createPanel: function(t) {
                var n = this
                  , o = this._baseStyles || {}
                  , r = Bt.createEl({
                    innerHTML: '<div id="' + bt + 'panel" style="' + o.panel.join("") + '"><iframe id="' + bt + 'iframe" frameborder="0" scrolling="no" allowtransparency="true" style="' + o.frame.join("") + '"></iframe></div>'
                });
                pt.appendChild(r.firstChild),
                this.panelEl = e.getElementById(bt + "panel"),
                this.iframeEl = e.getElementById(bt + "iframe"),
                Bt.on(this.iframeEl, "load", function() {
                    n.iframeLoaded = !0,
                    t && t()
                }),
                M && !jt.ifIE(8, "gt") || (this.iframeEl.setAttribute("allowfullscreen", ""),
                this.iframeEl.setAttribute("mozallowfullscreen", ""),
                this.iframeEl.setAttribute("webkitallowfullscreen", "")),
                Bt.css(this.panelEl, X.panel.css)
            },
            _doToggle: function(t) {
                var e = this.panelEl;
                if (Bt.css(e, {
                    display: t ? "block" : "none",
                    visibility: t ? "visible" : "hidden",
                    bottom: t ? "-482px" : 0,
                    zIndex: t ? ++Ct : -1
                }),
                setTimeout(function() {
                    e.style.bottom = t ? 0 : "-482px"
                }, 5),
                t)
                    try {
                        this.sendProduct(),
                        jt.sendMessage({
                            type: "openPanel",
                            preloadData: Et
                        }, this.iframeEl.contentWindow)
                    } catch (n) {
                        console.log(n)
                    }
            },
            _uiCtrl: function(t) {
                var e = this
                  , n = this.iframeEl
                  , o = Rt.el
                  , r = "hide" !== t;
                this.opened = r,
                this.uiOpened = r,
                r ? e.iframeLoaded ? e._doToggle(r) : Bt.on(e.iframeEl, "load", function() {
                    e.iframeLoaded = !0,
                    e._doToggle(r)
                }) : e._doToggle(r),
                Bt.show(r ? n : o),
                Rt.autoGen && Bt.hide(r ? o : n),
                setTimeout(function() {
                    n.style.height = r ? "100%" : "0"
                }, 100),
                Nt.execFn("panel.onToggle", {
                    visible: r
                })
            },
            sendProduct: function() {
                for (var t = 0; t < 5; t++)
                    setTimeout(_t.setProduct, 1e3 * t)
            },
            show: function() {
                var t = this
                  , e = this.iframeEl.contentWindow;
                this._uiCtrl("show"),
                Rt.clearUnread(),
                jt.sessionStore("panel_visible_" + X.session_key, !0);
                try {
                    this.sendProduct(),
                    jt.sendMessage({
                        type: "forceLoadPage"
                    }, e),
                    jt.sendMessage({
                        type: "openPanel"
                    }, e)
                } catch (n) {
                    console.log(n)
                }
                this.start_hide_time && new Date - t.start_hide_time >= 6e5 && (setTimeout(function() {
                    t.loadSrc()
                }, 50),
                t.start_hide_time = null)
            },
            _doToggleOther: function(t) {
                var e = this.panelEl;
                if (Bt.css(e, {
                    display: "none"
                }),
                t)
                    try {
                        this.sendProduct(),
                        jt.sendMessage({
                            type: "openPanel",
                            preloadData: Et
                        }, this.iframeEl.contentWindow)
                    } catch (n) {
                        console.log(n)
                    }
            },
            _uiCtrlOther: function(t) {
                var e = this
                  , n = this.iframeEl
                  , o = Rt.el
                  , r = "hide" !== t;
                this.opened = r,
                this.uiOpened = !1,
                r ? e.iframeLoaded ? e._doToggleOther(this.uiOpened) : Bt.on(e.iframeEl, "load", function() {
                    e.iframeLoaded = !0,
                    e._doToggle(this.uiOpened)
                }) : e._doToggle(this.uiOpened),
                Bt.show(o),
                Rt.autoGen && Bt.hide(n),
                setTimeout(function() {
                    n.style.height = "0"
                }, 100)
            },
            _show: function() {
                var t = this
                  , e = this.iframeEl.contentWindow;
                this._uiCtrlOther("show");
                try {
                    this.sendProduct(),
                    jt.sendMessage({
                        type: "forceLoadPage"
                    }, e),
                    jt.sendMessage({
                        type: "openPanel"
                    }, e)
                } catch (n) {
                    console.log(n)
                }
                this.start_hide_time && new Date - t.start_hide_time >= 6e5 && (setTimeout(function() {
                    t.loadSrc()
                }, 50),
                t.start_hide_time = null)
            },
            hide: function() {
                "inner" === X.mode && (jt.sessionStore("panel_visible_" + X.session_key, ""),
                this._uiCtrl("hide"),
                this.start_hide_time = new Date)
            },
            loadSrc: function(t) {
                var e = this;
                this.iframeEl && a(function() {
                    e.iframeEl.contentWindow.location.replace(c(t))
                })
            },
            init: function() {
                if ("inner" === X.mode) {
                    var t = Tt.config.window.proportion ? 100 - Tt.config.window.proportion : 30;
                    if (Tt.config.window.proportion)
                        var e = "left:0;right:0;bottom:0;top:" + t + "%;height:auto;width:auto;";
                    else
                        var e = "left:0;right:0;bottom:0;top:" + t + "px;height:auto;width:auto;";
                    et && this._baseStyles.panel.push(e),
                    this._createPanel(function() {
                        var t = jt.sessionStore("panel_visible_" + X.session_key)
                          , e = jt.sessionStore("panel_chatting_" + X.session_key);
                        t && !et ? C() : t || et || e && P(function(t) {
                            t && S("hideIframe")
                        })
                    })
                }
            }
        }
          , It = {
            rejected_num: 0,
            agetn_invite: !1,
            init: function() {
                var t = this;
                this._loaded || (this._loaded = !0,
                tt = __udeskIo(H + "?key=" + V, {
                    reconnection: !0,
                    reconnectionDelay: 2e3,
                    reconnectionAttempts: 10
                }),
                tt.on("connect", function() {
                    tt.emit("enter", {
                        key: V,
                        code: X.code
                    })
                }),
                tt.on("reconnect", function() {
                    tt.emit("enter", {
                        key: V,
                        code: X.code
                    })
                }),
                tt.on("invite", function(e) {
                    e && (St.id = e.agent_id,
                    St.group_id = e.group_id),
                    t.stopAutoStrategy(),
                    t.agent_invite = !0,
                    t.show()
                }),
                tt.on("robot_invite", function(t) {
                    t && (St.id = t.agent_id,
                    St.group_id = t.group_id);
                    var e = k();
                    e.removeEventListener("acceptedTransferAgent"),
                    e.removeEventListener("rejectedTransferAgent"),
                    e.addEventListener("acceptedTransferAgent", function() {
                        tt.emit("accepted")
                    }),
                    e.addEventListener("rejectedTransferAgent", function() {
                        tt.emit("rejected")
                    }),
                    jt.sendMessage({
                        type: "transferAgent",
                        agentId: t.agent_id
                    }, e)
                }),
                tt.on("force_chat", function(t) {
                    var e = t.agent_id;
                    t && (X.agent_id = e,
                    X.chat_creator = "agent",
                    St.id = e);
                    var n = {
                        agent_id: e,
                        _timer: +new Date
                    };
                    n = JSON.stringify(n) || "",
                    jt.store("force_chat", n),
                    jt.store("on_force_chat") || (jt.store("on_force_chat", +new Date),
                    C("force_chat"))
                }))
            },
            show: function(t) {
                if (t = t || {},
                ut) {
                    var e, n = this, o = X.pop, r = function() {
                        if (!$(".udesk-client-btn").hasClass("drag")) {
                            if (e)
                                return void Rt.clickHandler();
                            e = !0,
                            st = !0,
                            at && (st = !1),
                            tt.emit("accepted"),
                            n.dialog.hide(),
                            Rt.clickHandler()
                        }
                    }, i = function() {
                        t.before && t.before(),
                        n.dialog ? n.dialog.show() : n.dialog = Pt({
                            type: "frame" === o.type ? et ? "mob_frame" : "frame" : "pop",
                            title: o.title || Ut.g("tips.hello"),
                            html: o.text || Ut.g("tips.onlineContact"),
                            onclick: r,
                            onclose: function() {
                                n.agent_invite && (tt.emit("rejected"),
                                st = !1,
                                n.agent_invite = !1,
                                at = !0),
                                t.close && t.close()
                            }
                        }),
                        t.after && t.after()
                    };
                    i(),
                    ut.onclick = r
                }
            },
            inWorkTime: function(t) {
                $.get(J + "/spa1/schedules/confirm_send_auto_invite", {
                    id: W,
                    current_time: +new Date
                }).always(function(e) {
                    1e3 == e.code && e.result && t && t()
                })
            },
            startAutoStrategy: function() {
                var t = this
                  , e = X.pop;
                if (e.auto_invite && tt) {
                    var n = function() {
                        t.show({
                            isAutoStrategy: !0,
                            close: function() {
                                jt.sessionStore("rejected_num") && (t.rejected_num = jt.sessionStore("rejected_num")),
                                t.rejected_num++,
                                jt.sessionStore("rejected_num", t.rejected_num),
                                t.rejected_num >= parseInt(e.reject_num) ? t.stopAutoStrategy() : o(),
                                clearTimeout(t._autoRecvTimeout)
                            }
                        })
                    }
                      , o = function() {
                        e.interval && (clearInterval(t._showDialogInterval),
                        t._showDialogInterval = setInterval(function() {
                            n()
                        }, 1e3 * parseFloat(e.interval)))
                    };
                    setTimeout(function() {
                        t._stopAuto || jt.sessionStore("rejected_num") >= parseInt(e.reject_num) || (n(),
                        o(),
                        e.auto_recv && e.auto_recv_interval && (t._autoRecvTimeout = setTimeout(function() {
                            y()
                        }, 1e3 * parseFloat(e.auto_recv_interval))))
                    }, 1e3 * (parseFloat(e.delay) || 0))
                }
            },
            stopAutoStrategy: function() {
                this._stopAuto = !0,
                clearTimeout(this._autoRecvTimeout),
                clearInterval(this._showDialogInterval),
                this.dialog && this.dialog.hide()
            },
            sendChattingToAgent: function() {
                tt && tt.emit("chatting")
            }
        }
          , Nt = {
            list: [],
            pushFn: function(t, e) {
                !t || 0 !== t.indexOf("on") && "panel.onToggle" !== t || "function" != typeof e || this.list.push({
                    key: t,
                    fn: e
                })
            },
            eachPushFn: function(t) {
                for (var e in t)
                    if ("object" == typeof t[e])
                        for (var n in t[e])
                            this.pushFn(e + "." + n, t[e][n]);
                    else
                        this.pushFn(e, t[e])
            },
            execFn: function(t, e) {
                for (var n, o = this.list, r = 0, i = o.length; r < i; r++)
                    n = o[r],
                    t === n.key && (n.fn(e),
                    console.log(n.key, r, n.fn))
            },
            init: function() {
                this._isloaded || (this._isloaded = !0,
                jt.messageListener(function(t) {
                    switch (t.type) {
                    case "hidePanel":
                        Ot.hide();
                        break;
                    case "newMsg":
                        t.msg && t.msg.search("emoji") > -1 && (t.msg = t.msg.replace(/\[emoji([^\].]+)\]/g, '<span class="udesk_im_client_emoji udesk_im_client_emoji$1"></span>')),
                        Rt.unreadHandler(t);
                        break;
                    case "clearUnread":
                        Rt.clearUnread();
                        break;
                    case "agent":
                        t.src && (St.avatar = t.src),
                        St.nick = t.nick || "",
                        yt = !0;
                        break;
                    case "chatDone":
                        nt = !1,
                        X.chat_creator = "customer",
                        st = !1,
                        jt.sessionStore("panel_chatting_" + X.session_key, null);
                        break;
                    case "chatting":
                        nt = !0,
                        it = !1,
                        It.sendChattingToAgent(),
                        Ot.start_hide_time = null,
                        jt.sessionStore("panel_chatting_" + X.session_key, !0);
                        break;
                    case "transfer":
                        Ot.sendProduct();
                        break;
                    case "askPanelState":
                        try {
                            it ? jt.sendMessage({
                                type: "queuing",
                                agent_id: St.id,
                                chat_creator: X.chat_creator || "customer"
                            }, Ot.iframeEl.contentWindow) : Ot.opened && (it = !1,
                            jt.sendMessage({
                                type: "chatting",
                                agent_id: St.id,
                                chat_creator: X.chat_creator || "customer",
                                invited: st,
                                reload: !0
                            }, Ot.iframeEl.contentWindow),
                            Ot.opened && Ot.uiOpened && (rt = !0))
                        } catch (n) {}
                        break;
                    case "askReferrer":
                        break;
                    case "queuing":
                        it = !0;
                        break;
                    case "innerInputBlur":
                        var o, r = 1;
                        try {
                            setTimeout(function() {
                                o = e.documentElement.scrollTop || e.body.scrollTop,
                                o -= r,
                                window.scrollTo(0, o),
                                o += r,
                                window.scrollTo(0, o)
                            }, 100)
                        } catch (n) {}
                        break;
                    case "robot_chatting":
                        tt.emit("robot_chatting", {
                            key: V,
                            code: X.code
                        })
                    }
                }),
                jt.storageListener(function(t) {
                    t = t || {},
                    "UDESK_force_chat" === t.key
                }))
            }
        }
          , Ut = {
            "en-us": {
                tips: {
                    beganSession: "Start to chat",
                    online: "Online Consulting",
                    cancel: "Cancel",
                    agent: "Agent",
                    newMsg: "A new message！",
                    hello: "Hello,",
                    onlineContact: "Currently has the personnel of the service online, immediately click consulting",
                    callAgent: "Contact the customer service,consult online",
                    leaveMsg: "Customer service is not at work, please leave a message",
                    visitorNo: "Visitor's ID",
                    file: "File",
                    image: "Image",
                    newMsgTitle: "New message"
                }
            },
            "zh-cn": {
                tips: {
                    beganSession: "开始咨询",
                    online: "在线咨询",
                    cancel: "取消",
                    agent: "客服",
                    newMsg: "您有一条新消息",
                    hello: "您好,",
                    onlineContact: "当前有客服人员在线，立刻点击咨询吧。",
                    callAgent: "联系客服，在线咨询",
                    leaveMsg: "客服下班，请留言",
                    visitorNo: "访客ID",
                    file: "文件",
                    image: "图片",
                    newMsgTitle: "新消息"
                }
            },
            g: function(t, e) {
                var n = X.language || "zh-cn"
                  , o = this[n] || this["zh-cn"];
                t = t || "";
                for (var r = t.split("."), i = o[r[0]], s = 1; s < r.length; s++)
                    "object" == typeof i && (i = i[r[s]] || "");
                return e && i && "object" != typeof i && (i = jt.replaceTpl(i, e)),
                i || ""
            }
        }
          , Lt = [];
        U()
    }
}(window, document);
