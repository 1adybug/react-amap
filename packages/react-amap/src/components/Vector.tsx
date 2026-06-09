import { type FC, type Ref, useEffectEvent, useRef } from "react"

import {
    type AmapEventHandler,
    type AmapLngLatLike,
    type AmapMapInstance,
    type AmapNamespace,
    useAmapContext,
} from "./Amap"
import { optionalFn } from "../utils/optionalFn"
import { useStableEffect } from "../hooks/useStableEffect"
import {
    type AmapEventMap,
    type AmapEventShortcutProps,
    type AmapOverlayMouseEvent,
    getAmapEventEntries,
    mergeAmapEvents,
    splitAmapEventShortcutProps,
} from "../utils/amapEvents"

export type AmapVectorPosition = AmapLngLatLike

export type AmapVectorPath = AmapVectorPosition[]

export type AmapPolygonPath = AmapVectorPath | AmapVectorPath[] | AmapVectorPath[][]

export type AmapPolylinePath = AmapVectorPath | AmapVectorPath[]

export type AmapBezierCurvePath = number[][] | number[][][]

export type AmapEllipseRadius = AMap.Vector2

export type AmapBoundsLike = unknown

export type AmapVectorOverlayOnLoad<TInstance extends AmapVectorOverlayInstance = AmapVectorOverlayInstance> = (
    overlay: TInstance
) => void

export type AmapVectorOverlayOnDestroy<TInstance extends AmapVectorOverlayInstance = AmapVectorOverlayInstance> = (
    overlay: TInstance
) => void

/** 矢量覆盖物事件映射 */
export interface AmapVectorOverlayEvents<TInstance = AmapVectorOverlayInstance>
    extends AmapEventMap<AmapOverlayMouseEvent<TInstance>> {}

/** 矢量覆盖物基础参数 */
export interface AmapVectorOverlayBaseOptions {
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
    [key: string]: unknown
}

/** 面状矢量覆盖物参数 */
export interface AmapAreaOverlayBaseOptions extends AmapVectorOverlayBaseOptions {
    /** 填充颜色 */
    fillColor?: string
    /** 填充透明度 */
    fillOpacity?: number
}

/** 线状矢量覆盖物参数 */
export interface AmapLineOverlayBaseOptions extends AmapVectorOverlayBaseOptions {
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
export interface AmapPolygonBaseOptions extends AmapAreaOverlayBaseOptions {
    /** 多边形路径 */
    path?: AmapPolygonPath
    /** 拉伸高度 */
    extrusionHeight?: number
    /** 拉伸墙面颜色 */
    wallColor?: string | string[]
    /** 拉伸顶面颜色 */
    roofColor?: string | string[]
}

/** 多边形构造参数 */
export interface AmapPolygonOptions extends AmapPolygonBaseOptions {
    [key: string]: unknown
}

/** 折线基础参数 */
export interface AmapPolylineBaseOptions extends AmapLineOverlayBaseOptions {
    /** 折线路径 */
    path?: AmapPolylinePath
}

/** 折线构造参数 */
export interface AmapPolylineOptions extends AmapPolylineBaseOptions {
    [key: string]: unknown
}

/** 贝塞尔曲线基础参数 */
export interface AmapBezierCurveBaseOptions extends AmapLineOverlayBaseOptions {
    /** 贝塞尔曲线路径 */
    path?: AmapBezierCurvePath
}

/** 贝塞尔曲线构造参数 */
export interface AmapBezierCurveOptions extends AmapBezierCurveBaseOptions {
    [key: string]: unknown
}

/** 圆形基础参数 */
export interface AmapCircleBaseOptions extends AmapAreaOverlayBaseOptions {
    /** 圆心坐标 */
    center?: AmapVectorPosition
    /** 半径，单位：米 */
    radius?: number
}

/** 圆形构造参数 */
export interface AmapCircleOptions extends AmapCircleBaseOptions {
    [key: string]: unknown
}

/** 圆点标记基础参数 */
export interface AmapCircleMarkerBaseOptions extends AmapAreaOverlayBaseOptions {
    /** 圆心坐标 */
    center?: AmapVectorPosition
    /** 半径，单位：像素 */
    radius?: number
}

/** 圆点标记构造参数 */
export interface AmapCircleMarkerOptions extends AmapCircleMarkerBaseOptions {
    [key: string]: unknown
}

/** 椭圆基础参数 */
export interface AmapEllipseBaseOptions extends AmapAreaOverlayBaseOptions {
    /** 圆心坐标 */
    center?: AmapVectorPosition
    /** 横向和纵向半径，单位：米 */
    radius?: AmapEllipseRadius
}

/** 椭圆构造参数 */
export interface AmapEllipseOptions extends AmapEllipseBaseOptions {
    [key: string]: unknown
}

/** 矩形基础参数 */
export interface AmapRectangleBaseOptions extends AmapAreaOverlayBaseOptions {
    /** 矩形范围 */
    bounds?: AmapBoundsLike
}

/** 矩形构造参数 */
export interface AmapRectangleOptions extends AmapRectangleBaseOptions {
    [key: string]: unknown
}

/** GeoJSON 基础参数 */
export interface AmapGeoJSONBaseOptions extends AmapVectorOverlayBaseOptions {
    /** 标准 GeoJSON 数据 */
    geoJSON?: Record<string, unknown>
    /** 点要素绘制方法 */
    getMarker?: (geojson: Record<string, unknown>, lnglat: AmapVectorPosition) => unknown
    /** 线要素绘制方法 */
    getPolyline?: (geojson: Record<string, unknown>, lnglat: AmapPolylinePath) => unknown
    /** 面要素绘制方法 */
    getPolygon?: (geojson: Record<string, unknown>, lnglat: AmapPolygonPath) => unknown
}

/** GeoJSON 构造参数 */
export interface AmapGeoJSONOptions extends AmapGeoJSONBaseOptions {
    [key: string]: unknown
}

/** 矢量覆盖物实例 */
export interface AmapVectorOverlayInstance {}

/** 矢量覆盖物运行时能力 */
export interface AmapVectorOverlayRuntime {
    /** 获取地图实例 */
    getMap?: () => AmapMapInstance | null
    /** 设置地图实例 */
    setMap?: (map: AmapMapInstance | null) => void
    /** 销毁覆盖物 */
    destroy?: () => void
    /** 显示覆盖物 */
    show?: () => void
    /** 隐藏覆盖物 */
    hide?: () => void
    /** 绑定事件 */
    on?: (eventName: string | string[], handler: AmapEventHandler, context?: unknown, once?: boolean) => unknown
    /** 解绑事件 */
    off?: (eventName: string, handler: AmapEventHandler, context?: unknown) => unknown
    /** 设置覆盖物参数 */
    setOptions?: (options: AmapVectorOverlayBaseOptions) => void
    /** 获取覆盖物参数 */
    getOptions?: () => AmapVectorOverlayBaseOptions
    /** 设置自定义数据 */
    setExtData?: (extData: unknown) => void
    /** 获取自定义数据 */
    getExtData?: () => unknown
    /** 获取覆盖物范围 */
    getBounds?: () => unknown
    /** 判断坐标是否在覆盖物内 */
    contains?: (point: AmapVectorPosition) => boolean
}

/** 矩形覆盖物运行时能力 */
export interface AmapRectangleRuntime {
    /** 设置矩形范围 */
    setBounds?: (bounds: AmapBoundsLike) => void
}

/** GeoJSON 覆盖物运行时能力 */
export interface AmapGeoJSONRuntime {
    /** 加载 GeoJSON 数据 */
    importData?: (geoJSON: Record<string, unknown>) => void
}

/** 高德多边形实例 */
export interface AmapPolygonInstance extends AMap.Polygon {}

/** 高德折线实例 */
export interface AmapPolylineInstance extends AMap.Polyline {}

/** 高德贝塞尔曲线实例 */
export interface AmapBezierCurveInstance extends AMap.BezierCurve {}

/** 高德圆形实例 */
export interface AmapCircleInstance extends AMap.Circle {}

/** 高德圆点标记实例 */
export interface AmapCircleMarkerInstance extends AMap.CircleMarker {}

/** 高德椭圆实例 */
export interface AmapEllipseInstance extends AMap.Ellipse {}

/** 高德矩形实例 */
export interface AmapRectangleInstance extends AMap.Rectangle {}

/** 高德 GeoJSON 实例 */
export interface AmapGeoJSONInstance extends AmapVectorOverlayInstance {
    /** 加载 GeoJSON 数据 */
    importData?: (geoJSON: Record<string, unknown>) => void
    /** 导出 GeoJSON 数据 */
    toGeoJSON?: () => Record<string, unknown>
}

/** 矢量覆盖物构造器 */
export interface AmapVectorOverlayConstructor<
    TInstance extends AmapVectorOverlayInstance,
    TOptions extends AmapVectorOverlayBaseOptions,
> {
    new (options?: TOptions): TInstance
}

/** 支持矢量覆盖物构造器的高德命名空间 */
export interface AmapVectorNamespace extends AmapNamespace {
    /** Polygon 构造器 */
    Polygon?: new (options?: AmapPolygonOptions) => AmapPolygonInstance
    /** Polyline 构造器 */
    Polyline?: new (options?: AmapPolylineOptions) => AmapPolylineInstance
    /** BezierCurve 构造器 */
    BezierCurve?: new (options?: AmapBezierCurveOptions) => AmapBezierCurveInstance
    /** Circle 构造器 */
    Circle?: new (options?: AmapCircleOptions) => AmapCircleInstance
    /** CircleMarker 构造器 */
    CircleMarker?: new (options?: AmapCircleMarkerOptions) => AmapCircleMarkerInstance
    /** Ellipse 构造器 */
    Ellipse?: new (options?: AmapEllipseOptions) => AmapEllipseInstance
    /** Rectangle 构造器 */
    Rectangle?: new (options?: AmapRectangleOptions) => AmapRectangleInstance
    /** GeoJSON 构造器 */
    GeoJSON?: new (options?: AmapGeoJSONOptions) => AmapGeoJSONInstance
}

/** 合并矢量覆盖物参数 */
export interface MergeAmapVectorOverlayOptionsParams<TOptions extends AmapVectorOverlayBaseOptions> {
    /** 额外构造参数 */
    overlayOptions?: TOptions
    /** 透传构造参数 */
    extraOptions?: TOptions
}

/** 设置矢量覆盖物 ref 参数 */
export interface SetAmapVectorOverlayRefParams<TInstance extends AmapVectorOverlayInstance> {
    /** 外部 ref */
    ref?: Ref<TInstance | null>
    /** 覆盖物实例 */
    overlay: TInstance | null
}

/** 获取矢量覆盖物构造器参数 */
export interface GetAmapVectorOverlayConstructorParams {
    /** 高德地图命名空间 */
    AMap: AmapNamespace
    /** 构造器名称 */
    constructorName: string
}

/** 绑定矢量覆盖物事件参数 */
export interface BindAmapVectorOverlayEventsParams<TInstance extends AmapVectorOverlayInstance> {
    /** 覆盖物实例 */
    overlay: TInstance
    /** 事件映射 */
    events?: AmapVectorOverlayEvents
}

/** 移除矢量覆盖物参数 */
export interface RemoveAmapVectorOverlayParams<TInstance extends AmapVectorOverlayInstance> {
    /** 地图实例 */
    map: AmapMapInstance
    /** 覆盖物实例 */
    overlay: TInstance
    /** 销毁前回调 */
    onDestroy?: AmapVectorOverlayOnDestroy<TInstance>
}

/** 更新矢量覆盖物参数 */
export interface UpdateAmapVectorOverlayParams<
    TInstance extends AmapVectorOverlayInstance,
    TOptions extends AmapVectorOverlayBaseOptions,
> {
    /** 覆盖物实例 */
    overlay: TInstance
    /** 覆盖物参数 */
    options: TOptions
}

/** 内部矢量覆盖物组件属性 */
export interface AmapVectorOverlayProps<
    TInstance extends AmapVectorOverlayInstance,
    TOptions extends AmapVectorOverlayBaseOptions,
> extends AmapEventShortcutProps<AmapOverlayMouseEvent<TInstance>> {
    /** 覆盖物实例 ref */
    ref?: Ref<TInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 构造器名称 */
    constructorName: string
    /** 覆盖物参数 */
    options: TOptions
    /** 覆盖物事件映射 */
    events?: AmapVectorOverlayEvents<TInstance>
    /** 覆盖物创建完成回调 */
    onLoad?: AmapVectorOverlayOnLoad<TInstance>
    /** 覆盖物销毁前回调 */
    onDestroy?: AmapVectorOverlayOnDestroy<TInstance>
}

/** 多边形组件属性 */
export interface PolygonProps extends AmapPolygonBaseOptions, AmapEventShortcutProps<AmapOverlayMouseEvent<AmapPolygonInstance>> {
    /** 多边形实例 ref */
    ref?: Ref<AmapPolygonInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 多边形额外参数 */
    polygonOptions?: AmapPolygonOptions
    /** 多边形事件映射 */
    events?: AmapVectorOverlayEvents<AmapPolygonInstance>
    /** 多边形创建完成回调 */
    onLoad?: AmapVectorOverlayOnLoad<AmapPolygonInstance>
    /** 多边形销毁前回调 */
    onDestroy?: AmapVectorOverlayOnDestroy<AmapPolygonInstance>
}

/** 折线组件属性 */
export interface PolylineProps extends AmapPolylineBaseOptions, AmapEventShortcutProps<AmapOverlayMouseEvent<AmapPolylineInstance>> {
    /** 折线实例 ref */
    ref?: Ref<AmapPolylineInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 折线额外参数 */
    polylineOptions?: AmapPolylineOptions
    /** 折线事件映射 */
    events?: AmapVectorOverlayEvents<AmapPolylineInstance>
    /** 折线创建完成回调 */
    onLoad?: AmapVectorOverlayOnLoad<AmapPolylineInstance>
    /** 折线销毁前回调 */
    onDestroy?: AmapVectorOverlayOnDestroy<AmapPolylineInstance>
}

/** 贝塞尔曲线组件属性 */
export interface BezierCurveProps extends AmapBezierCurveBaseOptions, AmapEventShortcutProps<AmapOverlayMouseEvent<AmapBezierCurveInstance>> {
    /** 贝塞尔曲线实例 ref */
    ref?: Ref<AmapBezierCurveInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 贝塞尔曲线额外参数 */
    bezierCurveOptions?: AmapBezierCurveOptions
    /** 贝塞尔曲线事件映射 */
    events?: AmapVectorOverlayEvents<AmapBezierCurveInstance>
    /** 贝塞尔曲线创建完成回调 */
    onLoad?: AmapVectorOverlayOnLoad<AmapBezierCurveInstance>
    /** 贝塞尔曲线销毁前回调 */
    onDestroy?: AmapVectorOverlayOnDestroy<AmapBezierCurveInstance>
}

/** 圆形组件属性 */
export interface CircleProps extends AmapCircleBaseOptions, AmapEventShortcutProps<AmapOverlayMouseEvent<AmapCircleInstance>> {
    /** 圆形实例 ref */
    ref?: Ref<AmapCircleInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 圆形额外参数 */
    circleOptions?: AmapCircleOptions
    /** 圆形事件映射 */
    events?: AmapVectorOverlayEvents<AmapCircleInstance>
    /** 圆形创建完成回调 */
    onLoad?: AmapVectorOverlayOnLoad<AmapCircleInstance>
    /** 圆形销毁前回调 */
    onDestroy?: AmapVectorOverlayOnDestroy<AmapCircleInstance>
}

/** 圆点标记组件属性 */
export interface CircleMarkerProps extends AmapCircleMarkerBaseOptions, AmapEventShortcutProps<AmapOverlayMouseEvent<AmapCircleMarkerInstance>> {
    /** 圆点标记实例 ref */
    ref?: Ref<AmapCircleMarkerInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 圆点标记额外参数 */
    circleMarkerOptions?: AmapCircleMarkerOptions
    /** 圆点标记事件映射 */
    events?: AmapVectorOverlayEvents<AmapCircleMarkerInstance>
    /** 圆点标记创建完成回调 */
    onLoad?: AmapVectorOverlayOnLoad<AmapCircleMarkerInstance>
    /** 圆点标记销毁前回调 */
    onDestroy?: AmapVectorOverlayOnDestroy<AmapCircleMarkerInstance>
}

/** 椭圆组件属性 */
export interface EllipseProps extends AmapEllipseBaseOptions, AmapEventShortcutProps<AmapOverlayMouseEvent<AmapEllipseInstance>> {
    /** 椭圆实例 ref */
    ref?: Ref<AmapEllipseInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 椭圆额外参数 */
    ellipseOptions?: AmapEllipseOptions
    /** 椭圆事件映射 */
    events?: AmapVectorOverlayEvents<AmapEllipseInstance>
    /** 椭圆创建完成回调 */
    onLoad?: AmapVectorOverlayOnLoad<AmapEllipseInstance>
    /** 椭圆销毁前回调 */
    onDestroy?: AmapVectorOverlayOnDestroy<AmapEllipseInstance>
}

/** 矩形组件属性 */
export interface RectangleProps extends AmapRectangleBaseOptions, AmapEventShortcutProps<AmapOverlayMouseEvent<AmapRectangleInstance>> {
    /** 矩形实例 ref */
    ref?: Ref<AmapRectangleInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 矩形额外参数 */
    rectangleOptions?: AmapRectangleOptions
    /** 矩形事件映射 */
    events?: AmapVectorOverlayEvents<AmapRectangleInstance>
    /** 矩形创建完成回调 */
    onLoad?: AmapVectorOverlayOnLoad<AmapRectangleInstance>
    /** 矩形销毁前回调 */
    onDestroy?: AmapVectorOverlayOnDestroy<AmapRectangleInstance>
}

/** GeoJSON 组件属性 */
export interface GeoJSONProps extends AmapGeoJSONBaseOptions, AmapEventShortcutProps<AmapOverlayMouseEvent<AmapGeoJSONInstance>> {
    /** GeoJSON 实例 ref */
    ref?: Ref<AmapGeoJSONInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** GeoJSON 额外参数 */
    geoJSONOptions?: AmapGeoJSONOptions
    /** GeoJSON 事件映射 */
    events?: AmapVectorOverlayEvents<AmapGeoJSONInstance>
    /** GeoJSON 创建完成回调 */
    onLoad?: AmapVectorOverlayOnLoad<AmapGeoJSONInstance>
    /** GeoJSON 销毁前回调 */
    onDestroy?: AmapVectorOverlayOnDestroy<AmapGeoJSONInstance>
}

function mergeAmapVectorOverlayOptions<TOptions extends AmapVectorOverlayBaseOptions>({
    overlayOptions,
    extraOptions,
}: MergeAmapVectorOverlayOptionsParams<TOptions>) {
    const nextOptions: TOptions = {
        ...overlayOptions,
    } as TOptions

    Object.entries(extraOptions ?? {}).forEach(([key, value]) => {
        if (value !== undefined) (nextOptions as Record<string, unknown>)[key] = value
    })

    return nextOptions
}

function setAmapVectorOverlayRef<TInstance extends AmapVectorOverlayInstance>({
    ref,
    overlay,
}: SetAmapVectorOverlayRefParams<TInstance>) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(overlay)
        return
    }

    ref.current = overlay
}

function getAmapVectorOverlayConstructor<
    TInstance extends AmapVectorOverlayInstance,
    TOptions extends AmapVectorOverlayBaseOptions,
>({ AMap, constructorName }: GetAmapVectorOverlayConstructorParams) {
    const constructor = (AMap as Record<string, unknown>)[constructorName]

    if (typeof constructor !== "function") return undefined

    return constructor as AmapVectorOverlayConstructor<TInstance, TOptions>
}

function bindAmapVectorOverlayEvents<TInstance extends AmapVectorOverlayInstance>({
    overlay,
    events,
}: BindAmapVectorOverlayEventsParams<TInstance>) {
    const runtimeOverlay = overlay as AmapVectorOverlayRuntime
    const eventEntries = getAmapEventEntries(events)

    eventEntries.forEach(({ eventName, handler }) => void runtimeOverlay.on?.(eventName, handler))

    return function unbindAmapVectorOverlayEvents() {
        eventEntries.forEach(({ eventName, handler }) => void runtimeOverlay.off?.(eventName, handler))
    }
}

function removeAmapVectorOverlay<TInstance extends AmapVectorOverlayInstance>({
    map,
    overlay,
    onDestroy,
}: RemoveAmapVectorOverlayParams<TInstance>) {
    const runtimeOverlay = overlay as AmapVectorOverlayRuntime

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

function updateAmapVectorOverlay<
    TInstance extends AmapVectorOverlayInstance,
    TOptions extends AmapVectorOverlayBaseOptions,
>({ overlay, options }: UpdateAmapVectorOverlayParams<TInstance, TOptions>) {
    const { visible, ...setOptions } = options
    const runtimeOverlay = overlay as AmapVectorOverlayRuntime

    runtimeOverlay.setOptions?.(setOptions)

    if ("bounds" in options && options.bounds !== undefined)
        (overlay as AmapRectangleRuntime).setBounds?.(options.bounds)

    if ("geoJSON" in options && options.geoJSON)
        (overlay as AmapGeoJSONRuntime).importData?.(options.geoJSON as Record<string, unknown>)

    if (visible === undefined) return

    if (visible) {
        runtimeOverlay.show?.()
        return
    }

    runtimeOverlay.hide?.()
}

function AmapVectorOverlay<
    TInstance extends AmapVectorOverlayInstance,
    TOptions extends AmapVectorOverlayBaseOptions,
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
}: AmapVectorOverlayProps<TInstance, TOptions>) {
    const context = useAmapContext()
    const overlayRef = useRef<TInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = AMap ?? context.AMap
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialOptions = useEffectEvent(() => options)
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapVectorOverlayEvents

    useStableEffect(() => {
        if (!currentMap || !currentAMap) return

        const OverlayConstructor = getAmapVectorOverlayConstructor<TInstance, TOptions>({
            AMap: currentAMap,
            constructorName,
        })

        if (!OverlayConstructor) return

        const initialOptions = getInitialOptions()
        const overlay = new OverlayConstructor(initialOptions)

        currentMap.add?.(overlay)
        overlayRef.current = overlay
        setAmapVectorOverlayRef({
            ref,
            overlay,
        })
        updateAmapVectorOverlay({
            overlay,
            options: initialOptions,
        })
        onLoad(overlay)

        return () => {
            overlayRef.current = null
            setAmapVectorOverlayRef({
                ref,
                overlay: null,
            })
            removeAmapVectorOverlay({
                map: currentMap,
                overlay,
                onDestroy,
            })
        }
    }, [constructorName, currentAMap, currentMap, ref])

    useStableEffect(() => {
        if (!overlayRef.current) return

        updateAmapVectorOverlay({
            overlay: overlayRef.current,
            options,
        })
    }, [options])

    useStableEffect(() => {
        if (!overlayRef.current) return

        return bindAmapVectorOverlayEvents({
            overlay: overlayRef.current,
            events: currentEvents,
        })
    }, [constructorName, currentAMap, currentEvents, currentMap, ref])

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
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapVectorOverlayOptions({
        overlayOptions: polygonOptions,
        extraOptions: restProps as AmapPolygonOptions,
    })

    return (
        <AmapVectorOverlay
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
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapVectorOverlayOptions({
        overlayOptions: polylineOptions,
        extraOptions: restProps as AmapPolylineOptions,
    })

    return (
        <AmapVectorOverlay
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
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapVectorOverlayOptions({
        overlayOptions: bezierCurveOptions,
        extraOptions: restProps as AmapBezierCurveOptions,
    })

    return (
        <AmapVectorOverlay
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
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapVectorOverlayOptions({
        overlayOptions: circleOptions,
        extraOptions: restProps as AmapCircleOptions,
    })

    return (
        <AmapVectorOverlay
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
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapVectorOverlayOptions({
        overlayOptions: circleMarkerOptions,
        extraOptions: restProps as AmapCircleMarkerOptions,
    })

    return (
        <AmapVectorOverlay
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
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapVectorOverlayOptions({
        overlayOptions: ellipseOptions,
        extraOptions: restProps as AmapEllipseOptions,
    })

    return (
        <AmapVectorOverlay
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
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapVectorOverlayOptions({
        overlayOptions: rectangleOptions,
        extraOptions: restProps as AmapRectangleOptions,
    })

    return (
        <AmapVectorOverlay
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
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapVectorOverlayOptions({
        overlayOptions: geoJSONOptions,
        extraOptions: restProps as AmapGeoJSONOptions,
    })

    return (
        <AmapVectorOverlay
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
