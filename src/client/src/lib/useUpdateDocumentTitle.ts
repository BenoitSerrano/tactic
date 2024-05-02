import { useEffect } from 'react';

function useUpdateDocumentTitle(documentTitle: string) {
    useEffect(() => {
        updateDocumentTitle(`${documentTitle} - Tactic`);
    }, [documentTitle]);
    return { updateDocumentTitle };
}

function updateDocumentTitle(documentTitle: string) {
    document.title = documentTitle;
}

export { useUpdateDocumentTitle };
