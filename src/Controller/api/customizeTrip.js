import { Get, Post, Patch, Remove } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function getCustomizeTrips() {
    const url = getAPIUrl("customizeTrip.customizeTrip");
    return Get(url);
}

export function createCustomizeTrip(data) {
    const url = getAPIUrl("customizeTrip.customizeTrip");
    return Post(url,data);
}

export function updateCustomizeTrip(data, id) {
    const url = getAPIUrl("customizeTrip.customizeTrip", {id});
    return Patch(url,data);
}

export function getCustomizeTripById(id) {
    const url = getAPIUrl("customizeTrip.customizeTrip",{ id });
    return Get(url);
}

