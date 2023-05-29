import { ResponseError } from "../lib/response-error"
import { IUser } from "../lib/types"
import getUser from "./get-user"
import storage from "./storage"

export default function (user: IUser): void {
  const existingUser = getUser(user.login)

  if (existingUser) {
    throw new ResponseError(409)
  }

  const data = storage.getData()
  const newData = { ...data, users: [...data.users, user] }
  storage.setData(newData)
}
