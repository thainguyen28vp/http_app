import R from '@app/assets/R'
import { Button } from '@app/components/Button/Button'
import { TYPE_ITEM } from '@app/config/Constants'
import { useAppSelector } from '@app/store'
import React from 'react'
import { Text, View } from 'react-native'
import {
  useToggleShowButtonAddProduct,
  useToggleShowModalButton,
  useToggleTypeItemModal,
} from '../context/YoutubeLIveContext'
import { styles } from '../styles'
import ButtonReaction from './ButtonReaction'

const FooterLivePreview = ({
  onPressSwtichCamera,
  onPressStart,
  onPressCart,
  onPressFilter,
}: any) => {
  const dataProduct = useAppSelector(state => state.ListProductReducer)
  const onPressShowModal = useToggleShowModalButton()
  const onPressTypeItemModal = useToggleTypeItemModal()
  const onPressShowButtonAddproduct = useToggleShowButtonAddProduct()
  console.log('FooterLivePreview')
  return (
    <View style={styles.buttonContainer}>
      {/* <ButtonReaction icon={R.images.img_beauty} onPress={onPressFilter} /> */}
      <ButtonReaction
        isCart={!!dataProduct?.listProductSelect?.length}
        icon={R.images.img_buy}
        onPress={() => {
          onPressShowModal(prev => !prev)
          onPressTypeItemModal(TYPE_ITEM.LIST_PRODUCT_CART)
          onPressShowButtonAddproduct(false)
        }}
      />
      <ButtonReaction
        icon={R.images.img_swtich_camera}
        onPress={onPressSwtichCamera}
      />
      <Button
        style={styles.vBtnStart}
        onPress={onPressStart}
        children={<Text style={styles.txtStartLive}>Bắt đầu phát</Text>}
      />
    </View>
  )
}

export default FooterLivePreview
