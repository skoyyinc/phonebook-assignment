/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react"
import { ReactElement, Suspense, useEffect, useState } from "react"
import LoadingState from "../components/LoadingState"
import { createStyles } from "../types/emotion-styles"
import { Palette, Theme } from "../css/palette"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Form, Link, Navigate, redirect } from "react-router-dom"
import { mq } from "../css/breakpoints"
import { useMutation, useQuery } from "@apollo/client"
import { AddContactVars, ContactData, ContactVars, Phone } from "../gql/schema"
import { ADD_CONTACT, GET_NAMES } from "../gql/queries"
import ErrorState from "../components/ErrorState"
import { containsObject } from "../lib/utils"

const AddContactStyles = createStyles({

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





const AddContact = () => {
    
    const [checkError, setCheckError] = useState<Error | undefined>(undefined)
    const [phoneNumbers, setPhoneNumbers] = useState<Phone[]>([])
    const [currNumber, setCurrNumber] = useState<string>("")

    const [addContact, {loading, error, data: addSuccess}] = useMutation<ContactData, AddContactVars>(ADD_CONTACT,{
        onError() {
            setCheckError(new Error("Phone number already exist"))
        },
    });
    const { error: fetchNameError, data: fetchNameData, loading: fetchNameLoading} = useQuery<ContactData, AddContactVars>(GET_NAMES, {
        fetchPolicy: 'network-only',
      });
    
    
    

    if (loading) return <LoadingState />
    if (fetchNameError)  return <ErrorState msg={fetchNameError.message}/>
    if (addSuccess) return <Navigate to="/" />
    if (fetchNameData){

    const checkNames = (data : AddContactVars) => {
        const format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
        const {first_name : newFirstName, last_name: newLastName} = data
        console.log(data)
        if (format.test(newFirstName) || format.test(newLastName))
            throw new Error("Name cannot contain special characters")
        
        fetchNameData.contact.forEach(({first_name, last_name}) => {
            if((newFirstName === first_name && newLastName === last_name)) 
                throw new Error("Name already exists")

        if(data.phones.length === 0)
            throw new Error("Please add at least 1 number")
        })
    }
        

    return (
        <Suspense fallback={<LoadingState />}>
            
            
            <div css={AddContactStyles.toolbar}>
                <Link
                aria-label="back home"
                to={"/"}
                css={([AddContactStyles.toolButton, Theme.backgroundSecondary])} 
                >
                    <FontAwesomeIcon icon={"arrow-left"} fontSize={"1.25em"} color={Palette.textSecondary} />
                </Link>
            </div>

            <div css={AddContactStyles.formWrapper}>
                
                <Form onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const test = Object.fromEntries(formData)
                    
                    const data : AddContactVars = {
                        first_name : String(formData.get("first_name")),
                        last_name : String(formData.get("last_name")),
                        phones : phoneNumbers,
                    }
                    try {
                        checkNames(data)
                        addContact({variables : data})
                    } catch(err : any) {
                        setCheckError(err)
                    }

                    
                    
                }}>
                    <div css={AddContactStyles.toolbar}>
                    <h3 css={Theme.textPrimary}>Add New Contact</h3>
                    <button type="submit" css={AddContactStyles.saveButton}>
                        Save
                    </button>
                    </div>
                    
                    <hr css={AddContactStyles.hr}/>

                    {checkError && (
                    <div css={AddContactStyles.error}>
                        <div css={{padding: "2em"}}>
                            <h5 css={Theme.textPrimary}>Error : {checkError.message}</h5>
                        </div>
                        <button css={AddContactStyles.dismissButton} onClick={() => {setCheckError(undefined)}}>
                            Dismiss
                        </button>
                    </div>
                    )}
                        <div css={AddContactStyles.formGroup}>
                            <div css={AddContactStyles.inputWrapper}>

                                <label 
                                htmlFor="#firstname" 
                                css={([Theme.textSecondary, AddContactStyles.label])}
                                >
                                First Name
                                </label>

                                <input 
                                type="text" 
                                css={AddContactStyles.input} 
                                id="firstname"
                                name="first_name"
                                placeholder="Enter first name . . ."
                                required
                                />

                            </div>
                            <div css={AddContactStyles.inputWrapper}>

                                <label 
                                htmlFor="#lastname" 
                                css={([Theme.textSecondary, AddContactStyles.label])}
                                >
                                Last Name
                                </label>

                                <input 
                                type="text" 
                                css={AddContactStyles.input} 
                                id="lastname"
                                name="last_name"
                                placeholder="Enter last name . . ."
                                required
                                />

                            </div>

                        </div>
                        <div css={AddContactStyles.formGroup}>
                            <div css={AddContactStyles.inputWrapper}>

                                <label 
                                htmlFor="#phonenumber" 
                                css={([Theme.textSecondary, AddContactStyles.label])}
                                >
                                Phone Number{`(s)`}
                                </label>

                                <input 
                                type="text" 
                                css={AddContactStyles.input} 
                                id="phonenumber"
                                name="phone"
                                placeholder="Enter phone number . . ."
                                value={currNumber}
                                onChange={(e) => {setCurrNumber(e.target.value)}}
                                
                                />

                            </div>
                            <div css={AddContactStyles.inputWrapper} >
                                <button 
                                 css={[AddContactStyles.dismissButton,Theme.backgroundHover, {":hover" : {backgroundColor: "GrayText"}, marginRight:".5em"}]}
                                 onClick={(e) => {
                                    e.preventDefault()
                                    if(currNumber)
                                   
                                    setPhoneNumbers((prev) => [...prev,{number: currNumber}])
                                    }}>
                                    <FontAwesomeIcon icon={"plus"}/>
                                </button>
                                {phoneNumbers && phoneNumbers.length > 0 && (
                                    <button 
                                    css={[AddContactStyles.dismissButton,Theme.backgroundHover, {":hover" : {backgroundColor: "GrayText"}}]}
                                    onClick={(e) => {
                                       e.preventDefault()
                                       if(currNumber)
                                      
                                       setPhoneNumbers((prev) => {
                                           prev.pop()
                                           return [...prev]
                                       })
                                       }}>
                                       <FontAwesomeIcon icon={"minus"}/>
                                   </button>
                                )}
                                
                            </div>
                            
                        </div>
                        {phoneNumbers && phoneNumbers.length > 0 && (
                            <div css={AddContactStyles.formGroup} >
                            <div>
                                <label css={[AddContactStyles.label, Theme.textPrimary]}>Adding Numbers :</label>
                                <ul css={Theme.textPrimary}>
                                    {phoneNumbers.map((num,i) => {
                                        return <li key={i} >{num.number}</li>
                                    })}
                                </ul>
                            </div>
                            
                        </div>
                        )}
                        
                </Form>
                                
            </div>
        </Suspense>
    ) }

    return null
}

export default AddContact