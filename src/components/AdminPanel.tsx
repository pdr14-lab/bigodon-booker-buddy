import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors } from "lucide-react";

interface Booking {
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  service: string;
}

export const AdminPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const ADMIN_PASSWORD = "bigodon123";

  useEffect(() => {
    if (isAuthenticated) {
      const stored = localStorage.getItem("donBigodonBookings");
      if (stored) {
        setBookings(JSON.parse(stored));
      }
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPassword("");
    } else {
      alert("Senha incorreta");
      setPassword("");
    }
  };

  const getTodayBookings = () => {
    return bookings
      .filter((b) => b.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const deleteBooking = (date: string, time: string) => {
    const updated = bookings.filter((b) => !(b.date === date && b.time === time));
    localStorage.setItem("donBigodonBookings", JSON.stringify(updated));
    setBookings(updated);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setIsOpen(true)}
          className="p-3 bg-secondary rounded-full hover:bg-primary/20 transition-all opacity-30 hover:opacity-100"
          title="Painel Admin"
        >
          <Scissors className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-card border-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Painel Admin</h2>
          <Button
            variant="ghost"
            onClick={() => {
              setIsOpen(false);
              setIsAuthenticated(false);
              setPassword("");
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </Button>
        </div>

        {!isAuthenticated ? (
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              placeholder="Digite a senha"
              className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              onClick={handleLogin}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Entrar
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-muted-foreground">
                Ver agendamentos do dia:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-foreground">
                Agendamentos ({getTodayBookings().length})
              </h3>
              {getTodayBookings().length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum agendamento para este dia
                </p>
              ) : (
                getTodayBookings().map((booking, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-secondary rounded-lg border border-border space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-bold text-lg text-foreground">{booking.time}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium text-foreground">Cliente:</span> {booking.clientName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Telefone:</span> {booking.clientPhone}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Serviço:</span> {booking.service}
                        </p>
                      </div>
                      <Button
                        onClick={() => deleteBooking(booking.date, booking.time)}
                        variant="destructive"
                        size="sm"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
