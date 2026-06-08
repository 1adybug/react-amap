function defaultFn() {
    return undefined
}

export function optionalFn(fn?: undefined): () => undefined
export function optionalFn<T extends (...args: any[]) => any>(fn: T): T
export function optionalFn<T extends (...args: any[]) => any>(fn?: T | undefined): (...args: Parameters<T>) => ReturnType<T> | undefined
export function optionalFn<T extends (...args: any[]) => any>(fn?: T | undefined): (...args: Parameters<T>) => ReturnType<T> | undefined {
    return fn ?? defaultFn
}
