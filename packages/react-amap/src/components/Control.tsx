import { type FC, type Ref, useEffectEvent, useRef } from "react"

import { AmapPlugin, type AmapEventHandler, type AmapMapInstance, type AmapNamespace, useAmapContext } from "./Amap"

import { useAmapPlugin } from "../hooks/useAmapPlugin"
import { useStableEffect } from "../hooks/useStableEffect"

import {
    type AmapEventMap,
    type AmapEventShortcutProps,
    type AmapOverlayMouseEvent,
    getAmapEventEntries,
    mergeAmapEvents,
    splitAmapEventShortcutProps,
} from "../utils/amapEvents"
import { optionalFn } from "../utils/optionalFn"

export type AmapControlOnLoad<TInstance extends AmapControlInstance = AmapControlInstance> = (control: TInstance) => void

export type AmapControlOnDestroy<TInstance extends AmapControlInstance = AmapControlInstance> = (control: TInstance) => void

/** 控件停靠位置 */
export const ControlPosition = {
    左上角: "LT",
    右上角: "RT",
    左下角: "LB",
    右下角: "RB",
} as const

export type ControlPosition = (typeof ControlPosition)[keyof typeof ControlPosition]

/** 地图类型图层类型 */
export const MapTypeLayerType = {
    底图: "base",
    叠加图层: "overlay",
} as const

export type MapTypeLayerType = (typeof MapTypeLayerType)[keyof typeof MapTypeLayerType]

/** MapType 初始化默认图层类型 */
export const MapTypeDefaultType = {
    默认底图: 0,
    卫星图: 1,
} as const

export type MapTypeDefaultType = (typeof MapTypeDefaultType)[keyof typeof MapTypeDefaultType]

/** 控件停靠位置 */
export interface AmapControlPositionObject {
    /** 顶部距离 */
    top?: number
    /** 左侧距离 */
    left?: number
    /** 右侧距离 */
    right?: number
    /** 底部距离 */
    bottom?: number
}

/** 控件基础参数 */
export interface AmapControlBaseOptions {
    /** 控件停靠位置 */
    position?: ControlPosition | AmapControlPositionObject
    /** 控件偏移量 */
    offset?: [number, number]
    /** 是否可见 */
    visible?: boolean
}

/** 控件事件映射 */
export interface AmapControlEvents<TInstance = AmapControlInstance> extends AmapEventMap<AmapOverlayMouseEvent<TInstance>> {}

/** 控件实例 */
export interface AmapControlInstance {
    /** 添加到地图 */
    addTo?: (map: AmapMapInstance) => void
    /** 移除控件 */
    remove?: () => void
    /** 从地图移除控件 */
    removeFrom?: (map?: AmapMapInstance) => void
    /** 显示控件 */
    show?: () => void
    /** 隐藏控件 */
    hide?: () => void
    /** 绑定事件 */
    on?: (eventName: string, handler: AmapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: AmapEventHandler) => void
}

/** 控件构造器 */
export interface AmapControlConstructor<TInstance extends AmapControlInstance, TOptions extends AmapControlBaseOptions> {
    new (options?: TOptions): TInstance
}

/** 地图类型图层信息 */
export interface AmapMapTypeLayerInfo {
    /** 图层 id */
    id: string
    /** 是否可用 */
    enable?: boolean
    /** 图层名称 */
    name?: string
    /** 图层类型 */
    type?: MapTypeLayerType
    /** 图层对象 */
    layer?: unknown
    /** 是否显示 */
    show?: boolean
}

/** MapType 控件参数 */
export interface AmapMapTypeOptions extends AmapControlBaseOptions {
    /** 初始化默认图层类型 */
    defaultType?: MapTypeDefaultType
    /** 是否展示交通图层 */
    showTraffic?: boolean
    /** 是否展示路网图层 */
    showRoad?: boolean
}

/** ControlBar 控件参数 */
export interface AmapControlBarOptions extends AmapControlBaseOptions {
    /** 是否显示倾斜和旋转按钮 */
    showControlButton?: boolean
}

/** HawkEye 控件参数 */
export interface AmapHawkEyeOptions extends AmapControlBaseOptions {
    /** 是否随主图移动 */
    autoMove?: boolean
    /** 是否显示视口矩形 */
    showRectangle?: boolean
    /** 是否显示打开关闭按钮 */
    showButton?: boolean
    /** 默认是否展开 */
    opened?: boolean
    /** 缩略图地图样式 */
    mapStyle?: string
    /** 缩略图图层 */
    layers?: unknown[]
    /** 缩略图宽度 */
    width?: string
    /** 缩略图高度 */
    height?: string
}

/** MapType 控件实例 */
export interface AmapMapTypeInstance extends AmapControlInstance {
    /** 添加图层 */
    addLayer?: (layerInfo: AmapMapTypeLayerInfo) => void
    /** 移除图层 */
    removeLayer?: (id: string) => void
}

/** 支持控件构造器的高德命名空间 */
export interface AmapControlNamespace extends AmapNamespace {
    /** Scale 构造器 */
    Scale?: new (options?: AmapControlBaseOptions) => AmapControlInstance
    /** ToolBar 构造器 */
    ToolBar?: new (options?: AmapControlBaseOptions) => AmapControlInstance
    /** ControlBar 构造器 */
    ControlBar?: new (options?: AmapControlBarOptions) => AmapControlInstance
    /** MapType 构造器 */
    MapType?: new (options?: AmapMapTypeOptions) => AmapMapTypeInstance
    /** HawkEye 构造器 */
    HawkEye?: new (options?: AmapHawkEyeOptions) => AmapControlInstance
}

/** 内部控件组件属性 */
export interface AmapControlProps<TInstance extends AmapControlInstance, TOptions extends AmapControlBaseOptions>
    extends AmapEventShortcutProps<AmapOverlayMouseEvent<TInstance>> {
    /** 控件实例 ref */
    ref?: Ref<TInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 插件名称 */
    pluginName: AmapPlugin
    /** 构造器名称 */
    constructorName: string
    /** 控件参数 */
    options: TOptions
    /** 控件事件映射 */
    events?: AmapControlEvents<TInstance>
    /** 创建完成回调 */
    onLoad?: AmapControlOnLoad<TInstance>
    /** 销毁前回调 */
    onDestroy?: AmapControlOnDestroy<TInstance>
}

/** 比例尺组件属性 */
export interface ScaleProps extends AmapControlBaseOptions, AmapEventShortcutProps<AmapOverlayMouseEvent<AmapControlInstance>> {
    /** 比例尺实例 ref */
    ref?: Ref<AmapControlInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 控件额外参数 */
    controlOptions?: AmapControlBaseOptions
    /** 控件事件映射 */
    events?: AmapControlEvents
    /** 创建完成回调 */
    onLoad?: AmapControlOnLoad
    /** 销毁前回调 */
    onDestroy?: AmapControlOnDestroy
}

/** 工具条组件属性 */
export interface ToolBarProps extends ScaleProps {}

/** 组合控件组件属性 */
export interface ControlBarProps
    extends AmapControlBarOptions,
        AmapEventShortcutProps<AmapOverlayMouseEvent<AmapControlInstance>> {
    /** 组合控件实例 ref */
    ref?: Ref<AmapControlInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 控件额外参数 */
    controlOptions?: AmapControlBarOptions
    /** 控件事件映射 */
    events?: AmapControlEvents
    /** 创建完成回调 */
    onLoad?: AmapControlOnLoad
    /** 销毁前回调 */
    onDestroy?: AmapControlOnDestroy
}

/** 地图类型控件组件属性 */
export interface MapTypeProps extends AmapMapTypeOptions, AmapEventShortcutProps<AmapOverlayMouseEvent<AmapMapTypeInstance>> {
    /** 地图类型控件实例 ref */
    ref?: Ref<AmapMapTypeInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 控件额外参数 */
    controlOptions?: AmapMapTypeOptions
    /** 控件事件映射 */
    events?: AmapControlEvents<AmapMapTypeInstance>
    /** 创建完成回调 */
    onLoad?: AmapControlOnLoad<AmapMapTypeInstance>
    /** 销毁前回调 */
    onDestroy?: AmapControlOnDestroy<AmapMapTypeInstance>
}

/** 鹰眼控件组件属性 */
export interface HawkEyeProps extends AmapHawkEyeOptions, AmapEventShortcutProps<AmapOverlayMouseEvent<AmapControlInstance>> {
    /** 鹰眼控件实例 ref */
    ref?: Ref<AmapControlInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 控件额外参数 */
    controlOptions?: AmapHawkEyeOptions
    /** 控件事件映射 */
    events?: AmapControlEvents
    /** 创建完成回调 */
    onLoad?: AmapControlOnLoad
    /** 销毁前回调 */
    onDestroy?: AmapControlOnDestroy
}

function setAmapControlRef<TInstance extends AmapControlInstance>(ref: Ref<TInstance | null> | undefined, control: TInstance | null) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(control)
        return
    }

    ref.current = control
}

function getAmapControlConstructor<TInstance extends AmapControlInstance, TOptions extends AmapControlBaseOptions>(
    AMap: AmapNamespace,
    constructorName: string,
) {
    const constructor = (AMap as unknown as Record<string, unknown>)[constructorName]

    if (typeof constructor !== "function") return undefined

    return constructor as AmapControlConstructor<TInstance, TOptions>
}

function bindAmapControlEvents<TInstance extends AmapControlInstance>(control: TInstance, events?: AmapControlEvents) {
    const eventEntries = getAmapEventEntries(events)

    eventEntries.forEach(({ eventName, handler }) => control.on?.(eventName, handler))

    return function unbindAmapControlEvents() {
        eventEntries.forEach(({ eventName, handler }) => control.off?.(eventName, handler))
    }
}

function mergeAmapControlOptions<TOptions extends AmapControlBaseOptions>(controlOptions: TOptions | undefined, extraOptions: TOptions) {
    const nextOptions: TOptions = {
        ...controlOptions,
    } as TOptions

    Object.entries(extraOptions).forEach(([key, value]) => {
        if (value !== undefined) (nextOptions as Record<string, unknown>)[key] = value
    })

    return nextOptions
}

function updateAmapControl<TInstance extends AmapControlInstance, TOptions extends AmapControlBaseOptions>(control: TInstance, options: TOptions) {
    if (options.visible === undefined) return

    if (options.visible) {
        control.show?.()
        return
    }

    control.hide?.()
}

function removeAmapControl<TInstance extends AmapControlInstance>(map: AmapMapInstance, control: TInstance, onDestroy?: AmapControlOnDestroy<TInstance>) {
    try {
        onDestroy?.(control)
    } finally {
        if (map.removeControl) map.removeControl(control)
        else if (control.removeFrom) control.removeFrom(map)
        else control.remove?.()
    }
}

function AmapControl<TInstance extends AmapControlInstance, TOptions extends AmapControlBaseOptions>({
    ref,
    map,
    AMap,
    pluginName,
    constructorName,
    options,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...eventShortcuts
}: AmapControlProps<TInstance, TOptions>) {
    const context = useAmapContext()
    const controlRef = useRef<TInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = AMap ?? context.AMap

    const pluginLoaded = useAmapPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName,
        constructorName,
    })

    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getOptions = useEffectEvent(() => options)
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapControlEvents

    useStableEffect(() => {
        if (!currentMap || !currentAMap || !pluginLoaded) return

        const ControlConstructor = getAmapControlConstructor<TInstance, TOptions>(currentAMap, constructorName)

        if (!ControlConstructor) return

        const nextOptions = getOptions()
        const control = new ControlConstructor(nextOptions)

        currentMap.addControl?.(control)
        controlRef.current = control
        setAmapControlRef(ref, control)
        updateAmapControl(control, nextOptions)
        onLoad(control)

        return () => {
            controlRef.current = null
            setAmapControlRef(ref, null)
            removeAmapControl(currentMap, control, onDestroy)
        }
    }, [constructorName, currentAMap, currentMap, pluginLoaded, ref])

    useStableEffect(() => {
        if (!controlRef.current) return

        updateAmapControl(controlRef.current, options)
    }, [options])

    useStableEffect(() => {
        if (!controlRef.current) return

        return bindAmapControlEvents(controlRef.current, currentEvents)
    }, [constructorName, currentAMap, currentEvents, currentMap, pluginLoaded, ref])

    return null
}

export const Scale: FC<ScaleProps> = ({ ref, map, AMap, controlOptions, events, onLoad, onDestroy, ...restOptions }) => {
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapControlOptions(controlOptions, restProps as AmapControlBaseOptions)

    return (
        <AmapControl
            ref={ref}
            map={map}
            AMap={AMap}
            pluginName={AmapPlugin.Scale}
            constructorName="Scale"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const ToolBar: FC<ToolBarProps> = ({ ref, map, AMap, controlOptions, events, onLoad, onDestroy, ...restOptions }) => {
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapControlOptions(controlOptions, restProps as AmapControlBaseOptions)

    return (
        <AmapControl
            ref={ref}
            map={map}
            AMap={AMap}
            pluginName={AmapPlugin.ToolBar}
            constructorName="ToolBar"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const ControlBar: FC<ControlBarProps> = ({ ref, map, AMap, controlOptions, events, onLoad, onDestroy, ...restOptions }) => {
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapControlOptions(controlOptions, restProps as AmapControlBarOptions)

    return (
        <AmapControl
            ref={ref}
            map={map}
            AMap={AMap}
            pluginName={AmapPlugin.ControlBar}
            constructorName="ControlBar"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const MapType: FC<MapTypeProps> = ({ ref, map, AMap, controlOptions, events, onLoad, onDestroy, ...restOptions }) => {
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapControlOptions(controlOptions, restProps as AmapMapTypeOptions)

    return (
        <AmapControl
            ref={ref}
            map={map}
            AMap={AMap}
            pluginName={AmapPlugin.MapType}
            constructorName="MapType"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const HawkEye: FC<HawkEyeProps> = ({ ref, map, AMap, controlOptions, events, onLoad, onDestroy, ...restOptions }) => {
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapControlOptions(controlOptions, restProps as AmapHawkEyeOptions)

    return (
        <AmapControl
            ref={ref}
            map={map}
            AMap={AMap}
            pluginName={AmapPlugin.HawkEye}
            constructorName="HawkEye"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}
