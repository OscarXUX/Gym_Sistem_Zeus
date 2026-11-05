// backend/hardware/relay.js
const { SerialPort } = require('serialport');

class TurnstileRelayController {
    constructor() {
        this.port = null;
        this.isConnected = false;
        this.isProcessing = { 1: false, 2: false };
        this.portPath = process.env.RELAY_PORT || 'COM3';
        this.pulseDuration = parseInt(process.env.RELAY_PULSE_MS) || 800;
        this.init();
    }

    init() {
        try {
            this.port = new SerialPort({ path: this.portPath, baudRate: 9600, autoOpen: false });
            this.port.open((err) => {
                if (err) {
                    console.warn(`[RELAY] Hardware no detectado en ${this.portPath}. Modo SIMULADOR activo.`);
                    this.isConnected = false;
                    return;
                }
                this.isConnected = true;
                console.log(`[RELAY] Relevador USB 2 Canales conectado en ${this.portPath}`);
            });
            this.port.on('error', (err) => {
                console.error('[RELAY ERROR]', err.message);
                this.isConnected = false;
            });
        } catch (e) {
            console.warn('[RELAY] SerialPort en modo virtual.');
            this.isConnected = false;
        }
    }

    /**
     * @param {number} channel - 1 para Entrada, 2 para Salida
     * @param {function} callback
     */
    triggerAccessPulse(channel = 1, callback) {
        const ch = channel === 2 ? 2 : 1;
        if (this.isProcessing[ch]) {
            console.warn(`[RELAY] Canal ${ch} ocupado (anti-rebote activo).`);
            return;
        }

        this.isProcessing[ch] = true;
        console.log(`⚡ [RELAY] Disparando Canal ${ch} (${ch === 1 ? 'ENTRADA' : 'SALIDA'})...`);

        // Comandos hexadecimales para relevador USB de 2 canales (CH340 / LCUS)
        const CMD_OPEN = ch === 1 
            ? Buffer.from([0xA0, 0x01, 0x01, 0xA2]) 
            : Buffer.from([0xA0, 0x02, 0x01, 0xA3]);
        const CMD_CLOSE = ch === 1 
            ? Buffer.from([0xA0, 0x01, 0x00, 0xA1]) 
            : Buffer.from([0xA0, 0x02, 0x00, 0xA2]);

        if (this.isConnected && this.port) {
            this.port.write(CMD_OPEN, (err) => {
                if (err) console.error(`[RELAY] Error al abrir canal ${ch}:`, err);
                setTimeout(() => {
                    this.port.write(CMD_CLOSE, () => {
                        this.isProcessing[ch] = false;
                        if (callback) callback(true);
                    });
                }, this.pulseDuration);
            });
        } else {
            setTimeout(() => {
                this.isProcessing[ch] = false;
                console.log(`✅ [RELAY SIMULADO] Canal ${ch} liberado y rearmado.`);
                if (callback) callback(true);
            }, this.pulseDuration);
        }
    }
}

module.exports = new TurnstileRelayController();
