import axiosInstance from "../axios";

import type { AxiosInstance } from "axios";

class ContactFormService {
    private readonly api: AxiosInstance;

    constructor(api: AxiosInstance) {
        this.api = api;
    }

    /**
     * Attention: Do not use it for now
     */
    public async sendMessage(name: string, email: string, message: string): Promise<{ detail: string }> {
        const response = await this.api.post('contact-form/', {
            name,
            email,
            message,
        });

        return response.data;
    }
}

export const contactFormService = new ContactFormService(axiosInstance);
