# 📐 Manual de Arquitectura Técnica: GEARS GYM (Release v1.0)

Este documento proporciona la especificación técnica sobre la arquitectura de software, integración de hardware, modelo transaccional SQLite WAL y blindaje 100% Offline del sistema **GEARS GYM**.

---

## 1. Filosofía Arquitectónica: 100% Offline-First en Red Local (LAN)

GEARS GYM implementa una arquitectura **Offline-First de Cero CDNs**:
1.  **Independencia Total de Internet:** Tanto la base de datos SQLite como el servidor Node.js, las hojas de estilo Tailwind CSS v4 y las fuentes de iconografía FontAwesome `.woff2` residen localmente en la Mini PC (`dist/assets/`).
2.  **Baja Latencia (< 20 ms):** Sincronización bidireccional mediante WebSockets (`Socket.IO`) y transacciones locales síncronas (`better-sqlite3` en modo WAL).
3.  **Despliegue Monopuerto (`3000`):** Un único proceso de Node.js sirve los archivos estáticos compilados, la API REST (`limit: '5mb'`) y el servidor Socket.IO (`maxHttpBufferSize: 5e6`).

---

## 2. Capa de Abstracción de Hardware (HAL) — `backend/hardware/relay.js`

El torniquete **ZKTeco TS1000 Plus** se controla mediante un relevador USB de 2 canales con chip **CH340** (`COM3` @ 9600 baudios, 8N1):

| Canal | Operación | Trama Hexadecimal | Descripción |
| :---: | :---: | :---: | :--- |
| **CH1 (Entrada)** | **Abrir Relé** | `0xA0 0x01 0x01 0xA2` | Cierra contacto seco `OPEN_IN` durante 800 ms. |
| **CH1 (Entrada)** | **Cerrar Relé** | `0xA0 0x01 0x00 0xA1` | Abre contacto seco y rearma el torniquete. |
| **CH2 (Salida)** | **Abrir Relé** | `0xA0 0x02 0x01 0xA3` | Cierra contacto seco `OPEN_OUT` durante 800 ms. |
| **CH2 (Salida)** | **Cerrar Relé** | `0xA0 0x02 0x00 0xA2` | Abre contacto seco y rearma el torniquete. |

Incluye **Mutex Anti-Rebote independiente por canal** y conmutación automática a **Modo SIMULADOR** cuando el hardware no está conectado.

---

## 3. Modelo de Persistencia Transaccional: SQLite WAL (`backend/db/database.js`)

### 3.1. Esquema Relacional v1.0
*   **`members`**:
    *   `id` (`TEXT PRIMARY KEY` — PIN o folio de 3-4 dígitos, autogenerado incrementalmente `'089'`, `'090'`... si se omite).
    *   `name` (`TEXT NOT NULL`), `phone` (`TEXT DEFAULT ''`), `photo` (`TEXT` — URL o Base64 JPEG 300×300).
    *   `plan` (`TEXT`), `price` (`TEXT`), `status` (`'active'`, `'warning'`, `'expired'`), `days` (`INTEGER`), `isInside` (`INTEGER DEFAULT 0`), `timeIn` (`TEXT`), `updatedAt` (`DATETIME`).
*   **`store_sales`**:
    *   `id` (`INTEGER PRIMARY KEY AUTOINCREMENT`), `item_id` (`TEXT`), `item_name` (`TEXT`), `price` (`INTEGER`), `timestamp` (`DATETIME DEFAULT CURRENT_TIMESTAMP`).
*   **`daily_metrics`**:
    *   `date` (`TEXT PRIMARY KEY` `YYYY-MM-DD`), `today_cash` (`INTEGER`), `memberships_cash` (`INTEGER`), `visits_cash` (`INTEGER`), `store_cash` (`INTEGER`), `today_entries` (`INTEGER`).
*   **`access_logs`**:
    *   `id` (`INTEGER PRIMARY KEY AUTOINCREMENT`), `member_id` (`TEXT`), `member_name` (`TEXT`), `action` (`TEXT`), `channel` (`INTEGER`), `status` (`TEXT`), `timestamp` (`DATETIME`).

### 3.2. Funciones Transaccionales Exportadas
*   `createMember({ id, name, phone, photo, plan, price, days })`: autogenera folio si no se envía, calcula `status`, extrae el valor numérico del precio (`'$400'` → `400`, `'2x$700'` → `700`, `'$250'` → `250`) y lo suma atómicamente a `today_cash` y `memberships_cash`.
*   `renewMember(id, plan, price, extraDays)`: suma días vigentes (`CASE WHEN days > 0 THEN days + @extraDays ELSE @extraDays END`), activa al socio y registra el ingreso en `daily_metrics`.
*   `updateMember(id, data)` y `deleteMember(id)`: edición y baja de socios.
*   `getMemberById(id)`: búsqueda flexible que reconoce el folio con o sin ceros a la izquierda (`'042'` o `'42'`).
*   `recordStoreSale(itemId, itemName, price)`: inserta la venta en `store_sales` y suma `price` a `today_cash` y `store_cash`.
*   `getDailyCutSummary(date)`: devuelve el desglose completo de `daily_metrics` junto con las últimas 20 ventas de `store_sales` y los últimos 20 registros de `access_logs`.

---

## 4. Arquitectura de Frontend, Wake Lock y Modo Kiosco

```
src/
├── App.jsx                  <-- Enrutador (?view=admin | ?view=monitor)
├── main.jsx                 <-- Importación local de FontAwesome, index.css y Service Worker v4
├── index.css                <-- Directivas Tailwind v4, animaciones y bloqueo de gestos Kiosco
├── screens/
│   ├── AdminPanel.jsx       <-- Recepción: Dashboard, POS Arsenal, Socios, Torniquete y Corte de Caja
│   └── Monitor.jsx          <-- Kiosco TV 21.5": Cartelera, Lector HID/PIN Pad y Tarjetas de Acceso
├── components/
│   ├── admin/modals/        <-- NewMemberModal (WebRTC 300x300), EditMemberModal, CashCutModal, ProductModal
│   ├── admin/tabs/          <-- DashboardTab, ArsenalTab (POS 1-Toque), SociosTab, TorniqueteTab, etc.
│   └── monitor/             <-- MonitorHeader, PromoHeroBanner, TariffsGrid, TvSidebarInfo, AccessPopupModal
└── utils/
    ├── wakeLock.js          <-- Hook useWakeLock (Screen Wake Lock API + reconexión en visibilitychange)
    ├── audio.js             <-- Web Audio API Synthesizer (sin archivos de audio externos)
    └── socket.js            <-- Cliente Socket.IO con autodetección de IP LAN
```
