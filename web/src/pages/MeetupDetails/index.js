import React, { useEffect, useState } from 'react';
import {
  MdEdit,
  MdDeleteForever,
  MdLocationOn,
  MdInsertInvitation,
} from 'react-icons/md';
import propTypes from 'prop-types';
import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import history from '../../services/history';
import {
  Container,
  Header,
  Loading,
  Content,
  ImageContainer,
  MeetupInfo,
} from './styles';

export default function MeetupDetails({ match }) {
  const [loading, setLoading] = useState(false);
  const [meetup, setMeetup] = useState({});

  useEffect(() => {
    async function loadMeetup() {
      try {
        setLoading(true);
        const { id } = match.params;
        const response = await api.get(`meetup/${id}`);

        const meetupWithFormattedDate = {
          ...response.data,
          formattedDate: format(
            parseISO(response.data.date),
            "d 'de' MMMM', às' HH'h' mm'min'",
            {
              locale: pt,
            }
          ),
        };
        console.tron.log(meetupWithFormattedDate);
        setMeetup(meetupWithFormattedDate);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        history.push('/dashboard');
      }
    }
    loadMeetup();
  }, [match.params]);

  async function handleDelete() {
    await api.delete(`/meetup/${meetup.id}`);
    history.push('/dashboard');
  }

  return (
    <Container>
      {loading ? (
        <Loading>Carregando...</Loading>
      ) : (
        <>
          <Header>
            <h1>{meetup.title}</h1>
            {!meetup.past && (
              <ul>
                <button type="button" className="blue">
                  <Link to={`/edit/${meetup.id}`}>
                    <MdEdit size={20} color="#FFF" /> Editar
                  </Link>
                </button>
                <button type="button" className="red" onClick={handleDelete}>
                  <MdDeleteForever size={20} color="#FFF" />
                  Cancelar
                </button>
              </ul>
            )}
          </Header>

          <Content>
            <ImageContainer>
              <img
                src={meetup.banner && meetup.banner.url}
                alt={meetup.banner && meetup.banner.name}
              />
            </ImageContainer>
            <MeetupInfo>
              <p>{meetup.description}</p>
              <footer>
                <time>
                  <MdInsertInvitation size={20} color="#999" />
                  {meetup.formattedDate}
                </time>
                <span>
                  <MdLocationOn size={20} color="#999" />
                  {meetup.location}
                </span>
              </footer>
            </MeetupInfo>
          </Content>
        </>
      )}
    </Container>
  );
}

MeetupDetails.propTypes = {
  match: propTypes.shape({
    params: propTypes.shape({
      id: propTypes.string.isRequired,
    }),
  }).isRequired,
};
