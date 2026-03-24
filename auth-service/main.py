from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel
import bcrypt
from jose import jwt
from datetime import datetime, timedelta
import sqlite3
import os

app = FastAPI(title="Auth Service")

SECRET_KEY = "super_secret_key_for_billing"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Removed pwd_context as we are using bcrypt directly
DB_PATH = "auth.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY, password TEXT)''')
    conn.commit()
    conn.close()

@app.on_event("startup")
def startup():
    init_db()

class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

def get_password_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain, hashed):
    return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire.timestamp()})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/register", response_model=Token)
async def register(user: UserCreate):
    if not user.password:
        raise HTTPException(status_code=400, detail="Password cannot be empty")
        
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username=?", (user.username,))
    if c.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed = get_password_hash(user.password)
    c.execute("INSERT INTO users VALUES (?, ?)", (user.username, hashed))
    conn.commit()
    conn.close()
    
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/login", response_model=Token)
async def login(user: UserCreate):
    if not user.password:
        raise HTTPException(status_code=400, detail="Password cannot be empty")

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT password FROM users WHERE username=?", (user.username,))
    row = c.fetchone()
    conn.close()
    
    if not row or not verify_password(user.password, row[0]):
        raise HTTPException(status_code=401, detail="Incorrect credentials")
    
    token = create_access_token({"sub": user.username})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/validate")
async def validate(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return {"username": payload.get("sub"), "valid": True}
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
