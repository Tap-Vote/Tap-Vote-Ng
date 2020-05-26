import * as Express from 'express';
import * as Path from 'path';
import * as Https from 'https';

const app = Express();

app.use(Express.static(Path.join(__dirname, '/tap-vote-ng')));
// app.use(Express.static(Path.join(__dirname, '/dist/tap-vote-ng')));

app.all('/api/*', (originalRequest, originalResponse) => {
  const options: Https.RequestOptions = {
    host: 'tap-vote-server.herokuapp.com',
    path: originalRequest.path,
    method: originalRequest.method,
    headers: originalRequest.headers
  };

  const clientRequest = Https.request(options, (proxyResponse) => {
    proxyResponse.setEncoding('utf-8');
    originalResponse.writeHead(proxyResponse.statusCode);
    proxyResponse.on('data', (chunk) => {
      originalResponse.write(chunk);
    });
    proxyResponse.on('close', () => {
      originalResponse.end();
    });
    proxyResponse.on('end', () => {
      originalResponse.end();
    });
  }).on('error', (error) => {
    console.error(error.message);
    try {
      originalResponse.writeHead(500);
      originalResponse.write(error.message);
    } catch {
      // Do nothing
    }
    originalResponse.end();
  });
  clientRequest.end();
});

app.get('/*', (_request, response) => {
  response.sendFile(Path.join(__dirname, '/tap-vote-ng/index.html'));
  // response.sendFile(Path.join(__dirname, '/dist/tap-vote-ng/index.html'));
});

const port = +process.env.PORT || 4200;
const host = process.env.HOST;
const callbackFn = (port: number) => {
  console.log(`Tap Vote 🚀 app started on port ${port}`);
};
console.log(`HOST: ${host ? host : 'env variable is not set'}`);
console.log(`PORT: ${port ? port : 'env variable is not set'}`);
host
  ? app.listen(port, host, () => callbackFn(port))
  : app.listen(port, () => callbackFn(port));
