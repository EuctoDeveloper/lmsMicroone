import crypto from 'crypto';
export const USER_ROLE_ENUM = ['admin', 'instructor', 'employee', 'customer']

export const encrypt = (data, key) => {
    const cipher = crypto.createCipher('aes-256-cbc', key);
    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
}