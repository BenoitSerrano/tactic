import { LoadingButton as MuiLoadingButton } from '@mui/lab';
import { Tooltip } from '@mui/material';
import { ReactNode } from 'react';

function LoadingButton(props: {
    titleWhenDisabled?: string;
    disabled?: boolean;
    isLoading?: boolean;
    variant?: 'text' | 'outlined' | 'contained';
    startIcon?: React.ReactNode;
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode;
}) {
    if (props.titleWhenDisabled) {
        return (
            <Tooltip title={props.titleWhenDisabled}>
                <div>{renderButton()}</div>
            </Tooltip>
        );
    } else {
        return renderButton();
    }

    function renderButton() {
        return (
            <MuiLoadingButton
                disabled={props.disabled}
                loading={props.isLoading}
                variant={props.variant}
                startIcon={props.startIcon}
                onClick={props.onClick}
            >
                {props.children}
            </MuiLoadingButton>
        );
    }
}

export { LoadingButton };
// disabled={props.button.isDisabled}
// loading={isLoading}
// variant={shape}
// startIcon={<IconComponent />}
// onClick={onClick}
