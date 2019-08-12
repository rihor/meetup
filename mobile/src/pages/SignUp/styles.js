import { Platform } from 'react-native';
import styled from 'styled-components/native';

import Input from '~/components/Input';
import Button from '~/components/Button';

export const Container = styled.KeyboardAvoidingView.attrs({
  enabled: Platform.OS === 'ios',
  behavior: 'padding',
})`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
`;

export const Image = styled.Image`
  width: 50px;
  height: 50px;
`;

export const Form = styled.View`
  align-self: stretch;
  margin-top: 50px;
`;

export const StyledInput = styled(Input)`
  margin-bottom: 10px;
`;

export const StyledButton = styled(Button)`
  margin-top: 5px;
`;

export const ChangeForm = styled.TouchableOpacity`
  margin-top: 20px;
`;

export const ChangeFormText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;
