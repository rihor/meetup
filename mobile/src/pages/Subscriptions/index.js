import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import { parseISO, formatRelative } from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '~/services/api';
import Background from '~/components/Background';
import Card from '~/components/Card';
import Header from '~/components/Header';
import { Container, MeetupsList, ErrorMessage, ErrorContainer } from './styles';

function Subscriptions({ isFocused }) {
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);

  async function loadMeetups() {
    setLoading(true);
    setEmpty(false);
    const { data } = await api.get('subscriptions');
    if (data && data.length === 0) {
      setLoading(false);
      setEmpty(true);
      setMeetups([]);
      return;
    }
    // filtrar os dados
    const meetupsData = data.map(({ Meetup: meetup }) => ({
      subscribed: true,
      ...meetup,
      formattedDate: formatRelative(parseISO(meetup.date), new Date(), {
        locale: pt,
      }),
    }));
    setMeetups(meetupsData);
    setLoading(false);
  }

  useEffect(() => {
    if (isFocused) loadMeetups();
  }, [isFocused]);

  async function handleUnsubscribe(id) {
    const response = await api
      .delete(`/meetup/${id}/unsubscribe`)
      .catch(err => {
        if (err.response && err.response.data) {
          Alert.alert('Error', err.response.data.error);
        }
      });
    if (response.status === 200) {
      loadMeetups();
      Alert.alert('Sucesso', 'Você se desinscreveu com sucesso!');
    }
  }

  return (
    <Background>
      <Header />
      {empty && (
        <ErrorContainer>
          <Icon name="clear" size={80} color="rgba(255,255,255,0.4)" />
          <ErrorMessage>Não está inscrito em nenhum meetup...</ErrorMessage>
        </ErrorContainer>
      )}
      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} size={60} color="#fff" />
      ) : (
        <Container>
          <MeetupsList
            data={meetups}
            keyExtractor={item => String(item.id)}
            renderItem={({ item }) => (
              <Card
                meetup={item}
                buttonAction={() => handleUnsubscribe(item.id)}
              />
            )}
          />
        </Container>
      )}
    </Background>
  );
}

const tabBarIcon = ({ tintColor }) => (
  <Icon name="local-offer" size={25} color={tintColor} />
);

tabBarIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

Subscriptions.navigationOptions = {
  tabBarLabel: 'Inscrições',
  tabBarIcon,
};

Subscriptions.propTypes = {
  isFocused: PropTypes.bool.isRequired,
};

// recebe props de react-navigation, permite escutar o foco
export default withNavigationFocus(Subscriptions);
