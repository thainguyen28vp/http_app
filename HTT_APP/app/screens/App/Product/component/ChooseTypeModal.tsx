import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native'
import R from '@app/assets/R'
import { fonts } from '@app/theme'
import { positional } from 'yargs'

const { width, height } = Dimensions.get('window')
const scale = width / 375

const ChooseTypeModal = (props: any) => {
    console.log('propsmodal', props);

    const onPressItem = (option) => {
        props.clickDropdown(false)
        props.setDataAddress(option)
    }
    const OPTIONS = ['Kho thanh xuan', 'Kho nguyen trai', 'Kho long bien', 'Kho cau giay', 'Kho hoang mai']
    const optionText = OPTIONS.map((item, index) => {
        return (
            <TouchableOpacity
                style={styles.option}
                onPress={() => onPressItem(item)}>
                <Text key={index} style={styles.txt_modal_drop}>{item}</Text>
            </TouchableOpacity>
        )
    })

    return (
        <>
            <TouchableOpacity onPress={() => props.clickDropdown(false)} style={styles.container}>
                <View style={styles.v_modal}>
                    {/* {OPTIONS.map((item, index) => {
                    return (
                        <TouchableOpacity style={{ backgroundColor: 'green', marginBottom: 2 }} onPress={() => onChooseText}>
                            <Text key={index} style={styles.txt_modal_drop}>{item}</Text>
                        </TouchableOpacity>
                    )
                })} */}
                    <ScrollView>
                        {optionText}
                    </ScrollView>
                </View>
            </TouchableOpacity>
            {/* <Modal transparent={true} isVisible={isShowDropdown} nRequestClode={() => clickDropdown(false)}>
                <ChooseTypeModal
                    clickDropdown={clickDropdown}
                    setDataAddress={setDataAddress}
                />
            </Modal> */}
        </>
    )
}

export default ChooseTypeModal

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        // alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        // opacity: 0
    },
    v_modal: {
        backgroundColor: '#FFFFFF',
        width: 335 * scale,
        borderRadius: 15 * scale,
        marginTop: 120
    },
    txt_modal_drop: {
        // color: '#69747E',
        color: '#000000',
        ...fonts.regular16,
        paddingVertical: 15 * scale,
        paddingLeft: 15 * scale
    },
    option: {
        // backgroundColor: 'green',
        marginBottom: 2,
        borderRadius: 5 * scale
    }
})
