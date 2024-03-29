/*!
 * @pixi/layers - v2.0.1
 * Compiled Wed, 21 Dec 2022 21:18:58 UTC
 *
 * @pixi/layers is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 *
 * Copyright 2017-2021, Ivan Popelyshev, All Rights Reserved
 */ ;(this.PIXI = this.PIXI || {}),
  (this.PIXI.layers = (function (a, o, h) {
    'use strict'
    function y(r) {
      return function (e) {
        if (!(this._activeParentLayer && this._activeParentLayer !== e._activeLayer)) {
          if (!this.visible) {
            this.displayOrder = 0
            return
          }
          ;(this.displayOrder = e.incDisplayOrder()),
            !(this.worldAlpha <= 0 || !this.renderable) &&
              ((e._activeLayer = null), r.call(this, e), (e._activeLayer = this._activeParentLayer))
        }
      }
    }
    function C(r) {
      if (!(this._activeParentLayer && this._activeParentLayer !== r._activeLayer)) {
        if (!this.visible) {
          this.displayOrder = 0
          return
        }
        ;(this.displayOrder = r.incDisplayOrder()),
          !(this.worldAlpha <= 0 || !this.renderable) &&
            ((r._activeLayer = null), this.containerRenderWebGL(r), (r._activeLayer = this._activeParentLayer))
      }
    }
    function v() {
      if (o.DisplayObject.prototype.displayOrder !== void 0) return
      Object.assign(o.DisplayObject.prototype, {
        parentLayer: null,
        _activeParentLayer: null,
        parentGroup: null,
        zOrder: 0,
        zIndex: 0,
        updateOrder: 0,
        displayOrder: 0,
        layerableChildren: !0,
        isLayer: !1
      })
      const r = o.Container.prototype
      ;(r.containerRenderWebGL = r.render), (r.render = C)
    }
    function x(r) {
      r.originalRenderWebGL ||
        ((r.originalRenderWebGL = r.render),
        (r.render = y(r.render)),
        r.renderCanvas && ((r.originalRenderWebGL = r.renderCanvas), (r.renderCanvas = y(r.renderCanvas))))
    }
    function T(r) {
      ;(r.prototype.layerableChildren = !1), x(r.prototype)
    }
    function L(r) {
      return function (e, t, n, i, s) {
        ;(!t || (!t.renderTexture && !t.baseTexture)) && (this._lastDisplayOrder = 0),
          (this._activeLayer = null),
          e.isStage && e.updateStage(),
          r.call(this, e, t, n, i, s)
      }
    }
    function f(r) {
      const e = r.prototype
      e._oldRender ||
        (Object.assign(e, {
          _lastDisplayOrder: 0,
          _activeLayer: null,
          incDisplayOrder() {
            return ++this._lastDisplayOrder
          },
          _oldRender: h.Renderer.prototype.render
        }),
        (e._oldRender = e.render),
        (e.render = L(e.render)))
    }
    function R(r) {
      if (!r) {
        console.log(
          '@pixi/layers: Canvas mixin was called with empty parameter. Are you sure that you even need this line?'
        )
        return
      }
      f(r)
      const e = o.Container.prototype
      e.containerRenderCanvas || ((e.containerRenderCanvas = e.renderCanvas), (e.renderCanvas = y(e.renderCanvas)))
    }
    const l = class extends h.utils.EventEmitter {
      constructor(r = 0, e = !1) {
        super(),
          (this.useRenderTexture = !1),
          (this.useDoubleBuffer = !1),
          (this.sortPriority = 0),
          (this.clearColor = new Float32Array([0, 0, 0, 0])),
          (this.canDrawWithoutLayer = !1),
          (this.canDrawInParentStage = !0),
          (this._activeLayer = null),
          (this._activeStage = null),
          (this._activeChildren = []),
          (this._lastUpdateId = -1),
          (this.zIndex = r || 0),
          (this.enableSort = !!e),
          typeof e == 'function' && this.on('sort', e)
      }
      doSort(r, e) {
        if (this.listeners('sort', !0)) for (let t = 0; t < e.length; t++) this.emit('sort', e[t])
        e.sort(l.compareZIndex)
      }
      static compareZIndex(r, e) {
        return r.zOrder < e.zOrder ? -1 : r.zOrder > e.zOrder ? 1 : r.updateOrder - e.updateOrder
      }
      clear() {
        ;(this._activeLayer = null), (this._activeStage = null), (this._activeChildren.length = 0)
      }
      _resolveChildDisplayObject(r, e) {
        this.check(r),
          (e._activeParentLayer = this._activeLayer),
          this._activeLayer ? this._activeLayer._activeChildren.push(e) : this._activeChildren.push(e)
      }
      _resolveLayer(r, e) {
        this.check(r), this._activeLayer && l.conflict(), (this._activeLayer = e), (this._activeStage = r)
      }
      check(r) {
        if (this._lastUpdateId < l._layerUpdateId)
          (this._lastUpdateId = l._layerUpdateId), this.clear(), (this._activeStage = r)
        else if (this.canDrawInParentStage) {
          let e = this._activeStage
          for (; e && e !== r; ) e = e._activeParentStage
          ;(this._activeStage = e), e === null && this.clear()
        }
      }
      static conflict() {
        l._lastLayerConflict + 5e3 < Date.now() &&
          ((l._lastLayerConflict = Date.now()),
          console.log(
            "@pixi/layers found two layers with the same group in one stage - that's not healthy. Please place a breakpoint here and debug it"
          ))
      }
    }
    let c = l
    ;(c._layerUpdateId = 0), (c._lastLayerConflict = 0)
    class _ {
      constructor(e) {
        ;(this.layer = e),
          (this.renderTexture = null),
          (this.doubleBuffer = null),
          (this.currentBufferIndex = 0),
          (this._tempRenderTarget = null),
          (this._tempRenderTargetSource = new h.Rectangle()),
          (this._tempRenderTargetDestination = new h.Rectangle())
      }
      init(e) {
        const t = e ? e.screen.width : 100,
          n = e ? e.screen.height : 100,
          i = e ? e.resolution : h.settings.RESOLUTION
        ;(this.renderTexture = h.RenderTexture.create({ width: t, height: n, resolution: i })),
          this.layer.group.useDoubleBuffer &&
            (this.doubleBuffer = [
              h.RenderTexture.create({ width: t, height: n, resolution: i }),
              h.RenderTexture.create({ width: t, height: n, resolution: i })
            ])
      }
      getRenderTexture() {
        return this.renderTexture || this.init(), this.renderTexture
      }
      pushTexture(e) {
        const t = e.screen
        this.renderTexture || this.init(e)
        const n = this.renderTexture,
          i = this.layer.group,
          s = this.doubleBuffer
        if (
          ((n.width !== t.width || n.height !== t.height || n.baseTexture.resolution !== e.resolution) &&
            ((n.baseTexture.resolution = e.resolution),
            n.resize(t.width, t.height),
            s &&
              ((s[0].baseTexture.resolution = e.resolution),
              s[0].resize(t.width, t.height),
              (s[1].baseTexture.resolution = e.resolution),
              s[1].resize(t.width, t.height))),
          s &&
            ((s[0].framebuffer.multisample = n.framebuffer.multisample),
            (s[1].framebuffer.multisample = n.framebuffer.multisample)),
          (this._tempRenderTarget = e.renderTexture.current),
          this._tempRenderTargetSource.copyFrom(e.renderTexture.sourceFrame),
          this._tempRenderTargetDestination.copyFrom(e.renderTexture.destinationFrame),
          e.batch.flush(),
          i.useDoubleBuffer)
        ) {
          let u = s[this.currentBufferIndex]
          u.baseTexture._glTextures[e.CONTEXT_UID] ||
            (e.renderTexture.bind(u, void 0, void 0),
            e.texture.bind(u),
            i.clearColor && e.renderTexture.clear(i.clearColor)),
            e.texture.unbind(n.baseTexture),
            (n.baseTexture._glTextures = u.baseTexture._glTextures),
            (n.baseTexture.framebuffer = u.baseTexture.framebuffer),
            (u = s[1 - this.currentBufferIndex]),
            e.renderTexture.bind(u, void 0, void 0)
        } else e.renderTexture.bind(n, void 0, void 0)
        i.clearColor && e.renderTexture.clear(i.clearColor)
        const d = e.filter.defaultFilterStack
        d.length > 1 && (d[d.length - 1].renderTexture = e.renderTexture.current)
      }
      popTexture(e) {
        e.batch.flush(), e.framebuffer.blit()
        const t = e.filter.defaultFilterStack
        t.length > 1 && (t[t.length - 1].renderTexture = this._tempRenderTarget),
          e.renderTexture.bind(this._tempRenderTarget, this._tempRenderTargetSource, this._tempRenderTargetDestination),
          (this._tempRenderTarget = null)
        const n = this.renderTexture,
          i = this.layer.group,
          s = this.doubleBuffer
        if (i.useDoubleBuffer) {
          e.texture.unbind(n.baseTexture), (this.currentBufferIndex = 1 - this.currentBufferIndex)
          const d = s[this.currentBufferIndex]
          ;(n.baseTexture._glTextures = d.baseTexture._glTextures),
            (n.baseTexture.framebuffer = d.baseTexture.framebuffer)
        }
      }
      destroy() {
        this.renderTexture &&
          (this.renderTexture.destroy(),
          this.doubleBuffer && (this.doubleBuffer[0].destroy(!0), this.doubleBuffer[1].destroy(!0)))
      }
    }
    class p extends o.Container {
      constructor(e = null) {
        super(),
          (this.isLayer = !0),
          (this.group = null),
          (this._activeChildren = []),
          (this._tempChildren = null),
          (this._activeStageParent = null),
          (this._sortedChildren = []),
          (this._tempLayerParent = null),
          (this.insertChildrenBeforeActive = !0),
          (this.insertChildrenAfterActive = !0),
          e ? ((this.group = e), (this.zIndex = e.zIndex)) : (this.group = new c(0, !1)),
          (this._tempChildren = this.children)
      }
      get useRenderTexture() {
        return this.group.useRenderTexture
      }
      set useRenderTexture(e) {
        this.group.useRenderTexture = e
      }
      get useDoubleBuffer() {
        return this.group.useDoubleBuffer
      }
      set useDoubleBuffer(e) {
        this.group.useDoubleBuffer = e
      }
      get clearColor() {
        return this.group.clearColor
      }
      set clearColor(e) {
        this.group.clearColor = e
      }
      get sortPriority() {
        return this.group.sortPriority
      }
      set sortPriority(e) {
        this.group.sortPriority = e
      }
      getRenderTexture() {
        return this.textureCache || (this.textureCache = new _(this)), this.textureCache.getRenderTexture()
      }
      doSort() {
        this.group.doSort(this, this._sortedChildren)
      }
      destroy(e) {
        this.textureCache && (this.textureCache.destroy(), (this.textureCache = null)), super.destroy(e)
      }
      render(e) {
        !this.prerender(e) ||
          (this.group.useRenderTexture &&
            (this.textureCache || (this.textureCache = new _(this)), this.textureCache.pushTexture(e)),
          this.containerRenderWebGL(e),
          this.postrender(e),
          this.group.useRenderTexture && this.textureCache.popTexture(e))
      }
      layerRenderCanvas(e) {
        this.prerender(e) && (this.containerRenderCanvas(e), this.postrender(e))
      }
      _onBeginLayerSubtreeTraversal(e) {
        const t = this._activeChildren
        ;(this._activeStageParent = e), this.group._resolveLayer(e, this)
        const n = this.group._activeChildren
        t.length = 0
        for (let i = 0; i < n.length; i++) (n[i]._activeParentLayer = this), t.push(n[i])
        n.length = 0
      }
      _onEndLayerSubtreeTraversal() {
        const e = this.children,
          t = this._activeChildren,
          n = this._sortedChildren
        for (let i = 0; i < t.length; i++) this.emit('display', t[i])
        if (((n.length = 0), this.insertChildrenBeforeActive)) for (let i = 0; i < e.length; i++) n.push(e[i])
        for (let i = 0; i < t.length; i++) n.push(t[i])
        if (!this.insertChildrenBeforeActive && this.insertChildrenAfterActive)
          for (let i = 0; i < e.length; i++) n.push(e[i])
        this.group.enableSort && this.doSort()
      }
      prerender(e) {
        return this._activeParentLayer && this._activeParentLayer != e._activeLayer
          ? !1
          : this.visible
          ? ((this.displayOrder = e.incDisplayOrder()),
            this.worldAlpha <= 0 || !this.renderable
              ? !1
              : (this.children !== this._sortedChildren &&
                  this._tempChildren !== this.children &&
                  (this._tempChildren = this.children),
                this._boundsID++,
                (this.children = this._sortedChildren),
                (this._tempLayerParent = e._activeLayer),
                (e._activeLayer = this),
                !0))
          : ((this.displayOrder = 0), !1)
      }
      postrender(e) {
        ;(this.children = this._tempChildren), (e._activeLayer = this._tempLayerParent), (this._tempLayerParent = null)
      }
    }
    p.prototype.renderCanvas = p.prototype.layerRenderCanvas
    const g = class extends p {
      constructor() {
        super(...arguments),
          (this.isStage = !0),
          (this._tempGroups = []),
          (this._activeLayers = []),
          (this._activeParentStage = null)
      }
      clear() {
        ;(this._activeLayers.length = 0), (this._tempGroups.length = 0)
      }
      destroy(r) {
        this.clear(), super.destroy(r)
      }
      updateStage() {
        ;(this._activeParentStage = null), c._layerUpdateId++, this._updateStageInner()
      }
      updateAsChildStage(r) {
        ;(this._activeParentStage = r), (g._updateOrderCounter = 0), this._updateStageInner()
      }
      _updateStageInner() {
        this.clear(), this._addRecursive(this)
        const r = this._activeLayers
        for (let e = 0; e < r.length; e++) {
          const t = r[e]
          if (t.group.sortPriority) {
            t._onEndLayerSubtreeTraversal()
            const n = t._sortedChildren
            for (let i = 0; i < n.length; i++) this._addRecursiveChildren(n[i])
          }
        }
        for (let e = 0; e < r.length; e++) {
          const t = r[e]
          t.group.sortPriority || t._onEndLayerSubtreeTraversal()
        }
      }
      _addRecursive(r) {
        if (!r.visible) return
        if (r.isLayer) {
          const i = r
          this._activeLayers.push(i), i._onBeginLayerSubtreeTraversal(this)
        }
        if (r !== this && r.isStage) {
          r.updateAsChildStage(this)
          return
        }
        r._activeParentLayer = null
        let e = r.parentGroup
        e && e._resolveChildDisplayObject(this, r)
        const t = r.parentLayer
        if (
          (t && ((e = t.group), e._resolveChildDisplayObject(this, r)),
          (r.updateOrder = ++g._updateOrderCounter),
          r.alpha <= 0 || !r.renderable || !r.layerableChildren || (e && e.sortPriority))
        )
          return
        const n = r.children
        if (n && n.length) for (let i = 0; i < n.length; i++) this._addRecursive(n[i])
      }
      _addRecursiveChildren(r) {
        if (r.alpha <= 0 || !r.renderable || !r.layerableChildren) return
        const e = r.children
        if (e && e.length) for (let t = 0; t < e.length; t++) this._addRecursive(e[t])
      }
    }
    let b = g
    return (
      (b._updateOrderCounter = 0),
      v(),
      f(h.Renderer),
      (a.Group = c),
      (a.Layer = p),
      (a.LayerTextureCache = _),
      (a.Stage = b),
      (a.applyCanvasMixin = R),
      (a.applyContainerRenderMixin = x),
      (a.applyDisplayMixin = v),
      (a.applyParticleMixin = T),
      (a.applyRendererMixin = f),
      Object.defineProperty(a, '__esModule', { value: !0 }),
      a
    )
  })({}, PIXI, PIXI))
//# sourceMappingURL=pixi-layers.js.map
