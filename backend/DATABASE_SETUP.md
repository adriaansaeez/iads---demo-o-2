# Configuración de Base de Datos - SpeedAD Backend

## Requisitos Previos

1. **PostgreSQL instalado** en tu sistema
2. **Node.js** y **npm** instalados

## Configuración Inicial

### 1. Instalación de PostgreSQL

Si no tienes PostgreSQL instalado:

**Windows:**
- Descarga desde: https://www.postgresql.org/download/windows/
- Sigue el instalador y anota el puerto (por defecto 5432) y la contraseña del usuario `postgres`

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Crear Base de Datos

Conectarse a PostgreSQL y crear la base de datos:

```sql
-- Conectar como usuario postgres
psql -U postgres

-- Crear la base de datos
CREATE DATABASE speedAD_db;

-- Crear un usuario específico (opcional)
CREATE USER speedad_user WITH PASSWORD 'tu_contraseña_segura';
GRANT ALL PRIVILEGES ON DATABASE speedAD_db TO speedad_user;

-- Salir
\q
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la carpeta `backend/` con:

```env
# Variables de entorno para el backend
PORT=3005

# OpenAI API Key
OPENAI_API_KEY=tu_openai_api_key_aqui

# Base de datos PostgreSQL
# Formato: postgresql://usuario:contraseña@host:puerto/nombre_db
DATABASE_URL="postgresql://postgres:tu_contraseña@localhost:5432/speedAD_db"

# O si creaste un usuario específico:
# DATABASE_URL="postgresql://speedad_user:tu_contraseña_segura@localhost:5432/speedAD_db"

# JWT Configuration
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura_para_jwt_123456789
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
```

## Comandos de Prisma

### Generar el Cliente Prisma
```bash
npm run db:generate
```

### Crear y Aplicar Migraciones
```bash
# Crear nueva migración basada en cambios del schema
npm run db:migrate

# Aplicar migraciones en producción
npm run db:deploy
```

### Poblar la Base de Datos con Datos de Prueba
```bash
npm run db:seed
```

### Abrir Prisma Studio (Interfaz Visual)
```bash
npm run db:studio
```

### Resetear la Base de Datos
```bash
npm run db:reset
```

## Modelos de Base de Datos

### Users
```prisma
model User {
  id         String   @id @default(cuid())
  username   String   @unique
  email      String   @unique
  password   String
  created_at DateTime @default(now())

  @@map("users")
}
```

### Products
```prisma
model Product {
  id              String  @id @default(cuid())
  name            String
  desc            String?
  website         String?
  producto_study  String?

  @@map("products")
}
```

### Prompts
```prisma
model Prompt {
  id     String @id @default(cuid())
  prompt String

  @@map("prompts")
}
```

## Endpoints API Disponibles

### Users
- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:id` - Obtener usuario por ID
- `POST /api/users` - Crear nuevo usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Products
- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear nuevo producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Prompts
- `GET /api/prompts` - Obtener todos los prompts
- `GET /api/prompts/:id` - Obtener prompt por ID
- `POST /api/prompts` - Crear nuevo prompt
- `PUT /api/prompts/:id` - Actualizar prompt
- `DELETE /api/prompts/:id` - Eliminar prompt

## Solución de Problemas

### Error de Conexión a la Base de Datos
1. Verifica que PostgreSQL esté ejecutándose
2. Confirma que el `DATABASE_URL` en `.env` sea correcto
3. Asegúrate de que la base de datos `speedAD_db` exista

### Error "Client not generated"
```bash
npm run db:generate
```

### Migraciones Pendientes
```bash
npm run db:migrate
```

### Empezar de Cero
```bash
npm run db:reset
npm run db:seed
```

## Datos de Prueba

El script de seed crea:
- 3 usuarios de prueba (contraseña: `123456`)
- 3 productos de ejemplo
- 4 prompts predeterminados

Usuario admin:
- Username: `admin`
- Email: `admin@speedAD.com`
- Password: `123456`

## 🚀 Nuevas Funcionalidades Implementadas

### Backend - Sistema de Autenticación:

1. **Modelos de Usuario Actualizados:**
   - Enum `UserRole`: ADMIN, MANAGER, USER
   - Campos: `role`, `isActive`, `updated_at`

2. **Middlewares de Autenticación:**
   - `verifyToken`: Verificación JWT
   - `requireRole`: Control de roles específicos
   - `requireAdmin`: Solo administradores
   - `requireAdminOrManager`: Admin y Manager

3. **Controladores de Auth:**
   - `POST /api/auth/register`: Registro de usuarios
   - `POST /api/auth/login`: Inicio de sesión
   - `POST /api/auth/logout`: Cerrar sesión
   - `GET /api/auth/me`: Usuario actual
   - `PUT /api/auth/change-password`: Cambiar contraseña

4. **Protección de Rutas:**
   - **Usuarios**: Solo Admin puede crear/editar/eliminar
   - **Productos**: Admin/Manager pueden crear/editar/eliminar
   - **Prompts**: Admin/Manager pueden crear/editar/eliminar

### Frontend - Interfaz de Autenticación:

1. **AuthService:**
   - Manejo completo de JWT
   - Verificación de tokens
   - Control de roles y permisos

2. **Páginas Actualizadas:**
   - Login con credenciales reales
   - Vistas de usuarios con roles y estados
   - Restricciones de permisos por rol

## 👥 Usuarios de Prueba (después del seed):

| Usuario | Email | Contraseña | Rol | Permisos |
|---------|--------|------------|-----|----------|
| admin | admin@speedAD.com | 123456 | ADMIN | Todos los permisos |
| manager | manager@speedAD.com | 123456 | MANAGER | Productos y Prompts |
| usuario1 | usuario1@test.com | 123456 | USER | Solo lectura |

## 🔒 Sistema de Roles y Permisos:

### **ADMIN:**
- Gestión completa de usuarios (crear, editar, eliminar)
- Gestión completa de productos y prompts
- Acceso a todas las funcionalidades

### **MANAGER:**
- Gestión de productos y prompts
- Visualización de usuarios (solo lectura)
- No puede gestionar otros usuarios

### **USER:**
- Solo lectura en todas las vistas
- Creación de anuncios (cuando esté implementado)
- No puede gestionar datos maestros

## 🚀 Comandos de Inicialización:

```bash
# 1. Instalar dependencias (si no están instaladas)
npm install

# 2. Ejecutar migración para los nuevos campos
npx prisma migrate dev --name add-user-roles-and-status

# 3. Generar cliente Prisma
npx prisma generate

# 4. Ejecutar seed con usuarios actualizados
npm run db:seed

# 5. Iniciar servidor
npm start
```

## 🎯 Testing del Sistema:

1. **Iniciar Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Iniciar Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Probar Login:**
   - Ir a http://localhost:5173
   - Usar cualquiera de las credenciales de prueba
   - Verificar permisos según el rol

## 📝 Notas Importantes:

1. **Seguridad:**
   - Las contraseñas se hashean con bcrypt (salt rounds: 12)
   - JWT tiene expiración configurable
   - Cookies httpOnly para mayor seguridad

2. **Rate Limiting:**
   - Login: 5 intentos cada 15 minutos
   - Registro: 3 registros por hora por IP

3. **Middleware de Seguridad:**
   - Helmet para headers de seguridad
   - CORS configurado con credenciales
   - Validaciones exhaustivas en backend y frontend

¡El sistema de autenticación está completamente funcional! 🎉 

Usuario admin:
- Username: `admin`
- Email: `admin@speedAD.com`
- Password: `123456`

## 🚀 Nuevas Funcionalidades Implementadas

### Backend - Sistema de Autenticación:

1. **Modelos de Usuario Actualizados:**
   - Enum `UserRole`: ADMIN, MANAGER, USER
   - Campos: `role`, `isActive`, `updated_at`

2. **Middlewares de Autenticación:**
   - `verifyToken`: Verificación JWT
   - `requireRole`: Control de roles específicos
   - `requireAdmin`: Solo administradores
   - `requireAdminOrManager`: Admin y Manager

3. **Controladores de Auth:**
   - `POST /api/auth/register`: Registro de usuarios
   - `POST /api/auth/login`: Inicio de sesión
   - `POST /api/auth/logout`: Cerrar sesión
   - `GET /api/auth/me`: Usuario actual
   - `PUT /api/auth/change-password`: Cambiar contraseña

4. **Protección de Rutas:**
   - **Usuarios**: Solo Admin puede crear/editar/eliminar
   - **Productos**: Admin/Manager pueden crear/editar/eliminar
   - **Prompts**: Admin/Manager pueden crear/editar/eliminar

### Frontend - Interfaz de Autenticación:

1. **AuthService:**
   - Manejo completo de JWT
   - Verificación de tokens
   - Control de roles y permisos

2. **Páginas Actualizadas:**
   - Login con credenciales reales
   - Vistas de usuarios con roles y estados
   - Restricciones de permisos por rol

## 👥 Usuarios de Prueba (después del seed):

| Usuario | Email | Contraseña | Rol | Permisos |
|---------|--------|------------|-----|----------|
| admin | admin@speedAD.com | 123456 | ADMIN | Todos los permisos |
| manager | manager@speedAD.com | 123456 | MANAGER | Productos y Prompts |
| usuario1 | usuario1@test.com | 123456 | USER | Solo lectura |

## 🔒 Sistema de Roles y Permisos:

### **ADMIN:**
- Gestión completa de usuarios (crear, editar, eliminar)
- Gestión completa de productos y prompts
- Acceso a todas las funcionalidades

### **MANAGER:**
- Gestión de productos y prompts
- Visualización de usuarios (solo lectura)
- No puede gestionar otros usuarios

### **USER:**
- Solo lectura en todas las vistas
- Creación de anuncios (cuando esté implementado)
- No puede gestionar datos maestros

## 🚀 Comandos de Inicialización:

```bash
# 1. Instalar dependencias (si no están instaladas)
npm install

# 2. Ejecutar migración para los nuevos campos
npx prisma migrate dev --name add-user-roles-and-status

# 3. Generar cliente Prisma
npx prisma generate

# 4. Ejecutar seed con usuarios actualizados
npm run db:seed

# 5. Iniciar servidor
npm start
```

## 🎯 Testing del Sistema:

1. **Iniciar Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Iniciar Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Probar Login:**
   - Ir a http://localhost:5173
   - Usar cualquiera de las credenciales de prueba
   - Verificar permisos según el rol

## 📝 Notas Importantes:

1. **Seguridad:**
   - Las contraseñas se hashean con bcrypt (salt rounds: 12)
   - JWT tiene expiración configurable
   - Cookies httpOnly para mayor seguridad

2. **Rate Limiting:**
   - Login: 5 intentos cada 15 minutos
   - Registro: 3 registros por hora por IP

3. **Middleware de Seguridad:**
   - Helmet para headers de seguridad
   - CORS configurado con credenciales
   - Validaciones exhaustivas en backend y frontend

¡El sistema de autenticación está completamente funcional! 🎉 