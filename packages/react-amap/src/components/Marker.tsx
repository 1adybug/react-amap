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
    type AmapEventHandler,
    type AmapLngLatLike,
    type AmapMapInstance,
    type AmapNamespace,
    type AmapZoomRange,
    useAmapContext,
} from "./Amap"
import { optionalFn } from "../utils/optionalFn"
import { useStableEffect } from "../hooks/useStableEffect"

export type AmapVector2 = AMap.Vector2

export type AmapMarkerPosition = AmapLngLatLike

export type AmapMarkerOffset = AmapVector2 | AmapPixelInstance

export type AmapMarkerAnchor = string | AmapVector2

export type AmapMarkerIcon = string | AmapIconInstance

export type AmapMarkerContent = string | HTMLElement

export type AmapMarkerOnLoad = (marker: AmapMarkerInstance) => void

export type AmapMarkerOnDestroy = (marker: AmapMarkerInstance) => void

/** 高德 Pixel 实例 */
export interface AmapPixelInstance extends AMap.Pixel {}

/** 高德 Icon 实例 */
export interface AmapIconInstance extends AMap.Icon {}

/** 点标记文本标注参数 */
export interface AmapMarkerLabelOptions {
    /** 文本标注内容 */
    content: string
    /** 文本标注偏移量 */
    offset?: AmapMarkerOffset | number[]
    /** 文本标注方位 */
    direction?: string
}

/** 点标记基础参数 */
export interface AmapMarkerBaseOptions {
    /** 点标记所在地图 */
    map?: AmapMapInstance
    /** 点标记坐标 */
    position?: AmapMarkerPosition
    /** 点标记图标 */
    icon?: AmapMarkerIcon
    /** 点标记自定义内容 */
    content?: AmapMarkerContent
    /** 鼠标悬停文字 */
    title?: string
    /** 是否可见 */
    visible?: boolean
    /** 叠加层级 */
    zIndex?: number
    /** 点标记偏移量 */
    offset?: AmapMarkerOffset
    /** 点标记锚点 */
    anchor?: AmapMarkerAnchor
    /** 点标记旋转角度 */
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
    /** 文本标注参数 */
    label?: AmapMarkerLabelOptions
    /** 自定义数据 */
    extData?: unknown
    [key: string]: unknown
}

/** 点标记构造参数 */
export interface AmapMarkerOptions extends AmapMarkerBaseOptions {
    [key: string]: unknown
}

/** 点标记事件映射 */
export interface AmapMarkerEvents {
    [eventName: string]: AmapEventHandler
}

/** 高德 Marker 实例 */
export interface AmapMarkerInstance extends AMap.Marker {
    /** 获取地图实例 */
    getMap(): AmapMapInstance | null
    /** 设置地图实例 */
    setMap(map: AmapMapInstance | null): void
    /** 移除点标记 */
    remove(): void
    /** 显示点标记 */
    show(): void
    /** 隐藏点标记 */
    hide(): void
    /** 绑定事件 */
    on(eventName: string | string[], handler: AmapEventHandler, context?: unknown, once?: boolean): this
    /** 解绑事件 */
    off(eventName: string, handler: AmapEventHandler, context?: unknown): this
    /** 设置坐标 */
    setPosition(position: AmapMarkerPosition): void
    /** 设置图标 */
    setIcon(icon: AmapMarkerIcon): void
    /** 设置文本标注 */
    setLabel(label: AmapMarkerLabelOptions): void
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
    setOffset(offset: AmapMarkerOffset): void
    /** 设置锚点 */
    setAnchor(anchor: AmapMarkerAnchor): void
    /** 设置旋转角度 */
    setAngle(angle: number): void
    /** 设置叠加层级 */
    setzIndex(zIndex: number): void
    /** 设置置顶状态 */
    setTop(isTop: boolean): void
    /** 设置自定义内容 */
    setContent(content: AmapMarkerContent): void
    [key: string]: unknown
}

/** 支持 Marker 构造器的高德命名空间 */
export interface AmapMarkerNamespace extends AmapNamespace {
    /** Marker 构造器 */
    Marker?: new (options?: AmapMarkerOptions) => AmapMarkerInstance
}

/** 合并点标记参数 */
export interface MergeAmapMarkerOptionsParams extends AmapMarkerBaseOptions {
    /** 额外点标记参数 */
    markerOptions?: AmapMarkerOptions
    /** 透传点标记参数 */
    extraOptions?: AmapMarkerOptions
    /** React 子节点承载元素 */
    contentElement?: HTMLElement | null
    /** 是否使用 React 子节点作为内容 */
    hasChildrenContent: boolean
}

/** 设置点标记 ref 参数 */
export interface SetAmapMarkerRefParams {
    /** 外部 ref */
    ref?: Ref<AmapMarkerInstance | null>
    /** 点标记实例 */
    marker: AmapMarkerInstance | null
}

/** 绑定点标记事件参数 */
export interface BindAmapMarkerEventsParams {
    /** 点标记实例 */
    marker: AmapMarkerInstance
    /** 事件映射 */
    events?: AmapMarkerEvents
}

/** 更新 React 子节点承载元素参数 */
export interface UpdateAmapMarkerContentElementParams {
    /** React 子节点承载元素 */
    element: HTMLElement
    /** React 自定义内容类名 */
    className?: string
    /** React 自定义内容样式 */
    style?: CSSProperties
}

/** 点标记组件属性 */
export interface MarkerProps extends AmapMarkerBaseOptions {
    /** 点标记实例 ref */
    ref?: Ref<AmapMarkerInstance | null>
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 点标记额外参数 */
    markerOptions?: AmapMarkerOptions
    /** React 自定义内容 */
    children?: ReactNode
    /** React 自定义内容类名 */
    contentClassName?: string
    /** React 自定义内容样式 */
    contentStyle?: CSSProperties
    /** 点标记事件映射 */
    events?: AmapMarkerEvents
    /** 点标记创建完成回调 */
    onLoad?: AmapMarkerOnLoad
    /** 点标记销毁前回调 */
    onDestroy?: AmapMarkerOnDestroy
}

function mergeAmapMarkerOptions({
    markerOptions,
    extraOptions,
    contentElement,
    hasChildrenContent,
    content,
    ...topLevelMarkerOptions
}: MergeAmapMarkerOptionsParams) {
    const nextMarkerOptions: AmapMarkerOptions = {
        ...markerOptions,
        ...extraOptions,
    }

    Object.entries(topLevelMarkerOptions).forEach(([key, value]) => {
        if (value !== undefined) nextMarkerOptions[key] = value
    })

    if (hasChildrenContent && contentElement) {
        nextMarkerOptions.content = contentElement
        return nextMarkerOptions
    }

    if (content !== undefined) nextMarkerOptions.content = content

    return nextMarkerOptions
}

function setAmapMarkerRef({ ref, marker }: SetAmapMarkerRefParams) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(marker)
        return
    }

    ref.current = marker
}

function bindAmapMarkerEvents({ marker, events }: BindAmapMarkerEventsParams) {
    const eventEntries = Object.entries(events ?? {})

    eventEntries.forEach(([eventName, handler]) => void marker.on?.(eventName, handler))

    return function unbindAmapMarkerEvents() {
        eventEntries.forEach(([eventName, handler]) => void marker.off?.(eventName, handler))
    }
}

function removeAmapMarker(marker: AmapMarkerInstance, onDestroy?: AmapMarkerOnDestroy) {
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

function updateAmapMarkerContentElement({
    element,
    className,
    style,
}: UpdateAmapMarkerContentElementParams) {
    element.className = className ?? ""
    element.removeAttribute("style")

    if (style) Object.assign(element.style, style)
}

function updateAmapMarker(marker: AmapMarkerInstance, options: AmapMarkerOptions) {
    if (options.position !== undefined) marker.setPosition?.(options.position)
    if (options.icon !== undefined) marker.setIcon?.(options.icon)
    if (options.label !== undefined) marker.setLabel?.(options.label)
    if (options.clickable !== undefined) marker.setClickable?.(options.clickable)
    if (options.draggable !== undefined) marker.setDraggable?.(options.draggable)
    if (options.cursor !== undefined) marker.setCursor?.(options.cursor)
    if (options.extData !== undefined) marker.setExtData?.(options.extData)
    if (options.title !== undefined) marker.setTitle?.(options.title)
    if (options.offset !== undefined) marker.setOffset?.(options.offset)
    if (options.anchor !== undefined) marker.setAnchor?.(options.anchor)
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
    markerOptions,
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
    ...restOptions
}) => {
    const context = useAmapContext()
    const markerRef = useRef<AmapMarkerInstance | null>(null)
    const [contentElement, setContentElement] = useState<HTMLElement | null>(null)
    const hasChildrenContent = children !== undefined && children !== null && typeof children !== "boolean"
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as AmapMarkerNamespace | null
    const extraOptions = restOptions as AmapMarkerOptions
    const currentMarkerOptions = mergeAmapMarkerOptions({
        markerOptions,
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

        updateAmapMarkerContentElement({
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

        nextMarkerOptions.map = currentMap

        const marker = new currentAMap.Marker(nextMarkerOptions)

        markerRef.current = marker
        setAmapMarkerRef({
            ref,
            marker,
        })
        onLoad(marker)

        return () => {
            markerRef.current = null
            setAmapMarkerRef({
                ref,
                marker: null,
            })
            removeAmapMarker(marker, onDestroy)
        }
    }, [contentElement, currentAMap, currentMap, hasChildrenContent, ref])

    useStableEffect(() => {
        if (!markerRef.current) return

        updateAmapMarker(markerRef.current, currentMarkerOptions)
    }, [currentMarkerOptions])

    useStableEffect(() => {
        if (!markerRef.current) return

        return bindAmapMarkerEvents({
            marker: markerRef.current,
            events,
        })
    }, [contentElement, currentAMap, currentMap, events, hasChildrenContent, ref])

    if (hasChildrenContent && contentElement) return createPortal(children, contentElement)

    return null
}
