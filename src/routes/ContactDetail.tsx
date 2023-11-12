/** @jsxRuntime classic */
/** @jsx jsx */
import { Suspense, useCallback, useContext, useEffect, useState } from "react"
import LoadingState from "../components/LoadingState"
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom"
import { useMutation, useQuery } from "@apollo/client"
import { ADD_NUMBER_TO_CONTACT, DELETE_CONTACT, DELETE_NUMBER, GET_CONTACT_BY_ID } from "../gql/queries"
import { AddNumberReturnData, AddNumberVars, ContactData, ContactVars, DeleteNumberReturnData, DeleteNumberVars } from "../gql/schema"
import ErrorState from "../components/ErrorState"
import { createStyles } from "../types/emotion-styles"
import { Palette, Theme } from "../css/palette"
import { jsx } from "@emotion/react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { CacheContext, FavoriteContext } from "../App"
import { mq } from "../css/breakpoints"

const ContactDetailStyles = createStyles({
    toolbar : {
        width: "100%",
        marginTop: "1em",
        paddingLeft: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "start",

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
        display: "inline-block",
        padding: "0",
        width: "90%",
        marginLeft: "2rem",
        [mq[1]] : {
            padding: "2em",
            display: "flex"
        },
       
    },
    userIconWrapper: {
        display: "none",
        width: "5em",
        height: "5em",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Palette.backgroundHover,
        borderRadius: "50%",
        margin : "auto",
        marginBottom: "1em",
        [mq[1]] : {
            display: "flex"
        }

    },
    details : {
        "& h2" : {
            marginBottom: ".25em"
        },
        "& p": {
            color: Palette.textSecondary
        },
        marginLeft: "0.5em",
        marginTop: "1em",
        [mq[1]] : {
            marginLeft: "2em",
            marginTop : 0
        }

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
        display: "inline-block",
        alignItems: "center",
        marginBottom: "1em",
        [mq[1]] : {
            display: "flex"
        }
    },
    input : {
        border: "none",
        outline: "none",
        borderRadius: "12px",
        marginRight: "0.5em",
        padding: "0.5em"
    },
    buttonWrapper : {
        display: "inline-block",
        justifyContent: "start",
        marginTop: "1em",
        [mq[1]] : {
            marginTop: 0
        }
    },
    numberWrapper :{
        display: "flex",
        maxWidth: "8em",
        textOverflow: "ellipsis",
        justifyContent: "start",
        alignItems: "center",
        ":hover *" : {
            display : "block"
        }
    },
    deleteNumberButton : {
         display: "none",
        ":hover" : {color: Palette.destructive},
         cursor: "pointer",
         color: Palette.textSecondary,
         position: "relative", 
         zIndex: 999,
         marginRight: "1em"

    },
})


const ContactDetail = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [addNumber, {loading: addLoading, error: addError, data: addSuccess}] = useMutation<AddNumberReturnData>(ADD_NUMBER_TO_CONTACT)
    const [deleteContact, {loading: deleteLoading, error: deleteError, data: deleted}] = useMutation(DELETE_CONTACT)
    const [deleteNumber, { error: deleteNumError, data: numDeleted}] = useMutation<DeleteNumberReturnData, DeleteNumberVars>(DELETE_NUMBER)

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
      
    },[favorites, saveFavorites])

    const UpdateFavOnAdd = useCallback((id : number, addSuccess : AddNumberReturnData) => {
        if(favorites){
            try {
                const updatedFavorites = favorites.map((prev) => {
                    if (prev.id === id) {
                        prev.phones = [...addSuccess.insert_phone.returning[0].contact.phones]
                        return prev
                    }
                    return prev
                })
                localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                saveFavorites(updatedFavorites)
                return null
            } catch {
                return <ErrorState msg={'Unknown Error'}/>
            }
 
        } 
      
    },[favorites, saveFavorites])

    const UpdateFavOnDelNum = useCallback((id : number, numDeleted : DeleteNumberReturnData) => {
        if(favorites){
            try {
                const updatedFavorites = favorites.map((prev) => {
                if (prev.id === id) {
                    prev.phones = [...numDeleted.delete_phone_by_pk.contact.phones]
                    return prev
                } 
                return prev
                }
                )
                localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                saveFavorites(updatedFavorites)
                return null
            } catch {
                return <ErrorState msg={'Unknown Error'}/>
            }
            
            
        } 
      
    },[favorites, saveFavorites])

    

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
    if (addError) return <ErrorState msg={"Phone number already exists"} />
    


    if (addSuccess) { 
        UpdateFavOnAdd(Number(contactId), addSuccess)
    }
    
    if (deleteLoading) return <LoadingState />
    if (deleteError) return <ErrorState msg={deleteError.message} />
    if (deleted) {
        RemoveFromFavorites(Number(contactId))
        clearCache()
        return <Navigate to={"/"}/>
    } 

    if (deleteNumError) return <ErrorState msg={deleteNumError.message} />
    if(numDeleted) {
        UpdateFavOnDelNum(Number(contactId), numDeleted)
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

                <button
                aria-label="edit contact"
                onClick={
                    () => {
                        navigate(`/edit?id=${contactId}`)
                    }
                }
                css={([ContactDetailStyles.toolButton, Theme.backgroundSecondary])} 
                >
                    <FontAwesomeIcon icon={"edit"} fontSize={"1.25em"} color={Palette.textSecondary} />
                </button>

                <button
                aria-label="add number"
                onClick={
                    () => {
                        setIsAdding(true)
                    }
                }
                css={([ContactDetailStyles.toolButton, Theme.backgroundSecondary])} 
                >
                    <FontAwesomeIcon icon={"plus"} fontSize={"1.25em"} color={Palette.textSecondary} />
                </button>

                <button
                aria-label="delete contact"
                onClick={
                    () => {
                        deleteContact({variables : {id: contactData.id}})
                    }
                }
                css={([ContactDetailStyles.toolButton, Theme.backgroundSecondary])} 
                >
                    <FontAwesomeIcon icon={"trash"} fontSize={"1.25em"} color={Palette.textSecondary} />
                </button>
            </div>

            <div css={ContactDetailStyles.cardWrapper}>
                <div css={{textAlign: "center"}}>
                    <div css={ContactDetailStyles.userIconWrapper}>
                        <FontAwesomeIcon icon="user" color={"#e8e8e8"} size="3x"/>
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
                                <div css={ContactDetailStyles.buttonWrapper}>
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
                            </div>
                            )}
                            
                        </form>

                    {contactData.phones.map((numbers, i) => {return (
                        <div key={contactData.id+i} css={ContactDetailStyles.numberWrapper}>
                            {contactData.phones.length > 1 && (
                                <FontAwesomeIcon 
                                icon="trash" 
                                css={ContactDetailStyles.deleteNumberButton}
                                onClick={() => {
                                   deleteNumber({
                                       variables : {
                                           contact_id : Number(contactId),
                                           number: numbers.number
                                   }})
                                }}
                                />
                            )}
                            

                            <p>{numbers.number}</p>
                        </div> 
                    )})}

                </div>
            </div>
            
        </Suspense>
    )
}

export default ContactDetail