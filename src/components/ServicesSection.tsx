import { Scissors, Sparkles, Star, Crown, Flame } from "lucide-react";
import { Card } from "@/components/ui/card";

const services = [
  {
    icon: Scissors,
    name: "Corte Máquina Simples",
    price: "R$ 25",
    description: "Promoção especial - corte prático e econômico",
    badge: "Promoção",
    badgeColor: "from-green-500 to-emerald-600"
  },
  {
    icon: Scissors,
    name: "Corte Degradê",
    price: "R$ 35",
    description: "Estilo moderno e elegante com técnica degradê",
    badge: "Popular",
    badgeColor: "from-primary to-accent"
  },
  {
    icon: Sparkles,
    name: "Barba",
    price: "R$ 35",
    description: "Aparar e modelar com navalha e precisão",
    badge: "Clássico",
    badgeColor: "from-amber-500 to-orange-600"
  },
  {
    icon: Crown,
    name: "Barboterapia",
    price: "R$ 50",
    description: "Tratamento premium com navalha e toalha quente",
    badge: "Premium",
    badgeColor: "from-primary to-rose-600"
  },
  {
    icon: Scissors,
    name: "Corte Infantil",
    price: "R$ 50",
    description: "Cuidado especial e paciência para os pequenos",
    badge: "Especial",
    badgeColor: "from-blue-500 to-indigo-600"
  },
  {
    icon: Star,
    name: "Selagem",
    price: "A partir de R$ 80",
    description: "Hidratação profunda e brilho intenso",
    badge: "Tratamento",
    badgeColor: "from-purple-500 to-pink-600"
  }
];

export const ServicesSection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Flame className="w-6 h-6 text-accent animate-fire-flicker" />
            <span className="text-sm sm:text-base font-bold text-accent uppercase tracking-widest">Nossos Serviços</span>
            <Flame className="w-6 h-6 text-accent animate-fire-flicker" style={{ animationDelay: "0.5s" }} />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 sm:mb-5">
            <span className="text-gradient">Serviços em Destaque</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Os mais procurados pelos nossos clientes
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 max-w-6xl mx-auto">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <Card
                key={idx}
                style={{ animationDelay: `${idx * 0.1}s` }}
                className="p-6 sm:p-7 md:p-8 bg-gradient-to-br from-card to-card/50 border-border hover:border-primary/50 transition-all duration-500 hover:shadow-[var(--shadow-fire)] hover:scale-105 hover:-translate-y-2 group animate-fade-in-up relative overflow-hidden rounded-2xl"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-500"></div>
                
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`text-xs font-bold px-3 py-1.5 bg-gradient-to-r ${service.badgeColor} text-white rounded-full shadow-lg`}>
                    {service.badge}
                  </span>
                </div>
                
                <div className="text-center relative z-10">
                  <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-primary group-hover:text-accent transition-colors duration-300" />
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20 group-hover:border-primary/50 group-hover:animate-border-glow transition-all duration-300"></div>
                  </div>
                  
                  <h3 className="text-lg sm:text-xl md:text-2xl mb-3 text-foreground font-bold group-hover:text-gradient transition-all duration-300">
                    {service.name}
                  </h3>
                  
                  <p className="text-2xl sm:text-3xl md:text-4xl font-black text-primary mb-4 group-hover:animate-glow-pulse">
                    {service.price}
                  </p>
                  
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};