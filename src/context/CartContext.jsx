import { createContext, useContext, useEffect, useState } from "react";
import ResetLocation from "../helpers/ResetLocation";


//전역 장바구니 상태를 만들기 위한 기본 Context
const CartContext = createContext();

//전역으로 상태를 공유해줄 감싸주는 컴포넌트(provider)
export const CartProvider = ({ children, isLogged }) => {
  //각 상태들
  //실제로 카트에 담긴 상품 목록
  //const [변수명, 변수변경시 호출할 함수명] = useState(초기 값)
  const [cart, setCart] = useState([]);
  //상품 추가시 추가됨을 알려주는 상태
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  //수량, 총액, 세금 을 계산해서 저장
  const [orderSummary, setOrderSummary] = useState({
    quantity: 0,
    payment: 0,
    taxes: 0,
  });
  useEffect(() => {
    if (!isLogged) {
      setOrderSummary({
        quantity: 0,
        payment: 0,
        taxes: 0,
      });
      setCart([]);
    }
  }, [isLogged]);
  //상품 추가 함수, 두 개의 props를 전달 받는다.
  //targetProduct : 추가하려는 상품 객체,
  //userSelectedAttributes : 사용자가 선택한 옵션(사이즈, 토핑 등)
  const handleAddProduct = (targetProduct, userSelectedAttributes) => {
    
    //가져온 객체로 이미 같은상품+옵션 조합이 장바구니에 있는지 검사한다. 있으면 정상 return이 되고 없다면 undefined가 반환된다.
    const productAlreadyInCart = CheckRepeatableProducts(   
      targetProduct,
      userSelectedAttributes
    );

    //cart는 상태(status)값이므로 직접변경하지 않기 위해 currentCartItems로 복사 후 수정한다.
    let currentCartItems = [...cart];
    let newQuantity;  //새로 추가할 상품 수량 변수

    //상품이 카트에 없다면
    if (productAlreadyInCart === undefined) {
      //상품을 새로추가한다. 수량은 1
      const itemToAdd = targetProduct;
      newQuantity = 1;
      //상품 객체에 옵션과 수량을 붙여서 currentCartItems에 추가
      currentCartItems.push({
        ...itemToAdd,
        userSelectedAttributes,
        quantity: newQuantity,
      });
    
    //상품이 카트에 있다면
    } else {
      //해당 상품의 index를 구한다.
      let index;
      //옵션이 없는 경우 단순히 id로 비교
      if (userSelectedAttributes.length === 0) {
        index = cart.findIndex((item) => item.id === targetProduct.id);
      
        //옵션이 있다면 id와 옵션까지 모두 일치하는 상품을 찾는다.
      } else {
        index = cart.findIndex(
          (item) =>
            item.userSelectedAttributes[0]?.attributeValue ===
              userSelectedAttributes[0].attributeValue &&
            item.id === targetProduct.id
        );
      }

      //index가 -1이 아닐 경우 상품이 존재한다는 의미이므로
      if (index !== -1) {
        //현재 수량을 가져와서
        newQuantity = cart[index].quantity;

        //기존 상품의 수량을 1 증가시켜서 덮어쓴다.
        currentCartItems[index] = {
          ...cart[index],
          quantity: newQuantity + 1,
        };
      }
    }

    //총 수량을 담는 변수, 배열의 모든 요소를 누적해서 하나의 값으로 만드는 함수인 reduce를 이용하여 item.quantity를 모두 더한다.
    const totalCartQuantity = currentCartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    //장바구니를 문자열로 바꾼다 (세션 저장용), JS객체는 직접 저장할 수 없기 때문에 JSON.stringify()로 문자열로 바꿔야 브라우저 저장소에 저장할 수 있다.
    const jsonUser = JSON.stringify(currentCartItems);
    //브라우저의 session storage에 carItems라는 이름으로 저장한다.
    sessionStorage.setItem("cartItems", jsonUser);
    //cart를 새로 계산된 currentCartItems로 갱신한다. 이때 화면이 다시 렌더링 된다.
    setCart(currentCartItems);
    //총 수량을 session에 별도로 저장한다.
    sessionStorage.setItem("cartQuantity", totalCartQuantity);
    //수량을 변경하기 위해 다음과 같이 작성했다.
    setOrderSummary((prev) => ({
      //prev를 모두 복사
      ...prev,
      //복사 된 값들 중 quantity값만 totalCartQuantity로 변경
      quantity: totalCartQuantity,
    }));
    //상품이 추가됨을 나타내는 status를 true로 변경
    setIsAddedToCart(true);
  };

  const handleRemoveProduct = (target, targetAttr) => {
    let productToUpdate = CheckRepeatableProducts(target, targetAttr);
    const hasAttribute = productToUpdate[0].attributes.length > 0;
    let productsCopy = [];
    if (hasAttribute) {
      productsCopy = cart
        .map((item) =>
          item.userSelectedAttributes[0]?.attributeValue ===
          productToUpdate[0].userSelectedAttributes[0]?.attributeValue
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
    } else {
      productsCopy = cart
        .map((item) =>
          item.id === productToUpdate[0].id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0);
    }
    setCart(productsCopy);
    const jsonUser = JSON.stringify(productsCopy);
    sessionStorage.setItem("cartItems", jsonUser);

    const sum = [...productsCopy].reduce((a, b) => a + b.quantity, 0);
    sessionStorage.setItem("cartQuantity", sum);
    setOrderSummary((prev) => ({
      ...prev,
      quantity: sum,
    }));
  };
  const clearCart = () => {
    setCart([]);
    setOrderSummary({
      quantity: 0,
      payment: 0,
      taxes: 0,
    });
    sessionStorage.removeItem("cartItems");
    sessionStorage.removeItem("cartQuantity");
    ResetLocation();
  };
  const CheckRepeatableProducts = (targetProduct, attributes) => {
    let inCart = cart.some((item) => item.id === targetProduct.id);
    if (!inCart) {
      return undefined;
    } else {
      let match = cart.filter((item) => item.id === targetProduct.id);
      let target = match.filter((item) =>
        item.userSelectedAttributes.length === 0
          ? true
          : item.userSelectedAttributes[0].attributeValue ===
            attributes[0].attributeValue
      );
      if (target.length === 0) {
        return undefined;
      }
      return target;
    }
  };
  const getTotalPrice = (items) => {
    let total = items.reduce((acc, item) => {
      return acc + item.ItemPrice * item.quantity;
    }, 0);
    setOrderSummary((prev) => ({
      ...prev,
      total: total.toFixed(2),
      taxes: ((total * 10) / 100).toFixed(2),
    }));
  };
  useEffect(() => {
    getTotalPrice(cart);
  }, [cart]);

  useEffect(() => {
    if (sessionStorage.getItem("cartItems") !== null) {
      const jsonCartItems = sessionStorage.getItem("cartItems");
      const cartItems = JSON.parse(jsonCartItems);
      setCart(cartItems);
    }
    const cartQuantitySession = sessionStorage.getItem("cartQuantity");
    if (cartQuantitySession !== null) {
      setOrderSummary((prev) => ({
        ...prev,
        quantity: cartQuantitySession,
      }));
    }
  }, []);
  useEffect(() => {
    if (isAddedToCart) {
      const timer = setTimeout(() => {
        setIsAddedToCart(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAddedToCart]);
  return (
    <CartContext.Provider
      value={{
        cart,
        orderSummary,
        setOrderSummary,
        handleAddProduct,
        handleRemoveProduct,
        clearCart,
        isAddedToCart,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
