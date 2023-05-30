import "./avatar.css"
import Image from "react-bootstrap/Image"

export default function Avatar() {
  return (
    <Image
      fluid
      className="avatar"
      src="/images/placeholder.jpg"
      roundedCircle
    />
  )
}
