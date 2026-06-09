import type { AmapEventHandler } from "../components/Amap"

/** 高德原生事件 */
export interface AmapNativeEvent extends Event {
    /** 高德内部事件名 */
    Adt: string
    /** 事件经纬度 */
    lnglat?: AMap.LngLat
    /** 事件像素坐标 */
    pixel?: AMap.Pixel
}

/** 高德原生鼠标事件 */
export interface AmapNativeMouseEvent extends MouseEvent {
    /** 高德内部事件名 */
    Adt: string
    /** 事件经纬度 */
    lnglat: AMap.LngLat
    /** 事件像素坐标 */
    pixel: AMap.Pixel
}

/** 高德坐标事件 */
export interface AmapCoordinateEvent<TTarget = unknown, TOriginEvent extends AmapNativeEvent = AmapNativeEvent> {
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
    /** 原始事件 */
    originEvent: TOriginEvent
}

/** 高德鼠标事件 */
export interface AmapMouseEvent<TTarget = unknown> extends AmapCoordinateEvent<TTarget, AmapNativeMouseEvent> {}

/** 高德覆盖物鼠标事件 */
export interface AmapOverlayMouseEvent<TTarget = unknown> extends AmapMouseEvent<TTarget> {
    /** 矢量元素索引 */
    vectorIndex?: number
}

/** 高德地图鼠标事件 */
export interface AmapMapMouseEvent<TTarget = AMap.Map> extends AmapMouseEvent<TTarget> {}

/** 高德交互坐标事件 */
export interface AmapInteractionEvent<TTarget = unknown> extends AmapCoordinateEvent<TTarget> {}

/** 高德覆盖物交互坐标事件 */
export interface AmapOverlayInteractionEvent<TTarget = unknown> extends AmapInteractionEvent<TTarget> {
    /** 矢量元素索引 */
    vectorIndex?: number
}

/** 高德地图交互坐标事件 */
export interface AmapMapInteractionEvent<TTarget = AMap.Map> extends AmapInteractionEvent<TTarget> {}

/** 高德基础事件 */
export interface AmapBaseEvent<TType extends string = string> {
    /** 事件类型 */
    type: TType
}

/** 高德目标事件 */
export interface AmapTargetEvent<TTarget = unknown, TType extends string = string> extends AmapBaseEvent<TType> {
    /** 事件目标 */
    target: TTarget
}

/** 高德移动动画事件 */
export interface AmapMoveEvent<TTarget = unknown> extends AmapTargetEvent<TTarget> {
    /** 路径点索引 */
    index: number
    /** 动画进度 */
    progress: number
    /** 当前位置 */
    pos: AMap.Vector2
    /** 已经过的墨卡托坐标 */
    passedPos: AMap.Vector2[]
    /** 已经过的经纬度坐标 */
    passedPath: AMap.LngLat[]
}

export type AmapMouseEventHandler<TEvent extends AmapMouseEvent = AmapMouseEvent> = AmapEventHandler<[TEvent]>

export type AmapCoordinateEventHandler<TEvent extends AmapCoordinateEvent = AmapCoordinateEvent> = AmapEventHandler<[TEvent]>

export type AmapEventTargetFromMouseEvent<TEvent extends AmapMouseEvent> =
    TEvent extends AmapMouseEvent<infer TTarget> ? TTarget : unknown

/** 覆盖物事件映射 */
export interface AmapOverlayEventMap<TTarget = unknown>
    extends AmapEventMap<
        AmapOverlayMouseEvent<TTarget>,
        AmapTargetEvent<TTarget>,
        AmapBaseEvent,
        AmapOverlayInteractionEvent<TTarget>,
        AmapMoveEvent<TTarget>
    > {}

/** 覆盖物事件快捷属性 */
export interface AmapOverlayEventShortcutProps<TTarget = unknown>
    extends AmapEventShortcutProps<
        AmapOverlayMouseEvent<TTarget>,
        AmapTargetEvent<TTarget>,
        AmapBaseEvent,
        AmapOverlayInteractionEvent<TTarget>,
        AmapMoveEvent<TTarget>
    > {}

/** 地图事件映射 */
export interface AmapMapEvents<TTarget = AMap.Map>
    extends AmapEventMap<
        AmapMapMouseEvent<TTarget>,
        AmapTargetEvent<TTarget>,
        AmapBaseEvent,
        AmapMapInteractionEvent<TTarget>
    > {}

/** 地图事件快捷属性 */
export interface AmapMapEventShortcuts<TTarget = AMap.Map>
    extends AmapMapEventShortcutProps<
        AmapMapMouseEvent<TTarget>,
        AmapTargetEvent<TTarget>,
        AmapBaseEvent,
        AmapMapInteractionEvent<TTarget>
    > {}

/** 高德事件映射 */
export interface AmapEventMap<
    TClickEvent extends AmapMouseEvent = AmapOverlayMouseEvent,
    TTargetEvent extends AmapTargetEvent = AmapTargetEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
    TBaseEvent extends AmapBaseEvent = AmapBaseEvent,
    TInteractionEvent extends AmapCoordinateEvent = AmapOverlayInteractionEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
    TMoveEvent extends AmapMoveEvent = AmapMoveEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
> {
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
    mousedown?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标抬起事件 */
    mouseup?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标移动事件 */
    mousemove?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标滚轮事件 */
    mousewheel?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标移入事件 */
    mouseover?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标移出事件 */
    mouseout?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 触摸开始事件 */
    touchstart?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 触摸移动事件 */
    touchmove?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 触摸结束事件 */
    touchend?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 拖拽开始事件 */
    dragstart?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 拖拽中事件 */
    dragging?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 拖拽结束事件 */
    dragend?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 移动开始事件 */
    movestart?: AmapEventHandler<[TTargetEvent]>
    /** 移动中事件 */
    moving?: AmapEventHandler<[TMoveEvent]>
    /** 地图移动中事件 */
    mapmove?: AmapEventHandler<[TTargetEvent]>
    /** 移动结束事件 */
    moveend?: AmapEventHandler<[TTargetEvent | TMoveEvent]>
    /** 缩放开始事件 */
    zoomstart?: AmapEventHandler<[TTargetEvent]>
    /** 缩放变化事件 */
    zoomchange?: AmapEventHandler<[TTargetEvent]>
    /** 缩放结束事件 */
    zoomend?: AmapEventHandler<[TTargetEvent]>
    /** 旋转开始事件 */
    rotatestart?: AmapEventHandler<[TBaseEvent]>
    /** 旋转变化事件 */
    rotatechange?: AmapEventHandler<[TBaseEvent]>
    /** 旋转结束事件 */
    rotateend?: AmapEventHandler<[TBaseEvent]>
    /** 尺寸变化事件 */
    resize?: AmapEventHandler<[TBaseEvent]>
    /** 完成事件 */
    complete?: AmapEventHandler<[TTargetEvent]>
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
export interface AmapEventShortcutProps<
    TClickEvent extends AmapMouseEvent = AmapOverlayMouseEvent,
    TTargetEvent extends AmapTargetEvent = AmapTargetEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
    TBaseEvent extends AmapBaseEvent = AmapBaseEvent,
    TInteractionEvent extends AmapCoordinateEvent = AmapOverlayInteractionEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
    TMoveEvent extends AmapMoveEvent = AmapMoveEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
> {
    /** 点击事件 */
    onClick?: AmapMouseEventHandler<TClickEvent>
    /** 双击事件 */
    onDblClick?: AmapMouseEventHandler<TClickEvent>
    /** 右键事件 */
    onRightClick?: AmapMouseEventHandler<TClickEvent>
    /** 鼠标按下事件 */
    onMouseDown?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标抬起事件 */
    onMouseUp?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标移动事件 */
    onMouseMove?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标滚轮事件 */
    onMouseWheel?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标移入事件 */
    onMouseOver?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标移出事件 */
    onMouseOut?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 触摸开始事件 */
    onTouchStart?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 触摸移动事件 */
    onTouchMove?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 触摸结束事件 */
    onTouchEnd?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 拖拽开始事件 */
    onDragStart?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 拖拽中事件 */
    onDragging?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 拖拽结束事件 */
    onDragEnd?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 移动开始事件 */
    onMoveStart?: AmapEventHandler<[TTargetEvent]>
    /** 移动中事件 */
    onMoving?: AmapEventHandler<[TMoveEvent]>
    /** 移动结束事件 */
    onMoveEnd?: AmapEventHandler<[TTargetEvent | TMoveEvent]>
    /** 缩放开始事件 */
    onZoomStart?: AmapEventHandler<[TTargetEvent]>
    /** 缩放变化事件 */
    onZoomChange?: AmapEventHandler<[TTargetEvent]>
    /** 缩放结束事件 */
    onZoomEnd?: AmapEventHandler<[TTargetEvent]>
    /** 旋转开始事件 */
    onRotateStart?: AmapEventHandler<[TBaseEvent]>
    /** 旋转变化事件 */
    onRotateChange?: AmapEventHandler<[TBaseEvent]>
    /** 旋转结束事件 */
    onRotateEnd?: AmapEventHandler<[TBaseEvent]>
    /** 地图完成事件 */
    onComplete?: AmapEventHandler<[TTargetEvent]>
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
export interface AmapMapEventShortcutProps<
    TClickEvent extends AmapMouseEvent = AmapMapMouseEvent,
    TTargetEvent extends AmapTargetEvent = AmapTargetEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
    TBaseEvent extends AmapBaseEvent = AmapBaseEvent,
    TInteractionEvent extends AmapCoordinateEvent = AmapMapInteractionEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
> {
    /** 地图点击事件 */
    onMapClick?: AmapMouseEventHandler<TClickEvent>
    /** 地图双击事件 */
    onMapDblClick?: AmapMouseEventHandler<TClickEvent>
    /** 地图右键事件 */
    onMapRightClick?: AmapMouseEventHandler<TClickEvent>
    /** 地图鼠标按下事件 */
    onMapMouseDown?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 地图鼠标抬起事件 */
    onMapMouseUp?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 地图鼠标移动事件 */
    onMapMouseMove?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 地图鼠标滚轮事件 */
    onMapMouseWheel?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 地图鼠标移入事件 */
    onMapMouseOver?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 地图鼠标移出事件 */
    onMapMouseOut?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 地图触摸开始事件 */
    onMapTouchStart?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 地图触摸移动事件 */
    onMapTouchMove?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 地图触摸结束事件 */
    onMapTouchEnd?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 地图拖拽开始事件 */
    onMapDragStart?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 地图拖拽中事件 */
    onMapDragging?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 地图拖拽结束事件 */
    onMapDragEnd?: AmapCoordinateEventHandler<TInteractionEvent>
    /** 地图移动开始事件 */
    onMapMoveStart?: AmapEventHandler<[TTargetEvent]>
    /** 地图移动中事件 */
    onMapMove?: AmapEventHandler<[TTargetEvent]>
    /** 地图移动结束事件 */
    onMapMoveEnd?: AmapEventHandler<[TTargetEvent]>
    /** 地图缩放开始事件 */
    onMapZoomStart?: AmapEventHandler<[TTargetEvent]>
    /** 地图缩放变化事件 */
    onMapZoomChange?: AmapEventHandler<[TTargetEvent]>
    /** 地图缩放结束事件 */
    onMapZoomEnd?: AmapEventHandler<[TTargetEvent]>
    /** 地图旋转开始事件 */
    onMapRotateStart?: AmapEventHandler<[TBaseEvent]>
    /** 地图旋转变化事件 */
    onMapRotateChange?: AmapEventHandler<[TBaseEvent]>
    /** 地图旋转结束事件 */
    onMapRotateEnd?: AmapEventHandler<[TBaseEvent]>
    /** 地图尺寸变化事件 */
    onMapResize?: AmapEventHandler<[TBaseEvent]>
    /** 地图加载完成事件 */
    onMapComplete?: AmapEventHandler<[TTargetEvent]>
}

/** 拆分事件快捷属性结果 */
export interface SplitAmapEventShortcutPropsResult<
    TProps extends object,
    TClickEvent extends AmapMouseEvent = AmapOverlayMouseEvent,
    TTargetEvent extends AmapTargetEvent = AmapTargetEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
    TBaseEvent extends AmapBaseEvent = AmapBaseEvent,
    TInteractionEvent extends AmapCoordinateEvent = AmapOverlayInteractionEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
    TMoveEvent extends AmapMoveEvent = AmapMoveEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
> {
    /** 事件快捷属性 */
    eventShortcuts: AmapEventShortcutProps<TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent, TMoveEvent>
    /** 剩余属性 */
    restProps: Omit<TProps, keyof AmapEventShortcutProps<TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent, TMoveEvent>>
}

/** 合并事件参数 */
export interface MergeAmapEventsParams<
    TClickEvent extends AmapMouseEvent = AmapOverlayMouseEvent,
    TTargetEvent extends AmapTargetEvent = AmapTargetEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
    TBaseEvent extends AmapBaseEvent = AmapBaseEvent,
    TInteractionEvent extends AmapCoordinateEvent = AmapOverlayInteractionEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
    TMoveEvent extends AmapMoveEvent = AmapMoveEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
    TEvents extends AmapEventMap<TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent, TMoveEvent> = AmapEventMap<
        TClickEvent,
        TTargetEvent,
        TBaseEvent,
        TInteractionEvent,
        TMoveEvent
    >,
> {
    /** 原始事件映射 */
    events?: TEvents
    /** 覆盖物事件快捷属性 */
    eventShortcuts?: AmapEventShortcutProps<TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent, TMoveEvent>
    /** 地图事件快捷属性 */
    mapEventShortcuts?: AmapMapEventShortcutProps<TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent>
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
    onMouseWheel: "mousewheel",
    onMouseOut: "mouseout",
    onMouseOver: "mouseover",
    onMouseUp: "mouseup",
    onMoveEnd: "moveend",
    onMoveStart: "movestart",
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
    onMapMouseWheel: "mousewheel",
    onMapMouseOut: "mouseout",
    onMapMouseOver: "mouseover",
    onMapMouseUp: "mouseup",
    onMapMove: "mapmove",
    onMapMoveEnd: "moveend",
    onMapMoveStart: "movestart",
    onMapResize: "resize",
    onMapRightClick: "rightclick",
    onMapRotateChange: "rotatechange",
    onMapRotateEnd: "rotateend",
    onMapRotateStart: "rotatestart",
    onMapTouchEnd: "touchend",
    onMapTouchMove: "touchmove",
    onMapTouchStart: "touchstart",
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

function assignAmapEventHandler(events: AmapEventMap, eventName: string, handler: AmapEventHandler | undefined) {
    if (handler) events[eventName] = handler
}

export function mergeAmapEvents<
    TClickEvent extends AmapMouseEvent = AmapOverlayMouseEvent,
    TTargetEvent extends AmapTargetEvent = AmapTargetEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
    TBaseEvent extends AmapBaseEvent = AmapBaseEvent,
    TInteractionEvent extends AmapCoordinateEvent = AmapOverlayInteractionEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
    TMoveEvent extends AmapMoveEvent = AmapMoveEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
    TEvents extends AmapEventMap<TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent, TMoveEvent> = AmapEventMap<
        TClickEvent,
        TTargetEvent,
        TBaseEvent,
        TInteractionEvent,
        TMoveEvent
    >,
>({
    events,
    eventShortcuts,
    mapEventShortcuts,
}: MergeAmapEventsParams<TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent, TMoveEvent, TEvents>) {
    const nextEvents: AmapEventMap<TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent, TMoveEvent> = {
        ...events,
    }

    Object.entries(AmapEventShortcutMap).forEach(([shortcutName, eventName]) => {
        const handler =
            eventShortcuts?.[
                shortcutName as keyof AmapEventShortcutProps<
                    TClickEvent,
                    TTargetEvent,
                    TBaseEvent,
                    TInteractionEvent,
                    TMoveEvent
                >
            ]

        assignAmapEventHandler(nextEvents, eventName, handler)
    })

    Object.entries(AmapMapEventShortcutMap).forEach(([shortcutName, eventName]) => {
        const handler =
            mapEventShortcuts?.[
                shortcutName as keyof AmapMapEventShortcutProps<
                    TClickEvent,
                    TTargetEvent,
                    TBaseEvent,
                    TInteractionEvent
                >
            ]

        assignAmapEventHandler(nextEvents, eventName, handler)
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
    TTargetEvent extends AmapTargetEvent = AmapTargetEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
    TBaseEvent extends AmapBaseEvent = AmapBaseEvent,
    TInteractionEvent extends AmapCoordinateEvent = AmapOverlayInteractionEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
    TMoveEvent extends AmapMoveEvent = AmapMoveEvent<AmapEventTargetFromMouseEvent<TClickEvent>>,
>(
    props: TProps
): SplitAmapEventShortcutPropsResult<TProps, TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent, TMoveEvent> {
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
        onMouseWheel,
        onMouseOut,
        onMouseOver,
        onMouseUp,
        onMoveEnd,
        onMoveStart,
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
    } = props as TProps & AmapEventShortcutProps<TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent, TMoveEvent>

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
            onMouseWheel,
            onMouseOut,
            onMouseOver,
            onMouseUp,
            onMoveEnd,
            onMoveStart,
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
