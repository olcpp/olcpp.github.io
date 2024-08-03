import { onMounted, onUnmounted } from 'vue';

function createKeyStateAPIs() {
    const KeyMap = new Map<number, number>();
    function onKeydown(e: KeyboardEvent) {
        KeyMap.set(e.keyCode, 1);
    }
    function onKeyup(e: KeyboardEvent) {
        KeyMap.set(e.keyCode, 0);
    }
    onMounted(() => {
        document.addEventListener('keydown', onKeydown, { capture: true });
        document.addEventListener('keyup', onKeyup, { capture: true });
    });
    onUnmounted(() => {
        document.removeEventListener('keydown', onKeydown);
        document.removeEventListener('keyup', onKeyup);
    });
    return {
        /** @deprecated */
        getKeyState(keyCode: number) {
            return new Promise<number>((resolve) => {
                setTimeout(() => resolve(KeyMap.get(keyCode) ?? 0));
            });
        }
    };
}

export function createBaseAPIs() {
    return {
        ...createKeyStateAPIs()
    };
}