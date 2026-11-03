import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { Logo } from "@/components/brand/logo";

/** Phase 1 placeholder. The homepage is built in Phase 2 (hero prototype first). */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations("brand");

  return (
    <main id="main" className="page-x flex min-h-dvh flex-col items-center justify-center gap-8 text-center">
      <Logo label={t("name")} />
      <h1 className="text-5xl font-light">{t("tagline")}</h1>
    </main>
  );
}
