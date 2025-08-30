# HydroChain - Green Hydrogen Credit Tracking System

## Overview

HydroChain is a blockchain-based green hydrogen credit tracking and trading platform that enables transparent, secure, and compliant management of hydrogen production certificates. The application serves as a comprehensive marketplace for hydrogen credit issuance, verification, trading, and retirement while preventing double-counting and ensuring regulatory compliance.

The system targets multiple stakeholders including hydrogen producers, buyers, regulatory bodies, and investors, providing role-based functionality for credit lifecycle management. It combines modern web technologies with blockchain concepts to create a hackathon-ready solution for the growing green hydrogen economy.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with React and TypeScript, utilizing a component-based architecture with shadcn/ui for consistent design patterns. The frontend implements:

- **Routing**: Wouter for lightweight client-side routing across main sections (Landing, Explorer, Marketplace, Regulator, Profile)
- **State Management**: TanStack Query for server state management and caching, with React hooks for local component state
- **Styling**: Tailwind CSS with a custom hydrogen-themed design system featuring blue/green color schemes and dark mode support
- **3D Visualization**: React Three Fiber integration for interactive H2 molecule animations and visual enhancements
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

The architecture follows a feature-based component organization with shared UI components, promoting reusability and maintainability.

### Backend Architecture
The server implements a REST API using Express.js with TypeScript, following a modular route-based structure:

- **API Layer**: Express routes handling authentication, credit management, marketplace operations, and regulatory functions
- **Data Layer**: In-memory storage implementation with TypeScript interfaces, designed to be easily replaceable with a database
- **Authentication**: Mock wallet-based authentication with DID (Decentralized Identity) verification simulation
- **Business Logic**: Separation of concerns with dedicated services for user management, credit lifecycle, and transaction processing

The backend architecture emphasizes type safety and scalability, with clear interfaces for data models and operations.

### Data Storage Solutions
Currently implements an in-memory storage system using TypeScript Maps for rapid prototyping and development:

- **User Management**: Wallet address-based identity with role assignments and verification status
- **Credit Storage**: Comprehensive hydrogen credit records including metadata, location data, and certification details
- **Transaction Tracking**: Complete audit trail of all credit operations (mint, trade, retire)
- **Project Management**: Producer facility and project information storage

The storage layer is abstracted through interfaces to support future database integration while maintaining the same API contract.

### Authentication and Authorization
The system implements a multi-layered authentication approach:

- **Wallet Connection**: Simulated blockchain wallet integration for user identity
- **DID Verification**: Mock Decentralized Identity verification for regulatory compliance
- **Role-Based Access**: Four user roles (producer, buyer, regulator, investor) with differentiated permissions
- **Verification Status**: Two-tier access where unverified users have limited functionality

This approach balances accessibility with security requirements for a regulated marketplace.

## External Dependencies

### UI and Design System
- **shadcn/ui**: Comprehensive component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom theming
- **Radix UI**: Accessible component primitives for complex UI patterns
- **Lucide React**: Icon library for consistent visual elements

### State Management and Data Fetching
- **TanStack Query**: Advanced server state management with caching, background updates, and optimistic updates
- **React Hook Form**: Performant form library with minimal re-renders
- **Zod**: Runtime type validation for form data and API responses

### 3D Graphics and Visualization
- **React Three Fiber**: React renderer for Three.js enabling 3D molecule animations
- **Three.js**: WebGL library for 3D graphics and interactive visualizations

### Development and Build Tools
- **Vite**: Fast build tool with hot module replacement for development
- **TypeScript**: Type safety across the entire application stack
- **ESBuild**: Fast JavaScript bundler for production builds

### Database and Schema Management
- **Drizzle ORM**: Type-safe SQL ORM with PostgreSQL dialect configuration
- **Drizzle Kit**: Schema management and migration tools for database operations

### Mock Blockchain Integration
The application simulates blockchain interactions for:
- **Wallet connectivity** with mock address generation
- **Smart contract operations** for credit minting, trading, and retirement
- **Transaction hashing** and verification simulation
- **NFT-based credit representation** with metadata standards

### Development Environment
- **Replit Integration**: Platform-specific tooling and error handling
- **Node.js Runtime**: Server-side JavaScript execution environment
- **Express.js**: Web application framework for API development