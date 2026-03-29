'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, Ticket, Clock } from 'lucide-react'
import { Agent, AgentStatus } from '../../types/models'

interface Props {
  agents: Agent[]
}

const statusColors: Record<AgentStatus, string> = {
  'available': 'bg-green-500',
  'on-call': 'bg-orange-500',
  'handling-email': 'bg-blue-500',
  'working-ticket': 'bg-purple-500',
  'after-call-work': 'bg-yellow-500',
  'break': 'bg-cyan-500',
  'offline': 'bg-gray-600',
}

const channelIcons = {
  phone: Phone,
  email: Mail,
  ticket: Ticket,
}

export default function AgentGrid({ agents }: Props) {
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Live Agent Activity</h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-400">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-400">On Call</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-400">Email</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {agents.slice(0, 20).map((agent, index) => {
          const ChannelIcon = agent.currentChannel ? channelIcons[agent.currentChannel] : null
          
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-white/10 rounded-lg p-4 hover:border-purple-500/30 transition-all"
            >
              {/* Avatar and Status */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-sm font-semibold">
                      {agent.firstName[0]}{agent.lastName[0]}
                    </div>
                    <div 
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${
                        statusColors[agent.status]
                      }`}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{agent.fullName}</div>
                    <div className="text-xs text-gray-500">{agent.team}</div>
                  </div>
                </div>
                
                {ChannelIcon && (
                  <ChannelIcon className="w-4 h-4 text-gray-500" />
                )}
              </div>

              {/* Status Badge */}
              <div className="mb-3">
                <span className={`inline-block px-2 py-1 rounded text-xs ${
                  agent.status === 'available' ? 'bg-green-500/20 text-green-400' :
                  agent.status === 'on-call' ? 'bg-orange-500/20 text-orange-400' :
                  agent.status === 'handling-email' ? 'bg-blue-500/20 text-blue-400' :
                  agent.status === 'working-ticket' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {agent.status.replace('-', ' ')}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-500">
                  <div className="text-gray-600">Duration</div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(agent.statusDuration)}
                  </div>
                </div>
                <div className="text-gray-500">
                  <div className="text-gray-600">Handled</div>
                  <div className="font-semibold text-white">{agent.handledToday}</div>
                </div>
              </div>

              {/* Performance Bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">Performance</span>
                  <span className="text-gray-400">{agent.performance}%</span>
                </div>
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${agent.performance}%` }}
                    className={`h-full rounded-full ${
                      agent.performance >= 90 ? 'bg-green-500' :
                      agent.performance >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
