import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, PressableProps, Text, View } from 'react-native';

interface Props extends PressableProps {
  title: string;
  description: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color?: string;
  className?: string;
}

const MenuButton = React.forwardRef<View, Props>(
  ({ title, description, icon, onPress, onLongPress, color = 'primary', className, ...restProps }, ref) => {
    return (
      <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        className={`bg-white shadow-[0_4px_8px_0_rgba(0,0,0,0.12)] rounded-xl max-w-96 p-4 flex-row items-center ${className || ''}`}
        {...restProps}
      >
        <View className="flex-1 flex-row items-center">
        <Ionicons name={icon} size={32} color={`${color}`} style={{ marginRight: 12 }} />
        <View className="">
          <Text className="text-textPrimary text-2xl font-semibold">{title}</Text>
          <Text className="text-textPrimary text-md max-w-64">{description}</Text>
        </View>
        </View>
      </Pressable>
    );
  }
);

MenuButton.displayName = 'MenuButton';

export default MenuButton;