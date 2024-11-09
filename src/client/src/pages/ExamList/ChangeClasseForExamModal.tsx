import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useAlert } from '../../lib/alert';
import { api } from '../../lib/api';
import { Modal } from '../../components/Modal';
import { SelectClasseByEstablishment } from '../../components/SelectClasseByEstablishment';

function ChangeClasseForExamModal(props: {
    examId: string | undefined;
    establishmentId: string;
    close: () => void;
}) {
    const { displayAlert } = useAlert();

    const [selectedClasseId, setSelectedClasseId] = useState<string | undefined>();
    const updateClasseIdMutation = useMutation({
        mutationFn: api.updateClasseId,
        onSuccess: () => {
            props.close();
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. L'établissement n'a pas pu être modifié pour cette classe.",
            });
        },
    });

    return (
        <Modal isOpen={!!props.examId} close={props.close} onConfirm={onConfirm}>
            <SelectClasseByEstablishment
                establishmentId={props.establishmentId}
                selectedClasseId={selectedClasseId}
                setSelectedClasseId={setSelectedClasseId}
            />
        </Modal>
    );

    function onConfirm() {
        if (!props.examId || !selectedClasseId) {
            return;
        }
        updateClasseIdMutation.mutate({
            classeId: selectedClasseId,
            examId: props.examId,
        });
    }
}

export { ChangeClasseForExamModal };
