import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";
import { Card } from "@/components/ui/card";

export const ContactSection = () => {
  return (
    <section className="py-16 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-foreground">
            Venha Nos Visitar
          </h2>
          <p className="text-xl text-muted-foreground">
            Estamos te esperando para um atendimento de primeira
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-[var(--shadow-red-glow)] animate-slide-in-right">
            <h3 className="text-2xl font-bold mb-6 text-foreground">
              Informações de Contato
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Endereço</h4>
                  <p className="text-muted-foreground">
                    Rua Principal, 123 - Centro<br />
                    São Paulo - SP, 01234-567
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Telefone/WhatsApp</h4>
                  <p className="text-muted-foreground">
                    (11) 98765-4321<br />
                    (11) 3456-7890
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">E-mail</h4>
                  <p className="text-muted-foreground">
                    contato@donbigodon.com.br
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="font-bold text-foreground mb-3">Redes Sociais</h4>
                <div className="flex gap-4">
                  <a
                    href="#"
                    className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:scale-110 transition-all duration-300"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-card border-border hover:border-primary transition-all duration-300 hover:shadow-[var(--shadow-red-glow)] animate-slide-in-left">
            <h3 className="text-2xl font-bold mb-6 text-foreground">
              Localização
            </h3>
            <div className="aspect-video bg-secondary/50 rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.0983!2d-46.6333!3d-23.5505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzAxLjgiUyA0NsKwMzcnNTkuOSJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Don Bigodon"
              ></iframe>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
