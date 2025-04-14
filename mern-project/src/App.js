import styled, { ThemeProvider } from "styled-components";
import { lightTheme } from "./utils/utils/Themes";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Component/Navbar";
import Home from "./Pages/Home"
import Authentication from "./Pages/Authentication";
import { useState } from "react";
import ShopListing from "./Pages/ShopListing";
import Favourite from "./Pages/Favourite";
import Cart from "./Pages/Cart"
import ProductDetails from "./Pages/ProductDetails";
import { useDispatch, useSelector} from "react-redux";
import TostMessage from "./Component/ToastMessage";

const Container = styled.div`
  width: 100%;
  min-height: 100vh; /* Use min-height instead of fixed height */
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: auto; /* Allow vertical scrolling */
  transition: all 0.2s ease;
`;


function App() {
  const {currentUser} = useSelector((state)=> state.user);
  const {open,message,severity} = useSelector((state)=> state.user);
  const [openAuth, setOpenAuth] = useState(false)
  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
      <Container>
          <Navbar setOpenAuth={setOpenAuth} currentUser={currentUser}/>
          <div>
            <Routes>
                <Route path="/" element={<Home />} />  
                <Route path="/home" element={<Home />} />
                <Route path="/shop" element={<ShopListing />} />
                <Route path="/favourite" element={<Favourite />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/shop/:id" element={<ProductDetails />} />
            </Routes>
          </div>
          {openAuth && <Authentication openAuth={openAuth} setOpenAuth={setOpenAuth} />}
          {open && (<TostMessage open={open} message={message} severity={severity} />
          
          )}
  </Container>
</BrowserRouter>

    </ThemeProvider>
  );
}

export default App;
