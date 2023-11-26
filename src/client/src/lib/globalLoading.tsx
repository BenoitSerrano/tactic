import { createContext, ReactElement, ReactNode, useContext, useState } from 'react';

type globalLoadingHandlerType = {
    getIsGloballyLoading: () => boolean;
    updateGlobalLoading: (key: string, value: boolean) => void;
};

type globalLoadingType = Record<string, boolean | undefined>;

const GlobalLoadingContext = createContext<globalLoadingHandlerType>({
    getIsGloballyLoading: () => false,
    updateGlobalLoading: (key: string, value: boolean) => null,
});

function GlobalLoadingContextProvider(props: { children: ReactNode }): ReactElement {
    const [globalLoading, setGlobalLoading] = useState<globalLoadingType>({});
    const globalLoadingHandler = {
        getIsGloballyLoading,
        updateGlobalLoading,
    };

    return (
        <GlobalLoadingContext.Provider value={globalLoadingHandler}>
            {props.children}
        </GlobalLoadingContext.Provider>
    );

    function getIsGloballyLoading() {
        return Object.values(globalLoading).some((isLoading) => !!isLoading);
    }

    function updateGlobalLoading(key: string, value: boolean) {
        setGlobalLoading({ ...globalLoading, [key]: value });
    }
}

function useGlobalLoading() {
    return useContext(GlobalLoadingContext);
}

export { GlobalLoadingContextProvider, useGlobalLoading };
