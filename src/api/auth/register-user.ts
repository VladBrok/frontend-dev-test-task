import { InferType, object, string } from "yup"
import { delay } from "../../lib/delay"
import { ARTIFICIAL_API_DELAY_MS } from "../../lib/shared-constants"
import { IUser } from "../../redux/slices/users-slice"
import { v4 as uuidv4 } from "uuid"
import { hash } from "../../lib/password"

// TODO: enhance validation
export const authSchema = object().shape({
  login: string()
    .required("Обязательное поле")
    .min(3, "Минимум 3 символа")
    .max(15, "Максимум 15 символов"),
  password: string()
    .required("Обязательное поле")
    .min(8, "Минимум 8 символов")
    .max(15, "Максимум 15 символов"),
  phone: string()
    .required("Обязательное поле")
    .length(10, "Номер должен состоять из 10-ти цифр"),
})

export type AuthData = InferType<typeof authSchema>

export default async function (data: AuthData): Promise<IUser> {
  await delay(ARTIFICIAL_API_DELAY_MS)
  await authSchema.validate(data)

  const passwordHash = await hash(data.password)
  const user: IUser = {
    uuid: uuidv4(),
    login: data.login,
    phone: data.phone,
    passwordHash: passwordHash,
  }

  return user
}
