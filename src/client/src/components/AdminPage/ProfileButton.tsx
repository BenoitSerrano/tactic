import { useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { pathHandler } from '../../lib/pathHandler';
import { IconButton } from '../IconButton';

function ProfileButton() {
    const navigate = useNavigate();
    const title = 'Profil';
    return (
        <>
            <div>
                <IconButton IconComponent={AccountCircleIcon} title={title} onClick={onClick} />
            </div>
        </>
    );

    function onClick() {
        navigate(pathHandler.getRoutePath('PROFILE'));
    }
}

export { ProfileButton };
