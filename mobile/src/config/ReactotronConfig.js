import reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';
import reactotronSaga from 'reactotron-redux-saga';

import { ip } from '~/services/api';

if (__DEV__) {
  // precisa do ip para se conectar ao celular
  const tron = reactotron
    .configure({ host: ip })
    .useReactNative()
    .use(reactotronRedux())
    .use(reactotronSaga())
    .connect();

  tron.clear();

  console.tron = tron;
}
