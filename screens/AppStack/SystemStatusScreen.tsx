import { useEffect } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { FontAwesome5 } from '@expo/vector-icons'

import { SystemStatusScreenNavigationProps, ServiceStatus } from '../../types'
import useStatus from '../../hooks/useStatus'
import tw from '../../lib/tailwind'

function getStatusColor(status: string): string {
  switch (status) {
    case 'healthy':
      return 'green'
    case 'degraded':
      return 'orange'
    case 'down':
      return 'red'
    default:
      return 'gray'
  }
}

function getStatusIcon(status: string): string {
  switch (status) {
    case 'healthy':
      return 'check-circle'
    case 'degraded':
      return 'exclamation-triangle'
    case 'down':
      return 'times-circle'
    default:
      return 'question-circle'
  }
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

function ServiceStatusCard({ service }: { service: ServiceStatus }) {
  const color = getStatusColor(service.status)
  const icon = getStatusIcon(service.status)

  return (
    <View style={tw`bg-white rounded-lg p-4 mb-3 shadow-sm`}>
      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center`}>
          <FontAwesome5 name={icon} size={18} color={color} style={tw`mr-3`} />
          <Text style={tw`text-lg font-bold uppercase`}>{service.name}</Text>
        </View>
        <Text style={[tw`text-sm font-bold uppercase`, { color }]}>
          {service.status}
        </Text>
      </View>
      {service.latencyMs !== undefined && (
        <Text style={tw`text-sm text-gray-500 mt-1`}>
          Latency: {service.latencyMs}ms
        </Text>
      )}
      {service.message && (
        <Text style={tw`text-sm text-gray-500 mt-1`}>{service.message}</Text>
      )}
    </View>
  )
}

function SystemStatusScreen({
  navigation,
}: SystemStatusScreenNavigationProps) {
  const { status, isLoading, error, fetchStatus } = useStatus()

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  return (
    <SafeAreaView style={tw`h-full bg-gray-100`}>
      <TouchableOpacity
        style={tw`mx-4 mb-4`}
        activeOpacity={1}
        onPress={() => navigation.navigate('Settings')}
      >
        <Text style={tw`uppercase font-bold text-xl`}>Back</Text>
      </TouchableOpacity>

      <ScrollView style={tw`px-4`}>
        <Text style={tw`text-3xl font-bold uppercase mb-4 text-center`}>
          System Status
        </Text>

        {isLoading && !status && (
          <View style={tw`items-center py-8`}>
            <ActivityIndicator size="large" color="black" />
            <Text style={tw`mt-4 text-lg`}>Checking systems...</Text>
          </View>
        )}

        {error && (
          <View style={tw`bg-red-100 rounded-lg p-4 mb-4`}>
            <Text style={tw`text-red-800 font-bold text-center`}>{error}</Text>
          </View>
        )}

        {status && (
          <>
            <View style={tw`items-center mb-6`}>
              <FontAwesome5
                name={getStatusIcon(status.status)}
                size={64}
                color={getStatusColor(status.status)}
              />
              <Text
                style={[
                  tw`text-2xl font-bold uppercase mt-2`,
                  { color: getStatusColor(status.status) },
                ]}
              >
                {status.status === 'healthy'
                  ? 'All Systems Operational'
                  : status.status === 'degraded'
                  ? 'Degraded Performance'
                  : 'System Outage'}
              </Text>
              <Text style={tw`text-sm text-gray-500 mt-1`}>
                v{status.version} | Uptime: {formatUptime(status.uptimeSeconds)}
              </Text>
            </View>

            <Text style={tw`text-xl font-bold uppercase mb-3`}>Services</Text>
            {status.services.map((service) => (
              <ServiceStatusCard key={service.name} service={service} />
            ))}

            <Text style={tw`text-xl font-bold uppercase mt-4 mb-3`}>
              Memory
            </Text>
            <View style={tw`bg-white rounded-lg p-4 mb-3`}>
              <Text style={tw`text-sm text-gray-600`}>
                Heap: {status.memory.heapUsedMB}MB / {status.memory.heapTotalMB}
                MB
              </Text>
              <Text style={tw`text-sm text-gray-600 mt-1`}>
                RSS: {status.memory.rssMB}MB
              </Text>
            </View>

            <Text style={tw`text-xs text-gray-400 text-center mt-2 mb-4`}>
              Last checked:{' '}
              {new Date(status.timestamp).toLocaleString()}
            </Text>
          </>
        )}

        <TouchableOpacity
          style={tw`w-full bg-black mt-2 mb-8 rounded-lg`}
          activeOpacity={0.8}
          onPress={fetchStatus}
        >
          {isLoading ? (
            <ActivityIndicator color="white" style={tw`py-3`} />
          ) : (
            <Text
              style={tw`text-xl text-center font-bold uppercase p-3 text-white`}
            >
              Refresh Status
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SystemStatusScreen
