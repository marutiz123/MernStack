import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { CircularProgress, Rating } from '@mui/material';
import Button from '../Component/Button';
import {FavoriteBorder, FavoriteRounded} from "@mui/icons-material";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart, addToFavourite, deleteFromFavourite, getFavourite, getProductDetails } from '../api';
import { openSnackbar } from '../redux/reducers/snackbarSlice';

const Container = styled.div`
    display: flex;
    justify-content:center;
    align-items:center;
    width:100%;
    height:100vh;
    overflow-y: scroll;
`;
const Wrapper = styled.div`
    flex: 1;
    max-width: 1400px;
    display: flex;
    width: 100%;
    padding: 12px;
    gap: 32px;
    @media(max-width: 750px){
        flex-direction: column;
        justify-content: center;
    }
`;
const ImageWrapper = styled.div`
    flex: 1;
    display: flex;
    align-items:center;
    justify-content:center;
    
`;
const Image = styled.img`
    height: 600px;
    border-radius: 12px;
    @media(max-width: 750px){
        height: 400px;
    }
`;
const Details = styled.div`
    display: flex;
    gap: 18px;
    flex-direction:column;
    padding: 4px 10px;
    flex: 1;
`;
const Title = styled.div`
    font-size: 28px;
    font-weight: 600;
    color: ${({ theme }) => theme.text_primary};
`;
const Desc = styled.div`
    font-size: 16px;
    font-weight: 400;
    color: ${({ theme }) => theme.text_primary};
`;
const Name = styled.div`
    font-size: 18px;
    font-weight: 400;
    color: ${({ theme }) => theme.text_primary};
`;
const Price = styled.div`
    display:flex;
    align-items: center;
    gap: 8px;
    font-size: 22px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_primary};
`;
const Span = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_secondary + 60};
    text-decoration: Line-through;
    text-decoration-color: ${({ theme }) => theme.text_secondary + 50};
`;
const Percent = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: green;
`;
const Sizes = styled.div`
    font-size: 18px;
    font-weight: 500;
    display: flex;
    flex-direction: column;
    gap: 12px;
`;
const Items = styled.div`
    display: flex;
    gap: 12px;
`;
const Item = styled.div`
    border: 1px solid ${({ theme }) => theme.primary};
    font-size: 14px;
    width: 42px;
    height: 42px;
    display: flex;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    ${({ selected, theme }) =>
        selected &&
    `
        background: ${theme.primary};
        color: white;
    `}
`;
const ButtonWrapper = styled.div`
    display: flex;
    gap: 16px;
    padding: 32px 0px;
`;

const ProductDetails = () => {  
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState();
    const [selected, setSelected] = useState();
    const [favorite, setFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);

    const getProduct = async() => {
        setLoading(true);
        await getProductDetails(id).then((res) => {
            setProduct(res.data);
            setLoading(false);
        });
    };

        const addFavorite = async () =>{
            setFavoriteLoading(true);
            const token = localStorage.getItem("zara-app-token");
            await addToFavourite(token, {productID: product?._id})
            .then((res) =>{
                setFavorite(true);
                setFavoriteLoading(false);
            })
            .catch((err) => {
                setFavoriteLoading(false);
                dispatch(
                    openSnackbar({
                        message: err.message,
                        severity: "error",
                    })
                );
            });
        };
    
        const removeFavorite = async () =>{
            setFavoriteLoading(true);
            const token = localStorage.getItem("zara-app-token");
            await deleteFromFavourite(token, {productID: product?._id})
            .then((res) =>{
                setFavorite(false);
                setFavoriteLoading(false);
            })
            .catch((err) => {
                setFavoriteLoading(false);
                dispatch(
                    openSnackbar({
                        message: err.message,
                        severity: "error",
                    })
                );
            });
        };
        const handleAddToCart = async () => {
            setCartLoading(true)
            const token = localStorage.getItem("zara-app-token");
            if (!token) {
                dispatch(openSnackbar({ message: "Please log in first.", severity: "warning" }));
                return;
            }
        
            try {
                await addToCart(token, { productId: product?._id, quantity: 1 });
                setCartLoading(false);
                navigate("/cart");
            } catch (err) {
                setCartLoading(false);
                dispatch(openSnackbar({ message: err?.response?.data?.message || "Error adding to cart", severity: "error" }));
            }
        };
        const checkFavourite = async () => {
            setFavoriteLoading(true);
            const token = localStorage.getItem("zara-app-token");
        
            try {
                const res = await getFavourite(token);
                const isFavorite = res.data?.some(
                    (item) => item._id === product?._id
                );
                setFavorite(isFavorite);
            } catch (err) {
                dispatch(openSnackbar({ message: err?.response?.data?.message || "Failed to check favorite", severity: "error" }));
            } finally {
                setFavoriteLoading(false);
            }
        };
        

    useEffect(() => {
        getProduct();
        checkFavourite();
    },[]);

return (
    <Container>
        {loading ? (
            <CircularProgress />
        ) : (
        <Wrapper>
        <ImageWrapper>
            <Image src={product?.img} />
        </ImageWrapper>
        <Details>
            <div>
                <Title>{product?.title}</Title>
                <Name>{product?.name}</Name>
            </div>
            <Rating value={3.5}/>
            <Price>
                ₹{product?.Price?.org} <Span>₹{product?.price?.mrp}</Span>
                <Percent>(₹{product?.price?.off}% off)</Percent>
            </Price>
            <Desc>{product?.desc}</Desc>
            <Sizes>
                    <Items>
                        {product?.sizes.map((size) => (
                            <Item selected={selected === size} onClick={() =>setSelected(size)}>{size}</Item>
                        ))}
                    </Items>
            </Sizes>
            <ButtonWrapper>
                <Button text="Add to Cart" full 
                outlined 
                isLoading={cartLoading}
                onClick={() => handleAddToCart()}/>
                <Button text="Buy Now" full />
                <Button leftIcon={
                    favorite ? (
                    <FavoriteRounded sx={{ fontSize: "18px", color: "red"}} />
                    ) : (
                        <FavoriteBorder sx={{fontSize: "22px"}} />
                    )
                } full 
                outlined
                isLoading={favoriteLoading}
                onClick={() => (favorite ? removeFavorite() : addFavorite())}
                />
            </ButtonWrapper>
        </Details>
    </Wrapper>
    )}
    
</Container>
)}

export default ProductDetails
