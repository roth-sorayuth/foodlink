# Foodlink Design System Guidelines

Adhere strictly to this design system throughout the entire Foodlink application:

## Color Palette
- **Primary Color**: `#2E7D32` (Green)
  - Purpose: Primary action buttons, active states, savings badges, key accents.
- **Accent Color**: `#FF8A3D` (Orange)
  - Purpose: Urgency badges (e.g., "2 bags left", low stock), countdown timers, warning/attention alerts.
- **Background**: `#FAFAFA` (Off-white/light clean background)
- **Card Background**: `#FFF8F0` (Warm subtle tint for cards)
- **Text Color (Primary)**: `#1C1C1E` (High-contrast, dark readable text)
- **Secondary Text**: `#6E6E73` (Subtle muted gray for subtitles, secondary labels, metadata)

## Typography
- **Font Family**: `Inter`, system-ui, -apple-system, BlinkMacSystemFont, sans-serif (rounded, friendly)
- **Headings**: Bold `600` font weight (`font-semibold` / `font-bold`)

## Components & Geometry
- **Cards**:
  - `16px` rounded corners (`rounded-2xl` / `rounded-[16px]`)
  - Soft drop shadow (`shadow-sm` or custom subtle ambient shadow)
  - Background: `#FFF8F0`
- **Buttons**:
  - `12px` rounded corners (`rounded-xl` / `rounded-[12px]`)
  - Full-width where applicable / call to action
  - Fill: Primary green `#2E7D32` with white text
  - Active/hover state transitions with smooth micro-interactions
