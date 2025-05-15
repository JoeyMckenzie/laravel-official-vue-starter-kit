import type { DefineComponent } from "vue";
import { createInertiaApp } from "@inertiajs/vue3";
import { useColorMode } from "@vueuse/core";
import { useCookies } from "@vueuse/integrations/useCookies";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createApp, h } from "vue";
import { ZiggyVue } from "ziggy-js";
import "../css/app.css";

// Extend ImportMeta interface for Vite...

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: title => `${title} - ${appName}`,
    resolve: name => resolvePageComponent(`./pages/${name}.vue`, import.meta.glob<DefineComponent>("./pages/**/*.vue")),
    setup({ el, App, props, plugin }) {
        const cookie = useCookies(["appearance"]);
        const { store } = useColorMode();
        const appearance: "light" | "dark" | "auto" | null = cookie.get("appearance") ?? null;

        if (appearance) {
            store.value = appearance;
        }
        else {
            store.value = "auto";
        }

        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(ZiggyVue)
            .mount(el);
    },
    progress: {
        color: "#4B5563",
    },
}).catch(error => console.error(error));
