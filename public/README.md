# Assets Directory Structure

This directory contains all media assets for the Trion Creation website.

## Directory Structure

```
public/
├── logo/          # Logo variants (main, gradient, dark, minimal)
├── videos/        # Hero video animations
├── images/        # General images (20-30+ high-quality images)
└── hero/          # Hero banner images
```

## Logo Variants

Generate and place the following logo files:

- `logo/logo-main.png` - Main logo (PNG + SVG)
- `logo/logo-gradient.png` - Blue gradient version (corporate)
- `logo/logo-dark.png` - Dark mode variant
- `logo/logo-minimal.png` - Flat, minimal version

## Video Assets

Place hero video here:

- `videos/trion-hero.mp4` - Main hero video (MP4 format)
- `videos/trion-hero.webm` - WebM format for better browser support

**Video Requirements:**
- Auto-playing, muted, looping
- Related to: coding, dashboards, AI, cloud computing
- Display: code scrolling, UI animations, system dashboards, digital grids
- Fallback image provided for mobile devices

## Images

Place 20-30 high-quality images in the `images/` directory:

### Categories:
- Software development team
- Coding screens
- Office team
- Dashboard analytics
- Mobile app UI
- Cloud computing
- AI brain graphics
- Abstract tech backgrounds

### Requirements:
- Modern, clean, blue-themed images
- High resolution (min 1920x1080 for hero images)
- Optimized file sizes
- WebP format recommended for better performance

## Hero Images

Place hero banner images here:

- `hero/hero-software-team.jpg`
- `hero/hero-ai-dashboard.jpg`
- `hero/hero-coding.jpg`
- `hero/hero-mobile-app.jpg`
- `hero/hero-cloud.jpg`

## Usage

All assets should be referenced using relative paths from the root directory:

```html
<!-- Logo -->
<img src="public/logo/logo-main.png" alt="Trion Creation">

<!-- Video -->
<video src="public/videos/trion-hero.mp4"></video>

<!-- Images -->
<img src="public/images/team-photo.jpg" alt="Team">
```

## Image Sources

Recommended sources for royalty-free images:
- Unsplash
- Pexels
- Pixabay

