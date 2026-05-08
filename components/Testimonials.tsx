import { getTestimonials } from '@/lib/admin-data'
import TestimonialsCarousel from './TestimonialsCarousel'

export default function Testimonials() {
  const { testimonials, config } = getTestimonials()
  return <TestimonialsCarousel testimonials={testimonials} config={config} />
}
