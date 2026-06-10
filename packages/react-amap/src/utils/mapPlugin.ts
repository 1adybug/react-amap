import type { MapInstance, MapNamespace, MapPlugin } from "../components/Map"

/** 支持插件加载的高德对象 */
export interface MapPluginLoader {
    /** 加载 JSAPI 插件 */
    plugin?: (plugins: MapPlugin | MapPlugin[], callback?: () => void) => void
}

/** 检查高德构造器参数 */
export interface HasMapConstructorParams {
    /** 高德地图命名空间 */
    AMap: MapNamespace
    /** 构造器名称 */
    constructorName: string
}

/** 获取插件加载器参数 */
export interface GetMapPluginLoaderParams {
    /** 地图实例 */
    map?: MapInstance | null
    /** 高德地图命名空间 */
    AMap: MapNamespace
}

/** 加载高德插件参数 */
export interface LoadMapPluginParams extends GetMapPluginLoaderParams {
    /** 插件名称 */
    pluginName: MapPlugin
    /** 插件加载后应存在的构造器名称 */
    constructorName: string
}

export function hasMapConstructor({ AMap, constructorName }: HasMapConstructorParams) {
    const constructor = (AMap as unknown as Record<string, unknown>)[constructorName]

    return typeof constructor === "function"
}

export function getMapPluginLoader({ map, AMap }: GetMapPluginLoaderParams) {
    const namespacePluginLoader = AMap as MapPluginLoader
    const mapPluginLoader = map as MapPluginLoader | null | undefined

    return namespacePluginLoader.plugin ? namespacePluginLoader : mapPluginLoader
}

export function loadMapPlugin({ map, AMap, pluginName, constructorName }: LoadMapPluginParams) {
    if (hasMapConstructor({ AMap, constructorName })) return Promise.resolve()

    const pluginLoader = getMapPluginLoader({
        map,
        AMap,
    })

    const plugin = pluginLoader?.plugin

    if (!plugin) return Promise.reject(new Error(`AMap plugin loader is unavailable for ${pluginName}.`))

    return new Promise<void>((resolve, reject) => {
        function onPluginLoad() {
            if (hasMapConstructor({ AMap, constructorName })) {
                resolve()
                return
            }

            reject(new Error(`AMap plugin ${pluginName} loaded, but ${constructorName} is unavailable.`))
        }

        try {
            plugin([pluginName], onPluginLoad)
        } catch (caughtError) {
            reject(caughtError)
        }
    })
}