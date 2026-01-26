import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import "./globals.css";

const baseUrl = 'https://idokohubert.com';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Idoko Hubert | AI & ML Engineer | Full-Stack Developer | Data Solutions Architect',
    template: '%s | Idoko Hubert - AI Engineer',
  },
  description: 'Hire Idoko Hubert - AI & ML Engineer with 3+ years experience building production-ready machine learning systems, data pipelines, and full-stack applications. Expertise in Python, TensorFlow, PyTorch, React, Node.js. Available for global remote work.',
  keywords: [
    // Core skills
    'AI Engineer', 'Machine Learning Engineer', 'ML Engineer',
    'Data Solutions Architect', 'Full-Stack Developer',
    'Python Developer', 'Data Engineer', 'MLOps Engineer',
    // Technologies
    'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP',
    'Computer Vision', 'React', 'Next.js', 'Node.js',
    'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes',
    // Services
    'AI Consulting', 'Machine Learning Services',
    'Data Pipeline Development', 'Web Application Development',
    'Mobile App Development', 'Cloud Architecture',
    // Location/Availability
    'Remote AI Engineer', 'Freelance ML Engineer',
    'Hire AI Developer', 'AI Engineer for Hire',
    // Industry terms
    'End-to-End ML Systems', 'Production ML',
    'Scalable AI Solutions', 'Enterprise AI',
  ],
  authors: [{ name: 'Idoko Hubert', url: baseUrl }],
  creator: 'Idoko Hubert',
  publisher: 'Idoko Hubert',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'en-US': baseUrl,
      'en-GB': baseUrl,
      'en': baseUrl,
      'x-default': baseUrl,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: baseUrl,
    siteName: 'Idoko Hubert | AI & ML Engineer Portfolio',
    title: 'Idoko Hubert | AI & ML Engineer | Full-Stack Developer',
    description: 'AI & ML Engineer with 3+ years experience. Specializing in production machine learning, data engineering, and full-stack development. Available for global remote work.',
    images: [
      {
        url: `${baseUrl}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Idoko Hubert - AI & ML Engineer Portfolio',
        type: 'image/jpeg',
      },
      {
        url: `${baseUrl}/images/profile.jpg`,
        width: 400,
        height: 400,
        alt: 'Idoko Hubert - Professional Headshot',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@idokohubert',
    creator: '@idokohubert',
    title: 'Idoko Hubert | AI & ML Engineer',
    description: 'AI & ML Engineer specializing in production ML systems, data engineering, and full-stack development. 3+ years experience.',
    images: [`${baseUrl}/images/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // Add Bing verification when you have it
    // other: { 'msvalidate.01': 'your-bing-code' },
  },
  category: 'technology',
  classification: 'Portfolio',
  other: {
    // Geographic targeting hints
    'geo.region': 'GLOBAL',
    'geo.placename': 'Worldwide',
    // Rich snippets hints
    'rating': '5',
    'author': 'Idoko Hubert',
  },
};

// Comprehensive JSON-LD Structured Data
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${baseUrl}/#person`,
  name: 'Idoko Hubert',
  givenName: 'Hubert',
  familyName: 'Idoko',
  jobTitle: 'AI & ML Engineer',
  description: 'AI & ML Engineer with 3+ years experience designing and deploying end-to-end AI and data solutions. Specializing in machine learning, data engineering, and full-stack development.',
  url: baseUrl,
  image: {
    '@type': 'ImageObject',
    url: `${baseUrl}/images/profile.jpg`,
    width: 400,
    height: 400,
  },
  email: 'iheanachohubert@gmail.com',
  sameAs: [
    'https://www.linkedin.com/in/hubert-idoko-47b817342',
    'https://github.com/Hubert24hrs',
    'https://huggingface.co/',
    'https://twitter.com/',
    'https://tiktok.com/@',
    'https://instagram.com/',
    'https://facebook.com/',
  ],
  knowsAbout: [
    'Artificial Intelligence',
    'Machine Learning',
    'Deep Learning',
    'Natural Language Processing',
    'Computer Vision',
    'Data Engineering',
    'Data Science',
    'Full-Stack Development',
    'Cloud Computing',
    'MLOps',
    'Python',
    'TensorFlow',
    'PyTorch',
    'React',
    'Next.js',
    'Node.js',
  ],
  hasCredential: [
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'AWS Certified Solutions Architect',
      credentialCategory: 'certification',
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'TensorFlow Developer Certificate',
      credentialCategory: 'certification',
    },
    {
      '@type': 'EducationalOccupationalCredential',
      name: 'Google Cloud Professional Data Engineer',
      credentialCategory: 'certification',
    },
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'AI & ML Engineer',
    occupationalCategory: 'Software Development',
    skills: 'Machine Learning, Deep Learning, Python, TensorFlow, PyTorch, Data Engineering',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Freelance / Available for Hire',
  },
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${baseUrl}/#website`,
  url: baseUrl,
  name: 'Idoko Hubert Portfolio',
  description: 'Professional portfolio of Idoko Hubert - AI & ML Engineer, Data Solutions Architect, Full-Stack Developer',
  publisher: {
    '@id': `${baseUrl}/#person`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${baseUrl}/?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'en-US',
};

const portfolioSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  '@id': `${baseUrl}/#portfolio`,
  name: 'Featured Projects',
  description: 'Portfolio of AI, ML, Data Engineering, and Full-Stack projects by Idoko Hubert',
  numberOfItems: 6,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      item: {
        '@type': 'SoftwareApplication',
        name: 'Intelligent Document Processing',
        description: 'End-to-end ML pipeline for automated document classification and data extraction',
        applicationCategory: 'AI/ML',
      },
    },
    {
      '@type': 'ListItem',
      position: 2,
      item: {
        '@type': 'SoftwareApplication',
        name: 'Real-time Analytics Platform',
        description: 'Scalable data pipeline processing millions of events daily',
        applicationCategory: 'Data Engineering',
      },
    },
    {
      '@type': 'ListItem',
      position: 3,
      item: {
        '@type': 'SoftwareApplication',
        name: 'E-Commerce Mobile App',
        description: 'Cross-platform mobile application with secure payments',
        applicationCategory: 'Mobile Development',
      },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: baseUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Projects',
      item: `${baseUrl}/#projects`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Contact',
      item: `${baseUrl}/#contact`,
    },
  ],
};

// Combine all schemas
const combinedJsonLd = [personSchema, websiteSchema, portfolioSchema, breadcrumbSchema];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* Theme & Colors */}
        <meta name="theme-color" content="#4f46e5" />
        <meta name="msapplication-TileColor" content="#4f46e5" />

        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedJsonLd) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
