import { type FC, type Ref, useEffect, useEffectEvent, useRef, useState } from "react"

import {
    MapPlugin,
    type MapEventHandler,
    type MapLngLatLike,
    type MapInstance,
    type MapNamespace,
    useMapContext,
} from "./Map"
import type { ControlPosition } from "./Control"
import type { MapMarkerOptions } from "./Marker"
import type { MapCircleOptions, MapPolylineOptions } from "./Vector"
import { useMapPlugin } from "../hooks/useMapPlugin"
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
} from "../utils/mapEvents"

export type MapServiceOnLoad<TInstance extends MapServiceInstance = MapServiceInstance> = (
    service: TInstance
) => void

export type MapServiceOnDestroy<TInstance extends MapServiceInstance = MapServiceInstance> = (
    service: TInstance
) => void

export type MapServiceCallback<TResult = unknown> = (status: string, result: TResult) => void

export type MapWeatherCallback<TResult = unknown> = (error: unknown, result: TResult) => void

export type MapWebServiceCallback<TResult = unknown> = (error: unknown, result: TResult) => void

export type MapMoveDurationCallback = (index: number, route: unknown) => number

/** 服务语言类型 */
export const MapServiceLanguage = {
    中文: "zh_cn",
    英文: "en",
} as const

export type MapServiceLanguage = (typeof MapServiceLanguage)[keyof typeof MapServiceLanguage]

/** 返回信息详略 */
export const MapServiceExtensions = {
    基础信息: "base",
    详细信息: "all",
} as const

export type MapServiceExtensions = (typeof MapServiceExtensions)[keyof typeof MapServiceExtensions]

/** 输入提示返回数据类型 */
export const MapAutoCompleteDataType = {
    全部: "all",
    POI: "poi",
    公交站点: "bus",
    公交线路: "busline",
} as const

export type MapAutoCompleteDataType = (typeof MapAutoCompleteDataType)[keyof typeof MapAutoCompleteDataType]

/** 行政区查询级别 */
export const MapDistrictSearchLevel = {
    国家: "country",
    省直辖市: "province",
    市: "city",
    区县: "district",
    商圈: "biz_area",
} as const

export type MapDistrictSearchLevel = (typeof MapDistrictSearchLevel)[keyof typeof MapDistrictSearchLevel]

/** 定位来源禁用策略 */
export const MapGeolocationDisabledPolicy = {
    全部启用: 0,
    手机端禁用: 1,
    PC端禁用: 2,
    全部禁用: 3,
} as const

export type MapGeolocationDisabledPolicy =
    (typeof MapGeolocationDisabledPolicy)[keyof typeof MapGeolocationDisabledPolicy]

/** 坐标转换来源类型 */
export const MapCoordinateConvertType = {
    GPS: "gps",
} as const

export type MapCoordinateConvertType = (typeof MapCoordinateConvertType)[keyof typeof MapCoordinateConvertType] | string

/** 服务事件映射 */
export interface MapServiceEvents<TInstance = MapServiceInstance> extends MapOverlayEventMap<TInstance> {}

/** 服务鼠标事件 */
export interface MapServiceMouseEvent<TInstance = MapServiceInstance> extends MapOverlayMouseEvent<TInstance> {}

/** 服务交互坐标事件 */
export interface MapServiceInteractionEvent<TInstance = MapServiceInstance> extends MapOverlayInteractionEvent<TInstance> {}

/** 服务目标事件 */
export interface MapServiceTargetEvent<TInstance = MapServiceInstance> extends MapTargetEvent<TInstance> {}

/** 服务移动动画事件 */
export interface MapServiceMoveEvent<TInstance = MapServiceInstance> extends MapMoveEvent<TInstance> {}

/** 服务事件快捷属性 */
export interface MapServiceEventShortcutProps<TInstance = MapServiceInstance>
    extends MapOverlayEventShortcutProps<TInstance> {}

/** 服务基础参数 */
export interface MapServiceBaseOptions {
}

/** 服务实例运行时能力 */
export interface MapServiceInstance {
    /** 绑定事件 */
    on?: (eventName: string, handler: MapEventHandler) => void
    /** 解绑事件 */
    off?: (eventName: string, handler: MapEventHandler) => void
    /** 清除服务绘制结果 */
    clear?: () => void
    /** 销毁服务 */
    destroy?: () => void
    /** 关闭服务 */
    close?: () => void
    /** 从地图移除服务 */
    setMap?: (map: MapInstance | null) => void
}

/** 服务构造器 */
export interface MapServiceConstructor<TInstance extends MapServiceInstance, TOptions extends MapServiceBaseOptions> {
    new (options?: TOptions): TInstance
}

/** 创建服务参数 */
export interface CreateMapServiceParams<TOptions extends MapServiceBaseOptions> {
    /** 地图实例 */
    map: MapInstance | null
    /** 高德地图命名空间 */
    AMap: MapNamespace
    /** 构造器名称 */
    constructorName: string
    /** 服务参数 */
    options: TOptions
}

export type CreateMapService<TInstance extends MapServiceInstance, TOptions extends MapServiceBaseOptions> = (
    params: CreateMapServiceParams<TOptions>
) => TInstance | null | undefined

/** 销毁服务参数 */
export interface DestroyMapServiceParams<TInstance extends MapServiceInstance> {
    /** 服务实例 */
    service: TInstance
}

export type DestroyMapService<TInstance extends MapServiceInstance> = (
    params: DestroyMapServiceParams<TInstance>
) => void

/** 更新服务参数 */
export interface UpdateMapServiceParams<TInstance extends MapServiceInstance, TOptions extends MapServiceBaseOptions> {
    /** 服务实例 */
    service: TInstance
    /** 服务参数 */
    options: TOptions
}

export type UpdateMapService<TInstance extends MapServiceInstance, TOptions extends MapServiceBaseOptions> = (
    params: UpdateMapServiceParams<TInstance, TOptions>
) => void

/** 使用服务参数 */
export interface UseMapServiceParams<TInstance extends MapServiceInstance, TOptions extends MapServiceBaseOptions>
    extends MapServiceEventShortcutProps<TInstance> {
    /** 服务实例 ref */
    ref?: Ref<TInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 是否启用服务 */
    enabled?: boolean
    /** 插件名称 */
    pluginName: MapPlugin
    /** 构造器名称 */
    constructorName: string
    /** 服务参数 */
    options?: TOptions
    /** 服务事件映射 */
    events?: MapServiceEvents<TInstance>
    /** 自定义创建服务 */
    createService?: CreateMapService<TInstance, TOptions>
    /** 自定义更新服务 */
    updateService?: UpdateMapService<TInstance, TOptions>
    /** 自定义销毁服务 */
    destroyService?: DestroyMapService<TInstance>
    /** 创建完成回调 */
    onLoad?: MapServiceOnLoad<TInstance>
    /** 销毁前回调 */
    onDestroy?: MapServiceOnDestroy<TInstance>
}

/** 服务组件通用属性 */
export interface MapServiceProps<TInstance extends MapServiceInstance>
    extends MapServiceEventShortcutProps<TInstance> {
    /** 服务实例 ref */
    ref?: Ref<TInstance | null>
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 是否启用服务 */
    enabled?: boolean
    /** 服务事件映射 */
    events?: MapServiceEvents<TInstance>
    /** 创建完成回调 */
    onLoad?: MapServiceOnLoad<TInstance>
    /** 销毁前回调 */
    onDestroy?: MapServiceOnDestroy<TInstance>
}

/** 地理编码参数 */
export interface MapGeocoderOptions extends MapServiceBaseOptions {
    /** 城市 */
    city?: string
    /** 逆地理编码半径 */
    radius?: number
    /** 语言 */
    lang?: MapServiceLanguage
    /** 是否批量查询 */
    batch?: boolean
    /** 返回信息详略 */
    extensions?: MapServiceExtensions
}

/** 地理编码实例 */
export interface MapGeocoderInstance extends MapServiceInstance {
    /** 地址转坐标 */
    getLocation?: (keyword: string, callback?: MapServiceCallback) => void
    /** 设置城市 */
    setCity?: (city: string) => void
    /** 坐标转地址 */
    getAddress?: (location: MapLngLatLike | MapLngLatLike[], callback?: MapServiceCallback) => void
}

/** 输入提示参数 */
export interface MapAutoCompleteOptions extends MapServiceBaseOptions {
    /** POI 类型 */
    type?: string
    /** 城市 */
    city?: string
    /** 数据类型 */
    datatype?: MapAutoCompleteDataType
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
    lang?: MapServiceLanguage
}

/** 输入提示实例 */
export interface MapAutoCompleteInstance extends MapServiceInstance {
    /** 设置 POI 类型 */
    setType?: (type: string) => void
    /** 设置城市 */
    setCity?: (city: string) => void
    /** 设置是否限制城市 */
    setCityLimit?: (cityLimit: boolean) => void
    /** 搜索提示 */
    search?: (keyword: string, callback?: MapServiceCallback) => void
}

/** POI 搜索参数 */
export interface MapPlaceSearchOptions extends MapServiceBaseOptions {
    /** 地图实例 */
    map?: MapInstance
    /** 城市 */
    city?: string
    /** POI 类型 */
    type?: string
    /** 每页结果数 */
    pageSize?: number
    /** 页码 */
    pageIndex?: number
    /** 返回信息详略 */
    extensions?: MapServiceExtensions
    /** 结果面板 */
    panel?: string | HTMLElement
    /** 是否限制城市 */
    citylimit?: boolean
    /** 是否自动适配视野 */
    autoFitView?: boolean
}

/** 高德客户端 POI 参数 */
export interface MapPoiOnMapOptions {
    /** POI ID */
    id?: string
    /** POI 名称 */
    name: string
    /** POI 坐标 */
    location: MapLngLatLike
    /** POI 地址 */
    address?: string
}

/** 唤起高德客户端参数 */
export interface MapOpenMapOptions {
}

/** POI 搜索实例 */
export interface MapPlaceSearchInstance extends MapServiceInstance {
    /** 关键字搜索 */
    search?: (keyword: string, callback?: MapServiceCallback) => void
    /** 范围搜索 */
    searchInBounds?: (keyword: string, bounds: unknown, callback?: MapServiceCallback) => void
    /** 周边搜索 */
    searchNearBy?: (keyword: string, center: MapLngLatLike, radius: number, callback?: MapServiceCallback) => void
    /** 查询 POI 详情 */
    getDetails?: (id: string, callback?: MapServiceCallback) => void
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
    poiOnAMAP?: (poi: MapPoiOnMapOptions, options?: MapOpenMapOptions) => void
    /** 唤起高德地图客户端详情页 */
    detailOnAMAP?: (poi: MapPoiOnMapOptions, options?: MapOpenMapOptions) => void
}

/** 云数据检索参数 */
export interface MapCloudDataSearchOptions extends MapServiceBaseOptions {
    /** 地图实例 */
    map?: MapInstance
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
export interface MapCloudDataSearchInstance extends MapServiceInstance {
    /** 设置检索参数 */
    setOptions?: (options: MapCloudDataSearchOptions) => void
    /** 周边检索 */
    searchNearBy?: (center: MapLngLatLike, radius: number, callback?: MapServiceCallback) => void
    /** ID 检索 */
    searchById?: (id: string, callback?: MapServiceCallback) => void
    /** 行政区检索 */
    searchByDistrict?: (district: string, callback?: MapServiceCallback) => void
    /** 多边形检索 */
    searchInPolygon?: (path: MapLngLatLike[], callback?: MapServiceCallback) => void
}

/** 路线规划途经点参数 */
export interface MapRouteSearchOptions {
    /** 途经点 */
    waypoints?: MapLngLatLike[]
}

/** 名称路线规划点 */
export interface MapRouteKeywordPoint {
    /** 关键字 */
    keyword: string
    /** 城市 */
    city?: string
}

/** 路线规划基础参数 */
export interface MapRouteServiceOptions extends MapServiceBaseOptions {
    /** 地图实例 */
    map?: MapInstance
    /** 路线策略 */
    policy?: number | string
    /** 返回信息详略 */
    extensions?: MapServiceExtensions
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
export interface MapDrivingOptions extends MapRouteServiceOptions {
    /** 是否允许轮渡 */
    ferry?: number
}

/** 货车规划参数 */
export interface MapTruckDrivingOptions extends MapDrivingOptions {
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
export interface MapTransferOptions extends MapRouteServiceOptions {
    /** 城市 */
    city?: string
    /** 目的城市 */
    cityd?: string
}

/** 路线规划实例 */
export interface MapRouteServiceInstance extends MapServiceInstance {
    /** 按坐标或关键字规划路线 */
    search?: (
        originOrPoints: MapLngLatLike | MapRouteKeywordPoint[],
        destinationOrCallback?: MapLngLatLike | MapServiceCallback,
        optionsOrCallback?: MapRouteSearchOptions | MapServiceCallback,
        callback?: MapServiceCallback
    ) => void
    /** 设置路线策略 */
    setPolicy?: (policy: number | string) => void
}

/** 驾车规划实例 */
export interface MapDrivingInstance extends MapRouteServiceInstance {
    /** 设置避让区域 */
    setAvoidPolygons?: (areas: MapLngLatLike[][]) => void
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
export interface MapTruckDrivingInstance extends MapDrivingInstance {}

/** 步行规划实例 */
export interface MapWalkingInstance extends MapRouteServiceInstance {}

/** 公交规划实例 */
export interface MapTransferInstance extends MapRouteServiceInstance {
    /** 设置出发时间 */
    leaveAt?: (time: Date | string | number) => void
    /** 设置城市 */
    setCity?: (city: string) => void
    /** 设置目的城市 */
    setCityd?: (city: string) => void
}

/** 骑行规划实例 */
export interface MapRidingInstance extends MapRouteServiceInstance {}

/** 拖拽路线参数 */
export interface MapDragRouteOptions extends MapServiceBaseOptions {
    /** 路线样式 */
    polyOption?: MapPolylineOptions
    /** 起点标记样式 */
    startMarkerOptions?: MapMarkerOptions
    /** 途经点标记样式 */
    midMarkerOptions?: MapMarkerOptions
    /** 终点标记样式 */
    endMarkerOptions?: MapMarkerOptions
    /** 是否显示实时路况 */
    showTraffic?: boolean
}

/** 货车拖拽路线参数 */
export interface MapDragRouteTruckOptions extends MapDragRouteOptions, MapTruckDrivingOptions {
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
export interface MapDragRouteTruckLocation {
    /** 经纬度 */
    lnglat: MapLngLatLike
}

/** 拖拽路线实例 */
export interface MapDragRouteInstance extends MapServiceInstance {
    /** 开始导航 */
    search?: () => void
    /** 获取途经点 */
    getWays?: () => MapLngLatLike[]
    /** 获取当前路线 */
    getRoute?: () => MapLngLatLike[]
}

/** 货车拖拽路线实例 */
export interface MapDragRouteTruckInstance extends MapServiceInstance {
    /** 设置避让区域 */
    setAvoidPolygons?: (areas: MapLngLatLike[][]) => void
    /** 清除避让区域 */
    clearAvoidPolygons?: () => void
    /** 获取避让区域 */
    getAvoidPolygons?: () => unknown[][]
    /** 开始导航 */
    search?: (locations?: MapDragRouteTruckLocation[]) => void
    /** 手动更新路径 */
    updatePath?: () => void
    /** 获取途经点 */
    getWays?: () => MapLngLatLike[]
    /** 获取当前路线 */
    getRoute?: () => MapLngLatLike[]
    /** 修改配置项 */
    setOption?: (options: MapDragRouteTruckOptions) => void
}

/** 轨迹纠偏点 */
export interface MapGraspRoadPoint {
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
}

/** 轨迹纠偏实例 */
export interface MapGraspRoadInstance extends MapServiceInstance {
    /** 驾车轨迹纠偏 */
    driving?: (path: MapGraspRoadPoint[], callback?: MapServiceCallback) => void
}

/** 行政区查询参数 */
export interface MapDistrictSearchOptions extends MapServiceBaseOptions {
    /** 行政区级别 */
    level?: MapDistrictSearchLevel
    /** 是否显示商圈 */
    showbiz?: boolean
    /** 返回信息详略 */
    extensions?: MapServiceExtensions
    /** 下级行政区级数 */
    subdistrict?: number
}

/** 行政区查询实例 */
export interface MapDistrictSearchInstance extends MapServiceInstance {
    /** 设置行政区级别 */
    setLevel?: (level: string) => void
    /** 设置下级行政区级数 */
    setSubdistrict?: (subdistrict: number) => void
    /** 查询行政区 */
    search?: (keyword: string, callback?: MapServiceCallback) => void
}

/** 天气查询实例 */
export interface MapWeatherInstance extends MapServiceInstance {
    /** 查询实时天气 */
    getLive?: (city: string, callback?: MapWeatherCallback) => void
    /** 查询天气预报 */
    getForecast?: (city: string, callback?: MapWeatherCallback) => void
}

/** 公交查询参数 */
export interface MapBusSearchOptions extends MapServiceBaseOptions {
    /** 页码 */
    pageIndex?: number
    /** 单页数量 */
    pageSize?: number
    /** 城市 */
    city?: string
    /** 返回信息详略 */
    extensions?: MapServiceExtensions
}

/** 公交查询实例 */
export interface MapBusSearchInstance extends MapServiceInstance {
    /** 设置页码 */
    setPageIndex?: (pageIndex: number) => void
    /** 设置单页数量 */
    setPageSize?: (pageSize: number) => void
    /** 设置城市 */
    setCity?: (city: string) => void
    /** 关键字或 ID 查询 */
    search?: (keyword: string, callback?: MapServiceCallback) => void
}

/** 公交站点查询实例 */
export interface MapStationSearchInstance extends MapBusSearchInstance {}

/** 公交线路查询实例 */
export interface MapLineSearchInstance extends MapBusSearchInstance {}

/** 定位参数 */
export interface MapGeolocationOptions extends MapServiceBaseOptions {
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
    markerOptions?: MapMarkerOptions
    /** 定位圆样式 */
    circleOptions?: MapCircleOptions
    /** 是否移动到定位点 */
    panToLocation?: boolean
    /** 是否缩放到精度范围 */
    zoomToAccuracy?: boolean
    /** 是否优先使用浏览器定位 */
    GeoLocationFirst?: boolean
    /** 是否禁用 IP 定位 */
    noIpLocate?: MapGeolocationDisabledPolicy
    /** 是否禁用浏览器定位 */
    noGeoLocation?: MapGeolocationDisabledPolicy
    /** 是否使用原生能力 */
    useNative?: boolean
    /** 定位失败时是否返回城市信息 */
    getCityWhenFail?: boolean
    /** 是否需要地址 */
    needAddress?: boolean
    /** 逆地理编码信息详略 */
    extensions?: MapServiceExtensions
}

/** 定位实例 */
export interface MapGeolocationInstance extends MapServiceInstance {
    /** 获取当前位置 */
    getCurrentPosition?: (callback?: MapServiceCallback) => void
    /** 获取当前城市 */
    getCityInfo?: (callback?: MapServiceCallback) => void
    /** 添加到地图 */
    addTo?: (map: MapInstance) => void
    /** 从地图移除 */
    removeFrom?: (map?: MapInstance) => void
}

/** 城市查询实例 */
export interface MapCitySearchInstance extends MapServiceInstance {
    /** 获取本地城市 */
    getLocalCity?: (callback?: MapServiceCallback) => void
    /** 按 IP 获取城市 */
    getCityByIp?: (ip: string, callback?: MapServiceCallback) => void
}

/** WebService HTTP 参数 */
export interface MapWebServiceHttpOptions {
}

/** WebService 实例 */
export interface MapWebServiceInstance {
    /** GET 请求 */
    get?: (
        path: string,
        params: Record<string, unknown>,
        callback: MapWebServiceCallback,
        options?: MapWebServiceHttpOptions
    ) => void
    /** POST 请求 */
    post?: (path: string, params: unknown, callback: MapWebServiceCallback) => void
}

/** 支持服务构造器的高德命名空间 */
export interface MapServiceNamespace extends MapNamespace {
    /** 地理编码构造器 */
    Geocoder?: new (options?: MapGeocoderOptions) => MapGeocoderInstance
    /** 输入提示构造器 */
    AutoComplete?: new (options?: MapAutoCompleteOptions) => MapAutoCompleteInstance
    /** POI 搜索构造器 */
    PlaceSearch?: new (options?: MapPlaceSearchOptions) => MapPlaceSearchInstance
    /** 云数据检索构造器 */
    CloudDataSearch?: new (tableId: string, options?: MapCloudDataSearchOptions) => MapCloudDataSearchInstance
    /** 驾车规划构造器 */
    Driving?: new (options?: MapDrivingOptions) => MapDrivingInstance
    /** 货车规划构造器 */
    TruckDriving?: new (options?: MapTruckDrivingOptions) => MapTruckDrivingInstance
    /** 步行规划构造器 */
    Walking?: new (options?: MapRouteServiceOptions) => MapWalkingInstance
    /** 公交规划构造器 */
    Transfer?: new (options?: MapTransferOptions) => MapTransferInstance
    /** 骑行规划构造器 */
    Riding?: new (options?: MapRouteServiceOptions) => MapRidingInstance
    /** 拖拽路线构造器 */
    DragRoute?: new (
        map: MapInstance,
        path: MapLngLatLike[],
        policy?: number | string,
        options?: MapDragRouteOptions
    ) => MapDragRouteInstance
    /** 货车拖拽路线构造器 */
    DragRouteTruck?: new (map: MapInstance, options?: MapDragRouteTruckOptions) => MapDragRouteTruckInstance
    /** 轨迹纠偏构造器 */
    GraspRoad?: new () => MapGraspRoadInstance
    /** 行政区查询构造器 */
    DistrictSearch?: new (options?: MapDistrictSearchOptions) => MapDistrictSearchInstance
    /** 天气查询构造器 */
    Weather?: new () => MapWeatherInstance
    /** 公交站点查询构造器 */
    StationSearch?: new (options?: MapBusSearchOptions) => MapStationSearchInstance
    /** 公交线路查询构造器 */
    LineSearch?: new (options?: MapBusSearchOptions) => MapLineSearchInstance
    /** 定位构造器 */
    Geolocation?: new (options?: MapGeolocationOptions) => MapGeolocationInstance
    /** 城市查询构造器 */
    CitySearch?: new () => MapCitySearchInstance
    /** WebService 静态对象 */
    WebService?: MapWebServiceInstance
    /** 坐标转换 */
    convertFrom?: (
        lnglat: MapLngLatLike | MapLngLatLike[],
        type?: MapCoordinateConvertType,
        callback?: MapServiceCallback
    ) => void
}

/** 地理编码鼠标事件 */
export interface MapGeocoderMouseEvent extends MapServiceMouseEvent<MapGeocoderInstance> {}

/** 地理编码交互坐标事件 */
export interface MapGeocoderInteractionEvent extends MapServiceInteractionEvent<MapGeocoderInstance> {}

/** 地理编码目标事件 */
export interface MapGeocoderTargetEvent extends MapServiceTargetEvent<MapGeocoderInstance> {}

/** 地理编码移动动画事件 */
export interface MapGeocoderMoveEvent extends MapServiceMoveEvent<MapGeocoderInstance> {}

/** 地理编码事件快捷属性 */
export interface MapGeocoderEventShortcutProps extends MapServiceEventShortcutProps<MapGeocoderInstance> {}

/** 输入提示鼠标事件 */
export interface MapAutoCompleteMouseEvent extends MapServiceMouseEvent<MapAutoCompleteInstance> {}

/** 输入提示交互坐标事件 */
export interface MapAutoCompleteInteractionEvent extends MapServiceInteractionEvent<MapAutoCompleteInstance> {}

/** 输入提示目标事件 */
export interface MapAutoCompleteTargetEvent extends MapServiceTargetEvent<MapAutoCompleteInstance> {}

/** 输入提示移动动画事件 */
export interface MapAutoCompleteMoveEvent extends MapServiceMoveEvent<MapAutoCompleteInstance> {}

/** 输入提示事件快捷属性 */
export interface MapAutoCompleteEventShortcutProps extends MapServiceEventShortcutProps<MapAutoCompleteInstance> {}

/** POI 搜索鼠标事件 */
export interface MapPlaceSearchMouseEvent extends MapServiceMouseEvent<MapPlaceSearchInstance> {}

/** POI 搜索交互坐标事件 */
export interface MapPlaceSearchInteractionEvent extends MapServiceInteractionEvent<MapPlaceSearchInstance> {}

/** POI 搜索目标事件 */
export interface MapPlaceSearchTargetEvent extends MapServiceTargetEvent<MapPlaceSearchInstance> {}

/** POI 搜索移动动画事件 */
export interface MapPlaceSearchMoveEvent extends MapServiceMoveEvent<MapPlaceSearchInstance> {}

/** POI 搜索事件快捷属性 */
export interface MapPlaceSearchEventShortcutProps extends MapServiceEventShortcutProps<MapPlaceSearchInstance> {}

/** 云数据检索鼠标事件 */
export interface MapCloudDataSearchMouseEvent extends MapServiceMouseEvent<MapCloudDataSearchInstance> {}

/** 云数据检索交互坐标事件 */
export interface MapCloudDataSearchInteractionEvent extends MapServiceInteractionEvent<MapCloudDataSearchInstance> {}

/** 云数据检索目标事件 */
export interface MapCloudDataSearchTargetEvent extends MapServiceTargetEvent<MapCloudDataSearchInstance> {}

/** 云数据检索移动动画事件 */
export interface MapCloudDataSearchMoveEvent extends MapServiceMoveEvent<MapCloudDataSearchInstance> {}

/** 云数据检索事件快捷属性 */
export interface MapCloudDataSearchEventShortcutProps extends MapServiceEventShortcutProps<MapCloudDataSearchInstance> {}

/** 驾车规划鼠标事件 */
export interface MapDrivingMouseEvent extends MapServiceMouseEvent<MapDrivingInstance> {}

/** 驾车规划交互坐标事件 */
export interface MapDrivingInteractionEvent extends MapServiceInteractionEvent<MapDrivingInstance> {}

/** 驾车规划目标事件 */
export interface MapDrivingTargetEvent extends MapServiceTargetEvent<MapDrivingInstance> {}

/** 驾车规划移动动画事件 */
export interface MapDrivingMoveEvent extends MapServiceMoveEvent<MapDrivingInstance> {}

/** 驾车规划事件快捷属性 */
export interface MapDrivingEventShortcutProps extends MapServiceEventShortcutProps<MapDrivingInstance> {}

/** 货车规划鼠标事件 */
export interface MapTruckDrivingMouseEvent extends MapServiceMouseEvent<MapTruckDrivingInstance> {}

/** 货车规划交互坐标事件 */
export interface MapTruckDrivingInteractionEvent extends MapServiceInteractionEvent<MapTruckDrivingInstance> {}

/** 货车规划目标事件 */
export interface MapTruckDrivingTargetEvent extends MapServiceTargetEvent<MapTruckDrivingInstance> {}

/** 货车规划移动动画事件 */
export interface MapTruckDrivingMoveEvent extends MapServiceMoveEvent<MapTruckDrivingInstance> {}

/** 货车规划事件快捷属性 */
export interface MapTruckDrivingEventShortcutProps extends MapServiceEventShortcutProps<MapTruckDrivingInstance> {}

/** 步行规划鼠标事件 */
export interface MapWalkingMouseEvent extends MapServiceMouseEvent<MapWalkingInstance> {}

/** 步行规划交互坐标事件 */
export interface MapWalkingInteractionEvent extends MapServiceInteractionEvent<MapWalkingInstance> {}

/** 步行规划目标事件 */
export interface MapWalkingTargetEvent extends MapServiceTargetEvent<MapWalkingInstance> {}

/** 步行规划移动动画事件 */
export interface MapWalkingMoveEvent extends MapServiceMoveEvent<MapWalkingInstance> {}

/** 步行规划事件快捷属性 */
export interface MapWalkingEventShortcutProps extends MapServiceEventShortcutProps<MapWalkingInstance> {}

/** 公交规划鼠标事件 */
export interface MapTransferMouseEvent extends MapServiceMouseEvent<MapTransferInstance> {}

/** 公交规划交互坐标事件 */
export interface MapTransferInteractionEvent extends MapServiceInteractionEvent<MapTransferInstance> {}

/** 公交规划目标事件 */
export interface MapTransferTargetEvent extends MapServiceTargetEvent<MapTransferInstance> {}

/** 公交规划移动动画事件 */
export interface MapTransferMoveEvent extends MapServiceMoveEvent<MapTransferInstance> {}

/** 公交规划事件快捷属性 */
export interface MapTransferEventShortcutProps extends MapServiceEventShortcutProps<MapTransferInstance> {}

/** 骑行规划鼠标事件 */
export interface MapRidingMouseEvent extends MapServiceMouseEvent<MapRidingInstance> {}

/** 骑行规划交互坐标事件 */
export interface MapRidingInteractionEvent extends MapServiceInteractionEvent<MapRidingInstance> {}

/** 骑行规划目标事件 */
export interface MapRidingTargetEvent extends MapServiceTargetEvent<MapRidingInstance> {}

/** 骑行规划移动动画事件 */
export interface MapRidingMoveEvent extends MapServiceMoveEvent<MapRidingInstance> {}

/** 骑行规划事件快捷属性 */
export interface MapRidingEventShortcutProps extends MapServiceEventShortcutProps<MapRidingInstance> {}

/** 拖拽路线鼠标事件 */
export interface MapDragRouteMouseEvent extends MapServiceMouseEvent<MapDragRouteInstance> {}

/** 拖拽路线交互坐标事件 */
export interface MapDragRouteInteractionEvent extends MapServiceInteractionEvent<MapDragRouteInstance> {}

/** 拖拽路线目标事件 */
export interface MapDragRouteTargetEvent extends MapServiceTargetEvent<MapDragRouteInstance> {}

/** 拖拽路线移动动画事件 */
export interface MapDragRouteMoveEvent extends MapServiceMoveEvent<MapDragRouteInstance> {}

/** 拖拽路线事件快捷属性 */
export interface MapDragRouteEventShortcutProps extends MapServiceEventShortcutProps<MapDragRouteInstance> {}

/** 货车拖拽路线鼠标事件 */
export interface MapDragRouteTruckMouseEvent extends MapServiceMouseEvent<MapDragRouteTruckInstance> {}

/** 货车拖拽路线交互坐标事件 */
export interface MapDragRouteTruckInteractionEvent extends MapServiceInteractionEvent<MapDragRouteTruckInstance> {}

/** 货车拖拽路线目标事件 */
export interface MapDragRouteTruckTargetEvent extends MapServiceTargetEvent<MapDragRouteTruckInstance> {}

/** 货车拖拽路线移动动画事件 */
export interface MapDragRouteTruckMoveEvent extends MapServiceMoveEvent<MapDragRouteTruckInstance> {}

/** 货车拖拽路线事件快捷属性 */
export interface MapDragRouteTruckEventShortcutProps extends MapServiceEventShortcutProps<MapDragRouteTruckInstance> {}

/** 轨迹纠偏鼠标事件 */
export interface MapGraspRoadMouseEvent extends MapServiceMouseEvent<MapGraspRoadInstance> {}

/** 轨迹纠偏交互坐标事件 */
export interface MapGraspRoadInteractionEvent extends MapServiceInteractionEvent<MapGraspRoadInstance> {}

/** 轨迹纠偏目标事件 */
export interface MapGraspRoadTargetEvent extends MapServiceTargetEvent<MapGraspRoadInstance> {}

/** 轨迹纠偏移动动画事件 */
export interface MapGraspRoadMoveEvent extends MapServiceMoveEvent<MapGraspRoadInstance> {}

/** 轨迹纠偏事件快捷属性 */
export interface MapGraspRoadEventShortcutProps extends MapServiceEventShortcutProps<MapGraspRoadInstance> {}

/** 行政区查询鼠标事件 */
export interface MapDistrictSearchMouseEvent extends MapServiceMouseEvent<MapDistrictSearchInstance> {}

/** 行政区查询交互坐标事件 */
export interface MapDistrictSearchInteractionEvent extends MapServiceInteractionEvent<MapDistrictSearchInstance> {}

/** 行政区查询目标事件 */
export interface MapDistrictSearchTargetEvent extends MapServiceTargetEvent<MapDistrictSearchInstance> {}

/** 行政区查询移动动画事件 */
export interface MapDistrictSearchMoveEvent extends MapServiceMoveEvent<MapDistrictSearchInstance> {}

/** 行政区查询事件快捷属性 */
export interface MapDistrictSearchEventShortcutProps extends MapServiceEventShortcutProps<MapDistrictSearchInstance> {}

/** 天气查询鼠标事件 */
export interface MapWeatherMouseEvent extends MapServiceMouseEvent<MapWeatherInstance> {}

/** 天气查询交互坐标事件 */
export interface MapWeatherInteractionEvent extends MapServiceInteractionEvent<MapWeatherInstance> {}

/** 天气查询目标事件 */
export interface MapWeatherTargetEvent extends MapServiceTargetEvent<MapWeatherInstance> {}

/** 天气查询移动动画事件 */
export interface MapWeatherMoveEvent extends MapServiceMoveEvent<MapWeatherInstance> {}

/** 天气查询事件快捷属性 */
export interface MapWeatherEventShortcutProps extends MapServiceEventShortcutProps<MapWeatherInstance> {}

/** 公交站点查询鼠标事件 */
export interface MapStationSearchMouseEvent extends MapServiceMouseEvent<MapStationSearchInstance> {}

/** 公交站点查询交互坐标事件 */
export interface MapStationSearchInteractionEvent extends MapServiceInteractionEvent<MapStationSearchInstance> {}

/** 公交站点查询目标事件 */
export interface MapStationSearchTargetEvent extends MapServiceTargetEvent<MapStationSearchInstance> {}

/** 公交站点查询移动动画事件 */
export interface MapStationSearchMoveEvent extends MapServiceMoveEvent<MapStationSearchInstance> {}

/** 公交站点查询事件快捷属性 */
export interface MapStationSearchEventShortcutProps extends MapServiceEventShortcutProps<MapStationSearchInstance> {}

/** 公交线路查询鼠标事件 */
export interface MapLineSearchMouseEvent extends MapServiceMouseEvent<MapLineSearchInstance> {}

/** 公交线路查询交互坐标事件 */
export interface MapLineSearchInteractionEvent extends MapServiceInteractionEvent<MapLineSearchInstance> {}

/** 公交线路查询目标事件 */
export interface MapLineSearchTargetEvent extends MapServiceTargetEvent<MapLineSearchInstance> {}

/** 公交线路查询移动动画事件 */
export interface MapLineSearchMoveEvent extends MapServiceMoveEvent<MapLineSearchInstance> {}

/** 公交线路查询事件快捷属性 */
export interface MapLineSearchEventShortcutProps extends MapServiceEventShortcutProps<MapLineSearchInstance> {}

/** 定位鼠标事件 */
export interface MapGeolocationMouseEvent extends MapServiceMouseEvent<MapGeolocationInstance> {}

/** 定位交互坐标事件 */
export interface MapGeolocationInteractionEvent extends MapServiceInteractionEvent<MapGeolocationInstance> {}

/** 定位目标事件 */
export interface MapGeolocationTargetEvent extends MapServiceTargetEvent<MapGeolocationInstance> {}

/** 定位移动动画事件 */
export interface MapGeolocationMoveEvent extends MapServiceMoveEvent<MapGeolocationInstance> {}

/** 定位事件快捷属性 */
export interface MapGeolocationEventShortcutProps extends MapServiceEventShortcutProps<MapGeolocationInstance> {}

/** 城市查询鼠标事件 */
export interface MapCitySearchMouseEvent extends MapServiceMouseEvent<MapCitySearchInstance> {}

/** 城市查询交互坐标事件 */
export interface MapCitySearchInteractionEvent extends MapServiceInteractionEvent<MapCitySearchInstance> {}

/** 城市查询目标事件 */
export interface MapCitySearchTargetEvent extends MapServiceTargetEvent<MapCitySearchInstance> {}

/** 城市查询移动动画事件 */
export interface MapCitySearchMoveEvent extends MapServiceMoveEvent<MapCitySearchInstance> {}

/** 城市查询事件快捷属性 */
export interface MapCitySearchEventShortcutProps extends MapServiceEventShortcutProps<MapCitySearchInstance> {}

/** 服务 Hook 基础参数 */
export interface UseMapServiceBaseParams<TInstance extends MapServiceInstance> extends MapServiceProps<TInstance> {}

/** 地理编码组件属性 */
export interface GeocoderProps extends UseMapServiceBaseParams<MapGeocoderInstance>, MapGeocoderOptions {}

/** 输入提示组件属性 */
export interface AutoCompleteProps extends UseMapServiceBaseParams<MapAutoCompleteInstance>, MapAutoCompleteOptions {}

/** POI 搜索组件属性 */
export interface PlaceSearchProps extends UseMapServiceBaseParams<MapPlaceSearchInstance>, MapPlaceSearchOptions {}

/** 云数据检索组件属性 */
export interface CloudDataSearchProps extends UseMapServiceBaseParams<MapCloudDataSearchInstance>, MapCloudDataSearchOptions {
    /** 云数据表 ID */
    tableId: string
}

/** 驾车规划组件属性 */
export interface DrivingProps extends UseMapServiceBaseParams<MapDrivingInstance>, MapDrivingOptions {}

/** 货车规划组件属性 */
export interface TruckDrivingProps extends UseMapServiceBaseParams<MapTruckDrivingInstance>, MapTruckDrivingOptions {}

/** 步行规划组件属性 */
export interface WalkingProps extends UseMapServiceBaseParams<MapWalkingInstance>, MapRouteServiceOptions {}

/** 公交规划组件属性 */
export interface TransferProps extends UseMapServiceBaseParams<MapTransferInstance>, MapTransferOptions {}

/** 骑行规划组件属性 */
export interface RidingProps extends UseMapServiceBaseParams<MapRidingInstance>, MapRouteServiceOptions {}

/** 拖拽路线组件属性 */
export interface DragRouteProps extends UseMapServiceBaseParams<MapDragRouteInstance>, MapDragRouteOptions {
    /** 路线坐标 */
    path?: MapLngLatLike[]
    /** 路线策略 */
    policy?: number | string
    /** 创建后是否立即搜索 */
    autoSearch?: boolean
}

/** 货车拖拽路线组件属性 */
export interface DragRouteTruckProps
    extends UseMapServiceBaseParams<MapDragRouteTruckInstance>,
        MapDragRouteTruckOptions {
    /** 路线坐标 */
    locations?: MapDragRouteTruckLocation[]
    /** 创建后是否立即搜索 */
    autoSearch?: boolean
}

/** 轨迹纠偏组件属性 */
export interface GraspRoadProps extends UseMapServiceBaseParams<MapGraspRoadInstance> {}

/** 行政区查询组件属性 */
export interface DistrictSearchProps extends UseMapServiceBaseParams<MapDistrictSearchInstance>, MapDistrictSearchOptions {}

/** 天气查询组件属性 */
export interface WeatherProps extends UseMapServiceBaseParams<MapWeatherInstance> {}

/** 公交站点查询组件属性 */
export interface StationSearchProps extends UseMapServiceBaseParams<MapStationSearchInstance>, MapBusSearchOptions {}

/** 公交线路查询组件属性 */
export interface LineSearchProps extends UseMapServiceBaseParams<MapLineSearchInstance>, MapBusSearchOptions {}

/** 定位组件属性 */
export interface GeolocationProps extends UseMapServiceBaseParams<MapGeolocationInstance>, MapGeolocationOptions {
    /** 是否添加为地图控件 */
    addControl?: boolean
}

/** 城市查询组件属性 */
export interface CitySearchProps extends UseMapServiceBaseParams<MapCitySearchInstance> {}

/** WebService Hook 参数 */
export interface UseMapWebServiceParams {
    /** 高德地图命名空间 */
    AMap?: MapNamespace
}

/** 坐标转换参数 */
export interface ConvertMapCoordinateParams {
    /** 坐标 */
    lnglat: MapLngLatLike | MapLngLatLike[]
    /** 坐标类型 */
    type?: MapCoordinateConvertType
    /** 回调函数 */
    callback?: MapServiceCallback
}

/** 坐标转换函数 */
export type ConvertMapCoordinate = (params: ConvertMapCoordinateParams) => void

function setMapServiceRef<TInstance extends MapServiceInstance>(ref: Ref<TInstance | null> | undefined, service: TInstance | null) {
    if (!ref) return

    if (typeof ref === "function") {
        ref(service)
        return
    }

    ref.current = service
}

function getMapServiceConstructor<TInstance extends MapServiceInstance, TOptions extends MapServiceBaseOptions>({
    AMap,
    constructorName,
}: CreateMapServiceParams<TOptions>) {
    const constructor = (AMap as unknown as Record<string, unknown>)[constructorName]

    if (typeof constructor !== "function") return undefined

    return constructor as MapServiceConstructor<TInstance, TOptions>
}

function createDefaultMapService<TInstance extends MapServiceInstance, TOptions extends MapServiceBaseOptions>(
    params: CreateMapServiceParams<TOptions>
) {
    const ServiceConstructor = getMapServiceConstructor<TInstance, TOptions>(params)

    if (!ServiceConstructor) return undefined

    return new ServiceConstructor(params.options)
}

function destroyDefaultMapService<TInstance extends MapServiceInstance>({
    service,
}: DestroyMapServiceParams<TInstance>) {
    if (service.destroy) {
        service.destroy()
        return
    }

    if (service.clear) service.clear()
    if (service.close) service.close()
    service.setMap?.(null)
}

function bindMapServiceEvents<TInstance extends MapServiceInstance>(service: TInstance, events?: MapServiceEvents) {
    const eventEntries = getMapEventEntries(events)

    eventEntries.forEach(({ eventName, handler }) => service.on?.(eventName, handler))

    return function unbindMapServiceEvents() {
        eventEntries.forEach(({ eventName, handler }) => service.off?.(eventName, handler))
    }
}

function getDefinedMapServiceOptions<TOptions extends MapServiceBaseOptions>(options: TOptions) {
    const nextOptions: TOptions = {} as TOptions

    Object.entries(cleanMapServiceExtraOptions(options)).forEach(([key, value]) => {
        if (value !== undefined) {
            Object.assign(nextOptions, {
                [key]: value,
            })
        }
    })

    return nextOptions
}

function cleanMapServiceExtraOptions<TOptions extends MapServiceBaseOptions>(extraOptions: TOptions) {
    const {
        AMap: _AMap,
        enabled: _enabled,
        events: _events,
        map: _map,
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

function applyMapServiceMapOption<TOptions extends MapServiceBaseOptions>(
    options: TOptions,
    map?: MapInstance
) {
    if (!map || "map" in options) return options

    return {
        ...options,
        map,
    }
}

export function useMapService<TInstance extends MapServiceInstance, TOptions extends MapServiceBaseOptions>({
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
}: UseMapServiceParams<TInstance, TOptions>) {
    const context = useMapContext()
    const serviceRef = useRef<TInstance | null>(null)
    const currentMap = map ?? context.map
    const currentAMap = AMap ?? context.AMap
    const pluginLoaded = useMapPlugin({
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
    const currentEvents = mergeMapEvents({
        eventShortcuts,
        events,
    }) as MapServiceEvents

    useStableEffect(() => {
        if (!enabled || !currentAMap || !pluginLoaded) return

        const createNextService = getCreateService() ?? createDefaultMapService
        const nextService = createNextService({
            map: currentMap,
            AMap: currentAMap,
            constructorName,
            options: getOptions(),
        }) as TInstance | null | undefined

        if (!nextService) return

        serviceRef.current = nextService
        setService(nextService)
        setMapServiceRef(ref, nextService)
        onLoad(nextService)

        return () => {
            serviceRef.current = null
            setService(null)
            setMapServiceRef(ref, null)

            try {
                onDestroy(nextService)
            } finally {
                const destroyNextService = getDestroyService() ?? destroyDefaultMapService

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

        return bindMapServiceEvents(serviceRef.current, currentEvents)
    }, [constructorName, currentAMap, currentEvents, currentMap, pluginLoaded, ref])

    return service
}

export function useGeocoder(params: GeocoderProps = {}) {
    const options = getDefinedMapServiceOptions(params as MapGeocoderOptions)

    return useMapService<MapGeocoderInstance, MapGeocoderOptions>({
        ...params,
        pluginName: MapPlugin.Geocoder,
        constructorName: "Geocoder",
        options,
        updateService: ({ service, options }) => {
            if (typeof options.city === "string") service.setCity?.(options.city)
        },
    })
}

export function useAutoComplete(params: AutoCompleteProps = {}) {
    const options = getDefinedMapServiceOptions(params as MapAutoCompleteOptions)

    return useMapService<MapAutoCompleteInstance, MapAutoCompleteOptions>({
        ...params,
        pluginName: MapPlugin.AutoComplete,
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
    const options = applyMapServiceMapOption(
        getDefinedMapServiceOptions(params as MapPlaceSearchOptions),
        params.map
    )

    return useMapService<MapPlaceSearchInstance, MapPlaceSearchOptions>({
        ...params,
        pluginName: MapPlugin.PlaceSearch,
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
    const { tableId, ...restOptions } = params
    const options = applyMapServiceMapOption(
        getDefinedMapServiceOptions(restOptions as MapCloudDataSearchOptions),
        params.map
    )

    return useMapService<MapCloudDataSearchInstance, MapCloudDataSearchOptions>({
        ...params,
        pluginName: MapPlugin.CloudDataSearch,
        constructorName: "CloudDataSearch",
        options,
        createService: ({ AMap, options }) => {
            const currentAMap = AMap as MapServiceNamespace

            return currentAMap.CloudDataSearch ? new currentAMap.CloudDataSearch(tableId, options) : undefined
        },
        updateService: ({ service, options }) => service.setOptions?.(options),
    })
}

export function useDriving(params: DrivingProps = {}) {
    const options = applyMapServiceMapOption(
        getDefinedMapServiceOptions(params as MapDrivingOptions),
        params.map
    )

    return useMapService<MapDrivingInstance, MapDrivingOptions>({
        ...params,
        pluginName: MapPlugin.Driving,
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
    const options = applyMapServiceMapOption(
        getDefinedMapServiceOptions(params as MapTruckDrivingOptions),
        params.map
    )

    return useMapService<MapTruckDrivingInstance, MapTruckDrivingOptions>({
        ...params,
        pluginName: MapPlugin.TruckDriving,
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
    const options = applyMapServiceMapOption(
        getDefinedMapServiceOptions(params as MapRouteServiceOptions),
        params.map
    )

    return useMapService<MapWalkingInstance, MapRouteServiceOptions>({
        ...params,
        pluginName: MapPlugin.Walking,
        constructorName: "Walking",
        options,
    })
}

export function useTransfer(params: TransferProps = {}) {
    const options = applyMapServiceMapOption(
        getDefinedMapServiceOptions(params as MapTransferOptions),
        params.map
    )

    return useMapService<MapTransferInstance, MapTransferOptions>({
        ...params,
        pluginName: MapPlugin.Transfer,
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
    const options = applyMapServiceMapOption(
        getDefinedMapServiceOptions(params as MapRouteServiceOptions),
        params.map
    )

    return useMapService<MapRidingInstance, MapRouteServiceOptions>({
        ...params,
        pluginName: MapPlugin.Riding,
        constructorName: "Riding",
        options,
        updateService: ({ service, options }) => {
            if (options.policy !== undefined) service.setPolicy?.(options.policy)
        },
    })
}

export function useDragRoute(params: DragRouteProps = {}) {
    const { path = [], policy, autoSearch = true, ...restOptions } = params
    const options = getDefinedMapServiceOptions(restOptions as MapDragRouteOptions)

    return useMapService<MapDragRouteInstance, MapDragRouteOptions>({
        ...params,
        pluginName: MapPlugin.DragRoute,
        constructorName: "DragRoute",
        options,
        createService: ({ map, AMap, options }) => {
            if (!map) return undefined

            const currentAMap = AMap as MapServiceNamespace
            const service = currentAMap.DragRoute ? new currentAMap.DragRoute(map, path, policy, options) : undefined

            if (autoSearch) service?.search?.()

            return service
        },
    })
}

export function useDragRouteTruck(params: DragRouteTruckProps = {}) {
    const { locations, autoSearch = true, ...restOptions } = params
    const options = getDefinedMapServiceOptions(restOptions as MapDragRouteTruckOptions)

    return useMapService<MapDragRouteTruckInstance, MapDragRouteTruckOptions>({
        ...params,
        pluginName: MapPlugin.DragRouteTruck,
        constructorName: "DragRouteTruck",
        options,
        createService: ({ map, AMap, options }) => {
            if (!map) return undefined

            const currentAMap = AMap as MapServiceNamespace
            const service = currentAMap.DragRouteTruck ? new currentAMap.DragRouteTruck(map, options) : undefined

            if (autoSearch) service?.search?.(locations)

            return service
        },
        updateService: ({ service, options }) => service.setOption?.(options),
    })
}

export function useGraspRoad(params: GraspRoadProps = {}) {
    return useMapService<MapGraspRoadInstance, MapServiceBaseOptions>({
        ...params,
        pluginName: MapPlugin.GraspRoad,
        constructorName: "GraspRoad",
    })
}

export function useDistrictSearch(params: DistrictSearchProps = {}) {
    const options = getDefinedMapServiceOptions(params as MapDistrictSearchOptions)

    return useMapService<MapDistrictSearchInstance, MapDistrictSearchOptions>({
        ...params,
        pluginName: MapPlugin.DistrictSearch,
        constructorName: "DistrictSearch",
        options,
        updateService: ({ service, options }) => {
            if (typeof options.level === "string") service.setLevel?.(options.level)
            if (typeof options.subdistrict === "number") service.setSubdistrict?.(options.subdistrict)
        },
    })
}

export function useWeather(params: WeatherProps = {}) {
    return useMapService<MapWeatherInstance, MapServiceBaseOptions>({
        ...params,
        pluginName: MapPlugin.Weather,
        constructorName: "Weather",
    })
}

export function useStationSearch(params: StationSearchProps = {}) {
    const options = getDefinedMapServiceOptions(params as MapBusSearchOptions)

    return useMapService<MapStationSearchInstance, MapBusSearchOptions>({
        ...params,
        pluginName: MapPlugin.StationSearch,
        constructorName: "StationSearch",
        options,
        updateService: updateMapBusSearch,
    })
}

export function useLineSearch(params: LineSearchProps = {}) {
    const options = getDefinedMapServiceOptions(params as MapBusSearchOptions)

    return useMapService<MapLineSearchInstance, MapBusSearchOptions>({
        ...params,
        pluginName: MapPlugin.LineSearch,
        constructorName: "LineSearch",
        options,
        updateService: updateMapBusSearch,
    })
}

export function useGeolocation(params: GeolocationProps = {}) {
    const { addControl = true, ...restOptions } = params
    const options = getDefinedMapServiceOptions(restOptions as MapGeolocationOptions)

    return useMapService<MapGeolocationInstance, MapGeolocationOptions>({
        ...params,
        pluginName: MapPlugin.Geolocation,
        constructorName: "Geolocation",
        options,
        createService: ({ map, AMap, options }) => {
            const currentAMap = AMap as MapServiceNamespace
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
    return useMapService<MapCitySearchInstance, MapServiceBaseOptions>({
        ...params,
        pluginName: MapPlugin.CitySearch,
        constructorName: "CitySearch",
    })
}

export function useMapWebService({ AMap }: UseMapWebServiceParams = {}) {
    const context = useMapContext()
    const currentAMap = (AMap ?? context.AMap) as MapServiceNamespace | null

    return currentAMap?.WebService ?? null
}

export function useMapConvertFrom({ AMap }: UseMapWebServiceParams = {}) {
    const context = useMapContext()
    const currentAMap = (AMap ?? context.AMap) as MapServiceNamespace | null

    if (!currentAMap?.convertFrom) return undefined

    return function convertMapCoordinate({ lnglat, type = "gps", callback }: ConvertMapCoordinateParams) {
        currentAMap.convertFrom?.(lnglat, type, callback)
    }
}

function updateMapBusSearch<TInstance extends MapBusSearchInstance>({
    service,
    options,
}: UpdateMapServiceParams<TInstance, MapBusSearchOptions>) {
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
    ref?: Ref<MapWebServiceInstance | null>
    /** 高德地图命名空间 */
    AMap?: MapNamespace
    /** 创建完成回调 */
    onLoad?: (webService: MapWebServiceInstance) => void
    /** 销毁前回调 */
    onDestroy?: (webService: MapWebServiceInstance) => void
}

export const WebService: FC<WebServiceProps> = ({ ref, AMap, onLoad: _onLoad, onDestroy: _onDestroy }) => {
    const webService = useMapWebService({
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
export interface MapMoveAnimationOptions {
    /** 每段动画时长 */
    duration?: number | MapMoveDurationCallback
    /** 每段动画速度 */
    speed?: number | MapMoveDurationCallback
    /** 延迟动画时长 */
    delay?: number | MapMoveDurationCallback
    /** 是否循环 */
    circlable?: boolean
    /** 动画结束是否自动旋转 */
    autoRotation?: boolean
}

/** 移动动画目标 */
export interface MapMoveAnimationTarget {
    /** 移动到指定位置 */
    moveTo?: (position: MapLngLatLike, options?: MapMoveAnimationOptions) => void
    /** 沿路径移动 */
    moveAlong?: (path: MapLngLatLike[], options?: MapMoveAnimationOptions) => void
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
export interface UseMapMoveAnimationParams {
    /** 地图实例 */
    map?: MapInstance
    /** 高德地图命名空间 */
    AMap?: MapNamespace
}

export function useMapMoveAnimation({ map, AMap }: UseMapMoveAnimationParams = {}) {
    const context = useMapContext()
    const currentMap = map ?? context.map
    const currentAMap = AMap ?? context.AMap

    return useMapPlugin({
        map: currentMap,
        AMap: currentAMap,
        pluginName: MapPlugin.MoveAnimation,
        constructorName: "MoveAnimation",
    })
}
