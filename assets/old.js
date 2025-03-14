! function (o) {
    "use strict";
    L.Control.BoxZoom = L.Control.extend({
        options: {
            position: "topright",
            title: "Click here then draw a square on the map, to zoom in to an area",
            aspectRatio: null,
            divClasses: "",
            enableShiftDrag: !1,
            iconClasses: "",
            keepOn: !1
        },
        initialize: function (o) {
            L.setOptions(this, o), this.map = null, this.active = !1
        },
        onAdd: function (o) {
            if (this.map = o, this.active = !1, this.controlDiv = L.DomUtil.create("div", "leaflet-control-boxzoom"), this.options.iconClasses || L.DomUtil.addClass(this.controlDiv, "with-background-image"), this.options.divClasses && L.DomUtil.addClass(this.controlDiv, this.options.divClasses), this.controlDiv.control = this, this.controlDiv.title = this.options.title, this.controlDiv.innerHTML = " ", L.DomEvent.addListener(this.controlDiv, "mousedown", L.DomEvent.stopPropagation).addListener(this.controlDiv, "click", L.DomEvent.stopPropagation).addListener(this.controlDiv, "click", L.DomEvent.preventDefault).addListener(this.controlDiv, "click", (function () {
                this.control.toggleState()
            })), this.setStateOff(), this.options.iconClasses) {
                var t = L.DomUtil.create("i", this.options.iconClasses, this.controlDiv);
                t ? (t.style.color = this.options.iconColor || "black", t.style.textAlign = "center", t.style.verticalAlign = "middle") : console.log("Unable to create element for icon")
            }
            return this.options.aspectRatio && (this.map.boxZoom.aspectRatio = this.options.aspectRatio, this.map.boxZoom._onMouseMove = this._boxZoomControlOverride_onMouseMove, this.map.boxZoom._onMouseUp = this._boxZoomControlOverride_onMouseUp), this.controlDiv
        },
        onRemove: function (o) {
            this.options.aspectRatio && (delete this.map.boxZoom.aspectRatio, this.map.boxZoom._onMouseMove = L.Map.BoxZoom.prototype._onMouseMove, this.map.boxZoom._onMouseUp = L.Map.BoxZoom.prototype._onMouseUp)
        },
        toggleState: function () {
            this.active ? this.setStateOff() : this.setStateOn()
        },
        setStateOn: function () {
            L.DomUtil.addClass(this.controlDiv, "leaflet-control-boxzoom-active"), this.active = !0, this.map.dragging.disable(), this.options.enableShiftDrag || this.map.boxZoom.addHooks(), this.map.on("mousedown", this.handleMouseDown, this), this.options.keepOn || this.map.on("boxzoomend", this.setStateOff, this), L.DomUtil.addClass(this.map._container, "leaflet-control-boxzoom-active")
        },
        setStateOff: function () {
            L.DomUtil.removeClass(this.controlDiv, "leaflet-control-boxzoom-active"), this.active = !1, this.map.off("mousedown", this.handleMouseDown, this), this.map.dragging.enable(), this.options.enableShiftDrag || this.map.boxZoom.removeHooks(), L.DomUtil.removeClass(this.map._container, "leaflet-control-boxzoom-active")
        },
        handleMouseDown: function (o) {
            this.map.boxZoom._onMouseDown.call(this.map.boxZoom, {
                clientX: o.originalEvent.clientX,
                clientY: o.originalEvent.clientY,
                which: 1,
                shiftKey: !0
            })
        },
        _boxZoomControlOverride_onMouseMove: function (o) {
            this._moved || (this._box = L.DomUtil.create("div", "leaflet-zoom-box", this._pane), L.DomUtil.setPosition(this._box, this._startLayerPoint), this._container.style.cursor = "crosshair", this._map.fire("boxzoomstart"));
            var t = this._startLayerPoint,
                e = this._box,
                i = this._map.mouseEventToLayerPoint(o),
                n = i.subtract(t),
                a = new L.Point(Math.min(i.x, t.x), Math.min(i.y, t.y));
            L.DomUtil.setPosition(e, a), this._moved = !0;
            var l = Math.max(0, Math.abs(n.x) - 4),
                s = Math.max(0, Math.abs(n.y) - 4);
            this.aspectRatio && (s = l / this.aspectRatio), e.style.width = l + "px", e.style.height = s + "px"
        },
        _boxZoomControlOverride_onMouseUp: function (o) {
            var t = this._box._leaflet_pos,
                e = new L.Point(this._box._leaflet_pos.x + this._box.offsetWidth, this._box._leaflet_pos.y + this._box.offsetHeight),
                i = this._map.layerPointToLatLng(t),
                n = this._map.layerPointToLatLng(e);
            if (!i.equals(n)) {
                this._finish();
                var a = new L.LatLngBounds(i, n);
                this._map.fitBounds(a), this._map.fire("boxzoomend", {
                    boxZoomBounds: a
                })
            }
        }
    }), L.Control.boxzoom = function (o) {
        return new L.Control.BoxZoom(o)
    },
        function (o) {
            var t;
            if ("function" == typeof define && define.amd) define(["leaflet"], o);
            else if ("undefined" != typeof module) t = require("leaflet"), module.exports = o(t);
            else {
                if (void 0 === window.L) throw new Error("Leaflet must be loaded first");
                o(window.L)
            }
        }((function (o) {
            var t;
            o.Control.Zoomslider = (t = o.Draggable.extend({
                initialize: function (t, e, i) {
                    o.Draggable.prototype.initialize.call(this, t, t), this._element = t, this._stepHeight = e, this._knobHeight = i, this.on("predrag", (function () {
                        this._newPos.x = 0, this._newPos.y = this._adjust(this._newPos.y)
                    }), this)
                },
                _adjust: function (o) {
                    var t = this._toValue(o);
                    return t = Math.max(0, Math.min(this._maxValue, t)), this._toY(t)
                },
                _toY: function (o) {
                    return this._k * o + this._m
                },
                _toValue: function (o) {
                    return (o - this._m) / this._k
                },
                setSteps: function (o) {
                    var t = o * this._stepHeight;
                    this._maxValue = o - 1, this._k = -this._stepHeight, this._m = t - (this._stepHeight + this._knobHeight) / 2
                },
                setPosition: function (t) {
                    o.DomUtil.setPosition(this._element, o.point(0, this._adjust(t)))
                },
                setValue: function (o) {
                    this.setPosition(this._toY(o))
                },
                getValue: function () {
                    return this._toValue(o.DomUtil.getPosition(this._element).y)
                }
            }), o.Control.extend({
                options: {
                    position: "topleft",
                    stepHeight: 8,
                    knobHeight: 6,
                    styleNS: "leaflet-control-zoomslider"
                },
                onAdd: function (o) {
                    return this._map = o, this._ui = this._createUI(), this._knob = new t(this._ui.knob, this.options.stepHeight, this.options.knobHeight), o.whenReady(this._initKnob, this).whenReady(this._initEvents, this).whenReady(this._updateSize, this).whenReady(this._updateKnobValue, this).whenReady(this._updateDisabled, this), this._ui.bar
                },
                onRemove: function (o) {
                    o.off("zoomlevelschange", this._updateSize, this).off("zoomend zoomlevelschange", this._updateKnobValue, this).off("zoomend zoomlevelschange", this._updateDisabled, this)
                },
                _createUI: function () {
                    var t = {},
                        e = this.options.styleNS;
                    return t.bar = o.DomUtil.create("div", e + " leaflet-bar"), t.zoomIn = this._createZoomBtn("in", "top", t.bar), t.wrap = o.DomUtil.create("div", e + "-wrap leaflet-bar-part", t.bar), t.zoomOut = this._createZoomBtn("out", "bottom", t.bar), t.body = o.DomUtil.create("div", e + "-body", t.wrap), t.knob = o.DomUtil.create("div", e + "-knob"), o.DomEvent.disableClickPropagation(t.bar), o.DomEvent.disableClickPropagation(t.knob), t
                },
                _createZoomBtn: function (t, e, i) {
                    var n = this.options.styleNS + "-" + t + " leaflet-bar-part leaflet-bar-part-" + e,
                        a = o.DomUtil.create("a", n, i);
                    return a.href = "#", a.title = "Zoom " + t, o.DomEvent.on(a, "click", o.DomEvent.preventDefault), a
                },
                _initKnob: function () {
                    this._knob.enable(), this._ui.body.appendChild(this._ui.knob)
                },
                _initEvents: function () {
                    this._map.on("zoomlevelschange", this._updateSize, this).on("zoomend zoomlevelschange", this._updateKnobValue, this).on("zoomend zoomlevelschange", this._updateDisabled, this), o.DomEvent.on(this._ui.body, "click", this._onSliderClick, this), o.DomEvent.on(this._ui.zoomIn, "click", this._zoomIn, this), o.DomEvent.on(this._ui.zoomOut, "click", this._zoomOut, this), this._knob.on("dragend", this._updateMapZoom, this)
                },
                _onSliderClick: function (t) {
                    var e = t.touches && 1 === t.touches.length ? t.touches[0] : t,
                        i = o.DomEvent.getMousePosition(e, this._ui.body).y;
                    this._knob.setPosition(i), this._updateMapZoom()
                },
                _zoomIn: function (o) {
                    this._map.zoomIn(o.shiftKey ? 2 : this._map.options.zoomDelta)
                },
                _zoomOut: function (o) {
                    this._map.zoomOut(o.shiftKey ? 2 : this._map.options.zoomDelta)
                },
                _zoomLevels: function () {
                    var o = this._map.getMaxZoom() - this._map.getMinZoom() + 1;
                    return o < 1 / 0 ? o : 0
                },
                _toZoomLevel: function (o) {
                    return o + this._map.getMinZoom()
                },
                _toValue: function (o) {
                    return o - this._map.getMinZoom()
                },
                _updateSize: function () {
                    var o = this._zoomLevels();
                    this._ui.body.style.height = this.options.stepHeight * o + "px", this._knob.setSteps(o)
                },
                _updateMapZoom: function () {
                    this._map.setZoom(this._toZoomLevel(this._knob.getValue()))
                },
                _updateKnobValue: function () {
                    this._knob.setValue(this._toValue(this._map.getZoom()))
                },
                _updateDisabled: function () {
                    var t = this._map.getZoom(),
                        e = this.options.styleNS + "-disabled";
                    o.DomUtil.removeClass(this._ui.zoomIn, e), o.DomUtil.removeClass(this._ui.zoomOut, e), t === this._map.getMinZoom() && o.DomUtil.addClass(this._ui.zoomOut, e), t === this._map.getMaxZoom() && o.DomUtil.addClass(this._ui.zoomIn, e)
                }
            })), o.Map.addInitHook((function () {
                this.options.zoomsliderControl && (this.zoomsliderControl = new o.Control.Zoomslider, this.addControl(this.zoomsliderControl))
            })), o.control.zoomslider = function (t) {
                return new o.Control.Zoomslider(t)
            }
        }));

    function t(o, t) {
        void 0 === t && (t = {});
        var e = t.insertAt;
        if (o && "undefined" != typeof document) {
            var i = document.head || document.getElementsByTagName("head")[0],
                n = document.createElement("style");
            n.type = "text/css", "top" === e && i.firstChild ? i.insertBefore(n, i.firstChild) : i.appendChild(n), n.styleSheet ? n.styleSheet.cssText = o : n.appendChild(document.createTextNode(o))
        }
    }
    t(".leaflet-control-boxzoom{background-color:#fff;border-radius:4px;border:1px solid #ccc;width:25px;height:25px;line-height:25px;box-shadow:0 1px 2px rgba(0,0,0,.65);cursor:pointer!important}.with-background-image{background-image:url(leaflet-control-boxzoom.svg);background-repeat:no-repeat;background-size:21px 21px;background-position:2px 2px}.leaflet-control-boxzoom.leaflet-control-boxzoom-active{background-color:#aaa}.leaflet-container.leaflet-control-boxzoom-active,.leaflet-container.leaflet-control-boxzoom-active path.leaflet-interactive{cursor:crosshair!important}.leaflet-control-boxzoom i{display:block}.leaflet-control-boxzoom i.icon{font-size:17px;margin-left:1px;margin-top:3px}.leaflet-control-boxzoom i.fa{margin-top:6px}.leaflet-control-boxzoom i.glyphicon{margin-top:5px}");
    var e, i, n, a;

    function l(o, t) {
        const e = Number(o);
        return isNaN(e) ? t : e
    }

    function createCustomIcon(url, size = [16, 16]) {
        return L.icon({
            iconUrl: url,
            iconSize: size,
            iconAnchor: [0, 5],
            popupAnchor: [0, 0]
        });
    }

    function replaceItemAndFluidTags(text) {
        return text.replace(/\[(item|fluid)=(.*?)\]/g, function (match, type, name) {
            return `<img class="icon" src="assets/icons/${name}.png" alt="${name}" title="${name}">`;
        });
    }

    function s(o) {
        return null != o && "function" == typeof o[Symbol.iterator]
    }
    t('.leaflet-control-zoomslider-wrap{padding-top:5px;padding-bottom:5px;background-color:#fff;border-bottom:1px solid #ccc}.leaflet-control-zoomslider-body{width:2px;border:solid #fff;border-width:0 9px;background-color:#000;margin:0 auto}.leaflet-control-zoomslider-knob{position:relative;width:12px;height:4px;background-color:#efefef;-webkit-border-radius:2px;border-radius:2px;border:1px solid #000;margin-left:-6px}.leaflet-control-zoomslider-body:hover{cursor:pointer}.leaflet-control-zoomslider-knob:hover{cursor:default;cursor:-webkit-grab;cursor:-moz-grab}.leaflet-dragging .leaflet-control-zoomslider,.leaflet-dragging .leaflet-control-zoomslider-body,.leaflet-dragging .leaflet-control-zoomslider-knob:hover,.leaflet-dragging .leaflet-control-zoomslider-wrap,.leaflet-dragging .leaflet-control-zoomslider a,.leaflet-dragging .leaflet-control-zoomslider a.leaflet-control-zoomslider-disabled{cursor:move;cursor:-webkit-grabbing;cursor:-moz-grabbing}.leaflet-container .leaflet-control-zoomslider{margin-left:10px;margin-top:10px}.leaflet-control-zoomslider a{width:26px;height:26px;text-align:center;text-decoration:none;color:#000;display:block}.leaflet-control-zoomslider a:hover{background-color:#f4f4f4}.leaflet-control-zoomslider-in{font:700 18px Lucida Console,Monaco,monospace}.leaflet-control-zoomslider-in:after{content:"\\002B"}.leaflet-control-zoomslider-out{font:700 22px Lucida Console,Monaco,monospace}.leaflet-control-zoomslider-out:after{content:"\\2212"}.leaflet-control-zoomslider a.leaflet-control-zoomslider-disabled{cursor:default;color:#bbb}.leaflet-touch .leaflet-control-zoomslider-body{background-position:10px 0}.leaflet-touch .leaflet-control-zoomslider-knob{width:16px;margin-left:-7px}.leaflet-touch .leaflet-control-zoomslider a,.leaflet-touch .leaflet-control-zoomslider a:hover{width:30px;line-height:30px}.leaflet-touch .leaflet-control-zoomslider-in{font-size:24px;line-height:29px}.leaflet-touch .leaflet-control-zoomslider-out{font-size:28px;line-height:30px}.leaflet-touch .leaflet-control-zoomslider{box-shadow:none;border:4px solid rgba(0,0,0,.3)}.leaflet-oldie .leaflet-control-zoomslider-wrap{width:26px}.leaflet-oldie .leaflet-control-zoomslider{border:1px solid #999}.leaflet-oldie .leaflet-control-zoomslider-in{*zoom:expression(this.runtimeStyle["zoom"] = "1",this.innerHTML = "\\u002B")}.leaflet-oldie .leaflet-control-zoomslider-out{*zoom:expression(this.runtimeStyle["zoom"] = "1",this.innerHTML = "\\u2212")}'), n = "\n    html,body {\n        margin: 0;\n    }\n\n    .with-background-image {\n        background-image:url(leaflet-control-boxzoom-4be5d249281d260e.svg);\n        background-size:22px 22px;\n        background-position:4px 4px;\n    }\n    .leaflet-touch .leaflet-control-zoomslider {\n        border: none;\n    }\n    .leaflet-control-boxzoom {\n        border:none;\n        width:30px;\n        height:30px;\n    }\n", (a = document.createElement("style")).innerHTML = n, document.head.appendChild(a),
        function () {
            const t = o.GridLayer.prototype._initTile;
            o.GridLayer.include({
                _initTile: function (o) {
                    t.call(this, o);
                    var e = this.getTileSize();
                    o.style.width = e.x + 1 + "px", o.style.height = e.y + 1 + "px"
                }
            })
        }();
    class r {
        constructor(t, e) {
            this.surfaceInfo = e, this.baseLayer = o.tileLayer.fallback(t.encoded_path + e.file_prefix + "{z}/tile_{x}_{y}.jpg", {
                tileSize: e.render_size,
                bounds: o.latLngBounds(this.worldToLatLng(e.world_min.x, e.world_min.y), this.worldToLatLng(e.world_max.x, e.world_max.y)),
                noWrap: !0,
                maxNativeZoom: e.zoom_max,
                minNativeZoom: e.zoom_min,
                minZoom: e.zoom_min - 4,
                maxZoom: e.zoom_max + 4
            });
            let i = [];
            if (s(e.stations))
                for (const t of e.stations) {
                    let tooltipContent = replaceItemAndFluidTags(t.backer_name);
                    i.push(o.marker(this.midPointToLatLng(t.bounding_box), {
                        title: t.backer_name,
                        icon: createCustomIcon("assets/station.png")
                    }).bindTooltip(tooltipContent, {
                        permanent: !0
                    }));
                }
            this.trainLayer = o.layerGroup(i);
            let n = [];
            if (s(e.tags))
                for (const t of e.tags) {
                    let tooltipContent = replaceItemAndFluidTags(t.text);
                    n.push(o.marker(this.worldToLatLng(t.position.x, t.position.y), {
                        title: `${t.force_name}: ${t.text}`,
                        icon: createCustomIcon("assets/tag.png")
                    }).bindTooltip(tooltipContent, {
                        permanent: !0
                    }));
                }
            this.tagsLayer = o.layerGroup(n);
            const a = [o.marker([0, 0], {
                title: "Start"
            }).bindPopup("Starting point")];
            if (s(e.players))
                for (const t of e.players) {
                    a.push(o.marker(this.worldToLatLng(t.position.x, t.position.y), {
                        title: t.name,
                        alt: `Player: ${t.name}`,
                        icon: createCustomIcon("assets/debug.png")
                    }).bindTooltip(t.name, {
                        permanent: !0
                    }));
                }
            e.player && a.push(o.marker(this.worldToLatLng(e.player.x, e.player.y), {
                title: "Player"
            }).bindPopup("Player")), a.push(o.marker(this.worldToLatLng(e.world_min.x, e.world_min.y), {
                title: `${e.world_min.x}, ${e.world_min.y}`
            }), o.marker(this.worldToLatLng(e.world_min.x, e.world_max.y), {
                title: `${e.world_min.x}, ${e.world_max.y}`
            }), o.marker(this.worldToLatLng(e.world_max.x, e.world_min.y), {
                title: `${e.world_max.x}, ${e.world_min.y}`
            }), o.marker(this.worldToLatLng(e.world_max.x, e.world_max.y), {
                title: `${e.world_max.x}, ${e.world_max.y}`
            })), this.debugLayer = o.layerGroup(a)
        }
        worldToLatLng(t, e) {
            const i = this.surfaceInfo.render_size / this.surfaceInfo.tile_size;
            return o.latLng(-e * i, t * i)
        }
        latLngToWorld(o) {
            const t = this.surfaceInfo.tile_size / this.surfaceInfo.render_size;
            return {
                x: o.lng * t,
                y: -o.lat * t
            }
        }
        midPointToLatLng(o) {
            return this.worldToLatLng((o.left_top.x + o.right_bottom.x) / 2, (o.left_top.y + o.right_bottom.y) / 2)
        }
    }

    function d(t) {
        console.log("Config", t), fetch(t.encoded_path + "mapshot.json").then((o => o.json())).then((e => {
            if (void 0 === e.surfaces) {
                const o = e;
                e.surfaces = [{
                    surface_name: "nauvis",
                    surface_idx: 1,
                    file_prefix: "zoom_",
                    tile_size: o.tile_size,
                    render_size: o.render_size,
                    world_min: o.world_min,
                    world_max: o.world_max,
                    zoom_min: o.zoom_min,
                    zoom_max: o.zoom_max,
                    player: o.player,
                    players: o.players,
                    stations: o.stations,
                    tags: o.tags
                }]
            }
            console.log("Map info", e),
                function (t, e) {
                    var i, n;
                    const a = o.control.layers(null, null, { collapsed: false }),
                        s = [],
                        d = new Map;
                    for (const o of e.surfaces) {
                        const e = new r(t, o);
                        s.push(e), a.addBaseLayer(e.baseLayer, o.surface_name), d.set(e.surfaceInfo.surface_idx.toString(), e), d.set(e.surfaceInfo.surface_name, e)
                    }
                    const h = o.layerGroup(),
                        c = o.layerGroup(),
                        m = o.layerGroup();
                    a.addOverlay(h, "Train stations"), a.addOverlay(c, "Tags"), a.addOverlay(m, "Debug");
                    const p = new Map;
                    p.set(h, "lt"), p.set(c, "lg"), p.set(m, "ld");
                    const u = o => {
                        h.clearLayers(), h.addLayer(o.trainLayer), c.clearLayers(), c.addLayer(o.tagsLayer), m.clearLayers(), m.addLayer(o.debugLayer)
                    },
                        f = o.map("content", {
                            crs: o.CRS.Simple,
                            layers: [],
                            zoomSnap: .1,
                            zoomsliderControl: !0,
                            zoomControl: !1,
                            zoomDelta: 1
                        });
                    a.addTo(f), o.Control.boxzoom({
                        position: "topleft"
                    }).addTo(f);
                    const _ = new URLSearchParams(window.location.search);
                    let g = null !== (n = d.get(null !== (i = _.get("s")) && void 0 !== i ? i : "1")) && void 0 !== n ? n : s[0];
                    f.addLayer(g.baseLayer), u(g);
                    let b = l(_.get("x"), 0),
                        x = l(_.get("y"), 0),
                        y = l(_.get("z"), 0);
                    f.setView(g.worldToLatLng(b, x), y), p.forEach(((o, t) => {
                        const e = _.get(o);
                        "0" == e && f.removeLayer(t), "1" == e && f.addLayer(t)
                    })), f.on("baselayerchange", (o => {
                        const t = d.get(o.name);
                        if (!t) return void console.log("unknown layer", o.name);
                        g = t, u(g);
                        const e = new URLSearchParams(window.location.search);
                        e.set("s", g.surfaceInfo.surface_idx.toString()), history.replaceState(null, "", "?" + e.toString())
                    }));
                    const z = o => {
                        const t = f.getZoom(),
                            {
                                x: e,
                                y: i
                            } = g.latLngToWorld(f.getCenter()),
                            n = new URLSearchParams(window.location.search);
                        n.set("x", e.toFixed(1)), n.set("y", i.toFixed(1)), n.set("z", t.toFixed(1)), history.replaceState(null, "", "?" + n.toString())
                    };
                    f.on("zoomend", z), f.on("moveend", z), f.on("resize", z);
                    const v = o => {
                        const t = p.get(o.layer);
                        if (!t) return void console.log("unknown layer", o.name);
                        const e = new URLSearchParams(window.location.search);
                        e.set(t, "overlayadd" == o.type ? "1" : "0"), history.replaceState(null, "", "?" + e.toString())
                    };
                    f.on("overlayadd", v), f.on("overlayremove", v)
                }(t, e)
        }))
    }
    const h = new URLSearchParams(window.location.search);
    if (h.get("l")) fetch("/latest/" + h.get("l")).then((o => o.json())).then((o => {
        d(o)
    }));
    else {
        const o = JSON.parse(JSON.stringify(null !== MAPSHOT_CONFIG && void 0 !== MAPSHOT_CONFIG ? MAPSHOT_CONFIG : {}));
        o.encoded_path = null !== (i = null !== (e = h.get("path")) && void 0 !== e ? e : o.encoded_path) && void 0 !== i ? i : "", o.encoded_path && "/" != o.encoded_path[o.encoded_path.length - 1] && (o.encoded_path = o.encoded_path + "/"), d(o)
    }
}(L);