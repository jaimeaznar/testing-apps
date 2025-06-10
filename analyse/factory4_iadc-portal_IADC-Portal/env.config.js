/* eslint-disable no-console */
function getFilename() {
  switch (process.env.MODE) {
    case 'local':
      console.log('Using environment: .env.local');
      return '.env.local';
    case 'build':
      console.log('Using environment: .env.build');
      return '.env.build';
    case 'dev':
    case 'development':
    case 'integration':
    case 'e2e':
      console.log('Using environment: .env.dev');
      return '.env.dev';
    case 'uat':
    case 'pre-production':
      console.log('Using environment: .env.uat');
      return '.env.uat';
    case 'prod':
    case 'production':
      console.log('Using environment: .env.prod');
      return '.env.prod';
    default:
      console.log('Using default environment: .env.local');
      return '.env.local';
  }
}

export default getFilename;
