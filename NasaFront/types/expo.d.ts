// Declaraciones de tipos para módulos de Expo que pueden no tener tipos
declare module 'expo-linear-gradient' {
    import { Component } from 'react';
    import { ViewProps, ViewStyle } from 'react-native';

    export interface LinearGradientProps extends ViewProps {
        colors: string[];
        start?: { x: number; y: number };
        end?: { x: number; y: number };
        locations?: number[];
        style?: ViewStyle;
    }

    export class LinearGradient extends Component<LinearGradientProps> { }
}

declare module '@expo/vector-icons' {
    export { default as Ionicons } from '@expo/vector-icons/Ionicons';
    export { default as Feather } from '@expo/vector-icons/Feather';
    export { default as Entypo } from '@expo/vector-icons/Entypo';
}

declare module '@expo/vector-icons/Ionicons' {
    import { Component } from 'react';

    export interface IconProps {
        name: string;
        size?: number;
        color?: string;
    }

    export default class Ionicons extends Component<IconProps> { }
}

declare module '@expo/vector-icons/Feather' {
    import { Component } from 'react';

    export interface IconProps {
        name: string;
        size?: number;
        color?: string;
    }

    export default class Feather extends Component<IconProps> { }
}

declare module '@expo/vector-icons/Entypo' {
    import { Component } from 'react';

    export interface IconProps {
        name: string;
        size?: number;
        color?: string;
    }

    export default class Entypo extends Component<IconProps> { }
}