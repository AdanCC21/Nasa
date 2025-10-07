

import React from 'react';
import { Image, Text, View } from 'react-native';

interface Props {
    imgUrl: string;
    message: string;
}

// Mapa de imágenes disponibles
const imageMap: { [key: string]: any } = {
    'Bot.png': require('../../assets/images/Ramon.png'),
    // Agrega aquí más imágenes según las necesites
    // 'User.png': require('../../assets/images/User.png'),
    // 'Avatar.png': require('../../assets/images/Avatar.png'),
};

const MessageBot = ({ imgUrl, message }: Props) => {
    // Obtener la imagen del mapa o usar una imagen por defecto
    const imgRoute = imageMap[imgUrl] || imageMap['Bot.png'];
    
    return (
        <View className='flex-row items-center'>
            <Image source={imgRoute} style={{ width: 75, height: 100 }} />
            <View className='p-3 rounded-lg ml-2' style={{ 
                width: '70%', 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                borderRadius: 24,
                borderBottomLeftRadius: 0,
                marginBottom:16
            }}>
                <Text className='text-gray-700 text-md'>{message}</Text>
            </View>
        </View>
    );
};

export default MessageBot;