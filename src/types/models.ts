// Core data models for LiveCenter

export type Channel = 'phone' | 'email' | 'ticket'
export type AgentStatus = 
  | 'available'
  | 'on-call'
  | 'handling-email'
  | 'working-ticket'
  | 'after-call-work'
  | 'break'
  | 'offline'

export type CallDirection = 'inbound' | 'outbound'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'
export type EmailPriority = 'normal' | 'high' | 'urgent'

export interface Agent {
  id: string
  firstName: string
  lastName: string
  fullName: string
  avatar?: string
  team: string
  department: string
  status: AgentStatus
  currentChannel?: Channel
  statusDuration: number // seconds
  handledToday: number
  performance: number // 0-100
  extension?: string
  email?: string
  skills: string[]
  lastActivity: Date
}

export interface PhoneCall {
  id: string
  agentId: string
  direction: CallDirection
  startTime: Date
  duration: number // seconds
  callerNumber?: string
  queueName?: string
  status: 'ringing' | 'connected' | 'held' | 'ended'
}

export interface EmailInteraction {
  id: string
  agentId: string
  subject: string
  from: string
  receivedAt: Date
  priority: EmailPriority
  status: 'unread' | 'reading' | 'replying' | 'sent'
  duration?: number // handling time in seconds
}

export interface Ticket {
  id: string
  agentId?: string
  title: string
  description: string
  priority: TicketPriority
  status: 'open' | 'in-progress' | 'waiting' | 'resolved' | 'closed'
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
  assignee?: string
  category: string
  channel: Channel
}

export interface Queue {
  id: string
  name: string
  channel: Channel
  waiting: number
  activeAgents: number
  avgWaitTime: number // seconds
  sla: number // percentage
  abandoned: number
  totalToday: number
}

export interface KPIMetrics {
  totalAgents: number
  agentsOnline: number
  agentsOnCalls: number
  agentsHandlingEmails: number
  agentsWorkingTickets: number
  agentsAvailable: number
  agentsOnBreak: number
  avgResponseTime: number // seconds
  activeQueueVolume: number
  serviceLevel: number // percentage
  abandonedInteractions: number
  escalatedTickets: number
  timestamp: Date
}

export interface ActivityEvent {
  id: string
  type: 'call' | 'email' | 'ticket' | 'status-change' | 'alert'
  agentId?: string
  agentName?: string
  message: string
  timestamp: Date
  channel?: Channel
  metadata?: Record<string, any>
}

export interface ChartDataPoint {
  timestamp: Date
  value: number
  label?: string
}

export interface TeamPerformance {
  teamId: string
  teamName: string
  avgHandleTime: number
  satisfaction: number // 0-100
  slaCompliance: number // percentage
  activeAgents: number
  totalHandled: number
}

// State management types
export interface DashboardState {
  agents: Agent[]
  calls: PhoneCall[]
  emails: EmailInteraction[]
  tickets: Ticket[]
  queues: Queue[]
  kpis: KPIMetrics
  activities: ActivityEvent[]
  teamPerformance: TeamPerformance[]
  filters: FilterState
}

export interface FilterState {
  team?: string
  channel?: Channel
  status?: AgentStatus
  searchQuery?: string
  sortBy?: 'workload' | 'status' | 'duration' | 'performance'
  sortOrder?: 'asc' | 'desc'
  viewMode?: 'dashboard' | 'wallboard' | 'compact'
}
