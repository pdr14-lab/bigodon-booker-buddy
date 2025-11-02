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
      <header className="relative h-[70vh] flex items-center justify-center overflow-hidden border-b-4 border-primary">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
        </div>
        
        <div className="relative z-10 text-center px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scissors className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-wider mb-4 text-foreground drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]">
            DON BIGODON
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light tracking-wide">
            Tradição, Estilo e Atitude
          </p>
        </div>
      </header>

      {/* Info Section */}
      <section className="py-12 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-card rounded-lg border border-border hover:border-primary transition-all duration-300 hover:shadow-[var(--shadow-red-glow)]">
              <Clock className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2 text-foreground">Horários</h3>
              <p className="text-sm text-muted-foreground">Seg-Sex: 08h - 20h</p>
              <p className="text-sm text-muted-foreground">Sáb: 08h - 18h</p>
              <p className="text-sm text-muted-foreground">Dom: Fechado</p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg border border-border hover:border-primary transition-all duration-300 hover:shadow-[var(--shadow-red-glow)]">
              <Scissors className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2 text-foreground">Serviços</h3>
              <p className="text-sm text-muted-foreground">Corte tradicional</p>
              <p className="text-sm text-muted-foreground">Barba & Bigode</p>
              <p className="text-sm text-muted-foreground">Tratamentos</p>
            </div>
            
            <div className="text-center p-6 bg-card rounded-lg border border-border hover:border-primary transition-all duration-300 hover:shadow-[var(--shadow-red-glow)]">
              <MapPin className="w-10 h-10 text-primary mx-auto mb-3" />
              <h3 className="font-bold text-lg mb-2 text-foreground">Localização</h3>
              <p className="text-sm text-muted-foreground">Centro da cidade</p>
              <p className="text-sm text-muted-foreground">Atendimento com hora marcada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* About Section */}
      <AboutSection />

      {/* Booking Section */}
      <section id="agendamento" className="py-16 px-4 bg-gradient-to-b from-background to-secondary/20">
        <div className="container mx-auto">
          <BookingCalendar />
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Section */}
      <ContactSection />

      {/* Footer */}
      <footer className="bg-secondary/50 border-t-4 border-primary py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
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
