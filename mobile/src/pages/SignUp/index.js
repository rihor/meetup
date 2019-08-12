import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { signUpRequest } from '~/store/modules/auth/actions';
import Background from '~/components/Background';
import logo from '~/assets/logo.png';
import {
  Container,
  Image,
  Form,
  StyledInput,
  StyledButton,
  ChangeForm,
  ChangeFormText,
} from './styles';

export default function SignUp({ navigation }) {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.auth.loading);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef();
  const passwordRef = useRef();

  function handleSubmit() {
    console.tron.log(name);
    dispatch(signUpRequest(name, email, password));
  }

  return (
    <Background>
      <Container>
        <Image source={logo} />
        <Form>
          <StyledInput
            icon="person-outline"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Digite seu nome"
            selectionColor="#f94d6a"
            returnKeyType="next"
            onSubmitEditing={() => {
              emailRef.current.focus();
            }}
            value={name}
            onChangeText={setName}
          />
          <StyledInput
            placeholder="Digite seu e-mail"
            selectionColor="#f94d6a"
            icon="mail-outline"
            keyboardType="email-address"
            autoCorrect={false}
            returnKeyType="next"
            ref={emailRef}
            onSubmitEditing={() => {
              passwordRef.current.focus();
            }}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <StyledInput
            placeholder="Sua senha secreta"
            selectionColor="#f94d6a"
            icon="lock-outline"
            secureTextEntry
            ref={passwordRef}
            onSubmitEditing={handleSubmit}
            value={password}
            onChangeText={setPassword}
            returnKeyType="send"
          />
          <StyledButton loading={loading} onPress={handleSubmit}>
            Cadastrar
          </StyledButton>
        </Form>
        <ChangeForm onPress={() => navigation.navigate('SignIn')}>
          <ChangeFormText>Já tenho conta</ChangeFormText>
        </ChangeForm>
      </Container>
    </Background>
  );
}

SignUp.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
