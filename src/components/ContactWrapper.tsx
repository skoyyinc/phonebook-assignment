/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react'
import { createStyles } from "../types/emotion-styles"
import { Palette, Theme } from '../css/palette'
import { mq } from '../css/breakpoints'
import { ReactNode } from 'react'





const ContactWrapperStyles = createStyles({
    self : {
        
        width:"100%",
        height: "auto",
        paddingLeft: "0",
        paddingRight: "0",

        [mq[1]] : {
            paddingLeft: "1.8em",
        }
    },

    contactBox : {
        width: "100%",
        height: "100%",
        borderRadius: "12px",
        overflowY: "scroll",
        overflowX: "hidden"
    },

    toolbar : {
        width: "100%",
        padding: "0.5em",
        paddingBottom:0
    },

    toolButton : {
        
        padding: "0.5em",
        borderRadius: "50%",
        backgroundColor: Palette.backgroundSecondary,
        boxShadow: "none",
        border: "none",
        outline: "none",
        cursor: "pointer",
        transition: "ease-in-out",
        transitionProperty: "all",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        transitionDuration: "150ms",
        ":hover" : {
            backgroundColor: Palette.tertiary
        },
        zIndex: 10
    
       
    },

    table : {
        marginTop:"1em",
        marginBottom: "3em",
        borderCollapse: "collapse",
        backgroundColor: Palette.backgroundHover,
        overflow: "hidden",
        width: "100%",
        borderRadius: "12px",
        "& th" : {
            textAlign: "left",
            fontSize: "12px",
            padding: "12px",
            backgroundColor: Palette.tertiary,
            color: Palette.textSecondary,
            width:"25%"
        },
        "& td" : {
            textAlign: "left",
            fontSize: "12px",
            padding: "1.2em",
            color: Palette.textPrimary,
            
        },
        "& tr" : {
            ":hover" : {
                backgroundColor: "#808080"
            }
        }
    }
    
})


const ContactWrapper = ({children} : {children : ReactNode}) => {
    return (
        
        <div css={([ContactWrapperStyles.self])}>           
            <div css={([ContactWrapperStyles.contactBox,Theme.backgroundSecondary])}>
                {children}
            </div>
        </div>
    
    )
}

export default ContactWrapper