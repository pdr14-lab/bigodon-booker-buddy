import { BookingCalendar } from "@/components/BookingCalendar";
import { AdminPanel } from "@/components/AdminPanel";
import { ServicesSection } from "@/components/ServicesSection";
import { AboutSection } from "@/components/AboutSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ContactSection } from "@/components/ContactSection";
import { Scissors, Clock, MapPin } from "lucide-react";
import heroImage from "@/assets/barber-hero.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <header className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden border-b-2 sm:border-b-4 border-primary animate-fade-in">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
        </div>
        
        <div className="relative z-10 text-center px-4">
          <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4 animate-bounce-in">
            <svg 
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 14c0-2.5 2-4 4-4s3 1 4 2c1-1 2-2 4-2s4 1.5 4 4c0 3-2 5-4 5s-3-1-4-2c-1 1-2 2-4 2s-4-2-4-5z" />
              <path d="M7 10c1.5 0 2.5-1.5 2.5-3S8.5 4 7 4 4.5 5.5 4.5 7 5.5 10 7 10zm10 0c-1.5 0-2.5-1.5-2.5-3S15.5 4 17 4s2.5 1.5 2.5 3-1 3-2.5 3z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-wider mb-2 sm:mb-4 text-foreground drop-shadow-[0_0_20px_rgba(220,38,38,0.5)] animate-fade-in-up">
            DON BIGODON
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-light tracking-wide animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            Tradição, Estilo e Atitude
          </p>
        </div>
      </header>

      {/* Info Section */}
      <section className="py-8 sm:py-10 md:py-12 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4 animate-fade-in-up">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
            <div className="text-center p-4 sm:p-6 bg-card rounded-lg border border-border hover:border-primary transition-all duration-300 hover:shadow-[var(--shadow-red-glow)] hover:scale-105 animate-slide-in-right">
              <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-primary mx-auto mb-2 sm:mb-3" />
              <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-foreground">Horários</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Seg-Sex: 08h - 20h</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Sáb: 08h - 18h</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Dom: Fechado</p>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-card rounded-lg border border-border hover:border-primary transition-all duration-300 hover:shadow-[var(--shadow-red-glow)] hover:scale-105 animate-scale-in" style={{ animationDelay: "0.2s" }}>
              <Scissors className="w-8 h-8 sm:w-10 sm:h-10 text-primary mx-auto mb-2 sm:mb-3" />
              <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-foreground">Serviços</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Corte tradicional</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Barba & Bigode</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Tratamentos</p>
            </div>
            
            <div className="text-center p-4 sm:p-6 bg-card rounded-lg border border-border hover:border-primary transition-all duration-300 hover:shadow-[var(--shadow-red-glow)] hover:scale-105 animate-slide-in-left sm:col-span-2 md:col-span-1" style={{ animationDelay: "0.4s" }}>
              <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-primary mx-auto mb-2 sm:mb-3" />
              <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2 text-foreground">Localização</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Centro da cidade</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Atendimento com hora marcada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* About Section */}
      <AboutSection />

      {/* Booking Section */}
      <section id="agendamento" className="py-8 sm:py-12 md:py-16 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto">
          <BookingCalendar />
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <footer className="bg-secondary/50 border-t-2 sm:border-t-4 border-primary py-6 sm:py-8 mt-8 sm:mt-12 md:mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
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
