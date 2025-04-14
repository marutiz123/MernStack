import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import TextInput from '../Component/TextInput';
import Button from '../Component/Button';
import { addToCart, deleteFromCart, getCart, placeOrder } from '../api';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../redux/reducers/snackbarSlice';
import { DeleteOutline, Message } from '@mui/icons-material';

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px){
    padding: 20px 12px;
  }
  background: ${({ theme }) => theme.bg};
`;

const Section = styled.div`
  max-width: 1400px;
  padding: 32px 16px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`;
const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: ${({ center }) => (center ? 'center' : 'space-between')};
  align-items: center;
`;
const Wrapper = styled.div`
  display: flex;
  gap: 32px;
  width: 100%;
  padding: 12px;
  @media(max-width: 750px){
    flex-direction: column
  }
`;
const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction:column;
  gap:12px;
  @media(max-width: 750px){
    flex: 1.2;
  }
`;

const Table = styled.div`
  font-size: 16px;
  display:flex;
  align-items:center;
  gap:30px;
  ${({ head }) => head && `margin-bottom: 22px;`}
`;
const TableItem = styled.div`
  ${({ flex }) => flex && `flex: 1;`}
  ${({ bold }) => 
    bold &&
    `font-weight:600;
    font-size: 18px;`
  }
`;
const Counter = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.text_secondary + '40'};
  border-radius: 8px;
  padding: 4px 12px;
`;
const Product = styled.div`
  display:flex;
  gap:16px;
`;
const Img = styled.img`
  height:80px;
`;
const Details = styled.div``;
const Protitle = styled.div`
  color:${({ theme }) => theme.primary};
  font-size:16px;
  font:weight:500;
`;
const ProDesc = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-spaces: nowrap;
`;
const ProSize = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction:column;
  gap:12px;
  @media(max-width: 750px){
    flex: 0.8;
  }
`;
const Subtotal = styled.div`
  font-size: 22px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
`;
const Delivery = styled.div`
  font-size: 18px;
  font-weight: 500;
  display: flex;
  gap: 6px;
  flex-direction: column;
`;
const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [products, setProducts] = useState([]);
  const [buttonLoad, setButtonLoad] = useState(false);

  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName:"", lastName:"", emailAddress:"", phoneNumber:"", completeAddress:"",
  });

  const getProducts = async () =>{
    setLoading(true);
    const token = localStorage.getItem("zara-app-token");
    await getCart(token)
    .then((res) => {
      console.log('Cart Data:', res.data);
      setProducts(res.data);
      setLoading(false)
    })
    .catch((err) => {
      console.error('Error fetching cart:', err);  
      setLoading(false);
    });
  };

  const addCart = async (id) => {
    const token = localStorage.getItem("zara-app-token");
    await addToCart(token, { productId: id, quantity: 1})
    .then(() => setReload(!reload))
    .catch((err) => {
      setReload(!reload);
      dispatch(openSnackbar({ message: err.message, severity: "error" }));
    });
  };

  const removeCart = async (id, quantity, type) => {
    const token = localStorage.getItem("zara-app-token");
    let qnt = quantity > 0 ? 1 : null;
    if(type === "full") qnt = null;
    await deleteFromCart(token, { productId: id, quantity: qnt })
    .then(() => setReload(!reload))
    .catch((err) => {
      setReload(!reload);
      dispatch(openSnackbar({ message: err.message, severity: "error" }));
    });
  };

  const calculateSubtotal = () =>
    products.reduce((total, item) => total + item.quantity * item?.Product?.price?.org, 0)

  useEffect(() => {
    getProducts();
  }, [reload]);

  const convertAddressToString = (addressObj) => 
    `${addressObj.firstName}, ${addressObj.lastName}, ${addressObj.completeAddress}, ${addressObj.phoneNumber}, ${addressObj.emailAddress}`;

  const placeOrderHandler = async () => {
    setButtonLoad(true);
    const {
      firstName, lastName, completeAddress, phoneNumber, emailAddress
    } = deliveryDetails;

    if (!(firstName && lastName && completeAddress && phoneNumber && emailAddress)) {
      dispatch(openSnackbar({ message: "Please fill in all required delivery details", severity: "error" }));
      setButtonLoad(false);
      return;
    }

    try {
      const token = localStorage.getItem("zara-app-token");
      const totalAmount = calculateSubtotal().toFixed(2);
      await placeOrder(token, {
        products,
        address: convertAddressToString(deliveryDetails),
        totalAmount,
      });
      dispatch(openSnackbar({ message: "Order placed successfully", severity: "success" }));
      setReload(!reload);
    } catch (error) {
      dispatch(openSnackbar({ message: "Failed to place order. Please try again", severity: "error" }));
    } finally {
      setButtonLoad(false);
    }
  };

  return (
    <Container>
      {loading ? (
        <CircularProgress /> 
      ) : (
        <Section>
          <Title>Your Shopping Cart</Title>
          {products.length === 0 ? (
            <>Cart is empty</>
          ) : (
            <Wrapper>
              <Left>
                <Table><TableItem bold flex>Product</TableItem><TableItem bold>Price</TableItem><TableItem bold>Quantity</TableItem><TableItem bold>Subtotal</TableItem><TableItem></TableItem></Table>
                {products?.map((item, index) => (
                  item?.Product ? (
                    <Table key={index}>
                      <TableItem flex>
                        <Product>
                          <Img src={item.Product.img} />
                          <Details>
                            <Protitle>{item.Product.title || 'Title'}</Protitle>
                            <ProDesc>{item.Product.name || 'Name'}</ProDesc>
                            <ProSize>Size: {item.size || 'XL'}</ProSize>
                          </Details>
                        </Product>
                      </TableItem>
                      <TableItem>₹{item.Product.price?.org || '0'}</TableItem>
                      <TableItem>
                        <Counter>
                          <div onClick={() => removeCart(item?.Product?._id, item?.quantity)}>-</div>
                          {item.quantity}
                          <div onClick={() => addCart(item?.Product?._id)}>+</div>
                        </Counter>
                      </TableItem>
                      <TableItem>₹{(item.quantity * (item.Product.price?.org || 0)).toFixed(2)}</TableItem>
                      <TableItem>
                        <DeleteOutline sx={{ color: "red" }} onClick={() => removeCart(item?.Product?._id, item?.quantity - 1, "full")} />
                      </TableItem>
                    </Table>
                  ) : null
                ))}
              </Left>

              <Right>
                <Subtotal>Subtotal : ₹{calculateSubtotal().toFixed(2)}</Subtotal>
                {/* Delivery Details and Payment Details JSX same as before */}
                <Button text="Place Order" small isLoading={buttonLoad} isDisabled={buttonLoad} onClick={placeOrderHandler} />
              </Right>
            </Wrapper>
          )}
        </Section>
      )}
    </Container>
  );
};

export default Cart;