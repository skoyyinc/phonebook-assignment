/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react"
import { mq } from "../css/breakpoints"
import { Palette, Theme } from "../css/palette"
import { createStyles } from "../types/emotion-styles"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useQuery } from '@apollo/client';
import LoadingState from "../components/LoadingState"
import ErrorState from "../components/ErrorState"
import ContactTable from "../components/ContactTable"
import { GET_CONTACT_LIST, GET_TOTAL_COUNT } from "../gql/queries"
import { useCallback, useContext, useState } from "react"
import { ContactData, ContactVars } from "../gql/schema"
import { CacheContext, FavoriteContext } from "../App"
import AddButton from "../components/AddButton"

const ContactIndexStyles = createStyles({

    toolbar : {
        width: "95%",
        padding: "0.5em",
       
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

    
})



const GetFavoriteIds = () : number[] => {
    const {data: favorites} = useContext(FavoriteContext);
    const ids : number[] = favorites!.map((contact) => {
        return contact.id
    })

    return ids
}


const ContactIndex = () => {
    const [contacts, setContacts] = useState<ContactData>()
    const [pages, setPage] = useState(0)
    const LIMIT = 10
    const persistor = useContext(CacheContext)
    const {data: favorites} = useContext(FavoriteContext);


    const { error: totalError, data: totalData, loading: totalLoading} = useQuery<ContactData, ContactVars>(GET_TOTAL_COUNT, {
        fetchPolicy: 'network-only',
        notifyOnNetworkStatusChange: false,
        variables : {
            where : { "id" : { '_nin' : GetFavoriteIds()}}
        }
      });

      
    const items = JSON.parse(localStorage.getItem('contacts')!);
        if (items && !contacts) {
            setContacts(items);  
        }
   
    const clearCache = useCallback(() => {
        if (!persistor) {
            return;
        }
        persistor.purge();
        }, [persistor]);

    const { error, data, loading , refetch} = useQuery<ContactData, ContactVars>(GET_CONTACT_LIST, {
      variables: {
        offset: LIMIT * pages,
        limit: LIMIT,
        where : { "id" : { '_nin' : GetFavoriteIds()}},
        order_by : {"first_name" : "asc"}
      }, 
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange:true
      
    });

    const reload = useCallback((e : React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        
        clearCache()
        refetch()
        
    }, [clearCache, refetch]);

    
    
    if (totalError) return <ErrorState msg={totalError.message}/>
    if (loading || totalLoading) return <LoadingState/>
    if (error) return <ErrorState msg={error.message}/>
    
    
    
    const totalCount = totalData!.contact.length
    const contactData = data?.contact
    const currLength = LIMIT * pages + contactData!.length
    if(data)
    return (
      <div>
            <div css={ContactIndexStyles.toolbar}>
                <div css={({width: "10em", [mq[1]] : {display : "none"}})}>
                    <AddButton />
                </div>

                <button 
                css={([ContactIndexStyles.toolButton, Theme.backgroundSecondary, {marginLeft: "1em"}])} 
                
                >
                    <FontAwesomeIcon icon={"redo"} fontSize={"1.25em"} color={Palette.textSecondary} onClick={(e) => {reload(e)}}/>
                </button>
                
            </div>
        
            <div css={({padding: "1em", paddingTop:"0.5em"})}>
                
                <h3 css={Theme.textPrimary}>
                    <FontAwesomeIcon icon="star" css={({marginRight: ".5em", marginBottom:"0.05em"})}/> Favorites
                </h3>

                <ContactTable isFavorite data={favorites}/>
                
                <div css={({display: "flex", justifyContent: "space-between", width: "100%"})}>

                    <h3 css={Theme.textPrimary}>
                        <FontAwesomeIcon icon="address-book" css={({marginRight: ".5em"})}/> All Contacts
                    </h3>

                    <div css={({display: "flex", width: "50%", [mq[1]] : {width: "25%"}, justifyContent: "flex-end", alignItems: "center"})}>

                        <p css={([Theme.textSecondary, ({fontSize: ".8em"})])}>{currLength - contactData!.length + 1}-{currLength} of {totalCount}</p>

                        <button 
                         css={([ContactIndexStyles.toolButton, Theme.backgroundSecondary, {":hover" : { backgroundColor : Palette.backgroundHover}, marginRight: "1em", marginLeft: "1em"}])} 
                         onClick={() => {setPage((prev) => prev - 1)}}
                         disabled={!pages}
                         >
                         <FontAwesomeIcon 
                          icon={"chevron-left"} 
                          fontSize={"1.25em"} 
                          
                          css={({width: "1em"})}
                          />
                        </button>

                        <button 
                         css={([ContactIndexStyles.toolButton, Theme.backgroundSecondary, {":hover" : { backgroundColor : Palette.backgroundHover}}])} 
                         onClick={() => {
                            setPage((prev) => prev + 1)
                            }}
                         disabled={totalCount <= LIMIT * (pages + 1) }
                         >
                         <FontAwesomeIcon 
                          icon={"chevron-right"} 
                          fontSize={"1.25em"} 
                          css={({width: "1em"})}
                          />
                        </button>
                    </div>
                    
                </div>
                
                <ContactTable isFavorite={false} data={contactData}/>

            </div>
      </div>
    )

    return <LoadingState />
  };


export default ContactIndex