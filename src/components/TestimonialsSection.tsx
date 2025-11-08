import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Carlos Silva",
    rating: 5,
    comment: "Melhor barbearia da região! Atendimento top e corte impecável. Sempre saio satisfeito.",
  },
  {
    name: "Roberto Alves",
    rating: 5,
    comment: "Profissionais excelentes, ambiente agradável. A barba fica perfeita toda vez!",
  },
  {
    name: "Felipe Santos",
    rating: 5,
    comment: "Tradição e qualidade. Sou cliente há anos e não troco por nada. Recomendo!",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 text-foreground">
            O Que Dizem Nossos Clientes
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            Satisfação garantida em cada atendimento
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {testimonials.map((testimonial, idx) => (
            <Card
              key={idx}
              style={{ animationDelay: `${idx * 0.15}s` }}
              className="p-4 sm:p-5 md:p-6 bg-card border-border hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-[var(--shadow-red-glow)] animate-fade-in-up"
            >
              <div className="flex gap-1 mb-3 sm:mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mb-3 sm:mb-4 leading-relaxed">
                "{testimonial.comment}"
              </p>
              <p className="text-sm sm:text-base font-bold text-foreground">
                — {testimonial.name}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
