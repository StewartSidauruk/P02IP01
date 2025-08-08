import { createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../configs/firebase";

const initialState = {
  products: [],
  product: null,
  isLoading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setProducts, setProduct, setLoading, setError } =
  productSlice.actions;

export const fetchProducts = () => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const result = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });
    dispatch(setProducts(result));
  } catch (error) {
    dispatch(setError(error));
  } finally {
    dispatch(setLoading(false));
  }
};

export const fetchProductById = (idProduct) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const docRef = doc(db, "products", idProduct);
    const docSnap = await getDoc(docRef);

    const product = {
      name: docSnap.data().name,
      image: docSnap.data().image,
      price: docSnap.data().price,
      stock: docSnap.data().stock,
      description: docSnap.data().description,
      category: docSnap.data().category,
    };

    dispatch(setProduct(product));
  } catch (error) {
    dispatch(setError(error));
  } finally {
    dispatch(setLoading(false));
  }
};

export const addProduct = (product) => async (dispatch) => {
  console.log("Redux addProduct called with:", product);
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    console.log("Adding document to Firestore...");
    const docRef = await addDoc(collection(db, "products"), {
      name: product.name,
      image: product.image,
      price: product.price,
      stock: product.stock,
      description: product.description,
      category: product.category,
    });
    console.log("Document added with ID:", docRef.id);
    dispatch(fetchProducts());
  } catch (error) {
    console.error("Error adding product:", error);
    dispatch(setError(error));
  } finally {
    dispatch(setLoading(false));
  }
};

export const deleteProduct = (idProduct) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    await deleteDoc(doc(db, "products", idProduct));
    dispatch(fetchProducts());
  } catch (error) {
    console.log(error);
    dispatch(setError(error));
  } finally {
    dispatch(setLoading(false));
  }
};

export const editProductById = (product) => async (dispatch) => {
  dispatch(setLoading(true));
  dispatch(setError(null));
  try {
    const docRef = doc(db, "products", product.id);
    await updateDoc(docRef, {
      name: product.name,
      image: product.image,
      price: product.price,
      stock: product.stock,
      description: product.description,
      category: product.category,
    });
    dispatch(fetchProducts());
  } catch (error) {
    dispatch(setError(error));
  } finally {
    dispatch(setLoading(false));
  }
};

export default productSlice.reducer;
