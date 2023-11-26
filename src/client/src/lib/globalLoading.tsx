import { createContext, ReactElement, ReactNode, useContext, useState } from 'react';

type globalLoadingHandlerType = {
    isGloballyLoading: boolean;
    setIsGloballyLoading: (isGloballyLoading: boolean) => void;
};

const GlobalLoadingContext = createContext<globalLoadingHandlerType>({
    isGloballyLoading: false,
    setIsGloballyLoading: (isGloballyLoading: boolean) => null,
});

function GlobalLoadingContextProvider(props: { children: ReactNode }): ReactElement {
    const [isGloballyLoading, setIsGloballyLoading] = useState<boolean>(false);
    const globalLoadingHandler = {
        isGloballyLoading,
        setIsGloballyLoading,
    };

    return (
        <GlobalLoadingContext.Provider value={globalLoadingHandler}>
            {props.children}
        </GlobalLoadingContext.Provider>
    );
}

function useGlobalLoading() {
    return useContext(GlobalLoadingContext);
}

export { GlobalLoadingContextProvider, useGlobalLoading };
