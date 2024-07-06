import { LoadingButton } from '@mui/lab';
import { Tooltip, styled } from '@mui/material';

type iconButtonPropsType = {
    isLoading: boolean;
    type?: 'submit';
    IconComponent: React.ElementType;
    isDisabled?: boolean;
    label: string;
    isResponsive?: boolean;
};

function LoadingIconButton(props: iconButtonPropsType) {
    const { isResponsive } = props;

    if (!isResponsive) {
        return <LoadingIconAndTextButton {...props} />;
    }

    return (
        <>
            <LargeContainer>
                <LoadingIconAndTextButton {...props} />
            </LargeContainer>
            <SmallContainer>
                <LoadingIconOnlyButton {...props} />
            </SmallContainer>
        </>
    );
}

function LoadingIconAndTextButton(props: iconButtonPropsType) {
    const { isLoading, IconComponent, isDisabled, label, type } = props;

    return (
        <LoadingButton
            loading={isLoading}
            variant="contained"
            type={type}
            startIcon={<IconComponent />}
            disabled={isDisabled}
        >
            {label}
        </LoadingButton>
    );
}

function LoadingIconOnlyButton(props: iconButtonPropsType) {
    const { isLoading, IconComponent, isDisabled, label, type } = props;

    return (
        <Tooltip title={label}>
            <LoadingButton
                loading={isLoading}
                variant="contained"
                type={type}
                startIcon={<IconComponent />}
                disabled={isDisabled}
            ></LoadingButton>
        </Tooltip>
    );
}

const LargeContainer = styled('div')(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        display: 'none',
    },
}));
const SmallContainer = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'none',
    },
}));

export { LoadingIconButton };
