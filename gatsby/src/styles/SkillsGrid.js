import styled from 'styled-components';

export const SkillsGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(8, auto);
  gap: 5%;
  list-style: none;
  justify-content: center;
  align-items: center;
  font-size: 3em;
  li {
    color: #8491a0;
  }
`;
