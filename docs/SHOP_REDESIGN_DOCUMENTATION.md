# Portfolio: Premium Shop Redesign

This document provides a technical and aesthetic overview of the redesign implemented in the Seyyal Shop.

## I. Project Vision
The objective was to transition from a generic store layout to a premium, boutique experience focusing on glassmorphism, symmetry, and immersive interaction.

---

## II. Key Architectural Changes

### 1. Floating Pill Appbar
- **Aesthetic**: Solid white background with glassmorphism blur (`backdrop-filter: blur(25px)`).
- **Branding**: "Seyyal" logo is centered on mobile and styled with premium golden tones.
- **Nav Logic**: High z-index (2000) allows page content to scroll seamlessly underneath.

### 2. Immersive Cart & Navigation
- **Screen-Height Fixed**: Cart and mobile menus are constrained to **100vh**, preventing them from stretching with the document height.
- **Layering**: Set to `z-index: 3000` to sit atop the floating appbar and main content.
- **Independent Scrolling**: Users can scroll through products or cart items without affecting the background page.

---

## III. Visual Showcase

### Interactive Experience
![Interaction Tour](file:///Users/VIJAYRAMESH/Desktop/NEWAPPLICATION/Billing/docs/assets/interaction_tour.webp)

### Desktop UI Components
````carousel
![Cart Drawer Open](file:///Users/VIJAYRAMESH/Desktop/NEWAPPLICATION/Billing/docs/assets/cart_drawer.png)
<!-- slide -->
![Floating Appbar Scrolled](file:///Users/VIJAYRAMESH/Desktop/NEWAPPLICATION/Billing/docs/assets/appbar_scrolled.png)
````

---

## IV. Technical Metadata
- **Modified Layout**: `frontend/src/layouts/ShopLayout.vue`
- **Styles**: Custom `.floating-capsule-appbar`, `.glass-dark`, and premium golden border tokens.
- **Deployment**: Live on [https://seyal-app.web.app](https://seyal-app.web.app)
