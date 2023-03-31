import { Get, Post, Patch, Remove } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function getBookings() {
    const url = getAPIUrl("booking.booking");
    return Get(url);
}

export function createBooking(data) {
    const url = getAPIUrl("booking.booking");
    return Post(url,data);
}



export function updateBooking(data, id) {
    const url = getAPIUrl("booking.booking", {id});
    return Patch(url,data);
}

export function removeBooking(id){
    const url = getAPIUrl("booking.booking", {id});
    return Remove(url);
}



export function getBookingById(id) {
    const url = getAPIUrl("booking.booking",{ id });
    return Get(url);
}

