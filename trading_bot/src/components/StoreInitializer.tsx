"use client";

import { useRef } from "react";

import { useStore } from "@/store";

function StoreInitializer({ wallet, balance }: { wallet: string; balance: string }) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useStore.setState({ wallet, balance });
    initialized.current = true;
  }
  return null;
}

export default StoreInitializer;
