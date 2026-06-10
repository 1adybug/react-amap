# @1adybug/react-amap

`@1adybug/react-amap` 是基于高德地图 JSAPI v2.0 的 React 19 声明式封装。它负责加载 JSAPI、创建地图实例，并把点标记、矢量图形、图层、控件、工具、服务等高德对象映射为 React 组件或 Hook。

组件的核心设计是：在组件挂载时创建对应的高德实例，在 props 变化时同步可更新参数，在组件卸载时自动移除或销毁实例。大部分组件既可以放在 `<Map>` 内通过上下文获取 `map` / `AMap`，也可以显式传入 `map` 与 `AMap`。

## 安装

```bash
pnpm add @1adybug/react-amap
```

这个包将 `react`、`react-dom` 与 `@types/react` 作为 peer dependencies，当前声明兼容 React 19。

## 快速开始

高德地图 JSAPI v2.0 需要安全密钥配置。推荐在生产环境使用 `serviceHost` 代理，避免在前端暴露 `securityJsCode`。

```tsx
import { type FC, useState } from "react"

import {
    Map,
    MapMarkerAnchor,
    MapPlugin,
    MapStatus,
    Marker,
    Scale,
    ToolBar,
} from "@1adybug/react-amap"

const App: FC = () => {
    const [status, setStatus] = useState(MapStatus.Idle)

    return (
        <div className="h-screen w-screen">
            <Map
                apiKey={import.meta.env.VITE_AMAP_KEY}
                securityConfig={{
                    securityJsCode: import.meta.env.VITE_AMAP_SECURITY_JS_CODE,
                }}
                center={[116.397428, 39.90923]}
                zoom={12}
                plugins={[MapPlugin.Scale, MapPlugin.ToolBar]}
                onStatusChange={setStatus}
                onMapClick={event => console.log("map click", event)}
            >
                <Scale />
                <ToolBar position="RT" />
                <Marker
                    position={[116.397428, 39.90923]}
                    title="天安门"
                    anchor={MapMarkerAnchor.底部居中}
                    onClick={event => console.log("marker click", event)}
                />
            </Map>
            <span hidden={status === MapStatus.Loaded}>地图加载中</span>
        </div>
    )
}

export default App
```

## 通用规则

### 安全密钥

`Map` 在加载 JSAPI 前会合并 `window._AMapSecurityConfig` 与 `securityConfig`。如果既没有 `securityJsCode`，也没有 `serviceHost`，组件会进入 `MapStatus.Error` 并通过 `onMapError` 抛出错误。

```tsx
<Map
    apiKey={apiKey}
    securityConfig={{
        securityJsCode,
        serviceHost: "https://example.com/_AMapService",
    }}
/>
```

### 容器尺寸

`Map` 的根容器默认是 `position: relative; width: 100%; height: 100%`。外层容器必须有明确宽高，否则地图可能不可见。

```tsx
<div className="h-screen w-screen">
    <Map apiKey={apiKey} securityConfig={{ securityJsCode }} />
</div>
```

### 参数合并

多数组件都支持两类参数：

- 顶层 props：例如 `<Marker position={...} visible />`。
- `xxxOptions`：例如 `<Marker markerOptions={{ position: ... }} />`。

当同一个字段同时出现在两处时，顶层 props 优先级更高。未显式传入的字段不会覆盖 `xxxOptions` 中的值。

### 事件

组件支持两种事件写法：

```tsx
<Marker
    onClick={event => console.log(event)}
    events={{
        dragend: event => console.log(event),
    }}
/>
```

覆盖物、图层、控件、工具和服务通用快捷事件包括：

`onClick`、`onDblClick`、`onRightClick`、`onMouseDown`、`onMouseUp`、`onMouseMove`、`onMouseOver`、`onMouseOut`、`onTouchStart`、`onTouchMove`、`onTouchEnd`、`onDragStart`、`onDragging`、`onDragEnd`、`onMoving`、`onMoveEnd`、`onZoomStart`、`onZoomChange`、`onZoomEnd`、`onRotateStart`、`onRotateChange`、`onRotateEnd`、`onComplete`、`onOpen`、`onClose`、`onChange`、`onEnd`。

`Map` 的地图事件使用 `onMap` 前缀，例如 `onMapClick`、`onMapMoveEnd`、`onMapZoomChange`。也可以使用 `events={{ click: ... }}` 绑定原始高德事件名。

### 生命周期

多数实例组件支持：

- `ref`：获取底层高德实例，卸载后会置为 `null`。
- `onLoad(instance)`：实例创建完成后触发。
- `onDestroy(instance)`：实例销毁或移除前触发。

```tsx
const markerRef = useRef<MapMarkerInstance | null>(null)

<Marker
    ref={markerRef}
    position={[116.39, 39.9]}
    onLoad={marker => marker.setTitle?.("已创建")}
/>
```

### 插件加载

`Map` 的 `plugins` 可预加载插件。需要插件的组件也会在创建前尝试按需加载对应插件。

```tsx
<Map
    apiKey={apiKey}
    securityConfig={{ securityJsCode }}
    plugins={[MapPlugin.Scale, MapPlugin.MouseTool, MapPlugin.Geocoder]}
/>
```

## Map

`Map` 是地图根组件，负责加载 JSAPI、配置安全策略、创建 `AMap.Map`，并通过 `MapContext` 向子组件提供 `map` 与 `AMap`。

常用 props：

| prop | 说明 |
| --- | --- |
| `apiKey` | 高德 Web 端开发者 Key，必填 |
| `securityConfig` | `{ securityJsCode?: string; serviceHost?: string }` |
| `version` | JSAPI 版本，默认 `"2.0"` |
| `plugins` | 预加载插件列表，使用 `MapPlugin` |
| `loaderUrl` | Loader 脚本地址，默认高德官方 `loader.js` |
| `loaderOptions` | 传给 Loader 的额外配置，不允许覆盖 `key`、`version`、`plugins`、`serviceHost` |
| `loaderTimeout` | 自定义 Loader 脚本加载超时，默认 `15000` ms |
| `appName` | 写入 `AMap.getConfig().appname`，默认 `"react-amap"` |
| `mapOptions` | 额外 `AMap.Map` 初始化参数 |
| `events` | 地图原始事件映射 |
| `onMapLoad` | 地图创建完成回调，参数为 `(map, AMap)` |
| `onMapError` | 地图加载失败回调 |
| `onDestroy` | 地图销毁前回调 |
| `onStatusChange` | 加载状态变化回调 |

地图参数可以直接作为顶层 props 传入：

```tsx
<Map
    apiKey={apiKey}
    securityConfig={{ securityJsCode }}
    center={[116.39, 39.9]}
    zoom={11}
    rotation={0}
    pitch={45}
    viewMode="3D"
    mapStyle="amap://styles/normal"
    dragEnable
    scrollWheel
/>
```

以下运行时参数变化后会同步到地图实例：`center`、`zoom`、`rotation`、`pitch`、`features`、`layers`、`zooms`、`dragEnable`、`zoomEnable`、`jogEnable`、`pitchEnable`、`rotateEnable`、`animateEnable`、`keyboardEnable`、`doubleClickZoom`、`scrollWheel`、`touchZoom`、`touchZoomCenter`、`defaultCursor`、`mapStyle`。

以下初始化参数变化会重建地图：`apiKey`、`version`、`plugins`、`loaderUrl`、`loaderOptions`、`loaderTimeout`、`securityConfig`、`viewMode`、`showLabel`、`isHotspot`、`showBuildingBlock`、`showIndoorMap`、`skyColor`、`WebGLParams`、`mapOptions`。

## Marker

`Marker` 创建 `AMap.Marker`。适合少量可交互点标记，并支持 React 子节点作为自定义内容。

常用 props：

| prop | 说明 |
| --- | --- |
| `position` | 标记坐标 |
| `icon` | 图片地址或 `AMap.Icon` |
| `content` | 字符串或 `HTMLElement` 内容 |
| `children` | React 自定义内容，会通过 portal 渲染到 Marker 内容容器 |
| `contentClassName` / `contentStyle` | React 自定义内容容器样式 |
| `title` | 鼠标悬停文字 |
| `visible` | 是否可见 |
| `zIndex` | 叠加层级 |
| `offset` | 偏移量 |
| `anchor` | 锚点，可用 `MapMarkerAnchor` |
| `angle` | 旋转角度 |
| `clickable` / `draggable` | 是否可点击 / 拖拽 |
| `label` | 文本标注，`direction` 可用 `MapMarkerLabelDirection` |
| `markerOptions` | 额外 Marker 构造参数 |

```tsx
<Marker
    position={[116.397428, 39.90923]}
    title="天安门"
    label={{
        content: "天安门",
        direction: "top",
        offset: [0, -6],
    }}
    draggable
    onDragEnd={event => console.log(event)}
/>
```

自定义内容：

```tsx
<Marker position={[116.397428, 39.90923]} contentClassName="rounded bg-white px-2 py-1 shadow">
    <span>自定义 Marker</span>
</Marker>
```

## Point 组件

### Text

`Text` 创建 `AMap.Text` 文本标记。

```tsx
<Text
    position={[116.397428, 39.90923]}
    text="文本标记"
    anchor={MapMarkerAnchor.底部居中}
    style={{
        color: "#1677ff",
        backgroundColor: "#fff",
        border: "1px solid #1677ff",
        padding: "4px 8px",
    }}
/>
```

常用 props：`position`、`text`、`title`、`zIndex`、`offset`、`anchor`、`angle`、`clickable`、`draggable`、`bubble`、`zooms`、`cursor`、`topWhenClick`、`style`、`visible`、`textOptions`。

### ElasticMarker

`ElasticMarker` 创建 `AMap.ElasticMarker`，用于不同缩放级别下自动切换样式的灵活点标记。组件会按需加载 `MapPlugin.ElasticMarker`。

```tsx
<ElasticMarker
    position={[116.397428, 39.90923]}
    zoomStyleMapping={{
        10: 0,
        14: 1,
    }}
    styles={[
        {
            icon: {
                img: "/marker-small.png",
                size: [24, 24],
            },
        },
        {
            icon: {
                img: "/marker-large.png",
                size: [40, 40],
            },
            label: {
                content: "重点点位",
                position: MapElasticMarkerLabelPosition.顶部居中,
            },
        },
    ]}
/>
```

常用 props：`position`、`zIndex`、`offset`、`clickable`、`draggable`、`bubble`、`cursor`、`topWhenClick`、`zoomStyleMapping`、`styles`、`visible`、`elasticMarkerOptions`。

### LabelsLayer 与 LabelMarker

`LabelsLayer` 创建 `AMap.LabelsLayer`，`LabelMarker` 创建 `AMap.LabelMarker`。`LabelMarker` 必须添加到标注图层中；放在 `LabelsLayer` 内时会自动读取上下文。

```tsx
<LabelsLayer collision allowCollision={false} zIndex={120}>
    <LabelMarker
        name="poi-1"
        position={[116.397428, 39.90923]}
        icon={{
            image: "/poi.png",
            size: [24, 24],
            anchor: "bottom-center",
        }}
        text={{
            content: "POI",
            direction: "right",
            style: {
                fontSize: 12,
                fillColor: "#111",
                backgroundColor: "#fff",
            },
        }}
    />
</LabelsLayer>
```

`LabelsLayer` 常用 props：`zooms`、`zIndex`、`visible`、`collision`、`allowCollision`、`animation`、`labelsLayerOptions`。

`LabelMarker` 常用 props：`name`、`position`、`zooms`、`opacity`、`rank`、`zIndex`、`visible`、`extData`、`icon`、`text`、`labelMarkerOptions`。

### MassMarks

`MassMarks` 创建 `AMap.MassMarks`，适合海量点展示。

```tsx
<MassMarks
    data={[
        { lnglat: [116.39, 39.9], name: "点位 1" },
        { lnglat: [116.4, 39.91], style: 1, name: "点位 2" },
    ]}
    style={[
        {
            url: "/mass-1.png",
            size: [16, 16],
            anchor: [8, 8],
        },
        {
            url: "/mass-2.png",
            size: [20, 20],
            anchor: [10, 10],
        },
    ]}
    opacity={0.9}
/>
```

常用 props：`data`、`style`、`opacity`、`zIndex`、`zooms`、`cursor`、`visible`、`massMarksOptions`。

### MarkerCluster

`MarkerCluster` 创建 `AMap.MarkerCluster`，组件会按需加载 `MapPlugin.MarkerCluster`。

```tsx
<MarkerCluster
    data={[
        { lnglat: [116.39, 39.9], weight: 1 },
        { lnglat: [116.4, 39.91], weight: 2 },
    ]}
    gridSize={80}
    maxZoom={16}
    averageCenter
/>
```

常用 props：`data`、`gridSize`、`maxZoom`、`averageCenter`、`clusterByZoomChange`、`styles`、`renderClusterMarker`、`renderMarker`、`markerClusterOptions`。

## 矢量覆盖物

矢量组件会创建对应的 `AMap.Polygon`、`AMap.Polyline` 等实例并添加到地图。

通用样式 props：`visible`、`zIndex`、`bubble`、`cursor`、`strokeColor`、`strokeOpacity`、`strokeWeight`、`strokeStyle`、`strokeDasharray`、`draggable`、`extData`。

面状组件还支持：`fillColor`、`fillOpacity`。

线状组件还支持：`isOutline`、`outlineColor`、`borderWeight`、`lineJoin`、`lineCap`、`geodesic`、`showDir`、`animate`、`speed`。

### Polygon

```tsx
<Polygon
    path={[
        [116.39, 39.9],
        [116.41, 39.9],
        [116.41, 39.92],
        [116.39, 39.92],
    ]}
    fillColor="#1677ff"
    fillOpacity={0.25}
    strokeColor="#1677ff"
    polygonOptions={{
        extrusionHeight: 200,
    }}
/>
```

常用 props：`path`、`extrusionHeight`、`wallColor`、`roofColor`、`polygonOptions`。

### Polyline

```tsx
<Polyline
    path={[
        [116.39, 39.9],
        [116.4, 39.91],
        [116.42, 39.92],
    ]}
    strokeColor="#52c41a"
    strokeWeight={6}
    showDir
/>
```

常用 props：`path`、`polylineOptions`。

### BezierCurve 与 BesizerCurve

`BezierCurve` 创建 `AMap.BezierCurve`。`BesizerCurve` 是兼容拼写别名，功能相同。

```tsx
<BezierCurve
    path={[
        [116.39, 39.9],
        [116.4, 39.95, 116.42, 39.92],
    ]}
    strokeColor="#fa8c16"
    strokeWeight={4}
/>
```

常用 props：`path`、`bezierCurveOptions`。

### Circle

```tsx
<Circle
    center={[116.397428, 39.90923]}
    radius={1000}
    fillColor="#1677ff"
    fillOpacity={0.2}
    strokeColor="#1677ff"
/>
```

常用 props：`center`、`radius`、`circleOptions`。

### CircleMarker

```tsx
<CircleMarker center={[116.397428, 39.90923]} radius={8} fillColor="#f5222d" />
```

`CircleMarker` 的 `radius` 单位是像素。常用 props：`center`、`radius`、`circleMarkerOptions`。

### Ellipse

```tsx
<Ellipse
    center={[116.397428, 39.90923]}
    radius={[1200, 600]}
    fillColor="#722ed1"
    fillOpacity={0.2}
/>
```

常用 props：`center`、`radius`、`ellipseOptions`。

### Rectangle

```tsx
<Rectangle bounds={bounds} fillColor="#13c2c2" fillOpacity={0.2} />
```

`bounds` 可传入高德 `Bounds` 实例或 JSAPI 支持的 bounds-like 数据。常用 props：`bounds`、`rectangleOptions`。

### GeoJSON

```tsx
<GeoJSON
    geoJSON={geoJSON}
    getMarker={(feature, lnglat) => new AMap.Marker({ position: lnglat })}
    getPolyline={(feature, path) => new AMap.Polyline({ path })}
    getPolygon={(feature, path) => new AMap.Polygon({ path })}
/>
```

常用 props：`geoJSON`、`getMarker`、`getPolyline`、`getPolygon`、`geoJSONOptions`。

## 图层

图层组件通用 props：`visible`、`opacity`、`zIndex`、`zooms`、`layerOptions`、`events`、`onLoad`、`onDestroy`。

### 基础瓦片图层

```tsx
<TileLayer opacity={0.8} />
<TrafficLayer autoRefresh interval={180} />
<SatelliteLayer />
<RoadNetLayer />
```

`TileLayer`、`SatelliteLayer`、`RoadNetLayer` 常用 props：`tileUrl`、`dataZooms`、`tileSize`。

`TrafficLayer` 额外支持：`autoRefresh`、`interval`。

### WMSLayer 与 WMTSLayer

```tsx
<WMSLayer
    url="https://example.com/wms"
    params={{
        layers: "demo",
        format: "image/png",
        transparent: true,
    }}
/>

<WMTSLayer
    url="https://example.com/wmts"
    params={{
        layer: "demo",
        tileMatrixSet: "c",
    }}
/>
```

常用 props：`url`、`params`、`tileSize`、`zooms`、`opacity`。

### MapboxVectorTileLayer

```tsx
<MapboxVectorTileLayer
    url="https://example.com/{z}/{x}/{y}.mvt"
    styles={{
        polygon: { fillColor: "#1677ff" },
        line: { strokeColor: "#52c41a" },
        point: { radius: 4 },
    }}
/>
```

常用 props：`url`、`styles`。

### BuildingsLayer

```tsx
<BuildingsLayer
    wallColor="#d9d9d9"
    roofColor="#ffffff"
    heightFactor={1}
    styleOpts={{
        hideWithoutStyle: false,
    }}
/>
```

常用 props：`wallColor`、`roofColor`、`heightFactor`、`styleOpts`。

### DistrictLayer 系列

```tsx
<DistrictLayerProvince
    adcode="110000"
    depth={1}
    styles={{
        fill: "#1677ff22",
        stroke: "#1677ff",
    }}
/>
```

导出组件：`DistrictLayer`、`DistrictLayerWorld`、`DistrictLayerCountry`、`DistrictLayerProvince`。

常用 props：`adcode`、`SOC`、`depth`、`styles`。

### IndoorMap

```tsx
<IndoorMap
    indoorid="B000A8VT15"
    floor={1}
    floorBarVisible
    labelsVisible
/>
```

常用 props：`cursor`、`hideFloorBar`、`indoorid`、`floor`、`shopid`、`floorBarVisible`、`labelsVisible`。

### FlexibleLayer

```tsx
<FlexibleLayer
    cacheSize={128}
    createTile={(x, y, z, success, fail) => {
        const image = new Image()
        image.onload = () => success(image)
        image.onerror = fail
        image.src = `https://example.com/tiles/${z}/${x}/${y}.png`
    }}
/>
```

常用 props：`cacheSize`、`createTile`、`tileSize`、`dataZooms`。

### ImageLayer

```tsx
<ImageLayer url="/overlay.png" bounds={bounds} opacity={0.7} />
```

常用 props：`url`、`bounds`。

### CanvasLayer

```tsx
<CanvasLayer canvas={canvasElement} bounds={bounds} />
```

常用 props：`canvas`、`bounds`。

### CustomLayer 与 GLCustomLayer

```tsx
<CustomLayer
    canvas={canvasElement}
    render={() => {
        const context = canvasElement.getContext("2d")
        context?.clearRect(0, 0, canvasElement.width, canvasElement.height)
    }}
/>

<GLCustomLayer zIndex={30} />
```

`CustomLayer` 常用 props：`canvas`、`render`。`GLCustomLayer` 透传 JSAPI 支持的自定义图层参数。

### VectorLayer

`VectorLayer` 创建 `AMap.VectorLayer`，用于承载矢量覆盖物。

```tsx
<VectorLayer zIndex={20}>
    <Polygon path={path} strokeColor="#1677ff" fillColor="#1677ff" fillOpacity={0.2} />
</VectorLayer>
```

### HeatMap

`HeatMap` 创建 `AMap.HeatMap`，组件会按需加载 `MapPlugin.HeatMap`。

```tsx
<HeatMap
    radius={25}
    gradient={{
        0.4: "blue",
        0.65: "lime",
        1: "red",
    }}
    dataSet={{
        max: 100,
        data: [
            { lng: 116.39, lat: 39.9, count: 80 },
            { lng: 116.4, lat: 39.91, count: 40 },
        ],
    }}
/>
```

常用 props：`dataSet`、`radius`、`gradient`、`heatMapOptions`。

## 控件

控件组件会创建对应插件并调用 `map.addControl`。通用 props：`position`、`offset`、`visible`、`controlOptions`、`events`、`onLoad`、`onDestroy`。

`position` 可使用 `ControlPosition`：

```tsx
<Scale position={ControlPosition.左下角} />
<ToolBar position={ControlPosition.右上角} />
<ControlBar position="RT" showControlButton />
<MapType position="RT" defaultType={MapTypeDefaultType.卫星图} showTraffic showRoad />
<HawkEye position="RB" opened width="180px" height="120px" />
```

组件说明：

- `Scale`：比例尺控件，需要 `MapPlugin.Scale`。
- `ToolBar`：缩放工具条，需要 `MapPlugin.ToolBar`。
- `ControlBar`：3D 旋转 / 俯仰组合控件，需要 `MapPlugin.ControlBar`。
- `MapType`：图层切换控件，需要 `MapPlugin.MapType`，支持 `defaultType`、`showTraffic`、`showRoad`。
- `HawkEye`：鹰眼控件，需要 `MapPlugin.HawkEye`，支持 `autoMove`、`showRectangle`、`showButton`、`opened`、`mapStyle`、`layers`、`width`、`height`。

## 信息窗体与右键菜单

### InfoWindow

`InfoWindow` 创建 `AMap.InfoWindow`。默认 `active=true`，当传入 `position` 时会自动打开；`active=false` 时关闭。

```tsx
<InfoWindow position={[116.397428, 39.90923]} offset={[0, -24]}>
    <div className="rounded bg-white p-2 shadow">信息窗体内容</div>
</InfoWindow>
```

常用 props：`active`、`height`、`position`、`content`、`children`、`contentClassName`、`contentStyle`、`isCustom`、`autoMove`、`avoid`、`closeWhenClickMap`、`size`、`anchor`、`offset`、`extData`、`infoWindowOptions`。

### ContextMenu

`ContextMenu` 创建 `AMap.ContextMenu`。默认 `active=false`，当 `active=true` 且有 `position` 时打开。

```tsx
<ContextMenu
    active={menuOpen}
    position={menuPosition}
    items={[
        {
            text: "放大一级",
            onClick: () => mapRef.current?.zoomIn?.(),
        },
        {
            text: "缩小一级",
            onClick: () => mapRef.current?.zoomOut?.(),
        },
    ]}
/>
```

常用 props：`active`、`position`、`content`、`children`、`contentClassName`、`contentStyle`、`items`、`contextMenuOptions`。

## 群组

### OverlayGroup

`OverlayGroup` 创建 `AMap.OverlayGroup`，用于统一管理覆盖物。

```tsx
<OverlayGroup visible opacity={0.8}>
    <Marker position={[116.397428, 39.90923]} title="天安门" />
    <Circle center={[116.397428, 39.90923]} radius={500} />
</OverlayGroup>
```

常用 props：`children`、`visible`、`opacity`、`zIndex`、`zooms`。

### LayerGroup

`LayerGroup` 创建 `AMap.LayerGroup`，用于统一管理图层。

```tsx
<LayerGroup visible>
    <SatelliteLayer />
    <RoadNetLayer />
</LayerGroup>
```

常用 props：`children`、`visible`、`opacity`、`zIndex`、`zooms`。

## MouseTool

`MouseTool` 创建 `AMap.MouseTool`，组件会按需加载 `MapPlugin.MouseTool`。通过 `mode` 指定绘制或量测模式，通过 `active` 控制是否开启。

```tsx
<MouseTool
    mode={MapMouseToolMode.Polygon}
    active={drawing}
    polygonOptions={{
        fillColor: "#1677ff",
        fillOpacity: 0.2,
        strokeColor: "#1677ff",
    }}
    clearOnModeChange
    onDraw={event => console.log("绘制完成", event)}
/>
```

可用模式：

- `MapMouseToolMode.Marker`：绘制点标记。
- `MapMouseToolMode.Circle`：绘制圆。
- `MapMouseToolMode.Rectangle`：绘制矩形。
- `MapMouseToolMode.Polyline`：绘制折线。
- `MapMouseToolMode.Polygon`：绘制多边形。
- `MapMouseToolMode.MeasureArea`：面积量测。
- `MapMouseToolMode.Rule`：距离量测。
- `MapMouseToolMode.RectZoomIn`：拉框放大。
- `MapMouseToolMode.RectZoomOut`：拉框缩小。

常用 props：`mode`、`active`、`options`、`markerOptions`、`circleOptions`、`rectangleOptions`、`polylineOptions`、`polygonOptions`、`measureAreaOptions`、`ruleOptions`、`rectZoomInOptions`、`rectZoomOutOptions`、`clearOnClose`、`clearOnModeChange`、`onDraw`。

## RangingTool

`RangingTool` 创建 `AMap.RangingTool`，组件会按需加载 `MapPlugin.RangingTool`。

```tsx
<RangingTool
    active={measuring}
    removeOverlaysOnTurnOff
    lineOptions={{
        strokeColor: "#1677ff",
        strokeWeight: 4,
    }}
    endLabelText="总距离"
/>
```

常用 props：`active`、`removeOverlaysOnTurnOff`、`startMarkerOptions`、`midMarkerOptions`、`endMarkerOptions`、`lineOptions`、`tmpLineOptions`、`startLabelText`、`midLabelText`、`endLabelText`、`startLabelOffset`、`midLabelOffset`、`endLabelOffset`、`rangingToolOptions`。

## 矢量编辑器

编辑器组件会按需加载对应插件，创建编辑器实例，并通过 `target` 指定要编辑的矢量覆盖物。`active` 默认 `true`，为 `false` 时关闭编辑。

基础示例：

```tsx
const [polygon, setPolygon] = useState<MapPolygonInstance | null>(null)

<Polygon
    ref={setPolygon}
    path={[
        [116.39, 39.9],
        [116.41, 39.9],
        [116.41, 39.92],
    ]}
/>
<PolygonEditor
    target={polygon}
    active={editing}
    onEnd={() => console.log("编辑结束")}
/>
```

通用 props：`target`、`active`、`createOptions`、`editOptions`、`editorOptions`、`events`、`onLoad`、`onDestroy`。

组件说明：

- `PolygonEditor`：编辑 `Polygon`，支持 `controlPoint`、`midControlPoint`，实例额外支持吸附多边形相关方法。
- `PolylineEditor`：编辑 `Polyline`，支持 `controlPoint`、`midControlPoint`。
- `PolyEditor`：通用多边形 / 折线编辑器，`target` 可为 `Polygon` 或 `Polyline`。
- `CircleEditor`：编辑 `Circle`，支持 `movePoint`、`resizePoint`。
- `BezierCurveEditor`：编辑 `BezierCurve`，支持 `controlPoint`、`midControlPoint`、`bezierControlPoint`、`bezierControlLine`。
- `EllipseEditor`：编辑 `Ellipse`，支持 `movePoint`、`resizeXPoint`、`resizeYPoint`。
- `RectangleEditor`：编辑 `Rectangle`，支持 `southWestPoint`、`northEastPoint`。

## 服务组件与 Hook

服务组件不会渲染 DOM，也不会直接显示内容。它们负责加载 JSAPI 服务插件、创建服务实例，并通过 `ref`、`onLoad` 或对应 Hook 暴露实例。

服务通用 props：

| prop | 说明 |
| --- | --- |
| `map` / `AMap` | 显式传入地图实例与命名空间，不传时读取 `MapContext` |
| `enabled` | 是否创建服务，默认 `true` |
| `events` | 服务事件映射 |
| `ref` | 服务实例 ref |
| `onLoad` / `onDestroy` | 创建完成 / 销毁前回调 |

服务组件和 Hook 一一对应：

| 组件 | Hook | 插件 | 常用实例方法 |
| --- | --- | --- | --- |
| `Geocoder` | `useGeocoder` | `MapPlugin.Geocoder` | `getLocation`、`getAddress`、`setCity` |
| `AutoComplete` | `useAutoComplete` | `MapPlugin.AutoComplete` | `search`、`setType`、`setCity`、`setCityLimit` |
| `PlaceSearch` | `usePlaceSearch` | `MapPlugin.PlaceSearch` | `search`、`searchInBounds`、`searchNearBy`、`getDetails` |
| `CloudDataSearch` | `useCloudDataSearch` | `MapPlugin.CloudDataSearch` | `searchNearBy`、`searchById`、`searchByDistrict`、`searchInPolygon` |
| `Driving` | `useDriving` | `MapPlugin.Driving` | `search`、`setPolicy`、`setAvoidPolygons` |
| `TruckDriving` | `useTruckDriving` | `MapPlugin.TruckDriving` | `search`、`setPolicy`、`setProvinceAndNumber` |
| `Walking` | `useWalking` | `MapPlugin.Walking` | `search` |
| `Transfer` | `useTransfer` | `MapPlugin.Transfer` | `search`、`leaveAt`、`setCity`、`setCityd` |
| `Riding` | `useRiding` | `MapPlugin.Riding` | `search` |
| `DragRoute` | `useDragRoute` | `MapPlugin.DragRoute` | `search`、`getWays`、`getRoute` |
| `DragRouteTruck` | `useDragRouteTruck` | `MapPlugin.DragRouteTruck` | `search`、`updatePath`、`getWays`、`getRoute` |
| `GraspRoad` | `useGraspRoad` | `MapPlugin.GraspRoad` | `driving` |
| `DistrictSearch` | `useDistrictSearch` | `MapPlugin.DistrictSearch` | `search`、`setLevel`、`setSubdistrict` |
| `Weather` | `useWeather` | `MapPlugin.Weather` | `getLive`、`getForecast` |
| `StationSearch` | `useStationSearch` | `MapPlugin.StationSearch` | `search`、`setCity`、`setPageIndex`、`setPageSize` |
| `LineSearch` | `useLineSearch` | `MapPlugin.LineSearch` | `search`、`setCity`、`setPageIndex`、`setPageSize` |
| `Geolocation` | `useGeolocation` | `MapPlugin.Geolocation` | `getCurrentPosition`、`getCityInfo`、`addTo`、`removeFrom` |
| `CitySearch` | `useCitySearch` | `MapPlugin.CitySearch` | `getLocalCity`、`getCityByIp` |

### Geocoder

```tsx
<Geocoder
    city="北京"
    extensions={MapServiceExtensions.详细信息}
    onLoad={geocoder => {
        geocoder.getLocation?.("北京市朝阳区", (status, result) => {
            console.log(status, result)
        })
    }}
/>
```

Hook 写法：

```tsx
const geocoder = useGeocoder({
    city: "北京",
})

function onSearchAddress() {
    geocoder?.getLocation?.("北京市朝阳区", (status, result) => {
        console.log(status, result)
    })
}
```

常用 props：`city`、`radius`、`lang`、`batch`、`extensions`、`geocoderOptions`。

### AutoComplete

```tsx
<AutoComplete
    input="keyword"
    city="北京"
    datatype={MapAutoCompleteDataType.POI}
    citylimit
    onLoad={autoComplete => {
        autoComplete.search?.("咖啡", (status, result) => console.log(status, result))
    }}
/>
```

常用 props：`type`、`city`、`datatype`、`citylimit`、`input`、`output`、`outPutDirAuto`、`closeResultOnScroll`、`lang`、`autoCompleteOptions`。

### PlaceSearch

```tsx
<PlaceSearch
    city="北京"
    type="餐饮服务"
    pageSize={10}
    autoFitView
    onLoad={placeSearch => {
        placeSearch.search?.("咖啡", (status, result) => console.log(status, result))
    }}
/>
```

常用 props：`city`、`type`、`pageSize`、`pageIndex`、`extensions`、`panel`、`citylimit`、`autoFitView`、`placeSearchOptions`。

当传入 `map` 或放在 `Map` 内时，`PlaceSearch` 会把当前地图写入构造参数，除非你已经在 options 中显式设置 `map`。

### CloudDataSearch

`CloudDataSearch` 需要必填 `tableId`。

```tsx
<CloudDataSearch
    tableId="your-table-id"
    keywords="门店"
    pageSize={20}
    onLoad={service => {
        service.searchNearBy?.([116.39, 39.9], 1000, (status, result) => {
            console.log(status, result)
        })
    }}
/>
```

常用 props：`tableId`、`keywords`、`filter`、`orderBy`、`pageSize`、`pageIndex`、`panel`、`autoFitView`、`cloudDataSearchOptions`。

### 路线规划服务

`Driving`、`TruckDriving`、`Walking`、`Transfer`、`Riding` 都通过实例的 `search` 发起路线规划。

```tsx
<Driving
    policy={0}
    showTraffic
    autoFitView
    onLoad={driving => {
        driving.search?.([116.39, 39.9], [116.45, 39.95], (status, result) => {
            console.log(status, result)
        })
    }}
/>
```

通用路线 props：`policy`、`extensions`、`panel`、`hideMarkers`、`showTraffic`、`province`、`number`、`isOutline`、`outlineColor`、`autoFitView`。

额外 props：

- `Driving`：`ferry`、`drivingOptions`。
- `TruckDriving`：`size`、`width`、`height`、`load`、`weight`、`axlesNum`、`truckDrivingOptions`。
- `Transfer`：`city`、`cityd`、`transferOptions`。
- `Walking`：`walkingOptions`。
- `Riding`：`ridingOptions`。

### DragRoute 与 DragRouteTruck

`DragRoute` 需要路线 `path`。`autoSearch` 默认 `true`，创建后会立即执行 `search`。

```tsx
<DragRoute
    path={[
        [116.39, 39.9],
        [116.45, 39.95],
    ]}
    policy={0}
    autoSearch
/>
```

`DragRouteTruck` 使用 `locations`：

```tsx
<DragRouteTruck
    locations={[
        { lnglat: [116.39, 39.9] },
        { lnglat: [116.45, 39.95] },
    ]}
    cartype={1}
    autoSearch
/>
```

`DragRoute` 常用 props：`path`、`policy`、`autoSearch`、`polyOption`、`startMarkerOptions`、`midMarkerOptions`、`endMarkerOptions`、`showTraffic`、`dragRouteOptions`。

`DragRouteTruck` 常用 props：`locations`、`autoSearch`、`cartype`、`showpolyline`、`nosteps`、`autoRefresh`、`refreshTime`、`apiVersion`、`showFields`、`dragRouteTruckOptions`。

### GraspRoad

```tsx
<GraspRoad
    onLoad={graspRoad => {
        graspRoad.driving?.(
            [
                { x: 116.39, y: 39.9, sp: 30, ag: 90, tm: Date.now() },
                { x: 116.4, y: 39.91, sp: 28, ag: 95, tm: Date.now() + 1000 },
            ],
            (status, result) => console.log(status, result)
        )
    }}
/>
```

### DistrictSearch

```tsx
<DistrictSearch
    level={MapDistrictSearchLevel.市}
    subdistrict={1}
    extensions={MapServiceExtensions.详细信息}
    onLoad={districtSearch => {
        districtSearch.search?.("北京市", (status, result) => console.log(status, result))
    }}
/>
```

常用 props：`level`、`showbiz`、`extensions`、`subdistrict`、`districtSearchOptions`。

### Weather

```tsx
<Weather
    onLoad={weather => {
        weather.getLive?.("北京市", (error, result) => console.log(error, result))
        weather.getForecast?.("北京市", (error, result) => console.log(error, result))
    }}
/>
```

### StationSearch 与 LineSearch

```tsx
<StationSearch
    city="北京"
    pageSize={10}
    onLoad={stationSearch => {
        stationSearch.search?.("中关村", (status, result) => console.log(status, result))
    }}
/>

<LineSearch
    city="北京"
    onLoad={lineSearch => {
        lineSearch.search?.("1路", (status, result) => console.log(status, result))
    }}
/>
```

常用 props：`pageIndex`、`pageSize`、`city`、`extensions`、`stationSearchOptions`、`lineSearchOptions`。

### Geolocation

`Geolocation` 默认 `addControl=true`，创建后会添加到当前地图控件中；卸载时自动移除。

```tsx
<Geolocation
    position={ControlPosition.右下角}
    enableHighAccuracy
    timeout={10000}
    showMarker
    showCircle
    panToLocation
    zoomToAccuracy
    onLoad={geolocation => {
        geolocation.getCurrentPosition?.((status, result) => console.log(status, result))
    }}
/>
```

常用 props：`addControl`、`position`、`offset`、`convert`、`enableHighAccuracy`、`timeout`、`maximumAge`、`showButton`、`showCircle`、`showMarker`、`markerOptions`、`circleOptions`、`panToLocation`、`zoomToAccuracy`、`GeoLocationFirst`、`noIpLocate`、`noGeoLocation`、`useNative`、`getCityWhenFail`、`needAddress`、`extensions`、`geolocationOptions`。

### CitySearch

```tsx
<CitySearch
    onLoad={citySearch => {
        citySearch.getLocalCity?.((status, result) => console.log(status, result))
    }}
/>
```

常用实例方法：`getLocalCity`、`getCityByIp`。

### WebService

`WebService` 暴露 `AMap.WebService` 静态对象。

```tsx
<WebService
    onLoad={webService => {
        webService.get?.(
            "/v3/place/text",
            {
                keywords: "咖啡",
                city: "北京",
            },
            (status, result) => console.log(status, result)
        )
    }}
/>
```

也可以使用 `useMapWebService`。

### 坐标转换与移动动画

`useMapConvertFrom` 返回坐标转换函数，底层调用 `AMap.convertFrom`。

```tsx
const convertFrom = useMapConvertFrom()

function onConvert() {
    convertFrom?.({
        lnglat: [116.39, 39.9],
        type: MapCoordinateConvertType.GPS,
        callback: (status, result) => console.log(status, result),
    })
}
```

`useMapMoveAnimation` 会加载 `MapPlugin.MoveAnimation`，返回布尔值表示插件是否可用。

```tsx
const moveAnimationLoaded = useMapMoveAnimation()
```

## 基础类与通用工具 Hooks

### useMapContext

读取当前 `<Map>` 提供的上下文。

```tsx
const { map, AMap, status, error } = useMapContext()
```

### useMapFoundation

读取基础类构造器：`LngLat`、`Bounds`、`Pixel`、`Size`。

```tsx
const { LngLat, Bounds, Pixel, Size } = useMapFoundation()

const center = LngLat ? new LngLat(116.39, 39.9) : undefined
```

### useMapCommon

读取通用工具：`GeometryUtil`、`DomUtil`、`Browser`、`Util`。

```tsx
const geometryUtil = useMapGeometryUtil()
const distance = geometryUtil?.distance?.([116.39, 39.9], [116.4, 39.91])
```

可用 Hook：

- `useMapCommon`
- `useMapGeometryUtil`
- `useMapDomUtil`
- `useMapBrowser`
- `useMapUtil`

### useMapPlugin

手动加载插件。通常组件会自动按需加载，只有你需要直接使用插件构造器时才需要调用它。

```tsx
const loaded = useMapPlugin({
    map,
    AMap,
    pluginName: MapPlugin.MouseTool,
    constructorName: "MouseTool",
})
```

## 枚举常量

包内导出了常用常量，避免手写字符串：

- `MapViewMode`：`TwoDimensional`、`ThreeDimensional`。
- `MapStatus`：`Idle`、`Loading`、`Loaded`、`Error`。
- `MapPlugin`：所有可加载的 JSAPI 插件名。
- `MapMarkerAnchor`：Marker / 文本锚点。
- `MapMarkerLabelDirection`：文本标注方向。
- `MapElasticMarkerLabelPosition`：灵活点标记文本位置。
- `ControlPosition`：控件停靠位置。
- `MapTypeLayerType`、`MapTypeDefaultType`：地图类型控件配置。
- `MapMouseToolMode`：鼠标工具模式。
- `MapServiceLanguage`、`MapServiceExtensions`、`MapAutoCompleteDataType`、`MapDistrictSearchLevel`、`MapGeolocationDisabledPolicy`、`MapCoordinateConvertType`：服务参数常量。

## SSR 注意事项

`Map` 只会在浏览器环境加载 JSAPI。如果当前环境没有 `window` 或 `document`，会进入错误状态。SSR 项目中应确保地图只在客户端渲染，或者在页面层做动态导入 / 客户端边界。

## 开发

在仓库根目录安装依赖：

```bash
pnpm install
```

构建：

```bash
pnpm --filter @1adybug/react-amap build
```

类型检查：

```bash
pnpm --filter @1adybug/react-amap exec tsc --noEmit
```

Lint：

```bash
pnpm --filter @1adybug/react-amap lint
```