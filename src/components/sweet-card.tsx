"use client";

import Image from "next/image";
import { Sweet } from "@/lib/types";
import { useCart } from "@/lib/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus } from "lucide-react";

export function SweetCard({ sweet }: { sweet: Sweet }) {
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const cartItem = items.find((i) => i.id === sweet.id);

  return (
    <Card className="overflow-hidden bg-white border shadow-sm hover:shadow-md transition flex flex-col">
      
      {/* IMAGE SECTION */}
      <div className="relative w-full h-56 overflow-hidden">
        <Image
          src={sweet.image_url || "/placeholder.jpg"}
          alt={sweet.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />

        <Badge className="absolute top-2 left-2 bg-primary text-white">
          {sweet.category}
        </Badge>
      </div>

      {/* CONTENT SECTION */}
      <CardContent className="flex flex-col gap-2 p-4 flex-1">
        <h3 className="font-display font-semibold text-lg leading-tight">
          {sweet.name}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2">
          {sweet.description}
        </p>

        {/* PRICE + ACTION */}
        <div className="mt-auto flex justify-between items-center">
          <span className="font-bold text-primary text-lg">
            ₹{sweet.price}
          </span>

          {cartItem ? (
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() =>
                  cartItem.cartQuantity === 1
                    ? removeFromCart(sweet.id)
                    : updateQuantity(
                        sweet.id,
                        cartItem.cartQuantity - 1
                      )
                }
              >
                <Minus className="h-3 w-3" />
              </Button>

              <span className="min-w-[20px] text-center">
                {cartItem.cartQuantity}
              </span>

              <Button
                size="icon"
                variant="outline"
                onClick={() =>
                  updateQuantity(
                    sweet.id,
                    cartItem.cartQuantity + 1
                  )
                }
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={() => addToCart(sweet)}>
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
