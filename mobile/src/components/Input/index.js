/**
 * Exemplo simples de uso:
 * <Input
 *    icon={{ type: 'community', name: 'lock-question' }}
 *    placeholder="Confirme sua nova senha"
 * />
 *
 * Ou
 *
 * <FormInput icon="person-outline" placeholder="Nome" />
 */

import React, { forwardRef } from 'react';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialComunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import PropTypes from 'prop-types';

import { Container, TInput } from './styles';

function Input({ style, icon, ...rest }, ref) {
  return (
    <Container style={style}>
      {icon && icon.type && icon.type === 'community' && (
        <MaterialComunityIcon
          name={icon.name}
          size={20}
          color="rgba(255,255,255,0.6)"
        />
      )}
      {typeof icon === 'string' && (
        <MaterialIcon name={icon} size={20} color="rgba(255,255,255,0.6)" />
      )}
      <TInput {...rest} ref={ref} />
    </Container>
  );
}

Input.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      type: PropTypes.oneOf(['community']).isRequired,
      name: PropTypes.string.isRequired,
    }),
  ]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Input.defaultProps = {
  icon: null,
  style: {},
};

export default forwardRef(Input);
