import { TextStyle, TextProps as TextProperties, StyleProp, FlexAlignType } from 'react-native';

type FontWeight = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | undefined;
type VerticalAlign = 'auto' | 'bottom' | 'center' | 'top' | undefined;
type TextAlign = 'auto' | 'left' | 'right' | 'center' | 'justify';
type TextTransform = 'none' | 'capitalize' | 'uppercase' | 'lowercase';

export interface TextProps extends TextProperties {
  font?:
    | 'regular12'
    | 'regular14'
    | 'regular16'
    | 'regular18'
    | 'regular20'
    | 'regular24'
    | 'bold12'
    | 'bold14'
    | 'bold16'
    | 'bold18'
    | 'bold20'
    | 'bold24'
    | 'semi_bold12'
    | 'semi_bold14'
    | 'semi_bold16'
    | 'semi_bold18'
    | 'semi_bold20'
    | 'semi_bold24'
    | 'light12'
    | 'light14'
    | 'light16'
    | 'light18'
    | 'light20'
    | 'light24'
    | 'extra_light12'
    | 'extra_light14'
    | 'extra_light16'
    | 'extra_light18'
    | 'extra_light20'
    | 'extra_light24';
  fontStyle?: 'normal' | 'italic';

  letterSpacing?: number;

  lineHeight?: number;

  /**
   * Children of text
   * @default undefined
   */
  children?: React.ReactNode;

  /**
   * Text which is looked up via i18n.
   * @default undefined
   */
  tx?: string;

  /**
   * Option of i18n
   * @default undefined
   */
  txOptions?: object;

  /**
   * Using text string instead i18n
   * @default undefined
   */
  text?: string;

  /**
   * Enable to using {flex:1}
   * @default undefined
   */
  flex?: boolean;

  /**
   * Overwrite font size
   * @default FONT_14
   */
  fontSize?: number;

  /**
   * Overwrite font weight
   * @default undefined
   */
  fontWeight?: FontWeight;

  /**
   * Overwrite font family
   * @default undefined
   */
  fontFamily?: any;

  /**
   * Using margin
   * @default undefined
   */
  margin?: number;

  /**
   * Using margin left
   * @default undefined
   */
  marginLeft?: number;

  /**
   * Using margin right
   * @default undefined
   */
  marginRight?: number;

  /**
   * Using margin bottom
   * @default undefined
   */
  marginBottom?: number;

  /**
   * Using margin top
   * @default undefined
   */
  marginTop?: number;

  /**
   * Using padding
   * @default undefined
   */
  padding?: number;

  /**
   * Using padding horizontal
   * @default undefined
   */
  paddingHorizontal?: number;

  /**
   * Using padding top
   * @default undefined
   */
  paddingTop?: number;

  /**
   * Using padding bottom
   * @default undefined
   */
  paddingBottom?: number;

  /**
   * Using padding left
   * @default undefined
   */
  paddingLeft?: number;

  /**
   * Using padding right
   * @default undefined
   */
  paddingRight?: number;

  /**
   * Using padding vertical
   * @default undefined
   */
  paddingVertical?: number;

  /**
   * Actual width
   * @default undefined
   */
  width?: number | string;

  /**
   * Actual height
   * @default undefined
   */
  height?: number | string;

  /**
   * Using color
   * @default undefined
   */
  color?: string;

  /**
   * Set true for using textAlign = 'center'
   * @default undefined
   */
  center?: boolean;

  /**
   * Overwrite textAlign
   * @default undefined
   */
  textAlign?: TextAlign;

  /**
   * Using align items
   * @default undefined
   */
  alignItems?: FlexAlignType;

  /**
   * Using align self
   * @default undefined
   */
  alignSelf?: 'auto' | FlexAlignType;

  /**
   * Overwrite textAlignVertical
   * @default undefined
   */
  textAlignVertical?: VerticalAlign;

  /**
   * Overwrite textTransform
   * @default undefined
   */
  textTransform?: TextTransform;

  /**
   * Overwrite style of text component
   * @default undefined
   */
  style?: StyleProp<TextStyle>;
}
