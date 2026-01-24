# LACTIVAE™ Website Specification
## Pharmaceutical-Style Portfolio Website

---

# PROJECT OVERVIEW

**Project Name**: LACTIVAE™ Marketing Website  
**Type**: Pharmaceutical-style marketing website (portfolio project)  
**Purpose**: Present raw milk research data in a professional, pharma-inspired format with user authentication, email marketing integration, and AI-powered assistance.

---

# TECH STACK

## Core Framework
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Backend Services
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Magic Link sign-in
- **Email**: Resend API for transactional and marketing emails

## Key Libraries
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation

---

# AUTHENTICATION SYSTEM

## Magic Link Sign-In Flow
1. User enters email address on sign-in page
2. System sends magic link via Resend
3. User clicks link in email
4. Supabase validates token and creates session
5. User redirected to profile or previous page

## Supabase Auth Configuration
```typescript
// Required Supabase Auth settings
{
  providers: ['email'], // Magic link only, no password
  emailRedirectTo: `${SITE_URL}/auth/callback`,
  emailTemplate: 'magic_link' // Custom template via Resend
}
```

## Protected Routes
- `/profile` - User profile and preferences
- `/profile/emails` - Marketing email history

---

# DATABASE SCHEMA (Supabase)

## Tables

### users (extends Supabase auth.users)
```sql
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### user_preferences
```sql
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  email_marketing BOOLEAN DEFAULT true,
  email_updates BOOLEAN DEFAULT true,
  email_research BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

### marketing_emails
```sql
CREATE TABLE public.marketing_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  campaign_id TEXT NOT NULL,
  subject TEXT NOT NULL,
  preview_text TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ
);
```

### Row Level Security
- Users can only read/update their own data
- Service role key used for email sending operations

---

# USER PROFILE FEATURES

## Profile Page (`/profile`)

### Display Sections
1. **Account Information**
   - Display Name (editable)
   - Email Address (read-only, from auth)
   - Member Since date

2. **Email Preferences**
   - Toggle: Marketing emails (product updates, promotions)
   - Toggle: Newsletter updates (research news, blog posts)
   - Toggle: Research alerts (new study publications)

3. **Email History Library**
   - Table/list of received marketing emails
   - Columns: Date Sent | Subject Line | Status (Opened/Unopened)
   - Click to view email content (if stored)
   - Pagination for large lists

### Profile UI Requirements
- Clean, minimal design
- Instant save on preference toggle (optimistic updates)
- Toast notifications for save confirmation
- Loading states for async operations

---

# ISI (IMPORTANT SAFETY INFORMATION) COMPONENT

## Behavior Specification

### Collapsed State (Default)
- Fixed to bottom of viewport
- Height: ~64px (showing peek content)
- Displays: "⚠️ Important Safety Information" + expand button
- Always visible on all pages
- Does not overlap main content (content has bottom padding)

### Expanded State
- Triggered by clicking expand button or header area
- Expands upward from bottom
- **Max height: 80vh** (80% of viewport height)
- If ISI content < 80vh: show full content
- If ISI content > 80vh: show 80vh with internal scroll
- Smooth animation (300ms ease-out)
- Semi-transparent backdrop overlay on page content
- Close button (X) in top-right of expanded panel
- Click outside to collapse
- Escape key to collapse

### ISI Content Structure
```
┌─────────────────────────────────────────┐
│ ⚠️ IMPORTANT SAFETY INFORMATION    [X] │
├─────────────────────────────────────────┤
│                                         │
│ WHO SHOULD NOT CONSUME LACTIVAE™        │
│ • Infants under 12 months               │
│ • Pregnant women                        │
│ • Immunocompromised individuals         │
│ • [etc...]                              │
│                                         │
│ POTENTIAL RISKS                         │
│ Raw milk may contain harmful bacteria...│
│                                         │
│ [Additional sections...]                │
│                                         │
│ See Full Prescribing Information →      │
└─────────────────────────────────────────┘
```

### Technical Implementation
- Use CSS `position: fixed; bottom: 0`
- Framer Motion for expand/collapse animation
- Portal for backdrop overlay
- Trap focus when expanded (a11y)
- Store "has viewed" state in localStorage

---

# AI CHATBOT COMPONENT

## Design Inspiration
- **Reference**: Claude Code sidebar in VS Code
- Full-height chat interface when expanded
- Conversational UI with message bubbles

## Collapsed State
- Floating action button in bottom-right corner
- Position: `bottom: 80px; right: 16px` (above ISI)
- Icon: Chat bubble or bot icon
- Subtle pulse animation to draw attention (optional)

## Expanded State
- **Desktop**: Slide-out panel from right side
  - Width: 400px
  - Height: 100vh (full height)
  - Overlays page content with backdrop
- **Mobile**: Full-screen modal
  - 100vw × 100vh

## Chat Interface Layout
```
┌─────────────────────────────────┐
│ LACTIVAE™ Assistant        [−] │ ← Header with minimize
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐   │
│  │ Welcome! I can answer   │   │ ← Bot message
│  │ questions about raw     │   │
│  │ milk, safety info...    │   │
│  └─────────────────────────┘   │
│                                 │
│       ┌─────────────────────┐  │
│       │ What are the        │  │ ← User message
│       │ benefits of raw     │  │
│       │ milk?               │  │
│       └─────────────────────┘  │
│                                 │
│  ┌─────────────────────────┐   │
│  │ Research shows several  │   │ ← Bot response
│  │ potential benefits...   │   │
│  │ [typing indicator]      │   │
│  └─────────────────────────┘   │
│                                 │
├─────────────────────────────────┤
│ ┌─────────────────────────┐ [→]│ ← Input area
│ │ Type your message...    │    │
│ └─────────────────────────┘    │
└─────────────────────────────────┘
```

## Bot Training/Context
The AI assistant should be trained on ALL site content including:
- Full research document content (studies, statistics, citations)
- ISI/Safety information
- FAQ content
- Prescribing information
- Medical guide content

## Suggested Implementation
- **Option 1**: Claude API with system prompt containing site content
- **Option 2**: RAG system with Supabase pgvector for content retrieval
- **Option 3**: Simple FAQ matching for MVP, upgrade later

## Chat API Endpoint
```typescript
// POST /api/chat
{
  message: string;
  history: ChatMessage[];
}

// Response
{
  message: string;
  sources?: string[]; // Optional citation references
}
```

---

# PAGE STRUCTURE

## Public Pages

### Homepage (`/`)
- Hero section with video background (milk flowing)
- Key statistics from research
- Value proposition
- CTA to learn more / sign up
- Brief safety callout with link to full ISI

### About LACTIVAE™ (`/about`)
- How it works (Mechanism of Action)
- Clinical evidence summary
- Nutritional profile
- Comparison data

### Safety (`/safety`)
- Comprehensive safety information
- Who should/shouldn't consume
- Risk factors
- When to seek medical attention

### For Patients (`/patients`)
- Getting started guide
- Lifestyle integration tips
- Finding quality raw milk
- FAQ section

### For Healthcare Providers (`/providers`)
- Clinical overview
- Discussing raw milk with patients
- Resources and references

### Full Prescribing Information (`/prescribing-information`)
- Complete clinical data
- Mechanism of action (detailed)
- Clinical studies (detailed)
- Safety data
- Citations and references
- PDF download option

### Medical Guide (`/medical-guide`)
- Healthcare provider focused
- Clinical decision support
- Patient counseling points
- Risk-benefit discussion framework

### Clinical Studies (`/studies`)
- List/grid of referenced studies
- Filter by topic (allergy, respiratory, nutrition, etc.)
- Link to PubMed/source for each

### Resources (`/resources`)
- Downloadable materials
- Educational content
- Videos (if any)

### Find LACTIVAE™ (`/find`)
- Raw milk locator/finder
- Links to RAWMI listed farms
- State-by-state legality map
- Quality checklist

### Savings Program (`/savings`)
- Discount program information
- Partner farm listings
- How to participate

### FAQs (`/faqs`)
- Accordion-style FAQ
- Categories: Safety, Nutrition, Sourcing, General

## Legal Pages

### Terms of Use (`/terms`)
- Standard terms
- Disclaimer about portfolio project nature

### Privacy Notice (`/privacy`)
- Data collection practices
- Cookie usage
- Third-party services

### Health Data Privacy Notice (`/health-data-privacy`)
- HIPAA-style notice (even if not required)
- How health-related data is handled
- User rights

### Cookie Policy (`/cookies`)
- Cookie types used
- How to manage preferences

### Contact Us (`/contact`)
- Contact form
- Email addresses for different inquiries
- Response time expectations

## Authenticated Pages

### Sign In (`/auth/signin`)
- Email input for magic link
- "Check your email" confirmation state

### Auth Callback (`/auth/callback`)
- Handles magic link verification
- Redirects to profile or home

### Profile (`/profile`)
- User information
- Email preferences
- Email history

---

# ACCESSIBILITY WIDGET

## Position
- Fixed position, top-right corner
- Collapsible panel

## Features

### 1. Theme Toggle
- Light mode (default)
- Dark mode
- System preference option

### 2. Font Size
- Small (90%)
- Default (100%)
- Large (115%)
- Extra Large (130%)

### 3. Line Spacing
- Default (1.6)
- Relaxed (1.8)
- Loose (2.0)

### 4. Letter Spacing (Optional)
- Default
- Wide

## Implementation
- Store preferences in localStorage
- Apply via CSS custom properties
- Respect `prefers-reduced-motion`
- Respect `prefers-color-scheme` for system theme

## Widget UI
```
┌──────────────────────┐
│ ⚙️ Accessibility  [X]│
├──────────────────────┤
│ Theme                │
│ [☀️] [🌙] [💻]       │
│                      │
│ Font Size            │
│ [A-] [A] [A+] [A++]  │
│                      │
│ Line Spacing         │
│ [1x] [1.25x] [1.5x]  │
│                      │
│ [Reset to Defaults]  │
└──────────────────────┘
```

---

# ACCESSIBILITY REQUIREMENTS

## WCAG 2.1 AA Compliance

### Color Contrast
- Text: minimum 4.5:1 ratio
- Large text: minimum 3:1 ratio
- Interactive elements: clearly distinguishable

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order
- Visible focus indicators
- Skip to main content link

### Screen Reader Support
- Semantic HTML structure
- ARIA labels where needed
- Alt text for images
- Form labels and error messages

### Motion/Animation
- Respect `prefers-reduced-motion`
- No auto-playing videos with motion (or provide pause)
- Subtle animations only

### Touch Targets
- Minimum 44×44px touch targets
- Adequate spacing between interactive elements

---

# COLOR PALETTE

## Primary Colors

### Light Mode
```css
:root {
  /* Backgrounds */
  --bg-primary: #FFFDF5;      /* Warm cream white */
  --bg-secondary: #FFF9E8;    /* Slightly warmer */
  --bg-tertiary: #F8F7F5;     /* Light gray-cream */
  
  /* Text */
  --text-primary: #1A1A1A;    /* Near black */
  --text-secondary: #4D4D4D;  /* Dark gray */
  --text-muted: #666666;      /* Medium gray */
  
  /* Accents - Brown (Cow colors) */
  --accent-primary: #3D2D22;  /* Dark espresso brown */
  --accent-secondary: #C67830; /* Warm caramel */
  --accent-warm: #DE924A;     /* Golden brown */
  
  /* Borders */
  --border-light: rgba(61, 45, 34, 0.1);
  --border-medium: rgba(61, 45, 34, 0.2);
}
```

### Dark Mode
```css
.dark {
  --bg-primary: #1A1310;      /* Very dark brown */
  --bg-secondary: #2A1F18;    /* Dark brown */
  --bg-tertiary: #3D2D22;     /* Medium dark brown */
  
  --text-primary: #FFFDF5;    /* Cream white */
  --text-secondary: #E8DED6;  /* Light cream */
  --text-muted: #B89E8A;      /* Tan */
  
  --accent-primary: #F9E8D4;  /* Light cream accent */
  --accent-secondary: #E9B175; /* Warm gold */
  --accent-warm: #DE924A;     /* Golden brown */
}
```

## Color Usage Guidelines
- **Primary brown** (`#3D2D22`): Headers, primary buttons, important text
- **Caramel** (`#C67830`): Links, CTAs, interactive elements, highlights
- **Cream** (`#FFFDF5`): Main background, cards
- **Warm accents**: Hover states, decorative elements
- **Danger states**: Use red (#EF4444) for warnings/errors (not brown)

---

# TYPOGRAPHY

## Font Families

### Display/Headings
```css
font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
```
- Elegant serif for pharma-style gravitas
- Use for: h1-h4, hero text, callouts

### Body Text
```css
font-family: 'Source Sans 3', 'Open Sans', system-ui, sans-serif;
```
- Clean, readable sans-serif
- Use for: paragraphs, UI elements, navigation

### Monospace (Data/Clinical)
```css
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```
- Use for: statistics, citations, code blocks

## Type Scale (Fluid)
```css
--text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
--text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
--text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
--text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
--text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
--text-2xl: clamp(1.5rem, 1.3rem + 1vw, 2rem);
--text-3xl: clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem);
--text-4xl: clamp(2.25rem, 1.75rem + 2.5vw, 3.5rem);
--text-5xl: clamp(3rem, 2.25rem + 3.75vw, 4.5rem);
```

---

# IMAGERY DIRECTION

## Stock Photography Style
- **Tone**: Warm, trustworthy, professional (typical pharma marketing)
- **Subjects**: 
  - Diverse older adults (50+) smiling, healthy
  - People in pastoral/farm settings with cows
  - Families enjoying dairy
  - Healthcare provider consultations
- **Settings**:
  - Green pastures, farm landscapes
  - Bright, natural lighting
  - Clean, modern kitchens
  - Medical office settings
- **Mood**: Hopeful, natural, authentic

## Video Background (Hero)
- Full-screen background video of milk flowing/pouring
- Seamless loop, slowed down for elegance
- Very low opacity (10-15%) to blend with white background
- Gradient overlay to ensure text readability
- Pause option and respect reduced motion preference

## Image Treatment
- Slight warm color grade to match palette
- Soft shadows and natural lighting
- Avoid over-saturated colors
- Consider noise/grain texture overlay for organic feel

---

# FOOTER STRUCTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [LOGO]                                                         │
│  LACTIVAE™                                                      │
│  Traditional nutrition                                          │
│  backed by modern research.                                     │
│                                                                 │
│  [Facebook] [Twitter] [Instagram]                               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  LACTIVAE™        FOR PATIENTS      FOR PROVIDERS    LEGAL     │
│  ─────────        ────────────      ─────────────    ─────     │
│  About            Getting Started   Prescribing Info Terms     │
│  How It Works     Find LACTIVAE™    Medical Guide    Privacy   │
│  Clinical Data    Savings Program   Clinical Studies Health    │
│  Nutrition        FAQs              Resources        Cookies   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Contact Us              Medical Inquiries    Report Events    │
│  info@lactivae.com       medical@...          safety@...       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  © 2026 LACTIVAE™. All rights reserved. Portfolio project.     │
│                                                                 │
│  Terms | Privacy | Health Data Privacy | Cookies | Accessibility│
│                                                                 │
│  ───────────────────────────────────────────────────────────── │
│  LACTIVAE™ is not FDA approved. This website is for            │
│  educational purposes only. Raw milk carries inherent food     │
│  safety risks. Consult a healthcare provider before making     │
│  dietary changes.                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

# ENVIRONMENT VARIABLES

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Resend
RESEND_API_KEY=your_resend_key

# AI Chat (Claude API)
ANTHROPIC_API_KEY=your_anthropic_key

# Site
NEXT_PUBLIC_SITE_URL=https://lactivae.vercel.app
```

---

# FILE STRUCTURE

```
lactivae/
├── public/
│   ├── images/
│   ├── videos/
│   │   └── milk-flow.mp4
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (homepage)
│   │   ├── about/
│   │   ├── safety/
│   │   ├── patients/
│   │   ├── providers/
│   │   ├── prescribing-information/
│   │   ├── medical-guide/
│   │   ├── studies/
│   │   ├── resources/
│   │   ├── find/
│   │   ├── savings/
│   │   ├── faqs/
│   │   ├── contact/
│   │   ├── terms/
│   │   ├── privacy/
│   │   ├── health-data-privacy/
│   │   ├── cookies/
│   │   ├── auth/
│   │   │   ├── signin/
│   │   │   └── callback/
│   │   ├── profile/
│   │   │   ├── page.tsx
│   │   │   └── emails/
│   │   └── api/
│   │       ├── auth/
│   │       ├── chat/
│   │       └── email/
│   ├── components/
│   │   ├── ui/ (Button, Input, Card, etc.)
│   │   ├── layout/ (Header, Footer)
│   │   └── features/ (ISI, ChatWidget, AccessibilityWidget)
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── resend.ts
│   │   ├── utils.ts
│   │   └── stores.ts (Zustand)
│   ├── data/
│   │   └── content.ts (ISI, nav, research data)
│   ├── types/
│   │   └── index.ts
│   └── styles/
│       └── globals.css
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

# CONTENT SOURCE

All research content, statistics, citations, and ISI text should be pulled from:

**`/mnt/user-data/outputs/lactivae_research_document.md`**

This document contains:
- Executive Summary with key statistics
- Mechanism of Action (5 pathways)
- Clinical Studies (PASTURE, GABRIELA, PARSIFAL, etc.)
- Comparative Data (raw vs pasteurized)
- Modern Safety Evidence (2005-2020) with charts
- Effects of Pasteurization (verified data)
- Important Safety Information (ISI content)
- 29 source citations with DOIs/PMIDs

---

# PRIORITY BUILD ORDER

## Phase 1: Core Infrastructure
1. Next.js project setup with TypeScript + Tailwind
2. Color palette and typography (CSS variables)
3. Basic layout (Header, Footer)
4. Homepage with hero (static)

## Phase 2: Essential Components
5. ISI component (expandable from bottom)
6. Accessibility widget
7. Basic page templates

## Phase 3: Authentication
8. Supabase setup
9. Magic link auth flow
10. Profile page (basic)

## Phase 4: Content Pages
11. About / How It Works
12. Safety page
13. Prescribing Information
14. Medical Guide

## Phase 5: Enhanced Features
15. AI Chatbot
16. Email preferences
17. Email history library

## Phase 6: Polish
18. Animations and transitions
19. Mobile optimization
20. Performance optimization
21. Accessibility audit

---

# NOTES FOR CLAUDE CODE

1. **Start with `package.json`** - use Next.js 14, TypeScript, Tailwind, Framer Motion, Zustand, Radix UI

2. **Tailwind config** - set up custom colors, fonts, and spacing from palette section

3. **ISI is critical** - must be on every page, always visible, never obscure main content

4. **Chat widget** - start with UI, add API integration later

5. **Content** - import research data from the markdown file for accurate statistics and citations

6. **Accessibility first** - build with semantic HTML, ARIA labels, keyboard nav from the start

7. **Mobile responsive** - all components must work on mobile

8. **Dark mode** - implement from the beginning, not as afterthought
