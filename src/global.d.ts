import type { Locale } from "@/i18n/routing";
import type messages from "@/messages/fr.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    // French is the source catalog: EN and AR must provide the same keys.
    Messages: typeof messages;
  }
}
