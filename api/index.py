"""
Vercel serverless function handler for FastAPI backend
This file allows FastAPI to run on Vercel's serverless platform
"""
import sys
import os
from pathlib import Path

try:
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
    
except Exception as e:
    # Create a minimal error handler if imports fail
    import traceback
    error_msg = f"Failed to initialize FastAPI app: {str(e)}\n{traceback.format_exc()}"
    print(error_msg, file=sys.stderr)
    
    # Create a minimal FastAPI app that returns the error
    from fastapi import FastAPI
    from mangum import Mangum
    
    error_app = FastAPI()
    
    @error_app.get("/{path:path}")
    async def error_handler(path: str):
        return {
            "error": "Server initialization failed",
            "message": str(e),
            "path": path
        }
    
    handler = Mangum(error_app, lifespan="off")

