
env variables needed:
PORT=4200
JWT_ACCESS_SECRET
JWT_REFRESH_SECRET
DATABASE_URL
ADMIN_LOGIN 
ADMIN_PASSWORD for main admin
CLIENT_SERVER_URL for cors
STORAGE_TYPE=local (or "vercel-blob")
BLOB_READ_WRITE_TOKEN (required when STORAGE_TYPE=vercel-blob)

## Endpoints

### Auth
| Method | Path              | Access | Description                                |
|--------|-------------------|--------|--------------------------------------------|
| POST   | /api/auth/login   | Public | { login, password } → returns tokens       |
| POST   | /api/auth/logout  | Public | Clears refreshToken cookie                 |
| GET    | /api/auth/refresh | Public | Refreshes tokens via cookie                |

### Places
| Method | Path               | Access | Description                                |
|--------|--------------------|--------|--------------------------------------------|
| GET    | /api/places        | Admin  | Список мест (id, name)                     |
| GET    | /api/places/:id    | Admin  | Детали места с images                       |
| POST   | /api/places        | Admin  | Создание (multipart: preview, images, body)|
| PUT    | /api/places        | Admin  | Редактирование (multipart)                 |
| DELETE | /api/places        | Admin  | Удаление по { id }                         |

### Tours
| Method | Path                    | Access | Description                            |
|--------|-------------------------|--------|----------------------------------------|
| GET    | /api/tours/public       | Public | Список туров для клиентов              |
| GET    | /api/tours/public/:id   | Public | Детали тура для клиентов               |
| GET    | /api/tours              | Admin  | Список туров (с заявками APPROVED)     |
| GET    | /api/tours/:id          | Admin  | Детали тура (админ)                    |
| POST   | /api/tours              | Admin  | Создание тура                          |
| PUT    | /api/tours              | Admin  | Редактирование тура                    |
| DELETE | /api/tours              | Admin  | Удаление тура по { id }                |

### Applications
| Method | Path                          | Access | Description                        |
|--------|-------------------------------|--------|------------------------------------|
| POST   | /api/applications             | Public | Создание заявки                    |
| GET    | /api/applications/considering | Admin  | Заявки со статусом CONSIDERING     |
| GET    | /api/applications/byTourId    | Admin  | APPROVED заявки по tourId          |
| PUT    | /api/applications             | Admin  | Редактирование заявки              |
| PATCH  | /api/applications             | Admin  | Одобрение заявки (статус→APPROVED) |
| DELETE | /api/applications             | Admin  | Удаление заявки по { id }          |
