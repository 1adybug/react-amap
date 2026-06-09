import type { AmapMapInstance, AmapNamespace, AmapPlugin } from "../components/Amap"

/** 支持插件加载的高德对象 */
export interface AmapPluginLoader {
    /** 加载 JSAPI 插件 */
    plugin?: (plugins: AmapPlugin | AmapPlugin[], callback?: () => void) => void
}

/** 检查高德构造器参数 */
export interface HasAmapConstructorParams {
    /** 高德地图命名空间 */
    AMap: AmapNamespace
    /** 构造器名称 */
    constructorName: string
}

/** 获取插件加载器参数 */
export interface GetAmapPluginLoaderParams {
    /** 地图实例 */
    map?: AmapMapInstance | null
    /** 高德地图命名空间 */
    AMap: AmapNamespace
}

/** 加载高德插件参数 */
export interface LoadAmapPluginParams extends GetAmapPluginLoaderParams {
    /** 插件名称 */
    pluginName: AmapPlugin
    /** 插件加载后应存在的构造器名称 */
    constructorName: string
}

export function hasAmapConstructor({ AMap, constructorName }: HasAmapConstructorParams) {
    const constructor = (AMap as Record<string, unknown>)[constructorName]

    return typeof constructor === "function"
}

export function getAmapPluginLoader({ map, AMap }: GetAmapPluginLoaderParams) {
    const namespacePluginLoader = AMap as AmapPluginLoader
    const mapPluginLoader = map as AmapPluginLoader | null | undefined

    return namespacePluginLoader.plugin ? namespacePluginLoader : mapPluginLoader
}

export function loadAmapPlugin({ map, AMap, pluginName, constructorName }: LoadAmapPluginParams) {
    if (hasAmapConstructor({ AMap, constructorName })) return Promise.resolve()

    const pluginLoader = getAmapPluginLoader({
        map,
        AMap,
    })

    const plugin = pluginLoader?.plugin

    if (!plugin) return Promise.reject(new Error(`AMap plugin loader is unavailable for ${pluginName}.`))

    return new Promise<void>((resolve, reject) => {
        function onPluginLoad() {
            if (hasAmapConstructor({ AMap, constructorName })) {
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
