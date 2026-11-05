# 🗄️ Especificación Técnica de Base de Datos y Persistencia: GEARS GYM

Este documento describe a detalle la arquitectura relacional, tablas maestras, transacciones ACID, índices de rendimiento y políticas de migración de la base de datos SQLite integrada en el sistema **GEARS GYM** (rama `task/bd_config`).

---

## 1. Motor y Parámetros de Operación

- **Motor:** SQLite 3 vía biblioteca nativa `better-sqlite3` en Node.js.
- **Archivo:** `backend/db/gears_gym.sqlite`.
- **Modo de Diario (WAL):**
  - `PRAGMA journal_mode = WAL;` — Permite múltiples lectores concurrentes y un escritor sin bloqueos ni contención de archivo.
  - `PRAGMA synchronous = NORMAL;` — Alto rendimiento en disco SSD con integridad ante caídas de corriente.
  - `PRAGMA foreign_keys = ON;` — Validación de integridad referencial.

---

## 2. Cómo se Ejecuta, Inicializa y Administra la Base de Datos

A diferencia de motores cliente-servidor externos (como MySQL o PostgreSQL), **SQLite es una base de datos embebida (in-process)** que no requiere instalar ni levantar servicios externos o contenedores Docker. Opera de forma 100% autónoma en el sistema de archivos de la Mini PC.

### 2.1. Inicialización y Ejecución Automática (Servidor Principal)
La base de datos se inicializa automáticamente al arrancar el servidor Node.js del gimnasio:

```powershell
# Opción A: Comando estándar
npm start

# Opción B: Ejecución directa con Node
node backend/server.js

# Opción C: Script Kiosco de producción en Windows
.\scripts\start-gears-kiosk.bat
```

**¿Qué ocurre internamente al ejecutarse?**
1. **Auto-Creación:** Si el archivo `backend/db/gears_gym.sqlite` no existe, `better-sqlite3` lo crea inmediatamente.
2. **Activación WAL:** Se configuran los pragmas de alto rendimiento (`journal_mode = WAL`, `synchronous = NORMAL`).
3. **Migración Segura:** Se ejecuta `ensureSchemaMigrations()` para agregar columnas faltantes (`pin_code`, `rfid_uid`, `start_date`, `expire_date`, etc.) sin perder datos de versiones previas.
4. **Sembrado Inteligente (Seeding):** Si las tablas están vacías, se insertan automáticamente:
   - Las 4 tarifas oficiales en `plans`.
   - Los 6 productos del mostrador en `products`.
   - La configuración de pantalla en `tv_settings`.
   - Los socios iniciales con fechas calculadas dinámicamente con respecto al día actual (para que nunca aparezcan desfasadas).
5. **Métricas Diarias:** Se asegura la fila de estadísticas del día de hoy en `daily_metrics`.

---

### 2.2. Ejecución y Pruebas Directas por Consola (CLI / PowerShell)
Puedes interactuar, consultar y probar las funciones transaccionales de la base de datos sin necesidad de levantar el servidor web ni abrir el navegador:

```powershell
# 1. Verificar conteo de tablas y conexión
node -e "const db = require('./backend/db/database'); console.log('Socios:', db.getAllMembers().length, '| Productos:', db.getAllProducts().length, '| Planes:', db.getAllPlans().length);"

# 2. Probar resolución instantánea de socio por PIN o Folio (ej. 042)
node -e "const db = require('./backend/db/database'); const m = db.getMemberByCredential('042'); console.log(m ? (m.name + ' - ' + m.plan + ' - Vigencia: ' + m.days + ' dias (' + m.status + ')') : 'No encontrado');"

# 3. Consultar corte de caja del turno actual
node -e "const db = require('./backend/db/database'); console.log(db.getDailyCutSummary());"

# 4. Probar venta rápida de producto en el Arsenal (descuenta stock en SQLite)
node -e "const db = require('./backend/db/database'); console.log(db.recordStoreSale('p1', 'Agua 1L', 20, 1));"
```

---

### 2.3. Inspección Gráfica Visual (GUI)
Para auditar, editar o visualizar los datos en una interfaz gráfica:
1. Descarga o abre **[DB Browser for SQLite](https://sqlitebrowser.org/)** (o la extensión *SQLite Viewer* en VS Code / Cursor).
2. Abre el archivo: `backend/db/gears_gym.sqlite`.
3. Podrás explorar las pestañas *Estructura de la base de datos*, *Examinar datos* y ejecutar consultas SQL directas.
*(Nota: Al estar en modo WAL, es completamente seguro abrirlo mientras el servidor Node.js está corriendo).*

---

### 2.4. Archivos Generados en Disco
Cuando la base de datos está en operación activa, observarás hasta 3 archivos en `backend/db/`:
* **`gears_gym.sqlite`**: Base de datos principal.
* **`gears_gym.sqlite-wal`**: Archivo de transacciones en cola (*Write-Ahead Log*). Garantiza que las lecturas no bloqueen a las escrituras.
* **`gears_gym.sqlite-shm`**: Índice de memoria compartida para coordinar el acceso entre procesos.

---

## 3. Diagrama de Relaciones de Datos (ERD)

```
+------------------------------------+          +------------------------------------+
|               PLANS                |          |              MEMBERS               |
+------------------------------------+          +------------------------------------+
| id (PK)              TEXT          |          | id (PK)              TEXT          |
| name                 TEXT          |<----+    | name                 TEXT          |
| price                INTEGER       |     |    | phone                TEXT          |
| duration_days        INTEGER       |     |    | photo                TEXT (Base64) |
| sub_title            TEXT          |     +----| plan                 TEXT          |
| promo_title          TEXT          |          | plan_id              TEXT          |
| promo_desc           TEXT          |          | price                TEXT          |
| sort_order           INTEGER       |          | status               TEXT          |
| active               INTEGER       |          | days                 INTEGER       |
+------------------------------------+          | days_remaining       INTEGER       |
                                                | start_date           DATE          |
+------------------------------------+          | expire_date          DATE          |
|              PRODUCTS              |          | pin_code             TEXT (Index)  |
+------------------------------------+          | rfid_uid             TEXT (Index)  |
| id (PK)              TEXT          |          | isInside             INTEGER       |
| name                 TEXT          |<----+    | timeIn               TEXT          |
| category             TEXT          |     |    | createdAt            DATETIME      |
| price                INTEGER       |     |    | updatedAt            DATETIME      |
| stock                INTEGER       |     |    +------------------------------------+
| icon                 TEXT          |     |                      |
| color                TEXT          |     |                      |
| active               INTEGER       |     |                      v
| updated_at           DATETIME      |     |    +------------------------------------+
+------------------------------------+     |    |          MEMBER_PAYMENTS           |
                                           |    +------------------------------------+
+------------------------------------+     |    | id (PK)              INTEGER AUTO  |
|            STORE_SALES             |     |    | member_id            TEXT          |
+------------------------------------+     |    | member_name          TEXT          |
| id (PK)              INTEGER AUTO  |     |    | plan_id              TEXT          |
| product_id           TEXT          +-----+    | plan_name            TEXT          |
| item_id              TEXT          |          | amount               INTEGER       |
| item_name            TEXT          |          | payment_type         TEXT          |
| quantity             INTEGER       |          | timestamp            DATETIME      |
| unit_price           INTEGER       |          +------------------------------------+
| price                INTEGER       |
| total_price          INTEGER       |          +------------------------------------+
| timestamp            DATETIME      |          |            ACCESS_LOGS             |
+------------------------------------+          +------------------------------------+
                                                | id (PK)              INTEGER AUTO  |
+------------------------------------+          | member_id            TEXT          |
|           DAILY_METRICS            |          | member_name          TEXT          |
+------------------------------------+          | action               TEXT          |
| date (PK)            TEXT          |          | channel              INTEGER       |
| today_entries        INTEGER       |          | status               TEXT          |
| total_entries        INTEGER       |          | timestamp            DATETIME      |
| today_cash           INTEGER       |          +------------------------------------+
| memberships_cash     INTEGER       |
| visits_cash          INTEGER       |          +------------------------------------+
| store_cash           INTEGER       |          |             CASH_CUTS              |
| cash_memberships     INTEGER       |          +------------------------------------+
| cash_visits          INTEGER       |          | id (PK)              INTEGER AUTO  |
| cash_store           INTEGER       |          | date                 TEXT          |
+------------------------------------+          | expected_cash        INTEGER       |
                                                | counted_cash         INTEGER       |
+------------------------------------+          | difference           INTEGER       |
|            TV_SETTINGS             |          | memberships_cash     INTEGER       |
+------------------------------------+          | visits_cash          INTEGER       |
| key (PK)             TEXT          |          | store_cash           INTEGER       |
| value                TEXT (JSON)   |          | today_entries        INTEGER       |
| updated_at           DATETIME      |          | notes                TEXT          |
+------------------------------------+          | closed_by            TEXT          |
                                                | closed_at            DATETIME      |
                                                +------------------------------------+
```

---

## 4. Diccionario de Tablas

### 3.1. `plans` (Catálogo de Tarifas Oficiales)
Gestiona las tarifas ofrecidas a los socios, sus duraciones y textos promocionales:
- **`id`** (`TEXT PRIMARY KEY`): Identificador único (`mensual`, `promo2`, `quincena`, `visita`).
- **`name`** (`TEXT NOT NULL`): Nombre comercial del plan.
- **`price`** (`INTEGER NOT NULL`): Monto numérico en MXN ($400, $700, $250, $60).
- **`duration_days`** (`INTEGER DEFAULT 30`): Días que otorga el plan.
- **`sub_title`** (`TEXT`): Texto descriptivo corto ("Acceso Total 30 días").
- **`promo_title`** (`TEXT`): Encabezado publicitario para la pantalla TV.
- **`promo_desc`** (`TEXT`): Descripción extendida de la membresía.
- **`sort_order`** (`INTEGER DEFAULT 0`): Orden de visualización en la interfaz.
- **`active`** (`INTEGER DEFAULT 1`): Bandera de visibilidad (1 = activo, 0 = descontinuado).

### 3.2. `products` (Arsenal - Inventario y Suplementos)
Controla los productos que se venden en mostrador:
- **`id`** (`TEXT PRIMARY KEY`): Código del producto (`p1`, `p2`, `p3`, etc.).
- **`name`** (`TEXT NOT NULL`): Nombre del producto (ej. `Agua 1L`, `Pre-Entreno Hype`).
- **`category`** (`TEXT DEFAULT 'General'`): Categoría (`Bebidas`, `Scoop Hype`, `Scoop Servicio`, `Hidratación`, etc.).
- **`price`** (`INTEGER NOT NULL`): Precio unitario de venta.
- **`stock`** (`INTEGER DEFAULT 0`): Existencias actuales.
- **`icon`** (`TEXT`): Clase FontAwesome asociada (`fa-bottle-water`, `fa-bolt`, `fa-jar`).
- **`color`** (`TEXT`): Color temático para la interfaz (`blue`, `rose`, `amber`, `purple`).
- **`active`** (`INTEGER DEFAULT 1`): Si el producto está disponible.
- **`updated_at`** (`DATETIME`): Última actualización de stock o precio.

### 3.3. `store_sales` (Transacciones de Venta en Mostrador)
Auditoría de cada producto vendido en la recepción:
- **`id`** (`INTEGER PRIMARY KEY AUTOINCREMENT`): Folio consecutivo de venta.
- **`product_id`** (`TEXT`): Relación con `products.id`.
- **`item_id`** (`TEXT`): Compatibilidad heredada con la versión anterior.
- **`item_name`** (`TEXT NOT NULL`): Nombre histórico al momento de la venta.
- **`quantity`** (`INTEGER DEFAULT 1`): Cantidad vendida.
- **`unit_price`** (`INTEGER NOT NULL`): Precio unitario aplicado.
- **`price`** / **`total_price`** (`INTEGER NOT NULL`): Total cobrado.
- **`timestamp`** (`DATETIME DEFAULT CURRENT_TIMESTAMP`): Fecha y hora exacta.

### 3.4. `member_payments` (Auditoría Financiera de Membresías)
Registra cada pago de inscripción o renovación:
- **`id`** (`INTEGER PRIMARY KEY AUTOINCREMENT`): Folio de recibo.
- **`member_id`** (`TEXT NOT NULL`): ID/Folio del socio receptor.
- **`member_name`** (`TEXT NOT NULL`): Nombre del socio.
- **`plan_id`** (`TEXT`): Clave del plan contratado.
- **`plan_name`** (`TEXT NOT NULL`): Nombre del plan al cobrar.
- **`amount`** (`INTEGER NOT NULL`): Dinero ingresado en caja en MXN.
- **`payment_type`** (`TEXT DEFAULT 'RENEWAL'`): Tipo de pago (`NEW_MEMBER`, `RENEWAL`, `UPGRADE`).
- **`timestamp`** (`DATETIME DEFAULT CURRENT_TIMESTAMP`): Momento del cobro.

### 3.5. `members` (Padrón Maestro de Guerreros)
Almacena todos los datos de socios activos, por vencer y vencidos:
- **`id`** (`TEXT PRIMARY KEY`): Folio numérico (ej. `'042'`, `'089'`).
- **`name`** (`TEXT NOT NULL`): Nombre completo.
- **`phone`** (`TEXT DEFAULT ''`): Número de WhatsApp / Contacto.
- **`photo`** (`TEXT`): URL o DataURL Base64 de la foto capturada con cámara WebRTC.
- **`plan`** (`TEXT NOT NULL`): Nombre del plan vigente.
- **`plan_id`** (`TEXT DEFAULT 'mensual'`): Identificador normalizado del plan.
- **`price`** (`TEXT DEFAULT '$400'`): Precio formateado.
- **`status`** (`TEXT DEFAULT 'active'`): Estado calculado (`active`, `warning`, `expired`).
- **`days`** / **`days_remaining`** (`INTEGER`): Días restantes reales.
- **`start_date`** (`DATE`): Fecha de inicio de la vigencia (`YYYY-MM-DD`).
- **`expire_date`** (`DATE`): Fecha de vencimiento (`YYYY-MM-DD`).
- **`pin_code`** (`TEXT`): PIN de acceso para el teclado numérico.
- **`rfid_uid`** (`TEXT`): UID de llavero o pulsera RFID (cuando aplique).
- **`isInside`** (`INTEGER DEFAULT 0`): Estado actual en el gimnasio (1 = dentro, 0 = fuera).
- **`timeIn`** (`TEXT`): Hora de entrada registrada.
- **`createdAt`** / **`updatedAt`** (`DATETIME`): Marcas de tiempo de auditoría.

### 3.6. `tv_settings` (Configuración Persistente del Monitor TV)
Almacena en formato clave-valor la parametrización de la cartelera digital:
- **`key`** (`TEXT PRIMARY KEY`): Identificador del parámetro (`promoBadge`, `promoTitle`, `promoDesc`, `tariffsHeader`, `tariffs`, `sensorTitle`, `bgImage`, etc.).
- **`value`** (`TEXT NOT NULL`): Valor en cadena simple o JSON serializado.
- **`updated_at`** (`DATETIME`): Momento de modificación desde el panel administrativo.

### 3.7. `cash_cuts` (Cierres de Turno y Cortes de Caja)
Historial inmutable de cortes de caja:
- **`id`** (`INTEGER PRIMARY KEY AUTOINCREMENT`): Folio del corte.
- **`date`** (`TEXT NOT NULL`): Fecha del corte (`YYYY-MM-DD`).
- **`expected_cash`** (`INTEGER NOT NULL`): Total teórico del sistema (`memberships_cash + visits_cash + store_cash`).
- **`counted_cash`** (`INTEGER DEFAULT 0`): Efectivo físico contado en el cajón por el encargado.
- **`difference`** (`INTEGER DEFAULT 0`): Faltante (-) o sobrante (+).
- **`memberships_cash`**, **`visits_cash`**, **`store_cash`**: Desglose por origen.
- **`today_entries`** (`INTEGER DEFAULT 0`): Accesos registrados durante el turno.
- **`notes`** (`TEXT`): Observaciones del encargado.
- **`closed_by`** (`TEXT DEFAULT 'Comandante'`): Nombre del usuario que cerró caja.
- **`closed_at`** (`DATETIME`): Fecha y hora del cierre.

### 3.8. `access_logs` (Bitácora de Torniquete y Accesos)
Registro cronológico de entradas y salidas:
- **`id`** (`INTEGER PRIMARY KEY AUTOINCREMENT`).
- **`member_id`** (`TEXT`): Socio o tipo de acceso (`ADMIN`, `VISIT`, `042`).
- **`member_name`** (`TEXT`): Nombre o descripción del evento.
- **`action`** (`TEXT`): Tipo de acción (`PIN_BIOMETRIC_ENTRY`, `MANUAL_ENTRY`, `VISIT_ENTRY`).
- **`channel`** (`INTEGER DEFAULT 1`): Canal del relevador (1 = Entrada, 2 = Salida).
- **`status`** (`TEXT`): Resultado (`GRANTED`, `GRANTED_WARNING`, `DENIED_EXPIRED`, `DENIED_LOCKDOWN`).
- **`timestamp`** (`DATETIME`): Marca de tiempo.

### 3.9. `daily_metrics` (Métricas Consolidadas del Día)
Resumen diario para reporting instantáneo sin recorrer bitácoras:
- **`date`** (`TEXT PRIMARY KEY`): Día actual (`YYYY-MM-DD`).
- **`today_entries`** / **`total_entries`**: Contador de ingresos acumulados.
- **`today_cash`**: Ingreso total del día.
- **`memberships_cash`**: Ingreso por nuevas inscripciones y renovaciones.
- **`visits_cash`**: Ingreso por visitas del día ($60 MXN).
- **`store_cash`**: Ingreso por venta de suplementos y bebidas.

---

## 5. Índices para Alto Rendimiento

Para garantizar respuestas en **menos de 1 milisegundo** en el torniquete (lectores de código de barras, PIN HID y tarjetas RFID):

```sql
CREATE INDEX IF NOT EXISTS idx_members_pin ON members(pin_code);
CREATE INDEX IF NOT EXISTS idx_members_rfid ON members(rfid_uid);
CREATE INDEX IF NOT EXISTS idx_access_logs_time ON access_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_store_sales_time ON store_sales(timestamp);
CREATE INDEX IF NOT EXISTS idx_member_payments_time ON member_payments(timestamp);
```

---

## 6. Transacciones Atómicas (ACID) Implementadas

1. **`createMember(data)`:**
   - Calcula folio consecutivo automático si no se provee.
   - Calcula fechas reales `start_date` y `expire_date`.
   - Inserta en `members`.
   - Registra recibo en `member_payments`.
   - Incrementa atómicamente `today_cash` y `memberships_cash` en `daily_metrics`.
   - Inserta registro de acceso inicial en `access_logs`.

2. **`renewMember(id, plan, price, extraDays)`:**
   - Verifica existencia del socio.
   - Si la membresía actual no ha vencido (`days > 0`), suma los días a partir de la fecha `expire_date` existente; si ya venció, inicia desde hoy.
   - Actualiza estado a `active`.
   - Registra auditoría en `member_payments`.
   - Incrementa `today_cash` y `memberships_cash` en `daily_metrics`.

3. **`recordStoreSale(productId, productName, unitPrice, qty)`:**
   - Descuenta atómicamente el inventario en `products` (`stock = CASE WHEN stock >= @qty THEN stock - @qty ELSE 0 END`).
   - Inserta el registro en `store_sales`.
   - Suma el importe a `today_cash` y `store_cash` en `daily_metrics`.

4. **`registerCashCut(payload)`:**
   - Obtiene métricas del día.
   - Calcula diferencia entre dinero contado y esperado.
   - Inserta el corte inmutable en `cash_cuts`.

5. **`getMemberByCredential(query)`:**
   - Realiza búsqueda unificada en memoria indexada:
     1. Búsqueda directa por `id` (exacto, con o sin ceros a la izquierda).
     2. Búsqueda por `pin_code`.
     3. Búsqueda por `rfid_uid`.
   - Recalcula días restantes dinámicamente con base en la fecha de hoy para garantizar que el estado siempre esté actualizado.

---

## 7. Mantenimiento y Respaldos

- **Verificación de integridad:**
  ```sql
  PRAGMA integrity_check;
  ```
- **Compactación y optimización:**
  ```sql
  VACUUM;
  ```
- **Respaldo en caliente (Hot Backup):**
  Al estar en modo WAL, es seguro realizar copias del archivo `gears_gym.sqlite` incluso mientras el servidor se encuentra en ejecución, o utilizar el comando de copia de seguridad nativo:
  ```powershell
  # Respaldo desde PowerShell
  Copy-Item backend/db/gears_gym.sqlite backend/db/gears_gym_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss').sqlite
  ```
