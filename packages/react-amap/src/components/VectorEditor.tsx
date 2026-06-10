import { type FC, type Ref, useEffectEvent, useRef } from "react"

import {
    MapPlugin,
    type MapEventHandler,
    type MapInstance,
    type MapNamespace,
    useMapContext,
} from "./Map"
import {
    type MapBezierCurveInstance,
    type MapCircleInstance,
    type MapCircleMarkerOptions,
    type MapEllipseInstance,
    type MapPolygonInstance,
    type MapPolylineInstance,
    type MapPolylineOptions,
    type MapRectangleInstance,
    type MapVectorOverlayBaseOptions,
} from "./Vector"
import type { MapMarkerOptions } from "./Marker"
import { optionalFn } from "../utils/optionalFn"
import { useMapPlugin } from "../hooks/useMapPlugin"
import { useStableEffect } from "../hooks/useStableEffect"
import {
    type MapMoveEvent,
    type MapOverlayEventMap,
    type MapOverlayEventShortcutProps,
    type MapOverlayInteractionEvent,
    type MapOverlayMouseEvent,
    type MapTargetEvent,
    getMapEventEntries,
    mergeMapEvents,
    splitMapEventShortcutProps,
} from "../utils/mapEvents"

export type MapPolyEditorTarget = MapPolygonInstance | MapPolylineInstance

export type MapVectorEditorOnLoad<TInstance extends MapVectorEditorInstance = MapVectorEditorInstance> = (
    editor: TInstance
) => void

export type MapVectorEditorOnDestroy<TInstance extends MapVectorEditorInstance = MapVectorEditorInstance> = (
    editor: TInstance
) => void

/** 矢量编辑器事件映射 */
export interface MapVectorEditorEvents<TInstance = MapVectorEditorInstance>
    extends MapOverlayEventMap<TInstance> {}

/** 矢量编辑器基础参数 */
export interface MapVectorEditorBaseOptions {
    /** 新创建对象样式 */
    createOptions?: MapVectorOverlayBaseOptions
    /** 编辑对象样式 */
    editOptions?: MapVectorOverlayBaseOptions
}

/** 多边形编辑器参数 */
export interface MapPolygonEditorOptions extends MapVectorEditorBaseOptions {
    /** 顶点样式 */
    controlPoint?: MapCircleMarkerOptions
    /** 中间点样式 */
    midControlPoint?: MapCircleMarkerOptions
}

/** 折线编辑器参数 */
export interface MapPolylineEditorOptions extends MapVectorEditorBaseOptions {
    /** 顶点样式 */
    controlPoint?: MapCircleMarkerOptions
    /** 中间点样式 */
    midControlPoint?: MapCircleMarkerOptions
}

/** 通用 PolyEditor 参数 */
export interface MapPolyEditorOptions extends MapVectorEditorBaseOptions {
    /** 顶点样式 */
    controlPoint?: MapCircleMarkerOptions
    /** 中间点样式 */
    midControlPoint?: MapCircleMarkerOptions
}

/** 圆形编辑器参数 */
export interface MapCircleEditorOptions extends MapVectorEditorBaseOptions {
    /** 移动点样式 */
    movePoint?: MapMarkerOptions
    /** 调整半径点样式 */
    resizePoint?: MapMarkerOptions
}

/** 贝塞尔曲线编辑器参数 */
export interface MapBezierCurveEditorOptions extends MapVectorEditorBaseOptions {
    /** 顶点样式 */
    controlPoint?: MapMarkerOptions
    /** 中间点样式 */
    midControlPoint?: MapMarkerOptions
    /** 贝塞尔控制点样式 */
    bezierControlPoint?: MapMarkerOptions
    /** 贝塞尔控制线样式 */
    bezierControlLine?: MapPolylineOptions
}

/** 椭圆编辑器参数 */
export interface MapEllipseEditorOptions extends MapVectorEditorBaseOptions {
    /** 移动点样式 */
    movePoint?: MapMarkerOptions
    /** 横向调整点样式 */
    resizeXPoint?: MapMarkerOptions
    /** 纵向调整点样式 */
    resizeYPoint?: MapMarkerOptions
}

/** 矩形编辑器参数 */
export interface MapRectangleEditorOptions extends MapVectorEditorBaseOptions {
    /** 西南点样式 */
    southWestPoint?: MapMarkerOptions
    /** 东北点样式 */
    northEastPoint?: MapMarkerOptions
}

/** 矢量编辑器实例 */
export interface MapVectorEditorInstance<TTarget = unknown> {
    /** 开始编辑 */
    open?(): void
    /** 停止编辑 */
    close?(): void
    /** 设置编辑对象 */
    setTarget?(target?: TTarget | null): void
    /** 获取编辑对象 */
    getTarget?(): TTarget | undefined
    /** 绑定事件 */
    on?(eventName: string, handler: MapEventHandler): void
    /** 解绑事件 */
    off?(eventName: string, handler: MapEventHandler): void
}

/** 多边形编辑器实例 */
export interface MapPolygonEditorInstance extends MapVectorEditorInstance<MapPolygonInstance> {
    /** 设置吸附多边形 */
    setAdsorbPolygons?: (list: MapPolygonInstance | MapPolygonInstance[]) => void
    /** 清空吸附多边形 */
    clearAdsorbPolygons?: () => void
    /** 添加吸附多边形 */
    addAdsorbPolygons?: (list: MapPolygonInstance | MapPolygonInstance[]) => void
    /** 移除吸附多边形 */
    removeAdsorbPolygons?: (list: MapPolygonInstance | MapPolygonInstance[]) => void
}

/** 折线编辑器实例 */
export interface MapPolylineEditorInstance extends MapVectorEditorInstance<MapPolylineInstance> {}

/** 通用 PolyEditor 实例 */
export interface MapPolyEditorInstance extends MapVectorEditorInstance<MapPolyEditorTarget> {
    /** 设置吸附多边形 */
    setAdsorbPolygons?: (list: MapPolygonInstance | MapPolygonInstance[]) => void
    /** 清空吸附多边形 */
    clearAdsorbPolygons?: () => void
    /** 添加吸附多边形 */
    addAdsorbPolygons?: (list: MapPolygonInstance | MapPolygonInstance[]) => void
    /** 移除吸附多边形 */
    removeAdsorbPolygons?: (list: MapPolygonInstance | MapPolygonInstance[]) => void
}

/** 圆形编辑器实例 */
export interface MapCircleEditorInstance extends MapVectorEditorInstance<MapCircleInstance> {}

/** 贝塞尔曲线编辑器实例 */
export interface MapBezierCurveEditorInstance extends MapVectorEditorInstance<MapBezierCurveInstance> {}

/** 椭圆编辑器实例 */
export interface MapEllipseEditorInstance extends MapVectorEditorInstance<MapEllipseInstance> {}

/** 矩形编辑器实例 */
export interface MapRectangleEditorInstance extends MapVectorEditorInstance<MapRectangleInstance> {}

/** 矢量编辑器鼠标事件 */
export interface MapVectorEditorMouseEvent<TInstance = MapVectorEditorInstance> extends MapOverlayMouseEvent<TInstance> {}

/** 矢量编辑器交互坐标事件 */
export interface MapVectorEditorInteractionEvent<TInstance = MapVectorEditorInstance>
    extends MapOverlayInteractionEvent<TInstance> {}

/** 矢量编辑器目标事件 */
export interface MapVectorEditorTargetEvent<TInstance = MapVectorEditorInstance> extends MapTargetEvent<TInstance> {}

/** 矢量编辑器移动动画事件 */
export interface MapVectorEditorMoveEvent<TInstance = MapVectorEditorInstance> extends MapMoveEvent<TInstance> {}

/** 矢量编辑器事件快捷属性 */
export interface MapVectorEditorEventShortcutProps<TInstance = MapVectorEditorInstance>
    extends MapOverlayEventShortcutProps<TInstance> {}

/** 多边形编辑器鼠标事件 */
export interface MapPolygonEditorMouseEvent extends MapVectorEditorMouseEvent<MapPolygonEditorInstance> {}

/** 多边形编辑器交互坐标事件 */
export interface MapPolygonEditorInteractionEvent extends MapVectorEditorInteractionEvent<MapPolygonEditorInstance> {}

/** 多边形编辑器目标事件 */
export interface MapPolygonEditorTargetEvent extends MapVectorEditorTargetEvent<MapPolygonEditorInstance> {}

/** 多边形编辑器移动动画事件 */
export interface MapPolygonEditorMoveEvent extends MapVectorEditorMoveEvent<MapPolygonEditorInstance> {}

/** 多边形编辑器事件快捷属性 */
export interface MapPolygonEditorEventShortcutProps extends MapVectorEditorEventShortcutProps<MapPolygonEditorInstance> {}

/** 折线编辑器鼠标事件 */
export interface MapPolylineEditorMouseEvent extends MapVectorEditorMouseEvent<MapPolylineEditorInstance> {}

/** 折线编辑器交互坐标事件 */
export interface MapPolylineEditorInteractionEvent extends MapVectorEditorInteractionEvent<MapPolylineEditorInstance> {}

/** 折线编辑器目标事件 */
export interface MapPolylineEditorTargetEvent extends MapVectorEditorTargetEvent<MapPolylineEditorInstance> {}

/** 折线编辑器移动动画事件 */
export interface MapPolylineEditorMoveEvent extends MapVectorEditorMoveEvent<MapPolylineEditorInstance> {}

/** 折线编辑器事件快捷属性 */
export interface MapPolylineEditorEventShortcutProps extends MapVectorEditorEventShortcutProps<MapPolylineEditorInstance> {}

/** 通用 PolyEditor 鼠标事件 */
export interface MapPolyEditorMouseEvent extends MapVectorEditorMouseEvent<MapPolyEditorInstance> {}

/** 通用 PolyEditor 交互坐标事件 */
export interface MapPolyEditorInteractionEvent extends MapVectorEditorInteractionEvent<MapPolyEditorInstance> {}

/** 通用 PolyEditor 目标事件 */
export interface MapPolyEditorTargetEvent extends MapVectorEditorTargetEvent<MapPolyEditorInstance> {}

/** 通用 PolyEditor 移动动画事件 */
export interface MapPolyEditorMoveEvent extends MapVectorEditorMoveEvent<MapPolyEditorInstance> {}

/** 通用 PolyEditor 事件快捷属性 */
export interface MapPolyEditorEventShortcutProps extends MapVectorEditorEventShortcutProps<MapPolyEditorInstance> {}

/** 圆形编辑器鼠标事件 */
export interface MapCircleEditorMouseEvent extends MapVectorEditorMouseEvent<MapCircleEditorInstance> {}

/** 圆形编辑器交互坐标事件 */
export interface MapCircleEditorInteractionEvent extends MapVectorEditorInteractionEvent<MapCircleEditorInstance> {}

/** 圆形编辑器目标事件 */
export interface MapCircleEditorTargetEvent extends MapVectorEditorTargetEvent<MapCircleEditorInstance> {}

/** 圆形编辑器移动动画事件 */
export interface MapCircleEditorMoveEvent extends MapVectorEditorMoveEvent<MapCircleEditorInstance> {}

/** 圆形编辑器事件快捷属性 */
export interface MapCircleEditorEventShortcutProps extends MapVectorEditorEventShortcutProps<MapCircleEditorInstance> {}

/** 贝塞尔曲线编辑器鼠标事件 */
export interface MapBezierCurveEditorMouseEvent extends MapVectorEditorMouseEvent<MapBezierCurveEditorInstance> {}

/** 贝塞尔曲线编辑器交互坐标事件 */
export interface MapBezierCurveEditorInteractionEvent extends MapVectorEditorInteractionEvent<MapBezierCurveEditorInstance> {}

/** 贝塞尔曲线编辑器目标事件 */
export interface MapBezierCurveEditorTargetEvent extends MapVectorEditorTargetEvent<MapBezierCurveEditorInstance> {}

/** 贝塞尔曲线编辑器移动动画事件 */
export interface MapBezierCurveEditorMoveEvent extends MapVectorEditorMoveEvent<MapBezierCurveEditorInstance> {}

/** 贝塞尔曲线编辑器事件快捷属性 */
export interface MapBezierCurveEditorEventShortcutProps
    extends MapVectorEditorEventShortcutProps<MapBezierCurveEditorInstance> {}

/** 椭圆编辑器鼠标事件 */
export interface MapEllipseEditorMouseEvent extends MapVectorEditorMouseEvent<MapEllipseEditorInstance> {}

/** 椭圆编辑器交互坐标事件 */
export interface MapEllipseEditorInteractionEvent extends MapVectorEditorInteractionEvent<MapEllipseEditorInstance> {}

/** 椭圆编辑器目标事件 */
export interface MapEllipseEditorTargetEvent extends MapVectorEditorTargetEvent<MapEllipseEditorInstance> {}

/** 椭圆编辑器移动动画事件 */
export interface MapEllipseEditorMoveEvent extends MapVectorEditorMoveEvent<MapEllipseEditorInstance> {}

/** 椭圆编辑器事件快捷属性 */
export interface MapEllipseEditorEventShortcutProps extends MapVectorEditorEventShortcutProps<MapEllipseEditorInstance> {}

/** 矩形编辑器鼠标事件 */
export interface MapRectangleEditorMouseEvent extends MapVectorEditorMouseEvent<MapRectangleEditorInstance> {}

/** 矩形编辑器交互坐标事件 */
export interface MapRectangleEditorInteractionEvent extends MapVectorEditorInteractionEvent<MapRectangleEditorInstance> {}

/** 矩形编辑器目标事件 */
export interface MapRectangleEditorTargetEvent extends MapVectorEditorTargetEvent<MapRectangleEditorInstance> {}

/** 矩形编辑器移动动画事件 */
export interface MapRectangleEditorMoveEvent extends MapVectorEditorMoveEvent<MapRectangleEditorInstance> {}

/** 矩形编辑器事件快捷属性 */
export interface MapRectangleEditorEventShortcutProps
    extends MapVectorEditorEventShortcutProps<MapRectangleEditorInstance> {}

/** 矢量编辑器构造器 */
export interface MapVectorEditorConstructor<
    TInstance extends MapVectorEditorInstance<TTarget>,
    TTarget,
    TOptions extends MapVectorEditorBaseOptions,
> {
    new (map: MapInstance, target?: TTarget | null, options?: TOptions): TInstance
}

/** 支持矢量编辑器构造器的高德命名空间 */
export interface MapVectorEditorNamespace extends MapNamespace {
    /** PolygonEditor 构造器 */
    PolygonEditor?: new (
        map: MapInstance,
        target?: MapPolygonInstance | null,
        options?: MapPolygonEditorOptions
    ) => MapPolygonEditorInstance
    /** PolylineEditor 构造器 */
    PolylineEditor?: new (
        map: MapInstance,
        target?: MapPolylineInstance | null,
        options?: MapPolylineEditorOptions
    ) => MapPolylineEditorInstance
    /** PolyEditor 构造器 */
    PolyEditor?: new (
        map: MapInstance,
        target?: MapPolyEditorTarget | null,
        options?: MapPolyEditorOptions
    ) => MapPolyEditorInstance
    /** CircleEditor 构造器 */
    CircleEditor?: new (
        map: MapInstance,
        target?: MapCircleInstance | null,
        options?: MapCircleEditorOptions
    ) => MapCircleEditorInstance
    /** BezierCurveEditor 构造器 */
    BezierCurveEditor?: new (
        map: MapInstance,
        target?: MapBezierCurveInstance | null,
        options?: MapBezierCurveEditorOptions
    ) => MapBezierCurveEditorInstance
    /** EllipseEditor 构造器 */
    EllipseEditor?: new (
        map: MapInstance,
        target?: MapEllipseInstance | null,
        options?: MapEllipseEditorOptions
    ) => MapEllipseEditorInstance
    /** RectangleEditor 构造器 */
    RectangleEditor?: new (
        map: MapInstance,
        target?: MapRectangleInstance | null,
        options?: MapRectangleEditorOptions
    ) => MapRectangleEditorInstance
}

/** 合并矢量编辑器参数 */
export interface MergeMapVectorEditorOptionsParams<TOptions extends MapVectorEditorBaseOptions> {
    /** 透传编辑器参数 */
    extraOptions?: TOptions
}

/** 设置矢量编辑器 ref 参数 */
export interface SetMapVectorEditorRefParams<TInstance extends MapVectorEditorInstance> {
    /** 外部 ref */
    ref?: Ref<TInstance | null>
    /** 编辑器实例 */
    editor: TInstance | null
}

/** 获取矢量编辑器构造器参数 */
export interface GetMapVectorEditorConstructorParams {
    /** 高德地图命名空间 */
    AMap: MapNamespace
    /** 构造器名称 */
    constructorName: string
}

/** 绑定矢量编辑器事件参数 */
export interface BindMapVectorEditorEventsParams<TInstance extends MapVectorEditorInstance> {
    /** 编辑器实例 */
    editor: TInstance
    /** 事件映射 */
    events?: MapVectorEditorEvents<TInstance>
}

/** 移除矢量编辑器参数 */
export interface RemoveMapVectorEditorParams<TInstance extends MapVectorEditorInstance> {
    /** 编辑器实例 */
    editor: TInstance
    /** 销毁前回调 */
    onDestroy?: MapVectorEditorOnDestroy<TInstance>
}

/** 内部矢量编辑器组件属性 */
export interface MapVectorEditorProps<
    TInstance extends MapVectorEditorInstance<TTarget>,
    TTarget,
    TOptions extends MapVectorEditorBaseOptions,
> extends MapVectorEditorEventShortcutProps<TInstance> {
    /** 编辑器实例 ref */
    ref?: Ref<TInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 编辑对象 */
    target?: TTarget | null
    /** 是否开启编辑 */
    active?: boolean
    /** 插件名称 */
    pluginName: MapPlugin
    /** 构造器名称 */
    constructorName: string
    /** 编辑器参数 */
    options: TOptions
    /** 编辑器事件映射 */
    events?: MapVectorEditorEvents<TInstance>
    /** 编辑器创建完成回调 */
    onLoad?: MapVectorEditorOnLoad<TInstance>
    /** 编辑器销毁前回调 */
    onDestroy?: MapVectorEditorOnDestroy<TInstance>
}

/** 多边形编辑器组件属性 */
export interface PolygonEditorProps extends MapPolygonEditorOptions, MapPolygonEditorEventShortcutProps {
    /** 编辑器实例 ref */
    ref?: Ref<MapPolygonEditorInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 编辑对象 */
    target?: MapPolygonInstance | null
    /** 是否开启编辑 */
    active?: boolean
    /** 编辑器事件映射 */
    events?: MapVectorEditorEvents<MapPolygonEditorInstance>
    /** 编辑器创建完成回调 */
    onLoad?: MapVectorEditorOnLoad<MapPolygonEditorInstance>
    /** 编辑器销毁前回调 */
    onDestroy?: MapVectorEditorOnDestroy<MapPolygonEditorInstance>
}

/** 折线编辑器组件属性 */
export interface PolylineEditorProps extends MapPolylineEditorOptions, MapPolylineEditorEventShortcutProps {
    /** 编辑器实例 ref */
    ref?: Ref<MapPolylineEditorInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 编辑对象 */
    target?: MapPolylineInstance | null
    /** 是否开启编辑 */
    active?: boolean
    /** 编辑器事件映射 */
    events?: MapVectorEditorEvents<MapPolylineEditorInstance>
    /** 编辑器创建完成回调 */
    onLoad?: MapVectorEditorOnLoad<MapPolylineEditorInstance>
    /** 编辑器销毁前回调 */
    onDestroy?: MapVectorEditorOnDestroy<MapPolylineEditorInstance>
}

/** 通用 PolyEditor 组件属性 */
export interface PolyEditorProps extends MapPolyEditorOptions, MapPolyEditorEventShortcutProps {
    /** 编辑器实例 ref */
    ref?: Ref<MapPolyEditorInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 编辑对象 */
    target?: MapPolyEditorTarget | null
    /** 是否开启编辑 */
    active?: boolean
    /** 编辑器事件映射 */
    events?: MapVectorEditorEvents<MapPolyEditorInstance>
    /** 编辑器创建完成回调 */
    onLoad?: MapVectorEditorOnLoad<MapPolyEditorInstance>
    /** 编辑器销毁前回调 */
    onDestroy?: MapVectorEditorOnDestroy<MapPolyEditorInstance>
}

/** 圆形编辑器组件属性 */
export interface CircleEditorProps extends MapCircleEditorOptions, MapCircleEditorEventShortcutProps {
    /** 编辑器实例 ref */
    ref?: Ref<MapCircleEditorInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 编辑对象 */
    target?: MapCircleInstance | null
    /** 是否开启编辑 */
    active?: boolean
    /** 编辑器事件映射 */
    events?: MapVectorEditorEvents<MapCircleEditorInstance>
    /** 编辑器创建完成回调 */
    onLoad?: MapVectorEditorOnLoad<MapCircleEditorInstance>
    /** 编辑器销毁前回调 */
    onDestroy?: MapVectorEditorOnDestroy<MapCircleEditorInstance>
}

/** 贝塞尔曲线编辑器组件属性 */
export interface BezierCurveEditorProps extends MapBezierCurveEditorOptions, MapBezierCurveEditorEventShortcutProps {
    /** 编辑器实例 ref */
    ref?: Ref<MapBezierCurveEditorInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 编辑对象 */
    target?: MapBezierCurveInstance | null
    /** 是否开启编辑 */
    active?: boolean
    /** 编辑器事件映射 */
    events?: MapVectorEditorEvents<MapBezierCurveEditorInstance>
    /** 编辑器创建完成回调 */
    onLoad?: MapVectorEditorOnLoad<MapBezierCurveEditorInstance>
    /** 编辑器销毁前回调 */
    onDestroy?: MapVectorEditorOnDestroy<MapBezierCurveEditorInstance>
}

/** 椭圆编辑器组件属性 */
export interface EllipseEditorProps extends MapEllipseEditorOptions, MapEllipseEditorEventShortcutProps {
    /** 编辑器实例 ref */
    ref?: Ref<MapEllipseEditorInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 编辑对象 */
    target?: MapEllipseInstance | null
    /** 是否开启编辑 */
    active?: boolean
    /** 编辑器事件映射 */
    events?: MapVectorEditorEvents<MapEllipseEditorInstance>
    /** 编辑器创建完成回调 */
    onLoad?: MapVectorEditorOnLoad<MapEllipseEditorInstance>
    /** 编辑器销毁前回调 */
    onDestroy?: MapVectorEditorOnDestroy<MapEllipseEditorInstance>
}

/** 矩形编辑器组件属性 */
export interface RectangleEditorProps extends MapRectangleEditorOptions, MapRectangleEditorEventShortcutProps {
    /** 编辑器实例 ref */
    ref?: Ref<MapRectangleEditorInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 编辑对象 */
    target?: MapRectangleInstance | null
    /** 是否开启编辑 */
    active?: boolean
    /** 编辑器事件映射 */
    events?: MapVectorEditorEvents<MapRectangleEditorInstance>
    /** 编辑器创建完成回调 */
    onLoad?: MapVectorEditorOnLoad<MapRectangleEditorInstance>
    /** 编辑器销毁前回调 */
    onDestroy?: MapVectorEditorOnDestroy<MapRectangleEditorInstance>
}

function getDefinedMapVectorEditorOptions<TOptions extends MapVectorEditorBaseOptions>({
    extraOptions,
}: MergeMapVectorEditorOptionsParams<TOptions>) {
    const nextOptions: TOptions = {} as TOptions

    Object.entries(extraOptions ?? {}).forEach(([key, value]) => {
        if (value !== undefined) (nextOptions as Record<string, unknown>)[key] = value
    })

    return nextOptions
}

function setMapVectorEditorRef<TInstance extends MapVectorEditorInstance>({
    ref,
    editor,
}: SetMapVectorEditorRefParams<TInstance>) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(editor)
        return
    }

    ref.current = editor
}

function getMapVectorEditorConstructor<
    TInstance extends MapVectorEditorInstance<TTarget>,
    TTarget,
    TOptions extends MapVectorEditorBaseOptions,
>({ AMap, constructorName }: GetMapVectorEditorConstructorParams) {
    const constructor = (AMap as unknown as Record<string, unknown>)[constructorName]

    if (typeof constructor !== "function") return undefined

    return constructor as MapVectorEditorConstructor<TInstance, TTarget, TOptions>
}

function bindMapVectorEditorEvents<TInstance extends MapVectorEditorInstance>({
    editor,
    events,
}: BindMapVectorEditorEventsParams<TInstance>) {
    const eventEntries = getMapEventEntries(events)

    eventEntries.forEach(({ eventName, handler }) => editor.on?.(eventName, handler))

    return function unbindMapVectorEditorEvents() {
        eventEntries.forEach(({ eventName, handler }) => editor.off?.(eventName, handler))
    }
}

function removeMapVectorEditor<TInstance extends MapVectorEditorInstance>({
    editor,
    onDestroy,
}: RemoveMapVectorEditorParams<TInstance>) {
    try {
        onDestroy?.(editor)
    } finally {
        editor.close?.()
    }
}

function MapVectorEditor<
    TInstance extends MapVectorEditorInstance<TTarget>,
    TTarget,
    TOptions extends MapVectorEditorBaseOptions,
>({
    ref,
    map,
    AMap,
    target,
    active,
    pluginName,
    constructorName,
    options,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...eventShortcuts
}: MapVectorEditorProps<TInstance, TTarget, TOptions>) {
    const context = useMapContext()
    const editorRef = useRef<TInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = AMap ?? context.AMap
    const pluginLoaded = useMapPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName,
        constructorName,
    })
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialTarget = useEffectEvent(() => target)
    const getInitialOptions = useEffectEvent(() => options)
    const getInitialActive = useEffectEvent(() => active)
    const currentEvents = mergeMapEvents({
        eventShortcuts,
        events,
    }) as MapVectorEditorEvents

    useStableEffect(() => {
        if (!currentMap || !currentAMap || !pluginLoaded) return

        const EditorConstructor = getMapVectorEditorConstructor<TInstance, TTarget, TOptions>({
            AMap: currentAMap,
            constructorName,
        })

        if (!EditorConstructor) return

        const editor = new EditorConstructor(currentMap, getInitialTarget(), getInitialOptions())

        editorRef.current = editor
        setMapVectorEditorRef({
            ref,
            editor,
        })

        if (getInitialActive()) editor.open?.()

        onLoad(editor)

        return () => {
            editorRef.current = null
            setMapVectorEditorRef({
                ref,
                editor: null,
            })
            removeMapVectorEditor({
                editor,
                onDestroy,
            })
        }
    }, [constructorName, currentAMap, currentMap, pluginLoaded, ref])

    useStableEffect(() => {
        if (!editorRef.current) return

        editorRef.current.setTarget?.(target)
    }, [target])

    useStableEffect(() => {
        if (!editorRef.current) return

        if (active) {
            editorRef.current.open?.()
            return
        }

        editorRef.current.close?.()
    }, [active])

    useStableEffect(() => {
        if (!editorRef.current) return

        return bindMapVectorEditorEvents({
            editor: editorRef.current,
            events: currentEvents,
        })
    }, [constructorName, currentAMap, currentEvents, currentMap, pluginLoaded, ref])

    return null
}

export const PolygonEditor: FC<PolygonEditorProps> = ({
    ref,
    map,
    AMap,
    target,
    active = true,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitMapEventShortcutProps(restOptions)
    const currentOptions = getDefinedMapVectorEditorOptions({
        extraOptions: restProps as MapPolygonEditorOptions,
    })

    return (
        <MapVectorEditor
            ref={ref}
            map={map}
            AMap={AMap}
            target={target}
            active={active}
            pluginName={MapPlugin.PolygonEditor}
            constructorName="PolygonEditor"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const PolylineEditor: FC<PolylineEditorProps> = ({
    ref,
    map,
    AMap,
    target,
    active = true,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitMapEventShortcutProps(restOptions)
    const currentOptions = getDefinedMapVectorEditorOptions({
        extraOptions: restProps as MapPolylineEditorOptions,
    })

    return (
        <MapVectorEditor
            ref={ref}
            map={map}
            AMap={AMap}
            target={target}
            active={active}
            pluginName={MapPlugin.PolylineEditor}
            constructorName="PolylineEditor"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const PolyEditor: FC<PolyEditorProps> = ({
    ref,
    map,
    AMap,
    target,
    active = true,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitMapEventShortcutProps(restOptions)
    const currentOptions = getDefinedMapVectorEditorOptions({
        extraOptions: restProps as MapPolyEditorOptions,
    })

    return (
        <MapVectorEditor
            ref={ref}
            map={map}
            AMap={AMap}
            target={target}
            active={active}
            pluginName={MapPlugin.PolyEditor}
            constructorName="PolyEditor"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const CircleEditor: FC<CircleEditorProps> = ({
    ref,
    map,
    AMap,
    target,
    active = true,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitMapEventShortcutProps(restOptions)
    const currentOptions = getDefinedMapVectorEditorOptions({
        extraOptions: restProps as MapCircleEditorOptions,
    })

    return (
        <MapVectorEditor
            ref={ref}
            map={map}
            AMap={AMap}
            target={target}
            active={active}
            pluginName={MapPlugin.CircleEditor}
            constructorName="CircleEditor"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const BezierCurveEditor: FC<BezierCurveEditorProps> = ({
    ref,
    map,
    AMap,
    target,
    active = true,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitMapEventShortcutProps(restOptions)
    const currentOptions = getDefinedMapVectorEditorOptions({
        extraOptions: restProps as MapBezierCurveEditorOptions,
    })

    return (
        <MapVectorEditor
            ref={ref}
            map={map}
            AMap={AMap}
            target={target}
            active={active}
            pluginName={MapPlugin.BezierCurveEditor}
            constructorName="BezierCurveEditor"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const EllipseEditor: FC<EllipseEditorProps> = ({
    ref,
    map,
    AMap,
    target,
    active = true,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitMapEventShortcutProps(restOptions)
    const currentOptions = getDefinedMapVectorEditorOptions({
        extraOptions: restProps as MapEllipseEditorOptions,
    })

    return (
        <MapVectorEditor
            ref={ref}
            map={map}
            AMap={AMap}
            target={target}
            active={active}
            pluginName={MapPlugin.EllipseEditor}
            constructorName="EllipseEditor"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const RectangleEditor: FC<RectangleEditorProps> = ({
    ref,
    map,
    AMap,
    target,
    active = true,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitMapEventShortcutProps(restOptions)
    const currentOptions = getDefinedMapVectorEditorOptions({
        extraOptions: restProps as MapRectangleEditorOptions,
    })

    return (
        <MapVectorEditor
            ref={ref}
            map={map}
            AMap={AMap}
            target={target}
            active={active}
            pluginName={MapPlugin.RectangleEditor}
            constructorName="RectangleEditor"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}
