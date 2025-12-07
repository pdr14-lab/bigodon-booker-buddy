import { BookingCalendar } from "@/components/BookingCalendar";
import { AdminPanel } from "@/components/AdminPanel";
import { ServicesSection } from "@/components/ServicesSection";
import { AboutSection } from "@/components/AboutSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ContactSection } from "@/components/ContactSection";
import { Scissors, Clock, MapPin, Flame } from "lucide-react";
import heroImage from "@/assets/barber-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <header className="relative h-[55vh] sm:h-[65vh] md:h-[75vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(0_85%_55%_/_0.15),_transparent_60%)]"></div>
        </div>
        
        {/* Animated fire border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-primary/20 to-transparent"></div>
        
        <div className="relative z-10 text-center px-4">
          <div className="flex items-center justify-center gap-3 mb-4 sm:mb-6 animate-bounce-in">
            <Flame className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-accent animate-fire-flicker" />
            <Scissors className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 text-primary animate-float" />
            <Flame className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-accent animate-fire-flicker" style={{ animationDelay: "0.5s" }} />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-wider mb-3 sm:mb-5 text-foreground animate-glow-pulse animate-fade-in-up">
            <span className="text-gradient">DON BIGODON</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light tracking-widest animate-fade-in-up uppercase" style={{ animationDelay: "0.3s" }}>
            Tradição • Estilo • Atitude
          </p>
          
          {/* Glowing CTA */}
          <a 
            href="#agendamento" 
            className="inline-flex items-center gap-2 mt-6 sm:mt-8 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold text-sm sm:text-base rounded-full animate-fire-flicker hover:scale-110 transition-transform duration-300"
            style={{ animationDelay: "0.6s" }}
          >
            <Scissors className="w-4 h-4 sm:w-5 sm:h-5" />
            AGENDAR AGORA
          </a>
        </div>
      </header>

      {/* Info Section */}
      <section className="py-10 sm:py-14 md:py-16 bg-gradient-to-b from-background via-secondary/10 to-background relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,_hsl(0_85%_55%_/_0.1),_transparent_70%)] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 animate-fade-in-up relative z-10">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
            <div className="text-center p-5 sm:p-7 bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-[var(--shadow-fire)] hover:scale-105 group animate-slide-in-right glow-border">
              <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full mb-3 sm:mb-4 group-hover:bg-primary/20 transition-all duration-300">
                <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-primary group-hover:animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-border-glow"></div>
              </div>
              <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-foreground">Horários</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Seg-Sex: 08h - 20h</p>
              <p className="text-sm sm:text-base text-muted-foreground">Sáb: 08h - 18h</p>
              <p className="text-sm sm:text-base text-primary font-semibold">Dom: Fechado</p>
            </div>
            
            <div className="text-center p-5 sm:p-7 bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-[var(--shadow-fire)] hover:scale-105 group animate-scale-in glow-border" style={{ animationDelay: "0.2s" }}>
              <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full mb-3 sm:mb-4 group-hover:bg-primary/20 transition-all duration-300">
                <Scissors className="w-8 h-8 sm:w-10 sm:h-10 text-primary group-hover:animate-spin-slow" />
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-border-glow" style={{ animationDelay: "0.5s" }}></div>
              </div>
              <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-foreground">Serviços</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Corte tradicional</p>
              <p className="text-sm sm:text-base text-muted-foreground">Barba & Bigode</p>
              <p className="text-sm sm:text-base text-accent font-semibold">Tratamentos Premium</p>
            </div>
            
            <div className="text-center p-5 sm:p-7 bg-gradient-to-br from-card to-card/50 rounded-2xl border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-[var(--shadow-fire)] hover:scale-105 group animate-slide-in-left sm:col-span-2 md:col-span-1 glow-border" style={{ animationDelay: "0.4s" }}>
              <div className="relative inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full mb-3 sm:mb-4 group-hover:bg-primary/20 transition-all duration-300">
                <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-primary group-hover:animate-float" />
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-border-glow" style={{ animationDelay: "1s" }}></div>
              </div>
              <h3 className="font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-foreground">Localização</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Centro da cidade</p>
              <p className="text-sm sm:text-base text-accent font-semibold">Atendimento VIP</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* About Section */}
      <AboutSection />

      {/* Booking Section */}
      <section id="agendamento" className="py-10 sm:py-14 md:py-20 px-4 bg-gradient-to-b from-background via-secondary/10 to-background relative">
        {/* Background glow effects */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 sm:mb-4 animate-fade-in-up">
              <span className="text-gradient">Agende Seu Horário</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Reserve agora e garanta seu atendimento VIP
            </p>
          </div>
          <BookingCalendar />
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <footer className="bg-gradient-to-t from-secondary/80 to-secondary/20 border-t border-primary/30 py-8 sm:py-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_hsl(0_85%_55%_/_0.1),_transparent_60%)]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Scissors className="w-5 h-5 text-primary" />
            <span className="text-xl font-bold text-gradient">DON BIGODON</span>
            <Scissors className="w-5 h-5 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 Barbearia Don Bigodon - Todos os direitos reservados
          </p>
        </div>
      </footer>

      {/* Admin Panel */}
      <AdminPanel />
    </div>
  );
};

export default Index;