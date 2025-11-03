import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { bookingSchema } from "@/lib/validation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateForm = () => {
    setErrors({});
    
    const result = bookingSchema.safeParse({
      clientName,
      clientPhone,
      selectedService,
      selectedDate,
      selectedTime,
    });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        newErrors[field] = issue.message;
      });
      setErrors(newErrors);
      
      const firstError = result.error.issues[0];
      toast.error(firstError.message, {
        icon: <AlertCircle className="w-5 h-5" />,
      });
      return false;
    }

    const dayOfWeek = new Date(selectedDate + "T00:00:00").getDay();
    if (dayOfWeek === 0) {
      toast.error("A barbearia está fechada aos domingos");
      return false;
    }

    if (isTimeBooked(selectedDate, selectedTime)) {
      toast.error("Este horário já está reservado");
      return false;
    }

    return true;
  };

  const handleBookingClick = () => {
    if (validateForm()) {
      setConfirmDialogOpen(true);
    }
  };

  const confirmBooking = () => {
    setIsSubmitting(true);
    
    // Simula um pequeno delay para feedback visual
    setTimeout(() => {
      const newBooking: Booking = {
        date: selectedDate,
        time: selectedTime,
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        service: selectedService,
      };

      saveBookings([...bookings, newBooking]);
      
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <div>
            <p className="font-bold">Agendamento confirmado!</p>
            <p className="text-sm text-muted-foreground">
              {new Date(selectedDate + "T00:00:00").toLocaleDateString('pt-BR')} às {selectedTime}
            </p>
          </div>
        </div>,
        { duration: 5000 }
      );
      
      setClientName("");
      setClientPhone("");
      setSelectedService("");
      setSelectedTime("");
      setErrors({});
      setConfirmDialogOpen(false);
      setIsSubmitting(false);
    }, 800);
  };

  const availableHours = selectedDate ? getAvailableHours(selectedDate) : [];
  const dayOfWeek = selectedDate ? new Date(selectedDate + "T00:00:00").getDay() : -1;

  // Get days with booking counts for current month
  const getDaysWithBookings = () => {
    const days = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      
      // Skip past dates
      if (date < today) continue;
      
      const dateStr = date.toISOString().split("T")[0];
      const dayBookings = bookings.filter((b) => b.date === dateStr).length;
      const dayOfWeek = date.getDay();
      const maxSlots = dayOfWeek === 6 ? 11 : dayOfWeek === 0 ? 0 : 13;
      
      if (maxSlots > 0) {
        days.push({
          date: dateStr,
          display: date.getDate(),
          month: date.toLocaleDateString('pt-BR', { month: 'short' }),
          bookings: dayBookings,
          maxSlots,
          isToday: date.getTime() === today.getTime(),
        });
      }
    }
    return days;
  };

  const daysWithBookings = getDaysWithBookings();

  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    const today = new Date();
    if (newMonth >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(newMonth);
    }
  };

  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const monthName = currentMonth.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* Days with bookings indicator */}
      <Card className="p-6 bg-card border-border hover:shadow-[var(--shadow-red-glow)] transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground capitalize">
            {monthName}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
              disabled={currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear()}
              className="hover:bg-primary/20 hover:scale-105 transition-all duration-200"
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
              className="hover:bg-primary/20 hover:scale-105 transition-all duration-200"
            >
              →
            </Button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {daysWithBookings.map((day, idx) => (
            <button
              key={day.date}
              onClick={() => setSelectedDate(day.date)}
              style={{ animationDelay: `${idx * 0.05}s` }}
              className={`flex-shrink-0 p-3 rounded-lg border transition-all duration-300 animate-scale-in hover:scale-110 ${
                selectedDate === day.date
                  ? "bg-primary text-primary-foreground border-primary shadow-[var(--shadow-red-glow)] scale-110"
                  : day.bookings >= day.maxSlots
                  ? "bg-destructive/20 border-destructive/50 text-destructive cursor-not-allowed"
                  : day.bookings > 0
                  ? "bg-secondary border-border hover:border-primary hover:shadow-lg"
                  : "bg-secondary border-border hover:border-primary hover:shadow-lg"
              }`}
              disabled={day.bookings >= day.maxSlots}
            >
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">{day.month}</div>
                <div className="text-xl font-bold mb-1">{day.display}</div>
                {day.bookings > 0 ? (
                  <Badge 
                    variant={day.bookings >= day.maxSlots ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {day.bookings}/{day.maxSlots}
                  </Badge>
                ) : (
                  <div className="text-xs text-muted-foreground">Livre</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-8 bg-card border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-red-glow)] transition-all duration-500 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground animate-fade-in">
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
                onChange={(e) => {
                  setClientName(e.target.value);
                  if (errors.clientName) {
                    setErrors({ ...errors, clientName: "" });
                  }
                }}
                className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.clientName ? "border-destructive" : "border-border"
                }`}
                placeholder="Digite seu nome completo"
              />
              {errors.clientName && (
                <p className="text-sm text-destructive mt-1 animate-fade-in">{errors.clientName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Seu Telefone/WhatsApp
              </label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => {
                  setClientPhone(e.target.value);
                  if (errors.clientPhone) {
                    setErrors({ ...errors, clientPhone: "" });
                  }
                }}
                className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.clientPhone ? "border-destructive" : "border-border"
                }`}
                placeholder="(00) 00000-0000"
              />
              {errors.clientPhone && (
                <p className="text-sm text-destructive mt-1 animate-fade-in">{errors.clientPhone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-muted-foreground">
              Escolha o Serviço
            </label>
            <select
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.target.value);
                if (errors.selectedService) {
                  setErrors({ ...errors, selectedService: "" });
                }
              }}
              className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                errors.selectedService ? "border-destructive" : "border-border"
              }`}
            >
              <option value="">Selecione um serviço</option>
              {SERVICES.map((service) => (
                <option key={service.id} value={service.name}>
                  {service.name} - {service.price}
                </option>
              ))}
            </select>
            {errors.selectedService && (
              <p className="text-sm text-destructive mt-1 animate-fade-in">{errors.selectedService}</p>
            )}
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
                      className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
                        isBooked
                          ? "bg-destructive/20 text-destructive/60 cursor-not-allowed line-through"
                          : selectedTime === hour
                          ? "bg-primary text-primary-foreground shadow-[var(--shadow-red-glow)] animate-pulse-glow scale-105"
                          : "bg-secondary text-foreground hover:bg-primary/20 hover:border-primary hover:shadow-lg border border-border"
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
            onClick={handleBookingClick}
            disabled={isSubmitting}
            className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-red-glow)] transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_50px_hsl(0_84%_60%_/_0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Processando...
              </span>
            ) : (
              "Reservar Horário"
            )}
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={confirmBooking}
        title="Confirmar Agendamento"
        description={`Deseja confirmar o agendamento para ${clientName} no dia ${new Date(selectedDate + "T00:00:00").toLocaleDateString('pt-BR')} às ${selectedTime}?`}
        confirmText="Confirmar Agendamento"
        cancelText="Revisar"
      />
    </div>
  );
};
