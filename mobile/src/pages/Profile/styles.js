import styled from 'styled-components/native';

import Input from '~/components/Input';
import Button from '~/components/Button';

export const ScrollContainer = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: { padding: 30 },
})`
  align-self: stretch;
  flex: 1;
`;

export const FormInput = styled(Input)`
  margin-bottom: 10px;
`;

export const DivisionStroke = styled.View`
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
  margin: 20px 0 30px;
`;

export const SaveButton = styled(Button)`
  margin-top: 5px;
`;

export const LogoutButton = styled(Button)`
  margin-top: 10px;
  background: #f64c75;
`;
