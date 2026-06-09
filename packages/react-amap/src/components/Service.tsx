import { type FC, type Ref, useEffect, useEffectEvent, useRef, useState } from "react"

import {
    AmapPlugin,
    type AmapEventHandler,
    type AmapLngLatLike,
    type AmapMapInstance,
    type AmapNamespace,
    useAmapContext,
} from "./Amap"
import type { ControlPosition } from "./Control"
import type { AmapMarkerOptions } from "./Marker"
import type { AmapCircleOptions, AmapPolylineOptions } from "./Vector"
import { useAmapPlugin } from "../hooks/useAmapPlugin"
import { optionalFn } from "../utils/optionalFn"
import { useStableEffect } from "../hooks/useStableEffect"
import {
    type AmapEventMap,
    type AmapEventShortcutProps,
    type AmapOverlayMouseEvent,
    getAmapEventEntries,
    mergeAmapEvents,
} from "../utils/amapEvents"

export type AmapServiceOnLoad<TInstance extends AmapServiceInstance = AmapServiceInstance> = (
    service: TInstance
) => void

export type AmapServiceOnDestroy<TInstance extends AmapServiceInstance = AmapServiceInstance> = (
    service: TInstance
) => void

export type AmapServiceCallback<TResult = unknown> = (status: string, result: TResult) => void

export type AmapWeatherCallback<TResult = unknown> = (error: unknown, result: TResult) => void

export type AmapWebServiceCallback<TResult = unknown> = (error: unknown, result: TResult) => void

export type AmapMoveDurationCallback = (index: number, route: unknown) => number

/** 服务语言类型 */
export const AmapServiceLanguage = {
    中文: "zh_cn",
    英文: "en",
} as const

export type AmapServiceLanguage = (typeof AmapServiceLanguage)[keyof typeof AmapServiceLanguage]

/** 返回信息详略 */
export const AmapServiceExtensions = {
    基础信息: "base",
    详细信息: "all",
} as const

export type AmapServiceExtensions = (typeof AmapServiceExtensions)[keyof typeof AmapServiceExtensions]

/** 输入提示返回数据类型 */
export const AmapAutoCompleteDataType = {
    全部: "all",
    POI: "poi",
    公交站点: "bus",
    公交线路: "busline",
} as const

export type AmapAutoCompleteDataType = (typeof AmapAutoCompleteDataType)[keyof typeof AmapAutoCompleteDataType]

/** 行政区查询级别 */
export const AmapDistrictSearchLevel = {
    国家: "country",
    省直辖市: "province",
    市: "city",
    区县: "district",
    商圈: "biz_area",
} as const

export type AmapDistrictSearchLevel = (typeof AmapDistrictSearchLevel)[keyof typeof AmapDistrictSearchLevel]

/** 定位来源禁用策略 */
export const AmapGeolocationDisabledPolicy = {
    全部启用: 0,
    手机端禁用: 1,
    PC端禁用: 2,
    全部禁用: 3,
} as const

export type AmapGeolocationDisabledPolicy =
    (typeof AmapGeolocationDisabledPolicy)[keyof typeof AmapGeolocationDisabledPolicy]

/** 坐标转换来源类型 */
export const AmapCoordinateConvertType = {
    GPS: "gps",
} as const

export type AmapCoordinateConvertType = (typeof AmapCoordinateConvertType)[keyof typeof AmapCoordinateConvertType] | string

/** 服务事件映射 */
export interface AmapServiceEvents<TInstance = AmapServiceInstance> extends AmapEventMap<AmapOverlayMouseEvent<TInstance>> {}

/** 服务基础参数 */
export interface AmapServiceBaseOptions {
    [key: string]: unknown
}

/** 服务实例运行时能力 */
export interface AmapServiceInstance {
    /** 绑定事件 */
    on?: (eventName: string, handler: AmapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: AmapEventHandler) => void
    /** 清除服务绘制结果 */
    clear?: () => void
    /** 销毁服务 */
    destroy?: () => void
    /** 关闭服务 */
    close?: () => void
    /** 从地图移除服务 */
    setMap?: (map: AmapMapInstance | null) => void
    [key: string]: unknown
}

/** 服务构造器 */
export interface AmapServiceConstructor<TInstance extends AmapServiceInstance, TOptions extends AmapServiceBaseOptions> {
    new (options?: TOptions): TInstance
}

/** 创建服务参数 */
export interface CreateAmapServiceParams<TOptions extends AmapServiceBaseOptions> {
    /** 地图实例 */
    map: AmapMapInstance | null
    /** 高德地图命名空间 */
    AMap: AmapNamespace
    /** 构造器名称 */
    constructorName: string
    /** 服务参数 */
    options: TOptions
}

export type CreateAmapService<TInstance extends AmapServiceInstance, TOptions extends AmapServiceBaseOptions> = (
    params: CreateAmapServiceParams<TOptions>
) => TInstance | null | undefined

/** 销毁服务参数 */
export interface DestroyAmapServiceParams<TInstance extends AmapServiceInstance> {
    /** 服务实例 */
    service: TInstance
}

export type DestroyAmapService<TInstance extends AmapServiceInstance> = (
    params: DestroyAmapServiceParams<TInstance>
) => void

/** 更新服务参数 */
export interface UpdateAmapServiceParams<TInstance extends AmapServiceInstance, TOptions extends AmapServiceBaseOptions> {
    /** 服务实例 */
    service: TInstance
    /** 服务参数 */
    options: TOptions
}

export type UpdateAmapService<TInstance extends AmapServiceInstance, TOptions extends AmapServiceBaseOptions> = (
    params: UpdateAmapServiceParams<TInstance, TOptions>
) => void

/** 使用服务参数 */
export interface UseAmapServiceParams<TInstance extends AmapServiceInstance, TOptions extends AmapServiceBaseOptions>
    extends AmapEventShortcutProps<AmapOverlayMouseEvent<TInstance>> {
    /** 服务实例 ref */
    ref?: Ref<TInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 是否启用服务 */
    enabled?: boolean
    /** 插件名称 */
    pluginName: AmapPlugin
    /** 构造器名称 */
    constructorName: string
    /** 服务参数 */
    options?: TOptions
    /** 服务事件映射 */
    events?: AmapServiceEvents<TInstance>
    /** 自定义创建服务 */
    createService?: CreateAmapService<TInstance, TOptions>
    /** 自定义更新服务 */
    updateService?: UpdateAmapService<TInstance, TOptions>
    /** 自定义销毁服务 */
    destroyService?: DestroyAmapService<TInstance>
    /** 创建完成回调 */
    onLoad?: AmapServiceOnLoad<TInstance>
    /** 销毁前回调 */
    onDestroy?: AmapServiceOnDestroy<TInstance>
}

/** 服务组件通用属性 */
export interface AmapServiceProps<TInstance extends AmapServiceInstance>
    extends AmapEventShortcutProps<AmapOverlayMouseEvent<TInstance>> {
    /** 服务实例 ref */
    ref?: Ref<TInstance | null>
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 是否启用服务 */
    enabled?: boolean
    /** 服务事件映射 */
    events?: AmapServiceEvents<TInstance>
    /** 创建完成回调 */
    onLoad?: AmapServiceOnLoad<TInstance>
    /** 销毁前回调 */
    onDestroy?: AmapServiceOnDestroy<TInstance>
}

/** 地理编码参数 */
export interface AmapGeocoderOptions extends AmapServiceBaseOptions {
    /** 城市 */
    city?: string
    /** 逆地理编码半径 */
    radius?: number
    /** 语言 */
    lang?: AmapServiceLanguage
    /** 是否批量查询 */
    batch?: boolean
    /** 返回信息详略 */
    extensions?: AmapServiceExtensions
}

/** 地理编码实例 */
export interface AmapGeocoderInstance extends AmapServiceInstance {
    /** 地址转坐标 */
    getLocation?: (keyword: string, callback?: AmapServiceCallback) => void
    /** 设置城市 */
    setCity?: (city: string) => void
    /** 坐标转地址 */
    getAddress?: (location: AmapLngLatLike | AmapLngLatLike[], callback?: AmapServiceCallback) => void
}

/** 输入提示参数 */
export interface AmapAutoCompleteOptions extends AmapServiceBaseOptions {
    /** POI 类型 */
    type?: string
    /** 城市 */
    city?: string
    /** 数据类型 */
    datatype?: AmapAutoCompleteDataType
    /** 是否限制城市 */
    citylimit?: boolean
    /** 输入框 */
    input?: string | HTMLInputElement
    /** 输出容器 */
    output?: string | HTMLDivElement
    /** 是否自动调整输出方向 */
    outPutDirAuto?: boolean
    /** 滚动时是否关闭结果 */
    closeResultOnScroll?: boolean
    /** 语言 */
    lang?: AmapServiceLanguage
}

/** 输入提示实例 */
export interface AmapAutoCompleteInstance extends AmapServiceInstance {
    /** 设置 POI 类型 */
    setType?: (type: string) => void
    /** 设置城市 */
    setCity?: (city: string) => void
    /** 设置是否限制城市 */
    setCityLimit?: (cityLimit: boolean) => void
    /** 搜索提示 */
    search?: (keyword: string, callback?: AmapServiceCallback) => void
}

/** POI 搜索参数 */
export interface AmapPlaceSearchOptions extends AmapServiceBaseOptions {
    /** 地图实例 */
    map?: AmapMapInstance
    /** 城市 */
    city?: string
    /** POI 类型 */
    type?: string
    /** 每页结果数 */
    pageSize?: number
    /** 页码 */
    pageIndex?: number
    /** 返回信息详略 */
    extensions?: AmapServiceExtensions
    /** 结果面板 */
    panel?: string | HTMLElement
    /** 是否限制城市 */
    citylimit?: boolean
    /** 是否自动适配视野 */
    autoFitView?: boolean
}

/** 高德客户端 POI 参数 */
export interface AmapPoiOnAmapOptions {
    /** POI ID */
    id?: string
    /** POI 名称 */
    name: string
    /** POI 坐标 */
    location: AmapLngLatLike
    /** POI 地址 */
    address?: string
    [key: string]: unknown
}

/** 唤起高德客户端参数 */
export interface AmapOpenAmapOptions {
    [key: string]: unknown
}

/** POI 搜索实例 */
export interface AmapPlaceSearchInstance extends AmapServiceInstance {
    /** 关键字搜索 */
    search?: (keyword: string, callback?: AmapServiceCallback) => void
    /** 范围搜索 */
    searchInBounds?: (keyword: string, bounds: unknown, callback?: AmapServiceCallback) => void
    /** 周边搜索 */
    searchNearBy?: (keyword: string, center: AmapLngLatLike, radius: number, callback?: AmapServiceCallback) => void
    /** 查询 POI 详情 */
    getDetails?: (id: string, callback?: AmapServiceCallback) => void
    /** 设置 POI 类型 */
    setType?: (type: string) => void
    /** 设置页码 */
    setPageIndex?: (pageIndex: number) => void
    /** 设置每页数量 */
    setPageSize?: (pageSize: number) => void
    /** 设置城市 */
    setCity?: (city: string) => void
    /** 设置是否限制城市 */
    setCityLimit?: (cityLimit: boolean) => void
    /** 唤起高德地图客户端 Marker 页 */
    poiOnAMAP?: (poi: AmapPoiOnAmapOptions, options?: AmapOpenAmapOptions) => void
    /** 唤起高德地图客户端详情页 */
    detailOnAMAP?: (poi: AmapPoiOnAmapOptions, options?: AmapOpenAmapOptions) => void
}

/** 云数据检索参数 */
export interface AmapCloudDataSearchOptions extends AmapServiceBaseOptions {
    /** 地图实例 */
    map?: AmapMapInstance
    /** 关键字 */
    keywords?: string
    /** 筛选条件 */
    filter?: string
    /** 排序规则 */
    orderBy?: string
    /** 每页数量 */
    pageSize?: number
    /** 页码 */
    pageIndex?: number
    /** 结果面板 */
    panel?: string | HTMLElement
    /** 是否自动适配视野 */
    autoFitView?: boolean
}

/** 云数据检索实例 */
export interface AmapCloudDataSearchInstance extends AmapServiceInstance {
    /** 设置检索参数 */
    setOptions?: (options: AmapCloudDataSearchOptions) => void
    /** 周边检索 */
    searchNearBy?: (center: AmapLngLatLike, radius: number, callback?: AmapServiceCallback) => void
    /** ID 检索 */
    searchById?: (id: string, callback?: AmapServiceCallback) => void
    /** 行政区检索 */
    searchByDistrict?: (district: string, callback?: AmapServiceCallback) => void
    /** 多边形检索 */
    searchInPolygon?: (path: AmapLngLatLike[], callback?: AmapServiceCallback) => void
}

/** 路线规划途经点参数 */
export interface AmapRouteSearchOptions {
    /** 途经点 */
    waypoints?: AmapLngLatLike[]
    [key: string]: unknown
}

/** 名称路线规划点 */
export interface AmapRouteKeywordPoint {
    /** 关键字 */
    keyword: string
    /** 城市 */
    city?: string
    [key: string]: unknown
}

/** 路线规划基础参数 */
export interface AmapRouteServiceOptions extends AmapServiceBaseOptions {
    /** 地图实例 */
    map?: AmapMapInstance
    /** 路线策略 */
    policy?: number | string
    /** 返回信息详略 */
    extensions?: AmapServiceExtensions
    /** 结果面板 */
    panel?: string | HTMLElement
    /** 是否隐藏起终点标记 */
    hideMarkers?: boolean
    /** 是否显示实时路况 */
    showTraffic?: boolean
    /** 车牌省份 */
    province?: string
    /** 车牌号码 */
    number?: string
    /** 是否显示描边 */
    isOutline?: boolean
    /** 描边颜色 */
    outlineColor?: string
    /** 是否自动适配视野 */
    autoFitView?: boolean
}

/** 驾车规划参数 */
export interface AmapDrivingOptions extends AmapRouteServiceOptions {
    /** 是否允许轮渡 */
    ferry?: number
}

/** 货车规划参数 */
export interface AmapTruckDrivingOptions extends AmapDrivingOptions {
    /** 车型大小 */
    size?: number
    /** 宽度 */
    width?: number
    /** 高度 */
    height?: number
    /** 载重 */
    load?: number
    /** 自重 */
    weight?: number
    /** 轴数 */
    axlesNum?: number
}

/** 公交规划参数 */
export interface AmapTransferOptions extends AmapRouteServiceOptions {
    /** 城市 */
    city?: string
    /** 目的城市 */
    cityd?: string
}

/** 路线规划实例 */
export interface AmapRouteServiceInstance extends AmapServiceInstance {
    /** 按坐标或关键字规划路线 */
    search?: (
        originOrPoints: AmapLngLatLike | AmapRouteKeywordPoint[],
        destinationOrCallback?: AmapLngLatLike | AmapServiceCallback,
        optionsOrCallback?: AmapRouteSearchOptions | AmapServiceCallback,
        callback?: AmapServiceCallback
    ) => void
    /** 设置路线策略 */
    setPolicy?: (policy: number | string) => void
}

/** 驾车规划实例 */
export interface AmapDrivingInstance extends AmapRouteServiceInstance {
    /** 设置避让区域 */
    setAvoidPolygons?: (areas: AmapLngLatLike[][]) => void
    /** 清除避让区域 */
    clearAvoidPolygons?: () => void
    /** 获取避让区域 */
    getAvoidPolygons?: () => unknown[][]
    /** 设置避让道路 */
    setAvoidRoad?: (road: string) => void
    /** 清除避让道路 */
    clearAvoidRoad?: () => void
    /** 获取避让道路 */
    getAvoidRoad?: () => string
    /** 设置车牌 */
    setProvinceAndNumber?: (province: string, number: string) => void
}

/** 货车规划实例 */
export interface AmapTruckDrivingInstance extends AmapDrivingInstance {}

/** 步行规划实例 */
export interface AmapWalkingInstance extends AmapRouteServiceInstance {}

/** 公交规划实例 */
export interface AmapTransferInstance extends AmapRouteServiceInstance {
    /** 设置出发时间 */
    leaveAt?: (time: Date | string | number) => void
    /** 设置城市 */
    setCity?: (city: string) => void
    /** 设置目的城市 */
    setCityd?: (city: string) => void
}

/** 骑行规划实例 */
export interface AmapRidingInstance extends AmapRouteServiceInstance {}

/** 拖拽路线参数 */
export interface AmapDragRouteOptions extends AmapServiceBaseOptions {
    /** 路线样式 */
    polyOption?: AmapPolylineOptions
    /** 起点标记样式 */
    startMarkerOptions?: AmapMarkerOptions
    /** 途经点标记样式 */
    midMarkerOptions?: AmapMarkerOptions
    /** 终点标记样式 */
    endMarkerOptions?: AmapMarkerOptions
    /** 是否显示实时路况 */
    showTraffic?: boolean
}

/** 货车拖拽路线参数 */
export interface AmapDragRouteTruckOptions extends AmapDragRouteOptions, AmapTruckDrivingOptions {
    /** 车辆类型 */
    cartype?: number
    /** 是否返回路线数据 */
    showpolyline?: number
    /** 是否返回步骤 */
    nosteps?: number
    /** 是否拖拽后自动刷新 */
    autoRefresh?: boolean
    /** 自动刷新延迟 */
    refreshTime?: number
    /** API 版本 */
    apiVersion?: number | string
    /** 返回字段 */
    showFields?: string
}

/** 货车拖拽路线位置 */
export interface AmapDragRouteTruckLocation {
    /** 经纬度 */
    lnglat: AmapLngLatLike
    [key: string]: unknown
}

/** 拖拽路线实例 */
export interface AmapDragRouteInstance extends AmapServiceInstance {
    /** 开始导航 */
    search?: () => void
    /** 获取途经点 */
    getWays?: () => AmapLngLatLike[]
    /** 获取当前路线 */
    getRoute?: () => AmapLngLatLike[]
}

/** 货车拖拽路线实例 */
export interface AmapDragRouteTruckInstance extends AmapServiceInstance {
    /** 设置避让区域 */
    setAvoidPolygons?: (areas: AmapLngLatLike[][]) => void
    /** 清除避让区域 */
    clearAvoidPolygons?: () => void
    /** 获取避让区域 */
    getAvoidPolygons?: () => unknown[][]
    /** 开始导航 */
    search?: (locations?: AmapDragRouteTruckLocation[]) => void
    /** 手动更新路径 */
    updatePath?: () => void
    /** 获取途经点 */
    getWays?: () => AmapLngLatLike[]
    /** 获取当前路线 */
    getRoute?: () => AmapLngLatLike[]
    /** 修改配置项 */
    setOption?: (options: AmapDragRouteTruckOptions) => void
}

/** 轨迹纠偏点 */
export interface AmapGraspRoadPoint {
    /** 经度 */
    x: number
    /** 纬度 */
    y: number
    /** 速度 */
    sp?: number
    /** 角度 */
    ag?: number
    /** 时间 */
    tm?: number
    [key: string]: unknown
}

/** 轨迹纠偏实例 */
export interface AmapGraspRoadInstance extends AmapServiceInstance {
    /** 驾车轨迹纠偏 */
    driving?: (path: AmapGraspRoadPoint[], callback?: AmapServiceCallback) => void
}

/** 行政区查询参数 */
export interface AmapDistrictSearchOptions extends AmapServiceBaseOptions {
    /** 行政区级别 */
    level?: AmapDistrictSearchLevel
    /** 是否显示商圈 */
    showbiz?: boolean
    /** 返回信息详略 */
    extensions?: AmapServiceExtensions
    /** 下级行政区级数 */
    subdistrict?: number
}

/** 行政区查询实例 */
export interface AmapDistrictSearchInstance extends AmapServiceInstance {
    /** 设置行政区级别 */
    setLevel?: (level: string) => void
    /** 设置下级行政区级数 */
    setSubdistrict?: (subdistrict: number) => void
    /** 查询行政区 */
    search?: (keyword: string, callback?: AmapServiceCallback) => void
}

/** 天气查询实例 */
export interface AmapWeatherInstance extends AmapServiceInstance {
    /** 查询实时天气 */
    getLive?: (city: string, callback?: AmapWeatherCallback) => void
    /** 查询天气预报 */
    getForecast?: (city: string, callback?: AmapWeatherCallback) => void
}

/** 公交查询参数 */
export interface AmapBusSearchOptions extends AmapServiceBaseOptions {
    /** 页码 */
    pageIndex?: number
    /** 单页数量 */
    pageSize?: number
    /** 城市 */
    city?: string
    /** 返回信息详略 */
    extensions?: AmapServiceExtensions
}

/** 公交查询实例 */
export interface AmapBusSearchInstance extends AmapServiceInstance {
    /** 设置页码 */
    setPageIndex?: (pageIndex: number) => void
    /** 设置单页数量 */
    setPageSize?: (pageSize: number) => void
    /** 设置城市 */
    setCity?: (city: string) => void
    /** 关键字或 ID 查询 */
    search?: (keyword: string, callback?: AmapServiceCallback) => void
}

/** 公交站点查询实例 */
export interface AmapStationSearchInstance extends AmapBusSearchInstance {}

/** 公交线路查询实例 */
export interface AmapLineSearchInstance extends AmapBusSearchInstance {}

/** 定位参数 */
export interface AmapGeolocationOptions extends AmapServiceBaseOptions {
    /** 控件停靠位置 */
    position?: ControlPosition
    /** 控件偏移量 */
    offset?: [number, number]
    /** 边框颜色 */
    borderColor?: string
    /** 圆角 */
    borderRadius?: string
    /** 按钮大小 */
    buttonSize?: string
    /** 是否转换为高德坐标 */
    convert?: boolean
    /** 是否高精度定位 */
    enableHighAccuracy?: boolean
    /** 超时时间 */
    timeout?: number
    /** 缓存时间 */
    maximumAge?: number
    /** 是否显示按钮 */
    showButton?: boolean
    /** 是否显示精度圆 */
    showCircle?: boolean
    /** 是否显示定位点 */
    showMarker?: boolean
    /** 定位点样式 */
    markerOptions?: AmapMarkerOptions
    /** 定位圆样式 */
    circleOptions?: AmapCircleOptions
    /** 是否移动到定位点 */
    panToLocation?: boolean
    /** 是否缩放到精度范围 */
    zoomToAccuracy?: boolean
    /** 是否优先使用浏览器定位 */
    GeoLocationFirst?: boolean
    /** 是否禁用 IP 定位 */
    noIpLocate?: AmapGeolocationDisabledPolicy
    /** 是否禁用浏览器定位 */
    noGeoLocation?: AmapGeolocationDisabledPolicy
    /** 是否使用原生能力 */
    useNative?: boolean
    /** 定位失败时是否返回城市信息 */
    getCityWhenFail?: boolean
    /** 是否需要地址 */
    needAddress?: boolean
    /** 逆地理编码信息详略 */
    extensions?: AmapServiceExtensions
}

/** 定位实例 */
export interface AmapGeolocationInstance extends AmapServiceInstance {
    /** 获取当前位置 */
    getCurrentPosition?: (callback?: AmapServiceCallback) => void
    /** 获取当前城市 */
    getCityInfo?: (callback?: AmapServiceCallback) => void
    /** 添加到地图 */
    addTo?: (map: AmapMapInstance) => void
    /** 从地图移除 */
    removeFrom?: (map?: AmapMapInstance) => void
}

/** 城市查询实例 */
export interface AmapCitySearchInstance extends AmapServiceInstance {
    /** 获取本地城市 */
    getLocalCity?: (callback?: AmapServiceCallback) => void
    /** 按 IP 获取城市 */
    getCityByIp?: (ip: string, callback?: AmapServiceCallback) => void
}

/** WebService HTTP 参数 */
export interface AmapWebServiceHttpOptions {
    [key: string]: unknown
}

/** WebService 实例 */
export interface AmapWebServiceInstance {
    /** GET 请求 */
    get?: (
        path: string,
        params: Record<string, unknown>,
        callback: AmapWebServiceCallback,
        options?: AmapWebServiceHttpOptions
    ) => void
    /** POST 请求 */
    post?: (path: string, params: unknown, callback: AmapWebServiceCallback) => void
    [key: string]: unknown
}

/** 支持服务构造器的高德命名空间 */
export interface AmapServiceNamespace extends AmapNamespace {
    /** 地理编码构造器 */
    Geocoder?: new (options?: AmapGeocoderOptions) => AmapGeocoderInstance
    /** 输入提示构造器 */
    AutoComplete?: new (options?: AmapAutoCompleteOptions) => AmapAutoCompleteInstance
    /** POI 搜索构造器 */
    PlaceSearch?: new (options?: AmapPlaceSearchOptions) => AmapPlaceSearchInstance
    /** 云数据检索构造器 */
    CloudDataSearch?: new (tableId: string, options?: AmapCloudDataSearchOptions) => AmapCloudDataSearchInstance
    /** 驾车规划构造器 */
    Driving?: new (options?: AmapDrivingOptions) => AmapDrivingInstance
    /** 货车规划构造器 */
    TruckDriving?: new (options?: AmapTruckDrivingOptions) => AmapTruckDrivingInstance
    /** 步行规划构造器 */
    Walking?: new (options?: AmapRouteServiceOptions) => AmapWalkingInstance
    /** 公交规划构造器 */
    Transfer?: new (options?: AmapTransferOptions) => AmapTransferInstance
    /** 骑行规划构造器 */
    Riding?: new (options?: AmapRouteServiceOptions) => AmapRidingInstance
    /** 拖拽路线构造器 */
    DragRoute?: new (
        map: AmapMapInstance,
        path: AmapLngLatLike[],
        policy?: number | string,
        options?: AmapDragRouteOptions
    ) => AmapDragRouteInstance
    /** 货车拖拽路线构造器 */
    DragRouteTruck?: new (map: AmapMapInstance, options?: AmapDragRouteTruckOptions) => AmapDragRouteTruckInstance
    /** 轨迹纠偏构造器 */
    GraspRoad?: new () => AmapGraspRoadInstance
    /** 行政区查询构造器 */
    DistrictSearch?: new (options?: AmapDistrictSearchOptions) => AmapDistrictSearchInstance
    /** 天气查询构造器 */
    Weather?: new () => AmapWeatherInstance
    /** 公交站点查询构造器 */
    StationSearch?: new (options?: AmapBusSearchOptions) => AmapStationSearchInstance
    /** 公交线路查询构造器 */
    LineSearch?: new (options?: AmapBusSearchOptions) => AmapLineSearchInstance
    /** 定位构造器 */
    Geolocation?: new (options?: AmapGeolocationOptions) => AmapGeolocationInstance
    /** 城市查询构造器 */
    CitySearch?: new () => AmapCitySearchInstance
    /** WebService 静态对象 */
    WebService?: AmapWebServiceInstance
    /** 坐标转换 */
    convertFrom?: (
        lnglat: AmapLngLatLike | AmapLngLatLike[],
        type?: AmapCoordinateConvertType,
        callback?: AmapServiceCallback
    ) => void
}

/** 服务 Hook 基础参数 */
export interface UseAmapServiceBaseParams<TInstance extends AmapServiceInstance> extends AmapServiceProps<TInstance> {}

/** 地理编码组件属性 */
export interface GeocoderProps extends UseAmapServiceBaseParams<AmapGeocoderInstance>, AmapGeocoderOptions {
    /** 地理编码额外参数 */
    geocoderOptions?: AmapGeocoderOptions
}

/** 输入提示组件属性 */
export interface AutoCompleteProps extends UseAmapServiceBaseParams<AmapAutoCompleteInstance>, AmapAutoCompleteOptions {
    /** 输入提示额外参数 */
    autoCompleteOptions?: AmapAutoCompleteOptions
}

/** POI 搜索组件属性 */
export interface PlaceSearchProps extends UseAmapServiceBaseParams<AmapPlaceSearchInstance>, AmapPlaceSearchOptions {
    /** POI 搜索额外参数 */
    placeSearchOptions?: AmapPlaceSearchOptions
}

/** 云数据检索组件属性 */
export interface CloudDataSearchProps extends UseAmapServiceBaseParams<AmapCloudDataSearchInstance>, AmapCloudDataSearchOptions {
    /** 云数据表 ID */
    tableId: string
    /** 云数据检索额外参数 */
    cloudDataSearchOptions?: AmapCloudDataSearchOptions
}

/** 驾车规划组件属性 */
export interface DrivingProps extends UseAmapServiceBaseParams<AmapDrivingInstance>, AmapDrivingOptions {
    /** 驾车规划额外参数 */
    drivingOptions?: AmapDrivingOptions
}

/** 货车规划组件属性 */
export interface TruckDrivingProps extends UseAmapServiceBaseParams<AmapTruckDrivingInstance>, AmapTruckDrivingOptions {
    /** 货车规划额外参数 */
    truckDrivingOptions?: AmapTruckDrivingOptions
}

/** 步行规划组件属性 */
export interface WalkingProps extends UseAmapServiceBaseParams<AmapWalkingInstance>, AmapRouteServiceOptions {
    /** 步行规划额外参数 */
    walkingOptions?: AmapRouteServiceOptions
}

/** 公交规划组件属性 */
export interface TransferProps extends UseAmapServiceBaseParams<AmapTransferInstance>, AmapTransferOptions {
    /** 公交规划额外参数 */
    transferOptions?: AmapTransferOptions
}

/** 骑行规划组件属性 */
export interface RidingProps extends UseAmapServiceBaseParams<AmapRidingInstance>, AmapRouteServiceOptions {
    /** 骑行规划额外参数 */
    ridingOptions?: AmapRouteServiceOptions
}

/** 拖拽路线组件属性 */
export interface DragRouteProps extends UseAmapServiceBaseParams<AmapDragRouteInstance>, AmapDragRouteOptions {
    /** 路线坐标 */
    path?: AmapLngLatLike[]
    /** 路线策略 */
    policy?: number | string
    /** 创建后是否立即搜索 */
    autoSearch?: boolean
    /** 拖拽路线额外参数 */
    dragRouteOptions?: AmapDragRouteOptions
}

/** 货车拖拽路线组件属性 */
export interface DragRouteTruckProps
    extends UseAmapServiceBaseParams<AmapDragRouteTruckInstance>,
        AmapDragRouteTruckOptions {
    /** 路线坐标 */
    locations?: AmapDragRouteTruckLocation[]
    /** 创建后是否立即搜索 */
    autoSearch?: boolean
    /** 货车拖拽路线额外参数 */
    dragRouteTruckOptions?: AmapDragRouteTruckOptions
}

/** 轨迹纠偏组件属性 */
export interface GraspRoadProps extends UseAmapServiceBaseParams<AmapGraspRoadInstance> {}

/** 行政区查询组件属性 */
export interface DistrictSearchProps extends UseAmapServiceBaseParams<AmapDistrictSearchInstance>, AmapDistrictSearchOptions {
    /** 行政区查询额外参数 */
    districtSearchOptions?: AmapDistrictSearchOptions
}

/** 天气查询组件属性 */
export interface WeatherProps extends UseAmapServiceBaseParams<AmapWeatherInstance> {}

/** 公交站点查询组件属性 */
export interface StationSearchProps extends UseAmapServiceBaseParams<AmapStationSearchInstance>, AmapBusSearchOptions {
    /** 公交站点查询额外参数 */
    stationSearchOptions?: AmapBusSearchOptions
}

/** 公交线路查询组件属性 */
export interface LineSearchProps extends UseAmapServiceBaseParams<AmapLineSearchInstance>, AmapBusSearchOptions {
    /** 公交线路查询额外参数 */
    lineSearchOptions?: AmapBusSearchOptions
}

/** 定位组件属性 */
export interface GeolocationProps extends UseAmapServiceBaseParams<AmapGeolocationInstance>, AmapGeolocationOptions {
    /** 是否添加为地图控件 */
    addControl?: boolean
    /** 定位额外参数 */
    geolocationOptions?: AmapGeolocationOptions
}

/** 城市查询组件属性 */
export interface CitySearchProps extends UseAmapServiceBaseParams<AmapCitySearchInstance> {}

/** WebService Hook 参数 */
export interface UseAmapWebServiceParams {
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
}

/** 坐标转换参数 */
export interface ConvertAmapCoordinateParams {
    /** 坐标 */
    lnglat: AmapLngLatLike | AmapLngLatLike[]
    /** 坐标类型 */
    type?: AmapCoordinateConvertType
    /** 回调函数 */
    callback?: AmapServiceCallback
}

/** 坐标转换函数 */
export type ConvertAmapCoordinate = (params: ConvertAmapCoordinateParams) => void

function setAmapServiceRef<TInstance extends AmapServiceInstance>(ref: Ref<TInstance | null> | undefined, service: TInstance | null) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(service)
        return
    }

    ref.current = service
}

function getAmapServiceConstructor<TInstance extends AmapServiceInstance, TOptions extends AmapServiceBaseOptions>({
    AMap,
    constructorName,
}: CreateAmapServiceParams<TOptions>) {
    const constructor = (AMap as Record<string, unknown>)[constructorName]

    if (typeof constructor !== "function") return undefined

    return constructor as AmapServiceConstructor<TInstance, TOptions>
}

function createDefaultAmapService<TInstance extends AmapServiceInstance, TOptions extends AmapServiceBaseOptions>(
    params: CreateAmapServiceParams<TOptions>
) {
    const ServiceConstructor = getAmapServiceConstructor<TInstance, TOptions>(params)

    if (!ServiceConstructor) return undefined

    return new ServiceConstructor(params.options)
}

function destroyDefaultAmapService<TInstance extends AmapServiceInstance>({
    service,
}: DestroyAmapServiceParams<TInstance>) {
    if (service.destroy) {
        service.destroy()
        return
    }

    if (service.clear) service.clear()
    if (service.close) service.close()
    service.setMap?.(null)
}

function bindAmapServiceEvents<TInstance extends AmapServiceInstance>(service: TInstance, events?: AmapServiceEvents) {
    const eventEntries = getAmapEventEntries(events)

    eventEntries.forEach(({ eventName, handler }) => service.on?.(eventName, handler))

    return function unbindAmapServiceEvents() {
        eventEntries.forEach(({ eventName, handler }) => service.off?.(eventName, handler))
    }
}

function mergeAmapServiceOptions<TOptions extends AmapServiceBaseOptions>(options: TOptions | undefined, extraOptions: TOptions) {
    const nextOptions: TOptions = {
        ...options,
    } as TOptions

    Object.entries(cleanAmapServiceExtraOptions(extraOptions)).forEach(([key, value]) => {
        if (value !== undefined) (nextOptions as Record<string, unknown>)[key] = value
    })

    return nextOptions
}

function cleanAmapServiceExtraOptions<TOptions extends AmapServiceBaseOptions>(extraOptions: TOptions) {
    const {
        AMap: _AMap,
        enabled: _enabled,
        events: _events,
        onDestroy: _onDestroy,
        onLoad: _onLoad,
        onChange: _onChange,
        onClick: _onClick,
        onClose: _onClose,
        onComplete: _onComplete,
        onDblClick: _onDblClick,
        onDragEnd: _onDragEnd,
        onDragStart: _onDragStart,
        onDragging: _onDragging,
        onEnd: _onEnd,
        onMouseDown: _onMouseDown,
        onMouseMove: _onMouseMove,
        onMouseOut: _onMouseOut,
        onMouseOver: _onMouseOver,
        onMouseUp: _onMouseUp,
        onMoveEnd: _onMoveEnd,
        onMoving: _onMoving,
        onOpen: _onOpen,
        onRightClick: _onRightClick,
        onRotateChange: _onRotateChange,
        onRotateEnd: _onRotateEnd,
        onRotateStart: _onRotateStart,
        onTouchEnd: _onTouchEnd,
        onTouchMove: _onTouchMove,
        onTouchStart: _onTouchStart,
        onZoomChange: _onZoomChange,
        onZoomEnd: _onZoomEnd,
        onZoomStart: _onZoomStart,
        ref: _ref,
        ...restOptions
    } = extraOptions as TOptions & Record<string, unknown>

    return restOptions as TOptions
}

function applyAmapServiceMapOption<TOptions extends AmapServiceBaseOptions>(
    options: TOptions,
    map?: AmapMapInstance
) {
    if (!map || "map" in options) return options

    return {
        ...options,
        map,
    }
}

export function useAmapService<TInstance extends AmapServiceInstance, TOptions extends AmapServiceBaseOptions>({
    ref,
    map,
    AMap,
    enabled = true,
    pluginName,
    constructorName,
    options,
    events,
    createService,
    updateService,
    destroyService,
    onLoad: _onLoad,
    onDestroy: _onDestroy,
    ...eventShortcuts
}: UseAmapServiceParams<TInstance, TOptions>) {
    const context = useAmapContext()
    const serviceRef = useRef<TInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = AMap ?? context.AMap
    const pluginLoaded = useAmapPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName,
        constructorName,
    })
    const [service, setService] = useState<TInstance | null>(null)
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))
    const getOptions = useEffectEvent(() => options ?? ({} as TOptions))
    const getCreateService = useEffectEvent(() => createService)
    const getDestroyService = useEffectEvent(() => destroyService)
    const currentEvents = mergeAmapEvents({
        eventShortcuts,
        events,
    }) as AmapServiceEvents

    useStableEffect(() => {
        if (!enabled || !currentAMap || !pluginLoaded) return

        const createNextService = getCreateService() ?? createDefaultAmapService
        const nextService = createNextService({
            map: currentMap,
            AMap: currentAMap,
            constructorName,
            options: getOptions(),
        }) as TInstance | null | undefined

        if (!nextService) return

        serviceRef.current = nextService
        setService(nextService)
        setAmapServiceRef(ref, nextService)
        onLoad(nextService)

        return () => {
            serviceRef.current = null
            setService(null)
            setAmapServiceRef(ref, null)

            try {
                onDestroy(nextService)
            } finally {
                const destroyNextService = getDestroyService() ?? destroyDefaultAmapService

                destroyNextService({
                    service: nextService,
                })
            }
        }
    }, [constructorName, currentAMap, currentMap, enabled, pluginLoaded, ref])

    useStableEffect(() => {
        if (!serviceRef.current || !updateService) return

        updateService({
            service: serviceRef.current,
            options: options ?? ({} as TOptions),
        })
    }, [options, updateService])

    useStableEffect(() => {
        if (!serviceRef.current) return

        return bindAmapServiceEvents(serviceRef.current, currentEvents)
    }, [constructorName, currentAMap, currentEvents, currentMap, pluginLoaded, ref])

    return service
}

export function useGeocoder(params: GeocoderProps = {}) {
    const { geocoderOptions, ...restOptions } = params
    const options = mergeAmapServiceOptions(geocoderOptions, restOptions as AmapGeocoderOptions)

    return useAmapService<AmapGeocoderInstance, AmapGeocoderOptions>({
        ...params,
        pluginName: AmapPlugin.Geocoder,
        constructorName: "Geocoder",
        options,
        updateService: ({ service, options }) => {
            if (typeof options.city === "string") service.setCity?.(options.city)
        },
    })
}

export function useAutoComplete(params: AutoCompleteProps = {}) {
    const { autoCompleteOptions, ...restOptions } = params
    const options = mergeAmapServiceOptions(autoCompleteOptions, restOptions as AmapAutoCompleteOptions)

    return useAmapService<AmapAutoCompleteInstance, AmapAutoCompleteOptions>({
        ...params,
        pluginName: AmapPlugin.AutoComplete,
        constructorName: "AutoComplete",
        options,
        updateService: ({ service, options }) => {
            if (typeof options.type === "string") service.setType?.(options.type)
            if (typeof options.city === "string") service.setCity?.(options.city)
            if (typeof options.citylimit === "boolean") service.setCityLimit?.(options.citylimit)
        },
    })
}

export function usePlaceSearch(params: PlaceSearchProps = {}) {
    const { placeSearchOptions, ...restOptions } = params
    const options = applyAmapServiceMapOption(
        mergeAmapServiceOptions(placeSearchOptions, restOptions as AmapPlaceSearchOptions),
        params.map
    )

    return useAmapService<AmapPlaceSearchInstance, AmapPlaceSearchOptions>({
        ...params,
        pluginName: AmapPlugin.PlaceSearch,
        constructorName: "PlaceSearch",
        options,
        updateService: ({ service, options }) => {
            if (typeof options.type === "string") service.setType?.(options.type)
            if (typeof options.pageIndex === "number") service.setPageIndex?.(options.pageIndex)
            if (typeof options.pageSize === "number") service.setPageSize?.(options.pageSize)
            if (typeof options.city === "string") service.setCity?.(options.city)
            if (typeof options.citylimit === "boolean") service.setCityLimit?.(options.citylimit)
        },
    })
}

export function useCloudDataSearch(params: CloudDataSearchProps) {
    const { tableId, cloudDataSearchOptions, ...restOptions } = params
    const options = applyAmapServiceMapOption(
        mergeAmapServiceOptions(cloudDataSearchOptions, restOptions as AmapCloudDataSearchOptions),
        params.map
    )

    return useAmapService<AmapCloudDataSearchInstance, AmapCloudDataSearchOptions>({
        ...params,
        pluginName: AmapPlugin.CloudDataSearch,
        constructorName: "CloudDataSearch",
        options,
        createService: ({ AMap, options }) => {
            const currentAMap = AMap as AmapServiceNamespace

            return currentAMap.CloudDataSearch ? new currentAMap.CloudDataSearch(tableId, options) : undefined
        },
        updateService: ({ service, options }) => service.setOptions?.(options),
    })
}

export function useDriving(params: DrivingProps = {}) {
    const { drivingOptions, ...restOptions } = params
    const options = applyAmapServiceMapOption(
        mergeAmapServiceOptions(drivingOptions, restOptions as AmapDrivingOptions),
        params.map
    )

    return useAmapService<AmapDrivingInstance, AmapDrivingOptions>({
        ...params,
        pluginName: AmapPlugin.Driving,
        constructorName: "Driving",
        options,
        updateService: ({ service, options }) => {
            if (options.policy !== undefined) service.setPolicy?.(options.policy)
            if (typeof options.province === "string" && typeof options.number === "string")
                service.setProvinceAndNumber?.(options.province, options.number)
        },
    })
}

export function useTruckDriving(params: TruckDrivingProps = {}) {
    const { truckDrivingOptions, ...restOptions } = params
    const options = applyAmapServiceMapOption(
        mergeAmapServiceOptions(truckDrivingOptions, restOptions as AmapTruckDrivingOptions),
        params.map
    )

    return useAmapService<AmapTruckDrivingInstance, AmapTruckDrivingOptions>({
        ...params,
        pluginName: AmapPlugin.TruckDriving,
        constructorName: "TruckDriving",
        options,
        updateService: ({ service, options }) => {
            if (options.policy !== undefined) service.setPolicy?.(options.policy)
            if (typeof options.province === "string" && typeof options.number === "string")
                service.setProvinceAndNumber?.(options.province, options.number)
        },
    })
}

export function useWalking(params: WalkingProps = {}) {
    const { walkingOptions, ...restOptions } = params
    const options = applyAmapServiceMapOption(
        mergeAmapServiceOptions(walkingOptions, restOptions as AmapRouteServiceOptions),
        params.map
    )

    return useAmapService<AmapWalkingInstance, AmapRouteServiceOptions>({
        ...params,
        pluginName: AmapPlugin.Walking,
        constructorName: "Walking",
        options,
    })
}

export function useTransfer(params: TransferProps = {}) {
    const { transferOptions, ...restOptions } = params
    const options = applyAmapServiceMapOption(
        mergeAmapServiceOptions(transferOptions, restOptions as AmapTransferOptions),
        params.map
    )

    return useAmapService<AmapTransferInstance, AmapTransferOptions>({
        ...params,
        pluginName: AmapPlugin.Transfer,
        constructorName: "Transfer",
        options,
        updateService: ({ service, options }) => {
            if (options.policy !== undefined) service.setPolicy?.(options.policy)
            if (typeof options.city === "string") service.setCity?.(options.city)
            if (typeof options.cityd === "string") service.setCityd?.(options.cityd)
        },
    })
}

export function useRiding(params: RidingProps = {}) {
    const { ridingOptions, ...restOptions } = params
    const options = applyAmapServiceMapOption(
        mergeAmapServiceOptions(ridingOptions, restOptions as AmapRouteServiceOptions),
        params.map
    )

    return useAmapService<AmapRidingInstance, AmapRouteServiceOptions>({
        ...params,
        pluginName: AmapPlugin.Riding,
        constructorName: "Riding",
        options,
        updateService: ({ service, options }) => {
            if (options.policy !== undefined) service.setPolicy?.(options.policy)
        },
    })
}

export function useDragRoute(params: DragRouteProps = {}) {
    const { path = [], policy, autoSearch = true, dragRouteOptions, ...restOptions } = params
    const options = mergeAmapServiceOptions(dragRouteOptions, restOptions as AmapDragRouteOptions)

    return useAmapService<AmapDragRouteInstance, AmapDragRouteOptions>({
        ...params,
        pluginName: AmapPlugin.DragRoute,
        constructorName: "DragRoute",
        options,
        createService: ({ map, AMap, options }) => {
            if (!map) return undefined

            const currentAMap = AMap as AmapServiceNamespace
            const service = currentAMap.DragRoute ? new currentAMap.DragRoute(map, path, policy, options) : undefined

            if (autoSearch) service?.search?.()

            return service
        },
    })
}

export function useDragRouteTruck(params: DragRouteTruckProps = {}) {
    const { locations, autoSearch = true, dragRouteTruckOptions, ...restOptions } = params
    const options = mergeAmapServiceOptions(dragRouteTruckOptions, restOptions as AmapDragRouteTruckOptions)

    return useAmapService<AmapDragRouteTruckInstance, AmapDragRouteTruckOptions>({
        ...params,
        pluginName: AmapPlugin.DragRouteTruck,
        constructorName: "DragRouteTruck",
        options,
        createService: ({ map, AMap, options }) => {
            if (!map) return undefined

            const currentAMap = AMap as AmapServiceNamespace
            const service = currentAMap.DragRouteTruck ? new currentAMap.DragRouteTruck(map, options) : undefined

            if (autoSearch) service?.search?.(locations)

            return service
        },
        updateService: ({ service, options }) => service.setOption?.(options),
    })
}

export function useGraspRoad(params: GraspRoadProps = {}) {
    return useAmapService<AmapGraspRoadInstance, AmapServiceBaseOptions>({
        ...params,
        pluginName: AmapPlugin.GraspRoad,
        constructorName: "GraspRoad",
    })
}

export function useDistrictSearch(params: DistrictSearchProps = {}) {
    const { districtSearchOptions, ...restOptions } = params
    const options = mergeAmapServiceOptions(districtSearchOptions, restOptions as AmapDistrictSearchOptions)

    return useAmapService<AmapDistrictSearchInstance, AmapDistrictSearchOptions>({
        ...params,
        pluginName: AmapPlugin.DistrictSearch,
        constructorName: "DistrictSearch",
        options,
        updateService: ({ service, options }) => {
            if (typeof options.level === "string") service.setLevel?.(options.level)
            if (typeof options.subdistrict === "number") service.setSubdistrict?.(options.subdistrict)
        },
    })
}

export function useWeather(params: WeatherProps = {}) {
    return useAmapService<AmapWeatherInstance, AmapServiceBaseOptions>({
        ...params,
        pluginName: AmapPlugin.Weather,
        constructorName: "Weather",
    })
}

export function useStationSearch(params: StationSearchProps = {}) {
    const { stationSearchOptions, ...restOptions } = params
    const options = mergeAmapServiceOptions(stationSearchOptions, restOptions as AmapBusSearchOptions)

    return useAmapService<AmapStationSearchInstance, AmapBusSearchOptions>({
        ...params,
        pluginName: AmapPlugin.StationSearch,
        constructorName: "StationSearch",
        options,
        updateService: updateAmapBusSearch,
    })
}

export function useLineSearch(params: LineSearchProps = {}) {
    const { lineSearchOptions, ...restOptions } = params
    const options = mergeAmapServiceOptions(lineSearchOptions, restOptions as AmapBusSearchOptions)

    return useAmapService<AmapLineSearchInstance, AmapBusSearchOptions>({
        ...params,
        pluginName: AmapPlugin.LineSearch,
        constructorName: "LineSearch",
        options,
        updateService: updateAmapBusSearch,
    })
}

export function useGeolocation(params: GeolocationProps = {}) {
    const { addControl = true, geolocationOptions, ...restOptions } = params
    const options = mergeAmapServiceOptions(geolocationOptions, restOptions as AmapGeolocationOptions)

    return useAmapService<AmapGeolocationInstance, AmapGeolocationOptions>({
        ...params,
        pluginName: AmapPlugin.Geolocation,
        constructorName: "Geolocation",
        options,
        createService: ({ map, AMap, options }) => {
            const currentAMap = AMap as AmapServiceNamespace
            const service = currentAMap.Geolocation ? new currentAMap.Geolocation(options) : undefined

            if (addControl && map && service) {
                if (map.addControl) map.addControl(service)
                else service.addTo?.(map)
            }

            return service
        },
        destroyService: ({ service }) => {
            if (service.destroy) {
                service.destroy()
                return
            }

            service.removeFrom?.()
            service.setMap?.(null)
        },
    })
}

export function useCitySearch(params: CitySearchProps = {}) {
    return useAmapService<AmapCitySearchInstance, AmapServiceBaseOptions>({
        ...params,
        pluginName: AmapPlugin.CitySearch,
        constructorName: "CitySearch",
    })
}

export function useAmapWebService({ AMap }: UseAmapWebServiceParams = {}) {
    const context = useAmapContext()
    const currentAMap = (AMap ?? context.AMap) as AmapServiceNamespace | null

    return currentAMap?.WebService ?? null
}

export function useAmapConvertFrom({ AMap }: UseAmapWebServiceParams = {}) {
    const context = useAmapContext()
    const currentAMap = (AMap ?? context.AMap) as AmapServiceNamespace | null

    if (!currentAMap?.convertFrom) return undefined

    return function convertAmapCoordinate({ lnglat, type = "gps", callback }: ConvertAmapCoordinateParams) {
        currentAMap.convertFrom?.(lnglat, type, callback)
    }
}

function updateAmapBusSearch<TInstance extends AmapBusSearchInstance>({
    service,
    options,
}: UpdateAmapServiceParams<TInstance, AmapBusSearchOptions>) {
    if (typeof options.pageIndex === "number") service.setPageIndex?.(options.pageIndex)
    if (typeof options.pageSize === "number") service.setPageSize?.(options.pageSize)
    if (typeof options.city === "string") service.setCity?.(options.city)
}

export const Geocoder: FC<GeocoderProps> = props => {
    useGeocoder(props)

    return null
}

export const AutoComplete: FC<AutoCompleteProps> = props => {
    useAutoComplete(props)

    return null
}

export const PlaceSearch: FC<PlaceSearchProps> = props => {
    usePlaceSearch(props)

    return null
}

export const CloudDataSearch: FC<CloudDataSearchProps> = props => {
    useCloudDataSearch(props)

    return null
}

export const Driving: FC<DrivingProps> = props => {
    useDriving(props)

    return null
}

export const TruckDriving: FC<TruckDrivingProps> = props => {
    useTruckDriving(props)

    return null
}

export const Walking: FC<WalkingProps> = props => {
    useWalking(props)

    return null
}

export const Transfer: FC<TransferProps> = props => {
    useTransfer(props)

    return null
}

export const Riding: FC<RidingProps> = props => {
    useRiding(props)

    return null
}

export const DragRoute: FC<DragRouteProps> = props => {
    useDragRoute(props)

    return null
}

export const DragRouteTruck: FC<DragRouteTruckProps> = props => {
    useDragRouteTruck(props)

    return null
}

export const GraspRoad: FC<GraspRoadProps> = props => {
    useGraspRoad(props)

    return null
}

export const DistrictSearch: FC<DistrictSearchProps> = props => {
    useDistrictSearch(props)

    return null
}

export const Weather: FC<WeatherProps> = props => {
    useWeather(props)

    return null
}

export const StationSearch: FC<StationSearchProps> = props => {
    useStationSearch(props)

    return null
}

export const LineSearch: FC<LineSearchProps> = props => {
    useLineSearch(props)

    return null
}

export const Geolocation: FC<GeolocationProps> = props => {
    useGeolocation(props)

    return null
}

export const CitySearch: FC<CitySearchProps> = props => {
    useCitySearch(props)

    return null
}

/** WebService 组件属性 */
export interface WebServiceProps {
    /** WebService 实例 ref */
    ref?: Ref<AmapWebServiceInstance | null>
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
    /** 创建完成回调 */
    onLoad?: (webService: AmapWebServiceInstance) => void
    /** 销毁前回调 */
    onDestroy?: (webService: AmapWebServiceInstance) => void
}

export const WebService: FC<WebServiceProps> = ({ ref, AMap, onLoad: _onLoad, onDestroy: _onDestroy }) => {
    const webService = useAmapWebService({
        AMap,
    })
    const onLoad = useEffectEvent(optionalFn(_onLoad))
    const onDestroy = useEffectEvent(optionalFn(_onDestroy))

    useEffect(() => {
        if (!ref) return

        if (typeof ref === "function") {
            ref(webService)
            return () => {
                ref(null)
            }
        }

        ref.current = webService

        return () => {
            ref.current = null
        }
    }, [ref, webService])

    useEffect(() => {
        if (!webService) return

        onLoad(webService)

        return () => {
            onDestroy(webService)
        }
    }, [webService])

    return null
}

/** 移动动画参数 */
export interface AmapMoveAnimationOptions {
    /** 每段动画时长 */
    duration?: number | AmapMoveDurationCallback
    /** 每段动画速度 */
    speed?: number | AmapMoveDurationCallback
    /** 延迟动画时长 */
    delay?: number | AmapMoveDurationCallback
    /** 是否循环 */
    circlable?: boolean
    /** 动画结束是否自动旋转 */
    autoRotation?: boolean
    [key: string]: unknown
}

/** 移动动画目标 */
export interface AmapMoveAnimationTarget {
    /** 移动到指定位置 */
    moveTo?: (position: AmapLngLatLike, options?: AmapMoveAnimationOptions) => void
    /** 沿路径移动 */
    moveAlong?: (path: AmapLngLatLike[], options?: AmapMoveAnimationOptions) => void
    /** 开始动画 */
    startMove?: () => void
    /** 停止动画 */
    stopMove?: () => void
    /** 暂停动画 */
    pauseMove?: () => void
    /** 继续动画 */
    resumeMove?: () => void
}

/** 使用移动动画参数 */
export interface UseAmapMoveAnimationParams {
    /** 地图实例 */
    map?: AmapMapInstance
    /** 高德地图命名空间 */
    AMap?: AmapNamespace
}

export function useAmapMoveAnimation({ map, AMap }: UseAmapMoveAnimationParams = {}) {
    const context = useAmapContext()
    const currentMap = map ?? context.map
    const currentAMap = AMap ?? context.AMap

    return useAmapPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName: AmapPlugin.MoveAnimation,
        constructorName: "MoveAnimation",
    })
}
