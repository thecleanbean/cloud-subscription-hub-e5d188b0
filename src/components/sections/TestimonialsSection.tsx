import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Card } from "../ui/card";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Busy Professional",
    content: "The Clean Bean has transformed my weekly routine. Their service is reliable and my clothes always come back perfectly clean!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Family of Four",
    content: "As a parent of two, this service is a lifesaver. The staff is friendly and the quality is consistently excellent.",
    rating: 5,
  },
  {
    name: "Emma Davis",
    role: "Student",
    content: "Affordable, convenient, and high-quality service. Perfect for students who want to focus on their studies!",
    rating: 5,
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it - hear from some of our satisfied customers about their experience with The Clean Bean.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="p-6 h-full flex flex-col">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-secondary fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 flex-grow">{testimonial.content}</p>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};