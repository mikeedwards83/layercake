import { Button } from "react-bootstrap"
import { TbPlus } from "react-icons/tb"
import type { ButtonProps } from "../types"



 const  ButtonAdd = (props: ButtonProps) =>(

<Button variant="primary" type="submit">
  <TbPlus /> Add {props.title}
</Button>
)

export default ButtonAdd