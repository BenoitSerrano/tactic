import { createContext, ReactElement, ReactNode, useContext, useState } from 'react';

type studentConfigHandlerType = {
    studentConfig: studentConfigType;
    setStudentConfig: (config: studentConfigType) => void;
};

type studentConfigType = {
    shouldDisplayAccentKeyboard: boolean;
};

const StudentConfigHandlerContext = createContext<studentConfigHandlerType>({
    studentConfig: { shouldDisplayAccentKeyboard: false },
    setStudentConfig: () => {},
});

function StudentConfigHandlerContextProvider(props: { children: ReactNode }): ReactElement {
    const [studentConfig, setStudentConfig] = useState<studentConfigType>({
        shouldDisplayAccentKeyboard: false,
    });
    const studentConfigHandler = {
        studentConfig,
        setStudentConfig,
    };

    return (
        <StudentConfigHandlerContext.Provider value={studentConfigHandler}>
            {props.children}
        </StudentConfigHandlerContext.Provider>
    );
}

function useStudentConfig() {
    return useContext(StudentConfigHandlerContext);
}

export { StudentConfigHandlerContextProvider, useStudentConfig };
