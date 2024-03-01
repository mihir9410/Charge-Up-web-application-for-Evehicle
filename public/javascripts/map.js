function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 5,
      center: { lat: 20.5937, lng: 78.9629 }, // Centered on India
    });

    const searchBox = new google.maps.places.SearchBox(document.getElementById("addressInput"));

    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });

    const markers = [];

    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();

      if (places.length === 0) {
        return;
      }

      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers.length = 0;

      const bounds = new google.maps.LatLngBounds();

      places.forEach((place) => {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }

        markers.push(new google.maps.Marker({
          map,
          title: place.name,
          position: place.geometry.location,
        }));

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });

      map.fitBounds(bounds);
    });
  }