'use client'

import { motion } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Agent, Queue } from '../../types/models'

interface Props {
  agents: Agent[]
  queues: Queue[]
}

const COLORS = ['#8b5cf6', '#00ff88', '#00d4ff', '#ff9500', '#ff3b5c', '#6366f1']

export default function Charts({ agents, queues }: Props) {
  // Mock hourly data
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    calls: Math.floor(Math.random() * 100) + 50,
    emails: Math.floor(Math.random() * 50) + 20,
    tickets: Math.floor(Math.random() * 30) + 10,
  }))

  // Agent status distribution
  const statusData = [
    { name: 'Available', value: agents.filter(a => a.status === 'available').length, color: '#00ff88' },
    { name: 'On Call', value: agents.filter(a => a.status === 'on-call').length, color: '#ff9500' },
    { name: 'Email', value: agents.filter(a => a.status === 'handling-email').length, color: '#00d4ff' },
    { name: 'Ticket', value: agents.filter(a => a.status === 'working-ticket').length, color: '#8b5cf6' },
    { name: 'Break', value: agents.filter(a => a.status === 'break').length, color: '#6366f1' },
  ]

  // Team workload
  const teamData = [
    { team: 'Alpha', workload: 87, sla: 94 },
    { team: 'Bravo', workload: 72, sla: 91 },
    { team: 'Charlie', workload: 95, sla: 88 },
    { team: 'Delta', workload: 63, sla: 96 },
    { team: 'Echo', workload: 81, sla: 92 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Volume Over Time */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-2 bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Interaction Volume (24h)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="hour" stroke="#666" fontSize={12} />
            <YAxis stroke="#666" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a2e', 
                border: '1px solid #333',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="calls" 
              stroke="#ff9500" 
              strokeWidth={2}
              dot={false}
              name="Calls"
            />
            <Line 
              type="monotone" 
              dataKey="emails" 
              stroke="#00d4ff" 
              strokeWidth={2}
              dot={false}
              name="Emails"
            />
            <Line 
              type="monotone" 
              dataKey="tickets" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              dot={false}
              name="Tickets"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Agent Status Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Agent Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a2e', 
                border: '1px solid #333',
                borderRadius: '8px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          {statusData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-400">{entry.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Team Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-3 bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold mb-4">Team Performance</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={teamData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="team" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1a1a2e', 
                border: '1px solid #333',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Bar dataKey="workload" fill="#8b5cf6" name="Workload %" radius={[8, 8, 0, 0]} />
            <Bar dataKey="sla" fill="#00ff88" name="SLA %" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}
