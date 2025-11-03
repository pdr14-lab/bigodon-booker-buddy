import { Award, Users, Clock } from "lucide-react";

export const AboutSection = () => {
  return (
    <section className="py-16 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-right">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground">
              Sobre Don Bigodon
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              Há mais de 15 anos trazendo o melhor da barbearia tradicional 
              com um toque moderno. Nossa missão é fazer cada cliente sair 
              daqui não apenas com um visual renovado, mas com a autoestima 
              lá em cima.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Combinamos técnicas clássicas de barbeiro com tendências 
              atuais, sempre mantendo o padrão de excelência que nos 
              tornou referência na região.
            </p>

            <div className="grid grid-cols-3 gap-6">
              <div className="text-center hover:scale-110 transition-all duration-300 animate-scale-in" style={{ animationDelay: "0.2s" }}>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-2">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <p className="font-bold text-2xl text-foreground">15+</p>
                <p className="text-sm text-muted-foreground">Anos</p>
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

          <div className="relative animate-slide-in-left">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-transparent rounded-lg overflow-hidden border-4 border-primary/30 hover:border-primary/50 transition-all duration-300 hover:scale-105">
              <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800')] bg-cover bg-center"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-lg -z-10"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-lg -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
