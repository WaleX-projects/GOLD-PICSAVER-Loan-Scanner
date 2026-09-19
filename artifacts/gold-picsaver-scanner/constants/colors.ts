/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#1f1d1a',
    tint: '#b9852d',

    // Core surfaces
    background: '#f7f4ee',
    foreground: '#1f1d1a',

    // Cards / elevated surfaces
    card: '#fffdf9',
    cardForeground: '#1f1d1a',

    // Primary action color (buttons, links, active states)
    primary: '#b9852d',
    primaryForeground: '#ffffff',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#eee7da',
    secondaryForeground: '#4d453a',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#eee9df',
    mutedForeground: '#756d61',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#f8ecd0',
    accentForeground: '#73521b',

    // Destructive actions (delete, error states)
    destructive: '#bc4e42',
    destructiveForeground: '#ffffff',

    // Borders and input outlines
    border: '#e3dbce',
    input: '#d9cfbf',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 8,
};

export default colors;
