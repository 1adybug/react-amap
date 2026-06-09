import { type FC, type Ref, useEffectEvent, useRef } from "react"

import {
    AmapPlugin,
    type AmapEventHandler,
    type AmapMapInstance,
    type AmapNamespace,
    useAmapContext,
} from "./Amap"
import type { AmapMarkerOptions } from "./Marker"
import type {
    AmapCircleOptions,
    AmapPolygonOptions,
    AmapPolylineOptions,
} from "./Vector"
import { optionalFn } from "../utils/optionalFn"
import { useAmapPlugin } from "../hooks/useAmapPlugin"
import { useStableEffect } from "../hooks/useStableEffect"
import { type AmapEventShortcutProps, mergeAmapEvents } from "../utils/amapEvents"

/** 鼠标工具绘制模式 */
export const AmapMouseToolMode = {
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

export type AmapMouseToolMode = (typeof AmapMouseToolMode)[keyof typeof AmapMouseToolMode]

export type AmapMouseToolOnLoad = (mouseTool: AmapMouseToolInstance) => void

export type AmapMouseToolOnDestroy = (mouseTool: AmapMouseToolInstance) => void

/** 鼠标工具绘制参数 */
export interface AmapMouseToolDrawOptions {
    [key: string]: unknown
}

/** 鼠标工具事件映射 */
export interface AmapMouseToolEvents {
    [eventName: string]: AmapEventHandler
}

/** 鼠标工具实例 */
export interface AmapMouseToolInstance {
    /** 绘制点标记 */
    marker?: (options?: AmapMarkerOptions) => void
    /** 绘制圆形 */
    circle?: (options?: AmapCircleOptions) => void
    /** 绘制矩形 */
    rectangle?: (options?: AmapPolygonOptions) => void
    /** 绘制折线 */
    polyline?: (options?: AmapPolylineOptions) => void
    /** 绘制多边形 */
    polygon?: (options?: AmapPolygonOptions) => void
    /** 面积量测 */
    measureArea?: (options?: AmapPolygonOptions) => void
    /** 距离量测 */
    rule?: (options?: AmapPolylineOptions) => void
    /** 拉框放大 */
    rectZoomIn?: (options?: AmapPolygonOptions) => void
    /** 拉框缩小 */
    rectZoomOut?: (options?: AmapPolygonOptions) => void
    /** 关闭当前鼠标操作 */
    close?: (ifClear?: boolean) => void
    /** 绑定事件 */
    on?: (eventName: string, handler: AmapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: AmapEventHandler) => void
    [key: string]: unknown
}

/** 鼠标工具构造器 */
export interface AmapMouseToolConstructor {
    new (map: AmapMapInstance): AmapMouseToolInstance
}

/** 支持 MouseTool 构造器的高德命名空间 */
export interface AmapMouseToolNamespace extends AmapNamespace {
    /** MouseTool 构造器 */
    MouseTool?: new (map: AmapMapInstance) => AmapMouseToolInstance
}

/** 获取 MouseTool 构造器参数 */
export interface GetAmapMouseToolConstructorParams {
    /** 高德地图命名空间 */
    AMap: AmapNamespace
}

/** 设置 MouseTool ref 参数 */
export interface SetAmapMouseToolRefParams {
    /** 外部 ref */
    ref?: Ref<AmapMouseToolInstance | null>
    /** MouseTool 实例 */
    mouseTool: AmapMouseToolInstance | null
}

/** 绑定 MouseTool 事件参数 */
export interface BindAmapMouseToolEventsParams {
    /** MouseTool 实例 */
    mouseTool: AmapMouseToolInstance
    /** 事件映射 */
    events?: AmapMouseToolEvents
    /** 绘制完成回调 */
    onDraw?: AmapEventHandler
}

/** 获取 MouseTool 模式参数 */
export interface GetAmapMouseToolModeOptionsParams {
    /** 绘制模式 */
    mode?: AmapMouseToolMode
    /** 通用绘制参数 */
    options?: AmapMouseToolDrawOptions
    /** 点标记参数 */
    markerOptions?: AmapMarkerOptions
    /** 圆形参数 */
    circleOptions?: AmapCircleOptions
    /** 矩形参数 */
    rectangleOptions?: AmapPolygonOptions
    /** 折线参数 */
    polylineOptions?: AmapPolylineOptions
    /** 多边形参数 */
    polygonOptions?: AmapPolygonOptions
    /** 面积量测参数 */
    measureAreaOptions?: AmapPolygonOptions
    /** 距离量测参数 */
    ruleOptions?: AmapPolylineOptions
    /** 拉框放大参数 */
    rectZoomInOptions?: AmapPolygonOptions
    /** 拉框缩小参数 */
    rectZoomOutOptions?: AmapPolygonOptions
}

/** 开启 MouseTool 模式参数 */
export interface OpenAmapMouseToolModeParams extends GetAmapMouseToolModeOptionsParams {
    /** MouseTool 实例 */
    mouseTool: AmapMouseToolInstance
}

/** MouseTool 组件属性 */
export interface MouseToolProps extends AmapEventShortcutProps {
    /** MouseTool 实例 ref */
    ref?: Ref<AmapMouseToolInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 绘制模式 */
    mode?: AmapMouseToolMode
    /** 是否开启当前模式 */
    active?: boolean
    /** 通用绘制参数 */
    options?: AmapMouseToolDrawOptions
    /** 点标记参数 */
    markerOptions?: AmapMarkerOptions
    /** 圆形参数 */
    circleOptions?: AmapCircleOptions
    /** 矩形参数 */
    rectangleOptions?: AmapPolygonOptions
    /** 折线参数 */
    polylineOptions?: AmapPolylineOptions
    /** 多边形参数 */
    polygonOptions?: AmapPolygonOptions
    /** 面积量测参数 */
    measureAreaOptions?: AmapPolygonOptions
    /** 距离量测参数 */
    ruleOptions?: AmapPolylineOptions
    /** 拉框放大参数 */
    rectZoomInOptions?: AmapPolygonOptions
    /** 拉框缩小参数 */
    rectZoomOutOptions?: AmapPolygonOptions
    /** 关闭时是否清除绘制覆盖物 */
    clearOnClose?: boolean
    /** 切换模式时是否清除绘制覆盖物 */
    clearOnModeChange?: boolean
    /** MouseTool 事件映射 */
    events?: AmapMouseToolEvents
    /** 绘制完成回调 */
    onDraw?: AmapEventHandler
    /** MouseTool 创建完成回调 */
    onLoad?: AmapMouseToolOnLoad
    /** MouseTool 销毁前回调 */
    onDestroy?: AmapMouseToolOnDestroy
}

function getAmapMouseToolConstructor({ AMap }: GetAmapMouseToolConstructorParams) {
    const constructor = (AMap as Record<string, unknown>).MouseTool

    if (typeof constructor !== "function") return undefined

    return constructor as AmapMouseToolConstructor
}

function setAmapMouseToolRef({ ref, mouseTool }: SetAmapMouseToolRefParams) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(mouseTool)
        return
    }

    ref.current = mouseTool
}

function bindAmapMouseToolEvents({ mouseTool, events, onDraw }: BindAmapMouseToolEventsParams) {
    const eventEntries = Object.entries(events ?? {})

    eventEntries.forEach(([eventName, handler]) => mouseTool.on?.(eventName, handler))

    if (onDraw) mouseTool.on?.("draw", onDraw)

    return function unbindAmapMouseToolEvents() {
        eventEntries.forEach(([eventName, handler]) => mouseTool.off?.(eventName, handler))

        if (onDraw) mouseTool.off?.("draw", onDraw)
    }
}

function getAmapMouseToolModeOptions({
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
}: GetAmapMouseToolModeOptionsParams) {
    if (options) return options

    if (mode === AmapMouseToolMode.Marker) return markerOptions
    if (mode === AmapMouseToolMode.Circle) return circleOptions
    if (mode === AmapMouseToolMode.Rectangle) return rectangleOptions
    if (mode === AmapMouseToolMode.Polyline) return polylineOptions
    if (mode === AmapMouseToolMode.Polygon) return polygonOptions
    if (mode === AmapMouseToolMode.MeasureArea) return measureAreaOptions
    if (mode === AmapMouseToolMode.Rule) return ruleOptions
    if (mode === AmapMouseToolMode.RectZoomIn) return rectZoomInOptions
    if (mode === AmapMouseToolMode.RectZoomOut) return rectZoomOutOptions

    return undefined
}

function openAmapMouseToolMode({
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
}: OpenAmapMouseToolModeParams) {
    const modeOptions = getAmapMouseToolModeOptions({
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

    if (mode === AmapMouseToolMode.Marker) {
        mouseTool.marker?.(modeOptions as AmapMarkerOptions | undefined)
        return
    }

    if (mode === AmapMouseToolMode.Circle) {
        mouseTool.circle?.(modeOptions as AmapCircleOptions | undefined)
        return
    }

    if (mode === AmapMouseToolMode.Rectangle) {
        mouseTool.rectangle?.(modeOptions as AmapPolygonOptions | undefined)
        return
    }

    if (mode === AmapMouseToolMode.Polyline) {
        mouseTool.polyline?.(modeOptions as AmapPolylineOptions | undefined)
        return
    }

    if (mode === AmapMouseToolMode.Polygon) {
        mouseTool.polygon?.(modeOptions as AmapPolygonOptions | undefined)
        return
    }

    if (mode === AmapMouseToolMode.MeasureArea) {
        mouseTool.measureArea?.(modeOptions as AmapPolygonOptions | undefined)
        return
    }

    if (mode === AmapMouseToolMode.Rule) {
        mouseTool.rule?.(modeOptions as AmapPolylineOptions | undefined)
        return
    }

    if (mode === AmapMouseToolMode.RectZoomIn) {
        mouseTool.rectZoomIn?.(modeOptions as AmapPolygonOptions | undefined)
        return
    }

    if (mode === AmapMouseToolMode.RectZoomOut) mouseTool.rectZoomOut?.(modeOptions as AmapPolygonOptions | undefined)
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
    const context = useAmapContext()
    const mouseToolRef = useRef<AmapMouseToolInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = AMap ?? context.AMap
    const pluginLoaded = useAmapPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName: AmapPlugin.MouseTool,
        constructorName: "MouseTool",
    })
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapMouseToolEvents

    useStableEffect(() => {
        if (!currentMap || !currentAMap || !pluginLoaded) return

        const MouseToolConstructor = getAmapMouseToolConstructor({
            AMap: currentAMap,
        })

        if (!MouseToolConstructor) return

        const mouseTool = new MouseToolConstructor(currentMap)

        mouseToolRef.current = mouseTool
        setAmapMouseToolRef({
            ref,
            mouseTool,
        })
        onLoad(mouseTool)

        return () => {
            mouseToolRef.current = null
            setAmapMouseToolRef({
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

        openAmapMouseToolMode({
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

        return bindAmapMouseToolEvents({
            mouseTool: mouseToolRef.current,
            events: currentEvents,
            onDraw,
        })
    }, [currentAMap, currentEvents, currentMap, onDraw, pluginLoaded, ref])

    return null
}
