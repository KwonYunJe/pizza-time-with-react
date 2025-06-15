import React from "react";
import CheckoutBtn from "../checkout/CheckoutBtn";
import LinkButton from "../../components/Button";
import ResetLocation from "../../helpers/ResetLocation";
import { useCart } from "../../context/CartContext";    //전역 Context에 접근

//세 개의 props를 전달 받는 컴포넌트임을 정의
//className : CSS스타일을 위해
//isValidLogin : 로그인 여부
//activateLoinModal : 로그인 모달을 여는 함수
const CartTotals = ({ className, isValidLogin, activateLoginModal }) => {
  const { orderSummary } = useCart();   //useCart를 사용해 orderSummary 값을 가져옴 (담긴값 : 수량, 가격, 총합)
  return (
    <section className={className}>     {/* 카트의 총 합을 담는 영역, className 은 외부에서 props로 전달되어 스타일링 된다 */}
      <h2 id="cart-summary-title">Cart Summary</h2>   
      {orderSummary.quantity > 0 && (   //요약정보 표시, 수량이 0보다 크면(==카트가 비어있지 않으면) 표시
        <dl className="cart-totals_content">  {/* dt : 이름, dd : 값 */}
          <dt>Tax 10%:</dt>             
          <dd>$ {orderSummary.taxes}</dd>
          <dt>Quantity:</dt>
          <dd> {orderSummary.quantity}</dd>
          <dt>Total:</dt>
          <dd>$ {orderSummary.total}</dd>
        </dl>
      )}
      {/* 결제 및 메뉴로 돌아가기 버튼 */}
      <div className="cart-totals__interaction">  
        <CheckoutBtn                    //결제 버튼 컴포넌트
          className="active-button-style"
          aria-label="Contiue with checkout"
          isValidLogin={isValidLogin}               //로그인 여부 가져와서 저장
          activateLoginModal={activateLoginModal}   //로그인 하지 않은 상태라면 로그인 모달을 띄운다.
        />
        <LinkButton                     //메뉴로 돌아가기 버튼, 링크기능을 사용한다.
          aria-label="Go back to menu"
          onClick={ResetLocation}       //페이지 위치를 맨 위로 리셋한다.
          to="/menu"                    //해당 경로로 이동한다.
          className="back-to-menu">
          Back to menu
        </LinkButton>
      </div>
    </section>
  );
};

export default CartTotals;
