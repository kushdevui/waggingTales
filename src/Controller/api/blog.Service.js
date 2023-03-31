import { Get, Post, Patch, Remove } from "../headerIntercepter";
import { getAPIUrl } from "../Global";

export function getBlogs() {
    const url = getAPIUrl("blog.blog");
    return Get(url);
}

export function createBlog(data) {
    const url = getAPIUrl("blog.blog");
    return Post(url,data);
}



export function updateBlog(data, id) {
    const url = getAPIUrl("blog.blog", {id});
    return Patch(url,data);
}

export function removeBlog(id){
    const url = getAPIUrl("blog.blog", {id});
    return Remove(url);
}



export function getBlogById(id) {
    const url = getAPIUrl("blog.blog",{ id });
    return Get(url);
}

