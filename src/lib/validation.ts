import { z } from "zod";

export const bookingSchema = z.object({
  clientName: z
    .string()
    .trim()
    .min(3, "Nome deve ter no mínimo 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras"),
  
  clientPhone: z
    .string()
    .trim()
    .min(10, "Telefone inválido")
    .max(15, "Telefone inválido")
    .regex(/^[\d\s\-\(\)]+$/, "Telefone deve conter apenas números e símbolos"),
  
  selectedService: z
    .string()
    .min(1, "Selecione um serviço"),
  
  selectedDate: z
    .string()
    .min(1, "Selecione uma data"),
  
  selectedTime: z
    .string()
    .min(1, "Selecione um horário"),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
