import { useState, useEffect } from "react";
import { Calendar, Search, Trash2, LogOut, Scissors } from "lucide-react";
import { format, isPast, startOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ConfirmDialog } from "./ConfirmDialog";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";

interface Booking {
  id: string;
  date: string;
  time: string;
  client_name: string;
  client_phone: string;
  service: string;
  created_at: string;
}

const SERVICES = [
  { name: "Corte Máquina Simples", price: 25 },
  { name: "Corte Máquina e Tesoura", price: 35 },
  { name: "Corte Degradê", price: 35 },
  { name: "Corte Navalhado", price: 40 },
  { name: "Corte Tesoura", price: 40 },
  { name: "Corte Infantil", price: 50 },
  { name: "Pezinho (Cantinho)", price: 20 },
  { name: "Razor / Risca (Listra)", price: 10 },
  { name: "Sobrancelhas", price: 15 },
  { name: "Barba", price: 35 },
  { name: "Barboterapia", price: 50 },
  { name: "Passar a Máquina na Barba", price: 20 },
  { name: "Limpeza Facial", price: 30 },
  { name: "Depilação Costas (Máquina)", price: 20 },
  { name: "Selagem", price: 80 },
  { name: "Lavagem", price: 20 },
  { name: "Esfoliação", price: 20 },
  { name: "Penteado", price: 30 },
];

export const AdminPanel = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadBookings();
    }
  }, [isAdmin]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      setUser(session.user);

      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError) {
        console.error("Error checking role:", roleError);
        toast.error("Access denied: Not an admin");
        navigate("/");
        return;
      }

      if (!roleData) {
        toast.error("Access denied: Admin role required");
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Auth error:", error);
      navigate("/auth");
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("date", { ascending: true })
        .order("time", { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast.error("Failed to load bookings");
      console.error("Error loading bookings:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setBookings(bookings.filter((b) => b.id !== id));
      toast.success("Agendamento excluído com sucesso!");
    } catch (error) {
      toast.error("Erro ao excluir agendamento");
    }
    setDeleteDialogOpen(false);
    setBookingToDelete(null);
  };

  const handleClearPastBookings = async () => {
    const today = format(startOfDay(new Date()), "yyyy-MM-dd");
    const pastBookings = bookings.filter((b) => b.date < today);

    if (pastBookings.length === 0) {
      toast.info("Não há agendamentos passados para limpar");
      return;
    }

    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .lt("date", today);

      if (error) throw error;

      setBookings(bookings.filter((b) => b.date >= today));
      toast.success(`${pastBookings.length} agendamentos passados removidos`);
    } catch (error) {
      toast.error("Erro ao limpar agendamentos passados");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Scissors className="w-12 h-12 text-amber-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const todayBookings = bookings.filter((b) => b.date === format(new Date(), "yyyy-MM-dd"));
  const futureBookings = bookings.filter((b) => !isPast(startOfDay(new Date(b.date))));
  const totalRevenue = bookings.reduce((sum, booking) => {
    const service = SERVICES.find((s) => s.name === booking.service);
    return sum + (service?.price || 0);
  }, 0);

  const serviceStats = bookings.reduce(
    (acc, booking) => {
      acc[booking.service] = (acc[booking.service] || 0) + 1;
      return acc;
    },
    {} as { [key: string]: number }
  );

  const selectedDateBookings = bookings.filter((b) => b.date === selectedDate);

  const filteredBookings = futureBookings.filter((booking) => {
    const matchesSearch =
      booking.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.client_phone.includes(searchTerm);
    const matchesService = serviceFilter === "all" || booking.service === serviceFilter;
    return matchesSearch && matchesService;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Scissors className="w-10 h-10 text-amber-600" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Painel Administrativo</h1>
              <p className="text-gray-600">Don Bigodon Barbearia</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="stats">Estatísticas</TabsTrigger>
            <TabsTrigger value="day">Visualizar Dia</TabsTrigger>
            <TabsTrigger value="all">Todos</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Total de Agendamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-amber-600">{bookings.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hoje</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600">{todayBookings.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Receita Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-green-600">R$ {totalRevenue}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Futuros</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-purple-600">{futureBookings.length}</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Agendamentos por Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(serviceStats).map(([service, count]) => (
                    <div key={service} className="flex items-center justify-between">
                      <span className="font-medium">{service}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleClearPastBookings} variant="destructive" className="w-full">
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar Agendamentos Passados
            </Button>
          </TabsContent>

          <TabsContent value="day" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Selecionar Data</CardTitle>
                <CardDescription>Visualize os agendamentos de um dia específico</CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="max-w-xs"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>
                  Agendamentos - {format(new Date(selectedDate + "T00:00:00"), "dd/MM/yyyy")}
                </CardTitle>
                <CardDescription>{selectedDateBookings.length} agendamentos</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedDateBookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum agendamento para esta data</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border"
                      >
                        <div className="flex-1">
                          <p className="font-semibold">{booking.time}</p>
                          <p className="text-sm text-gray-600">{booking.client_name}</p>
                          <p className="text-sm text-gray-600">{booking.client_phone}</p>
                          <Badge className="mt-2">{booking.service}</Badge>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            setBookingToDelete(booking.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="all" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Buscar por nome ou telefone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="px-4 py-2 border rounded-md"
                  >
                    <option value="all">Todos os serviços</option>
                    {SERVICES.map((service) => (
                      <option key={service.name} value={service.name}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Todos os Agendamentos Futuros</CardTitle>
                <CardDescription>{filteredBookings.length} agendamentos encontrados</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredBookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum agendamento encontrado</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-white rounded-lg border"
                      >
                        <div className="flex-1">
                          <p className="font-semibold">
                            {format(new Date(booking.date + "T00:00:00"), "dd/MM/yyyy")} - {booking.time}
                          </p>
                          <p className="text-sm text-gray-600">{booking.client_name}</p>
                          <p className="text-sm text-gray-600">{booking.client_phone}</p>
                          <Badge className="mt-2">{booking.service}</Badge>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            setBookingToDelete(booking.id);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <ConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={() => bookingToDelete && handleDeleteBooking(bookingToDelete)}
          title="Confirmar Exclusão"
          description="Tem certeza que deseja excluir este agendamento? Esta ação não pode ser desfeita."
        />
      </div>
    </div>
  );
};
