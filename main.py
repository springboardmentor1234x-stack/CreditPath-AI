import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from . import auth, database

app = FastAPI(title="CreditPathAI")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize DB
from . import models  # ensure models are registered
models.Base.metadata.create_all(bind=database.engine)

# Include routers
app.include_router(auth.router)
from . import predict
app.include_router(predict.router)

# Frontend dir (project has separate frontend outside backend for this package)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend"))

# If frontend exists, mount it. Otherwise, skip.
if os.path.isdir(FRONTEND_DIR):
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

    @app.get("/", include_in_schema=False)
    def home():
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

    @app.get("/{page}", include_in_schema=False)
    def serve_page(page: str):
        file_path = os.path.join(FRONTEND_DIR, f"{page}.html")
        if os.path.exists(file_path):
            return FileResponse(file_path)
        return {"error": "Page not found"}
else:
    @app.get("/", include_in_schema=False)
    def root():
        return {"message": "CreditPathAI backend running. Frontend not found."}
