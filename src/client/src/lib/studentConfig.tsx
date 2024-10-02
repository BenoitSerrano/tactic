import { createContext, ReactElement, ReactNode, useContext, useState } from 'react';
import { localStorage, studentOptionType } from './localStorage';

type studentConfigHandlerType = {
    studentConfig: studentConfigType;
    setStudentOption: (key: studentOptionType, value: boolean) => void;
};

type studentConfigType = {
    shouldDisplayAccentKeyboard: boolean;
};

const StudentConfigHandlerContext = createContext<studentConfigHandlerType>({
    studentConfig: { shouldDisplayAccentKeyboard: false },
    setStudentOption: () => {},
});

function StudentConfigHandlerContextProvider(props: { children: ReactNode }): ReactElement {
    const initialShouldDisplayAccentKeyboard = localStorage.studentConfigHandler.get(
        'shouldDisplayAccentKeyboard',
    );
    const [studentConfig, setStudentConfig] = useState<studentConfigType>({
        shouldDisplayAccentKeyboard: initialShouldDisplayAccentKeyboard,
    });
    const studentConfigHandler = {
        studentConfig,
        setStudentOption: setAndStoreStudentOption,
    };

    return (
        <StudentConfigHandlerContext.Provider value={studentConfigHandler}>
            {props.children}
        </StudentConfigHandlerContext.Provider>
    );

    function setAndStoreStudentOption(key: studentOptionType, value: boolean) {
        localStorage.studentConfigHandler.set(key, value);
        setStudentConfig({ ...studentConfig, [key]: value });
    }
}

function useStudentConfig() {
    return useContext(StudentConfigHandlerContext);
}

export { StudentConfigHandlerContextProvider, useStudentConfig };
