import { type FC, type ReactNode, type Ref, createContext, useContext, useEffectEvent, useRef, useState } from "react"

import { type AmapEventHandler, type AmapMapInstance, type AmapNamespace, type AmapZoomRange, useAmapContext } from "./Amap"
import { optionalFn } from "../utils/optionalFn"
import { useStableEffect } from "../hooks/useStableEffect"
import {
    type AmapMoveEvent,
    type AmapOverlayEventMap,
    type AmapOverlayEventShortcutProps,
    type AmapOverlayInteractionEvent,
    type AmapOverlayMouseEvent,
    type AmapTargetEvent,
    getAmapEventEntries,
    mergeAmapEvents,
    splitAmapEventShortcutProps,
} from "../utils/amapEvents"

export type AmapGroupOnLoad<TInstance extends AmapGroupInstance = AmapGroupInstance> = (group: TInstance) => void

export type AmapGroupOnDestroy<TInstance extends AmapGroupInstance = AmapGroupInstance> = (group: TInstance) => void

export type AmapGroupChildSync = () => void

export type AmapGroupChildSyncCleanup = () => void

/** 群组事件映射 */
export interface AmapGroupEvents<TInstance = AmapGroupInstance>
    extends AmapOverlayEventMap<TInstance> {}

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

/** 群组鼠标事件 */
export interface AmapGroupMouseEvent<TInstance = AmapGroupInstance> extends AmapOverlayMouseEvent<TInstance> {}

/** 群组交互坐标事件 */
export interface AmapGroupInteractionEvent<TInstance = AmapGroupInstance> extends AmapOverlayInteractionEvent<TInstance> {}

/** 群组目标事件 */
export interface AmapGroupTargetEvent<TInstance = AmapGroupInstance> extends AmapTargetEvent<TInstance> {}

/** 群组移动动画事件 */
export interface AmapGroupMoveEvent<TInstance = AmapGroupInstance> extends AmapMoveEvent<TInstance> {}

/** 群组事件快捷属性 */
export interface AmapGroupEventShortcutProps<TInstance = AmapGroupInstance>
    extends AmapOverlayEventShortcutProps<TInstance> {}

/** 覆盖物群组鼠标事件 */
export interface AmapOverlayGroupMouseEvent extends AmapGroupMouseEvent<AmapOverlayGroupInstance> {}

/** 覆盖物群组交互坐标事件 */
export interface AmapOverlayGroupInteractionEvent extends AmapGroupInteractionEvent<AmapOverlayGroupInstance> {}

/** 覆盖物群组目标事件 */
export interface AmapOverlayGroupTargetEvent extends AmapGroupTargetEvent<AmapOverlayGroupInstance> {}

/** 覆盖物群组移动动画事件 */
export interface AmapOverlayGroupMoveEvent extends AmapGroupMoveEvent<AmapOverlayGroupInstance> {}

/** 覆盖物群组事件快捷属性 */
export interface AmapOverlayGroupEventShortcutProps extends AmapGroupEventShortcutProps<AmapOverlayGroupInstance> {}

/** 图层群组鼠标事件 */
export interface AmapLayerGroupMouseEvent extends AmapGroupMouseEvent<AmapLayerGroupInstance> {}

/** 图层群组交互坐标事件 */
export interface AmapLayerGroupInteractionEvent extends AmapGroupInteractionEvent<AmapLayerGroupInstance> {}

/** 图层群组目标事件 */
export interface AmapLayerGroupTargetEvent extends AmapGroupTargetEvent<AmapLayerGroupInstance> {}

/** 图层群组移动动画事件 */
export interface AmapLayerGroupMoveEvent extends AmapGroupMoveEvent<AmapLayerGroupInstance> {}

/** 图层群组事件快捷属性 */
export interface AmapLayerGroupEventShortcutProps extends AmapGroupEventShortcutProps<AmapLayerGroupInstance> {}

/** 支持群组构造器的高德命名空间 */
export interface AmapGroupNamespace extends AmapNamespace {
    /** OverlayGroup 构造器 */
    OverlayGroup?: new (overlays?: unknown[]) => AmapOverlayGroupInstance
    /** LayerGroup 构造器 */
    LayerGroup?: new (layers?: unknown[]) => AmapLayerGroupInstance
}

/** 覆盖物群组组件属性 */
export interface OverlayGroupProps extends AmapGroupOptions, AmapOverlayGroupEventShortcutProps {
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
export interface LayerGroupProps extends AmapGroupOptions, AmapLayerGroupEventShortcutProps {
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

/** 覆盖物群组上下文数据 */
export interface AmapOverlayGroupContextValue {
    /** 覆盖物群组实例 */
    group: AmapOverlayGroupInstance
    /** 添加覆盖物并同步群组状态 */
    addOverlay(overlay: unknown): void
    /** 移除覆盖物 */
    removeOverlay(overlay: unknown): void
    /** 同步子覆盖物变更后的群组状态 */
    sync(): void
    /** 同步所有子覆盖物 */
    syncChildren(): void
    /** 注册子覆盖物同步函数 */
    registerChildSync(sync: AmapGroupChildSync): AmapGroupChildSyncCleanup
}

/** 图层群组上下文数据 */
export interface AmapLayerGroupContextValue {
    /** 图层群组实例 */
    group: AmapLayerGroupInstance
    /** 添加图层并同步群组状态 */
    addLayer(layer: unknown): void
    /** 移除图层 */
    removeLayer(layer: unknown): void
    /** 同步子图层变更后的群组状态 */
    sync(): void
    /** 同步所有子图层 */
    syncChildren(): void
    /** 注册子图层同步函数 */
    registerChildSync(sync: AmapGroupChildSync): AmapGroupChildSyncCleanup
}

/** 创建覆盖物群组上下文参数 */
export interface CreateAmapOverlayGroupContextValueParams {
    /** 覆盖物群组实例 */
    group: AmapOverlayGroupInstance
    /** 获取最新群组参数 */
    getOptions: () => AmapGroupOptions
}

/** 创建图层群组上下文参数 */
export interface CreateAmapLayerGroupContextValueParams {
    /** 图层群组实例 */
    group: AmapLayerGroupInstance
    /** 获取最新群组参数 */
    getOptions: () => AmapGroupOptions
}

/** 覆盖物群组上下文 */
export const OverlayGroupContext = createContext<AmapOverlayGroupContextValue | null>(null)

export function useOverlayGroupContext() {
    return useContext(OverlayGroupContext)
}

/** 图层群组上下文 */
export const LayerGroupContext = createContext<AmapLayerGroupContextValue | null>(null)

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

function getAmapGroupSetOptions(options: AmapGroupOptions) {
    const setOptions: AmapGroupOptions = {
        ...options,
    }

    delete setOptions.visible

    return setOptions
}

function setAmapGroupOptions<TInstance extends AmapGroupInstance>(group: TInstance, options: AmapGroupOptions) {
    group.setOptions?.(getAmapGroupSetOptions(options))
}

function syncAmapGroupAfterChildChange<TInstance extends AmapGroupInstance>(group: TInstance, options: AmapGroupOptions) {
    setAmapGroupOptions(group, options)

    if (options.visible === false) group.hide?.()
}

function updateAmapGroup<TInstance extends AmapGroupInstance>(group: TInstance, options: AmapGroupOptions) {
    setAmapGroupOptions(group, options)

    if (options.visible === undefined) return

    if (options.visible) {
        group.show?.()
        return
    }

    group.hide?.()
}

function createAmapOverlayGroupContextValue({
    group,
    getOptions,
}: CreateAmapOverlayGroupContextValueParams): AmapOverlayGroupContextValue {
    const childSyncs = new Set<AmapGroupChildSync>()

    function sync() {
        syncAmapGroupAfterChildChange(group, getOptions())
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

            return function unregisterAmapOverlayGroupChildSync() {
                childSyncs.delete(childSync)
            }
        },
    }
}

function createAmapLayerGroupContextValue({
    group,
    getOptions,
}: CreateAmapLayerGroupContextValueParams): AmapLayerGroupContextValue {
    const childSyncs = new Set<AmapGroupChildSync>()

    function sync() {
        syncAmapGroupAfterChildChange(group, getOptions())
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

            return function unregisterAmapLayerGroupChildSync() {
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
    const context = useAmapContext()
    const groupRef = useRef<AmapOverlayGroupInstance | null>(null)
    const [contextValue, setContextValue] = useState<AmapOverlayGroupContextValue | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as AmapGroupNamespace | null
    const { eventShortcuts, restProps: restOptions } = splitAmapEventShortcutProps(restProps)
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapGroupEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getCurrentOptions = useEffectEvent(() => restOptions)

    useStableEffect(() => {
        if (!currentMap || !currentAMap?.OverlayGroup) return

        const initialOptions = getCurrentOptions()
        const group = new currentAMap.OverlayGroup()

        currentMap.add?.(group)
        groupRef.current = group
        setContextValue(createAmapOverlayGroupContextValue({
            group,
            getOptions: getCurrentOptions,
        }))
        setAmapGroupRef(ref, group)
        updateAmapGroup(group, initialOptions)
        onLoad(group)

        return () => {
            groupRef.current = null
            setContextValue(null)
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
        contextValue?.syncChildren()
        if (restOptions.visible === false) groupRef.current.hide?.()
    }, [contextValue, restOptions])

    useStableEffect(() => {
        if (!groupRef.current) return

        return bindAmapGroupEvents(groupRef.current, currentEvents)
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
    const context = useAmapContext()
    const groupRef = useRef<AmapLayerGroupInstance | null>(null)
    const [contextValue, setContextValue] = useState<AmapLayerGroupContextValue | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as AmapGroupNamespace | null
    const { eventShortcuts, restProps: restOptions } = splitAmapEventShortcutProps(restProps)
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapGroupEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getCurrentOptions = useEffectEvent(() => restOptions)

    useStableEffect(() => {
        if (!currentMap || !currentAMap?.LayerGroup) return

        const initialOptions = getCurrentOptions()
        const group = new currentAMap.LayerGroup()

        group.setMap?.(currentMap)
        groupRef.current = group
        setContextValue(createAmapLayerGroupContextValue({
            group,
            getOptions: getCurrentOptions,
        }))
        setAmapGroupRef(ref, group)
        updateAmapGroup(group, initialOptions)
        onLoad(group)

        return () => {
            groupRef.current = null
            setContextValue(null)
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
        contextValue?.syncChildren()
        if (restOptions.visible === false) groupRef.current.hide?.()
    }, [contextValue, restOptions])

    useStableEffect(() => {
        if (!groupRef.current) return

        return bindAmapGroupEvents(groupRef.current, currentEvents)
    }, [currentAMap, currentEvents, currentMap, ref])

    return <LayerGroupContext value={contextValue}>{contextValue ? children : null}</LayerGroupContext>
}
