import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.background,
                    borderTopColor: colors.surface,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
            }}
        >
            <Tabs.Screen
                name='home'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='home' size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name='schedule'
                options={{
                    title: 'Schedule',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='calendar' size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name='openings'
                options={{
                    title: 'Openings',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='menu' size={size} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name='chats'
                options={{
                    title: 'Chat',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='chatbox' size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

const colors = {
    background: '#1a1a2e',
    surface: '#2a2a4a',
    primary: '#4fc3f7',
    textSecondary: '#a0a0b0',
};
