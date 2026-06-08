import { type DependencyList, type EffectCallback, useEffect } from "react"
import { stableHash } from "stable-hash"

// 使用稳定 hash 比较依赖项，避免对象引用变化导致地图实例被重复初始化。
export function useStableEffect(effect: EffectCallback, deps: DependencyList): void {
    const hash = stableHash(deps)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(effect, [hash])
}
