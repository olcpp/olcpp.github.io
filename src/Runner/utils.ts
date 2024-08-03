import { onMounted, onUnmounted } from "vue";
import { onBeforeRouteLeave } from "vue-router";

export function useBeforeUnload() {
    function onBeforeUnload(event: Event) {
        event.preventDefault();
    }
    onMounted(() => window.addEventListener('beforeunload', onBeforeUnload));
    onUnmounted(() => window.removeEventListener('beforeunload', onBeforeUnload));
    onBeforeRouteLeave(() => confirm(navigator.language == 'zh-CN' ? '离开此页面？\n系统可能不会保存您所做的更改。' : 'Are you sure to leave?'));
}
