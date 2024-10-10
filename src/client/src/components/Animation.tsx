import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { config } from '../config';

function Animation(props: { name: string }) {
    const URL = `${config.API_URL}/static/animations/${props.name}.lottie`;
    return <DotLottieReact src={URL} loop autoplay />;
}

export { Animation };
