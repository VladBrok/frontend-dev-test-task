import Button from "react-bootstrap/Button"
import Alert from "react-bootstrap/Alert"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import InputGroup from "react-bootstrap/InputGroup"
import { Formik } from "formik"
import { useState } from "react"
import { AUTH_ACTIONS, ROUTE_PATHS } from "../lib/constants"
import { useNavigate, useSearchParams } from "react-router-dom"
import registerUser, {
  RegistrationData,
  registrationSchema,
} from "../api/auth/register-user"
import { useMutation } from "@tanstack/react-query"
import { useDispatch } from "react-redux"
import { setCurrentUser } from "../redux/slices/users-slice"
import { ResponseError } from "../lib/response-error"
import loginUser, { LoginData, loginSchema } from "../api/auth/login-user"

export default function Auth() {
  const navigate = useNavigate()
  const dispath = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()

  const query = new URLSearchParams(searchParams)
  const action = query.get("action") ?? AUTH_ACTIONS.REGISTER

  const [isSubmitClicked, setIsSubmitClicked] = useState(false)

  const authRequest = useMutation({
    mutationFn: async (data: RegistrationData | LoginData) => {
      const authFunc =
        action === AUTH_ACTIONS.REGISTER ? registerUser : loginUser
      const user = await authFunc(data as any)
      dispath(setCurrentUser(user))
      navigate(ROUTE_PATHS.DASHBOARD)
    },
  })

  const changeAction = (action: keyof typeof AUTH_ACTIONS): void => {
    authRequest.reset()
    setSearchParams(`action=${AUTH_ACTIONS[action]}`)
  }

  const getErrorStatusCode = (): number | null => {
    const isError =
      authRequest.isError && authRequest.error instanceof ResponseError
    return isError ? (authRequest.error as ResponseError).status : null
  }

  const authSchema =
    action === AUTH_ACTIONS.REGISTER ? registrationSchema : loginSchema

  const submitButtonText = authRequest.isLoading
    ? "Загрузка..."
    : action === AUTH_ACTIONS.REGISTER
    ? "Регистрация"
    : "Вход"

  const isUserAlreadyExists = getErrorStatusCode() === 409
  const isUserNotFound = getErrorStatusCode() === 404
  const isInvalidPassword = getErrorStatusCode() === 401

  const errorText = isUserAlreadyExists
    ? "Пользователь с данным логином уже существует. Пожалуйста, укажите другой логин, или войдите в систему."
    : isUserNotFound
    ? "Пользователь с данным логином не найден. Пожалуйста, укажите свой логин, или зарегистрируйтесь."
    : isInvalidPassword
    ? "Неверный пароль. Пожалуйста, повторите попытку."
    : "В ходе авторизации произошла ошибка. Попробуйте перезагрузить страницу."

  const hint =
    action === AUTH_ACTIONS.REGISTER ? (
      <>
        <span>Уже есть аккаунт?</span>
        <Button
          variant="link"
          onClick={() => changeAction("LOGIN")}
          className="mb-1"
        >
          Вход
        </Button>
      </>
    ) : (
      <>
        <span>Ещё нет аккаунта?</span>
        <Button
          variant="link"
          onClick={() => changeAction("REGISTER")}
          className="mb-1"
        >
          Регистрация
        </Button>
      </>
    )

  return (
    <Container className="mt-5 d-flex flex-column align-items-center justify-content-center">
      <h1 className="mb-4 fs-2">Добро пожаловать!</h1>
      <Formik
        validationSchema={authSchema}
        onSubmit={authRequest.mutate}
        initialValues={{
          login: "",
          password: "",
          phone: "",
        }}
        validateOnChange={isSubmitClicked}
      >
        {({ handleSubmit, handleChange, setFieldValue, values, errors }) => (
          <Form noValidate onSubmit={handleSubmit} className="w-25 mx-auto">
            <Form.Group controlId="validationFormikLogin" className="mt-3">
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
            <Form.Group controlId="validationFormikPassword" className="mt-3">
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
            {action === AUTH_ACTIONS.REGISTER && (
              <Form.Group
                controlId="validationFormikUsername"
                className="mt-3 pb-2"
              >
                <Form.Label>Телефон</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="inputGroupPrepend">+7</InputGroup.Text>
                  <Form.Control
                    type="text"
                    inputMode="numeric"
                    placeholder="Телефон"
                    aria-describedby="inputGroupPrepend"
                    name="phone"
                    value={values.phone}
                    onChange={(e) => {
                      const value = e.target.value
                      setFieldValue("phone", value.replace(/\D/g, ""))
                    }}
                    isInvalid={!!errors.phone}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            )}
            <Button
              type="submit"
              variant="dark"
              onClick={() => setIsSubmitClicked(true)}
              disabled={authRequest.isLoading}
              className="mt-4 w-100 d-block"
            >
              {submitButtonText}
            </Button>
          </Form>
        )}
      </Formik>

      {authRequest.isError && (
        <Alert variant="danger" className="mt-4" style={{ maxWidth: "50%" }}>
          {errorText}
        </Alert>
      )}
      <p className="mt-5">{hint}</p>
    </Container>
  )
}
