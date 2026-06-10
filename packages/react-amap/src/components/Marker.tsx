import {
    type CSSProperties,
    type FC,
    type ReactNode,
    type Ref,
    useEffect,
    useEffectEvent,
    useRef,
    useState,
} from "react"
import { createPortal } from "react-dom"

import {
    type MapEventHandler,
    type MapLngLatLike,
    type MapInstance,
    type MapNamespace,
    type MapZoomRange,
    useMapContext,
} from "./Map"
import { useOverlayGroupContext } from "./Group"
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

export type MapVector2 = AMap.Vector2

export type MapMarkerPosition = MapLngLatLike

export type MapMarkerOffset = MapVector2 | MapPixelInstance

/** 覆盖物锚点 */
export const MapMarkerAnchor = {
    左上角: "top-left",
    顶部居中: "top-center",
    右上角: "top-right",
    左侧居中: "middle-left",
    居中: "center",
    右侧居中: "middle-right",
    左下角: "bottom-left",
    底部居中: "bottom-center",
    右下角: "bottom-right",
} as const

export type MapMarkerAnchor = (typeof MapMarkerAnchor)[keyof typeof MapMarkerAnchor] | MapVector2

/** 文本标注方位 */
export const MapMarkerLabelDirection = {
    上方: "top",
    右侧: "right",
    下方: "bottom",
    左侧: "left",
    居中: "center",
} as const

export type MapMarkerLabelDirection = (typeof MapMarkerLabelDirection)[keyof typeof MapMarkerLabelDirection]

export type MapMarkerIcon = string | MapIconInstance

export type MapMarkerContent = string | HTMLElement

export type MapMarkerOnLoad = (marker: MapMarkerInstance) => void

export type MapMarkerOnDestroy = (marker: MapMarkerInstance) => void

/** 点标记鼠标事件 */
export interface MapMarkerMouseEvent extends MapOverlayMouseEvent<MapMarkerInstance> {}

/** 点标记交互坐标事件 */
export interface MapMarkerInteractionEvent extends MapOverlayInteractionEvent<MapMarkerInstance> {}

/** 点标记目标事件 */
export interface MapMarkerTargetEvent extends MapTargetEvent<MapMarkerInstance> {}

/** 点标记移动动画事件 */
export interface MapMarkerMoveEvent extends MapMoveEvent<MapMarkerInstance> {}

/** 点标记事件快捷属性 */
export interface MapMarkerEventShortcutProps extends MapOverlayEventShortcutProps<MapMarkerInstance> {}

/** 高德 Pixel 实例 */
export interface MapPixelInstance extends AMap.Pixel {}

/** 高德 Icon 实例 */
export interface MapIconInstance extends AMap.Icon {}

/** 点标记文本标注参数 */
export interface MapMarkerLabelOptions {
    /** 文本标注内容 */
    content: string
    /** 文本标注偏移量 */
    offset?: MapMarkerOffset | number[]
    /** 文本标注方位 */
    direction?: MapMarkerLabelDirection
}

/** 点标记实例文本标注参数 */
export interface MapMarkerInstanceLabelOptions extends Omit<MapMarkerLabelOptions, "direction"> {
    /** 文本标注方位 */
    direction?: MapMarkerLabelDirection | string
}

/** 点标记基础参数 */
export interface MapMarkerBaseOptions {
    /** 点标记所在地图 */
    map?: MapInstance
    /** 点标记坐标 */
    position?: MapMarkerPosition
    /** 点标记图标 */
    icon?: MapMarkerIcon
    /** 点标记自定义内容 */
    content?: MapMarkerContent
    /** 鼠标悬停文字 */
    title?: string
    /** 是否可见 */
    visible?: boolean
    /** 叠加层级 */
    zIndex?: number
    /** 点标记偏移量 */
    offset?: MapMarkerOffset
    /** 点标记锚点 */
    anchor?: MapMarkerAnchor
    /** 点标记旋转角度 */
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
    /** 文本标注参数 */
    label?: MapMarkerLabelOptions
    /** 自定义数据 */
    extData?: unknown
}

/** 点标记构造参数 */
export interface MapMarkerOptions extends MapMarkerBaseOptions {
}

/** 点标记事件映射 */
export interface MapMarkerEvents<TInstance = MapMarkerInstance>
    extends MapOverlayEventMap<TInstance> {}

/** 高德 Marker 实例 */
export interface MapMarkerInstance extends AMap.Marker {
    /** 获取地图实例 */
    getMap(): MapInstance | null
    /** 设置地图实例 */
    setMap(map: MapInstance | null): void
    /** 移除点标记 */
    remove(): void
    /** 显示点标记 */
    show(): void
    /** 隐藏点标记 */
    hide(): void
    /** 绑定事件 */
    on(eventName: string | string[], handler: MapEventHandler, context?: unknown, once?: boolean): this
    /** 解绑事件 */
    off(eventName: string, handler: MapEventHandler, context?: unknown): this
    /** 设置坐标 */
    setPosition(position: MapMarkerPosition): void
    /** 设置图标 */
    setIcon(icon: MapMarkerIcon): void
    /** 设置文本标注 */
    setLabel(label: MapMarkerInstanceLabelOptions): void
    /** 设置可点击状态 */
    setClickable(clickable: boolean): void
    /** 设置可拖拽状态 */
    setDraggable(draggable: boolean): void
    /** 设置悬停光标 */
    setCursor(cursor: string): void
    /** 设置自定义数据 */
    setExtData(extData: unknown): void
    /** 设置鼠标悬停文字 */
    setTitle(title: string): void
    /** 设置偏移量 */
    setOffset(offset: MapMarkerOffset): void
    /** 设置锚点 */
    setAnchor(anchor: string): void
    /** 设置旋转角度 */
    setAngle(angle: number): void
    /** 设置叠加层级 */
    setzIndex(zIndex: number): void
    /** 设置置顶状态 */
    setTop(isTop: boolean): void
    /** 设置自定义内容 */
    setContent(content: MapMarkerContent): void
}

/** 支持 Marker 构造器的高德命名空间 */
export interface MapMarkerNamespace extends MapNamespace {
    /** Marker 构造器 */
    Marker?: new (options?: MapMarkerOptions) => MapMarkerInstance
}

/** 合并点标记参数 */
export interface MergeMapMarkerOptionsParams extends MapMarkerBaseOptions {
    /** 透传点标记参数 */
    extraOptions?: MapMarkerOptions
    /** React 子节点承载元素 */
    contentElement?: HTMLElement | null
    /** 是否使用 React 子节点作为内容 */
    hasChildrenContent: boolean
}

/** 设置点标记 ref 参数 */
export interface SetMapMarkerRefParams {
    /** 外部 ref */
    ref?: Ref<MapMarkerInstance | null>
    /** 点标记实例 */
    marker: MapMarkerInstance | null
}

/** 绑定点标记事件参数 */
export interface BindMapMarkerEventsParams {
    /** 点标记实例 */
    marker: MapMarkerInstance
    /** 事件映射 */
    events?: MapMarkerEvents
}

/** 更新 React 子节点承载元素参数 */
export interface UpdateMapMarkerContentElementParams {
    /** React 子节点承载元素 */
    element: HTMLElement
    /** React 自定义内容类名 */
    className?: string
    /** React 自定义内容样式 */
    style?: CSSProperties
}

/** 点标记组件属性 */
export interface MarkerProps extends MapMarkerBaseOptions, MapMarkerEventShortcutProps {
    /** 点标记实例 ref */
    ref?: Ref<MapMarkerInstance | null>
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** React 自定义内容 */
    children?: ReactNode
    /** React 自定义内容类名 */
    contentClassName?: string
    /** React 自定义内容样式 */
    contentStyle?: CSSProperties
    /** 点标记事件映射 */
    events?: MapMarkerEvents
    /** 点标记创建完成回调 */
    onLoad?: MapMarkerOnLoad
    /** 点标记销毁前回调 */
    onDestroy?: MapMarkerOnDestroy
}

function mergeMapMarkerOptions({
    extraOptions,
    contentElement,
    hasChildrenContent,
    content,
    ...topLevelMarkerOptions
}: MergeMapMarkerOptionsParams) {
    const nextMarkerOptions: MapMarkerOptions = {
        ...extraOptions,
    }

    Object.entries(topLevelMarkerOptions).forEach(([key, value]) => {
        if (value !== undefined) {
            Object.assign(nextMarkerOptions, {
                [key]: value,
            })
        }
    })

    if (hasChildrenContent && contentElement) {
        nextMarkerOptions.content = contentElement
        return nextMarkerOptions
    }

    if (content !== undefined) nextMarkerOptions.content = content

    return nextMarkerOptions
}

function setMapMarkerRef({ ref, marker }: SetMapMarkerRefParams) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(marker)
        return
    }

    ref.current = marker
}

function bindMapMarkerEvents({ marker, events }: BindMapMarkerEventsParams) {
    const eventEntries = getMapEventEntries(events)

    eventEntries.forEach(({ eventName, handler }) => void marker.on?.(eventName, handler))

    return function unbindMapMarkerEvents() {
        eventEntries.forEach(({ eventName, handler }) => void marker.off?.(eventName, handler))
    }
}

function removeMapMarker(marker: MapMarkerInstance, onDestroy?: MapMarkerOnDestroy) {
    try {
        onDestroy?.(marker)
    } finally {
        if (marker.remove) {
            marker.remove()
        } else {
            marker.setMap?.(null)
        }
    }
}

function updateMapMarkerContentElement({
    element,
    className,
    style,
}: UpdateMapMarkerContentElementParams) {
    element.className = className ?? ""
    element.removeAttribute("style")

    if (style) Object.assign(element.style, style)
}

function updateMapMarker(marker: MapMarkerInstance, options: MapMarkerOptions) {
    if (options.position !== undefined) marker.setPosition?.(options.position)
    if (options.icon !== undefined) marker.setIcon?.(options.icon)
    if (options.label !== undefined) marker.setLabel?.(options.label)
    if (options.clickable !== undefined) marker.setClickable?.(options.clickable)
    if (options.draggable !== undefined) marker.setDraggable?.(options.draggable)
    if (options.cursor !== undefined) marker.setCursor?.(options.cursor)
    if (options.extData !== undefined) marker.setExtData?.(options.extData)
    if (options.title !== undefined) marker.setTitle?.(options.title)
    if (options.offset !== undefined) marker.setOffset?.(options.offset)
    if (typeof options.anchor === "string") marker.setAnchor?.(options.anchor)
    if (options.angle !== undefined) marker.setAngle?.(options.angle)
    if (options.zIndex !== undefined) marker.setzIndex?.(options.zIndex)
    if (options.content !== undefined) marker.setContent?.(options.content)

    if (options.visible === undefined) return

    if (options.visible) {
        marker.show?.()
        return
    }

    marker.hide?.()
}

export const Marker: FC<MarkerProps> = ({
    ref,
    map,
    AMap,
    children,
    contentClassName,
    contentStyle,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    position,
    icon,
    content,
    title,
    visible,
    zIndex,
    offset,
    anchor,
    angle,
    clickable,
    draggable,
    bubble,
    zooms,
    cursor,
    topWhenClick,
    label,
    extData,
    ...restProps
}) => {
    const context = useMapContext()
    const contextGroup = useOverlayGroupContext()
    const markerRef = useRef<MapMarkerInstance | null>(null)
    const [contentElement, setContentElement] = useState<HTMLElement | null>(null)
    const hasChildrenContent = children !== undefined && children !== null && typeof children !== "boolean"
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as MapMarkerNamespace | null
    const currentGroup = map ? null : contextGroup
    const { eventShortcuts, restProps: restOptions } = splitMapEventShortcutProps(restProps)
    const extraOptions = restOptions as MapMarkerOptions
    const currentEvents = mergeMapEvents({
        eventShortcuts,
        events,
    }) as MapMarkerEvents
    const currentMarkerOptions = mergeMapMarkerOptions({
        extraOptions,
        contentElement,
        hasChildrenContent,
        position,
        icon,
        content,
        title,
        visible,
        zIndex,
        offset,
        anchor,
        angle,
        clickable,
        draggable,
        bubble,
        zooms,
        cursor,
        topWhenClick,
        label,
        extData,
    })
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialMarkerOptions = useEffectEvent(() => currentMarkerOptions)

    useEffect(() => {
        if (!hasChildrenContent || typeof document === "undefined") {
            setContentElement(null)
            return
        }

        const element = document.createElement("div")

        setContentElement(element)

        return () => element.remove()
    }, [hasChildrenContent])

    useStableEffect(() => {
        if (!contentElement) return

        updateMapMarkerContentElement({
            element: contentElement,
            className: contentClassName,
            style: contentStyle,
        })
    }, [contentClassName, contentElement, contentStyle])

    useStableEffect(() => {
        if (!currentMap || !currentAMap?.Marker) return
        if (hasChildrenContent && !contentElement) return

        const nextMarkerOptions = {
            ...getInitialMarkerOptions(),
        }

        if (currentGroup) delete nextMarkerOptions.map
        else nextMarkerOptions.map = currentMap

        const marker = new currentAMap.Marker(nextMarkerOptions)

        currentGroup?.addOverlay(marker)
        markerRef.current = marker
        setMapMarkerRef({
            ref,
            marker,
        })
        onLoad(marker)

        return () => {
            markerRef.current = null
            setMapMarkerRef({
                ref,
                marker: null,
            })

            if (currentGroup) {
                try {
                    onDestroy(marker)
                } finally {
                    currentGroup.removeOverlay(marker)
                    marker.setMap?.(null)
                }

                return
            }

            removeMapMarker(marker, onDestroy)
        }
    }, [contentElement, currentAMap, currentGroup, currentMap, hasChildrenContent, ref])

    useStableEffect(() => {
        if (!markerRef.current) return

        updateMapMarker(markerRef.current, currentMarkerOptions)
        currentGroup?.sync()
    }, [currentGroup, currentMarkerOptions])

    useStableEffect(() => {
        if (!currentGroup) return

        return currentGroup.registerChildSync(() => {
            if (!markerRef.current) return

            updateMapMarker(markerRef.current, currentMarkerOptions)
        })
    }, [currentGroup, currentMarkerOptions])

    useStableEffect(() => {
        if (!markerRef.current) return

        return bindMapMarkerEvents({
            marker: markerRef.current,
            events: currentEvents,
        })
    }, [contentElement, currentAMap, currentEvents, currentGroup, currentMap, hasChildrenContent, ref])

    if (hasChildrenContent && contentElement) return createPortal(children, contentElement)

    return null
}
