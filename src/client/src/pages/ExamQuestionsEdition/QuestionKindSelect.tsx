import { styled } from '@mui/material';
import { questionKindType, questionKinds } from '../../types';
import { questionSpecificityMapping } from '../../constants';
import { QuestionKindCard } from './QuestionKindCard';

function QuestionKindSelect(props: {
    currentQuestionKind: questionKindType;
    onSelect: (questionKind: questionKindType) => void;
}) {
    return (
        <Container>
            {questionKinds.map((questionKind) => {
                const { label, description } = questionSpecificityMapping[questionKind];
                return (
                    <QuestionKindCard
                        onSelect={buildSelectQuestionKind(questionKind)}
                        isSelected={questionKind === props.currentQuestionKind}
                        title={label}
                        subtitle={description}
                    />
                );
            })}
        </Container>
    );

    function buildSelectQuestionKind(questionKind: questionKindType) {
        return () => props.onSelect(questionKind);
    }
}

const Container = styled('div')({});

export { QuestionKindSelect };
