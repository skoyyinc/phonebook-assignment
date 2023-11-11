import { createStyles } from "../types/emotion-styles"

interface ColorPalette {
    primary: string,
    secondary: string,
    tertiary: string,
    destructive: string,
    background: string,
    backgroundSecondary: string,
    backgroundHover: string,
    textPrimary: string,
    textSecondary: string,
    textLight: string,
    backgroundWhite: string

}

export const Palette : ColorPalette  = {
    primary: "#00AA13",
    secondary: "#4E9F3D",
    tertiary: "#1E5128",
    destructive: "#964545",
    background: "#191A19",
    backgroundSecondary: "#393b3a",
    backgroundHover: "#636363",
    backgroundWhite: "#ffffff",
    textPrimary: "#ffffff",
    textSecondary: "#c7c9c8",
    textLight: "#171717",
    

}

export const Theme = createStyles({
    backgroundPrimary: {
        backgroundColor: Palette.background
    },
    backgroundSecondary: {
        backgroundColor: Palette.backgroundSecondary
    },
    backgroundDestructive: {
        backgroundColor: Palette.destructive
    },
    backgroundWhite: {
        backgroundColor: Palette.backgroundWhite
    },
    backgroundHover: {
        backgroundColor: Palette.backgroundHover
    },
    colorPrimary: {
        color: Palette.primary
    },
    colorSecondary: {
        color: Palette.secondary
    }, 
    colorTertiary: {
        color: Palette.tertiary
    }, 
    colorDestructive : {
        color: Palette.destructive
    },
    textPrimary: {
        color: Palette.textPrimary
    },
    textSecondary: {
        color: Palette.textSecondary
    },
    textLight: {
        color: Palette.textLight
    }
    
    

})