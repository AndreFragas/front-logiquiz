import Box, {BoxProps} from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import ListItem from '@mui/material/ListItem';
import ListItemButton, {ListItemButtonProps} from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Typography from '@mui/material/Typography';
import {styled, useTheme} from '@mui/material/styles';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {ElementType} from 'react';
import {Settings} from 'src/@core/context/settingsContext';
import {NavGroup, NavLink} from 'src/@core/layouts/types';
import {handleURLQueries} from 'src/@core/layouts/utils';
import {hexToRGBA} from 'src/@core/utils/hex-to-rgba';
import {generateColorVariations} from 'src/@prismafive/helper/color';
import {getLocalStorage} from 'src/@prismafive/storage-controler';
import themeConfig from 'src/configs/themeConfig';
import Translations from 'src/layouts/components/Translations';
import UserIcon from 'src/layouts/components/UserIcon';
import CanViewNavLink from 'src/layouts/components/acl/CanViewNavLink';

interface Props {
  parent?: boolean;
  item: NavLink;
  navHover?: boolean;
  settings: Settings;
  navVisible?: boolean;
  collapsedNavWidth: number;
  navigationBorderWidth: number;
  toggleNavVisibility: () => void;
  isSubToSub?: NavGroup | undefined;
}

const MenuItemTextMetaWrapper = styled(Box)<BoxProps>(({theme}) => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',
  ...(themeConfig.menuTextTruncate && {overflow: 'hidden'}),
}));

const VerticalNavLink = ({
  item,
  parent,
  navHover,
  settings,
  navVisible,
  isSubToSub,
  collapsedNavWidth,
  toggleNavVisibility,
  navigationBorderWidth,
}: Props) => {
  const router = useRouter();
  const {navCollapsed} = settings;
  const icon = parent && !item.icon ? themeConfig.navSubItemIcon : item.icon;
  const theme = useTheme();
  const empresa = getLocalStorage(window, 'empresa');
  const companyColor: string | undefined = empresa?.config_empresa?.cor ?? undefined;
  const variations = companyColor && generateColorVariations(companyColor);
  const mainColor = companyColor ?? theme.palette.primary.main;
  const darkerColor = variations ? variations.darker : theme.palette.primary.dark;

  const MenuNavLink = styled(ListItemButton)<
    ListItemButtonProps & {
      component?: ElementType;
      href: string;
      target?: '_blank' | undefined;
    }
  >(({theme}) => {
    return {
      width: '100%',
      marginLeft: theme.spacing(3.5),
      marginRight: theme.spacing(3.5),
      borderRadius: theme.shape.borderRadius,
      transition: 'padding-left .25s ease-in-out, padding-right .25s ease-in-out',
      '&:hover': {
        backgroundColor: theme.palette.action.hover,
      },
      '&.active': {
        '&, &:hover': {
          boxShadow: `0px 2px 6px ${hexToRGBA(mainColor, 0.48)}`,
          background: `linear-gradient(72.47deg, ${
            theme.direction === 'ltr' ? mainColor : hexToRGBA(mainColor, 0.7)
          } 22.16%, ${theme.direction === 'ltr' ? hexToRGBA(mainColor, 0.7) : mainColor} 76.47%)`,
          '&.Mui-focusVisible': {
            background: `linear-gradient(72.47deg, ${darkerColor} 22.16%, ${hexToRGBA(darkerColor, 0.7)} 76.47%)`,
          },
        },
        '& .MuiTypography-root, & svg': {
          color: `${theme.palette.common.white} !important`,
        },
      },
    };
  });

  const isNavLinkActive = () => {
    if (router.pathname === item.path || handleURLQueries(router, item.path)) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <CanViewNavLink navLink={item}>
      <ListItem disablePadding className="nav-link" disabled={item.disabled || false} sx={{mt: 1, px: '0 !important'}}>
        <MenuNavLink
          component={Link}
          {...(item.disabled && {tabIndex: -1})}
          className={isNavLinkActive() ? 'active' : ''}
          href={item.path === undefined ? '/' : `${item.path}`}
          {...(item.openInNewTab ? {target: '_blank'} : null)}
          onClick={(e: any) => {
            if (item.path === undefined) {
              e.preventDefault();
              e.stopPropagation();
            }
            if (navVisible) {
              toggleNavVisibility();
            }
          }}
          sx={{
            py: 2,
            ...(item.disabled ? {pointerEvents: 'none'} : {cursor: 'pointer'}),
            px: navCollapsed && !navHover ? (collapsedNavWidth - navigationBorderWidth - 22 - 28) / 8 : 4,
            '& .MuiTypography-root, & svg': {
              color: 'text.secondary',
            },
          }}
        >
          <ListItemIcon
            sx={{
              transition: 'margin .25s ease-in-out',
              ...(navCollapsed && !navHover ? {mr: 0} : {mr: 2}),
              ...(parent ? {ml: 1.5, mr: 3.5} : {}), // This line should be after (navCollapsed && !navHover) condition for proper styling
              '& svg': {
                fontSize: '0.625rem',
                ...(!parent ? {fontSize: '1.4rem'} : {}),
                ...(parent && item.icon ? {fontSize: '1.2rem'} : {}),
              },
            }}
          >
            <UserIcon icon={icon as string} />
          </ListItemIcon>

          <MenuItemTextMetaWrapper
            sx={{
              ...(isSubToSub ? {ml: 2} : {}),
              ...(navCollapsed && !navHover ? {opacity: 0} : {opacity: 1}),
            }}
          >
            <Typography
              {...((themeConfig.menuTextTruncate || (!themeConfig.menuTextTruncate && navCollapsed && !navHover)) && {
                noWrap: true,
              })}
            >
              <Translations text={item.title} isNavigationMenu />
            </Typography>
            {item.badgeContent ? (
              <Chip
                size="small"
                label={item.badgeContent}
                color={item.badgeColor || 'primary'}
                sx={{
                  height: 22,
                  minWidth: 22,
                  '& .MuiChip-label': {px: 1.5, textTransform: 'capitalize'},
                }}
              />
            ) : null}
          </MenuItemTextMetaWrapper>
        </MenuNavLink>
      </ListItem>
    </CanViewNavLink>
  );
};

export default VerticalNavLink;
