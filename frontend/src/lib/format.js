import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";
import { ptBR } from "date-fns/locale";
// Formatação de datas e nomes usada pelas telas (datas vêm da API como LocalDateTime, sem fuso)

function toDate(value) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function initials(name) {
  const parts = String(name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "?";
  return ((parts[0][0] ?? "") + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

// 27/10/2026
export function formatDate(value) {
  const date = toDate(value);
  return date ? format(date, "dd/MM/yyyy") : "";
}

// 27/10/2026 às 14:05
export function formatDateTime(value) {
  const date = toDate(value);
  return date ? format(date, "dd/MM/yyyy 'às' HH:mm") : "";
}

// "outubro de 2026"
export function formatMonthYear(value) {
  const date = toDate(value);
  return date ? format(date, "MMMM 'de' yyyy", { locale: ptBR }) : "";
}

// "há 5 minutos"
export function formatRelative(value) {
  const date = toDate(value);
  return date ? formatDistanceToNow(date, { addSuffix: true, locale: ptBR }) : "";
}

// Lista de conversas: hoje -> 14:05, ontem -> "Ontem", antes -> 25/10
export function formatChatTime(value) {
  const date = toDate(value);
  if (!date) return "";
  if (isToday(date)) return format(date, "HH:mm");
  if (isYesterday(date)) return "Ontem";
  return format(date, "dd/MM");
}

// 4,8
export function formatRating(value) {
  return value == null
    ? ""
    : value.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}
