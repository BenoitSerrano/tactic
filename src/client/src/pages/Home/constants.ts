import { pathHandler } from '../../lib/pathHandler';

type navLinkType = { to: string; label: string };
const NAV_LINKS: navLinkType[] = [
    { to: pathHandler.getRoutePath('PRODUCT'), label: 'Produit' },
    { to: pathHandler.getRoutePath('PRICING'), label: 'Tarifs' },
];

export { NAV_LINKS };
