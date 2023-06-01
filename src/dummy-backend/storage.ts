import { IBooking, ITable, IUser } from "../lib/types"
import initializeTables from "./initialize-tables"

export interface IStorageData {
  users: IUser[]
  bookings: IBooking[]
  tables: ITable[]
}

const INITIAL_BOOKINGS: IBooking[] = [
  {
    uuid: "941f0976-cdc6-4173-ae68-720c7fe5816c",
    userUuid: "62f3c39b-030f-4e0f-8fc5-06fc785fb195",
    guestCount: 6,
    datetime: new Date(2023, 5, 27, 13).toISOString(),
  },
  {
    uuid: "778787c7-4096-4956-be64-691bca379b5c",
    userUuid: "62f3c39b-030f-4e0f-8fc5-06fc785fb195",
    guestCount: 1,
    datetime: new Date(2023, 5, 30, 15).toISOString(),
  },
]

const INITIAL: IStorageData = {
  users: [
    {
      uuid: "62f3c39b-030f-4e0f-8fc5-06fc785fb195",
      login: "vlad",
      passwordHash:
        "$2a$10$3QQEkS1DKMPeAYbHtl3QpeTEC7PiOumOYuU3eoD5ZypWk.4ijW.0.",
      phone: "9490000000",
    },
  ],
  bookings: INITIAL_BOOKINGS,
  tables: initializeTables(INITIAL_BOOKINGS),
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
