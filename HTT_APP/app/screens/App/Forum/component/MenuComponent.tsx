import React, { useState } from 'react'
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native'
import R from '@app/assets/R';

const { width, height } = Dimensions.get('window')
const scale = width / 375

const MenuComponent = (props: any) => {
    // console.log('propsMenu', props);

    const [isClickMenu, setIsClickMenu] = useState(false)
    const onClickMenu = () => {
        setIsClickMenu(true)
    }
    return (
        <TouchableOpacity style={{ marginLeft: 16 * scale }} onPress={onClickMenu}>
            <Text style={[styles.txtMenu, { color: '#595959' }]}>{props?.item}</Text>
        </TouchableOpacity>
        //     <TouchableOpacity style={[isClickMenu ? { borderBottomWidth: 1 * scale, borderColor: '#F03E3E' } : null, { marginLeft: 16 * scale }]} onPress={onClickMenu}>
        //        <Text style={[styles.txtMenu, isClickMenu ? { color: '#F03E3E' } : { color: '#595959' }]}>{props?.item}</Text>
        //    </TouchableOpacity>
    )
}

export default MenuComponent

const styles = StyleSheet.create({
    txtMenu: {
        fontFamily: R.fonts.sf_regular,
        fontSize: 15 * scale,
        lineHeight: 22 * scale,
        fontWeight: '500',
        // marginLeft:16*scale
    }
})
