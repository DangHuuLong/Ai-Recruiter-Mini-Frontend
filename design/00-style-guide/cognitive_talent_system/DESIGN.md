---
name: Cognitive Talent System
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#454652'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#757683'
  outline-variant: '#c5c5d4'
  surface-tint: '#4157b6'
  primary: '#102b8c'
  on-primary: '#ffffff'
  primary-container: '#2e44a3'
  on-primary-container: '#adbaff'
  inverse-primary: '#b9c3ff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#5d2600'
  on-tertiary: '#ffffff'
  tertiary-container: '#813700'
  on-tertiary-container: '#ffaa7b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b9c3ff'
  on-primary-fixed: '#001257'
  on-primary-fixed-variant: '#273d9d'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#ffdbca'
  tertiary-fixed-dim: '#ffb68f'
  on-tertiary-fixed: '#331200'
  on-tertiary-fixed-variant: '#773200'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-margin: 24px
  gutter: 16px
  cell-padding-v: 12px
  cell-padding-h: 16px
---

## Brand & Style
The design system is engineered for high-stakes B2B recruitment environments where precision and clarity are paramount. The brand personality is rooted in "Augmented Intelligence"—it does not replace the recruiter but empowers them with calm, focused, and organized data. 

The aesthetic follows a **Modern Corporate** direction with a focus on **High Information Density**. It prioritizes utility and legibility over decorative flourishes. The interface uses a clean, structured layout that minimizes cognitive load during complex tasks like candidate scoring and pipeline management. The emotional response is one of controlled efficiency, reliability, and technical sophistication.

## Colors
The palette is dominated by **Deep Indigo** as the primary driver for actions and brand presence, signaling intelligence and stability. A **Sophisticated Teal** is used for secondary accents or specific AI-driven insights to differentiate human actions from automated suggestions.

A meticulous range of Slate Neutrals provides the framework for borders and background layering. Semantic colors are reserved strictly for status communication:
- **Primary (Indigo):** Global actions, navigation, and focus states.
- **Success (Emerald):** Completed processes, high-match scores.
- **Warning/Pending (Amber):** Items requiring attention or currently in the parsing stage.
- **Error (Crimson):** System failures or critical data gaps.
- **Neutral (Slate):** Inactive states, metadata, and secondary structural lines.

## Typography
This design system utilizes **Inter** for its exceptional legibility in data-heavy interfaces. The typographic scale is compact to support high information density without sacrificing hierarchy. 

- **Headlines:** Use Semi-Bold weight with slight negative letter-spacing for a modern, "tight" executive look.
- **Body:** The default text is 14px (`body-md`) to allow for more content on screen. Use 16px only for long-form reading or primary descriptions.
- **Labels:** Status badges and table headers use `label-caps` (All-Caps) to distinguish them from interactive content.
- **Technical Data:** **JetBrains Mono** is employed for ID strings, specific AI confidence scores, or raw data parsing views to provide a subtle "technical" feel.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a 12-column structure for dashboard views and a centered fixed-width (1200px) for settings or profile pages.

- **Grid:** 16px gutters provide sufficient breathing room while maintaining density.
- **Data Tables:** These are the core of the system. They use a "Comfortable Density" with 12px vertical padding on rows to ensure clear scanning.
- **Responsive Behavior:** 
  - **Desktop:** Full 12-column utility.
  - **Tablet:** Sidebars collapse into icons; 8-column grid.
  - **Mobile:** Stacking behavior for cards; 4-column grid with 16px margins.

## Elevation & Depth
Depth is created primarily through **Tonal Layering** and **Low-Contrast Outlines** rather than heavy shadows. This maintains a clean, flat aesthetic that feels like a modern SaaS tool.

- **Level 0 (Background):** #F8FAFC (Slate 50). The foundation.
- **Level 1 (Cards/Surface):** #FFFFFF. White containers with a 1px border in Slate 200.
- **Level 2 (Dropdowns/Modals):** White with a soft, ambient shadow: `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)`.
- **Focus States:** 2px ring using the primary indigo color with 20% opacity.

## Shapes
The design system uses a consistent **8px (0.5rem)** base radius for all standard UI components like inputs, buttons, and cards. This provides a professional yet approachable feel.

- **Large Components (Cards/Modals):** 12px (0.75rem) to create a softer container effect.
- **Small Components (Pills/Badges):** Fully rounded (Pill-shaped) for status indicators and skill matches to distinguish them from clickable buttons.

## Components

### Buttons
- **Primary:** Solid Indigo background, white text. No gradient.
- **Secondary:** White background, Indigo border (1px), Indigo text.
- **Destructive:** Clear Crimson text with a Crimson border on hover; only solid Crimson for final confirmation.

### Status Badges & Skill Match Pills
Status indicators use a subtle tinted background (10% opacity of the semantic color) with high-contrast text.
- **PENDING/PARSING:** Amber/Blue tint.
- **COMPLETED:** Emerald tint.
- **FAILED:** Crimson tint.
- **Skill Match:** `MATCHED` (Solid Teal), `MISSING` (Light Slate tint), `RELATED` (Teal border, no fill).

### Form Inputs & Selects
- 36px height for standard density.
- 1px Slate 300 border, transitioning to Primary Indigo on focus.
- Labels are 12px Semi-bold, positioned 4px above the input field.

### Role Badges
- Used for internal team identification.
- **ADMIN:** Deep Slate.
- **RECRUITER:** Indigo.
- **HIRING_MANAGER:** Teal.
- **DEV:** JetBrains Mono font, light gray background.

### Data Tables
- Row hover state: #F1F5F9 (Slate 100).
- Checkboxes in the first column for bulk actions.
- Right-aligned "Action" column with ghost buttons (icon-only).