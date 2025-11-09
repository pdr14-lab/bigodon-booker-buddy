import { Scissors, Sparkles, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
const services = [{
  icon: Scissors,
  name: "Corte Tradicional",
  price: "R$ 40",
  description: "Corte clássico com finalização impecável",
  features: ["Lavagem", "Corte", "Finalização"]
}, {
  icon: Sparkles,
  name: "Barba & Bigode",
  price: "R$ 35",
  description: "Aparar e modelar com navalha e toalha quente",
  features: ["Aparar", "Modelar", "Hidratação"]
}, {
  icon: Star,
  name: "Corte + Barba",
  price: "R$ 65",
  description: "Combo completo para sair renovado",
  features: ["Corte completo", "Barba completa", "Finalização premium"]
}, {
  icon: Sparkles,
  name: "Tratamento Capilar",
  price: "R$ 50",
  description: "Hidratação e cuidados especiais para o cabelo",
  features: ["Lavagem especial", "Hidratação", "Massagem"]
}];
export const ServicesSection = () => {
  return <section className="py-8 sm:py-12 md:py-16 px-4 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 sm:mb-4 text-foreground">
            Nossos Serviços
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground">
            Qualidade e tradição em cada atendimento
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
          {services.map((service, idx) => {
          const Icon = service.icon;
          return <Card key={idx} style={{
            animationDelay: `${idx * 0.1}s`
          }} className="p-4 sm:p-5 md:p-6 bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-[var(--shadow-red-glow)] hover:scale-105 group animate-fade-in-up">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary/10 rounded-full mb-3 sm:mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl mb-2 text-foreground font-bold mx-0">
                    {service.name}
                  </h3>
                  <p className="text-2xl sm:text-3xl font-black text-primary mb-2 sm:mb-3">
                    {service.price}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                    {service.description}
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {service.features.map((feature, i) => <li key={i} className="flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        {feature}
                      </li>)}
                  </ul>
                </div>
              </Card>;
        })}
        </div>
      </div>
    </section>;
};