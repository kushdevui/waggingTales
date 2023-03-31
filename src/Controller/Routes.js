import { include } from "named-urls";

// Dynamic routes are created in this file to maintain consistency over the platform
// Access dashboard/opportunity/create ---> history.push(routes.dashboard.opportunity.create)
// import { reverse } from "named-urls/src";
// history.push(
//  reverse(routes.dashboard.opportunity.view, { id: id })
// );

export const routes = {
  home: "/",
  itinerary:'/itinerary/:id/',
  upcomingTrips:'/upcoming-trips',
  blogs:'/blogs',
  blogsDetail:'/blogs/:id',
  bookIng:'/booking',
  contactUs:'/contact',
  customizeTrip: '/customize-trip',
  login: "/login",
  logout: "/logout/",
  aboutUs: '/about-us/',
  termsAndCondition: '/terms-and-conditions/',
  userAgreement: '/user-agreement',
  dashboard: include("/dashboard", {
    self: "",
    categories: include("categories", {
      self: "",
      create: "create",
      view: "view/:id",
      edit: "edit/:id",
    }),
    trips: include("trips", {
      self: "",
      create: "create",
      view: "view/:id",
      edit: "edit/:id",
    }),
    blogs: include("blogs", {
      self: "",
      create: "create",
      view: "view/:id",
      edit: "edit/:id",
    }),
    testimonial: include("testimonial", {
      self: "",
      create: "create",
      view: "view/:id",
      edit: "edit/:id",
    }),
    contacts: include("contacts",{
      self : "",
      view: "view/:id"
    }),
    customizeTrip: include("customizeTrip",{
      self : "",
      view: "view/:id"
    }),
    bookings: include("bookings",{
      self : "",
      view: "view/:id"
    }),
    hotels: include("hotels",{
      self: "",
      create: "create",
      view: "view/:id",
      edit: "edit/:id",
    })
  }),
};
