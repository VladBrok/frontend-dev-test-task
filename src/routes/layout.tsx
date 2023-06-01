import { Outlet } from "react-router-dom"
import Header from "../components/header/header"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import { setToast } from "../redux/slices/toast-slice"
import Toast from "react-bootstrap/Toast"
import ToastContainer from "react-bootstrap/ToastContainer"

export default function Layout() {
  const toast = useAppSelector((state) => state.toast)
  const dispatch = useAppDispatch()

  return (
    <>
      <Header />
      <div className="mt-5 pt-5">
        <Outlet />
        <ToastContainer className="p-3" position="bottom-end">
          <Toast
            onClose={() => dispatch(setToast({ isActive: false }))}
            show={toast.isActive}
            delay={3000}
            autohide
            bg="success"
          >
            <Toast.Body className="text-white">{toast.text}</Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    </>
  )
}
