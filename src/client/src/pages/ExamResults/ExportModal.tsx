import { Modal } from '../../components/Modal';
import { examResultsApiType } from './types';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import { COLUMNS, columnType, createCsv } from './lib/createCsv';
import { useState } from 'react';

type selectedColumnsType = Record<columnType, boolean>;
const initialSelectedColumns = COLUMNS.reduce(
    (acc, COLUMN) => ({
        ...acc,
        [COLUMN]: true,
    }),
    {} as selectedColumnsType,
);

function ExportModal(props: {
    close: () => void;
    isOpen: boolean;
    examResultsApi: examResultsApiType;
}) {
    const [selectedColumns, setSelectedColumns] =
        useState<selectedColumnsType>(initialSelectedColumns);
    const googleSheetButton = {
        label: 'Exporter vers Google Sheets',
        onClick: exportToGoogleSheets,
        IconComponent: AddToDriveIcon,
    };
    return (
        <Modal
            title="Exporter les résultats"
            confirmButtonLabel="Télécharger le .csv"
            buttons={[googleSheetButton]}
            close={props.close}
            isOpen={props.isOpen}
            onConfirm={downloadResultsCsv}
        >
            <div />
        </Modal>
    );

    function exportToGoogleSheets() {
        alert("Je t'ai dit que je l'avais pas encore implémenté bb");
    }

    function downloadResultsCsv() {
        const csv = createCsv(
            props.examResultsApi,
            convertSelectedColumnsToActualColumns(selectedColumns),
        );
        const data = csv.map((row) => row.map((cell) => `"${cell}"`).join(';')).join('\n');
        const blob = new Blob([data], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Résultats - ${props.examResultsApi.examName}.csv`;
        a.click();
        props.close();
    }
}

function convertSelectedColumnsToActualColumns(selectedColumns: selectedColumnsType): columnType[] {
    return COLUMNS.filter((COLUMN) => selectedColumns[COLUMN]);
}

export { ExportModal };
