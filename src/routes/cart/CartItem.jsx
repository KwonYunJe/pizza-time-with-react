import React from "react";
import ChangeItemQuantity from "./ChangeItemQuantity";
import { useCart } from "../../context/CartContext";

//CartItem 컴포넌트 정의
const CartItem = ({ cartTotals }) => {        //cartTotal이라는 props를 전달받는다.
  const { cart, clearCart } = useCart();      //useCart로 전역 장바구니 상태(cart), 전체 삭제 함수(clearCart) 를 가져옴
  return (                                    //장바구니 항목들을 담는 영역, CSS 클래스 이름은 cart__items
    <section className="cart__items">
      {cart.map((cartItem, index) => {        //cart에 있는 상품들을 하나씩 화면에 렌더링(map() 사용)
        return (
          <article                            //각 상품 하나를 감싸는 태그
            className="cart__items__single"
            key={index}                       //반복문에서 필수로 지정해야 하는 리액트의 식별자
            aria-labelledby={`item-title-${index}`}>  {/* 접근성을 위한 속성 (화면 읽기용) */}
            <img                              //상품 이미지 표시
              src={cartItem.ItemImg}
              alt={cartItem.ItemName}
            />
            <div className="cart__items__content">
              <header className="cart__items__info">
                <h3                           //상품명, 옵션, 설명 출력
                  id={`item-title-${index}`}
                  className="cart__items__title">
                  {cartItem.ItemName}
                  {cartItem.userSelectedAttributes.length > 0 &&  //선택된 옵션이 있다면 함께 출력
                    cartItem.userSelectedAttributes.map((i, index) => {
                      return <span key={index}>{i.attributeValue}</span>;
                    })}
                </h3>
                <p className="cart__items__ingredients">    {/*상품 설명이나 재료 목록 출력 */}
                  {cartItem.ItemIngredients}
                </p>
              </header>
              <div className="cart__items__interaction">    {/*수량 조절 및 가격 변경 */}
                <ChangeItemQuantity cartItem={cartItem} />  {/*수량 변경 버튼 */}
                <p className="cart__items__pricing">${cartItem.ItemPrice}</p> {/*상품 가격 */}
              </div>
            </div>
          </article>
        );
      })}
      {cart.length > 0 && (                             //전체 삭제 버튼, 카트가 비어있지 않을 때 출력
        <button
          onClick={clearCart}
          className="cart__items__clear-btns"
          aria-label="remove all items from the cart">
          remove all items from the cart
        </button>
      )}
      {cartTotals}                                      {/*총합 */}
    </section>
  );
};

export default CartItem;
