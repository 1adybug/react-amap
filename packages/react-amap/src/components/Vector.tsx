import { type FC, type Ref, useEffectEvent, useRef } from "react"

import {
    type MapEventHandler,
    type MapLngLatLike,
    type MapInstance,
    type MapNamespace,
    useMapContext,
} from "./Map"
import { useOverlayGroupContext } from "./Group"
import { useVectorLayerContext } from "./Layer"
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

export type MapVectorPosition = MapLngLatLike

export type MapVectorPath = MapVectorPosition[]

export type MapPolygonPath = MapVectorPath | MapVectorPath[] | MapVectorPath[][]

export type MapPolylinePath = MapVectorPath | MapVectorPath[]

export type MapBezierCurvePath = number[][] | number[][][]

export type MapEllipseRadius = AMap.Vector2

export type MapBoundsLike = unknown

export type MapVectorOverlayOnLoad<TInstance extends MapVectorOverlayInstance = MapVectorOverlayInstance> = (
    overlay: TInstance
) => void

export type MapVectorOverlayOnDestroy<TInstance extends MapVectorOverlayInstance = MapVectorOverlayInstance> = (
    overlay: TInstance
) => void

/** 矢量覆盖物鼠标事件 */
export interface MapVectorOverlayMouseEvent<TInstance = MapVectorOverlayInstance> extends MapOverlayMouseEvent<TInstance> {}

/** 矢量覆盖物交互坐标事件 */
export interface MapVectorOverlayInteractionEvent<TInstance = MapVectorOverlayInstance>
    extends MapOverlayInteractionEvent<TInstance> {}

/** 矢量覆盖物目标事件 */
export interface MapVectorOverlayTargetEvent<TInstance = MapVectorOverlayInstance> extends MapTargetEvent<TInstance> {}

/** 矢量覆盖物移动动画事件 */
export interface MapVectorOverlayMoveEvent<TInstance = MapVectorOverlayInstance> extends MapMoveEvent<TInstance> {}

/** 矢量覆盖物事件快捷属性 */
export interface MapVectorOverlayEventShortcutProps<TInstance = MapVectorOverlayInstance>
    extends MapOverlayEventShortcutProps<TInstance> {}

/** 矢量覆盖物事件映射 */
export interface MapVectorOverlayEvents<TInstance = MapVectorOverlayInstance>
    extends MapOverlayEventMap<TInstance> {}

/** 矢量覆盖物基础参数 */
export interface MapVectorOverlayBaseOptions {
    /** 是否可见 */
    visible?: boolean
    /** 叠加层级 */
    zIndex?: number
    /** 事件是否冒泡 */
    bubble?: boolean
    /** 鼠标悬停样式 */
    cursor?: string
    /** 线条颜色 */
    strokeColor?: string
    /** 线条透明度 */
    strokeOpacity?: number
    /** 线条宽度 */
    strokeWeight?: number
    /** 线条样式 */
    strokeStyle?: string
    /** 虚线间隔 */
    strokeDasharray?: number[]
    /** 是否可拖拽 */
    draggable?: boolean
    /** 自定义数据 */
    extData?: unknown
}

/** 面状矢量覆盖物参数 */
export interface MapAreaOverlayBaseOptions extends MapVectorOverlayBaseOptions {
    /** 填充颜色 */
    fillColor?: string
    /** 填充透明度 */
    fillOpacity?: number
}

/** 线状矢量覆盖物参数 */
export interface MapLineOverlayBaseOptions extends MapVectorOverlayBaseOptions {
    /** 是否显示描边 */
    isOutline?: boolean
    /** 描边颜色 */
    outlineColor?: string
    /** 描边宽度 */
    borderWeight?: number
    /** 折线拐点样式 */
    lineJoin?: string
    /** 折线端点样式 */
    lineCap?: string
    /** 是否绘制大地线 */
    geodesic?: boolean
    /** 是否显示方向箭头 */
    showDir?: boolean
    /** 是否启用纹理动画 */
    animate?: boolean
    /** 纹理流动速度 */
    speed?: number
}

/** 多边形基础参数 */
export interface MapPolygonBaseOptions extends MapAreaOverlayBaseOptions {
    /** 多边形路径 */
    path?: MapPolygonPath
    /** 拉伸高度 */
    extrusionHeight?: number
    /** 拉伸墙面颜色 */
    wallColor?: string | string[]
    /** 拉伸顶面颜色 */
    roofColor?: string | string[]
}

/** 多边形构造参数 */
export interface MapPolygonOptions extends MapPolygonBaseOptions {
}

/** 折线基础参数 */
export interface MapPolylineBaseOptions extends MapLineOverlayBaseOptions {
    /** 折线路径 */
    path?: MapPolylinePath
}

/** 折线构造参数 */
export interface MapPolylineOptions extends MapPolylineBaseOptions {
}

/** 贝塞尔曲线基础参数 */
export interface MapBezierCurveBaseOptions extends MapLineOverlayBaseOptions {
    /** 贝塞尔曲线路径 */
    path?: MapBezierCurvePath
}

/** 贝塞尔曲线构造参数 */
export interface MapBezierCurveOptions extends MapBezierCurveBaseOptions {
}

/** 圆形基础参数 */
export interface MapCircleBaseOptions extends MapAreaOverlayBaseOptions {
    /** 圆心坐标 */
    center?: MapVectorPosition
    /** 半径，单位：米 */
    radius?: number
}

/** 圆形构造参数 */
export interface MapCircleOptions extends MapCircleBaseOptions {
}

/** 圆点标记基础参数 */
export interface MapCircleMarkerBaseOptions extends MapAreaOverlayBaseOptions {
    /** 圆心坐标 */
    center?: MapVectorPosition
    /** 半径，单位：像素 */
    radius?: number
}

/** 圆点标记构造参数 */
export interface MapCircleMarkerOptions extends MapCircleMarkerBaseOptions {
}

/** 椭圆基础参数 */
export interface MapEllipseBaseOptions extends MapAreaOverlayBaseOptions {
    /** 圆心坐标 */
    center?: MapVectorPosition
    /** 横向和纵向半径，单位：米 */
    radius?: MapEllipseRadius
}

/** 椭圆构造参数 */
export interface MapEllipseOptions extends MapEllipseBaseOptions {
}

/** 矩形基础参数 */
export interface MapRectangleBaseOptions extends MapAreaOverlayBaseOptions {
    /** 矩形范围 */
    bounds?: MapBoundsLike
}

/** 矩形构造参数 */
export interface MapRectangleOptions extends MapRectangleBaseOptions {
}

/** GeoJSON 基础参数 */
export interface MapGeoJSONBaseOptions extends MapVectorOverlayBaseOptions {
    /** 标准 GeoJSON 数据 */
    geoJSON?: Record<string, unknown>
    /** 点要素绘制方法 */
    getMarker?: (geojson: Record<string, unknown>, lnglat: MapVectorPosition) => unknown
    /** 线要素绘制方法 */
    getPolyline?: (geojson: Record<string, unknown>, lnglat: MapPolylinePath) => unknown
    /** 面要素绘制方法 */
    getPolygon?: (geojson: Record<string, unknown>, lnglat: MapPolygonPath) => unknown
}

/** GeoJSON 构造参数 */
export interface MapGeoJSONOptions extends MapGeoJSONBaseOptions {
}

/** 矢量覆盖物实例 */
export interface MapVectorOverlayInstance {}

/** 矢量覆盖物运行时能力 */
export interface MapVectorOverlayRuntime {
    /** 获取地图实例 */
    getMap?: () => MapInstance | null
    /** 设置地图实例 */
    setMap?: (map: MapInstance | null) => void
    /** 销毁覆盖物 */
    destroy?: () => void
    /** 显示覆盖物 */
    show?: () => void
    /** 隐藏覆盖物 */
    hide?: () => void
    /** 绑定事件 */
    on?: (eventName: string | string[], handler: MapEventHandler, context?: unknown, once?: boolean) => unknown
    /** 解绑事件 */
    off?: (eventName: string, handler: MapEventHandler, context?: unknown) => unknown
    /** 设置覆盖物参数 */
    setOptions?: (options: MapVectorOverlayBaseOptions) => void
    /** 获取覆盖物参数 */
    getOptions?: () => MapVectorOverlayBaseOptions
    /** 设置自定义数据 */
    setExtData?: (extData: unknown) => void
    /** 获取自定义数据 */
    getExtData?: () => unknown
    /** 获取覆盖物范围 */
    getBounds?: () => unknown
    /** 判断坐标是否在覆盖物内 */
    contains?: (point: MapVectorPosition) => boolean
}

/** 矩形覆盖物运行时能力 */
export interface MapRectangleRuntime {
    /** 设置矩形范围 */
    setBounds?: (bounds: MapBoundsLike) => void
}

/** GeoJSON 覆盖物运行时能力 */
export interface MapGeoJSONRuntime {
    /** 加载 GeoJSON 数据 */
    importData?: (geoJSON: Record<string, unknown>) => void
}

/** 高德多边形实例 */
export interface MapPolygonInstance extends AMap.Polygon {}

/** 高德折线实例 */
export interface MapPolylineInstance extends AMap.Polyline {}

/** 高德贝塞尔曲线实例 */
export interface MapBezierCurveInstance extends AMap.BezierCurve {}

/** 高德圆形实例 */
export interface MapCircleInstance extends AMap.Circle {}

/** 高德圆点标记实例 */
export interface MapCircleMarkerInstance extends AMap.CircleMarker {}

/** 高德椭圆实例 */
export interface MapEllipseInstance extends AMap.Ellipse {}

/** 高德矩形实例 */
export interface MapRectangleInstance extends AMap.Rectangle {}

/** 高德 GeoJSON 实例 */
export interface MapGeoJSONInstance extends MapVectorOverlayInstance {
    /** 加载 GeoJSON 数据 */
    importData?: (geoJSON: Record<string, unknown>) => void
    /** 导出 GeoJSON 数据 */
    toGeoJSON?: () => Record<string, unknown>
}

/** 多边形鼠标事件 */
export interface MapPolygonMouseEvent extends MapVectorOverlayMouseEvent<MapPolygonInstance> {}

/** 多边形交互坐标事件 */
export interface MapPolygonInteractionEvent extends MapVectorOverlayInteractionEvent<MapPolygonInstance> {}

/** 多边形目标事件 */
export interface MapPolygonTargetEvent extends MapVectorOverlayTargetEvent<MapPolygonInstance> {}

/** 多边形移动动画事件 */
export interface MapPolygonMoveEvent extends MapVectorOverlayMoveEvent<MapPolygonInstance> {}

/** 多边形事件快捷属性 */
export interface MapPolygonEventShortcutProps extends MapVectorOverlayEventShortcutProps<MapPolygonInstance> {}

/** 折线鼠标事件 */
export interface MapPolylineMouseEvent extends MapVectorOverlayMouseEvent<MapPolylineInstance> {}

/** 折线交互坐标事件 */
export interface MapPolylineInteractionEvent extends MapVectorOverlayInteractionEvent<MapPolylineInstance> {}

/** 折线目标事件 */
export interface MapPolylineTargetEvent extends MapVectorOverlayTargetEvent<MapPolylineInstance> {}

/** 折线移动动画事件 */
export interface MapPolylineMoveEvent extends MapVectorOverlayMoveEvent<MapPolylineInstance> {}

/** 折线事件快捷属性 */
export interface MapPolylineEventShortcutProps extends MapVectorOverlayEventShortcutProps<MapPolylineInstance> {}

/** 贝塞尔曲线鼠标事件 */
export interface MapBezierCurveMouseEvent extends MapVectorOverlayMouseEvent<MapBezierCurveInstance> {}

/** 贝塞尔曲线交互坐标事件 */
export interface MapBezierCurveInteractionEvent extends MapVectorOverlayInteractionEvent<MapBezierCurveInstance> {}

/** 贝塞尔曲线目标事件 */
export interface MapBezierCurveTargetEvent extends MapVectorOverlayTargetEvent<MapBezierCurveInstance> {}

/** 贝塞尔曲线移动动画事件 */
export interface MapBezierCurveMoveEvent extends MapVectorOverlayMoveEvent<MapBezierCurveInstance> {}

/** 贝塞尔曲线事件快捷属性 */
export interface MapBezierCurveEventShortcutProps extends MapVectorOverlayEventShortcutProps<MapBezierCurveInstance> {}

/** 圆形鼠标事件 */
export interface MapCircleMouseEvent extends MapVectorOverlayMouseEvent<MapCircleInstance> {}

/** 圆形交互坐标事件 */
export interface MapCircleInteractionEvent extends MapVectorOverlayInteractionEvent<MapCircleInstance> {}

/** 圆形目标事件 */
export interface MapCircleTargetEvent extends MapVectorOverlayTargetEvent<MapCircleInstance> {}

/** 圆形移动动画事件 */
export interface MapCircleMoveEvent extends MapVectorOverlayMoveEvent<MapCircleInstance> {}

/** 圆形事件快捷属性 */
export interface MapCircleEventShortcutProps extends MapVectorOverlayEventShortcutProps<MapCircleInstance> {}

/** 圆点标记鼠标事件 */
export interface MapCircleMarkerMouseEvent extends MapVectorOverlayMouseEvent<MapCircleMarkerInstance> {}

/** 圆点标记交互坐标事件 */
export interface MapCircleMarkerInteractionEvent extends MapVectorOverlayInteractionEvent<MapCircleMarkerInstance> {}

/** 圆点标记目标事件 */
export interface MapCircleMarkerTargetEvent extends MapVectorOverlayTargetEvent<MapCircleMarkerInstance> {}

/** 圆点标记移动动画事件 */
export interface MapCircleMarkerMoveEvent extends MapVectorOverlayMoveEvent<MapCircleMarkerInstance> {}

/** 圆点标记事件快捷属性 */
export interface MapCircleMarkerEventShortcutProps extends MapVectorOverlayEventShortcutProps<MapCircleMarkerInstance> {}

/** 椭圆鼠标事件 */
export interface MapEllipseMouseEvent extends MapVectorOverlayMouseEvent<MapEllipseInstance> {}

/** 椭圆交互坐标事件 */
export interface MapEllipseInteractionEvent extends MapVectorOverlayInteractionEvent<MapEllipseInstance> {}

/** 椭圆目标事件 */
export interface MapEllipseTargetEvent extends MapVectorOverlayTargetEvent<MapEllipseInstance> {}

/** 椭圆移动动画事件 */
export interface MapEllipseMoveEvent extends MapVectorOverlayMoveEvent<MapEllipseInstance> {}

/** 椭圆事件快捷属性 */
export interface MapEllipseEventShortcutProps extends MapVectorOverlayEventShortcutProps<MapEllipseInstance> {}

/** 矩形鼠标事件 */
export interface MapRectangleMouseEvent extends MapVectorOverlayMouseEvent<MapRectangleInstance> {}

/** 矩形交互坐标事件 */
export interface MapRectangleInteractionEvent extends MapVectorOverlayInteractionEvent<MapRectangleInstance> {}

/** 矩形目标事件 */
export interface MapRectangleTargetEvent extends MapVectorOverlayTargetEvent<MapRectangleInstance> {}

/** 矩形移动动画事件 */
export interface MapRectangleMoveEvent extends MapVectorOverlayMoveEvent<MapRectangleInstance> {}

/** 矩形事件快捷属性 */
export interface MapRectangleEventShortcutProps extends MapVectorOverlayEventShortcutProps<MapRectangleInstance> {}

/** GeoJSON 鼠标事件 */
export interface MapGeoJSONMouseEvent extends MapVectorOverlayMouseEvent<MapGeoJSONInstance> {}

/** GeoJSON 交互坐标事件 */
export interface MapGeoJSONInteractionEvent extends MapVectorOverlayInteractionEvent<MapGeoJSONInstance> {}

/** GeoJSON 目标事件 */
export interface MapGeoJSONTargetEvent extends MapVectorOverlayTargetEvent<MapGeoJSONInstance> {}

/** GeoJSON 移动动画事件 */
export interface MapGeoJSONMoveEvent extends MapVectorOverlayMoveEvent<MapGeoJSONInstance> {}

/** GeoJSON 事件快捷属性 */
export interface MapGeoJSONEventShortcutProps extends MapVectorOverlayEventShortcutProps<MapGeoJSONInstance> {}

/** 矢量覆盖物构造器 */
export interface MapVectorOverlayConstructor<
    TInstance extends MapVectorOverlayInstance,
    TOptions extends MapVectorOverlayBaseOptions,
> {
    new (options?: TOptions): TInstance
}

/** 支持矢量覆盖物构造器的高德命名空间 */
export interface MapVectorNamespace extends MapNamespace {
    /** Polygon 构造器 */
    Polygon?: new (options?: MapPolygonOptions) => MapPolygonInstance
    /** Polyline 构造器 */
    Polyline?: new (options?: MapPolylineOptions) => MapPolylineInstance
    /** BezierCurve 构造器 */
    BezierCurve?: new (options?: MapBezierCurveOptions) => MapBezierCurveInstance
    /** Circle 构造器 */
    Circle?: new (options?: MapCircleOptions) => MapCircleInstance
    /** CircleMarker 构造器 */
    CircleMarker?: new (options?: MapCircleMarkerOptions) => MapCircleMarkerInstance
    /** Ellipse 构造器 */
    Ellipse?: new (options?: MapEllipseOptions) => MapEllipseInstance
    /** Rectangle 构造器 */
    Rectangle?: new (options?: MapRectangleOptions) => MapRectangleInstance
    /** GeoJSON 构造器 */
    GeoJSON?: new (options?: MapGeoJSONOptions) => MapGeoJSONInstance
}

/** 合并矢量覆盖物参数 */
export interface MergeMapVectorOverlayOptionsParams<TOptions extends MapVectorOverlayBaseOptions> {
    /** 额外构造参数 */
    overlayOptions?: TOptions
    /** 透传构造参数 */
    extraOptions?: TOptions
}

/** 设置矢量覆盖物 ref 参数 */
export interface SetMapVectorOverlayRefParams<TInstance extends MapVectorOverlayInstance> {
    /** 外部 ref */
    ref?: Ref<TInstance | null>
    /** 覆盖物实例 */
    overlay: TInstance | null
}

/** 获取矢量覆盖物构造器参数 */
export interface GetMapVectorOverlayConstructorParams {
    /** 高德地图命名空间 */
    AMap: MapNamespace
    /** 构造器名称 */
    constructorName: string
}

/** 绑定矢量覆盖物事件参数 */
export interface BindMapVectorOverlayEventsParams<TInstance extends MapVectorOverlayInstance> {
    /** 覆盖物实例 */
    overlay: TInstance
    /** 事件映射 */
    events?: MapVectorOverlayEvents
}

/** 移除矢量覆盖物参数 */
export interface RemoveMapVectorOverlayParams<TInstance extends MapVectorOverlayInstance> {
    /** 地图实例 */
    map: MapInstance
    /** 覆盖物实例 */
    overlay: TInstance
    /** 销毁前回调 */
    onDestroy?: MapVectorOverlayOnDestroy<TInstance>
}

/** 更新矢量覆盖物参数 */
export interface UpdateMapVectorOverlayParams<
    TInstance extends MapVectorOverlayInstance,
    TOptions extends MapVectorOverlayBaseOptions,
> {
    /** 覆盖物实例 */
    overlay: TInstance
    /** 覆盖物参数 */
    options: TOptions
}

/** 内部矢量覆盖物组件属性 */
export interface MapVectorOverlayProps<
    TInstance extends MapVectorOverlayInstance,
    TOptions extends MapVectorOverlayBaseOptions,
> extends MapVectorOverlayEventShortcutProps<TInstance> {
    /** 覆盖物实例 ref */
    ref?: Ref<TInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 构造器名称 */
    constructorName: string
    /** 覆盖物参数 */
    options: TOptions
    /** 覆盖物事件映射 */
    events?: MapVectorOverlayEvents<TInstance>
    /** 覆盖物创建完成回调 */
    onLoad?: MapVectorOverlayOnLoad<TInstance>
    /** 覆盖物销毁前回调 */
    onDestroy?: MapVectorOverlayOnDestroy<TInstance>
}

/** 多边形组件属性 */
export interface PolygonProps extends MapPolygonBaseOptions, MapPolygonEventShortcutProps {
    /** 多边形实例 ref */
    ref?: Ref<MapPolygonInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 多边形额外参数 */
    polygonOptions?: MapPolygonOptions
    /** 多边形事件映射 */
    events?: MapVectorOverlayEvents<MapPolygonInstance>
    /** 多边形创建完成回调 */
    onLoad?: MapVectorOverlayOnLoad<MapPolygonInstance>
    /** 多边形销毁前回调 */
    onDestroy?: MapVectorOverlayOnDestroy<MapPolygonInstance>
}

/** 折线组件属性 */
export interface PolylineProps extends MapPolylineBaseOptions, MapPolylineEventShortcutProps {
    /** 折线实例 ref */
    ref?: Ref<MapPolylineInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 折线额外参数 */
    polylineOptions?: MapPolylineOptions
    /** 折线事件映射 */
    events?: MapVectorOverlayEvents<MapPolylineInstance>
    /** 折线创建完成回调 */
    onLoad?: MapVectorOverlayOnLoad<MapPolylineInstance>
    /** 折线销毁前回调 */
    onDestroy?: MapVectorOverlayOnDestroy<MapPolylineInstance>
}

/** 贝塞尔曲线组件属性 */
export interface BezierCurveProps extends MapBezierCurveBaseOptions, MapBezierCurveEventShortcutProps {
    /** 贝塞尔曲线实例 ref */
    ref?: Ref<MapBezierCurveInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 贝塞尔曲线额外参数 */
    bezierCurveOptions?: MapBezierCurveOptions
    /** 贝塞尔曲线事件映射 */
    events?: MapVectorOverlayEvents<MapBezierCurveInstance>
    /** 贝塞尔曲线创建完成回调 */
    onLoad?: MapVectorOverlayOnLoad<MapBezierCurveInstance>
    /** 贝塞尔曲线销毁前回调 */
    onDestroy?: MapVectorOverlayOnDestroy<MapBezierCurveInstance>
}

/** 圆形组件属性 */
export interface CircleProps extends MapCircleBaseOptions, MapCircleEventShortcutProps {
    /** 圆形实例 ref */
    ref?: Ref<MapCircleInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 圆形额外参数 */
    circleOptions?: MapCircleOptions
    /** 圆形事件映射 */
    events?: MapVectorOverlayEvents<MapCircleInstance>
    /** 圆形创建完成回调 */
    onLoad?: MapVectorOverlayOnLoad<MapCircleInstance>
    /** 圆形销毁前回调 */
    onDestroy?: MapVectorOverlayOnDestroy<MapCircleInstance>
}

/** 圆点标记组件属性 */
export interface CircleMarkerProps extends MapCircleMarkerBaseOptions, MapCircleMarkerEventShortcutProps {
    /** 圆点标记实例 ref */
    ref?: Ref<MapCircleMarkerInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 圆点标记额外参数 */
    circleMarkerOptions?: MapCircleMarkerOptions
    /** 圆点标记事件映射 */
    events?: MapVectorOverlayEvents<MapCircleMarkerInstance>
    /** 圆点标记创建完成回调 */
    onLoad?: MapVectorOverlayOnLoad<MapCircleMarkerInstance>
    /** 圆点标记销毁前回调 */
    onDestroy?: MapVectorOverlayOnDestroy<MapCircleMarkerInstance>
}

/** 椭圆组件属性 */
export interface EllipseProps extends MapEllipseBaseOptions, MapEllipseEventShortcutProps {
    /** 椭圆实例 ref */
    ref?: Ref<MapEllipseInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 椭圆额外参数 */
    ellipseOptions?: MapEllipseOptions
    /** 椭圆事件映射 */
    events?: MapVectorOverlayEvents<MapEllipseInstance>
    /** 椭圆创建完成回调 */
    onLoad?: MapVectorOverlayOnLoad<MapEllipseInstance>
    /** 椭圆销毁前回调 */
    onDestroy?: MapVectorOverlayOnDestroy<MapEllipseInstance>
}

/** 矩形组件属性 */
export interface RectangleProps extends MapRectangleBaseOptions, MapRectangleEventShortcutProps {
    /** 矩形实例 ref */
    ref?: Ref<MapRectangleInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 矩形额外参数 */
    rectangleOptions?: MapRectangleOptions
    /** 矩形事件映射 */
    events?: MapVectorOverlayEvents<MapRectangleInstance>
    /** 矩形创建完成回调 */
    onLoad?: MapVectorOverlayOnLoad<MapRectangleInstance>
    /** 矩形销毁前回调 */
    onDestroy?: MapVectorOverlayOnDestroy<MapRectangleInstance>
}

/** GeoJSON 组件属性 */
export interface GeoJSONProps extends MapGeoJSONBaseOptions, MapGeoJSONEventShortcutProps {
    /** GeoJSON 实例 ref */
    ref?: Ref<MapGeoJSONInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** GeoJSON 额外参数 */
    geoJSONOptions?: MapGeoJSONOptions
    /** GeoJSON 事件映射 */
    events?: MapVectorOverlayEvents<MapGeoJSONInstance>
    /** GeoJSON 创建完成回调 */
    onLoad?: MapVectorOverlayOnLoad<MapGeoJSONInstance>
    /** GeoJSON 销毁前回调 */
    onDestroy?: MapVectorOverlayOnDestroy<MapGeoJSONInstance>
}

function mergeMapVectorOverlayOptions<TOptions extends MapVectorOverlayBaseOptions>({
    overlayOptions,
    extraOptions,
}: MergeMapVectorOverlayOptionsParams<TOptions>) {
    const nextOptions: TOptions = {
        ...overlayOptions,
    } as TOptions

    Object.entries(extraOptions ?? {}).forEach(([key, value]) => {
        if (value !== undefined) (nextOptions as Record<string, unknown>)[key] = value
    })

    return nextOptions
}

function setMapVectorOverlayRef<TInstance extends MapVectorOverlayInstance>({
    ref,
    overlay,
}: SetMapVectorOverlayRefParams<TInstance>) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(overlay)
        return
    }

    ref.current = overlay
}

function getMapVectorOverlayConstructor<
    TInstance extends MapVectorOverlayInstance,
    TOptions extends MapVectorOverlayBaseOptions,
>({ AMap, constructorName }: GetMapVectorOverlayConstructorParams) {
    const constructor = (AMap as unknown as Record<string, unknown>)[constructorName]

    if (typeof constructor !== "function") return undefined

    return constructor as MapVectorOverlayConstructor<TInstance, TOptions>
}

function bindMapVectorOverlayEvents<TInstance extends MapVectorOverlayInstance>({
    overlay,
    events,
}: BindMapVectorOverlayEventsParams<TInstance>) {
    const runtimeOverlay = overlay as MapVectorOverlayRuntime
    const eventEntries = getMapEventEntries(events)

    eventEntries.forEach(({ eventName, handler }) => void runtimeOverlay.on?.(eventName, handler))

    return function unbindMapVectorOverlayEvents() {
        eventEntries.forEach(({ eventName, handler }) => void runtimeOverlay.off?.(eventName, handler))
    }
}

function removeMapVectorOverlay<TInstance extends MapVectorOverlayInstance>({
    map,
    overlay,
    onDestroy,
}: RemoveMapVectorOverlayParams<TInstance>) {
    const runtimeOverlay = overlay as MapVectorOverlayRuntime

    try {
        onDestroy?.(overlay)
    } finally {
        if (runtimeOverlay.destroy) {
            runtimeOverlay.destroy()
        } else if (runtimeOverlay.setMap) {
            runtimeOverlay.setMap(null)
        } else {
            map.remove?.(overlay)
        }
    }
}

function updateMapVectorOverlay<
    TInstance extends MapVectorOverlayInstance,
    TOptions extends MapVectorOverlayBaseOptions,
>({ overlay, options }: UpdateMapVectorOverlayParams<TInstance, TOptions>) {
    const { visible, ...setOptions } = options
    const runtimeOverlay = overlay as MapVectorOverlayRuntime

    runtimeOverlay.setOptions?.(setOptions)

    if ("bounds" in options && options.bounds !== undefined)
        (overlay as MapRectangleRuntime).setBounds?.(options.bounds)

    if ("geoJSON" in options && options.geoJSON)
        (overlay as MapGeoJSONRuntime).importData?.(options.geoJSON as Record<string, unknown>)

    if (visible === undefined) return

    if (visible) {
        runtimeOverlay.show?.()
        return
    }

    runtimeOverlay.hide?.()
}

function MapVectorOverlay<
    TInstance extends MapVectorOverlayInstance,
    TOptions extends MapVectorOverlayBaseOptions,
>({
    ref,
    map,
    AMap,
    constructorName,
    options,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...eventShortcuts
}: MapVectorOverlayProps<TInstance, TOptions>) {
    const context = useMapContext()
    const contextGroup = useOverlayGroupContext()
    const contextLayer = useVectorLayerContext()
    const overlayRef = useRef<TInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = AMap ?? context.AMap
    const currentGroup = map ? null : contextGroup
    const currentLayer = map ? null : contextLayer
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialOptions = useEffectEvent(() => options)
    const currentEvents = mergeMapEvents({
        eventShortcuts,
        events,
    }) as MapVectorOverlayEvents

    useStableEffect(() => {
        if (!currentMap || !currentAMap) return

        const OverlayConstructor = getMapVectorOverlayConstructor<TInstance, TOptions>({
            AMap: currentAMap,
            constructorName,
        })

        if (!OverlayConstructor) return

        const initialOptions = getInitialOptions()
        const overlay = new OverlayConstructor(initialOptions)

        if (currentLayer) currentLayer.addVector(overlay)
        else if (currentGroup) currentGroup.addOverlay(overlay)
        else currentMap.add?.(overlay)

        overlayRef.current = overlay
        setMapVectorOverlayRef({
            ref,
            overlay,
        })
        updateMapVectorOverlay({
            overlay,
            options: initialOptions,
        })
        currentLayer?.sync()
        currentGroup?.sync()
        onLoad(overlay)

        return () => {
            overlayRef.current = null
            setMapVectorOverlayRef({
                ref,
                overlay: null,
            })

            if (currentLayer) {
                const runtimeOverlay = overlay as MapVectorOverlayRuntime

                try {
                    onDestroy(overlay)
                } finally {
                    currentLayer.removeVector(overlay)
                    runtimeOverlay.setMap?.(null)
                }

                return
            }

            if (currentGroup) {
                const runtimeOverlay = overlay as MapVectorOverlayRuntime

                try {
                    onDestroy(overlay)
                } finally {
                    currentGroup.removeOverlay(overlay)
                    runtimeOverlay.setMap?.(null)
                }

                return
            }

            removeMapVectorOverlay({
                map: currentMap,
                overlay,
                onDestroy,
            })
        }
    }, [constructorName, currentAMap, currentGroup, currentLayer, currentMap, ref])

    useStableEffect(() => {
        if (!overlayRef.current) return

        updateMapVectorOverlay({
            overlay: overlayRef.current,
            options,
        })
        currentLayer?.sync()
        currentGroup?.sync()
    }, [currentGroup, currentLayer, options])

    useStableEffect(() => {
        if (!currentGroup) return

        return currentGroup.registerChildSync(() => {
            if (!overlayRef.current) return

            updateMapVectorOverlay({
                overlay: overlayRef.current,
                options,
            })
        })
    }, [currentGroup, options])

    useStableEffect(() => {
        if (!currentLayer) return

        return currentLayer.registerChildSync(() => {
            if (!overlayRef.current) return

            updateMapVectorOverlay({
                overlay: overlayRef.current,
                options,
            })
        })
    }, [currentLayer, options])

    useStableEffect(() => {
        if (!overlayRef.current) return

        return bindMapVectorOverlayEvents({
            overlay: overlayRef.current,
            events: currentEvents,
        })
    }, [constructorName, currentAMap, currentEvents, currentGroup, currentLayer, currentMap, ref])

    return null
}

export const Polygon: FC<PolygonProps> = ({
    ref,
    map,
    AMap,
    polygonOptions,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitMapEventShortcutProps(restOptions)
    const currentOptions = mergeMapVectorOverlayOptions({
        overlayOptions: polygonOptions,
        extraOptions: restProps as MapPolygonOptions,
    })

    return (
        <MapVectorOverlay
            ref={ref}
            map={map}
            AMap={AMap}
            constructorName="Polygon"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const Polyline: FC<PolylineProps> = ({
    ref,
    map,
    AMap,
    polylineOptions,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitMapEventShortcutProps(restOptions)
    const currentOptions = mergeMapVectorOverlayOptions({
        overlayOptions: polylineOptions,
        extraOptions: restProps as MapPolylineOptions,
    })

    return (
        <MapVectorOverlay
            ref={ref}
            map={map}
            AMap={AMap}
            constructorName="Polyline"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const BezierCurve: FC<BezierCurveProps> = ({
    ref,
    map,
    AMap,
    bezierCurveOptions,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitMapEventShortcutProps(restOptions)
    const currentOptions = mergeMapVectorOverlayOptions({
        overlayOptions: bezierCurveOptions,
        extraOptions: restProps as MapBezierCurveOptions,
    })

    return (
        <MapVectorOverlay
            ref={ref}
            map={map}
            AMap={AMap}
            constructorName="BezierCurve"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

/** 贝塞尔曲线组件的兼容拼写别名 */
export const BesizerCurve: FC<BezierCurveProps> = BezierCurve

export const Circle: FC<CircleProps> = ({
    ref,
    map,
    AMap,
    circleOptions,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitMapEventShortcutProps(restOptions)
    const currentOptions = mergeMapVectorOverlayOptions({
        overlayOptions: circleOptions,
        extraOptions: restProps as MapCircleOptions,
    })

    return (
        <MapVectorOverlay
            ref={ref}
            map={map}
            AMap={AMap}
            constructorName="Circle"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const CircleMarker: FC<CircleMarkerProps> = ({
    ref,
    map,
    AMap,
    circleMarkerOptions,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitMapEventShortcutProps(restOptions)
    const currentOptions = mergeMapVectorOverlayOptions({
        overlayOptions: circleMarkerOptions,
        extraOptions: restProps as MapCircleMarkerOptions,
    })

    return (
        <MapVectorOverlay
            ref={ref}
            map={map}
            AMap={AMap}
            constructorName="CircleMarker"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const Ellipse: FC<EllipseProps> = ({
    ref,
    map,
    AMap,
    ellipseOptions,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitMapEventShortcutProps(restOptions)
    const currentOptions = mergeMapVectorOverlayOptions({
        overlayOptions: ellipseOptions,
        extraOptions: restProps as MapEllipseOptions,
    })

    return (
        <MapVectorOverlay
            ref={ref}
            map={map}
            AMap={AMap}
            constructorName="Ellipse"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const Rectangle: FC<RectangleProps> = ({
    ref,
    map,
    AMap,
    rectangleOptions,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitMapEventShortcutProps(restOptions)
    const currentOptions = mergeMapVectorOverlayOptions({
        overlayOptions: rectangleOptions,
        extraOptions: restProps as MapRectangleOptions,
    })

    return (
        <MapVectorOverlay
            ref={ref}
            map={map}
            AMap={AMap}
            constructorName="Rectangle"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const GeoJSON: FC<GeoJSONProps> = ({
    ref,
    map,
    AMap,
    geoJSONOptions,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitMapEventShortcutProps(restOptions)
    const currentOptions = mergeMapVectorOverlayOptions({
        overlayOptions: geoJSONOptions,
        extraOptions: restProps as MapGeoJSONOptions,
    })

    return (
        <MapVectorOverlay
            ref={ref}
            map={map}
            AMap={AMap}
            constructorName="GeoJSON"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}