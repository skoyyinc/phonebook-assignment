/** @jsxRuntime classic */
/** @jsx jsx */
import { Palette } from "../css/palette"
import { createStyles } from "../types/emotion-styles"
import { jsx } from "@emotion/react"
import ErrorState from "./ErrorState"
import { Contact } from "../gql/schema"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useCallback, useContext } from "react"
import { CacheContext, FavoriteContext } from "../App"
import { Navigate, redirect, useNavigate } from "react-router-dom"
import { useMutation } from "@apollo/client"
import { DELETE_CONTACT } from "../gql/queries"
import LoadingState from "./LoadingState"



const ContactTableStyles = createStyles({
    self : {
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
            width:"25%",
            overflow: "hidden",
        },
        "& td" : {
            textAlign: "left",
            fontSize: "12px",
            padding: "1.2em",
            color: Palette.textPrimary,
            overflow: "hidden",
            textOverflow: "ellipsis"
            
        },
        "& tr" : {
            ":hover" : {
                backgroundColor: "#808080"
            },
            cursor: "pointer",
            position: "relative",
            zIndex: 0
        }
    },
    toolButton : {
        
        padding: "0.5em",
        borderRadius: "50%",
        background: "none",
        boxShadow: "none",
        border: "none",
        outline: "none",
        transition: "ease-in-out",
        transitionProperty: "all",
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
        transitionDuration: "150ms",
        zIndex: 10
    },
    removeFavoriteButton : {
        ":hover" : {color: Palette.textSecondary},
         cursor: "pointer",
         color: "yellow",
         position: "relative",
         zIndex: 999
    },
    addFavoriteButton : {
        ":hover" : {color: "yellow"},
         cursor: "pointer",
         color: Palette.textSecondary,
         position: "relative", 
         zIndex: 999

    },
    phoneNumberWrapper : {
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        "& ul" : {
            listStyleType: "none", 
            padding:0, width: "9em", 
            textOverflow: "ellipsis",
            "& li": {
                overflow:"hidden" ,
                textOverflow: "ellipsis"
            }
        }
    },
    tableActionWrapper : {
        display: "flex",
        justifyContent: "start", 
        alignItems: "center", 
        width: "25%" 
    }
    
})


const ContactTable = ({ data, isFavorite} : { data: Contact[] | undefined, isFavorite : boolean}) => {
    let navigate = useNavigate(); 
    const {data: favorites, saveFavorites} = useContext(FavoriteContext);
    const [deleteContact, {loading: deleteLoading, error: deleteError, data: deleted}] = useMutation(DELETE_CONTACT)
    const persistor = useContext(CacheContext)

    const clearCache = useCallback(() => {
        if (!persistor) {
            return;
        }
        persistor.purge();
        }, [persistor]);

    const AddToFavorites = useCallback((contact : Contact) => {
        console.log(favorites)
        if(favorites){
            try {
                const updatedFavorites = [...favorites, contact]
                localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                saveFavorites(updatedFavorites)
            } catch {
                return <ErrorState msg={'Unknown Error'}/>
            }
            
            
        } 
      
    },[favorites,saveFavorites])

    const RemoveFromFavorites = useCallback((id : number) => {
        console.log(favorites)
        if(favorites){
            try {
                const updatedFavorites = favorites.filter((contact) =>  contact.id !== id)
                localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                saveFavorites(updatedFavorites)
            } catch {
                return <ErrorState msg={'Unknown Error'}/>
            }
            
            
        } 
      
    },[favorites,saveFavorites])
    
    
    if(deleteError) return <ErrorState msg={deleteError.message}/>
    if(deleted) {
        clearCache()
        window.location.reload()
    }


    return (
        <table css={ContactTableStyles.self}>
                    <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Phone Number</th>
                        
                    </tr>
                    </thead>
                    <tbody>
                    
                    {data && data?.length > 0 ? data?.map(({id, first_name, last_name, phones}) => {
                        
                            return (
                                
                                <tr key={id} >
                                    <td onClick={() => {navigate(`/contact?id=${id}`)}}>
                                        {first_name}
                                    </td>
                                    <td onClick={() => {navigate(`/contact?id=${id}`)}}>
                                        {last_name}
                                    </td>
                                    <td 
                                     css={ContactTableStyles.phoneNumberWrapper}
                                     >
                                        <ul onClick={() => {navigate(`/contact?id=${id}`)}}>
                                            {phones.map((numbers,i) => {
                                                
                                                return <li key={`${id}${i}`}>{numbers.number}</li>
                                            })}
                                        </ul>
                                        
                                        <div css={ContactTableStyles.tableActionWrapper}>
                                            <button 
                                                css={([ContactTableStyles.toolButton])} 
                                                
                                                >
                                                    <FontAwesomeIcon 
                                                    icon={"trash"} 
                                                    fontSize={"1.25em"} 
                                                    css={[ContactTableStyles.addFavoriteButton, {":hover": {color: Palette.destructive}}]}
                                                    onClick={() => {
                                                        RemoveFromFavorites(id)
                                                        deleteContact({variables: {id: id}})
                                                    }}
                                                    />
                                            </button>
                                            {isFavorite ? (
                                                <button 
                                                css={([ContactTableStyles.toolButton])} 
                                                
                                                >
                                                    <FontAwesomeIcon 
                                                    icon={"star"} 
                                                    fontSize={"1.25em"} 
                                                    css={ContactTableStyles.removeFavoriteButton}
                                                    onClick={() => {
                                                        RemoveFromFavorites(id)
                                                    }}
                                                    />
                                                </button>
                                            ) : (
                                                <button 
                                                css={([ContactTableStyles.toolButton])} 
                                                
                                                >
                                                    <FontAwesomeIcon 
                                                    icon={"star"} 
                                                    fontSize={"1.25em"} 
                                                   
                                                    css={ContactTableStyles.addFavoriteButton }
                                                    onClick={() => {
                                                        AddToFavorites({
                                                            id: id,
                                                            first_name: first_name,
                                                            last_name: last_name,
                                                            phones: phones
                                                        })
                                                    }}
                                                    />
                                                </button>
                                            )}
                                            
                                        </div>
                                    </td>
                                </tr>
                            )
                        
                    }) : (
                        <tr css={({":hover" : {backgroundColor : Palette.backgroundHover+"!important"}})}>
                            <td css={({ padding:"2em", color: Palette.textPrimary, justifyContent: "center", maxWidth: "4rem"})}>
                                <p css={{width: "10rem"}}>No data found</p>
                            </td>
                        </tr>
                    )}
                    
                    </tbody>
                    </table>
    )
}

export default ContactTable