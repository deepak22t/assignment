"""
Vercel serverless function handler for FastAPI backend
This file allows FastAPI to run on Vercel's serverless platform
"""
import sys
import os

# Add backend directory to Python path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.insert(0, backend_path)

# Change to backend directory to ensure relative imports work
os.chdir(backend_path)

from main import app
from mangum import Mangum

# Wrap FastAPI app with Mangum for AWS Lambda/Vercel compatibility
handler = Mangum(app, lifespan="off")

