import { IUser } from "../lib/types"

export interface IStorageData {
  users: IUser[]
}

const KEY = "dummy-database"

function setData(data: IStorageData): void {
  localStorage.setItem(KEY, JSON.stringify(data))
}

function getData(): IStorageData {
  const data = localStorage.getItem(KEY)

  if (!data) {
    const initial = {
      users: [],
    }
    setData(initial)
    return initial
  }

  return JSON.parse(data) as IStorageData
}

export default {
  getData,
  setData,
}
