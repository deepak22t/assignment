"""
Vercel serverless function handler for FastAPI backend
This file allows FastAPI to run on Vercel's serverless platform
"""
import sys
import os
from pathlib import Path

# Get absolute paths
api_dir = Path(__file__).parent.absolute()
backend_path = api_dir.parent / 'backend'

# Add backend directory to Python path
sys.path.insert(0, str(backend_path))

# Set environment variables for proper path resolution
os.environ['BACKEND_DIR'] = str(backend_path)
os.environ['DATA_DIR'] = str(backend_path / 'data')

# Import after setting up paths
from main import app
from mangum import Mangum

# Wrap FastAPI app with Mangum for AWS Lambda/Vercel compatibility
handler = Mangum(app, lifespan="off")

