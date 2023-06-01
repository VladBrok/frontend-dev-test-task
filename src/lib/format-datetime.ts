export default function (datetime: string): string {
  return new Intl.DateTimeFormat(navigator.language, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
    minute: "numeric",
    hour: "numeric",
  }).format(new Date(datetime))
}
