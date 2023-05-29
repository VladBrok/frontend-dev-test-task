import { IUser } from "../lib/types"
import storage from "./storage"

export default function (user: IUser): void {
  const data = storage.getData()
  const newData = { ...data, users: [...data.users, user] }
  storage.setData(newData)
}
