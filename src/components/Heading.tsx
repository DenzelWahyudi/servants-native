import React from "react";
import { Text } from 'react-native';
export default function Heading({ children }: { children: React.ReactNode }){
    return (
        <Text className="text-4xl font-bold text-white">{children}</Text>
    )
}