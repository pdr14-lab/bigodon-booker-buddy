import { Award, Users, Clock } from "lucide-react";

export const AboutSection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          <div className="animate-slide-in-right order-2 md:order-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-5 md:mb-6 text-foreground">
              Sobre Don Bigodon
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-5 md:mb-6 leading-relaxed">
              Há mais de 15 anos trazendo o melhor da barbearia tradicional 
              com um toque moderno. Nossa missão é fazer cada cliente sair 
              daqui não apenas com um visual renovado, mas com a autoestima 
              lá em cima.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-7 md:mb-8 leading-relaxed">
              Combinamos técnicas clássicas de barbeiro com tendências 
              atuais, sempre mantendo o padrão de excelência que nos 
              tornou referência na região.
            </p>

            <div className="grid grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              <div className="text-center hover:scale-110 transition-all duration-300 animate-scale-in" style={{ animationDelay: "0.2s" }}>
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full mb-1 sm:mb-2">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <p className="font-bold text-lg sm:text-xl md:text-2xl text-foreground">15+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Anos</p>
              </div>
              <div className="text-center hover:scale-110 transition-all duration-300 animate-scale-in" style={{ animationDelay: "0.4s" }}>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-2">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <p className="font-bold text-2xl text-foreground">5000+</p>
                <p className="text-sm text-muted-foreground">Clientes</p>
              </div>
              <div className="text-center hover:scale-110 transition-all duration-300 animate-scale-in" style={{ animationDelay: "0.6s" }}>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-2">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <p className="font-bold text-2xl text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">Dedicação</p>
              </div>
            </div>
          </div>

          <div className="relative animate-slide-in-left order-1 md:order-2">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-transparent rounded-lg overflow-hidden border-2 sm:border-4 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-105">
              <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800')] bg-cover bg-center"></div>
            </div>
            <div className="absolute -bottom-3 -right-3 sm:-bottom-6 sm:-right-6 w-20 h-20 sm:w-32 sm:h-32 bg-primary/10 rounded-lg -z-10"></div>
            <div className="absolute -top-3 -left-3 sm:-top-6 sm:-left-6 w-20 h-20 sm:w-32 sm:h-32 bg-primary/10 rounded-lg -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
