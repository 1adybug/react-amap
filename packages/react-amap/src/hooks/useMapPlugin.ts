import { useEffect, useState } from "react"

import type { MapInstance, MapNamespace, MapPlugin } from "../components/Map"
import { hasMapConstructor, loadMapPlugin } from "../utils/mapPlugin"

/** 使用高德插件参数 */
export interface UseMapPluginParams {
    /** 地图实例 */
    map?: MapInstance | null
    /** 高德地图命名空间 */
    AMap?: MapNamespace | null
    /** 插件名称 */
    pluginName: MapPlugin
    /** 插件加载后应存在的构造器名称 */
    constructorName: string
}

export function useMapPlugin({ map, AMap, pluginName, constructorName }: UseMapPluginParams) {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        let disposed = false

        if (!map || !AMap) {
            setLoaded(false)
            return
        }

        if (hasMapConstructor({ AMap, constructorName })) {
            setLoaded(true)
            return
        }

        setLoaded(false)

        loadMapPlugin({
            map,
            AMap,
            pluginName,
            constructorName,
        })
            .then(() => {
                if (disposed) return

                setLoaded(true)
            })
            .catch(() => {
                if (disposed) return

                setLoaded(false)
            })

        return () => {
            disposed = true
        }
    }, [AMap, constructorName, map, pluginName])

    return loaded
}