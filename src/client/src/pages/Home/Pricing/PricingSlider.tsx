import { Slider, styled, Typography } from '@mui/material';
import { packageApiType } from '../../../lib/api/packagesApi';

function PricingSlider(props: {
    selectedIndex: number;
    setSelectedIndex: (index: number) => void;
    packages: packageApiType[];
}) {
    const marks = props.packages.map(({ paperCount }) => ({
        value: paperCount,
        label: `${paperCount}`,
    }));
    const minPaperCount = Math.min(...props.packages.map(({ paperCount }) => paperCount));
    const maxPaperCount = Math.max(...props.packages.map(({ paperCount }) => paperCount));
    const pricePerAttempt = computePricePerAttempt();
    return (
        <Container>
            <Title variant="h4">{props.packages[props.selectedIndex].paperCount} copies</Title>
            <Subtitle variant="body1">{pricePerAttempt} € par copie corrigée</Subtitle>
            <Slider
                onChange={onChangeValue}
                value={props.packages[props.selectedIndex].paperCount}
                step={null}
                min={minPaperCount}
                max={maxPaperCount}
                valueLabelDisplay="auto"
                marks={marks}
            />
        </Container>
    );

    function computePricePerAttempt() {
        const pricePerAttempt =
            props.packages[props.selectedIndex].price /
            props.packages[props.selectedIndex].paperCount;
        return pricePerAttempt.toFixed(2);
    }

    function onChangeValue(_event: Event, value: number | number[]) {
        const index = props.packages.map(({ paperCount }) => paperCount).indexOf(value as number);
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
