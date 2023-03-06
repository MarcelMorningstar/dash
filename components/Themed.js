import React from 'react'
import { Appearance, Text as DefaultText, TextInput as DefaultTextInput, View as DefaultView, SafeAreaView as DefaultSafeAreaView, TouchableHighlight as DefaultTouchableHighlight, StatusBar as DefaultStatusBar } from 'react-native'
import { AntDesign as DefaultAntDesing, MaterialIcons as DefaultMaterialIcons, MaterialCommunityIcons as DefaultMaterialCommunityIcons, Feather as DefaultFeather, FontAwesome5 as DefaultFontAwesome5, Ionicons as DefaultIonicons } from '@expo/vector-icons'
import Colors from '../constants/Colors'

export function useThemeColor(colorName) {
  const theme = Appearance.getColorScheme();
  const color = Colors[theme][colorName];

  return color
}

export function StatusBar(props) {
  const theme = Appearance.getColorScheme();
  const { ...otherProps } = props;

  return <DefaultStatusBar translucent backgroundColor="transparent" barStyle={ theme == 'light' ? 'dark-content' : 'light-content' } {...otherProps} />;
}

export function Text(props) {
  const { style, ...otherProps } = props;
  const color = useThemeColor('text')

  return <DefaultText style={[{ color: color } , style]} {...otherProps} />;
}

export function TextInput(props) {
  const { style, ...otherProps } = props;
  const backgroundColor = useThemeColor('secondaryBackground')
  const color = useThemeColor('text')
  const placeholderColor = useThemeColor('placeholderText')

  return <DefaultTextInput style={[{ color: color, backgroundColor: backgroundColor } , style]} placeholderTextColor={placeholderColor} {...otherProps} />;
}

export function Div(props) {
  const { style, ...otherProps } = props;
  const color = useThemeColor('secondaryBackground')
  const border = useThemeColor('tint')

  return <DefaultView style={[{ backgroundColor: color, borderColor: border }, style]} {...otherProps} />;
}

export function Div2(props) {
  const { style, ...otherProps } = props;
  const color = useThemeColor('primary')

  return <DefaultView style={[{ backgroundColor: color, borderColor: color }, style]} {...otherProps} />;
}

export function SafeAreaView(props) {
  const { style, ...otherProps } = props;
  const color = useThemeColor('background')

  return <DefaultSafeAreaView style={[{ backgroundColor: color }, style]} {...otherProps} />;
}

export function TouchableHighlight(props) {
  const { style, ...otherProps } = props;
  const underlayColor = useThemeColor('secondaryBackground')
  const shadowColor = useThemeColor('shadow')

  return <DefaultTouchableHighlight underlayColor={ underlayColor } style={[{ shadowColor: shadowColor }, style]} {...otherProps} />;
}

export function TouchableHighlight2(props) {
  const { style, ...otherProps } = props;
  const color = useThemeColor('primary')
  const underlayColor = useThemeColor('tint')
  const shadowColor = useThemeColor('shadow')

  return <DefaultTouchableHighlight underlayColor={ underlayColor } style={[{ backgroundColor: color, shadowColor: shadowColor }, style]} {...otherProps} />;
}

export function AntDesign(props) {
  const { ...otherProps } = props;
  const color = useThemeColor('text')

  return <DefaultAntDesing color={ color } {...otherProps} />;
}

export function MaterialIcons(props) {
  const { ...otherProps } = props;
  const color = useThemeColor('text')

  return <DefaultMaterialIcons color={ color } {...otherProps} />;
}

export function MaterialCommunityIcons(props) {
  const { ...otherProps } = props;
  const color = useThemeColor('text')

  return <DefaultMaterialCommunityIcons color={ color } {...otherProps} />;
}

export function Feather(props) {
  const { ...otherProps } = props;
  const color = useThemeColor('text')

  return <DefaultFeather color={ color } {...otherProps} />;
}

export function FontAwesome5(props) {
  const { ...otherProps } = props;
  const color = useThemeColor('text')

  return <DefaultFontAwesome5 color={ color } {...otherProps} />;
}

export function Ionicons(props) {
  const { ...otherProps } = props;
  const color = useThemeColor('text')

  return <DefaultIonicons color={ color } {...otherProps} />;
}
