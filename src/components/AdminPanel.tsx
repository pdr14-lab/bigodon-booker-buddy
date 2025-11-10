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
    // Cabelos
    { name: "Corte Máquina Simples", price: 25 },
    { name: "Corte Máquina e Tesoura", price: 35 },
    { name: "Corte Degradê", price: 35 },
    { name: "Corte Navalhado", price: 40 },
    { name: "Corte Tesoura", price: 40 },
    { name: "Corte Infantil", price: 50 },
    { name: "Pezinho (Cantinho)", price: 20 },
    { name: "Razor / Risca (Listra)", price: 10 },
    { name: "Sobrancelhas", price: 15 },
    // Barba e Cuidados
    { name: "Barba", price: 35 },
    { name: "Barboterapia", price: 50 },
    { name: "Passar a Máquina na Barba", price: 20 },
    { name: "Limpeza Facial", price: 30 },
    { name: "Depilação Costas (Máquina)", price: 20 },
    // Tratamentos e Estilo
    { name: "Selagem", price: 80 },
    { name: "Lavagem", price: 20 },
    { name: "Esfoliação", price: 20 },
    { name: "Penteado", price: 30 },
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
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="p-3 sm:p-4 bg-primary/90 rounded-full hover:bg-primary transition-all shadow-lg hover:shadow-xl hover:scale-110"
          title="Painel Admin"
          aria-label="Abrir Painel Admin"
        >
          <Scissors className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="min-h-screen flex items-start sm:items-center justify-center p-3 sm:p-4 md:p-6">
        <Card className="w-full max-w-5xl my-4 sm:my-8 p-4 sm:p-6 md:p-8 bg-card border-border">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-foreground">Painel Administrativo</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsOpen(false);
                setIsAuthenticated(false);
                setPassword("");
              }}
              className="text-muted-foreground hover:text-foreground -mr-2"
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
              <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6">
                <TabsTrigger value="stats" className="text-xs sm:text-sm">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Estatísticas</span>
                  <span className="sm:hidden">Stats</span>
                </TabsTrigger>
                <TabsTrigger value="day" className="text-xs sm:text-sm">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Por Dia</span>
                  <span className="sm:hidden">Dia</span>
                </TabsTrigger>
                <TabsTrigger value="all" className="text-xs sm:text-sm">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Todos</span>
                  <span className="sm:hidden">Todos</span>
                </TabsTrigger>
              </TabsList>

              {/* Statistics Tab */}
              <TabsContent value="stats" className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <Card className="p-3 sm:p-4 bg-secondary border-border">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{stats.total}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Agendamentos</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-3 sm:p-4 bg-secondary border-border">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{stats.today}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">Hoje</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-3 sm:p-4 bg-secondary border-border">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-base sm:text-xl md:text-2xl font-bold text-foreground truncate">R$ {stats.totalRevenue}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">Receita Prevista</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-3 sm:p-4 bg-secondary border-border">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{stats.daysWithBookings}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">Dias Agendados</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-4 sm:p-6 bg-secondary border-border">
                  <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4 text-foreground">Por Serviço</h3>
                  <div className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
                    {stats.byService.filter(s => s.count > 0).map((service) => (
                      <div key={service.name} className="flex justify-between items-center gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base text-foreground truncate">{service.name}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {service.count} agendamento{service.count !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-primary flex-shrink-0 text-xs sm:text-sm">
                          R$ {service.revenue}
                        </Badge>
                      </div>
                    ))}
                    {stats.byService.every(s => s.count === 0) && (
                      <p className="text-center text-muted-foreground text-sm py-4">Nenhum agendamento ainda</p>
                    )}
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
              <TabsContent value="day" className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2 text-muted-foreground">
                    Selecione o dia:
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-secondary border border-border rounded-lg text-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-sm sm:text-lg text-foreground">
                    Agendamentos em {new Date(selectedDate + "T00:00:00").toLocaleDateString('pt-BR')} ({getTodayBookings().length})
                  </h3>
                  <div className="max-h-[500px] overflow-y-auto space-y-3">
                    {getTodayBookings().length === 0 ? (
                      <p className="text-muted-foreground text-center py-8 text-sm">
                        Nenhum agendamento para este dia
                      </p>
                    ) : (
                      getTodayBookings().map((booking, idx) => (
                        <Card
                          key={idx}
                          className="p-3 sm:p-4 bg-secondary border-border"
                        >
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                            <div className="flex-1 min-w-0 w-full">
                              <p className="font-bold text-lg sm:text-xl text-foreground mb-2">{booking.time}</p>
                              <div className="space-y-1">
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  <span className="font-medium text-foreground">Cliente:</span> {booking.clientName}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground break-all">
                                  <span className="font-medium text-foreground">Telefone:</span> {booking.clientPhone}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  <span className="font-medium text-foreground">Serviço:</span> {booking.service}
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={() => initiateDeleteBooking(booking.date, booking.time)}
                              variant="destructive"
                              size="sm"
                              className="hover:scale-105 transition-all w-full sm:w-auto flex-shrink-0"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* All Bookings Tab */}
              <TabsContent value="all" className="space-y-4 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar por nome ou telefone..."
                      className="w-full pl-10 pr-4 py-2 sm:py-3 bg-secondary border border-border rounded-lg text-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <select
                    value={filterService}
                    onChange={(e) => setFilterService(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-secondary border border-border rounded-lg text-foreground text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary"
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
                  <h3 className="font-semibold text-sm sm:text-lg text-foreground sticky top-0 bg-card py-2 z-10">
                    Todos os Agendamentos Futuros ({allBookings.length})
                  </h3>
                  {allBookings.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8 text-sm">
                      Nenhum agendamento encontrado
                    </p>
                  ) : (
                    allBookings.map((booking, idx) => (
                      <Card
                        key={idx}
                        className="p-3 sm:p-4 bg-secondary border-border"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                          <div className="flex-1 min-w-0 w-full">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-primary border-primary text-xs">
                                {new Date(booking.date + "T00:00:00").toLocaleDateString('pt-BR')}
                              </Badge>
                              <p className="font-bold text-base sm:text-lg text-foreground">{booking.time}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Cliente:</span> {booking.clientName}
                              </p>
                              <p className="text-xs sm:text-sm text-muted-foreground break-all">
                                <span className="font-medium text-foreground">Telefone:</span> {booking.clientPhone}
                              </p>
                              <p className="text-xs sm:text-sm text-muted-foreground">
                                <span className="font-medium text-foreground">Serviço:</span> {booking.service}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => initiateDeleteBooking(booking.date, booking.time)}
                            variant="destructive"
                            size="sm"
                            className="hover:scale-105 transition-all w-full sm:w-auto flex-shrink-0"
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
    </div>
  );
};
