import { Outlet } from "react-router-dom"
import Header from "../components/header/header"

export default function Layout() {
  return (
    <>
      <Header />
      <div className="mt-5 pt-5">
        <Outlet />
      </div>
    </>
  )
}
