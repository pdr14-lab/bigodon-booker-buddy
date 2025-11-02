import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Booking {
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  service: string;
}

const HOURS_WEEKDAY = Array.from({ length: 13 }, (_, i) => {
  const hour = i + 8;
  return `${hour.toString().padStart(2, "0")}:00`;
});

const HOURS_SATURDAY = Array.from({ length: 11 }, (_, i) => {
  const hour = i + 8;
  return `${hour.toString().padStart(2, "0")}:00`;
});

const SERVICES = [
  { id: "corte", name: "Corte Tradicional", price: "R$ 40" },
  { id: "barba", name: "Barba & Bigode", price: "R$ 35" },
  { id: "combo", name: "Corte + Barba", price: "R$ 65" },
  { id: "tratamento", name: "Tratamento Capilar", price: "R$ 50" },
];

export const BookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("donBigodonBookings");
    if (stored) {
      setBookings(JSON.parse(stored));
    }
  }, []);

  const saveBookings = (newBookings: Booking[]) => {
    localStorage.setItem("donBigodonBookings", JSON.stringify(newBookings));
    setBookings(newBookings);
  };

  const getAvailableHours = (date: string) => {
    const dayOfWeek = new Date(date + "T00:00:00").getDay();
    if (dayOfWeek === 0) return []; // Domingo fechado
    if (dayOfWeek === 6) return HOURS_SATURDAY; // Sábado até 18h
    return HOURS_WEEKDAY; // Segunda a sexta até 20h
  };

  const isTimeBooked = (date: string, time: string) => {
    return bookings.some((b) => b.date === date && b.time === time);
  };

  const handleBooking = () => {
    if (!selectedDate) {
      toast.error("Selecione uma data");
      return;
    }
    if (!selectedTime) {
      toast.error("Selecione um horário");
      return;
    }
    if (!clientName.trim()) {
      toast.error("Digite seu nome");
      return;
    }
    if (!clientPhone.trim()) {
      toast.error("Digite seu telefone");
      return;
    }
    if (!selectedService) {
      toast.error("Selecione um serviço");
      return;
    }

    const dayOfWeek = new Date(selectedDate + "T00:00:00").getDay();
    if (dayOfWeek === 0) {
      toast.error("A barbearia está fechada aos domingos");
      return;
    }

    if (isTimeBooked(selectedDate, selectedTime)) {
      toast.error("Este horário já está reservado");
      return;
    }

    const newBooking: Booking = {
      date: selectedDate,
      time: selectedTime,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      service: selectedService,
    };

    saveBookings([...bookings, newBooking]);
    toast.success("Horário reservado com sucesso!");
    setClientName("");
    setClientPhone("");
    setSelectedService("");
    setSelectedTime("");
  };

  const availableHours = selectedDate ? getAvailableHours(selectedDate) : [];
  const dayOfWeek = selectedDate ? new Date(selectedDate + "T00:00:00").getDay() : -1;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <Card className="p-8 bg-card border-border shadow-[var(--shadow-card)]">
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
          Agendar Horário
        </h2>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Seu Nome
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Digite seu nome completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Seu Telefone/WhatsApp
              </label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Escolha o Serviço
            </label>
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="">Selecione um serviço</option>
              {SERVICES.map((service) => (
                <option key={service.id} value={service.name}>
                  {service.name} - {service.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Selecione o Dia
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {selectedDate && dayOfWeek === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              A barbearia está fechada aos domingos
            </div>
          )}

          {selectedDate && dayOfWeek !== 0 && (
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Horários Disponíveis
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {availableHours.map((hour) => {
                  const isBooked = isTimeBooked(selectedDate, hour);
                  return (
                    <button
                      key={hour}
                      onClick={() => !isBooked && setSelectedTime(hour)}
                      disabled={isBooked}
                      className={`px-4 py-3 rounded-lg font-medium transition-all ${
                        isBooked
                          ? "bg-destructive/20 text-destructive/60 cursor-not-allowed line-through"
                          : selectedTime === hour
                          ? "bg-primary text-primary-foreground shadow-[var(--shadow-red-glow)]"
                          : "bg-secondary text-foreground hover:bg-primary/20 hover:border-primary border border-border"
                      }`}
                    >
                      {hour}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <Button
            onClick={handleBooking}
            className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-red-glow)] transition-all"
          >
            Reservar Horário
          </Button>
        </div>
      </Card>
    </div>
  );
};
