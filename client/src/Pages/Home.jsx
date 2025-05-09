import styled from 'styled-components';
import HeaderImage from '../utils/utils/Images/Header.png';
import { category } from '../utils/utils/data';
import ProductCategoryCard from '../Component/cards/ProductCategoryCard';
import ProductCard from '../Component/cards/ProductCard';
import { getAllProducts } from "../api";
import React, { useState, useEffect } from 'react';


const Container = styled.div`
  min-height: 100vh;  
  height: auto;  
  width: 100%;
  padding: 20px 30px 200px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  background: ${({ theme }) => theme.bg};
  overflow-y: visible;  /* Ensure scrolling is possible */

  @media (max-width: 768px) {
    padding: 20px 12px 200px;
  }
`;


const Section = styled.div`
  max-width: 1400px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const Img = styled.img`
  width: 90%;
  height: 700px;  
  max-width: 1200px;
  object-fit: cover;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: ${({ center }) => (center ? 'center' : 'space-between')};
  align-items: center;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;

  @media (max-width: 750px) {
    gap: 14px;
  }
`;

const Home = () => {
  const [loading, setLoading] =  useState(false);
  const [products, setProducts] = useState([]);

  const getProducts = async () => {
    setLoading(true);
    await getAllProducts().then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Container>
      <Section style={{ alignItems: 'center' }}>
        <Img src={HeaderImage} alt="Header" />
      </Section>

      <Section>
        <Title center>Shop by Categories</Title>
        <CardWrapper>
          {category.map((category, index) => (
            <ProductCategoryCard key={index} category={category} />
          ))}
        </CardWrapper>
      </Section>

      <Section>
        <Title center>Our Bestseller</Title>
        <CardWrapper>
        {products.map((product) => (
        <ProductCard key={product._id} product={product} />
          ))}

        
        </CardWrapper>
      </Section>
    </Container>
  );
}

export default Home;
