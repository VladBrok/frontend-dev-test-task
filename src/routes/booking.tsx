import { Formik } from "formik"
import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import useTablesQuery from "../hooks/queries/use-tables-query"
import getUnavailableDates from "../lib/get-unavailable-dates"
import useBookingsQuery from "../hooks/queries/use-bookings-query"
import useCurrentUser from "../hooks/use-current-user"
import { forwardRef, useMemo } from "react"
import DatePicker from "react-datepicker"
import { date, object } from "yup"

export default function Booking() {
  const user = useCurrentUser()
  const tablesQuery = useTablesQuery()
  const bookinsQuery = useBookingsQuery(user?.uuid || "")

  const unavailableDates = useMemo(() => {
    if (!bookinsQuery.data) {
      return []
    }

    return getUnavailableDates(bookinsQuery.data)
  }, [bookinsQuery.data])

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // TODO: move to api
  const bookingSchema = object().shape({
    date: date()
      .required("Обязательное поле")
      .min(today, "Дата не может быть меньше текущей")
      .test(
        "available",
        "Дата недоступна",
        (date) =>
          !unavailableDates.some(
            (unavailable) => unavailable.getTime() === date.getTime(),
          ),
      ),
  })

  if (!user) {
    return <></>
  }

  return (
    <Container>
      <h1 className="fs-2 text-center mb-5">Забронировать</h1>
      <Formik
        validationSchema={bookingSchema}
        onSubmit={console.log}
        initialValues={{
          date: null,
        }}
      >
        {({ handleSubmit, handleChange, setFieldValue, values, errors }) => (
          <Form noValidate onSubmit={handleSubmit} className="w-25 mx-auto">
            <Form.Group controlId="validationFormikDate" className="mt-3">
              <Form.Label>Дата</Form.Label>
              <DatePicker
                customInput={
                  <Form.Control
                    type="text"
                    disabled
                    readOnly
                    isInvalid={!!errors.date}
                  />
                }
                dateFormat="dd.MM.yyyy"
                placeholderText="Дата бронирования"
                name="date"
                selected={values.date}
                onChange={(date) => {
                  setFieldValue("date", date)
                }}
                minDate={today}
                excludeDates={unavailableDates}
              />
              <Form.Control.Feedback type="invalid">
                {errors.date}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" variant="dark" className="mt-4 w-100 d-block">
              Сохранить
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  )
}
