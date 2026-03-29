# LiveCenter

Enterprise-grade real-time call center operations dashboard.

## 🎯 Overview

LiveCenter is a premium supervisor dashboard / command center / wallboard for contact center operations. It provides immediate operational visibility into:

- Phone call operations
- Email management
- Ticket handling
- Agent activity and performance
- Queue management
- SLA monitoring

## 🚀 Features

### Core Capabilities
- **Real-time KPI Dashboard** - Headline metrics at a glance
- **Live Agent Activity** - Track all agent states and activities
- **Multi-Channel Operations** - Phone, Email, and Ticket views
- **Activity Feed** - Real-time event stream
- **Advanced Analytics** - Polished charts and trend visualization
- **Supervisor Controls** - Filters, search, wallboard mode

### Visual Design
- Dark enterprise theme
- Smooth animations
- Glowing status indicators
- Premium dashboard UI
- Large-screen optimized
- Responsive behavior

## 🏗️ Architecture

```
livecenter/
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # Reusable UI components
│   ├── lib/             # Core logic and services
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript definitions
│   └── styles/          # Global styles
├── infrastructure/      # Infrastructure as Code
├── docs/               # Documentation
└── scripts/            # Utility scripts
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/RoyHolzem/livecenter.git
cd livecenter

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏢 Infrastructure

See `/infrastructure/README.md` for deployment instructions.

Supported platforms:
- AWS ( Amplify, S3 + CloudFront, ECS)
- Azure (Static Web Apps)
- GCP (Cloud Run)
- Vercel
- Self-hosted (Docker)

## 📊 Mock Data

The dashboard includes realistic mock data simulation:

- Live agent state changes
- Real-time queue updates
- Activity feed events
- Performance metrics
- SLA calculations

## 🔌 Future Integrations

Architecture supports easy integration with:

- **Telephony**: Genesys, Avaya, Twilio, Cisco
- **Email**: Microsoft 365, Gmail, Zendesk
- **Ticketing**: Zendesk, ServiceNow, Freshdesk
- **CRM**: Salesforce, HubSpot
- **Analytics**: Custom APIs, WebSocket streams

## 📖 Documentation

- [Architecture Guide](./docs/ARCHITECTURE.md)
- [API Integration](./docs/INTEGRATION.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Customization](./docs/CUSTOMIZATION.md)

## 🎨 Customization

### Themes
Edit `tailwind.config.ts` to customize colors and styling.

### Data Sources
Replace mock services in `/src/lib/services/` with real API adapters.

## 📝 License

MIT

---

Built with ❤️ for enterprise contact center operations.
