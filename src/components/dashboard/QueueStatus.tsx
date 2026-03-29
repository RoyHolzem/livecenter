'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, Ticket, Clock, Users } from 'lucide-react'
import { Queue } from '../../types/models'

interface Props {
  queues: Queue[]
}

const channelIcons = {
  phone: Phone,
  email: Mail,
  ticket: Ticket,
}

const channelColors = {
  phone: 'from-orange-600/20 to-orange-900/20 border-orange-500/30',
  email: 'from-blue-600/20 to-blue-900/20 border-blue-500/30',
  ticket: 'from-purple-600/20 to-purple-900/20 border-purple-500/30',
}

export default function QueueStatus({ queues }: Props) {
  return (
    <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Queue Status</h2>
      
      <div className="space-y-4">
        {queues.map((queue, index) => {
          const Icon = channelIcons[queue.channel]
          const colorClass = channelColors[queue.channel]
          
          return (
            <motion.div
              key={queue.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${colorClass} border rounded-lg p-4`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" />
                  <span className="font-semibold">{queue.name}</span>
                </div>
                <div className={`text-2xl font-bold ${queue.waiting > 10 ? 'text-red-400' : 'text-white'}`}>
                  {queue.waiting}
                  <span className="text-xs text-gray-400 ml-1">waiting</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-gray-500 text-xs">Avg Wait</div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span>{Math.floor(queue.avgWaitTime / 60)}:{(queue.avgWaitTime % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-500 text-xs">Active Agents</div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-gray-400" />
                    <span>{queue.activeAgents}</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-gray-500 text-xs">SLA</div>
                  <div className={`font-semibold ${
                    queue.sla >= 90 ? 'text-green-400' : queue.sla >= 80 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {queue.sla}%
                  </div>
                </div>
              </div>
              
              {/* Progress bar for queue */}
              <div className="mt-3">
                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(queue.waiting / 20) * 100}%` }}
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
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
