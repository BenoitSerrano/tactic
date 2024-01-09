import { acceptableAnswerType } from '../../../../../types';
import { computeDisplayedTitle } from './lib/computeDisplayedTitle';
import { RightAnswerTextField } from './components/RightAnswerTextField';
import { MainContainer } from './components/MainContainer';
import { PlainText } from './components/PlainText';

function TexteATrousPreviewing(props: {
    index: number;
    title: string;
    acceptableAnswers: acceptableAnswerType[][];
}) {
    const displayedTitle = computeDisplayedTitle(props.title, props.acceptableAnswers);
    return (
        <MainContainer>
            {props.index}.{' '}
            {displayedTitle.map((chunk) => {
                switch (chunk.kind) {
                    case 'text':
                        return <PlainText>{chunk.value}</PlainText>;
                    case 'rightAnswerText':
                        return <RightAnswerTextField disabled value={chunk.value} />;
                    default:
                        return undefined;
                }
            })}
        </MainContainer>
    );
}

export { TexteATrousPreviewing };
