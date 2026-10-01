// ─────────────────────────────────────────────────────────────────────────────
// SITE CONTENT: edit this file to update the website text. See docs/CONTENT_GUIDE.md.
// Photos: put files in frontend/public/images/ and set `image: '/images/<file>.jpg'`.
// Items marked PLACEHOLDER are assumptions; replace them with the club's real details.
// ─────────────────────────────────────────────────────────────────────────────
// Editable site copy. Business details below were gathered from public listings
// on 2026-10-01: confirm with the club (see docs/CLIENT_INFO.md).
export const site = {
  name: 'Golden Trigger Rifle Club',
  // Name used on Instagram, Facebook and the old website
  alternateName: 'Golden Trigger Shooting Academy',
  shortName: 'GTRC',
  tagline: 'Precision. Discipline. Champions.',
  description:
    'Golden Trigger Rifle Club (Golden Trigger Shooting Academy) is a professional shooting range in Gerugambakkam, Chennai. Certified instructors train beginners and competitive shooters in 10m Air Rifle and Pistol. Team gold winners at the Pondy Open 2025.',
  url: import.meta.env.VITE_SITE_URL || 'https://example.com',
  email: 'goldentriggerriffleclub@gmail.com',
  phones: ['+91 96777 80774', '+91 96777 52774'],
  whatsapp: '919677780774',
  address: {
    street: 'Sports Club Campus, 10 Anna Street, Periyapanicheri',
    locality: 'Gerugambakkam',
    city: 'Chennai',
    region: 'Tamil Nadu',
    postalCode: '600128',
    country: 'IN',
  },
  // PLACEHOLDER timings: not published anywhere
  hours: [
    { days: 'Tuesday – Sunday', time: '6:00 AM – 9:00 AM, 4:00 PM – 8:00 PM' },
    { days: 'Monday', time: 'Closed' },
  ],
  social: {
    instagram: 'https://www.instagram.com/golden_trigger_shooting/',
    facebook: 'https://www.facebook.com/people/Golden-Trigger-Shooting-Academy/61576635413643/',
  },
  // Home page hero photo (wide, about 1600×1000). Leave empty to show the target graphic.
  heroImage: '',
  mapEmbed:
    'https://www.google.com/maps?q=Golden+Trigger+Rifle+Club+Gerugambakkam+Chennai&output=embed',
}

export const nav = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/programs', label: 'Programmes' },
  { to: '/membership', label: 'Membership' },
  { to: '/coaches', label: 'Coaches' },
  { to: '/facilities', label: 'Facilities' },
  { to: '/events', label: 'Events' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

// Verified from the club's public posts (see docs/CLIENT_INFO.md).
export const stats = [
  { value: '2 Gold', label: 'Pondy Open 2025: men\'s & women\'s team' },
  { value: '1 Silver', label: 'Pondy Open 2025: Master Men individual' },
  { value: '10m', label: 'Air Rifle & Pistol training' },
  { value: 'All levels', label: 'Beginner to competition' },
]

export const achievements = [
  { year: '2025', event: 'Pondy Open', result: 'Gold', detail: "Women's Team" },
  { year: '2025', event: 'Pondy Open', result: 'Gold', detail: "Men's Team" },
  { year: '2025', event: 'Pondy Open', result: 'Silver', detail: 'Master Men Individual' },
]

// PLACEHOLDER: coach names are not published anywhere. Replace with real names and photos.
export const coaches = [
  {
    name: 'Head Coach',
    role: 'Head Coach · 10m Air Rifle',
    bio: 'Certified shooting coach with competition experience at state and national level. Leads the advanced and competition programmes.',
    certs: ['Certified Coach (to confirm)', 'Range Safety Officer'],
    image: '', // PLACEHOLDER: /images/coach-1.jpg (portrait, 4:3)
  },
  {
    name: 'Pistol Coach',
    role: 'Coach · 10m Air Pistol',
    bio: 'Specialises in one-hand precision technique and mental routines for match day.',
    certs: ['Certified Coach (to confirm)'],
    image: '', // PLACEHOLDER: /images/coach-2.jpg (portrait, 4:3)
  },
  {
    name: 'Junior Coach',
    role: 'Coach · Beginners & Kids',
    bio: 'Introduces new and young shooters to safe handling, stance and the basics of precision shooting.',
    certs: ['Range Safety Officer'],
    image: '', // PLACEHOLDER: /images/coach-3.jpg (portrait, 4:3)
  },
]

// PLACEHOLDER: facility details are typical for a 10m range; confirm with the club.
export const facilities: { title: string; text: string; image: string }[] = [
  { title: '10m Shooting Lanes', text: 'Indoor 10m lanes for air rifle and air pistol, with consistent lighting and backstops.', image: '' },
  { title: 'Club Equipment', text: 'Training rifles, pistols, jackets and pellets for beginners, so there is no need to buy gear on day one.', image: '' },
  { title: 'Electronic Scoring', text: 'Shot-by-shot feedback for advanced shooters to track grouping and progress.', image: '' },
  { title: 'Safety First', text: 'Every session runs under a certified range officer. Equipment is stored securely and handled under supervision.', image: '' },
  { title: 'Parent Lounge', text: 'A comfortable waiting area so parents can watch training sessions.', image: '' },
  { title: 'Easy to Reach', text: 'Located in Gerugambakkam, close to Porur and Kundrathur, with parking on campus.', image: '' },
]

// Testimonials: add real quotes from members (with their permission) before showing any on the site.
export const testimonials: { quote: string; name: string }[] = []

// Gallery: add photos to public/images/gallery/ and list them here (newest first).
export const gallery: { image: string; caption: string }[] = [
  { image: '', caption: 'Range' },
  { image: '', caption: 'Training session' },
  { image: '', caption: 'Junior batch' },
  { image: '', caption: 'Pondy Open 2025: team gold' },
  { image: '', caption: 'Medal ceremony' },
  { image: '', caption: 'Coaching' },
  { image: '', caption: 'Match day' },
  { image: '', caption: 'Team' },
  { image: '', caption: 'Equipment' },
]

// Path from first shot to competition (general structure of Indian shooting sport).
export const pathway = [
  { step: 'Trial & Basics', text: 'Safety briefing, stance, breathing and trigger control on club equipment.' },
  { step: 'Club Training', text: 'Regular coached sessions to build consistent, repeatable shots and match routines.' },
  { step: 'Club & Open Matches', text: 'First competition experience in club matches and open events such as the Pondy Open.' },
  { step: 'State Championship', text: 'Tamil Nadu state-level championships, the gateway to national-level shooting.' },
  { step: 'National Level', text: 'Qualified shooters move on to pre-national and national championships under NRAI.' },
]

export const disciplines = [
  {
    name: '10m Air Rifle',
    text: 'An Olympic event shot standing at a target 10 metres away. The 10-ring is just 0.5 mm across, so the event rewards stillness, breathing control and a perfectly smooth trigger release.',
  },
  {
    name: '10m Air Pistol',
    text: 'An Olympic event shot one-handed from 10 metres. It builds grip, sight alignment and follow-through, and develops intense focus and composure under pressure.',
  },
]

export const benefits = [
  'Improves concentration and focus, which carries into school and work',
  'Builds patience, discipline and self-control',
  'Develops calm under pressure and confidence',
  'Open to all ages and body types: precision matters more than strength',
  'A recognised Olympic sport with a clear competitive pathway',
]

export const faqs = [
  { q: 'What age can my child start?', a: 'Children can start from 8 years old in the beginner programme. A parent or guardian must sign the consent form.' },
  { q: 'Do I need my own rifle or pistol?', a: 'No. Beginners use club equipment. Advanced shooters can bring their own air rifle or pistol, as per the rules.' },
  { q: 'Is air rifle shooting safe?', a: 'Yes. Every session is supervised by a range safety officer, and all shooters complete a safety briefing before shooting.' },
  { q: 'How do I pay?', a: 'Pay online through Razorpay (UPI, cards and netbanking) on the Book page. You get a confirmation by email.' },
  { q: 'What is 10m air rifle shooting?', a: '10m Air Rifle is an Olympic shooting event where athletes shoot at a target 10 metres away. It is the most common way to start in the sport: safe, precise and fully supervised at the club.' },
  { q: 'What should I bring to my first session?', a: 'Comfortable clothes and flat shoes. All equipment is provided for beginners. Arrive 10 minutes early for the safety briefing.' },
  { q: 'Do you train for competitions?', a: 'Yes. Our shooters compete in club and open matches. At the Pondy Open 2025 our teams won gold in both the men\'s and women\'s team events.' },
  { q: 'Can I try before joining?', a: 'Yes. Book a Trial Session to shoot with a coach before choosing a programme.' },
]
