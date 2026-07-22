import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect, useRef, useCallback } from "react";
import { quoteSchema, type QuoteFormValues } from "../../lib/validations/quoteSchema";
import type { QuoteFormContent } from "../../types/content";

interface TurnstileInstance {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

type TurnstileWindow = typeof window & {
  turnstile?: TurnstileInstance;
  onloadTurnstileCallback?: () => void;
};

interface Props {
  content: QuoteFormContent;
  turnstileSiteKey?: string;
  geoapifyApiKey?: string;
  variant?: "default" | "hero";
  phone?: string;
  phoneHref?: string;
}

type Status = "idle" | "submitting" | "success" | "error";
type AddressFieldName = "originCity" | "destinationCity";

interface AddressSuggestion {
  id: string;
  label: string;
  sublabel: string;
}

const chevronIcon =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23424242' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")";

const inputBase =
  "peer block min-h-14 w-full min-w-0 max-w-full rounded-lg border bg-white px-4 pb-2 pt-6 font-sans text-sm text-text-strong transition-all duration-200 placeholder:text-transparent hover:border-ink/30 focus:outline-none focus-visible:border-info/70 focus-visible:ring-2 focus-visible:ring-info/15";

const selectBase = `${inputBase} appearance-none bg-no-repeat pr-10`;
const selectStyle = { backgroundImage: chevronIcon, backgroundPosition: "right 0.875rem center", backgroundSize: "1rem" };

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 font-accent text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70";

const btnOutline = `${btnBase} border-2 border-green bg-white text-text-strong hover:border-ink hover:bg-offwhite focus-visible:outline-ink`;
const btnGold = `${btnBase} bg-gold text-ink shadow-soft hover:-translate-y-0.5 hover:brightness-105 hover:shadow-card-hover focus-visible:outline-ink`;

const todayInputValue = () => {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
};

export default function QuoteForm({
  content,
  turnstileSiteKey,
  geoapifyApiKey,
  variant = "default",
  phone,
  phoneHref,
}: Props) {
  const { form: copy } = content;
  const isHero = variant === "hero";
  const [status, setStatus] = useState<Status>("idle");
  const [turnstileError, setTurnstileError] = useState(false);
  const [activeAddressField, setActiveAddressField] = useState<AddressFieldName | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<Record<AddressFieldName, AddressSuggestion[]>>({
    originCity: [],
    destinationCity: [],
  });
  const [addressLoading, setAddressLoading] = useState<Record<AddressFieldName, boolean>>({
    originCity: false,
    destinationCity: false,
  });
  const minMoveDate = todayInputValue();

  const containerRef = useRef<HTMLDivElement>(null);
  const tokenRef = useRef<string>("");
  const widgetIdRef = useRef<string | null>(null);

  const resetTurnstile = useCallback(() => {
    const w = window as TurnstileWindow;
    if (widgetIdRef.current !== null && w.turnstile) {
      w.turnstile.reset(widgetIdRef.current);
    }
    tokenRef.current = "";
    setTurnstileError(false);
  }, []);

  useEffect(() => {
    if (!turnstileSiteKey || !containerRef.current) return;

    const w = window as TurnstileWindow;

    const doRender = () => {
      if (!containerRef.current || !w.turnstile) return;
      widgetIdRef.current = w.turnstile.render(containerRef.current, {
        sitekey: turnstileSiteKey,
        callback: (token) => {
          tokenRef.current = token;
          setTurnstileError(false);
        },
        "expired-callback": () => {
          tokenRef.current = "";
        },
        "error-callback": () => {
          tokenRef.current = "";
          setTurnstileError(true);
        },
      });
    };

    if (w.turnstile) {
      doRender();
    } else {
      const prev = w.onloadTurnstileCallback;
      w.onloadTurnstileCallback = () => {
        prev?.();
        doRender();
      };
    }

    return () => {
      const w = window as TurnstileWindow;
      if (widgetIdRef.current !== null && w.turnstile) {
        w.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [turnstileSiteKey]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const values = watch();
  const originCityValue = values.originCity ?? "";
  const destinationCityValue = values.destinationCity ?? "";

  const fullNameField = register("fullName");
  const phoneField = register("phone");
  const moveDateField = register("moveDate");

  const formatAddressSuggestion = (result: Record<string, unknown>, index: number): AddressSuggestion | null => {
    const city = typeof result.city === "string" ? result.city : "";
    const name = typeof result.name === "string" ? result.name : "";
    const stateCode = typeof result.state_code === "string" ? result.state_code : "";
    const state = typeof result.state === "string" ? result.state : "";
    const countryCode = typeof result.country_code === "string" ? result.country_code.toUpperCase() : "";
    const lon = typeof result.lon === "number" ? result.lon : "";
    const lat = typeof result.lat === "number" ? result.lat : "";
    const cityName = city || name;

    if (!cityName) return null;

    const region = stateCode || state;
    const label = region ? `${cityName}, ${region}` : cityName;
    const sublabel = [state && state !== region ? state : "", countryCode].filter(Boolean).join(", ");

    return {
      id: `${label}-${lon}-${lat}-${index}`,
      label,
      sublabel,
    };
  };

  const selectAddressSuggestion = (name: AddressFieldName, suggestion: AddressSuggestion) => {
    setValue(name, suggestion.label, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setAddressSuggestions((current) => ({ ...current, [name]: [] }));
    setActiveAddressField(null);
  };

  useEffect(() => {
    if (!geoapifyApiKey) return;

    const addressQueries: Record<AddressFieldName, string> = {
      originCity: originCityValue,
      destinationCity: destinationCityValue,
    };

    const query = activeAddressField ? addressQueries[activeAddressField].trim() : "";

    if (!activeAddressField || query.length < 2) {
      if (activeAddressField) {
        setAddressSuggestions((current) => ({ ...current, [activeAddressField]: [] }));
      }
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setAddressLoading((current) => ({ ...current, [activeAddressField]: true }));

      try {
        const params = new URLSearchParams({
          text: query,
          type: "city",
          filter: "countrycode:us",
          bias: "proximity:-80.1918,25.7617",
          limit: "5",
          format: "json",
          apiKey: geoapifyApiKey,
        });

        const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Geoapify request failed");

        const data = (await response.json()) as { results?: Record<string, unknown>[] };
        const suggestions = (data.results ?? [])
          .map(formatAddressSuggestion)
          .filter((suggestion): suggestion is AddressSuggestion => Boolean(suggestion));

        setAddressSuggestions((current) => ({ ...current, [activeAddressField]: suggestions }));
      } catch (error) {
        if (!controller.signal.aborted) {
          setAddressSuggestions((current) => ({ ...current, [activeAddressField]: [] }));
        }
      } finally {
        if (!controller.signal.aborted) {
          setAddressLoading((current) => ({ ...current, [activeAddressField]: false }));
        }
      }
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [activeAddressField, destinationCityValue, geoapifyApiKey, originCityValue]);

  const onSubmit = async (values: QuoteFormValues) => {
    if (turnstileSiteKey && !tokenRef.current) {
      setTurnstileError(true);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          turnstileToken: tokenRef.current || undefined,
        }),
      });
      const body = (await res.json().catch(() => null)) as {
        errors?: Partial<Record<keyof QuoteFormValues, string[]>>;
      } | null;

      if (!res.ok) {
        if (res.status === 403) {
          setTurnstileError(true);
          resetTurnstile();
          setStatus("idle");
          return;
        }
        if (res.status === 422 && body?.errors) {
          for (const [field, messages] of Object.entries(body.errors)) {
            if (messages?.[0]) {
              setError(field as keyof QuoteFormValues, { message: messages[0] });
            }
          }
          setStatus("idle");
          return;
        }
        throw new Error("Request failed");
      }
      setStatus("success");
      reset();
      resetTurnstile();
    } catch {
      setStatus("error");
    }
  };

  const sanitizeNameValue = (value: string) =>
    value.replace(/[^\p{L}\s'.-]/gu, "");

  const sanitizePhoneValue = (value: string) =>
    value.replace(/[^\d\s()+\-.]/g, "");

  const setSanitizedValue = (
    name: "fullName" | "phone",
    element: HTMLInputElement,
    value: string,
  ) => {
    element.value = value;
    setValue(name, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const preventInvalidNameInput = (event: React.FormEvent<HTMLInputElement>) => {
    const inputEvent = event.nativeEvent as InputEvent;
    if (inputEvent.data && sanitizeNameValue(inputEvent.data) !== inputEvent.data) {
      event.preventDefault();
    }
  };

  const preventInvalidPhoneInput = (event: React.FormEvent<HTMLInputElement>) => {
    const inputEvent = event.nativeEvent as InputEvent;
    if (inputEvent.data && sanitizePhoneValue(inputEvent.data) !== inputEvent.data) {
      event.preventDefault();
    }
  };

  const handleSanitizedPaste = (
    event: React.ClipboardEvent<HTMLInputElement>,
    name: "fullName" | "phone",
    sanitize: (value: string) => string,
  ) => {
    event.preventDefault();
    const element = event.currentTarget;
    const pasted = sanitize(event.clipboardData.getData("text"));
    const start = element.selectionStart ?? element.value.length;
    const end = element.selectionEnd ?? element.value.length;
    const nextValue = `${element.value.slice(0, start)}${pasted}${element.value.slice(end)}`;
    setSanitizedValue(name, element, nextValue);
    const caretPosition = start + pasted.length;
    requestAnimationFrame(() => element.setSelectionRange(caretPosition, caretPosition));
  };

  const handleFullNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizeNameValue(event.currentTarget.value);
    setSanitizedValue("fullName", event.currentTarget, sanitized);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const sanitized = sanitizePhoneValue(event.currentTarget.value);
    setSanitizedValue("phone", event.currentTarget, sanitized);
  };

  const handleMoveDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.value && event.currentTarget.value < minMoveDate) {
      event.currentTarget.value = "";
      setValue("moveDate", "", {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: false,
      });
      setError("moveDate", {
        type: "min",
        message: "Estimated date cannot be in the past",
      });
      return;
    }

    setValue("moveDate", event.currentTarget.value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleAddressChange = (name: AddressFieldName, event: React.ChangeEvent<HTMLInputElement>) => {
    setActiveAddressField(name);
    setValue(name, event.currentTarget.value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const handleAddressBlur = (name: AddressFieldName) => {
    window.setTimeout(() => {
      setAddressSuggestions((current) => ({ ...current, [name]: [] }));
      setAddressLoading((current) => ({ ...current, [name]: false }));
      setActiveAddressField((current) => (current === name ? null : current));
    }, 140);
  };

  const fieldError = (name: keyof QuoteFormValues) =>
    errors[name]?.message as string | undefined;

  const fieldHasValue = (name: keyof QuoteFormValues) => {
    const value = values[name];
    return typeof value === "string" && value.trim().length > 0;
  };

  const fieldIsActive = (name: keyof QuoteFormValues) =>
    fieldHasValue(name);

  const errClass = (name: keyof QuoteFormValues) =>
    `${inputBase} ${fieldIsActive(name) ? "" : "text-transparent focus:text-text-strong"} ${
      fieldError(name) ? "border-alert focus-visible:border-alert focus-visible:ring-alert/20" : "border-ink/15"
    }`;

  const selectClass = (name: keyof QuoteFormValues) =>
    `${selectBase} ${fieldIsActive(name) ? "" : "text-transparent focus:text-text-strong"} ${
      fieldError(name) ? "border-alert focus-visible:border-alert focus-visible:ring-alert/20" : "border-ink/15"
    }`;

  const handleClear = () => {
    reset();
    resetTurnstile();
    setStatus("idle");
  };

  const formClass = isHero
    ? "w-full min-w-0 overflow-visible rounded-[1rem] border-2 border-gold/80 bg-offwhite p-4 shadow-bubble sm:p-5"
    : "w-full min-w-0 overflow-hidden rounded-[var(--radius-card)] border-2 border-gold/80 bg-offwhite p-6 shadow-soft sm:p-8 lg:p-10";

  const headerClass = isHero ? "mb-4 text-center" : "mb-6 text-center";
  const cardClass = isHero
    ? "grid min-w-0 gap-3 rounded-xl border border-ink/10 bg-white p-3 shadow-[0_18px_42px_-28px_rgba(17,17,17,0.45)] sm:grid-cols-2 sm:p-4"
    : "grid min-w-0 gap-4 rounded-xl border border-ink/10 bg-white p-4 shadow-[0_18px_42px_-28px_rgba(17,17,17,0.45)] sm:p-5";
  const fieldsetClass = isHero ? "grid min-w-0 gap-4" : "grid min-w-0 gap-5";

  if (status === "success") {
    return (
      <div className={`${isHero ? "rounded-[1rem] p-6 sm:p-7" : "rounded-[var(--radius-card)] p-8 sm:p-10"} border border-green/20 bg-offwhite text-center shadow-soft`}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green/10 text-green">
          <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="mt-5 text-2xl">{copy.success.title}</h3>
        <p className="mx-auto mt-3 max-w-md text-text-subtle">{copy.success.message}</p>
        {phone && phoneHref && (
          <a
            href={phoneHref}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-gold px-5 py-3 font-accent text-sm font-bold text-ink shadow-soft transition-transform hover:-translate-y-0.5"
          >
            Can't wait? Call {phone}
          </a>
        )}
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
      className={formClass}
    >
      <header className={headerClass}>
        <div className="mx-auto flex items-center justify-center gap-2 font-accent text-xs font-bold text-text-strong sm:text-sm">
          <svg className="h-4 w-4 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="5" y="11" width="14" height="10" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
          <span>All Your Information Is 100% Secure</span>
        </div>
      </header>

      <fieldset className={fieldsetClass} disabled={status === "submitting"}>
        <legend className="sr-only">Quote request form</legend>

        <div className={cardClass}>
          <Field label={copy.fields.fullName.label} name="fullName" error={fieldError("fullName")} active={fieldIsActive("fullName")}>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              inputMode="text"
              pattern="[^\d]*"
              placeholder={copy.fields.fullName.placeholder}
              aria-invalid={!!fieldError("fullName")}
              aria-describedby={fieldError("fullName") ? "fullName-error" : undefined}
              className={errClass("fullName")}
              {...fullNameField}
              onBeforeInput={preventInvalidNameInput}
              onChange={handleFullNameChange}
              onPaste={(event) => handleSanitizedPaste(event, "fullName", sanitizeNameValue)}
            />
          </Field>
          <Field label={copy.fields.email.label} name="email" error={fieldError("email")} active={fieldIsActive("email")}>
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
          <Field label={copy.fields.phone.label} name="phone" error={fieldError("phone")} active={fieldIsActive("phone")}>
            <input
              id="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              pattern="[0-9\s()+\-.]*"
              placeholder={copy.fields.phone.placeholder}
              aria-invalid={!!fieldError("phone")}
              aria-describedby={fieldError("phone") ? "phone-error" : undefined}
              className={errClass("phone")}
              {...phoneField}
              onBeforeInput={preventInvalidPhoneInput}
              onChange={handlePhoneChange}
              onPaste={(event) => handleSanitizedPaste(event, "phone", sanitizePhoneValue)}
            />
          </Field>
          <Field label={copy.fields.moveType.label} name="moveType" error={fieldError("moveType")} active={fieldIsActive("moveType")}>
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
          <Field label={copy.fields.originCity.label} name="originCity" error={fieldError("originCity")} active={fieldIsActive("originCity")}>
            <input
              id="originCity"
              type="text"
              autoComplete="address-level2"
              placeholder={copy.fields.originCity.placeholder}
              aria-invalid={!!fieldError("originCity")}
              aria-describedby={fieldError("originCity") ? "originCity-error" : undefined}
              className={errClass("originCity")}
              {...register("originCity")}
              onBlur={() => handleAddressBlur("originCity")}
              onChange={(event) => handleAddressChange("originCity", event)}
              onFocus={() => setActiveAddressField("originCity")}
            />
            <AddressSuggestionList
              fieldName="originCity"
              loading={addressLoading.originCity}
              suggestions={addressSuggestions.originCity}
              visible={activeAddressField === "originCity"}
              onSelect={selectAddressSuggestion}
            />
          </Field>
          <Field label={copy.fields.destinationCity.label} name="destinationCity" error={fieldError("destinationCity")} active={fieldIsActive("destinationCity")}>
            <input
              id="destinationCity"
              type="text"
              autoComplete="address-level2"
              placeholder={copy.fields.destinationCity.placeholder}
              aria-invalid={!!fieldError("destinationCity")}
              aria-describedby={fieldError("destinationCity") ? "destinationCity-error" : undefined}
              className={errClass("destinationCity")}
              {...register("destinationCity")}
              onBlur={() => handleAddressBlur("destinationCity")}
              onChange={(event) => handleAddressChange("destinationCity", event)}
              onFocus={() => setActiveAddressField("destinationCity")}
            />
            <AddressSuggestionList
              fieldName="destinationCity"
              loading={addressLoading.destinationCity}
              suggestions={addressSuggestions.destinationCity}
              visible={activeAddressField === "destinationCity"}
              onSelect={selectAddressSuggestion}
            />
          </Field>
          <Field label={copy.fields.moveDate.label} name="moveDate" error={fieldError("moveDate")} active={fieldIsActive("moveDate")}>
            <input
              id="moveDate"
              type="date"
              min={minMoveDate}
              aria-invalid={!!fieldError("moveDate")}
              aria-describedby={fieldError("moveDate") ? "moveDate-error" : undefined}
              className={`${errClass("moveDate")} appearance-none [-webkit-appearance:none] [color-scheme:light]`}
              {...moveDateField}
              onChange={handleMoveDateChange}
            />
          </Field>

          <Field label={copy.fields.homeSize.label} name="homeSize" error={fieldError("homeSize")} active={fieldIsActive("homeSize")}>
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
          <Field label={copy.fields.contactPreference.label} name="contactPreference" error={fieldError("contactPreference")} active={fieldIsActive("contactPreference")}>
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

          <Field label={copy.fields.message.label} name="message" error={fieldError("message")} active={fieldIsActive("message")} optional>
            <textarea
              id="message"
              rows={4}
              placeholder={copy.fields.message.placeholder}
              className={`${errClass("message")} min-h-28 resize-y`}
              {...register("message")}
            />
          </Field>
        </div>

        {turnstileSiteKey && (
          <div className="flex flex-col gap-1.5">
            <div ref={containerRef} />
            {turnstileError && (
              <p role="alert" className="text-xs font-medium text-alert">
                Verification failed — please complete the security check and try again.
              </p>
            )}
          </div>
        )}

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

        <p className="flex items-center justify-center gap-2 font-accent text-sm font-bold text-text-strong">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gold text-ink">
            <svg className="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          No Spam. No Pressure, Transparent Pricing
        </p>
      </fieldset>
    </form>
  );
}

interface FieldProps {
  label: string;
  name: string;
  error?: string;
  active: boolean;
  optional?: boolean;
  children: React.ReactNode;
}

interface AddressSuggestionListProps {
  fieldName: AddressFieldName;
  loading: boolean;
  suggestions: AddressSuggestion[];
  visible: boolean;
  onSelect: (name: AddressFieldName, suggestion: AddressSuggestion) => void;
}

function AddressSuggestionList({
  fieldName,
  loading,
  suggestions,
  visible,
  onSelect,
}: AddressSuggestionListProps) {
  if (!visible || (!loading && suggestions.length === 0)) return null;

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-30 overflow-hidden rounded-lg border border-ink/10 bg-white shadow-bubble">
      {loading && (
        <div className="px-4 py-3 font-sans text-sm text-text-subtle">
          Searching cities...
        </div>
      )}
      {!loading && suggestions.map((suggestion) => (
        <button
          key={suggestion.id}
          type="button"
          className="block w-full px-4 py-3 text-left font-sans transition-colors hover:bg-offwhite focus:bg-offwhite focus:outline-none"
          onMouseDown={(event) => {
            event.preventDefault();
            onSelect(fieldName, suggestion);
          }}
        >
          <span className="block text-sm font-semibold text-text-strong">{suggestion.label}</span>
          {suggestion.sublabel && (
            <span className="mt-0.5 block text-xs text-text-subtle">{suggestion.sublabel}</span>
          )}
        </button>
      ))}
    </div>
  );
}

function Field({ label, name, error, active, optional, children }: FieldProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="relative min-w-0">
        {children}
        <label
          htmlFor={name}
          className={`pointer-events-none absolute left-3 bg-white px-1 font-sans text-sm text-text-subtle transition-all duration-200 ${
            active
              ? "top-0 -translate-y-1/2 text-[0.68rem] font-medium text-text-subtle"
              : "top-1/2 -translate-y-1/2 text-sm peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[0.68rem] peer-focus:font-medium peer-focus:text-info"
          }`}
        >
        {label}
        {optional && <span className="ml-1 font-normal text-neutral-mute">(optional)</span>}
        </label>
      </div>
      {error && (
        <p id={`${name}-error`} role="alert" className="text-xs font-medium text-alert">
          {error}
        </p>
      )}
    </div>
  );
}
