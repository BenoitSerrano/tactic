function extractEmailsFromEmailList(emailList: string) {
    let emails = emailList;
    const separators = ['\n', ' ', ','];

    separators.forEach((separator) => {
        emails = emails.split(separator).filter(Boolean).join('|');
    });

    return emails.split('|').filter(Boolean);
}

export { extractEmailsFromEmailList };
