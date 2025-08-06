# TimeTracker Pro - AI-Powered Time Tracking Application

## Overview

TimeTracker Pro is a full-stack web application built for tracking daily activities with AI-powered categorization and insights. The application features a React-based frontend with a modern UI using shadcn/ui components, an Express.js backend with RESTful APIs, and PostgreSQL database integration through Drizzle ORM. The system includes intelligent activity categorization using OpenAI's GPT-4o model, real-time notifications, and comprehensive analytics dashboards.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and dark mode support
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Charts**: Chart.js for data visualization in analytics
- **Notifications**: Browser Notification API integration with custom hooks

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints following conventional patterns
- **Middleware**: Custom logging, JSON parsing, and error handling
- **Development**: Hot module replacement with Vite integration
- **File Structure**: Separation of routes, services, and storage layers

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM
- **Schema**: Three main entities - users, activities, and settings
- **Migration System**: Drizzle-kit for schema migrations
- **Connection**: Neon Database serverless PostgreSQL
- **Fallback Storage**: In-memory storage implementation for development

### Authentication and Authorization
- **Session Management**: Express sessions with PostgreSQL session store
- **User System**: Simple username/password authentication
- **Demo Mode**: Default demo user for simplified onboarding
- **Security**: Basic validation and sanitization

### AI Integration Architecture
- **Provider**: OpenAI GPT-4o model for intelligent categorization
- **Services**: Dedicated OpenAI service layer for API interactions
- **Features**: 
  - Automatic activity categorization with confidence scoring
  - Productivity insights generation
  - Category suggestions with reasoning
- **Error Handling**: Graceful fallbacks when AI services are unavailable

### Component Architecture
- **Design System**: Consistent component library with shadcn/ui
- **Composition**: Reusable UI components with props-based customization
- **Form Handling**: React Hook Form with Zod validation
- **Modal System**: Radix UI dialogs for settings and notifications
- **Responsive Design**: Mobile-first approach with breakpoint utilities

### Development and Deployment
- **Environment**: Multi-environment configuration (development/production)
- **Build Process**: Separate client and server builds with ESBuild
- **Asset Handling**: Vite-based asset optimization and bundling
- **Development Tools**: Hot reload, error overlays, and debugging support

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection Pool**: @neondatabase/serverless for optimized connections

### AI and Machine Learning
- **OpenAI API**: GPT-4o model for text analysis and categorization
- **Natural Language Processing**: Activity description analysis and categorization

### UI and Design
- **Radix UI**: Comprehensive primitive components for accessibility
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Inter Font**: Typography from Google Fonts
- **Font Awesome**: Additional icon support

### Development Tools
- **Drizzle ORM**: Type-safe database operations and migrations
- **TanStack Query**: Server state synchronization and caching
- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation for type safety
- **Chart.js**: Data visualization for analytics

### Build and Development
- **Vite**: Frontend build tool and development server
- **ESBuild**: Fast JavaScript bundler for production
- **TypeScript**: Static type checking and enhanced IDE support
- **Replit Integration**: Development environment optimizations

### Session and Storage
- **connect-pg-simple**: PostgreSQL session store for Express
- **nanoid**: Unique ID generation for database records

### Utilities and Helpers
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional CSS class management
- **class-variance-authority**: Component variant management
- **cmdk**: Command palette functionality