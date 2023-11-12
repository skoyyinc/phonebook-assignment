/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from '@emotion/react'
import MaxWidthWrapper from "./MaxWidthWrapper";
import { createStyles } from '../types/emotion-styles';
import { Palette, Theme } from '../css/palette';
import { mq } from '../css/breakpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';
import AutoComplete from './AutoComplete';
import {debounce} from "lodash"
import { Link } from 'react-router-dom';


const NavbarStyles = createStyles({
    self : {
        paddingTop: "1rem",
        paddingBottom: "1rem",
        left: 0,
        right: 0,
        top: 0,
        zIndex: 30,
        width: "100%",

    },

    toolbar : {
        display: "flex",
        height: "3.5rem",
        alignItems: "center",
        [mq[1]] : {
            paddingRight:"3em"
        }
        
    },

    brandImage : {
        marginLeft: "1em",
        marginTop: "2em",
        marginBottom: "2em"
    },

    searchWrapper : {
        display: "flex",
        [mq[1]] : {
            width:"25rem",
            marginLeft:"5em"
        },
        width: "100%",
        marginLeft: "2em",
        alignItems: "center",
        marginBottom: "0.7rem",
        padding: "0.5rem",
        paddingLeft: "1.25em",
        
        borderRadius: "32px",
        position: "relative"
        
    },

    searchBar : {
        background: "none",
        border: "none",
        boxShadow: "none",
        outline: "none",
        width: "90%",
        fontSize: "0.9em",
        zIndex: 10
    },

    searchButton : {
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

    searchSuggestionWrapper : {
        position: "absolute",
        height: "auto",
        minHeight: "8rem",
        width: "100%",
        top: "0",
        left: 0,
        zIndex: 5,
        borderRadius: "32px",
        
    },

    searchSuggestionList : {
        marginTop:"3em",
        paddingLeft: 0,
        borderTop: "solid 1px grey",
        listStyleType: "none",
        marginBottom: "2em"
    },

    searchSuggestionListItem : {
        padding:"1em",
        "& p,h6" : {
            margin: 0,
            fontSize: "0.9em",
            color: Palette.textLight
        },
        ":hover" : {
            backgroundColor : "#e8e8e8"
        },
        paddingLeft: "2em",
        cursor: "pointer"
        
    }

})



const Navbar = () => {
    
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const wrapperRef = useRef<null | any>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [term, setTerm] = useState<string>("");

    

    //search term state
    

    useEffect(() => {
        
        function handleClickOutside(event : any) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                    setIsSearching(false)
                }
            }
        
            document.addEventListener("mousedown", handleClickOutside);

            return () => {
        
                document.removeEventListener("mousedown", handleClickOutside);
            };
    }, [wrapperRef]);
      

    
    return (        
        <nav css={([NavbarStyles.self,Theme.backgroundPrimary])}>
            <MaxWidthWrapper>
                <div css={NavbarStyles.toolbar}>
                    <Link to={"/"}>
                        <img src="/goto_logo.png" alt="goto logo" css={NavbarStyles.brandImage} width={100}/>
                    </Link>
                    <div css={([NavbarStyles.searchWrapper, !isSearching ? Theme.backgroundSecondary : Theme.backgroundWhite])} ref={wrapperRef} >

                        <input 
                        type="text"
                        css={([NavbarStyles.searchBar, !isSearching ? Theme.textPrimary : Theme.textLight])} 
                        placeholder='Search Contact' 
                        value={term}
                        onClick={() => setIsSearching(true)}
                        onChange={(e) => {
                            debounce(setSearchTerm, 500)(e.target.value)
                            setTerm(e.target.value)
                        }}
                        />

                        <button css={([NavbarStyles.searchButton,!isSearching ? Theme.backgroundSecondary : Theme.backgroundWhite])}>
                            <FontAwesomeIcon icon={"search"} fontSize={"1.5em"} css={([!isSearching ? Theme.textSecondary : Theme.textSecondary])}/>
                        </button>

                        {isSearching && (
                            <div css={([NavbarStyles.searchSuggestionWrapper, !isSearching ? Theme.backgroundSecondary : Theme.backgroundWhite, Theme.textSecondary])}  >
                                <ul css={NavbarStyles.searchSuggestionList}>
                                    <AutoComplete q={searchTerm} setIsSearching={setIsSearching}/>
                                </ul>
                            </div>
                        )}
                        
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default Navbar;