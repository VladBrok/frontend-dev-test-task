import { InferType, object, string } from "yup"
import { delay } from "../../lib/delay"
import { ARTIFICIAL_API_DELAY_MS } from "../../lib/shared-constants"

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

export default async function (data: AuthData): Promise<void> {
  await delay(ARTIFICIAL_API_DELAY_MS)
  await authSchema.validate(data)
  console.log("got data:", data)
}
