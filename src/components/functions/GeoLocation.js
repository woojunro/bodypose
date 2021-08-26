export const getLocation = setCoords => {
  if (navigator.geolocation) {
    //GPS 지원하면
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          reject(error);
        },
        { enableHighAccuracy: false, maximumAge: 0, timeout: Infinity }
      );
    }).then(coords => {
      setCoords(coords);
      console.log(coords);
    });
  }
};
