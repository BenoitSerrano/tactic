import { Typography, styled } from '@mui/material';
import { ElementType } from 'react';
import { Link } from '../Link';

const levelMapping = {
    high: {
        typographyVariant: 'h5' as const,
        iconSize: 'large',
    },
    medium: {
        typographyVariant: 'h5' as const,
        iconSize: 'medium',
    },
    low: {
        typographyVariant: 'h6' as const,
        iconSize: 'small',
    },
};

function SideItemMenu(props: {
    IconComponent?: ElementType;
    title: string;
    path: string;
    level: 'high' | 'medium' | 'low';
}) {
    const { IconComponent, title, path } = props;
    const { typographyVariant, iconSize } = levelMapping[props.level];
    return (
        <Container>
            <Link to={path}>
                <LinkContent>
                    {!!IconComponent && (
                        <IconContainer>
                            <IconComponent fontSize={iconSize} />
                        </IconContainer>
                    )}
                    <Typography variant={typographyVariant}>{title}</Typography>
                </LinkContent>
            </Link>
        </Container>
    );
}

export { SideItemMenu };

const IconContainer = styled('div')(({ theme }) => ({
    marginRight: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
}));

const LinkContent = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

const Container = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
}));
