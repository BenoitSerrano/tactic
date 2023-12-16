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
import * as Sentry from '@sentry/react';
import { config } from './config';

Sentry.init({
    dsn: config.SENTRY_DSN,
    integrations: [
        new Sentry.BrowserTracing({
            // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
            tracePropagationTargets: ['localhost', /^https:\/\/tactic-app\.fr\/api/],
        }),
        new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
const queryClient = new QueryClient();
const StyledBody = styled('div')(({ theme }) => ({ color: theme.palette.common.black }));

root.render(
    <ThemeProvider theme={theme}>
        <StyledBody>
            <QueryClientProvider client={queryClient}>
                <AlertHandlerContextProvider>
                    <BrowserRouter>
                        <Router />
                    </BrowserRouter>
                </AlertHandlerContextProvider>
            </QueryClientProvider>
        </StyledBody>
    </ThemeProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
