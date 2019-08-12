import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  flex: 1;
`;

export const MeetupsList = styled.FlatList.attrs({
  showVerticalScrollIndicator: false,
  contentContainerStyle: { padding: 30 },
})``;

export const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  margin: 0px 15px;
`;

export const ErrorMessage = styled.Text`
  color: rgba(255, 255, 255, 0.4);
  font-size: 20px;
  font-weight: bold;
  text-align: center;
`;
