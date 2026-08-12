import { zodResolver } from "@hookform/resolvers/zod";
import { PUBLIC_TURNSTILE_SITE_KEY } from "astro:env/client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch, type UseFormRegister } from "react-hook-form";
import { quoteSchema, sanitizeName, sanitizePhone, todayMoveDate, type QuoteFormValues } from "../../lib/validations/quoteSchema";
import type { QuoteFormContent } from "../../types/content";
import Contacto, { QUOTE_FORM_ID } from "./Contacto";
import TurnstileWidget, { type TurnstileHandle } from "./TurnstileWidget";

const turnstileSiteKey = PUBLIC_TURNSTILE_SITE_KEY.trim();

interface Props {
  content: QuoteFormContent;
  variant?: "default" | "hero" | "page";
  onValuesChange?: (values: Partial<QuoteFormValues>) => void;
}

type TextFieldName = "originCity" | "destinationCity" | "fullName" | "phone" | "email";
type FieldName = keyof QuoteFormValues;
type AddressFieldName = "originCity" | "destinationCity";

interface AddressSuggestion {
  id: string;
  label: string;
  sublabel: string;
}

const MOVE_SIZES = [
  ["studio", "Studio"],
  ["one-bedroom", "1 Bedroom"],
  ["two-bedroom", "2 Bedrooms"],
  ["three-bedroom", "3 Bedrooms"],
  ["four-plus", "4+ Bedrooms"],
] as const;

const fieldNames: FieldName[] = ["originCity", "destinationCity", "moveDate", "homeSize", "fullName", "phone", "email"];
const textFields: TextFieldName[] = ["originCity", "destinationCity", "fullName", "phone"];
const fieldControlClassName = "block box-border h-14 w-full min-w-0 max-w-full rounded-lg border bg-white px-4 pb-1 pt-5 font-sans text-base text-text-strong outline-none transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] focus:ring-2 sm:text-sm";

const getFieldStateClassName = (error?: string, isValid = false) => {
  if (error) return "border-alert focus:border-alert focus:ring-alert/15";
  if (isValid) return "border-success focus:border-success focus:ring-success/15";
  return "border-ink/15 focus:border-brand-primary focus:ring-brand-primary/15";
};

const getDateFieldStateClassName = (error?: string, isValid = false) => {
  if (error) return "border-alert focus-within:border-alert focus-within:ring-alert/15";
  if (isValid) return "border-success focus-within:border-success focus-within:ring-success/15";
  return "border-ink/15 focus-within:border-brand-primary focus-within:ring-brand-primary/15";
};

export default function QuoteForm({ content, variant = "default", onValuesChange }: Props) {
  const { control, register, handleSubmit, setError, setValue, formState: { errors, touchedFields, isSubmitting, isSubmitted } } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const values = useWatch({ control });
  const { form } = content;
  const isPageVariant = variant === "page";
  const formClassName = isPageVariant
    ? "box-border w-full min-w-0 max-w-full rounded-[1.5rem] border border-brand-primary/5 bg-white p-5 text-brand-primary shadow-bubble sm:p-8"
    : "box-border w-full min-w-0 max-w-full rounded-2xl border border-brand-yellow/80 bg-white p-5 text-brand-primary shadow-[0_18px_44px_rgba(2,12,21,0.2)] sm:p-6";
  const successClassName = isPageVariant
    ? "rounded-[1.5rem] border border-brand-primary/5 bg-white p-8 text-center text-brand-primary shadow-bubble"
    : "rounded-2xl bg-white p-7 text-center text-brand-primary";
  const [activeAddressField, setActiveAddressField] = useState<AddressFieldName | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<Record<AddressFieldName, AddressSuggestion[]>>({ originCity: [], destinationCity: [] });
  const [addressLoading, setAddressLoading] = useState<Record<AddressFieldName, boolean>>({ originCity: false, destinationCity: false });
  const [addressError, setAddressError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionSucceeded, setSubmissionSucceeded] = useState(false);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const turnstileTokenRef = useRef<string | null>(null);

  useEffect(() => {
    onValuesChange?.(values);
  }, [onValuesChange, values]);

  useEffect(() => {
    const query = activeAddressField ? (values[activeAddressField] ?? "").trim() : "";
    if (!activeAddressField || query.length < 3) {
      if (activeAddressField) setAddressSuggestions((current) => ({ ...current, [activeAddressField]: [] }));
      setAddressError(null);
      return;
    }

    const field = activeAddressField;
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setAddressLoading((current) => ({ ...current, [field]: true }));
      try {
        const response = await fetch(`/api/cities?q=${encodeURIComponent(query)}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Address autocomplete failed");
        const data = await response.json() as { suggestions?: AddressSuggestion[] };
        setAddressSuggestions((current) => ({ ...current, [field]: data.suggestions ?? [] }));
        setAddressError(null);
      } catch {
        if (!controller.signal.aborted) {
          setAddressSuggestions((current) => ({ ...current, [field]: [] }));
          setAddressError("City suggestions are unavailable. You can enter the city manually.");
        }
      } finally {
        if (!controller.signal.aborted) setAddressLoading((current) => ({ ...current, [field]: false }));
      }
    }, 250);

    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [activeAddressField, values.destinationCity, values.originCity]);

  const completedFields = useMemo(() => fieldNames.filter((name) => quoteSchema.shape[name].safeParse(values[name]).success).length, [values]);
  const remainingFields = fieldNames.length - completedFields;
  const submit = async (formValues: QuoteFormValues) => {
    setSubmitError(null);
    if (turnstileSiteKey && !turnstileTokenRef.current) {
      setSubmitError("Please complete the security check before submitting.");
      return;
    }
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formValues, turnstileToken: turnstileTokenRef.current ?? undefined }),
      });
      const body = await response.json().catch(() => null) as {
        message?: string;
        errors?: Partial<Record<FieldName, string[]>>;
      } | null;

      if (!response.ok) {
        if (response.status === 422 && body?.errors) {
          Object.entries(body.errors).forEach(([field, messages]) => {
            const message = messages?.[0];
            if (message) setError(field as FieldName, { type: "server", message });
          });
        }
        // Turnstile tokens are single-use: request a fresh one for the retry.
        turnstileRef.current?.reset();
        setSubmitError(response.status === 403 && body?.message ? body.message : content.form.errorMessage);
        return;
      }

      setSubmissionSucceeded(true);
    } catch {
      turnstileRef.current?.reset();
      setSubmitError(content.form.errorMessage);
    }
  };
  const selectAddressSuggestion = (name: AddressFieldName, suggestion: AddressSuggestion) => {
    setValue(name, suggestion.label, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
    setAddressSuggestions((current) => ({ ...current, [name]: [] }));
    setActiveAddressField(null);
  };
  const addressAutocomplete = (name: AddressFieldName) => ({
    suggestions: addressSuggestions[name],
    loading: addressLoading[name],
    visible: activeAddressField === name,
    onFocus: () => setActiveAddressField(name),
    onBlur: () => window.setTimeout(() => { setAddressSuggestions((current) => ({ ...current, [name]: [] })); setAddressLoading((current) => ({ ...current, [name]: false })); setActiveAddressField((current) => current === name ? null : current); }, 160),
    onSelect: (suggestion: AddressSuggestion) => selectAddressSuggestion(name, suggestion),
  });

  if (submissionSucceeded) return <div className={successClassName}><h2 className="type-ui-title font-extrabold">{form.success.title}</h2><p className="mt-2 text-sm text-text-subtle">{form.success.message}</p></div>;

  return <form id={QUOTE_FORM_ID} onSubmit={handleSubmit(submit)} noValidate className={formClassName}>
    <p className="flex items-center justify-center gap-2 text-sm text-text-subtle"><span className="text-base leading-none" aria-hidden="true">🔒</span>100% Secure</p>
    <h2 className="type-ui-title mt-1 text-center font-extrabold">{form.title}</h2>
    <div className="mt-5" aria-label="Quote form completion">
      <div className="flex items-center justify-between text-xs font-semibold text-text-subtle"><span>{completedFields} of {fieldNames.length} details complete</span><span>{Math.round((completedFields / fieldNames.length) * 100)}%</span></div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-brand-primary/10"><div className="h-full rounded-full bg-brand-yellow transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(completedFields / fieldNames.length) * 100}%` }} /></div>
    </div>
    <div className="mt-6 grid w-full min-w-0 max-w-full gap-4 sm:grid-cols-2">
      {(["originCity", "destinationCity"] as const).map((name) => <FloatingTextField key={name} name={name} label={form.fields[name].label} error={errors[name]?.message} isTouched={Boolean(touchedFields[name])} value={values[name] ?? ""} register={register} autocomplete={addressAutocomplete(name)} />)}
      {addressError && activeAddressField && <p role="status" className="-mt-2 text-xs font-medium text-alert sm:col-span-2">{addressError}</p>}
      <FloatingDateField label={form.fields.moveDate.label} error={errors.moveDate?.message} isTouched={Boolean(touchedFields.moveDate)} value={values.moveDate ?? ""} register={register} />
      <FloatingSelectField label={form.fields.homeSize.label} error={errors.homeSize?.message} isTouched={Boolean(touchedFields.homeSize)} value={values.homeSize ?? ""} register={register} />
      {textFields.slice(2).map((name) => <FloatingTextField key={name} name={name} label={form.fields[name].label} error={errors[name]?.message} isTouched={Boolean(touchedFields[name])} value={values[name] ?? ""} register={register} />)}
      <div className="min-w-0 max-w-full sm:col-span-2"><FloatingTextField name="email" label={form.fields.email.label} error={errors.email?.message} isTouched={Boolean(touchedFields.email)} value={values.email ?? ""} register={register} type="email" /></div>
    </div>
    {isSubmitted && remainingFields > 0 && <p role="alert" className="mt-4 text-center text-sm font-medium text-alert">{remainingFields} {remainingFields === 1 ? "detail needs" : "details need"} your attention.</p>}
    {submitError && <p role="alert" className="mt-4 text-center text-sm font-medium text-alert">{submitError}</p>}
    {turnstileSiteKey && <div className="mt-5 w-full min-w-0 max-w-full"><TurnstileWidget ref={turnstileRef} siteKey={turnstileSiteKey} onToken={(token) => { turnstileTokenRef.current = token; }} /></div>}
    <button type="submit" disabled={isSubmitting} className="mt-5 flex min-h-14 w-full items-center justify-center rounded-xl bg-brand-yellow px-5 font-accent text-sm font-extrabold text-brand-primary transition-colors hover:bg-[#ffe36f] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? form.buttons.submitting : form.buttons.submit}</button>
    <p className="mt-4 text-center text-xs text-text-subtle"><span className="mr-2 text-brand-yellow">●</span>No spam. No pressure. You confirm your hourly rate before move day.</p>
    <Contacto />
  </form>;
}

function FloatingTextField({ name, label, error, isTouched, value, register, type = "text", autocomplete }: { name: TextFieldName; label: string; error?: string; isTouched: boolean; value: string; register: UseFormRegister<QuoteFormValues>; type?: "text" | "email"; autocomplete?: { suggestions: AddressSuggestion[]; loading: boolean; visible: boolean; onFocus: () => void; onBlur: () => void; onSelect: (suggestion: AddressSuggestion) => void } }) {
  const registration = register(name);
  const sanitize = name === "fullName" ? sanitizeName : name === "phone" ? sanitizePhone : undefined;
  const isValid = isTouched && !error && quoteSchema.shape[name].safeParse(value).success;
  const messageId = `${name}-message`;
  return <div className="relative min-w-0 max-w-full"><label className="relative block w-full min-w-0 max-w-full"><input {...registration} id={name} type={type} role={autocomplete ? "combobox" : undefined} inputMode={name === "phone" ? "tel" : type === "email" ? "email" : "text"} autoComplete={name === "fullName" ? "name" : name === "phone" ? "tel" : name === "email" ? "email" : "address-level2"} placeholder=" " maxLength={name === "email" || name === "fullName" ? 100 : undefined} aria-invalid={Boolean(error)} aria-describedby={(error || isValid) ? messageId : undefined} aria-autocomplete={autocomplete ? "list" : undefined} aria-haspopup={autocomplete ? "listbox" : undefined} aria-expanded={autocomplete ? autocomplete.visible && (autocomplete.loading || autocomplete.suggestions.length > 0) : undefined} aria-controls={autocomplete ? `${name}-suggestions` : undefined} onFocus={autocomplete?.onFocus} onBlur={(event) => { registration.onBlur(event); autocomplete?.onBlur(); }} onBeforeInput={sanitize ? (event) => { const text = (event.nativeEvent as InputEvent).data; if (text && sanitize(text) !== text) event.preventDefault(); } : undefined} onChange={(event) => { if (sanitize) event.currentTarget.value = sanitize(event.currentTarget.value); registration.onChange(event); }} className={`peer placeholder:text-transparent ${fieldControlClassName} ${getFieldStateClassName(error, isValid)}`} /><span className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 bg-white px-1 font-sans text-text-subtle transition-[top,transform,font-size,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-brand-primary ${value ? "top-2 translate-y-0 text-xs" : "text-base sm:text-sm"}`}>{label}</span>{isValid && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-success" aria-hidden="true">✓</span>}</label><AddressSuggestionList id={`${name}-suggestions`} loading={autocomplete?.loading ?? false} suggestions={autocomplete?.suggestions ?? []} visible={autocomplete?.visible ?? false} onSelect={autocomplete?.onSelect} /><FieldFeedback id={messageId} error={error} isValid={isValid} /></div>;
}

function FloatingDateField({ label, error, isTouched, value, register }: { label: string; error?: string; isTouched: boolean; value: string; register: UseFormRegister<QuoteFormValues> }) {
  const isValid = isTouched && !error && quoteSchema.shape.moveDate.safeParse(value).success;
  const messageId = "moveDate-message";
  return <div className="min-w-0 max-w-full"><label className={`relative grid h-14 w-full min-w-0 max-w-full grid-cols-[minmax(0,1fr)_2.5rem] overflow-hidden rounded-lg border bg-white transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] focus-within:ring-2 ${getDateFieldStateClassName(error, isValid)}`}><span className="col-start-1 row-start-1 block h-full min-w-0 overflow-hidden"><input id="moveDate" type="date" min={todayMoveDate()} {...register("moveDate")} aria-invalid={Boolean(error)} aria-describedby={(error || isValid) ? messageId : undefined} className="quote-date-input block box-border h-full w-full min-w-0 max-w-full border-0 bg-transparent px-4 pb-1 pt-5 font-sans text-base leading-5 text-text-strong outline-none sm:text-sm" /></span><span className="pointer-events-none absolute left-4 top-2 z-10 bg-white px-1 font-sans text-xs text-text-subtle">{label}</span><span className="pointer-events-none col-start-2 row-start-1 flex h-full w-10 items-center justify-center bg-white text-success" aria-hidden="true">{isValid ? "✓" : ""}</span></label><FieldFeedback id={messageId} error={error} isValid={isValid} /></div>;
}

function FloatingSelectField({ label, error, isTouched, value, register }: { label: string; error?: string; isTouched: boolean; value: string; register: UseFormRegister<QuoteFormValues> }) {
  const isValid = isTouched && !error && quoteSchema.shape.homeSize.safeParse(value).success;
  const messageId = "homeSize-message";
  return <div className="min-w-0 max-w-full"><label className="relative block w-full min-w-0 max-w-full"><select id="homeSize" defaultValue="" {...register("homeSize")} aria-invalid={Boolean(error)} aria-describedby={(error || isValid) ? messageId : undefined} className={`appearance-none pr-10 ${fieldControlClassName} ${getFieldStateClassName(error, isValid)}`}><option value="" disabled>Select your move size</option>{MOVE_SIZES.map(([optionValue, text]) => <option key={optionValue} value={optionValue}>{text}</option>)}</select><span className="pointer-events-none absolute left-4 top-2 bg-white px-1 font-sans text-xs text-text-subtle">{label}</span><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-subtle" aria-hidden="true">⌄</span>{isValid && <span className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 text-success" aria-hidden="true">✓</span>}</label><FieldFeedback id={messageId} error={error} isValid={isValid} /></div>;
}

function FieldFeedback({ id, error, isValid }: { id: string; error?: string; isValid: boolean }) {
  if (error) return <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-alert">{error}</p>;
  if (isValid) return <p id={id} className="mt-1.5 text-xs font-medium text-success">Looks good</p>;
  return null;
}

function AddressSuggestionList({ id, loading, suggestions, visible, onSelect }: { id: string; loading: boolean; suggestions: AddressSuggestion[]; visible: boolean; onSelect?: (suggestion: AddressSuggestion) => void }) {
  if (!visible || (!loading && suggestions.length === 0)) return null;
  return <div id={id} role="listbox" className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-30 overflow-hidden rounded-lg border border-brand-primary/15 bg-white shadow-[0_12px_28px_rgba(2,12,21,0.16)]">
    {loading && <p className="px-4 py-3 text-sm text-text-subtle">Searching cities…</p>}
    {!loading && suggestions.map((suggestion) => <button key={suggestion.id} type="button" role="option" aria-selected="false" className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-text-strong transition-colors hover:bg-brand-surface focus-visible:bg-brand-surface focus-visible:outline-none" onClick={() => onSelect?.(suggestion)}><span className="font-semibold">{suggestion.label}</span>{suggestion.sublabel && <span className="text-xs text-text-subtle">{suggestion.sublabel}</span>}</button>)}
  </div>;
}
