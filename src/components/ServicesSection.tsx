import { Scissors, Sparkles, Star } from "lucide-react";
import { Card } from "@/components/ui/card";

const services = [
  // Cabelos
  {
    icon: Scissors,
    name: "Corte Máquina Simples",
    price: "R$ 25",
    description: "Promoção especial",
    category: "Cabelos"
  },
  {
    icon: Scissors,
    name: "Corte Máquina e Tesoura",
    price: "R$ 35",
    description: "Combinação perfeita",
    category: "Cabelos"
  },
  {
    icon: Scissors,
    name: "Corte Degradê",
    price: "R$ 35",
    description: "Estilo moderno e elegante",
    category: "Cabelos"
  },
  {
    icon: Scissors,
    name: "Corte Navalhado",
    price: "R$ 40",
    description: "Precisão e definição",
    category: "Cabelos"
  },
  {
    icon: Scissors,
    name: "Corte Tesoura",
    price: "R$ 40",
    description: "Clássico e refinado",
    category: "Cabelos"
  },
  {
    icon: Scissors,
    name: "Corte Infantil",
    price: "R$ 50",
    description: "Cuidado especial para os pequenos",
    category: "Cabelos"
  },
  {
    icon: Scissors,
    name: "Pezinho (Cantinho)",
    price: "R$ 20",
    description: "Acabamento perfeito",
    category: "Cabelos"
  },
  {
    icon: Star,
    name: "Razor / Risca (Listra)",
    price: "R$ 10",
    description: "Detalhes que fazem a diferença",
    category: "Cabelos"
  },
  {
    icon: Star,
    name: "Sobrancelhas",
    price: "R$ 15",
    description: "Design e modelagem",
    category: "Cabelos"
  },
  // Barba e Cuidados
  {
    icon: Sparkles,
    name: "Barba",
    price: "R$ 35",
    description: "Aparar e modelar com precisão",
    category: "Barba"
  },
  {
    icon: Sparkles,
    name: "Barboterapia",
    price: "R$ 50",
    description: "Tratamento completo com navalha e toalha quente",
    category: "Barba"
  },
  {
    icon: Sparkles,
    name: "Passar a Máquina na Barba",
    price: "R$ 20",
    description: "Acabamento rápido",
    category: "Barba"
  },
  {
    icon: Sparkles,
    name: "Limpeza Facial",
    price: "R$ 30",
    description: "Cuidado profundo com a pele",
    category: "Barba"
  },
  {
    icon: Sparkles,
    name: "Depilação Costas (Máquina)",
    price: "R$ 20",
    description: "Remoção prática e eficiente",
    category: "Barba"
  },
  // Tratamentos e Estilo
  {
    icon: Star,
    name: "Selagem",
    price: "A partir de R$ 80",
    description: "Hidratação e brilho intensos",
    category: "Tratamentos"
  },
  {
    icon: Star,
    name: "Lavagem",
    price: "R$ 20",
    description: "Limpeza profunda",
    category: "Tratamentos"
  },
  {
    icon: Star,
    name: "Esfoliação",
    price: "R$ 20",
    description: "Renovação da pele",
    category: "Tratamentos"
  },
  {
    icon: Star,
    name: "Penteado",
    price: "R$ 30",
    description: "Finalização profissional",
    category: "Tratamentos"
  }
];
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6 max-w-7xl mx-auto">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <Card
                key={idx}
                style={{
                  animationDelay: `${idx * 0.05}s`
                }}
                className="p-3 sm:p-4 md:p-5 bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-[var(--shadow-red-glow)] hover:scale-105 group animate-fade-in-up"
              >
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full mb-2 sm:mb-3 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg mb-1 sm:mb-2 text-foreground font-bold">
                    {service.name}
                  </h3>
                  <p className="text-xl sm:text-2xl font-black text-primary mb-1 sm:mb-2">
                    {service.price}
                  </p>
                  <p className="text-xs text-muted-foreground">
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