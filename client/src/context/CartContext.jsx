import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    return savedCart ? JSON.parse(savedCart) : [];
  });

  const addToCart = (item) => {
    setCart((currentCart) => {
      const existing = currentCart.find(
        (product) => product._id === item._id
      );

      let updatedCart;

      if (existing) {
        updatedCart = currentCart.map((product) =>
          product._id === item._id
            ? {
                ...product,
                cartQuantity: product.cartQuantity + 1,
              }
            : product
        );
      } else {
        updatedCart = [
          ...currentCart,
          {
            ...item,
            cartQuantity: 1,
          },
        ];
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      return updatedCart;
    });
  };

  const increaseQuantity = (id) => {
    setCart((currentCart) => {
      const updatedCart = currentCart.map((item) =>
        item._id === id
          ? {
              ...item,
              cartQuantity:
                item.cartQuantity + 1,
            }
          : item
      );

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      return updatedCart;
    });
  };

  const decreaseQuantity = (id) => {
    setCart((currentCart) => {
      const updatedCart = currentCart
        .map((item) =>
          item._id === id
            ? {
                ...item,
                cartQuantity:
                  item.cartQuantity - 1,
              }
            : item
        )
        .filter((item) => item.cartQuantity > 0);

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      return updatedCart;
    });
  };

  const removeFromCart = (id) => {
    setCart((currentCart) => {
      const updatedCart = currentCart.filter(
        (item) => item._id !== id
      );

      localStorage.setItem(
        "cart",
        JSON.stringify(updatedCart)
      );

      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);

    localStorage.removeItem("cart");
  };

  const totalAmount = cart.reduce(
    (total, item) =>
      total + item.price * item.cartQuantity,
    0
  );

  const totalItems = cart.reduce(
    (total, item) =>
      total + item.cartQuantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () =>
  useContext(CartContext);