import axios from "axios";
import type { Book, Member, Lending } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// ---------- Books (read-only) ----------
export const fetchBooks = () => api.get<Book[]>("/books").then((r) => r.data);
export const fetchBook = (id: number) =>
  api.get<Book>(`/books/${id}`).then((r) => r.data);

// ---------- Members ----------
export const fetchMembers = () => api.get<Member[]>("/members").then((r) => r.data);
export const createMember = (payload: { name: string; email: string }) =>
  api.post<Member>("/members", payload).then((r) => r.data);
export const updateMember = (id: number, payload: Partial<Member>) =>
  api.patch<Member>(`/members/${id}`, payload).then((r) => r.data);
export const deleteMember = (id: number) =>
  api.delete(`/members/${id}`).then(() => id);

// ---------- Lendings ----------
export const fetchLendings = () => api.get<Lending[]>("/lendings").then((r) => r.data);
export const createLending = (payload: {
  book_id: number;
  member_id: number;
}) => api.post<Lending>("/lendings", payload).then((r) => r.data);
export const updateLending = (id: number, payload: Partial<Lending>) =>
  api.patch<Lending>(`/lendings/${id}`, payload).then((r) => r.data);
export const deleteLending = (id: number) =>
  api.delete(`/lendings/${id}`).then(() => id);
