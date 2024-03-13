import { Typography, styled } from '@mui/material';
import { Link } from 'react-router-dom';
import { ElementType } from 'react';

function SideItemMenu(props: { IconComponent: ElementType; title: string; path: string }) {
    const { IconComponent, title, path } = props;
    return (
        <ItemContainer>
            <Link to={path}>
                <LinkContent>
                    <IconContainer>
                        <IconComponent fontSize="large" />
                    </IconContainer>
                    <Typography>{title}</Typography>
                </LinkContent>
            </Link>
        </ItemContainer>
    );
}

export { SideItemMenu };

const ItemContainer = styled('div')(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));

const IconContainer = styled('div')(({ theme }) => ({ marginRight: theme.spacing(2) }));

const LinkContent = styled('div')({
    display: 'flex',
    alignItems: 'center',
});
