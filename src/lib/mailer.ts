const mailer = {
    sendResetPasswordMail,
};

async function sendResetPasswordMail(email: string, resetPasswordRequestId: string) {
    //TODO implémenter envoie de mail
    const mail = `Email: ${email} | URL: /reset-password?resetPasswordRequestId=${resetPasswordRequestId}`;
    console.log(mail);
}

export { mailer };
