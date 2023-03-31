import { Get, Post, Patch, Remove } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function getCategories() {
    const url = getAPIUrl("categories.categories");
    return Get(url);
}

export function createCategory(data) {
    const url = getAPIUrl("categories.categories");
    return Post(url,data);

}
export function updateCategory(data, id) {
    const url = getAPIUrl("categories.categories", {id});
    return Patch(url,data);
}

export function removeCategory(id){
    const url = getAPIUrl("categories.categories", {id});
    return Remove(url);
}



export function getCategoryById(id) {
    console.log("asdfasdf", id)
    const url = getAPIUrl("categories.categories",{ id });
    return Get(url);
}

