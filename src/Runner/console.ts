import { Terminal } from 'xterm';
import wcwidth from 'wcwidth';
import { onMounted, onUnmounted } from 'vue';

function createStdioAPIs(xterm: Terminal) {
    const eventTarget = new EventTarget();
    const stdinEvent = new Event('stdin');
    const stdkeyEvent = new Event('stdkey');
    let currentBuffer = new Array<number>(), inputBuffers = new Array<number>();
    let startInputPos: number | null = null;
    let isRawMode = false;
    xterm.onData((key) => {
        if (isRawMode) {
            inputBuffers = inputBuffers.concat(Array.from(new TextEncoder().encode(key)));
            eventTarget.dispatchEvent(stdinEvent);
            eventTarget.dispatchEvent(stdkeyEvent);
            return;
        }
        if (key.charCodeAt(0) == 13) {
            inputBuffers = inputBuffers.concat(currentBuffer).concat(Array.from(new TextEncoder().encode('\n')));
            currentBuffer = new Array();
            xterm.write('\r\n');
            eventTarget.dispatchEvent(stdinEvent);
        } else if (key.charCodeAt(0) == 127) {
            if (startInputPos != null) {
                let len = wcwidth(new TextDecoder('utf-8').decode(new Uint8Array(currentBuffer)));
                for (let i = 0; i < len; i++) {
                    xterm.write('\b \b');
                }
            }
            startInputPos = null;
            currentBuffer = new Array();
        } else {
            if (startInputPos == null) {
                startInputPos = xterm.buffer.active.cursorX;
            }
            currentBuffer = currentBuffer.concat(Array.from(new TextEncoder().encode(key)));
            if (key.charCodeAt(0) != 27) {
                xterm.write(key);
            }
        }
        eventTarget.dispatchEvent(stdkeyEvent);
    });
    xterm.onTitleChange((newtitle) => document.title = newtitle);
    return {
        read(length: number) {
            return inputBuffers.splice(0, Math.min(inputBuffers.length, length));
        },
        getCharWithoutEnter() {
            return new Promise<number>((resolve) => {
                function doGetc() {
                    if (inputBuffers.length > 0) {
                        resolve(inputBuffers.shift() ?? 0);
                    } else if (currentBuffer.length > 0) {
                        resolve(currentBuffer.shift() ?? 0);
                    } else {
                        // console.log('wait');
                        eventTarget.addEventListener('stdkey', doGetc, { once: true });
                    }
                }
                doGetc();
            });
        },
        waitForReadable() {
            return new Promise<void>((resolve) => {
                if (inputBuffers.length > 0) {
                    resolve();
                } else {
                    eventTarget.addEventListener('stdin', () => resolve(), { once: true });
                }
            });
        },
        write(buffer: Array<number>) {
            xterm.write(new Uint8Array(buffer));
        },
        raw(use: boolean) {
            isRawMode = use;
        },
        /** @deprecated */
        getChar() {
            return inputBuffers.shift() ?? 0;
        },
        /** @deprecated */
        putChar(charCode: number) {
            xterm.write(new Uint8Array([charCode]));
        },
    };
}
function createDebugAPIs() {
    let buffer = '';
    return {
        writeLog(str: string) {
            for (const char of str) {
                if (char.charCodeAt(0) == 10) {
                    console.log(buffer);
                    buffer = '';
                } else {
                    buffer += char;
                }
            }
        }
    };
}
function createTerminalAPIs(xterm: Terminal) {
    const eventTarget = new EventTarget();
    const resizeEvent = new Event('resize');
    function onresize() {
        eventTarget.dispatchEvent(resizeEvent);
    }
    onMounted(() => window.addEventListener('resize', onresize, { capture: true }));
    onUnmounted(() => window.removeEventListener('resize', onresize, { capture: true }));
    return {
        getSize() {
            return { x: xterm.cols, y: xterm.rows };
        },
        onResize(callback: (size: { cols: number; rows: number; }) => void) {
            eventTarget.addEventListener('resize', () => {
                callback({ cols: xterm.cols, rows: xterm.rows });
            });
        },
    };
}

export function createConsoleAPIs(xterm: Terminal) {
    return {
        ...createStdioAPIs(xterm),
        ...createDebugAPIs(),
        ...createTerminalAPIs(xterm),
    };
};