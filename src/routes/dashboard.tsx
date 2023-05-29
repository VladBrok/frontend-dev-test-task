import useCurrentUser from "../hooks/use-current-user"

export default function Dashboard() {
  const user = useCurrentUser()

  if (!user) {
    return <></>
  }

  return <>Dashboard: {JSON.stringify(user)}</>
}
