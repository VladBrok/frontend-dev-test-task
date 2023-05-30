import pluralize from "./pluralize"

export default function (count: number): string {
  return `${count} ${pluralize(count, ["гость", "гостя", "гостей"])}`
}
