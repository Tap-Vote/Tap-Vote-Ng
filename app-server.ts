import * as Express from 'express';
import * as Path from 'path';

const app = Express();

app.use(Express.static(Path.join(__dirname, '/tap-vote-ng')));

app.get('/*', (_request, response) => {
  response.sendFile(Path.join(__dirname, '/tap-vote-ng/index.html'));
});

const port = +process.env.PORT || 4200;
const host = process.env.HOST;
const callbackFn = (port: number) => {
  console.log(`Tap Vote 🚀 app started on port ${port}`);
};
console.log(`\nHOST: ${host ? host : 'env variable is not set'}`);
console.log(`PORT: ${port ? port : 'env variable is not set'}`);
host
  ? app.listen(port, host, () => callbackFn(port))
  : app.listen(port, () => callbackFn(port));
