import type { AmapEventHandler } from "../components/Amap"

/** 高德事件映射 */
export interface AmapEventMap {
    [eventName: string]: AmapEventHandler | undefined
}

/** 覆盖物事件快捷属性 */
export interface AmapEventShortcutProps {
    /** 点击事件 */
    onClick?: AmapEventHandler
    /** 双击事件 */
    onDblClick?: AmapEventHandler
    /** 右键事件 */
    onRightClick?: AmapEventHandler
    /** 鼠标按下事件 */
    onMouseDown?: AmapEventHandler
    /** 鼠标抬起事件 */
    onMouseUp?: AmapEventHandler
    /** 鼠标移动事件 */
    onMouseMove?: AmapEventHandler
    /** 鼠标移入事件 */
    onMouseOver?: AmapEventHandler
    /** 鼠标移出事件 */
    onMouseOut?: AmapEventHandler
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
export interface AmapMapEventShortcutProps {
    /** 地图点击事件 */
    onMapClick?: AmapEventHandler
    /** 地图双击事件 */
    onMapDblClick?: AmapEventHandler
    /** 地图右键事件 */
    onMapRightClick?: AmapEventHandler
    /** 地图鼠标按下事件 */
    onMapMouseDown?: AmapEventHandler
    /** 地图鼠标抬起事件 */
    onMapMouseUp?: AmapEventHandler
    /** 地图鼠标移动事件 */
    onMapMouseMove?: AmapEventHandler
    /** 地图鼠标移入事件 */
    onMapMouseOver?: AmapEventHandler
    /** 地图鼠标移出事件 */
    onMapMouseOut?: AmapEventHandler
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
export interface SplitAmapEventShortcutPropsResult<TProps extends Record<string, unknown>> {
    /** 事件快捷属性 */
    eventShortcuts: AmapEventShortcutProps
    /** 剩余属性 */
    restProps: Omit<TProps, keyof AmapEventShortcutProps>
}

/** 合并事件参数 */
export interface MergeAmapEventsParams<TEvents extends AmapEventMap = AmapEventMap> {
    /** 原始事件映射 */
    events?: TEvents
    /** 覆盖物事件快捷属性 */
    eventShortcuts?: AmapEventShortcutProps
    /** 地图事件快捷属性 */
    mapEventShortcuts?: AmapMapEventShortcutProps
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

export function mergeAmapEvents<TEvents extends AmapEventMap = AmapEventMap>({
    events,
    eventShortcuts,
    mapEventShortcuts,
}: MergeAmapEventsParams<TEvents>) {
    const nextEvents: AmapEventMap = {
        ...events,
    }

    Object.entries(AmapEventShortcutMap).forEach(([shortcutName, eventName]) => {
        const handler = eventShortcuts?.[shortcutName as keyof AmapEventShortcutProps]

        if (handler) nextEvents[eventName] = handler
    })

    Object.entries(AmapMapEventShortcutMap).forEach(([shortcutName, eventName]) => {
        const handler = mapEventShortcuts?.[shortcutName as keyof AmapMapEventShortcutProps]

        if (handler) nextEvents[eventName] = handler
    })

    return nextEvents
}

export function splitAmapEventShortcutProps<TProps extends Record<string, unknown>>(
    props: TProps
): SplitAmapEventShortcutPropsResult<TProps> {
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
    } = props as TProps & AmapEventShortcutProps

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
