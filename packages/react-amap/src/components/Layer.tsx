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
    MapPlugin,
    type MapEventHandler,
    type MapInstance,
    type MapNamespace,
    type MapZoomRange,
    useMapContext,
} from "./Map"
import { type MapGroupChildSync, type MapGroupChildSyncCleanup, useLayerGroupContext } from "./Group"
import type { MapBoundsLike } from "./Vector"
import { loadMapPlugin } from "../utils/mapPlugin"
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

export type MapLayerOnLoad<TInstance extends MapLayerInstance = MapLayerInstance> = (layer: TInstance) => void

export type MapLayerOnDestroy<TInstance extends MapLayerInstance = MapLayerInstance> = (layer: TInstance) => void

/** 图层鼠标事件 */
export interface MapLayerMouseEvent<TInstance = MapLayerInstance> extends MapOverlayMouseEvent<TInstance> {}

/** 图层交互坐标事件 */
export interface MapLayerInteractionEvent<TInstance = MapLayerInstance> extends MapOverlayInteractionEvent<TInstance> {}

/** 图层目标事件 */
export interface MapLayerTargetEvent<TInstance = MapLayerInstance> extends MapTargetEvent<TInstance> {}

/** 图层移动动画事件 */
export interface MapLayerMoveEvent<TInstance = MapLayerInstance> extends MapMoveEvent<TInstance> {}

/** 图层事件快捷属性 */
export interface MapLayerEventShortcutProps<TInstance = MapLayerInstance>
    extends MapOverlayEventShortcutProps<TInstance> {}

/** 热力图鼠标事件 */
export interface MapHeatMapMouseEvent extends MapLayerMouseEvent<MapLayerInstance> {}

/** 热力图交互坐标事件 */
export interface MapHeatMapInteractionEvent extends MapLayerInteractionEvent<MapLayerInstance> {}

/** 热力图目标事件 */
export interface MapHeatMapTargetEvent extends MapLayerTargetEvent<MapLayerInstance> {}

/** 热力图移动动画事件 */
export interface MapHeatMapMoveEvent extends MapLayerMoveEvent<MapLayerInstance> {}

/** 热力图事件快捷属性 */
export interface MapHeatMapEventShortcutProps extends MapLayerEventShortcutProps<MapLayerInstance> {}

/** 矢量图层鼠标事件 */
export interface MapVectorLayerMouseEvent extends MapLayerMouseEvent<MapLayerInstance> {}

/** 矢量图层交互坐标事件 */
export interface MapVectorLayerInteractionEvent extends MapLayerInteractionEvent<MapLayerInstance> {}

/** 矢量图层目标事件 */
export interface MapVectorLayerTargetEvent extends MapLayerTargetEvent<MapLayerInstance> {}

/** 矢量图层移动动画事件 */
export interface MapVectorLayerMoveEvent extends MapLayerMoveEvent<MapLayerInstance> {}

/** 矢量图层事件快捷属性 */
export interface MapVectorLayerEventShortcutProps extends MapLayerEventShortcutProps<MapLayerInstance> {}

/** 图层事件映射 */
export interface MapLayerEvents<TInstance = MapLayerInstance> extends MapOverlayEventMap<TInstance> {}

/** 图层基础参数 */
export interface MapLayerBaseOptions {
    /** 是否可见 */
    visible?: boolean
    /** 图层透明度 */
    opacity?: number
    /** 图层层级 */
    zIndex?: number
    /** 图层缩放范围 */
    zooms?: MapZoomRange
}

/** 图层运行时可同步参数 */
export interface MapLayerRuntimeOptions extends MapLayerBaseOptions {
    /** 切片取图地址 */
    tileUrl?: string
    /** 数据地址 */
    url?: string
    /** 图层范围 */
    bounds?: MapBoundsLike
    /** 楼块样式 */
    styleOpts?: MapBuildingsStyleOptions
    /** 行政区或矢量瓦片样式 */
    styles?: MapDistrictLayerStyles | MapboxVectorTileLayerStyles
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
export interface MapTileLayerOptions extends MapLayerBaseOptions {
    /** 切片取图地址 */
    tileUrl?: string
    /** 数据缩放范围 */
    dataZooms?: MapZoomRange
    /** 切片大小 */
    tileSize?: number
}

/** 灵活切片创建成功回调 */
export type MapFlexibleLayerCreateTileSuccess = (tile: HTMLImageElement | HTMLCanvasElement) => void

/** 灵活切片创建失败回调 */
export type MapFlexibleLayerCreateTileFail = () => void

/** 灵活切片创建函数 */
export type MapFlexibleLayerCreateTile = (
    x: number,
    y: number,
    z: number,
    success: MapFlexibleLayerCreateTileSuccess,
    fail: MapFlexibleLayerCreateTileFail
) => void

/** 灵活切片图层参数 */
export interface MapFlexibleLayerOptions extends MapTileLayerOptions {
    /** 缓存瓦片数量 */
    cacheSize?: number
    /** 创建切片 */
    createTile?: MapFlexibleLayerCreateTile
}

/** 交通图层参数 */
export interface MapTrafficLayerOptions extends MapTileLayerOptions {
    /** 是否自动更新 */
    autoRefresh?: boolean
    /** 自动更新间隔 */
    interval?: number
}

/** 楼块图层样式 */
export interface MapBuildingsStyleOptions {
    /** 是否隐藏区域外楼块 */
    hideWithoutStyle?: boolean
    /** 区域样式 */
    areas?: unknown[]
}

/** 楼块图层参数 */
export interface MapBuildingsLayerOptions extends MapLayerBaseOptions {
    /** 楼块侧面颜色 */
    wallColor?: string | string[]
    /** 楼块顶面颜色 */
    roofColor?: string | string[]
    /** 高度系数 */
    heightFactor?: number
    /** 楼块样式 */
    styleOpts?: MapBuildingsStyleOptions
}

/** 行政区样式区域数据 */
export interface MapDistrictLayerArea {
    /** 中文名称 */
    NAME_CHN: string
    /** 国家代码 */
    SOC: string
    /** 行政区编码 */
    adcode: number
    /** 城市行政区编码 */
    adcode_cit: number
    /** 省级行政区编码 */
    adcode_pro: number
    /** 城市编码 */
    citycode: string
    /** 行政区级别 */
    level: string
    /** 区域类型 */
    type: string
    /** 经度 */
    x: number
    /** 纬度 */
    y: number
    /** 区域类型编码 */
    type_: number
    /** 要素类型编码 */
    feature_type_: number
}

/** 行政区样式回调 */
export type MapDistrictLayerStyleCallback<TValue = unknown> = (area: MapDistrictLayerArea) => TValue

/** 行政区样式配置值 */
export type MapDistrictLayerStyleValue<TValue> = TValue | MapDistrictLayerStyleCallback<TValue>

/** 行政区样式颜色数组 */
export type MapDistrictLayerStyleColorArray = Array<string | number>

/** 行政区样式颜色值 */
export type MapDistrictLayerStyleColor = string | MapDistrictLayerStyleColorArray

/** 行政区样式数值配置 */
export type MapDistrictLayerStyleNumberValue = MapDistrictLayerStyleValue<number>

/** 行政区样式颜色配置 */
export type MapDistrictLayerStyleColorValue = MapDistrictLayerStyleValue<MapDistrictLayerStyleColor>

/** 行政区图层样式 */
export interface MapDistrictLayerStyles {
    /** 描边线宽 */
    "stroke-width"?: MapDistrictLayerStyleNumberValue
    /** 图层中每个区域层级 */
    zIndex?: MapDistrictLayerStyleNumberValue
    /** 海岸线颜色 */
    "coastline-stroke"?: MapDistrictLayerStyleColorValue
    /** 国境线颜色 */
    "nation-stroke"?: MapDistrictLayerStyleColorValue
    /** 省界颜色 */
    "province-stroke"?: MapDistrictLayerStyleColorValue
    /** 城市界颜色 */
    "city-stroke"?: MapDistrictLayerStyleColorValue
    /** 区县界颜色 */
    "county-stroke"?: MapDistrictLayerStyleColorValue
    /** 填充色 */
    fill?: MapDistrictLayerStyleColorValue
}

/** 行政区图层参数 */
export interface MapDistrictLayerOptions extends MapLayerBaseOptions {
    /** 行政区编码 */
    adcode?: string | number | Array<string | number>
    /** 国家代码 */
    SOC?: string
    /** 数据层级深度 */
    depth?: number
    /** 行政区样式 */
    styles?: MapDistrictLayerStyles
}

/** 室内图层参数 */
export interface MapIndoorMapOptions extends MapLayerBaseOptions {
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
export interface MapImageLayerOptions extends MapLayerBaseOptions {
    /** 图片地址 */
    url?: string
    /** 图片范围 */
    bounds?: MapBoundsLike
}

/** Canvas 图层参数 */
export interface MapCanvasLayerOptions extends MapLayerBaseOptions {
    /** Canvas 元素 */
    canvas?: HTMLCanvasElement
    /** 图层范围 */
    bounds?: MapBoundsLike
}

/** 自定义图层参数 */
export interface MapCustomLayerOptions extends MapLayerBaseOptions {
    /** Canvas 元素 */
    canvas?: HTMLCanvasElement
    /** 渲染回调 */
    render?: () => void
}

/** WMS 图层参数 */
export interface MapWMSLayerOptions extends MapTileLayerOptions {
    /** 服务地址 */
    url?: string
    /** WMS 参数 */
    params?: Record<string, unknown>
}

/** WMTS 图层参数 */
export interface MapWMTSLayerOptions extends MapTileLayerOptions {
    /** 服务地址 */
    url?: string
    /** WMTS 参数 */
    params?: Record<string, unknown>
}

/** Mapbox 矢量瓦片样式 */
export interface MapboxVectorTileLayerStyles {
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
export interface MapboxVectorTileLayerOptions extends MapTileLayerOptions {
    /** MVT 数据地址 */
    url?: string
    /** 样式配置 */
    styles?: MapboxVectorTileLayerStyles
}

/** 矢量图层参数 */
export interface MapVectorLayerOptions extends MapLayerBaseOptions {
}

/** 热力图参数 */
export interface MapHeatMapOptions extends MapLayerBaseOptions {
    /** 热力图半径 */
    radius?: number
    /** 渐变色 */
    gradient?: Record<string, string>
}

/** 热力图数据 */
export interface MapHeatMapData {
    /** 经度 */
    lng?: number
    /** 纬度 */
    lat?: number
    /** 权重 */
    count?: number
}

/** 热力图数据集 */
export interface MapHeatMapDataSet {
    /** 最大值 */
    max?: number
    /** 数据 */
    data?: MapHeatMapData[]
}

/** 图层实例 */
export interface MapLayerInstance {
    /** 设置地图 */
    setMap?: (map: MapInstance | null) => void
    /** 销毁图层 */
    destroy?: () => void
    /** 显示图层 */
    show?: () => void
    /** 隐藏图层 */
    hide?: () => void
    /** 绑定事件 */
    on?: (eventName: string, handler: MapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: MapEventHandler) => void
    /** 设置参数 */
    setOptions?: (options: MapLayerBaseOptions) => void
    /** 设置层级 */
    setzIndex?: (zIndex: number) => void
    /** 设置透明度 */
    setOpacity?: (opacity: number) => void
    /** 设置缩放范围 */
    setZooms?: (zooms: MapZoomRange) => void
    /** 设置切片地址 */
    setTileUrl?: (url: string) => void
    /** 设置数据地址 */
    setUrl?: (url: string) => void
    /** 设置图层范围 */
    setBounds?: (bounds: MapBoundsLike) => void
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
    setDataSet?: (dataSet: MapHeatMapDataSet) => void
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
export interface MapLayerConstructor<TInstance extends MapLayerInstance, TOptions extends MapLayerBaseOptions> {
    new (options?: TOptions): TInstance
}

/** 热力图构造器 */
export interface MapHeatMapConstructor {
    new (map: MapInstance, options?: MapHeatMapOptions): MapLayerInstance
}

/** 支持图层构造器的高德命名空间 */
export interface MapLayerNamespace extends MapNamespace {
    /** TileLayer 构造器或命名空间 */
    TileLayer?: unknown
    /** Buildings 构造器 */
    Buildings?: new (options?: MapBuildingsLayerOptions) => MapLayerInstance
    /** DistrictLayer 构造器或命名空间 */
    DistrictLayer?: unknown
    /** IndoorMap 构造器 */
    IndoorMap?: new (options?: MapIndoorMapOptions) => MapLayerInstance
    /** ImageLayer 构造器 */
    ImageLayer?: new (options?: MapImageLayerOptions) => MapLayerInstance
    /** CanvasLayer 构造器 */
    CanvasLayer?: new (options?: MapCanvasLayerOptions) => MapLayerInstance
    /** CustomLayer 构造器 */
    CustomLayer?: new (options?: MapCustomLayerOptions) => MapLayerInstance
    /** GLCustomLayer 构造器 */
    GLCustomLayer?: new (options?: MapLayerBaseOptions) => MapLayerInstance
    /** HeatMap 构造器 */
    HeatMap?: MapHeatMapConstructor
    /** 灵活切片图层构造器 */
    Flexible?: new (options?: MapFlexibleLayerOptions) => MapLayerInstance
    /** Mapbox 矢量瓦片图层构造器 */
    MapboxVectorTileLayer?: new (options?: MapboxVectorTileLayerOptions) => MapLayerInstance
    /** 矢量图层构造器 */
    VectorLayer?: new (options?: MapVectorLayerOptions) => MapLayerInstance
}

/** 内部图层组件属性 */
export interface MapLayerProps<TInstance extends MapLayerInstance, TOptions extends MapLayerBaseOptions> {
    /** 图层实例 ref */
    ref?: Ref<TInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 构造器路径 */
    constructorPath: string[]
    /** 插件名称 */
    pluginName?: MapPlugin
    /** 插件构造器名称 */
    pluginConstructorName?: string
    /** 图层参数 */
    options: TOptions
    /** 图层事件映射 */
    events?: MapLayerEvents<TInstance>
    /** 创建完成回调 */
    onLoad?: MapLayerOnLoad<TInstance>
    /** 销毁前回调 */
    onDestroy?: MapLayerOnDestroy<TInstance>
    /** 图层事件快捷属性 */
    eventShortcuts?: MapLayerEventShortcutProps<TInstance>
    /** 子覆盖物 */
    children?: ReactNode
    /** 是否向子覆盖物提供矢量图层上下文 */
    provideVectorLayerContext?: boolean
}

/** 使用图层插件参数 */
export interface UseMapLayerPluginParams {
    /** 地图实例 */
    map?: MapInstance | null
    /** 高德地图命名空间 */
    AMap?: MapNamespace | null
    /** 插件名称 */
    pluginName?: MapPlugin
    /** 插件构造器名称 */
    pluginConstructorName?: string
}

/** 通用图层基础组件属性 */
export interface LayerBaseProps extends MapLayerEventShortcutProps<MapLayerInstance> {
    /** 图层实例 ref */
    ref?: Ref<MapLayerInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 图层事件映射 */
    events?: MapLayerEvents
    /** 创建完成回调 */
    onLoad?: MapLayerOnLoad
    /** 销毁前回调 */
    onDestroy?: MapLayerOnDestroy
}

/** 通用图层组件属性 */
export type LayerProps<TOptions extends MapLayerBaseOptions = MapLayerBaseOptions> = LayerBaseProps & TOptions

/** 热力图组件属性 */
export interface HeatMapProps extends MapHeatMapOptions, MapHeatMapEventShortcutProps {
    /** 热力图实例 ref */
    ref?: Ref<MapLayerInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 热力图数据集 */
    dataSet?: MapHeatMapDataSet
    /** 热力图事件映射 */
    events?: MapLayerEvents
    /** 创建完成回调 */
    onLoad?: MapLayerOnLoad
    /** 销毁前回调 */
    onDestroy?: MapLayerOnDestroy
}

/** 矢量图层组件属性 */
export interface VectorLayerProps extends LayerProps<MapVectorLayerOptions>, MapVectorLayerEventShortcutProps {
    /** 子矢量覆盖物 */
    children?: ReactNode
}

/** 矢量图层上下文数据 */
export interface MapVectorLayerContextValue {
    /** 矢量图层实例 */
    layer: MapLayerInstance
    /** 添加矢量覆盖物并同步图层状态 */
    addVector(vector: unknown): void
    /** 移除矢量覆盖物 */
    removeVector(vector: unknown): void
    /** 同步子覆盖物变更后的图层状态 */
    sync(): void
    /** 同步所有子矢量覆盖物 */
    syncChildren(): void
    /** 注册子矢量覆盖物同步函数 */
    registerChildSync(sync: MapGroupChildSync): MapGroupChildSyncCleanup
}

/** 创建矢量图层上下文参数 */
export interface CreateMapVectorLayerContextValueParams {
    /** 矢量图层实例 */
    layer: MapLayerInstance
    /** 获取最新图层参数 */
    getOptions: () => MapLayerBaseOptions
}

/** 矢量图层上下文 */
export const VectorLayerContext = createContext<MapVectorLayerContextValue | null>(null)

export function useVectorLayerContext() {
    return useContext(VectorLayerContext)
}

function getMapObjectByPath(root: unknown, path: string[]) {
    return path.reduce<unknown>((value, key) => {
        if (!value || typeof value !== "object" && typeof value !== "function") return undefined

        return (value as Record<string, unknown>)[key]
    }, root)
}

function getMapLayerConstructor<TInstance extends MapLayerInstance, TOptions extends MapLayerBaseOptions>(
    AMap: MapNamespace,
    constructorPath: string[]
) {
    const constructor = getMapObjectByPath(AMap, constructorPath)

    if (typeof constructor !== "function") return undefined

    return constructor as MapLayerConstructor<TInstance, TOptions>
}

function useMapLayerPlugin({ map, AMap, pluginName, pluginConstructorName }: UseMapLayerPluginParams) {
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

        loadMapPlugin({
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

function setMapLayerRef<TInstance extends MapLayerInstance>(ref: Ref<TInstance | null> | undefined, layer: TInstance | null) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(layer)
        return
    }

    ref.current = layer
}

function bindMapLayerEvents<TInstance extends MapLayerInstance>(layer: TInstance, events?: MapLayerEvents) {
    const eventEntries = getMapEventEntries(events)

    eventEntries.forEach(({ eventName, handler }) => layer.on?.(eventName, handler))

    return function unbindMapLayerEvents() {
        eventEntries.forEach(({ eventName, handler }) => layer.off?.(eventName, handler))
    }
}

function getDefinedMapLayerOptions<TOptions extends MapLayerBaseOptions>(options: TOptions) {
    const nextOptions: TOptions = {} as TOptions

    Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) (nextOptions as Record<string, unknown>)[key] = value
    })

    return nextOptions
}

function addMapLayer(map: MapInstance, layer: MapLayerInstance) {
    if (map.addLayer) {
        map.addLayer(layer)
        return
    }

    map.add?.(layer)
}

function removeMapLayer<TInstance extends MapLayerInstance>(
    map: MapInstance,
    layer: TInstance,
    onDestroy?: MapLayerOnDestroy<TInstance>
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

function updateMapLayer<TInstance extends MapLayerInstance, TOptions extends MapLayerBaseOptions>(
    layer: TInstance,
    options: TOptions
) {
    const runtimeOptions = options as TOptions & MapLayerRuntimeOptions

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

function syncMapLayerAfterChildChange<TInstance extends MapLayerInstance, TOptions extends MapLayerBaseOptions>(
    layer: TInstance,
    options: TOptions
) {
    const { visible, ...setOptions } = options

    updateMapLayer(layer, setOptions as TOptions)

    if (visible === false) layer.hide?.()
}

function createMapVectorLayerContextValue({
    layer,
    getOptions,
}: CreateMapVectorLayerContextValueParams): MapVectorLayerContextValue {
    const childSyncs = new Set<MapGroupChildSync>()

    function sync() {
        syncMapLayerAfterChildChange(layer, getOptions())
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

            return function unregisterMapVectorLayerChildSync() {
                childSyncs.delete(childSync)
            }
        },
    }
}

function MapLayer<TInstance extends MapLayerInstance, TOptions extends MapLayerBaseOptions>({
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
}: MapLayerProps<TInstance, TOptions>) {
    const context = useMapContext()
    const contextGroup = useLayerGroupContext()
    const layerRef = useRef<TInstance | null>(null)
    const [contextValue, setContextValue] = useState<MapVectorLayerContextValue | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = AMap ?? context.AMap
    const currentGroup = map ? null : contextGroup
    const pluginLoaded = useMapLayerPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName,
        pluginConstructorName,
    })
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getCurrentOptions = useEffectEvent(() => options)
    const currentEvents = mergeMapEvents({
        eventShortcuts,
        events,
    }) as MapLayerEvents

    useStableEffect(() => {
        if (!currentMap || !currentAMap || !pluginLoaded) return

        const LayerConstructor = getMapLayerConstructor<TInstance, TOptions>(currentAMap, constructorPath)

        if (!LayerConstructor) return

        const initialOptions = getCurrentOptions()
        const layer = new LayerConstructor(initialOptions)

        if (currentGroup) currentGroup.addLayer(layer)
        else addMapLayer(currentMap, layer)

        layerRef.current = layer
        if (provideVectorLayerContext)
            setContextValue(createMapVectorLayerContextValue({
                layer,
                getOptions: getCurrentOptions as () => MapLayerBaseOptions,
            }))
        setMapLayerRef(ref, layer)
        updateMapLayer(layer, initialOptions)
        currentGroup?.sync()
        onLoad(layer)

        return () => {
            layerRef.current = null
            setContextValue(null)
            setMapLayerRef(ref, null)

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

            removeMapLayer(currentMap, layer, onDestroy)
        }
    }, [constructorPath, currentAMap, currentGroup, currentMap, pluginLoaded, provideVectorLayerContext, ref])

    useStableEffect(() => {
        if (!layerRef.current) return

        updateMapLayer(layerRef.current, options)
        currentGroup?.sync()
        contextValue?.syncChildren()
        if (options.visible === false) layerRef.current.hide?.()
    }, [contextValue, currentGroup, options])

    useStableEffect(() => {
        if (!currentGroup) return

        return currentGroup.registerChildSync(() => {
            if (!layerRef.current) return

            updateMapLayer(layerRef.current, options)
            contextValue?.syncChildren()
            if (options.visible === false) layerRef.current.hide?.()
        })
    }, [contextValue, currentGroup, options])

    useStableEffect(() => {
        if (!layerRef.current) return

        return bindMapLayerEvents(layerRef.current, currentEvents)
    }, [constructorPath, currentAMap, currentEvents, currentGroup, currentMap, pluginLoaded, ref])

    if (provideVectorLayerContext)
        return <VectorLayerContext value={contextValue}>{contextValue ? children : null}</VectorLayerContext>

    return null
}

function createLayerComponent<TOptions extends MapLayerBaseOptions>(constructorPath: string[], displayName?: string) {
    const LayerComponent: FC<LayerProps<TOptions>> = ({
        ref,
        map,
        AMap,
        events,
        onLoad,
        onDestroy,
        ...restProps
    }) => {
        const { eventShortcuts, restProps: restOptions } = splitMapEventShortcutProps(restProps)
        const currentOptions = getDefinedMapLayerOptions(restOptions as TOptions)

        return (
            <MapLayer
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

export const TileLayer = createLayerComponent<MapTileLayerOptions>(["TileLayer"], "TileLayer")

export const TrafficLayer = createLayerComponent<MapTrafficLayerOptions>(["TileLayer", "Traffic"], "TrafficLayer")

export const SatelliteLayer = createLayerComponent<MapTileLayerOptions>(["TileLayer", "Satellite"], "SatelliteLayer")

export const RoadNetLayer = createLayerComponent<MapTileLayerOptions>(["TileLayer", "RoadNet"], "RoadNetLayer")

export const WMSLayer = createLayerComponent<MapWMSLayerOptions>(["TileLayer", "WMS"], "WMSLayer")

export const WMTSLayer = createLayerComponent<MapWMTSLayerOptions>(["TileLayer", "WMTS"], "WMTSLayer")

export const MapboxVectorTileLayer = createLayerComponent<MapboxVectorTileLayerOptions>(
    ["MapboxVectorTileLayer"],
    "MapboxVectorTileLayer"
)

export const BuildingsLayer = createLayerComponent<MapBuildingsLayerOptions>(["Buildings"], "BuildingsLayer")

export const DistrictLayer = createLayerComponent<MapDistrictLayerOptions>(["DistrictLayer"], "DistrictLayer")

export const DistrictLayerWorld = createLayerComponent<MapDistrictLayerOptions>(
    ["DistrictLayer", "World"],
    "DistrictLayerWorld"
)

export const DistrictLayerCountry = createLayerComponent<MapDistrictLayerOptions>(
    ["DistrictLayer", "Country"],
    "DistrictLayerCountry"
)

export const DistrictLayerProvince = createLayerComponent<MapDistrictLayerOptions>(
    ["DistrictLayer", "Province"],
    "DistrictLayerProvince"
)

export const IndoorMap = createLayerComponent<MapIndoorMapOptions>(["IndoorMap"], "IndoorMap")

export const FlexibleLayer = createLayerComponent<MapFlexibleLayerOptions>(["TileLayer", "Flexible"], "FlexibleLayer")

export const ImageLayer = createLayerComponent<MapImageLayerOptions>(["ImageLayer"], "ImageLayer")

export const CanvasLayer = createLayerComponent<MapCanvasLayerOptions>(["CanvasLayer"], "CanvasLayer")

export const CustomLayer = createLayerComponent<MapCustomLayerOptions>(["CustomLayer"], "CustomLayer")

export const GLCustomLayer = createLayerComponent<MapLayerBaseOptions>(["GLCustomLayer"], "GLCustomLayer")

export const VectorLayer: FC<VectorLayerProps> = ({
    ref,
    map,
    AMap,
    children,
    events,
    onLoad,
    onDestroy,
    ...restProps
}) => {
    const { eventShortcuts, restProps: restOptions } = splitMapEventShortcutProps(restProps)
    const currentOptions = getDefinedMapLayerOptions(restOptions as MapVectorLayerOptions)

    return (
        <MapLayer
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
    events,
    onLoad,
    onDestroy,
    ...restProps
}) => {
    const context = useMapContext()
    const contextGroup = useLayerGroupContext()
    const heatMapRef = useRef<MapLayerInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = AMap ?? context.AMap
    const currentGroup = map ? null : contextGroup
    const { eventShortcuts, restProps: restOptions } = splitMapEventShortcutProps(restProps)
    const pluginLoaded = useMapLayerPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName: MapPlugin.HeatMap,
        pluginConstructorName: "HeatMap",
    })
    const currentOptions = getDefinedMapLayerOptions(restOptions as MapHeatMapOptions)
    const currentEvents = mergeMapEvents({
        eventShortcuts,
        events,
    }) as MapLayerEvents
    const onLoadAction = useEffectEvent(optionalFn(onLoad))
    const onDestroyAction = useEffectEvent(optionalFn(onDestroy))
    const getInitialOptions = useEffectEvent(() => currentOptions)
    const getInitialDataSet = useEffectEvent(() => dataSet)

    useStableEffect(() => {
        if (!currentMap || !currentAMap || !pluginLoaded) return

        const HeatMapConstructor = getMapObjectByPath(currentAMap, ["HeatMap"])

        if (typeof HeatMapConstructor !== "function") return

        const initialOptions = getInitialOptions()
        const heatMap = new (HeatMapConstructor as MapHeatMapConstructor)(currentMap, initialOptions)

        currentGroup?.addLayer(heatMap)
        heatMapRef.current = heatMap
        setMapLayerRef(ref, heatMap)
        updateMapLayer(heatMap, initialOptions)
        currentGroup?.sync()
        heatMap.setDataSet?.(getInitialDataSet() ?? {})
        onLoadAction(heatMap)

        return () => {
            heatMapRef.current = null
            setMapLayerRef(ref, null)

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

            removeMapLayer(currentMap, heatMap, onDestroyAction)
        }
    }, [currentAMap, currentGroup, currentMap, pluginLoaded, ref])

    useStableEffect(() => {
        if (!heatMapRef.current) return

        updateMapLayer(heatMapRef.current, currentOptions)
        currentGroup?.sync()
    }, [currentGroup, currentOptions])

    useStableEffect(() => {
        if (!currentGroup) return

        return currentGroup.registerChildSync(() => {
            if (!heatMapRef.current) return

            updateMapLayer(heatMapRef.current, currentOptions)
        })
    }, [currentGroup, currentOptions])

    useStableEffect(() => heatMapRef.current?.setDataSet?.(dataSet ?? {}), [dataSet])

    useStableEffect(() => {
        if (!heatMapRef.current) return

        return bindMapLayerEvents(heatMapRef.current, currentEvents)
    }, [currentAMap, currentEvents, currentGroup, currentMap, pluginLoaded, ref])

    return null
}
