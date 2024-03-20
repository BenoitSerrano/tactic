const HEIGHT = 35;

const logoUrlMapping = {
    mini: './logo_mini.png',
    full: 'https://tactic-app.fr/full_logo.png',
};

type logoVariantType = 'mini' | 'full';

function Logo(props: { variant: logoVariantType }) {
    return <img src={logoUrlMapping[props.variant]} alt="Logo Tactic" height={HEIGHT} />;
}

export type { logoVariantType };
export { Logo };
