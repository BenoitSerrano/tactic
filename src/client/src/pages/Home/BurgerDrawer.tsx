import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { NAV_LINKS } from './constants';
import { Link } from '../../components/Link';

function BurgerDrawer(props: { isOpen: boolean; close: () => void }) {
    return (
        <Drawer onClose={props.close} open={props.isOpen} anchor="right">
            <Box role="presentation" onClick={props.close}>
                <List>
                    {NAV_LINKS.map((NAV_LINK) => (
                        <ListItem key={`${NAV_LINK.to}`} disablePadding>
                            <Link to={NAV_LINK.to}>
                                <ListItemText primary={NAV_LINK.label} />
                            </Link>
                            <ListItemIcon>
                                <ChevronRightIcon />
                            </ListItemIcon>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Drawer>
    );
}

export { BurgerDrawer };
