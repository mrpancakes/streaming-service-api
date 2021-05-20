require('dotenv').config();

console.log(process.env.AUTH_TOKEN);

$(document).ready(function () {
  $(".modal").modal();
  $('.tap-target').tapTarget();

  let currentYear = moment().format("YYYY");
  let apiKey = "";
  let yearSearch = "";
  let moviesUl = $("#movie-results"); // DO we ned this
  let movieResultDiv = $("#all-results");
  let expandedTitle = "";
  let serviceSelector = document.getElementById("streaming-service");
  let streamingService = "";
  let formattedServiceName = "";

  let mediaTypeSelector = document.getElementById("media-type");
  let mediaType = "";
  let apiMediaTypeString = "";
  let displayMediaTypeString = "";

  let descriptionTextColor = document.querySelector(".description");
  let showTitleArr = JSON.parse(localStorage.getItem("showTitle")) || [];

  $("#submit").click(function (event) {
    event.preventDefault();
    moviesUl.html("");
    streamingService = serviceSelector.options[
      serviceSelector.selectedIndex
    ].text.toLowerCase();
    mediaType = mediaTypeSelector.options[
      mediaTypeSelector.selectedIndex
    ].text.toLowerCase();

    formatServiceName();
    formatApiMediaString();
    console.log(mediaType);

    if (
      streamingService === "streaming service" ||
      mediaType === "movies or series?"
    ) {
      return;
    }

    $(".description").css("color", "white");
    $("#headline").css("color", "white");
    $("#subheadline").css("color", "white");

    $("body").attr("class", "animated-bg");
    $("#headline").text(
      `Top 10 ${formattedServiceName} ${displayMediaTypeString}`
    );
    $("#headline").attr("class", "show");
    $("#subheadline").attr("class", "show");

    console.log(mediaType);

    movieResultsFetch();
  });

  function formatServiceName() {
    if (streamingService === "hbo") {
      formattedServiceName = streamingService.toUpperCase();
    } else if (streamingService === "prime") {
      formattedServiceName = "Amazon Prime";
    } else if (streamingService === "disney") {
      formattedServiceName = "Disney+";
    } else {
      formattedServiceName =
        streamingService.charAt(0).toUpperCase() + streamingService.slice(1);
    }
  }

  function formatApiMediaString() {
    if (mediaType === "movies") {
      apiMediaTypeString = "movie";
      displayMediaTypeString = "Movies";
    } else {
      apiMediaTypeString = "series";
      displayMediaTypeString = "Series";
    }
  }

  function movieResultsFetch() {
    fetch(
      `https://streaming-availability.p.rapidapi.com/search/ultra?country=us&service=${streamingService}&type=${apiMediaTypeString}&order_by=imdb_rating&page=1&desc=true&language=en&min_imdb_vote_count=10000&max_imdb_vote_count=1000000`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "streaming-availability.p.rapidapi.com",
        },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        console.log(response);

        $("#resulting-movies").attr("class", "show");
        $("#helpful").attr("class", "show");

        for (let i = 0; i < 10; i++) {
          let idEnding = i;

          const resultingDiv = `
        <div class="movie-card col s12 m6 l3">
        <div class="row">
          <div class="col">
            <div class="card">
              <div class="card-image">
                <!-- Movie Poster -->
                <img id="movie-poster-${idEnding}" src="" />
                <a class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons add">add</i></a>
              </div>
              <!-- Movie Title (Card) -->
              <div class="card-content">
                <p id="title${idEnding}">Example Title ${idEnding}</p>
              </div>

              <!-- Modal Start -->
              <div class="info-modal">
                <!-- Modal Button -->
                <a class="waves-effect waves-light btn modal-trigger" href="#modal${idEnding}">More
                  Info</a>
                <!-- Modal Inside -->
                <div id="modal${idEnding}" class="modal">
                  <div class="modal-content">
                    <h4 class="title" id="modal-title-${idEnding}">Example Title${idEnding}</h4>
                    <p class="year" id="modal-year-${idEnding}">Released: 2021</p>
                    <p class="tagline" id="modal-tagline-${idEnding}">This is a tagline</p>
                    <br />
                    <p class="overview" id="modal-overview-${idEnding}">lorum Ipsum</p>
                    <br />
                    <p class="cast" id="modal-cast-${idEnding}">Cast: Cast and crew</p>
                    <br />
                    
                  </div>
                  <div class="modal-footer">
                    <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>`

          $("#all-results").append(resultingDiv);
          $(".modal").modal();

          //   const resultingDiv = `<div class="movie-card col s12 m6 l3">
          //   <div class="row">
          //     <div class="col">
          //       <div class="card">
          //         <div class="card-image">
          //           <!-- Movie Poster -->
          //           <img id="movie-poster-${idEnding}" src="${response.results[i].backdropURLs["780"]}" />
          //           <a class="btn-floating halfway-fab waves-effect waves-light red"><i class="material-icons add">add</i></a>
          //         </div>
          //         <!-- Movie Title (Card) -->
          //         <div class="card-content">
          //           <p id="title${idEnding}">${response.results[i].title}</p>
          //         </div>

          //         <!-- Modal Start -->
          //         <div class="info-modal">
          //           <!-- Modal Button -->
          //           <a class="waves-effect waves-light btn modal-trigger" href="#modal0">More
          //             Info</a>
          //           <!-- Modal Inside -->
          //           <div id="modal${idEnding}" class="modal">
          //             <div class="modal-content">
          //               <h4 class="title" id="modal-title-${idEnding}">${response.results[i].title}</h4>
          //               <p class="year" id="modal-year-${idEnding}">Released: ${response.results[i].year}</p>
          //               <p class="tagline" id="modal-tagline-${idEnding}">${response.results[i].tagline}</p>
          //               <br />
          //               <p class="overview" id="modal-overview-${idEnding}">${response.results[i].overview}</p>
          //               <br />
          //               <p class="cast" id="modal-cast-${idEnding}">Cast: ${response.results[i].cast.join(", ")}</p>
          //               <br />

          //             </div>
          //             <div class="modal-footer">
          //               <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
          //             </div>
          //           </div>
          //         </div>
          //       </div>
          //     </div>
          //   </div>
          // </div>`



          // $(`#movie-poster-${idEnding}`).attr("src",`${response.results[i].backdropURLs["780"]}`);
          // $(`#title${idEnding}`).text(`${response.results[i].title}`);
          // $(`#modal-title-${idEnding}`).text(`${response.results[i].title}`);
          // $(`#modal-tagline-${idEnding}`).text(`${response.results[i].tagline}`);
          // $(`#modal-year-${idEnding}`).text("Released: " + `${response.results[i].year}`);
          // $(`#modal-overview-${idEnding}`).text(`${response.results[i].overview}`);
          // $(`#modal-cast-${idEnding}`).text("Cast: " + `${response.results[i].cast.join(", ")}`);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // Watchlist Page
  $(document).on("click", 'i.add', function (event) {
    event.preventDefault();

    console.log('click worked')

    let parent1 = $(this).parent();
    let parent2 = parent1.parent();
    let sibling1 = parent2.siblings(".card-content");
    let showTitle = sibling1.children().text();
    showTitleArr.push(showTitle);

    let icon = $(this);

    localStorage.setItem("showTitle", JSON.stringify(showTitleArr));

    $("#plusOne").attr("class", "material-icons red-text");

    icon.text("favorite");

    setTimeout(function () {
      $("#plusOne").attr("class", "hide");
      icon.text("add");
    }, 1500)

  });
});