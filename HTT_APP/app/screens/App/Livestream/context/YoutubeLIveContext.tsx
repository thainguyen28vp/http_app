import { TYPE_ITEM } from '@app/config/Constants'
import React, { useCallback, useContext, useState } from 'react'

type YTContextType = {
  showModalButton: boolean
  setShowModalButton: React.Dispatch<React.SetStateAction<boolean>>

  showButtonAddProduct: boolean
  setShowButtonAddProduct: React.Dispatch<React.SetStateAction<boolean>>

  typeItemModal: number
  setTypeItemModal: React.Dispatch<React.SetStateAction<number>>

  updateProductSell: any
  setUpdateProductSell: React.Dispatch<React.SetStateAction<any>>

  infoStreaming: any
  setInfoStreaming: React.Dispatch<React.SetStateAction<any>>
}

const YoutubeContext = React.createContext<YTContextType>({
  showModalButton: false,
  setShowModalButton: () => {},

  showButtonAddProduct: true,
  setShowButtonAddProduct: () => {},

  typeItemModal: TYPE_ITEM.LIST_PRODUCT,
  setTypeItemModal: () => {},

  updateProductSell: null,
  setUpdateProductSell: () => {},

  infoStreaming: null,
  setInfoStreaming: () => {},
})

export const useShowModalButton = useCallback(() => {
  return useContext(YoutubeContext).showModalButton
}, [])
export const useToggleShowModalButton = () => {
  return useContext(YoutubeContext).setShowModalButton
}
export const useTypeItemModal = () => {
  return useContext(YoutubeContext).typeItemModal
}
export const useToggleTypeItemModal = () => {
  return useContext(YoutubeContext).setTypeItemModal
}

export const useShowButtonAddProduct = () => {
  return useContext(YoutubeContext).showButtonAddProduct
}
export const useToggleShowButtonAddProduct = () => {
  return useContext(YoutubeContext).setShowButtonAddProduct
}

export const useUpdateProductSell = () => {
  return useContext(YoutubeContext).updateProductSell
}
export const useToggleUpdateProductSell = () => {
  return useContext(YoutubeContext).setUpdateProductSell
}

export const useInfoStreaming = () => {
  return useContext(YoutubeContext).infoStreaming
}
export const useToggleInfoStreaming = () => {
  return useContext(YoutubeContext).setInfoStreaming
}

const YoutubeProvider = ({ children }: any) => {
  const [showModalButton, setShowModalButton] = useState<boolean>(false)
  const [typeItemModal, setTypeItemModal] = useState(TYPE_ITEM.LIST_PRODUCT)
  const [showButtonAddProduct, setShowButtonAddProduct] = useState(true)
  const [updateProductSell, setUpdateProductSell] = useState(null)
  const [infoStreaming, setInfoStreaming] = useState<any>()
  return (
    <YoutubeContext.Provider
      value={{
        showModalButton,
        typeItemModal,
        setShowModalButton,
        setTypeItemModal,
        showButtonAddProduct,
        setShowButtonAddProduct,
        updateProductSell,
        setUpdateProductSell,
        infoStreaming,
        setInfoStreaming,
      }}
    >
      {children}
    </YoutubeContext.Provider>
  )
}

export default YoutubeProvider
