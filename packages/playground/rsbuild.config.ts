import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"

// Docs: https://rsbuild.rs/config/
export default defineConfig({
    resolve: {
        // 工作区测试库包时强制 React 单例，避免 Hook 使用到另一份 React 实例。
        dedupe: ["react", "react-dom"],
    },
    plugins: [pluginReact()],
})
