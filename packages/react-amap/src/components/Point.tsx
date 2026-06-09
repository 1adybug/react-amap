import {
    type FC,
    type ReactNode,
    type Ref,
    createContext,
    useContext,
    useEffectEvent,
    useRef,
    useState,
} from "react"

import {
    AmapPlugin,
    type AmapEventHandler,
    type AmapLngLatLike,
    type AmapMapInstance,
    type AmapNamespace,
    type AmapZoomRange,
    useAmapContext,
} from "./Amap"
import type {
    AmapMarkerAnchor,
    AmapMarkerLabelDirection,
    AmapMarkerOffset,
    AmapMarkerPosition,
    AmapMarkerEvents,
} from "./Marker"
import { optionalFn } from "../utils/optionalFn"
import { useAmapPlugin } from "../hooks/useAmapPlugin"
import { useStableEffect } from "../hooks/useStableEffect"
import { type AmapEventShortcutProps, mergeAmapEvents, splitAmapEventShortcutProps } from "../utils/amapEvents"

export type AmapTextStyle = Record<string, string | number>

export type AmapLabelMarkerPosition = AmapLngLatLike

/** 灵活点标记文本位置 */
export const AmapElasticMarkerLabelPosition = {
    左下角: "BL",
    底部居中: "BM",
    右下角: "BR",
    左侧居中: "ML",
    右侧居中: "MR",
    左上角: "TL",
    顶部居中: "TM",
    右上角: "TR",
} as const

export type AmapElasticMarkerLabelPosition =
    (typeof AmapElasticMarkerLabelPosition)[keyof typeof AmapElasticMarkerLabelPosition]

export type AmapPointOverlayOnLoad<TInstance extends AmapPointOverlayInstance = AmapPointOverlayInstance> = (
    overlay: TInstance
) => void

export type AmapPointOverlayOnDestroy<TInstance extends AmapPointOverlayInstance = AmapPointOverlayInstance> = (
    overlay: TInstance
) => void

/** 点标记覆盖物基础实例 */
export interface AmapPointOverlayInstance {
    /** 获取地图实例 */
    getMap?: () => AmapMapInstance | null
    /** 设置地图实例 */
    setMap?: (map: AmapMapInstance | null) => void
    /** 移除覆盖物 */
    remove?: () => void
    /** 显示覆盖物 */
    show?: () => void
    /** 隐藏覆盖物 */
    hide?: () => void
    /** 绑定事件 */
    on?: (eventName: string, handler: AmapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: AmapEventHandler) => void
    /** 设置参数 */
    setOptions?: (options: AmapPointOverlayOptions) => void
    /** 设置位置 */
    setPosition?: (position: AmapMarkerPosition) => void
    /** 设置鼠标悬停文字 */
    setTitle?: (title: string) => void
    /** 设置可点击状态 */
    setClickable?: (clickable: boolean) => void
    /** 设置可拖拽状态 */
    setDraggable?: (draggable: boolean) => void
    /** 设置自定义数据 */
    setExtData?: (extData: unknown) => void
    /** 设置叠加层级 */
    setzIndex?: (zIndex: number) => void
    /** 设置置顶状态 */
    setTop?: (isTop: boolean) => void
    /** 设置悬停光标 */
    setCursor?: (cursor: string) => void
    [key: string]: unknown
}

/** 点标记覆盖物构造参数 */
export interface AmapPointOverlayOptions {
    /** 所在地图 */
    map?: AmapMapInstance
    /** 是否可见 */
    visible?: boolean
    /** 自定义数据 */
    extData?: unknown
    [key: string]: unknown
}

/** 文本标记基础参数 */
export interface AmapTextBaseOptions extends AmapPointOverlayOptions {
    /** 文本标记坐标 */
    position?: AmapMarkerPosition
    /** 文本内容 */
    text?: string
    /** 鼠标悬停文字 */
    title?: string
    /** 叠加层级 */
    zIndex?: number
    /** 偏移量 */
    offset?: AmapMarkerOffset
    /** 锚点 */
    anchor?: AmapMarkerAnchor
    /** 旋转角度 */
    angle?: number
    /** 是否可点击 */
    clickable?: boolean
    /** 是否可拖拽 */
    draggable?: boolean
    /** 事件是否冒泡 */
    bubble?: boolean
    /** 显示缩放级别范围 */
    zooms?: AmapZoomRange
    /** 鼠标悬停样式 */
    cursor?: string
    /** 点击时是否置顶 */
    topWhenClick?: boolean
    /** 文本样式 */
    style?: AmapTextStyle
}

/** 文本标记构造参数 */
export interface AmapTextOptions extends AmapTextBaseOptions {
    [key: string]: unknown
}

/** 文本标记实例 */
export interface AmapTextInstance extends AmapPointOverlayInstance {
    /** 获取文本内容 */
    getText?: () => string | undefined
    /** 设置文本内容 */
    setText?: (text: string) => void
    /** 设置文本样式 */
    setStyle?: (style: AmapTextStyle) => void
    /** 设置偏移量 */
    setOffset?: (offset: AmapMarkerOffset) => void
    /** 设置锚点 */
    setAnchor?: (anchor: AmapMarkerAnchor) => void
    /** 设置旋转角度 */
    setAngle?: (angle: number) => void
}

/** 灵活点标记图标样式 */
export interface AmapElasticMarkerIconOptions {
    /** 图标地址 */
    img?: string
    /** 图标显示大小 */
    size?: AmapMarkerOffset
    /** 图标锚点 */
    anchor?: AmapMarkerAnchor
    /** 图片偏移量 */
    imageOffset?: AmapMarkerOffset
    /** 图片大小 */
    imageSize?: number | AmapMarkerOffset
    /** 最合适的缩放级别 */
    fitZoom?: number
    /** 缩放比例系数 */
    scaleFactor?: number
    /** 最大放大比例 */
    maxScale?: number
    /** 最小放大比例 */
    minScale?: number
    [key: string]: unknown
}

/** 灵活点标记文本样式 */
export interface AmapElasticMarkerLabelOptions {
    /** 文本内容 */
    content?: string
    /** 文本位置 */
    position?: AmapElasticMarkerLabelPosition
    /** 文本偏移量 */
    offset?: AmapMarkerOffset
    /** 最小显示级别 */
    minZoom?: number
    [key: string]: unknown
}

/** 灵活点标记样式 */
export interface AmapElasticMarkerStyleOptions {
    /** 图标样式 */
    icon?: AmapElasticMarkerIconOptions
    /** 文本样式 */
    label?: AmapElasticMarkerLabelOptions
    [key: string]: unknown
}

/** 灵活点标记基础参数 */
export interface AmapElasticMarkerBaseOptions extends AmapPointOverlayOptions {
    /** 点标记坐标 */
    position?: AmapMarkerPosition
    /** 叠加层级 */
    zIndex?: number
    /** 偏移量 */
    offset?: AmapMarkerOffset
    /** 是否可点击 */
    clickable?: boolean
    /** 是否可拖拽 */
    draggable?: boolean
    /** 事件是否冒泡 */
    bubble?: boolean
    /** 鼠标悬停样式 */
    cursor?: string
    /** 点击时是否置顶 */
    topWhenClick?: boolean
    /** 地图级别与样式索引映射 */
    zoomStyleMapping?: Record<string, number>
    /** 样式列表 */
    styles?: AmapElasticMarkerStyleOptions[]
}

/** 灵活点标记构造参数 */
export interface AmapElasticMarkerOptions extends AmapElasticMarkerBaseOptions {
    [key: string]: unknown
}

/** 灵活点标记实例 */
export interface AmapElasticMarkerInstance extends AmapPointOverlayInstance {}

/** 标注图标参数 */
export interface AmapLabelMarkerIconOptions {
    /** 图标类型 */
    type?: string
    /** 图标地址 */
    image?: string
    /** 图标大小 */
    size?: AmapMarkerOffset
    /** 图片裁剪起点 */
    clipOrigin?: AmapMarkerOffset
    /** 图片裁剪大小 */
    clipSize?: AmapMarkerOffset
    /** 图标锚点 */
    anchor?: AmapMarkerAnchor
    [key: string]: unknown
}

/** 标注文本样式 */
export interface AmapLabelMarkerTextStyle {
    /** 字体大小 */
    fontSize?: number
    /** 字体粗细 */
    fontWeight?: string
    /** 字体颜色 */
    fillColor?: string
    /** 描边颜色 */
    strokeColor?: string
    /** 描边宽度 */
    strokeWidth?: number
    /** 内边距 */
    padding?: string
    /** 背景颜色 */
    backgroundColor?: string
    /** 边框颜色 */
    borderColor?: string
    /** 边框宽度 */
    borderWidth?: number
    [key: string]: unknown
}

/** 标注文本参数 */
export interface AmapLabelMarkerTextOptions {
    /** 文本内容 */
    content?: string
    /** 文本方向 */
    direction?: AmapMarkerLabelDirection
    /** 文本偏移量 */
    offset?: AmapMarkerOffset
    /** 文本样式 */
    style?: AmapLabelMarkerTextStyle
    [key: string]: unknown
}

/** 标注基础参数 */
export interface AmapLabelMarkerBaseOptions {
    /** 标注名称 */
    name?: string
    /** 标注坐标 */
    position?: AmapLabelMarkerPosition
    /** 显示缩放级别范围 */
    zooms?: AmapZoomRange
    /** 透明度 */
    opacity?: number
    /** 避让优先级 */
    rank?: number
    /** 叠加层级 */
    zIndex?: number
    /** 是否可见 */
    visible?: boolean
    /** 自定义数据 */
    extData?: unknown
    /** 图标参数 */
    icon?: AmapLabelMarkerIconOptions
    /** 文本参数 */
    text?: AmapLabelMarkerTextOptions
    [key: string]: unknown
}

/** 标注构造参数 */
export interface AmapLabelMarkerOptions extends AmapLabelMarkerBaseOptions {
    [key: string]: unknown
}

/** 标注实例 */
export interface AmapLabelMarkerInstance {
    /** 显示标注 */
    show?: () => void
    /** 隐藏标注 */
    hide?: () => void
    /** 绑定事件 */
    on?: (eventName: string, handler: AmapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: AmapEventHandler) => void
    /** 设置参数 */
    setOptions?: (options: AmapLabelMarkerOptions) => void
    /** 设置位置 */
    setPosition?: (position: AmapLabelMarkerPosition) => void
    /** 设置自定义数据 */
    setExtData?: (extData: unknown) => void
    /** 设置叠加层级 */
    setzIndex?: (zIndex: number) => void
    /** 设置透明度 */
    setOpacity?: (opacity: number) => void
    /** 设置避让优先级 */
    setRank?: (rank: number) => void
    [key: string]: unknown
}

/** 标注图层基础参数 */
export interface AmapLabelsLayerBaseOptions {
    /** 图层缩放范围 */
    zooms?: AmapZoomRange
    /** 图层层级 */
    zIndex?: number
    /** 是否可见 */
    visible?: boolean
    /** 是否开启避让 */
    collision?: boolean
    /** 是否允许和底图标注重叠 */
    allowCollision?: boolean
    /** 是否启用动画 */
    animation?: boolean
    [key: string]: unknown
}

/** 标注图层构造参数 */
export interface AmapLabelsLayerOptions extends AmapLabelsLayerBaseOptions {
    [key: string]: unknown
}

/** 标注图层实例 */
export interface AmapLabelsLayerInstance {
    /** 添加标注 */
    add?: (markers: AmapLabelMarkerInstance | AmapLabelMarkerInstance[]) => void
    /** 移除标注 */
    remove?: (markers: AmapLabelMarkerInstance | AmapLabelMarkerInstance[]) => void
    /** 清空标注 */
    clear?: () => void
    /** 设置地图 */
    setMap?: (map: AmapMapInstance | null) => void
    /** 设置参数 */
    setOptions?: (options: AmapLabelsLayerOptions) => void
    /** 设置是否允许和底图标注重叠 */
    setAllowCollision?: (allowCollision: boolean) => void
    /** 设置层级 */
    setzIndex?: (zIndex: number) => void
    /** 显示图层 */
    show?: () => void
    /** 隐藏图层 */
    hide?: () => void
    /** 绑定事件 */
    on?: (eventName: string, handler: AmapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: AmapEventHandler) => void
    [key: string]: unknown
}

/** 海量点数据 */
export interface AmapMassMarksData {
    /** 经纬度 */
    lnglat: AmapLngLatLike
    /** 样式索引 */
    style?: number
    [key: string]: unknown
}

/** 海量点样式 */
export interface AmapMassMarksStyleOptions {
    /** 图标地址 */
    url?: string
    /** 图标大小 */
    size?: AmapMarkerOffset
    /** 旋转角度 */
    rotation?: number
    /** 锚点 */
    anchor?: AmapMarkerOffset
    /** 层级 */
    zIndex?: number
    [key: string]: unknown
}

/** 海量点基础参数 */
export interface AmapMassMarksBaseOptions {
    /** 透明度 */
    opacity?: number
    /** 图层层级 */
    zIndex?: number
    /** 缩放范围 */
    zooms?: AmapZoomRange
    /** 鼠标悬停样式 */
    cursor?: string
    /** 样式 */
    style?: AmapMassMarksStyleOptions | AmapMassMarksStyleOptions[]
    /** 是否可见 */
    visible?: boolean
    [key: string]: unknown
}

/** 海量点构造参数 */
export interface AmapMassMarksOptions extends AmapMassMarksBaseOptions {
    [key: string]: unknown
}

/** 海量点实例 */
export interface AmapMassMarksInstance {
    /** 设置地图 */
    setMap?: (map: AmapMapInstance | null) => void
    /** 获取数据 */
    getData?: () => AmapMassMarksData[]
    /** 设置数据 */
    setData?: (data: AmapMassMarksData[]) => void
    /** 获取样式 */
    getStyle?: () => AmapMassMarksStyleOptions | AmapMassMarksStyleOptions[]
    /** 设置样式 */
    setStyle?: (style: AmapMassMarksStyleOptions | AmapMassMarksStyleOptions[]) => void
    /** 设置透明度 */
    setOpacity?: (opacity: number) => void
    /** 设置层级 */
    setzIndex?: (zIndex: number) => void
    /** 设置缩放范围 */
    setZooms?: (zooms: AmapZoomRange) => void
    /** 显示 */
    show?: () => void
    /** 隐藏 */
    hide?: () => void
    /** 清空 */
    clear?: () => void
    /** 绑定事件 */
    on?: (eventName: string, handler: AmapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: AmapEventHandler) => void
    [key: string]: unknown
}

/** 点聚合数据 */
export interface AmapMarkerClusterData {
    /** 经纬度 */
    lnglat: AmapLngLatLike
    /** 权重 */
    weight?: number
    [key: string]: unknown
}

/** 点聚合样式 */
export interface AmapMarkerClusterStyleOptions {
    /** 图标地址 */
    url?: string
    /** 图标大小 */
    size?: unknown
    /** 偏移量 */
    offset?: unknown
    /** 图片偏移量 */
    imageOffset?: unknown
    /** 文本颜色 */
    textColor?: string
    /** 文本大小 */
    textSize?: number
    [key: string]: unknown
}

/** 点聚合基础参数 */
export interface AmapMarkerClusterBaseOptions {
    /** 聚合网格像素大小 */
    gridSize?: number
    /** 最大聚合缩放级别 */
    maxZoom?: number
    /** 聚合点是否使用平均中心 */
    averageCenter?: boolean
    /** 地图缩放过程中是否聚合 */
    clusterByZoomChange?: boolean
    /** 聚合样式 */
    styles?: AmapMarkerClusterStyleOptions[]
    /** 自定义聚合点渲染 */
    renderClusterMarker?: (context: Record<string, unknown>) => void
    /** 自定义非聚合点渲染 */
    renderMarker?: (context: Record<string, unknown>) => void
    [key: string]: unknown
}

/** 点聚合构造参数 */
export interface AmapMarkerClusterOptions extends AmapMarkerClusterBaseOptions {
    [key: string]: unknown
}

/** 点聚合实例 */
export interface AmapMarkerClusterInstance {
    /** 添加数据 */
    addData?: (data: AmapMarkerClusterData[]) => void
    /** 设置数据 */
    setData?: (data: AmapMarkerClusterData[]) => void
    /** 设置网格大小 */
    setGridSize?: (size: number) => void
    /** 设置最大聚合缩放级别 */
    setMaxZoom?: (zoom: number) => void
    /** 设置样式 */
    setStyles?: (styles: AmapMarkerClusterStyleOptions[]) => void
    /** 设置平均中心 */
    setAverageCenter?: (averageCenter: boolean) => void
    /** 设置地图 */
    setMap?: (map: AmapMapInstance | null) => void
    /** 获取地图 */
    getMap?: () => AmapMapInstance | null
    /** 绑定事件 */
    on?: (eventName: string, handler: AmapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: AmapEventHandler) => void
    [key: string]: unknown
}

/** 支持点标记扩展构造器的高德命名空间 */
export interface AmapPointNamespace extends AmapNamespace {
    /** Text 构造器 */
    Text?: new (options?: AmapTextOptions) => AmapTextInstance
    /** ElasticMarker 构造器 */
    ElasticMarker?: new (options?: AmapElasticMarkerOptions) => AmapElasticMarkerInstance
    /** LabelMarker 构造器 */
    LabelMarker?: new (options?: AmapLabelMarkerOptions) => AmapLabelMarkerInstance
    /** LabelsLayer 构造器 */
    LabelsLayer?: new (options?: AmapLabelsLayerOptions) => AmapLabelsLayerInstance
    /** MassMarks 构造器 */
    MassMarks?: new (data?: AmapMassMarksData[], options?: AmapMassMarksOptions) => AmapMassMarksInstance
    /** MarkerCluster 构造器 */
    MarkerCluster?: new (
        map: AmapMapInstance,
        data?: AmapMarkerClusterData[],
        options?: AmapMarkerClusterOptions
    ) => AmapMarkerClusterInstance
}

/** 设置 ref 参数 */
export interface SetAmapPointRefParams<TInstance> {
    /** 外部 ref */
    ref?: Ref<TInstance | null>
    /** 实例 */
    instance: TInstance | null
}

/** 事件绑定参数 */
export interface BindAmapPointEventsParams<TInstance extends AmapPointEventTarget> {
    /** 实例 */
    instance: TInstance
    /** 事件映射 */
    events?: AmapMarkerEvents
}

/** 点事件目标 */
export interface AmapPointEventTarget {
    /** 绑定事件 */
    on?: (eventName: string, handler: AmapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: AmapEventHandler) => void
}

/** 文本标记组件属性 */
export interface TextProps extends AmapTextBaseOptions, AmapEventShortcutProps {
    /** 文本标记实例 ref */
    ref?: Ref<AmapTextInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 文本标记额外参数 */
    textOptions?: AmapTextOptions
    /** 文本标记事件映射 */
    events?: AmapMarkerEvents
    /** 创建完成回调 */
    onLoad?: AmapPointOverlayOnLoad<AmapTextInstance>
    /** 销毁前回调 */
    onDestroy?: AmapPointOverlayOnDestroy<AmapTextInstance>
}

/** 灵活点标记组件属性 */
export interface ElasticMarkerProps extends AmapElasticMarkerBaseOptions, AmapEventShortcutProps {
    /** 灵活点标记实例 ref */
    ref?: Ref<AmapElasticMarkerInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 灵活点标记额外参数 */
    elasticMarkerOptions?: AmapElasticMarkerOptions
    /** 灵活点标记事件映射 */
    events?: AmapMarkerEvents
    /** 创建完成回调 */
    onLoad?: AmapPointOverlayOnLoad<AmapElasticMarkerInstance>
    /** 销毁前回调 */
    onDestroy?: AmapPointOverlayOnDestroy<AmapElasticMarkerInstance>
}

/** 标注图层组件属性 */
export interface LabelsLayerProps extends AmapLabelsLayerBaseOptions, AmapEventShortcutProps {
    /** 标注图层实例 ref */
    ref?: Ref<AmapLabelsLayerInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 子标注 */
    children?: ReactNode
    /** 标注图层额外参数 */
    labelsLayerOptions?: AmapLabelsLayerOptions
    /** 标注图层事件映射 */
    events?: AmapMarkerEvents
    /** 创建完成回调 */
    onLoad?: (layer: AmapLabelsLayerInstance) => void
    /** 销毁前回调 */
    onDestroy?: (layer: AmapLabelsLayerInstance) => void
}

/** 标注组件属性 */
export interface LabelMarkerProps extends AmapLabelMarkerBaseOptions, AmapEventShortcutProps {
    /** 标注实例 ref */
    ref?: Ref<AmapLabelMarkerInstance | null>
    /** 标注图层实例 */
    layer?: AmapLabelsLayerInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 标注额外参数 */
    labelMarkerOptions?: AmapLabelMarkerOptions
    /** 标注事件映射 */
    events?: AmapMarkerEvents
    /** 创建完成回调 */
    onLoad?: (marker: AmapLabelMarkerInstance) => void
    /** 销毁前回调 */
    onDestroy?: (marker: AmapLabelMarkerInstance) => void
}

/** 海量点组件属性 */
export interface MassMarksProps extends AmapMassMarksBaseOptions, AmapEventShortcutProps {
    /** 海量点实例 ref */
    ref?: Ref<AmapMassMarksInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 海量点数据 */
    data?: AmapMassMarksData[]
    /** 海量点额外参数 */
    massMarksOptions?: AmapMassMarksOptions
    /** 海量点事件映射 */
    events?: AmapMarkerEvents
    /** 创建完成回调 */
    onLoad?: (massMarks: AmapMassMarksInstance) => void
    /** 销毁前回调 */
    onDestroy?: (massMarks: AmapMassMarksInstance) => void
}

/** 点聚合组件属性 */
export interface MarkerClusterProps extends AmapMarkerClusterBaseOptions, AmapEventShortcutProps {
    /** 点聚合实例 ref */
    ref?: Ref<AmapMarkerClusterInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 聚合数据 */
    data?: AmapMarkerClusterData[]
    /** 点聚合额外参数 */
    markerClusterOptions?: AmapMarkerClusterOptions
    /** 点聚合事件映射 */
    events?: AmapMarkerEvents
    /** 创建完成回调 */
    onLoad?: (markerCluster: AmapMarkerClusterInstance) => void
    /** 销毁前回调 */
    onDestroy?: (markerCluster: AmapMarkerClusterInstance) => void
}

/** LabelsLayer 上下文 */
export const LabelsLayerContext = createContext<AmapLabelsLayerInstance | null>(null)

export function useLabelsLayerContext() {
    return useContext(LabelsLayerContext)
}

function setAmapPointRef<TInstance>({ ref, instance }: SetAmapPointRefParams<TInstance>) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(instance)
        return
    }

    ref.current = instance
}

function bindAmapPointEvents<TInstance extends AmapPointEventTarget>({
    instance,
    events,
}: BindAmapPointEventsParams<TInstance>) {
    const eventEntries = Object.entries(events ?? {})

    eventEntries.forEach(([eventName, handler]) => instance.on?.(eventName, handler))

    return function unbindAmapPointEvents() {
        eventEntries.forEach(([eventName, handler]) => instance.off?.(eventName, handler))
    }
}

function removeAmapPointOverlay<TInstance extends AmapPointOverlayInstance>(
    overlay: TInstance,
    onDestroy?: AmapPointOverlayOnDestroy<TInstance>
) {
    try {
        onDestroy?.(overlay)
    } finally {
        if (overlay.remove) {
            overlay.remove()
        } else {
            overlay.setMap?.(null)
        }
    }
}

function updateAmapPointOverlay<TInstance extends AmapPointOverlayInstance>(
    overlay: TInstance,
    options: AmapPointOverlayOptions
) {
    overlay.setOptions?.(options)

    if (options.position !== undefined) overlay.setPosition?.(options.position as AmapMarkerPosition)
    if (typeof options.title === "string") overlay.setTitle?.(options.title)
    if (typeof options.clickable === "boolean") overlay.setClickable?.(options.clickable)
    if (typeof options.draggable === "boolean") overlay.setDraggable?.(options.draggable)
    if (options.extData !== undefined) overlay.setExtData?.(options.extData)
    if (typeof options.zIndex === "number") overlay.setzIndex?.(options.zIndex)
    if (typeof options.cursor === "string") overlay.setCursor?.(options.cursor)

    if (options.visible === undefined) return

    if (options.visible) {
        overlay.show?.()
        return
    }

    overlay.hide?.()
}

function updateAmapText(text: AmapTextInstance, options: AmapTextOptions) {
    updateAmapPointOverlay(text, options)

    if (typeof options.text === "string") text.setText?.(options.text)
    if (options.style) text.setStyle?.(options.style)
    if (options.offset !== undefined) text.setOffset?.(options.offset)
    if (options.anchor !== undefined) text.setAnchor?.(options.anchor)
    if (typeof options.angle === "number") text.setAngle?.(options.angle)
}

function mergeAmapPointOptions<TOptions extends Record<string, unknown>>(
    options: TOptions | undefined,
    extraOptions: TOptions
) {
    const nextOptions: TOptions = {
        ...options,
    } as TOptions

    Object.entries(extraOptions).forEach(([key, value]) => {
        if (value !== undefined) (nextOptions as Record<string, unknown>)[key] = value
    })

    return nextOptions
}

function updateAmapLabelsLayer(layer: AmapLabelsLayerInstance, options: AmapLabelsLayerOptions) {
    layer.setOptions?.(options)

    if (typeof options.allowCollision === "boolean") layer.setAllowCollision?.(options.allowCollision)
    if (typeof options.zIndex === "number") layer.setzIndex?.(options.zIndex)

    if (options.visible === undefined) return

    if (options.visible) {
        layer.show?.()
        return
    }

    layer.hide?.()
}

function removeAmapLabelsLayer(layer: AmapLabelsLayerInstance, onDestroy?: (layer: AmapLabelsLayerInstance) => void) {
    try {
        onDestroy?.(layer)
    } finally {
        layer.clear?.()
        layer.setMap?.(null)
    }
}

function updateAmapLabelMarker(marker: AmapLabelMarkerInstance, options: AmapLabelMarkerOptions) {
    marker.setOptions?.(options)

    if (options.position !== undefined) marker.setPosition?.(options.position)
    if (options.extData !== undefined) marker.setExtData?.(options.extData)
    if (typeof options.zIndex === "number") marker.setzIndex?.(options.zIndex)
    if (typeof options.opacity === "number") marker.setOpacity?.(options.opacity)
    if (typeof options.rank === "number") marker.setRank?.(options.rank)

    if (options.visible === undefined) return

    if (options.visible) {
        marker.show?.()
        return
    }

    marker.hide?.()
}

function updateAmapMassMarks(massMarks: AmapMassMarksInstance, data: AmapMassMarksData[], options: AmapMassMarksOptions) {
    massMarks.setData?.(data)

    if (options.style) massMarks.setStyle?.(options.style)
    if (typeof options.opacity === "number") massMarks.setOpacity?.(options.opacity)
    if (typeof options.zIndex === "number") massMarks.setzIndex?.(options.zIndex)
    if (options.zooms) massMarks.setZooms?.(options.zooms)

    if (options.visible === undefined) return

    if (options.visible) {
        massMarks.show?.()
        return
    }

    massMarks.hide?.()
}

function updateAmapMarkerCluster(
    markerCluster: AmapMarkerClusterInstance,
    data: AmapMarkerClusterData[],
    options: AmapMarkerClusterOptions
) {
    markerCluster.setData?.(data)

    if (typeof options.gridSize === "number") markerCluster.setGridSize?.(options.gridSize)
    if (typeof options.maxZoom === "number") markerCluster.setMaxZoom?.(options.maxZoom)
    if (options.styles) markerCluster.setStyles?.(options.styles)
    if (typeof options.averageCenter === "boolean") markerCluster.setAverageCenter?.(options.averageCenter)
}

export const Text: FC<TextProps> = ({
    ref,
    map,
    AMap,
    textOptions,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useAmapContext()
    const textRef = useRef<AmapTextInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as AmapPointNamespace | null
    const { eventShortcuts, restProps: restOptions } = splitAmapEventShortcutProps(restProps)
    const currentOptions = mergeAmapPointOptions(textOptions, restOptions as AmapTextOptions)
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapMarkerEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialOptions = useEffectEvent(() => currentOptions)

    useStableEffect(() => {
        if (!currentMap || !currentAMap?.Text) return

        const initialOptions = getInitialOptions()
        const text = new currentAMap.Text(initialOptions)

        currentMap.add?.(text)
        textRef.current = text
        setAmapPointRef({
            ref,
            instance: text,
        })
        updateAmapText(text, initialOptions)
        onLoad(text)

        return () => {
            textRef.current = null
            setAmapPointRef({
                ref,
                instance: null,
            })
            removeAmapPointOverlay(text, onDestroy)
        }
    }, [currentAMap, currentMap, ref])

    useStableEffect(() => {
        if (!textRef.current) return

        updateAmapText(textRef.current, currentOptions)
    }, [currentOptions])

    useStableEffect(() => {
        if (!textRef.current) return

        return bindAmapPointEvents({
            instance: textRef.current,
            events: currentEvents,
        })
    }, [currentAMap, currentEvents, currentMap, ref])

    return null
}

export const ElasticMarker: FC<ElasticMarkerProps> = ({
    ref,
    map,
    AMap,
    elasticMarkerOptions,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useAmapContext()
    const markerRef = useRef<AmapElasticMarkerInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as AmapPointNamespace | null
    const { eventShortcuts, restProps: restOptions } = splitAmapEventShortcutProps(restProps)
    const pluginLoaded = useAmapPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName: AmapPlugin.ElasticMarker,
        constructorName: "ElasticMarker",
    })
    const currentOptions = mergeAmapPointOptions(elasticMarkerOptions, restOptions as AmapElasticMarkerOptions)
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapMarkerEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialOptions = useEffectEvent(() => currentOptions)

    useStableEffect(() => {
        if (!currentMap || !currentAMap?.ElasticMarker || !pluginLoaded) return

        const initialOptions = getInitialOptions()
        const marker = new currentAMap.ElasticMarker(initialOptions)

        currentMap.add?.(marker)
        markerRef.current = marker
        setAmapPointRef({
            ref,
            instance: marker,
        })
        updateAmapPointOverlay(marker, initialOptions)
        onLoad(marker)

        return () => {
            markerRef.current = null
            setAmapPointRef({
                ref,
                instance: null,
            })
            removeAmapPointOverlay(marker, onDestroy)
        }
    }, [currentAMap, currentMap, pluginLoaded, ref])

    useStableEffect(() => {
        if (!markerRef.current) return

        updateAmapPointOverlay(markerRef.current, currentOptions)
    }, [currentOptions])

    useStableEffect(() => {
        if (!markerRef.current) return

        return bindAmapPointEvents({
            instance: markerRef.current,
            events: currentEvents,
        })
    }, [currentAMap, currentEvents, currentMap, pluginLoaded, ref])

    return null
}

export const LabelsLayer: FC<LabelsLayerProps> = ({
    ref,
    map,
    AMap,
    children,
    labelsLayerOptions,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useAmapContext()
    const layerRef = useRef<AmapLabelsLayerInstance | null>(null)
    const [contextLayer, setContextLayer] = useState<AmapLabelsLayerInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as AmapPointNamespace | null
    const { eventShortcuts, restProps: restOptions } = splitAmapEventShortcutProps(restProps)
    const currentOptions = mergeAmapPointOptions(labelsLayerOptions, restOptions as AmapLabelsLayerOptions)
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapMarkerEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialOptions = useEffectEvent(() => currentOptions)

    useStableEffect(() => {
        if (!currentMap || !currentAMap?.LabelsLayer) return

        const initialOptions = getInitialOptions()
        const layer = new currentAMap.LabelsLayer(initialOptions)

        currentMap.add?.(layer)
        layerRef.current = layer
        setContextLayer(layer)
        setAmapPointRef({
            ref,
            instance: layer,
        })
        updateAmapLabelsLayer(layer, initialOptions)
        onLoad(layer)

        return () => {
            layerRef.current = null
            setContextLayer(null)
            setAmapPointRef({
                ref,
                instance: null,
            })
            removeAmapLabelsLayer(layer, onDestroy)
        }
    }, [currentAMap, currentMap, ref])

    useStableEffect(() => {
        if (!layerRef.current) return

        updateAmapLabelsLayer(layerRef.current, currentOptions)
    }, [currentOptions])

    useStableEffect(() => {
        if (!layerRef.current) return

        return bindAmapPointEvents({
            instance: layerRef.current,
            events: currentEvents,
        })
    }, [currentAMap, currentEvents, currentMap, ref])

    return <LabelsLayerContext value={contextLayer}>{children}</LabelsLayerContext>
}

export const LabelMarker: FC<LabelMarkerProps> = ({
    ref,
    layer,
    AMap,
    labelMarkerOptions,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useAmapContext()
    const contextLayer = useLabelsLayerContext()
    const markerRef = useRef<AmapLabelMarkerInstance | null>(null)
    const currentLayer = layer ?? contextLayer
    const currentAMap = (AMap ?? context.AMap) as AmapPointNamespace | null
    const { eventShortcuts, restProps: restOptions } = splitAmapEventShortcutProps(restProps)
    const currentOptions = mergeAmapPointOptions(labelMarkerOptions, restOptions as AmapLabelMarkerOptions)
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapMarkerEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialOptions = useEffectEvent(() => currentOptions)

    useStableEffect(() => {
        if (!currentLayer || !currentAMap?.LabelMarker) return

        const initialOptions = getInitialOptions()
        const marker = new currentAMap.LabelMarker(initialOptions)

        currentLayer.add?.(marker)
        markerRef.current = marker
        setAmapPointRef({
            ref,
            instance: marker,
        })
        updateAmapLabelMarker(marker, initialOptions)
        onLoad(marker)

        return () => {
            markerRef.current = null
            setAmapPointRef({
                ref,
                instance: null,
            })

            try {
                onDestroy(marker)
            } finally {
                currentLayer.remove?.(marker)
            }
        }
    }, [currentAMap, currentLayer, ref])

    useStableEffect(() => {
        if (!markerRef.current) return

        updateAmapLabelMarker(markerRef.current, currentOptions)
    }, [currentOptions])

    useStableEffect(() => {
        if (!markerRef.current) return

        return bindAmapPointEvents({
            instance: markerRef.current,
            events: currentEvents,
        })
    }, [currentAMap, currentEvents, currentLayer, ref])

    return null
}

export const MassMarks: FC<MassMarksProps> = ({
    ref,
    map,
    AMap,
    data = [],
    massMarksOptions,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useAmapContext()
    const massMarksRef = useRef<AmapMassMarksInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as AmapPointNamespace | null
    const { eventShortcuts, restProps: restOptions } = splitAmapEventShortcutProps(restProps)
    const currentOptions = mergeAmapPointOptions(massMarksOptions, restOptions as AmapMassMarksOptions)
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapMarkerEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialOptions = useEffectEvent(() => currentOptions)
    const getInitialData = useEffectEvent(() => data)

    useStableEffect(() => {
        if (!currentMap || !currentAMap?.MassMarks) return

        const initialData = getInitialData()
        const initialOptions = getInitialOptions()
        const massMarks = new currentAMap.MassMarks(initialData, initialOptions)

        currentMap.add?.(massMarks)
        massMarksRef.current = massMarks
        setAmapPointRef({
            ref,
            instance: massMarks,
        })
        updateAmapMassMarks(massMarks, initialData, initialOptions)
        onLoad(massMarks)

        return () => {
            massMarksRef.current = null
            setAmapPointRef({
                ref,
                instance: null,
            })

            try {
                onDestroy(massMarks)
            } finally {
                massMarks.clear?.()
                massMarks.setMap?.(null)
            }
        }
    }, [currentAMap, currentMap, ref])

    useStableEffect(() => {
        if (!massMarksRef.current) return

        updateAmapMassMarks(massMarksRef.current, data, currentOptions)
    }, [currentOptions, data])

    useStableEffect(() => {
        if (!massMarksRef.current) return

        return bindAmapPointEvents({
            instance: massMarksRef.current,
            events: currentEvents,
        })
    }, [currentAMap, currentEvents, currentMap, ref])

    return null
}

export const MarkerCluster: FC<MarkerClusterProps> = ({
    ref,
    map,
    AMap,
    data = [],
    markerClusterOptions,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useAmapContext()
    const markerClusterRef = useRef<AmapMarkerClusterInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as AmapPointNamespace | null
    const { eventShortcuts, restProps: restOptions } = splitAmapEventShortcutProps(restProps)
    const pluginLoaded = useAmapPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName: AmapPlugin.MarkerCluster,
        constructorName: "MarkerCluster",
    })
    const currentOptions = mergeAmapPointOptions(markerClusterOptions, restOptions as AmapMarkerClusterOptions)
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapMarkerEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialOptions = useEffectEvent(() => currentOptions)
    const getInitialData = useEffectEvent(() => data)

    useStableEffect(() => {
        if (!currentMap || !currentAMap?.MarkerCluster || !pluginLoaded) return

        const initialData = getInitialData()
        const initialOptions = getInitialOptions()
        const markerCluster = new currentAMap.MarkerCluster(currentMap, initialData, initialOptions)

        markerClusterRef.current = markerCluster
        setAmapPointRef({
            ref,
            instance: markerCluster,
        })
        updateAmapMarkerCluster(markerCluster, initialData, initialOptions)
        onLoad(markerCluster)

        return () => {
            markerClusterRef.current = null
            setAmapPointRef({
                ref,
                instance: null,
            })

            try {
                onDestroy(markerCluster)
            } finally {
                markerCluster.setMap?.(null)
            }
        }
    }, [currentAMap, currentMap, pluginLoaded, ref])

    useStableEffect(() => {
        if (!markerClusterRef.current) return

        updateAmapMarkerCluster(markerClusterRef.current, data, currentOptions)
    }, [currentOptions, data])

    useStableEffect(() => {
        if (!markerClusterRef.current) return

        return bindAmapPointEvents({
            instance: markerClusterRef.current,
            events: currentEvents,
        })
    }, [currentAMap, currentEvents, currentMap, pluginLoaded, ref])

    return null
}
