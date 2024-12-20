import { IconButton as MuiIconButton, Tooltip } from '@mui/material';
import { Loader } from './Loader';

function IconButton(props: {
    title: string;
    size?: 'small' | 'medium' | 'large';
    isLoading?: boolean;
    color?: 'success' | 'warning' | 'error' | 'primary' | 'default';
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void;
    IconComponent: React.ElementType;
    disabled?: boolean;
    type?: 'submit';
    titleWhenDisabled?: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
}) {
    const { IconComponent } = props;
    const size = props.size || 'medium';
    if (props.disabled) {
        if (props.titleWhenDisabled) {
            return (
                <Tooltip title={props.titleWhenDisabled} placement={props.placement}>
                    <div>{renderButton()}</div>
                </Tooltip>
            );
        } else {
            return renderButton();
        }
    }
    return (
        <Tooltip title={props.title} placement={props.placement}>
            {renderButton()}
        </Tooltip>
    );

    function renderButton() {
        return (
            <MuiIconButton
                size={size}
                onMouseEnter={props.onMouseEnter}
                disabled={props.disabled}
                onClick={props.onClick}
                color={props.color}
                type={props.type}
            >
                {props.isLoading ? <Loader size={size} /> : <IconComponent fontSize={size} />}
            </MuiIconButton>
        );
    }
}

export { IconButton };
