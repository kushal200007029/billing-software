# NexBill - Premium Microservice Billing Software

NexBill is a high-performance, modern billing platform built with a microservice architecture. It features a sleek React frontend and multiple specialized backend services.

## 🏗️ Architecture

- **Gateway (Node.js/Express)**: Unified entry point (Port 8000).
- **Frontend (React/Vite)**: Modern premium UI (Port 5173).
- **Auth Service (Python/FastAPI)**: Secure JWT-based authentication (Port 8001).
- **Product Service (Node.js)**: Efficient product catalog management (Port 8081).
- **Billing Service (Java/Spring Boot)**: Robust invoice generation logic (Port 8082).

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Java (JDK 17+)
- Git

### Running the Application
A single PowerShell script is provided to spin up all services simultaneously:

1. Clone the repository.
2. Open a terminal in the project root.
3. Run the startup script:
   ```powershell
   .\run_everything.ps1
   ```
4. Open the app at [http://localhost:5173](http://localhost:5173).

## 🛠️ Tech Stack
- **Frontend**: React, Lucide Icons, Modern CSS.
- **Backend**: Python (FastAPI), Node.js, Java (Spring Boot).
- **Database**: SQLite (Auth), In-memory (Products/Billing).
- **Proxy**: http-proxy-middleware.
