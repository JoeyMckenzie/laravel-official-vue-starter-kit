import { useColorMode } from "@vueuse/core";
import { useCookies } from "@vueuse/integrations/useCookies";

export function useAppearance() {
    const { store } = useColorMode();

    const initializeAppearance = () => {
        const cookie = useCookies(["appearance"]);
        const appearance: "light" | "dark" | "auto" | null = cookie.get("appearance") ?? null;

        if (appearance) {
            store.value = appearance;
        }
        else {
            store.value = "auto";
        }
    };

    return {
        store,
        initializeAppearance,
    };
}
