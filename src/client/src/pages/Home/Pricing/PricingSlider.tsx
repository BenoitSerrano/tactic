import { Slider, styled, Typography } from '@mui/material';
import { PRO_PRICES } from './constants';

function PricingSlider(props: {
    selectedIndex: number;
    setSelectedIndex: (index: number) => void;
}) {
    const marks = PRO_PRICES.map(({ attempts }) => ({ value: attempts, label: `${attempts}` }));
    const pricePerAttempt = computePricePerAttempt();
    return (
        <Container>
            <Title variant="h4">{PRO_PRICES[props.selectedIndex].attempts} copies</Title>
            <Subtitle variant="body1">{pricePerAttempt} € par copie corrigée</Subtitle>
            <Slider
                onChange={onChangeValue}
                value={PRO_PRICES[props.selectedIndex].attempts}
                step={null}
                min={Math.min(...PRO_PRICES.map(({ attempts }) => attempts))}
                max={Math.max(...PRO_PRICES.map(({ attempts }) => attempts))}
                valueLabelDisplay="auto"
                marks={marks}
            />
        </Container>
    );

    function computePricePerAttempt() {
        const pricePerAttempt =
            PRO_PRICES[props.selectedIndex].price / PRO_PRICES[props.selectedIndex].attempts;
        return pricePerAttempt.toFixed(2);
    }

    function onChangeValue(_event: Event, value: number | number[]) {
        const index = PRO_PRICES.map(({ attempts }) => attempts).indexOf(value as number);
        if (index === -1) {
            return;
        }
        props.setSelectedIndex(index);
    }
}

const Container = styled('div')(({ theme }) => ({}));
const Title = styled(Typography)(({ theme }) => ({ textAlign: 'center' }));
const Subtitle = styled(Typography)(({ theme }) => ({ textAlign: 'center' }));
export { PricingSlider };
