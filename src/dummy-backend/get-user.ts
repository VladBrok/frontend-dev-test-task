import { IUser } from "../lib/types"
import storage from "./storage"

export default function (login: string): IUser | null {
  const data = storage.getData()
  const user = data.users.find((user) => user.login === login) ?? null
  return user
}
