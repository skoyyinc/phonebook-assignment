
/** @jsxRuntime classic */
/** @jsx jsx */

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { createStyles } from "../types/emotion-styles"
import { css, jsx } from "@emotion/react"
import { Theme } from "../css/palette"

const LoadingStateStyles = createStyles({
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

const LoadingState = () => {

    return (
        <div css={LoadingStateStyles.self}>
            <div css={LoadingStateStyles.LoadingBox}>
                <FontAwesomeIcon icon="spinner" spin css={Theme.colorPrimary} size="3x"/>
                <h2 css={([{ marginTop: "1em"}, Theme.textSecondary])}>Loading ...</h2>
            </div>
        </div>
    )

}

export default LoadingState