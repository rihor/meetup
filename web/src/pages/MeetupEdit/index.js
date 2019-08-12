import React, { useEffect, useState } from 'react';
import propTypes from 'prop-types';
import { MdAddCircleOutline } from 'react-icons/md';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';

import { isBefore, parseISO } from 'date-fns';
import { toast } from 'react-toastify';
import api from '../../services/api';
import history from '../../services/history';
import { Container } from './styles';
import BannerInput from './BannerInput';
import DatePickerInput from './DatePickerInput';

export default function MeetupEdit({ match }) {
  const schema = Yup.object().shape({
    banner_id: Yup.number().required('O banner é necessário'),
    title: Yup.string('Insira um título válido').required(
      'O título é necessário'
    ),
    description: Yup.string('Insira uma descrição válida').required(
      'A descrição é necessária'
    ),
    date: Yup.date('Insira uma data válida').required(
      'A data do meetup é necessária'
    ),
    location: Yup.string('Insira uma localidade válida').required(
      'A localidade é necessária'
    ),
  });

  const [meetup, setMeetup] = useState({});
  const { id } = match.params;
  // flag para o tipo de criação
  const createNew = id === 'new';

  useEffect(() => {
    async function loadMeetup() {
      try {
        const { data } = await api.get(`meetup/${id}`);
        const meetupFormatted = {
          ...data,
          date: parseISO(data.date),
          past: isBefore(parseISO(data.date), new Date()),
        };
        setMeetup(meetupFormatted);
      } catch (error) {
        toast.error('Ocorreu um erro interno.');
      }
    }
    // carrega os dados existentes apenas caso tenha recebido um id
    if (!createNew) {
      loadMeetup();
    }
  }, [createNew, id]);

  async function handleSubmit({
    title,
    description,
    location,
    banner_id,
    date,
  }) {
    let meetupId;
    try {
      if (createNew) {
        const { data } = await api.post('meetup', {
          title,
          description,
          location,
          banner_id,
          date,
        });
        meetupId = data.id;
        toast.success('Meetup criado com sucesso!');
      } else {
        const { data } = await api.put(`meetup/${meetup.id}`, {
          title,
          description,
          location,
          banner_id,
          date,
        });
        meetupId = data.id;
        toast.success('Meetup atualizado com sucesso!');
      }
      history.push(`/meetup/${meetupId}`);
    } catch (error) {
      toast.error('Ocorreu um erro inesperado.');
    }
  }

  return (
    <Container>
      <Form initialData={meetup} onSubmit={handleSubmit} schema={schema}>
        {console.tron.log('meetup')}
        {console.tron.log(meetup)}
        {console.tron.log('meetup')}
        <BannerInput name="banner_id" />
        <Input name="title" placeholder="Título do Meetup" />
        <Input
          name="description"
          multiline
          rows={10}
          placeholder="Descrição completa"
          value={meetup.description}
        />
        <DatePickerInput name="date" placeholder="A data e hora do meetup" />

        <Input name="location" placeholder="Localização" />
        <button type="submit">
          <MdAddCircleOutline size={20} color="#fff" />
          Salvar meetup
        </button>
      </Form>
    </Container>
  );
}

MeetupEdit.propTypes = {
  match: propTypes.shape({
    params: propTypes.shape({
      id: propTypes.string.isRequired,
    }),
  }).isRequired,
};
