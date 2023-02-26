
import React, {useMemo, useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import equals from 'react-fast-compare';
import {spacing} from '@theme/spacing';
import {enhance} from '@common';
import Animated, {useAnimatedStyle} from 'react-native-reanimated';
import {useMix, useSharedTransition} from '@animated';

import {Text} from '../Text/Text';
import {DebounceButton} from '../Button/Button';
import {Block} from '../Block/Block';

import {CheckboxProps} from './CheckBox.props';
import { onCheckType } from '@app/common/method';

const DIMENSIONS = {width: 16, height: 16};
const styles = StyleSheet.create({
  ROOT: {
    flexDirection: 'row',
    paddingVertical: spacing.tiny,
    alignSelf: 'flex-start',
  },
  OUTLINE: {
    ...DIMENSIONS,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    // borderColor: ColorDefault.primary,
    borderRadius: 1,
  },
  FILL: {
    width: DIMENSIONS.width - 4,
    height: DIMENSIONS.height - 4,
    // backgroundColor: ColorDefault.primary,
  },
  LABEL: {
    paddingLeft: spacing.smaller,
  },
});

const CheckBoxComponent = ({
  fillStyle,
  onToggle,
  outlineStyle,
  style,
  text,
  tx,
  disable = false,
  initialValue = false,
  value,
}: CheckboxProps) => {
  const [localValue, setLocalValue] = useState<boolean>(initialValue);
  const progress = useSharedTransition(value ?? localValue);
  const scale = useMix(progress, 0, 1);
  const opacity = useMix(progress, 0, 1);
  const _rootStyle = useMemo(() => enhance([styles.ROOT, style ?? {}]), [
    style,
  ]);

  const _outlineStyle = useMemo(
    () => enhance([styles.OUTLINE, outlineStyle ?? {}]),
    [outlineStyle],
  );

  const _fillStyle = useMemo(() => enhance([styles.FILL, fillStyle ?? {}]), [
    fillStyle,
  ]);

  const _labelStyle = useMemo(() => styles.LABEL, []);

  const onPress = useCallback(() => {
    if (typeof value === 'boolean' && onCheckType(onToggle, 'function')) {
      onToggle && onToggle(!value);
    } else {
      setLocalValue((v) => !v);
    }
  }, [onToggle, value]);

  const styleAnimated = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{scale: scale.value}],
  }));

  return (
    <DebounceButton
      activeOpacity={1}
      // preset={'link'}
      disabled={disable}
      onPress={onPress}
      style={_rootStyle}>
      <>
        <Block style={_outlineStyle}>
          <Animated.View style={[_fillStyle, styleAnimated]} />
        </Block>
        <Text text={text} tx={tx} style={_labelStyle} />
      </>
    </DebounceButton>
  );
};
export const CheckBox = React.memo(CheckBoxComponent, equals);
