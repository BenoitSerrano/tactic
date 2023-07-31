import { useAlert } from '../../lib/alert';

function useTimeoutAlert() {
    const { displayAlert } = useAlert();

    return { displayTimeoutAlert };

    function displayTimeoutAlert() {
        displayAlert({
            text: 'Votre temps est écoulé. Les réponses remplies après la fin du temps imparti ne seront pas prises en compte. ',
            variant: 'error',
        });
    }
}

export { useTimeoutAlert };
