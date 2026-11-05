# Guía Rápida de Instalación en Sitio — Mini PC Lenovo (Windows 11)

Esta guía de **1 página** contiene los 4 pasos exactos para dejar operando la Mini PC Lenovo, el Monitor de 21.5", el Relevador USB CH340 del Torniquete y la Tablet de Recepción **100% Offline**.

---

## 1. Fijar IP Local Estática en Windows 11 (Mini PC)
Para que la Tablet de recepción siempre encuentre al servidor sin importar reinicios del módem/router:

1. Presiona `Win + R`, escribe `ncpa.cpl` y presiona **Enter**.
2. Haz clic derecho sobre tu adaptador de red (**Ethernet** o **Wi-Fi**) y selecciona **Propiedades**.
3. Haz doble clic en **Habilitar el protocolo de Internet versión 4 (TCP/IPv4)**.
4. Selecciona **"Usar la siguiente dirección IP"** y configura:
   - **Dirección IP:** `192.168.1.100` *(o dentro del segmento de tu router, ej. `192.168.0.100`)*
   - **Máscara de subred:** `255.255.255.0`
   - **Puerta de enlace predeterminada:** `192.168.1.1` *(IP de tu router)*
5. En **Firewall de Windows**, permite el puerto TCP `3000` ejecutando en PowerShell como Administrador:
   ```powershell
   New-NetFirewallRule -DisplayName "GEARS GYM Server 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
   ```

---

## 2. Configurar Puerto `COM3` del Relevador USB CH340 (Torniquete)
El backend (`backend/hardware/relay.js`) dispara los pulsos hexadecimales `A0 01 01 A2` hacia el puerto `COM3` por defecto:

1. Conecta el módulo Relevador USB (chip **CH340 / LCUS-2**) a un puerto USB trasero de la Mini PC.
2. Presiona `Win + X` y selecciona **Administrador de dispositivos** (`devmgmt.msc`).
3. Despliega la sección **Puertos (COM y LPT)** y ubica **USB-SERIAL CH340 (COMx)**.
4. Si el número de puerto no es `COM3`:
   - Haz clic derecho sobre **USB-SERIAL CH340** → **Propiedades** → pestaña **Configuración de puerto** → **Opciones avanzadas...**
   - En **Número de puerto COM**, selecciona **`COM3`** y haz clic en **Aceptar**.

---

## 3. Auto-Arranque en Modo Kiosco al Encender la Mini PC (`shell:startup`)
Para que al encender la Mini PC Lenovo arranque automáticamente el servidor SQLite y se abra el Monitor en pantalla completa sin intervención humana:

1. En el Explorador de archivos, navega a la carpeta `scripts\` del proyecto y haz clic derecho sobre **`start-gears-kiosk.bat`** → **Mostrar más opciones** → **Crear acceso directo**.
2. Presiona `Win + R`, escribe **`shell:startup`** y presiona **Enter** (se abrirá la carpeta *Inicio* de Windows).
3. Mueve o pega el **acceso directo de `start-gears-kiosk.bat`** dentro de esa carpeta.
4. *(Opcional)* Para que Windows 11 inicie sesión sin pedir contraseña tras un corte de luz, presiona `Win + R`, ejecuta `netplwiz` y desmarca *"Los usuarios deben escribir su nombre y contraseña para usar el equipo"*.

---

## 4. Habilitar Cámara WebRTC en la Tablet Android sobre Red Local (HTTP)
Por seguridad, Chrome en Android bloquea `navigator.mediaDevices.getUserMedia` en direcciones IP locales (`http://192.168.1.100:3000`) a menos que se autorice el origen del servidor:

1. Abre **Google Chrome** en la Tablet de Recepción.
2. En la barra de direcciones, escribe exactamente:
   ```text
   chrome://flags/#unsafely-treat-insecure-origin-as-secure
   ```
3. En el cuadro de texto de esa bandera, escribe la URL local de la Mini PC:
   ```text
   http://192.168.1.100:3000
   ```
4. Cambia el selector de *Disabled* a **Enabled** y toca el botón azul **Relaunch** abajo a la derecha.
5. Entra a `http://192.168.1.100:3000/?view=admin`, abre el menú de Chrome (**⋮**) y selecciona **"Instalar aplicación"** o **"Agregar a la pantalla principal"**.

