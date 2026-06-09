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

import { type AmapEventHandler, type AmapMapInstance, type AmapNamespace, useAmapContext } from "./Amap"
import type { AmapMarkerAnchor, AmapMarkerOffset, AmapMarkerPosition } from "./Marker"
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

export type AmapInfoWindowOnLoad = (infoWindow: AmapInfoWindowInstance) => void

export type AmapInfoWindowOnDestroy = (infoWindow: AmapInfoWindowInstance) => void

export type AmapContextMenuOnLoad = (contextMenu: AmapContextMenuInstance) => void

export type AmapContextMenuOnDestroy = (contextMenu: AmapContextMenuInstance) => void

/** 交互覆盖物事件映射 */
export interface AmapDomOverlayEvents<TInstance = AmapDomOverlayEventTarget>
    extends AmapEventMap<AmapOverlayMouseEvent<TInstance>> {}

/** 信息窗体参数 */
export interface AmapInfoWindowOptions {
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
    anchor?: AmapMarkerAnchor
    /** 偏移量 */
    offset?: AmapMarkerOffset
    /** 显示位置 */
    position?: AmapMarkerPosition
    /** 自定义数据 */
    extData?: unknown
    [key: string]: unknown
}

/** 信息窗体实例 */
export interface AmapInfoWindowInstance {
    /** 打开信息窗体 */
    open?: (map: AmapMapInstance, position?: AmapMarkerPosition, height?: number) => void
    /** 关闭信息窗体 */
    close?: () => void
    /** 获取是否打开 */
    getIsOpen?: () => boolean
    /** 设置尺寸 */
    setSize?: (size: unknown) => void
    /** 设置内容 */
    setContent?: (content: string | HTMLElement) => void
    /** 设置锚点 */
    setAnchor?: (anchor: AmapMarkerAnchor) => void
    /** 设置自定义数据 */
    setExtData?: (extData: unknown) => void
    /** 绑定事件 */
    on?: (eventName: string, handler: AmapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: AmapEventHandler) => void
    [key: string]: unknown
}

/** 右键菜单项 */
export interface AmapContextMenuItem {
    /** 菜单文字 */
    text: string
    /** 点击回调 */
    onClick: EventListener
    /** 菜单位置 */
    index?: number
}

/** 右键菜单参数 */
export interface AmapContextMenuOptions {
    /** 显示位置 */
    position?: AmapMarkerPosition
    /** 自定义内容 */
    content?: string | HTMLElement
    [key: string]: unknown
}

/** 右键菜单实例 */
export interface AmapContextMenuInstance {
    /** 打开菜单 */
    open?: (map: AmapMapInstance, position?: AmapMarkerPosition) => void
    /** 关闭菜单 */
    close?: () => void
    /** 添加菜单项 */
    addItem?: (text: string, fn: EventListener, index?: number) => void
    /** 移除菜单项 */
    removeItem?: (text: string, fn: EventListener) => void
    /** 绑定事件 */
    on?: (eventName: string, handler: AmapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: AmapEventHandler) => void
    [key: string]: unknown
}

/** 支持 DOM 覆盖物构造器的高德命名空间 */
export interface AmapDomOverlayNamespace extends AmapNamespace {
    /** InfoWindow 构造器 */
    InfoWindow?: new (options?: AmapInfoWindowOptions) => AmapInfoWindowInstance
    /** ContextMenu 构造器 */
    ContextMenu?: new (options?: AmapContextMenuOptions) => AmapContextMenuInstance
}

/** 更新内容元素参数 */
export interface UpdateAmapOverlayContentElementParams {
    /** 内容元素 */
    element: HTMLElement
    /** 类名 */
    className?: string
    /** 样式 */
    style?: CSSProperties
}

/** 信息窗体组件属性 */
export interface InfoWindowProps
    extends AmapInfoWindowOptions,
        AmapEventShortcutProps<AmapOverlayMouseEvent<AmapInfoWindowInstance>> {
    /** 信息窗体实例 ref */
    ref?: Ref<AmapInfoWindowInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
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
    /** 信息窗体额外参数 */
    infoWindowOptions?: AmapInfoWindowOptions
    /** 事件映射 */
    events?: AmapDomOverlayEvents<AmapInfoWindowInstance>
    /** 创建完成回调 */
    onLoad?: AmapInfoWindowOnLoad
    /** 销毁前回调 */
    onDestroy?: AmapInfoWindowOnDestroy
}

/** 右键菜单组件属性 */
export interface ContextMenuProps
    extends AmapContextMenuOptions,
        AmapEventShortcutProps<AmapOverlayMouseEvent<AmapContextMenuInstance>> {
    /** 右键菜单实例 ref */
    ref?: Ref<AmapContextMenuInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 是否打开 */
    active?: boolean
    /** React 自定义内容 */
    children?: ReactNode
    /** React 自定义内容类名 */
    contentClassName?: string
    /** React 自定义内容样式 */
    contentStyle?: CSSProperties
    /** 右键菜单项 */
    items?: AmapContextMenuItem[]
    /** 右键菜单额外参数 */
    contextMenuOptions?: AmapContextMenuOptions
    /** 事件映射 */
    events?: AmapDomOverlayEvents<AmapContextMenuInstance>
    /** 创建完成回调 */
    onLoad?: AmapContextMenuOnLoad
    /** 销毁前回调 */
    onDestroy?: AmapContextMenuOnDestroy
}

function setAmapDomOverlayRef<TInstance>(ref: Ref<TInstance | null> | undefined, instance: TInstance | null) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(instance)
        return
    }

    ref.current = instance
}

function bindAmapDomOverlayEvents<TInstance extends AmapDomOverlayEventTarget>(
    instance: TInstance,
    events?: AmapDomOverlayEvents
) {
    const eventEntries = getAmapEventEntries(events)

    eventEntries.forEach(({ eventName, handler }) => instance.on?.(eventName, handler))

    return function unbindAmapDomOverlayEvents() {
        eventEntries.forEach(({ eventName, handler }) => instance.off?.(eventName, handler))
    }
}

/** DOM 覆盖物事件目标 */
export interface AmapDomOverlayEventTarget {
    /** 绑定事件 */
    on?: (eventName: string, handler: AmapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: AmapEventHandler) => void
}

function mergeAmapDomOverlayOptions<TOptions extends Record<string, unknown>>(options: TOptions | undefined, extraOptions: TOptions) {
    const nextOptions: TOptions = {
        ...options,
    } as TOptions

    Object.entries(extraOptions).forEach(([key, value]) => {
        if (value !== undefined) (nextOptions as Record<string, unknown>)[key] = value
    })

    return nextOptions
}

function updateAmapOverlayContentElement({ element, className, style }: UpdateAmapOverlayContentElementParams) {
    element.className = className ?? ""
    element.removeAttribute("style")

    if (style) Object.assign(element.style, style)
}

function updateAmapInfoWindow(infoWindow: AmapInfoWindowInstance, options: AmapInfoWindowOptions) {
    if (options.content !== undefined) infoWindow.setContent?.(options.content)
    if (options.size !== undefined) infoWindow.setSize?.(options.size)
    if (typeof options.anchor === "string") infoWindow.setAnchor?.(options.anchor)
    if (options.extData !== undefined) infoWindow.setExtData?.(options.extData)
}

function updateAmapContextMenuItems(contextMenu: AmapContextMenuInstance, items: AmapContextMenuItem[]) {
    items.forEach(item => contextMenu.addItem?.(item.text, item.onClick, item.index))

    return function removeAmapContextMenuItems() {
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
    infoWindowOptions,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useAmapContext()
    const infoWindowRef = useRef<AmapInfoWindowInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as AmapDomOverlayNamespace | null
    const [contentElement, setContentElement] = useState<HTMLElement | null>(null)
    const hasChildrenContent = children !== undefined && children !== null && typeof children !== "boolean"
    const { eventShortcuts, restProps: restOptions } = splitAmapEventShortcutProps(restProps)
    const currentOptions = mergeAmapDomOverlayOptions(infoWindowOptions, restOptions as AmapInfoWindowOptions)
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapDomOverlayEvents
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

        updateAmapOverlayContentElement({
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
        setAmapDomOverlayRef(ref, infoWindow)
        updateAmapInfoWindow(infoWindow, nextOptions)
        onLoad(infoWindow)

        return () => {
            infoWindowRef.current = null
            setAmapDomOverlayRef(ref, null)

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

        updateAmapInfoWindow(infoWindowRef.current, nextOptions)

        if (active && nextOptions.position) {
            infoWindowRef.current.open?.(currentMap!, nextOptions.position, height)
            return
        }

        if (!active) infoWindowRef.current.close?.()
    }, [active, contentElement, currentMap, currentOptions, height, hasChildrenContent])

    useStableEffect(() => {
        if (!infoWindowRef.current) return

        return bindAmapDomOverlayEvents(infoWindowRef.current, currentEvents)
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
    contextMenuOptions,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...restProps
}) => {
    const context = useAmapContext()
    const contextMenuRef = useRef<AmapContextMenuInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = (AMap ?? context.AMap) as AmapDomOverlayNamespace | null
    const [contentElement, setContentElement] = useState<HTMLElement | null>(null)
    const hasChildrenContent = children !== undefined && children !== null && typeof children !== "boolean"
    const { eventShortcuts, restProps: restOptions } = splitAmapEventShortcutProps(restProps)
    const currentOptions = mergeAmapDomOverlayOptions(contextMenuOptions, restOptions as AmapContextMenuOptions)
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapDomOverlayEvents
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

        updateAmapOverlayContentElement({
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
        setAmapDomOverlayRef(ref, contextMenu)
        onLoad(contextMenu)

        return () => {
            contextMenuRef.current = null
            setAmapDomOverlayRef(ref, null)

            try {
                onDestroy(contextMenu)
            } finally {
                contextMenu.close?.()
            }
        }
    }, [contentElement, currentAMap, currentMap, hasChildrenContent, ref])

    useStableEffect(() => {
        if (!contextMenuRef.current) return

        return updateAmapContextMenuItems(contextMenuRef.current, items)
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

        return bindAmapDomOverlayEvents(contextMenuRef.current, currentEvents)
    }, [contentElement, currentAMap, currentEvents, currentMap, hasChildrenContent, ref])

    if (hasChildrenContent && contentElement) return createPortal(children, contentElement)

    return null
}
