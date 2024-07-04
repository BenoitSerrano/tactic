import { IconButton as MuiIconButton, Tooltip } from '@mui/material';
import { Loader } from './Loader';

function IconButton(props: {
    title: string;
    size?: 'small' | 'medium' | 'large';
    isLoading?: boolean;
    color?: 'success' | 'warning' | 'error' | 'primary' | 'default';
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    IconComponent: React.ElementType;
    disabled?: boolean;
    placement?: 'top' | 'bottom';
}) {
    const { IconComponent } = props;
    const size = props.size || 'medium';
    if (props.disabled) {
        return renderButton();
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
                disabled={props.disabled}
                onClick={props.onClick}
                color={props.color}
            >
                {props.isLoading ? <Loader size={size} /> : <IconComponent fontSize={size} />}
            </MuiIconButton>
        );
    }
}

export { IconButton };
