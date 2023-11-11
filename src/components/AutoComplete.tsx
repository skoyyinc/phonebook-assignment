/** @jsxRuntime classic */
/** @jsx jsx */
import { css , jsx} from "@emotion/react"
import { createStyles } from "../types/emotion-styles"
import { Palette } from "../css/palette"
import { useQuery } from "@apollo/client"
import { ContactData, ContactVars } from "../gql/schema"
import { SEARCH_CONTACT } from "../gql/queries"
import ErrorState from "./ErrorState"
import { useNavigate } from "react-router-dom"

const AutoCompleteStyles = createStyles({
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

const AutoComplete = ({q} : {q: string}) => {
    const navigate = useNavigate()
    const searchTerm = q === "" ? q : `${q}%`
    //query to get suggestions
    const { loading, error, data } = useQuery<ContactData, ContactVars>(SEARCH_CONTACT,{
        variables: {
            q: searchTerm,
            limit : 5
        },
        fetchPolicy: "network-only",
        notifyOnNetworkStatusChange: true
    });

    if(loading) return (
        null
        )
    
    if(error) return (
        <ErrorState msg={error.message} />
    )

    return (
        <div>
        
        {data && data!.contact.length > 0 ? data?.contact.map(({id, first_name, last_name, phones}) => {
            return (
                <li 
                 onClick={() => {navigate(`/contact?id=${id}`)}}
                 css={([AutoCompleteStyles.searchSuggestionListItem])} 
                 key={id}>
                  <h6>{`${first_name}, ${last_name}`}</h6>
                </li>
            )
        }) : (
            <li css={({textAlign: "center", paddingTop: "1em"})}>No results</li>
        )}
        
        
        </div>
    )
}

export default AutoComplete