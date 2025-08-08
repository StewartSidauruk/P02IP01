import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../redux/features/products/productSlice";
import { ShoppingCart, ChevronLeft } from "lucide-react";

export default function DetailProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, isLoading, error } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading product details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-400">
        <p>Error: {error.message}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-300 hover:text-white mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        {/* Product Image */}
        <div className="relative rounded-xl overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.stock <= 5 && (
            <span className="absolute top-4 left-4 bg-red-500 px-3 py-1 rounded-full text-sm">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-gray-400 mb-6">{product.description}</p>
            <p className="text-xl font-semibold mb-4">
              Category: <span className="text-blue-400">{product.category}</span>
            </p>
            <p className="text-4xl font-bold mb-4">
              Rp {product.price?.toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 mb-8">
              Stock: {product.stock}
            </p>
          </div>

          <div>
            <button
              disabled={product.stock === 0}
              className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                product.stock === 0
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
