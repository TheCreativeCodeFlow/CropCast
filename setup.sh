#!/bin/bash

# CropCast Setup Script
# This script sets up the complete CropCast application with backend and frontend integration

set -e

echo "🌾 Welcome to CropCast Setup!"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    print_status "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 16+ and try again."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | sed 's/v//')
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d. -f1)
    
    if [ "$MAJOR_VERSION" -lt 16 ]; then
        print_error "Node.js version $NODE_VERSION is not supported. Please install Node.js 16+."
        exit 1
    fi
    
    print_success "Node.js $NODE_VERSION is installed"
}

# Check if npm/yarn is installed
check_package_manager() {
    print_status "Checking package manager..."
    if command -v yarn &> /dev/null; then
        PKG_MANAGER="yarn"
        print_success "Using Yarn as package manager"
    elif command -v npm &> /dev/null; then
        PKG_MANAGER="npm"
        print_success "Using npm as package manager"
    else
        print_error "Neither npm nor yarn is installed. Please install one and try again."
        exit 1
    fi
}

# Check if MongoDB is running
check_mongodb() {
    print_status "Checking MongoDB connection..."
    if command -v mongosh &> /dev/null; then
        if mongosh --eval "db.runCommand('ping')" --quiet &> /dev/null; then
            print_success "MongoDB is running and accessible"
        else
            print_warning "MongoDB is not running or not accessible"
            print_status "Please start MongoDB or update the MONGODB_URI in .env file"
        fi
    else
        print_warning "MongoDB shell (mongosh) not found"
        print_status "Make sure MongoDB is installed and running"
    fi
}

# Install backend dependencies
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Install dependencies
    if [ "$PKG_MANAGER" = "yarn" ]; then
        yarn install
    else
        npm install
    fi
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        print_warning ".env file not found in backend directory"
        print_status "Please create a .env file with required environment variables"
        print_status "Refer to .env.example for the required variables"
    else
        print_success "Backend .env file found"
        
        # Check for Gemini API key
        if ! grep -q "GEMINI_API_KEY=" .env || grep -q "GEMINI_API_KEY=your_gemini_api_key_here" .env; then
            print_warning "Gemini API key not configured in .env"
            print_status "Translation features will not work without a valid Gemini API key"
            print_status "Get your API key from: https://makersuite.google.com/app/apikey"
        fi
    fi
    
    cd ..
    print_success "Backend setup completed"
}

# Install frontend dependencies
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    if [ "$PKG_MANAGER" = "yarn" ]; then
        yarn install
    else
        npm install
    fi
    
    # Check if .env exists
    if [ ! -f ".env" ]; then
        print_status "Creating frontend .env file..."
        echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env
        print_success "Frontend .env file created"
    fi
    
    cd ..
    print_success "Frontend setup completed"
}

# Create startup scripts
create_scripts() {
    print_status "Creating startup scripts..."
    
    # Backend start script
    cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting CropCast Backend..."
cd backend
npm run dev
EOF
    
    # Frontend start script
    cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "🌐 Starting CropCast Frontend..."
cd frontend
npm run dev
EOF
    
    # Full start script
    cat > start-full.sh << 'EOF'
#!/bin/bash
echo "🌾 Starting CropCast Full Application..."
echo "This will start both backend and frontend servers"
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""

# Check if concurrently is installed globally
if ! command -v concurrently &> /dev/null; then
    echo "Installing concurrently..."
    npm install -g concurrently
fi

# Start both servers
concurrently \
    "cd backend && npm run dev" \
    "cd frontend && npm run dev" \
    --names "Backend,Frontend" \
    --prefix-colors "blue,green"
EOF
    
    # Make scripts executable
    chmod +x start-backend.sh start-frontend.sh start-full.sh
    
    print_success "Startup scripts created"
}

# Test the installation
test_installation() {
    print_status "Testing installation..."
    
    # Test backend dependencies
    cd backend
    if [ "$PKG_MANAGER" = "yarn" ]; then
        yarn list @google/generative-ai > /dev/null 2>&1 && print_success "Gemini AI package installed" || print_warning "Gemini AI package not found"
        yarn list express > /dev/null 2>&1 && print_success "Express package installed" || print_error "Express package not found"
    else
        npm list @google/generative-ai > /dev/null 2>&1 && print_success "Gemini AI package installed" || print_warning "Gemini AI package not found"
        npm list express > /dev/null 2>&1 && print_success "Express package installed" || print_error "Express package not found"
    fi
    cd ..
    
    # Test frontend dependencies
    cd frontend
    if [ "$PKG_MANAGER" = "yarn" ]; then
        yarn list react > /dev/null 2>&1 && print_success "React package installed" || print_error "React package not found"
        yarn list vite > /dev/null 2>&1 && print_success "Vite package installed" || print_error "Vite package not found"
    else
        npm list react > /dev/null 2>&1 && print_success "React package installed" || print_error "React package not found"
        npm list vite > /dev/null 2>&1 && print_success "Vite package installed" || print_error "Vite package not found"
    fi
    cd ..
}

# Create test script
create_test_script() {
    print_status "Creating test script..."
    
    cat > test-integration.sh << 'EOF'
#!/bin/bash
echo "🧪 Running CropCast Integration Tests..."
echo "Make sure the backend server is running on port 5000"
echo ""

cd backend
node test-integration.js
EOF
    
    chmod +x test-integration.sh
    print_success "Test script created"
}

# Main setup function
main() {
    echo "Starting CropCast setup process..."
    echo ""
    
    check_node
    check_package_manager
    check_mongodb
    
    echo ""
    setup_backend
    echo ""
    setup_frontend
    echo ""
    create_scripts
    create_test_script
    
    echo ""
    test_installation
    
    echo ""
    echo "=============================="
    print_success "🎉 CropCast setup completed!"
    echo "=============================="
    echo ""
    echo "📝 Next Steps:"
    echo "1. Configure your .env files with API keys"
    echo "   - Backend: Add GEMINI_API_KEY, MONGODB_URI, etc."
    echo "   - Frontend: Already configured with default values"
    echo ""
    echo "2. Start the application:"
    echo "   - Full application: ./start-full.sh"
    echo "   - Backend only: ./start-backend.sh"
    echo "   - Frontend only: ./start-frontend.sh"
    echo ""
    echo "3. Test the integration:"
    echo "   - Run: ./test-integration.sh"
    echo ""
    echo "📍 URLs:"
    echo "   - Backend API: http://localhost:5000/api"
    echo "   - Frontend App: http://localhost:5173"
    echo "   - Health Check: http://localhost:5000/api/health"
    echo ""
    echo "🔧 Important Environment Variables:"
    echo "   - GEMINI_API_KEY: Required for translation features"
    echo "   - MONGODB_URI: Required for database connection"
    echo "   - WEATHER_API_KEY: Required for weather features"
    echo ""
    print_warning "Don't forget to set up your API keys in the .env files!"
    echo ""
}

# Run main function
main