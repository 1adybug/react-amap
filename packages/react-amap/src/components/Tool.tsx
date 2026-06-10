import { type FC, type Ref, useEffectEvent, useRef } from "react"

import { MapPlugin, type MapEventHandler, type MapInstance, type MapNamespace, useMapContext } from "./Map"
import type { MapMarkerOptions } from "./Marker"
import type { MapPolylineOptions } from "./Vector"
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

export type MapRangingToolOnLoad = (rangingTool: MapRangingToolInstance) => void

export type MapRangingToolOnDestroy = (rangingTool: MapRangingToolInstance) => void

/** 测距工具鼠标事件 */
export interface MapRangingToolMouseEvent extends MapOverlayMouseEvent<MapRangingToolInstance> {}

/** 测距工具交互坐标事件 */
export interface MapRangingToolInteractionEvent extends MapOverlayInteractionEvent<MapRangingToolInstance> {}

/** 测距工具目标事件 */
export interface MapRangingToolTargetEvent extends MapTargetEvent<MapRangingToolInstance> {}

/** 测距工具移动动画事件 */
export interface MapRangingToolMoveEvent extends MapMoveEvent<MapRangingToolInstance> {}

/** 测距工具事件快捷属性 */
export interface MapRangingToolEventShortcutProps extends MapOverlayEventShortcutProps<MapRangingToolInstance> {}

/** 测距工具事件映射 */
export interface MapRangingToolEvents extends MapOverlayEventMap<MapRangingToolInstance> {}

/** 测距工具参数 */
export interface MapRangingToolOptions {
    /** 起点标记样式 */
    startMarkerOptions?: MapMarkerOptions
    /** 中间点标记样式 */
    midMarkerOptions?: MapMarkerOptions
    /** 终点标记样式 */
    endMarkerOptions?: MapMarkerOptions
    /** 测距线样式 */
    lineOptions?: MapPolylineOptions
    /** 临时测距线样式 */
    tmpLineOptions?: MapPolylineOptions
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
}

/** 测距工具实例 */
export interface MapRangingToolInstance {
    /** 启动测距 */
    turnOn?: () => void
    /** 关闭测距 */
    turnOff?: (removeOverlays?: boolean) => void
    /** 绑定事件 */
    on?: (eventName: string, handler: MapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: MapEventHandler) => void
}

/** 支持测距工具构造器的高德命名空间 */
export interface MapRangingToolNamespace extends MapNamespace {
    /** RangingTool 构造器 */
    RangingTool?: new (map: MapInstance, options?: MapRangingToolOptions) => MapRangingToolInstance
}

/** 测距工具组件属性 */
export interface RangingToolProps extends MapRangingToolOptions, MapRangingToolEventShortcutProps {
    /** 测距工具实例 ref */
    ref?: Ref<MapRangingToolInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 是否启动测距 */
    active?: boolean
    /** 关闭时是否清除覆盖物 */
    removeOverlaysOnTurnOff?: boolean
    /** 事件映射 */
    events?: MapRangingToolEvents
    /** 创建完成回调 */
    onLoad?: MapRangingToolOnLoad
    /** 销毁前回调 */
    onDestroy?: MapRangingToolOnDestroy
}

function setMapRangingToolRef(ref: Ref<MapRangingToolInstance | null> | undefined, rangingTool: MapRangingToolInstance | null) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(rangingTool)
        return
    }

    ref.current = rangingTool
}

function bindMapRangingToolEvents(rangingTool: MapRangingToolInstance, events?: MapRangingToolEvents) {
    const eventEntries = getMapEventEntries(events)

    eventEntries.forEach(({ eventName, handler }) => rangingTool.on?.(eventName, handler))

    return function unbindMapRangingToolEvents() {
        eventEntries.forEach(({ eventName, handler }) => rangingTool.off?.(eventName, handler))
    }
}

function getDefinedMapRangingToolOptions(options: MapRangingToolOptions) {
    const nextOptions: MapRangingToolOptions = {}

    Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
            Object.assign(nextOptions, {
                [key]: value,
            })
        }
    })

    return nextOptions
}

export const RangingTool: FC<RangingToolProps> = ({
    ref,
    map,
    AMap,
    active = true,
    removeOverlaysOnTurnOff = false,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useMapContext()
    const rangingToolRef = useRef<MapRangingToolInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as MapRangingToolNamespace | null
    const { eventShortcuts, restProps: restOptions } = splitMapEventShortcutProps(restProps)
    const pluginLoaded = useMapPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName: MapPlugin.RangingTool,
        constructorName: "RangingTool",
    })
    const currentOptions = getDefinedMapRangingToolOptions(restOptions as MapRangingToolOptions)
    const currentEvents = mergeMapEvents({
        eventShortcuts,
        events,
    }) as MapRangingToolEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialOptions = useEffectEvent(() => currentOptions)

    useStableEffect(() => {
        if (!currentMap || !currentAMap?.RangingTool || !pluginLoaded) return

        const rangingTool = new currentAMap.RangingTool(currentMap, getInitialOptions())

        rangingToolRef.current = rangingTool
        setMapRangingToolRef(ref, rangingTool)
        if (active) rangingTool.turnOn?.()
        onLoad(rangingTool)

        return () => {
            rangingToolRef.current = null
            setMapRangingToolRef(ref, null)

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

        return bindMapRangingToolEvents(rangingToolRef.current, currentEvents)
    }, [currentAMap, currentEvents, currentMap, pluginLoaded, ref])

    return null
}
