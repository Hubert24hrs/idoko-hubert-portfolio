import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Certifications from '@/components/Certifications';
import Testimonials from '@/components/Testimonials';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

import { getCertifications, getTestimonials, getProjects } from '@/lib/data-service';

export default async function Home() {
  const [certifications, testimonials, projects] = await Promise.all([
    getCertifications(true),
    getTestimonials(true),
    getProjects(true)
  ]);

  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Skills />
        <Projects data={projects} />
        <Certifications data={certifications} />
        <Testimonials data={testimonials} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
