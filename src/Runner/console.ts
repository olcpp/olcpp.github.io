import { Terminal } from 'xterm';
import wcwidth from 'wcwidth';

function createStdioAPIs(xterm: Terminal) {
    const eventTarget = new EventTarget();
    const stdinEvent = new Event('stdin');
    const stdkeyEvent = new Event('stdkey');
    let currentBuffer = new Array<number>(), inputBuffers = new Array<number>();
    let startInputPos: number | null = null;
    xterm.onData((key) => {
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
            xterm.write(key);
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

export function createConsoleAPIs(xterm: Terminal) {
    return {
        ...createStdioAPIs(xterm),
        ...createDebugAPIs(),
    };
};