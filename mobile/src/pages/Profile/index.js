import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import { updateProfileRequest } from '~/store/modules/user/actions';
import { signOut } from '~/store/modules/auth/actions';
import Background from '~/components/Background';
import Header from '~/components/Header';
import {
  ScrollContainer,
  FormInput,
  DivisionStroke,
  SaveButton,
  LogoutButton,
} from './styles';

export default function Profile() {
  const profile = useSelector(state => state.user.profile);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const emailRef = useRef();
  const oldPasswordRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const dispatch = useDispatch();

  function handleSubmit() {
    dispatch(
      updateProfileRequest({
        name,
        email,
        oldPassword,
        password,
        confirmPassword,
      })
    );
  }

  function handleLogout() {
    dispatch(signOut());
  }

  return (
    <Background>
      <Header />
      <ScrollContainer>
        <FormInput
          value={name}
          onChangeText={setName}
          icon="person-outline"
          onSubmitEditing={() => emailRef.current.focus()}
          selectionColor="#f94d6a"
          returnKeyType="next"
        />
        <FormInput
          value={email}
          onChangeText={setEmail}
          ref={emailRef}
          onSubmitEditing={() => passwordRef.current.focus()}
          icon="mail-outline"
          keyboardType="email-address"
          selectionColor="#f94d6a"
          returnKeyType="next"
        />

        <DivisionStroke />

        <FormInput
          value={oldPassword}
          onChangeText={setOldPassword}
          ref={passwordRef}
          onSubmitEditing={() => passwordRef.current.focus()}
          icon="lock"
          placeholder="Sua senha atual"
          selectionColor="#f94d6a"
          returnKeyType="next"
          secureTextEntry
        />
        <FormInput
          value={password}
          onChangeText={setPassword}
          ref={passwordRef}
          onSubmitEditing={() => confirmPasswordRef.current.focus()}
          icon={{ type: 'community', name: 'lock-plus' }}
          placeholder="Sua nova senha"
          selectionColor="#f94d6a"
          returnKeyType="next"
          secureTextEntry
        />
        <FormInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          ref={confirmPasswordRef}
          onSubmitEditing={handleSubmit}
          icon={{ type: 'community', name: 'lock-question' }}
          placeholder="Confirme sua nova senha"
          selectionColor="#f94d6a"
          returnKeyType="send"
          secureTextEntry
        />

        <SaveButton onPress={handleSubmit}>Salvar perfil</SaveButton>
        <LogoutButton onPress={handleLogout}>Sair do Meetapp</LogoutButton>
      </ScrollContainer>
    </Background>
  );
}

const tabBarIcon = ({ tintColor }) => (
  <Icon name="person" size={25} color={tintColor} />
);

tabBarIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

Profile.navigationOptions = {
  tabBarLabel: 'Meu perfil',
  tabBarIcon,
};
