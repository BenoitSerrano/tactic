import { FormControlLabel, Radio, RadioGroup, styled, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { computeDateTime } from './lib/computeDateTimeExtremums';
import { time } from '../../lib/time';

function SelectExamExtremums(props: {
    startDateTime: number | undefined;
    endDateTime: number | undefined;
    setStartDateTime: (startDateTime: number | undefined) => void;
    setEndDateTime: (endDateTime: number | undefined) => void;
}) {
    const initialDateTimes = computeInitialDateTimes();
    const [startDate, setStartDate] = useState<string>(initialDateTimes.startDate);
    const [startTime, setStartTime] = useState<string>(initialDateTimes.startTime);

    const [startRangeDate, setStartRangeDate] = useState<string>(initialDateTimes.startRangeDate);
    const [startRangeTime, setStartRangeTime] = useState<string>(initialDateTimes.startRangeTime);
    const [endRangeDate, setEndRangeDate] = useState<string>(initialDateTimes.endRangeDate);
    const [endRangeTime, setEndRangeTime] = useState<string>(initialDateTimes.endRangeTime);
    const [isThereEndDate, setIsThereEndDate] = useState(
        props.endDateTime !== undefined && props.endDateTime !== Infinity,
    );
    return (
        <Container>
            <Typography>Cet examen aura lieu...</Typography>
            <RadioGroup value={isThereEndDate ? '1' : '0'} onChange={onChangeIsThereEndDate}>
                <StyledFormControlLabel
                    value="1"
                    label={
                        <DateTimeContainer>
                            <Text>Du</Text>
                            <TextField
                                variant="outlined"
                                disabled={!isThereEndDate}
                                type="date"
                                value={startRangeDate}
                                onChange={onChangeStartRangeDate}
                            />
                            <Text>à</Text>
                            <TextField
                                variant="outlined"
                                disabled={!isThereEndDate}
                                type="time"
                                value={startRangeTime}
                                onChange={onChangeStartRangeTime}
                            />
                            <Text>au</Text>
                            <TextField
                                variant="outlined"
                                disabled={!isThereEndDate}
                                type="date"
                                value={endRangeDate}
                                onChange={onChangeEndRangeDate}
                            />
                            <Text>à</Text>
                            <TextField
                                variant="outlined"
                                disabled={!isThereEndDate}
                                type="time"
                                value={endRangeTime}
                                onChange={onChangeEndRangeTime}
                            />
                        </DateTimeContainer>
                    }
                    control={<Radio />}
                />
                <StyledFormControlLabel
                    value="0"
                    control={<Radio />}
                    label={
                        <DateTimeContainer>
                            <Text>À partir du</Text>
                            <TextField
                                variant="outlined"
                                disabled={isThereEndDate}
                                type="date"
                                value={startDate}
                                onChange={onChangeStartDate}
                            />
                            <Text>à</Text>
                            <TextField
                                variant="outlined"
                                disabled={isThereEndDate}
                                type="time"
                                value={startTime}
                                onChange={onChangeStartTime}
                            />
                        </DateTimeContainer>
                    }
                />
            </RadioGroup>
        </Container>
    );

    function computeInitialDateTimes() {
        const initialDateTimes = {
            startDate: '',
            startTime: '',
            startRangeDate: '',
            startRangeTime: '',
            endRangeDate: '',
            endRangeTime: '',
        };
        if (props.startDateTime === undefined || props.endDateTime === undefined) {
            return initialDateTimes;
        }
        const isoStartDateTime = time.formatToIsoFormat(props.startDateTime);
        if (props.endDateTime === Infinity) {
            initialDateTimes.startDate = isoStartDateTime.date;
            initialDateTimes.startTime = isoStartDateTime.time;
        } else {
            const isoEndDateTime = time.formatToIsoFormat(props.endDateTime);
            initialDateTimes.startRangeDate = isoStartDateTime.date;
            initialDateTimes.startRangeTime = isoStartDateTime.time;
            initialDateTimes.endRangeDate = isoEndDateTime.date;
            initialDateTimes.endRangeTime = isoEndDateTime.time;
        }

        return initialDateTimes;
    }

    function onChangeIsThereEndDate(event: React.ChangeEvent<HTMLInputElement>) {
        setIsThereEndDate(event.target.value === '1');
        if (event.target.value === '0') {
            props.setEndDateTime(Infinity);
            props.setStartDateTime(undefined);
            setEndRangeDate('');
            setStartRangeDate('');
            setEndRangeTime('');
            setStartRangeTime('');
        } else {
            props.setEndDateTime(undefined);
            props.setStartDateTime(undefined);
            setStartDate('');
            setStartTime('');
        }
    }

    function onChangeStartDate(event: React.ChangeEvent<HTMLInputElement>) {
        setStartDate(event.target.value);
        const startDateTime = computeDateTime(event.target.value, startTime);
        if (startDateTime === undefined) {
            props.setStartDateTime(undefined);
        } else {
            props.setStartDateTime(startDateTime.getTime());
        }
    }

    function onChangeStartTime(event: React.ChangeEvent<HTMLInputElement>) {
        setStartTime(event.target.value);
        const startDateTime = computeDateTime(startDate, event.target.value);
        if (startDateTime === undefined) {
            props.setStartDateTime(undefined);
        } else {
            props.setStartDateTime(startDateTime.getTime());
        }
    }

    function onChangeStartRangeDate(event: React.ChangeEvent<HTMLInputElement>) {
        setStartRangeDate(event.target.value);
        const startRangeDateTime = computeDateTime(event.target.value, startRangeTime);
        if (startRangeDateTime === undefined) {
            props.setStartDateTime(undefined);
        } else {
            props.setStartDateTime(startRangeDateTime.getTime());
        }
    }

    function onChangeStartRangeTime(event: React.ChangeEvent<HTMLInputElement>) {
        setStartRangeTime(event.target.value);
        const startRangeDateTime = computeDateTime(startRangeDate, event.target.value);
        if (startRangeDateTime === undefined) {
            props.setStartDateTime(undefined);
        } else {
            props.setStartDateTime(startRangeDateTime.getTime());
        }
    }

    function onChangeEndRangeDate(event: React.ChangeEvent<HTMLInputElement>) {
        setEndRangeDate(event.target.value);
        const endRangeDateTime = computeDateTime(event.target.value, endRangeTime);
        if (endRangeDateTime === undefined) {
            props.setEndDateTime(undefined);
        } else {
            props.setEndDateTime(endRangeDateTime.getTime());
        }
    }

    function onChangeEndRangeTime(event: React.ChangeEvent<HTMLInputElement>) {
        setEndRangeTime(event.target.value);
        const endRangeDateTime = computeDateTime(endRangeDate, event.target.value);
        if (endRangeDateTime === undefined) {
            props.setEndDateTime(undefined);
        } else {
            props.setEndDateTime(endRangeDateTime.getTime());
        }
    }
}

const Container = styled('div')(({ theme }) => ({}));
const DateTimeContainer = styled('div')(({ theme }) => ({ display: 'flex', alignItems: 'center' }));
const Text = styled(Typography)(({ theme }) => ({
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
}));
const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));
export { SelectExamExtremums };
