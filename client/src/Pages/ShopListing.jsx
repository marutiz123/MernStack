import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import ProductCard from '../Component/cards/ProductCard';
import { category, filter } from '../utils/utils/data';
import { CircularProgress, Slider } from '@mui/material';
import { getAllProducts } from '../api';

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  overflow: hidden; 
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow-y: auto; 
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column; 
  }
`;

const Filters = styled.div`
  width: 230px;
  overflow-y: auto; /* Ensure filters are scrollable */
  max-height: 100vh;
  padding: 20px 16px;

  @media (max-width: 768px) {
    width: 100%;
    max-height: 30vh; 
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Products = styled.div`
  flex: 1;
  padding: 12px;
  overflow-y: auto; 
  max-height: 100vh;

  @media (max-width: 768px) {
    max-height: 60vh; 
  }
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

const Item = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const SelectableItem = styled.div`
  cursor: pointer;
  display: flex;
  border: 1px solid ${({ theme }) => theme.text_secondary + "20"};
  color: ${({ theme }) => theme.text_secondary + "90"};
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 16px;
  width: fit-content;

  ${({ selected, theme }) =>
    selected &&
    `
    border: 1px solid ${theme.text_primary};
    color: ${theme.text_primary};
    background: ${theme.text_primary + "30"};
    font-weight: 500;
  `}
`;

const ShopListing = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSizes, setselectedSizes] = useState(["S", "M", "L", "XL"]);
  const [selectedCategories, setSelectedCategories] = useState([
    "Men",
    "Women",
    "Kids",
    "Bags",
  ]);

  const getFilteredProductsData = async () => {
    setLoading(true);
  
    const query = `minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}${
      selectedSizes.length > 0 ? `&sizes=${selectedSizes.join(",")}` : ""
    }${
      selectedCategories.length > 0 ? `&categories=${selectedCategories.join(",")}` : ""
    }`;
  
    try {
      const res = await getAllProducts(query);
      setProducts(res.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getFilteredProductsData();
  },[priceRange, selectedSizes, selectedCategories]);

  return (
    <Container>
      {loading ? <CircularProgress/> : <>  <MainContent>
        <Filters>
          <Menu>
            {filter.map((filters, index) => (
              <FilterSection key={index}>
                <Title>{filters.name}</Title>
                {filters.value === "price" ? (
                  <Slider
                    area-label="Price"
                    defaultValue={priceRange}
                    min={0}
                    max={1000}
                    valueLabelDisplay="auto"
                    marks={[
                      { value: 0, label: "₹0" },
                      { value: 1000, label: "₹1000" },
                    ]}
                    onChange={(e, newValue) => setPriceRange(newValue)}
                  />
                ) : filters.value === "size" ? (
                  <Item>
                    {filters.items.map((item) => (
                      <SelectableItem
                        key={item}
                        selected={selectedSizes.includes(item)}
                        onClick={() =>
                          setselectedSizes((prevSizes) =>
                            prevSizes.includes(item)
                              ? prevSizes.filter((size) => size !== item)
                              : [...prevSizes, item]
                          )
                        }
                      >
                        {item}
                      </SelectableItem>
                    ))}
                  </Item>
                ) : filters.value === "category" ? (
                  <Item>
                    {filters.items.map((item) => (
                      <SelectableItem
                        key={item}
                        selected={selectedCategories.includes(item)}
                        onClick={() =>
                          setSelectedCategories((prevCategories) =>
                            prevCategories.includes(item)
                              ? prevCategories.filter((category) => category !== item)
                              : [...prevCategories, item]
                          )
                        }
                      >
                        {item}
                      </SelectableItem>
                    ))}
                  </Item>
                ) : null}
              </FilterSection>
            ))}
          </Menu>
        </Filters>
        <Products>
          <CardWrapper>
            {products.map((product) =>(
              <ProductCard key={product._id} product={product} />
            ))}
          </CardWrapper>
        </Products>
      </MainContent></>}
    </Container>
  );
};

export default ShopListing;
