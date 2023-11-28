// @ts-ignore
import Brevo from '@getbrevo/brevo';
import { config } from '../../config';

function buildMailer() {
    const defaultClient = Brevo.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = config.BREVO_API_KEY;
    const api = new Brevo.AccountApi();

    const mailer = {
        sendResetPasswordMail,
        getAccount,
    };

    async function sendResetPasswordMail(email: string, resetPasswordRequestId: string) {
        //TODO implémenter envoie de mail
        const mail = `Email: ${email} | URL: /reset-password?resetPasswordRequestId=${resetPasswordRequestId}`;
        console.log(mail);
    }

    async function getAccount() {
        const result = await api.getAccount();
        console.log(result);
        return result;
    }
    return mailer;
}

const mailer = buildMailer();

export { mailer };
