import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import { format, formatRelative, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '~/services/api';
import Header from '~/components/Header';
import Background from '~/components/Background';
import DatePicker from '~/components/DateInput';
import Card from '~/components/Card';
import { Container, MeetupsList, ErrorMessage, ErrorContainer } from './styles';

function Dashboard({ isFocused }) {
  const [date, setDate] = useState(new Date());
  const [page, setPage] = useState(1);
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);

  async function loadMeetups(pageToLoad = 1) {
    setError(false);
    setEmpty(false);
    try {
      const { data } = await api.get('meetup', {
        params: { date: format(date, 'yyyy-MM-dd'), page: pageToLoad },
      });

      const isNotTheFirstPage = pageToLoad - 1 !== 1;

      if (data.length === 0 && isNotTheFirstPage) {
        setEmpty(true);
        setMeetups([]);
        return;
      }

      const formattedMeetups = data.map(meetup => ({
        ...meetup,
        formattedDate: formatRelative(parseISO(meetup.date), new Date(), {
          locale: pt,
        }),
      }));

      setPage(formattedMeetups.length >= 1 ? pageToLoad : pageToLoad - 1);
      setMeetups(
        pageToLoad >= 2 ? [...meetups, ...formattedMeetups] : formattedMeetups
      );
    } catch (err) {
      setLoading(false);
      setError(true);
    }
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (isFocused) {
        await loadMeetups();
      }
      setLoading(false);
    }
    load();
    // eslint-disable-next-line
  }, [isFocused, date]);

  async function handleNextPage() {
    await loadMeetups(page + 1);
  }

  async function handleSubscribe(id) {
    const response = await api.post(`/meetup/${id}/subscribe`).catch(err => {
      if (err.response && err.response.data) {
        Alert.alert('Error', err.response.data.error);
      }
    });
    if (response.status === 200) {
      Alert.alert('Sucesso', 'Inscrição feita com sucesso!');
    }
  }

  return (
    <Background>
      <Header />

      <Container>
        <DatePicker date={date} onChange={setDate} />
        {empty && (
          <ErrorContainer>
            <Icon name="clear" size={80} color="rgba(255,255,255,0.4)" />
            <ErrorMessage>Esse dia não tem meetups...</ErrorMessage>
          </ErrorContainer>
        )}
        {error && (
          <ErrorContainer>
            <Icon
              name="error-outline"
              size={80}
              color="rgba(255,255,255,0.4)"
            />
            <ErrorMessage>Ocorreu um erro...</ErrorMessage>
          </ErrorContainer>
        )}
        {loading ? (
          <ActivityIndicator style={{ flex: 1 }} size={60} color="#fff" />
        ) : (
          <MeetupsList
            data={meetups}
            keyExtractor={item => String(item.id)}
            onEndReachedThreshold={0.01}
            onEndReached={handleNextPage}
            renderItem={({ item }) => (
              <Card
                meetup={item}
                buttonAction={() => handleSubscribe(item.id)}
              />
            )}
          />
        )}
      </Container>
    </Background>
  );
}

const tabBarIcon = ({ tintColor }) => (
  <Icon name="format-list-bulleted" size={25} color={tintColor} />
);

tabBarIcon.propTypes = {
  tintColor: PropTypes.string.isRequired,
};

Dashboard.navigationOptions = {
  tabBarLabel: 'Meetups',
  tabBarIcon,
};

Dashboard.propTypes = {
  isFocused: PropTypes.bool.isRequired,
};

// recebe props de react-navigation, permite escutar o foco
export default withNavigationFocus(Dashboard);
