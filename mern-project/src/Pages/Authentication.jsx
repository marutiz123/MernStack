import React, { useState } from 'react';
import { Modal } from '@mui/material';
import { Close } from '@mui/icons-material'; 
import styled from 'styled-components';
import LogoImage from '../utils/utils/Images/LogoImg.png';
import AuthImage from '../utils/utils/Images/AuthImage.png';
import SignIn from '../Component/SignIn';
import SignUp from '../Component/SignUp';

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  background: ${({ theme }) => theme.bg};
`;

const Left = styled.div`
  flex: 1;
  position: relative;
  

  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Logo = styled.img`
  position: absolute;
  top: 20px;
  left: 40px;
  width: 80px;  
  height: 60px; 
  object-fit: contain; 
  z-index: 10;
`;

const Image = styled.img`
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Right = styled.div`
  flex: 0.9;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 40px;
  gap: 16px;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 768px) {
    flex: 1;
  }
`;

const CloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  border-radius: 50%;
  padding: 2px;
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer; 
  
  &:hover {
    background: ${({ theme }) => theme.primary + "20"}; 
  }
`;

const Text = styled.p`
  display:flex;
  gap:12px;
  font-size:16px;
  text-align:center;
  color:${({ theme }) => theme.text_secondary};
  margin-top: 14px;
  @media (max-width: 400px){
    font-size:14px;
  }
`;

const TextButton = styled.div`
  color:${({ theme }) => theme.primary};
  cursor:Pointer;
  transition: all 0.3s ease;
  font-weight:600;
`;

const Authentication = ({ openAuth, setOpenAuth }) => {
  const [Login, setLogin] =useState(true);
  return (
    <Modal open={openAuth} onClose={() => setOpenAuth(false)}>
      <Container>
        <Left>
          <Logo src={LogoImage} alt="Logo" />
          <Image src={AuthImage} alt="Auth Background" />
        </Left>

        <Right>
          <CloseButton onClick={() => setOpenAuth(false)}> 
            <Close />
          </CloseButton>
          {Login ? (
        <>
          <SignIn setOpenAuth={setOpenAuth}/>
          <Text>
            Don't have an account? 
            <TextButton onClick={() => setLogin(false)}>Sign Up</TextButton> 
          </Text>
        </>
      ) : (
        <>
          <SignUp setOpenAuth={setOpenAuth}/>
          <Text>
            Already have an account?
            <TextButton onClick={() => setLogin(true)}>Sign In</TextButton> 
          </Text>
        </>
      )}
        </Right>
      </Container>
    </Modal>
  );
};

export default Authentication;
