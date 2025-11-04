# Dokumentasi REST API - Aplikasi Presensi Online

## Base URL
\`\`\`
http://localhost:3000
\`\`\`

## Authentication
Semua endpoint (kecuali login) memerlukan JWT Token di header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

---

## 1. AUTHENTICATION

### Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Login pengguna dan mendapatkan JWT token
- **Request Body**:
\`\`\`json
{
  "email": "user@example.com",
  "password": "password123"
}
\`\`\`
- **Response** (200 OK):
\`\`\`json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "admin"
    }
  }
}
\`\`\`

---

## 2. USER MANAGEMENT

### Membuat Pengguna Baru
- **Endpoint**: `POST /api/users`
- **Method**: POST
- **Authentication**: Required
- **Request Body**:
\`\`\`json
{
  "name": "Ahmad Rifki",
  "email": "ahmad@example.com",
  "password": "securePass123",
  "role": "user",
  "class": "XI RPL",
  "position": "Siswa",
  "nis": "20220001"
}
\`\`\`
- **Response** (201 Created):
\`\`\`json
{
  "success": true,
  "message": "Pengguna berhasil dibuat",
  "data": {
    "id": 2,
    "name": "Ahmad Rifki",
    "email": "ahmad@example.com",
    "role": "user",
    "class": "XI RPL",
    "position": "Siswa",
    "nis": "20220001"
  }
}
\`\`\`

### Mengambil Data Pengguna
- **Endpoint**: `GET /api/users/:id`
- **Method**: GET
- **Authentication**: Required
- **Response** (200 OK):
\`\`\`json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "admin",
    "class": "Admin",
    "position": "Administrator",
    "nis": null,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
\`\`\`

### Mengubah Data Pengguna
- **Endpoint**: `PUT /api/users/:id`
- **Method**: PUT
- **Authentication**: Required
- **Request Body** (semua field opsional):
\`\`\`json
{
  "name": "Ahmad Rifki Updated",
  "email": "ahmad.new@example.com",
  "password": "newSecurePass123",
  "class": "XII RPL",
  "position": "Ketua Kelas",
  "nis": "20220001"
}
\`\`\`
- **Response** (200 OK):
\`\`\`json
{
  "success": true,
  "message": "Pengguna berhasil diperbarui",
  "data": {
    "id": 2,
    "name": "Ahmad Rifki Updated",
    "email": "ahmad.new@example.com",
    "role": "user",
    "class": "XII RPL",
    "position": "Ketua Kelas",
    "nis": "20220001"
  }
}
\`\`\`

### Mengambil Semua Pengguna
- **Endpoint**: `GET /api/users`
- **Method**: GET
- **Authentication**: Required
- **Query Parameters**:
  - `role` (optional): Filter by role (admin/user)
- **Response** (200 OK):
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "admin",
      "class": "Admin",
      "position": "Administrator",
      "nis": null,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "name": "Ahmad Rifki",
      "email": "ahmad@example.com",
      "role": "user",
      "class": "XI RPL",
      "position": "Siswa",
      "nis": "20220001",
      "createdAt": "2024-01-16T08:00:00Z"
    }
  ],
  "total": 2
}
\`\`\`

---

## 3. ATTENDANCE RECORDING

### Melakukan Presensi
- **Endpoint**: `POST /api/attendance`
- **Method**: POST
- **Authentication**: Required
- **Request Body**:
\`\`\`json
{
  "userId": 2,
  "checkInTime": "08:30:00",
  "checkOutTime": null,
  "status": "present",
  "notes": "Hadir tepat waktu"
}
\`\`\`
- **Response** (201 Created):
\`\`\`json
{
  "success": true,
  "message": "Presensi berhasil dicatat",
  "data": {
    "id": 1,
    "userId": 2,
    "date": "2024-01-20",
    "checkInTime": "08:30:00",
    "checkOutTime": null,
    "status": "present",
    "notes": "Hadir tepat waktu"
  }
}
\`\`\`

---

## 4. ATTENDANCE HISTORY & SUMMARY

### Melihat Riwayat Presensi
- **Endpoint**: `GET /api/attendance/history/:userId`
- **Method**: GET
- **Authentication**: Required
- **Query Parameters**:
  - `limit` (optional, default: 30): Jumlah record per halaman
  - `offset` (optional, default: 0): Offset untuk pagination
- **Response** (200 OK):
\`\`\`json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 2,
      "date": "2024-01-20",
      "checkInTime": "08:30:00",
      "checkOutTime": "16:45:00",
      "status": "present",
      "notes": "Hadir tepat waktu"
    },
    {
      "id": 2,
      "userId": 2,
      "date": "2024-01-19",
      "checkInTime": "09:15:00",
      "checkOutTime": "16:30:00",
      "status": "late",
      "notes": "Terlambat 45 menit"
    }
  ],
  "pagination": {
    "total": 20,
    "limit": 30,
    "offset": 0,
    "pages": 1
  }
}
\`\`\`

### Melihat Rekap Kehadiran Bulanan
- **Endpoint**: `GET /api/attendance/summary/:userId`
- **Method**: GET
- **Authentication**: Required
- **Query Parameters**:
  - `year` (optional, default: tahun saat ini): Tahun yang ingin dilihat
  - `month` (optional, default: bulan saat ini): Bulan yang ingin dilihat (1-12)
- **Response** (200 OK):
\`\`\`json
{
  "success": true,
  "data": {
    "user": {
      "id": 2,
      "name": "Ahmad Rifki",
      "email": "ahmad@example.com"
    },
    "period": "1/2024",
    "summary": {
      "present": 18,
      "absent": 2,
      "late": 3,
      "leave": 1,
      "total": 24,
      "percentage": 75
    },
    "details": [
      {
        "id": 1,
        "userId": 2,
        "date": "2024-01-01",
        "checkInTime": "08:00:00",
        "checkOutTime": "16:00:00",
        "status": "present",
        "notes": null
      }
    ]
  }
}
\`\`\`

---

## 5. ATTENDANCE ANALYSIS

### Analisis Tingkat Kehadiran
- **Endpoint**: `POST /api/attendance/analysis`
- **Method**: POST
- **Authentication**: Required
- **Request Body**:
\`\`\`json
{
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "category": "class",
  "categoryValue": "XI RPL"
}
\`\`\`
- **Parameters**:
  - `startDate` (required): Tanggal mulai format YYYY-MM-DD
  - `endDate` (required): Tanggal akhir format YYYY-MM-DD
  - `category` (optional): Kategori filter (class/position/role/all)
  - `categoryValue` (optional): Nilai kategori untuk filter

- **Response** (200 OK):
\`\`\`json
{
  "success": true,
  "data": {
    "period": {
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    },
    "filter": {
      "category": "class",
      "categoryValue": "XI RPL"
    },
    "summary": {
      "totalUsers": 30,
      "totalRecords": 720,
      "averageAttendancePercentage": 82
    },
    "details": [
      {
        "userId": 2,
        "userName": "Ahmad Rifki",
        "userEmail": "ahmad@example.com",
        "userClass": "XI RPL",
        "userPosition": "Siswa",
        "present": 18,
        "absent": 2,
        "late": 3,
        "leave": 1,
        "total": 24,
        "attendancePercentage": 75
      },
      {
        "userId": 3,
        "userName": "Siti Nurhaliza",
        "userEmail": "siti@example.com",
        "userClass": "XI RPL",
        "userPosition": "Siswa",
        "present": 20,
        "absent": 1,
        "late": 2,
        "leave": 1,
        "total": 24,
        "attendancePercentage": 83
      }
    ]
  }
}
\`\`\`

---

## Error Handling

### Error Response Format
\`\`\`json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
\`\`\`

### Common Errors
- **401 Unauthorized**: Token tidak valid atau expired
- **404 Not Found**: Resource tidak ditemukan
- **400 Bad Request**: Data tidak valid
- **500 Internal Server Error**: Server error

---

## Setup Instructions

1. **Clone Repository**
\`\`\`bash
git clone <repository-url>
cd attendance-system-api
\`\`\`

2. **Install Dependencies**
\`\`\`bash
npm install
\`\`\`

3. **Setup Database**
   - Buat database MySQL dengan nama `attendance_db`
   - Update `.env` file dengan konfigurasi database

4. **Run Application**
\`\`\`bash
npm run dev
\`\`\`

5. **Create Admin User** (manual SQL)
\`\`\`sql
INSERT INTO users (name, email, password, role, createdAt, updatedAt) 
VALUES ('Admin', 'admin@example.com', '$2b$10$..hash password here..', 'admin', NOW(), NOW());
\`\`\`

---

## Testing API dengan cURL

\`\`\`bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'

# Create User
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Ahmad","email":"ahmad@test.com","password":"pass123","role":"user","class":"XI RPL"}'

# Record Attendance
curl -X POST http://localhost:3000/api/attendance \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"userId":2,"checkInTime":"08:30:00","status":"present"}'
\`\`\`

---

## Database Schema

### users table
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- name (VARCHAR 100)
- email (VARCHAR 100, UNIQUE)
- password (VARCHAR 100)
- role (VARCHAR 50)
- class (VARCHAR 50, nullable)
- position (VARCHAR 100, nullable)
- nis (VARCHAR 50, nullable)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)

### attendances table
- id (INT, PRIMARY KEY, AUTO_INCREMENT)
- userId (INT, FOREIGN KEY)
- date (DATE)
- checkInTime (TIME)
- checkOutTime (TIME, nullable)
- status (VARCHAR 20)
- notes (TEXT, nullable)
- createdAt (TIMESTAMP)
