import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchBooks,
  fetchBook,
  fetchMembers,
  createMember,
  updateMember,
  deleteMember,
  fetchLendings,
  createLending,
  updateLending,
  deleteLending,
} from "../api";
import type { Member, Lending } from "../types";

// ---------- Books ----------
export function useBooks() {
  return useQuery({ queryKey: ["books"], queryFn: fetchBooks });
}

export function useBook(id: number) {
  return useQuery({
    queryKey: ["books", id],
    queryFn: () => fetchBook(id),
    enabled: !!id,
  });
}

// ---------- Members ----------
export function useMembers() {
  return useQuery({ queryKey: ["members"], queryFn: fetchMembers });
}

export function useCreateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

export function useUpdateMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Member> }) =>
      updateMember(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

export function useDeleteMember() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["members"] });
    },
  });
}

// ---------- Lendings ----------
export function useLendings() {
  return useQuery({ queryKey: ["lendings"], queryFn: fetchLendings });
}

export function useCreateLending() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createLending,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lendings"] });
      qc.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useUpdateLending() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<Lending> }) =>
      updateLending(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lendings"] });
      qc.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export function useDeleteLending() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteLending,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["lendings"] });
      qc.invalidateQueries({ queryKey: ["books"] });
    },
  });
}
