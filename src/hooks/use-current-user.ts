import { useNavigate } from "react-router-dom"
import { useAppSelector } from "../redux/hooks"
import { selectCurrentUser } from "../redux/slices/users-slice"
import { ROUTE_PATHS } from "../lib/constants"
import { useEffect } from "react"
import { IUser } from "../lib/types"

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
