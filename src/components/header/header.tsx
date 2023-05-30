import { Suspense, lazy, useEffect, useState } from "react"
import Container from "react-bootstrap/Container"
import Navbar from "react-bootstrap/Navbar"
import { useLocation, useNavigate } from "react-router-dom"
import "./header.css"
import Spinner from "react-bootstrap/Spinner"
import { ROUTE_PATHS } from "../../lib/constants"
import useCurrentUser from "../../hooks/use-current-user"
import Avatar from "../avatar/avatar"

const OffcanvasHeader = lazy(() => import("react-bootstrap/OffcanvasHeader"))
const OffcanvasBody = lazy(() => import("react-bootstrap/OffcanvasBody"))
const Nav = lazy(() => import("react-bootstrap/Nav"))
const NavLink = lazy(() =>
  import("react-bootstrap/Nav").then((module) => ({
    default: module.default.Link,
  })),
)

interface IMenuLink {
  route: string
  name: string
}

const MENU_LINKS: IMenuLink[] = [
  {
    route: ROUTE_PATHS.DASHBOARD,
    name: "Личный кабинет",
  },
  {
    route: ROUTE_PATHS.BOOKING,
    name: "Бронирование",
  },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [shouldShowOffcanvasContent, setShouldShowOffcanvasContent] =
    useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const user = useCurrentUser()

  const goTo = (route: string): void => {
    navigate(route)
    setIsMenuOpen(false)
  }

  useEffect(() => {
    if (isMenuOpen) {
      setShouldShowOffcanvasContent(true)
    }
  }, [isMenuOpen])

  const spinner = <Spinner animation="grow" className="mx-auto mt-5" />

  return (
    <div>
      <Navbar
        fixed="top"
        bg="dark"
        variant="dark"
        expand={false}
        className="mb-3 p-2"
      >
        <Container fluid>
          <div className="d-flex gap-4">
            <Navbar.Toggle onClick={() => setIsMenuOpen((prev) => !prev)} />
            <Navbar.Brand href="#">
              Ресторан &quot;Битый пиксель&quot;
            </Navbar.Brand>
          </div>
          <div className="d-flex gap-3 align-items-center">
            <Navbar.Text className="text-light fs-5">{user?.login}</Navbar.Text>
            <Avatar />
          </div>
          <Navbar.Offcanvas
            placement="start"
            show={isMenuOpen}
            onHide={() => setIsMenuOpen(false)}
          >
            <Suspense fallback={spinner}>
              {shouldShowOffcanvasContent && (
                <>
                  {" "}
                  <OffcanvasHeader closeButton></OffcanvasHeader>
                  <OffcanvasBody>
                    <Nav
                      activeKey={location.pathname}
                      className="d-flex flex-column gap-4 mt-5 px-4"
                    >
                      {MENU_LINKS.map((link, i) => (
                        <NavLink
                          eventKey={link.route}
                          onClick={() => goTo(link.route)}
                          className="header__link py-3 px-4 rounded-2 "
                          key={i}
                        >
                          {link.name}
                        </NavLink>
                      ))}
                    </Nav>
                  </OffcanvasBody>
                </>
              )}
            </Suspense>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </div>
  )
}
