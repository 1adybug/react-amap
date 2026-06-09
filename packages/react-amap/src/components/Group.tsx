import { type FC, type ReactNode, type Ref, createContext, useContext, useEffectEvent, useRef, useState } from "react"

import { type AmapEventHandler, type AmapMapInstance, type AmapNamespace, type AmapZoomRange, useAmapContext } from "./Amap"
import { optionalFn } from "../utils/optionalFn"
import { useStableEffect } from "../hooks/useStableEffect"
import {
    type AmapEventMap,
    type AmapEventShortcutProps,
    type AmapOverlayMouseEvent,
    getAmapEventEntries,
    mergeAmapEvents,
    splitAmapEventShortcutProps,
} from "../utils/amapEvents"

export type AmapGroupOnLoad<TInstance extends AmapGroupInstance = AmapGroupInstance> = (group: TInstance) => void

export type AmapGroupOnDestroy<TInstance extends AmapGroupInstance = AmapGroupInstance> = (group: TInstance) => void

/** 群组事件映射 */
export interface AmapGroupEvents<TInstance = AmapGroupInstance> extends AmapEventMap<AmapOverlayMouseEvent<TInstance>> {}

/** 群组参数 */
export interface AmapGroupOptions {
    /** 是否可见 */
    visible?: boolean
    /** 透明度 */
    opacity?: number
    /** 层级 */
    zIndex?: number
    /** 缩放范围 */
    zooms?: AmapZoomRange
    [key: string]: unknown
}

/** 群组实例 */
export interface AmapGroupInstance {
    /** 设置地图 */
    setMap?: (map: AmapMapInstance | null) => void
    /** 设置参数 */
    setOptions?: (options: AmapGroupOptions) => void
    /** 显示 */
    show?: () => void
    /** 隐藏 */
    hide?: () => void
    /** 绑定事件 */
    on?: (eventName: string, handler: AmapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: AmapEventHandler) => void
    [key: string]: unknown
}

/** 覆盖物群组实例 */
export interface AmapOverlayGroupInstance extends AmapGroupInstance {
    /** 添加覆盖物 */
    addOverlay?: (overlay: unknown) => void
    /** 添加多个覆盖物 */
    addOverlays?: (overlays: unknown[]) => void
    /** 判断覆盖物是否在群组中 */
    hasOverlay?: (overlay: unknown) => boolean
    /** 移除覆盖物 */
    removeOverlay?: (overlay: unknown) => void
    /** 移除多个覆盖物 */
    removeOverlays?: (overlays: unknown[]) => void
    /** 清空覆盖物 */
    clearOverlays?: () => void
    /** 获取覆盖物 */
    getOverlays?: () => unknown[]
}

/** 图层群组实例 */
export interface AmapLayerGroupInstance extends AmapGroupInstance {
    /** 添加图层 */
    addLayer?: (layer: unknown) => void
    /** 添加多个图层 */
    addLayers?: (layers: unknown[]) => void
    /** 移除图层 */
    removeLayer?: (layer: unknown) => void
    /** 移除多个图层 */
    removeLayers?: (layers: unknown[]) => void
    /** 清空图层 */
    clearLayers?: () => void
    /** 获取图层 */
    getLayers?: () => unknown[]
}

/** 支持群组构造器的高德命名空间 */
export interface AmapGroupNamespace extends AmapNamespace {
    /** OverlayGroup 构造器 */
    OverlayGroup?: new (overlays?: unknown[]) => AmapOverlayGroupInstance
    /** LayerGroup 构造器 */
    LayerGroup?: new (layers?: unknown[]) => AmapLayerGroupInstance
}

/** 覆盖物群组组件属性 */
export interface OverlayGroupProps
    extends AmapGroupOptions,
        AmapEventShortcutProps<AmapOverlayMouseEvent<AmapOverlayGroupInstance>> {
    /** 群组实例 ref */
    ref?: Ref<AmapOverlayGroupInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 子覆盖物 */
    children?: ReactNode
    /** 事件映射 */
    events?: AmapGroupEvents<AmapOverlayGroupInstance>
    /** 创建完成回调 */
    onLoad?: AmapGroupOnLoad<AmapOverlayGroupInstance>
    /** 销毁前回调 */
    onDestroy?: AmapGroupOnDestroy<AmapOverlayGroupInstance>
}

/** 图层群组组件属性 */
export interface LayerGroupProps extends AmapGroupOptions, AmapEventShortcutProps<AmapOverlayMouseEvent<AmapLayerGroupInstance>> {
    /** 群组实例 ref */
    ref?: Ref<AmapLayerGroupInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 子图层 */
    children?: ReactNode
    /** 事件映射 */
    events?: AmapGroupEvents<AmapLayerGroupInstance>
    /** 创建完成回调 */
    onLoad?: AmapGroupOnLoad<AmapLayerGroupInstance>
    /** 销毁前回调 */
    onDestroy?: AmapGroupOnDestroy<AmapLayerGroupInstance>
}

/** 覆盖物群组上下文 */
export const OverlayGroupContext = createContext<AmapOverlayGroupInstance | null>(null)

export function useOverlayGroupContext() {
    return useContext(OverlayGroupContext)
}

/** 图层群组上下文 */
export const LayerGroupContext = createContext<AmapLayerGroupInstance | null>(null)

export function useLayerGroupContext() {
    return useContext(LayerGroupContext)
}

function setAmapGroupRef<TInstance extends AmapGroupInstance>(ref: Ref<TInstance | null> | undefined, group: TInstance | null) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(group)
        return
    }

    ref.current = group
}

function bindAmapGroupEvents<TInstance extends AmapGroupInstance>(group: TInstance, events?: AmapGroupEvents) {
    const eventEntries = getAmapEventEntries(events)

    eventEntries.forEach(({ eventName, handler }) => group.on?.(eventName, handler))

    return function unbindAmapGroupEvents() {
        eventEntries.forEach(({ eventName, handler }) => group.off?.(eventName, handler))
    }
}

function updateAmapGroup<TInstance extends AmapGroupInstance>(group: TInstance, options: AmapGroupOptions) {
    group.setOptions?.(options)

    if (options.visible === undefined) return

    if (options.visible) {
        group.show?.()
        return
    }

    group.hide?.()
}

export const OverlayGroup: FC<OverlayGroupProps> = ({
    ref,
    map,
    AMap,
    children,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useAmapContext()
    const groupRef = useRef<AmapOverlayGroupInstance | null>(null)
    const [contextGroup, setContextGroup] = useState<AmapOverlayGroupInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as AmapGroupNamespace | null
    const { eventShortcuts, restProps: restOptions } = splitAmapEventShortcutProps(restProps)
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapGroupEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialOptions = useEffectEvent(() => restOptions)

    useStableEffect(() => {
        if (!currentMap || !currentAMap?.OverlayGroup) return

        const initialOptions = getInitialOptions()
        const group = new currentAMap.OverlayGroup()

        currentMap.add?.(group)
        groupRef.current = group
        setContextGroup(group)
        setAmapGroupRef(ref, group)
        updateAmapGroup(group, initialOptions)
        onLoad(group)

        return () => {
            groupRef.current = null
            setContextGroup(null)
            setAmapGroupRef(ref, null)

            try {
                onDestroy(group)
            } finally {
                group.clearOverlays?.()
                currentMap.remove?.(group)
            }
        }
    }, [currentAMap, currentMap, ref])

    useStableEffect(() => {
        if (!groupRef.current) return

        updateAmapGroup(groupRef.current, restOptions)
    }, [restOptions])

    useStableEffect(() => {
        if (!groupRef.current) return

        return bindAmapGroupEvents(groupRef.current, currentEvents)
    }, [currentAMap, currentEvents, currentMap, ref])

    return <OverlayGroupContext value={contextGroup}>{contextGroup ? children : null}</OverlayGroupContext>
}

export const LayerGroup: FC<LayerGroupProps> = ({
    ref,
    map,
    AMap,
    children,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useAmapContext()
    const groupRef = useRef<AmapLayerGroupInstance | null>(null)
    const [contextGroup, setContextGroup] = useState<AmapLayerGroupInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as AmapGroupNamespace | null
    const { eventShortcuts, restProps: restOptions } = splitAmapEventShortcutProps(restProps)
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapGroupEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialOptions = useEffectEvent(() => restOptions)

    useStableEffect(() => {
        if (!currentMap || !currentAMap?.LayerGroup) return

        const initialOptions = getInitialOptions()
        const group = new currentAMap.LayerGroup()

        group.setMap?.(currentMap)
        groupRef.current = group
        setContextGroup(group)
        setAmapGroupRef(ref, group)
        updateAmapGroup(group, initialOptions)
        onLoad(group)

        return () => {
            groupRef.current = null
            setContextGroup(null)
            setAmapGroupRef(ref, null)

            try {
                onDestroy(group)
            } finally {
                group.clearLayers?.()
                group.setMap?.(null)
            }
        }
    }, [currentAMap, currentMap, ref])

    useStableEffect(() => {
        if (!groupRef.current) return

        updateAmapGroup(groupRef.current, restOptions)
    }, [restOptions])

    useStableEffect(() => {
        if (!groupRef.current) return

        return bindAmapGroupEvents(groupRef.current, currentEvents)
    }, [currentAMap, currentEvents, currentMap, ref])

    return <LayerGroupContext value={contextGroup}>{contextGroup ? children : null}</LayerGroupContext>
}
