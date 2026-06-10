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
    MapPlugin,
    type MapEventHandler,
    type MapLngLatLike,
    type MapInstance,
    type MapNamespace,
    type MapZoomRange,
    useMapContext,
} from "./Map"
import { type MapGroupChildSync, type MapGroupChildSyncCleanup, useLayerGroupContext } from "./Group"
import type {
    MapMarkerAnchor,
    MapMarkerLabelDirection,
    MapMarkerOffset,
    MapMarkerPosition,
    MapMarkerEvents,
} from "./Marker"
import { optionalFn } from "../utils/optionalFn"
import { useMapPlugin } from "../hooks/useMapPlugin"
import { useStableEffect } from "../hooks/useStableEffect"
import {
    type MapMoveEvent,
    type MapOverlayEventShortcutProps,
    type MapOverlayInteractionEvent,
    type MapOverlayMouseEvent,
    type MapTargetEvent,
    getMapEventEntries,
    mergeMapEvents,
    splitMapEventShortcutProps,
} from "../utils/mapEvents"

export type MapTextStyle = Record<string, string | number>

export type MapLabelMarkerPosition = MapLngLatLike

/** 灵活点标记文本位置 */
export const MapElasticMarkerLabelPosition = {
    左下角: "BL",
    底部居中: "BM",
    右下角: "BR",
    左侧居中: "ML",
    右侧居中: "MR",
    左上角: "TL",
    顶部居中: "TM",
    右上角: "TR",
} as const

export type MapElasticMarkerLabelPosition =
    (typeof MapElasticMarkerLabelPosition)[keyof typeof MapElasticMarkerLabelPosition]

export type MapPointOverlayOnLoad<TInstance extends MapPointOverlayInstance = MapPointOverlayInstance> = (
    overlay: TInstance
) => void

export type MapPointOverlayOnDestroy<TInstance extends MapPointOverlayInstance = MapPointOverlayInstance> = (
    overlay: TInstance
) => void

/** 点覆盖物鼠标事件 */
export interface MapPointOverlayMouseEvent<TInstance = MapPointOverlayInstance> extends MapOverlayMouseEvent<TInstance> {}

/** 点覆盖物交互坐标事件 */
export interface MapPointOverlayInteractionEvent<TInstance = MapPointOverlayInstance>
    extends MapOverlayInteractionEvent<TInstance> {}

/** 点覆盖物目标事件 */
export interface MapPointOverlayTargetEvent<TInstance = MapPointOverlayInstance> extends MapTargetEvent<TInstance> {}

/** 点覆盖物移动动画事件 */
export interface MapPointOverlayMoveEvent<TInstance = MapPointOverlayInstance> extends MapMoveEvent<TInstance> {}

/** 点覆盖物事件快捷属性 */
export interface MapPointOverlayEventShortcutProps<TInstance = MapPointOverlayInstance>
    extends MapOverlayEventShortcutProps<TInstance> {}

/** 点标记覆盖物基础实例 */
export interface MapPointOverlayInstance {
    /** 获取地图实例 */
    getMap?: () => MapInstance | null
    /** 设置地图实例 */
    setMap?: (map: MapInstance | null) => void
    /** 移除覆盖物 */
    remove?: () => void
    /** 显示覆盖物 */
    show?: () => void
    /** 隐藏覆盖物 */
    hide?: () => void
    /** 绑定事件 */
    on?: (eventName: string, handler: MapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: MapEventHandler) => void
    /** 设置参数 */
    setOptions?: (options: MapPointOverlayOptions) => void
    /** 设置位置 */
    setPosition?: (position: MapMarkerPosition) => void
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
}

/** 点标记覆盖物构造参数 */
export interface MapPointOverlayOptions {
    /** 所在地图 */
    map?: MapInstance
    /** 是否可见 */
    visible?: boolean
    /** 自定义数据 */
    extData?: unknown
}

/** 点标记覆盖物运行时可同步参数 */
export interface MapPointOverlayRuntimeOptions extends MapPointOverlayOptions {
    /** 点标记坐标 */
    position?: MapMarkerPosition
    /** 鼠标悬停文字 */
    title?: string
    /** 是否可点击 */
    clickable?: boolean
    /** 是否可拖拽 */
    draggable?: boolean
    /** 叠加层级 */
    zIndex?: number
    /** 鼠标悬停样式 */
    cursor?: string
}

/** 文本标记基础参数 */
export interface MapTextBaseOptions extends MapPointOverlayOptions {
    /** 文本标记坐标 */
    position?: MapMarkerPosition
    /** 文本内容 */
    text?: string
    /** 鼠标悬停文字 */
    title?: string
    /** 叠加层级 */
    zIndex?: number
    /** 偏移量 */
    offset?: MapMarkerOffset
    /** 锚点 */
    anchor?: MapMarkerAnchor
    /** 旋转角度 */
    angle?: number
    /** 是否可点击 */
    clickable?: boolean
    /** 是否可拖拽 */
    draggable?: boolean
    /** 事件是否冒泡 */
    bubble?: boolean
    /** 显示缩放级别范围 */
    zooms?: MapZoomRange
    /** 鼠标悬停样式 */
    cursor?: string
    /** 点击时是否置顶 */
    topWhenClick?: boolean
    /** 文本样式 */
    style?: MapTextStyle
}

/** 文本标记构造参数 */
export interface MapTextOptions extends MapTextBaseOptions {
}

/** 文本标记实例 */
export interface MapTextInstance extends MapPointOverlayInstance {
    /** 获取文本内容 */
    getText?: () => string | undefined
    /** 设置文本内容 */
    setText?: (text: string) => void
    /** 设置文本样式 */
    setStyle?: (style: MapTextStyle) => void
    /** 设置偏移量 */
    setOffset?: (offset: MapMarkerOffset) => void
    /** 设置锚点 */
    setAnchor?: (anchor: MapMarkerAnchor) => void
    /** 设置旋转角度 */
    setAngle?: (angle: number) => void
}

/** 灵活点标记图标样式 */
export interface MapElasticMarkerIconOptions {
    /** 图标地址 */
    img?: string
    /** 图标显示大小 */
    size?: MapMarkerOffset
    /** 图标锚点 */
    anchor?: MapMarkerAnchor
    /** 图片偏移量 */
    imageOffset?: MapMarkerOffset
    /** 图片大小 */
    imageSize?: number | MapMarkerOffset
    /** 最合适的缩放级别 */
    fitZoom?: number
    /** 缩放比例系数 */
    scaleFactor?: number
    /** 最大放大比例 */
    maxScale?: number
    /** 最小放大比例 */
    minScale?: number
}

/** 灵活点标记文本样式 */
export interface MapElasticMarkerLabelOptions {
    /** 文本内容 */
    content?: string
    /** 文本位置 */
    position?: MapElasticMarkerLabelPosition
    /** 文本偏移量 */
    offset?: MapMarkerOffset
    /** 最小显示级别 */
    minZoom?: number
}

/** 灵活点标记样式 */
export interface MapElasticMarkerStyleOptions {
    /** 图标样式 */
    icon?: MapElasticMarkerIconOptions
    /** 文本样式 */
    label?: MapElasticMarkerLabelOptions
}

/** 灵活点标记基础参数 */
export interface MapElasticMarkerBaseOptions extends MapPointOverlayOptions {
    /** 点标记坐标 */
    position?: MapMarkerPosition
    /** 叠加层级 */
    zIndex?: number
    /** 偏移量 */
    offset?: MapMarkerOffset
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
    styles?: MapElasticMarkerStyleOptions[]
}

/** 灵活点标记构造参数 */
export interface MapElasticMarkerOptions extends MapElasticMarkerBaseOptions {
}

/** 灵活点标记实例 */
export interface MapElasticMarkerInstance extends MapPointOverlayInstance {}

/** 标注图标参数 */
export interface MapLabelMarkerIconOptions {
    /** 图标类型 */
    type?: string
    /** 图标地址 */
    image?: string
    /** 图标大小 */
    size?: MapMarkerOffset
    /** 图片裁剪起点 */
    clipOrigin?: MapMarkerOffset
    /** 图片裁剪大小 */
    clipSize?: MapMarkerOffset
    /** 图标锚点 */
    anchor?: MapMarkerAnchor
}

/** 标注文本样式 */
export interface MapLabelMarkerTextStyle {
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
}

/** 标注文本参数 */
export interface MapLabelMarkerTextOptions {
    /** 文本内容 */
    content?: string
    /** 文本方向 */
    direction?: MapMarkerLabelDirection
    /** 文本偏移量 */
    offset?: MapMarkerOffset
    /** 文本样式 */
    style?: MapLabelMarkerTextStyle
}

/** 标注基础参数 */
export interface MapLabelMarkerBaseOptions {
    /** 标注名称 */
    name?: string
    /** 标注坐标 */
    position?: MapLabelMarkerPosition
    /** 显示缩放级别范围 */
    zooms?: MapZoomRange
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
    icon?: MapLabelMarkerIconOptions
    /** 文本参数 */
    text?: MapLabelMarkerTextOptions
}

/** 标注构造参数 */
export interface MapLabelMarkerOptions extends MapLabelMarkerBaseOptions {
}

/** 标注实例 */
export interface MapLabelMarkerInstance {
    /** 显示标注 */
    show?: () => void
    /** 隐藏标注 */
    hide?: () => void
    /** 绑定事件 */
    on?: (eventName: string, handler: MapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: MapEventHandler) => void
    /** 设置参数 */
    setOptions?: (options: MapLabelMarkerOptions) => void
    /** 设置位置 */
    setPosition?: (position: MapLabelMarkerPosition) => void
    /** 设置自定义数据 */
    setExtData?: (extData: unknown) => void
    /** 设置叠加层级 */
    setzIndex?: (zIndex: number) => void
    /** 设置透明度 */
    setOpacity?: (opacity: number) => void
    /** 设置避让优先级 */
    setRank?: (rank: number) => void
}

/** 标注图层基础参数 */
export interface MapLabelsLayerBaseOptions {
    /** 图层缩放范围 */
    zooms?: MapZoomRange
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
}

/** 标注图层构造参数 */
export interface MapLabelsLayerOptions extends MapLabelsLayerBaseOptions {
}

/** 标注图层实例 */
export interface MapLabelsLayerInstance {
    /** 添加标注 */
    add?: (markers: MapLabelMarkerInstance | MapLabelMarkerInstance[]) => void
    /** 移除标注 */
    remove?: (markers: MapLabelMarkerInstance | MapLabelMarkerInstance[]) => void
    /** 清空标注 */
    clear?: () => void
    /** 设置地图 */
    setMap?: (map: MapInstance | null) => void
    /** 设置参数 */
    setOptions?: (options: MapLabelsLayerOptions) => void
    /** 设置是否允许和底图标注重叠 */
    setAllowCollision?: (allowCollision: boolean) => void
    /** 设置层级 */
    setzIndex?: (zIndex: number) => void
    /** 显示图层 */
    show?: () => void
    /** 隐藏图层 */
    hide?: () => void
    /** 绑定事件 */
    on?: (eventName: string, handler: MapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: MapEventHandler) => void
}

/** 海量点数据 */
export interface MapMassMarksData {
    /** 经纬度 */
    lnglat: MapLngLatLike
    /** 样式索引 */
    style?: number
}

/** 海量点样式 */
export interface MapMassMarksStyleOptions {
    /** 图标地址 */
    url?: string
    /** 图标大小 */
    size?: MapMarkerOffset
    /** 旋转角度 */
    rotation?: number
    /** 锚点 */
    anchor?: MapMarkerOffset
    /** 层级 */
    zIndex?: number
}

/** 海量点基础参数 */
export interface MapMassMarksBaseOptions {
    /** 透明度 */
    opacity?: number
    /** 图层层级 */
    zIndex?: number
    /** 缩放范围 */
    zooms?: MapZoomRange
    /** 鼠标悬停样式 */
    cursor?: string
    /** 样式 */
    style?: MapMassMarksStyleOptions | MapMassMarksStyleOptions[]
    /** 是否可见 */
    visible?: boolean
}

/** 海量点构造参数 */
export interface MapMassMarksOptions extends MapMassMarksBaseOptions {
}

/** 海量点实例 */
export interface MapMassMarksInstance {
    /** 设置地图 */
    setMap?: (map: MapInstance | null) => void
    /** 获取数据 */
    getData?: () => MapMassMarksData[]
    /** 设置数据 */
    setData?: (data: MapMassMarksData[]) => void
    /** 获取样式 */
    getStyle?: () => MapMassMarksStyleOptions | MapMassMarksStyleOptions[]
    /** 设置样式 */
    setStyle?: (style: MapMassMarksStyleOptions | MapMassMarksStyleOptions[]) => void
    /** 设置透明度 */
    setOpacity?: (opacity: number) => void
    /** 设置层级 */
    setzIndex?: (zIndex: number) => void
    /** 设置缩放范围 */
    setZooms?: (zooms: MapZoomRange) => void
    /** 显示 */
    show?: () => void
    /** 隐藏 */
    hide?: () => void
    /** 清空 */
    clear?: () => void
    /** 绑定事件 */
    on?: (eventName: string, handler: MapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: MapEventHandler) => void
}

/** 点聚合数据 */
export interface MapMarkerClusterData {
    /** 经纬度 */
    lnglat: MapLngLatLike
    /** 权重 */
    weight?: number
}

/** 点聚合样式 */
export interface MapMarkerClusterStyleOptions {
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
}

/** 点聚合基础参数 */
export interface MapMarkerClusterBaseOptions {
    /** 聚合网格像素大小 */
    gridSize?: number
    /** 最大聚合缩放级别 */
    maxZoom?: number
    /** 聚合点是否使用平均中心 */
    averageCenter?: boolean
    /** 地图缩放过程中是否聚合 */
    clusterByZoomChange?: boolean
    /** 聚合样式 */
    styles?: MapMarkerClusterStyleOptions[]
    /** 自定义聚合点渲染 */
    renderClusterMarker?: (context: Record<string, unknown>) => void
    /** 自定义非聚合点渲染 */
    renderMarker?: (context: Record<string, unknown>) => void
}

/** 点聚合构造参数 */
export interface MapMarkerClusterOptions extends MapMarkerClusterBaseOptions {
}

/** 点聚合实例 */
export interface MapMarkerClusterInstance {
    /** 添加数据 */
    addData?: (data: MapMarkerClusterData[]) => void
    /** 设置数据 */
    setData?: (data: MapMarkerClusterData[]) => void
    /** 设置网格大小 */
    setGridSize?: (size: number) => void
    /** 设置最大聚合缩放级别 */
    setMaxZoom?: (zoom: number) => void
    /** 设置样式 */
    setStyles?: (styles: MapMarkerClusterStyleOptions[]) => void
    /** 设置平均中心 */
    setAverageCenter?: (averageCenter: boolean) => void
    /** 设置地图 */
    setMap?: (map: MapInstance | null) => void
    /** 获取地图 */
    getMap?: () => MapInstance | null
    /** 绑定事件 */
    on?: (eventName: string, handler: MapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: MapEventHandler) => void
}

/** 文本标记鼠标事件 */
export interface MapTextMouseEvent extends MapPointOverlayMouseEvent<MapTextInstance> {}

/** 文本标记交互坐标事件 */
export interface MapTextInteractionEvent extends MapPointOverlayInteractionEvent<MapTextInstance> {}

/** 文本标记目标事件 */
export interface MapTextTargetEvent extends MapPointOverlayTargetEvent<MapTextInstance> {}

/** 文本标记移动动画事件 */
export interface MapTextMoveEvent extends MapPointOverlayMoveEvent<MapTextInstance> {}

/** 文本标记事件快捷属性 */
export interface MapTextEventShortcutProps extends MapPointOverlayEventShortcutProps<MapTextInstance> {}

/** 灵活点标记鼠标事件 */
export interface MapElasticMarkerMouseEvent extends MapPointOverlayMouseEvent<MapElasticMarkerInstance> {}

/** 灵活点标记交互坐标事件 */
export interface MapElasticMarkerInteractionEvent extends MapPointOverlayInteractionEvent<MapElasticMarkerInstance> {}

/** 灵活点标记目标事件 */
export interface MapElasticMarkerTargetEvent extends MapPointOverlayTargetEvent<MapElasticMarkerInstance> {}

/** 灵活点标记移动动画事件 */
export interface MapElasticMarkerMoveEvent extends MapPointOverlayMoveEvent<MapElasticMarkerInstance> {}

/** 灵活点标记事件快捷属性 */
export interface MapElasticMarkerEventShortcutProps extends MapPointOverlayEventShortcutProps<MapElasticMarkerInstance> {}

/** 标注图层鼠标事件 */
export interface MapLabelsLayerMouseEvent extends MapPointOverlayMouseEvent<MapLabelsLayerInstance> {}

/** 标注图层交互坐标事件 */
export interface MapLabelsLayerInteractionEvent extends MapPointOverlayInteractionEvent<MapLabelsLayerInstance> {}

/** 标注图层目标事件 */
export interface MapLabelsLayerTargetEvent extends MapPointOverlayTargetEvent<MapLabelsLayerInstance> {}

/** 标注图层移动动画事件 */
export interface MapLabelsLayerMoveEvent extends MapPointOverlayMoveEvent<MapLabelsLayerInstance> {}

/** 标注图层事件快捷属性 */
export interface MapLabelsLayerEventShortcutProps extends MapPointOverlayEventShortcutProps<MapLabelsLayerInstance> {}

/** 标注鼠标事件 */
export interface MapLabelMarkerMouseEvent extends MapPointOverlayMouseEvent<MapLabelMarkerInstance> {}

/** 标注交互坐标事件 */
export interface MapLabelMarkerInteractionEvent extends MapPointOverlayInteractionEvent<MapLabelMarkerInstance> {}

/** 标注目标事件 */
export interface MapLabelMarkerTargetEvent extends MapPointOverlayTargetEvent<MapLabelMarkerInstance> {}

/** 标注移动动画事件 */
export interface MapLabelMarkerMoveEvent extends MapPointOverlayMoveEvent<MapLabelMarkerInstance> {}

/** 标注事件快捷属性 */
export interface MapLabelMarkerEventShortcutProps extends MapPointOverlayEventShortcutProps<MapLabelMarkerInstance> {}

/** 海量点鼠标事件 */
export interface MapMassMarksMouseEvent extends MapPointOverlayMouseEvent<MapMassMarksInstance> {}

/** 海量点交互坐标事件 */
export interface MapMassMarksInteractionEvent extends MapPointOverlayInteractionEvent<MapMassMarksInstance> {}

/** 海量点目标事件 */
export interface MapMassMarksTargetEvent extends MapPointOverlayTargetEvent<MapMassMarksInstance> {}

/** 海量点移动动画事件 */
export interface MapMassMarksMoveEvent extends MapPointOverlayMoveEvent<MapMassMarksInstance> {}

/** 海量点事件快捷属性 */
export interface MapMassMarksEventShortcutProps extends MapPointOverlayEventShortcutProps<MapMassMarksInstance> {}

/** 点聚合鼠标事件 */
export interface MapMarkerClusterMouseEvent extends MapPointOverlayMouseEvent<MapMarkerClusterInstance> {}

/** 点聚合交互坐标事件 */
export interface MapMarkerClusterInteractionEvent extends MapPointOverlayInteractionEvent<MapMarkerClusterInstance> {}

/** 点聚合目标事件 */
export interface MapMarkerClusterTargetEvent extends MapPointOverlayTargetEvent<MapMarkerClusterInstance> {}

/** 点聚合移动动画事件 */
export interface MapMarkerClusterMoveEvent extends MapPointOverlayMoveEvent<MapMarkerClusterInstance> {}

/** 点聚合事件快捷属性 */
export interface MapMarkerClusterEventShortcutProps extends MapPointOverlayEventShortcutProps<MapMarkerClusterInstance> {}

/** 支持点标记扩展构造器的高德命名空间 */
export interface MapPointNamespace extends MapNamespace {
    /** Text 构造器 */
    Text?: new (options?: MapTextOptions) => MapTextInstance
    /** ElasticMarker 构造器 */
    ElasticMarker?: new (options?: MapElasticMarkerOptions) => MapElasticMarkerInstance
    /** LabelMarker 构造器 */
    LabelMarker?: new (options?: MapLabelMarkerOptions) => MapLabelMarkerInstance
    /** LabelsLayer 构造器 */
    LabelsLayer?: new (options?: MapLabelsLayerOptions) => MapLabelsLayerInstance
    /** MassMarks 构造器 */
    MassMarks?: new (data?: MapMassMarksData[], options?: MapMassMarksOptions) => MapMassMarksInstance
    /** MarkerCluster 构造器 */
    MarkerCluster?: new (
        map: MapInstance,
        data?: MapMarkerClusterData[],
        options?: MapMarkerClusterOptions
    ) => MapMarkerClusterInstance
}

/** 设置 ref 参数 */
export interface SetMapPointRefParams<TInstance> {
    /** 外部 ref */
    ref?: Ref<TInstance | null>
    /** 实例 */
    instance: TInstance | null
}

/** 事件绑定参数 */
export interface BindMapPointEventsParams<TInstance extends MapPointEventTarget> {
    /** 实例 */
    instance: TInstance
    /** 事件映射 */
    events?: MapMarkerEvents
}

/** 点事件目标 */
export interface MapPointEventTarget {
    /** 绑定事件 */
    on?: (eventName: string, handler: MapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: MapEventHandler) => void
}

/** 文本标记组件属性 */
export interface TextProps extends MapTextBaseOptions, MapTextEventShortcutProps {
    /** 文本标记实例 ref */
    ref?: Ref<MapTextInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 文本标记事件映射 */
    events?: MapMarkerEvents<MapTextInstance>
    /** 创建完成回调 */
    onLoad?: MapPointOverlayOnLoad<MapTextInstance>
    /** 销毁前回调 */
    onDestroy?: MapPointOverlayOnDestroy<MapTextInstance>
}

/** 灵活点标记组件属性 */
export interface ElasticMarkerProps extends MapElasticMarkerBaseOptions, MapElasticMarkerEventShortcutProps {
    /** 灵活点标记实例 ref */
    ref?: Ref<MapElasticMarkerInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 灵活点标记事件映射 */
    events?: MapMarkerEvents<MapElasticMarkerInstance>
    /** 创建完成回调 */
    onLoad?: MapPointOverlayOnLoad<MapElasticMarkerInstance>
    /** 销毁前回调 */
    onDestroy?: MapPointOverlayOnDestroy<MapElasticMarkerInstance>
}

/** 标注图层组件属性 */
export interface LabelsLayerProps extends MapLabelsLayerBaseOptions, MapLabelsLayerEventShortcutProps {
    /** 标注图层实例 ref */
    ref?: Ref<MapLabelsLayerInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 子标注 */
    children?: ReactNode
    /** 标注图层事件映射 */
    events?: MapMarkerEvents<MapLabelsLayerInstance>
    /** 创建完成回调 */
    onLoad?: (layer: MapLabelsLayerInstance) => void
    /** 销毁前回调 */
    onDestroy?: (layer: MapLabelsLayerInstance) => void
}

/** 标注组件属性 */
export interface LabelMarkerProps extends MapLabelMarkerBaseOptions, MapLabelMarkerEventShortcutProps {
    /** 标注实例 ref */
    ref?: Ref<MapLabelMarkerInstance | null>
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 标注事件映射 */
    events?: MapMarkerEvents<MapLabelMarkerInstance>
    /** 创建完成回调 */
    onLoad?: (marker: MapLabelMarkerInstance) => void
    /** 销毁前回调 */
    onDestroy?: (marker: MapLabelMarkerInstance) => void
}

/** 海量点组件属性 */
export interface MassMarksProps extends MapMassMarksBaseOptions, MapMassMarksEventShortcutProps {
    /** 海量点实例 ref */
    ref?: Ref<MapMassMarksInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 海量点数据 */
    data?: MapMassMarksData[]
    /** 海量点事件映射 */
    events?: MapMarkerEvents<MapMassMarksInstance>
    /** 创建完成回调 */
    onLoad?: (massMarks: MapMassMarksInstance) => void
    /** 销毁前回调 */
    onDestroy?: (massMarks: MapMassMarksInstance) => void
}

/** 点聚合组件属性 */
export interface MarkerClusterProps extends MapMarkerClusterBaseOptions, MapMarkerClusterEventShortcutProps {
    /** 点聚合实例 ref */
    ref?: Ref<MapMarkerClusterInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 聚合数据 */
    data?: MapMarkerClusterData[]
    /** 点聚合事件映射 */
    events?: MapMarkerEvents<MapMarkerClusterInstance>
    /** 创建完成回调 */
    onLoad?: (markerCluster: MapMarkerClusterInstance) => void
    /** 销毁前回调 */
    onDestroy?: (markerCluster: MapMarkerClusterInstance) => void
}

/** LabelsLayer 上下文数据 */
export interface MapLabelsLayerContextValue {
    /** 标注图层实例 */
    layer: MapLabelsLayerInstance
    /** 添加标注并同步图层状态 */
    addMarker(marker: MapLabelMarkerInstance): void
    /** 移除标注 */
    removeMarker(marker: MapLabelMarkerInstance): void
    /** 同步子标注变更后的图层状态 */
    sync(): void
    /** 同步所有子标注 */
    syncChildren(): void
    /** 注册子标注同步函数 */
    registerChildSync(sync: MapGroupChildSync): MapGroupChildSyncCleanup
}

/** 创建 LabelsLayer 上下文参数 */
export interface CreateMapLabelsLayerContextValueParams {
    /** 标注图层实例 */
    layer: MapLabelsLayerInstance
    /** 获取最新标注图层参数 */
    getOptions: () => MapLabelsLayerOptions
}

/** LabelsLayer 上下文 */
export const LabelsLayerContext = createContext<MapLabelsLayerContextValue | null>(null)

export function useLabelsLayerContext() {
    return useContext(LabelsLayerContext)
}

function setMapPointRef<TInstance>({ ref, instance }: SetMapPointRefParams<TInstance>) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(instance)
        return
    }

    ref.current = instance
}

function bindMapPointEvents<TInstance extends MapPointEventTarget>({
    instance,
    events,
}: BindMapPointEventsParams<TInstance>) {
    const eventEntries = getMapEventEntries(events)

    eventEntries.forEach(({ eventName, handler }) => instance.on?.(eventName, handler))

    return function unbindMapPointEvents() {
        eventEntries.forEach(({ eventName, handler }) => instance.off?.(eventName, handler))
    }
}

function removeMapPointOverlay<TInstance extends MapPointOverlayInstance>(
    overlay: TInstance,
    onDestroy?: MapPointOverlayOnDestroy<TInstance>
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

function updateMapPointOverlay<TInstance extends MapPointOverlayInstance>(
    overlay: TInstance,
    options: MapPointOverlayOptions
) {
    const runtimeOptions = options as MapPointOverlayRuntimeOptions

    overlay.setOptions?.(options)

    if (runtimeOptions.position !== undefined) overlay.setPosition?.(runtimeOptions.position)
    if (typeof runtimeOptions.title === "string") overlay.setTitle?.(runtimeOptions.title)
    if (typeof runtimeOptions.clickable === "boolean") overlay.setClickable?.(runtimeOptions.clickable)
    if (typeof runtimeOptions.draggable === "boolean") overlay.setDraggable?.(runtimeOptions.draggable)
    if (runtimeOptions.extData !== undefined) overlay.setExtData?.(runtimeOptions.extData)
    if (typeof runtimeOptions.zIndex === "number") overlay.setzIndex?.(runtimeOptions.zIndex)
    if (typeof runtimeOptions.cursor === "string") overlay.setCursor?.(runtimeOptions.cursor)

    if (runtimeOptions.visible === undefined) return

    if (runtimeOptions.visible) {
        overlay.show?.()
        return
    }

    overlay.hide?.()
}

function updateMapText(text: MapTextInstance, options: MapTextOptions) {
    updateMapPointOverlay(text, options)

    if (typeof options.text === "string") text.setText?.(options.text)
    if (options.style) text.setStyle?.(options.style)
    if (options.offset !== undefined) text.setOffset?.(options.offset)
    if (options.anchor !== undefined) text.setAnchor?.(options.anchor)
    if (typeof options.angle === "number") text.setAngle?.(options.angle)
}

function getDefinedMapPointOptions<TOptions extends object>(options: TOptions) {
    const nextOptions: TOptions = {} as TOptions

    Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) (nextOptions as Record<string, unknown>)[key] = value
    })

    return nextOptions
}

function updateMapLabelsLayer(layer: MapLabelsLayerInstance, options: MapLabelsLayerOptions) {
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

function syncMapLabelsLayerAfterChildChange(layer: MapLabelsLayerInstance, options: MapLabelsLayerOptions) {
    const { visible, ...setOptions } = options

    updateMapLabelsLayer(layer, setOptions)

    if (visible === false) layer.hide?.()
}

function createMapLabelsLayerContextValue({
    layer,
    getOptions,
}: CreateMapLabelsLayerContextValueParams): MapLabelsLayerContextValue {
    const childSyncs = new Set<MapGroupChildSync>()

    function sync() {
        syncMapLabelsLayerAfterChildChange(layer, getOptions())
    }

    function syncChildren() {
        childSyncs.forEach(childSync => childSync())
    }

    return {
        layer,
        addMarker(marker) {
            layer.add?.(marker)
            sync()
        },
        removeMarker(marker) {
            layer.remove?.(marker)
        },
        sync,
        syncChildren,
        registerChildSync(childSync) {
            childSyncs.add(childSync)

            return function unregisterMapLabelsLayerChildSync() {
                childSyncs.delete(childSync)
            }
        },
    }
}

function removeMapLabelsLayer(layer: MapLabelsLayerInstance, onDestroy?: (layer: MapLabelsLayerInstance) => void) {
    try {
        onDestroy?.(layer)
    } finally {
        layer.clear?.()
        layer.setMap?.(null)
    }
}

function updateMapLabelMarker(marker: MapLabelMarkerInstance, options: MapLabelMarkerOptions) {
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

function updateMapMassMarks(massMarks: MapMassMarksInstance, data: MapMassMarksData[], options: MapMassMarksOptions) {
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

function updateMapMarkerCluster(
    markerCluster: MapMarkerClusterInstance,
    data: MapMarkerClusterData[],
    options: MapMarkerClusterOptions
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
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useMapContext()
    const textRef = useRef<MapTextInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as MapPointNamespace | null
    const { eventShortcuts, restProps: restOptions } = splitMapEventShortcutProps(restProps)
    const currentOptions = getDefinedMapPointOptions(restOptions as MapTextOptions)
    const currentEvents = mergeMapEvents({
        eventShortcuts,
        events,
    }) as MapMarkerEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialOptions = useEffectEvent(() => currentOptions)

    useStableEffect(() => {
        if (!currentMap || !currentAMap?.Text) return

        const initialOptions = getInitialOptions()
        const text = new currentAMap.Text(initialOptions)

        currentMap.add?.(text)
        textRef.current = text
        setMapPointRef({
            ref,
            instance: text,
        })
        updateMapText(text, initialOptions)
        onLoad(text)

        return () => {
            textRef.current = null
            setMapPointRef({
                ref,
                instance: null,
            })

            removeMapPointOverlay(text, onDestroy)
        }
    }, [currentAMap, currentMap, ref])

    useStableEffect(() => {
        if (!textRef.current) return

        updateMapText(textRef.current, currentOptions)
    }, [currentOptions])

    useStableEffect(() => {
        if (!textRef.current) return

        return bindMapPointEvents({
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
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useMapContext()
    const markerRef = useRef<MapElasticMarkerInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as MapPointNamespace | null
    const { eventShortcuts, restProps: restOptions } = splitMapEventShortcutProps(restProps)
    const pluginLoaded = useMapPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName: MapPlugin.ElasticMarker,
        constructorName: "ElasticMarker",
    })
    const currentOptions = getDefinedMapPointOptions(restOptions as MapElasticMarkerOptions)
    const currentEvents = mergeMapEvents({
        eventShortcuts,
        events,
    }) as MapMarkerEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialOptions = useEffectEvent(() => currentOptions)

    useStableEffect(() => {
        if (!currentMap || !currentAMap?.ElasticMarker || !pluginLoaded) return

        const initialOptions = getInitialOptions()
        const marker = new currentAMap.ElasticMarker(initialOptions)

        currentMap.add?.(marker)
        markerRef.current = marker
        setMapPointRef({
            ref,
            instance: marker,
        })
        updateMapPointOverlay(marker, initialOptions)
        onLoad(marker)

        return () => {
            markerRef.current = null
            setMapPointRef({
                ref,
                instance: null,
            })

            removeMapPointOverlay(marker, onDestroy)
        }
    }, [currentAMap, currentMap, pluginLoaded, ref])

    useStableEffect(() => {
        if (!markerRef.current) return

        updateMapPointOverlay(markerRef.current, currentOptions)
    }, [currentOptions])

    useStableEffect(() => {
        if (!markerRef.current) return

        return bindMapPointEvents({
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
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useMapContext()
    const contextGroup = useLayerGroupContext()
    const layerRef = useRef<MapLabelsLayerInstance | null>(null)
    const [contextValue, setContextValue] = useState<MapLabelsLayerContextValue | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as MapPointNamespace | null
    const currentGroup = map ? null : contextGroup
    const { eventShortcuts, restProps: restOptions } = splitMapEventShortcutProps(restProps)
    const currentOptions = getDefinedMapPointOptions(restOptions as MapLabelsLayerOptions)
    const currentEvents = mergeMapEvents({
        eventShortcuts,
        events,
    }) as MapMarkerEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getCurrentOptions = useEffectEvent(() => currentOptions)

    useStableEffect(() => {
        if (!currentMap || !currentAMap?.LabelsLayer) return

        const initialOptions = getCurrentOptions()
        const layer = new currentAMap.LabelsLayer(initialOptions)

        if (currentGroup) currentGroup.addLayer(layer)
        else currentMap.add?.(layer)

        layerRef.current = layer
        setContextValue(createMapLabelsLayerContextValue({
            layer,
            getOptions: getCurrentOptions,
        }))
        setMapPointRef({
            ref,
            instance: layer,
        })
        updateMapLabelsLayer(layer, initialOptions)
        currentGroup?.sync()
        onLoad(layer)

        return () => {
            layerRef.current = null
            setContextValue(null)
            setMapPointRef({
                ref,
                instance: null,
            })

            if (currentGroup) {
                try {
                    onDestroy(layer)
                } finally {
                    currentGroup.removeLayer(layer)
                    layer.clear?.()
                    layer.setMap?.(null)
                }

                return
            }

            removeMapLabelsLayer(layer, onDestroy)
        }
    }, [currentAMap, currentGroup, currentMap, ref])

    useStableEffect(() => {
        if (!layerRef.current) return

        updateMapLabelsLayer(layerRef.current, currentOptions)
        currentGroup?.sync()
        contextValue?.syncChildren()
        if (currentOptions.visible === false) layerRef.current.hide?.()
    }, [contextValue, currentGroup, currentOptions])

    useStableEffect(() => {
        if (!currentGroup) return

        return currentGroup.registerChildSync(() => {
            if (!layerRef.current) return

            updateMapLabelsLayer(layerRef.current, currentOptions)
            contextValue?.syncChildren()
            if (currentOptions.visible === false) layerRef.current.hide?.()
        })
    }, [contextValue, currentGroup, currentOptions])

    useStableEffect(() => {
        if (!layerRef.current) return

        return bindMapPointEvents({
            instance: layerRef.current,
            events: currentEvents,
        })
    }, [currentAMap, currentEvents, currentGroup, currentMap, ref])

    return <LabelsLayerContext value={contextValue}>{contextValue ? children : null}</LabelsLayerContext>
}

export const LabelMarker: FC<LabelMarkerProps> = ({
    ref,
    AMap,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useMapContext()
    const contextLayer = useLabelsLayerContext()
    const markerRef = useRef<MapLabelMarkerInstance | null>(null)
    const currentLayer = contextLayer
    const currentAMap = (AMap ?? context.AMap) as MapPointNamespace | null
    const { eventShortcuts, restProps: restOptions } = splitMapEventShortcutProps(restProps)
    const currentOptions = getDefinedMapPointOptions(restOptions as MapLabelMarkerOptions)
    const currentEvents = mergeMapEvents({
        eventShortcuts,
        events,
    }) as MapMarkerEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialOptions = useEffectEvent(() => currentOptions)

    useStableEffect(() => {
        if (!currentLayer || !currentAMap?.LabelMarker) return

        const initialOptions = getInitialOptions()
        const marker = new currentAMap.LabelMarker(initialOptions)

        currentLayer.addMarker(marker)
        markerRef.current = marker
        setMapPointRef({
            ref,
            instance: marker,
        })
        updateMapLabelMarker(marker, initialOptions)
        currentLayer.sync()
        onLoad(marker)

        return () => {
            markerRef.current = null
            setMapPointRef({
                ref,
                instance: null,
            })

            try {
                onDestroy(marker)
            } finally {
                currentLayer.removeMarker(marker)
            }
        }
    }, [currentAMap, currentLayer, ref])

    useStableEffect(() => {
        if (!markerRef.current) return

        updateMapLabelMarker(markerRef.current, currentOptions)
        currentLayer?.sync()
    }, [currentLayer, currentOptions])

    useStableEffect(() => {
        if (!currentLayer) return

        return currentLayer.registerChildSync(() => {
            if (!markerRef.current) return

            updateMapLabelMarker(markerRef.current, currentOptions)
        })
    }, [currentLayer, currentOptions])

    useStableEffect(() => {
        if (!markerRef.current) return

        return bindMapPointEvents({
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
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useMapContext()
    const massMarksRef = useRef<MapMassMarksInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as MapPointNamespace | null
    const { eventShortcuts, restProps: restOptions } = splitMapEventShortcutProps(restProps)
    const currentOptions = getDefinedMapPointOptions(restOptions as MapMassMarksOptions)
    const currentEvents = mergeMapEvents({
        eventShortcuts,
        events,
    }) as MapMarkerEvents
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
        setMapPointRef({
            ref,
            instance: massMarks,
        })
        updateMapMassMarks(massMarks, initialData, initialOptions)
        onLoad(massMarks)

        return () => {
            massMarksRef.current = null
            setMapPointRef({
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

        updateMapMassMarks(massMarksRef.current, data, currentOptions)
    }, [currentOptions, data])

    useStableEffect(() => {
        if (!massMarksRef.current) return

        return bindMapPointEvents({
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
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useMapContext()
    const markerClusterRef = useRef<MapMarkerClusterInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as MapPointNamespace | null
    const { eventShortcuts, restProps: restOptions } = splitMapEventShortcutProps(restProps)
    const pluginLoaded = useMapPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName: MapPlugin.MarkerCluster,
        constructorName: "MarkerCluster",
    })
    const currentOptions = getDefinedMapPointOptions(restOptions as MapMarkerClusterOptions)
    const currentEvents = mergeMapEvents({
        eventShortcuts,
        events,
    }) as MapMarkerEvents
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
        setMapPointRef({
            ref,
            instance: markerCluster,
        })
        updateMapMarkerCluster(markerCluster, initialData, initialOptions)
        onLoad(markerCluster)

        return () => {
            markerClusterRef.current = null
            setMapPointRef({
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

        updateMapMarkerCluster(markerClusterRef.current, data, currentOptions)
    }, [currentOptions, data])

    useStableEffect(() => {
        if (!markerClusterRef.current) return

        return bindMapPointEvents({
            instance: markerClusterRef.current,
            events: currentEvents,
        })
    }, [currentAMap, currentEvents, currentMap, pluginLoaded, ref])

    return null
}
