/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { createStyles } from "../types/emotion-styles"
import { Palette } from '../css/palette'
import { Link } from 'react-router-dom'



const AddButtonStyles = createStyles({
    self : {
        width: "60%!important",
        marginLeft: "auto",
        marginRight: "auto",
        paddingTop: ".5em",
        paddingBottom: ".5em",
        display: "flex",
        justifyContent: "around",
        paddingLeft: "2em",
        outline: "none",
        border: "none",
        backgroundColor: Palette.tertiary,
        color: Palette.textPrimary,
        borderRadius: "12px",
        cursor: "pointer",
        transition: "ease-in 150ms",
        ":hover" : {
            backgroundColor: Palette.secondary
        },
        textDecoration: "none"
    }
})

const AddButton = () => {
    return (
        
        <Link css={AddButtonStyles.self} to={"/add"} aria-label='add new contact'>
            
            <p css={({margin:0, fontSize: "1em"})}><FontAwesomeIcon icon="plus" css={({ marginRight: "1em"})}/>New</p>
            
        </Link>
        
    )
}

export default AddButton