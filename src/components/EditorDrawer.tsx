import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, X } from 'lucide-react';
import { useSite, type SiteSettings, type ThemeMode } from '../lib/site';
import { useReduced } from '../lib/hooks';
import { duration, ease } from '../lib/motion';

const FIELDS: Array<{ key: keyof SiteSettings; label: string; multiline?: boolean; type?: string }> = [
  { key: 'name', label: 'Name' },
  { key: 'statement', label: 'Headline' },
  { key: 'intro', label: 'Introduction', multiline: true },
  { key: 'aboutLead', label: 'About, opening paragraph', multiline: true },
  { key: 'location', label: 'Location' },
  { key: 'availability', label: 'Availability' },
  { key: 'email', label: 'Email', type: 'email' }
];

const MODES: Array<{ id: ThemeMode; label: string }> = [
  { id: 'auto', label: 'By page' },
  { id: 'ivory', label: 'Ivory' },
  { id: 'charcoal', label: 'Charcoal' }
];

/** Try new copy and surfaces live. Changes are kept in this browser only. */
export const EditorDrawer: React.FC = () => {
  const { settings, update, reset, themeMode, setThemeMode, editorOpen, setEditorOpen } = useSite();
  const reduced = useReduced();
  const panelRef = useRef<HTMLElement>(null);
  const openerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!editorOpen) return;
    openerRef.current = document.activeElement;
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>('input, textarea, button')?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEditorOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const items = Array.from(
        panel.querySelectorAll<HTMLElement>('input, textarea, button:not([disabled])')
      );
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      (openerRef.current as HTMLElement | null)?.focus?.();
    };
  }, [editorOpen, setEditorOpen]);

  return (
    <AnimatePresence>
      {editorOpen && (
        <motion.div
          className="editor-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: duration.ui, ease: ease.out }}
          onClick={() => setEditorOpen(false)}
        >
          <motion.aside
            ref={panelRef}
            className="editor"
            role="dialog"
            aria-modal="true"
            aria-labelledby="editor-title"
            initial={reduced ? { opacity: 0 } : { x: '100%' }}
            animate={reduced ? { opacity: 1 } : { x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: '100%' }}
            transition={{ duration: duration.ui + 0.2, ease: ease.out }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="editor__head">
              <h2 id="editor-title">Edit placeholders</h2>
              <button
                type="button"
                className="tool"
                onClick={() => setEditorOpen(false)}
                aria-label="Close editor"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>
            <p className="editor__note">
              Try your own wording here. Changes stay in this browser. To make them permanent, edit{' '}
              <code>src/data/portfolioData.ts</code>.
            </p>

            <div className="editor__fields">
              <fieldset className="editor__modes">
                <legend>Surface</legend>
                {MODES.map((mode) => (
                  <label key={mode.id} className={themeMode === mode.id ? 'is-on' : ''}>
                    <input
                      type="radio"
                      name="theme-mode"
                      checked={themeMode === mode.id}
                      onChange={() => setThemeMode(mode.id)}
                    />
                    <span>{mode.label}</span>
                  </label>
                ))}
              </fieldset>

              {FIELDS.map((field) => (
                <div key={field.key} className="field">
                  <label htmlFor={`edit-${field.key}`}>{field.label}</label>
                  {field.multiline ? (
                    <textarea
                      id={`edit-${field.key}`}
                      rows={4}
                      value={settings[field.key]}
                      onChange={(e) => update({ [field.key]: e.target.value })}
                    />
                  ) : (
                    <input
                      id={`edit-${field.key}`}
                      type={field.type ?? 'text'}
                      value={settings[field.key]}
                      onChange={(e) => update({ [field.key]: e.target.value })}
                    />
                  )}
                </div>
              ))}
            </div>

            <button type="button" className="btn btn--ghost editor__reset" onClick={reset}>
              <RotateCcw size={14} strokeWidth={1.5} />
              <span>Restore defaults</span>
            </button>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
