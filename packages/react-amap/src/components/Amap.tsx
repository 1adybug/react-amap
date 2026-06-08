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

import "@amap/amap-jsapi-types"

/** 高德地图 Loader 脚本地址 */
const DEFAULT_LOADER_URL = "https://webapi.amap.com/loader.js"

/** 默认应用标识 */
const DEFAULT_APP_NAME = "react-amap"

/** 默认插件列表 */
const DEFAULT_PLUGINS: string[] = []

/** 默认 Loader 等待时间 */
const DEFAULT_LOADER_TIMEOUT = 15000

/** 地图运行时更新是否立即生效 */
const AMAP_IMMEDIATE_UPDATE = true

/** 可通过 setStatus 同步的地图状态参数 */
const amapMapStatusOptionKeys: (keyof AmapMapStatusOptions)[] = [
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
export const AmapViewMode = {
    TwoDimensional: "2D",
    ThreeDimensional: "3D",
} as const

export type AmapViewMode = (typeof AmapViewMode)[keyof typeof AmapViewMode]

/** 组件加载状态 */
export const AmapStatus = {
    Idle: "idle",
    Loading: "loading",
    Loaded: "loaded",
    Error: "error",
} as const

export type AmapStatus = (typeof AmapStatus)[keyof typeof AmapStatus]

export type AmapLngLat = AMap.Vector2

export type AmapZoomRange = AMap.Vector2

export type AmapColor = NonNullable<AMap.MapOptions["skyColor"]>

export type AmapTouchZoomCenter = boolean | NonNullable<AMap.MapOptions["touchZoomCenter"]>

export type AmapEventHandler = (...args: unknown[]) => void

export type AmapOnMapLoad = (map: AmapMapInstance, AMap: AmapNamespace) => void

export type AmapOnMapError = (error: unknown) => void

export type AmapOnDestroy = (map: AmapMapInstance) => void

export type AmapOnStatusChange = (status: AmapStatus, error?: unknown) => void

/** 地图上下文数据 */
export interface AmapContextValue {
    /** 地图实例 */
    map: AmapMapInstance | null
    /** 高德地图命名空间 */
    AMap: AmapNamespace | null
    /** 地图加载状态 */
    status: AmapStatus
    /** 地图加载错误 */
    error?: unknown
}

/** 类 LngLat 对象 */
export interface AmapLngLatObject {
    /** 经度 */
    lng: number
    /** 纬度 */
    lat: number
    [key: string]: unknown
}

export type AmapLngLatLike = AMap.LngLatLike | AmapLngLatObject

/** 基础地图参数 */
export interface AmapMapBaseOptions {
    /** 地图中心点 */
    center?: AmapLngLatLike
    /** 地图缩放级别 */
    zoom?: AMap.MapOptions["zoom"]
    /** 顺时针旋转角度 */
    rotation?: AMap.MapOptions["rotation"]
    /** 俯仰角度 */
    pitch?: AMap.MapOptions["pitch"]
    /** 视图模式 */
    viewMode?: AMap.MapOptions["viewMode"] | AmapViewMode
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
    touchZoomCenter?: AmapTouchZoomCenter
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
    skyColor?: AmapColor
    /** WebGL 额外参数 */
    WebGLParams?: Record<string, unknown>
}

/** 可运行时同步的地图参数 */
export interface AmapMapRuntimeOptions {
    /** 地图中心点 */
    center?: AmapLngLatLike
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
    touchZoomCenter?: AmapTouchZoomCenter
    /** 默认鼠标样式 */
    defaultCursor?: AMap.MapOptions["defaultCursor"]
    /** 地图样式 */
    mapStyle?: AMap.MapOptions["mapStyle"]
}

/** 地图运行状态参数 */
export interface AmapMapStatusOptions {
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
    touchZoomCenter?: AmapTouchZoomCenter
}

/** 地图初始化参数 */
export interface AmapMapOptions extends AmapMapBaseOptions {
    [key: string]: unknown
}

/** 地图实例 */
export interface AmapMapInstance extends AMap.Map {
    /** 设置中心点 */
    setCenter(center: AmapLngLatLike, immediately?: boolean, duration?: number): void
    /** 设置缩放级别 */
    setZoom(zoom: number, immediately?: boolean, duration?: number): void
    /** 设置缩放级别和中心点 */
    setZoomAndCenter(zoom: number, center: AmapLngLatLike, immediately?: boolean, duration?: number): void
    /** 设置地图图层 */
    setLayers(layers: AMap.MapOptions["layers"] | unknown[]): void
    /** 设置地图运行状态 */
    setStatus(status: AmapMapStatusOptions): void
    /** 添加覆盖物 */
    add(overlays: unknown | unknown[]): void
    /** 移除覆盖物 */
    remove(overlays: unknown | unknown[]): void
    /** 添加图层 */
    addLayer(layer: unknown): void
    /** 移除图层 */
    removeLayer(layer: unknown): void
    /** 绑定事件 */
    on(eventName: string | string[], handler: AmapEventHandler, context?: unknown, once?: boolean): this
    /** 解绑事件 */
    off(eventName: string, handler: AmapEventHandler, context?: unknown): this
    /** 添加控件 */
    addControl(control: unknown): void
    /** 移除控件 */
    removeControl(control: unknown): void
    /** 加载 JSAPI 插件 */
    plugin?: (plugins: string | string[], callback?: () => void) => void
}

/** 高德地图命名空间配置 */
export interface AmapNamespaceConfig {
    /** 应用标识 */
    appname?: string
    [key: string]: unknown
}

export type AmapNamespaceBase = Omit<typeof AMap, "Map" | "getConfig" | "plugin">

/** 高德地图命名空间 */
export interface AmapNamespace {
    /** 地图构造器 */
    Map: new (container: string | HTMLDivElement, options?: AmapMapOptions) => AmapMapInstance
    /** 获取 JSAPI 配置 */
    getConfig?: () => AmapNamespaceConfig
    /** 加载 JSAPI 插件 */
    plugin?: (plugins: string | string[], callback?: () => void) => void
    [key: string]: unknown
}

/** 安全密钥配置 */
export interface AmapSecurityConfig {
    /** 安全密钥 */
    securityJsCode?: string
    /** 安全代理地址 */
    serviceHost?: string
    [key: string]: unknown
}

/** AMapUI 加载配置 */
export interface AmapUiLoaderOptions {
    /** AMapUI 版本 */
    version?: string
    /** AMapUI 插件列表 */
    plugins?: string[]
}

/** Loca 加载配置 */
export interface AmapLocaLoaderOptions {
    /** Loca 版本 */
    version?: string
}

/** JSAPI Loader 参数 */
export interface AmapLoaderOptions {
    /** 高德 Web 端开发者 Key */
    key: string
    /** JSAPI 版本 */
    version: string
    /** 预加载插件列表 */
    plugins?: string[]
    /** AMapUI 加载配置 */
    AMapUI?: AmapUiLoaderOptions
    /** Loca 加载配置 */
    Loca?: AmapLocaLoaderOptions
    /** 安全代理地址 */
    serviceHost?: string
    [key: string]: unknown
}

/** JSAPI Loader 额外参数 */
export interface AmapLoaderExtraOptions {
    /** 高德 Web 端开发者 Key 由 apiKey 统一设置 */
    key?: never
    /** JSAPI 版本由 version 统一设置 */
    version?: never
    /** 预加载插件列表由 plugins 统一设置 */
    plugins?: never
    /** AMapUI 加载配置 */
    AMapUI?: AmapUiLoaderOptions
    /** Loca 加载配置 */
    Loca?: AmapLocaLoaderOptions
    /** 安全代理地址请通过 securityConfig.serviceHost 设置 */
    serviceHost?: never
    [key: string]: unknown
}

/** JSAPI Loader 实例 */
export interface AmapLoader {
    /** 加载 JSAPI */
    load: (options: AmapLoaderOptions) => Promise<AmapNamespace>
}

/** JSAPI Loader 模块结构 */
export interface AmapLoaderModule {
    /** 加载 JSAPI */
    load?: AmapLoader["load"]
    /** CommonJS 默认导出 */
    default?: AmapLoaderModule
}

/** 加载 Loader 脚本参数 */
export interface LoadAmapLoaderParams {
    /** Loader 脚本地址 */
    loaderUrl: string
    /** Loader 等待时间 */
    loaderTimeout: number
}

/** 解析 Loader 模块参数 */
export interface ResolveAmapLoaderModuleParams {
    /** 动态导入到的 Loader 模块 */
    loaderModule: unknown
}

/** 判断是否默认 Loader 地址参数 */
export interface IsDefaultAmapLoaderUrlParams {
    /** Loader 脚本地址 */
    loaderUrl: string
}

/** 配置安全密钥参数 */
export interface ConfigureAmapSecurityParams {
    /** 完整安全配置 */
    securityConfig?: AmapSecurityConfig
}

/** 合并地图初始化参数 */
export interface MergeAmapMapOptionsParams extends AmapMapBaseOptions {
    /** 额外地图初始化参数 */
    mapOptions?: AmapMapOptions
}

/** 同步地图运行时参数 */
export interface SyncAmapMapRuntimeOptionsParams {
    /** 地图实例 */
    map: AmapMapInstance
    /** 当前地图参数 */
    nextOptions: AmapMapRuntimeOptions
    /** 上一次同步的地图参数 */
    previousOptions: AmapMapRuntimeOptions
}

/** 获取变化的地图运行状态参数 */
export interface GetChangedAmapMapStatusOptionsParams {
    /** 当前地图参数 */
    nextOptions: AmapMapRuntimeOptions
    /** 上一次同步的地图参数 */
    previousOptions: AmapMapRuntimeOptions
}

/** 高德地图上下文 */
export const AmapContext = createContext<AmapContextValue>({
    map: null,
    AMap: null,
    status: AmapStatus.Idle,
})

export function useAmapContext() {
    return useContext(AmapContext)
}

declare global {
    interface Window {
        /** JSAPI Loader 全局实例 */
        AMapLoader?: AmapLoader
        /** 高德地图安全配置 */
        _AMapSecurityConfig?: AmapSecurityConfig
    }
}

/** 地图组件属性 */
export interface AmapProps extends Omit<ComponentProps<"div">, "ref">, AmapMapBaseOptions {
    /** 地图实例 ref */
    ref?: Ref<AmapMapInstance | null>
    /** 高德 Web 端开发者 Key */
    apiKey: string
    /** 地图容器 ref */
    containerRef?: Ref<HTMLDivElement | null>
    /** 地图子组件 */
    children?: ReactNode
    /** 完整安全配置 */
    securityConfig?: AmapSecurityConfig
    /** JSAPI 版本 */
    version?: string
    /** 预加载插件列表 */
    plugins?: string[]
    /** Loader 脚本地址 */
    loaderUrl?: string
    /** Loader 额外参数 */
    loaderOptions?: AmapLoaderExtraOptions
    /** Loader 等待时间 */
    loaderTimeout?: number
    /** 应用标识 */
    appName?: string
    /** 额外地图初始化参数 */
    mapOptions?: AmapMapOptions
    /** 地图加载完成回调 */
    onMapLoad?: AmapOnMapLoad
    /** 地图加载失败回调 */
    onMapError?: AmapOnMapError
    /** 地图销毁前回调 */
    onDestroy?: AmapOnDestroy
    /** 加载状态变化回调 */
    onStatusChange?: AmapOnStatusChange
}

// 缓存官方 npm Loader 的动态导入，避免 SSR 场景在模块顶层访问 window。
let officialLoaderPromise: Promise<AmapLoader> | undefined

// 缓存同一个自定义 Loader 地址的加载 Promise，避免多个地图重复插入脚本。
const customLoaderPromises = new Map<string, Promise<AmapLoader>>()

function resolveAmapLoaderModule({ loaderModule }: ResolveAmapLoaderModuleParams) {
    const moduleRecord = loaderModule as AmapLoaderModule
    const loader = moduleRecord.load ? moduleRecord : moduleRecord.default

    if (!loader?.load) throw new Error("AMap npm loader loaded, but load is unavailable.")

    return {
        load: loader.load,
    }
}

function loadOfficialAmapLoader() {
    if (window.AMapLoader) return Promise.resolve(window.AMapLoader)

    officialLoaderPromise ??= import("@amap/amap-jsapi-loader")
        .then(loaderModule =>
            resolveAmapLoaderModule({
                loaderModule,
            }))
        .catch(caughtError => {
            officialLoaderPromise = undefined

            throw caughtError
        })

    return officialLoaderPromise
}

function isDefaultAmapLoaderUrl({ loaderUrl }: IsDefaultAmapLoaderUrlParams) {
    return new URL(loaderUrl, document.baseURI).href === new URL(DEFAULT_LOADER_URL, document.baseURI).href
}

function getAmapLoaderScript(loaderUrl: string) {
    const normalizedLoaderUrl = new URL(loaderUrl, document.baseURI).href

    return Array.from(document.scripts).find(script => script.src === normalizedLoaderUrl || script.getAttribute("src") === loaderUrl)
}

function loadCustomAmapLoader({ loaderUrl, loaderTimeout }: LoadAmapLoaderParams) {
    if (window.AMapLoader) return Promise.resolve(window.AMapLoader)

    const cachedPromise = customLoaderPromises.get(loaderUrl)

    if (cachedPromise) return cachedPromise

    const promise = new Promise<AmapLoader>((resolve, reject) => {
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

        script = getAmapLoaderScript(loaderUrl) ?? document.createElement("script")
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

function loadAmapLoader({ loaderUrl, loaderTimeout }: LoadAmapLoaderParams) {
    if (typeof window === "undefined" || typeof document === "undefined")
        return Promise.reject(new Error("Amap can only load the AMap JSAPI in a browser environment."))

    if (isDefaultAmapLoaderUrl({ loaderUrl })) return loadOfficialAmapLoader()

    return loadCustomAmapLoader({
        loaderTimeout,
        loaderUrl,
    })
}

function configureAmapSecurity({ securityConfig }: ConfigureAmapSecurityParams) {
    const nextSecurityConfig: AmapSecurityConfig = {
        ...window._AMapSecurityConfig,
        ...securityConfig,
    }

    if (!nextSecurityConfig.securityJsCode && !nextSecurityConfig.serviceHost)
        throw new Error("Amap requires securityJsCode or serviceHost before loading AMap JSAPI v2.0.")

    window._AMapSecurityConfig = nextSecurityConfig

    return nextSecurityConfig
}

function destroyAmapMap(map: AmapMapInstance, onDestroy?: AmapOnDestroy) {
    try {
        onDestroy?.(map)
    } finally {
        map.destroy()
    }
}

function setAmapMapRef(ref: Ref<AmapMapInstance | null> | undefined, map: AmapMapInstance | null) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(map)
        return
    }

    ref.current = map
}

function setAmapContainerRef(ref: Ref<HTMLDivElement | null> | undefined, element: HTMLDivElement | null) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(element)
        return
    }

    ref.current = element
}

function mergeAmapMapOptions({ mapOptions, ...topLevelMapOptions }: MergeAmapMapOptionsParams) {
    const nextMapOptions: AmapMapOptions = {
        ...mapOptions,
    }

    Object.entries(topLevelMapOptions).forEach(([key, value]) => {
        if (value !== undefined) nextMapOptions[key] = value
    })

    return nextMapOptions
}

function isAmapLngLatObject(value: unknown): value is AmapLngLatObject {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false

    const valueRecord = value as Partial<AmapLngLatObject>

    return typeof valueRecord.lng === "number" && typeof valueRecord.lat === "number"
}

function isEqualAmapMapValue(leftValue: unknown, rightValue: unknown): boolean {
    if (Object.is(leftValue, rightValue)) return true

    if (Array.isArray(leftValue) && Array.isArray(rightValue)) {
        if (leftValue.length !== rightValue.length) return false

        return leftValue.every((item, index) => isEqualAmapMapValue(item, rightValue[index]))
    }

    if (isAmapLngLatObject(leftValue) && isAmapLngLatObject(rightValue))
        return Object.is(leftValue.lng, rightValue.lng) && Object.is(leftValue.lat, rightValue.lat)

    return false
}

function getChangedAmapMapStatusOptions({ nextOptions, previousOptions }: GetChangedAmapMapStatusOptionsParams) {
    const statusOptions: AmapMapStatusOptions = {}

    amapMapStatusOptionKeys.forEach(optionKey => {
        const nextValue = nextOptions[optionKey]
        const previousValue = previousOptions[optionKey]

        if (nextValue === undefined || isEqualAmapMapValue(nextValue, previousValue)) return

        Object.assign(statusOptions, {
            [optionKey]: nextValue,
        })
    })

    return statusOptions
}

function syncAmapMapRuntimeOptions({ map, nextOptions, previousOptions }: SyncAmapMapRuntimeOptionsParams) {
    const statusOptions = getChangedAmapMapStatusOptions({
        nextOptions,
        previousOptions,
    })

    const centerChanged = nextOptions.center !== undefined && !isEqualAmapMapValue(nextOptions.center, previousOptions.center)
    const zoomChanged = nextOptions.zoom !== undefined && !isEqualAmapMapValue(nextOptions.zoom, previousOptions.zoom)

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

    if (nextOptions.pitch !== undefined && !isEqualAmapMapValue(nextOptions.pitch, previousOptions.pitch))
        map.setPitch?.(nextOptions.pitch, AMAP_IMMEDIATE_UPDATE)

    if (nextOptions.rotation !== undefined && !isEqualAmapMapValue(nextOptions.rotation, previousOptions.rotation))
        map.setRotation?.(nextOptions.rotation, AMAP_IMMEDIATE_UPDATE)

    if (nextOptions.features !== undefined && !isEqualAmapMapValue(nextOptions.features, previousOptions.features)) map.setFeatures?.(nextOptions.features)

    if (nextOptions.layers !== undefined && !isEqualAmapMapValue(nextOptions.layers, previousOptions.layers)) map.setLayers?.(nextOptions.layers)

    if (nextOptions.zooms !== undefined && !isEqualAmapMapValue(nextOptions.zooms, previousOptions.zooms)) map.setZooms?.(nextOptions.zooms)

    if (nextOptions.defaultCursor !== undefined && !isEqualAmapMapValue(nextOptions.defaultCursor, previousOptions.defaultCursor))
        map.setDefaultCursor?.(nextOptions.defaultCursor)

    if (nextOptions.mapStyle !== undefined && !isEqualAmapMapValue(nextOptions.mapStyle, previousOptions.mapStyle)) map.setMapStyle?.(nextOptions.mapStyle)
}

export const Amap: FC<AmapProps> = ({
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
    mapOptions: _mapOptions,
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
    onMapLoad: _onMapLoad,
    onMapError: _onMapError,
    onDestroy: _onDestroy,
    onStatusChange: _onStatusChange,
    ...rest
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<AmapMapInstance | null>(null)
    const previousRuntimeMapOptionsRef = useRef<AmapMapRuntimeOptions>({})

    const [contextValue, setContextValue] = useState<AmapContextValue>({
        map: null,
        AMap: null,
        status: AmapStatus.Idle,
    })

    const currentMapOptions = mergeAmapMapOptions({
        mapOptions: _mapOptions,
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

    const currentRuntimeMapOptions: AmapMapRuntimeOptions = {
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

    currentMapOptions.viewMode ??= AmapViewMode.ThreeDimensional

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
        setAmapContainerRef(_containerRef, element)
    }

    useEffect(() => {
        setAmapMapRef(ref, mapRef.current)

        return () => setAmapMapRef(ref, null)
    }, [ref])

    useStableEffect(() => {
        let disposed = false

        async function initMap() {
            try {
                if (!apiKey) throw new Error("Amap requires apiKey.")

                setContextValue({
                    map: null,
                    AMap: null,
                    status: AmapStatus.Loading,
                })

                getOnStatusChange()?.(AmapStatus.Loading)

                const nextSecurityConfig = configureAmapSecurity({
                    securityConfig,
                })

                const loader = await loadAmapLoader({
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
                setAmapMapRef(getMapRef(), map)
                previousRuntimeMapOptionsRef.current = getRuntimeMapOptions()

                setContextValue({
                    map,
                    AMap,
                    status: AmapStatus.Loaded,
                })

                getOnStatusChange()?.(AmapStatus.Loaded)
                getOnMapLoad()?.(map, AMap)
            } catch (caughtError) {
                if (disposed) return

                setContextValue({
                    map: null,
                    AMap: null,
                    status: AmapStatus.Error,
                    error: caughtError,
                })

                getOnStatusChange()?.(AmapStatus.Error, caughtError)
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
                setAmapMapRef(getMapRef(), null)

                destroyAmapMap(map, getOnDestroy())
            }
        }
    }, [
        WebGLParams,
        _mapOptions,
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

        syncAmapMapRuntimeOptions({
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

    return (
        <AmapContext value={contextValue}>
            <div ref={onContainerRef} id={id} className={className} style={{ ...rootStyle, ...style }} {...rest} />
            {children}
        </AmapContext>
    )
}
