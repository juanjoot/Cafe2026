// app/checkout/page.tsx
"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems, selectCartTotal, clearCart } from "@/store/slices/cartSlice";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !address || !city || !phone) {
      alert("Por favor completa todos los campos.");
      return;
    }

    // ⚡ Aquí puedes enviar la orden a tu backend
    console.log("Orden enviada:", {
      customer: { name, address, city, phone },
      items,
      total,
    });

    // Limpia carrito
    dispatch(clearCart());

    // Redirige o muestra mensaje de éxito
    alert("¡Pedido confirmado! Gracias por tu compra.");
    router.push("/"); // Redirige a inicio o página de gracias
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {items.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-2">Resumen del pedido</h2>
          <ul className="divide-y mb-4">
            {items.map((item) => (
              <li key={item.id} className="py-2 flex justify-between">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>
                  ${Number(item.price * item.quantity).toLocaleString("es-CO")}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-lg font-semibold mb-6">
            Total: ${total.toLocaleString("es-CO")}
          </p>

          <h2 className="text-xl font-semibold mb-2">Datos de envío</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Dirección"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              placeholder="Ciudad"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="tel"
              placeholder="Teléfono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />

            <button
              type="submit"
              className="px-6 py-2 bg-coffee text-white rounded hover:opacity-90"
            >
              Confirmar pedido
            </button>
          </form>
        </>
      )}
    </div>
  );
}
