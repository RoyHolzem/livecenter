'use client'

import { motion } from 'framer-motion'
import { 
  Users, Phone, Mail, Ticket, Clock, AlertTriangle, 
  TrendingUp, TrendingDown, Activity 
} from 'lucide-react'
import { KPIMetrics } from '../../types/models'

interface Props {
  kpis: KPIMetrics
}

export default function KPICards({ kpis }: Props) {
  const cards = [
    {
      title: 'Agents Online',
      value: kpis.agentsOnline,
      total: kpis.totalAgents,
      icon: Users,
      color: 'purple',
      trend: 0,
    },
    {
      title: 'On Calls',
      value: kpis.agentsOnCalls,
      icon: Phone,
      color: 'orange',
      glow: true,
    },
    {
      title: 'Handling Emails',
      value: kpis.agentsHandlingEmails,
      icon: Mail,
      color: 'blue',
    },
    {
      title: 'Working Tickets',
      value: kpis.agentsWorkingTickets,
      icon: Ticket,
      color: 'green',
    },
    {
      title: 'Available',
      value: kpis.agentsAvailable,
      icon: Activity,
      color: 'green',
      glow: true,
    },
    {
      title: 'Queue Volume',
      value: kpis.activeQueueVolume,
      icon: Clock,
      color: 'orange',
    },
    {
      title: 'Service Level',
      value: `${kpis.serviceLevel}%`,
      icon: TrendingUp,
      color: kpis.serviceLevel >= 90 ? 'green' : kpis.serviceLevel >= 80 ? 'orange' : 'red',
    },
    {
      title: 'Escalated',
      value: kpis.escalatedTickets,
      icon: AlertTriangle,
      color: kpis.escalatedTickets > 5 ? 'red' : 'gray',
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon
        const colorClass = {
          purple: 'from-purple-600/20 to-purple-900/20 border-purple-500/30',
          green: 'from-green-600/20 to-green-900/20 border-green-500/30',
          orange: 'from-orange-600/20 to-orange-900/20 border-orange-500/30',
          blue: 'from-blue-600/20 to-blue-900/20 border-blue-500/30',
          red: 'from-red-600/20 to-red-900/20 border-red-500/30',
          gray: 'from-gray-600/20 to-gray-900/20 border-gray-500/30',
        }[card.color]

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`relative bg-gradient-to-br ${colorClass} backdrop-blur-sm border rounded-xl p-5 ${
              card.glow ? 'glow-' + card.color : ''
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <Icon className="w-5 h-5 opacity-60" />
              {card.total && (
                <span className="text-xs text-gray-500">/ {card.total}</span>
              )}
            </div>
            <div className="text-2xl font-bold mb-1">{card.value}</div>
            <div className="text-xs text-gray-400">{card.title}</div>
          </motion.div>
        )
      })}
    </div>
  )
}
