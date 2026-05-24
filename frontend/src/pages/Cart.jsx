import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import api from '../services/api';
import { getDbUserId } from '../services/userService';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserAndFetchCart();
  }, []);

  const checkUserAndFetchCart = async () => {
    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) return;

      const dbUserId = await getDbUserId(user);
      const parsedUserId = Number(dbUserId);

      const res = await api.get(`/cart/${parsedUserId}`);

      const mappedCart = (res.data || []).map(item => ({
        cartItemId: item.id,
        productId: item.productId,
        name: item.productName,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: item.quantity
      }));

      setCartItems(mappedCart);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (id, qty) => {
    if (qty < 1) return;

    setCartItems(prev =>
      prev.map(i =>
        i.cartItemId === id ? { ...i, quantity: qty } : i
      )
    );

    await api.put(`/cart/update/${id}?quantity=${qty}`);
  };

  const removeFromCart = async (id) => {
    setCartItems(prev => prev.filter(i => i.cartItemId !== id));
    await api.delete(`/cart/remove/${id}`);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500 font-semibold">
        Loading your cart...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Login Required</h1>
        <button
          onClick={() => navigate('/login')}
          className="bg-orange-500 text-white px-6 py-3 rounded-xl"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* HEADER */}
      <h1 className="text-3xl font-extrabold mb-8">
        Your Shopping Cart 🛒
      </h1>

      {/* EMPTY CART (VERY IMPORTANT UPGRADE) */}
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border">
          <ShoppingBag className="w-14 h-14 text-slate-300 mb-4" />
          <h2 className="text-xl font-bold text-slate-700">
            Your cart feels empty
          </h2>
          <p className="text-slate-500 mt-1">
            Add something amazing to get started
          </p>

          <Link
            to="/products"
            className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Start Shopping
          </Link>
        </div>
      ) : (

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: PRODUCT CARDS */}
          <div className="lg:col-span-2 space-y-5">

            {cartItems.map(item => (
              <div
                key={item.cartItemId}
                className="flex gap-5 bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition"
              >

                {/* IMAGE */}
                <div className="w-28 h-28 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      className="w-full h-full object-cover"
                      alt={item.name}
                    />
                  ) : (
                    <span className="text-xs text-slate-400">No Image</span>
                  )}
                </div>

                {/* DETAILS */}
                <div className="flex-1 flex flex-col justify-between">

                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {item.name}
                    </h2>

                    <p className="text-orange-600 font-bold text-lg mt-1">
                      ₹{item.price}
                    </p>
                  </div>

                  {/* CONTROLS */}
                  <div className="flex items-center justify-between mt-4">

                    {/* QUANTITY */}
                    <div className="flex items-center gap-3 bg-slate-100 px-3 py-1 rounded-xl">

                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}>
                        <Minus size={16} />
                      </button>

                      <span className="font-semibold">{item.quantity}</span>

                      <button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>
                        <Plus size={16} />
                      </button>

                    </div>

                    {/* DELETE */}
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>

          {/* RIGHT: SUMMARY CARD */}
          <div className="bg-white border rounded-2xl p-6 h-fit shadow-sm sticky top-10">

            <h2 className="text-xl font-bold mb-5">
              Order Summary
            </h2>

            <div className="space-y-3 text-slate-600">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>₹{tax}</span>
              </div>

            </div>

            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <Link
              to="/checkout"
              className="mt-6 flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600"
            >
              Checkout <ArrowRight size={18} />
            </Link>

          </div>

        </div>
      )}
    </div>
  );
};

export default Cart;
