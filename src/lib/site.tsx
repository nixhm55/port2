import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { portfolioData, type Theme } from '../data/portfolioData';

export interface SiteSettings {
  name: string;
  statement: string;
  intro: string;
  location: string;
  availability: string;
  email: string;
  aboutLead: string;
}

export type ThemeMode = 'auto' | Theme;

const STORAGE_KEY = 'yasmi:site:v2';

export const DEFAULT_SETTINGS: SiteSettings = {
  name: portfolioData.identity.name,
  statement: portfolioData.identity.statement,
  intro: portfolioData.identity.intro,
  location: portfolioData.identity.location.value,
  availability: portfolioData.identity.availability.value,
  email: portfolioData.identity.email,
  aboutLead: portfolioData.about.lead
};

interface Stored {
  settings?: Partial<SiteSettings>;
  themeMode?: ThemeMode;
}

function readStored(): Stored {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Stored) : {};
  } catch {
    return {};
  }
}

interface SiteContextValue {
  settings: SiteSettings;
  /** True when a value differs from the shipped placeholder. */
  isEdited: (key: keyof SiteSettings) => boolean;
  update: (patch: Partial<SiteSettings>) => void;
  reset: () => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  editorOpen: boolean;
  setEditorOpen: (open: boolean) => void;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => ({
    ...DEFAULT_SETTINGS,
    ...readStored().settings
  }));
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => readStored().themeMode ?? 'auto');
  const [editorOpen, setEditorOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ settings, themeMode }));
    } catch {
      /* Storage can be unavailable (private mode); the site still works. */
    }
  }, [settings, themeMode]);

  const update = useCallback((patch: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setThemeMode('auto');
  }, []);

  const isEdited = useCallback(
    (key: keyof SiteSettings) => settings[key] !== DEFAULT_SETTINGS[key],
    [settings]
  );

  const value = useMemo(
    () => ({ settings, isEdited, update, reset, themeMode, setThemeMode, editorOpen, setEditorOpen }),
    [settings, isEdited, update, reset, themeMode, editorOpen]
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside SiteProvider');
  return ctx;
}
