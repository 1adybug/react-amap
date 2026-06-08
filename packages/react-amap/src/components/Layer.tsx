import { type FC, type Ref, useEffect, useEffectEvent, useRef, useState } from "react"

import { type AmapEventHandler, type AmapMapInstance, type AmapNamespace, type AmapZoomRange, useAmapContext } from "./Amap"
import type { AmapBoundsLike } from "./Vector"
import { loadAmapPlugin } from "../utils/amapPlugin"
import { optionalFn } from "../utils/optionalFn"
import { useStableEffect } from "../hooks/useStableEffect"

export type AmapLayerOnLoad<TInstance extends AmapLayerInstance = AmapLayerInstance> = (layer: TInstance) => void

export type AmapLayerOnDestroy<TInstance extends AmapLayerInstance = AmapLayerInstance> = (layer: TInstance) => void

/** 图层事件映射 */
export interface AmapLayerEvents {
    [eventName: string]: AmapEventHandler
}

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
    [key: string]: unknown
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
    [key: string]: unknown
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
    [key: string]: unknown
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
    [key: string]: unknown
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
    pluginName?: string
    /** 插件构造器名称 */
    pluginConstructorName?: string
    /** 图层参数 */
    options: TOptions
    /** 图层事件映射 */
    events?: AmapLayerEvents
    /** 创建完成回调 */
    onLoad?: AmapLayerOnLoad<TInstance>
    /** 销毁前回调 */
    onDestroy?: AmapLayerOnDestroy<TInstance>
}

/** 使用图层插件参数 */
export interface UseAmapLayerPluginParams {
    /** 地图实例 */
    map?: AmapMapInstance | null
    /** 高德地图命名空间 */
    AMap?: AmapNamespace | null
    /** 插件名称 */
    pluginName?: string
    /** 插件构造器名称 */
    pluginConstructorName?: string
}

/** 通用图层组件属性 */
export interface LayerProps<TOptions extends AmapLayerBaseOptions = AmapLayerBaseOptions> {
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
    [key: string]: unknown
}

/** 热力图组件属性 */
export interface HeatMapProps extends AmapHeatMapOptions {
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
    const eventEntries = Object.entries(events ?? {})

    eventEntries.forEach(([eventName, handler]) => layer.on?.(eventName, handler))

    return function unbindAmapLayerEvents() {
        eventEntries.forEach(([eventName, handler]) => layer.off?.(eventName, handler))
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
    layer.setOptions?.(options)

    if (typeof options.opacity === "number") layer.setOpacity?.(options.opacity)
    if (typeof options.zIndex === "number") layer.setzIndex?.(options.zIndex)
    if (options.zooms) layer.setZooms?.(options.zooms)
    if (typeof options.tileUrl === "string") layer.setTileUrl?.(options.tileUrl)
    if (options.styleOpts) layer.setStyle?.(options.styleOpts)
    if (options.styles) layer.setStyles?.(options.styles)
    if (typeof options.SOC === "string") layer.setSOC?.(options.SOC)

    if (options.adcode !== undefined) {
        layer.setAdcode?.(options.adcode as string | number | Array<string | number>)
        layer.setDistricts?.(options.adcode as string | number | Array<string | number>)
    }

    if (typeof options.indoorid === "string")
        layer.showIndoorMap?.(options.indoorid, options.floor as number | undefined, options.shopid as string | undefined)

    if (typeof options.floor === "number") layer.showFloor?.(options.floor)

    if (typeof options.floorBarVisible === "boolean") {
        if (options.floorBarVisible) {
            layer.showFloorBar?.()
        } else {
            layer.hideFloorBar?.()
        }
    }

    if (typeof options.labelsVisible === "boolean") {
        if (options.labelsVisible) {
            layer.showLabels?.()
        } else {
            layer.hideLabels?.()
        }
    }

    if (options.visible === undefined) return

    if (options.visible) {
        layer.show?.()
        return
    }

    layer.hide?.()
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
}: AmapLayerProps<TInstance, TOptions>) {
    const context = useAmapContext()
    const layerRef = useRef<TInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = AMap ?? context.AMap
    const pluginLoaded = useAmapLayerPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName,
        pluginConstructorName,
    })
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialOptions = useEffectEvent(() => options)

    useStableEffect(() => {
        if (!currentMap || !currentAMap || !pluginLoaded) return

        const LayerConstructor = getAmapLayerConstructor<TInstance, TOptions>(currentAMap, constructorPath)

        if (!LayerConstructor) return

        const initialOptions = getInitialOptions()
        const layer = new LayerConstructor(initialOptions)

        addAmapLayer(currentMap, layer)
        layerRef.current = layer
        setAmapLayerRef(ref, layer)
        updateAmapLayer(layer, initialOptions)
        onLoad(layer)

        return () => {
            layerRef.current = null
            setAmapLayerRef(ref, null)
            removeAmapLayer(currentMap, layer, onDestroy)
        }
    }, [constructorPath, currentAMap, currentMap, pluginLoaded, ref])

    useStableEffect(() => {
        if (!layerRef.current) return

        updateAmapLayer(layerRef.current, options)
    }, [options])

    useStableEffect(() => {
        if (!layerRef.current) return

        return bindAmapLayerEvents(layerRef.current, events)
    }, [constructorPath, currentAMap, currentMap, events, pluginLoaded, ref])

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
        ...restOptions
    }) => {
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

export const ImageLayer = createLayerComponent<AmapImageLayerOptions>(["ImageLayer"], "ImageLayer")

export const CanvasLayer = createLayerComponent<AmapCanvasLayerOptions>(["CanvasLayer"], "CanvasLayer")

export const CustomLayer = createLayerComponent<AmapCustomLayerOptions>(["CustomLayer"], "CustomLayer")

export const GLCustomLayer = createLayerComponent<AmapLayerBaseOptions>(["GLCustomLayer"], "GLCustomLayer")

export const HeatMap: FC<HeatMapProps> = ({
    ref,
    map,
    AMap,
    dataSet,
    heatMapOptions,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const context = useAmapContext()
    const heatMapRef = useRef<AmapLayerInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = AMap ?? context.AMap
    const pluginLoaded = useAmapLayerPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName: "AMap.HeatMap",
        pluginConstructorName: "HeatMap",
    })
    const currentOptions = mergeAmapLayerOptions(heatMapOptions, restOptions as AmapHeatMapOptions)
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

        heatMapRef.current = heatMap
        setAmapLayerRef(ref, heatMap)
        updateAmapLayer(heatMap, initialOptions)
        heatMap.setDataSet?.(getInitialDataSet() ?? {})
        onLoadAction(heatMap)

        return () => {
            heatMapRef.current = null
            setAmapLayerRef(ref, null)
            removeAmapLayer(currentMap, heatMap, onDestroyAction)
        }
    }, [currentAMap, currentMap, pluginLoaded, ref])

    useStableEffect(() => {
        if (!heatMapRef.current) return

        updateAmapLayer(heatMapRef.current, currentOptions)
    }, [currentOptions])

    useStableEffect(() => heatMapRef.current?.setDataSet?.(dataSet ?? {}), [dataSet])

    useStableEffect(() => {
        if (!heatMapRef.current) return

        return bindAmapLayerEvents(heatMapRef.current, events)
    }, [currentAMap, currentMap, events, pluginLoaded, ref])

    return null
}
