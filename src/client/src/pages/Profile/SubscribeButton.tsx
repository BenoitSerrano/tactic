import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { LoadingButton } from '@mui/lab';
import { useAlert } from '../../lib/alert';

function SubscribeButton() {
    const { displayAlert } = useAlert();
    const mutation = useMutation<{ url: string }>({
        mutationFn: api.createCheckoutSession,
        onSuccess: ({ url }) => {
            window.location.replace(url);
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: 'Une erreur est survenue. Veuillez réessayer plus tard.',
            });
        },
    });
    return (
        <LoadingButton loading={mutation.isPending} onClick={onClick}>
            Souscrire à l'abonnement mensuel
        </LoadingButton>
    );

    function onClick() {
        mutation.mutate();
    }
}

export { SubscribeButton };
