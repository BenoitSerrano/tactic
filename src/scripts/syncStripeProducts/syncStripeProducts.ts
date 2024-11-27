import { dataSource } from '../../dataSource';
import { stripeApi } from '../../lib/stripeApi';

import { Package } from '../../modules/package';

type packageDtoType = {
    paperCount: number;
    price: number;
    stripeProductId: string;
    stripePriceId: string;
};

async function syncStripeProducts() {
    console.log('=== syncStripeProducts ===');
    console.log('Initializing database...');
    await dataSource.initialize();
    console.log('Database initialized!');
    const packageRepository = dataSource.getRepository(Package);

    console.log('Erasing local database of packages...');

    await packageRepository.delete({});

    console.log('Fetching stripe products...');

    const stripeProducts = (await stripeApi.getAllProducts()).data;
    console.log(`${stripeProducts.length} products fetched.`);
    console.log('Fetching stripe prices...');
    const stripePrices = (await stripeApi.getAllPrices()).data;

    console.log(`${stripePrices.length} prices fetched.`);
    const packageDtos: packageDtoType[] = [];
    for (const stripeProduct of stripeProducts) {
        const paperCount = Number(stripeProduct.metadata['paperCount']);

        if (isNaN(paperCount) || !paperCount) {
            throw new Error(
                `Cannot sync product ${stripeProduct.id}: stripeProduct.metadata.paperCount equals "${stripeProduct.metadata['paperCount']}"`,
            );
        }

        if (!stripeProduct.default_price) {
            throw new Error(
                `Cannot sync product ${stripeProduct.id}: stripeProduct.default_price equals "${stripeProduct.default_price}"`,
            );
        }
        const stripePrice = stripePrices.find(
            (stripePrice) => stripePrice.id === stripeProduct.default_price,
        );

        if (!stripePrice) {
            throw new Error(
                `Cannot sync product ${stripeProduct.id}: could not find stripePrice with id "${stripeProduct.default_price}"`,
            );
        }
        const stripePriceId = stripePrice.id;
        const priceInCents = stripePrice.unit_amount;
        if (priceInCents === null) {
            throw new Error(
                `Cannot sync product ${stripeProduct.id} and stripePrice ${stripePrice.id}: stripePrice.unit_amount is null`,
            );
        }
        const price = priceInCents / 100;
        const stripeProductId = stripeProduct.id;
        packageDtos.push({ paperCount, price, stripeProductId, stripePriceId });
    }

    console.log(`Products formatted to package dtos!`);
    console.log(`Inserting ${packageDtos.length} packages...`);

    await packageRepository.insert(packageDtos);

    console.log('Done!');
}

syncStripeProducts();
