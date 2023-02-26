import React, { PureComponent } from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import FstImage from './FstImage/FstImage'
import R from '@app/assets/R'

export class CartRightComponent extends PureComponent {

    render() {
        const { onPress, ...props } = this.props
        return (
            <TouchableOpacity
                onPress={onPress}
                style={{
                    // flexDirection: 'row',
                    marginRight: 10,
                }} {...props}>
                <FstImage
                    resizeMode='contain'
                    style={{
                        width: 25,
                        height: 25
                    }}
                    // tintColor='white'
                    source={R.images.ic_massage} />
            </TouchableOpacity>
        )
    }
}

export default CartRightComponent
