import type { MapEventHandler } from "../components/Map"

/** 高德原生事件 */
export interface MapNativeEvent extends Event {
    /** 高德内部事件名 */
    Adt: string
    /** 事件经纬度 */
    lnglat?: AMap.LngLat
    /** 事件像素坐标 */
    pixel?: AMap.Pixel
}

/** 高德原生鼠标事件 */
export interface MapNativeMouseEvent extends MouseEvent {
    /** 高德内部事件名 */
    Adt: string
    /** 事件经纬度 */
    lnglat: AMap.LngLat
    /** 事件像素坐标 */
    pixel: AMap.Pixel
}

/** 高德坐标事件 */
export interface MapCoordinateEvent<TTarget = unknown, TOriginEvent extends MapNativeEvent = MapNativeEvent> {
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
export interface MapMouseEvent<TTarget = unknown> extends MapCoordinateEvent<TTarget, MapNativeMouseEvent> {}

/** 高德覆盖物鼠标事件 */
export interface MapOverlayMouseEvent<TTarget = unknown> extends MapMouseEvent<TTarget> {
    /** 矢量元素索引 */
    vectorIndex?: number
}

/** 高德地图鼠标事件 */
export interface MapInstanceMouseEvent<TTarget = AMap.Map> extends MapMouseEvent<TTarget> {}

/** 高德交互坐标事件 */
export interface MapInteractionEvent<TTarget = unknown> extends MapCoordinateEvent<TTarget> {}

/** 高德覆盖物交互坐标事件 */
export interface MapOverlayInteractionEvent<TTarget = unknown> extends MapInteractionEvent<TTarget> {
    /** 矢量元素索引 */
    vectorIndex?: number
}

/** 高德地图交互坐标事件 */
export interface MapInstanceInteractionEvent<TTarget = AMap.Map> extends MapInteractionEvent<TTarget> {}

/** 高德基础事件 */
export interface MapBaseEvent<TType extends string = string> {
    /** 事件类型 */
    type: TType
}

/** 高德目标事件 */
export interface MapTargetEvent<TTarget = unknown, TType extends string = string> extends MapBaseEvent<TType> {
    /** 事件目标 */
    target: TTarget
}

/** 高德移动动画事件 */
export interface MapMoveEvent<TTarget = unknown> extends MapTargetEvent<TTarget> {
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

export type MapMouseEventHandler<TEvent extends MapMouseEvent = MapMouseEvent> = MapEventHandler<[TEvent]>

export type MapCoordinateEventHandler<TEvent extends MapCoordinateEvent = MapCoordinateEvent> = MapEventHandler<[TEvent]>

export type MapEventTargetFromMouseEvent<TEvent extends MapMouseEvent> =
    TEvent extends MapMouseEvent<infer TTarget> ? TTarget : unknown

/** 覆盖物事件映射 */
export interface MapOverlayEventMap<TTarget = unknown>
    extends MapEventMap<
        MapOverlayMouseEvent<TTarget>,
        MapTargetEvent<TTarget>,
        MapBaseEvent,
        MapOverlayInteractionEvent<TTarget>,
        MapMoveEvent<TTarget>
    > {}

/** 覆盖物事件快捷属性 */
export interface MapOverlayEventShortcutProps<TTarget = unknown>
    extends MapEventShortcutProps<
        MapOverlayMouseEvent<TTarget>,
        MapTargetEvent<TTarget>,
        MapBaseEvent,
        MapOverlayInteractionEvent<TTarget>,
        MapMoveEvent<TTarget>
    > {}

/** 地图事件映射 */
export interface MapInstanceEvents<TTarget = AMap.Map>
    extends MapEventMap<
        MapInstanceMouseEvent<TTarget>,
        MapTargetEvent<TTarget>,
        MapBaseEvent,
        MapInstanceInteractionEvent<TTarget>
    > {}

/** 地图事件快捷属性 */
export interface MapInstanceEventShortcuts<TTarget = AMap.Map>
    extends MapInstanceEventShortcutProps<
        MapInstanceMouseEvent<TTarget>,
        MapTargetEvent<TTarget>,
        MapBaseEvent,
        MapInstanceInteractionEvent<TTarget>
    > {}

/** 高德事件映射 */
export interface MapEventMap<
    TClickEvent extends MapMouseEvent = MapOverlayMouseEvent,
    TTargetEvent extends MapTargetEvent = MapTargetEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
    TBaseEvent extends MapBaseEvent = MapBaseEvent,
    TInteractionEvent extends MapCoordinateEvent = MapOverlayInteractionEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
    TMoveEvent extends MapMoveEvent = MapMoveEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
> {
    /** 点击事件 */
    click?: MapMouseEventHandler<TClickEvent>
    /** 双击事件 */
    dblclick?: MapMouseEventHandler<TClickEvent>
    /** 双击事件别名 */
    dblClick?: MapMouseEventHandler<TClickEvent>
    /** 双击事件别名 */
    dbClick?: MapMouseEventHandler<TClickEvent>
    /** 右键事件 */
    rightclick?: MapMouseEventHandler<TClickEvent>
    /** 右键事件别名 */
    rightClick?: MapMouseEventHandler<TClickEvent>
    /** 鼠标按下事件 */
    mousedown?: MapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标抬起事件 */
    mouseup?: MapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标移动事件 */
    mousemove?: MapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标滚轮事件 */
    mousewheel?: MapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标移入事件 */
    mouseover?: MapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标移出事件 */
    mouseout?: MapCoordinateEventHandler<TInteractionEvent>
    /** 触摸开始事件 */
    touchstart?: MapCoordinateEventHandler<TInteractionEvent>
    /** 触摸移动事件 */
    touchmove?: MapCoordinateEventHandler<TInteractionEvent>
    /** 触摸结束事件 */
    touchend?: MapCoordinateEventHandler<TInteractionEvent>
    /** 拖拽开始事件 */
    dragstart?: MapCoordinateEventHandler<TInteractionEvent>
    /** 拖拽中事件 */
    dragging?: MapCoordinateEventHandler<TInteractionEvent>
    /** 拖拽结束事件 */
    dragend?: MapCoordinateEventHandler<TInteractionEvent>
    /** 移动开始事件 */
    movestart?: MapEventHandler<[TTargetEvent]>
    /** 移动中事件 */
    moving?: MapEventHandler<[TMoveEvent]>
    /** 地图移动中事件 */
    mapmove?: MapEventHandler<[TTargetEvent]>
    /** 移动结束事件 */
    moveend?: MapEventHandler<[TTargetEvent | TMoveEvent]>
    /** 缩放开始事件 */
    zoomstart?: MapEventHandler<[TTargetEvent]>
    /** 缩放变化事件 */
    zoomchange?: MapEventHandler<[TTargetEvent]>
    /** 缩放结束事件 */
    zoomend?: MapEventHandler<[TTargetEvent]>
    /** 旋转开始事件 */
    rotatestart?: MapEventHandler<[TBaseEvent]>
    /** 旋转变化事件 */
    rotatechange?: MapEventHandler<[TBaseEvent]>
    /** 旋转结束事件 */
    rotateend?: MapEventHandler<[TBaseEvent]>
    /** 尺寸变化事件 */
    resize?: MapEventHandler<[TBaseEvent]>
    /** 完成事件 */
    complete?: MapEventHandler<[TTargetEvent]>
    [eventName: string]: MapEventHandler | undefined
}

/** 高德事件条目 */
export interface MapEventEntry {
    /** 事件名 */
    eventName: string
    /** 事件处理函数 */
    handler: MapEventHandler
}

/** 覆盖物事件快捷属性 */
export interface MapEventShortcutProps<
    TClickEvent extends MapMouseEvent = MapOverlayMouseEvent,
    TTargetEvent extends MapTargetEvent = MapTargetEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
    TBaseEvent extends MapBaseEvent = MapBaseEvent,
    TInteractionEvent extends MapCoordinateEvent = MapOverlayInteractionEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
    TMoveEvent extends MapMoveEvent = MapMoveEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
> {
    /** 点击事件 */
    onClick?: MapMouseEventHandler<TClickEvent>
    /** 双击事件 */
    onDblClick?: MapMouseEventHandler<TClickEvent>
    /** 右键事件 */
    onRightClick?: MapMouseEventHandler<TClickEvent>
    /** 鼠标按下事件 */
    onMouseDown?: MapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标抬起事件 */
    onMouseUp?: MapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标移动事件 */
    onMouseMove?: MapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标滚轮事件 */
    onMouseWheel?: MapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标移入事件 */
    onMouseOver?: MapCoordinateEventHandler<TInteractionEvent>
    /** 鼠标移出事件 */
    onMouseOut?: MapCoordinateEventHandler<TInteractionEvent>
    /** 触摸开始事件 */
    onTouchStart?: MapCoordinateEventHandler<TInteractionEvent>
    /** 触摸移动事件 */
    onTouchMove?: MapCoordinateEventHandler<TInteractionEvent>
    /** 触摸结束事件 */
    onTouchEnd?: MapCoordinateEventHandler<TInteractionEvent>
    /** 拖拽开始事件 */
    onDragStart?: MapCoordinateEventHandler<TInteractionEvent>
    /** 拖拽中事件 */
    onDragging?: MapCoordinateEventHandler<TInteractionEvent>
    /** 拖拽结束事件 */
    onDragEnd?: MapCoordinateEventHandler<TInteractionEvent>
    /** 移动开始事件 */
    onMoveStart?: MapEventHandler<[TTargetEvent]>
    /** 移动中事件 */
    onMoving?: MapEventHandler<[TMoveEvent]>
    /** 移动结束事件 */
    onMoveEnd?: MapEventHandler<[TTargetEvent | TMoveEvent]>
    /** 缩放开始事件 */
    onZoomStart?: MapEventHandler<[TTargetEvent]>
    /** 缩放变化事件 */
    onZoomChange?: MapEventHandler<[TTargetEvent]>
    /** 缩放结束事件 */
    onZoomEnd?: MapEventHandler<[TTargetEvent]>
    /** 旋转开始事件 */
    onRotateStart?: MapEventHandler<[TBaseEvent]>
    /** 旋转变化事件 */
    onRotateChange?: MapEventHandler<[TBaseEvent]>
    /** 旋转结束事件 */
    onRotateEnd?: MapEventHandler<[TBaseEvent]>
    /** 地图完成事件 */
    onComplete?: MapEventHandler<[TTargetEvent]>
    /** 打开事件 */
    onOpen?: MapEventHandler
    /** 关闭事件 */
    onClose?: MapEventHandler
    /** 改变事件 */
    onChange?: MapEventHandler
    /** 结束事件 */
    onEnd?: MapEventHandler
}

/** 地图事件快捷属性 */
export interface MapInstanceEventShortcutProps<
    TClickEvent extends MapMouseEvent = MapInstanceMouseEvent,
    TTargetEvent extends MapTargetEvent = MapTargetEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
    TBaseEvent extends MapBaseEvent = MapBaseEvent,
    TInteractionEvent extends MapCoordinateEvent = MapInstanceInteractionEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
> {
    /** 地图点击事件 */
    onMapClick?: MapMouseEventHandler<TClickEvent>
    /** 地图双击事件 */
    onMapDblClick?: MapMouseEventHandler<TClickEvent>
    /** 地图右键事件 */
    onMapRightClick?: MapMouseEventHandler<TClickEvent>
    /** 地图鼠标按下事件 */
    onMapMouseDown?: MapCoordinateEventHandler<TInteractionEvent>
    /** 地图鼠标抬起事件 */
    onMapMouseUp?: MapCoordinateEventHandler<TInteractionEvent>
    /** 地图鼠标移动事件 */
    onMapMouseMove?: MapCoordinateEventHandler<TInteractionEvent>
    /** 地图鼠标滚轮事件 */
    onMapMouseWheel?: MapCoordinateEventHandler<TInteractionEvent>
    /** 地图鼠标移入事件 */
    onMapMouseOver?: MapCoordinateEventHandler<TInteractionEvent>
    /** 地图鼠标移出事件 */
    onMapMouseOut?: MapCoordinateEventHandler<TInteractionEvent>
    /** 地图触摸开始事件 */
    onMapTouchStart?: MapCoordinateEventHandler<TInteractionEvent>
    /** 地图触摸移动事件 */
    onMapTouchMove?: MapCoordinateEventHandler<TInteractionEvent>
    /** 地图触摸结束事件 */
    onMapTouchEnd?: MapCoordinateEventHandler<TInteractionEvent>
    /** 地图拖拽开始事件 */
    onMapDragStart?: MapCoordinateEventHandler<TInteractionEvent>
    /** 地图拖拽中事件 */
    onMapDragging?: MapCoordinateEventHandler<TInteractionEvent>
    /** 地图拖拽结束事件 */
    onMapDragEnd?: MapCoordinateEventHandler<TInteractionEvent>
    /** 地图移动开始事件 */
    onMapMoveStart?: MapEventHandler<[TTargetEvent]>
    /** 地图移动中事件 */
    onMapMove?: MapEventHandler<[TTargetEvent]>
    /** 地图移动结束事件 */
    onMapMoveEnd?: MapEventHandler<[TTargetEvent]>
    /** 地图缩放开始事件 */
    onMapZoomStart?: MapEventHandler<[TTargetEvent]>
    /** 地图缩放变化事件 */
    onMapZoomChange?: MapEventHandler<[TTargetEvent]>
    /** 地图缩放结束事件 */
    onMapZoomEnd?: MapEventHandler<[TTargetEvent]>
    /** 地图旋转开始事件 */
    onMapRotateStart?: MapEventHandler<[TBaseEvent]>
    /** 地图旋转变化事件 */
    onMapRotateChange?: MapEventHandler<[TBaseEvent]>
    /** 地图旋转结束事件 */
    onMapRotateEnd?: MapEventHandler<[TBaseEvent]>
    /** 地图尺寸变化事件 */
    onMapResize?: MapEventHandler<[TBaseEvent]>
    /** 地图加载完成事件 */
    onMapComplete?: MapEventHandler<[TTargetEvent]>
}

/** 拆分事件快捷属性结果 */
export interface SplitMapEventShortcutPropsResult<
    TProps extends object,
    TClickEvent extends MapMouseEvent = MapOverlayMouseEvent,
    TTargetEvent extends MapTargetEvent = MapTargetEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
    TBaseEvent extends MapBaseEvent = MapBaseEvent,
    TInteractionEvent extends MapCoordinateEvent = MapOverlayInteractionEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
    TMoveEvent extends MapMoveEvent = MapMoveEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
> {
    /** 事件快捷属性 */
    eventShortcuts: MapEventShortcutProps<TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent, TMoveEvent>
    /** 剩余属性 */
    restProps: Omit<TProps, keyof MapEventShortcutProps<TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent, TMoveEvent>>
}

/** 合并事件参数 */
export interface MergeMapEventsParams<
    TClickEvent extends MapMouseEvent = MapOverlayMouseEvent,
    TTargetEvent extends MapTargetEvent = MapTargetEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
    TBaseEvent extends MapBaseEvent = MapBaseEvent,
    TInteractionEvent extends MapCoordinateEvent = MapOverlayInteractionEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
    TMoveEvent extends MapMoveEvent = MapMoveEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
    TEvents extends MapEventMap<TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent, TMoveEvent> = MapEventMap<
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
    eventShortcuts?: MapEventShortcutProps<TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent, TMoveEvent>
    /** 地图事件快捷属性 */
    mapEventShortcuts?: MapInstanceEventShortcutProps<TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent>
}

/** 覆盖物事件快捷属性到高德事件名映射 */
export const MapEventShortcutMap = {
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
export const MapInstanceEventShortcutMap = {
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
export const MapEventAliasMap = {
    dbClick: "dblclick",
    dblClick: "dblclick",
    rightClick: "rightclick",
} as const

function assignMapEventHandler(events: MapEventMap, eventName: string, handler: MapEventHandler | undefined) {
    if (handler) events[eventName] = handler
}

export function mergeMapEvents<
    TClickEvent extends MapMouseEvent = MapOverlayMouseEvent,
    TTargetEvent extends MapTargetEvent = MapTargetEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
    TBaseEvent extends MapBaseEvent = MapBaseEvent,
    TInteractionEvent extends MapCoordinateEvent = MapOverlayInteractionEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
    TMoveEvent extends MapMoveEvent = MapMoveEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
    TEvents extends MapEventMap<TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent, TMoveEvent> = MapEventMap<
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
}: MergeMapEventsParams<TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent, TMoveEvent, TEvents>) {
    const nextEvents: MapEventMap<TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent, TMoveEvent> = {
        ...events,
    }

    Object.entries(MapEventShortcutMap).forEach(([shortcutName, eventName]) => {
        const handler =
            eventShortcuts?.[
                shortcutName as keyof MapEventShortcutProps<
                    TClickEvent,
                    TTargetEvent,
                    TBaseEvent,
                    TInteractionEvent,
                    TMoveEvent
                >
            ]

        assignMapEventHandler(nextEvents, eventName, handler)
    })

    Object.entries(MapInstanceEventShortcutMap).forEach(([shortcutName, eventName]) => {
        const handler =
            mapEventShortcuts?.[
                shortcutName as keyof MapInstanceEventShortcutProps<
                    TClickEvent,
                    TTargetEvent,
                    TBaseEvent,
                    TInteractionEvent
                >
            ]

        assignMapEventHandler(nextEvents, eventName, handler)
    })

    return nextEvents
}

export function getMapEventEntries<TEvents extends MapEventMap>(events?: TEvents) {
    return Object.entries(events ?? {}).reduce<MapEventEntry[]>((entries, [eventName, handler]) => {
        if (typeof handler === "function") {
            const normalizedEventName = MapEventAliasMap[eventName as keyof typeof MapEventAliasMap] ?? eventName

            entries.push({
                eventName: normalizedEventName,
                handler,
            })
        }

        return entries
    }, [])
}

export function splitMapEventShortcutProps<
    TProps extends object,
    TClickEvent extends MapMouseEvent = MapOverlayMouseEvent,
    TTargetEvent extends MapTargetEvent = MapTargetEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
    TBaseEvent extends MapBaseEvent = MapBaseEvent,
    TInteractionEvent extends MapCoordinateEvent = MapOverlayInteractionEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
    TMoveEvent extends MapMoveEvent = MapMoveEvent<MapEventTargetFromMouseEvent<TClickEvent>>,
>(
    props: TProps
): SplitMapEventShortcutPropsResult<TProps, TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent, TMoveEvent> {
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
    } = props as TProps & MapEventShortcutProps<TClickEvent, TTargetEvent, TBaseEvent, TInteractionEvent, TMoveEvent>

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