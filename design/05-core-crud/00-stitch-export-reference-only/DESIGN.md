---
name: Intelligent Talent System
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#4b41e1'
  on-secondary: '#ffffff'
  secondary-container: '#645efb'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0b1c30'
  on-tertiary-container: '#75859d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#e2dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#0f0069'
  on-secondary-fixed-variant: '#3323cc'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  code-id:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  container-max: 1440px
  gutter: 24px
---

## Brand & Style
The design system is built on a foundation of **Modern Corporate** aesthetics, prioritizing clarity and efficiency for high-stakes talent acquisition. The brand personality is "The Expert Partner"—intelligent, composed, and unerringly reliable. 

The visual style utilizes a high-information density layout that remains breathable through purposeful whitespace and a rigid geometric structure. It blends elements of **Minimalism** to reduce cognitive load during complex recruiting workflows with **Tonal Layering** to define workspace hierarchy. The emotional response is one of "Informed Confidence," ensuring recruiters feel in control of data-rich environments.

## Colors
The palette is anchored by a deep Navy (`#0F172A`) to establish authority and trust. The primary action color is a vibrant Indigo (`#4F46E5`), used strategically to draw attention to "AI-powered" features and primary conversion points. 

Secondary text and iconography utilize Slate (`#64748B`) to maintain high legibility without the harshness of pure black. Backgrounds should remain crisp white or the lightest neutral tint to ensure a high-contrast environment. Semantic colors are reserved strictly for status communication: Green for successful hires, Amber for pending reviews, and Red for rejected applications.

## Typography
This design system employs **Inter** for all primary interfaces to ensure maximum legibility across dense data tables and candidate profiles. Headlines use tight tracking and semi-bold weights to create a commanding presence. 

A secondary monospaced font, **Geist**, is used specifically for technical metadata, candidate IDs, and system logs to differentiate machine-generated data from human-centric content. Maintain a 1.5x line height for body text to preserve readability during long-form resume reviews.

## Layout & Spacing
The system follows a strict **8px grid** rhythm. Layouts utilize a 12-column fluid grid for desktop views with a fixed maximum container width of 1440px to prevent excessive line lengths. 

- **Desktop:** 24px side margins, 24px gutters.
- **Tablet:** 16px side margins, 16px gutters.
- **Mobile:** 16px side margins, 12px gutters.

Space is used as a functional grouping tool: tight spacing (8px) for related input fields, and generous spacing (32px+) between major content sections. Large dashboard views should prioritize a "contained" layout where cards stretch to fill the grid but maintain consistent internal padding.

## Elevation & Depth
Depth is signaled through **Tonal Layers** and **Ambient Shadows**. 
1. **Level 0 (Base):** Neutral background (`#F8FAFC`).
2. **Level 1 (Cards/Surface):** White background with a subtle 1px border (`#E2E8F0`).
3. **Level 2 (Hover/Active):** White background with an ambient shadow (0px 4px 6px -1px rgba(15, 23, 42, 0.05)).
4. **Level 3 (Overlays/Modals):** High-diffused shadow (0px 20px 25px -5px rgba(15, 23, 42, 0.1)).

Shadows must never look "dirty"; they use a Navy-tinted hex instead of pure black to maintain the professional brand tone.

## Shapes
The design system uses a **Rounded** (Level 2) corner language to soften the industrial feel of a data-heavy SaaS tool.
- Standard buttons and input fields: `0.5rem` (8px).
- Cards and larger containers: `1rem` (16px).
- Status badges and profile avatars: `100%` (Fully circular).

This consistency in curvature creates a rhythmic visual flow that feels modern and approachable while remaining structured.

## Components
- **Buttons:** Primary buttons use the Indigo background with white text. Secondary buttons use a Navy outline or Ghost style. Hover states involve a slight darkening of the background and an increased shadow.
- **Data Tables:** These are the heart of the system. Use 16px vertical padding for rows. Header cells use `label-caps` in Slate. Implement a subtle Slate-50 background tint on row hover.
- **Cards:** Cards are white with a 1px border. On the dashboard, cards should have a fixed padding of `24px` to ensure data doesn't feel cramped.
- **Input Fields:** Use a 1px border (`#E2E8F0`). On focus, the border transitions to Indigo with a soft 3px outer glow in the same color (20% opacity).
- **Status Badges:** Use a "Pill" shape with a low-opacity background of the semantic color and high-contrast text (e.g., Light Green bg with Dark Green text).
- **AI Insights:** Any component powered by AI (like candidate matching scores) should feature a subtle Indigo gradient border or a small "sparkle" icon to denote intelligence.