# Agent Rules

## Base Rules

- 永远使用中文回复
- 禁止修改 `node_modules` 文件夹中的任何文件
- 当我让你修复一个问题，而你尝试一次或多次修复失败后，我会在每次失败修复后的问题现象再次反馈给你，在进行下一次修复之前，你必须思考之前所有的修复是否还有必要，是否需要先撤回之前的修复，然后再进行修复
- 在进行可能导致破坏性变更的修改前，例如删除功能、移除字段、改变 API 行为、修改数据结构、引入不兼容变更等，若我没有明确说明是否需要保持向后兼容，必须先向我确认兼容性要求，不能直接执行。
- 禁止未经允许启动项目的开发服务
- 对于 `Electron` 开发的应用，不要尝试在浏览器中加载和验证
- 尽量使用 `interface` 而不是 `type`，函数类型除外
- 所有的类型定义都使用 `export` 导出
- 禁止使用字面量类型，必须使用独立的类型定义，比如:

    ```typescript
    export interface Student {
        father: {
            name: string
            age: number
        }
    }
    ```

    你应该将 `Father` 类型独立出来，而不是使用字面量类型:

    ```typescript
    export interface Father {
        name: string
        age: number
    }

    export interface Student {
        father: Father
    }
    ```

- 尽量为代码添加注释，尽量使用 `//` 而不是 `/** */`
- 但是对于变量名、函数名、类型名、属性等具有明确意义的名称，使用 `/** 名称的作用 */` 进行注释
- 尽量使用 `const` 而不是 `let`，除非需要使用 `let` 的特性
- 尽量使用 `"` 而不是 `'`，除非是 `"` 中包含 `'`
- 尽量不要使用 `;` 进行结尾
- 尽量使用模板字符串而不是 `+` 进行字符串拼接
- 中文和英文之间加一个空格
- 不需要为类型文件单独生成一个 `types/index.ts` 文件，而是直接在需要使用的地方进行类型声明并且导出
- 当你使用 `@heroui/react` 组件库中的 `Button` 组件时，点击事件请使用 `onPress` 而不是 `onClick`
- 当你使用 `@tanstack/react-query` 的 `useQuery` 时，请使用函数名的烤肉串命名法和参数组成 `key`，例如 `queryKey: ["query-book", queryParams]`
- 函数的参数数量尽量控制在 2 个以内，如果超过 2 个，请使用对象形式的参数，参数类型名称使用函数名的大驼峰 + `Params` 后缀，例如 `QueryBookParams`
- 尽量直接从模块中导入方法，而不是使用 `默认导出.方法` 的形式

    ```typescript
    // 而不是使用 默认导出.方法 的形式
    import fs from "node:fs/promises"

    fs.readFile
    ```

- 如果某个方法存在同步和异步两种形式，你应该尽量使用异步形式，而不是同步形式，比如读取文件，你应该尽量使用 `fs/promises` 提供的 `readFile` 方法，而不是 `fs` 提供的 `readFileSync` 方法
- 在 `Node.js` 中，你应该尽量使用模块的 `Promise` 版本，而不是回调版本，比如读取文件，你应该尽量使用 `fs/promises` 提供的 `readFile` 方法，而不是 `fs` 提供的 `readFile` 方法
- 涉及到文件读写操作时，尽量使用 `fs` 提供的 `createReadStream` 或者 `createWriteStream` 的方式来实现，而不是一次性读取所有内容
- `Web API` 中的 `ReadableStream` 可以使用以下方法转换为 `Node.js` 中的 `Readable`:

    ```typescript
    import { Readable } from "node:stream"
    import { ReadableStream } from "node:stream/web"

    // 这里的 webStream 是 Web API 中的 ReadableStream
    const webStream = someWebApi()

    // 将 Web API 中的 ReadableStream 转换为 Node.js 中的 Readable
    const nodeStream = Readable.fromWeb(webStream as ReadableStream)
    ```

    `Web API` 中的 `WritableStream` 转换为 `Node.js` 中的 `Writable` 的方法同理

- `zod/v4` 就是 `zod` 在 `3.25` 及之后的 `v3` 版本中所提供的 `v4` 版本的 `zod`，如果当前项目的版本是 `3.25` 及之后的 `v3` 版本，你应该使用 `zod/v4` 而不是 `zod`，如果当前项目使用的就是 `zod/v4`，那你不需要检查 `zod` 的版本，保持一致，使用 `zod/v4` 即可
- 严格区分中英文标点符号，不要混用，如果用户混用了，你应该提示用户使用正确的标点符号
- 当使用网络请求时，请使用 `@/utils/request` 中的 `request` 方法，而不是使用 `fetch` 方法，`request` 方法与 `fetch` 的调用方法基本一致
- 当你需要进行包管理相关的操作时，比如安装、更新、卸载、执行 `package.json` 中的脚本或者 `npx` 执行某个命令时，请检查当前项目中的 `lock` 文件，如果是 `bun.lock`，你应该使用 `bun` 进行包管理，如果是 `package-lock.json`，你应该使用 `npm` 进行包管理，如果是 `yarn.lock`，你应该使用 `yarn` 进行包管理，如果是 `pnpm-lock.yaml`，你应该使用 `pnpm` 进行包管理，如果同时存在多个 `lock` 文件，优先级为 `bun` > `pnpm` > `yarn` > `npm`
- 请不要使用 `enum` 来声明枚举，而是使用以下方式声明：

    ```typescript
    export const Gender = {
        男: "male",
        女: "female",
    } as const

    export type Gender = (typeof Gender)[keyof typeof Gender]
    ```

- 在创建 `git` 提交记录，必须使用 `[type]: 具体内容` 的格式进行提交

    ```text
    feat: Select when creating new things
    fix: Select when fixing a bug
    docs: Select when editing documentation
    ...
    ```

    在 monorepo 中，必须使用 `[type](package): 具体内容` 的格式进行提交：

    ```text
    feat(wdp-react): add some feature
    fix(deepsea-tools): fix some bug
    ```

- 除了 `React` 组件和页面以外所有的导出必须使用 `export` 关键字导出，不要使用 `export default` 关键字导出

- 当一个文件中需要导出多个 `React` 组件时，主组件必须使用 `export default` 关键字导出，其他组件必须使用 `export` 关键字导出

- 在你每次进行比较大的修改后，你必须使用 `tsc --noEmit` 和 `eslint` 检查代码，确保代码没有错误

- 当你执行了一个 `mutation` 类型的操作后，你必须参考项目中更新数据的逻辑，更新所有需要更新的数据，比如如果你使用的使用 `@tanstack/react-query` 中 `useMutation` 时，你应该在 `onSuccess` 回调中更新所有需要更新的数据：`context.client.invalidateQueries({ queryKey: ["query-book"] })`

- 如果你发现组件中使用 `messgae` 或者 `toast` 之类的提示方法并没有被导入，请不要自动导入，因为在我的大多数项目中，我都已经它们挂载在了全局对象上，可以直接使用，通常是在 `@/components/Registry.tsx` 中进行挂载，有且仅当 `tsc --noEmit` 检查出错误时，你才需要手动导入

### 函数声明

- **先判断函数本身是不是可复用实体**：凡是需要被导出（`export`）、在别处直接引用、作为组件内独立 `Handler`、作为自定义 `Hook`、或作为高阶函数返回值的具名函数，必须使用 `function` 关键字声明，并显式指定函数名。
- **传给 `API` 的临时回调使用箭头函数**：凡是作为参数传递给 `Hook`、组件属性、数组方法、定时器、`Promise`、事件订阅等 `API` 的回调函数，都视为临时逻辑，优先使用箭头函数。
- **不要用命名函数表达式伪装回调**：例如 `useEffectEvent(function getValue() {})` 仍然属于传参回调，应该写成 `useEffectEvent(() => value)`。
- **单语句箭头函数优先使用表达式体**：如果箭头函数函数体只有一条表达式语句，且该表达式的返回值类型与调用方要求的返回类型兼容，尽量写成 `() => value`。如果调用方要求返回 `void`，而表达式本身也返回 `void`，直接简写。如果调用方要求返回 `void`，但表达式本身不是 `void`，也应该使用 `void` 显式丢弃返回值并保持表达式体，例如 `() => void marker.on("click", onClick)`。
- **禁止**使用 `const add = (a, b) => ...` 这种形式定义顶层或具名工具函数。
- **禁止**在 `map`、`filter`、`setTimeout` 等回调中使用 `function` 匿名函数。
- **`React` 函数式组件例外**：组件优先使用箭头函数 + `FC` 类型，例如 `const App: FC<AppProps> = () => ...`。

| 场景分类                 | 推荐声明形式                     | 示例                              |
| :----------------------- | :------------------------------- | :-------------------------------- |
| **顶层导出/工具函数**    | **必须**使用 `function`          | `export function formatData() {}` |
| **React 函数式组件**     | **优先**使用箭头函数 + `FC` 类型 | `const MyComp: FC<P> = () => {}`  |
| **自定义 Hooks**         | **必须**使用 `function`          | `export function useCustom() {}`  |
| **Hook / API 参数回调**  | **必须优先使用箭头函数**         | `useEffectEvent(() => value)`     |
| **单语句箭头函数**       | **优先使用表达式体**             | `() => setValue(value)`           |
| **单语句 void 回调**     | **用 `void` 丢弃非 void 返回值**  | `() => void marker.on("click", onClick)` |
| **数组/异步回调**        | **必须**使用箭头函数             | `.map(item => item.id)`           |
| **高阶函数返回的函数**   | **必须**使用 `function` 并具名   | `return function resolver() {}`   |
| **组件内独立的 Handler** | **必须**使用 `function`          | `function onSubmit() {}`          |

## Style Rules

- 页面的 CSS 样式你应该尽量通过以下两种方式实现：
    1. 对于 `Ant Design` 或者 `@heroui/react` 等组件库提供的组件，请在组件库提供的 `ConfigProvider` 等类似的全局配置组件进行修改，如果你需要修改某个组件的全局样式，你可以在 `@/components/Registry.tsx` 中进行修改，它包裹了整个应用，如果你只需要单独修改某个位置的某个组件，请使用 `ConfigProvider` 包裹你需要修改的组件
    2. 对于一般样式，优先使用组件的 `className` 或者 `classNames` 或其他类名属性 + `tailwindcss` 实现
    3. 有且仅有以上两种方式无法实现时，请你使用 `style` 属性或者在 css 文件中定义样式

- 当你使用 `flex` 布局时，对于宽度或者高度需要保持固定的子元素设置 `flex-none`
- 对于 `React` 组件（也就是非 `div` 等 `html` 元素）的样式，请谨慎使用 `!important` 修改样式，请优先使用 `ConfigProvider` 或者组件暴露的属性（比如 `radius` / `shape`等）修改样式，最后再考虑使用 `!important`
- 请不要使用模板字符串的形式来实现动态样式，例如 ``className={`w-${width}px`}``，如果你想要实现条件类名，请使用 `deepsea-tools` 中导出的 `clsx` 函数，比如 `clsx("text-base", isPrimary ? "text-primary" : "text-secondary")`

- 如果某个容器在不同状态下有时会出现纵向滚动条，有时不会，导致右侧按钮或内容边界横向抖动。请用 `CSS` 动态 `padding` 解决，不要硬编码滚动条宽度。做法是：先确定内容区域在没有滚动条时的理论宽度，例如整个窗口宽度减去左侧固定侧边栏宽度：`calc(100vw - 84px)`。然后设置左侧 `padding` 为基础值，比如 `28px`；右侧 `padding` 设置为基础值减去“理论宽度和当前容器实际宽度的差值”： `padding-left: 28px; padding-right: calc(28px - ((100vw - 84px) - 100%));` 其中 `100%` 是当前内容容器实际可用宽度。没有滚动条时差值为 `0`；有滚动条时差值等于滚动条占用宽度，从而自动抵消滚动条造成的横向偏移。响应式场景下，如果侧边栏宽度或基础 `padding` 改变，也要在对应断点同步更新这个公式。

- 对于 `Ant Design` 中的按钮，尽量使用 `color` + `variant` 的组合来实现不通样式，对于 `color` 不是 `default` 的按钮，`variant` 尽量不要使用 `outlined`

## React Rules

### 规则

- 项目的 `React` 版本为 `19`，请优先使用 `React 19` 中的新特性：
    - 使用 `Actions` 处理异步数据变更、提交状态、错误处理、乐观更新与表单提交，优先将异步提交函数命名为 `xxxAction`
    - 表单提交优先使用 `<form action={xxxAction}>`、元素级 `formAction`、`useActionState`、`useFormStatus` 与 `requestFormReset`
    - 需要乐观 UI 时优先使用 `useOptimistic`
    - 需要在渲染阶段读取 `Promise` 或条件读取 `Context` 时优先使用 `use`，但不要在渲染期间创建未缓存的 `Promise`
    - 函数组件需要接收 `ref` 时优先使用 `ref` 作为 `props`，新组件不要再优先使用 `forwardRef`
    - 新增 `Context` Provider 时优先使用 `<SomeContext value={value}>`，不要优先使用 `<SomeContext.Provider>`
    - 回调 `ref` 需要清理逻辑时可以返回清理函数；没有清理逻辑时不要使用隐式返回
    - 需要初始占位值的延迟渲染时优先使用 `useDeferredValue(value, initialValue)`
    - 页面级元数据优先直接在组件中渲染 `<title>`、`<meta>` 与 `<link>`，让 `React` 自动提升到 `<head>`
    - 组件依赖样式表时可以渲染 `<link rel="stylesheet" precedence="...">` 或 `<style precedence="...">`，让 `React` 管理顺序、加载与去重
    - 组件依赖异步脚本时可以直接渲染 `<script async src="...">`，让 `React` 管理提升与去重
    - 需要优化资源加载时优先使用 `react-dom` 中的 `prefetchDNS`、`preconnect`、`preload` 与 `preinit`
    - 静态站点生成优先使用 `react-dom/static` 中的 `prerender` 与 `prerenderToNodeStream`
    - 框架支持时优先考虑 `React Server Components` 与 `Server Actions`，其中 `"use server"` 仅用于 `Server Actions`
    - 需要保留隐藏页面状态、预渲染下一步界面或降低隐藏内容优先级时，可以使用 `Activity`
    - `Effect` 中由外部系统触发、但需要读取最新 `props` 或 `state` 的事件逻辑，优先使用 `useEffectEvent`
    - `React Server Components` 中需要在缓存生命周期结束时中止或清理异步工作，可以使用 `cacheSignal`
    - 需要 Web Components 时可以直接使用 `Custom Elements`，`React 19` 已支持属性与 SSR 行为

- 生成 `React` 组件时，尽量使用函数式组件，而不是类组件

- 禁止使用 `<></>`，必须使用从 `React` 导入的 `Fragment` 组件

- 组件的 `props` 书写的优先级为：身份属性 (`ref`、`key`、`id`) > 样式属性 (`className`、`classNames`、`style`、`size` 等等) > 其他属性 (`value`、`defaultValue` 等等) > 回调事件 (`onClick`、`onChange` 等等)

- 请始终使用 `on` + 事件名作为事件处理函数的名称，比如 `onClick` 事件处理函数应该命名为 `onClick`，而不是 `handleClick`

- 你应该将根组件的 `props` 当做基础的 `props` 类型，将当前组件所需的原始数据当做 `data` 属性

    ```tsx
    import { ComponentProps, FC } from "react"

    import { clsx, StrictOmit } from "deepsea-tools"

    export interface Book {
        id: string
        name: string
        isbn: string
    }

    export interface BookProps extends StrictOmit<ComponentProps<"div">, "children"> {
        data?: Book
    }

    const Book: FC<BookProps> = ({ className, data, ...rest }) => (
        <div className={clsx("container", className)} {...rest}>
            <div>{data?.name}</div>
            <div>{data?.isbn}</div>
        </div>
    )

    export default Book
    ```

    因为 `Book` 组件的根元素是 `div`，所以 `BookProps` 类型应该继承自 `StrictOmit<ComponentProps<"div">, "children">`，如果 `Book` 组件的根组件不是 `html` 元素，例如 `Container` 组件，则应该继承自 `StrictOmit<ComponentProps<typeof Container>, "children">`，或者如果存在 `ContainerProps` 类型，则应该继承自 `StrictOmit<ContainerProps, "children">`

    `data` 属性是指整个项目中某种数据的原始类型，例如从 `queryBook` 接口等 api 函数中获取到的数据，这时 `data` 的类型就是 `Book` 类型

- 尽量直接在函数式组件的参数中解构 `props`，获取需要使用的属性，将剩余的属性作为 `rest` 属性

- 如果你需要根组件设置 `className`，请使用从 `deepsea-tools` 中导入的 `clsx` 函数来合并 `className`，例如上方的：

    ```tsx
    return (
        <div className={clsx("container", className)} {...rest}>
            ...
        </div>
    )
    ```

- 如果组件是一个受控组件，请使用 `value` 和 `onValueChange` 来实现受控组件，这两个属性都应该是可选，并且在组件内部，你应该使用从 `soda-hooks` 中导入的 `useInputState` 的钩子来实现内部状态与外部状态的同步，例如：

    ```tsx
    import { ComponentProps, FC } from "react"

    import { StrictOmit } from "deepsea-tools"

    export interface MyInputProps extends StrictOmit<ComponentProps<typeof OtherInput>, "value" | "onValueChange"> {
        value?: string
        onValueChange?: (value: string) => void
    }

    const MyInput: FC<MyInputProps> = ({ value: _value, onValueChange: _onValueChange, ...rest }) => {
        const [value, setValue] = useInputState(_value)

        function onValueChange(value: string) {
            setValue(value)
            _onValueChange?.(value)
        }

        return <OtherInput value={value} onValueChange={onValueChange} {...rest} />
    }

    export default MyInput
    ```

- 如果你需要使用 `React` 中的某个导入，请使用 `import { xxx } from "react"` 而不是 `React.xxx` 的形式，如果已经存在同名的变量或者类型，请使用 `import { xxx as reactXxx } from "react"`，变量使用小驼峰命名，类型使用大驼峰命名

- 如果你需要在组件内部添加一个事件处理函数，而组件的 `props` 中存在同名的事件处理函数，你应该这样处理：

    ```tsx
    // 因为 global 中存在 MouseEvent 类型，与 react 中的 MouseEvent 类型冲突，所以需要将 react 中的 MouseEvent 类型重命名为 ReactMouseEvent
    import { ComponentProps, FC, MouseEvent as ReactMouseEvent } from "react"

    import { StrictOmit } from "deepsea-tools"

    export interface AppProps extends StrictOmit<ComponentProps<"div">, "children"> {}

    // 将 props 中的同名事件处理函数加一个下划线前缀
    const App: FC<AppProps> = ({ onClick: _onClick, ...rest }) => {
        function onClick(event: ReactMouseEvent<HTMLDivElement, MouseEvent>) {
            // 优先处理内部逻辑
            console.log("onClick")

            // 然后调用外部的事件处理函数
            _onClick?.(event)
        }

        return (
            <div onClick={onClick} {...rest}>
                Hello World!
            </div>
        )
    }

    export default App
    ```

- 如果你的组件内部没有任何逻辑，只有 `return` 一个组件，请直接返回该组件，不要使用 `return` 关键字，例如：

    ```tsx
    const App: FC<AppProps> = ({ className, ...rest }) => (
        <div className={clsx("container", className)} {...rest}>
            Hello World!
        </div>
    )
    ```

- 当你在组件内部需要获取根组件的 `ref`，而 `props` 中也有 `ref` 属性时，你应该这样处理：

    ```tsx
    const App: FC<AppProps> = ({ ref, ...rest }) => {
        const container = useRef<HTMLDivElement>(null)

        useImperativeHandle(ref, () => container.current!)

        return (
            <div ref={container} {...rest}>
                Hello World!
            </div>
        )
    }
    ```

- 如果组件没有 `children`，请使用自闭合标签，例如 `<div />` 而不是 `<div></div>`

- 如果 jsx 中某个元素的属性（非 `children` 属性）的类型为回调函数，并且这个回调函数无法使用一行代码完成，请使用 `function` 关键字声明一个函数，然后传递给该属性，例如：

    ```tsx
    const App: FC<AppProps> = ({ className, ...rest }) => {
        function onClick(event: ReactMouseEvent<HTMLDivElement, MouseEvent>) {
            console.log("onClick")
            doSomething()
        }

        return (
            <div onClick={onClick} {...rest}>
                Hello World!
            </div>
        )
    }
    ```

- 如果你使用的是 `shadcn/ui` 的组件，禁止自动生成组件代码，必须使用命令行工具 `npx shadcn@latest add <component-name>` 来添加组件

- 禁止修改 `shadcn/ui` 添加的原始组件，一般路径为 `@/components/ui/**/*.tsx`

- 如果你使用的是 `ai-elements` 的组件，禁止修改原始组件，一般路径为 `@/components/ai-elements/**/*.tsx`

### 组件与页面

请遵循以下规则生成组件或页面，并在新增时考虑复用与抽取：

1. 先分析页面结构，识别重复的 UI 片段与逻辑，并判断是否值得抽取。不要为了抽取而抽取，优先考虑维护成本。
2. 抽取的组件应该放在公共的 `@/components` 目录下，工具函数应该放在公共的 `@/utils` 目录下，禁止放在其他目录下。
3. 新增组件或页面前，检查已有目录（尤其是 `@/components` 与 `@/utils`）是否已有可复用实现，优先复用而非重复创建。
4. 抽取时保持原有 UI 风格与交互一致，避免引入不必要的样式或行为变化。
5. 组件拆分要能提升可读性与可测试性；若拆分后跨文件沟通成本增加，则保留在原文件。
6. 对抽取出的组件与工具，提供清晰的 props 或函数签名与命名，便于后续维护与扩展。
