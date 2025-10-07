import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';

interface Props extends PressableProps {
    children: string;
    color?: string;
    variant?: 'contained' | 'text-only';
    className?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    iconPosition?: 'left' | 'right';
    iconSize?: number;
    iconColor?: string;
    disabled?: boolean;
}

const CustomButton = React.forwardRef<View, Props>(
    ({
        children,
        color,
        onPress,
        onLongPress,
        variant = 'contained',
        className,
        icon,
        iconPosition = 'left',
        iconSize = 20,
        iconColor,
        disabled = false,
        ...restProps
    }, ref) => {

        const backgroundColor = color || '#3b82f6';
        const textColor = color || '#3b82f6';

        // Función para aclarar un color hexadecimal
        const lightenColor = (hex: string, percent: number = 40): string => {
            // Remover el # si existe
            hex = hex.replace('#', '');
            
            // Convertir a RGB
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            
            // Aclarar cada componente
            const newR = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
            const newG = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
            const newB = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));
            
            // Convertir de vuelta a hex
            return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
        };

        const borderColor = lightenColor(backgroundColor, 40);

        if (variant === 'text-only') {
            return (
                <Pressable
                    className={`p-3 ${className}`}
                    onPress={disabled ? undefined : onPress}
                    onLongPress={disabled ? undefined : onLongPress}
                    ref={ref}
                    disabled={disabled}
                    style={{ opacity: disabled ? 0.5 : 1 }}
                    {...restProps}
                >
                    <View style={styles.contentContainer}>
                        {icon && iconPosition === 'left' && (
                            <Ionicons name={icon} size={iconSize} color={iconColor || textColor} style={styles.iconLeft} />
                        )}
                        <Text style={[styles.textOnly, { color: textColor }]} className='font-work-medium'>{children}</Text>
                        {icon && iconPosition === 'right' && (
                            <Ionicons name={icon} size={iconSize} color={iconColor || textColor} style={styles.iconRight} />
                        )}
                    </View>
                </Pressable>
            );
        }

        return (
            <Pressable
                style={[styles.button, { backgroundColor, borderColor, opacity: disabled ? 0.5 : 1 }, className && {}]}
                className={className}
                onPress={disabled ? undefined : onPress}
                onLongPress={disabled ? undefined : onLongPress}
                ref={ref}
                disabled={disabled}
                {...restProps}
            >
                <View style={styles.contentContainer}>
                    {icon && iconPosition === 'left' && (
                        <Ionicons name={icon} size={iconSize} color={iconColor || '#ffffff'} style={styles.iconLeft} />
                    )}
                    <Text style={styles.buttonText}>{children}</Text>
                    {icon && iconPosition === 'right' && (
                        <Ionicons name={icon} size={iconSize} color={iconColor || '#ffffff'} style={styles.iconRight} />
                    )}
                </View>
            </Pressable>
        );
    });

const styles = StyleSheet.create({
    button: {
        padding: 12,
        borderRadius: 16,
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#ffffff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textOnly: {
        textAlign: 'center',
        fontSize: 16,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
});

export default CustomButton;