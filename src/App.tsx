
/** @jsxRuntime classic */
/** @jsx jsx */
import { Global, jsx } from '@emotion/react'
import React, { createContext, useEffect, useState } from 'react';
import './App.css';

import Navbar from './components/Navbar';

import { globalStyles } from './css/globalStyles'
import MainWrapper from './components/MainWrapper';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faAddressBook, faArrowLeft, faChevronDown, faChevronLeft, faChevronRight, faEdit, faGhost, faMinus, faPlus, faRedo, faSearch, faSpinner, faStar, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { ApolloClient, ApolloProvider, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist';

import { Contact } from './gql/schema';



library.add(
   faPlus,
   faSearch,
   faRedo, 
   faSpinner, 
   faStar, 
   faAddressBook, 
   faChevronRight, 
   faChevronLeft, 
   faGhost, 
   faChevronDown, 
   faStar, 
   faArrowLeft,
   faMinus, 
   faUser,
   faTrash,
   faEdit
   )

export const CacheContext = createContext<CachePersistor<NormalizedCacheObject> | undefined>(undefined)
export const FavoriteContext = createContext<
  {
    data : Contact[] | undefined, 
    saveFavorites : React.Dispatch<React.SetStateAction<Contact[] | undefined>>
  }
  >({
  data: [], saveFavorites: () => {}
})

function App() {
  var items = JSON.parse(localStorage.getItem('favorites')!);
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();
  const [favorites, setFavorites] = useState<Contact[] | undefined>(!!items ? items : []);
  const [persistor, setPersistor] = useState<CachePersistor<NormalizedCacheObject>>();

  
  if(!items) {
    localStorage.setItem("favorites", JSON.stringify(favorites))
    items = JSON.parse(localStorage.getItem('favorites')!);
    
  } 

  useEffect(() => {
    async function init() {
      const cache = new InMemoryCache();
      let newPersistor = new CachePersistor({
        cache,
        storage: new LocalStorageWrapper(window.localStorage),
        debug: true,
        trigger: 'write',
      });
      await newPersistor.restore();
      setPersistor(newPersistor);
      setClient(
        new ApolloClient({
          uri: 'https://wpe-hiring.tokopedia.net/graphql',
          cache,
        }),
      );
    }

    init().catch(console.error);
  }, []);

  

  if (!client) {
    return null
    
  }

  return (
    
    
    <ApolloProvider client={client}>
      <CacheContext.Provider value={persistor}>
        <Global styles={globalStyles} />
        <Navbar />
        <FavoriteContext.Provider value={ {"data" :favorites, "saveFavorites": setFavorites }}>
          <MainWrapper/>
        </FavoriteContext.Provider>
      </CacheContext.Provider>
    </ApolloProvider>
    
    
  )
}

export default App;

