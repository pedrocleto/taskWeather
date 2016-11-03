Error.stackTraceLimit = Infinity;

var appContext = require.context('../app', true, /\.spec\.ts/);

appContext.keys().forEach(appContext);
