import { Paper } from '@mui/material';
import { styled } from '@mui/system';

const PaperCard = styled(Paper)`
  padding: 1em;
  margin-bottom: 1em;
  background-color: white;
`;

PaperCard.defaultProps = {
  elevation: 3,
};

export default PaperCard;
