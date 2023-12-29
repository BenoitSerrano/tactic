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
    return (
        <Tooltip title={props.title}>
            <MuiIconButton
                disabled={props.disabled}
                onClick={props.onClick}
                size={props.size}
                color={props.color}
            >
                {props.isLoading ? (
                    <Loader size="small" />
                ) : (
                    <IconComponent fontSize={props.size} />
                )}
            </MuiIconButton>
        </Tooltip>
    );
}

export { IconButton };
