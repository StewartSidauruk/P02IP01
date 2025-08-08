// src/redux/features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, doc, getDocs, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../configs/firebase";

// Ambil semua item cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (userId, { rejectWithValue }) => {
    try {
      const cartRef = collection(db, "users", userId, "cart");
      const snapshot = await getDocs(cartRef);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return items;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Tambah product ke cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, product }, { rejectWithValue }) => {
    try {
      const cartItemRef = doc(db, "users", userId, "cart", product.id);
      await setDoc(cartItemRef, { ...product, quantity: 1 }, { merge: true });
      return { ...product, quantity: 1 };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Hapus product dari cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const cartItemRef = doc(db, "users", userId, "cart", productId);
      await deleteDoc(cartItemRef);
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update quantity product
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const cartItemRef = doc(db, "users", userId, "cart", productId);
      await updateDoc(cartItemRef, { quantity });
      return { productId, quantity };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        const exists = state.items.find(item => item.id === action.payload.id);
        if (!exists) {
          state.items.push(action.payload);
        }
      })

      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      })

      // Update Quantity
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const { productId, quantity } = action.payload;
        const item = state.items.find(item => item.id === productId);
        if (item) {
          item.quantity = quantity;
        }
      });
  }
});

export default cartSlice.reducer;
