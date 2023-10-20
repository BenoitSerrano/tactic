import { List, ListItem, ListItemIcon, ListItemText, Typography, styled } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

function Offer(props: { title: string; features: string[]; price: number }) {
    return (
        <Container>
            <TitleContainer>
                <Typography variant="h4">{props.title}</Typography>
            </TitleContainer>
            <Typography variant="h3">{props.price} €</Typography>
            <Typography>par mois</Typography>
            <List>
                {props.features.map((feature) => (
                    <ListItem>
                        <ListItemIcon>
                            <CheckIcon />
                        </ListItemIcon>
                        <ListItemText>{feature}</ListItemText>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}

const Container = styled('div')({ height: '100%' });
const TitleContainer = styled('div')(({ theme }) => ({ marginBottom: theme.spacing(3) }));

export { Offer };
