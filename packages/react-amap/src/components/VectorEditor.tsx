import { type FC, type Ref, useEffectEvent, useRef } from "react"

import {
    AmapPlugin,
    type AmapEventHandler,
    type AmapMapInstance,
    type AmapNamespace,
    useAmapContext,
} from "./Amap"
import {
    type AmapBezierCurveInstance,
    type AmapCircleInstance,
    type AmapCircleMarkerOptions,
    type AmapEllipseInstance,
    type AmapPolygonInstance,
    type AmapPolylineInstance,
    type AmapPolylineOptions,
    type AmapRectangleInstance,
    type AmapVectorOverlayBaseOptions,
} from "./Vector"
import type { AmapMarkerOptions } from "./Marker"
import { optionalFn } from "../utils/optionalFn"
import { useAmapPlugin } from "../hooks/useAmapPlugin"
import { useStableEffect } from "../hooks/useStableEffect"
import {
    type AmapEventMap,
    type AmapEventShortcutProps,
    type AmapOverlayMouseEvent,
    getAmapEventEntries,
    mergeAmapEvents,
    splitAmapEventShortcutProps,
} from "../utils/amapEvents"

export type AmapPolyEditorTarget = AmapPolygonInstance | AmapPolylineInstance

export type AmapVectorEditorOnLoad<TInstance extends AmapVectorEditorInstance = AmapVectorEditorInstance> = (
    editor: TInstance
) => void

export type AmapVectorEditorOnDestroy<TInstance extends AmapVectorEditorInstance = AmapVectorEditorInstance> = (
    editor: TInstance
) => void

/** 矢量编辑器事件映射 */
export interface AmapVectorEditorEvents<TInstance = AmapVectorEditorInstance>
    extends AmapEventMap<AmapOverlayMouseEvent<TInstance>> {}

/** 矢量编辑器基础参数 */
export interface AmapVectorEditorBaseOptions {
    /** 新创建对象样式 */
    createOptions?: AmapVectorOverlayBaseOptions
    /** 编辑对象样式 */
    editOptions?: AmapVectorOverlayBaseOptions
}

/** 多边形编辑器参数 */
export interface AmapPolygonEditorOptions extends AmapVectorEditorBaseOptions {
    /** 顶点样式 */
    controlPoint?: AmapCircleMarkerOptions
    /** 中间点样式 */
    midControlPoint?: AmapCircleMarkerOptions
}

/** 折线编辑器参数 */
export interface AmapPolylineEditorOptions extends AmapVectorEditorBaseOptions {
    /** 顶点样式 */
    controlPoint?: AmapCircleMarkerOptions
    /** 中间点样式 */
    midControlPoint?: AmapCircleMarkerOptions
}

/** 通用 PolyEditor 参数 */
export interface AmapPolyEditorOptions extends AmapVectorEditorBaseOptions {
    /** 顶点样式 */
    controlPoint?: AmapCircleMarkerOptions
    /** 中间点样式 */
    midControlPoint?: AmapCircleMarkerOptions
}

/** 圆形编辑器参数 */
export interface AmapCircleEditorOptions extends AmapVectorEditorBaseOptions {
    /** 移动点样式 */
    movePoint?: AmapMarkerOptions
    /** 调整半径点样式 */
    resizePoint?: AmapMarkerOptions
}

/** 贝塞尔曲线编辑器参数 */
export interface AmapBezierCurveEditorOptions extends AmapVectorEditorBaseOptions {
    /** 顶点样式 */
    controlPoint?: AmapMarkerOptions
    /** 中间点样式 */
    midControlPoint?: AmapMarkerOptions
    /** 贝塞尔控制点样式 */
    bezierControlPoint?: AmapMarkerOptions
    /** 贝塞尔控制线样式 */
    bezierControlLine?: AmapPolylineOptions
}

/** 椭圆编辑器参数 */
export interface AmapEllipseEditorOptions extends AmapVectorEditorBaseOptions {
    /** 移动点样式 */
    movePoint?: AmapMarkerOptions
    /** 横向调整点样式 */
    resizeXPoint?: AmapMarkerOptions
    /** 纵向调整点样式 */
    resizeYPoint?: AmapMarkerOptions
}

/** 矩形编辑器参数 */
export interface AmapRectangleEditorOptions extends AmapVectorEditorBaseOptions {
    /** 西南点样式 */
    southWestPoint?: AmapMarkerOptions
    /** 东北点样式 */
    northEastPoint?: AmapMarkerOptions
}

/** 矢量编辑器实例 */
export interface AmapVectorEditorInstance<TTarget = unknown> {
    /** 开始编辑 */
    open?(): void
    /** 停止编辑 */
    close?(): void
    /** 设置编辑对象 */
    setTarget?(target?: TTarget | null): void
    /** 获取编辑对象 */
    getTarget?(): TTarget | undefined
    /** 绑定事件 */
    on?(eventName: string, handler: AmapEventHandler): void
    /** 解绑事件 */
    off?(eventName: string, handler: AmapEventHandler): void
}

/** 多边形编辑器实例 */
export interface AmapPolygonEditorInstance extends AmapVectorEditorInstance<AmapPolygonInstance> {
    /** 设置吸附多边形 */
    setAdsorbPolygons?: (list: AmapPolygonInstance | AmapPolygonInstance[]) => void
    /** 清空吸附多边形 */
    clearAdsorbPolygons?: () => void
    /** 添加吸附多边形 */
    addAdsorbPolygons?: (list: AmapPolygonInstance | AmapPolygonInstance[]) => void
    /** 移除吸附多边形 */
    removeAdsorbPolygons?: (list: AmapPolygonInstance | AmapPolygonInstance[]) => void
}

/** 折线编辑器实例 */
export interface AmapPolylineEditorInstance extends AmapVectorEditorInstance<AmapPolylineInstance> {}

/** 通用 PolyEditor 实例 */
export interface AmapPolyEditorInstance extends AmapVectorEditorInstance<AmapPolyEditorTarget> {
    /** 设置吸附多边形 */
    setAdsorbPolygons?: (list: AmapPolygonInstance | AmapPolygonInstance[]) => void
    /** 清空吸附多边形 */
    clearAdsorbPolygons?: () => void
    /** 添加吸附多边形 */
    addAdsorbPolygons?: (list: AmapPolygonInstance | AmapPolygonInstance[]) => void
    /** 移除吸附多边形 */
    removeAdsorbPolygons?: (list: AmapPolygonInstance | AmapPolygonInstance[]) => void
}

/** 圆形编辑器实例 */
export interface AmapCircleEditorInstance extends AmapVectorEditorInstance<AmapCircleInstance> {}

/** 贝塞尔曲线编辑器实例 */
export interface AmapBezierCurveEditorInstance extends AmapVectorEditorInstance<AmapBezierCurveInstance> {}

/** 椭圆编辑器实例 */
export interface AmapEllipseEditorInstance extends AmapVectorEditorInstance<AmapEllipseInstance> {}

/** 矩形编辑器实例 */
export interface AmapRectangleEditorInstance extends AmapVectorEditorInstance<AmapRectangleInstance> {}

/** 矢量编辑器构造器 */
export interface AmapVectorEditorConstructor<
    TInstance extends AmapVectorEditorInstance<TTarget>,
    TTarget,
    TOptions extends AmapVectorEditorBaseOptions,
> {
    new (map: AmapMapInstance, target?: TTarget | null, options?: TOptions): TInstance
}

/** 支持矢量编辑器构造器的高德命名空间 */
export interface AmapVectorEditorNamespace extends AmapNamespace {
    /** PolygonEditor 构造器 */
    PolygonEditor?: new (
        map: AmapMapInstance,
        target?: AmapPolygonInstance | null,
        options?: AmapPolygonEditorOptions
    ) => AmapPolygonEditorInstance
    /** PolylineEditor 构造器 */
    PolylineEditor?: new (
        map: AmapMapInstance,
        target?: AmapPolylineInstance | null,
        options?: AmapPolylineEditorOptions
    ) => AmapPolylineEditorInstance
    /** PolyEditor 构造器 */
    PolyEditor?: new (
        map: AmapMapInstance,
        target?: AmapPolyEditorTarget | null,
        options?: AmapPolyEditorOptions
    ) => AmapPolyEditorInstance
    /** CircleEditor 构造器 */
    CircleEditor?: new (
        map: AmapMapInstance,
        target?: AmapCircleInstance | null,
        options?: AmapCircleEditorOptions
    ) => AmapCircleEditorInstance
    /** BezierCurveEditor 构造器 */
    BezierCurveEditor?: new (
        map: AmapMapInstance,
        target?: AmapBezierCurveInstance | null,
        options?: AmapBezierCurveEditorOptions
    ) => AmapBezierCurveEditorInstance
    /** EllipseEditor 构造器 */
    EllipseEditor?: new (
        map: AmapMapInstance,
        target?: AmapEllipseInstance | null,
        options?: AmapEllipseEditorOptions
    ) => AmapEllipseEditorInstance
    /** RectangleEditor 构造器 */
    RectangleEditor?: new (
        map: AmapMapInstance,
        target?: AmapRectangleInstance | null,
        options?: AmapRectangleEditorOptions
    ) => AmapRectangleEditorInstance
}

/** 合并矢量编辑器参数 */
export interface MergeAmapVectorEditorOptionsParams<TOptions extends AmapVectorEditorBaseOptions> {
    /** 额外编辑器参数 */
    editorOptions?: TOptions
    /** 透传编辑器参数 */
    extraOptions?: TOptions
}

/** 设置矢量编辑器 ref 参数 */
export interface SetAmapVectorEditorRefParams<TInstance extends AmapVectorEditorInstance> {
    /** 外部 ref */
    ref?: Ref<TInstance | null>
    /** 编辑器实例 */
    editor: TInstance | null
}

/** 获取矢量编辑器构造器参数 */
export interface GetAmapVectorEditorConstructorParams {
    /** 高德地图命名空间 */
    AMap: AmapNamespace
    /** 构造器名称 */
    constructorName: string
}

/** 绑定矢量编辑器事件参数 */
export interface BindAmapVectorEditorEventsParams<TInstance extends AmapVectorEditorInstance> {
    /** 编辑器实例 */
    editor: TInstance
    /** 事件映射 */
    events?: AmapVectorEditorEvents<TInstance>
}

/** 移除矢量编辑器参数 */
export interface RemoveAmapVectorEditorParams<TInstance extends AmapVectorEditorInstance> {
    /** 编辑器实例 */
    editor: TInstance
    /** 销毁前回调 */
    onDestroy?: AmapVectorEditorOnDestroy<TInstance>
}

/** 内部矢量编辑器组件属性 */
export interface AmapVectorEditorProps<
    TInstance extends AmapVectorEditorInstance<TTarget>,
    TTarget,
    TOptions extends AmapVectorEditorBaseOptions,
> extends AmapEventShortcutProps<AmapOverlayMouseEvent<TInstance>> {
    /** 编辑器实例 ref */
    ref?: Ref<TInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 编辑对象 */
    target?: TTarget | null
    /** 是否开启编辑 */
    active?: boolean
    /** 插件名称 */
    pluginName: AmapPlugin
    /** 构造器名称 */
    constructorName: string
    /** 编辑器参数 */
    options: TOptions
    /** 编辑器事件映射 */
    events?: AmapVectorEditorEvents<TInstance>
    /** 编辑器创建完成回调 */
    onLoad?: AmapVectorEditorOnLoad<TInstance>
    /** 编辑器销毁前回调 */
    onDestroy?: AmapVectorEditorOnDestroy<TInstance>
}

/** 多边形编辑器组件属性 */
export interface PolygonEditorProps
    extends AmapPolygonEditorOptions,
        AmapEventShortcutProps<AmapOverlayMouseEvent<AmapPolygonEditorInstance>> {
    /** 编辑器实例 ref */
    ref?: Ref<AmapPolygonEditorInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 编辑对象 */
    target?: AmapPolygonInstance | null
    /** 是否开启编辑 */
    active?: boolean
    /** 编辑器额外参数 */
    editorOptions?: AmapPolygonEditorOptions
    /** 编辑器事件映射 */
    events?: AmapVectorEditorEvents<AmapPolygonEditorInstance>
    /** 编辑器创建完成回调 */
    onLoad?: AmapVectorEditorOnLoad<AmapPolygonEditorInstance>
    /** 编辑器销毁前回调 */
    onDestroy?: AmapVectorEditorOnDestroy<AmapPolygonEditorInstance>
}

/** 折线编辑器组件属性 */
export interface PolylineEditorProps
    extends AmapPolylineEditorOptions,
        AmapEventShortcutProps<AmapOverlayMouseEvent<AmapPolylineEditorInstance>> {
    /** 编辑器实例 ref */
    ref?: Ref<AmapPolylineEditorInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 编辑对象 */
    target?: AmapPolylineInstance | null
    /** 是否开启编辑 */
    active?: boolean
    /** 编辑器额外参数 */
    editorOptions?: AmapPolylineEditorOptions
    /** 编辑器事件映射 */
    events?: AmapVectorEditorEvents<AmapPolylineEditorInstance>
    /** 编辑器创建完成回调 */
    onLoad?: AmapVectorEditorOnLoad<AmapPolylineEditorInstance>
    /** 编辑器销毁前回调 */
    onDestroy?: AmapVectorEditorOnDestroy<AmapPolylineEditorInstance>
}

/** 通用 PolyEditor 组件属性 */
export interface PolyEditorProps
    extends AmapPolyEditorOptions,
        AmapEventShortcutProps<AmapOverlayMouseEvent<AmapPolyEditorInstance>> {
    /** 编辑器实例 ref */
    ref?: Ref<AmapPolyEditorInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 编辑对象 */
    target?: AmapPolyEditorTarget | null
    /** 是否开启编辑 */
    active?: boolean
    /** 编辑器额外参数 */
    editorOptions?: AmapPolyEditorOptions
    /** 编辑器事件映射 */
    events?: AmapVectorEditorEvents<AmapPolyEditorInstance>
    /** 编辑器创建完成回调 */
    onLoad?: AmapVectorEditorOnLoad<AmapPolyEditorInstance>
    /** 编辑器销毁前回调 */
    onDestroy?: AmapVectorEditorOnDestroy<AmapPolyEditorInstance>
}

/** 圆形编辑器组件属性 */
export interface CircleEditorProps
    extends AmapCircleEditorOptions,
        AmapEventShortcutProps<AmapOverlayMouseEvent<AmapCircleEditorInstance>> {
    /** 编辑器实例 ref */
    ref?: Ref<AmapCircleEditorInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 编辑对象 */
    target?: AmapCircleInstance | null
    /** 是否开启编辑 */
    active?: boolean
    /** 编辑器额外参数 */
    editorOptions?: AmapCircleEditorOptions
    /** 编辑器事件映射 */
    events?: AmapVectorEditorEvents<AmapCircleEditorInstance>
    /** 编辑器创建完成回调 */
    onLoad?: AmapVectorEditorOnLoad<AmapCircleEditorInstance>
    /** 编辑器销毁前回调 */
    onDestroy?: AmapVectorEditorOnDestroy<AmapCircleEditorInstance>
}

/** 贝塞尔曲线编辑器组件属性 */
export interface BezierCurveEditorProps
    extends AmapBezierCurveEditorOptions,
        AmapEventShortcutProps<AmapOverlayMouseEvent<AmapBezierCurveEditorInstance>> {
    /** 编辑器实例 ref */
    ref?: Ref<AmapBezierCurveEditorInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 编辑对象 */
    target?: AmapBezierCurveInstance | null
    /** 是否开启编辑 */
    active?: boolean
    /** 编辑器额外参数 */
    editorOptions?: AmapBezierCurveEditorOptions
    /** 编辑器事件映射 */
    events?: AmapVectorEditorEvents<AmapBezierCurveEditorInstance>
    /** 编辑器创建完成回调 */
    onLoad?: AmapVectorEditorOnLoad<AmapBezierCurveEditorInstance>
    /** 编辑器销毁前回调 */
    onDestroy?: AmapVectorEditorOnDestroy<AmapBezierCurveEditorInstance>
}

/** 椭圆编辑器组件属性 */
export interface EllipseEditorProps
    extends AmapEllipseEditorOptions,
        AmapEventShortcutProps<AmapOverlayMouseEvent<AmapEllipseEditorInstance>> {
    /** 编辑器实例 ref */
    ref?: Ref<AmapEllipseEditorInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 编辑对象 */
    target?: AmapEllipseInstance | null
    /** 是否开启编辑 */
    active?: boolean
    /** 编辑器额外参数 */
    editorOptions?: AmapEllipseEditorOptions
    /** 编辑器事件映射 */
    events?: AmapVectorEditorEvents<AmapEllipseEditorInstance>
    /** 编辑器创建完成回调 */
    onLoad?: AmapVectorEditorOnLoad<AmapEllipseEditorInstance>
    /** 编辑器销毁前回调 */
    onDestroy?: AmapVectorEditorOnDestroy<AmapEllipseEditorInstance>
}

/** 矩形编辑器组件属性 */
export interface RectangleEditorProps
    extends AmapRectangleEditorOptions,
        AmapEventShortcutProps<AmapOverlayMouseEvent<AmapRectangleEditorInstance>> {
    /** 编辑器实例 ref */
    ref?: Ref<AmapRectangleEditorInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 编辑对象 */
    target?: AmapRectangleInstance | null
    /** 是否开启编辑 */
    active?: boolean
    /** 编辑器额外参数 */
    editorOptions?: AmapRectangleEditorOptions
    /** 编辑器事件映射 */
    events?: AmapVectorEditorEvents<AmapRectangleEditorInstance>
    /** 编辑器创建完成回调 */
    onLoad?: AmapVectorEditorOnLoad<AmapRectangleEditorInstance>
    /** 编辑器销毁前回调 */
    onDestroy?: AmapVectorEditorOnDestroy<AmapRectangleEditorInstance>
}

function mergeAmapVectorEditorOptions<TOptions extends AmapVectorEditorBaseOptions>({
    editorOptions,
    extraOptions,
}: MergeAmapVectorEditorOptionsParams<TOptions>) {
    const nextOptions: TOptions = {
        ...editorOptions,
    } as TOptions

    Object.entries(extraOptions ?? {}).forEach(([key, value]) => {
        if (value !== undefined) (nextOptions as Record<string, unknown>)[key] = value
    })

    return nextOptions
}

function setAmapVectorEditorRef<TInstance extends AmapVectorEditorInstance>({
    ref,
    editor,
}: SetAmapVectorEditorRefParams<TInstance>) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(editor)
        return
    }

    ref.current = editor
}

function getAmapVectorEditorConstructor<
    TInstance extends AmapVectorEditorInstance<TTarget>,
    TTarget,
    TOptions extends AmapVectorEditorBaseOptions,
>({ AMap, constructorName }: GetAmapVectorEditorConstructorParams) {
    const constructor = (AMap as unknown as Record<string, unknown>)[constructorName]

    if (typeof constructor !== "function") return undefined

    return constructor as AmapVectorEditorConstructor<TInstance, TTarget, TOptions>
}

function bindAmapVectorEditorEvents<TInstance extends AmapVectorEditorInstance>({
    editor,
    events,
}: BindAmapVectorEditorEventsParams<TInstance>) {
    const eventEntries = getAmapEventEntries(events)

    eventEntries.forEach(({ eventName, handler }) => editor.on?.(eventName, handler))

    return function unbindAmapVectorEditorEvents() {
        eventEntries.forEach(({ eventName, handler }) => editor.off?.(eventName, handler))
    }
}

function removeAmapVectorEditor<TInstance extends AmapVectorEditorInstance>({
    editor,
    onDestroy,
}: RemoveAmapVectorEditorParams<TInstance>) {
    try {
        onDestroy?.(editor)
    } finally {
        editor.close?.()
    }
}

function AmapVectorEditor<
    TInstance extends AmapVectorEditorInstance<TTarget>,
    TTarget,
    TOptions extends AmapVectorEditorBaseOptions,
>({
    ref,
    map,
    AMap,
    target,
    active,
    pluginName,
    constructorName,
    options,
    events,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...eventShortcuts
}: AmapVectorEditorProps<TInstance, TTarget, TOptions>) {
    const context = useAmapContext()
    const editorRef = useRef<TInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = AMap ?? context.AMap
    const pluginLoaded = useAmapPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName,
        constructorName,
    })
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getInitialTarget = useEffectEvent(() => target)
    const getInitialOptions = useEffectEvent(() => options)
    const getInitialActive = useEffectEvent(() => active)
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapVectorEditorEvents

    useStableEffect(() => {
        if (!currentMap || !currentAMap || !pluginLoaded) return

        const EditorConstructor = getAmapVectorEditorConstructor<TInstance, TTarget, TOptions>({
            AMap: currentAMap,
            constructorName,
        })

        if (!EditorConstructor) return

        const editor = new EditorConstructor(currentMap, getInitialTarget(), getInitialOptions())

        editorRef.current = editor
        setAmapVectorEditorRef({
            ref,
            editor,
        })

        if (getInitialActive()) editor.open?.()

        onLoad(editor)

        return () => {
            editorRef.current = null
            setAmapVectorEditorRef({
                ref,
                editor: null,
            })
            removeAmapVectorEditor({
                editor,
                onDestroy,
            })
        }
    }, [constructorName, currentAMap, currentMap, pluginLoaded, ref])

    useStableEffect(() => {
        if (!editorRef.current) return

        editorRef.current.setTarget?.(target)
    }, [target])

    useStableEffect(() => {
        if (!editorRef.current) return

        if (active) {
            editorRef.current.open?.()
            return
        }

        editorRef.current.close?.()
    }, [active])

    useStableEffect(() => {
        if (!editorRef.current) return

        return bindAmapVectorEditorEvents({
            editor: editorRef.current,
            events: currentEvents,
        })
    }, [constructorName, currentAMap, currentEvents, currentMap, pluginLoaded, ref])

    return null
}

export const PolygonEditor: FC<PolygonEditorProps> = ({
    ref,
    map,
    AMap,
    target,
    active = true,
    editorOptions,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapVectorEditorOptions({
        editorOptions,
        extraOptions: restProps as AmapPolygonEditorOptions,
    })

    return (
        <AmapVectorEditor
            ref={ref}
            map={map}
            AMap={AMap}
            target={target}
            active={active}
            pluginName={AmapPlugin.PolygonEditor}
            constructorName="PolygonEditor"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const PolylineEditor: FC<PolylineEditorProps> = ({
    ref,
    map,
    AMap,
    target,
    active = true,
    editorOptions,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapVectorEditorOptions({
        editorOptions,
        extraOptions: restProps as AmapPolylineEditorOptions,
    })

    return (
        <AmapVectorEditor
            ref={ref}
            map={map}
            AMap={AMap}
            target={target}
            active={active}
            pluginName={AmapPlugin.PolylineEditor}
            constructorName="PolylineEditor"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const PolyEditor: FC<PolyEditorProps> = ({
    ref,
    map,
    AMap,
    target,
    active = true,
    editorOptions,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapVectorEditorOptions({
        editorOptions,
        extraOptions: restProps as AmapPolyEditorOptions,
    })

    return (
        <AmapVectorEditor
            ref={ref}
            map={map}
            AMap={AMap}
            target={target}
            active={active}
            pluginName={AmapPlugin.PolyEditor}
            constructorName="PolyEditor"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const CircleEditor: FC<CircleEditorProps> = ({
    ref,
    map,
    AMap,
    target,
    active = true,
    editorOptions,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapVectorEditorOptions({
        editorOptions,
        extraOptions: restProps as AmapCircleEditorOptions,
    })

    return (
        <AmapVectorEditor
            ref={ref}
            map={map}
            AMap={AMap}
            target={target}
            active={active}
            pluginName={AmapPlugin.CircleEditor}
            constructorName="CircleEditor"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const BezierCurveEditor: FC<BezierCurveEditorProps> = ({
    ref,
    map,
    AMap,
    target,
    active = true,
    editorOptions,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapVectorEditorOptions({
        editorOptions,
        extraOptions: restProps as AmapBezierCurveEditorOptions,
    })

    return (
        <AmapVectorEditor
            ref={ref}
            map={map}
            AMap={AMap}
            target={target}
            active={active}
            pluginName={AmapPlugin.BezierCurveEditor}
            constructorName="BezierCurveEditor"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const EllipseEditor: FC<EllipseEditorProps> = ({
    ref,
    map,
    AMap,
    target,
    active = true,
    editorOptions,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapVectorEditorOptions({
        editorOptions,
        extraOptions: restProps as AmapEllipseEditorOptions,
    })

    return (
        <AmapVectorEditor
            ref={ref}
            map={map}
            AMap={AMap}
            target={target}
            active={active}
            pluginName={AmapPlugin.EllipseEditor}
            constructorName="EllipseEditor"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}

export const RectangleEditor: FC<RectangleEditorProps> = ({
    ref,
    map,
    AMap,
    target,
    active = true,
    editorOptions,
    events,
    onLoad,
    onDestroy,
    ...restOptions
}) => {
    const { eventShortcuts, restProps } = splitAmapEventShortcutProps(restOptions)
    const currentOptions = mergeAmapVectorEditorOptions({
        editorOptions,
        extraOptions: restProps as AmapRectangleEditorOptions,
    })

    return (
        <AmapVectorEditor
            ref={ref}
            map={map}
            AMap={AMap}
            target={target}
            active={active}
            pluginName={AmapPlugin.RectangleEditor}
            constructorName="RectangleEditor"
            options={currentOptions}
            events={events}
            onLoad={onLoad}
            onDestroy={onDestroy}
            {...eventShortcuts}
        />
    )
}
