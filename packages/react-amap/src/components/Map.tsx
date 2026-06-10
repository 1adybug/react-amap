import {
    type ComponentProps,
    type CSSProperties,
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

import { useStableEffect } from "../hooks/useStableEffect"
import {
    type MapInstanceEventShortcuts,
    type MapInstanceEvents,
    type MapInstanceInteractionEvent as MapInstanceInteractionEventBase,
    type MapInstanceMouseEvent as MapInstanceMouseEventBase,
    type MapTargetEvent,
    getMapEventEntries,
    mergeMapEvents,
} from "../utils/mapEvents"

import "@amap/amap-jsapi-types"

/** 高德地图 Loader 脚本地址 */
const DEFAULT_LOADER_URL = "https://webapi.amap.com/loader.js"

/** 默认应用标识 */
const DEFAULT_APP_NAME = "react-amap"

/** 默认 Loader 等待时间 */
const DEFAULT_LOADER_TIMEOUT = 15000

/** 地图运行时更新是否立即生效 */
const AMAP_IMMEDIATE_UPDATE = true

/** 可通过 setStatus 同步的地图状态参数 */
const amapMapStatusOptionKeys: (keyof MapStatusOptions)[] = [
    "dragEnable",
    "zoomEnable",
    "jogEnable",
    "pitchEnable",
    "rotateEnable",
    "animateEnable",
    "keyboardEnable",
    "doubleClickZoom",
    "scrollWheel",
    "touchZoom",
    "touchZoomCenter",
]

/** 地图容器默认样式 */
const rootStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
}

/** 地图视图模式 */
export const MapViewMode = {
    TwoDimensional: "2D",
    ThreeDimensional: "3D",
} as const

export type MapViewMode = (typeof MapViewMode)[keyof typeof MapViewMode]

/** 组件加载状态 */
export const MapStatus = {
    Idle: "idle",
    Loading: "loading",
    Loaded: "loaded",
    Error: "error",
} as const

export type MapStatus = (typeof MapStatus)[keyof typeof MapStatus]

/** 高德 JSAPI 插件 */
export const MapPlugin = {
    Scale: "AMap.Scale",
    ToolBar: "AMap.ToolBar",
    ControlBar: "AMap.ControlBar",
    MapType: "AMap.MapType",
    HawkEye: "AMap.HawkEye",
    Geocoder: "AMap.Geocoder",
    AutoComplete: "AMap.AutoComplete",
    PlaceSearch: "AMap.PlaceSearch",
    CloudDataSearch: "AMap.CloudDataSearch",
    Driving: "AMap.Driving",
    TruckDriving: "AMap.TruckDriving",
    Walking: "AMap.Walking",
    Transfer: "AMap.Transfer",
    Riding: "AMap.Riding",
    DragRoute: "AMap.DragRoute",
    DragRouteTruck: "AMap.DragRouteTruck",
    GraspRoad: "AMap.GraspRoad",
    DistrictSearch: "AMap.DistrictSearch",
    Weather: "AMap.Weather",
    StationSearch: "AMap.StationSearch",
    LineSearch: "AMap.LineSearch",
    Geolocation: "AMap.Geolocation",
    CitySearch: "AMap.CitySearch",
    IndoorMap: "AMap.IndoorMap",
    HeatMap: "AMap.HeatMap",
    ElasticMarker: "AMap.ElasticMarker",
    MarkerCluster: "AMap.MarkerCluster",
    MoveAnimation: "AMap.MoveAnimation",
    MouseTool: "AMap.MouseTool",
    RangingTool: "AMap.RangingTool",
    PolygonEditor: "AMap.PolygonEditor",
    PolylineEditor: "AMap.PolylineEditor",
    PolyEditor: "AMap.PolyEditor",
    CircleEditor: "AMap.CircleEditor",
    BezierCurveEditor: "AMap.BezierCurveEditor",
    EllipseEditor: "AMap.EllipseEditor",
    RectangleEditor: "AMap.RectangleEditor",
} as const

export type MapPlugin = (typeof MapPlugin)[keyof typeof MapPlugin]

/** 默认插件列表 */
const DEFAULT_PLUGINS: MapPlugin[] = []

export type MapLngLat = AMap.Vector2

export type MapZoomRange = AMap.Vector2

export type MapColor = NonNullable<AMap.MapOptions["skyColor"]>

export type MapTouchZoomCenter = boolean | NonNullable<AMap.MapOptions["touchZoomCenter"]>

/** 高德事件处理函数双向兼容辅助类型 */
export interface MapEventHandlerBivariance<TArgs extends unknown[] = unknown[]> {
    bivarianceHack(...args: TArgs): void
}

export type MapEventHandler<TArgs extends unknown[] = unknown[]> = MapEventHandlerBivariance<TArgs>["bivarianceHack"]

export type MapOnMapLoad = (map: MapInstance, AMap: MapNamespace) => void

export type MapOnMapError = (error: unknown) => void

export type MapOnDestroy = (map: MapInstance) => void

export type MapOnStatusChange = (status: MapStatus, error?: unknown) => void

/** 地图鼠标事件 */
export interface MapComponentMouseEvent extends MapInstanceMouseEventBase<MapInstance> {}

/** 地图交互坐标事件 */
export interface MapComponentInteractionEvent extends MapInstanceInteractionEventBase<MapInstance> {}

/** 地图目标事件 */
export interface MapComponentTargetEvent extends MapTargetEvent<MapInstance> {}

/** 地图事件映射 */
export interface MapEvents extends MapInstanceEvents<MapInstance> {}

/** 地图上下文数据 */
export interface MapContextValue {
    /** 地图实例 */
    map: MapInstance | null
    /** 高德地图命名空间 */
    AMap: MapNamespace | null
    /** 地图加载状态 */
    status: MapStatus
    /** 地图加载错误 */
    error?: unknown
}

/** 类 LngLat 对象 */
export interface MapLngLatObject {
    /** 经度 */
    lng: number
    /** 纬度 */
    lat: number
}

export type MapLngLatLike = AMap.LngLatLike | MapLngLatObject

/** 基础地图参数 */
export interface MapBaseOptions {
    /** 地图中心点 */
    center?: MapLngLatLike
    /** 地图缩放级别 */
    zoom?: AMap.MapOptions["zoom"]
    /** 顺时针旋转角度 */
    rotation?: AMap.MapOptions["rotation"]
    /** 俯仰角度 */
    pitch?: AMap.MapOptions["pitch"]
    /** 视图模式 */
    viewMode?: AMap.MapOptions["viewMode"] | MapViewMode
    /** 地图显示元素 */
    features?: AMap.MapOptions["features"]
    /** 初始图层 */
    layers?: AMap.MapOptions["layers"] | unknown[]
    /** 缩放级别范围 */
    zooms?: AMap.MapOptions["zooms"]
    /** 是否允许拖拽 */
    dragEnable?: AMap.MapOptions["dragEnable"]
    /** 是否允许缩放 */
    zoomEnable?: AMap.MapOptions["zoomEnable"]
    /** 是否启用缓动 */
    jogEnable?: AMap.MapOptions["jogEnable"]
    /** 是否允许设置俯仰角度 */
    pitchEnable?: AMap.MapOptions["pitchEnable"]
    /** 是否允许旋转 */
    rotateEnable?: AMap.MapOptions["rotateEnable"]
    /** 是否启用动画 */
    animateEnable?: AMap.MapOptions["animateEnable"]
    /** 是否允许键盘控制 */
    keyboardEnable?: AMap.MapOptions["keyboardEnable"]
    /** 是否允许双击缩放 */
    doubleClickZoom?: AMap.MapOptions["doubleClickZoom"]
    /** 是否允许滚轮缩放 */
    scrollWheel?: AMap.MapOptions["scrollWheel"]
    /** 是否允许触控缩放 */
    touchZoom?: AMap.MapOptions["touchZoom"]
    /** 触控缩放中心点策略 */
    touchZoomCenter?: MapTouchZoomCenter
    /** 是否显示文字和 POI 信息 */
    showLabel?: AMap.MapOptions["showLabel"]
    /** 默认鼠标样式 */
    defaultCursor?: AMap.MapOptions["defaultCursor"]
    /** 是否启用地图热点 */
    isHotspot?: AMap.MapOptions["isHotspot"]
    /** 地图样式 */
    mapStyle?: AMap.MapOptions["mapStyle"]
    /** 是否展示 3D 楼块 */
    showBuildingBlock?: AMap.MapOptions["showBuildingBlock"]
    /** 是否自动展示室内地图 */
    showIndoorMap?: AMap.MapOptions["showIndoorMap"]
    /** 天空颜色 */
    skyColor?: MapColor
    /** WebGL 额外参数 */
    WebGLParams?: Record<string, unknown>
}

/** 可运行时同步的地图参数 */
export interface MapRuntimeOptions {
    /** 地图中心点 */
    center?: MapLngLatLike
    /** 地图缩放级别 */
    zoom?: AMap.MapOptions["zoom"]
    /** 顺时针旋转角度 */
    rotation?: AMap.MapOptions["rotation"]
    /** 俯仰角度 */
    pitch?: AMap.MapOptions["pitch"]
    /** 地图显示元素 */
    features?: AMap.MapOptions["features"]
    /** 当前图层 */
    layers?: AMap.MapOptions["layers"] | unknown[]
    /** 缩放级别范围 */
    zooms?: AMap.MapOptions["zooms"]
    /** 是否允许拖拽 */
    dragEnable?: AMap.MapOptions["dragEnable"]
    /** 是否允许缩放 */
    zoomEnable?: AMap.MapOptions["zoomEnable"]
    /** 是否启用缓动 */
    jogEnable?: AMap.MapOptions["jogEnable"]
    /** 是否允许设置俯仰角度 */
    pitchEnable?: AMap.MapOptions["pitchEnable"]
    /** 是否允许旋转 */
    rotateEnable?: AMap.MapOptions["rotateEnable"]
    /** 是否启用动画 */
    animateEnable?: AMap.MapOptions["animateEnable"]
    /** 是否允许键盘控制 */
    keyboardEnable?: AMap.MapOptions["keyboardEnable"]
    /** 是否允许双击缩放 */
    doubleClickZoom?: AMap.MapOptions["doubleClickZoom"]
    /** 是否允许滚轮缩放 */
    scrollWheel?: AMap.MapOptions["scrollWheel"]
    /** 是否允许触控缩放 */
    touchZoom?: AMap.MapOptions["touchZoom"]
    /** 触控缩放中心点策略 */
    touchZoomCenter?: MapTouchZoomCenter
    /** 默认鼠标样式 */
    defaultCursor?: AMap.MapOptions["defaultCursor"]
    /** 地图样式 */
    mapStyle?: AMap.MapOptions["mapStyle"]
}

/** 地图运行状态参数 */
export interface MapStatusOptions {
    /** 是否允许拖拽 */
    dragEnable?: boolean
    /** 是否允许缩放 */
    zoomEnable?: boolean
    /** 是否启用缓动 */
    jogEnable?: boolean
    /** 是否允许设置俯仰角度 */
    pitchEnable?: boolean
    /** 是否允许旋转 */
    rotateEnable?: boolean
    /** 是否启用动画 */
    animateEnable?: boolean
    /** 是否允许键盘控制 */
    keyboardEnable?: boolean
    /** 是否允许双击缩放 */
    doubleClickZoom?: boolean
    /** 是否允许滚轮缩放 */
    scrollWheel?: boolean
    /** 是否允许触控缩放 */
    touchZoom?: boolean
    /** 触控缩放中心点策略 */
    touchZoomCenter?: MapTouchZoomCenter
}

/** 地图初始化参数 */
export interface MapOptions extends MapBaseOptions {
}

/** 地图实例 */
export interface MapInstance extends AMap.Map {
    /** 设置中心点 */
    setCenter(center: MapLngLatLike, immediately?: boolean, duration?: number): void
    /** 设置缩放级别 */
    setZoom(zoom: number, immediately?: boolean, duration?: number): void
    /** 设置缩放级别和中心点 */
    setZoomAndCenter(zoom: number, center: MapLngLatLike, immediately?: boolean, duration?: number): void
    /** 设置地图图层 */
    setLayers(layers: AMap.MapOptions["layers"] | unknown[]): void
    /** 设置地图运行状态 */
    setStatus(status: MapStatusOptions): void
    /** 添加覆盖物 */
    add(overlays: unknown | unknown[]): void
    /** 移除覆盖物 */
    remove(overlays: unknown | unknown[]): void
    /** 添加图层 */
    addLayer(layer: unknown): void
    /** 移除图层 */
    removeLayer(layer: unknown): void
    /** 绑定事件 */
    on(eventName: string | string[], handler: MapEventHandler, context?: unknown, once?: boolean): this
    /** 解绑事件 */
    off(eventName: string, handler: MapEventHandler, context?: unknown): this
    /** 添加控件 */
    addControl(control: unknown): void
    /** 移除控件 */
    removeControl(control: unknown): void
    /** 加载 JSAPI 插件 */
    plugin?: (plugins: MapPlugin | MapPlugin[], callback?: () => void) => void
}

/** 高德地图命名空间配置 */
export interface MapNamespaceConfig {
    /** 应用标识 */
    appname?: string
}

export type MapNamespaceBase = Omit<typeof AMap, "Map" | "getConfig" | "plugin">

/** 高德地图命名空间 */
export interface MapNamespace {
    /** 地图构造器 */
    Map: new (container: string | HTMLDivElement, options?: MapOptions) => MapInstance
    /** 获取 JSAPI 配置 */
    getConfig?: () => MapNamespaceConfig
    /** 加载 JSAPI 插件 */
    plugin?: (plugins: MapPlugin | MapPlugin[], callback?: () => void) => void
}

/** 安全密钥配置 */
export interface MapSecurityConfig {
    /** 安全密钥 */
    securityJsCode?: string
    /** 安全代理地址 */
    serviceHost?: string
}

/** AMapUI 加载配置 */
export interface MapUiLoaderOptions {
    /** AMapUI 版本 */
    version?: string
    /** AMapUI 插件列表 */
    plugins?: string[]
}

/** Loca 加载配置 */
export interface MapLocaLoaderOptions {
    /** Loca 版本 */
    version?: string
}

/** JSAPI Loader 参数 */
export interface MapLoaderOptions {
    /** 高德 Web 端开发者 Key */
    key: string
    /** JSAPI 版本 */
    version: string
    /** 预加载插件列表 */
    plugins?: MapPlugin[]
    /** AMapUI 加载配置 */
    AMapUI?: MapUiLoaderOptions
    /** Loca 加载配置 */
    Loca?: MapLocaLoaderOptions
    /** 安全代理地址 */
    serviceHost?: string
}

/** JSAPI Loader 额外参数 */
export interface MapLoaderExtraOptions {
    /** 高德 Web 端开发者 Key 由 apiKey 统一设置 */
    key?: never
    /** JSAPI 版本由 version 统一设置 */
    version?: never
    /** 预加载插件列表由 plugins 统一设置 */
    plugins?: never
    /** AMapUI 加载配置 */
    AMapUI?: MapUiLoaderOptions
    /** Loca 加载配置 */
    Loca?: MapLocaLoaderOptions
    /** 安全代理地址请通过 securityConfig.serviceHost 设置 */
    serviceHost?: never
}

/** JSAPI Loader 实例 */
export interface MapLoader {
    /** 加载 JSAPI */
    load: (options: MapLoaderOptions) => Promise<MapNamespace>
}

/** JSAPI Loader 模块结构 */
export interface MapLoaderModule {
    /** 加载 JSAPI */
    load?: MapLoader["load"]
    /** CommonJS 默认导出 */
    default?: MapLoaderModule
}

/** 加载 Loader 脚本参数 */
export interface LoadMapLoaderParams {
    /** Loader 脚本地址 */
    loaderUrl: string
    /** Loader 等待时间 */
    loaderTimeout: number
}

/** 解析 Loader 模块参数 */
export interface ResolveMapLoaderModuleParams {
    /** 动态导入到的 Loader 模块 */
    loaderModule: unknown
}

/** 判断是否默认 Loader 地址参数 */
export interface IsDefaultMapLoaderUrlParams {
    /** Loader 脚本地址 */
    loaderUrl: string
}

/** 配置安全密钥参数 */
export interface ConfigureMapSecurityParams {
    /** 完整安全配置 */
    securityConfig?: MapSecurityConfig
}

/** 合并地图初始化参数 */
export interface MergeMapOptionsParams extends MapBaseOptions {
}

/** 同步地图运行时参数 */
export interface SyncMapRuntimeOptionsParams {
    /** 地图实例 */
    map: MapInstance
    /** 当前地图参数 */
    nextOptions: MapRuntimeOptions
    /** 上一次同步的地图参数 */
    previousOptions: MapRuntimeOptions
}

/** 绑定地图事件参数 */
export interface BindMapInstanceEventsParams {
    /** 地图实例 */
    map: MapInstance
    /** 事件映射 */
    events?: MapEvents
}

/** 获取变化的地图运行状态参数 */
export interface GetChangedMapStatusOptionsParams {
    /** 当前地图参数 */
    nextOptions: MapRuntimeOptions
    /** 上一次同步的地图参数 */
    previousOptions: MapRuntimeOptions
}

/** 高德地图上下文 */
export const MapContext = createContext<MapContextValue>({
    map: null,
    AMap: null,
    status: MapStatus.Idle,
})

export function useMapContext() {
    return useContext(MapContext)
}

declare global {
    interface Window {
        /** JSAPI Loader 全局实例 */
        AMapLoader?: MapLoader
        /** 高德地图安全配置 */
        _AMapSecurityConfig?: MapSecurityConfig
    }
}

/** 地图组件属性 */
export interface MapProps
    extends Omit<ComponentProps<"div">, "ref">,
        MapBaseOptions,
        MapInstanceEventShortcuts<MapInstance> {
    /** 地图实例 ref */
    ref?: Ref<MapInstance | null>
    /** 高德 Web 端开发者 Key */
    apiKey: string
    /** 地图容器 ref */
    containerRef?: Ref<HTMLDivElement | null>
    /** 地图子组件 */
    children?: ReactNode
    /** 完整安全配置 */
    securityConfig?: MapSecurityConfig
    /** JSAPI 版本 */
    version?: string
    /** 预加载插件列表 */
    plugins?: MapPlugin[]
    /** Loader 脚本地址 */
    loaderUrl?: string
    /** Loader 额外参数 */
    loaderOptions?: MapLoaderExtraOptions
    /** Loader 等待时间 */
    loaderTimeout?: number
    /** 应用标识 */
    appName?: string
    /** 地图事件映射 */
    events?: MapEvents
    /** 地图加载完成回调 */
    onMapLoad?: MapOnMapLoad
    /** 地图加载失败回调 */
    onMapError?: MapOnMapError
    /** 地图销毁前回调 */
    onDestroy?: MapOnDestroy
    /** 加载状态变化回调 */
    onStatusChange?: MapOnStatusChange
}

// 缓存官方 npm Loader 的动态导入，避免 SSR 场景在模块顶层访问 window。
let officialLoaderPromise: Promise<MapLoader> | undefined

// 缓存同一个自定义 Loader 地址的加载 Promise，避免多个地图重复插入脚本。
const customLoaderPromises = new globalThis.Map<string, Promise<MapLoader>>()

function resolveMapLoaderModule({ loaderModule }: ResolveMapLoaderModuleParams) {
    const moduleRecord = loaderModule as MapLoaderModule
    const loader = moduleRecord.load ? moduleRecord : moduleRecord.default

    if (!loader?.load) throw new Error("AMap npm loader loaded, but load is unavailable.")

    return {
        load: loader.load,
    }
}

function loadOfficialMapLoader() {
    if (window.AMapLoader) return Promise.resolve(window.AMapLoader)

    officialLoaderPromise ??= import("@amap/amap-jsapi-loader")
        .then(loaderModule =>
            resolveMapLoaderModule({
                loaderModule,
            }))
        .catch(caughtError => {
            officialLoaderPromise = undefined

            throw caughtError
        })

    return officialLoaderPromise
}

function isDefaultMapLoaderUrl({ loaderUrl }: IsDefaultMapLoaderUrlParams) {
    return new URL(loaderUrl, document.baseURI).href === new URL(DEFAULT_LOADER_URL, document.baseURI).href
}

function getMapLoaderScript(loaderUrl: string) {
    const normalizedLoaderUrl = new URL(loaderUrl, document.baseURI).href

    return Array.from(document.scripts).find(script => script.src === normalizedLoaderUrl || script.getAttribute("src") === loaderUrl)
}

function loadCustomMapLoader({ loaderUrl, loaderTimeout }: LoadMapLoaderParams) {
    if (window.AMapLoader) return Promise.resolve(window.AMapLoader)

    const cachedPromise = customLoaderPromises.get(loaderUrl)

    if (cachedPromise) return cachedPromise

    const promise = new Promise<MapLoader>((resolve, reject) => {
        let script: HTMLScriptElement | undefined
        let timeoutId: number | undefined

        function clearPendingTasks() {
            if (timeoutId !== undefined) window.clearTimeout(timeoutId)

            script?.removeEventListener("load", resolveLoader)
            script?.removeEventListener("error", rejectLoader)
        }

        function failLoader(error: Error) {
            clearPendingTasks()
            customLoaderPromises.delete(loaderUrl)
            reject(error)
        }

        function resolveLoader() {
            clearPendingTasks()

            if (window.AMapLoader) {
                resolve(window.AMapLoader)
                return
            }

            failLoader(new Error("AMap loader script loaded, but window.AMapLoader is unavailable."))
        }

        function rejectLoader() {
            failLoader(new Error(`Failed to load AMap loader script: ${loaderUrl}`))
        }

        function onTimeout() {
            failLoader(new Error(`Timed out while loading AMap loader script: ${loaderUrl}`))
        }

        script = getMapLoaderScript(loaderUrl) ?? document.createElement("script")
        script.addEventListener("load", resolveLoader, { once: true })
        script.addEventListener("error", rejectLoader, { once: true })
        timeoutId = window.setTimeout(onTimeout, loaderTimeout)

        if (!script.parentElement) {
            script.async = true
            script.src = loaderUrl
            document.head.appendChild(script)
        }
    })

    customLoaderPromises.set(loaderUrl, promise)

    return promise
}

function loadMapLoader({ loaderUrl, loaderTimeout }: LoadMapLoaderParams) {
    if (typeof window === "undefined" || typeof document === "undefined")
        return Promise.reject(new Error("Map can only load the AMap JSAPI in a browser environment."))

    if (isDefaultMapLoaderUrl({ loaderUrl })) return loadOfficialMapLoader()

    return loadCustomMapLoader({
        loaderTimeout,
        loaderUrl,
    })
}

function configureMapSecurity({ securityConfig }: ConfigureMapSecurityParams) {
    const nextSecurityConfig: MapSecurityConfig = {
        ...window._AMapSecurityConfig,
        ...securityConfig,
    }

    if (!nextSecurityConfig.securityJsCode && !nextSecurityConfig.serviceHost)
        throw new Error("Map requires securityJsCode or serviceHost before loading AMap JSAPI v2.0.")

    window._AMapSecurityConfig = nextSecurityConfig

    return nextSecurityConfig
}

function destroyMap(map: MapInstance, onDestroy?: MapOnDestroy) {
    try {
        onDestroy?.(map)
    } finally {
        map.destroy()
    }
}

function bindMapInstanceEvents({ map, events }: BindMapInstanceEventsParams) {
    const eventEntries = getMapEventEntries(events)

    eventEntries.forEach(({ eventName, handler }) => void map.on?.(eventName, handler))

    return function unbindMapInstanceEvents() {
        eventEntries.forEach(({ eventName, handler }) => void map.off?.(eventName, handler))
    }
}

function setMapRef(ref: Ref<MapInstance | null> | undefined, map: MapInstance | null) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(map)
        return
    }

    ref.current = map
}

function setMapContainerRef(ref: Ref<HTMLDivElement | null> | undefined, element: HTMLDivElement | null) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(element)
        return
    }

    ref.current = element
}

function getDefinedMapOptions(options: MergeMapOptionsParams) {
    const nextMapOptions: MapOptions = {}

    Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) {
            Object.assign(nextMapOptions, {
                [key]: value,
            })
        }
    })

    return nextMapOptions
}

function isMapLngLatObject(value: unknown): value is MapLngLatObject {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false

    const valueRecord = value as Partial<MapLngLatObject>

    return typeof valueRecord.lng === "number" && typeof valueRecord.lat === "number"
}

function isEqualMapValue(leftValue: unknown, rightValue: unknown): boolean {
    if (Object.is(leftValue, rightValue)) return true

    if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
        if (leftValue.length !== rightValue.length) return false

        return leftValue.every((item, index) => isEqualMapValue(item, rightValue[index]))
    }

    if (isMapLngLatObject(leftValue) && isMapLngLatObject(rightValue))
        return Object.is(leftValue.lng, rightValue.lng) && Object.is(leftValue.lat, rightValue.lat)

    return false
}

function getChangedMapStatusOptions({ nextOptions, previousOptions }: GetChangedMapStatusOptionsParams) {
    const statusOptions: MapStatusOptions = {}

    amapMapStatusOptionKeys.forEach(optionKey => {
        const nextValue = nextOptions[optionKey]
        const previousValue = previousOptions[optionKey]

        if (nextValue === undefined || isEqualMapValue(nextValue, previousValue)) return

        Object.assign(statusOptions, {
            [optionKey]: nextValue,
        })
    })

    return statusOptions
}

function syncMapRuntimeOptions({ map, nextOptions, previousOptions }: SyncMapRuntimeOptionsParams) {
    const statusOptions = getChangedMapStatusOptions({
        nextOptions,
        previousOptions,
    })

    const centerChanged = nextOptions.center !== undefined && !isEqualMapValue(nextOptions.center, previousOptions.center)
    const zoomChanged = nextOptions.zoom !== undefined && !isEqualMapValue(nextOptions.zoom, previousOptions.zoom)

    if (Object.keys(statusOptions).length > 0) map.setStatus?.(statusOptions)

    if (centerChanged && zoomChanged && nextOptions.center !== undefined && nextOptions.zoom !== undefined) {
        if (map.setZoomAndCenter) map.setZoomAndCenter(nextOptions.zoom, nextOptions.center, AMAP_IMMEDIATE_UPDATE)
        else {
            map.setZoom?.(nextOptions.zoom, AMAP_IMMEDIATE_UPDATE)
            map.setCenter?.(nextOptions.center, AMAP_IMMEDIATE_UPDATE)
        }
    } else {
        if (zoomChanged && nextOptions.zoom !== undefined) map.setZoom?.(nextOptions.zoom, AMAP_IMMEDIATE_UPDATE)
        if (centerChanged && nextOptions.center !== undefined) map.setCenter?.(nextOptions.center, AMAP_IMMEDIATE_UPDATE)
    }

    if (nextOptions.pitch !== undefined && !isEqualMapValue(nextOptions.pitch, previousOptions.pitch))
        map.setPitch?.(nextOptions.pitch, AMAP_IMMEDIATE_UPDATE)

    if (nextOptions.rotation !== undefined && !isEqualMapValue(nextOptions.rotation, previousOptions.rotation))
        map.setRotation?.(nextOptions.rotation, AMAP_IMMEDIATE_UPDATE)

    if (nextOptions.features !== undefined && !isEqualMapValue(nextOptions.features, previousOptions.features)) map.setFeatures?.(nextOptions.features)

    if (nextOptions.layers !== undefined && !isEqualMapValue(nextOptions.layers, previousOptions.layers)) map.setLayers?.(nextOptions.layers)

    if (nextOptions.zooms !== undefined && !isEqualMapValue(nextOptions.zooms, previousOptions.zooms)) map.setZooms?.(nextOptions.zooms)

    if (nextOptions.defaultCursor !== undefined && !isEqualMapValue(nextOptions.defaultCursor, previousOptions.defaultCursor))
        map.setDefaultCursor?.(nextOptions.defaultCursor)

    if (nextOptions.mapStyle !== undefined && !isEqualMapValue(nextOptions.mapStyle, previousOptions.mapStyle)) map.setMapStyle?.(nextOptions.mapStyle)
}

export const Map: FC<MapProps> = ({
    ref,
    id,
    className,
    style,
    apiKey,
    containerRef: _containerRef,
    securityConfig,
    version = "2.0",
    plugins = DEFAULT_PLUGINS,
    loaderUrl = DEFAULT_LOADER_URL,
    loaderOptions,
    loaderTimeout = DEFAULT_LOADER_TIMEOUT,
    appName = DEFAULT_APP_NAME,
    children,
    center,
    zoom,
    rotation,
    pitch,
    viewMode,
    features,
    layers,
    zooms,
    dragEnable,
    zoomEnable,
    jogEnable,
    pitchEnable,
    rotateEnable,
    animateEnable,
    keyboardEnable,
    doubleClickZoom,
    scrollWheel,
    touchZoom,
    touchZoomCenter,
    showLabel,
    defaultCursor,
    isHotspot,
    mapStyle,
    showBuildingBlock,
    showIndoorMap,
    skyColor,
    WebGLParams,
    events,
    onMapLoad: _onMapLoad,
    onMapError: _onMapError,
    onDestroy: _onDestroy,
    onStatusChange: _onStatusChange,
    onMapClick,
    onMapComplete,
    onMapDblClick,
    onMapDragEnd,
    onMapDragStart,
    onMapDragging,
    onMapMouseDown,
    onMapMouseMove,
    onMapMouseWheel,
    onMapMouseOut,
    onMapMouseOver,
    onMapMouseUp,
    onMapMove,
    onMapMoveEnd,
    onMapMoveStart,
    onMapResize,
    onMapRightClick,
    onMapRotateChange,
    onMapRotateEnd,
    onMapRotateStart,
    onMapTouchEnd,
    onMapTouchMove,
    onMapTouchStart,
    onMapZoomChange,
    onMapZoomEnd,
    onMapZoomStart,
    ...rest
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<MapInstance | null>(null)
    const previousRuntimeMapOptionsRef = useRef<MapRuntimeOptions>({})

    const [contextValue, setContextValue] = useState<MapContextValue>({
        map: null,
        AMap: null,
        status: MapStatus.Idle,
    })

    const currentMapOptions = getDefinedMapOptions({
        center,
        zoom,
        rotation,
        pitch,
        viewMode,
        features,
        layers,
        zooms,
        dragEnable,
        zoomEnable,
        jogEnable,
        pitchEnable,
        rotateEnable,
        animateEnable,
        keyboardEnable,
        doubleClickZoom,
        scrollWheel,
        touchZoom,
        touchZoomCenter,
        showLabel,
        defaultCursor,
        isHotspot,
        mapStyle,
        showBuildingBlock,
        showIndoorMap,
        skyColor,
        WebGLParams,
    })

    const currentRuntimeMapOptions: MapRuntimeOptions = {
        center,
        zoom,
        rotation,
        pitch,
        features,
        layers,
        zooms,
        dragEnable,
        zoomEnable,
        jogEnable,
        pitchEnable,
        rotateEnable,
        animateEnable,
        keyboardEnable,
        doubleClickZoom,
        scrollWheel,
        touchZoom,
        touchZoomCenter,
        defaultCursor,
        mapStyle,
    }

    currentMapOptions.viewMode ??= MapViewMode.ThreeDimensional

    const currentEvents = mergeMapEvents({
        events,
        mapEventShortcuts: {
            onMapClick,
            onMapComplete,
            onMapDblClick,
            onMapDragEnd,
            onMapDragStart,
            onMapDragging,
            onMapMouseDown,
            onMapMouseMove,
            onMapMouseWheel,
            onMapMouseOut,
            onMapMouseOver,
            onMapMouseUp,
            onMapMove,
            onMapMoveEnd,
            onMapMoveStart,
            onMapResize,
            onMapRightClick,
            onMapRotateChange,
            onMapRotateEnd,
            onMapRotateStart,
            onMapTouchEnd,
            onMapTouchMove,
            onMapTouchStart,
            onMapZoomChange,
            onMapZoomEnd,
            onMapZoomStart,
        },
    }) as MapEvents

    const getPlugins = useEffectEvent(() => plugins)
    const getMapOptions = useEffectEvent(() => currentMapOptions)
    const getRuntimeMapOptions = useEffectEvent(() => currentRuntimeMapOptions)
    const getOnMapLoad = useEffectEvent(() => _onMapLoad)
    const getOnMapError = useEffectEvent(() => _onMapError)
    const getOnDestroy = useEffectEvent(() => _onDestroy)
    const getOnStatusChange = useEffectEvent(() => _onStatusChange)
    const getMapRef = useEffectEvent(() => ref)

    function onContainerRef(element: HTMLDivElement | null) {
        containerRef.current = element
        setMapContainerRef(_containerRef, element)
    }

    useEffect(() => {
        setMapRef(ref, mapRef.current)

        return () => setMapRef(ref, null)
    }, [ref])

    useStableEffect(() => {
        let disposed = false

        async function initMap() {
            try {
                if (!apiKey) throw new Error("Map requires apiKey.")

                setContextValue({
                    map: null,
                    AMap: null,
                    status: MapStatus.Loading,
                })

                getOnStatusChange()?.(MapStatus.Loading)

                const nextSecurityConfig = configureMapSecurity({
                    securityConfig,
                })

                const loader = await loadMapLoader({
                    loaderTimeout,
                    loaderUrl,
                })

                const AMap = await loader.load({
                    ...loaderOptions,
                    key: apiKey,
                    version,
                    plugins: getPlugins(),
                    serviceHost: nextSecurityConfig.serviceHost,
                })

                if (disposed || !containerRef.current) return

                const map = new AMap.Map(containerRef.current, getMapOptions())

                mapRef.current = map
                setMapRef(getMapRef(), map)
                previousRuntimeMapOptionsRef.current = getRuntimeMapOptions()

                setContextValue({
                    map,
                    AMap,
                    status: MapStatus.Loaded,
                })

                getOnStatusChange()?.(MapStatus.Loaded)
                getOnMapLoad()?.(map, AMap)
            } catch (caughtError) {
                if (disposed) return

                setContextValue({
                    map: null,
                    AMap: null,
                    status: MapStatus.Error,
                    error: caughtError,
                })

                getOnStatusChange()?.(MapStatus.Error, caughtError)
                getOnMapError()?.(caughtError)
            }
        }

        initMap()

        return () => {
            disposed = true
            previousRuntimeMapOptionsRef.current = {}

            if (mapRef.current) {
                const map = mapRef.current
                mapRef.current = null
                setMapRef(getMapRef(), null)

                destroyMap(map, getOnDestroy())
            }
        }
    }, [
        WebGLParams,
        apiKey,
        isHotspot,
        loaderOptions,
        loaderTimeout,
        loaderUrl,
        plugins,
        securityConfig,
        showBuildingBlock,
        showIndoorMap,
        showLabel,
        skyColor,
        version,
        viewMode,
    ])

    useEffect(() => {
        if (!contextValue.AMap || !appName || !contextValue.AMap.getConfig) return

        contextValue.AMap.getConfig().appname = appName
    }, [appName, contextValue.AMap])

    useStableEffect(() => {
        if (!mapRef.current) return

        const nextRuntimeMapOptions = getRuntimeMapOptions()

        syncMapRuntimeOptions({
            map: mapRef.current,
            nextOptions: nextRuntimeMapOptions,
            previousOptions: previousRuntimeMapOptionsRef.current,
        })

        previousRuntimeMapOptionsRef.current = nextRuntimeMapOptions
    }, [
        animateEnable,
        center,
        contextValue.status,
        defaultCursor,
        doubleClickZoom,
        dragEnable,
        features,
        jogEnable,
        keyboardEnable,
        layers,
        mapStyle,
        pitch,
        pitchEnable,
        rotateEnable,
        rotation,
        scrollWheel,
        touchZoom,
        touchZoomCenter,
        zoom,
        zoomEnable,
        zooms,
    ])

    useStableEffect(() => {
        if (!mapRef.current) return

        return bindMapInstanceEvents({
            map: mapRef.current,
            events: currentEvents,
        })
    }, [contextValue.status, currentEvents])

    return (
        <MapContext value={contextValue}>
            <div ref={onContainerRef} id={id} className={className} style={{ ...rootStyle, ...style }} {...rest} />
            {children}
        </MapContext>
    )
}
