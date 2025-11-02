import { Scissors, Sparkles, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

const services = [
  {
    icon: Scissors,
    name: "Corte Tradicional",
    price: "R$ 40",
    description: "Corte clássico com finalização impecável",
    features: ["Lavagem", "Corte", "Finalização"],
  },
  {
    icon: Sparkles,
    name: "Barba & Bigode",
    price: "R$ 35",
    description: "Aparar e modelar com navalha e toalha quente",
    features: ["Aparar", "Modelar", "Hidratação"],
  },
  {
    icon: Star,
    name: "Corte + Barba",
    price: "R$ 65",
    description: "Combo completo para sair renovado",
    features: ["Corte completo", "Barba completa", "Finalização premium"],
  },
  {
    icon: Sparkles,
    name: "Tratamento Capilar",
    price: "R$ 50",
    description: "Hidratação e cuidados especiais para o cabelo",
    features: ["Lavagem especial", "Hidratação", "Massagem"],
  },
];

export const ServicesSection = () => {
  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-foreground">
            Nossos Serviços
          </h2>
          <p className="text-xl text-muted-foreground">
            Qualidade e tradição em cada atendimento
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <Card
                key={idx}
                className="p-6 bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-[var(--shadow-red-glow)] group"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 group-hover:bg-primary/20 transition-all">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {service.name}
                  </h3>
                  <p className="text-3xl font-black text-primary mb-3">
                    {service.price}
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
