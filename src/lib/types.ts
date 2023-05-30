export interface IUser {
  uuid: string
  login: string
  passwordHash: string
  phone: string
}

export interface IBooking {
  uuid: string
  datetime: string
  person_count: number
  userUuid: string
}
