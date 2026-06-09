import { type FC, type Ref, useEffectEvent, useRef } from "react"

import { AmapPlugin, type AmapEventHandler, type AmapMapInstance, type AmapNamespace, useAmapContext } from "./Amap"
import type { AmapMarkerOptions } from "./Marker"
import type { AmapPolylineOptions } from "./Vector"
import { optionalFn } from "../utils/optionalFn"
import { useAmapPlugin } from "../hooks/useAmapPlugin"
import { useStableEffect } from "../hooks/useStableEffect"
import { type AmapEventShortcutProps, mergeAmapEvents, splitAmapEventShortcutProps } from "../utils/amapEvents"

export type AmapRangingToolOnLoad = (rangingTool: AmapRangingToolInstance) => void

export type AmapRangingToolOnDestroy = (rangingTool: AmapRangingToolInstance) => void

/** 测距工具事件映射 */
export interface AmapRangingToolEvents {
    [eventName: string]: AmapEventHandler
}

/** 测距工具参数 */
export interface AmapRangingToolOptions {
    /** 起点标记样式 */
    startMarkerOptions?: AmapMarkerOptions
    /** 中间点标记样式 */
    midMarkerOptions?: AmapMarkerOptions
    /** 终点标记样式 */
    endMarkerOptions?: AmapMarkerOptions
    /** 测距线样式 */
    lineOptions?: AmapPolylineOptions
    /** 临时测距线样式 */
    tmpLineOptions?: AmapPolylineOptions
    /** 起点标签文字 */
    startLabelText?: string
    /** 中间点标签文字 */
    midLabelText?: string
    /** 终点标签文字 */
    endLabelText?: string
    /** 起点标签偏移量 */
    startLabelOffset?: unknown
    /** 中间点标签偏移量 */
    midLabelOffset?: unknown
    /** 终点标签偏移量 */
    endLabelOffset?: unknown
    [key: string]: unknown
}

/** 测距工具实例 */
export interface AmapRangingToolInstance {
    /** 启动测距 */
    turnOn?: () => void
    /** 关闭测距 */
    turnOff?: (removeOverlays?: boolean) => void
    /** 绑定事件 */
    on?: (eventName: string, handler: AmapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: AmapEventHandler) => void
    [key: string]: unknown
}

/** 支持测距工具构造器的高德命名空间 */
export interface AmapRangingToolNamespace extends AmapNamespace {
    /** RangingTool 构造器 */
    RangingTool?: new (map: AmapMapInstance, options?: AmapRangingToolOptions) => AmapRangingToolInstance
}

/** 测距工具组件属性 */
export interface RangingToolProps extends AmapRangingToolOptions, AmapEventShortcutProps {
    /** 测距工具实例 ref */
    ref?: Ref<AmapRangingToolInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 是否启动测距 */
    active?: boolean
    /** 关闭时是否清除覆盖物 */
    removeOverlaysOnTurnOff?: boolean
    /** 测距工具额外参数 */
    rangingToolOptions?: AmapRangingToolOptions
    /** 事件映射 */
    events?: AmapRangingToolEvents
    /** 创建完成回调 */
    onLoad?: AmapRangingToolOnLoad
    /** 销毁前回调 */
    onDestroy?: AmapRangingToolOnDestroy
}

function setAmapRangingToolRef(ref: Ref<AmapRangingToolInstance | null> | undefined, rangingTool: AmapRangingToolInstance | null) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(rangingTool)
        return
    }

    ref.current = rangingTool
}

function bindAmapRangingToolEvents(rangingTool: AmapRangingToolInstance, events?: AmapRangingToolEvents) {
    const eventEntries = Object.entries(events ?? {})

    eventEntries.forEach(([eventName, handler]) => rangingTool.on?.(eventName, handler))

    return function unbindAmapRangingToolEvents() {
        eventEntries.forEach(([eventName, handler]) => rangingTool.off?.(eventName, handler))
    }
}

function mergeAmapRangingToolOptions(options: AmapRangingToolOptions | undefined, extraOptions: AmapRangingToolOptions) {
    const nextOptions: AmapRangingToolOptions = {
        ...options,
    }

    Object.entries(extraOptions).forEach(([key, value]) => {
        if (value !== undefined) nextOptions[key] = value
    })

    return nextOptions
}

export const RangingTool: FC<RangingToolProps> = ({
    ref,
    map,
    AMap,
    active = true,
    removeOverlaysOnTurnOff = false,
    rangingToolOptions,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useAmapContext()
    const rangingToolRef = useRef<AmapRangingToolInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as AmapRangingToolNamespace | null
    const { eventShortcuts, restProps: restOptions } = splitAmapEventShortcutProps(restProps)
    const pluginLoaded = useAmapPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName: AmapPlugin.RangingTool,
        constructorName: "RangingTool",
    })
    const currentOptions = mergeAmapRangingToolOptions(rangingToolOptions, restOptions as AmapRangingToolOptions)
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapRangingToolEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialOptions = useEffectEvent(() => currentOptions)

    useStableEffect(() => {
        if (!currentMap || !currentAMap?.RangingTool || !pluginLoaded) return

        const rangingTool = new currentAMap.RangingTool(currentMap, getInitialOptions())

        rangingToolRef.current = rangingTool
        setAmapRangingToolRef(ref, rangingTool)
        if (active) rangingTool.turnOn?.()
        onLoad(rangingTool)

        return () => {
            rangingToolRef.current = null
            setAmapRangingToolRef(ref, null)

            try {
                onDestroy(rangingTool)
            } finally {
                rangingTool.turnOff?.(removeOverlaysOnTurnOff)
            }
        }
    }, [active, currentAMap, currentMap, pluginLoaded, ref, removeOverlaysOnTurnOff])

    useStableEffect(() => {
        if (!rangingToolRef.current) return

        if (active) {
            rangingToolRef.current.turnOn?.()
            return
        }

        rangingToolRef.current.turnOff?.(removeOverlaysOnTurnOff)
    }, [active, removeOverlaysOnTurnOff])

    useStableEffect(() => {
        if (!rangingToolRef.current) return

        return bindAmapRangingToolEvents(rangingToolRef.current, currentEvents)
    }, [currentAMap, currentEvents, currentMap, pluginLoaded, ref])

    return null
}
