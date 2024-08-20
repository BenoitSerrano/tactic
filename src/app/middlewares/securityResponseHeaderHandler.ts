import helmet from 'helmet';

const specificCspDirectives = {
    'default-src': ["'self'"],
    'img-src': [
        "'self'",
        'data:',
        'tactic-app.fr',
        'files.portive.com',
        'client.crisp.chat',
        'image.crisp.chat',
        'storage.crisp.chat',
    ],
    'font-src': ["'self'", 'client.crisp.chat'],
    'media-src': ["'self'", 'client.crisp.chat'],
    'style-src': [
        "'self'",
        'client.crisp.chat',
        "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",
        "'sha256-qGZj8fy4Etp9XlooL/Ilz+mx0y4V+Uu+F7tY38W+15g='",
        "'sha256-MKASWYfd3dGFQes9nQT5XnslE3xYlnUb4cHpxhk4fag='",
    ],
    'frame-src': ["'self'", 'game.crisp.chat'],
    'script-src': [
        "'self'",
        'settings.crisp.chat',
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
    ],
};

const securityResponseHeaderHandler = helmet({
    contentSecurityPolicy: { directives: specificCspDirectives },
});

export { securityResponseHeaderHandler };
