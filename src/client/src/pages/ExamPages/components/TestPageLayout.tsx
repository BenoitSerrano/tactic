import { Typography, styled } from '@mui/material';
import { ReactNode } from 'react';
import { QuickScrollArrows } from './QuickScrollArrows';

function TestPageLayout(props: {
    title: string;
    subtitle?: string;
    isHeaderBlurred?: boolean;
    studentEmail?: string;
    highlightedResult?: string;
    lowlightedResult?: string;
    children: ReactNode;
    centerElement?: JSX.Element;
    leftElement?: JSX.Element;
    rightButtons?: JSX.Element[];
    shouldPreventTextSelection?: boolean;
}) {
    const shouldDisplayFooter = !!props.centerElement || !!props.rightButtons;
    const ChildrenContainer = props.shouldPreventTextSelection
        ? SelectionLessContainer
        : BasicContainer;
    return (
        <Container>
            <QuickScrollArrows />

            <TitleContainer>
                <Title variant="h2">{props.title}</Title>
                {!!props.subtitle && <Subtitle variant="h5">{props.subtitle}</Subtitle>}
            </TitleContainer>
            <StudentInfoContainer isBlurred={!!props.isHeaderBlurred}>
                <StudentEmailContainer>
                    {!!props.studentEmail && (
                        <StudentEmail>Adresse e-mail : {props.studentEmail}</StudentEmail>
                    )}
                </StudentEmailContainer>
                {!!props.highlightedResult && (
                    <ResultContainer>
                        {<Typography variant="caption">{props.highlightedResult}</Typography>}
                        {props.lowlightedResult && (
                            <Typography variant="h6">{props.lowlightedResult}</Typography>
                        )}
                    </ResultContainer>
                )}
            </StudentInfoContainer>
            <ChildrenContainer>{props.children}</ChildrenContainer>
            {shouldDisplayFooter && (
                <FooterContainer>
                    <LeftFooterPart>{props.leftElement}</LeftFooterPart>
                    <CenterFooterPart>{props.centerElement}</CenterFooterPart>
                    <RightFooterPart>{props.rightButtons}</RightFooterPart>
                </FooterContainer>
            )}
        </Container>
    );
}

const FOOTER_HEIGHT = 50;

const FooterContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    height: FOOTER_HEIGHT,
    position: 'fixed',
    width: '100%',
    backgroundColor: 'white',
    borderTop: `1px solid ${theme.palette.common.black}`,
    bottom: 0,
    left: 0,
}));

const CenterFooterPart = styled('div')({
    height: '100%',
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
});

const RightFooterPart = styled('div')(({ theme }) => ({
    height: '100%',
    flex: 1,
    paddingRight: theme.spacing(1),
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
}));

const LeftFooterPart = styled('div')({
    height: '100%',
    flex: 1,
    display: 'flex',
});

const StudentInfoContainer = styled('div')<{ isBlurred: boolean }>(({ theme, isBlurred }) => ({
    marginBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    filter: isBlurred ? 'blur(10px)' : 'none',
    userSelect: isBlurred ? 'none' : 'inherit',
}));

const StudentEmail = styled(Typography)(({ theme }) => ({
    fontStyle: 'italic',
}));
const StudentEmailContainer = styled('div')(({ theme }) => ({
    fontStyle: 'italic',
}));

const Title = styled(Typography)({ textAlign: 'center' });
const Subtitle = styled(Typography)({ fontStyle: 'italic' });

const TitleContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginBottom: theme.spacing(4),
}));

const Container = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        width: '55%',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        paddingLeft: theme.spacing(3),
        paddingRight: theme.spacing(3),
    },
    [theme.breakpoints.down('md')]: {
        width: '80%',
        padding: theme.spacing(1),
    },
    marginBottom: FOOTER_HEIGHT,
    borderRadius: 2,
    border: `solid ${theme.palette.common.black} 1px`,
    boxShadow: theme.shadows[4],
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
}));

const BasicContainer = styled('div')(({ theme }) => ({ paddingTop: theme.spacing(3) }));
const SelectionLessContainer = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(3),
    userSelect: 'none',
}));
const ResultContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
});

export { TestPageLayout };
