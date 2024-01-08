import styled from "styled-components";

export const LoginStyled = styled.div`
  height: 100vh;
  width: 100wv;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  background-color: #131324;

  form {
    .brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;

      img {
        height: 5rem;
      }
      h1 {
        color: whitesmoke;
        text-transform: uppercase;
      }
    }

    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;

    span {
      color: #fff;
      text-transform: uppercase;
      text-align: center;

      a {
        color: #4e0eff;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`;
