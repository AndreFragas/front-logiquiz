import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Icon from 'src/@core/components/icon';
import {Settings} from 'src/@core/context/settingsContext';
import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown';
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler';
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown';
import {useAuth} from 'src/@prismafive/hooks/use-auth';
import Autocomplete from 'src/layouts/components/Autocomplete';

interface Props {
  hidden: boolean;
  settings: Settings;
  toggleNavVisibility: () => void;
  saveSettings: (values: Settings) => void;
}

const AppBarContent = (props: Props) => {
  const {hidden, settings, saveSettings, toggleNavVisibility} = props;
  const auth = useAuth();

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Box className="actions-left" sx={{mr: 2, display: 'flex', alignItems: 'center'}}>
        {hidden && !settings.navHidden ? (
          <IconButton color="inherit" sx={{ml: -2.75}} onClick={toggleNavVisibility}>
            <Icon fontSize="1.5rem" icon="tabler:menu-2" />
          </IconButton>
        ) : null}
        {auth.user && <Autocomplete hidden={hidden} settings={settings} />}
      </Box>
      <Box className="actions-right" sx={{display: 'flex', alignItems: 'center'}}>
        {/* <LanguageDropdown settings={settings} saveSettings={saveSettings} /> */}
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        {auth.user && (
          <>
            <UserDropdown settings={settings} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default AppBarContent;
