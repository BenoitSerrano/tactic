import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Router } from './routes/Router';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';
import { ThemeProvider, styled } from '@mui/material';
import { theme } from './theme';
import { AlertHandlerContextProvider } from './lib/alert';
import { GlobalLoadingContextProvider } from './lib/globalLoading';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const queryClient = new QueryClient();
const StyledBody = styled('div')(({ theme }) => ({ color: theme.palette.common.black }));

root.render(
    <ThemeProvider theme={theme}>
        <StyledBody>
            <QueryClientProvider client={queryClient}>
                <AlertHandlerContextProvider>
                    <GlobalLoadingContextProvider>
                        <BrowserRouter>
                            <Router />
                        </BrowserRouter>
                    </GlobalLoadingContextProvider>
                </AlertHandlerContextProvider>
            </QueryClientProvider>
        </StyledBody>
    </ThemeProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
