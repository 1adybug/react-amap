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

import { type MapEventHandler, type MapInstance, type MapNamespace, useMapContext } from "./Map"
import type { MapMarkerAnchor, MapMarkerOffset, MapMarkerPosition } from "./Marker"
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

export type MapInfoWindowOnLoad = (infoWindow: MapInfoWindowInstance) => void

export type MapInfoWindowOnDestroy = (infoWindow: MapInfoWindowInstance) => void

export type MapContextMenuOnLoad = (contextMenu: MapContextMenuInstance) => void

export type MapContextMenuOnDestroy = (contextMenu: MapContextMenuInstance) => void

/** 交互覆盖物鼠标事件 */
export interface MapDomOverlayMouseEvent<TInstance = MapDomOverlayEventTarget> extends MapOverlayMouseEvent<TInstance> {}

/** 交互覆盖物坐标事件 */
export interface MapDomOverlayInteractionEvent<TInstance = MapDomOverlayEventTarget>
    extends MapOverlayInteractionEvent<TInstance> {}

/** 交互覆盖物目标事件 */
export interface MapDomOverlayTargetEvent<TInstance = MapDomOverlayEventTarget> extends MapTargetEvent<TInstance> {}

/** 交互覆盖物移动动画事件 */
export interface MapDomOverlayMoveEvent<TInstance = MapDomOverlayEventTarget> extends MapMoveEvent<TInstance> {}

/** 交互覆盖物事件快捷属性 */
export interface MapDomOverlayEventShortcutProps<TInstance = MapDomOverlayEventTarget>
    extends MapOverlayEventShortcutProps<TInstance> {}

/** 信息窗体鼠标事件 */
export interface MapInfoWindowMouseEvent extends MapDomOverlayMouseEvent<MapInfoWindowInstance> {}

/** 信息窗体坐标事件 */
export interface MapInfoWindowInteractionEvent extends MapDomOverlayInteractionEvent<MapInfoWindowInstance> {}

/** 信息窗体目标事件 */
export interface MapInfoWindowTargetEvent extends MapDomOverlayTargetEvent<MapInfoWindowInstance> {}

/** 信息窗体移动动画事件 */
export interface MapInfoWindowMoveEvent extends MapDomOverlayMoveEvent<MapInfoWindowInstance> {}

/** 信息窗体事件快捷属性 */
export interface MapInfoWindowEventShortcutProps extends MapDomOverlayEventShortcutProps<MapInfoWindowInstance> {}

/** 右键菜单鼠标事件 */
export interface MapContextMenuMouseEvent extends MapDomOverlayMouseEvent<MapContextMenuInstance> {}

/** 右键菜单坐标事件 */
export interface MapContextMenuInteractionEvent extends MapDomOverlayInteractionEvent<MapContextMenuInstance> {}

/** 右键菜单目标事件 */
export interface MapContextMenuTargetEvent extends MapDomOverlayTargetEvent<MapContextMenuInstance> {}

/** 右键菜单移动动画事件 */
export interface MapContextMenuMoveEvent extends MapDomOverlayMoveEvent<MapContextMenuInstance> {}

/** 右键菜单事件快捷属性 */
export interface MapContextMenuEventShortcutProps extends MapDomOverlayEventShortcutProps<MapContextMenuInstance> {}

/** 交互覆盖物事件映射 */
export interface MapDomOverlayEvents<TInstance = MapDomOverlayEventTarget>
    extends MapOverlayEventMap<TInstance> {}

/** 信息窗体参数 */
export interface MapInfoWindowOptions {
    /** 是否自定义窗体 */
    isCustom?: boolean
    /** 是否自动移动到视野内 */
    autoMove?: boolean
    /** 自动移动避让宽度 */
    avoid?: number[]
    /** 点击地图后是否关闭 */
    closeWhenClickMap?: boolean
    /** 显示内容 */
    content?: string | HTMLElement
    /** 信息窗体尺寸 */
    size?: unknown
    /** 锚点 */
    anchor?: MapMarkerAnchor
    /** 偏移量 */
    offset?: MapMarkerOffset
    /** 显示位置 */
    position?: MapMarkerPosition
    /** 自定义数据 */
    extData?: unknown
}

/** 信息窗体实例 */
export interface MapInfoWindowInstance {
    /** 打开信息窗体 */
    open?: (map: MapInstance, position?: MapMarkerPosition, height?: number) => void
    /** 关闭信息窗体 */
    close?: () => void
    /** 获取是否打开 */
    getIsOpen?: () => boolean
    /** 设置尺寸 */
    setSize?: (size: unknown) => void
    /** 设置内容 */
    setContent?: (content: string | HTMLElement) => void
    /** 设置锚点 */
    setAnchor?: (anchor: MapMarkerAnchor) => void
    /** 设置自定义数据 */
    setExtData?: (extData: unknown) => void
    /** 绑定事件 */
    on?: (eventName: string, handler: MapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: MapEventHandler) => void
}

/** 右键菜单项 */
export interface MapContextMenuItem {
    /** 菜单文字 */
    text: string
    /** 点击回调 */
    onClick: EventListener
    /** 菜单位置 */
    index?: number
}

/** 右键菜单参数 */
export interface MapContextMenuOptions {
    /** 显示位置 */
    position?: MapMarkerPosition
    /** 自定义内容 */
    content?: string | HTMLElement
}

/** 右键菜单实例 */
export interface MapContextMenuInstance {
    /** 打开菜单 */
    open?: (map: MapInstance, position?: MapMarkerPosition) => void
    /** 关闭菜单 */
    close?: () => void
    /** 添加菜单项 */
    addItem?: (text: string, fn: EventListener, index?: number) => void
    /** 移除菜单项 */
    removeItem?: (text: string, fn: EventListener) => void
    /** 绑定事件 */
    on?: (eventName: string, handler: MapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: MapEventHandler) => void
}

/** 支持 DOM 覆盖物构造器的高德命名空间 */
export interface MapDomOverlayNamespace extends MapNamespace {
    /** InfoWindow 构造器 */
    InfoWindow?: new (options?: MapInfoWindowOptions) => MapInfoWindowInstance
    /** ContextMenu 构造器 */
    ContextMenu?: new (options?: MapContextMenuOptions) => MapContextMenuInstance
}

/** 更新内容元素参数 */
export interface UpdateMapOverlayContentElementParams {
    /** 内容元素 */
    element: HTMLElement
    /** 类名 */
    className?: string
    /** 样式 */
    style?: CSSProperties
}

/** 信息窗体组件属性 */
export interface InfoWindowProps extends MapInfoWindowOptions, MapInfoWindowEventShortcutProps {
    /** 信息窗体实例 ref */
    ref?: Ref<MapInfoWindowInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 是否打开 */
    active?: boolean
    /** 打开高度 */
    height?: number
    /** React 自定义内容 */
    children?: ReactNode
    /** React 自定义内容类名 */
    contentClassName?: string
    /** React 自定义内容样式 */
    contentStyle?: CSSProperties
    /** 事件映射 */
    events?: MapDomOverlayEvents<MapInfoWindowInstance>
    /** 创建完成回调 */
    onLoad?: MapInfoWindowOnLoad
    /** 销毁前回调 */
    onDestroy?: MapInfoWindowOnDestroy
}

/** 右键菜单组件属性 */
export interface ContextMenuProps extends MapContextMenuOptions, MapContextMenuEventShortcutProps {
    /** 右键菜单实例 ref */
    ref?: Ref<MapContextMenuInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 是否打开 */
    active?: boolean
    /** React 自定义内容 */
    children?: ReactNode
    /** React 自定义内容类名 */
    contentClassName?: string
    /** React 自定义内容样式 */
    contentStyle?: CSSProperties
    /** 右键菜单项 */
    items?: MapContextMenuItem[]
    /** 事件映射 */
    events?: MapDomOverlayEvents<MapContextMenuInstance>
    /** 创建完成回调 */
    onLoad?: MapContextMenuOnLoad
    /** 销毁前回调 */
    onDestroy?: MapContextMenuOnDestroy
}

function setMapDomOverlayRef<TInstance>(ref: Ref<TInstance | null> | undefined, instance: TInstance | null) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(instance)
        return
    }

    ref.current = instance
}

function bindMapDomOverlayEvents<TInstance extends MapDomOverlayEventTarget>(
    instance: TInstance,
    events?: MapDomOverlayEvents
) {
    const eventEntries = getMapEventEntries(events)

    eventEntries.forEach(({ eventName, handler }) => instance.on?.(eventName, handler))

    return function unbindMapDomOverlayEvents() {
        eventEntries.forEach(({ eventName, handler }) => instance.off?.(eventName, handler))
    }
}

/** DOM 覆盖物事件目标 */
export interface MapDomOverlayEventTarget {
    /** 绑定事件 */
    on?: (eventName: string, handler: MapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: MapEventHandler) => void
}

function getDefinedMapDomOverlayOptions<TOptions extends object>(options: TOptions) {
    const nextOptions: TOptions = {} as TOptions

    Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined) (nextOptions as Record<string, unknown>)[key] = value
    })

    return nextOptions
}

function updateMapOverlayContentElement({ element, className, style }: UpdateMapOverlayContentElementParams) {
    element.className = className ?? ""
    element.removeAttribute("style")

    if (style) Object.assign(element.style, style)
}

function updateMapInfoWindow(infoWindow: MapInfoWindowInstance, options: MapInfoWindowOptions) {
    if (options.content !== undefined) infoWindow.setContent?.(options.content)
    if (options.size !== undefined) infoWindow.setSize?.(options.size)
    if (typeof options.anchor === "string") infoWindow.setAnchor?.(options.anchor)
    if (options.extData !== undefined) infoWindow.setExtData?.(options.extData)
}

function updateMapContextMenuItems(contextMenu: MapContextMenuInstance, items: MapContextMenuItem[]) {
    items.forEach(item => contextMenu.addItem?.(item.text, item.onClick, item.index))

    return function removeMapContextMenuItems() {
        items.forEach(item => contextMenu.removeItem?.(item.text, item.onClick))
    }
}

export const InfoWindow: FC<InfoWindowProps> = ({
    ref,
    map,
    AMap,
    active = true,
    height,
    children,
    contentClassName,
    contentStyle,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useMapContext()
    const infoWindowRef = useRef<MapInfoWindowInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as MapDomOverlayNamespace | null
    const [contentElement, setContentElement] = useState<HTMLElement | null>(null)
    const hasChildrenContent = children !== undefined && children !== null && typeof children !== "boolean"
    const { eventShortcuts, restProps: restOptions } = splitMapEventShortcutProps(restProps)
    const currentOptions = getDefinedMapDomOverlayOptions(restOptions as MapInfoWindowOptions)
    const currentEvents = mergeMapEvents({
        eventShortcuts,
        events,
    }) as MapDomOverlayEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialOptions = useEffectEvent(() => currentOptions)

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

        updateMapOverlayContentElement({
            element: contentElement,
            className: contentClassName,
            style: contentStyle,
        })
    }, [contentClassName, contentElement, contentStyle])

    useStableEffect(() => {
        if (!currentMap || !currentAMap?.InfoWindow) return
        if (hasChildrenContent && !contentElement) return

        const nextOptions = {
            ...getInitialOptions(),
        }

        if (hasChildrenContent && contentElement) nextOptions.content = contentElement

        const infoWindow = new currentAMap.InfoWindow(nextOptions)

        infoWindowRef.current = infoWindow
        setMapDomOverlayRef(ref, infoWindow)
        updateMapInfoWindow(infoWindow, nextOptions)
        onLoad(infoWindow)

        return () => {
            infoWindowRef.current = null
            setMapDomOverlayRef(ref, null)

            try {
                onDestroy(infoWindow)
            } finally {
                infoWindow.close?.()
            }
        }
    }, [contentElement, currentAMap, currentMap, hasChildrenContent, ref])

    useStableEffect(() => {
        if (!infoWindowRef.current) return

        const nextOptions = {
            ...currentOptions,
        }

        if (hasChildrenContent && contentElement) nextOptions.content = contentElement

        updateMapInfoWindow(infoWindowRef.current, nextOptions)

        if (active && nextOptions.position) {
            infoWindowRef.current.open?.(currentMap!, nextOptions.position, height)
            return
        }

        if (!active) infoWindowRef.current.close?.()
    }, [active, contentElement, currentMap, currentOptions, height, hasChildrenContent])

    useStableEffect(() => {
        if (!infoWindowRef.current) return

        return bindMapDomOverlayEvents(infoWindowRef.current, currentEvents)
    }, [contentElement, currentAMap, currentEvents, currentMap, hasChildrenContent, ref])

    if (hasChildrenContent && contentElement) return createPortal(children, contentElement)

    return null
}

export const ContextMenu: FC<ContextMenuProps> = ({
    ref,
    map,
    AMap,
    active = false,
    children,
    contentClassName,
    contentStyle,
    items = [],
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useMapContext()
    const contextMenuRef = useRef<MapContextMenuInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as MapDomOverlayNamespace | null
    const [contentElement, setContentElement] = useState<HTMLElement | null>(null)
    const hasChildrenContent = children !== undefined && children !== null && typeof children !== "boolean"
    const { eventShortcuts, restProps: restOptions } = splitMapEventShortcutProps(restProps)
    const currentOptions = getDefinedMapDomOverlayOptions(restOptions as MapContextMenuOptions)
    const currentEvents = mergeMapEvents({
        eventShortcuts,
        events,
    }) as MapDomOverlayEvents
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialOptions = useEffectEvent(() => currentOptions)

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

        updateMapOverlayContentElement({
            element: contentElement,
            className: contentClassName,
            style: contentStyle,
        })
    }, [contentClassName, contentElement, contentStyle])

    useStableEffect(() => {
        if (!currentMap || !currentAMap?.ContextMenu) return
        if (hasChildrenContent && !contentElement) return

        const nextOptions = {
            ...getInitialOptions(),
        }

        if (hasChildrenContent && contentElement) nextOptions.content = contentElement

        const contextMenu = new currentAMap.ContextMenu(nextOptions)

        contextMenuRef.current = contextMenu
        setMapDomOverlayRef(ref, contextMenu)
        onLoad(contextMenu)

        return () => {
            contextMenuRef.current = null
            setMapDomOverlayRef(ref, null)

            try {
                onDestroy(contextMenu)
            } finally {
                contextMenu.close?.()
            }
        }
    }, [contentElement, currentAMap, currentMap, hasChildrenContent, ref])

    useStableEffect(() => {
        if (!contextMenuRef.current) return

        return updateMapContextMenuItems(contextMenuRef.current, items)
    }, [items])

    useStableEffect(() => {
        if (!contextMenuRef.current) return

        if (active && currentOptions.position) {
            contextMenuRef.current.open?.(currentMap!, currentOptions.position)
            return
        }

        if (!active) contextMenuRef.current.close?.()
    }, [active, currentMap, currentOptions])

    useStableEffect(() => {
        if (!contextMenuRef.current) return

        return bindMapDomOverlayEvents(contextMenuRef.current, currentEvents)
    }, [contentElement, currentAMap, currentEvents, currentMap, hasChildrenContent, ref])

    if (hasChildrenContent && contentElement) return createPortal(children, contentElement)

    return null
}
