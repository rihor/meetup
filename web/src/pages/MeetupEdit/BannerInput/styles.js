import styled from 'styled-components';

export const Container = styled.div`
  margin-bottom: 10px;
  align-self: stretch;

  label {
    height: 300px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    align-items: center;
    transition: box-shadow 0.2s;
    position: relative;
    cursor: pointer;

    &:hover {
      box-shadow: 0 4px 4px rgba(0, 0, 0, 0.2);
    }

    span {
      color: #999;
      font-weight: bold;
      font-size: 16px;
      flex-grow: 1;
      align-self: center;
      text-align: center;
    }

    img {
      height: 100%;
      width: 100%;
      border-radius: 4px;
      z-index: 1;
    }

    /* não mostrar o verdadeiro input */
    input {
      display: none;
    }
  }
`;

export const ContainerPlaceholder = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
  }
`;
