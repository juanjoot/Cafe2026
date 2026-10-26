// app/cart/page.tsx
"use client";

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  removeItem,
  clearCart,
} from "@/store/slices/cartSlice";
import Link from "next/link";

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Tu carrito</h1>

      {items.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="divide-y">
            {items.map((item) => (
              <li key={item.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    ${item.price.toLocaleString("es-CO")} x {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => dispatch(removeItem(item.id))}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <p className="text-lg font-semibold">
              Total: ${total.toLocaleString("es-CO")}
            </p>

            <div className="mt-4 flex gap-4">
              <button
                onClick={() => dispatch(clearCart())}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Vaciar carrito
              </button>

              <Link
                href="/checkout"
                className="px-4 py-2 bg-coffee text-white rounded hover:opacity-90"
              >
                Proceder al pago
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
