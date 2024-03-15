import { Typography, styled } from '@mui/material';
import { ElementType } from 'react';
import { Link } from '../Link';

const HighItemContainer = styled('div')(({ theme }) => ({
    paddingLeft: theme.spacing(0),
    marginTop: theme.spacing(2),
}));
const LowItemContainer = styled('div')(({ theme }) => ({
    paddingLeft: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));

const levelMapping = {
    high: {
        ContainerComponent: HighItemContainer,
        typographyVariant: 'h5' as const,
        iconSize: 'large',
    },
    low: {
        ContainerComponent: LowItemContainer,
        typographyVariant: 'h6' as const,
        iconSize: 'medium',
    },
};

function SideItemMenu(props: {
    IconComponent: ElementType;
    title: string;
    path: string;
    level: 'high' | 'low';
}) {
    const { IconComponent, title, path } = props;
    const { ContainerComponent, typographyVariant, iconSize } = levelMapping[props.level];
    return (
        <ContainerComponent>
            <Link to={path}>
                <LinkContent>
                    <IconContainer>
                        <IconComponent fontSize={iconSize} />
                    </IconContainer>
                    <Typography variant={typographyVariant}>{title}</Typography>
                </LinkContent>
            </Link>
        </ContainerComponent>
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
