import { setHours } from "date-fns"

export const ROUTE_PATHS = {
  AUTH: "/",
  DASHBOARD: "/dashboard",
  BOOKING: "/booking",
}

export const AUTH_ACTIONS = {
  REGISTER: "register",
  LOGIN: "login",
}

export const ARTIFICIAL_API_DELAY_MS = 500

export const BOOKING_START_MIN_HOURS = 12
export const BOOKING_START_MAX_HOURS = 22
export const BOOKING_DURATION_HOURS = 1

export const BOOKING_START_MIN_TIME = setHours(
  new Date(),
  BOOKING_START_MIN_HOURS - 1,
)
export const BOOKING_START_MAX_TIME = setHours(
  new Date(),
  BOOKING_START_MAX_HOURS,
)
