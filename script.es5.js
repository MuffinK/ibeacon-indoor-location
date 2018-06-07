var pageControl = {};
var routeNode = []
var dGraph = new Graph();
dGraph.addNode(1, {weight: 1,nType: 1});
dGraph.addNode(2, {weight: 1,nType: 1});
dGraph.addNode(3, {weight: 1,nType: 1});
dGraph.addNode(4, {weight: 1,nType: 1});
dGraph.addNode(5, {weight: 1,nType: 1});
dGraph.addNode(6, {weight: 1,nType: 1});
dGraph.addEdge(1, 2);
dGraph.addEdge(2, 3);
dGraph.addEdge(3, 4);
dGraph.addEdge(4, 5);
dGraph.addEdge(5, 6);

var calcCurrentCoord = function (coord1, coord2, rssi1, rssi2) {

    if (coord1 && coord2) {
        var rssiToDistance = function (rssi) {
            return Math.pow(10, (-59 - rssi) / 20);
        }
        var dis1 = rssiToDistance(rssi1),
            dis2 = rssiToDistance(rssi2);

        return [(coord1[0] * dis2 + coord2[0] * dis1) / (dis1 + dis2), (coord1[1] * dis2 + coord2[1] * dis1) / (dis1 + dis2)]
    } else {
        return coord1 || coord2
    }
};
var map;
var levels = [];
var imageUrls = {
    '1-1': 'maps/1-1.svg',
    '1-6': 'maps/1-6.svg',
    '2-1': 'maps/2-1.svg',
    '2-2': 'maps/2-2.svg',
    '3-1': 'maps/3-1.svg',
    '3-2': 'maps/3-2.svg'
};
var imageBounds = {
    1: [
        L.latLng([31.252625753243095, 121.61278769373897]),
        L.latLng([31.252625753243095, 121.61364593165105]),
        L.latLng([31.252254736217314, 121.61278769373897])
    ],
    2: [
        L.latLng([31.25234323889825, 121.61444248534508]),
        L.latLng([31.25211355882389, 121.61444248534508]),
        L.latLng([31.25234323889825, 121.61389799691509])
    ],
    3: [
        L.latLng([31.251763275689502, 121.61423941947763]),
        L.latLng([31.25134066674354, 121.61423941947763]),
        L.latLng([31.251763275689502, 121.61386516398126])
    ]
};

var groups = {
    1: {
        1: L.imageOverlay.rotated(imageUrls['1-1'], imageBounds[1][0], imageBounds[1][1], imageBounds[1][2]),
        6: L.imageOverlay.rotated(imageUrls['1-6'], imageBounds[1][0], imageBounds[1][1], imageBounds[1][2]),
        group: L.layerGroup()
    },
    2: {
        1: L.imageOverlay.rotated(imageUrls['2-1'], imageBounds[2][0], imageBounds[2][1], imageBounds[2][2]),
        2: L.imageOverlay.rotated(imageUrls['2-2'], imageBounds[2][0], imageBounds[2][1], imageBounds[2][2]),
        group: L.layerGroup()
    },
    3: {
        1: L.imageOverlay.rotated(imageUrls['3-1'], imageBounds[3][0], imageBounds[3][1], imageBounds[3][2]),
        2: L.imageOverlay.rotated(imageUrls['3-2'], imageBounds[3][0], imageBounds[3][1], imageBounds[3][2]),
        group: L.layerGroup()
    }
}
var currentLayerGroup;
var currentPosition;
var currentPlaceInList;
var places = [{
    roomName: '大厅',building: '1',level: 1,roomNo: 101,roomId: '大厅',beaconId: '9.100',routeId: 1
    ,coord: [31.252359665779384, 121.61325934609069]
}, {
    roomName: '大厅',building: '1',level: 1,roomNo: 1606,roomId: '大厅',beaconId: '9.101',routeId: 2,
    coord: [31.252359665779384, 121.61317619761121]
}, {
    roomName: '大厅',building: '1',level: 1,roomNo: 1606,roomId: '大厅',beaconId: '9.102',routeId: 3,
    coord: [31.252359665779384, 121.61317619761121]
}, {
    roomName: '电梯',building: '1',level: 1,roomNo: 1606,roomId: '大厅',beaconId: '9.106',routeId: 4,
    coord: [31.252359665779384, 121.61317619761121]
}, {
    roomName: '电梯',building: '1',level: 6,roomNo: 1606,roomId: '大厅',beaconId: '9.103',routeId: 5,
    coord: [31.252359665779384, 121.61317619761121]
}, {
    roomName: '主会议室',building: '1',level: 6,roomNo: 1606,roomId: '大厅',beaconId: '9.104',routeId: 6,
    coord: [31.252359665779384, 121.61317619761121]
}, {
    roomName: 'D306',building: 'D',level: 3,roomNo: 306,roomId: 'D306',beaconId: '9.105',routeId: 7,
    coord: [22.37148391840292, 113.5702282190323]
}, {
    roomName: 'D401',building: 'D',level: 4,roomNo: 401,roomId: 'D401',beaconId: '9.106',routeId: 8,
    coord: [22.37180389907296, 113.57043106108905]
}, {
    roomName: '楼梯#1',building: 'D',level: 3,roomId: 'steps3',beaconId: '9.107',routeId: 9,
    coord: [22.3717264088571, 113.57041094452144]
}, {
    roomName: '楼梯#2',building: 'D',level: 3,roomId: 'steps4',beaconId: '9.108',routeId: 10,
    coord: [22.37155706929526, 113.5702966153622]
}];
var placesByRoute = R.groupBy(R.path(['routeId']))(places);
var meMarker;
var route = function (nowPlace, targetPlace) {
    if(nowPlace && nowPlace.routeId && targetPlace && targetPlace.routeId){
        var results = Dijkstra.run(dGraph, 1, nowPlace.routeId, targetPlace.routeId);
        var path = Dijkstra.getPath(results.prev, targetPlace.routeId);
    
        var polyline = L.polyline(R.filter(R.path([]))(R.map(function(routeId){
            return R.path([routeId, 0, 'level'])(placesByRoute) == currentPlaceInList.level ? R.path([routeId, 0, 'coord'])(placesByRoute) : undefined;
        })(path)), {color: 'blue', opacity: 0.5}).addTo(map);
        
        var disPlace = R.path([0])(R.filter(R.propEq('routeId')(R.path([1])(path)))(places))
        if(disPlace){
            var direction;
            if(nowPlace.level == targetPlace.level){
                direction = '前进至';
            }else if(nowPlace.level > targetPlace.level){
                direction = '下楼至'
            }else {
                direction = '上楼至'
            }
            this.routers = direction + R.path(['roomName'])(disPlace);
            map.closePopup();
            var popup = L.popup()
            .setLatLng(R.path(['coord'])(disPlace))
            .setContent('<p>' + R.path(['roomName'])(disPlace) + '</p>')
            .openOn(map)
        }else{
            this.routers = '已到达目的地';
        }
    }
}
vueMap = new Vue({
    el: "#app",
    data: function data() {
        return {
            rotateDeg: 0,
            targetRooms: places,
            target: '',
            routers: '',
            origin: '',
            routeIndex: 0,
            // log: '',
            currentPlace: '',
            log: ''
        };
    },
    
    methods: {
        chooseTarget: function () {
            document.getElementById('select-target').focus();
        }
    },
    watch: {
        target: function (newTarget, oldTarget) {
            route.call(this, currentPlaceInList, newTarget);
        },
        currentPlace: function currentPlace(newPlace, oldPlace) {
            var layer = R.path([R.path(['building'])(currentPlaceInList), R.path(['level'])(currentPlaceInList)])(groups)
            var layerGroup = R.path([R.path(['building'])(currentPlaceInList), 'group'])(groups);
            if(layerGroup && !layerGroup.hasLayer(layer)){
                layerGroup.clearLayers().addLayer(layer);
            }
            if(newPlace){
                meMarker.setLatLng(newPlace);
                route.call(this, currentPlaceInList, this.target);
            };
        }
    },
    mounted: function mounted() {
        map = L.map("map", {
            center: [31.252318904299297, 121.61386728286745],
            zoom: 20,
            zoomControl: true
        });
        
        var greenIcon = L.divIcon({
            className: 'rose',
            iconUrl: 'arrows/inner.svg',
            
            iconSize: [20, 20], // size of the icon
            popupAnchor: [0, 0] // point from which the popup should open relative to the iconAnchor
        });
        // L.tileLayer.bing("Ao34rXdLP2sgv6PvoF1yyhvpFDqD8Dq0QmtGY0xbBLJO2MOBAK2le4FTagFOrrUQ").addTo(map)
        meMarker = L.marker([22.3732457, 113.57130540000001], {
            icon: greenIcon
        }).addTo(map);
        
        
        R.forEachObjIndexed(function(value){
            value['group'].addLayer(value[1]).addTo(map);
        })(groups);
        
        map.on('click', function(e) {
            alert("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
        });
        var setRotate = function(rotateDegere){
            var rose = document.getElementsByClassName('rose')[0];
            if (rose && rose.style && rose.style.transform) {
                if (rose.style.transform.indexOf('rotate') != -1) {
                    rose.style.transform = rose.style.transform.substr(rose.style.transform, rose.style.transform.indexOf('rotate'), rose.style.transform.lastIndexOf(')'));
                }
                rose.style.transform += ' rotate(' + rotateDegere + 'deg)';
            }
        }.bind(this);
        window.addEventListener("deviceorientationabsolute", function (event) {
            setRotate(360 - event.alpha)
        }.bind(this), true);
        var compassHeading;
        window.addEventListener("deviceorientation", function (event) {
            if(event.webkitCompassHeading){
                compassHeading || (compassHeading = event.webkitCompassHeading);
                var alpha    = event.alpha;
                var orental = compassHeading - alpha;
                (orental < 0) && (orental += 360);
                setRotate(orental)
            }
        }.bind(this), true);
        // createLevels(indoorLevel);
        // drawIndoor(indoorMapData);
        var beaconArray = {};
        var meanRssiArray = {};
        var tmpBeaconArray = [];
        
        // var bleCallback = ;

        try{
            window.rh.startBleScan({}, function (beaconInfo) {
                // this.log = JSON.stringify(beaconInfo);
                if(typeof beaconInfo == 'string'){
                    beaconInfo = JSON.parse(beaconInfo);
                }
                if(beaconInfo && beaconInfo.length && beaconInfo.length != 0){
                    (tmpBeaconArray = R.concat(tmpBeaconArray, R.filter(R.propEq('major')(9))(beaconInfo)));
                } 
            }.bind(this), function(err){
                this.log = err
            }.bind(this));
        }catch(e){
            alert(e);
        }
        
        // pageControl.onPostMessage = 
        
        // pageControl.bleScan(scanBackcall);
        var tmpKalmanObj = {};
        setInterval(function () {
            var filteredArray = R.filter(function (beaconInfo) {
                return beaconInfo.rssi > -100 && beaconInfo.rssi < 5;
            })(R.forEach(function (beaconInfo) {
                beaconInfo.rssi = Number(beaconInfo.rssi);
                return beaconInfo;
            })(tmpBeaconArray));
            tmpBeaconArray = [];
            var groupedBeacon = R.groupBy(function (beaconInfo) {
                return [beaconInfo.major, beaconInfo.minor].join('.');
            })(filteredArray);
            
            var meanedBeacon = R.mapObjIndexed(function (beaconInfoArray, key) {
                var preKal = tmpKalmanObj[key] || {
                    kal: new KalmanFilter({
                        R: 1,
                        Q: 3
                    })
                };
                preKal = preKal.kal
                var finalRssi;
                R.forEach(function (beaconObj) {
                    finalRssi = preKal.filter(R.prop('rssi')(beaconObj));
                })(beaconInfoArray);
                return {
                    kal: preKal,
                    rssi: finalRssi
                };
            })(groupedBeacon);
            
            tmpKalmanObj = meanedBeacon;
            
            var sortedBeacon = R.reverse(R.sortBy(R.path([1, 'rssi']))(R.toPairs(meanedBeacon)));
            
            var firstPlace = R.path([0])(R.filter(R.propEq('beaconId')(R.path([0, 0])(sortedBeacon)))(places));
            var secPlace = R.path([0])(R.filter(R.propEq('beaconId')(R.path([1, 0])(sortedBeacon)))(places));
            // console.log(R.map(o=>[R.path([0])(o), R.path([1, 'rssi'])(o)].join(','))(sortedBeacon))
            this.currentPlace = calcCurrentCoord(
                R.path(['coord'])(firstPlace),
                R.path(['coord'])(secPlace),
                R.path([0, 1, 'rssi'])(sortedBeacon),
                R.path([1, 1, 'rssi'])(sortedBeacon)
            );
            
            currentPlaceInList = firstPlace
            // meMarker.setLatLng(this.currentPlace.coord);
            
            beaconArray = {};
        }.bind(this), 3000);
        setTimeout(function(){
            map.setView([31.25245174500533, 121.61321564166883], 19);
        }, 500)
    }
});
