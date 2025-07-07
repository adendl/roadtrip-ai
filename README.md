# roadtrip.ai

An AI-powered road trip planning application that generates personalised itineraries using OpenAI's GPT-4.

## Overview

roadtrip.ai is a full-stack web application that helps users plan detailed road trips with AI-generated itineraries. The app combines a **React TypeScript** frontend with a **Spring Boot** backend to create comprehensive trip plans including routes, places of interest, and day-by-day itineraries.

## Features

### 🚗 AI-Powered Trip Planning
- **Smart Itinerary Generation**: Uses OpenAI GPT-4 to create personalised trip plans based on user preferences
- **Route Optimisation**: Automatically calculates optimal driving routes between destinations
- **Interest-Based Recommendations**: Tailors suggestions based on user interests (beaches, food, culture, etc.)

### 🗺️ Interactive Maps & Navigation
- **Interactive Trip Maps**: Visualise entire trips with Leaflet.js integration
- **Day-by-Day Routes**: View detailed routes for each day of your trip
- **Real-time Route Calculation**: Uses GraphHopper and OSRM APIs for accurate driving directions
- **Place Markers**: Interactive markers for start/end points and places of interest

### 📱 User Experience
- **User Authentication**: Secure JWT-based authentication system
- **Trip Management**: Create, view, and delete trip plans
- **PDF Export**: Download complete trip itineraries as PDF documents
- **Responsive Design**: Modern, mobile-friendly interface built with Tailwind CSS

### 🎯 Trip Details
- **Multi-day Planning**: Plan trips from 1 to multiple days
- **Round-trip Support**: Option for one-way or round-trip journeys
- **Distance Calculations**: Automatic distance and route calculations
- **Place Descriptions**: AI-generated descriptions for each point of interest
- **Accommodation Search**: Direct links to search for accommodation at destinations

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Leaflet.js** for interactive maps
- **React Router** for navigation
- **Framer Motion** for animations
- **jsPDF** for PDF generation

### Backend
- **Spring Boot 3** with Java 17
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **PostgreSQL** database
- **OpenAI GPT-4** API integration
- **GraphHopper/OSRM** for route calculation

### DevOps
- **Docker** containerisation
- **Nginx** for frontend serving
- **Maven** for Java dependency management
- **npm** for Node.js dependencies

## Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- PostgreSQL database
- OpenAI API key

### Backend Setup
1. Clone the repository
2. Configure your `application.properties` with database and OpenAI API credentials
3. Run the Spring Boot application:
   ```bash
   cd backend
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

#### Frontend Setup
1. Copy the environment template:
   ```bash
   cp frontend/env.template frontend/.env.development
   ```
2. Configure your API URL in the `.env.development` file

#### Backend Setup
1. Copy the configuration template:
   ```bash
   cp backend/src/main/resources/application.properties.template backend/src/main/resources/application.properties
   ```
2. Configure your database and API credentials in `application.properties`

**⚠️ Security Note**: Never commit actual API keys or database credentials to version control. Use environment variables and template files as shown above.

For detailed security guidelines, see [SECURITY.md](SECURITY.md).

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Trips
- `POST /api/trips/create` - Create new trip plan
- `GET /api/trips/user` - Get user's trips
- `DELETE /api/trips/{id}` - Delete trip

## How It Works

1. **Trip Creation**: Users specify start/end locations, trip duration, and interests
2. **AI Processing**: The backend sends trip details to OpenAI GPT-4 for itinerary generation
3. **Route Calculation**: Driving routes are calculated using mapping APIs
4. **Interactive Display**: Frontend displays the complete trip plan with interactive maps
5. **Export Options**: Users can download their trip plan as a PDF document

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for GPT-4 API
- GraphHopper and OSRM for routing services
- Leaflet.js for mapping functionality
- The React and Spring Boot communities
