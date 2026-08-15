"use client";

import { useRef, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import styles from "./ContactForm.module.css";

const ENQUIRY_TYPES = [
  { id: "project", label: "Project", note: "A building, at any stage" },
  { id: "research", label: "Research", note: "A question worth studying" },
  {
    id: "collaboration",
    label: "Collaboration",
    note: "Working together on something",
  },
  { id: "general", label: "General", note: "Anything else" },
];

interface Errors {
  name?: string;
  email?: string;
  message?: string;
}

/**
 * The form composes a message and hands it to the visitor's own mail client.
 *
 * There is no server behind it yet, and rather than show a fake success state
 * the form says plainly what it is doing. When a form endpoint is available,
 * only `handleSubmit` needs to change.
 */
export function ContactForm() {
  const [type, setType] = useState("project");
  const [errors, setErrors] = useState<Errors>({});
  const [handedOff, setHandedOff] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const organisation = String(data.get("organisation") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const next: Errors = {};
    if (!name) next.name = "Please tell us your name.";
    if (!email) next.email = "Please give us an email address to reply to.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "That email address does not look complete.";
    if (!message) next.message = "Please tell us what you are working on.";

    setErrors(next);

    if (Object.keys(next).length > 0) {
      setHandedOff(false);
      // Move focus to the summary so the errors are announced.
      window.requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    const label =
      ENQUIRY_TYPES.find((t) => t.id === type)?.label ?? "Enquiry";
    const subject = `[${label}] Enquiry from ${name}`;
    const body = [
      `Enquiry type: ${label}`,
      `Name: ${name}`,
      `Email: ${email}`,
      organisation ? `Organisation: ${organisation}` : null,
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `${site.contact.emailHref}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setHandedOff(true);
  };

  const errorEntries = Object.entries(errors) as [keyof Errors, string][];

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
      {errorEntries.length > 0 ? (
        <div
          ref={summaryRef}
          className={styles.summary}
          role="alert"
          tabIndex={-1}
        >
          <p className={styles.summaryTitle}>
            {errorEntries.length === 1
              ? "One field needs attention"
              : `${errorEntries.length} fields need attention`}
          </p>
          <div className={styles.summaryList}>
            {errorEntries.map(([field, message]) => (
              <a key={field} href={`#contact-${field}`}>
                {message}
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <fieldset className={styles.fieldset}>
        <legend className={`label ${styles.legend}`}>
          What is this about?
        </legend>
        <div className={styles.types}>
          {ENQUIRY_TYPES.map((option) => (
            <label key={option.id} className={styles.type}>
              <input
                type="radio"
                name="type"
                value={option.id}
                checked={type === option.id}
                onChange={() => setType(option.id)}
              />
              <span className={styles.typeName}>{option.label}</span>
              <span className={styles.typeNote}>{option.note}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className="label" htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            className={styles.input}
            type="text"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errors.name ? (
            <span id="contact-name-error" className={styles.error}>
              {errors.name}
            </span>
          ) : null}
        </div>

        <div className={styles.field}>
          <label className="label" htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            className={styles.input}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          {errors.email ? (
            <span id="contact-email-error" className={styles.error}>
              {errors.email}
            </span>
          ) : null}
        </div>
      </div>

      <div className={styles.field}>
        <label className="label" htmlFor="contact-organisation">
          Organisation <span aria-hidden="true">— optional</span>
        </label>
        <input
          id="contact-organisation"
          name="organisation"
          className={styles.input}
          type="text"
          autoComplete="organization"
          placeholder="Practice, studio or institution"
        />
      </div>

      <div className={styles.field}>
        <label className="label" htmlFor="contact-message">
          What are you working on?
        </label>
        <textarea
          id="contact-message"
          name="message"
          className={styles.textarea}
          placeholder="Climate, typology, stage — and the question you are stuck on."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message ? (
          <span id="contact-message-error" className={styles.error}>
            {errors.message}
          </span>
        ) : null}
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.submit}>
          Compose message
          <span aria-hidden="true">&rarr;</span>
        </button>
        <p className={styles.note}>
          This opens your own email app with the message ready to send. Nothing
          is submitted to a server.
        </p>
      </div>

      {handedOff ? (
        <div className={styles.sent} role="status">
          <span className="label label--blue">Handed to your email app</span>
          <p className={styles.sentText}>
            If nothing opened, your browser may be blocking mail links. You can
            write to us directly at{" "}
            <a href={site.contact.emailHref}>{site.contact.email}</a>.
          </p>
        </div>
      ) : null}
    </form>
  );
}
