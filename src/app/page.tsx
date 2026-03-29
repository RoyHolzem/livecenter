'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import { 
  Phone, Mail, Ticket, Users, Activity, TrendingUp, Clock, AlertCircle 
} from 'lucide-react'
import { 
  Agent, KPIMetrics, Queue, ActivityEvent, AgentStatus 
} from '../types/models'
import { 
  generateAgents, generateQueues, calculateKPIs, 
  generateActivityEvents, simulateAgentStateChange 
} from '../lib/services/mockDataService'
import KPICards from '../components/dashboard/KPICards'
import AgentGrid from '../components/dashboard/AgentGrid'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import Charts from '../components/dashboard/Charts'
import QueueStatus from '../components/dashboard/QueueStatus'
import '../lib/amplify-config'

function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [queues, setQueues] = useState<Queue[]>([])
  const [kpis, setKpis] = useState<KPIMetrics | null>(null)
  const [activities, setActivities] = useState<ActivityEvent[]>([])
  const [isWallboard, setIsWallboard] = useState(false)

  // Initialize data
  useEffect(() => {
    const initialAgents = generateAgents(50)
    const initialQueues = generateQueues()
    const initialKpis = calculateKPIs(initialAgents, initialQueues)
    const initialActivities = generateActivityEvents(initialAgents)
    
    setAgents(initialAgents)
    setQueues(initialQueues)
    setKpis(initialKpis)
    setActivities(initialActivities)
  }, [])

  // Simulate live updates
  useEffect(() => {
    if (agents.length === 0) return

    const interval = setInterval(() => {
      // Simulate state changes
      setAgents(prev => simulateAgentStateChange(prev))
      setQueues(prev => prev.map(q => ({
        ...q,
        waiting: Math.max(0, q.waiting + Math.floor(Math.random() * 3) - 1),
        avgWaitTime: Math.floor(q.avgWaitTime * (0.95 + Math.random() * 0.1)),
      })))
      
      // Add new activity occasionally
      if (Math.random() > 0.7) {
        const newEvent = generateActivityEvents(agents.slice(0, 5))[0]
        setActivities(prev => [newEvent, ...prev.slice(0, 49)])
      }
      
      // Update KPIs
      setKpis(prev => prev ? {
        ...prev,
        agentsOnCalls: agents.filter(a => a.status === 'on-call').length,
        agentsAvailable: agents.filter(a => a.status === 'available').length,
        activeQueueVolume: queues.reduce((sum, q) => sum + q.waiting, 0),
        timestamp: new Date(),
      } : null)
    }, 2000)

    return () => clearInterval(interval)
  }, [agents, queues])

  if (!kpis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Initializing LiveCenter...</p>
        </div>
      </div>
    )
  }

  return (
    <Authenticator
      socialProviders={['google']}
      loginMechanisms={['email']}
    >
      {({ signOut, user }) => (
        <div className={`min-h-screen ${isWallboard ? 'wallboard-mode' : ''}`}>
          {/* Header */}
          <header className="bg-black/50 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
            <div className="max-w-[1920px] mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">LiveCenter</h1>
                  <p className="text-xs text-gray-400">Operations Command Center</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="text-gray-400">
                    {user?.attributes?.email || 'User'}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-sm text-gray-400">LIVE</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsWallboard(!isWallboard)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isWallboard 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {isWallboard ? 'Exit Wallboard' : 'Wallboard Mode'}
                </button>
                
                <button
                  onClick={signOut}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </header>

      {/* Main Content */}
      <main className="max-w-[1920px] mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* User Info Bar */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Metrics</h2>
              <p className="text-sm text-gray-400">Real-time key performance indicators</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-400">Signed in as</p>
                <p className="text-sm font-medium text-white">{user?.signInDetails?.loginId || 'User'}</p>
              </div>
              <button
                onClick={signOut}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <section className="mb-8">
            <KPICards kpis={kpis} />
          </section>

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Agent Grid - 8 cols */}
            <div className="col-span-12 xl:col-span-8">
              <AgentGrid agents={agents} />
            </div>

            {/* Right Sidebar - 4 cols */}
            <div className="col-span-12 xl:col-span-4 space-y-6">
              <QueueStatus queues={queues} />
              <ActivityFeed activities={activities.slice(0, 15)} />
            </div>
          </div>

          {/* Charts */}
          <section className="mt-8">
            <Charts agents={agents} queues={queues} />
          </section>
        </motion.div>
      </main>
        </div>
      )}
    </Authenticator>
  )
}
