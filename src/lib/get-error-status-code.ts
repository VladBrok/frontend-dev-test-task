import { ResponseError } from "./response-error"

export default function getErrorStatusCode(queryLike: {
  isError: boolean
  error: unknown
}): number | null {
  const isError = queryLike.isError && queryLike.error instanceof ResponseError
  return isError ? (queryLike.error as ResponseError).status : null
}
