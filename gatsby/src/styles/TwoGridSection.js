import styled from 'styled-components';

export const TwoGridSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(550px, 1fr));
  justify-content: center;
  align-items: center;
  padding: 5%;
`;
