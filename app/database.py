from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Define the database URL
SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"

# 2. Create the SQLAlchemy engine
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 3. Create a SessionLocal class, which will be our database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4. Create a Base class
Base = declarative_base()

# 5. A function to get a database session 
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()