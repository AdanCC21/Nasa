import CloudsBackground from '@/componentes/CloudsBackground';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Text, TouchableOpacity, View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ramon from '@/assets/images/Ramon.png'
import { useHeaderHeight } from '@react-navigation/elements';
import { useEvent } from '@/contexts/EventContext';
import { useChat } from '@/hooks/useAPI';
import { SimpleChatRequest } from '@/types/api';

// --- Tipos ---
type MessageItemType = {
  id: number,
  author: string,
  content: string
}

const PlanScreen = () => {
  const safeAreaInsets = useSafeAreaInsets();
  const { eventData, setDate, setStartTime, setEndTime, getFormattedData } = useEvent();
  const { sendMessage, loading, error } = useChat();

  const [messageList, setMessage] = useState<Array<MessageItemType>>([])
  const [message, setMessageText] = useState('');

  useEffect(() => {
    let botMessage: MessageItemType = { id: messageList.length, author: 'Ramon', content: "Hi, welcome ✌️! Ask me anything - I'll use your current location and time to give you better answers! 😺" }

    if (eventData.location?.address) {
      const currentTime = new Date().toLocaleString();
      let contextMessage = `Hi ✌️! I can see you're at: ${eventData.location.address} 🗺️ and it's currently ${currentTime} 🕑.`;

      // Si hay datos meteorológicos, mencionar que tenemos información del clima
      if (eventData.weatherData && eventData.recommendations.length > 0) {
        contextMessage += ` I also have your latest weather data and recommendations! Ask me anything about the weather conditions, your plans, or any other topic! 🌤️`;
      } else {
        contextMessage += ` Ask me anything about weather, your plans, or any other topic!`;
      }

      botMessage.content = contextMessage;
    }

    let list = [...messageList];
    list.push(botMessage);
    setMessage(list)
  }, [eventData.location, eventData.weatherData])

  // Función simplificada para enviar mensaje a ChatGPT con contexto
  const handleMessages = async (userMessage: string) => {
    // Agregar mensaje del usuario a la lista
    let userMsgItem: MessageItemType = { id: messageList.length + 1, author: 'User', content: userMessage };
    let list = [...messageList];
    list.push(userMsgItem);
    setMessage(list);

    try {
      // Preparar contexto de ubicación y tiempo
      const locationContext = eventData.location ? {
        lat: eventData.location.coordinates.latitude,
        lon: eventData.location.coordinates.longitude,
        address: eventData.location.address || 'Unknown location'
      } : undefined;

      const currentTime = new Date().toISOString();

      // Enviar prompt a ChatGPT con contexto completo (incluyendo datos meteorológicos)
      const chatRequest: SimpleChatRequest = {
        prompt: userMessage,
        location: locationContext,
        current_time: currentTime,
        weather_data: eventData.weatherData // Incluir datos meteorológicos del contexto
      };
      const response = await sendMessage(chatRequest);

      // Procesar respuesta del backend
      let responseText = "I received your message! 🌤️";

      if (response && response.response) {
        responseText = response.response;
      }

      const botMessage: MessageItemType = {
        id: messageList.length + 2,
        author: 'Ramon',
        content: responseText
      };

      list.push(botMessage);
      setMessage([...list]);

    } catch (error) {
      console.error('Error sending message:', error);

      // Mensaje de error si falla la API
      const errorMessage: MessageItemType = {
        id: messageList.length + 2,
        author: 'Ramon',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment. 😿"
      };

      list.push(errorMessage);
      setMessage([...list]);
    }
  };

  // Limpiar input
  const handleSend = async () => {
    if (message.trim() && !loading) {
      await handleMessages(message);
      setMessageText('');
    }
  };

  const headerHeight = useHeaderHeight();

  return (
    <LinearGradient
      colors={['#5074C9', '#94A8D8']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}>
      <CloudsBackground />

      <View style={{ height: headerHeight }}>
      </View>

      {/* Barra de contexto */}
      {eventData.location && (
        <View className='mx-[5vw] mb-2 bg-white/10 rounded-lg p-3'>
          <View className='flex-row items-center gap-x-2'>
            <Ionicons name="location" size={16} color="white" />
            <Text className='text-white text-xs font-medium flex-1' numberOfLines={1}>
              {eventData.location.address}
            </Text>
            <Ionicons name="time" size={16} color="white" />
            <Text className='text-white text-xs'>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
      >
        <FlatList
          className='mx-[5vw]'
          data={messageList}
          keyExtractor={item => String(item.id)}
          renderItem={({ item, index }) => <MessageItem item={item} index={index} />}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
        />

        <View style={styles.inputContent}>
          <View className='flex-row items-center gap-x-2 mx-2 mt-2'>
            <Ionicons name="information-circle-outline" size={14} color="white" />
            <Text className='text-gray-200 text-xs'>Specify details such as location, time and day.</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Write a message"
              placeholderTextColor="#9CA3AF"
              value={message}
              onChangeText={setMessageText}
              multiline={false}
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: message.trim() ? '#000000CC' : '#00000066' }
              ]}
              onPress={handleSend}
              disabled={!message.trim()}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: safeAreaInsets.bottom, }} />
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const MessageItem = ({ item, index }: any) => (
  <View className={`flex flex-wrap w-full ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} py-4`}>
    <View className={`flex flex-row w-full ${item.author !== 'User' ? 'items-start' : 'items-end flex-row-reverse'}`}>
      {item.author !== 'User' ? (
        <Image
          source={Ramon}
          style={{ width: 50, height: 70 }}
          resizeMode='contain'
        />) : (
        <View style={{ width: 30, height: 30, borderRadius: 5000, backgroundColor: '#0AF', alignItems: 'center', justifyContent: 'center' }}>
          <Text className='text-white text-lg'>U</Text>
        </View>
      )}
      <View className={`flex-1 ${item.author !== 'User' ? 'ml-2 items-start' : 'mr-2 items-end justify-end'}`}>
        <View className='bg-white px-3 py-2 rounded-lg max-w-[80%]'>
          <Text className='text-lg'>{item.content}</Text>
        </View>
      </View>
    </View>
  </View>
)

const styles = StyleSheet.create({
  inputContent: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingTop: 5,
    gap: 12,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
    height: 48,
    marginRight: 8,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PlanScreen