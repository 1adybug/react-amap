import { useEffect, useState } from "react"

import type { AmapMapInstance, AmapNamespace } from "../components/Amap"
import { hasAmapConstructor, loadAmapPlugin } from "../utils/amapPlugin"

/** 使用高德插件参数 */
export interface UseAmapPluginParams {
    /** 地图实例 */
    map?: AmapMapInstance | null
    /** 高德地图命名空间 */
    AMap?: AmapNamespace | null
    /** 插件名称 */
    pluginName: string
    /** 插件加载后应存在的构造器名称 */
    constructorName: string
}

export function useAmapPlugin({ map, AMap, pluginName, constructorName }: UseAmapPluginParams) {
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        let disposed = false

        if (!map || !AMap) {
            setLoaded(false)
            return
        }

        if (hasAmapConstructor({ AMap, constructorName })) {
            setLoaded(true)
            return
        }

        setLoaded(false)

        loadAmapPlugin({
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
