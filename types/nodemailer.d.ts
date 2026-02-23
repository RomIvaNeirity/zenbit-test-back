declare module 'nodemailer' {
  export interface SendMailOptions {
    [key: string]: any;
  }

  export interface Transporter {
    sendMail(mail: SendMailOptions): Promise<any>;
  }

  export function createTransport(options?: any): Transporter;

  const nodemailer: {
    createTransport: typeof createTransport;
  };

  export default nodemailer;
}
