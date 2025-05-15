import type { DefineComponent } from "vue";
import { createInertiaApp } from "@inertiajs/vue3";
import createServer from "@inertiajs/vue3/server";
import { renderToString } from "@vue/server-renderer";
import { useColorMode } from "@vueuse/core";
import { useCookies } from "@vueuse/integrations/useCookies";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createSSRApp, h } from "vue";
import { route as ziggyRoute } from "ziggy-js";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createServer(page =>
    createInertiaApp({
        page,
        render: renderToString,
        title: title => `${title} - ${appName}`,
        resolve: name => resolvePageComponent(`./pages/${name}.vue`, import.meta.glob<DefineComponent>("./pages/**/*.vue")),
        setup({ App, props, plugin }) {
            const app = createSSRApp({ render: () => h(App, props) });

            // Configure Ziggy for SSR...
            const ziggyConfig = {
                // @ts-expect-error: ziggy is known at runtime via middleware
                ...page.props.ziggy,
                // @ts-expect-error: ziggy is known at runtime via middleware
                location: new URL(page.props.ziggy.location),
            };

            // Create route function...
            const route = (name: string, params?: any, absolute?: boolean) => ziggyRoute(name, params, absolute, ziggyConfig);

            // Make route function available globally...
            // @ts-expect-error: route will be defined
            app.config.globalProperties.route = route;

            // Make route function available globally for SSR...
            if (typeof window === "undefined") {
                // @ts-expect-error: global will be available
                globalThis.route = route;
            }
            else {
                const cookie = useCookies(["appearance"]);
                const { store } = useColorMode();
                const appearance: "light" | "dark" | "auto" | null = cookie.get("appearance") ?? null;

                if (appearance) {
                    store.value = appearance;
                }
                else {
                    store.value = "auto";
                }
            }

            app.use(plugin);

            return app;
        },
    }),
);
