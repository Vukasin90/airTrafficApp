// Loader
function onReady(callback) {
    var intervalID = window.setInterval(checkReady, 1700);

    function checkReady() {
        if (document.getElementsByTagName('body')[0] !== undefined) {
            window.clearInterval(intervalID);
            callback.call(this);
        }
    }
}

function show(id, value) {
    document.getElementById(id).style.display = value ? 'flex' : 'none';
}

onReady(function () {
    show('loader-init', true);
    show('loader', false);
    show('loader-wrapper', false);
});

document.querySelector('.button_base').addEventListener('click', function() {


    // Getting the API and geo location of a user
    var button = document.querySelector('.btn');

    function onPositionReceived(position) {
        var lat = position.coords.latitude;
        var long = position.coords.longitude;
        
        var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
            targetUrl = `https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json?lat=${lat}&lng=${long}&fDstL=0&fDstU=100`

        fetch(proxyUrl + targetUrl)
            .then(function(response) {
            return response.json();
            })
        .then(function(myJson) {
            var flightsTemplate = document.querySelector('.flights-data-container');
            var moreInfoFlight = document.querySelector('.more-info-flight');

            myJson.acList.forEach(function(item) {
                //Rotates plane icon depending if the flight is west-bound or east-bound
                function iconRotate() {
                    if(item.Trak < 180) {
                        return `style="transform: rotateZ(19deg)"`
                    } else {
                        return  `style="transform: rotateZ(-103deg)"`
                    }
                }
                flightsTemplate.innerHTML += `
                    <div class="flight-card" data="${item}">
                        <img src="images/airplane-shape.png" alt="airplane-icon" ${iconRotate()}>
                        <div class='flight-info'>
                            <span><strong>Altitude:</strong> ${item.Alt}</span> 
                            <span><strong>Flight code number:</strong> ${item.CNum}</span>
                        </div>
                    </div>
                `;
            }); 
        });
    }

    navigator.geolocation.getCurrentPosition(onPositionReceived);
});


