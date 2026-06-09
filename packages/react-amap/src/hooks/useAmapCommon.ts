import { useMemo } from "react"

import { type AmapLngLatLike, type AmapNamespace, useAmapContext } from "../components/Amap"

/** 几何工具库 */
export interface AmapGeometryUtil {
    /** 计算两点距离 */
    distance?: (first: AmapLngLatLike, second: AmapLngLatLike) => number
    /** 计算环面积 */
    ringArea?: (ring: AmapLngLatLike[]) => number
    /** 判断环方向 */
    isClockwise?: (ring: AmapLngLatLike[]) => boolean
    /** 判断多边形类型 */
    typePolygon?: (rings: AmapLngLatLike[][]) => unknown
    /** 确保顺时针 */
    makesureClockwise?: (ring: AmapLngLatLike[]) => AmapLngLatLike[]
    /** 确保逆时针 */
    makesureAntiClockwise?: (ring: AmapLngLatLike[]) => AmapLngLatLike[]
    /** 计算线长度 */
    distanceOfLine?: (path: AmapLngLatLike[]) => number
    /** 判断点是否在环内 */
    isPointInRing?: (point: AmapLngLatLike, ring: AmapLngLatLike[]) => boolean
    /** 判断点是否在多边形内 */
    isPointInPolygon?: (point: AmapLngLatLike, polygon: AmapLngLatLike[] | AmapLngLatLike[][]) => boolean
    /** 判断点是否在多多边形内 */
    isPointInPolygons?: (point: AmapLngLatLike, polygons: AmapLngLatLike[][][]) => boolean
    /** 判断点是否在线段上 */
    isPointOnSegment?: (point: AmapLngLatLike, start: AmapLngLatLike, end: AmapLngLatLike) => boolean
    /** 判断点是否在线上 */
    isPointOnLine?: (point: AmapLngLatLike, line: AmapLngLatLike[]) => boolean
    /** 计算线段最近点 */
    closestOnSegment?: (point: AmapLngLatLike, start: AmapLngLatLike, end: AmapLngLatLike) => AmapLngLatLike
    /** 计算点到线段距离 */
    distanceToSegment?: (point: AmapLngLatLike, start: AmapLngLatLike, end: AmapLngLatLike) => number
}

/** DOM 工具库 */
export interface AmapDomUtil {
    /** 获取视口 */
    getViewport?: (element?: HTMLElement) => unknown
    /** 获取视口偏移 */
    getViewportOffset?: (element: HTMLElement) => unknown
    /** 创建元素 */
    create?: (tagName: string, className?: string, container?: HTMLElement) => HTMLElement
    /** 判断类名 */
    hasClass?: (element: HTMLElement, className: string) => boolean
    /** 添加类名 */
    addClass?: (element: HTMLElement, className: string) => void
    /** 设置类名 */
    setClass?: (element: HTMLElement, className: string) => void
    /** 移除类名 */
    removeClass?: (element: HTMLElement, className: string) => void
    /** 移除元素 */
    remove?: (element: HTMLElement) => void
    /** 清空元素 */
    empty?: (element: HTMLElement) => void
    /** 旋转元素 */
    rotate?: (element: HTMLElement, angle: number) => void
    /** 设置样式 */
    setCss?: (element: HTMLElement, css: Record<string, unknown>) => void
    /** 设置透明度 */
    setOpacity?: (element: HTMLElement, opacity: number) => void
}

/** 浏览器能力信息 */
export interface AmapBrowser {
    /** User-Agent */
    ua?: string
    /** 是否移动端 */
    mobile?: boolean
    /** 平台类型 */
    plat?: string
    /** 是否 macOS 设备 */
    mac?: boolean
    /** 是否 Windows 设备 */
    windows?: boolean
    /** 是否 iOS 设备 */
    ios?: boolean
    /** 是否 iPad */
    iPad?: boolean
    /** 是否 iPhone */
    iPhone?: boolean
    /** 是否 Android 设备 */
    android?: boolean
    /** 是否 Android 4 以下系统 */
    android23?: boolean
    /** 是否 Chrome 浏览器 */
    chrome?: boolean
    /** 是否 Firefox 浏览器 */
    firefox?: boolean
    /** 是否 Safari 浏览器 */
    safari?: boolean
    /** 是否微信 */
    wechat?: boolean
    /** 是否 UC 浏览器 */
    uc?: boolean
    /** 是否 QQ 或 QQ 浏览器 */
    qq?: boolean
    /** 是否 IE */
    ie?: boolean
    /** 是否 IE6 */
    ie6?: boolean
    /** 是否 IE7 */
    ie7?: boolean
    /** 是否 IE8 */
    ie8?: boolean
    /** 是否 IE9 */
    ie9?: boolean
    /** 是否 IE10 */
    ie10?: boolean
    /** 是否 IE11 */
    ie11?: boolean
    /** 是否 Edge 浏览器 */
    edge?: boolean
    /** 是否 IE9 以下 */
    ielt9?: boolean
    /** 是否百度浏览器 */
    baidu?: boolean
    /** 是否支持 LocalStorage */
    isLocalStorage?: boolean
    /** 是否支持 Geolocation */
    isGeolocation?: boolean
    /** 是否 WebKit 移动浏览器 */
    mobileWebkit?: boolean
    /** 是否支持 CSS 3D 的 WebKit 移动端浏览器 */
    mobileWebkit3d?: boolean
    /** 是否移动端 Opera 浏览器 */
    mobileOpera?: boolean
    /** 是否高清屏幕 */
    retina?: boolean
    /** 是否触屏 */
    touch?: boolean
    /** 是否 MS Pointer 设备 */
    msPointer?: boolean
    /** 是否 Pointer 设备 */
    pointer?: boolean
    /** 基础渲染方式 */
    baseRender?: string
    /** 是否支持 wasm */
    wasm?: boolean
    /** 是否 WebKit 浏览器 */
    webkit?: boolean
    /** 是否支持 CSS 3D 的 IE 浏览器 */
    ie3d?: boolean
    /** 是否支持 CSS 3D 的 WebKit 浏览器 */
    webkit3d?: boolean
    /** 是否支持 CSS 3D 的 Gecko 浏览器 */
    gecko3d?: boolean
    /** 是否支持 CSS 3D 的 Opera 浏览器 */
    opera3d?: boolean
    /** 是否支持 CSS 3D */
    any3d?: boolean
    /** 是否支持 Canvas */
    isCanvas?: boolean
    /** 是否支持 SVG */
    isSvg?: boolean
    /** 是否支持 VML */
    isVML?: boolean
    /** 是否支持 Web Worker */
    isWorker?: boolean
    /** 是否支持 WebSocket */
    isWebsocket?: boolean
    /** 是否支持 WebGL */
    isWebGL?: boolean
}

/** 通用工具库 */
export interface AmapUtil {
    /** 判断 DOM */
    isDOM?: (value: unknown) => boolean
    /** 颜色名转 Hex */
    colorNameToHex?: (value: string) => string
    /** RGB Hex 转 RGBA */
    rgbHex2Rgba?: (value: string) => string
    /** ARGB Hex 转 RGBA */
    argbHex2Rgba?: (value: string) => string
    /** 判断空值 */
    isEmpty?: (value: unknown) => boolean
    /** 从数组删除项 */
    deleteItemFromArray?: <T>(array: T[], item: T) => T[]
    /** 按索引删除数组项 */
    deleteItemFromArrayByIndex?: <T>(array: T[], index: number) => T[]
    /** 获取索引 */
    indexOf?: <T>(array: T[], item: T) => number
    /** 格式化字符串 */
    format?: (template: string, data: Record<string, unknown>) => string
    /** 判断数组 */
    isArray?: (value: unknown) => value is unknown[]
    /** 判断包含 */
    includes?: <T>(array: T[], item: T) => boolean
    /** 空闲回调 */
    requestIdleCallback?: (callback: IdleRequestCallback) => number
    /** 取消空闲回调 */
    cancelIdleCallback?: (id: number) => void
    /** 动画帧 */
    requestAnimFrame?: (callback: FrameRequestCallback) => number
    /** 取消动画帧 */
    cancelAnimFrame?: (id: number) => void
}

/** 通用库命名空间 */
export interface AmapCommonNamespace extends AmapNamespace {
    /** 几何工具库 */
    GeometryUtil?: AmapGeometryUtil
    /** DOM 工具库 */
    DomUtil?: AmapDomUtil
    /** 浏览器能力 */
    Browser?: AmapBrowser
    /** 通用工具库 */
    Util?: AmapUtil
}

/** 使用通用库参数 */
export interface UseAmapCommonParams {
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
}

/** 通用库集合 */
export interface AmapCommon {
    /** 几何工具库 */
    GeometryUtil?: AmapGeometryUtil
    /** DOM 工具库 */
    DomUtil?: AmapDomUtil
    /** 浏览器能力 */
    Browser?: AmapBrowser
    /** 通用工具库 */
    Util?: AmapUtil
}

export function useAmapCommon({ AMap }: UseAmapCommonParams = {}) {
    const context = useAmapContext()
    const currentAMap = (AMap ?? context.AMap) as AmapCommonNamespace | null

    return useMemo<AmapCommon>(
        () => ({
            Browser: currentAMap?.Browser,
            DomUtil: currentAMap?.DomUtil,
            GeometryUtil: currentAMap?.GeometryUtil,
            Util: currentAMap?.Util,
        }),
        [currentAMap]
    )
}

export function useAmapGeometryUtil(params?: UseAmapCommonParams) {
    return useAmapCommon(params).GeometryUtil
}

export function useAmapDomUtil(params?: UseAmapCommonParams) {
    return useAmapCommon(params).DomUtil
}

export function useAmapBrowser(params?: UseAmapCommonParams) {
    return useAmapCommon(params).Browser
}

export function useAmapUtil(params?: UseAmapCommonParams) {
    return useAmapCommon(params).Util
}
