import React, { useEffect, useState } from 'react'
import { Appearance, Text as DefaultText, TextInput as DefaultTextInput, View as DefaultView, SafeAreaView as DefaultSafeAreaView, TouchableHighlight as DefaultTouchableHighlight, TouchableOpacity as DefaultTouchableOpacity, StatusBar as DefaultStatusBar } from 'react-native'
import { DarkTheme, DefaultTheme, NavigationContainer as DefaultNavigationContainer } from '@react-navigation/native'
import { Divider as DefaultDivider } from './Divider'
import { Octicons as DefaultOcticons, AntDesign as DefaultAntDesing, MaterialIcons as DefaultMaterialIcons, MaterialCommunityIcons as DefaultMaterialCommunityIcons, Feather as DefaultFeather, FontAwesome as DefaultFontAwesome, FontAwesome5 as DefaultFontAwesome5, Ionicons as DefaultIonicons } from '@expo/vector-icons'
import Colors from '../constants/Colors'

import { useSelector } from 'react-redux'
import { selectTheme } from '../slices/authSlice'

export function useThemeColor(colorName) {
  const storageTheme = useSelector(selectTheme);
  const [theme, setTheme] = useState(storageTheme === 'automatic' ? Appearance.getColorScheme() : storageTheme);
  const color = Colors[theme][colorName];

  useEffect(() => {
    if (storageTheme !== 'automatic') {
      setTheme(storageTheme)
    } else {
      setTheme(Appearance.getColorScheme())
    }
  }, [storageTheme])
  
  Appearance.addChangeListener((T) => {
    if (storageTheme === 'automatic') {
      setTheme(T.colorScheme)
    }
  })

  return color
}

export function StatusBar(props) {
  let storageTheme = useSelector(selectTheme);
  let [appearance, setAppearance] = useState(Appearance.getColorScheme());
  const [theme, setTheme] = useState(storageTheme === 'automatic' ? appearance === 'light' ? 'dark-content' : 'light-content' : storageTheme === 'light' ? 'dark-content' : 'light-content');
  const { ...otherProps } = props;

  useEffect(() => {
    if (storageTheme === 'automatic') {
      if (appearance === 'light') {
        setTheme('dark-content')
      } else {
        setTheme('light-content')
      }
    } else {
      if (storageTheme === 'light') {
        setTheme('dark-content')
      } else {
        setTheme('light-content')
      }
    }
  }, [storageTheme, appearance])

  Appearance.addChangeListener((T) => {
    if (storageTheme === 'automatic') {
      setAppearance(T.colorScheme)
    }
  })

  return <DefaultStatusBar barStyle={theme} translucent backgroundColor="transparent" {...otherProps} />;
}

export function NavigationContainer(props) {
  let storageTheme = useSelector(selectTheme);
  let [appearance, setAppearance] = useState(Appearance.getColorScheme());
  const [theme, setTheme] = useState(storageTheme === 'automatic' ? appearance === 'light' ? DefaultTheme : DarkTheme : storageTheme === 'light' ? DefaultTheme : DarkTheme)
  const { ...otherProps } = props;

  useEffect(() => {
    if (storageTheme === 'automatic') {
      if (appearance === 'light') {
        setTheme(DefaultTheme)
      } else {
        setTheme(DarkTheme)
      }
    } else {
      if (storageTheme === 'light') {
        setTheme(DefaultTheme)
      } else {
        setTheme(DarkTheme)
      }
    }
  }, [storageTheme, appearance])

  Appearance.addChangeListener((T) => {
    if (storageTheme === 'automatic') {
      setAppearance(T.colorScheme)
    }
  })

  return <DefaultNavigationContainer theme={theme} {...otherProps} />;
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

export function SecondaryView(props) {
  const { style, ...otherProps } = props;
  const color = useThemeColor('secondaryBackground')
  const shadow = useThemeColor('shadow')

  return <DefaultView style={[{ backgroundColor: color, borderColor: shadow, shadowColor: shadow }, style]} {...otherProps} />;
}

export function PrimaryView(props) {
  const { style, ...otherProps } = props;
  const color = useThemeColor('primary')

  return <DefaultView style={[{ backgroundColor: color, borderColor: color }, style]} {...otherProps} />;
}

export function View(props) {
  const { style, ...otherProps } = props;
  const color = useThemeColor('background')
  const shadow = useThemeColor('shadow')

  return <DefaultView style={[{ backgroundColor: color, shadowColor: shadow }, style]} {...otherProps} />;
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

export function PrimaryTouchableHighlight(props) {
  const { style, ...otherProps } = props;
  const color = useThemeColor('primary')
  const underlayColor = useThemeColor('tint')
  const shadowColor = useThemeColor('shadow')

  return <DefaultTouchableHighlight underlayColor={ underlayColor } style={[{ backgroundColor: color, shadowColor: shadowColor }, style]} {...otherProps} />;
}

export function SecondaryTouchableOpacity(props) {
  const { style, ...otherProps } = props;
  const color = useThemeColor('secondaryBackground')
  const shadowColor = useThemeColor('shadow')

  return <DefaultTouchableOpacity style={[{ backgroundColor: color, shadowColor: shadowColor }, style]} {...otherProps} />;
}

export function Divider(props) {
  const { ...otherProps } = props;
  const color = useThemeColor('secondaryBackground')

  return <DefaultDivider color={color} {...otherProps} />;
}

export function AntDesign(props) {
  const { ...otherProps } = props;
  const color = useThemeColor('text')

  return <DefaultAntDesing color={ color } {...otherProps} />;
}

export function Octicons(props) {
  const { ...otherProps } = props;
  const color = useThemeColor('text')

  return <DefaultOcticons color={ color } {...otherProps} />;
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

export function FontAwesome(props) {
  const { ...otherProps } = props;
  const color = useThemeColor('text')

  return <DefaultFontAwesome color={ color } {...otherProps} />;
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
