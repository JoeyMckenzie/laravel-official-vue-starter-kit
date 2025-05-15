import type { ClassValue } from "clsx";
import { useColorMode } from "@vueuse/core";
import { useCookies } from "@vueuse/integrations/useCookies";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function initializeAppearance() {
    const { store } = useColorMode();
    const cookie = useCookies(["appearance"]);
    const appearance: "light" | "dark" | "auto" | null = cookie.get("appearance") ?? null;

    if (appearance) {
        store.value = appearance;
    }
    else {
        store.value = "auto";
    }
}
