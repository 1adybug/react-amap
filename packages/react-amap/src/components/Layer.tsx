import {
    type FC,
    type ReactNode,
    type Ref,
    createContext,
    useContext,
    useEffect,
    useEffectEvent,
    useRef,
    useState,
} from "react"

import {
    AmapPlugin,
    type AmapEventHandler,
    type AmapMapInstance,
    type AmapNamespace,
    type AmapZoomRange,
    useAmapContext,
} from "./Amap"
import { type AmapGroupChildSync, type AmapGroupChildSyncCleanup, useLayerGroupContext } from "./Group"
import type { AmapBoundsLike } from "./Vector"
import { loadAmapPlugin } from "../utils/amapPlugin"
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

export type AmapLayerOnLoad<TInstance extends AmapLayerInstance = AmapLayerInstance> = (layer: TInstance) => void

export type AmapLayerOnDestroy<TInstance extends AmapLayerInstance = AmapLayerInstance> = (layer: TInstance) => void

/** 图层鼠标事件 */
export interface AmapLayerMouseEvent<TInstance = AmapLayerInstance> extends AmapOverlayMouseEvent<TInstance> {}

/** 图层交互坐标事件 */
export interface AmapLayerInteractionEvent<TInstance = AmapLayerInstance> extends AmapOverlayInteractionEvent<TInstance> {}

/** 图层目标事件 */
export interface AmapLayerTargetEvent<TInstance = AmapLayerInstance> extends AmapTargetEvent<TInstance> {}

/** 图层移动动画事件 */
export interface AmapLayerMoveEvent<TInstance = AmapLayerInstance> extends AmapMoveEvent<TInstance> {}

/** 图层事件快捷属性 */
export interface AmapLayerEventShortcutProps<TInstance = AmapLayerInstance>
    extends AmapOverlayEventShortcutProps<TInstance> {}

/** 热力图鼠标事件 */
export interface AmapHeatMapMouseEvent extends AmapLayerMouseEvent<AmapLayerInstance> {}

/** 热力图交互坐标事件 */
export interface AmapHeatMapInteractionEvent extends AmapLayerInteractionEvent<AmapLayerInstance> {}

/** 热力图目标事件 */
export interface AmapHeatMapTargetEvent extends AmapLayerTargetEvent<AmapLayerInstance> {}

/** 热力图移动动画事件 */
export interface AmapHeatMapMoveEvent extends AmapLayerMoveEvent<AmapLayerInstance> {}

/** 热力图事件快捷属性 */
export interface AmapHeatMapEventShortcutProps extends AmapLayerEventShortcutProps<AmapLayerInstance> {}

/** 矢量图层鼠标事件 */
export interface AmapVectorLayerMouseEvent extends AmapLayerMouseEvent<AmapLayerInstance> {}

/** 矢量图层交互坐标事件 */
export interface AmapVectorLayerInteractionEvent extends AmapLayerInteractionEvent<AmapLayerInstance> {}

/** 矢量图层目标事件 */
export interface AmapVectorLayerTargetEvent extends AmapLayerTargetEvent<AmapLayerInstance> {}

/** 矢量图层移动动画事件 */
export interface AmapVectorLayerMoveEvent extends AmapLayerMoveEvent<AmapLayerInstance> {}

/** 矢量图层事件快捷属性 */
export interface AmapVectorLayerEventShortcutProps extends AmapLayerEventShortcutProps<AmapLayerInstance> {}

/** 图层事件映射 */
export interface AmapLayerEvents<TInstance = AmapLayerInstance> extends AmapOverlayEventMap<TInstance> {}

/** 图层基础参数 */
export interface AmapLayerBaseOptions {
    /** 是否可见 */
    visible?: boolean
    /** 图层透明度 */
    opacity?: number
    /** 图层层级 */
    zIndex?: number
    /** 图层缩放范围 */
    zooms?: AmapZoomRange
}

/** 图层运行时可同步参数 */
export interface AmapLayerRuntimeOptions extends AmapLayerBaseOptions {
    /** 切片取图地址 */
    tileUrl?: string
    /** 数据地址 */
    url?: string
    /** 图层范围 */
    bounds?: AmapBoundsLike
    /** 楼块样式 */
    styleOpts?: AmapBuildingsStyleOptions
    /** 行政区或矢量瓦片样式 */
    styles?: Record<string, unknown> | AmapMapboxVectorTileLayerStyles
    /** 国家代码 */
    SOC?: string
    /** 行政区编码 */
    adcode?: string | number | Array<string | number>
    /** 建筑物 POI ID */
    indoorid?: string
    /** 楼层 */
    floor?: number
    /** 商铺 ID */
    shopid?: string
    /** 是否显示楼层条 */
    floorBarVisible?: boolean
    /** 是否显示室内标注 */
    labelsVisible?: boolean
}

/** 瓦片图层参数 */
export interface AmapTileLayerOptions extends AmapLayerBaseOptions {
    /** 切片取图地址 */
    tileUrl?: string
    /** 数据缩放范围 */
    dataZooms?: AmapZoomRange
    /** 切片大小 */
    tileSize?: number
}

/** 灵活切片创建成功回调 */
export type AmapFlexibleLayerCreateTileSuccess = (tile: HTMLImageElement | HTMLCanvasElement) => void

/** 灵活切片创建失败回调 */
export type AmapFlexibleLayerCreateTileFail = () => void

/** 灵活切片创建函数 */
export type AmapFlexibleLayerCreateTile = (
    x: number,
    y: number,
    z: number,
    success: AmapFlexibleLayerCreateTileSuccess,
    fail: AmapFlexibleLayerCreateTileFail
) => void

/** 灵活切片图层参数 */
export interface AmapFlexibleLayerOptions extends AmapTileLayerOptions {
    /** 缓存瓦片数量 */
    cacheSize?: number
    /** 创建切片 */
    createTile?: AmapFlexibleLayerCreateTile
}

/** 交通图层参数 */
export interface AmapTrafficLayerOptions extends AmapTileLayerOptions {
    /** 是否自动更新 */
    autoRefresh?: boolean
    /** 自动更新间隔 */
    interval?: number
}

/** 楼块图层样式 */
export interface AmapBuildingsStyleOptions {
    /** 是否隐藏区域外楼块 */
    hideWithoutStyle?: boolean
    /** 区域样式 */
    areas?: unknown[]
}

/** 楼块图层参数 */
export interface AmapBuildingsLayerOptions extends AmapLayerBaseOptions {
    /** 楼块侧面颜色 */
    wallColor?: string | string[]
    /** 楼块顶面颜色 */
    roofColor?: string | string[]
    /** 高度系数 */
    heightFactor?: number
    /** 楼块样式 */
    styleOpts?: AmapBuildingsStyleOptions
}

/** 行政区图层参数 */
export interface AmapDistrictLayerOptions extends AmapLayerBaseOptions {
    /** 行政区编码 */
    adcode?: string | number | Array<string | number>
    /** 国家代码 */
    SOC?: string
    /** 数据层级深度 */
    depth?: number
    /** 行政区样式 */
    styles?: Record<string, unknown>
}

/** 室内图层参数 */
export interface AmapIndoorMapOptions extends AmapLayerBaseOptions {
    /** 鼠标悬停样式 */
    cursor?: string
    /** 是否隐藏楼层条 */
    hideFloorBar?: boolean
    /** 建筑物 POI ID */
    indoorid?: string
    /** 楼层 */
    floor?: number
    /** 商铺 ID */
    shopid?: string
    /** 是否显示楼层条 */
    floorBarVisible?: boolean
    /** 是否显示室内标注 */
    labelsVisible?: boolean
}

/** 图片图层参数 */
export interface AmapImageLayerOptions extends AmapLayerBaseOptions {
    /** 图片地址 */
    url?: string
    /** 图片范围 */
    bounds?: AmapBoundsLike
}

/** Canvas 图层参数 */
export interface AmapCanvasLayerOptions extends AmapLayerBaseOptions {
    /** Canvas 元素 */
    canvas?: HTMLCanvasElement
    /** 图层范围 */
    bounds?: AmapBoundsLike
}

/** 自定义图层参数 */
export interface AmapCustomLayerOptions extends AmapLayerBaseOptions {
    /** Canvas 元素 */
    canvas?: HTMLCanvasElement
    /** 渲染回调 */
    render?: () => void
}

/** WMS 图层参数 */
export interface AmapWMSLayerOptions extends AmapTileLayerOptions {
    /** 服务地址 */
    url?: string
    /** WMS 参数 */
    params?: Record<string, unknown>
}

/** WMTS 图层参数 */
export interface AmapWMTSLayerOptions extends AmapTileLayerOptions {
    /** 服务地址 */
    url?: string
    /** WMTS 参数 */
    params?: Record<string, unknown>
}

/** Mapbox 矢量瓦片样式 */
export interface AmapMapboxVectorTileLayerStyles {
    /** 面样式 */
    polygon?: Record<string, unknown>
    /** 线样式 */
    line?: Record<string, unknown>
    /** 点样式 */
    point?: Record<string, unknown>
    /** 多面体样式 */
    polyhedron?: Record<string, unknown>
}

/** Mapbox 矢量瓦片图层参数 */
export interface AmapMapboxVectorTileLayerOptions extends AmapTileLayerOptions {
    /** MVT 数据地址 */
    url?: string
    /** 样式配置 */
    styles?: AmapMapboxVectorTileLayerStyles
}

/** 矢量图层参数 */
export interface AmapVectorLayerOptions extends AmapLayerBaseOptions {
}

/** 热力图参数 */
export interface AmapHeatMapOptions extends AmapLayerBaseOptions {
    /** 热力图半径 */
    radius?: number
    /** 渐变色 */
    gradient?: Record<string, string>
}

/** 热力图数据 */
export interface AmapHeatMapData {
    /** 经度 */
    lng?: number
    /** 纬度 */
    lat?: number
    /** 权重 */
    count?: number
}

/** 热力图数据集 */
export interface AmapHeatMapDataSet {
    /** 最大值 */
    max?: number
    /** 数据 */
    data?: AmapHeatMapData[]
}

/** 图层实例 */
export interface AmapLayerInstance {
    /** 设置地图 */
    setMap?: (map: AmapMapInstance | null) => void
    /** 销毁图层 */
    destroy?: () => void
    /** 显示图层 */
    show?: () => void
    /** 隐藏图层 */
    hide?: () => void
    /** 绑定事件 */
    on?: (eventName: string, handler: AmapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: AmapEventHandler) => void
    /** 设置参数 */
    setOptions?: (options: AmapLayerBaseOptions) => void
    /** 设置层级 */
    setzIndex?: (zIndex: number) => void
    /** 设置透明度 */
    setOpacity?: (opacity: number) => void
    /** 设置缩放范围 */
    setZooms?: (zooms: AmapZoomRange) => void
    /** 设置切片地址 */
    setTileUrl?: (url: string) => void
    /** 设置数据地址 */
    setUrl?: (url: string) => void
    /** 设置图层范围 */
    setBounds?: (bounds: AmapBoundsLike) => void
    /** 设置楼块样式 */
    setStyle?: (style: unknown) => void
    /** 设置行政区样式 */
    setStyles?: (styles: unknown) => void
    /** 设置国家代码 */
    setSOC?: (SOC: string) => void
    /** 设置行政区 */
    setDistricts?: (adcodes: string | number | Array<string | number>) => void
    /** 设置行政区 */
    setAdcode?: (adcodes: string | number | Array<string | number>) => void
    /** 显示室内地图 */
    showIndoorMap?: (indoorid: string, floor?: number, shopid?: string) => void
    /** 显示楼层 */
    showFloor?: (floor: number) => void
    /** 显示楼层条 */
    showFloorBar?: () => void
    /** 隐藏楼层条 */
    hideFloorBar?: () => void
    /** 显示室内标注 */
    showLabels?: () => void
    /** 隐藏室内标注 */
    hideLabels?: () => void
    /** 设置热力图数据 */
    setDataSet?: (dataSet: AmapHeatMapDataSet) => void
    /** 添加矢量覆盖物 */
    add?: (vectors: unknown | unknown[]) => void
    /** 移除矢量覆盖物 */
    remove?: (vectors: unknown | unknown[]) => void
    /** 判断矢量覆盖物是否在图层中 */
    has?: (vector: unknown) => boolean
    /** 清空矢量覆盖物 */
    clear?: () => void
    /** 查询矢量覆盖物 */
    query?: (geometry: unknown) => unknown
    /** 获取图层范围 */
    getBounds?: () => unknown
}

/** 图层构造器 */
export interface AmapLayerConstructor<TInstance extends AmapLayerInstance, TOptions extends AmapLayerBaseOptions> {
    new (options?: TOptions): TInstance
}

/** 热力图构造器 */
export interface AmapHeatMapConstructor {
    new (map: AmapMapInstance, options?: AmapHeatMapOptions): AmapLayerInstance
}

/** 支持图层构造器的高德命名空间 */
export interface AmapLayerNamespace extends AmapNamespace {
    /** TileLayer 构造器或命名空间 */
    TileLayer?: unknown
    /** Buildings 构造器 */
    Buildings?: new (options?: AmapBuildingsLayerOptions) => AmapLayerInstance
    /** DistrictLayer 构造器或命名空间 */
    DistrictLayer?: unknown
    /** IndoorMap 构造器 */
    IndoorMap?: new (options?: AmapIndoorMapOptions) => AmapLayerInstance
    /** ImageLayer 构造器 */
    ImageLayer?: new (options?: AmapImageLayerOptions) => AmapLayerInstance
    /** CanvasLayer 构造器 */
    CanvasLayer?: new (options?: AmapCanvasLayerOptions) => AmapLayerInstance
    /** CustomLayer 构造器 */
    CustomLayer?: new (options?: AmapCustomLayerOptions) => AmapLayerInstance
    /** GLCustomLayer 构造器 */
    GLCustomLayer?: new (options?: AmapLayerBaseOptions) => AmapLayerInstance
    /** HeatMap 构造器 */
    HeatMap?: AmapHeatMapConstructor
    /** 灵活切片图层构造器 */
    Flexible?: new (options?: AmapFlexibleLayerOptions) => AmapLayerInstance
    /** Mapbox 矢量瓦片图层构造器 */
    MapboxVectorTileLayer?: new (options?: AmapMapboxVectorTileLayerOptions) => AmapLayerInstance
    /** 矢量图层构造器 */
    VectorLayer?: new (options?: AmapVectorLayerOptions) => AmapLayerInstance
}

/** 内部图层组件属性 */
export interface AmapLayerProps<TInstance extends AmapLayerInstance, TOptions extends AmapLayerBaseOptions> {
    /** 图层实例 ref */
    ref?: Ref<TInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 构造器路径 */
    constructorPath: string[]
    /** 插件名称 */
    pluginName?: AmapPlugin
    /** 插件构造器名称 */
    pluginConstructorName?: string
    /** 图层参数 */
    options: TOptions
    /** 图层事件映射 */
    events?: AmapLayerEvents<TInstance>
    /** 创建完成回调 */
    onLoad?: AmapLayerOnLoad<TInstance>
    /** 销毁前回调 */
    onDestroy?: AmapLayerOnDestroy<TInstance>
    /** 图层事件快捷属性 */
    eventShortcuts?: AmapLayerEventShortcutProps<TInstance>
    /** 子覆盖物 */
    children?: ReactNode
    /** 是否向子覆盖物提供矢量图层上下文 */
    provideVectorLayerContext?: boolean
}

/** 使用图层插件参数 */
export interface UseAmapLayerPluginParams {
    /** 地图实例 */
    map?: AmapMapInstance | null
    /** 高德地图命名空间 */
    AMap?: AmapNamespace | null
    /** 插件名称 */
    pluginName?: AmapPlugin
    /** 插件构造器名称 */
    pluginConstructorName?: string
}

/** 通用图层组件属性 */
export interface LayerProps<TOptions extends AmapLayerBaseOptions = AmapLayerBaseOptions>
    extends AmapLayerEventShortcutProps<AmapLayerInstance> {
    /** 图层实例 ref */
    ref?: Ref<AmapLayerInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 图层额外参数 */
    layerOptions?: TOptions
    /** 图层事件映射 */
    events?: AmapLayerEvents
    /** 创建完成回调 */
    onLoad?: AmapLayerOnLoad
    /** 销毁前回调 */
    onDestroy?: AmapLayerOnDestroy
}

/** 热力图组件属性 */
export interface HeatMapProps extends AmapHeatMapOptions, AmapHeatMapEventShortcutProps {
    /** 热力图实例 ref */
    ref?: Ref<AmapLayerInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 热力图数据集 */
    dataSet?: AmapHeatMapDataSet
    /** 热力图额外参数 */
    heatMapOptions?: AmapHeatMapOptions
    /** 热力图事件映射 */
    events?: AmapLayerEvents
    /** 创建完成回调 */
    onLoad?: AmapLayerOnLoad
    /** 销毁前回调 */
    onDestroy?: AmapLayerOnDestroy
}

/** 矢量图层组件属性 */
export interface VectorLayerProps extends LayerProps<AmapVectorLayerOptions>, AmapVectorLayerEventShortcutProps {
    /** 子矢量覆盖物 */
    children?: ReactNode
}

/** 矢量图层上下文数据 */
export interface AmapVectorLayerContextValue {
    /** 矢量图层实例 */
    layer: AmapLayerInstance
    /** 添加矢量覆盖物并同步图层状态 */
    addVector(vector: unknown): void
    /** 移除矢量覆盖物 */
    removeVector(vector: unknown): void
    /** 同步子覆盖物变更后的图层状态 */
    sync(): void
    /** 同步所有子矢量覆盖物 */
    syncChildren(): void
    /** 注册子矢量覆盖物同步函数 */
    registerChildSync(sync: AmapGroupChildSync): AmapGroupChildSyncCleanup
}

/** 创建矢量图层上下文参数 */
export interface CreateAmapVectorLayerContextValueParams {
    /** 矢量图层实例 */
    layer: AmapLayerInstance
    /** 获取最新图层参数 */
    getOptions: () => AmapLayerBaseOptions
}

/** 矢量图层上下文 */
export const VectorLayerContext = createContext<AmapVectorLayerContextValue | null>(null)

export function useVectorLayerContext() {
    return useContext(VectorLayerContext)
}

function getAmapObjectByPath(root: unknown, path: string[]) {
    return path.reduce<unknown>((value, key) => {
        if (!value || typeof value !== "object" && typeof value !== "function") return undefined

        return (value as Record<string, unknown>)[key]
    }, root)
}

function getAmapLayerConstructor<TInstance extends AmapLayerInstance, TOptions extends AmapLayerBaseOptions>(
    AMap: AmapNamespace,
    constructorPath: string[]
) {
    const constructor = getAmapObjectByPath(AMap, constructorPath)

    if (typeof constructor !== "function") return undefined

    return constructor as AmapLayerConstructor<TInstance, TOptions>
}

function useAmapLayerPlugin({ map, AMap, pluginName, pluginConstructorName }: UseAmapLayerPluginParams) {
    const [loaded, setLoaded] = useState(!pluginName)

    useEffect(() => {
        let disposed = false

        if (!pluginName || !pluginConstructorName) {
            setLoaded(true)
            return
        }

        if (!map || !AMap) {
            setLoaded(false)
            return
        }

        setLoaded(false)

        loadAmapPlugin({
            map,
            AMap,
            pluginName,
            constructorName: pluginConstructorName,
        })
            .then(() => {
                if (disposed) return

                setLoaded(true)
            })
            .catch(() => {
                if (disposed) return

                setLoaded(false)
            })

        return () => {
            disposed = true
        }
    }, [AMap, map, pluginConstructorName, pluginName])

    return loaded
}

function setAmapLayerRef<TInstance extends AmapLayerInstance>(ref: Ref<TInstance | null> | undefined, layer: TInstance | null) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(layer)
        return
    }

    ref.current = layer
}

function bindAmapLayerEvents<TInstance extends AmapLayerInstance>(layer: TInstance, events?: AmapLayerEvents) {
    const eventEntries = getAmapEventEntries(events)

    eventEntries.forEach(({ eventName, handler }) => layer.on?.(eventName, handler))

    return function unbindAmapLayerEvents() {
        eventEntries.forEach(({ eventName, handler }) => layer.off?.(eventName, handler))
    }
}

function mergeAmapLayerOptions<TOptions extends AmapLayerBaseOptions>(layerOptions: TOptions | undefined, extraOptions: TOptions) {
    const nextOptions: TOptions = {
        ...layerOptions,
    } as TOptions

    Object.entries(extraOptions).forEach(([key, value]) => {
        if (value !== undefined) (nextOptions as Record<string, unknown>)[key] = value
    })

    return nextOptions
}

function addAmapLayer(map: AmapMapInstance, layer: AmapLayerInstance) {
    if (map.addLayer) {
        map.addLayer(layer)
        return
    }

    map.add?.(layer)
}

function removeAmapLayer<TInstance extends AmapLayerInstance>(
    map: AmapMapInstance,
    layer: TInstance,
    onDestroy?: AmapLayerOnDestroy<TInstance>
) {
    try {
        onDestroy?.(layer)
    } finally {
        if (map.removeLayer) {
            map.removeLayer(layer)
        } else if (layer.setMap) {
            layer.setMap(null)
        } else {
            map.remove?.(layer)
        }

        layer.destroy?.()
    }
}

function updateAmapLayer<TInstance extends AmapLayerInstance, TOptions extends AmapLayerBaseOptions>(
    layer: TInstance,
    options: TOptions
) {
    const runtimeOptions = options as TOptions & AmapLayerRuntimeOptions

    layer.setOptions?.(options)

    if (typeof runtimeOptions.opacity === "number") layer.setOpacity?.(runtimeOptions.opacity)
    if (typeof runtimeOptions.zIndex === "number") layer.setzIndex?.(runtimeOptions.zIndex)
    if (runtimeOptions.zooms) layer.setZooms?.(runtimeOptions.zooms)
    if (typeof runtimeOptions.tileUrl === "string") layer.setTileUrl?.(runtimeOptions.tileUrl)
    if (typeof runtimeOptions.url === "string") layer.setUrl?.(runtimeOptions.url)
    if (runtimeOptions.bounds !== undefined) layer.setBounds?.(runtimeOptions.bounds)
    if (runtimeOptions.styleOpts) layer.setStyle?.(runtimeOptions.styleOpts)
    if (runtimeOptions.styles) layer.setStyles?.(runtimeOptions.styles)
    if (typeof runtimeOptions.SOC === "string") layer.setSOC?.(runtimeOptions.SOC)

    if (runtimeOptions.adcode !== undefined) {
        layer.setAdcode?.(runtimeOptions.adcode)
        layer.setDistricts?.(runtimeOptions.adcode)
    }

    if (typeof runtimeOptions.indoorid === "string")
        layer.showIndoorMap?.(runtimeOptions.indoorid, runtimeOptions.floor, runtimeOptions.shopid)

    if (typeof runtimeOptions.floor === "number") layer.showFloor?.(runtimeOptions.floor)

    if (typeof runtimeOptions.floorBarVisible === "boolean") {
        if (runtimeOptions.floorBarVisible) {
            layer.showFloorBar?.()
        } else {
            layer.hideFloorBar?.()
        }
    }

    if (typeof runtimeOptions.labelsVisible === "boolean") {
        if (runtimeOptions.labelsVisible) {
            layer.showLabels?.()
        } else {
            layer.hideLabels?.()
        }
    }

    if (runtimeOptions.visible === undefined) return

    if (runtimeOptions.visible) {
        layer.show?.()
        return
    }

    layer.hide?.()
}

function syncAmapLayerAfterChildChange<TInstance extends AmapLayerInstance, TOptions extends AmapLayerBaseOptions>(
    layer: TInstance,
    options: TOptions
) {
    const { visible, ...setOptions } = options

    updateAmapLayer(layer, setOptions as TOptions)

    if (visible === false) layer.hide?.()
}

function createAmapVectorLayerContextValue({
    layer,
    getOptions,
}: CreateAmapVectorLayerContextValueParams): AmapVectorLayerContextValue {
    const childSyncs = new Set<AmapGroupChildSync>()

    function sync() {
        syncAmapLayerAfterChildChange(layer, getOptions())
    }

    function syncChildren() {
        childSyncs.forEach(childSync => childSync())
    }

    return {
        layer,
        addVector(vector) {
            layer.add?.(vector)
            sync()
        },
        removeVector(vector) {
            layer.remove?.(vector)
        },
        sync,
        syncChildren,
        registerChildSync(childSync) {
            childSyncs.add(childSync)

            return function unregisterAmapVectorLayerChildSync() {
                childSyncs.delete(childSync)
            }
        },
    }
}

function AmapLayer<TInstance extends AmapLayerInstance, TOptions extends AmapLayerBaseOptions>({
    ref,
    map,
    AMap,
    constructorPath,
    pluginName,
    pluginConstructorName,
    options,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    eventShortcuts,
    children,
    provideVectorLayerContext,
}: AmapLayerProps<TInstance, TOptions>) {
    const context = useAmapContext()
    const contextGroup = useLayerGroupContext()
    const layerRef = useRef<TInstance | null>(null)
    const [contextValue, setContextValue] = useState<AmapVectorLayerContextValue | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = AMap ?? context.AMap
    const currentGroup = map ? null : contextGroup
    const pluginLoaded = useAmapLayerPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName,
        pluginConstructorName,
    })
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getCurrentOptions = useEffectEvent(() => options)
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapLayerEvents

    useStableEffect(() => {
        if (!currentMap || !currentAMap || !pluginLoaded) return

        const LayerConstructor = getAmapLayerConstructor<TInstance, TOptions>(currentAMap, constructorPath)

        if (!LayerConstructor) return

        const initialOptions = getCurrentOptions()
        const layer = new LayerConstructor(initialOptions)

        if (currentGroup) currentGroup.addLayer(layer)
        else addAmapLayer(currentMap, layer)

        layerRef.current = layer
        if (provideVectorLayerContext)
            setContextValue(createAmapVectorLayerContextValue({
                layer,
                getOptions: getCurrentOptions as () => AmapLayerBaseOptions,
            }))
        setAmapLayerRef(ref, layer)
        updateAmapLayer(layer, initialOptions)
        currentGroup?.sync()
        onLoad(layer)

        return () => {
            layerRef.current = null
            setContextValue(null)
            setAmapLayerRef(ref, null)

            if (currentGroup) {
                try {
                    onDestroy(layer)
                } finally {
                    currentGroup.removeLayer(layer)
                    layer.setMap?.(null)
                    layer.destroy?.()
                }

                return
            }

            removeAmapLayer(currentMap, layer, onDestroy)
        }
    }, [constructorPath, currentAMap, currentGroup, currentMap, pluginLoaded, provideVectorLayerContext, ref])

    useStableEffect(() => {
        if (!layerRef.current) return

        updateAmapLayer(layerRef.current, options)
        currentGroup?.sync()
        contextValue?.syncChildren()
        if (options.visible === false) layerRef.current.hide?.()
    }, [contextValue, currentGroup, options])

    useStableEffect(() => {
        if (!currentGroup) return

        return currentGroup.registerChildSync(() => {
            if (!layerRef.current) return

            updateAmapLayer(layerRef.current, options)
            contextValue?.syncChildren()
            if (options.visible === false) layerRef.current.hide?.()
        })
    }, [contextValue, currentGroup, options])

    useStableEffect(() => {
        if (!layerRef.current) return

        return bindAmapLayerEvents(layerRef.current, currentEvents)
    }, [constructorPath, currentAMap, currentEvents, currentGroup, currentMap, pluginLoaded, ref])

    if (provideVectorLayerContext)
        return <VectorLayerContext value={contextValue}>{contextValue ? children : null}</VectorLayerContext>

    return null
}

function createLayerComponent<TOptions extends AmapLayerBaseOptions>(constructorPath: string[], displayName?: string) {
    const LayerComponent: FC<LayerProps<TOptions>> = ({
        ref,
        map,
        AMap,
        layerOptions,
        events,
        onLoad,
        onDestroy,
        ...restProps
    }) => {
        const { eventShortcuts, restProps: restOptions } = splitAmapEventShortcutProps(restProps)
        const currentOptions = mergeAmapLayerOptions(layerOptions, restOptions as TOptions)

        return (
            <AmapLayer
                ref={ref}
                map={map}
                AMap={AMap}
                constructorPath={constructorPath}
                options={currentOptions}
                events={events}
                onLoad={onLoad}
                onDestroy={onDestroy}
                eventShortcuts={eventShortcuts}
            />
        )
    }

    LayerComponent.displayName = displayName

    return LayerComponent
}

export const TileLayer = createLayerComponent<AmapTileLayerOptions>(["TileLayer"], "TileLayer")

export const TrafficLayer = createLayerComponent<AmapTrafficLayerOptions>(["TileLayer", "Traffic"], "TrafficLayer")

export const SatelliteLayer = createLayerComponent<AmapTileLayerOptions>(["TileLayer", "Satellite"], "SatelliteLayer")

export const RoadNetLayer = createLayerComponent<AmapTileLayerOptions>(["TileLayer", "RoadNet"], "RoadNetLayer")

export const WMSLayer = createLayerComponent<AmapWMSLayerOptions>(["TileLayer", "WMS"], "WMSLayer")

export const WMTSLayer = createLayerComponent<AmapWMTSLayerOptions>(["TileLayer", "WMTS"], "WMTSLayer")

export const MapboxVectorTileLayer = createLayerComponent<AmapMapboxVectorTileLayerOptions>(
    ["MapboxVectorTileLayer"],
    "MapboxVectorTileLayer"
)

export const BuildingsLayer = createLayerComponent<AmapBuildingsLayerOptions>(["Buildings"], "BuildingsLayer")

export const DistrictLayer = createLayerComponent<AmapDistrictLayerOptions>(["DistrictLayer"], "DistrictLayer")

export const DistrictLayerWorld = createLayerComponent<AmapDistrictLayerOptions>(
    ["DistrictLayer", "World"],
    "DistrictLayerWorld"
)

export const DistrictLayerCountry = createLayerComponent<AmapDistrictLayerOptions>(
    ["DistrictLayer", "Country"],
    "DistrictLayerCountry"
)

export const DistrictLayerProvince = createLayerComponent<AmapDistrictLayerOptions>(
    ["DistrictLayer", "Province"],
    "DistrictLayerProvince"
)

export const IndoorMap = createLayerComponent<AmapIndoorMapOptions>(["IndoorMap"], "IndoorMap")

export const FlexibleLayer = createLayerComponent<AmapFlexibleLayerOptions>(["TileLayer", "Flexible"], "FlexibleLayer")

export const ImageLayer = createLayerComponent<AmapImageLayerOptions>(["ImageLayer"], "ImageLayer")

export const CanvasLayer = createLayerComponent<AmapCanvasLayerOptions>(["CanvasLayer"], "CanvasLayer")

export const CustomLayer = createLayerComponent<AmapCustomLayerOptions>(["CustomLayer"], "CustomLayer")

export const GLCustomLayer = createLayerComponent<AmapLayerBaseOptions>(["GLCustomLayer"], "GLCustomLayer")

export const VectorLayer: FC<VectorLayerProps> = ({
    ref,
    map,
    AMap,
    children,
    layerOptions,
    events,
    onLoad,
    onDestroy,
    ...restProps
}) => {
    const { eventShortcuts, restProps: restOptions } = splitAmapEventShortcutProps(restProps)
    const currentOptions = mergeAmapLayerOptions(layerOptions, restOptions as AmapVectorLayerOptions)

    return (
        <AmapLayer
            ref={ref}
            map={map}
            AMap={AMap}
            constructorPath={["VectorLayer"]}
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            eventShortcuts={eventShortcuts}
            children={children}
            provideVectorLayerContext
        />
    )
}

VectorLayer.displayName = "VectorLayer"

export const HeatMap: FC<HeatMapProps> = ({
    ref,
    map,
    AMap,
    dataSet,
    heatMapOptions,
    events,
    onLoad,
    onDestroy,
    ...restProps
}) => {
    const context = useAmapContext()
    const contextGroup = useLayerGroupContext()
    const heatMapRef = useRef<AmapLayerInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = AMap ?? context.AMap
    const currentGroup = map ? null : contextGroup
    const { eventShortcuts, restProps: restOptions } = splitAmapEventShortcutProps(restProps)
    const pluginLoaded = useAmapLayerPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName: AmapPlugin.HeatMap,
        pluginConstructorName: "HeatMap",
    })
    const currentOptions = mergeAmapLayerOptions(heatMapOptions, restOptions as AmapHeatMapOptions)
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapLayerEvents
    const onLoadAction = useEffectEvent(optionalFn(onLoad))
    const onDestroyAction = useEffectEvent(optionalFn(onDestroy))
    const getInitialOptions = useEffectEvent(() => currentOptions)
    const getInitialDataSet = useEffectEvent(() => dataSet)

    useStableEffect(() => {
        if (!currentMap || !currentAMap || !pluginLoaded) return

        const HeatMapConstructor = getAmapObjectByPath(currentAMap, ["HeatMap"])

        if (typeof HeatMapConstructor !== "function") return

        const initialOptions = getInitialOptions()
        const heatMap = new (HeatMapConstructor as AmapHeatMapConstructor)(currentMap, initialOptions)

        currentGroup?.addLayer(heatMap)
        heatMapRef.current = heatMap
        setAmapLayerRef(ref, heatMap)
        updateAmapLayer(heatMap, initialOptions)
        currentGroup?.sync()
        heatMap.setDataSet?.(getInitialDataSet() ?? {})
        onLoadAction(heatMap)

        return () => {
            heatMapRef.current = null
            setAmapLayerRef(ref, null)

            if (currentGroup) {
                try {
                    onDestroyAction(heatMap)
                } finally {
                    currentGroup.removeLayer(heatMap)
                    heatMap.setMap?.(null)
                    heatMap.destroy?.()
                }

                return
            }

            removeAmapLayer(currentMap, heatMap, onDestroyAction)
        }
    }, [currentAMap, currentGroup, currentMap, pluginLoaded, ref])

    useStableEffect(() => {
        if (!heatMapRef.current) return

        updateAmapLayer(heatMapRef.current, currentOptions)
        currentGroup?.sync()
    }, [currentGroup, currentOptions])

    useStableEffect(() => {
        if (!currentGroup) return

        return currentGroup.registerChildSync(() => {
            if (!heatMapRef.current) return

            updateAmapLayer(heatMapRef.current, currentOptions)
        })
    }, [currentGroup, currentOptions])

    useStableEffect(() => heatMapRef.current?.setDataSet?.(dataSet ?? {}), [dataSet])

    useStableEffect(() => {
        if (!heatMapRef.current) return

        return bindAmapLayerEvents(heatMapRef.current, currentEvents)
    }, [currentAMap, currentEvents, currentGroup, currentMap, pluginLoaded, ref])

    return null
}
