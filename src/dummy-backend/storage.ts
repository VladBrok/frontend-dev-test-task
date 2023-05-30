import { IBooking, IUser } from "../lib/types"

export interface IStorageData {
  users: IUser[]
  bookings: IBooking[]
}

// TODO: remove defaults (except for tables)
const INITIAL: IStorageData = {
  users: [
    {
      uuid: "123",
      login: "vlad",
      passwordHash: "12345678",
      phone: "9490000000",
    },
  ],
  bookings: [
    {
      uuid: "1",
      datetime: new Date(2023, 3, 20).toISOString(),
      guestCount: 4,
      userUuid: "123",
    },
    {
      uuid: "2",
      datetime: new Date(2023, 5, 1).toISOString(),
      guestCount: 8,
      userUuid: "123",
    },
    {
      uuid: "3",
      datetime: new Date(2023, 3, 25).toISOString(),
      guestCount: 5,
      userUuid: "123",
    },
  ],
}

const KEY = "dummy-database"

function setData(data: IStorageData): void {
  localStorage.setItem(KEY, JSON.stringify(data))
}

function getData(): IStorageData {
  const data = localStorage.getItem(KEY)

  if (!data) {
    setData(INITIAL)
    return INITIAL
  }

  return JSON.parse(data) as IStorageData
}

export default {
  getData,
  setData,
}
