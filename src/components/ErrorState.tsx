
/** @jsxRuntime classic */
/** @jsx jsx */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { createStyles } from "../types/emotion-styles"
import { jsx } from "@emotion/react"
import { Theme } from "../css/palette"

const ErrorStateStyles = createStyles({
    self : {
        display: "flex",
        width: "auto",
        height: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    LoadingBox : {
        textAlign: "center"
    }
})

const ErrorState = ({msg} : {msg : string}) => {

    return (
        <div css={ErrorStateStyles.self}>
            <div css={ErrorStateStyles.LoadingBox}>
                <FontAwesomeIcon icon="ghost" bounce css={Theme.colorDestructive} size="3x"/>
                <h2 css={([{ marginTop: "1em"}, Theme.textSecondary])}>Oops, something went wrong</h2>
                <p css={([{ marginTop: "1em"}, Theme.textSecondary])}>{msg}</p>
                
            </div>
        </div>
    )

}

export default ErrorState