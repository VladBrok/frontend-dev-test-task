export default function (a: string, b: string): number {
  return new Date(a).getTime() - new Date(b).getTime()
}
