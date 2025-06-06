import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getProduct() {
  return {
    id: "prod_SRrxTxYQcEBa51",
    name: "Makkara Pro subscription",
    price: 490,
  };
}
