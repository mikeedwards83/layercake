import { icons } from "./icons"

interface IconProps {
    iconName:string
    color?: string
    size:number
}

export const Icon = ({iconName, color, size}:IconProps) =>{

    const selectedIcon = icons.find((icon) => icon.name === iconName)
    const SelectedIconComponent = selectedIcon?.component || icons[0].component;
    
    return (
        <>
           <SelectedIconComponent size={size} style={{ color }} />
        </>
    )
}