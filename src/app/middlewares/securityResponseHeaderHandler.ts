import helmet from 'helmet';

const specificCspDirectives = {
    'default-src': ["'self'"],
    'img-src': [
        "'self'",
        'data:',
        'blob:',
        'tactic-app.fr',
        'files.portive.com',
        'client.crisp.chat',
        'image.crisp.chat',
        'storage.crisp.chat',
    ],
    'font-src': ["'self'", 'client.crisp.chat'],
    'media-src': ["'self'", 'client.crisp.chat'],
    'style-src': ["'self'", 'client.crisp.chat', "'unsafe-inline'"],
    'frame-src': ["'self'", 'game.crisp.chat'],
    'script-src': [
        "'self'",
        'settings.crisp.chat',
        'blob:',
        "'sha256-RtdC0WqE+hX0MgZZk4QgMbkV1woYKbsuKQKKnWxsudI='",
    ],
    'script-src-elem': [
        "'self'",
        'client.crisp.chat',
        "'sha256-RtdC0WqE+hX0MgZZk4QgMbkV1woYKbsuKQKKnWxsudI='",
    ],
    'connect-src': [
        "'self'",
        'wss://client.relay.crisp.chat',
        'client.crisp.chat',
        'storage.crisp.chat',
        'wss://stream.relay.crisp.chat',
        '*.ingest.sentry.io',
        'api.portive.com',
    ],
    'worker-src': ["'self'", 'blob:'],
};

const securityResponseHeaderHandler = helmet({
    contentSecurityPolicy: { directives: specificCspDirectives },
});

export { securityResponseHeaderHandler };
