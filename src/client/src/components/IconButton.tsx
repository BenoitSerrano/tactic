import { IconButton as MuiIconButton, Tooltip } from '@mui/material';
import { Loader } from './Loader';

function IconButton(props: {
    title: string;
    size?: 'small' | 'medium' | 'large';
    isLoading?: boolean;
    color?: 'success' | 'warning' | 'error';
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
    IconComponent: React.ElementType;
    disabled?: boolean;
}) {
    const { IconComponent } = props;
    const size = props.size || 'medium';
    return (
        <Tooltip title={props.title}>
            <MuiIconButton
                size={size}
                disabled={props.disabled}
                onClick={props.onClick}
                color={props.color}
            >
                {props.isLoading ? <Loader size={size} /> : <IconComponent fontSize={size} />}
            </MuiIconButton>
        </Tooltip>
    );
}

export { IconButton };
