/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react'
import { createStyles } from '../types/emotion-styles'
import { css } from "@emotion/react"
import { ReactNode } from "react"

const MaxWidthWrapperStyles = createStyles({
    self: {
        marginLeft: "auto",
        marginRight: "auto", 
        width: "90%",
        maxWidth:  "1280px",
        paddingLeft: "0.625rem",
        paddingRight: "0.625rem",
        
    }
    
})

const MaxWidthWrapper = ({
    mergedStyle,
    children
} : {
    mergedStyle?: any
    children: ReactNode
}) => {

    return <div css={([MaxWidthWrapperStyles.self, mergedStyle])}>
        {children}
    </div>
}

export default MaxWidthWrapper