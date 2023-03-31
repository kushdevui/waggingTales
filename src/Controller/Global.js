import { getEnvValue } from "./Environment";
import { include, reverse } from "named-urls";
import { message } from "antd";
import { BASE_URL } from "./common";

//API endpoints will be placed here
const endpoint = {
  auth: include("/", {
    login: "login/"
  }),
  // opportunity: include("/api/v1/opportunity/", {
  //   opportunity: "opportunity/:id?/",
  //   source: "source/",
  // }),
  // categories: include("/",{
  //   categories:"category/:id?/"
  // }),
  // trips: include("/",{
  //   trips:"trip/:id?/"
  // }),
  // testimonial: include("/",{
  //   testimonial:"testimonial/:id?/"
  // }),
  // blog: include("/",{
  //   blog:"blog/:id?/"
  // }),
  // contact: include("/",{
  //   contact: "contact/:id?/"
  // }),
  // customizeTrip: include("/",{
  //   customizeTrip: "customizeTrip/:id?/"
  // }),
  // booking: include("/",{
  //   booking: "booking/:id?/"
  // }),
  // hotel: include("/",{
  //   hotel: "hotel/:id?/"
  // })
  
};



export function getAPIUrl(url, params = null) {
  const path = reverse(
    url.split(".").reduce((o, i) => o[i], endpoint),
    params
  );
  return BASE_URL + path;
}

export function handleError(err) {
  console.log(err);

  if (err.response) {
    Object.keys(err.response.data).forEach((e) => {
      message.error(`${e}:${err.response.data[e]}`);
    });
  }
}
