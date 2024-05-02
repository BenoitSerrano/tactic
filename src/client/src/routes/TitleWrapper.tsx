import { ReactNode, useEffect } from 'react';

function TitleWrapper(props: { documentTitle: string; children: ReactNode }) {
    useUpdateDocumentTitle(props.documentTitle);
    return <>{props.children}</>;
}

function useUpdateDocumentTitle(documentTitle: string) {
    useEffect(() => {
        updateDocumentTitle(`${documentTitle} - Tactic`);
    }, [documentTitle]);
    return { updateDocumentTitle };
}

function updateDocumentTitle(documentTitle: string) {
    document.title = documentTitle;
}

export { TitleWrapper };
