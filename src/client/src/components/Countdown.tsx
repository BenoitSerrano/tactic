import React, { useEffect, useState } from 'react';
import { time } from '../lib/time';
import { Typography } from '@mui/material';

function Countdown(props: { remainingSeconds: number }) {
    const [seconds, setSeconds] = useState(props.remainingSeconds);

    useEffect(() => {
        if (seconds <= 0) {
            return;
        }
        const timer = setTimeout(() => setSeconds(seconds - 1), 1000);

        return () => clearTimeout(timer);
    }, [seconds]);

    const countdownColor = computeColor(seconds);

    return (
        <Typography variant="h2" color={countdownColor}>
            {time.formatToClock(seconds)}
        </Typography>
    );

    function computeColor(seconds: number) {
        if (seconds > 60) {
            return 'black';
        } else if (seconds <= 0) {
            return 'red';
        } else {
            return 'orange';
        }
    }
}

export { Countdown };
