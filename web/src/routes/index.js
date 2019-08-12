import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

// rotas que precisam de autenticação para acessar
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import MeetupDetails from '../pages/MeetupDetails';
import MeetupEdit from '../pages/MeetupEdit';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/register" component={SignUp} />

      <Route path="/dashboard" component={Dashboard} isPrivate />
      <Route path="/profile" component={Profile} isPrivate />
      <Route path="/meetup/:id" component={MeetupDetails} isPrivate />
      <Route path="/edit/:id" component={MeetupEdit} isPrivate />
    </Switch>
  );
}
