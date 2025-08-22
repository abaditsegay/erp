# Ethiopian Inventory Management System - Frontend

## Overview

This is a comprehensive Ethiopian inventory management frontend built with React, TypeScript, and Material-UI. It features Ethiopian business-specific functionality including multi-regional warehouse management, Ethiopian Birr (ETB) currency support, customs clearance tracking, and regional business analytics.

## 🚀 Features

### Core Inventory Management
- **Multi-Warehouse Management**: Support for different warehouse types (Main, Distribution, Customs, Retail, Cold Storage)
- **Regional Operations**: Ethiopian region-based warehouse organization (Addis Ababa, Dire Dawa, Amhara, Oromia, etc.)
- **Stock Level Tracking**: Real-time inventory levels with low stock alerts
- **Stock Movement History**: Complete audit trail of inventory movements

### Ethiopian Business Features
- **Dual Currency Support**: USD and Ethiopian Birr (ETB) with live exchange rates
- **Customs Integration**: Track items pending customs clearance at Bole Airport and other entry points
- **Regional Warehouses**: Support for Ethiopia's 12 regions and major cities
- **ABC Analysis**: Inventory classification for Ethiopian business priorities
- **Slow-Moving Items**: Identify items that need attention in Ethiopian market conditions

### Analytics & Reporting
- **Inventory Turnover**: Calculate turnover rates in Ethiopian business context
- **Days Sales Inventory**: Track how long inventory sits in Ethiopian warehouses
- **Valuation Reports**: Real-time inventory valuation in both USD and ETB
- **Regional Performance**: Compare warehouse performance across Ethiopian regions

### User Experience
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Live data refresh for critical inventory metrics
- **Ethiopian UI Elements**: Colors and design reflecting Ethiopian business aesthetics
- **Multi-language Ready**: Prepared for Amharic and other Ethiopian languages

## 🏗️ Technical Architecture

### Frontend Stack
- **React 18.2.0**: Modern React with hooks and concurrent features
- **TypeScript 4.9.5**: Type-safe development with Ethiopian business types
- **Material-UI 5.14.20**: Google's Material Design components
- **React Query 3.39.3**: Server state management and caching
- **React Router 6.8.1**: Client-side routing and navigation
- **Recharts 2.8.0**: Data visualization for inventory analytics

### Key Components
```
src/
├── components/
│   ├── Layout/           # Main application layout
│   └── Auth/            # Authentication components
├── pages/
│   └── Inventory/       # Main inventory dashboard
├── hooks/
│   ├── useInventory.ts  # React Query hooks for API calls
│   └── useDemoInventory.ts # Demo hooks with mock data
├── services/
│   └── inventoryService.ts # API service layer
├── types/
│   └── inventory.ts     # TypeScript type definitions
└── contexts/
    └── MockDataProvider.tsx # Demo data provider
```

### Ethiopian Business Types
- **Warehouse Types**: Main, Distribution, Customs, Retail, Cold Storage
- **Ethiopian Regions**: All 12 regions including Addis Ababa, Dire Dawa
- **Currency Types**: USD and ETB with conversion support
- **Movement Types**: IN, OUT, TRANSFER, ADJUSTMENT

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Modern web browser
- Backend API running on `localhost:8081` (when not using demo mode)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd ERPProject/implementation/frontend

# Install dependencies
npm install

# Start development server
npm start
```

The application will open at `http://localhost:3001`

### Demo Mode
The application includes comprehensive demo data featuring:
- 5 Ethiopian warehouses across different regions
- Sample items including Ethiopian coffee, teff flour, berbere spice
- Low stock alerts for coffee and teff flour
- Pending customs items (solar panels)
- Real currency conversion rates

## 📊 Dashboard Features

### Key Metrics Cards
- **Total Items**: Complete inventory count
- **Warehouses**: Regional warehouse distribution
- **Low Stock Items**: Items below minimum levels
- **Pending Customs**: Items awaiting customs clearance

### Tabbed Interface
1. **Warehouses Tab**: Visual cards showing all warehouses with regional filters
2. **Low Stock Alerts**: List of items requiring reorder
3. **Customs Clearance**: Items pending at Ethiopian customs
4. **Analytics**: Inventory turnover and performance metrics

### Regional Filtering
- Filter warehouses by Ethiopian regions
- All regions supported including:
  - Addis Ababa (capital)
  - Dire Dawa (trade hub)
  - Amhara, Oromia, Tigray (major regions)
  - SNNP, Sidama, Somali (regional states)

## 🔄 API Integration

### Service Layer
The `inventoryService.ts` provides comprehensive API integration:
- RESTful API calls with axios
- Authentication token management
- Ethiopian business operations
- Error handling and retry logic

### React Query Integration
- Optimistic updates for better UX
- Background refetching for real-time data
- Caching with appropriate stale times
- Loading and error state management

### Backend Endpoints (when available)
```
GET /api/inventory/dashboard          # Main dashboard data
GET /api/inventory/warehouses         # All warehouses
GET /api/inventory/low-stock          # Low stock alerts
GET /api/inventory/customs/pending    # Pending customs items
GET /api/inventory/currency/usd-to-etb # Currency conversion
POST /api/inventory/items             # Create new item
PUT /api/inventory/items/:id          # Update item
```

## 🎨 Ethiopian Business Customization

### Currency Display
- ETB formatting: `Br 1,234.56`
- USD formatting: `$123.45`
- Live exchange rate display
- Dual currency inventory valuation

### Regional Support
```typescript
const ETHIOPIAN_REGIONS = [
  'Addis Ababa', 'Afar', 'Amhara', 'Benishangul-Gumuz',
  'Dire Dawa', 'Gambela', 'Harari', 'Oromia',
  'Sidama', 'SNNP', 'Somali', 'Tigray'
];
```

### Warehouse Types
- **Main Warehouse**: Central distribution in Addis Ababa
- **Distribution Center**: Regional distribution hubs
- **Customs Warehouse**: Import/export facilities
- **Retail Outlet**: Customer-facing locations
- **Cold Storage**: Temperature-controlled facilities

## 📱 Mobile Responsiveness

- Responsive grid layout adapts to all screen sizes
- Touch-friendly interface for mobile inventory management
- Optimized loading for Ethiopian mobile networks
- Offline-ready design patterns

## 🔒 Security Features

- JWT token-based authentication
- Protected routes with role-based access
- Secure API communication
- Ethiopian data privacy compliance ready

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Vercel**: Simple deployment with GitHub integration
- **Netlify**: Static site hosting with form handling
- **AWS S3 + CloudFront**: Scalable global CDN
- **Ethiopian Cloud Providers**: Local hosting options

## 🧪 Testing

### Run Tests
```bash
npm test              # Run test suite
npm run test:coverage # Generate coverage report
```

### Demo Data Testing
The application includes comprehensive demo data for testing:
- Mock Ethiopian warehouses
- Sample inventory items
- Realistic stock levels
- Currency conversion examples

## 📈 Performance Optimization

- **Code Splitting**: Lazy loading of inventory components
- **Image Optimization**: Optimized assets for Ethiopian networks
- **Caching Strategy**: Smart caching with React Query
- **Bundle Analysis**: Optimized bundle size

## 🔧 Development

### Adding New Features
1. Create TypeScript types in `types/inventory.ts`
2. Add API methods in `services/inventoryService.ts`
3. Create React Query hooks in `hooks/useInventory.ts`
4. Build UI components with Material-UI
5. Add demo data in `contexts/MockDataProvider.tsx`

### Ethiopian Customization
- Modify `ETHIOPIAN_REGIONS` for additional regions
- Update currency formatting in `ethiopianHelpers`
- Customize warehouse types for local business needs
- Add Amharic translations

## 📚 Documentation

### API Documentation
- Service layer methods documented with TypeScript
- React Query hooks with usage examples
- Ethiopian business logic documentation

### Component Documentation
- PropTypes and TypeScript interfaces
- Usage examples for each component
- Ethiopian business workflow documentation

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/ethiopian-feature`)
3. Commit changes (`git commit -am 'Add Ethiopian feature'`)
4. Push to branch (`git push origin feature/ethiopian-feature`)
5. Create Pull Request

## 📄 License

This project is proprietary software for Ethiopian inventory management.

---

## 🇪🇹 Ethiopian Business Focus

This inventory management system is specifically designed for Ethiopian businesses with:
- Support for Ethiopian Birr (ETB) and USD currencies
- Regional warehouse management across Ethiopia's 12 regions
- Customs clearance tracking for import/export operations
- Ethiopian business workflow optimization
- Cultural and linguistic considerations for Ethiopian users

**Built with ❤️ for Ethiopian businesses**
