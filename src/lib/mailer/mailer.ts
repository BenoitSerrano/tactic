// @ts-ignore
import Brevo from '@getbrevo/brevo';
import { config } from '../../config';
import { logger } from '../logger';

const EMAIL_TEMPLATE_MAPPING = {
    RESET_PASSWORD: 1,
};

function buildMailer() {
    const defaultClient = Brevo.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = config.BREVO_API_KEY;

    const mailer = {
        sendResetPasswordMail,
        registerContact,
    };

    async function registerContact(email: string) {
        const contactsApi = new Brevo.ContactsApi();
        const createContact = new Brevo.CreateContact();
        createContact.email = email;
        try {
            await contactsApi.createContact(createContact);
            return true;
        } catch (error) {
            logger.error(error);
            return false;
        }
    }

    async function sendResetPasswordMail(email: string, resetPasswordRequestId: string) {
        const transactionalEmailsApi = new Brevo.TransactionalEmailsApi();

        const sender = new Brevo.SendSmtpEmailSender();
        sender.email = 'benoit.serrano10@gmail.com';
        const templateId = EMAIL_TEMPLATE_MAPPING.RESET_PASSWORD;
        const params = {
            RESET_PASSWORD_URL: `${config.CLIENT_URL}/reset-password?resetPasswordRequestId=${resetPasswordRequestId}`,
        };
        const sendSmtpEmail = new Brevo.SendSmtpEmail();

        const sendSmtpEmailTo = new Brevo.SendSmtpEmailTo();
        sendSmtpEmailTo.email = email;

        sendSmtpEmail.sender = sender;
        sendSmtpEmail.to = [sendSmtpEmailTo];
        sendSmtpEmail.templateId = templateId;
        sendSmtpEmail.params = params;
        try {
            await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
            return true;
        } catch (error) {
            logger.error(error);
            return false;
        }
    }

    return mailer;
}

const mailer = buildMailer();

export { mailer };
