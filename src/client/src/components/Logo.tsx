const HEIGHT = 35;

const logoUrlMapping = {
    mini: 'https://tactic-app.fr/logo_mini.png',
    full: 'https://tactic-app.fr/full_logo.png',
};

function Logo(props: { variant: 'mini' | 'full' }) {
    return <img src={logoUrlMapping[props.variant]} alt="Logo Tactic" height={HEIGHT} />;
}

export { Logo };
