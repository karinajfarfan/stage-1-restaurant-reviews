let restaurant;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener("DOMContentLoaded", event => {
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      self.newMap = L.map("map", {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer(
        "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}",
        {
          mapboxToken:
            "pk.eyJ1Ijoia2pmYXJmYW4iLCJhIjoiY2puaTEyaGFyMGZoajN2cG1qMHJxZTM2aSJ9.LEN57S6q3WUbaOJ5cGDrJw",
          maxZoom: 18,
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          id: "mapbox.streets"
        }
      ).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
};

/* window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
} */

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = callback => {
  if (self.restaurant) {
    // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName("id");
  if (!id) {
    // no id found in URL
    error = "No restaurant id in URL";
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant);
    });
  }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  //name
  const name = document.getElementById("restaurant-name");
  name.innerHTML = restaurant.name;

  //address
  const address = document.getElementById("restaurant-address");
  address.innerHTML = restaurant.address;

  //a11y
  /*var aria_label = document.getElementById("address_label");
  aria_label.innerHTML = "Address: " + restaurant.address;
*/
  //image
  const image = document.getElementById("restaurant-img");
  image.className = "restaurant-img";
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = `${restaurant.name} Restaurant`;

  //cusine
  const cuisine = document.getElementById("restaurant-cuisine");
  cuisine.innerHTML = restaurant.cuisine_type;

  //a11y
  /*var aria_label = document.getElementById("cuisine_label");
  aria_label.innerHTML = "Cuisine: " + restaurant.cuisine_type;
*/
  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (
  operatingHours = self.restaurant.operating_hours
) => {
  const hours = document.getElementById("restaurant-hours");
  for (let key in operatingHours) {
    const row = document.createElement("tr");
    /*
    //set tabindex to 0
    var tabindex_attr = document.createAttribute("tabindex");
    tabindex_attr.value = 0;
    row.setAttributeNode(tabindex_attr);

    //a11y labels
    var ariaLabelBy_attr = document.createAttribute("aria-labelledby");
    ariaLabelBy_attr.value = key + "_label";
    row.setAttributeNode(ariaLabelBy_attr);

    var ariaLabel = document.createElement("label");
    ariaLabel.id = key + "_label";
    ariaLabel.className = "aria-label";
    ariaLabel.innerHTML = key + operatingHours[key];
*/
    //Day
    const day = document.createElement("td");
    day.innerHTML = key;
    row.appendChild(day);

    //Time
    const time = document.createElement("td");
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById("reviews-container");
  const title = document.createElement("h2");
  title.innerHTML = "Reviews";
  title.setAttribute("tabindex", "0");
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement("p");
    noReviews.innerHTML = "No reviews yet!";
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById("reviews-list");
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = review => {
  const li = document.createElement("li");
  const name = document.createElement("p");
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement("p");
  date.innerHTML = review.date;
  li.appendChild(date);

  const rating = document.createElement("p");
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement("p");
  comments.innerHTML = review.comments;
  li.appendChild(comments);
  /*
  //set tabindex to 0
  var tabindex_attr = document.createAttribute("tabindex");
  tabindex_attr.value = 0;
  li.setAttributeNode(tabindex_attr);

  //set random number for review id
  var randomNumber = Math.floor(Math.random() * 10000);
  var review_id = randomNumber;

  //a11y labels for review
  var ariaLabelBy_attr = document.createAttribute("aria-labelledby");
  ariaLabelBy_attr.value = review_id + "_label";
  li.setAttributeNode(ariaLabelBy_attr);

  var ariaLabel = document.createElement("label");
  ariaLabel.id = review_id + "_label";
  ariaLabel.className = "aria-label";
  ariaLabel.innerHTML =
    "Reviewed by " +
    review.name +
    " on " +
    review.date +
    ". Rating of " +
    review.rating +
    " stars. Comments: " +
    review.coments;

  li.appendChild(ariaLabel);
*/
  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById("breadcrumb");
  const li = document.createElement("li");
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};
