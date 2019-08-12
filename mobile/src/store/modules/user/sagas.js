import { all, call, put, takeLatest } from 'redux-saga/effects';
import { Alert } from 'react-native';

import api from '~/services/api';
import { updateProfileSuccess, updateProfileFailure } from './actions';

// pode receber um objeto {name, email, oldPassword, password, confirmPassword}
export function* updateProfile({ payload }) {
  try {
    const { name, email, ...rest } = payload.data;
    const profile = Object.assign(
      { name, email },
      rest.oldPassword ? rest : {}
    );
    const response = yield call(api.put, 'users', profile);

    yield put(updateProfileSuccess(response.data));
    Alert.alert('Perfil atualizado', 'Seu perfil foi atualizado com sucesso!');
  } catch (err) {
    Alert.alert('Erro', 'Ocorreu um erro interno.');
    yield put(updateProfileFailure());
  }
}

export default all([takeLatest('@user/UPDATE_PROFILE_REQUEST', updateProfile)]);
