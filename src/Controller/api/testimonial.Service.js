import { Get, Post, Patch, Remove } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function getTestimonial() {
    const url = getAPIUrl("testimonial.testimonial");
    return Get(url);
}

export function createTestimonial(data) {
    const url = getAPIUrl("testimonial.testimonial");
    return Post(url,data);
}



export function updateTestimonial(data, id) {
    const url = getAPIUrl("testimonial.testimonial", {id});
    return Patch(url,data);
}

export function removeTestimonial(id){
    const url = getAPIUrl("testimonial.testimonial", {id});
    return Remove(url);
}



export function getTestimonialById(id) {
    const url = getAPIUrl("testimonial.testimonial",{ id });
    return Get(url);
}

