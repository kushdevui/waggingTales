import { Get, Post, Patch, Remove } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function getHotels() {
    const url = getAPIUrl("hotel.hotel");
    return Get(url);
}

export function createHotel(data) {
    const url = getAPIUrl("hotel.hotel");
    return Post(url,data);

}
export function updateHotel(data, id) {
    const url = getAPIUrl("hotel.hotel", {id});
    return Patch(url,data);
}

export function removeHotel(id){
    const url = getAPIUrl("hotel.hotel", {id});
    return Remove(url);
}

export function getHotelById(id) {
    const url = getAPIUrl("hotel.hotel",{ id });
    return Get(url);
}

