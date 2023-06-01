import Container from "react-bootstrap/Container"
import Button from "react-bootstrap/Button"
import {
  isRouteErrorResponse,
  useNavigate,
  useRouteError,
} from "react-router-dom"
import { ROUTE_PATHS } from "../lib/constants"

interface IErrorInfo {
  title: string
  text?: string
}

export default function ErrorBoundary() {
  const error = useRouteError()
  const navigate = useNavigate()

  const getErrorInfo = (): IErrorInfo => {
    if (isRouteErrorResponse(error)) {
      return {
        text: error.statusText,
        title: error.status.toString(),
      }
    }

    return {
      title: "Ошибка",
    }
  }

  const info = getErrorInfo()

  return (
    <Container
      fluid
      className="vh-100 d-flex flex-column justify-content-center align-items-center"
    >
      <h1>{info.title}</h1>
      <p>{info.text}</p>
      <Button variant="link" onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}>
        На главную
      </Button>
    </Container>
  )
}
