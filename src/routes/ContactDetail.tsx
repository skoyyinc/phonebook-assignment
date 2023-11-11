/** @jsxRuntime classic */
/** @jsx jsx */
import { Suspense, useCallback, useContext, useEffect, useState } from "react"
import LoadingState from "../components/LoadingState"
import { Link, Navigate, useLocation } from "react-router-dom"
import { useMutation, useQuery } from "@apollo/client"
import { ADD_NUMBER_TO_CONTACT, DELETE_CONTACT, GET_CONTACT_BY_ID } from "../gql/queries"
import { AddContactVars, AddNumberVars, ContactData, ContactVars, DeleteContactVars } from "../gql/schema"
import ErrorState from "../components/ErrorState"
import { createStyles } from "../types/emotion-styles"
import { Palette, Theme } from "../css/palette"
import { jsx } from "@emotion/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CacheContext, FavoriteContext } from "../App"

const ContactDetailStyles = createStyles({
    toolbar : {
        width: "100%",
        marginTop: "1em",
        paddingLeft: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",

    },
    toolButton : {
        color: Palette.textSecondary,
        width: "2em",
        height: "2em",
        marginLeft: "1em",
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
            backgroundColor: Palette.backgroundHover
        },
       
        ":disabled" : {
            color: Palette.backgroundHover,
            cursor: "default"
        },
        ":disabled:hover" : {
            backgroundColor: Palette.backgroundSecondary
        },
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    cardWrapper : {
        display: "flex",
        padding: "2em"
    },
    userIconWrapper: {
        display: "flex",
        width: "5em",
        height: "5em",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Palette.backgroundHover,
        borderRadius: "50%",
        margin : "auto",
        marginBottom: "1em",
        

    },
    details : {
        "& h2" : {
            marginBottom: ".25em"
        },
        "& p": {
            color: Palette.textSecondary
        },
        marginLeft: "2em"
    },
    addMoreButton : {
        border: "none",
        outline: "none",
        boxShadow: "none",
        padding: ".5em",
        paddingLeft: "1em",
        paddingRight: "1em",
        backgroundColor: Palette.tertiary,
        borderRadius: "12px",
        color: Palette.textPrimary,
        cursor: "pointer",
        transition: "ease-in 150ms",
        ":hover" : {
            backgroundColor: Palette.secondary
        },
    },
    inputWrapper : {
        display: "flex",
        alignItems: "center",
        marginBottom: "1em"
    },
    input : {
        border: "none",
        outline: "none",
        borderRadius: "12px",
        marginRight: "0.5em",
        padding: "0.5em"
    }
})


const ContactDetail = () => {
    const location = useLocation()
    const [addNumber, {loading: addLoading, error: addError, }] = useMutation(ADD_NUMBER_TO_CONTACT)
    const [deleteContact, {loading: deleteLoading, error: deleteError, data: deleted}] = useMutation(DELETE_CONTACT)
    const {data: favorites, saveFavorites} = useContext(FavoriteContext);
    const persistor = useContext(CacheContext)

    const clearCache = useCallback(() => {
        if (!persistor) {
            return;
        }
        persistor.purge();
        }, [persistor]);
    

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

    

    const [isAdding, setIsAdding] = useState<boolean>(false)
    const queryParameters = new URLSearchParams(location.search)
    const contactId = queryParameters.get("id")

    const {loading, error, data} = useQuery<ContactData, ContactVars>(GET_CONTACT_BY_ID, {
        variables: {
            id: Number(contactId)
        },
        fetchPolicy: "network-only"
    })

    useEffect(() => {
        setIsAdding(false)
    },[data])

    if (addLoading) return <LoadingState />
    if (addError) return <ErrorState msg={addError.message} />
    
    if (deleteLoading) return <LoadingState />
    if (deleteError) return <ErrorState msg={deleteError.message} />
    if (deleted) {
        clearCache()
        return <Navigate to={"/"}/>
    } 

    if (loading) return <LoadingState />
    if (error) return <ErrorState msg={error.message} />

    const contactData = data!.contact_by_pk
    if(!contactData) return <ErrorState msg="The page you are looking for does not exist"/>
    
    return (
        <Suspense fallback={<LoadingState />}>
            <div css={ContactDetailStyles.toolbar}>
                <Link
                aria-label="back home"
                to={"/"}
                css={([ContactDetailStyles.toolButton, Theme.backgroundSecondary])} 
                >
                    <FontAwesomeIcon icon={"arrow-left"} fontSize={"1.25em"} color={Palette.textSecondary} />
                </Link>
            </div>

            <div css={ContactDetailStyles.cardWrapper}>
                <div css={{textAlign: "center"}}>
                    <div css={ContactDetailStyles.userIconWrapper}>
                        <FontAwesomeIcon icon="user" color={"#e8e8e8"} size="3x"/>
                    </div>
                    <div>
                        <button css={[ContactDetailStyles.addMoreButton, {width: "100%", marginBottom: "0.5em"}]} onClick={() => {setIsAdding(true)}}>
                            Add number
                        </button>
                        <button 
                         css={[ContactDetailStyles.addMoreButton,Theme.backgroundHover, {width: "100%", marginBottom: "0.5em",":hover" : {backgroundColor: Palette.destructive} }]} 
                         onClick={async () => {
                            await RemoveFromFavorites(contactData.id)
                            deleteContact({variables : {id: contactData.id}})
                         }}>
                            Delete
                        </button>
                    </div>
                    
                </div>
                <div css={ContactDetailStyles.details}>
                    <h2 css={[Theme.textPrimary]}>{contactData.first_name} {contactData.last_name}</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget)
                            const vars : AddNumberVars = {
                                contact_id: contactData.id,
                                phone_number: String(formData.get("number"))
                            }
                            addNumber({variables: vars})
                        }}>
                            {isAdding && (
                            <div css={ContactDetailStyles.inputWrapper}>
                                <input css={ContactDetailStyles.input} type="text" placeholder="Enter new number" name="number"/>
                                <button 
                                 css={[ContactDetailStyles.addMoreButton, {marginRight: "0.5em"}]}
                                 type="submit"
                                 >
                                    Save
                                </button>
                                <button onClick={(e) => {
                                    e.preventDefault()
                                    setIsAdding(false)
                                }} css={[ContactDetailStyles.addMoreButton, Theme.backgroundHover, {":hover" : {backgroundColor: Palette.destructive}}]}>
                                    Cancel
                                </button>
                            </div>
                            )}
                            
                        </form>

                    {contactData.phones.map((numbers, i) => {return <p key={contactData.id+i}>{numbers.number}</p>})}

                </div>
            </div>
            
        </Suspense>
    )
}

export default ContactDetail