import { TestPageLayout } from './TestPageLayout';

function EmptyExam(props: { title: string }) {
    return <TestPageLayout title={props.title}>Examen vide</TestPageLayout>;
}

export { EmptyExam };
