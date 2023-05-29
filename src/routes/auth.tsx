interface IAuthProps {
  action: "register" | "login"
}

export default function Auth(props: IAuthProps) {
  return <>Auth: {props.action}</>
}
