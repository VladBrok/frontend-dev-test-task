import { IBooking, ITable, IUser } from "../lib/types"
import initializeTables from "./initialize-tables"

export interface IStorageData {
  users: IUser[]
  bookings: IBooking[]
  tables: ITable[]
}

// TODO: remove defaults (except for tables and some bookings)
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
      datetime: new Date(2023, 3, 20, 12).toISOString(),
      guestCount: 4,
      userUuid: "123",
    },
    {
      uuid: "2",
      datetime: new Date(2023, 5, 1, 12).toISOString(),
      guestCount: 8,
      userUuid: "123",
    },
    {
      uuid: "5",
      datetime: new Date(2023, 5, 1, 13).toISOString(),
      guestCount: 8,
      userUuid: "123",
    },
    {
      uuid: "6",
      datetime: new Date(2023, 5, 1, 14).toISOString(),
      guestCount: 8,
      userUuid: "123",
    },
    {
      uuid: "7",
      datetime: new Date(2023, 5, 1, 15).toISOString(),
      guestCount: 8,
      userUuid: "123",
    },
    {
      uuid: "8",
      datetime: new Date(2023, 5, 1, 16).toISOString(),
      guestCount: 8,
      userUuid: "123",
    },
    {
      uuid: "9",
      datetime: new Date(2023, 5, 1, 17).toISOString(),
      guestCount: 8,
      userUuid: "123",
    },
    {
      uuid: "10",
      datetime: new Date(2023, 5, 1, 18).toISOString(),
      guestCount: 8,
      userUuid: "123",
    },
    {
      uuid: "11",
      datetime: new Date(2023, 5, 1, 19).toISOString(),
      guestCount: 8,
      userUuid: "123",
    },
    {
      uuid: "12",
      datetime: new Date(2023, 5, 1, 20).toISOString(),
      guestCount: 8,
      userUuid: "123",
    },
    {
      uuid: "13",
      datetime: new Date(2023, 5, 1, 21).toISOString(),
      guestCount: 8,
      userUuid: "123",
    },
    {
      uuid: "14",
      datetime: new Date(2023, 5, 1, 22).toISOString(),
      guestCount: 8,
      userUuid: "123",
    },
    {
      uuid: "3",
      datetime: new Date(2023, 3, 25, 16).toISOString(),
      guestCount: 5,
      userUuid: "123",
    },
    {
      uuid: "4",
      datetime: new Date(2023, 4, 31, 17).toISOString(),
      guestCount: 1,
      userUuid: "123",
    },
  ],
  tables: initializeTables(),
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
