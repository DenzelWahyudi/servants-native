import React, { useState, useCallback } from 'react'
import { View, Text, Image, Pressable, ScrollView, Modal, ActivityIndicator } from 'react-native'
import { useFocusEffect, router } from 'expo-router'
import { useAuth } from "@/hooks/useAuth"
import { startOfToday, isEqual, startOfDay, format } from "date-fns"
import { API_URL } from "../../../api"

import bell from '../../images/icons/bell.svg'
import calendar from '../../images/icons/calendar.svg'
import user from '../../images/icons/user.svg'

type StatsCardProps = {
    icon: any
    title: string
    buttonLabel: string
    linkTo?: string
    onClick?: () => void
    onDisabled?: boolean
}

interface Schedule {
    roleName: string
    serviceName: string
    date: Date
    time: string
}

interface Role {
    _id?: string
    serviceId?: string
    name?: string
    spotsTotal: number
    spotsFilled: number
}

interface Assignment {
    _id: string
    serviceName: string
    roleName: string
    date: string
    time: string
    status: string
}

interface Service {
    _id: string
    name: string
    date: string
    time: string
    status: string
    roles?: Role[]
}

export default function HomeTab() {
    const [userName, setUserName] = useState<string | null>(null)
    const [schedule, setSchedule] = useState<Schedule[] | null>(null)
    const [roles, setRoles] = useState<Role[] | null>(null)
    const [assignments, setAssignments] = useState<Assignment[] | null>(null)
    const { token } = useAuth();
    const [loading, setLoading] = useState(false)

    const todayServiceCount = schedule?.filter((s) => {
        const serviceDate = startOfDay(new Date(s.date))
        return isEqual(serviceDate, startOfToday())
    }).length ?? 0

    const openRoles = roles?.filter((r) => {
        return r.spotsFilled < r.spotsTotal
    }).length ?? null

    useFocusEffect(
        useCallback(() => {
            async function fetchUser() {
                const response = await fetch(`${API_URL}/api/users/name`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
                const data = await response.json()
                setUserName(data)
            }
            async function fetchSchedule() {
                const response = await fetch(`${API_URL}/api/assignments/schedule`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                })
                const data: Schedule[] = await response.json()
                setSchedule(Array.isArray(data) ? data : [])
            }
            async function fetchRoles() {
                const rolesResponse = await fetch(`${API_URL}/api/roles`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                })
                const rolesData = await rolesResponse.json()
                setRoles(rolesData)
            }
            if (token) {
                void fetchUser()
                void fetchSchedule()
            }
            void fetchRoles()
            
            return () => {}
        }, [token])
    )

    async function getAssignments(){
        setLoading(true)
        const response = await fetch(`${API_URL}/api/assignments/all`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
        const data: Assignment[] = await response.json()
        setAssignments(data)
        setLoading(false)
    }

    return (
        <ScrollView className="flex-1 bg-zinc-50 pt-3" contentContainerClassName="pb-10">
            <View className="px-6 pt-10 pb-6">
                <Text className="text-3xl font-bold text-zinc-900">
                    Hello, <Text className="text-amber-500">{userName ?? '...'}</Text>
                </Text>
                <Text className="text-zinc-500 mt-1 font-medium text-base">Here is what's happening today</Text>
            </View>

            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerClassName="px-6 pb-6 gap-4"
            >
                <StatsCard 
                    linkTo="/schedule" 
                    icon={bell} 
                    title={`${todayServiceCount} Service Reminders Today`} 
                    buttonLabel="View Schedule" 
                />
                <StatsCard 
                    onClick={getAssignments} 
                    icon={user} 
                    title="Pending Sign-ups" 
                    buttonLabel={loading ? "Loading..." : "Review Now"} 
                    onDisabled={loading}
                />
                <StatsCard 
                    linkTo="/openings" 
                    icon={calendar} 
                    title={`Open Recruitment: ${openRoles ?? 0}`} 
                    buttonLabel="Fill Remaining Roles" 
                />
            </ScrollView>

            <View className="bg-white flex-1 rounded-t-3xl shadow-sm pt-8 px-6 mt-2 min-h-[500px]">
                <UpcomingServicesMobile />
            </View>

            <Modal visible={!!assignments} transparent animationType="fade" onRequestClose={() => setAssignments(null)}>
                <View className="flex-1 bg-black/60 justify-center items-center px-4 pt-12 pb-12">
                    <Pressable 
                        className="absolute inset-0" 
                        onPress={() => setAssignments(null)} 
                    />
                    <View className="bg-slate-900 w-full max-h-full rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-slate-800">
                        <View className="px-6 py-5 border-b border-slate-800 flex-row justify-between items-center bg-slate-900/90">
                            <Text className="text-xl font-bold text-zinc-50">Pending Assignments</Text>
                            <Pressable onPress={() => setAssignments(null)} className="p-2 -mr-2 active:opacity-70">
                                <Text className="text-zinc-400 font-bold text-lg">✕</Text>
                            </Pressable>
                        </View>
                        
                        <ScrollView className="p-4" contentContainerClassName="gap-4 pb-8">
                            {assignments?.map((a) => (
                                <View key={a._id} className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                                    <View className="flex-row justify-between items-start mb-3">
                                        <Text className="text-zinc-50 font-bold text-lg flex-1 mr-3 leading-tight">{a.serviceName}</Text>
                                        <View className={`px-3 py-1.5 rounded-lg ${
                                            a.status === "confirmed" ? "bg-emerald-500/20" :
                                            a.status === "pending" ? "bg-amber-500/20" : "bg-rose-500/20"
                                        }`}>
                                            <Text className={`font-bold text-xs uppercase tracking-wider ${
                                                a.status === "confirmed" ? "text-emerald-400" :
                                                a.status === "pending" ? "text-amber-400" : "text-rose-400"
                                            }`}>
                                                {a.status}
                                            </Text>
                                        </View>
                                    </View>
                                    
                                    <View className="flex-row items-center mb-4">
                                        <Text className="text-zinc-400 font-medium">{format(new Date(a.date), 'd MMM yyyy')}</Text>
                                        <Text className="text-zinc-600 mx-3">•</Text>
                                        <Text className="text-zinc-400 font-medium">{a.time}</Text>
                                    </View>
                                    
                                    <View className="bg-slate-900/50 p-3.5 rounded-xl border border-slate-700/50">
                                        <Text className="text-zinc-500 text-[11px] uppercase tracking-wider font-bold mb-1">Role Assigned</Text>
                                        <Text className="text-zinc-200 font-semibold">{a.roleName}</Text>
                                    </View>
                                </View>
                            ))}
                            {assignments?.length === 0 && (
                                <View className="py-12 items-center justify-center">
                                    <Text className="text-zinc-500 font-medium text-lg">No pending assignments</Text>
                                </View>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    )
}

function StatsCard({ icon, title, buttonLabel, linkTo, onClick, onDisabled }: StatsCardProps) {

    const handlePress = () => {
        if (onDisabled) return;
        if (linkTo) {
            router.push('' as any); // TODO: Add route here when ready
        } else if (onClick) {
            onClick();
        }
    }

    return (
        <View className="bg-white rounded-3xl p-5 w-60 shadow-sm border border-zinc-100 flex flex-col justify-between" style={{ height: 180 }}>
            <View>
                <View className="bg-amber-100/50 w-12 h-12 rounded-2xl items-center justify-center mb-4">
                    <Image source={icon} className="w-6 h-6" resizeMode="contain" style={{ tintColor: '#d97706' }} />
                </View>
                <Text className="text-zinc-800 font-bold text-base leading-snug">{title}</Text>
            </View>
            
            <Pressable
                onPress={handlePress}
                disabled={onDisabled}
                className={`mt-auto py-3 px-4 rounded-xl items-center justify-center flex-row active:opacity-80 transition-opacity ${
                    onDisabled ? 'bg-zinc-100' : 'bg-amber-400'
                }`}
            >
                {onDisabled && <ActivityIndicator size="small" color="#a1a1aa" className="mr-2" />}
                <Text className={`font-bold text-sm ${onDisabled ? 'text-zinc-400' : 'text-amber-950'}`}>
                    {buttonLabel}
                </Text>
            </Pressable>
        </View>
    )
}

export function UpcomingServicesMobile(){
    const [services, setServices] = useState<Service[] | null>(null)

    useFocusEffect(
        useCallback(() => {
            async function fetchServices() {
                const response = await fetch(`${API_URL}/api/services/with-roles`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
                const data: Service[] = await response.json();
                setServices(data);
            }
            void fetchServices()
        }, [])
    )

    return (
        <View className="pb-10">
            <Text className="text-2xl font-bold text-zinc-900 mb-6">Upcoming Services</Text>
            <View className="gap-5">
                {services?.map((s) => (
                    <View key={s._id} className="rounded-3xl bg-white shadow-sm border border-zinc-100 p-5">
                        <View className="flex-row justify-between items-start mb-5">
                            <View className="flex-1 mr-4">
                                <Text className="text-zinc-900 font-bold text-lg mb-1 leading-tight">{s.name}</Text>
                                <Text className="text-zinc-500 font-medium">{format(new Date(s.date), 'd MMMM yyyy')}</Text>
                            </View>
                            <View className="bg-zinc-100/80 px-3 py-2 rounded-xl">
                                <Text className="text-zinc-700 font-bold text-xs">{s.time}</Text>
                            </View>
                        </View>
                        
                        <View className="h-px bg-zinc-100 mb-5" />
                        
                        <View className="flex-row flex-wrap gap-2 mb-6">
                            {s.roles?.map((r) => (
                                <View key={r._id} className="bg-zinc-50 border border-zinc-200 px-3.5 py-1.5 rounded-full">
                                    <Text className="text-zinc-600 text-xs font-semibold">{r.name}</Text>
                                </View>
                            ))}
                        </View>
                        
                        <View className="flex-row justify-end mt-auto">
                            <Text className={`font-bold text-sm tracking-wide ${
                                s.status === "Roles Closed" ? "text-rose-500" : "text-emerald-500"
                            }`}>
                                {s.status}
                            </Text>
                        </View>
                    </View>
                ))}
                {(!services || services.length === 0) && (
                    <View className="py-10 items-center justify-center">
                        <Text className="text-zinc-400 font-medium text-base">No upcoming services.</Text>
                    </View>
                )}
            </View>
        </View>
    )
}
