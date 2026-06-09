import type { AmapEventHandler } from "../components/Amap"

/** 高德原生鼠标事件 */
export interface AmapNativeMouseEvent extends MouseEvent {
    /** 高德内部事件名 */
    Adt: string
    /** 事件经纬度 */
    lnglat: AMap.LngLat
    /** 事件像素坐标 */
    pixel: AMap.Pixel
}

/** 高德鼠标事件 */
export interface AmapMouseEvent<TTarget = unknown> {
    /** 经纬度 */
    lnglat: AMap.LngLat
    /** 像素坐标 */
    pixel: AMap.Pixel
    /** 墨卡托坐标 */
    pos: AMap.Vector2
    /** 事件目标 */
    target: TTarget
    /** 事件类型 */
    type: string
    /** 原始鼠标事件 */
    originEvent: AmapNativeMouseEvent
}

/** 高德覆盖物鼠标事件 */
export interface AmapOverlayMouseEvent<TTarget = unknown> extends AmapMouseEvent<TTarget> {
    /** 矢量元素索引 */
    vectorIndex?: number
}

/** 高德地图鼠标事件 */
export interface AmapMapMouseEvent<TTarget = AMap.Map> extends AmapMouseEvent<TTarget> {}

export type AmapMouseEventHandler<TEvent extends AmapMouseEvent = AmapMouseEvent> = AmapEventHandler<[TEvent]>

/** 高德事件映射 */
export interface AmapEventMap<TClickEvent extends AmapMouseEvent = AmapOverlayMouseEvent> {
    /** 点击事件 */
    click?: AmapMouseEventHandler<TClickEvent>
    /** 双击事件 */
    dblclick?: AmapMouseEventHandler<TClickEvent>
    /** 双击事件别名 */
    dblClick?: AmapMouseEventHandler<TClickEvent>
    /** 双击事件别名 */
    dbClick?: AmapMouseEventHandler<TClickEvent>
    /** 右键事件 */
    rightclick?: AmapMouseEventHandler<TClickEvent>
    /** 右键事件别名 */
    rightClick?: AmapMouseEventHandler<TClickEvent>
    /** 鼠标按下事件 */
    mousedown?: AmapMouseEventHandler<TClickEvent>
    /** 鼠标抬起事件 */
    mouseup?: AmapMouseEventHandler<TClickEvent>
    /** 鼠标移动事件 */
    mousemove?: AmapMouseEventHandler<TClickEvent>
    /** 鼠标移入事件 */
    mouseover?: AmapMouseEventHandler<TClickEvent>
    /** 鼠标移出事件 */
    mouseout?: AmapMouseEventHandler<TClickEvent>
    [eventName: string]: AmapEventHandler | undefined
}

/** 高德事件条目 */
export interface AmapEventEntry {
    /** 事件名 */
    eventName: string
    /** 事件处理函数 */
    handler: AmapEventHandler
}

/** 覆盖物事件快捷属性 */
export interface AmapEventShortcutProps<TClickEvent extends AmapMouseEvent = AmapOverlayMouseEvent> {
    /** 点击事件 */
    onClick?: AmapMouseEventHandler<TClickEvent>
    /** 双击事件 */
    onDblClick?: AmapMouseEventHandler<TClickEvent>
    /** 右键事件 */
    onRightClick?: AmapMouseEventHandler<TClickEvent>
    /** 鼠标按下事件 */
    onMouseDown?: AmapMouseEventHandler<TClickEvent>
    /** 鼠标抬起事件 */
    onMouseUp?: AmapMouseEventHandler<TClickEvent>
    /** 鼠标移动事件 */
    onMouseMove?: AmapMouseEventHandler<TClickEvent>
    /** 鼠标移入事件 */
    onMouseOver?: AmapMouseEventHandler<TClickEvent>
    /** 鼠标移出事件 */
    onMouseOut?: AmapMouseEventHandler<TClickEvent>
    /** 触摸开始事件 */
    onTouchStart?: AmapEventHandler
    /** 触摸移动事件 */
    onTouchMove?: AmapEventHandler
    /** 触摸结束事件 */
    onTouchEnd?: AmapEventHandler
    /** 拖拽开始事件 */
    onDragStart?: AmapEventHandler
    /** 拖拽中事件 */
    onDragging?: AmapEventHandler
    /** 拖拽结束事件 */
    onDragEnd?: AmapEventHandler
    /** 移动中事件 */
    onMoving?: AmapEventHandler
    /** 移动结束事件 */
    onMoveEnd?: AmapEventHandler
    /** 缩放开始事件 */
    onZoomStart?: AmapEventHandler
    /** 缩放变化事件 */
    onZoomChange?: AmapEventHandler
    /** 缩放结束事件 */
    onZoomEnd?: AmapEventHandler
    /** 旋转开始事件 */
    onRotateStart?: AmapEventHandler
    /** 旋转变化事件 */
    onRotateChange?: AmapEventHandler
    /** 旋转结束事件 */
    onRotateEnd?: AmapEventHandler
    /** 地图完成事件 */
    onComplete?: AmapEventHandler
    /** 打开事件 */
    onOpen?: AmapEventHandler
    /** 关闭事件 */
    onClose?: AmapEventHandler
    /** 改变事件 */
    onChange?: AmapEventHandler
    /** 结束事件 */
    onEnd?: AmapEventHandler
}

/** 地图事件快捷属性 */
export interface AmapMapEventShortcutProps<TClickEvent extends AmapMouseEvent = AmapMapMouseEvent> {
    /** 地图点击事件 */
    onMapClick?: AmapMouseEventHandler<TClickEvent>
    /** 地图双击事件 */
    onMapDblClick?: AmapMouseEventHandler<TClickEvent>
    /** 地图右键事件 */
    onMapRightClick?: AmapMouseEventHandler<TClickEvent>
    /** 地图鼠标按下事件 */
    onMapMouseDown?: AmapMouseEventHandler<TClickEvent>
    /** 地图鼠标抬起事件 */
    onMapMouseUp?: AmapMouseEventHandler<TClickEvent>
    /** 地图鼠标移动事件 */
    onMapMouseMove?: AmapMouseEventHandler<TClickEvent>
    /** 地图鼠标移入事件 */
    onMapMouseOver?: AmapMouseEventHandler<TClickEvent>
    /** 地图鼠标移出事件 */
    onMapMouseOut?: AmapMouseEventHandler<TClickEvent>
    /** 地图拖拽开始事件 */
    onMapDragStart?: AmapEventHandler
    /** 地图拖拽中事件 */
    onMapDragging?: AmapEventHandler
    /** 地图拖拽结束事件 */
    onMapDragEnd?: AmapEventHandler
    /** 地图移动中事件 */
    onMapMove?: AmapEventHandler
    /** 地图移动结束事件 */
    onMapMoveEnd?: AmapEventHandler
    /** 地图缩放开始事件 */
    onMapZoomStart?: AmapEventHandler
    /** 地图缩放变化事件 */
    onMapZoomChange?: AmapEventHandler
    /** 地图缩放结束事件 */
    onMapZoomEnd?: AmapEventHandler
    /** 地图旋转开始事件 */
    onMapRotateStart?: AmapEventHandler
    /** 地图旋转变化事件 */
    onMapRotateChange?: AmapEventHandler
    /** 地图旋转结束事件 */
    onMapRotateEnd?: AmapEventHandler
    /** 地图尺寸变化事件 */
    onMapResize?: AmapEventHandler
    /** 地图加载完成事件 */
    onMapComplete?: AmapEventHandler
}

/** 拆分事件快捷属性结果 */
export interface SplitAmapEventShortcutPropsResult<
    TProps extends object,
    TClickEvent extends AmapMouseEvent = AmapOverlayMouseEvent,
> {
    /** 事件快捷属性 */
    eventShortcuts: AmapEventShortcutProps<TClickEvent>
    /** 剩余属性 */
    restProps: Omit<TProps, keyof AmapEventShortcutProps<TClickEvent>>
}

/** 合并事件参数 */
export interface MergeAmapEventsParams<
    TClickEvent extends AmapMouseEvent = AmapOverlayMouseEvent,
    TEvents extends AmapEventMap<TClickEvent> = AmapEventMap<TClickEvent>,
> {
    /** 原始事件映射 */
    events?: TEvents
    /** 覆盖物事件快捷属性 */
    eventShortcuts?: AmapEventShortcutProps<TClickEvent>
    /** 地图事件快捷属性 */
    mapEventShortcuts?: AmapMapEventShortcutProps<TClickEvent>
}

/** 覆盖物事件快捷属性到高德事件名映射 */
export const AmapEventShortcutMap = {
    onChange: "change",
    onClick: "click",
    onClose: "close",
    onComplete: "complete",
    onDblClick: "dblclick",
    onDragEnd: "dragend",
    onDragStart: "dragstart",
    onDragging: "dragging",
    onEnd: "end",
    onMouseDown: "mousedown",
    onMouseMove: "mousemove",
    onMouseOut: "mouseout",
    onMouseOver: "mouseover",
    onMouseUp: "mouseup",
    onMoveEnd: "moveend",
    onMoving: "moving",
    onOpen: "open",
    onRightClick: "rightclick",
    onRotateChange: "rotatechange",
    onRotateEnd: "rotateend",
    onRotateStart: "rotatestart",
    onTouchEnd: "touchend",
    onTouchMove: "touchmove",
    onTouchStart: "touchstart",
    onZoomChange: "zoomchange",
    onZoomEnd: "zoomend",
    onZoomStart: "zoomstart",
} as const

/** 地图事件快捷属性到高德事件名映射 */
export const AmapMapEventShortcutMap = {
    onMapClick: "click",
    onMapComplete: "complete",
    onMapDblClick: "dblclick",
    onMapDragEnd: "dragend",
    onMapDragStart: "dragstart",
    onMapDragging: "dragging",
    onMapMouseDown: "mousedown",
    onMapMouseMove: "mousemove",
    onMapMouseOut: "mouseout",
    onMapMouseOver: "mouseover",
    onMapMouseUp: "mouseup",
    onMapMove: "mapmove",
    onMapMoveEnd: "moveend",
    onMapResize: "resize",
    onMapRightClick: "rightclick",
    onMapRotateChange: "rotatechange",
    onMapRotateEnd: "rotateend",
    onMapRotateStart: "rotatestart",
    onMapZoomChange: "zoomchange",
    onMapZoomEnd: "zoomend",
    onMapZoomStart: "zoomstart",
} as const

/** 高德事件别名到标准事件名映射 */
export const AmapEventAliasMap = {
    dbClick: "dblclick",
    dblClick: "dblclick",
    rightClick: "rightclick",
} as const

export function mergeAmapEvents<
    TClickEvent extends AmapMouseEvent = AmapOverlayMouseEvent,
    TEvents extends AmapEventMap<TClickEvent> = AmapEventMap<TClickEvent>,
>({
    events,
    eventShortcuts,
    mapEventShortcuts,
}: MergeAmapEventsParams<TClickEvent, TEvents>) {
    const nextEvents: AmapEventMap<TClickEvent> = {
        ...events,
    }

    Object.entries(AmapEventShortcutMap).forEach(([shortcutName, eventName]) => {
        const handler = eventShortcuts?.[shortcutName as keyof AmapEventShortcutProps<TClickEvent>]

        if (handler) nextEvents[eventName] = handler
    })

    Object.entries(AmapMapEventShortcutMap).forEach(([shortcutName, eventName]) => {
        const handler = mapEventShortcuts?.[shortcutName as keyof AmapMapEventShortcutProps<TClickEvent>]

        if (handler) nextEvents[eventName] = handler
    })

    return nextEvents
}

export function getAmapEventEntries<TEvents extends AmapEventMap>(events?: TEvents) {
    return Object.entries(events ?? {}).reduce<AmapEventEntry[]>((entries, [eventName, handler]) => {
        if (typeof handler === "function") {
            const normalizedEventName = AmapEventAliasMap[eventName as keyof typeof AmapEventAliasMap] ?? eventName

            entries.push({
                eventName: normalizedEventName,
                handler,
            })
        }

        return entries
    }, [])
}

export function splitAmapEventShortcutProps<
    TProps extends object,
    TClickEvent extends AmapMouseEvent = AmapOverlayMouseEvent,
>(
    props: TProps
): SplitAmapEventShortcutPropsResult<TProps, TClickEvent> {
    const {
        onChange,
        onClick,
        onClose,
        onComplete,
        onDblClick,
        onDragEnd,
        onDragStart,
        onDragging,
        onEnd,
        onMouseDown,
        onMouseMove,
        onMouseOut,
        onMouseOver,
        onMouseUp,
        onMoveEnd,
        onMoving,
        onOpen,
        onRightClick,
        onRotateChange,
        onRotateEnd,
        onRotateStart,
        onTouchEnd,
        onTouchMove,
        onTouchStart,
        onZoomChange,
        onZoomEnd,
        onZoomStart,
        ...restProps
    } = props as TProps & AmapEventShortcutProps<TClickEvent>

    return {
        eventShortcuts: {
            onChange,
            onClick,
            onClose,
            onComplete,
            onDblClick,
            onDragEnd,
            onDragStart,
            onDragging,
            onEnd,
            onMouseDown,
            onMouseMove,
            onMouseOut,
            onMouseOver,
            onMouseUp,
            onMoveEnd,
            onMoving,
            onOpen,
            onRightClick,
            onRotateChange,
            onRotateEnd,
            onRotateStart,
            onTouchEnd,
            onTouchMove,
            onTouchStart,
            onZoomChange,
            onZoomEnd,
            onZoomStart,
        },
        restProps,
    }
}
