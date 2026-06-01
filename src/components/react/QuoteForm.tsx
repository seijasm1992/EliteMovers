import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { quoteSchema, type QuoteFormValues } from "../../lib/validations/quoteSchema";
import type { QuoteFormContent } from "../../types/content";

interface Props {
  content: QuoteFormContent;
}

type Status = "idle" | "submitting" | "success" | "error";

const chevronIcon =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23424242' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

const inputBase =
  "w-full rounded-lg border bg-white px-4 py-3 font-sans text-sm text-text-strong transition-all duration-200 placeholder:text-neutral-mute hover:border-ink/30 focus:outline-none focus-visible:border-green/40 focus-visible:ring-2 focus-visible:ring-green/20";

const selectBase = `${inputBase} appearance-none bg-no-repeat pr-10`;
const selectStyle = { backgroundImage: chevronIcon, backgroundPosition: "right 0.875rem center", backgroundSize: "1rem" };

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 font-accent text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70";

const btnOutline = `${btnBase} border border-ink/20 bg-white text-text-strong hover:border-ink hover:bg-offwhite focus-visible:outline-ink`;
const btnGold = `${btnBase} bg-gold text-ink shadow-soft hover:-translate-y-0.5 hover:brightness-105 hover:shadow-card-hover focus-visible:outline-ink`;

export default function QuoteForm({ content }: Props) {
  const { form: copy } = content;
  const [status, setStatus] = useState<Status>("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    mode: "onTouched",
  });

  const onSubmit = async (values: QuoteFormValues) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  const fieldError = (name: keyof QuoteFormValues) =>
    errors[name]?.message as string | undefined;

  const errClass = (name: keyof QuoteFormValues) =>
    `${inputBase} ${fieldError(name) ? "border-alert focus-visible:border-alert focus-visible:ring-alert/20" : "border-ink/15"}`;

  const selectClass = (name: keyof QuoteFormValues) =>
    `${selectBase} ${fieldError(name) ? "border-alert focus-visible:border-alert focus-visible:ring-alert/20" : "border-ink/15"}`;

  const handleClear = () => {
    reset();
    setStatus("idle");
  };

  if (status === "success") {
    return (
      <div className="rounded-[var(--radius-card)] border border-green/20 bg-offwhite p-8 text-center shadow-soft sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green/10 text-green">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="mt-5 text-2xl">{copy.success.title}</h3>
        <p className="mx-auto mt-3 max-w-md text-text-subtle">{copy.success.message}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 font-accent text-sm font-semibold text-green underline-offset-4 transition-colors hover:text-green/80 hover:underline"
        >
          {copy.success.resetLabel}
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-[var(--radius-card)] border border-ink/8 bg-offwhite p-6 shadow-soft sm:p-8 lg:p-10"
    >
      <header className="mb-8 text-center">
        <h3 className="text-xl leading-snug text-text-strong sm:text-2xl">{copy.title}</h3>
        <p className="mt-3 font-sans text-sm text-text-subtle">
          {copy.continuePrompt}{" "}
          <a
            href={copy.continueLink.href}
            className="font-semibold text-green underline-offset-4 transition-colors hover:text-green/80 hover:underline"
          >
            {copy.continueLink.label}
          </a>
        </p>
      </header>

      <fieldset className="grid gap-5" disabled={status === "submitting"}>
        <legend className="sr-only">Quote request form</legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={copy.fields.fullName.label} name="fullName" error={fieldError("fullName")}>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder={copy.fields.fullName.placeholder}
              aria-invalid={!!fieldError("fullName")}
              aria-describedby={fieldError("fullName") ? "fullName-error" : undefined}
              className={errClass("fullName")}
              {...register("fullName")}
            />
          </Field>
          <Field label={copy.fields.email.label} name="email" error={fieldError("email")}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder={copy.fields.email.placeholder}
              aria-invalid={!!fieldError("email")}
              aria-describedby={fieldError("email") ? "email-error" : undefined}
              className={errClass("email")}
              {...register("email")}
            />
          </Field>
          <Field label={copy.fields.phone.label} name="phone" error={fieldError("phone")}>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder={copy.fields.phone.placeholder}
              aria-invalid={!!fieldError("phone")}
              aria-describedby={fieldError("phone") ? "phone-error" : undefined}
              className={errClass("phone")}
              {...register("phone")}
            />
          </Field>
          <Field label={copy.fields.moveType.label} name="moveType" error={fieldError("moveType")}>
            <select
              id="moveType"
              defaultValue=""
              style={selectStyle}
              aria-invalid={!!fieldError("moveType")}
              aria-describedby={fieldError("moveType") ? "moveType-error" : undefined}
              className={selectClass("moveType")}
              {...register("moveType")}
            >
              <option value="" disabled>{copy.selectPlaceholder}</option>
              {content.moveTypes.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="h-px bg-ink/10" role="presentation" />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label={copy.fields.originCity.label} name="originCity" error={fieldError("originCity")}>
            <input
              id="originCity"
              type="text"
              autoComplete="address-level2"
              placeholder={copy.fields.originCity.placeholder}
              aria-invalid={!!fieldError("originCity")}
              aria-describedby={fieldError("originCity") ? "originCity-error" : undefined}
              className={errClass("originCity")}
              {...register("originCity")}
            />
          </Field>
          <Field label={copy.fields.destinationCity.label} name="destinationCity" error={fieldError("destinationCity")}>
            <input
              id="destinationCity"
              type="text"
              autoComplete="address-level2"
              placeholder={copy.fields.destinationCity.placeholder}
              aria-invalid={!!fieldError("destinationCity")}
              aria-describedby={fieldError("destinationCity") ? "destinationCity-error" : undefined}
              className={errClass("destinationCity")}
              {...register("destinationCity")}
            />
          </Field>
          <Field label={copy.fields.moveDate.label} name="moveDate" error={fieldError("moveDate")}>
            <input
              id="moveDate"
              type="date"
              aria-invalid={!!fieldError("moveDate")}
              aria-describedby={fieldError("moveDate") ? "moveDate-error" : undefined}
              className={`${errClass("moveDate")} [color-scheme:light]`}
              {...register("moveDate")}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={copy.fields.homeSize.label} name="homeSize" error={fieldError("homeSize")}>
            <select
              id="homeSize"
              defaultValue=""
              style={selectStyle}
              aria-invalid={!!fieldError("homeSize")}
              aria-describedby={fieldError("homeSize") ? "homeSize-error" : undefined}
              className={selectClass("homeSize")}
              {...register("homeSize")}
            >
              <option value="" disabled>{copy.selectPlaceholder}</option>
              {content.homeSizes.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
          <Field label={copy.fields.contactPreference.label} name="contactPreference" error={fieldError("contactPreference")}>
            <select
              id="contactPreference"
              defaultValue=""
              style={selectStyle}
              aria-invalid={!!fieldError("contactPreference")}
              aria-describedby={fieldError("contactPreference") ? "contactPreference-error" : undefined}
              className={selectClass("contactPreference")}
              {...register("contactPreference")}
            >
              <option value="" disabled>{copy.selectPlaceholder}</option>
              {content.contactPreferences.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label={copy.fields.message.label} name="message" error={fieldError("message")} optional>
          <textarea
            id="message"
            rows={4}
            placeholder={copy.fields.message.placeholder}
            className={`${errClass("message")} resize-y`}
            {...register("message")}
          />
        </Field>

        {status === "error" && (
          <p role="alert" className="rounded-lg bg-alert/8 px-4 py-3 text-sm font-medium text-alert">
            {copy.errorMessage}
          </p>
        )}

        <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={handleClear} className={`${btnOutline} w-full sm:w-auto`}>
            {copy.buttons.clear}
          </button>
          <button type="submit" className={`${btnGold} w-full sm:w-auto`}>
            {status === "submitting" ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4Z" />
                </svg>
                {copy.buttons.submitting}
              </>
            ) : (
              copy.buttons.submit
            )}
          </button>
        </div>
      </fieldset>
    </form>
  );
}

interface FieldProps {
  label: string;
  name: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}

function Field({ label, name, error, optional, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={name} className="font-accent text-sm font-semibold text-text-strong">
        {label}
        {optional && <span className="ml-1 font-normal text-neutral-mute">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} role="alert" className="text-xs font-medium text-alert">
          {error}
        </p>
      )}
    </div>
  );
}
