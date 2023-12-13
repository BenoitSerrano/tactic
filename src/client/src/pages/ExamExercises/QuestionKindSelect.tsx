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
                    <QuestionKindContainer>
                        <QuestionKindCard
                            onSelect={buildSelectQuestionKind(questionKind)}
                            isSelected={questionKind === props.currentQuestionKind}
                            title={label}
                            subtitle={description}
                        />
                    </QuestionKindContainer>
                );
            })}
        </Container>
    );

    function buildSelectQuestionKind(questionKind: questionKindType) {
        return () => props.onSelect(questionKind);
    }
}

const Container = styled('div')({
    display: 'flex',
});

const QuestionKindContainer = styled('div')(({ theme }) => ({
    flex: 1,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
}));

export { QuestionKindSelect };
