import React, { useContext, useState } from 'react'

type ChatContextType = {
  isInConversation: boolean
  setInConversation: React.Dispatch<React.SetStateAction<boolean>>
}

const ChatContext = React.createContext<ChatContextType>({
  isInConversation: false,
  setInConversation: () => {}
})

export const useInConversation = () => {
  return useContext(ChatContext).isInConversation
}

export const useToggleInConversation = () => {
  return useContext(ChatContext).setInConversation
}

const ChatProvider = ({ children }: any) => {
  const [isInConversation, setIsInConversation] = useState<boolean>(false)

  return (
    <ChatContext.Provider
      value={{
        isInConversation: isInConversation,
        setInConversation: setIsInConversation,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export default ChatProvider
