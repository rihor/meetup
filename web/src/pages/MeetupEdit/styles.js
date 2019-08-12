import styled from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  max-width: 900px;
  margin: 50px auto;

  form {
    display: flex;
    flex-direction: column;
    padding: 0 20px;

    /* estilizando o react-datepicker */
    .react-datepicker-wrapper {
      margin: 10px 0;
    }

    .react-datepicker-wrapper,
    .react-datepicker__input-container,
    .react-datepicker__input-container input {
      width: 100%;
    }

    input,
    textarea {
      background: rgba(0, 0, 0, 0.1);
      border: 0;
      border-radius: 4px;
      height: 44px;
      padding: 0 15px;
      color: #fff;

      &::placeholder {
        color: rgba(255, 255, 255, 0.7);
      }

      & + input,
      & + textarea {
        margin-top: 10px;
      }
    }

    textarea {
      height: 150px;
      padding: 15px;
      resize: none;

      &::-webkit-scrollbar {
        width: 10px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        margin: 20px;
        cursor: pointer;
        border-radius: 4px;
        background-color: #f94d6a;
      }
    }

    > button {
      align-self: flex-end;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px 0 0;
      width: 200px;
      height: 44px;
      background: #f94d6a;
      font-weight: bold;
      color: #fff;
      border: 0;
      border-radius: 4px;
      font-size: 16px;
      transition: background 0.2s;
      &:hover {
        background: ${darken(0.03, '#F94D6A')};
      }
      svg {
        margin-right: 10px;
      }
    }

    span {
      color: #fff;
      font-weight: bold;
      font-size: 16px;
    }
  } /* fim do form */
`;
