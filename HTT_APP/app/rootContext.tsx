import React, { createContext } from 'react'
import ChatProvider from './screens/App/Chat/ChatContext'

const RootContext = createContext({})

const listProvider = {
  ChatProvider,
}

export const RootProvider = ({ children }: any) => {
  return (
    <RootContext.Provider value={{}}>
      {Object.values(listProvider).map(Provider => (
        <Provider children={children} />
      ))}
    </RootContext.Provider>
  )
}
