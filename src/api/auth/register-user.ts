import { delay } from "../../lib/delay"
import { ARTIFICIAL_API_DELAY_MS } from "../../lib/constants"
import { v4 as uuidv4 } from "uuid"
import { hash } from "../../lib/password"
import { IUser } from "../../lib/types"
import saveUser from "../../dummy-backend/save-user"
import { InferType, object, string } from "yup"
import { loginSchema } from "./login-user"
import getUser from "../../dummy-backend/get-user"
import { ResponseError } from "../../lib/response-error"

export const registrationSchema = loginSchema.concat(
  object().shape({
    phone: string()
      .trim()
      .required("Обязательное поле")
      .length(10, "Номер должен состоять из 10-ти цифр"),
  }),
)

export type RegistrationData = InferType<typeof registrationSchema>

export default async function (data: RegistrationData): Promise<IUser> {
  await delay(ARTIFICIAL_API_DELAY_MS)

  const existingUser = getUser(data.login)

  if (existingUser) {
    throw new ResponseError(409)
  }

  const parsedData = await registrationSchema.validate(data)
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
