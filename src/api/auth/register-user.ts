import { InferType, object, string } from "yup"
import { delay } from "../../lib/delay"
import { ARTIFICIAL_API_DELAY_MS } from "../../lib/constants"
import { v4 as uuidv4 } from "uuid"
import { hash } from "../../lib/password"
import { IUser } from "../../lib/types"
import saveUser from "../../dummy-backend/save-user"

// TODO: enhance validation
export const authSchema = object().shape({
  login: string()
    .trim()
    .required("Обязательное поле")
    .min(3, "Минимум 3 символа")
    .max(15, "Максимум 15 символов"),
  password: string()
    .trim()
    .required("Обязательное поле")
    .min(8, "Минимум 8 символов")
    .max(15, "Максимум 15 символов"),
  phone: string()
    .trim()
    .required("Обязательное поле")
    .length(10, "Номер должен состоять из 10-ти цифр"),
})

export type AuthData = InferType<typeof authSchema>

export default async function (data: AuthData): Promise<IUser> {
  await delay(ARTIFICIAL_API_DELAY_MS)
  const parsedData = await authSchema.validate(data)

  const passwordHash = await hash(parsedData.password)
  const user: IUser = {
    uuid: uuidv4(),
    login: parsedData.login,
    phone: parsedData.phone,
    passwordHash: passwordHash,
  }

  saveUser(user)

  return user
}
