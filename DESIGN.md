# DezDownload Design System (DESIGN.md)

This file defines the design language, components, layout rules, and branding constraints for the **DezDownload** web application, designed by **DezReacher**.

---

## Brand Philosophy
DezDownload is an educational utility. It should feel like a premium, high-end dashboard. The aesthetic is inspired by the spatial layout of `nuraform.com` combined with a dark, high-contrast "Premium Chess" theme.

---

## Design Tokens

### Color Palette (Monochromatic Chess)
*   `bg-main`: `#050505` (Deep space black)
*   `bg-surface`: `#0a0a0a` (Vespers container background)
*   `bg-card`: `#111111` (Inner card / content panels)
*   `border-default`: `rgba(255, 255, 255, 0.08)` (Thin glassmorphic borders)
*   `text-primary`: `#fafafa` (High-contrast pure headings and labels)
*   `text-secondary`: `#a1a1aa` (Cool metallic gray body copy)
*   `text-tertiary`: `#52525b` (Subtle metadata, helper text)
*   `glow-subtle`: `rgba(255, 255, 255, 0.05)` (Interactive highlights)

### Typography
*   **Font Family**: `Inter`, sans-serif
*   **Headline Font**: Large, clean, tracking-tight (e.g., `text-5xl md:text-7xl font-extrabold tracking-tight`)
*   **Mono Space**: `JetBrains Mono` or default monospace for payloads and code snippets

### Border Radii
*   **Large Panels / Main Input**: `rounded-full` (for pills) or `rounded-[32px]` (2rem)
*   **Cards**: `rounded-2xl` (1.5rem)
*   **Small Elements (Badges, Inner buttons)**: `rounded-xl` or `rounded-full`

---

## Spatial Layout & Component Specifications

### 1. Navigation (iOS-Style Floating Pill)
*   **Position**: Fixed top/bottom floating element.
*   **Visual**: Glassmorphic blur (`backdrop-blur-xl bg-black/40 border border-white/10 rounded-full`).
*   **Structure**: Clean row container centering the branding logo and essential links.

### 2. Main Hero Section
*   **Headline**: Ultra-large typography centered on page.
*   **Description**: Metallic gray font, max-width container, clear spacing.
*   **Pill Input**:
    *   Outer: `rounded-full`, inner padding, border, glass background.
    *   Inner: Minimalist URL field with clean hover/focus indicators (white outline transitions, glow drop-shadow).
    *   Action: Rounded button inside the input card or perfectly aligned as a matching pill.

### 3. Glassmorphism & Shadow Glows
*   No neon glows. Use standard drop-shadow or box-shadow with high blur values and white/gray transparencies.
*   Example utility: `shadow-[0_0_50px_rgba(255,255,255,0.02)]`.
*   Hover states should feature smooth transitions (`transition-all duration-300`).
