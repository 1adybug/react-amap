import { type FC, type Ref, useEffectEvent, useRef } from "react"

import {
    MapPlugin,
    type MapEventHandler,
    type MapInstance,
    type MapNamespace,
    useMapContext,
} from "./Map"
import type { MapMarkerOptions } from "./Marker"
import type {
    MapCircleOptions,
    MapPolygonOptions,
    MapPolylineOptions,
} from "./Vector"
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
} from "../utils/mapEvents"

/** 鼠标工具绘制模式 */
export const MapMouseToolMode = {
    Marker: "marker",
    Circle: "circle",
    Rectangle: "rectangle",
    Polyline: "polyline",
    Polygon: "polygon",
    MeasureArea: "measureArea",
    Rule: "rule",
    RectZoomIn: "rectZoomIn",
    RectZoomOut: "rectZoomOut",
} as const

export type MapMouseToolMode = (typeof MapMouseToolMode)[keyof typeof MapMouseToolMode]

export type MapMouseToolOnLoad = (mouseTool: MapMouseToolInstance) => void

export type MapMouseToolOnDestroy = (mouseTool: MapMouseToolInstance) => void

export type MapMouseToolDrawOptions =
    | MapMarkerOptions
    | MapCircleOptions
    | MapPolygonOptions
    | MapPolylineOptions

/** MouseTool 鼠标事件 */
export interface MapMouseToolMouseEvent extends MapOverlayMouseEvent<MapMouseToolInstance> {}

/** MouseTool 交互坐标事件 */
export interface MapMouseToolInteractionEvent extends MapOverlayInteractionEvent<MapMouseToolInstance> {}

/** MouseTool 目标事件 */
export interface MapMouseToolTargetEvent extends MapTargetEvent<MapMouseToolInstance> {}

/** MouseTool 移动动画事件 */
export interface MapMouseToolMoveEvent extends MapMoveEvent<MapMouseToolInstance> {}

/** MouseTool 绘制完成事件 */
export interface MapMouseToolDrawEvent extends MapTargetEvent<MapMouseToolInstance> {
    /** 绘制出的覆盖物 */
    obj?: unknown
}

/** MouseTool 事件快捷属性 */
export interface MapMouseToolEventShortcutProps extends MapOverlayEventShortcutProps<MapMouseToolInstance> {}

export type MapMouseToolOnDraw = (event: MapMouseToolDrawEvent) => void

/** 鼠标工具事件映射 */
export interface MapMouseToolEvents extends MapOverlayEventMap<MapMouseToolInstance> {
    /** 绘制完成事件 */
    draw?: MapMouseToolOnDraw
}

/** 鼠标工具实例 */
export interface MapMouseToolInstance {
    /** 绘制点标记 */
    marker?: (options?: MapMarkerOptions) => void
    /** 绘制圆形 */
    circle?: (options?: MapCircleOptions) => void
    /** 绘制矩形 */
    rectangle?: (options?: MapPolygonOptions) => void
    /** 绘制折线 */
    polyline?: (options?: MapPolylineOptions) => void
    /** 绘制多边形 */
    polygon?: (options?: MapPolygonOptions) => void
    /** 面积量测 */
    measureArea?: (options?: MapPolygonOptions) => void
    /** 距离量测 */
    rule?: (options?: MapPolylineOptions) => void
    /** 拉框放大 */
    rectZoomIn?: (options?: MapPolygonOptions) => void
    /** 拉框缩小 */
    rectZoomOut?: (options?: MapPolygonOptions) => void
    /** 关闭当前鼠标操作 */
    close?: (ifClear?: boolean) => void
    /** 绑定事件 */
    on?: (eventName: string, handler: MapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: MapEventHandler) => void
}

/** 鼠标工具构造器 */
export interface MapMouseToolConstructor {
    new (map: MapInstance): MapMouseToolInstance
}

/** 支持 MouseTool 构造器的高德命名空间 */
export interface MapMouseToolNamespace extends MapNamespace {
    /** MouseTool 构造器 */
    MouseTool?: new (map: MapInstance) => MapMouseToolInstance
}

/** 获取 MouseTool 构造器参数 */
export interface GetMapMouseToolConstructorParams {
    /** 高德地图命名空间 */
    AMap: MapNamespace
}

/** 设置 MouseTool ref 参数 */
export interface SetMapMouseToolRefParams {
    /** 外部 ref */
    ref?: Ref<MapMouseToolInstance | null>
    /** MouseTool 实例 */
    mouseTool: MapMouseToolInstance | null
}

/** 绑定 MouseTool 事件参数 */
export interface BindMapMouseToolEventsParams {
    /** MouseTool 实例 */
    mouseTool: MapMouseToolInstance
    /** 事件映射 */
    events?: MapMouseToolEvents
    /** 绘制完成回调 */
    onDraw?: MapMouseToolOnDraw
}

/** 获取 MouseTool 模式参数 */
export interface GetMapMouseToolModeOptionsParams {
    /** 绘制模式 */
    mode?: MapMouseToolMode
    /** 通用绘制参数 */
    options?: MapMouseToolDrawOptions
    /** 点标记参数 */
    markerOptions?: MapMarkerOptions
    /** 圆形参数 */
    circleOptions?: MapCircleOptions
    /** 矩形参数 */
    rectangleOptions?: MapPolygonOptions
    /** 折线参数 */
    polylineOptions?: MapPolylineOptions
    /** 多边形参数 */
    polygonOptions?: MapPolygonOptions
    /** 面积量测参数 */
    measureAreaOptions?: MapPolygonOptions
    /** 距离量测参数 */
    ruleOptions?: MapPolylineOptions
    /** 拉框放大参数 */
    rectZoomInOptions?: MapPolygonOptions
    /** 拉框缩小参数 */
    rectZoomOutOptions?: MapPolygonOptions
}

/** 开启 MouseTool 模式参数 */
export interface OpenMapMouseToolModeParams extends GetMapMouseToolModeOptionsParams {
    /** MouseTool 实例 */
    mouseTool: MapMouseToolInstance
}

/** MouseTool 组件属性 */
export interface MouseToolProps extends MapMouseToolEventShortcutProps {
    /** MouseTool 实例 ref */
    ref?: Ref<MapMouseToolInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 绘制模式 */
    mode?: MapMouseToolMode
    /** 是否开启当前模式 */
    active?: boolean
    /** 通用绘制参数 */
    options?: MapMouseToolDrawOptions
    /** 点标记参数 */
    markerOptions?: MapMarkerOptions
    /** 圆形参数 */
    circleOptions?: MapCircleOptions
    /** 矩形参数 */
    rectangleOptions?: MapPolygonOptions
    /** 折线参数 */
    polylineOptions?: MapPolylineOptions
    /** 多边形参数 */
    polygonOptions?: MapPolygonOptions
    /** 面积量测参数 */
    measureAreaOptions?: MapPolygonOptions
    /** 距离量测参数 */
    ruleOptions?: MapPolylineOptions
    /** 拉框放大参数 */
    rectZoomInOptions?: MapPolygonOptions
    /** 拉框缩小参数 */
    rectZoomOutOptions?: MapPolygonOptions
    /** 关闭时是否清除绘制覆盖物 */
    clearOnClose?: boolean
    /** 切换模式时是否清除绘制覆盖物 */
    clearOnModeChange?: boolean
    /** MouseTool 事件映射 */
    events?: MapMouseToolEvents
    /** 绘制完成回调 */
    onDraw?: MapMouseToolOnDraw
    /** MouseTool 创建完成回调 */
    onLoad?: MapMouseToolOnLoad
    /** MouseTool 销毁前回调 */
    onDestroy?: MapMouseToolOnDestroy
}

function getMapMouseToolConstructor({ AMap }: GetMapMouseToolConstructorParams) {
    const constructor = (AMap as unknown as Record<string, unknown>).MouseTool

    if (typeof constructor !== "function") return undefined

    return constructor as MapMouseToolConstructor
}

function setMapMouseToolRef({ ref, mouseTool }: SetMapMouseToolRefParams) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(mouseTool)
        return
    }

    ref.current = mouseTool
}

function bindMapMouseToolEvents({ mouseTool, events, onDraw }: BindMapMouseToolEventsParams) {
    const eventEntries = getMapEventEntries(events)

    eventEntries.forEach(({ eventName, handler }) => mouseTool.on?.(eventName, handler))

    if (onDraw) mouseTool.on?.("draw", onDraw)

    return function unbindMapMouseToolEvents() {
        eventEntries.forEach(({ eventName, handler }) => mouseTool.off?.(eventName, handler))

        if (onDraw) mouseTool.off?.("draw", onDraw)
    }
}

function getMapMouseToolModeOptions({
    mode,
    options,
    markerOptions,
    circleOptions,
    rectangleOptions,
    polylineOptions,
    polygonOptions,
    measureAreaOptions,
    ruleOptions,
    rectZoomInOptions,
    rectZoomOutOptions,
}: GetMapMouseToolModeOptionsParams) {
    if (options) return options

    if (mode === MapMouseToolMode.Marker) return markerOptions
    if (mode === MapMouseToolMode.Circle) return circleOptions
    if (mode === MapMouseToolMode.Rectangle) return rectangleOptions
    if (mode === MapMouseToolMode.Polyline) return polylineOptions
    if (mode === MapMouseToolMode.Polygon) return polygonOptions
    if (mode === MapMouseToolMode.MeasureArea) return measureAreaOptions
    if (mode === MapMouseToolMode.Rule) return ruleOptions
    if (mode === MapMouseToolMode.RectZoomIn) return rectZoomInOptions
    if (mode === MapMouseToolMode.RectZoomOut) return rectZoomOutOptions

    return undefined
}

function openMapMouseToolMode({
    mouseTool,
    mode,
    options,
    markerOptions,
    circleOptions,
    rectangleOptions,
    polylineOptions,
    polygonOptions,
    measureAreaOptions,
    ruleOptions,
    rectZoomInOptions,
    rectZoomOutOptions,
}: OpenMapMouseToolModeParams) {
    const modeOptions = getMapMouseToolModeOptions({
        mode,
        options,
        markerOptions,
        circleOptions,
        rectangleOptions,
        polylineOptions,
        polygonOptions,
        measureAreaOptions,
        ruleOptions,
        rectZoomInOptions,
        rectZoomOutOptions,
    })

    if (mode === MapMouseToolMode.Marker) {
        mouseTool.marker?.(modeOptions as MapMarkerOptions | undefined)
        return
    }

    if (mode === MapMouseToolMode.Circle) {
        mouseTool.circle?.(modeOptions as MapCircleOptions | undefined)
        return
    }

    if (mode === MapMouseToolMode.Rectangle) {
        mouseTool.rectangle?.(modeOptions as MapPolygonOptions | undefined)
        return
    }

    if (mode === MapMouseToolMode.Polyline) {
        mouseTool.polyline?.(modeOptions as MapPolylineOptions | undefined)
        return
    }

    if (mode === MapMouseToolMode.Polygon) {
        mouseTool.polygon?.(modeOptions as MapPolygonOptions | undefined)
        return
    }

    if (mode === MapMouseToolMode.MeasureArea) {
        mouseTool.measureArea?.(modeOptions as MapPolygonOptions | undefined)
        return
    }

    if (mode === MapMouseToolMode.Rule) {
        mouseTool.rule?.(modeOptions as MapPolylineOptions | undefined)
        return
    }

    if (mode === MapMouseToolMode.RectZoomIn) {
        mouseTool.rectZoomIn?.(modeOptions as MapPolygonOptions | undefined)
        return
    }

    if (mode === MapMouseToolMode.RectZoomOut) mouseTool.rectZoomOut?.(modeOptions as MapPolygonOptions | undefined)
}

export const MouseTool: FC<MouseToolProps> = ({
    ref,
    map,
    AMap,
    mode,
    active = true,
    options,
    markerOptions,
    circleOptions,
    rectangleOptions,
    polylineOptions,
    polygonOptions,
    measureAreaOptions,
    ruleOptions,
    rectZoomInOptions,
    rectZoomOutOptions,
    clearOnClose = false,
    clearOnModeChange = false,
    events,
    onDraw,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...eventShortcuts
}) => {
    const context = useMapContext()
    const mouseToolRef = useRef<MapMouseToolInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = AMap ?? context.AMap
    const pluginLoaded = useMapPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName: MapPlugin.MouseTool,
        constructorName: "MouseTool",
    })
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const currentEvents = mergeMapEvents({
        eventShortcuts,
        events,
    }) as MapMouseToolEvents

    useStableEffect(() => {
        if (!currentMap || !currentAMap || !pluginLoaded) return

        const MouseToolConstructor = getMapMouseToolConstructor({
            AMap: currentAMap,
        })

        if (!MouseToolConstructor) return

        const mouseTool = new MouseToolConstructor(currentMap)

        mouseToolRef.current = mouseTool
        setMapMouseToolRef({
            ref,
            mouseTool,
        })
        onLoad(mouseTool)

        return () => {
            mouseToolRef.current = null
            setMapMouseToolRef({
                ref,
                mouseTool: null,
            })
            try {
                onDestroy(mouseTool)
            } finally {
                mouseTool.close?.(clearOnClose)
            }
        }
    }, [clearOnClose, currentAMap, currentMap, pluginLoaded, ref])

    useStableEffect(() => {
        if (!mouseToolRef.current) return

        mouseToolRef.current.close?.(clearOnModeChange)

        if (!active || !mode) return

        openMapMouseToolMode({
            mouseTool: mouseToolRef.current,
            mode,
            options,
            markerOptions,
            circleOptions,
            rectangleOptions,
            polylineOptions,
            polygonOptions,
            measureAreaOptions,
            ruleOptions,
            rectZoomInOptions,
            rectZoomOutOptions,
        })
    }, [
        active,
        circleOptions,
        clearOnModeChange,
        markerOptions,
        measureAreaOptions,
        mode,
        options,
        polygonOptions,
        polylineOptions,
        rectangleOptions,
        rectZoomInOptions,
        rectZoomOutOptions,
        ruleOptions,
    ])

    useStableEffect(() => {
        if (!mouseToolRef.current) return

        return bindMapMouseToolEvents({
            mouseTool: mouseToolRef.current,
            events: currentEvents,
            onDraw,
        })
    }, [currentAMap, currentEvents, currentMap, onDraw, pluginLoaded, ref])

    return null
}