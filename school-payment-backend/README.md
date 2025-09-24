# 🎓 School Payment Service Backend

A **secure and scalable backend microservice API** for managing school payments, transactions, user authentication, and payment gateway integration.  
Built with **Node.js, Express.js, and MongoDB**.

---

## 📑 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [API Usage Examples](#api-usage-examples)
- [Postman Collection](#postman-collection)
- [Folder Structure](#folder-structure)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Project Overview

This microservice provides **RESTful APIs** for school payment collection and transaction tracking.  

- Supports **user registration and authentication** with JWT  
- **Payment order creation** with signed requests to the Edviron payment gateway  
- **Webhook handling** for real-time payment status updates  
- Designed for **security, performance, and scalability** using **MongoDB Atlas**  

---

## ✨ Features

- 🔐 User registration & login (bcrypt + JWT)  
- 💳 Create payment orders with signed JWT requests to payment gateway  
- 📊 Real-time transaction status and history via aggregation pipelines  
- 🔄 Webhook endpoint to update payment status asynchronously  
- ✅ Input validation & detailed error handling  
- 🛡️ Secure endpoints with JWT middleware  
- 📝 Logger-enabled debugging and transparent responses  

---

## 🛠️ Technologies Used

- **Node.js**  
- **Express.js**  
- **MongoDB Atlas**  
- **Mongoose ODM**  
- **JWT (JSON Web Token)**  
- **Bcrypt** (password hashing)  
- **Axios** (external API requests)  
- **Express-validator**  
- **Dotenv** (environment management)  

---

## ⚙️ Setup and Installation

### Prerequisites
- Node.js (v14+)  
- MongoDB Atlas account  
- Edviron Payment API credentials  

### Steps

1. **Clone the repository**
```bash
   git clone https://github.com/RAJATKUMARSINGH527/School-Payments-Application.git
   cd School-Payments-Application
```

3. **Install dependencies**

```bash
npm install
```
3. **Configure environment variables**
Create a .env file in the root directory and add:

```env
MONGODB_URL=mongodb+srv://<your-mongodb-uri>
JWT_SECRET_KEY=your_jwt_secret
SALT_ROUNDS=10
PAYMENT_API_KEY=your_payment_api_key
PG_KEY=your_pg_secret_key
SCHOOL_ID=65b0e6293e9f76a9694d84b4
PORT=3000
NODE_ENV=development
```
4. **Run the server**

```bash
npm start
```
Your server will start at:
`👉 http://localhost:3000`

**🔑 Environment Variables**

| Variable          | Description                            |
| ----------------- | -------------------------------------- |
| `MONGODB_URL`     | MongoDB Atlas connection URI           |
| `JWT_SECRET_KEY`  | Secret for signing JWT tokens          |
| `SALT_ROUNDS`     | Number of bcrypt salt rounds           |
| `PAYMENT_API_KEY` | API key for payment provider           |
| `PG_KEY`          | Secret key to sign payment gateway JWT |
| `SCHOOL_ID`       | Unique school identifier               |
| `PORT`            | Server port                            |
| `NODE_ENV`        | Mode (development / production)        |

**📌 API Usage Examples**
**🔹 User Registration**
```http
POST /auth/register
Content-Type: application/json
```
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "adminpass123"
}
```

**🔹 User Login**
```http
POST /auth/login
Content-Type: application/json
```
```json
{
  "email": "admin@example.com",
  "password": "adminpass123"
}
```
✅ Response includes JWT token for authorization.



**🔹 Create Payment Order**
```http
POST /orders/create-payment
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```
```json
{
  "school_id": "65b0e6293e9f76a9694d84b4",
  "trustee_id": "652e0a1a87fa11c9d194b002",
  "student_info": {
    "name": "Raj Kumar",
    "id": "STU001",
    "email": "student1@example.com"
  },
  "gateway_name": "EdvironPay",
  "amount": 2500,
  "custom_order_id": "ORD20250921A",
  "callback_url": "https://your-callback-url.com"
}
```

**🔹 Fetch Transactions**
```http
GET /transactions?limit=10&page=1&sort=payment_time&order=desc
Authorization: Bearer <JWT_TOKEN>
```

**🔹 Webhook Endpoint**
```http
POST /webhook
Content-Type: application/json
```
```json
{
  "order_info": {
    "order_id": "652e0a1a87fa11c9d194b001",
    "order_amount": 2500,
    "transaction_amount": 2500,
    "payment_mode": "card",
    "payment_details": "Visa **** 1234",
    "bank_reference": "ICIC122",
    "payment_message": "Transaction successful",
    "status": "SUCCESS",
    "error_message": "NA",
    "payment_time": "2025-09-21T03:00:00.000+00:00",
    "custom_order_id": "ORD20250921A"
  }
}
```

**🧪 Postman Collection**

- Import the provided Postman collection JSON

- Set `{{base_url}}` to your API server URL

- Use `/auth/login` to get JWT token and set `{{jwt_token}}` in environment

- Test all endpoints easily with **authorization pre-configured**

**📂 Folder Structure**
```pgsql
/
├─ config/
│  └─ db.js                  # Database connection
├─ middlewares/
│  └─ auth.middleware.js                # JWT authentication
│  └─ errorHandler.js        # Centralized error handling
│  └─ validate.js            # Request validation middleware
├─ models/
│  └─ User.js                # User schema
│  └─ Order.js               # Orders schema
│  └─ OrderStatus.js         # Transactions schema
│  └─ WebhookLog.js          # Webhook logging schema
├─ routes/
│  └─ auth.js
│  └─ orders.js
│  └─ transactions.js
│  └─ webhook.js
├─ utils/
│  └─ paymentGateway.js      # Payment API integration
├─ .env
├─ index.js                    # Main server entry
├─ package.json
├─ README.md
```

**🤝 Contributing**

Contributions, issues, and feature requests are welcome!

- Fork the repo

- Create a feature branch

- Commit your changes

- Push to the branch

- Open a Pull Request

**📜 License**

This project is licensed under the MIT License.

