export type Dictionary<T> = Record<string, T>

export type ObjectItemKey = string | (string | number)[] | ((item: Dictionary<any>, fallback?: any) => any)

export type SetupProps = Record<string, any>

export type Data = Record<string, unknown>

export type EmitFn = (event: any, ...args: unknown[]) => void
