import 'dotenv/config';
import { Storage } from '@google-cloud/storage';
import { ENV_CONFIGS } from './envs.config.ts';

const privateKey = (ENV_CONFIGS.FIREBASE_PRIVATE_KEY as string).replace(/\\n/g, '\n');

const storage = new Storage({
    projectId: ENV_CONFIGS.FIREBASE_PROJECT_ID,
    credentials: {
        private_key: privateKey,
        client_email: ENV_CONFIGS.FIREBASE_CLIENT_EMAIL,
    },
});

const bucket = storage.bucket("wingfi-9b5b7.appspot.com");

export { bucket };