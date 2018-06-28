
var map;
var levels = [];
var imageUrls = {
    '1-1': 'svg/1-1.svg',
    '1-6': 'svg/1-6.svg',
    '2-1': 'svg/2-1.svg',
    '2-2': 'svg/2-2.svg',
    '3-1': 'svg/3-1.svg',
    '3-2': 'svg/3-2.svg'
};
var imageBounds = {
    1: [
        L.latLng([31.252625753243095, 121.61278769373897]),
        L.latLng([31.252625753243095, 121.61364593165105]),
        L.latLng([31.252254736217314, 121.61278769373897])
    ],
    2: [
        L.latLng([31.25234323889825, 121.61389799691509]),
        L.latLng([31.25234323889825, 121.61444248534508]),
        L.latLng([31.25211355882389, 121.61389799691509])
    ],
    3: [
        L.latLng([31.251763275689502, 121.61386516398126]),
        L.latLng([31.251763275689502, 121.61423941947763]),
        L.latLng([31.25134066674354, 121.61386516398126])
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
var pageControl = {};
var routeNode = []
var dGraph = new Graph();
dGraph.addNode(1, {weight: 1,nType: 1});
dGraph.addNode(2, {weight: 1,nType: 1});
dGraph.addNode(3, {weight: 1,nType: 1});
dGraph.addNode(4, {weight: 1,nType: 1});
dGraph.addNode(5, {weight: 1,nType: 1});
dGraph.addNode(6, {weight: 1,nType: 1});
dGraph.addNode(7, {weight: 1,nType: 1});
dGraph.addNode(8, {weight: 1,nType: 1});
dGraph.addNode(9, {weight: 1,nType: 1});
dGraph.addNode(10, {weight: 1,nType: 1});
dGraph.addNode(11, {weight: 1,nType: 1});
dGraph.addNode(12, {weight: 1,nType: 1});
dGraph.addNode(13, {weight: 1,nType: 1});
dGraph.addNode(14, {weight: 1,nType: 1});
dGraph.addNode(15, {weight: 1,nType: 1});
dGraph.addNode(16, {weight: 1,nType: 1});
dGraph.addNode(17, {weight: 1,nType: 1});
dGraph.addNode(18, {weight: 1,nType: 1});
dGraph.addNode(19, {weight: 1,nType: 1});
dGraph.addNode(20, {weight: 1,nType: 1});
dGraph.addNode(21, {weight: 1,nType: 1});
dGraph.addNode(22, {weight: 1,nType: 1});
dGraph.addNode(23, {weight: 1,nType: 1});
//  二栋
dGraph.addEdge(1, 2);
dGraph.addEdge(2, 3);
dGraph.addEdge(2, 4);
dGraph.addEdge(4, 5);
dGraph.addEdge(4, 6);
dGraph.addEdge(8, 1);
dGraph.addEdge(8, 9);
//二三栋
dGraph.addEdge(9, 12);
// 三栋  二层
dGraph.addEdge(16, 17);
dGraph.addEdge(17, 18);
dGraph.addEdge(18, 14);
dGraph.addEdge(14, 15);
dGraph.addEdge(14, 13);
dGraph.addEdge(13, 11);

// 三栋  一层
dGraph.addEdge(10, 12);
dGraph.addEdge(12, 19);
dGraph.addEdge(19, 20);

//三栋电梯
dGraph.addEdge(10, 15);
dGraph.addEdge(20, 16);

dGraph.addEdge(21, 22);
dGraph.addEdge(22, 23);
dGraph.addEdge(23, 20);

dGraph.addEdge(21, 9);


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
var currentLayerGroup;
var currentPosition;
var currentPlaceInList;
var places = [{
    roomName: '主会场',building: '1',level: 6, beaconId: '9.109',routeId: 20, target: true, 
    coord: [31.252403333091145, 121.61293986719105]
}, {
    roomName: '大厅',building: '1',level: 1, beaconId: '9.105',routeId: 21, 
    coord: [31.252313906284428, 121.61318931262942]
}, {
    roomName: '走廊',building: '1',level: 1, beaconId: '9.108',routeId: 22, 
    coord: [31.252415944557082, 121.61306593101473]
}, {
    roomName: '电梯', building: '1',level: 1, beaconId: '9.111',routeId: 23, 
    coord: [31.25240677258201, 121.61293718498202]
    ////////////////////
}, {
    roomName: '2212',building: '2',level: 2,roomNo: 2212,roomId: '2212',beaconId: '9.106',routeId: 4, target: true,
    coord: [31.252248931507214, 121.61408535250533]
}, {
    roomName: '电梯',building: '2',level: 2,beaconId: '9.101',routeId: 1,
    coord: [31.25230167043979, 121.61396197089064]
}, {
    roomName: '电梯',building: '2',level: 1,beaconId: '9.8',routeId: 8,
    coord: [31.252305083623114, 121.61397054791452]
}, {
    roomName: '大厅',building: '2',level: 1,beaconId: '9.16',routeId: 9,
    coord: [31.25222597521609, 121.61397457122803]
}, {
    roomName: '走廊',building: '2',level: 2,beaconId: '9.112',routeId: 2,
    coord: [31.252260396495068, 121.61400488623488]
}, {
    roomName: '2203',building: '2',level: 2,beaconId: '9.102',routeId: 6, target: false,
    coord: [31.25219160654712, 121.61412826784957]
},{
    roomName: '2212',building: '2',level: 2,beaconId: '9.114',routeId: 5, target: false,
    coord: [31.252253517502524, 121.6142449439417]

}, {
    roomName: '2201',building: '2',level: 2,beaconId: '9.107',routeId: 3, target: true,
    coord: [31.252190460047565, 121.61397940524922]
}, {
    ///////////////////三栋
    roomName: '电梯',building: '3',level: 1,roomId: 'steps4',beaconId: '9.21',routeId: 10,
    coord: [31.251666636648512, 121.61391021354407]
}, {
    roomName: '大厅',building: '3',level: 1, beaconId: '9.6',routeId: 12,
    coord: [31.251734527528072, 121.61396576301628]
    
}, {
    roomName: '走廊',building: '3',level: 1, beaconId: '9.11',routeId: 19,
    coord: [31.25159010047173, 121.61395003844521]
}, {
    roomName: '电梯',building: '3',level: 1, beaconId: '9.15',routeId: 20,
    coord: [31.251509844957788, 121.61392858077309]
    
}, {
    roomName: '3209',building: '3',level: 2, beaconId: '9.20',routeId: 11, target: true,
    coord: [31.251385771267127, 121.61412973242138]
}, {
    roomName: '3208',building: '3',level: 2, beaconId: '9.9',routeId: 13, target: true, 
    coord: [31.25147083098665, 121.61412535445267]
}, {
    roomName: '3207',building: '3',level: 2,routeId: 14, 
    coord: [31.25149605416597, 121.6139858795839]
}, {
    roomName: '电梯',building: '3',level: 2, beaconId: '9.28',routeId: 15, 
    coord: [31.251443314783387, 121.6138987077909]
}, {
    roomName: '电梯',building: '3',level: 2, beaconId: '9.17',routeId: 16, 
    coord: [31.251673762738196, 121.61385713355118]
}, {
    roomName: '3206',building: '3',level: 2, beaconId: '9.27',routeId: 17, target: true, 
    coord: [31.251655418642972, 121.61398856179291]
}, {
    roomName: '3206',building: '3',level: 2, beaconId: '9.14',routeId: 18, 
    coord: [31.25156828414211, 121.61399124400192]
}];
var placesByRoute = R.groupBy(R.path(['routeId']))(places);
var meMarker;
var polyline;
var route = function (nowPlace, targetPlace) {
    if(nowPlace && nowPlace.routeId && targetPlace && targetPlace.routeId){
        var results = Dijkstra.run(dGraph, 1, nowPlace.routeId, targetPlace.routeId);
        var path = Dijkstra.getPath(results.prev, targetPlace.routeId);
        try{
            map.removeLayer(polyline);
        }catch(e){
            console.log(e);
        }
        polyline = L.polyline(R.filter(R.path([]))(R.map(function(routeId){
            return (R.path([routeId, 0, 'level'])(placesByRoute) == currentPlaceInList.level &&
            R.path([routeId, 0, 'building'])(placesByRoute) == currentPlaceInList.building) ?
             R.path([routeId, 0, 'coord'])(placesByRoute) : undefined;
        })(path)), {color: '#057bff', opacity: 0.5}).addTo(map);
        
        var disPlace = R.path([0])(R.filter(R.propEq('routeId')(R.path([1])(path)))(places))
        if(disPlace){
            if(!disPlace.beaconId){
                disPlace = R.path([0])(R.filter(R.propEq('routeId')(R.path([2])(path)))(places))
            }
            var direction;
            if(nowPlace.level == disPlace.level){
                direction = '前进至';
                this.routers = direction + R.path(['roomName'])(disPlace);
            }else if(nowPlace.level > disPlace.level){
                direction = '下楼至'
                this.routers = direction + disPlace.level + "楼";
            }else {
                direction = '上楼至'
                this.routers = direction + disPlace.level + "楼";
            }
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
            navigator.bluetooth.requestDevice()
            .then(device => { console.log(device) })
            .catch(error => { console.log(error); });
        },
        filterTarget: function(arr){
            return R.filter(function(obj){
                return obj.target == true;
            })(arr);
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
                if(currentPlaceInList.building == 2 || currentPlaceInList.building == 3){
                    map.setView(newPlace, 20);
                }else{
                    map.panTo(newPlace);
                }
                route.call(this, currentPlaceInList, this.target);
            };
        }
    },
    mounted: function mounted() {
        map = L.map("map", {
            center: [31.252318904299297, 121.61386728286745],
            zoom: 19,
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
        var beaconArray = {};
        var meanRssiArray = {};
        var tmpBeaconArray = [];
        

        setInterval(function(){
            window.rh.startBleScan({}, function (beaconInfo) {
                if(beaconInfo == null){
                    return;
                }
                rh.endBleScan();
                try{
                    if(typeof beaconInfo == 'string'){
                        beaconInfo = JSON.parse(beaconInfo);
                    }
                    if(beaconInfo && beaconInfo.length && beaconInfo.length != 0){
                        (tmpBeaconArray = R.concat(tmpBeaconArray, R.filter(function(obj){
                            return R.propEq('major')(9)(obj) && R.path(['rssi'])(obj) < 0 && R.path(['rssi'])(obj) > -100
                        })(beaconInfo)));
                    } 
                }catch(e){
                    alert(e);
                }
            }.bind(this), function(err){
                this.log = err
            }.bind(this));

        }.bind(this), 400);
        
        var tmpKalmanObj = {};
        // var noBleFlag = false;
        var noBleTimer;
        setInterval(function () {
            if(tmpBeaconArray && tmpBeaconArray.length == 0){
                if(!noBleTimer){
                    noBleTimer = setTimeout(function(){
                        // alert('未搜索到蓝牙信号，请确保蓝牙已打开，且在绿色区域内');
                        noBleTimer = undefined;
                    }.bind(this), 10000);
                }
            }else{
                if(noBleTimer){
                    clearTimeout(noBleFlag);
                    noBleTimer = undefined;
                } 
            }
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
            
            var firstPlace = R.path([0, 0])(sortedBeacon) && R.path([0])(R.filter(R.propEq('beaconId')(R.path([0, 0])(sortedBeacon)))(places));
            var secPlace = R.path([1, 0])(sortedBeacon) && R.path([0])(R.filter(R.propEq('beaconId')(R.path([1, 0])(sortedBeacon)))(places));

            if(!firstPlace){
                this.routers = '未搜索到蓝牙信号'
            }else{
                this.routers = this.routers == '未搜索到蓝牙信号'? '': this.routers
             }
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
        }.bind(this), 2500);
        setTimeout(function(){
            map.setView([31.25245174500533, 121.61321564166883], 20);
        }, 1000)
    }
});
