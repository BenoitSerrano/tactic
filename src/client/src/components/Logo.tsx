import { config } from '../config';

const HEIGHT = 35;

const logoUrlMapping = {
    mini: `${config.API_URL}/static/images/logo_mini.png`,
    full: `${config.API_URL}/static/images/full_logo.png`,
};

type logoVariantType = 'mini' | 'full';

function Logo(props: { variant: logoVariantType }) {
    return <img src={logoUrlMapping[props.variant]} alt="Logo Tactic" height={HEIGHT} />;
}

export type { logoVariantType };
export { Logo };
