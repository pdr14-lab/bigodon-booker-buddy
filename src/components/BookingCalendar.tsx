import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { bookingSchema } from "@/lib/validation";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
  // Cabelos
  { id: "corte-maquina-simples", name: "Corte Máquina Simples", price: "R$ 25" },
  { id: "corte-maquina-tesoura", name: "Corte Máquina e Tesoura", price: "R$ 35" },
  { id: "corte-degrade", name: "Corte Degradê", price: "R$ 35" },
  { id: "corte-navalhado", name: "Corte Navalhado", price: "R$ 40" },
  { id: "corte-tesoura", name: "Corte Tesoura", price: "R$ 40" },
  { id: "corte-infantil", name: "Corte Infantil", price: "R$ 50" },
  { id: "pezinho", name: "Pezinho (Cantinho)", price: "R$ 20" },
  { id: "razor", name: "Razor / Risca (Listra)", price: "R$ 10" },
  { id: "sobrancelhas", name: "Sobrancelhas", price: "R$ 15" },
  // Barba e Cuidados
  { id: "barba", name: "Barba", price: "R$ 35" },
  { id: "barboterapia", name: "Barboterapia", price: "R$ 50" },
  { id: "barba-maquina", name: "Passar a Máquina na Barba", price: "R$ 20" },
  { id: "limpeza-facial", name: "Limpeza Facial", price: "R$ 30" },
  { id: "depilacao-costas", name: "Depilação Costas (Máquina)", price: "R$ 20" },
  // Tratamentos e Estilo
  { id: "selagem", name: "Selagem", price: "A partir de R$ 80" },
  { id: "lavagem", name: "Lavagem", price: "R$ 20" },
  { id: "esfoliacao", name: "Esfoliação", price: "R$ 20" },
  { id: "penteado", name: "Penteado", price: "R$ 30" },
];

export const BookingCalendar = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
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

  const toggleService = (serviceName: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceName)
        ? prev.filter((s) => s !== serviceName)
        : [...prev, serviceName]
    );
    if (errors.selectedServices) {
      setErrors({ ...errors, selectedServices: "" });
    }
  };

  const getSelectedServicesText = () => {
    if (selectedServices.length === 0) return "";
    const services = SERVICES.filter((s) => selectedServices.includes(s.name));
    return services.map((s) => s.name).join(", ");
  };

  const validateForm = () => {
    setErrors({});
    
    const result = bookingSchema.safeParse({
      clientName,
      clientPhone,
      selectedServices,
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
        service: selectedServices.join(", "),
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
      setSelectedServices([]);
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
    <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 animate-fade-in-up">
      {/* Days with bookings indicator */}
      <Card className="p-3 sm:p-4 md:p-6 bg-card border-border hover:shadow-[var(--shadow-red-glow)] transition-all duration-300">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-foreground capitalize">
            {monthName}
          </h3>
          <div className="flex gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
              disabled={currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear()}
              className="hover:bg-primary/20 hover:scale-105 transition-all duration-200 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
              className="hover:bg-primary/20 hover:scale-105 transition-all duration-200 h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
            >
              →
            </Button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
          {daysWithBookings.map((day, idx) => (
            <button
              key={day.date}
              onClick={() => setSelectedDate(day.date)}
              style={{ animationDelay: `${idx * 0.05}s` }}
              className={`flex-shrink-0 p-2 sm:p-3 rounded-lg border transition-all duration-300 animate-scale-in hover:scale-110 min-w-[70px] sm:min-w-[80px] ${
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
                <div className="text-[10px] sm:text-xs text-muted-foreground mb-1">{day.month}</div>
                <div className="text-lg sm:text-xl font-bold mb-1">{day.display}</div>
                {day.bookings > 0 ? (
                  <Badge 
                    variant={day.bookings >= day.maxSlots ? "destructive" : "secondary"}
                    className="text-[10px] sm:text-xs"
                  >
                    {day.bookings}/{day.maxSlots}
                  </Badge>
                ) : (
                  <div className="text-[10px] sm:text-xs text-muted-foreground">Livre</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-4 sm:p-6 md:p-8 bg-card border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-red-glow)] transition-all duration-500 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-foreground animate-fade-in">
          Agendar Horário
        </h2>

        <div className="space-y-4 sm:space-y-6">
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2 text-muted-foreground">
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
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-secondary border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.clientName ? "border-destructive" : "border-border"
                }`}
                placeholder="Digite seu nome completo"
              />
              {errors.clientName && (
                <p className="text-xs sm:text-sm text-destructive mt-1 animate-fade-in">{errors.clientName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2 text-muted-foreground">
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
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-secondary border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
                  errors.clientPhone ? "border-destructive" : "border-border"
                }`}
                placeholder="(00) 00000-0000"
              />
              {errors.clientPhone && (
                <p className="text-xs sm:text-sm text-destructive mt-1 animate-fade-in">{errors.clientPhone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-2 text-muted-foreground">
              Escolha os Serviços
              {selectedServices.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedServices.length} selecionado{selectedServices.length > 1 ? "s" : ""}
                </Badge>
              )}
            </label>
            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 sm:p-4 bg-secondary border rounded-lg max-h-64 overflow-y-auto ${
              errors.selectedServices ? "border-destructive" : "border-border"
            }`}>
              {SERVICES.map((service) => (
                <label
                  key={service.id}
                  className={`flex items-center gap-3 p-2 sm:p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-primary/10 ${
                    selectedServices.includes(service.name)
                      ? "bg-primary/20 border border-primary"
                      : "bg-background border border-transparent"
                  }`}
                >
                  <Checkbox
                    checked={selectedServices.includes(service.name)}
                    onCheckedChange={() => toggleService(service.name)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground truncate">
                      {service.name}
                    </p>
                    <p className="text-xs text-primary font-semibold">
                      {service.price}
                    </p>
                  </div>
                </label>
              ))}
            </div>
            {errors.selectedServices && (
              <p className="text-xs sm:text-sm text-destructive mt-1 animate-fade-in">{errors.selectedServices}</p>
            )}
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium mb-2 text-muted-foreground">
              Selecione o Dia
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
            />
          </div>

          {selectedDate && dayOfWeek === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              A barbearia está fechada aos domingos
            </div>
          )}

          {selectedDate && dayOfWeek !== 0 && (
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-2 text-muted-foreground">
                Horários Disponíveis
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                {availableHours.map((hour) => {
                  const isBooked = isTimeBooked(selectedDate, hour);
                  return (
                    <button
                      key={hour}
                      onClick={() => !isBooked && setSelectedTime(hour)}
                      disabled={isBooked}
                      className={`px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${
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
            className="w-full py-4 sm:py-5 md:py-6 text-base sm:text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-[var(--shadow-red-glow)] transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_50px_hsl(0_84%_60%_/_0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span className="text-sm sm:text-base md:text-lg">Processando...</span>
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
        description={`Deseja confirmar o agendamento para ${clientName} no dia ${selectedDate ? new Date(selectedDate + "T00:00:00").toLocaleDateString('pt-BR') : ''} às ${selectedTime}? Serviços: ${getSelectedServicesText()}`}
        confirmText="Confirmar Agendamento"
        cancelText="Revisar"
      />
    </div>
  );
};
