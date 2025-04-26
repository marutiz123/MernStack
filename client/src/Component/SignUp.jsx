import React, { useState } from 'react';
import styled from 'styled-components';
import TextInput from './TextInput';
import Button from './Button';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../redux/reducers/snackbarSlice';
import { UserSignUp } from '../api';

const Container = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

const Title = styled.div`
  font-size: 30px;
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
`;

const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.primary + 90};
`;

const SignUp = ({ setOpenAuth }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validateInputs = () => {
    if (!name || !email || !password) {
      dispatch(
        openSnackbar({
          message: 'Please fill all fields',
          severity: 'warning',
        })
      );
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setButtonDisabled(true);

    try {
      const res = await UserSignUp({ name, email, password });

      if (res && res.data) {
        dispatch(
          openSnackbar({
            message: 'Account created successfully!',
            severity: 'success',
          })
        );
        // Optional: reset fields after successful signup
        setName('');
        setEmail('');
        setPassword('');
      } else {
        throw new Error('Unexpected server response.');
      }
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || err.message || 'Something went wrong.';
      dispatch(
        openSnackbar({
          message: errorMsg,
          severity: 'error',
        })
      );
    } finally {
      setLoading(false);
      setButtonDisabled(false);
      setOpenAuth(false);
    }
  };

  return (
    <Container>
      <div>
        <Title>Create New Account</Title>
        <Span>Please enter details to create a new account</Span>
      </div>
      <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
        <TextInput
          label='Full Name'
          placeholder='Enter your full name'
          value={name}
          handleChange={(e) => setName(e.target.value)}
        />
        <TextInput
          label='Email Address'
          placeholder='Enter your email address'
          value={email}
          handleChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          label='Password'
          placeholder='Enter your password'
          password
          value={password}
          handleChange={(e) => setPassword(e.target.value)}
        />
        <Button
          text='Sign Up'
          onClick={handleSignUp}
          isLoading={loading}
          isDisabled={buttonDisabled}
        />
      </div>
    </Container>
  );
};

export default SignUp;
