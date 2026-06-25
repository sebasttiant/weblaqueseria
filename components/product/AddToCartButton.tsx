"use client";

import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/lib/store/cart";

interface AddToCartButtonProps {
  productId: string;
  slug: string;
  name: string;
  priceCents: number | null;
  imageUrl: string | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function AddToCartButton({
  productId,
  slug,
  name,
  priceCents,
  imageUrl,
  className,
  size = "md",
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  function handleAdd() {
    addItem({ productId, slug, name, priceCents, imageUrl });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <Button
      onClick={handleAdd}
      size={size}
      className={className}
      aria-label={`Agregar ${name} al pedido`}
    >
      {added ? (
        <>
          <Check size={16} aria-hidden="true" />
          Agregado
        </>
      ) : (
        <>
          <ShoppingBag size={16} aria-hidden="true" />
          Agregar
        </>
      )}
    </Button>
  );
}
