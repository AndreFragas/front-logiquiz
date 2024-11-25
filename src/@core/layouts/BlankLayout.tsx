import Box, {BoxProps} from '@mui/material/Box';
import {styled} from '@mui/material/styles';
import {BlankLayoutProps} from './types';

const BlankLayoutWrapper = styled(Box)<BoxProps>(({theme}) => ({
  height: '100vh',

  '& .content-center': {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(5),
  },

  '& .content-right': {
    display: 'flex',
    minHeight: '100vh',
    overflowX: 'hidden',
    position: 'relative',
  },
}));

const BlankLayout = ({children}: BlankLayoutProps) => {
  return (
    <BlankLayoutWrapper className="layout-wrapper">
      <Box className="app-content" sx={{overflow: 'auto', minHeight: '100vh', position: 'relative'}}>
        {children}
      </Box>
    </BlankLayoutWrapper>
  );
};

export default BlankLayout;
