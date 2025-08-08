// src/pages/CartPage.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart, removeFromCart, updateCartQuantity } from "../redux/features/cart/cartSlice";
import { auth } from "../configs/firebase";

export default function CartPage() {
  const { items, isLoading } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  // Load cart when user logs in
  useEffect(() => {
    if (auth.currentUser) {
      dispatch(fetchCart(auth.currentUser.uid));
    }
  }, [dispatch]);

  const handleQtyChange = (id, qty) => {
    if (qty < 1) return;
    dispatch(
      updateCartQuantity({
        userId: auth.currentUser.uid,
        productId: id,
        quantity: qty,
      })
    );
  };

  const handleRemove = (id) => {
    dispatch(
      removeFromCart({
        userId: auth.currentUser.uid,
        productId: id,
      })
    );
  };

  if (isLoading) {
    return <p className="text-center py-10">Loading cart...</p>;
  }

  if (!items.length) {
    return <p className="text-center py-10">Your cart is empty</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
          >
            {/* Product Info */}
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-gray-500">Rp {item.price.toLocaleString()}</p>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                className="px-2 py-1 bg-gray-200 rounded"
              >
                +
              </button>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => handleRemove(item.id)}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mt-6 text-right">
        <p className="text-lg font-semibold">
          Total: Rp{" "}
          {items
            .reduce((acc, item) => acc + item.price * item.quantity, 0)
            .toLocaleString()}
        </p>
      </div>
    </div>
  );
}
