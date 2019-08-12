import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Image } from 'react-native';
import PropTypes from 'prop-types';

import { signInRequest } from '~/store/modules/auth/actions';
import Background from '~/components/Background';
import logo from '~/assets/logo.png';
import {
  Container,
  Form,
  StyledInput,
  SubmitButton,
  ChangeForm,
  ChangeFormText,
} from './styles';

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // referência para mudança de foco no formulário
  const passwordRef = useRef();

  const loading = useSelector(state => state.auth.loading);
  const dispatch = useDispatch();

  function handleSubmit() {
    dispatch(signInRequest(email, password));
  }

  return (
    <Background>
      <Container>
        <Image source={logo} />
        <Form>
          <StyledInput
            placeholder="Digite seu e-mail"
            selectionColor="#f94d6a"
            icon="mail-outline"
            keyboardType="email-address"
            autoCorrect={false}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
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
          <SubmitButton loading={loading} onPress={handleSubmit}>
            Acessar
          </SubmitButton>
        </Form>
        <ChangeForm onPress={() => navigation.navigate('SignUp')}>
          <ChangeFormText>Criar conta grátis</ChangeFormText>
        </ChangeForm>
      </Container>
    </Background>
  );
}

SignIn.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
