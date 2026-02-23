export declare class MailService {
    private readonly transporter;
    sendResetPassword(email: string, token: string): Promise<void>;
}
