import { Tooltip } from '@mui/material';
import { Link } from './Link';

function IconLink(props: { title: string; to: string; IconComponent: React.ElementType }) {
    return (
        <Tooltip title={props.title}>
            <Link opensNewTab to={props.to}>
                <props.IconComponent />
            </Link>
        </Tooltip>
    );
}

export { IconLink };
