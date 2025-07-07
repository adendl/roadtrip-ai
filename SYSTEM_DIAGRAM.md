# Roadtrip.ai System Architecture Diagram

## Overview
Roadtrip.ai is a full-stack AI-powered road trip planning application that generates personalized itineraries using OpenAI's GPT-4. The system follows a modern microservices-inspired architecture with clear separation of concerns.

## System Architecture

```mermaid
graph TB
    %% External Users
    User[👤 User] --> Browser[🌐 Web Browser]
    
    %% Frontend Layer
    Browser --> Frontend["⚛️ React Frontend<br/>TypeScript + Vite"]
    Frontend --> AuthContext["🔐 Auth Context<br/>JWT Management"]
    Frontend --> Components["🧩 React Components<br/>Pages, Forms, Maps"]
    
    %% Frontend Components
    Components --> HomePage["🏠 Home Page<br/>Trip Form"]
    Components --> Dashboard["📊 Dashboard<br/>Trip Management"]
    Components --> LoginPage["🔑 Login/Signup"]
    Components --> TripDetails["🗺️ Trip Details<br/>Interactive Maps"]
    
    %% Frontend Utilities
    Frontend --> Utils["🛠️ Utilities<br/>API, PDF, Maps"]
    Utils --> APIClient["📡 API Client<br/>Axios"]
    Utils --> PDFGenerator["📄 PDF Generator<br/>jsPDF"]
    Utils --> MapUtils["🗺️ Map Utils<br/>Leaflet.js"]
    
    %% API Gateway/Load Balancer
    Frontend --> Nginx["🌐 Nginx<br/>Reverse Proxy"]
    Nginx --> Backend["☕ Spring Boot Backend<br/>Java 21"]
    
    %% Backend Layer
    Backend --> Controllers["🎮 Controllers<br/>REST API Endpoints"]
    Backend --> Services["⚙️ Services<br/>Business Logic"]
    Backend --> Repositories["🗄️ Repositories<br/>Data Access"]
    Backend --> Security["🔒 Security<br/>JWT + Spring Security"]
    
    %% Backend Components
    Controllers --> TripController["🚗 Trip Controller<br/>/api/trips/*"]
    Controllers --> UserController["👤 User Controller<br/>/api/users/*"]
    
    Services --> TripService["🚗 Trip Service<br/>AI Integration"]
    Services --> UserService["👤 User Service<br/>Authentication"]
    
    Repositories --> TripRepo["🗄️ Trip Repository"]
    Repositories --> UserRepo["🗄️ User Repository"]
    Repositories --> TripPlanRepo["🗄️ Trip Plan Repository"]
    Repositories --> DayPlanRepo["🗄️ Day Plan Repository"]
    
    %% Database Layer
    Repositories --> Database[("🐘 PostgreSQL<br/>Primary Database")]
    
    %% External APIs
    TripService --> OpenAI["🤖 OpenAI GPT-4<br/>AI Trip Generation"]
    TripService --> GraphHopper["🗺️ GraphHopper API<br/>Route Calculation"]
    TripService --> OSRM["🗺️ OSRM API<br/>Alternative Routing"]
    
    %% Infrastructure
    Backend --> Logging["📝 Logging<br/>Log4j2"]
    Backend --> Monitoring["📊 Monitoring<br/>Spring Actuator"]
    
    %% Styling
    classDef frontend fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000
    classDef backend fill:#f3e5f5,stroke:#4a148c,stroke-width:2px,color:#000
    classDef database fill:#e8f5e8,stroke:#1b5e20,stroke-width:2px,color:#000
    classDef external fill:#fff3e0,stroke:#e65100,stroke-width:2px,color:#000
    classDef infrastructure fill:#fce4ec,stroke:#880e4f,stroke-width:2px,color:#000
    
    class Frontend,AuthContext,Components,HomePage,Dashboard,LoginPage,TripDetails,Utils,APIClient,PDFGenerator,MapUtils frontend
    class Backend,Controllers,Services,Repositories,Security,TripController,UserController,TripService,UserService,TripRepo,UserRepo,TripPlanRepo,DayPlanRepo backend
    class Database database
    class OpenAI,GraphHopper,OSRM external
    class Nginx,Logging,Monitoring infrastructure
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant N as Nginx
    participant B as Backend
    participant DB as Database
    participant AI as OpenAI
    participant R as Routing APIs

    %% User Registration/Login
    U->>F: Register/Login
    F->>N: POST /api/users/register
    N->>B: Forward Request
    B->>DB: Save User (BCrypt Hash)
    DB-->>B: User Created
    B-->>N: JWT Token
    N-->>F: Token Response
    F-->>U: Login Success

    %% Trip Creation Flow
    U->>F: Create Trip Plan
    F->>N: POST /api/trips/create (JWT)
    N->>B: Forward Request
    B->>B: Validate JWT
    B->>AI: Generate Itinerary
    AI-->>B: AI Response
    B->>R: Calculate Routes
    R-->>B: Route Data
    B->>DB: Save Trip & Plans
    DB-->>B: Trip Created
    B-->>N: Complete Trip Data
    N-->>F: Trip Response
    F-->>U: Trip Displayed

    %% Trip Retrieval
    U->>F: View Trips
    F->>N: GET /api/trips/user (JWT)
    N->>B: Forward Request
    B->>B: Validate JWT
    B->>DB: Fetch User Trips
    DB-->>B: Trip Data
    B-->>N: Trip List
    N-->>F: Trip Response
    F-->>U: Dashboard Updated
```

## Database Schema

```mermaid
erDiagram
    USERS {
        bigint id PK
        varchar username UK
        varchar email UK
        varchar password
        varchar created_at
    }
    
    TRIPS {
        bigint trip_id PK
        varchar from_city
        varchar to_city
        boolean roundtrip
        int days
        double distance_km
        varchar created_at
        bigint user_id FK
    }
    
    TRIP_PLANS {
        bigint id PK
        bigint trip_id FK
    }
    
    DAY_PLANS {
        bigint id PK
        bigint trip_plan_id FK
        int day_number
        varchar start_name
        double start_latitude
        double start_longitude
        varchar finish_name
        double finish_latitude
        double finish_longitude
        double distance_km
        text introduction
    }
    
    PLACES_OF_INTEREST {
        bigint id PK
        bigint day_plan_id FK
        varchar name
        text description
        double latitude
        double longitude
    }
    
    TRIP_INTERESTS {
        bigint trip_id FK
        varchar interest
    }
    
    USERS ||--o{ TRIPS : "creates"
    TRIPS ||--o{ TRIP_PLANS : "contains"
    TRIP_PLANS ||--o{ DAY_PLANS : "contains"
    DAY_PLANS ||--o{ PLACES_OF_INTEREST : "contains"
    TRIPS ||--o{ TRIP_INTERESTS : "has"
```

## Component Architecture

### Frontend Components
```
src/
├── components/
│   ├── Button.tsx              # Reusable button component
│   ├── Card.tsx                # Card display component
│   ├── Header.tsx              # Navigation header
│   ├── Hero.tsx                # Landing page hero section
│   ├── TripForm.tsx            # Trip creation form
│   ├── TripCard.tsx            # Trip display card
│   ├── TripDetails.tsx         # Detailed trip view
│   ├── DayDetails.tsx          # Day-by-day itinerary
│   ├── TripOverviewMap.tsx     # Interactive map component
│   └── PDFDownloadButton.tsx   # PDF export functionality
├── pages/
│   ├── Home.tsx                # Landing page
│   ├── Login.tsx               # Authentication page
│   ├── SignUp.tsx              # User registration
│   └── Dashboard.tsx           # Main user dashboard
├── context/
│   └── AuthContext.tsx         # JWT authentication state
├── utils/
│   ├── api.ts                  # API client utilities
│   ├── pdfGenerator.ts         # PDF generation
│   ├── routeService.ts         # Route calculation
│   └── viteEnv.ts              # Environment configuration
└── styles/
    ├── index.css               # Global styles
    ├── Hero.css                # Hero section styles
    └── leaflet.css             # Map styles
```

### Backend Components
```
src/main/java/com/adendl/traveljournalai/
├── controller/
│   ├── TripController.java     # Trip REST endpoints
│   └── UserController.java     # User authentication endpoints
├── service/
│   ├── TripService.java        # Trip business logic + AI integration
│   └── UserService.java        # User management logic
├── repository/
│   ├── TripRepository.java     # Trip data access
│   ├── UserRepository.java     # User data access
│   ├── TripPlanRepository.java # Trip plan data access
│   └── DayPlanRepository.java  # Day plan data access
├── model/
│   ├── User.java               # User entity
│   ├── Trip.java               # Trip entity
│   ├── TripPlan.java           # Trip plan entity
│   ├── DayPlan.java            # Day plan entity
│   ├── PlaceOfInterest.java    # Place of interest entity
│   └── Location.java           # Location embeddable
├── config/
│   ├── SecurityConfig.java     # Spring Security configuration
│   ├── JwtConfig.java          # JWT configuration
│   └── JwtRequestFilter.java   # JWT authentication filter
└── utils/
    └── LoggingUtils.java       # Logging utilities
```

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Maps**: Leaflet.js + React Leaflet
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **PDF Generation**: jsPDF
- **HTTP Client**: Axios
- **Testing**: Jest + React Testing Library

### Backend
- **Framework**: Spring Boot 3
- **Language**: Java 21
- **Build Tool**: Gradle
- **Security**: Spring Security + JWT
- **Database**: PostgreSQL with JPA/Hibernate
- **Testing**: JUnit 5 + Mockito + Spring Boot Test
- **Logging**: Log4j2
- **Monitoring**: Spring Actuator

### Infrastructure
- **Web Server**: Nginx
- **Containerization**: Docker
- **Database**: PostgreSQL
- **External APIs**: OpenAI GPT-4, GraphHopper, OSRM

## Security Architecture

```mermaid
graph LR
    Client[🌐 Client] --> Nginx[🌐 Nginx<br/>Reverse Proxy]
    Nginx --> Security[🔒 Spring Security]
    Security --> JWT[JWT Filter]
    JWT --> Controllers[🎮 Controllers]
    
    Security --> Auth[🔐 Authentication]
    Security --> CORS[CORS Configuration]
    Security --> CSRF[CSRF Protection]
    
    Auth --> BCrypt[🔐 BCrypt Password Hashing]
    JWT --> JWTSecret[JWT Secret Key]
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        LoadBalancer[🌐 Load Balancer]
        LoadBalancer --> FrontendContainer[📦 Frontend Container<br/>Nginx + React]
        LoadBalancer --> BackendContainer[📦 Backend Container<br/>Spring Boot]
        BackendContainer --> Database[(🐘 PostgreSQL<br/>Database)]
        
        BackendContainer --> OpenAI[🤖 OpenAI API]
        BackendContainer --> GraphHopper[🗺️ GraphHopper API]
    end
    
    subgraph "Development Environment"
        DevFrontend[⚛️ React Dev Server<br/>localhost:5173]
        DevBackend[☕ Spring Boot<br/>localhost:8080]
        DevDatabase[(🐘 PostgreSQL<br/>localhost:5432)]
    end
```

## API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User authentication
- `GET /api/users/me` - Get current user

### Trip Management
- `POST /api/trips/create` - Create new trip plan
- `GET /api/trips/user` - Get user's trips
- `DELETE /api/trips/{id}` - Delete trip

## Data Flow Summary

1. **User Journey**: User registers/logs in → Creates trip → AI generates itinerary → Routes calculated → Trip saved → User views/manages trips

2. **AI Integration**: Trip details sent to OpenAI GPT-4 → AI generates day-by-day itinerary → Backend processes and structures data → Routes calculated via mapping APIs

3. **Data Persistence**: All trip data stored in PostgreSQL → Hierarchical structure (Trip → TripPlan → DayPlan → PlacesOfInterest)

4. **Security**: JWT-based authentication → BCrypt password hashing → CORS configuration → Stateless session management

5. **Frontend-Backend Communication**: RESTful API → JSON data exchange → JWT token authentication → Error handling and validation

This architecture provides a scalable, secure, and maintainable foundation for the AI-powered road trip planning application. 