export function assert<T>(condition: T, message?: string): void {
  if (condition) {
    return
  }

  if (import.meta.env.PROD) {
    console.assert(Boolean(condition), message)
  } else {
    throw new Error(`Assertion failed: ${message}`)
  }
}
