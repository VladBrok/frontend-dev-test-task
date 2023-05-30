export interface IUser {
  uuid: string
  login: string
  passwordHash: string
  phone: string
}

export interface IBooking {
  uuid: string
  datetime: string
  guestCount: number
  userUuid: string
}

export interface ITable {
  uuid: string
  guestCount: number
  bookingUuid: string
}
