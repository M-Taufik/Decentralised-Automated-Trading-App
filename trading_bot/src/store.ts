import { create } from "zustand";

export const useStore = create<{
  wallet: string;
  balance: string;
}>((set) => ({
  wallet: "No address",
  balance: "0",
}));
