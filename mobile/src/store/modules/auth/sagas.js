import { all, call, put, takeLatest } from 'redux-saga/effects';
import { Alert } from 'react-native';

import api from '~/services/api';

import { signInSuccess, signFailure } from './actions';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(api.post, 'sessions', { email, password });

    const { user, token } = response.data;

    api.defaults.headers.Authorization = `Bearer ${token}`;

    yield put(signInSuccess(token, user));
    Alert.alert('Sucesso', 'Login efetuado');
  } catch (err) {
    Alert.alert(
      'Falha na autenticação',
      'Ocorreu um erro, por favor verifique seus dados'
    );
    yield put(signFailure());
  }
}

export function* signUp({ payload }) {
  try {
    const { name, email, password } = payload;
    yield call(api.post, 'users', {
      name,
      email,
      password,
    });
    Alert.alert('Sucesso', 'Cadastro efetuado');
  } catch (err) {
    Alert.alert('Falha no cadastro', 'Por favor verifique seus dados.');
    yield put(signFailure());
  }
}

export function setToken({ payload }) {
  // caso o usuário não tenha nada salvo
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export default all([
  // utilizando a action do redux-persist para pegar o token salvo
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
]);
