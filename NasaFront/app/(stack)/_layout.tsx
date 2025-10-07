import { EventProvider } from '@/contexts/EventContext';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { router, Stack, useNavigation } from 'expo-router';
import React from 'react';

const StackLayout = () => {

    const navigation = useNavigation();

    const onHeaderLeftClick = (canGoBack: boolean | undefined) => {
        if (canGoBack) {
            router.back();
            return;
        }
        navigation.dispatch(DrawerActions.toggleDrawer);
    }


    return (
        <EventProvider>
            <Stack
                screenOptions={{
                    headerShadowVisible: false,
                    contentStyle: {
                        flex: 1,

                    },
                    headerLeft: ({ canGoBack }) => (<Ionicons
                        name={canGoBack ? "chevron-back" : "menu"} size={32} className='mr-5' color={"#fff"}
                        onPress={() => onHeaderLeftClick(canGoBack)}
                    />
                    )
                }}
            >
                <Stack.Screen name="home/index"
                    options={{
                        headerShown: false
                    }} />
                <Stack.Screen name="map/index"
                    options={{
                        title: "Map",
                        headerTransparent: true,
                        headerStyle: {

                        },
                        headerTitleStyle: {
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: 28,

                        }
                    }} />
                <Stack.Screen name="map/dateHour/index"
                    options={{
                        title: "Date and hour",
                        headerTransparent: true,
                        headerStyle: {
                        },
                        headerTitleStyle: {
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: 28,

                        }
                    }} />
                <Stack.Screen name="chat/index"
                    options={{
                        title: "Ramon",
                        headerTitleStyle: { color: "#FFF", fontSize: 28, fontWeight: 'bold' },
                        headerTransparent: true
                    }} />
                <Stack.Screen name="Resultados/index"
                    options={{
                        title: "Results",
                        headerTransparent: true,
                        headerTitleStyle: {
                            color: '#fff',
                            fontWeight: 'bold',

                        }
                    }} />
            </Stack>
        </EventProvider>
    )
}

export default StackLayout