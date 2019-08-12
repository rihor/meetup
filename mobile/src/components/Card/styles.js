import styled from 'styled-components/native';

import Button from '~/components/Button';

export const Container = styled.View`
  background: #fff;
  border-radius: 4px;
  margin-bottom: 20px;
`;

export const Banner = styled.Image`
  width: 100%;
  height: 150px;
  background: #555;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
`;

export const Body = styled.View`
  padding: 15px;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
`;

export const Info = styled.View`
  margin: 10px 0;
`;

export const TextWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: baseline;
  margin-top: 5px;
`;

export const StyledText = styled.Text.attrs({
  numberOfLines: 1,
})`
  margin-left: 5px;
  font-size: 14px;
  color: #999;
`;

export const StyledButton = styled(Button)`
  margin-top: 10px;
  background: #d44059;
`;
