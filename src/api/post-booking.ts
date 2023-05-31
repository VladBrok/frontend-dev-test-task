import { InferType, date, number, object } from "yup"
import saveBooking from "../dummy-backend/save-booking"
import {
  ARTIFICIAL_API_DELAY_MS,
  BOOKING_START_MAX_HOURS,
  BOOKING_START_MAX_TIME,
  BOOKING_START_MIN_HOURS,
  BOOKING_START_MIN_TIME,
} from "../lib/constants"
import { delay } from "../lib/delay"
import { IBooking } from "../lib/types"
import { v4 as uuidv4 } from "uuid"
import pluralizeGuestCount from "../lib/pluralize-guest-count"
import getToday from "../lib/get-today"
import getTables from "../dummy-backend/get-tables"
import getTablesToOccupy from "../lib/get-tables-to-occupy"
import occupyTables from "../dummy-backend/occupy-tables"

export const getBookingSchema = (
  unavailableDates: Date[],
  unavailableTimes: Date[],
  maxGuestCount: number,
) => {
  return object().shape({
    date: date()
      .required("Обязательное поле")
      .min(getToday(), "Дата не может быть меньше текущей")
      .test(
        "date-available",
        "Эта дата уже занята",
        (date) =>
          !unavailableDates.some(
            (unavailable) => unavailable.getTime() === date.getTime(),
          ),
      ),
    time: date()
      .required("Обязательное поле")
      .min(
        BOOKING_START_MIN_TIME,
        `Бронировать можно начиная с ${BOOKING_START_MIN_HOURS}:00`,
      )
      .max(
        BOOKING_START_MAX_TIME,
        `Бронировать можно до ${BOOKING_START_MAX_HOURS}:00`,
      )
      .test(
        "time-available",
        "Это время уже занято",
        (time) =>
          !unavailableTimes.some(
            (unavailable) => unavailable.getHours() === time.getHours(),
          ),
      ),
    guestCount: number()
      .required("Обязательное поле")
      .min(1, "Минимум 1 гость")
      .max(maxGuestCount, `Максимум ${pluralizeGuestCount(maxGuestCount)}`),
  })
}
const schema = getBookingSchema([], [], 0)
export type BookingData = InferType<typeof schema>

export default async function (
  data: BookingData,
  userUuid: string,
): Promise<IBooking> {
  await delay(ARTIFICIAL_API_DELAY_MS)

  // TODO: validate data

  const tables = getTables()
  const tablesToOccupy = getTablesToOccupy(tables, data.guestCount)

  const booking: IBooking = {
    uuid: uuidv4(),
    guestCount: data.guestCount,
    userUuid,
    datetime: new Date(
      data.date.getFullYear(),
      data.date.getMonth(),
      data.date.getDate(),
      data.time.getHours(),
      data.time.getMinutes(),
      data.time.getSeconds(),
    ).toISOString(),
  }

  occupyTables(tablesToOccupy, booking.uuid)
  saveBooking(booking)

  return booking
}
