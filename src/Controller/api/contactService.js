import { Get, Post, Patch, Remove } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function getContacts() {
    const url = getAPIUrl("contact.contact");
    return Get(url);
}

export function createContact(data) {
    const url = getAPIUrl("contact.contact");
    return Post(url,data);
}

export function updateContact(data, id) {
    const url = getAPIUrl("contact.contact", {id});
    return Patch(url,data);
}

export function getContactById(id) {
    const url = getAPIUrl("contact.contact",{ id });
    return Get(url);
}

