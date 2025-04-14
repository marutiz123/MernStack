import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircularProgress, Rating } from "@mui/material";
import styled from "styled-components";
import { AddShoppingCartOutlined, FavoriteBorder, FavoriteRounded, Message } from "@mui/icons-material";
import { useState } from "react";
import { addToFavourite, deleteFromFavourite, getFavourite } from "../../api";
import { openSnackbar } from "../../redux/reducers/snackbarSlice";
import { useDispatch } from "react-redux";

const Card = styled.div`
    width: 250px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: all 0.3s ease-out;
    cursor: pointer;
    @media (max-width: 600px) {
        width: 170px;
    }
`;

const Image = styled.img`
    width: 100%;
    height: 320px;
    border-radius: 6px;
    object-fit: cover;
    transition: all 0.3s ease-out;
    @media (max-width: 600px) {
        height: 240px;
    }
`;

const Menu = styled.div`
    position: absolute;
    z-index: 10;
    color: ${({ theme }) => theme.text_primary};
    top: 14px;
    right: 14px;
    display: none;
    flex-direction: column;
    gap: 12px;
`;

const Top = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 6px;
    transition: all 0.3s ease-out;
    &:hover {
        background-color: ${({ theme }) => theme.primary};
    }
    &:hover ${Image} {
        opacity: 0.8;
    }
    &:hover ${Menu} {
        display: flex;
    }
`;

const StyledMenuItem = styled.div`
    border-radius: 50%;
    width: 34px;
    height: 34px;
    background: white;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    cursor: pointer;
`;

const Rate = styled.div`
    position: absolute;
    z-index: 10;
    color: ${({ theme }) => theme.text_primary}; 
    bottom: 8px;
    left: 8px;
    padding: 4px 8px;
    border-radius: 4px;
    background: white;
    display: flex;
    align-items: center;
    opacity: 0.9;
`;

const Details = styled.div`
    display: flex;
    gap: 6px;
    flex-direction: column;
    padding: 4px 10px;
    position: relative;
    z-index: 5;
    cursor: pointer;
`;


const Title = styled.div`
    font-size: 16px;
    font-weight: 700;
    color: ${({ theme }) => theme.text_primary};
`;

const Desc = styled.div`
    font-size: 16px;
    font-weight: 400;
    color: ${({ theme }) => theme.text_primary};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const Price = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_primary};
`;

const Span = styled.div`
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.text_secondary + 60};
    text-decoration: line-through;
    text-decoration-color: ${({ theme }) => theme.text_secondary + 50};
`;

const Percent = styled.div`
    font-size: 12px;
    font-weight: 500;
    color: green;
`;

const ProductCard = ({product}) => {
    const addToCart = () => 
    console.log("Added to cart");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [favorite, setFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);
    
    const addFavorite = async () =>{
        setFavoriteLoading(true);
        const token = localStorage.getItem("zara-app-token");
        await addToFavourite(token, { productId: product?._id })
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
        
        const token = localStorage.getItem("zara-app-token");
        if (!token) {
            dispatch(openSnackbar({ message: "Please log in first.", severity: "warning" }));
            return;
        }
    
        try {
            await addToCart(token, { productId: product?._id, quantity: 1 });
            
            navigate("/cart");
        } catch (err) {
            
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
        checkFavourite();
    }, []);
    

    return (
        <Card>
            <Top>
                <Image src={product?.img} />
                <Menu>
                    <StyledMenuItem
                        onClick={() => (favorite ? removeFavorite(): addFavorite())}
                    >
                        {favoriteLoading ? (
                            <CircularProgress sx={{ fontSize: "20px"}}/>
                        ):(
                            <>
                            {favorite ? (
                                <FavoriteRounded sx={{ fontSize: "20px", color: "red" }} />
                            ):(
                                <FavoriteBorder sx={{ fontSize: "20px" }} />
                            )}
                            </>
                        )}
                    </StyledMenuItem>
                    <StyledMenuItem onClick = {() => handleAddToCart(product?.id)}>
                        <AddShoppingCartOutlined sx={{ fontSize: "20px" }} />
                    </StyledMenuItem>

                </Menu>
                <Rate>
                    <Rating value={3.5} sx={{ fontSize: "14px" }} />
                </Rate>
            </Top>
            <Details onClick={() => navigate(`/shop/${product._id}`)}>
                <Title>{product?.title}</Title>
                <Desc>{product?.name}</Desc>
                <Price>
                    ₹{product?.price?.org} <Span>₹{product?.price?.mrp}</Span>
                    <Percent>(₹{product?.price?.off}% Off)</Percent>
                </Price>
            </Details>
        </Card>
    );
};

export default ProductCard;
