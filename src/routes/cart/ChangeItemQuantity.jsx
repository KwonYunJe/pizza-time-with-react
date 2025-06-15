import React from "react";
import { useCart } from "../../context/CartContext";

const ChangeItemQuantity = ({ cartItem }) => {    //cartItem이라는 하나의 상품에 대한 정보를 props로 받는 컴포넌트임을 정의
  const { handleAddProduct, handleRemoveProduct } = useCart();    //useCart를 사용해 두 함수를 가져온다.
  return (
    <div className="cart__add-items">     {/*수량 UI 전체를 감싸는 div */}
      <button
        onClick={() => {                  //클릭시 hadleAddProduct()호출, 두번째 인자는 상품의 옵션
          handleAddProduct(cartItem, cartItem.userSelectedAttributes);
        }}
        aria-label={`Add ${cartItem.ItemName} to the cart`}>
        +
      </button>
      <p>{cartItem.quantity}</p>        {/*상품의 현재 수량을 나타낸다. */}
      <button                           //클릭 시 handleRemoveProduct()호출
        onClick={() => {
          handleRemoveProduct(cartItem, cartItem.userSelectedAttributes);
        }}
        aria-label={`Remove ${cartItem.ItemName} from the cart`}>
        -
      </button>
    </div>
  );
};

export default ChangeItemQuantity;
