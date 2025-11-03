import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Scissors, Calendar, TrendingUp, Users, DollarSign, Trash2, Search, AlertCircle } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<{ date: string; time: string } | null>(null);

  const ADMIN_PASSWORD = "bigodon123";

  const SERVICES = [
    { name: "Corte Tradicional", price: 40 },
    { name: "Barba & Bigode", price: 35 },
    { name: "Corte + Barba", price: 65 },
    { name: "Tratamento Capilar", price: 50 },
  ];

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
      toast.success("Login realizado com sucesso!");
    } else {
      toast.error("Senha incorreta", {
        icon: <AlertCircle className="w-5 h-5" />,
      });
      setPassword("");
    }
  };

  const getTodayBookings = () => {
    return bookings
      .filter((b) => b.date === selectedDate)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const initiateDeleteBooking = (date: string, time: string) => {
    setBookingToDelete({ date, time });
    setDeleteDialogOpen(true);
  };

  const confirmDeleteBooking = () => {
    if (bookingToDelete) {
      const updated = bookings.filter(
        (b) => !(b.date === bookingToDelete.date && b.time === bookingToDelete.time)
      );
      localStorage.setItem("donBigodonBookings", JSON.stringify(updated));
      setBookings(updated);
      toast.success("Agendamento cancelado com sucesso!");
      setDeleteDialogOpen(false);
      setBookingToDelete(null);
    }
  };

  const initiateClearOldBookings = () => {
    setClearDialogOpen(true);
  };

  const confirmClearOldBookings = () => {
    const today = new Date().toISOString().split("T")[0];
    const updated = bookings.filter((b) => b.date >= today);
    const removedCount = bookings.length - updated.length;
    localStorage.setItem("donBigodonBookings", JSON.stringify(updated));
    setBookings(updated);
    toast.success(`${removedCount} agendamento(s) antigo(s) removido(s)`);
    setClearDialogOpen(false);
  };

  // Statistics
  const getStats = () => {
    const today = new Date().toISOString().split("T")[0];
    const futureBookings = bookings.filter((b) => b.date >= today);
    
    const byService = SERVICES.map((service) => ({
      name: service.name,
      count: futureBookings.filter((b) => b.service === service.name).length,
      revenue: futureBookings.filter((b) => b.service === service.name).length * service.price,
    }));

    const totalRevenue = byService.reduce((sum, s) => sum + s.revenue, 0);

    const uniqueDates = new Set(futureBookings.map((b) => b.date));

    return {
      total: futureBookings.length,
      today: bookings.filter((b) => b.date === today).length,
      byService,
      totalRevenue,
      daysWithBookings: uniqueDates.size,
    };
  };

  const stats = getStats();

  // All future bookings sorted
  const getAllBookings = () => {
    const today = new Date().toISOString().split("T")[0];
    let filtered = bookings.filter((b) => b.date >= today);
    
    if (searchTerm) {
      filtered = filtered.filter((b) =>
        b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.clientPhone.includes(searchTerm)
      );
    }
    
    if (filterService) {
      filtered = filtered.filter((b) => b.service === filterService);
    }
    
    return filtered.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      return dateCompare !== 0 ? dateCompare : a.time.localeCompare(b.time);
    });
  };

  const allBookings = getAllBookings();

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
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-5xl my-8 p-8 bg-card border-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">Painel Administrativo</h2>
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
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="stats">
                <TrendingUp className="w-4 h-4 mr-2" />
                Estatísticas
              </TabsTrigger>
              <TabsTrigger value="day">
                <Calendar className="w-4 h-4 mr-2" />
                Por Dia
              </TabsTrigger>
              <TabsTrigger value="all">
                <Users className="w-4 h-4 mr-2" />
                Todos
              </TabsTrigger>
            </TabsList>

            {/* Statistics Tab */}
            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-secondary border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                      <p className="text-xs text-muted-foreground">Agendamentos</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 bg-secondary border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.today}</p>
                      <p className="text-xs text-muted-foreground">Hoje</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-secondary border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">R$ {stats.totalRevenue}</p>
                      <p className="text-xs text-muted-foreground">Receita Prevista</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4 bg-secondary border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.daysWithBookings}</p>
                      <p className="text-xs text-muted-foreground">Dias com Agenda</p>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6 bg-secondary border-border">
                <h3 className="font-bold text-lg mb-4 text-foreground">Por Serviço</h3>
                <div className="space-y-3">
                  {stats.byService.map((service) => (
                    <div key={service.name} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-foreground">{service.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {service.count} agendamento{service.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-primary">
                        R$ {service.revenue}
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              <Button
                onClick={initiateClearOldBookings}
                variant="outline"
                className="w-full hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-all"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar Agendamentos Passados
              </Button>
            </TabsContent>

            {/* Day View Tab */}
            <TabsContent value="day" className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-muted-foreground">
                  Selecione o dia:
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
                  Agendamentos em {new Date(selectedDate + "T00:00:00").toLocaleDateString('pt-BR')} ({getTodayBookings().length})
                </h3>
                {getTodayBookings().length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhum agendamento para este dia
                  </p>
                ) : (
                  getTodayBookings().map((booking, idx) => (
                    <Card
                      key={idx}
                      className="p-4 bg-secondary border-border"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-bold text-xl text-foreground mb-2">{booking.time}</p>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">Cliente:</span> {booking.clientName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">Telefone:</span> {booking.clientPhone}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">Serviço:</span> {booking.service}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => initiateDeleteBooking(booking.date, booking.time)}
                          variant="destructive"
                          size="sm"
                          className="hover:scale-105 transition-all"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            {/* All Bookings Tab */}
            <TabsContent value="all" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nome ou telefone..."
                    className="w-full pl-10 pr-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <select
                  value={filterService}
                  onChange={(e) => setFilterService(e.target.value)}
                  className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Todos os serviços</option>
                  {SERVICES.map((service) => (
                    <option key={service.name} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                <h3 className="font-semibold text-lg text-foreground sticky top-0 bg-card py-2">
                  Todos os Agendamentos Futuros ({allBookings.length})
                </h3>
                {allBookings.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhum agendamento encontrado
                  </p>
                ) : (
                  allBookings.map((booking, idx) => (
                    <Card
                      key={idx}
                      className="p-4 bg-secondary border-border"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline" className="text-primary border-primary">
                              {new Date(booking.date + "T00:00:00").toLocaleDateString('pt-BR')}
                            </Badge>
                            <p className="font-bold text-lg text-foreground">{booking.time}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">Cliente:</span> {booking.clientName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">Telefone:</span> {booking.clientPhone}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              <span className="font-medium text-foreground">Serviço:</span> {booking.service}
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={() => initiateDeleteBooking(booking.date, booking.time)}
                          variant="destructive"
                          size="sm"
                          className="hover:scale-105 transition-all"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDeleteBooking}
          title="Cancelar Agendamento"
          description="Deseja realmente cancelar este agendamento? Esta ação não pode ser desfeita."
          confirmText="Sim, cancelar"
          cancelText="Não, manter"
          variant="destructive"
        />

        <ConfirmDialog
          open={clearDialogOpen}
          onOpenChange={setClearDialogOpen}
          onConfirm={confirmClearOldBookings}
          title="Limpar Agendamentos Passados"
          description="Deseja realmente remover todos os agendamentos de datas passadas? Esta ação não pode ser desfeita."
          confirmText="Sim, limpar"
          cancelText="Cancelar"
          variant="destructive"
        />
      </Card>
    </div>
  );
};
