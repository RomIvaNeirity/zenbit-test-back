export declare class MailService {
    private client;
    constructor();
    sendResetPassword(email: string, token: string): Promise<void>;
}
