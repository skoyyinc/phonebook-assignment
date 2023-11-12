/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react"
import { Suspense, useContext, useState } from "react"
import LoadingState from "../components/LoadingState"
import { createStyles } from "../types/emotion-styles"
import { Palette, Theme } from "../css/palette"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Form, Link, Navigate, useLocation } from "react-router-dom"
import { mq } from "../css/breakpoints"
import { useMutation, useQuery } from "@apollo/client"
import { EditContactVars, ContactData, ContactVars } from "../gql/schema"
import { EDIT_CONTACT, GET_CONTACT_BY_ID, GET_NAMES } from "../gql/queries"
import ErrorState from "../components/ErrorState"
import { FavoriteContext } from "../App"

const EditContactStyles = createStyles({

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
    formWrapper : {
        paddingLeft: "1.5em",
        paddingRight: "1.5em",

    },
    form : {
        marginTop: "2em"
    },
    hr : {
        boxShadow: "none",
        outline: "none",
        border: "solid 1px white"
    },
    formGroup : {
        display : "block",
        width: "100%",
        [mq[1]] : {
            display: "flex",
            marginTop: "1em",
            justifyContent: "start",
            alignItems: "center"
        },
        
    },
    inputWrapper : {
        width: "100%",
        marginBottom: "1em",
        [mq[1]] : {
            marginBottom: 0
        },
        
    },
    input : {
        width: "90%",
        [mq[1]] : {
            width: "80%"
        },
        [mq[2]] : {
            width: "85%"
        },
        border: "none",
        outline: "none",
        padding: "1em",
        paddingLeft : "1.5em",
        backgroundColor: Palette.backgroundHover,
        borderRadius: "32px",
        color: Palette.textPrimary,
        ":focus" : {
            backgroundColor: "white",
            color: Palette.textLight
        },
        fontSize: "1em"

        
    },
    label : {
        marginLeft: ".5em"
    },
    dismissButton : {
        border: "none",
        outline: "none",
        boxShadow: "none",
        padding: ".5em",
        paddingLeft: "1em",
        paddingRight: "1em",
        backgroundColor: Palette.backgroundSecondary,
        borderRadius: "12px",
        marginLeft: "0.5em",
        color: Palette.textSecondary,
        cursor: "pointer",
        marginRight: "2em",
        transition: "ease-in-out 150ms",
        ":hover" : {
            backgroundColor: Palette.backgroundHover
        }
    },
    saveButton: {
        border: "none",
        outline: "none",
        boxShadow: "none",
        padding: "1em",
        paddingLeft: "3em",
        paddingRight: "3em",
        backgroundColor: Palette.tertiary,
        borderRadius: "12px",
        marginLeft: "0.5em",
        color: Palette.textPrimary,
        cursor: "pointer",
        transition: "ease-in-out 150ms",

        ":hover" : {
            backgroundColor: Palette.secondary
        }
    },
    error : {
        width : "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: Palette.destructive,
        borderRadius: "12px"
    }
    
})


const EditContact = () => {
    const location = useLocation()
    const {data: favorites, saveFavorites} = useContext(FavoriteContext);

    const queryParameters = new URLSearchParams(location.search)
    const contactId = queryParameters.get("id")

    const [checkError, setCheckError] = useState<Error | undefined>(undefined)

    const [editContact, {loading: editLoading, error: editError, data: editSuccess}] = useMutation<ContactData, EditContactVars>(EDIT_CONTACT,{
        onError() {
            setCheckError(new Error("Phone number already exist"))
        },
    });
    const { error: fetchNameError, data: fetchNameData} = useQuery<ContactData, EditContactVars>(GET_NAMES, {
        fetchPolicy: 'network-only',
      });

      const {loading, error, data} = useQuery<ContactData, ContactVars>(GET_CONTACT_BY_ID, {
        variables: {
            id: Number(contactId)
        },
        fetchPolicy: "network-only"
    })

    
    

    if (editLoading) return <LoadingState />
    if (editError) return <ErrorState msg={editError.message} />

    if (loading) return <LoadingState />
    if (error) return <ErrorState msg={error.message} />

    if (fetchNameError)  return <ErrorState msg={fetchNameError.message}/>
    if (editSuccess) {

        if(favorites){
            try {
                console.log(editSuccess);
                
                const updatedFavorites = favorites.map((prev) => {
                    if (prev.id === Number(contactId)) {
                        prev.first_name = editSuccess.update_contact_by_pk!.first_name
                        prev.last_name = editSuccess.update_contact_by_pk!.last_name
                        return prev
                    }
                    return prev
                })
                localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                saveFavorites(updatedFavorites)
            } catch(err: any) {
                return <ErrorState msg={err.message}/>
            }
            
            
        } 

        return <Navigate to={`/contact?id=${contactId}`} />
    }
    if (fetchNameData && data){

    

    const contactData = data!.contact_by_pk
    if(!contactData) return <ErrorState msg="The page you are looking for does not exist"/>

    

    

    const checkNames = (data : EditContactVars) => {
        // eslint-disable-next-line
        const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
        const {first_name : newFirstName, last_name: newLastName} = data._set
      
        if (format.test(newFirstName!) || format.test(newLastName!))
            throw new Error("Name cannot contain special characters")
        
        if(newFirstName !== contactData.first_name || newLastName !== contactData.last_name) {

            fetchNameData.contact.forEach(({first_name, last_name}) => {
                if((newFirstName === first_name && newLastName === last_name)) 
                    throw new Error("Name already exists")
            })
        }
        
    }
        

    return (
        <Suspense fallback={<LoadingState />}>
            
            
            <div css={EditContactStyles.toolbar}>
                <Link
                aria-label="back home"
                to={`/contact?id=${contactId}`}
                css={([EditContactStyles.toolButton, Theme.backgroundSecondary])} 
                >
                    <FontAwesomeIcon icon={"arrow-left"} fontSize={"1.25em"} color={Palette.textSecondary} />
                </Link>
            </div>

            <div css={EditContactStyles.formWrapper}>
                
                <Form onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const data : EditContactVars = {
                        id: contactData.id,
                        _set : {
                        first_name : String(formData.get("first_name")),
                        last_name : String(formData.get("last_name")),
                       
                        }
                    }

                    try {
                        checkNames(data)
                        editContact({variables : data})
                    } catch(err : any) {
                        setCheckError(err)
                    }

                    
                    
                }}>
                    <div css={EditContactStyles.toolbar}>
                    <h3 css={Theme.textPrimary}>Add New Contact</h3>
                    <button type="submit" css={EditContactStyles.saveButton}>
                        Save
                    </button>
                    </div>
                    
                    <hr css={EditContactStyles.hr}/>

                    {checkError && (
                    <div css={EditContactStyles.error}>
                        <div css={{padding: "2em"}}>
                            <h5 css={Theme.textPrimary}>Error : {checkError.message}</h5>
                        </div>
                        <button css={EditContactStyles.dismissButton} onClick={() => {setCheckError(undefined)}}>
                            Dismiss
                        </button>
                    </div>
                    )}
                        <div css={EditContactStyles.formGroup}>
                            <div css={EditContactStyles.inputWrapper}>

                                <label 
                                htmlFor="#firstname" 
                                css={([Theme.textSecondary, EditContactStyles.label])}
                                >
                                First Name
                                </label>

                                <input 
                                type="text" 
                                css={EditContactStyles.input} 
                                id="firstname"
                                name="first_name"
                                placeholder="Enter first name . . ."
                                defaultValue={contactData.first_name}
                                required
                                />

                            </div>
                            <div css={EditContactStyles.inputWrapper}>

                                <label 
                                htmlFor="#lastname" 
                                css={([Theme.textSecondary, EditContactStyles.label])}
                                >
                                Last Name
                                </label>

                                <input 
                                type="text" 
                                css={EditContactStyles.input} 
                                id="lastname"
                                name="last_name"
                                placeholder="Enter last name . . ."
                                defaultValue={contactData.last_name}
                                required
                                />

                            </div>

                        </div>
                        
                        
                        
                </Form>
                                
            </div>
        </Suspense>
    ) }

    return null
}

export default EditContact