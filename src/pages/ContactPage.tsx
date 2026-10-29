import React, { useRef, useState } from 'react';
import { portfolioData } from '../data/portfolioData';
import { RouteLink } from '../router/RouterContext';
import { useSite } from '../lib/site';
import { PAGE_ENTER_DELAY } from '../lib/motion';
import { DrawLine, Fade, MaskLines } from '../ui/Reveal';
import { Arrow, Ph } from '../ui/Bits';

const START = PAGE_ENTER_DELAY + 0.15;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Values {
  name: string;
  email: string;
  message: string;
}
type Errors = Partial<Record<keyof Values, string>>;
type Status = 'idle' | 'opened' | 'copied' | 'copy-failed';

function validate(v: Values): Errors {
  const errors: Errors = {};
  if (!v.name.trim()) errors.name = 'Please enter your name.';
  if (!EMAIL_RE.test(v.email.trim())) errors.email = 'Please enter a valid email address.';
  if (v.message.trim().length < 10) errors.message = 'Please write at least a sentence.';
  return errors;
}

export const ContactPage: React.FC = () => {
  const { settings, isEdited } = useSite();
  const { contact } = portfolioData;
  const [values, setValues] = useState<Values>({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [emailCopied, setEmailCopied] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const draft = () => {
    const subject = `Message from ${values.name.trim()}`;
    const body = `${values.message.trim()}\n\n${values.name.trim()}\n${values.email.trim()}`;
    return { subject, body };
  };

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    setStatus('idle');
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as Array<keyof Values>)[0];
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    // There is no server: hand the message to the visitor's own email app.
    const { subject, body } = draft();
    window.location.href = `mailto:${settings.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('opened');
  };

  const copy = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  };

  const copyMessage = async () => {
    const { subject, body } = draft();
    setStatus((await copy(`To: ${settings.email}\nSubject: ${subject}\n\n${body}`)) ? 'copied' : 'copy-failed');
  };

  const copyEmail = async () => {
    if (await copy(settings.email)) {
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 2000);
    }
  };

  return (
    <div className="page page--contact">
      <div className="wrap contact">
        <header className="contact__head">
          <MaskLines as="h1" lines={contact.headingLines} className="contact-title" delay={START} />
          <DrawLine delay={START + 0.5} inView={false} length={1.4} />
        </header>

        <div className="contact__grid">
          <div className="contact__left">
            <Fade delay={START + 0.7}>
              <p className="contact__intro">{contact.invitation}</p>
            </Fade>

            <Fade delay={START + 0.85} className="contact__email-row">
              <a className="contact__email link-line" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
              <button type="button" className="chip" onClick={copyEmail}>
                {emailCopied ? 'Copied' : 'Copy'}
              </button>
              <span className="sr-only" role="status">
                {emailCopied ? 'Email address copied' : ''}
              </span>
            </Fade>

            <Fade delay={START + 1.0} as="ul" className="contact__list">
              <li>
                <span>Location</span>
                <Ph field={{ value: settings.location, placeholder: !isEdited('location') }} />
              </li>
              <li>
                <span>Availability</span>
                <Ph field={{ value: settings.availability, placeholder: !isEdited('availability') }} />
              </li>
            </Fade>

            <Fade delay={START + 1.1} as="ul" className="contact__socials" aria-label="Elsewhere">
              {contact.socials.map((s) => (
                <li key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="social">
                    <span>{s.label}</span>
                    <span className="social__handle">
                      <Ph field={s.handle} />
                    </span>
                    <Arrow />
                  </a>
                </li>
              ))}
            </Fade>
          </div>

          <Fade delay={START + 0.95} className="contact__right">
            <form ref={formRef} className="form" onSubmit={onSubmit} noValidate>
              {(
                [
                  ['name', 'Your name', 'text', 'name'],
                  ['email', 'Your email', 'email', 'email']
                ] as const
              ).map(([key, label, type, auto]) => (
                <div className="field" key={key}>
                  <label htmlFor={`c-${key}`}>{label}</label>
                  <input
                    id={`c-${key}`}
                    name={key}
                    type={type}
                    autoComplete={auto}
                    value={values[key]}
                    onChange={set(key)}
                    aria-invalid={Boolean(errors[key])}
                    aria-describedby={errors[key] ? `c-${key}-err` : undefined}
                  />
                  {errors[key] && (
                    <p id={`c-${key}-err`} className="field__error">
                      {errors[key]}
                    </p>
                  )}
                </div>
              ))}
              <div className="field">
                <label htmlFor="c-message">Message</label>
                <textarea
                  id="c-message"
                  name="message"
                  rows={5}
                  value={values.message}
                  onChange={set('message')}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'c-message-err' : undefined}
                />
                {errors.message && (
                  <p id="c-message-err" className="field__error">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="form__actions">
                <button type="submit" className="btn">
                  <span>Open in my email app</span>
                  <Arrow direction="right" />
                </button>
                <button type="button" className="btn btn--ghost" onClick={copyMessage}>
                  Copy message
                </button>
              </div>

              <p className="form__status" role="status">
                {status === 'opened' &&
                  `Your email app should now open with the message ready. Nothing has been sent yet. If nothing opened, use “Copy message” and send it to ${settings.email}.`}
                {status === 'copied' && `Message copied. Paste it into an email to ${settings.email}.`}
                {status === 'copy-failed' &&
                  `Your browser blocked copying. Please write to ${settings.email} directly.`}
              </p>
            </form>
          </Fade>
        </div>

        <Fade inView className="contact__end">
          <RouteLink to="/" className="link-line">
            <Arrow direction="left" />
            <span>Back to the index</span>
          </RouteLink>
          <RouteLink to="/projects" className="link-line">
            <span>Selected work</span>
            <Arrow />
          </RouteLink>
        </Fade>
      </div>
    </div>
  );
};
