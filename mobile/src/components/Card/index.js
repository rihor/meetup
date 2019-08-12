import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {
  Container,
  Banner,
  Body,
  Title,
  Info,
  StyledText,
  StyledButton,
  TextWrapper,
} from './styles';

export default function Card({ meetup, buttonAction }) {
  return (
    <Container>
      <Banner source={{ uri: meetup.banner.url }} />
      <Body>
        <Title>{meetup.title}</Title>
        <Info>
          <TextWrapper>
            <Icon name="event" size={15} color="#999" />
            <StyledText>{meetup.formattedDate}</StyledText>
          </TextWrapper>
          <TextWrapper>
            <Icon name="place" size={15} color="#999" />
            <StyledText>{meetup.location}</StyledText>
          </TextWrapper>
          <TextWrapper>
            <Icon name="person" size={15} color="#999" />
            <StyledText>Organizador: {meetup.User.name}</StyledText>
          </TextWrapper>
        </Info>
        <StyledButton onPress={buttonAction}>
          {meetup.subscribed ? 'Cancelar inscrição' : 'Realizar inscrição'}
        </StyledButton>
      </Body>
    </Container>
  );
}

Card.propTypes = {
  meetup: PropTypes.shape({
    subscribed: PropTypes.bool,
    title: PropTypes.string.isRequired,
    banner: PropTypes.shape({ url: PropTypes.string.isRequired }),
    formattedDate: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    User: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  buttonAction: PropTypes.func.isRequired,
};
