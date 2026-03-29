// Mock data generator for realistic call center simulation

import {
  Agent,
  AgentStatus,
  Channel,
  PhoneCall,
  EmailInteraction,
  Ticket,
  Queue,
  KPIMetrics,
  ActivityEvent,
  TeamPerformance,
  CallDirection,
} from '../../types/models'

// Realistic data pools
const FIRST_NAMES = [
  'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'James', 'Ashley', 'Chris',
  'Amanda', 'Daniel', 'Stephanie', 'Matthew', 'Nicole', 'Andrew', 'Jennifer',
  'Joshua', 'Elizabeth', 'Ryan', 'Megan', 'Brandon', 'Rachel', 'Justin',
  'Lauren', 'Kevin', 'Heather', 'Jason', 'Rebecca', 'Tyler', 'Amber', 'Adam'
]

const LAST_NAMES = [
  'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson',
  'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee',
  'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez'
]

const TEAMS = ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot']
const DEPARTMENTS = ['Customer Support', 'Technical Support', 'Sales', 'Billing', 'Enterprise']

const EMAIL_SUBJECTS = [
  'Unable to access account',
  'Billing discrepancy on invoice #{{id}}',
  'Product return request',
  'Feature request: dark mode',
  'Shipping delay inquiry',
  'Password reset not working',
  'Subscription cancellation',
  'Upgrade plan question',
  'Technical issue with checkout',
  'Partnership inquiry'
]

const TICKET_TITLES = [
  'System outage affecting customers',
  'Integration API timeout',
  'Customer complaint - poor service',
  'Feature enhancement request',
  'Security vulnerability report',
  'Performance degradation',
  'Data sync issue',
  'Customer escalation',
  'Bug: unable to complete transaction',
  'Infrastructure upgrade request'
]

// Utility functions
function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomDuration(minSeconds: number, maxSeconds: number): number {
  return randomNumber(minSeconds, maxSeconds)
}

// Generate agents
export function generateAgents(count: number = 50): Agent[] {
  const agents: Agent[] = []
  
  for (let i = 0; i < count; i++) {
    const firstName = randomElement(FIRST_NAMES)
    const lastName = randomElement(LAST_NAMES)
    const status = randomElement([
      'available', 'on-call', 'handling-email', 'working-ticket',
      'after-call-work', 'break', 'available', 'on-call', 'available'
    ] as AgentStatus[])
    
    agents.push({
      id: `agent-${i + 1}`,
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      team: randomElement(TEAMS),
      department: randomElement(DEPARTMENTS),
      status,
      currentChannel: status === 'on-call' ? 'phone' : 
                      status === 'handling-email' ? 'email' :
                      status === 'working-ticket' ? 'ticket' : undefined,
      statusDuration: randomDuration(60, 7200), // 1 min to 2 hours
      handledToday: randomNumber(5, 45),
      performance: randomNumber(70, 100),
      extension: `200${i + 1}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      skills: ['General', 'Technical', randomElement(['Billing', 'Sales', 'Enterprise'])],
      lastActivity: new Date(Date.now() - randomDuration(0, 600)),
    })
  }
  
  return agents
}

// Generate phone calls
export function generatePhoneCalls(agents: Agent[]): PhoneCall[] {
  const activeCalls: PhoneCall[] = []
  const onCallAgents = agents.filter(a => a.status === 'on-call')
  
  onCallAgents.forEach(agent => {
    activeCalls.push({
      id: `call-${Date.now()}-${agent.id}`,
      agentId: agent.id,
      direction: randomElement(['inbound', 'outbound'] as CallDirection[]),
      startTime: new Date(Date.now() - randomDuration(30, 900)),
      duration: randomDuration(30, 900),
      callerNumber: `+1${randomNumber(200, 999)}${randomNumber(1000000, 9999999)}`,
      queueName: randomElement(['General', 'Technical', 'Sales', 'Billing']),
      status: 'connected',
    })
  })
  
  return activeCalls
}

// Generate emails
export function generateEmails(): EmailInteraction[] {
  const emails: EmailInteraction[] = []
  const count = randomNumber(15, 40)
  
  for (let i = 0; i < count; i++) {
    emails.push({
      id: `email-${Date.now()}-${i}`,
      agentId: undefined,
      subject: randomElement(EMAIL_SUBJECTS).replace('{{id}}', randomNumber(10000, 99999).toString()),
      from: `customer${randomNumber(1, 999)}@example.com`,
      receivedAt: new Date(Date.now() - randomDuration(0, 86400)),
      priority: randomElement(['normal', 'high', 'urgent']),
      status: randomElement(['unread', 'unread', 'unread', 'reading']),
    })
  }
  
  return emails
}

// Generate tickets
export function generateTickets(): Ticket[] {
  const tickets: Ticket[] = []
  const count = randomNumber(20, 50)
  
  for (let i = 0; i < count; i++) {
    const priority = randomElement(['low', 'medium', 'high', 'critical'] as const)
    const status = randomElement(['open', 'open', 'in-progress', 'waiting', 'resolved'] as const)
    
    tickets.push({
      id: `TKT-${randomNumber(10000, 99999)}`,
      agentId: status === 'in-progress' ? `agent-${randomNumber(1, 50)}` : undefined,
      title: randomElement(TICKET_TITLES),
      description: 'Customer reported an issue that requires investigation.',
      priority,
      status,
      createdAt: new Date(Date.now() - randomDuration(0, 172800)),
      updatedAt: new Date(Date.now() - randomDuration(0, 3600)),
      dueDate: priority === 'critical' ? new Date(Date.now() + 3600000) : 
              priority === 'high' ? new Date(Date.now() + 14400000) : undefined,
      assignee: undefined,
      category: randomElement(['Technical', 'Billing', 'General', 'Escalation']),
      channel: 'ticket',
    })
  }
  
  return tickets
}

// Generate queues
export function generateQueues(): Queue[] {
  return [
    {
      id: 'queue-phone',
      name: 'Phone Queue',
      channel: 'phone',
      waiting: randomNumber(2, 15),
      activeAgents: randomNumber(8, 20),
      avgWaitTime: randomDuration(30, 300),
      sla: randomNumber(80, 98),
      abandoned: randomNumber(0, 10),
      totalToday: randomNumber(200, 500),
    },
    {
      id: 'queue-email',
      name: 'Email Queue',
      channel: 'email',
      waiting: randomNumber(10, 50),
      activeAgents: randomNumber(3, 10),
      avgWaitTime: randomDuration(600, 3600),
      sla: randomNumber(85, 99),
      abandoned: randomNumber(0, 5),
      totalToday: randomNumber(100, 300),
    },
    {
      id: 'queue-ticket',
      name: 'Ticket Queue',
      channel: 'ticket',
      waiting: randomNumber(5, 30),
      activeAgents: randomNumber(5, 15),
      avgWaitTime: randomDuration(1200, 7200),
      sla: randomNumber(75, 95),
      abandoned: 0,
      totalToday: randomNumber(50, 150),
    },
  ]
}

// Calculate KPIs from current state
export function calculateKPIs(agents: Agent[], queues: Queue[]): KPIMetrics {
  return {
    totalAgents: agents.length,
    agentsOnline: agents.filter(a => a.status !== 'offline').length,
    agentsOnCalls: agents.filter(a => a.status === 'on-call').length,
    agentsHandlingEmails: agents.filter(a => a.status === 'handling-email').length,
    agentsWorkingTickets: agents.filter(a => a.status === 'working-ticket').length,
    agentsAvailable: agents.filter(a => a.status === 'available').length,
    agentsOnBreak: agents.filter(a => a.status === 'break').length,
    avgResponseTime: randomDuration(45, 180),
    activeQueueVolume: queues.reduce((sum, q) => sum + q.waiting, 0),
    serviceLevel: randomNumber(80, 95),
    abandonedInteractions: queues.reduce((sum, q) => sum + q.abandoned, 0),
    escalatedTickets: randomNumber(0, 5),
    timestamp: new Date(),
  }
}

// Generate activity events
export function generateActivityEvents(agents: Agent[]): ActivityEvent[] {
  const events: ActivityEvent[] = []
  const count = 20
  
  for (let i = 0; i < count; i++) {
    const agent = randomElement(agents)
    const type = randomElement(['call', 'email', 'ticket', 'status-change'] as const)
    
    let message = ''
    switch (type) {
      case 'call':
        message = `${agent.fullName} answered a ${randomElement(['inbound', 'outbound'])} call`
        break
      case 'email':
        message = `${agent.fullName} replied to an email`
        break
      case 'ticket':
        message = `${agent.fullName} ${randomElement(['opened', 'updated', 'closed'])} ticket TKT-${randomNumber(10000, 99999)}`
        break
      case 'status-change':
        message = `${agent.fullName} changed status to ${randomElement(['available', 'break', 'after-call-work'])}`
        break
    }
    
    events.push({
      id: `event-${Date.now()}-${i}`,
      type,
      agentId: agent.id,
      agentName: agent.fullName,
      message,
      timestamp: new Date(Date.now() - randomDuration(0, 3600)),
      channel: type === 'call' ? 'phone' : type === 'email' ? 'email' : type === 'ticket' ? 'ticket' : undefined,
    })
  }
  
  return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

// Generate team performance data
export function generateTeamPerformance(): TeamPerformance[] {
  return TEAMS.map(team => ({
    teamId: team.toLowerCase(),
    teamName: team,
    avgHandleTime: randomDuration(180, 600),
    satisfaction: randomNumber(75, 98),
    slaCompliance: randomNumber(80, 98),
    activeAgents: randomNumber(5, 15),
    totalHandled: randomNumber(50, 200),
  }))
}

// Simulate state changes (for live updates)
export function simulateAgentStateChange(agents: Agent[]): Agent[] {
  const updated = [...agents]
  const randomIndex = randomNumber(0, updated.length - 1)
  const agent = updated[randomIndex]
  
  // Randomly change status
  const possibleStatuses: AgentStatus[] = ['available', 'on-call', 'handling-email', 'working-ticket', 'break']
  agent.status = randomElement(possibleStatuses)
  agent.currentChannel = agent.status === 'on-call' ? 'phone' : 
                         agent.status === 'handling-email' ? 'email' :
                         agent.status === 'working-ticket' ? 'ticket' : undefined
  agent.statusDuration = randomDuration(60, 1800)
  agent.lastActivity = new Date()
  
  return updated
}
