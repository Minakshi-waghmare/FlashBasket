import api from './api';
import { getDbUserId } from './userService';

export const addToCartLogic = async (user, productId, quantity = 1) => {

  if (!user) {
    throw new Error("LOGIN_REQUIRED");
  }

  try {

    // 🔥 Get Backend DB User ID
    const dbUserId = await getDbUserId(user);

    // ✅ Validate DB user id
    if (!dbUserId) {
      throw new Error("USER_SYNC_FAILED");
    }

    const parsedUserId = Number(dbUserId);
    const parsedProductId = Number(productId);
    const parsedQuantity = Number(quantity);

    if (isNaN(parsedUserId) || isNaN(parsedProductId) || isNaN(parsedQuantity)) {
      throw new Error("INVALID_CART_DATA");
    }

    // 🔍 DEBUG (remove later if you want)
    console.log("CART REQUEST:", {
      userId: parsedUserId,
      productId: parsedProductId,
      quantity: parsedQuantity
    });

    // 🚀 API CALL
    const cartRes = await api.post('/cart/add', {
      userId: parsedUserId,
      productId: parsedProductId,
      quantity: parsedQuantity
    });

    return cartRes.data;

  } catch (err) {

    console.error("Cart Service Error:", err);

    // 🔥 Backend error message
    if (err?.response?.data?.message) {
      throw new Error(err.response.data.message);
    }

    // 🔥 Custom frontend errors
    if (err?.message) {
      throw err;
    }

    throw new Error("Failed to add item to cart.");
  }
};