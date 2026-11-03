"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Tabs } from "@/components/ui/tabs";
import { Chip } from "@/components/ui/chip";

/** Interactive specimens. Internal page: sample copy only, no product claims. */
export function InteractiveDemos({ idPrefix }: { idPrefix: string }) {
  const t = useTranslations();
  const [dialog, setDialog] = useState<null | "dialog" | "sheet" | "bottom">(null);
  const [chip, setChip] = useState<string>("pools");
  const [email, setEmail] = useState("");
  const invalid = email.length > 0 && !/^\S+@\S+\.\S+$/.test(email);

  const sample = (n: number) => ({
    id: `${idPrefix}-sample-${n}`,
    question: `${t("categories.pools")} · ${t("useCases.relax")} ${n}`,
    answer: <p>{t("states.empty")}</p>,
  });

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap gap-2">
        {(["pools", "villas", "rooftops", "sport"] as const).map((c) => (
          <Chip key={c} pressed={chip === c} onClick={() => setChip(c)}>
            {t(`categories.${c}`)}
          </Chip>
        ))}
      </div>

      <Field label={t("forms.email")} hint={t("forms.emailHint")} error={invalid ? t("forms.emailError") : undefined}>
        {(p) => <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} {...p} />}
      </Field>

      <Tabs
        label={t("nav.primary")}
        hashPrefix={`${idPrefix}-tabs`}
        items={[
          { key: "a", label: t("useCases.celebrate"), content: <p className="text-ink-muted">{t("useCases.celebrate")}</p> },
          { key: "b", label: t("useCases.relax"), content: <p className="text-ink-muted">{t("useCases.relax")}</p> },
          { key: "c", label: t("useCases.shoot"), content: <p className="text-ink-muted">{t("useCases.shoot")}</p> },
        ]}
      />

      <Accordion items={[sample(1), sample(2), sample(3)]} />

      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={() => setDialog("dialog")}>Dialog</Button>
        <Button variant="secondary" onClick={() => setDialog("sheet")}>Sheet</Button>
        <Button variant="secondary" onClick={() => setDialog("bottom")}>Bottom sheet</Button>
      </div>
      <Dialog
        open={dialog !== null}
        onClose={() => setDialog(null)}
        title={t("nav.signIn")}
        closeLabel={t("a11y.close")}
        variant={dialog ?? "dialog"}
      >
        <p className="text-ink-muted">{t("currency.paymentNote")}</p>
      </Dialog>
    </div>
  );
}
