import { initializeApp, getApps, cert} from 'firebase-admin/app';

const credential = JSON.parse(process.env.FIREBASE_SECRET_KEY);

const firebaseAdminConfig = {
    credential: cert(credential),
    storageBucket: 'telomap-f82b9.appspot.com' 
}

export function customInitApp() {
    if (getApps().length <= 0) {
        initializeApp(firebaseAdminConfig);
    }
}
