import React, { useEffect, useState } from 'react';
import { time } from '../lib/time';

function Countdown(props: { remainingSeconds: number }) {
    const [seconds, setSeconds] = useState(props.remainingSeconds);

    useEffect(() => {
        if (seconds <= 0) {
            return;
        }
        const timer = setTimeout(() => setSeconds(seconds - 1), 1000);

        return () => clearTimeout(timer);
    }, [seconds]);
    return <div>{time.formatToClock(seconds)}</div>;
}

export { Countdown };
