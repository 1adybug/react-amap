import { useMemo } from "react"

import { type AmapLngLatLike, type AmapNamespace, useAmapContext } from "../components/Amap"

/** LngLat 实例 */
export interface AmapLngLatInstance extends AMap.LngLat {}

/** Bounds 实例 */
export interface AmapBoundsInstance extends AMap.Bounds {}

/** 基础类 Pixel 实例 */
export interface AmapFoundationPixelInstance extends AMap.Pixel {}

/** Size 实例 */
export interface AmapSizeInstance extends AMap.Size {}

/** 基础类命名空间 */
export interface AmapFoundationNamespace extends AmapNamespace {
    /** LngLat 构造器 */
    LngLat?: new (lng: number, lat: number, noAutofix?: boolean) => AmapLngLatInstance
    /** Bounds 构造器 */
    Bounds?: new (southWest: AmapLngLatLike, northEast: AmapLngLatLike) => AmapBoundsInstance
    /** Pixel 构造器 */
    Pixel?: new (x: number, y: number) => AmapFoundationPixelInstance
    /** Size 构造器 */
    Size?: new (width: number, height: number) => AmapSizeInstance
}

/** 使用基础类参数 */
export interface UseAmapFoundationParams {
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
}

/** 基础类创建器 */
export interface AmapFoundation {
    /** LngLat 构造器 */
    LngLat?: AmapFoundationNamespace["LngLat"]
    /** Bounds 构造器 */
    Bounds?: AmapFoundationNamespace["Bounds"]
    /** Pixel 构造器 */
    Pixel?: AmapFoundationNamespace["Pixel"]
    /** Size 构造器 */
    Size?: AmapFoundationNamespace["Size"]
}

export function useAmapFoundation({ AMap }: UseAmapFoundationParams = {}) {
    const context = useAmapContext()
    const currentAMap = (AMap ?? context.AMap) as AmapFoundationNamespace | null

    return useMemo<AmapFoundation>(
        () => ({
            Bounds: currentAMap?.Bounds,
            LngLat: currentAMap?.LngLat,
            Pixel: currentAMap?.Pixel,
            Size: currentAMap?.Size,
        }),
        [currentAMap]
    )
}
