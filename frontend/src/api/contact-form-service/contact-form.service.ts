import axiosInstance from "../axios";

import type { AxiosInstance } from "axios";
import type { ContactFormRequest, ContactFormResponse } from "./types/contact-form.type";

class ContactFormService {
    private readonly api: AxiosInstance;

    constructor(api: AxiosInstance) {
        this.api = api;
    }

    public async sendMessage(data: ContactFormRequest): Promise<ContactFormResponse> {
        const response = await this.api.post('contact-form/', data);

        return response.data;
    }
}

export const contactFormService = new ContactFormService(axiosInstance);
