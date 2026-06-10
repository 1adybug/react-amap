import { useMemo } from "react"

import { type MapLngLatLike, type MapNamespace, useMapContext } from "../components/Map"

/** LngLat 实例 */
export interface MapLngLatInstance extends AMap.LngLat {}

/** Bounds 实例 */
export interface MapBoundsInstance extends AMap.Bounds {}

/** 基础类 Pixel 实例 */
export interface MapFoundationPixelInstance extends AMap.Pixel {}

/** Size 实例 */
export interface MapSizeInstance extends AMap.Size {}

/** 基础类命名空间 */
export interface MapFoundationNamespace extends MapNamespace {
    /** LngLat 构造器 */
    LngLat?: new (lng: number, lat: number, noAutofix?: boolean) => MapLngLatInstance
    /** Bounds 构造器 */
    Bounds?: new (southWest: MapLngLatLike, northEast: MapLngLatLike) => MapBoundsInstance
    /** Pixel 构造器 */
    Pixel?: new (x: number, y: number) => MapFoundationPixelInstance
    /** Size 构造器 */
    Size?: new (width: number, height: number) => MapSizeInstance
}

/** 使用基础类参数 */
export interface UseMapFoundationParams {
    /** 高德地图命名空间 */
    AMap?: MapNamespace
}

/** 基础类创建器 */
export interface MapFoundation {
    /** LngLat 构造器 */
    LngLat?: MapFoundationNamespace["LngLat"]
    /** Bounds 构造器 */
    Bounds?: MapFoundationNamespace["Bounds"]
    /** Pixel 构造器 */
    Pixel?: MapFoundationNamespace["Pixel"]
    /** Size 构造器 */
    Size?: MapFoundationNamespace["Size"]
}

export function useMapFoundation({ AMap }: UseMapFoundationParams = {}) {
    const context = useMapContext()
    const currentAMap = (AMap ?? context.AMap) as MapFoundationNamespace | null

    return useMemo<MapFoundation>(
        () => ({
            Bounds: currentAMap?.Bounds,
            LngLat: currentAMap?.LngLat,
            Pixel: currentAMap?.Pixel,
            Size: currentAMap?.Size,
        }),
        [currentAMap]
    )
}