<template>
    <div style="height: 100%;" ref="terminal"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { Terminal } from 'xterm';
import { FitAddon } from '@xterm/addon-fit';
import 'xterm/css/xterm.css';

import { useBeforeUnload } from './utils.ts';
import { createBaseAPIs } from './base.ts';
import { createConsoleAPIs } from './console.ts';

const props = defineProps<{
    moduleUrl: string;
}>();

const terminal = ref<HTMLInputElement | null>(null);
const wndSize = useWindowSize();
useBeforeUnload();

const xterm = new Terminal({
    convertEol: true
});
onMounted(() => {
    const fitAddon = new FitAddon();
    xterm.loadAddon(fitAddon);
    xterm.open(terminal.value as HTMLInputElement);
    watch(() => [wndSize.height, wndSize.width], () => fitAddon.fit(), { immediate: true });
});

const baseAPIs = createBaseAPIs();
const consoleAPIs = createConsoleAPIs(xterm);
onMounted(async () => {
    const createModule = (await import(props.moduleUrl)).default;
    await createModule({
        // APIs
        base: baseAPIs,
        console: consoleAPIs,
        // onExit
        onExit(exitCode: number) {
            xterm.writeln(`\nProgram exited with code ${exitCode}.`);
        },
        // stdout print() function
        // note: even though it cannot be understood,
        //       but when stdin is not used in a program,
        //       it will always call print() rather than stdout.
        /** @deprecated */
        print(str: string) {
            xterm.writeln(str);
        },
    });
});
</script>