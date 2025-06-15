import "./cart.css";                                          //해당 루트의 CSS파일 적용
import React, { useEffect } from "react";
import { motion } from "framer-motion";                       //부드러운 애니메이션 라이브러리
import ScrollBtn from "../../helpers/ScrollBtn";              //스크롤 버튼
import EmptyCart from "./EmptyCart";                          //카트가 비어있을 때 보여주는 라이브러리
import { useCart } from "../../context/CartContext";          //카트 상태를 가져오는 hook
import { slideInLeft } from "../../data/animations";          //애니메이션 설정 값을 불러옴
const Cart = ({ CartItem }) => {                              //Cart 컴포넌트 정의. Cart는 CartItem이라는 컴포넌트를 넘겨받는다.
  const { cart } = useCart();                                 //userCart를 호출해서 cart상태를 가져온다.
  useEffect(() => {                                           //페이지가 열릴 때
    document.title = "Shopping Cart | Pizza Time";            //브라우저 탭 제목을 변경
  }, []);
  return (
    <motion.main                                              //<main> 태그에 애니메이션 효과
      className="cart"
      initial={slideInLeft.initial}
      whileInView={slideInLeft.whileInView}
      exit={slideInLeft.exit}
      transition={slideInLeft.transition}>
      <h2>Shopping cart</h2>
      {cart.length === 0 ? <EmptyCart /> : CartItem}          {/*cart가 비어있다면 <EmptyCart/>를 보여줌, 그렇지 않으면 props로부터 CartItem을 렌더링*/}
      <ScrollBtn />                                           {/*스크롤 버튼*/}
    </motion.main>
  );
};

export default Cart;
