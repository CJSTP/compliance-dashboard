#!/bin/zsh
# Setup script for the Regulatory Compliance Dashboard

echo "🚀 Setting up Regulatory Compliance Dashboard..."

# Create Python virtual environment
echo "📦 Setting up Python environment..."
cd backend
python -m venv venv
source venv/bin/activate

# Install Python dependencies
echo "📚 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Update .env with your database URL and settings"
fi

# Create SQLite database (for development)
echo "🗄️  Initializing database..."
sqlite3 compliance.db ""

cd ..

# Setup frontend
echo "📦 Setting up Node.js environment..."
cd frontend
npm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update backend/.env with your database URL"
echo "2. Start backend: cd backend && source venv/bin/activate && python main.py"
echo "3. Start frontend: cd frontend && npm run dev"
echo "4. Open http://localhost:5173 in your browser"
