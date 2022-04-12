import styled from 'styled-components';

const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
  margin-bottom: 10px;
  span{
    font-size: 18px;
  }
`;

const FiltersTitle = styled.p`
  margin: 0px 0px 9px;
  font-size: 17px;
  border-bottom: 1px solid lightgrey;
  padding-bottom: 8px;
`;

const FormTitle = styled.div`
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: #525252;
  border-bottom: 2px solid #d5d5d5;
  margin-bottom: 25px;
  padding-bottom: 5px;
`;

const FormBtnContainer = styled.div`
  margin-top: 3rem;
  margin-bottom: 10px;
  text-align: center;
  
  button {
    margin: 0px 7px;
  }
`;

export {
  FormBtnContainer,
  FormTitle,
  TableHeader,
  FiltersTitle,
};