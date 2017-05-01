var taskLocations = [
    {
        latitude: 42.058332,
        longitude: -87.683737,
        name: 'coffee lab'
    },
    {
        latitude: 42.046917,
        longitude: -87.679551,
        name: 'peets coffee'
    },
    {
        latitude: 42.049716,
        longitude: -87.681993,
        name: 'starbucks'
    },
    {
        latitude: 42.053391,
        longitude: -87.672911,
        name: 'norbucks'
    },
    {
        latitude: 42.053379,
        longitude: -87.672676,
        name: 'norris dunkin donuts'
    },
    {
        latitude: 42.052815,
        longitude: -87.674501,
        name: 'main library 1south'
    },
    {
        latitude: 42.053552,
        longitude: -87.674107,
        name: 'main library core'
    },
    {
        latitude: 42.056922,
        longitude: -87.676545,
        name: 'delta lab'
    },
    {
        latitude: 42.051578,
        longitude: -87.675496,
        name: 'kregse hall'
    },
    {
        latitude: 42.057934,
        longitude: -87.675532,
        name: 'tech express'
    },
    {
        latitude: 42.055781,
        longitude: -87.674974,
        name: 'food for thought at garrett'
    },
    {
        latitude: 42.057162,
        longitude: -87.673426,
        name: 'einsteins in pancoe'
    },
    {
        latitude: 42.056072,
        longitude: -87.674638,
        name: 'brew bike at annenberg'
    },
    {
        latitude: 42.060275,
        longitude: -87.675714,
        name: 'lisas cafe'
    },
    {
        latitude: 42.059284,
        longitude: -87.673826,
        name: 'spac'
    },
    {
        latitude: 42.054274,
        longitude: -87.678216,
        name: 'blomquist'
    },
    {
        latitude: 42.061232,
        longitude: -87.676837,
        name: 'patten'
    }
];

var map, heatmap;

function initMapWithPoints() {
    $.ajax({
        url: './data/pathData.json',
        async: true,
        dataType: 'json',
        success: function(data) {
            // store data by user
            var pointsByUser = {},
                startTime = 1491454800,
                endTime = 1492146000,
                routeCount = 0;

            for (var i in data) {
                // check if data between desired measuring start, end time
                if (data[i].lastModified > startTime && data[i].lastModified <= endTime) {
                    // init key in object if not there
                    if (!(data[i].user in pointsByUser)) {
                        pointsByUser[data[i].user] = [];
                    }

                    // create lat-long pairs if more than routeLengthThreshold points in route
                    var routeLengthThreshold = 5;
                    if (data[i].coordinates.length > routeLengthThreshold) {
                        routeCount++;

                        var currentPoints = [];
                        for (var j in data[i].coordinates) {
                            currentPoints.push(new google.maps.LatLng(data[i].coordinates[j][0], data[i].coordinates[j][1]));
                        }

                        pointsByUser[data[i].user] = pointsByUser[data[i].user].concat(currentPoints);
                    }
                }
            }

            // combine data into one array
            var points = [],
                excludeList = ['1F91411FC3A343E7B97DB94CC38CA765'];

            for (var point in pointsByUser) {
                if ($.inArray(point, excludeList) == -1) {
                    points = points.concat(pointsByUser[point]);
                }
            }

            // create map
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 16,
                center: {
                    lat: 42.055012,
                    lng: -87.677213
                },
                mapTypeId: 'roadmap'
            });

            heatmap = new google.maps.visualization.HeatmapLayer({
                data: points,
                map: map
            });

            // add task location markers
            for (var location in taskLocations) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(taskLocations[location].latitude,
                        taskLocations[location].longitude),
                    title: taskLocations[location].name
                });

                marker.setMap(map);
            }

            // data logging
            /* eslint-disable no-console */
            console.log(pointsByUser);
            console.log('Number of Routes:', routeCount);
            console.log('Number of Lat-Long Points:', points.length);
            console.log('Number of Task Locations:', taskLocations.length);
            /* eslint-enable no-console */

            // make initialized gradient blue and radius larger
            changeGradient();
            changeRadius();
        }
    });
}

function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
    var gradient = [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
    ];
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
    heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

// load google maps
$(document).ready((function() {
    $.ajax({
        url: './config.json',
        async: true,
        dataType: 'json',
        success: function(data) {
            function loadGoogleMaps(apiKey) {
                var script_tag = document.createElement('script');
                script_tag.setAttribute('type', 'text/javascript');
                script_tag.setAttribute('src', 'https://maps.googleapis.com/maps/api/js?key=' + apiKey + '&libraries=visualization&callback=initMapWithPoints');
                (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(script_tag);
            }

            loadGoogleMaps(data.gmapsapi);
        }
    });
})());
