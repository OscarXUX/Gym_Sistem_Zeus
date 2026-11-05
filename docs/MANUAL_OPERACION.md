# 🛡️ Manual de Operación para Recepción: GEARS GYM (Release v1.0)

Este manual describe los procedimientos operativos estándar para la recepción de **GEARS GYM**.

---

## 1. Arranque Automático Diario (Modo Kiosco)

1.  **Encendido de la Mini PC Central:**
    *   Al encender la Mini PC Lenovo en Windows 11, el script `scripts\start-gears-kiosk.bat` (registrado en `shell:startup`) inicia automáticamente el servidor Node.js + SQLite en segundo plano y abre el **Monitor de Socios (21.5")** en pantalla completa (`http://localhost:3000/?view=monitor`).
2.  **Conexión de la Tablet Administrativa:**
    *   Abre la PWA **GEARS GYM** en la Tablet (`http://192.168.1.100:3000/?view=admin`).
    *   El sistema mantiene la pantalla encendida permanentemente gracias al **Screen Wake Lock API** integrado.

---

## 2. Alta de Socios con Cámara de Tablet y Renovaciones (`Pelotón / Socios`)

1.  **Reclutar Guerrero (Nuevo Socio):**
    *   Toca **"Reclutar Guerrero"**.
    *   Pulsa **"Tomar Foto con Cámara"** (cámara en vivo WebRTC) o **"Subir / Capturar Archivo"**. El sistema recorta y comprime automáticamente la fotografía a `300x300 px` JPEG para guardarla al instante en SQLite.
    *   Ingresa **Nombre Completo**, **Teléfono**, **PIN / Folio** (opcional; si lo dejas vacío se autogenera `089`, `090`, etc.) y selecciona el **Plan Oficial** (`Mensualidad $400 - 30 días`, `Promo Dúo 2x$700 - 30 días` o `Quincena $250 - 15 días`).
    *   Pulsa **"Cobrar & Registrar"**: el socio queda registrado y el importe se suma automáticamente al **Corte de Caja**.
2.  **Renovar Membresía:**
    *   En la fila de cualquier socio, toca el botón **"Renovar"**, elige el plan a cobrar y confirma. Los días se suman al socio y el monto ingresa a `memberships_cash` y `today_cash`.
3.  **Probar Acceso / Pasar Huella desde la Lista:**
    *   Toca el botón **"Pasar Huella"** en la fila de cualquier socio para disparar el relevador y mostrar su fotografía real y días restantes en el Monitor de 21.5".

---

## 3. Acceso por PIN / Teclado Numérico HID y Torniquete

*   **Desde el Monitor de 21.5" (Teclado USB o Pantalla):**
    *   El socio puede digitar su número de folio (con o sin ceros a la izquierda, ej. `042` o `42`) en el teclado numérico USB conectado a la Mini PC (el bloque del sensor mostrará `PIN: ***`) y presionar **Enter**.
    *   También puede tocar el botón **"PIN O HUELLA"** en pantalla para abrir el teclado numérico táctil.
*   **Desde la Tablet de Recepción (`Control Torniquete`):**
    *   Ingresa el folio en el recuadro **"Ingreso Rápido por PIN / Folio"** y pulsa **"Validar PIN"**, o utiliza los botones **"Abrir Entrada (CH1)"**, **"Abrir Salida (CH2)"** y **"Bloqueo de Emergencia"**.

---

## 4. Punto de Venta Rápido "Arsenal" (1-Toque) y Corte de Caja

1.  **Venta de Suplementos en 1 Toque:**
    *   Desde el **Dashboard** o la pestaña **Arsenal (Tienda)**, toca cualquiera de las 4 tarjetas del POS Rápido:
        *   **Agua 1L ($20 MXN)**
        *   **Pre-Entreno Hype ($35 MXN)**
        *   **Proteína Whey ($30 MXN)**
        *   **Electrolitos ($15 MXN)**
    *   Cada toque registra la venta en SQLite (`store_sales`), descuenta 1 unidad del stock y suma el monto a `store_cash` y `today_cash`.
2.  **Corte de Caja del Día:**
    *   Pulsa el botón verde **"Corte de Caja"** en la cabecera del Dashboard o del Arsenal.
    *   Se abrirá el resumen auditado con las 5 tarjetas clave (**Total en Caja Hoy**, **Mensualidades/Renovaciones**, **Visitas del Día $60**, **Suplementos/Arsenal** y **Aforo/Entradas Hoy**) junto con el listado de las últimas 20 ventas y accesos registrados.
