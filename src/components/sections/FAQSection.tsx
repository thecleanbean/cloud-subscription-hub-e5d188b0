import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How does the service work?",
    answer: "Simply schedule a pickup, leave your laundry in our designated bags, and we'll take care of the rest. Your clean clothes will be returned within 24-48 hours.",
  },
  {
    question: "What are your washing methods?",
    answer: "We use professional-grade equipment and eco-friendly detergents. All items are sorted by color and fabric type to ensure the best care possible.",
  },
  {
    question: "Do you offer same-day service?",
    answer: "Yes, we offer same-day service for orders placed before 9 AM, subject to availability. Additional charges may apply.",
  },
  {
    question: "What if I'm not home during pickup/delivery?",
    answer: "No problem! We can arrange for pickup and delivery using our secure locker system or coordinate with your building's concierge.",
  },
  {
    question: "How do you handle delicate items?",
    answer: "Delicate items receive special attention and are cleaned according to their care labels. We also offer specialized cleaning for premium garments.",
  },
];

export const FAQSection = () => {
  return (
    <section className="py-20 bg-white" id="faq">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our laundry service.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};