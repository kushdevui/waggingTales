import { Get, Post, Patch, Remove } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function getTrips() {
    const url = getAPIUrl("trips.trips");
    return Get(url);
}

export function createTrip(data) {
    const url = getAPIUrl("trips.trips");
    return Post(url,data);

}

export function updateTrip(data, id) {
    const url = getAPIUrl("trips.trips", {id});
    return Patch(url,data);
}

export function deleteTrip(id) {
    const url = getAPIUrl("trips.trips", {id});
    return Remove(url)
}   



export function getTripById(id) {
    const url = getAPIUrl("trips.trips",{ id });
    return Get(url);
}

