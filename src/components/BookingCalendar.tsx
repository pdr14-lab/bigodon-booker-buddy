import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { bookingSchema } from "@/lib/validation";
import { supabase } from "@/integrations/supabase/client";

interface Booking {
  id: string;
  date: string;
  time: string;
  client_name: string;
  client_phone: string;
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
  { id: "corte-maquina-simples", name: "Corte Máquina Simples", price: "R$ 25" },
  { id: "corte-maquina-tesoura", name: "Corte Máquina e Tesoura", price: "R$ 35" },
  { id: "corte-degrade", name: "Corte Degradê", price: "R$ 35" },
  { id: "corte-navalhado", name: "Corte Navalhado", price: "R$ 40" },
  { id: "corte-tesoura", name: "Corte Tesoura", price: "R$ 40" },
  { id: "corte-infantil", name: "Corte Infantil", price: "R$ 50" },
  { id: "pezinho", name: "Pezinho (Cantinho)", price: "R$ 20" },
  { id: "razor", name: "Razor / Risca (Listra)", price: "R$ 10" },
  { id: "sobrancelhas", name: "Sobrancelhas", price: "R$ 15" },
  { id: "barba", name: "Barba", price: "R$ 35" },
  { id: "barboterapia", name: "Barboterapia", price: "R$ 50" },
  { id: "barba-maquina", name: "Passar a Máquina na Barba", price: "R$ 20" },
  { id: "limpeza-facial", name: "Limpeza Facial", price: "R$ 30" },
  { id: "depilacao-costas", name: "Depilação Costas (Máquina)", price: "R$ 20" },
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
  const [selectedService, setSelectedService] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*");

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error loading bookings:", error);
    }
  };

  const getAvailableHours = (date: string) => {
    const dayOfWeek = new Date(date + "T00:00:00").getDay();
    if (dayOfWeek === 0) return [];
    if (dayOfWeek === 6) return HOURS_SATURDAY;
    return HOURS_WEEKDAY;
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
      return false;
    }

    if (isTimeBooked(selectedDate, selectedTime)) {
      toast.error("Este horário já está reservado", {
        description: "Por favor, escolha outro horário",
      });
      return false;
    }

    return true;
  };

  const handleBookingClick = () => {
    if (!validateForm()) {
      return;
    }
    setConfirmDialogOpen(true);
  };

  const confirmBooking = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        date: selectedDate,
        time: selectedTime,
        client_name: clientName,
        client_phone: clientPhone,
        service: selectedService,
      });

      if (error) throw error;

      await loadBookings();
      setConfirmDialogOpen(false);
      toast.success("Agendamento confirmado com sucesso!", {
        description: `${clientName} - ${selectedTime}`,
      });

      setClientName("");
      setClientPhone("");
      setSelectedService("");
      setSelectedDate("");
      setSelectedTime("");
      setErrors({});
    } catch (error: any) {
      toast.error("Erro ao confirmar agendamento");
      console.error("Error creating booking:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDaysWithBookings = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const counts: Record<string, number> = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      counts[date] = bookings.filter((b) => b.date === date).length;
    }

    return counts;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getMonthName = () => {
    return currentMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const bookingCounts = getDaysWithBookings();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const count = bookingCounts[date] || 0;
      const dayDate = new Date(year, month, day);
      const isPastDate = dayDate < today;
      const isSelected = selectedDate === date;
      const dayOfWeek = dayDate.getDay();
      const isSunday = dayOfWeek === 0;

      days.push(
        <button
          key={day}
          onClick={() => !isPastDate && !isSunday && setSelectedDate(date)}
          disabled={isPastDate || isSunday}
          className={`aspect-square p-2 rounded-lg transition-all ${
            isSelected
              ? "bg-amber-600 text-white shadow-lg scale-105"
              : isPastDate || isSunday
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white hover:bg-amber-50 hover:shadow-md"
          } ${count > 0 ? "ring-2 ring-amber-200" : ""}`}
        >
          <div className="text-sm font-semibold">{day}</div>
          {count > 0 && !isPastDate && (
            <div className="text-xs mt-1">
              <Badge variant="secondary" className="text-xs px-1 py-0">
                {count}
              </Badge>
            </div>
          )}
          {isSunday && <div className="text-xs text-gray-400">Fechado</div>}
        </button>
      );
    }

    return days;
  };

  const availableHours = selectedDate ? getAvailableHours(selectedDate) : [];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ←
          </button>
          <h2 className="text-xl font-bold capitalize">{getMonthName()}</h2>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-600">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">{renderCalendar()}</div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Horários Disponíveis</h3>
          {!selectedDate ? (
            <p className="text-gray-500">Selecione uma data no calendário</p>
          ) : availableHours.length === 0 ? (
            <p className="text-gray-500">Fechado neste dia</p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {availableHours.map((time) => {
                const booked = isTimeBooked(selectedDate, time);
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    onClick={() => !booked && setSelectedTime(time)}
                    disabled={booked}
                    className={`p-3 rounded-lg text-sm font-medium transition-all ${
                      isSelected
                        ? "bg-amber-600 text-white shadow-lg"
                        : booked
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border-2 border-gray-200 hover:border-amber-600 hover:bg-amber-50"
                    }`}
                  >
                    {time}
                    {booked && <span className="block text-xs mt-1">Reservado</span>}
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Seus Dados</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome Completo</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className={`w-full p-2 border rounded-lg ${errors.clientName ? "border-red-500" : ""}`}
                placeholder="Digite seu nome"
              />
              {errors.clientName && (
                <p className="text-red-500 text-xs mt-1">{errors.clientName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className={`w-full p-2 border rounded-lg ${errors.clientPhone ? "border-red-500" : ""}`}
                placeholder="(00) 00000-0000"
              />
              {errors.clientPhone && (
                <p className="text-red-500 text-xs mt-1">{errors.clientPhone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Serviço</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className={`w-full p-2 border rounded-lg ${errors.selectedService ? "border-red-500" : ""}`}
              >
                <option value="">Selecione um serviço</option>
                {SERVICES.map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name} - {service.price}
                  </option>
                ))}
              </select>
              {errors.selectedService && (
                <p className="text-red-500 text-xs mt-1">{errors.selectedService}</p>
              )}
            </div>

            {selectedDate && (
              <div className="text-sm text-gray-600">
                Data: {new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR")}
              </div>
            )}
            {selectedTime && <div className="text-sm text-gray-600">Horário: {selectedTime}</div>}

            <Button
              onClick={handleBookingClick}
              disabled={!selectedDate || !selectedTime || !clientName || !clientPhone || !selectedService}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              Agendar Horário
            </Button>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmDialogOpen}
        onOpenChange={setConfirmDialogOpen}
        onConfirm={confirmBooking}
        title="Confirmar Agendamento"
        description={`Confirmar agendamento para ${clientName} em ${
          selectedDate ? new Date(selectedDate + "T00:00:00").toLocaleDateString("pt-BR") : ""
        } às ${selectedTime}?`}
      />
    </div>
  );
};
