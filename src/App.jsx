import React, { useState, useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import {
  About,
  Blog,
  Cart,
  Checkout,
  Contact,
  Homepage,
  Menu,
  Payment,
  Register,
  SingleItem,
} from "./routes/index";

import CartTotals from "./routes/cart/CartTotals";
import LoginModal from "./components/login/LoginModal";
import CartItem from "./routes/cart/CartItem";
import NotFound from "./routes/not-found/NotFound";
import Refunds from "./routes/refunds/Refunds";
import Terms from "./routes/terms/Terms";
import Privacy from "./routes/privacy/Privacy";
import Careers from "./routes/careers/Careers";
import BlogPost from "./routes/blog-post/BlogPost";
import Profile from "./routes/profile/Profile";
import ResetLocation from "./helpers/ResetLocation";
import { useMemo } from "react";
import { CartProvider } from "./context/CartContext";
import { ProductsProvider } from "./context/ProductsContext";
import { USERS_URL } from "./data/constants";

function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  //로그인 여부
  const [userConfig, setUserConfig] = useState({ user: {}, loggedIn: false });
  const loggedIn = useMemo(() => userConfig.loggedIn, [userConfig]);

  const getUser = async (id) => {
    try {
      // console.log(`${USERS_URL}/${id}`);
      const response = await fetch(`${USERS_URL}/${id}`);
      const { data } = await response.json();
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      setUserConfig((prev) => ({ ...prev, user: data[0] }));
      sessionStorage.setItem("currentUser", JSON.stringify(data[0]));
      return true;
    } catch (err) {
      console.log(err.statusText);
      return false;
    }
  };

  const updateUser = async (id, user) => {
    try {
      const response = await fetch(`${USERS_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const update = await getUser(id);
      if (!update) {
        throw new Error(response.statusText);
      }
      return true;
    } catch (err) {
      console.log("Fetch error:", err.statusText);
      return false;
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("currentUser") !== null) {
      const user = JSON.parse(sessionStorage.getItem("currentUser"));
      setUserConfig((prev) => ({ ...prev, user: user }));
    }
  }, []);

  useEffect(() => {
    if (loggedIn && sessionStorage.getItem("validLogin") === null) {
      sessionStorage.setItem("validLogin", true);
    }
    if (sessionStorage.getItem("validLogin") !== null) {
      setUserConfig((prev) => ({
        ...prev,
        loggedIn: sessionStorage.getItem("validLogin"),
      }));
    }
  }, [loggedIn]);

  //로그인 창을 띄움
  const activateLoginModal = () => {
    hideMenu();
    setIsLoginModalOpen(!isLoginModalOpen);
  };

  const handleLogout = () => {
    setUserConfig((prev) => ({
      ...prev,
      loggedIn: false,
    }));
    hideMenu();
    setUserConfig((prev) => ({ ...prev, user: {} }));
    ResetLocation();
    sessionStorage.clear();
  };

  const hideMenu = () => {
    setIsNavOpen(false);
  };

  return (
    <CartProvider isLogged={userConfig.loggedIn}>
      <BrowserRouter>
        <Header
          loginModal={
            <LoginModal
              setUserConfig={setUserConfig}
              setIsLoginModalOpen={setIsLoginModalOpen}
              isLoginModalOpen={isLoginModalOpen}
              hideMenu={hideMenu}
              getUser={getUser}
            />
          }
          activateLoginModal={activateLoginModal}
          setIsNavOpen={setIsNavOpen}
          isNavOpen={isNavOpen}
          hideMenu={hideMenu}
          handleLogout={handleLogout}
          isValidLogin={loggedIn}
        />

        <Routes>
          <Route path="/" element={<Homepage />} />
{/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}
{/* 카트 */}
{/* Cart - CartItem - CartTotal 트리를 따라 감 */}
          <Route
            path="/cart"                              //https://localhost:3000/cart 
            element={                                 //cart주소에는 어떤 컴포넌트를 보여줄지 결정
              <Cart                                   //Cart라는 페이지를 보여주기로 함
                CartItem={                            //Cart에게 CartItem이라는 이름의 props를 전달
                  <CartItem                           //넘기려하는 CartItem의 컴포넌트
                    cartTotals={                      //CartItem에게 cartTotals라는 이름의 props를 전달
                      <CartTotals                     //넘기려하는 CartTotals의 컴포넌트
                        className="cart-totals"       //CSS클래스 설정
                        isValidLogin={loggedIn}       //로그인상태 정보를 넘김(37번째 줄)
                        activateLoginModal={activateLoginModal}   //로그인 창을 띄우는 함수도 넘김 (101번째 줄)
                      />
                    }
                  />
                }
              />
            }
          />

          <Route
            exact
            path="/menu"
            element={
              <ProductsProvider isLogged={userConfig.loggedIn}>
                <Menu />
              </ProductsProvider>
            }
          />
          <Route
            path="/profile"
            element={
              !loggedIn ? (
                <NotFound />
              ) : (
                <Profile
                  currentUser={userConfig.user}
                  getUser={getUser}
                  handleLogout={handleLogout}
                  updateUser={updateUser}
                />
              )
            }
          />
          <Route path="/menu/:name" element={<SingleItem />} />
          <Route
            path="/checkout"
            element={<Checkout currentUser={userConfig.user} />}
          />
          <Route
            path="/payment"
            element={<Payment currentUser={userConfig.user} />}
          />

          <Route path="/contact" element={<Contact />} />
          <Route exact path="/blog" element={<Blog />} />
          <Route path="/blog/:name" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route
            path="/register"
            element={
              loggedIn ? (
                <NotFound />
              ) : (
                <Register activateLoginModal={activateLoginModal} />
              )
            }
          />

          <Route path="/careers" element={<Careers />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/refunds" element={<Refunds />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>

        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
