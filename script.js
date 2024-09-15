// Function to calculate the current speed based on the stroke-dashoffset
function calculateSpeed() {
  // Get the element
  let meterBar = document.getElementById("meter-bg-bar");
  // Get the current stroke-dashoffset
  let strokeDashoffset = parseFloat(
    window.getComputedStyle(meterBar).getPropertyValue("stroke-dashoffset")
  );
  // Calculate the current speed based on the stroke-dashoffset
  // The maximum stroke-dashoffset is 615, which corresponds to a speed of 0 km/h
  // The minimum stroke-dashoffset is 0, which corresponds to a speed of 180 km/h
  let speed = ((615 - strokeDashoffset) / 615) * 180;
  // Round the speed to the nearest integer
  speed = Math.round(speed);
  return speed;
}
// Function to update the speed display
function updateSpeedDisplay() {
  // Calculate the current speed
  let speed = calculateSpeed();
  // Get the speed display element
  let speedDisplay = document.getElementById("speed");
  // Update the text content of the speed display element
  speedDisplay.textContent = speed;
  // speedDisplay.textContent = speed + ' km/h';
}
// Call the updateSpeedDisplay function every 100 milliseconds
setInterval(updateSpeedDisplay, 100);

      document.addEventListener('DOMContentLoaded', function() {
            const downloadSpeedElem = document.getElementById('download-speed');
            const uploadSpeedElem = document.getElementById('upload-speed');
            const cityElem = document.getElementById('city');
            const ipInfoElem = document.getElementById('ip-info');
            const countryFlagElem = document.getElementById('country-flag');
            const locationStatusElem = document.getElementById('location-status');
            const locationStatusIcon = document.getElementById('location-status-icon');

            let downloadSpeed = 0;
            let uploadSpeed = 0;

            function formatSpeed(speed) {
                if (speed >= 1000) {
                    return `${(speed / 1000).toFixed(2)} Mbps`;
                }
                return `${speed.toFixed(2)} Kbps`;
            }

            function updateSpeed() {
                const start = Date.now();
                const image = new Image();
                image.src = 'https://via.placeholder.com/2000x2000.png?' + Math.random();
                
                image.onload = () => {
                    const end = Date.now();
                    const duration = (end - start) / 1000;
                    const speed = (2000 * 2000 * 8) / (duration * 1024 * 1024); // Speed in Mbps

                    downloadSpeed = speed * 1000; // Convert Mbps to Kbps
                    downloadSpeedElem.textContent = formatSpeed(downloadSpeed);

                    // Mock upload speed (simulate upload speed test)
                    uploadSpeed = downloadSpeed * 0.5; // Just for example
                    uploadSpeedElem.textContent = formatSpeed(uploadSpeed);
                };
            }

            function fetchLocation() {
                if (navigator.geolocation) {
                    locationStatusElem.textContent = 'On';
                    locationStatusIcon.classList.replace('fa-location-arrow', 'fa-check-circle');
                    navigator.geolocation.getCurrentPosition((position) => {
                        const { latitude, longitude } = position.coords;

                        // Fetch location details based on coordinates
                        fetch(`https://geocode.xyz/${latitude},${longitude}?json=1`)
                            .then(response => response.json())
                            .then(data => {
                                const city = data.city || 'Unknown';
                                const countryCode = data.country ? data.country.toLowerCase() : 'us';
                                cityElem.textContent = `City: ${city}`;
                                countryFlagElem.src = `https://www.countryflags.io/${countryCode}/shiny/24.png`;
                            })
                            .catch(error => {
                                console.error('Error fetching location data:', error);
                                cityElem.textContent = 'Error';
                            });
                    }, (error) => {
                        console.error('Error getting location:', error);
                        cityElem.textContent = 'Error';
                        locationStatusElem.textContent = 'Error';
                    });
                } else {
                    locationStatusElem.textContent = 'Not Supported';
                    locationStatusIcon.classList.replace('fa-location-arrow', 'fa-times-circle');
                }
            }

            function fetchIP() {
                fetch('https://api.ipify.org?format=json')
                    .then(response => response.json())
                    .then(data => {
                        ipInfoElem.textContent = `IP Address: ${data.ip}`;
                    })
                    .catch(error => {
                        console.error('Error fetching IP address:', error);
                        ipInfoElem.textContent = 'Error';
                    });
            }

            function initialize() {
                fetchLocation();
                fetchIP();
                updateSpeed();
                setInterval(updateSpeed, 1000); // Update speed every second
            }

            // Initial fetch
            initialize();
        });