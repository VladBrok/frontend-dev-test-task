import Button from "react-bootstrap/Button"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import { Formik } from "formik"
import { InferType, object, string } from "yup"
import { useState } from "react"

// TODO: move to infrastructure (schema and type)
// TODO: enhance validation
const authSchema = object().shape({
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

type AuthData = InferType<typeof authSchema>

interface IAuthProps {
  action: "register" | "login"
}

export default function Auth(props: IAuthProps) {
  const [isSubmitClicked, setIsSubmitClicked] = useState(false)

  const handleSubmit = (form: AuthData): void => {
    console.log(form)
  }

  const submitButtonText = props.action === "register" ? "Регистрация" : "Вход"

  // TODO: find out about .trim
  return (
    <Container className="mt-5 d-flex flex-column align-items-center justify-content-center">
      <h1 className="mb-4 fs-2">Добро пожаловать!</h1>
      <Formik
        validationSchema={authSchema}
        onSubmit={handleSubmit}
        initialValues={{
          login: "",
          password: "",
          phone: "",
        }}
        validateOnChange={isSubmitClicked}
      >
        {({ handleSubmit, handleChange, values, errors }) => (
          <Form noValidate onSubmit={handleSubmit} className="w-25 mx-auto">
            <Form.Group controlId="validationFormikLogin" className="mt-2">
              <Form.Label>Логин</Form.Label>
              <Form.Control
                type="text"
                placeholder="Логин"
                name="login"
                value={values.login}
                onChange={(e) => handleChange(e)}
                isInvalid={!!errors.login}
              />
              <Form.Control.Feedback type="invalid">
                {errors.login}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="validationFormikPassword" className="mt-2">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                placeholder="Пароль"
                name="password"
                value={values.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="validationFormikUsername" className="mt-2">
              <Form.Label>Телефон</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text id="inputGroupPrepend">+7</InputGroup.Text>
                <Form.Control
                  type="number"
                  placeholder="Телефон"
                  aria-describedby="inputGroupPrepend"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  isInvalid={!!errors.phone}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.phone}
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Button
              type="submit"
              variant="dark"
              onClick={() => setIsSubmitClicked(true)}
              className="mt-4 w-100 d-block"
            >
              {submitButtonText}
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  )
}
