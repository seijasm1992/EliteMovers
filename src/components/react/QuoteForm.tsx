import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch, type UseFormRegister } from "react-hook-form";
import { quoteSchema, sanitizeName, sanitizePhone, todayMoveDate, type QuoteFormValues } from "../../lib/validations/quoteSchema";
import type { QuoteFormContent } from "../../types/content";
import Contacto from "./Contacto";

interface Props {
  content: QuoteFormContent;
  variant?: "default" | "hero" | "page";
  onValuesChange?: (values: Partial<QuoteFormValues>) => void;
  geoapifyApiKey?: string;
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
const fieldControlClassName = "block h-14 w-full min-w-0 max-w-full rounded-lg border bg-white px-4 pb-1 pt-5 font-sans text-base text-text-strong outline-none transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] focus:ring-2 sm:text-sm";

const getFieldStateClassName = (error?: string, isValid = false) => {
  if (error) return "border-alert focus:border-alert focus:ring-alert/15";
  if (isValid) return "border-success focus:border-success focus:ring-success/15";
  return "border-ink/15 focus:border-brand-primary focus:ring-brand-primary/15";
};

export default function QuoteForm({ content, variant = "default", onValuesChange, geoapifyApiKey }: Props) {
  const { control, register, handleSubmit, setValue, formState: { errors, touchedFields, isSubmitting, isSubmitSuccessful, isSubmitted } } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const values = useWatch({ control });
  const { form } = content;
  const isPageVariant = variant === "page";
  const formClassName = isPageVariant
    ? "w-full min-w-0 rounded-[1.5rem] border border-brand-primary/5 bg-white p-5 text-brand-primary shadow-bubble sm:p-8"
    : "w-full min-w-0 rounded-2xl border border-brand-yellow/80 bg-white p-5 text-brand-primary shadow-[0_18px_44px_rgba(2,12,21,0.2)] sm:p-6";
  const successClassName = isPageVariant
    ? "rounded-[1.5rem] border border-brand-primary/5 bg-white p-8 text-center text-brand-primary shadow-bubble"
    : "rounded-2xl bg-white p-7 text-center text-brand-primary";
  const [activeAddressField, setActiveAddressField] = useState<AddressFieldName | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<Record<AddressFieldName, AddressSuggestion[]>>({ originCity: [], destinationCity: [] });
  const [addressLoading, setAddressLoading] = useState<Record<AddressFieldName, boolean>>({ originCity: false, destinationCity: false });

  useEffect(() => {
    onValuesChange?.(values);
  }, [onValuesChange, values]);

  useEffect(() => {
    const query = activeAddressField ? (values[activeAddressField] ?? "").trim() : "";
    if (!geoapifyApiKey || !activeAddressField || query.length < 3) {
      if (activeAddressField) setAddressSuggestions((current) => ({ ...current, [activeAddressField]: [] }));
      return;
    }

    const field = activeAddressField;
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setAddressLoading((current) => ({ ...current, [field]: true }));
      try {
        const params = new URLSearchParams({ text: query, type: "city", filter: "countrycode:us", bias: "proximity:-80.1918,25.7617", limit: "5", format: "json", apiKey: geoapifyApiKey });
        const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?${params}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Address autocomplete failed");
        const data = await response.json() as { results?: Record<string, unknown>[] };
        setAddressSuggestions((current) => ({ ...current, [field]: (data.results ?? []).map(formatAddressSuggestion).filter((suggestion): suggestion is AddressSuggestion => Boolean(suggestion)) }));
      } catch {
        if (!controller.signal.aborted) setAddressSuggestions((current) => ({ ...current, [field]: [] }));
      } finally {
        if (!controller.signal.aborted) setAddressLoading((current) => ({ ...current, [field]: false }));
      }
    }, 250);

    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, [activeAddressField, geoapifyApiKey, values.destinationCity, values.originCity]);

  const completedFields = useMemo(() => fieldNames.filter((name) => quoteSchema.shape[name].safeParse(values[name]).success).length, [values]);
  const remainingFields = fieldNames.length - completedFields;
  const submit = async (formValues: QuoteFormValues) => {
    const response = await fetch("/api/quote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(formValues) });
    if (!response.ok) throw new Error("Quote request failed");
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

  if (isSubmitSuccessful) return <div className={successClassName}><h2 className="type-ui-title font-extrabold">{form.success.title}</h2><p className="mt-2 text-sm text-text-subtle">{form.success.message}</p></div>;

  return <form onSubmit={handleSubmit(submit)} noValidate className={formClassName}>
    <p className="flex items-center justify-center gap-2 text-sm text-text-subtle"><span className="text-base leading-none" aria-hidden="true">🔒</span>100% Secure</p>
    <h2 className="type-ui-title mt-1 text-center font-extrabold">{form.title}</h2>
    <div className="mt-5" aria-label="Quote form completion">
      <div className="flex items-center justify-between text-xs font-semibold text-text-subtle"><span>{completedFields} of {fieldNames.length} details complete</span><span>{Math.round((completedFields / fieldNames.length) * 100)}%</span></div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-brand-primary/10"><div className="h-full rounded-full bg-brand-yellow transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(completedFields / fieldNames.length) * 100}%` }} /></div>
    </div>
    <div className="mt-6 grid min-w-0 gap-4 sm:grid-cols-2">
      {(["originCity", "destinationCity"] as const).map((name) => <FloatingTextField key={name} name={name} label={form.fields[name].label} error={errors[name]?.message} isTouched={Boolean(touchedFields[name])} value={values[name] ?? ""} register={register} autocomplete={addressAutocomplete(name)} />)}
      <FloatingDateField label={form.fields.moveDate.label} error={errors.moveDate?.message} isTouched={Boolean(touchedFields.moveDate)} value={values.moveDate ?? ""} register={register} />
      <FloatingSelectField label={form.fields.homeSize.label} error={errors.homeSize?.message} isTouched={Boolean(touchedFields.homeSize)} value={values.homeSize ?? ""} register={register} />
      {textFields.slice(2).map((name) => <FloatingTextField key={name} name={name} label={form.fields[name].label} error={errors[name]?.message} isTouched={Boolean(touchedFields[name])} value={values[name] ?? ""} register={register} />)}
      <div className="sm:col-span-2"><FloatingTextField name="email" label={form.fields.email.label} error={errors.email?.message} isTouched={Boolean(touchedFields.email)} value={values.email ?? ""} register={register} type="email" /></div>
    </div>
    {isSubmitted && remainingFields > 0 && <p role="alert" className="mt-4 text-center text-sm font-medium text-alert">{remainingFields} {remainingFields === 1 ? "detail needs" : "details need"} your attention.</p>}
    <button type="submit" disabled={isSubmitting} className="mt-5 flex min-h-14 w-full items-center justify-center rounded-xl bg-brand-yellow px-5 font-accent text-sm font-extrabold text-brand-primary transition-colors hover:bg-[#ffe36f] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-primary disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting ? form.buttons.submitting : form.buttons.submit}</button>
    <p className="mt-4 text-center text-xs text-text-subtle"><span className="mr-2 text-brand-yellow">●</span>No spam. No pressure. Transparent pricing.</p>
    <Contacto />
  </form>;
}

function FloatingTextField({ name, label, error, isTouched, value, register, type = "text", autocomplete }: { name: TextFieldName; label: string; error?: string; isTouched: boolean; value: string; register: UseFormRegister<QuoteFormValues>; type?: "text" | "email"; autocomplete?: { suggestions: AddressSuggestion[]; loading: boolean; visible: boolean; onFocus: () => void; onBlur: () => void; onSelect: (suggestion: AddressSuggestion) => void } }) {
  const registration = register(name);
  const sanitize = name === "fullName" ? sanitizeName : name === "phone" ? sanitizePhone : undefined;
  const isValid = isTouched && !error && quoteSchema.shape[name].safeParse(value).success;
  const messageId = `${name}-message`;
  return <div className="relative min-w-0"><label className="relative block min-w-0"><input {...registration} id={name} type={type} inputMode={name === "phone" ? "tel" : type === "email" ? "email" : "text"} autoComplete={name === "fullName" ? "name" : name === "phone" ? "tel" : name === "email" ? "email" : "address-level2"} placeholder=" " maxLength={name === "email" ? 100 : name === "fullName" ? 15 : undefined} aria-invalid={Boolean(error)} aria-describedby={(error || isValid) ? messageId : undefined} aria-autocomplete={autocomplete ? "list" : undefined} aria-expanded={autocomplete ? autocomplete.visible && (autocomplete.loading || autocomplete.suggestions.length > 0) : undefined} aria-controls={autocomplete ? `${name}-suggestions` : undefined} onFocus={autocomplete?.onFocus} onBlur={(event) => { registration.onBlur(event); autocomplete?.onBlur(); }} onBeforeInput={sanitize ? (event) => { const text = (event.nativeEvent as InputEvent).data; if (text && sanitize(text) !== text) event.preventDefault(); } : undefined} onChange={(event) => { if (sanitize) event.currentTarget.value = sanitize(event.currentTarget.value); registration.onChange(event); }} className={`peer placeholder:text-transparent ${fieldControlClassName} ${getFieldStateClassName(error, isValid)}`} /><span className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 bg-white px-1 font-sans text-text-subtle transition-[top,transform,font-size,color] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-brand-primary ${value ? "top-2 translate-y-0 text-xs" : "text-base sm:text-sm"}`}>{label}</span>{isValid && <span className="absolute right-4 top-1/2 -translate-y-1/2 text-success" aria-hidden="true">✓</span>}</label><AddressSuggestionList id={`${name}-suggestions`} loading={autocomplete?.loading ?? false} suggestions={autocomplete?.suggestions ?? []} visible={autocomplete?.visible ?? false} onSelect={autocomplete?.onSelect} /><FieldFeedback id={messageId} error={error} isValid={isValid} /></div>;
}

function FloatingDateField({ label, error, isTouched, value, register }: { label: string; error?: string; isTouched: boolean; value: string; register: UseFormRegister<QuoteFormValues> }) {
  const isValid = isTouched && !error && quoteSchema.shape.moveDate.safeParse(value).success;
  const messageId = "moveDate-message";
  return <div className="min-w-0"><label className="relative block min-w-0"><input id="moveDate" type="date" min={todayMoveDate()} {...register("moveDate")} aria-invalid={Boolean(error)} aria-describedby={(error || isValid) ? messageId : undefined} className={`${fieldControlClassName} ${getFieldStateClassName(error, isValid)}`} /><span className="pointer-events-none absolute left-4 top-2 bg-white px-1 font-sans text-xs text-text-subtle">{label}</span>{isValid && <span className="absolute right-10 top-1/2 -translate-y-1/2 text-success" aria-hidden="true">✓</span>}</label><FieldFeedback id={messageId} error={error} isValid={isValid} /></div>;
}

function FloatingSelectField({ label, error, isTouched, value, register }: { label: string; error?: string; isTouched: boolean; value: string; register: UseFormRegister<QuoteFormValues> }) {
  const isValid = isTouched && !error && quoteSchema.shape.homeSize.safeParse(value).success;
  const messageId = "homeSize-message";
  return <div className="min-w-0"><label className="relative block min-w-0"><select id="homeSize" defaultValue="" {...register("homeSize")} aria-invalid={Boolean(error)} aria-describedby={(error || isValid) ? messageId : undefined} className={`appearance-none pr-10 ${fieldControlClassName} ${getFieldStateClassName(error, isValid)}`}><option value="" disabled>Select your move size</option>{MOVE_SIZES.map(([optionValue, text]) => <option key={optionValue} value={optionValue}>{text}</option>)}</select><span className="pointer-events-none absolute left-4 top-2 bg-white px-1 font-sans text-xs text-text-subtle">{label}</span><span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-subtle" aria-hidden="true">⌄</span>{isValid && <span className="absolute right-10 top-1/2 -translate-y-1/2 text-success" aria-hidden="true">✓</span>}</label><FieldFeedback id={messageId} error={error} isValid={isValid} /></div>;
}

function FieldFeedback({ id, error, isValid }: { id: string; error?: string; isValid: boolean }) {
  if (error) return <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-alert">{error}</p>;
  if (isValid) return <p id={id} className="mt-1.5 text-xs font-medium text-success">Looks good</p>;
  return null;
}

function formatAddressSuggestion(result: Record<string, unknown>, index: number): AddressSuggestion | null {
  const city = typeof result.city === "string" ? result.city : typeof result.name === "string" ? result.name : "";
  if (!city) return null;
  const stateCode = typeof result.state_code === "string" ? result.state_code : typeof result.state === "string" ? result.state : "";
  const countryCode = typeof result.country_code === "string" ? result.country_code.toUpperCase() : "";
  const label = stateCode ? `${city}, ${stateCode}` : city;
  return { id: `${label}-${index}`, label, sublabel: countryCode };
}

function AddressSuggestionList({ id, loading, suggestions, visible, onSelect }: { id: string; loading: boolean; suggestions: AddressSuggestion[]; visible: boolean; onSelect?: (suggestion: AddressSuggestion) => void }) {
  if (!visible || (!loading && suggestions.length === 0)) return null;
  return <div id={id} role="listbox" className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-30 overflow-hidden rounded-lg border border-brand-primary/15 bg-white shadow-[0_12px_28px_rgba(2,12,21,0.16)]">
    {loading && <p className="px-4 py-3 text-sm text-text-subtle">Searching cities…</p>}
    {!loading && suggestions.map((suggestion) => <button key={suggestion.id} type="button" role="option" aria-selected="false" className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-text-strong transition-colors hover:bg-brand-surface focus-visible:bg-brand-surface focus-visible:outline-none" onClick={() => onSelect?.(suggestion)}><span className="font-semibold">{suggestion.label}</span>{suggestion.sublabel && <span className="text-xs text-text-subtle">{suggestion.sublabel}</span>}</button>)}
  </div>;
}
