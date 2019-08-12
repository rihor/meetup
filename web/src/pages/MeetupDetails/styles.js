import styled from 'styled-components';

export const Container = styled.div`
  max-width: 900px;
  margin: 50px auto;
  padding: 0 20px;
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  h1 {
    min-width: 300px;
    color: #fff;
    font-weight: bold;
  }
  ul {
    list-style: none;
    display: flex;
  }

  button {
    border-radius: 4px;
    border: 0;
    padding: 5px 20px;
    display: flex;
    align-items: center;
    font-weight: bold;
    color: #fff;
    transition: box-shadow 0.1s;

    a {
      color: #fff;
      display: flex;
      align-items: center;
    }

    & + button {
      margin-left: 10px;
    }

    svg {
      margin-right: 5px;
    }
  }

  .blue {
    background: #4dbaf9;

    &:hover {
      box-shadow: 0 0 12px rgba(77, 186, 249, 0.8);
    }
  }

  .red {
    background: #d44059;
    &:hover {
      box-shadow: 0 0 12px rgba(212, 64, 89, 0.8);
    }
  }
`;

export const Loading = styled.p`
  align-self: center;
  text-align: center;
  margin-top: 50px;
  color: #fff;
  font-weight: bold;
`;

export const Content = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;

  p {
    display: block;
  }
`;

export const ImageContainer = styled.div`
  img {
    height: 300px;
    width: 100%;
    border-radius: 4px;
  }
`;

export const MeetupInfo = styled.div`
  margin-top: 15px;

  p {
    color: #fff;
    line-height: 20px;
  }

  footer {
    margin-top: 30px;
    color: #999;
    display: flex;
    align-items: center;
    time {
      display: flex;
      align-items: center;

      svg {
        margin-right: 5px;
      }
    }
    span {
      margin-left: 20px;
      display: flex;
      align-items: center;

      svg {
        margin-right: 5px;
      }
    }
  }
`;
