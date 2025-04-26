import React, { useState } from "react";
import styled from "styled-components";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { SearchRounded, FavoriteBorder, ShoppingCartOutlined, MenuRounded } from "@mui/icons-material";
import Button from "./Button";
import LogoImg from "../utils/utils/Images/LogoImg.png";
import { Avatar } from "@mui/material";
import { useDispatch } from "react-redux";
import { logout } from "../redux/reducers/userSlice";

const Nav = styled.div`
  display: flex;
  height: 80px;
  background-color: ${({ theme }) => theme.bg};
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  color: white;
`;

const NavbarContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
`;

const MobileIcon = styled.div`
  display: none;
  color: ${({ theme }) => theme.text_primary};

  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
`;

const MobileIcons = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;

  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 0 6px;
  }
`;

const MobileMenu = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 12px 40px 24px 40px;
  list-style: none;
  width: 80%;
  background: ${({ theme }) => theme.card_light + "99"};
  position: absolute;
  top: 80px;
  right: 0;
  transition: all 0.6s ease-in-out;
  transform: ${({ isOpen }) => (isOpen ? "translateY(0)" : "translateY(-100%)")};
  border-radius: 0 0 20px 20px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
  opacity: ${({ isOpen }) => (isOpen ? "100%" : "0")};
  z-index: ${({ isOpen }) => (isOpen ? "1000" : "-1000")};
`;

const NavLogo = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding: 0 6px;
  font-weight: 500;
  font-size: 18px;
  text-decoration: none;
  color: inherit;
`;

const Logo = styled.img`
  height: 34px;
  width: 80px;
`;

const NavItems = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 6px;
  list-style: none;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const StyledNavLink = styled(RouterNavLink)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.secondary};
  }
  &:active {
    color: ${({ theme }) => theme.primary};
    border-bottom: 1.8px solid ${({ theme }) => theme.primary};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 0 6px;
  color: ${({ theme }) => theme.primary};

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const TextButton = styled.div`
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  margin-left: 10px;
  color: ${({ theme }) => theme.text_primary};

  &:hover {
    color: ${({ theme }) => theme.secondary};
  }
`;

const Navbar = ({ openAuth, setOpenAuth, currentUser }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Nav>
      <NavbarContainer>
        <MobileIcon onClick={() => setMenuOpen(!menuOpen)}>
          <MenuRounded sx={{ color: "inherit", fontSize: "30px" }} />
        </MobileIcon>

        <NavLogo>
          <Logo src={LogoImg} alt="Logo" />
        </NavLogo>

        <NavItems>
          <StyledNavLink to="/Home">Home</StyledNavLink>
          <StyledNavLink to="/Shop">Shop</StyledNavLink>
          <StyledNavLink to="/New Arrivals">New Arrivals</StyledNavLink>
          <StyledNavLink to="/Orders">Orders</StyledNavLink>
          <StyledNavLink to="/Contact">Contact</StyledNavLink>
        </NavItems>

        <MobileMenu isOpen={menuOpen}>
          <StyledNavLink to="/Home" onClick={() => setMenuOpen(false)}>Home</StyledNavLink>
          <StyledNavLink to="/Shop" onClick={() => setMenuOpen(false)}>Shop</StyledNavLink>
          <StyledNavLink to="/New Arrivals" onClick={() => setMenuOpen(false)}>New Arrivals</StyledNavLink>
          <StyledNavLink to="/Orders" onClick={() => setMenuOpen(false)}>Orders</StyledNavLink>
          <StyledNavLink to="/Contact" onClick={() => setMenuOpen(false)}>Contact</StyledNavLink>

          <ButtonContainer>
            {!currentUser ? (
              <>
                <Button text="Sign Up" outlined small />
                <Button text="Sign In" small onClick={() => setOpenAuth(!openAuth)} />
              </>
            ) : (
              <>
                <Avatar src={currentUser?.img}>
                  {currentUser?.name?.[0]}
                </Avatar>
                <TextButton onClick={() => dispatch(logout())}>Logout</TextButton>
              </>
            )}
          </ButtonContainer>
        </MobileMenu>

        <MobileIcons>
          <IconWrapper>
            <SearchRounded sx={{ color: "inherit", fontSize: "30px" }} />
          </IconWrapper>
          {currentUser && (
            <>
              <IconWrapper onClick={() => navigate("/favourite")}>
                <FavoriteBorder sx={{ color: "inherit", fontSize: "30px" }} />
              </IconWrapper>
              <IconWrapper onClick={() => navigate("/cart")}>
                <ShoppingCartOutlined sx={{ color: "inherit", fontSize: "30px" }} />
              </IconWrapper>
              <Avatar src={currentUser?.img}>
                {currentUser?.name?.[0]}
              </Avatar>
              <TextButton onClick={() => dispatch(logout())}>Logout</TextButton>
            </>
          )}
          {!currentUser && (
            <Button text="Sign In" small onClick={() => setOpenAuth(!openAuth)} />
          )}
        </MobileIcons>

        <ButtonContainer>
          <IconWrapper>
            <SearchRounded sx={{ color: "inherit", fontSize: "30px" }} />
          </IconWrapper>
          {currentUser && (
            <>
              <IconWrapper onClick={() => navigate("/favourite")}>
                <FavoriteBorder sx={{ color: "inherit", fontSize: "30px" }} />
              </IconWrapper>
              <IconWrapper onClick={() => navigate("/cart")}>
                <ShoppingCartOutlined sx={{ color: "inherit", fontSize: "30px" }} />
              </IconWrapper>
              <Avatar src={currentUser?.img}>
                {currentUser?.name?.[0]}
              </Avatar>
              <TextButton onClick={() => dispatch(logout())}>Logout</TextButton>
            </>
          )}
          {!currentUser && (
            <Button text="Sign In" small onClick={() => setOpenAuth(!openAuth)} />
          )}
        </ButtonContainer>
      </NavbarContainer>
    </Nav>
  );
};

export default Navbar;
