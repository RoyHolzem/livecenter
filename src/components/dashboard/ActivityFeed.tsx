'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, Ticket, User } from 'lucide-react'
import { ActivityEvent } from '../../types/models'
import { formatDistanceToNow } from 'date-fns'

interface Props {
  activities: ActivityEvent[]
}

const eventIcons = {
  call: Phone,
  email: Mail,
  ticket: Ticket,
  'status-change': User,
  alert: User,
}

const eventColors = {
  call: 'text-orange-400 bg-orange-500/20',
  email: 'text-blue-400 bg-blue-500/20',
  ticket: 'text-purple-400 bg-purple-500/20',
  'status-change': 'text-gray-400 bg-gray-500/20',
  alert: 'text-red-400 bg-red-500/20',
}

export default function ActivityFeed({ activities }: Props) {
  return (
    <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4">Live Activity Feed</h2>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {activities.map((activity, index) => {
            const Icon = eventIcons[activity.type]
            const colorClass = eventColors[activity.type]
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className={`p-2 rounded-lg ${colorClass}`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{activity.message}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>{formatDistanceToNow(activity.timestamp, { addSuffix: true })}</span>
                    {activity.channel && (
                      <span className="px-2 py-0.5 rounded bg-white/10">
                        {activity.channel}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
