# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **static marketing/landing page website** for **RumiStar E.I.R.L.**, promoting the **iTrade 3.0** real estate management platform. It is a single-page application built with vanilla HTML, CSS, and JavaScript.

**Purpose**: Marketing site to showcase iTrade 3.0's features, pricing, and contact information for potential customers in the Latin American real estate market.

**Target Audience**: Real estate companies in Spanish-speaking Latin America looking for property management software.

## Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **CSS Framework**: Bootstrap 5.3.0 (via CDN)
- **Icons**: Font Awesome 6.4.0, Line Awesome 1.3.0
- **Animations**: AOS (Animate On Scroll) 2.3.1
- **Gallery**: GLightbox 3.2.0
- **Fonts**: Google Fonts (Open Sans, Rambla, Calligraffitti, Roboto Slab, Roboto)
- **Version Control**: Git
- **Hosting**: AWS S3 + CloudFront CDN

## Project Structure

```
webrumistarweb/
├── public/
│   ├── index.html              # Main landing page (~1031 lines)
│   └── assets/
│       ├── css/
│       │   └── styles.css      # Custom styles (~6KB)
│       ├── js/
│       │   └── scripts.js      # Custom JavaScript (~690 bytes)
│       └── img/                # Images and favicons
├── SYSTEM_BLUEPRINT.md         # Backend iTrade 3.0 documentation (for reference)
├── original_index_full.html    # Backup of previous version
└── .gitignore
```

## Key Architecture

### Single-Page Application (SPA)
The entire site is contained in `public/index.html` with smooth scrolling navigation between sections:

**Sections** (in order):
1. **Navigation** - Fixed navbar with links to all sections
2. **Hero/Header** (#home) - Main call-to-action
3. **About** (#about) - iTrade 3.0 introduction
4. **Features** (#features) - System capabilities
5. **Why Choose Us** (#why) - Value propositions
6. **Pricing** (#pricing) - Pricing tiers
7. **Gallery** (#gallery) - Screenshots/images
8. **Contact** (#contact) - Contact form and information
9. **Footer** - Social links, copyright

### External Dependencies (CDN)
All libraries are loaded via CDN - **no build process required**:
- Bootstrap 5.3.0 (CSS + JS bundle)
- Font Awesome 6.4.0
- Line Awesome 1.3.0
- AOS 2.3.1
- GLightbox 3.2.0
- Google Fonts

### Custom Code
- **styles.css**: Custom styling overrides and theme colors
- **scripts.js**: Minimal custom JavaScript (AOS initialization, smooth scroll)
- **Inline scripts**: GLightbox initialization in index.html:1022-1029

## Development Workflow

### Local Development
```bash
# No build step required - open directly in browser
open public/index.html

# Or use a local server (recommended for proper asset loading)
cd public
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Making Changes
1. Edit `public/index.html` for content changes
2. Edit `public/assets/css/styles.css` for styling
3. Edit `public/assets/js/scripts.js` for JavaScript functionality
4. Refresh browser to see changes (no build step)

### Git Workflow
```bash
# Check status
git status

# Stage changes
git add public/

# Commit
git commit -m "Description of changes"

# Current branch: main
# No remote configured in this snapshot
```

## AWS Deployment (S3 + CloudFront)

**CRITICAL**: This site is designed to be hosted on **AWS S3 + CloudFront** and must maintain 100% compatibility with this infrastructure.

### Deployment Architecture
```
Browser → CloudFront (CDN) → S3 Bucket (Origin)
```

### S3 Bucket Configuration Requirements

**Static Website Hosting**:
- Index document: `index.html`
- Error document: `index.html` (for SPA routing)
- All files in `public/` directory are uploaded to bucket root

**Bucket Structure**:
```
s3://your-bucket-name/
├── index.html
└── assets/
    ├── css/
    │   └── styles.css
    ├── js/
    │   └── scripts.js
    └── img/
        └── [images]
```

**Public Access**:
- Bucket policy must allow public read access for static website hosting
- OR CloudFront OAI (Origin Access Identity) for secure access

### CloudFront Configuration

**Distribution Settings**:
- Origin: S3 bucket static website endpoint
- Default root object: `index.html`
- Error pages: 404 → `/index.html` (200 response) for SPA support
- Compress objects: Enabled (gzip/brotli)
- Cache behavior: Cache based on headers/query strings as needed

**Cache Invalidation**:
```bash
# After deployment, invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Deployment Commands

**Sync to S3**:
```bash
# Navigate to project root
cd /path/to/webrumistarweb

# Sync public directory to S3 bucket
aws s3 sync public/ s3://your-bucket-name/ \
  --delete \
  --cache-control "public,max-age=31536000" \
  --exclude "index.html"

# Upload index.html separately with no-cache
aws s3 cp public/index.html s3://your-bucket-name/index.html \
  --cache-control "no-cache,no-store,must-revalidate"

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

**Deployment Script** (optional - create as `deploy.sh`):
```bash
#!/bin/bash
set -e

BUCKET_NAME="your-bucket-name"
DISTRIBUTION_ID="YOUR_DISTRIBUTION_ID"

echo "Syncing assets to S3..."
aws s3 sync public/ s3://$BUCKET_NAME/ \
  --delete \
  --cache-control "public,max-age=31536000" \
  --exclude "index.html"

echo "Uploading index.html..."
aws s3 cp public/index.html s3://$BUCKET_NAME/index.html \
  --cache-control "no-cache,no-store,must-revalidate"

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"

echo "Deployment complete!"
```

### Asset Path Requirements

**CRITICAL RULES for S3 + CloudFront compatibility**:

1. **All asset paths must be relative** (starting with `assets/`, NOT `/assets/`)
2. **NO absolute paths** from root (e.g., `/assets/css/styles.css`)
3. **NO server-side processing** (PHP, Node.js, etc.)
4. **All external dependencies via CDN** (Bootstrap, Font Awesome, etc.)

**Example - Correct Paths**:
```html
<!-- ✅ CORRECT - Relative paths work in S3 -->
<link rel="stylesheet" href="assets/css/styles.css">
<script src="assets/js/scripts.js"></script>
<img src="assets/img/logo.png" alt="Logo">
```

**Example - Incorrect Paths**:
```html
<!-- ❌ WRONG - Absolute paths may fail -->
<link rel="stylesheet" href="/assets/css/styles.css">
<script src="/assets/js/scripts.js"></script>
```

### Pre-Deployment Checklist

Before deploying to S3 + CloudFront:

- [ ] All asset paths are relative (no leading `/`)
- [ ] Test locally with `python3 -m http.server` from `public/` directory
- [ ] Verify all images load correctly
- [ ] Check all CSS and JS files are referenced correctly
- [ ] Ensure no server-side code or processing
- [ ] Optimize images (WebP, compressed JPG/PNG)
- [ ] Minify CSS/JS if needed (optional for performance)
- [ ] Test on multiple browsers and devices
- [ ] Verify all external CDN links are HTTPS

### Performance Optimization for CloudFront

**Cache Headers**:
- Static assets (CSS, JS, images): `max-age=31536000` (1 year)
- HTML files: `no-cache` or short TTL (forces CloudFront to check for updates)

**Image Optimization**:
- Use WebP format with JPG/PNG fallbacks
- Compress images before upload
- Consider lazy loading for below-fold images

**CDN Benefits**:
- Global distribution via CloudFront edge locations
- Automatic GZIP/Brotli compression
- HTTPS by default
- DDoS protection via AWS Shield

## Important Conventions

### Language
- **Spanish (es)**: All content is in Spanish for Latin American market
- Meta tags, titles, and content use "es" locale

### Brand Identity
- **Company**: RumiStar E.I.R.L.
- **Product**: iTrade 3.0
- **Logo**: `assets/img/logo-rumi-new.png`
- **Color Scheme**: Defined in styles.css using CSS custom properties (--primary, etc.)
- **Typography**: Multiple Google Fonts for different sections

### Contact Information
- **WhatsApp**: https://wa.link/rumistar
- **Facebook**: https://www.facebook.com/rumistar/
- **Email**: rumistareirl@gmail.com
- **Author**: Yerson Arce (meta tag in index.html:9)

## Reference Documentation

### SYSTEM_BLUEPRINT.md
This file contains comprehensive documentation of the **backend iTrade 3.0 platform** (Laravel/PHP application) that this website promotes. Key information:

- **Multi-tenant SaaS**: 171 active companies (273 total)
- **Tech Stack**: Laravel 12.44.0 + PHP 8.3.29 + MariaDB 11.4.5
- **AWS Infrastructure**: Elastic Beanstalk + RDS Multi-AZ
- **Core Business**: Real estate CRM, sales (CONTADO/CRÉDITO), inventory, financial reports
- **30 functional modules**, **55 specialized reports**, **358 routes**

**Note**: This blueprint is for the backend platform, not this marketing site. Reference it when updating feature descriptions or technical specifications on the landing page.

## Common Tasks

### Update Content
```bash
# Edit main landing page
# File: public/index.html
# Sections are clearly marked with HTML comments and IDs
```

### Update Styles
```bash
# Edit custom CSS
# File: public/assets/css/styles.css
# Bootstrap classes are used extensively; custom CSS overrides defaults
```

### Add Images
```bash
# Add to public/assets/img/
# Update references in index.html
# Optimize images before adding (web-optimized formats)
```

### Update Features/Pricing
- Features section: index.html (#features)
- Pricing section: index.html (#pricing)
- Cross-reference SYSTEM_BLUEPRINT.md for accurate technical details

## Browser Compatibility

The site uses modern web standards but maintains compatibility through Bootstrap 5:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design with Bootstrap grid system
- Mobile-first approach with viewport meta tag
- Fixed navbar with collapse menu for mobile

## Notes

- **No backend**: This is a static site - contact form likely needs backend integration (Lambda, API Gateway, or third-party service)
- **No build process**: Pure HTML/CSS/JS with CDN dependencies
- **Version control**: Git is configured, main branch is the primary branch
- **Backups**: Original versions preserved (original_index_full.html)
- **Assets**: All images, CSS, JS stored in public/assets/
- **Deployment target**: AWS S3 + CloudFront (100% static hosting compatibility required)
- **All paths must be relative**: Never use absolute paths starting with `/` for local assets
