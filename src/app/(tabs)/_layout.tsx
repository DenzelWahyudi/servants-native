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
                name='index'
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name='home' size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

const colors = {
    background: '#1a1a2e',
    header: '#242444',
    surface: '#2a2a4a',
    primary: '#4fc3f7',
    text: '#ffffff',
    textSecondary: '#a0a0b0',
    alert: '#ff5252',
};
