import { type FC, type ReactNode, type Ref, createContext, useContext, useEffectEvent, useRef, useState } from "react"

import { type MapEventHandler, type MapInstance, type MapNamespace, type MapZoomRange, useMapContext } from "./Map"
import { optionalFn } from "../utils/optionalFn"
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

export type MapGroupOnLoad<TInstance extends MapGroupInstance = MapGroupInstance> = (group: TInstance) => void

export type MapGroupOnDestroy<TInstance extends MapGroupInstance = MapGroupInstance> = (group: TInstance) => void

export type MapGroupChildSync = () => void

export type MapGroupChildSyncCleanup = () => void

/** 群组事件映射 */
export interface MapGroupEvents<TInstance = MapGroupInstance>
    extends MapOverlayEventMap<TInstance> {}

/** 群组参数 */
export interface MapGroupOptions {
    /** 是否可见 */
    visible?: boolean
    /** 透明度 */
    opacity?: number
    /** 层级 */
    zIndex?: number
    /** 缩放范围 */
    zooms?: MapZoomRange
}

/** 群组实例 */
export interface MapGroupInstance {
    /** 设置地图 */
    setMap?: (map: MapInstance | null) => void
    /** 设置参数 */
    setOptions?: (options: MapGroupOptions) => void
    /** 显示 */
    show?: () => void
    /** 隐藏 */
    hide?: () => void
    /** 绑定事件 */
    on?: (eventName: string, handler: MapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: MapEventHandler) => void
}

/** 覆盖物群组实例 */
export interface MapOverlayGroupInstance extends MapGroupInstance {
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
export interface MapLayerGroupInstance extends MapGroupInstance {
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

/** 群组鼠标事件 */
export interface MapGroupMouseEvent<TInstance = MapGroupInstance> extends MapOverlayMouseEvent<TInstance> {}

/** 群组交互坐标事件 */
export interface MapGroupInteractionEvent<TInstance = MapGroupInstance> extends MapOverlayInteractionEvent<TInstance> {}

/** 群组目标事件 */
export interface MapGroupTargetEvent<TInstance = MapGroupInstance> extends MapTargetEvent<TInstance> {}

/** 群组移动动画事件 */
export interface MapGroupMoveEvent<TInstance = MapGroupInstance> extends MapMoveEvent<TInstance> {}

/** 群组事件快捷属性 */
export interface MapGroupEventShortcutProps<TInstance = MapGroupInstance>
    extends MapOverlayEventShortcutProps<TInstance> {}

/** 覆盖物群组鼠标事件 */
export interface MapOverlayGroupMouseEvent extends MapGroupMouseEvent<MapOverlayGroupInstance> {}

/** 覆盖物群组交互坐标事件 */
export interface MapOverlayGroupInteractionEvent extends MapGroupInteractionEvent<MapOverlayGroupInstance> {}

/** 覆盖物群组目标事件 */
export interface MapOverlayGroupTargetEvent extends MapGroupTargetEvent<MapOverlayGroupInstance> {}

/** 覆盖物群组移动动画事件 */
export interface MapOverlayGroupMoveEvent extends MapGroupMoveEvent<MapOverlayGroupInstance> {}

/** 覆盖物群组事件快捷属性 */
export interface MapOverlayGroupEventShortcutProps extends MapGroupEventShortcutProps<MapOverlayGroupInstance> {}

/** 图层群组鼠标事件 */
export interface MapLayerGroupMouseEvent extends MapGroupMouseEvent<MapLayerGroupInstance> {}

/** 图层群组交互坐标事件 */
export interface MapLayerGroupInteractionEvent extends MapGroupInteractionEvent<MapLayerGroupInstance> {}

/** 图层群组目标事件 */
export interface MapLayerGroupTargetEvent extends MapGroupTargetEvent<MapLayerGroupInstance> {}

/** 图层群组移动动画事件 */
export interface MapLayerGroupMoveEvent extends MapGroupMoveEvent<MapLayerGroupInstance> {}

/** 图层群组事件快捷属性 */
export interface MapLayerGroupEventShortcutProps extends MapGroupEventShortcutProps<MapLayerGroupInstance> {}

/** 支持群组构造器的高德命名空间 */
export interface MapGroupNamespace extends MapNamespace {
    /** OverlayGroup 构造器 */
    OverlayGroup?: new (overlays?: unknown[]) => MapOverlayGroupInstance
    /** LayerGroup 构造器 */
    LayerGroup?: new (layers?: unknown[]) => MapLayerGroupInstance
}

/** 覆盖物群组组件属性 */
export interface OverlayGroupProps extends MapGroupOptions, MapOverlayGroupEventShortcutProps {
    /** 群组实例 ref */
    ref?: Ref<MapOverlayGroupInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 子覆盖物 */
    children?: ReactNode
    /** 事件映射 */
    events?: MapGroupEvents<MapOverlayGroupInstance>
    /** 创建完成回调 */
    onLoad?: MapGroupOnLoad<MapOverlayGroupInstance>
    /** 销毁前回调 */
    onDestroy?: MapGroupOnDestroy<MapOverlayGroupInstance>
}

/** 图层群组组件属性 */
export interface LayerGroupProps extends MapGroupOptions, MapLayerGroupEventShortcutProps {
    /** 群组实例 ref */
    ref?: Ref<MapLayerGroupInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 子图层 */
    children?: ReactNode
    /** 事件映射 */
    events?: MapGroupEvents<MapLayerGroupInstance>
    /** 创建完成回调 */
    onLoad?: MapGroupOnLoad<MapLayerGroupInstance>
    /** 销毁前回调 */
    onDestroy?: MapGroupOnDestroy<MapLayerGroupInstance>
}

/** 覆盖物群组上下文数据 */
export interface MapOverlayGroupContextValue {
    /** 覆盖物群组实例 */
    group: MapOverlayGroupInstance
    /** 添加覆盖物并同步群组状态 */
    addOverlay(overlay: unknown): void
    /** 移除覆盖物 */
    removeOverlay(overlay: unknown): void
    /** 同步子覆盖物变更后的群组状态 */
    sync(): void
    /** 同步所有子覆盖物 */
    syncChildren(): void
    /** 注册子覆盖物同步函数 */
    registerChildSync(sync: MapGroupChildSync): MapGroupChildSyncCleanup
}

/** 图层群组上下文数据 */
export interface MapLayerGroupContextValue {
    /** 图层群组实例 */
    group: MapLayerGroupInstance
    /** 添加图层并同步群组状态 */
    addLayer(layer: unknown): void
    /** 移除图层 */
    removeLayer(layer: unknown): void
    /** 同步子图层变更后的群组状态 */
    sync(): void
    /** 同步所有子图层 */
    syncChildren(): void
    /** 注册子图层同步函数 */
    registerChildSync(sync: MapGroupChildSync): MapGroupChildSyncCleanup
}

/** 创建覆盖物群组上下文参数 */
export interface CreateMapOverlayGroupContextValueParams {
    /** 覆盖物群组实例 */
    group: MapOverlayGroupInstance
    /** 获取最新群组参数 */
    getOptions: () => MapGroupOptions
}

/** 创建图层群组上下文参数 */
export interface CreateMapLayerGroupContextValueParams {
    /** 图层群组实例 */
    group: MapLayerGroupInstance
    /** 获取最新群组参数 */
    getOptions: () => MapGroupOptions
}

/** 覆盖物群组上下文 */
export const OverlayGroupContext = createContext<MapOverlayGroupContextValue | null>(null)

export function useOverlayGroupContext() {
    return useContext(OverlayGroupContext)
}

/** 图层群组上下文 */
export const LayerGroupContext = createContext<MapLayerGroupContextValue | null>(null)

export function useLayerGroupContext() {
    return useContext(LayerGroupContext)
}

function setMapGroupRef<TInstance extends MapGroupInstance>(ref: Ref<TInstance | null> | undefined, group: TInstance | null) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(group)
        return
    }

    ref.current = group
}

function bindMapGroupEvents<TInstance extends MapGroupInstance>(group: TInstance, events?: MapGroupEvents) {
    const eventEntries = getMapEventEntries(events)

    eventEntries.forEach(({ eventName, handler }) => group.on?.(eventName, handler))

    return function unbindMapGroupEvents() {
        eventEntries.forEach(({ eventName, handler }) => group.off?.(eventName, handler))
    }
}

function getMapGroupSetOptions(options: MapGroupOptions) {
    const setOptions: MapGroupOptions = {
        ...options,
    }

    delete setOptions.visible

    return setOptions
}

function setMapGroupOptions<TInstance extends MapGroupInstance>(group: TInstance, options: MapGroupOptions) {
    group.setOptions?.(getMapGroupSetOptions(options))
}

function syncMapGroupAfterChildChange<TInstance extends MapGroupInstance>(group: TInstance, options: MapGroupOptions) {
    setMapGroupOptions(group, options)

    if (options.visible === false) group.hide?.()
}

function updateMapGroup<TInstance extends MapGroupInstance>(group: TInstance, options: MapGroupOptions) {
    setMapGroupOptions(group, options)

    if (options.visible === undefined) return

    if (options.visible) {
        group.show?.()
        return
    }

    group.hide?.()
}

function createMapOverlayGroupContextValue({
    group,
    getOptions,
}: CreateMapOverlayGroupContextValueParams): MapOverlayGroupContextValue {
    const childSyncs = new Set<MapGroupChildSync>()

    function sync() {
        syncMapGroupAfterChildChange(group, getOptions())
    }

    function syncChildren() {
        childSyncs.forEach(childSync => childSync())
    }

    return {
        group,
        addOverlay(overlay) {
            group.addOverlay?.(overlay)
            sync()
        },
        removeOverlay(overlay) {
            group.removeOverlay?.(overlay)
        },
        sync,
        syncChildren,
        registerChildSync(childSync) {
            childSyncs.add(childSync)

            return function unregisterMapOverlayGroupChildSync() {
                childSyncs.delete(childSync)
            }
        },
    }
}

function createMapLayerGroupContextValue({
    group,
    getOptions,
}: CreateMapLayerGroupContextValueParams): MapLayerGroupContextValue {
    const childSyncs = new Set<MapGroupChildSync>()

    function sync() {
        syncMapGroupAfterChildChange(group, getOptions())
    }

    function syncChildren() {
        childSyncs.forEach(childSync => childSync())
    }

    return {
        group,
        addLayer(layer) {
            group.addLayer?.(layer)
            sync()
        },
        removeLayer(layer) {
            group.removeLayer?.(layer)
        },
        sync,
        syncChildren,
        registerChildSync(childSync) {
            childSyncs.add(childSync)

            return function unregisterMapLayerGroupChildSync() {
                childSyncs.delete(childSync)
            }
        },
    }
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
    const context = useMapContext()
    const groupRef = useRef<MapOverlayGroupInstance | null>(null)
    const [contextValue, setContextValue] = useState<MapOverlayGroupContextValue | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as MapGroupNamespace | null
    const { eventShortcuts, restProps: restOptions } = splitMapEventShortcutProps(restProps)
    const currentEvents = mergeMapEvents({
        eventShortcuts,
        events,
    }) as MapGroupEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getCurrentOptions = useEffectEvent(() => restOptions)

    useStableEffect(() => {
        if (!currentMap || !currentAMap?.OverlayGroup) return

        const initialOptions = getCurrentOptions()
        const group = new currentAMap.OverlayGroup()

        currentMap.add?.(group)
        groupRef.current = group
        setContextValue(createMapOverlayGroupContextValue({
            group,
            getOptions: getCurrentOptions,
        }))
        setMapGroupRef(ref, group)
        updateMapGroup(group, initialOptions)
        onLoad(group)

        return () => {
            groupRef.current = null
            setContextValue(null)
            setMapGroupRef(ref, null)

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

        updateMapGroup(groupRef.current, restOptions)
        contextValue?.syncChildren()
        if (restOptions.visible === false) groupRef.current.hide?.()
    }, [contextValue, restOptions])

    useStableEffect(() => {
        if (!groupRef.current) return

        return bindMapGroupEvents(groupRef.current, currentEvents)
    }, [currentAMap, currentEvents, currentMap, ref])

    return <OverlayGroupContext value={contextValue}>{contextValue ? children : null}</OverlayGroupContext>
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
    const context = useMapContext()
    const groupRef = useRef<MapLayerGroupInstance | null>(null)
    const [contextValue, setContextValue] = useState<MapLayerGroupContextValue | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as MapGroupNamespace | null
    const { eventShortcuts, restProps: restOptions } = splitMapEventShortcutProps(restProps)
    const currentEvents = mergeMapEvents({
        eventShortcuts,
        events,
    }) as MapGroupEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getCurrentOptions = useEffectEvent(() => restOptions)

    useStableEffect(() => {
        if (!currentMap || !currentAMap?.LayerGroup) return

        const initialOptions = getCurrentOptions()
        const group = new currentAMap.LayerGroup()

        group.setMap?.(currentMap)
        groupRef.current = group
        setContextValue(createMapLayerGroupContextValue({
            group,
            getOptions: getCurrentOptions,
        }))
        setMapGroupRef(ref, group)
        updateMapGroup(group, initialOptions)
        onLoad(group)

        return () => {
            groupRef.current = null
            setContextValue(null)
            setMapGroupRef(ref, null)

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

        updateMapGroup(groupRef.current, restOptions)
        contextValue?.syncChildren()
        if (restOptions.visible === false) groupRef.current.hide?.()
    }, [contextValue, restOptions])

    useStableEffect(() => {
        if (!groupRef.current) return

        return bindMapGroupEvents(groupRef.current, currentEvents)
    }, [currentAMap, currentEvents, currentMap, ref])

    return <LayerGroupContext value={contextValue}>{contextValue ? children : null}</LayerGroupContext>
}