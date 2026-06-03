# Love Court 💕⚖️

Couples dispute resolution app - Let the Judge decide!

## Overview

Love Court is a fun couples app where partners submit their side of an argument and receive an AI-powered verdict with reasoning. Perfect for settling those petty disputes once and for all.

## Tech Stack

- **Framework:** Next.js 16 + TypeScript
- **Styling:** Tailwind CSS + custom CSS variables
- **Theme:** Navy/Gold (luxury courtroom aesthetic)
- **Fonts:** Fraunces (display), DM Sans (body)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Landing page with Judge
│   ├── partner-a/      # Partner A submission form
│   ├── partner-b/      # Partner B submission form
│   ├── verdict/       # Verdict reveal page
│   ├── history/      # Past disputes
│   ├── layout.tsx     # Root layout with fonts
│   └── globals.css    # Navy/Gold theme system
```

## Pages

1. **/** - Landing page with Judge character
2. **/partner-a** - Partner A submits their case
3. **/partner-b** - Partner B submits rebuttal (see Partner A's statement)
4. **/verdict** - AI Judge delivers verdict with reasoning
5. **/history** - View past disputes

## Features

- 📱 Mobile-responsive design
- 🎭 Animated Judge character
- ✨ Smooth form transitions
- 🔒 LocalStorage privacy (data stays on device)
- 🎨 Navy/Gold luxury theme
- ♿ Accessible (WCAG compliant)

## Theme Colors

- Navy 900: #0a0d1a (background)
- Navy 800: #121829 (surface)
- Gold 500: #d4a853 (accent)
- Cream: #f5f0e6 (text)

## Privacy

All dispute data is stored in browser localStorage only. No server storage. Your dirty laundry stays on your device.

## License

MIT
## Supabase Integration (Optional)

For cloud-based dispute storage, you can integrate with Supabase.

### Setup

1. Create a Supabase project at supabase.com
2. Run `schema.sql` in the Supabase SQL Editor
3. Copy `.env.example` to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### Schema

The database has two tables:

- `disputes`: Stores case info (case_code, category, status, winner, reasoning)
- `responses`: Stores partner submissions (content, intensity, round_number)

### Fallback

If Supabase isn't configured, the app falls back to localStorage automatically.

## License

MIT
