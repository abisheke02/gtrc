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
  hours: [
    { days: 'Tuesday – Sunday', time: '6:00 AM – 9:00 AM, 4:00 PM – 8:00 PM' },
    { days: 'Monday', time: 'Closed' },
  ],
  social: {
    instagram: 'https://www.instagram.com/golden_trigger_shooting/',
    facebook: 'https://www.facebook.com/people/Golden-Trigger-Shooting-Academy/61576635413643/',
  },
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

export const coaches = [
  {
    name: 'Head Coach',
    role: 'Head Coach · 10m Air Rifle',
    bio: 'Certified shooting coach with competition experience at state and national level. Leads the advanced and competition programmes.',
    certs: ['Certified Coach (to confirm)', 'Range Safety Officer'],
  },
  {
    name: 'Pistol Coach',
    role: 'Coach · 10m Air Pistol',
    bio: 'Specialises in one-hand precision technique and mental routines for match day.',
    certs: ['Certified Coach (to confirm)'],
  },
  {
    name: 'Junior Coach',
    role: 'Coach · Beginners & Kids',
    bio: 'Introduces new and young shooters to safe handling, stance and the basics of precision shooting.',
    certs: ['Range Safety Officer'],
  },
]

export const facilities = [
  { title: '10m Shooting Lanes', text: 'Indoor 10m lanes for air rifle and air pistol, with consistent lighting and backstops.' },
  { title: 'Club Equipment', text: 'Training rifles, pistols, jackets and pellets for beginners, so there is no need to buy gear on day one.' },
  { title: 'Electronic Scoring', text: 'Shot-by-shot feedback for advanced shooters to track grouping and progress.' },
  { title: 'Safety First', text: 'Every session runs under a certified range officer. Equipment is stored securely and handled under supervision.' },
  { title: 'Parent Lounge', text: 'A comfortable waiting area so parents can watch training sessions.' },
  { title: 'Easy to Reach', text: 'Located in Gerugambakkam, close to Porur and Kundrathur, with parking on campus.' },
]

// Testimonials: add real quotes from members (with their permission) before showing any on the site.
export const testimonials: { quote: string; name: string }[] = []

export const faqs = [
  { q: 'What age can my child start?', a: 'Children can start from 8 years old in the beginner programme. A parent or guardian must sign the consent form.' },
  { q: 'Do I need my own rifle or pistol?', a: 'No. Beginners use club equipment. Advanced shooters can bring their own air rifle or pistol, as per the rules.' },
  { q: 'Is air rifle shooting safe?', a: 'Yes. Every session is supervised by a range safety officer, and all shooters complete a safety briefing before shooting.' },
  { q: 'How do I pay?', a: 'Pay online through Razorpay (UPI, cards and netbanking) on the Book page. You get a confirmation by email.' },
  { q: 'Can I try before joining?', a: 'Yes. Book a Trial Session to shoot with a coach before choosing a programme.' },
]
