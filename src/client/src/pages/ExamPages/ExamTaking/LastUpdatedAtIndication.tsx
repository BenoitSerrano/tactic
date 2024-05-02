import { Typography, styled } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useEffect, useState } from 'react';
import { Loader } from '../../../components/Loader';
import { IconButton } from '../../../components/IconButton';

function LastUpdatedAtIndication(props: {
    isLoading: boolean;
    lastUpdatedAt: string | undefined;
    onClick: () => void;
}) {
    const [lastUpdatedAt, setLastUpdatedAt] = useState(props.lastUpdatedAt);

    useEffect(() => {
        setLastUpdatedAt(props.lastUpdatedAt);
    }, [props.lastUpdatedAt]);

    return (
        <Container>
            {renderUpdatedAtIndication(lastUpdatedAt)}
            {props.isLoading && <Loader size="small" />}
        </Container>
    );

    function renderUpdatedAtIndication(lastUpdatedAt: string | undefined) {
        if (!lastUpdatedAt) {
            return undefined;
        }
        return (
            <IndicationContainer>
                <IconButton
                    title="Sauvegarder"
                    disabled={props.isLoading}
                    IconComponent={SaveIcon}
                    onClick={props.onClick}
                />
                <Typography>Dernière sauvegarde à {lastUpdatedAt}</Typography>
            </IndicationContainer>
        );
    }
}

const Container = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const IndicationContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1),
}));

export { LastUpdatedAtIndication };
