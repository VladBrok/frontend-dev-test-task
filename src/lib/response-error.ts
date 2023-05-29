export class ResponseError extends Error {
  public readonly status: number

  constructor(status: number) {
    super(status.toString())
    this.status = status
  }
}
