import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../redux/hooks"
import { IUser, selectCurrentUser } from "../redux/slices/users-slice"
import { ROUTE_PATHS } from "../lib/shared-constants"
import { useEffect } from "react"

export default function (): IUser | null {
  const navigate = useNavigate()
  const user = useAppSelector(selectCurrentUser)

  useEffect(() => {
    if (!user) {
      navigate(ROUTE_PATHS.AUTH)
    }
  }, [navigate, user])

  return user
}
