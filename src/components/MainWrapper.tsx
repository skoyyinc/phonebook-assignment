/** @jsxRuntime classic */
/** @jsx jsx */
import { css, jsx } from '@emotion/react'
import { Palette } from "../css/palette"
import { createStyles } from "../types/emotion-styles"
import MaxWidthWrapper from "./MaxWidthWrapper"
import { mq } from '../css/breakpoints'
import AddButton from './AddButton'
import ContactWrapper from './ContactWrapper'
import { Outlet } from 'react-router-dom'



const MainWrapperStyles = createStyles({
    self : {
        display: "flex",
        width: "100%",
        height: "80vh",
        marginTop: "1em"
        // backgroundColor: Palette.backgroundSecondary
    },

    sideMenu : {
        display: "none",

        [mq[1]] : {
            display: "block",
            
        },
        width: "12em",
        borderRight: `solid 1px ${Palette.backgroundSecondary}`
        

    }
    

    
})

const MainWrapper = () => {
    
    return (
        <MaxWidthWrapper>
            <main css={MainWrapperStyles.self}>
                <div css={MainWrapperStyles.sideMenu}>

                    <div css={({display: "flex", justifyContent: "center", alignItems: "center"})}>
                        <AddButton />
                    </div>

                </div>
                
                <ContactWrapper>
                    <Outlet/>
                </ContactWrapper>
                
            </main>
        </MaxWidthWrapper>
    )
}

export default MainWrapper