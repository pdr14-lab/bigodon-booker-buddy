import { Scissors, Sparkles, Star, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";

const services = [
  {
    icon: Scissors,
    name: "Corte Máquina Simples",
    price: "R$ 25",
    description: "Promoção especial - corte prático e econômico",
    badge: "Promoção"
  },
  {
    icon: Scissors,
    name: "Corte Degradê",
    price: "R$ 35",
    description: "Estilo moderno e elegante com técnica degradê",
    badge: "Popular"
  },
  {
    icon: Sparkles,
    name: "Barba",
    price: "R$ 35",
    description: "Aparar e modelar com navalha e precisão",
    badge: "Clássico"
  },
  {
    icon: Crown,
    name: "Barboterapia",
    price: "R$ 50",
    description: "Tratamento premium com navalha e toalha quente",
    badge: "Premium"
  },
  {
    icon: Scissors,
    name: "Corte Infantil",
    price: "R$ 50",
    description: "Cuidado especial e paciência para os pequenos",
    badge: "Especial"
  },
  {
    icon: Star,
    name: "Selagem",
    price: "A partir de R$ 80",
    description: "Hidratação profunda e brilho intenso",
    badge: "Tratamento"
  }
];
export const ServicesSection = () => {
  return <section className="py-8 sm:py-12 md:py-16 px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 text-foreground">
            Serviços em Destaque
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            Os mais procurados pelos nossos clientes
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <Card
                key={idx}
                style={{
                  animationDelay: `${idx * 0.1}s`
                }}
                className="p-5 sm:p-6 md:p-7 bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-[var(--shadow-red-glow)] hover:scale-105 group animate-fade-in-up relative overflow-hidden"
              >
                <div className="absolute top-3 right-3">
                  <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {service.badge}
                  </span>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl mb-2 text-foreground font-bold">
                    {service.name}
                  </h3>
                  <p className="text-2xl sm:text-3xl font-black text-primary mb-3">
                    {service.price}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>;
};