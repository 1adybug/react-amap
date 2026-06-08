# wdp-react

## Setup

Install the dependencies:

```bash
pnpm install
```

## Get started

Build the library from the workspace root:

```bash
pnpm run build
```

Build the library in watch mode from the workspace root:

```bash
pnpm run dev
```

## Overlay batching

Overlay components batch scene creation, update, deletion, and pure visibility changes by default. Batch creation groups overlays that share the same WDP instance, overlay type, and `calculateCoordZ`; batch updates first use `Scene.Update` for overlays with the same type, updated `calculateCoordZ`, and changed payload, then fall back to `Scene.Updates` for the remaining overlays with the same updated `calculateCoordZ`; batch deletion can combine any overlay type under the same WDP instance. When only `bVisible` changes, overlays use `Scene.SetVisible`; by default they are grouped by the target visibility.

```tsx
;

;

;<Wdp url={url} order={order} disableBatchAdd disableBatchUpdate disableBatchRemove disableBatchSetVisible disableSetVisibleOnVisibleChange logBatchOperations>
    <Path {...pathProps} disableBatchAdd={false} disableBatchUpdate={false} />
    <Text3D {...textProps} disableBatchRemove disableBatchSetVisible={false} disableSetVisibleOnVisibleChange={false} />
</Wdp>
```

`disableBatchAdd`, `disableBatchUpdate`, `disableBatchRemove`, `disableBatchSetVisible`, and `disableSetVisibleOnVisibleChange` can be set on `Wdp` as defaults, or on an individual overlay to override the `Wdp` setting. Set `logBatchOperations` on `Wdp` to print the final batch API parameters before they are sent to WDP.
