import type { FC } from "react"

import { Amap, type AmapLngLat } from "@1adybug/react-amap"

/** 测试地图中心点 */
const AMAP_CENTER: AmapLngLat = [116.397428, 39.90923]

/** 测试地图缩放级别 */
const AMAP_ZOOM = 11

const App: FC = () => (
    <Amap
        className="w-full h-full"
        apiKey="27d61ee06a59bdd227f2d9bef90868db"
        center={AMAP_CENTER}
        zoom={AMAP_ZOOM}
        securityConfig={{
            securityJsCode: "59bea63970991239803d3c49951c951f",
        }}
    />
)

export default App
