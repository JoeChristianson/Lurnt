export const theme = {
  colors: {
    primary: "var(--erz-color-primary)",
    secondary: "var(--erz-color-secondary)",
    success: "var(--erz-color-success)",
    warning: "var(--erz-color-warning)",
    danger: "var(--erz-color-danger)",
    neutral: "var(--erz-color-neutral)",
    neutralBorder: "var(--erz-color-neutral-border)",
    // text
    textDark: "var(--erz-color-text-dark)",
    text: "var(--erz-color-text)",
    textMuted: "var(--erz-color-text-muted)",
    textLight: "var(--erz-color-text-light)",
    // surfaces
    white: "var(--erz-color-white)",
    background: "var(--erz-color-background)",
    cardBg: "var(--erz-color-card-bg)",
    panelBg: "var(--erz-color-panel-bg)",
    tooltipBg: "var(--erz-color-tooltip-bg)",
    // borders
    border: "var(--erz-color-border)",
    borderLight: "var(--erz-color-border-light)",
    // panel/depth-explorer specific
    panelText: "var(--erz-color-panel-text)",
    panelBorderLight: "var(--erz-color-panel-border-light)",
    panelBorderSubtle: "var(--erz-color-panel-border-subtle)",
    panelTextMuted: "var(--erz-color-panel-text-muted)",
    // selection
    selectedBg: "var(--erz-color-selected-bg)",
    selectedBorder: "var(--erz-color-selected-border)",
    // links
    link: "var(--erz-color-link)",
    linkHover: "var(--erz-color-link-hover)",
    // variant text colors (for on-color text)
    onPrimary: "var(--erz-color-on-primary)",
    onSecondary: "var(--erz-color-on-secondary)",
    onSuccess: "var(--erz-color-on-success)",
    onWarning: "var(--erz-color-on-warning)",
    onDanger: "var(--erz-color-on-danger)",
    onNeutral: "var(--erz-color-on-neutral)",
  },
  fonts: {
    body: "var(--erz-font-body)",
    content: "var(--erz-font-content)",
    mono: "var(--erz-font-mono)",
  },
  radii: {
    sm: "var(--erz-radius-sm)",
    md: "var(--erz-radius-md)",
  },
  shadows: {
    card: "var(--erz-shadow-card)",
  },
  breakpoints: {
    mobile: "768px",
  },
} as const;

export type Theme = typeof theme;

export const THEME_IDS = [
  "warm-literary",
  "ink-paper",
  "dark-moody",
  "earth-tones",
] as const;

export type ThemeId = (typeof THEME_IDS)[number];

export const THEME_NAMES: Record<ThemeId, string> = {
  "warm-literary": "Electric",
  "ink-paper": "Neon Noir",
  "dark-moody": "Midnight",
  "earth-tones": "Sunset",
};

export const DEFAULT_THEME: ThemeId = "warm-literary";
