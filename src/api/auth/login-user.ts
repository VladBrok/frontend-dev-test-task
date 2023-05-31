import getUser from "../../dummy-backend/get-user"
import { check } from "../../lib/password"
import { ResponseError } from "../../lib/response-error"
import { InferType, object, string } from "yup"
import { IUser } from "../../lib/types"
import { ARTIFICIAL_API_DELAY_MS } from "../../lib/constants"
import { delay } from "../../lib/delay"

export const loginSchema = object().shape({
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
})

export type LoginData = InferType<typeof loginSchema>

export default async function (data: LoginData): Promise<IUser> {
  await delay(ARTIFICIAL_API_DELAY_MS)

  const user = getUser(data.login)

  if (!user) {
    throw new ResponseError(404)
  }

  await loginSchema.validate(data)
  const isPasswordCorrect = await check(data.password, user.passwordHash)

  if (!isPasswordCorrect) {
    throw new ResponseError(401)
  }

  return user
}
