hereseasApp.controller("AptsController",["$stateParams","$scope","requestService",function(e,t,s){function a(){s.GetAptsBySchool(t.selectData,function(e){if(e.result){var s=e.data.apartments;t.aptResult=s,o=e.data.totalPage,t.pages=[];for(var a=0;o>a;a++)t.pages[a]={},t.pages[a].id=a+1,a==i-1?(t.pages[a].selected=!0,t.pages[a].show=!0):t.pages[a].selected=!1,i-1>a&&(a>i-4?t.pages[a].show=!0:(t.pages[a].show=!1,t.pages_pre_dot=!0)),a>i-1&&(i+2>a?t.pages[a].show=!0:(t.pages[a].show=!1,t.pages_end_dot=!0));for(var n=[],a=0;a<s.length;a++)n[a]={},n[a].lat=parseFloat(s[a].latitude),n[a].lng=parseFloat(s[a].longitude),n[a].minPrice=s[a].price.minPrice,n[a].maxPrice=s[a].price.maxPrice;cluster_ll={};for(var a=0;a<s.length;a++)void 0!=cluster_ll[n[a].lat+","+n[a].lng]?(cluster_ll[n[a].lat+","+n[a].lng].length++,cluster_ll[n[a].lat+","+n[a].lng].text+="$"+n[a].minPrice+"-$"+n[a].maxPrice+"; ",3==cluster_ll[n[a].lat+","+n[a].lng].length&&(cluster_ll[n[a].lat+","+n[a].lng].text+="</br>")):(cluster_ll[n[a].lat+","+n[a].lng]={},cluster_ll[n[a].lat+","+n[a].lng].text="",cluster_ll[n[a].lat+","+n[a].lng].text+="$"+n[a].minPrice+"-$"+n[a].maxPrice+"; ",cluster_ll[n[a].lat+","+n[a].lng].ll={},cluster_ll[n[a].lat+","+n[a].lng].length=1,cluster_ll[n[a].lat+","+n[a].lng].ll.lat=n[a].lat,cluster_ll[n[a].lat+","+n[a].lng].ll.lng=n[a].lng);var l=new google.maps.Map(document.getElementById("aptsMap"),{center:cluster_ll[n[0].lat+","+n[0].lng].ll,scrollwheel:!1,zoom:12}),r="ABCDEFGHIJKLMNOPQRSTUVWXYZ",d=0;for(var c in cluster_ll)var p=new google.maps.Marker({map:l,position:cluster_ll[c].ll,label:r[d++%r.length],draggable:!1})}else t.aptResult=[]})}var i=1,o=1;t.min_price=0,t.max_price=5e3,$("#price-slider").on("slideStop",function(e){t.selectData.startPrice=e.value[0],t.selectData.endPrice=e.value[1],a()}),t.selectData={id:e.schoolId,page:i,pageSize:6,startPrice:t.min_price,endPrice:t.max_price,apartmentType:"",roomType:"",date:""},t.schoolId=e.schoolId,t.setType=function(e){t.selectData.roomType=e,t.setPage(0)},t.$watch("searchCont",function(e,s){t.selectData.startPrice=t.min_price,a()}),t.setPage=function(e){i=e+1,t.selectData.page=i,a()},t.previous=function(){i-1>0&&(i-=1),t.selectData.page=i,a()},t.next=function(){o>=i+1&&(i+=1),t.selectData.page=i,a()},t.changeSearch=function(){a()}}]),hereseasApp.controller("RoomPostController",["$scope","$location","languageService","userService","alertService","$mdDialog","Upload","fileReader","requestService","$cookies",function(e,t,s,a,i,o,n,l,r,d){function c(){e.activePage=e.activePage-1}function p(){e.activePage=e.activePage+1}function u(t){e.activePage=t}function f(){e.steps[1].rooms.length<6&&e.steps[1].rooms.push({share:null,type:"",price:"",priceType:"",bathroom:!1,walkInCloset:!1,closet:!1})}function g(t){e.steps[1].rooms.splice(t,1)}function m(t){"update"==a.getDraft().state?r.GetApt({id:a.getDraft().id},function(s){e.steps[6].images=s.data[0].images;var i=e.steps[6].images.indexOf(t);e.steps[6].images.splice(i,1),0==e.steps[6].images.length?e.steps[6].cover="":e.steps[6].cover=e.steps[6].images[0],r.StepPost({id:a.getDraft().id,step:7},e.steps[6],function(t){r.GetApt({id:a.getDraft().id},function(t){e.steps[6].images=t.data[0].images,e.steps[6].cover=t.data[0].cover})})}):r.GetAptDraft({id:a.getDraft().id},function(s){e.steps[6].images=s.data[0].images;var i=e.steps[6].images.indexOf(t);e.steps[6].images.splice(i,1),0==e.steps[6].images.length?e.steps[6].cover="":e.steps[6].cover=e.steps[6].images[0],r.StepPost({id:a.getDraft().id,step:7},e.steps[6],function(t){r.GetAptDraft({id:a.getDraft().id},function(t){e.steps[6].images=t.data[0].images,e.steps[6].cover=t.data[0].cover})})})}function v(){"update"==a.getDraft().state?(o.hide(),t.path("/rooms/"+a.getDraft().id)):("edit"==a.getDraft().state||"post"==a.getDraft().state)&&r.EndRoompost({id:a.getDraft().id},function(e){var s=a.getDraft().id;a.setDraft({}),o.hide(),t.path("/rooms/"+s)})}function h(){a.setDraft({}),o.hide()}function w(e){var t=0;return angular.forEach(e,function(){t++}),1==t?!1:!0}function _(t){if(t&&t.length&&t.length<11-e.arrUploads.length){for(var s=e.arrUploads.length;s<t.length;s++)e.arrUploads.push({file:t[s],prog:0,content:"default.png",saved:!1,cancel:"",id:""});angular.forEach(e.arrUploads,function(t){if(0==t.saved){l.readAsDataUrl(t.file,e).then(function(e){t.content=e});var s=n.upload({url:a.getHost()+"/apartment/m_upload_image",file:t.file,fileFormDataName:"apartment"}).progress(function(e){t.prog=parseInt(100*e.loaded/e.total)}).success(function(s,i,o,n){t.saved=!0,t.id="https://s3.amazonaws.com/hereseas-public-images/"+s.data,e.steps[6].images.push(t.id),1==e.steps[6].images.length&&(e.steps[6].cover=e.steps[6].images[0]),e.arrUploads.splice(e.arrUploads.indexOf(t),1),e.files.splice(e.files.indexOf(t.file),1),r.StepPost({id:a.getDraft().id,step:7},e.steps[6],function(e){})}).error(function(e,t,s,a){alert("上传失败"+e)});t.cancel=function(){s.abort(),e.arrUploads.splice(e.arrUploads.indexOf(t),1),e.files.splice(e.files.indexOf(t.file),1)}}})}}function y(t){if(e.steps[0].beginDate=t.beginDate,e.steps[0].endDate=t.endDate,"Studio"==t.type?e.isStudio=!0:(e.numBedrooms=1*t.type.charAt(0),e.numBathrooms=1*t.type.charAt(2)),0!==t.rooms.length?e.steps[1].rooms=t.rooms:e.steps[1].rooms=[{share:null,type:"",price:"",priceType:"",bathroom:!1,walkInCloset:!1,closet:!1}],void 0!==t.facilities&&(e.steps[2].facilities=t.facilities),void 0!==t.fees&&(e.steps[3].fees=t.fees),void 0!==t.title&&void 0!==t.description&&(e.steps[4].title=t.title,e.steps[4].description=t.description),void 0!==t.address){e.steps[5].address=t.address,e.addressGot=!0;var s=e.steps[5].address.street.split(" ");e.addresses[0]=s[0],e.addresses[1]="";for(var a=1;a<s.length;a++)1!==a&&(e.addresses[1]+=" "),e.addresses[1]+=s[a];e.addresses[2]=e.steps[5].address.city,e.addresses[3]=e.steps[5].address.state,e.addresses[4]=e.steps[5].address.zipcode}void 0!==t.cover&&(e.steps[6].cover=t.cover,e.steps[6].images=t.images)}function D(e){"post"!==e.state&&("edit"==e.state?r.GetAptDraft({id:e.id},function(e){y(e.data[0])}):"update"==e.state&&r.GetApt({id:e.id},function(e){y(e.data[0])}))}function b(e){return s.getChineseName(e)}e.lastPage=c,e.nextPage=p,e.setActivePage=u,e.AddRoom=f,e.RemoveRoom=g,e.removeImage=m,e.doPost=v,e.name=b,e.hide=h;var P=new google.maps.Geocoder;e.options1=null,e.details1="",e.addresses=[],e.addressGot=!1,e.addressCorrect=!1,e.activePage=1,e.isStudio=!1,e.numBedrooms=null,e.numBathrooms=null,e.canPost=!1,e.arrUploads=[],e.tableFilled=[{filled:!1},{filled:!1},{filled:!0},{filled:!1},{filled:!1},{filled:!1},{filled:!1}],e.nofees={deposit:!1,leasing:!1,park:!1,utilities:!1,insurance:!1,network:!1,clean:!1},e.steps=[{type:void 0,beginDate:void 0,endDate:void 0,schoolId:d.schoolId},{rooms:[{share:null,type:"",price:"",priceType:"",bathroom:!1,walkInCloset:!1,closet:!1}]},{facilities:{apt:{gym:!1,swimmingPool:!1,laundry:!1,petsAllowed:!1,partyRoom:!1,businessRoom:!1,elevator:!1,frontDesk:!1,freeParking:!1,roof:!1,yard:!1,wheelchairAccessible:!1,bbq:!1,safetySystem:!1},room:{refrigerator:!1,washer:!1,dryer:!1,microwave:!1,airCondition:!1,balcony:!1,furnitures:!1,smokeDetector:!1,extinguisher:!1,heater:!1,oven:!1,dishwasher:!1}}},{fees:{deposit:null,leasing:null,park:null,utilities:null,insurance:null,network:null,clean:null}},{title:"",description:""},{address:{street:"",apt:"",city:"",state:"",zipcode:"",full:""},latitude:"",longitude:""},{cover:"",images:[]}],D(a.getDraft()),e.$watch("files",function(t,s){angular.equals(t,s)||t===[]||_(e.files)}),e.$watch(function(){return e.steps[0]},function(t){void 0==t.type||void 0==t.beginDate||void 0==t.endDate?e.tableFilled[0].filled=!1:(e.tableFilled[0].filled=!0,""==a.getDraft().id?r.StartRoompost(e.steps[0],function(t){a.setDraft({id:t.data._id,state:"post"}),r.StepPost({id:a.getDraft().id,step:3},e.steps[2],function(e){})}):r.StepPost({id:a.getDraft().id,step:1},e.steps[0],function(e){}))},!0),e.$watch("nofees",function(t,s){t.deposit!==s.deposit&&(e.steps[3].fees.deposit=t.deposit?0:null),t.clean!==s.clean&&(e.steps[3].fees.clean=t.clean?0:null),t.insurance!==s.insurance&&(e.steps[3].fees.insurance=t.insurance?0:null),t.leasing!==s.leasing&&(e.steps[3].fees.leasing=t.leasing?0:null),t.network!==s.network&&(e.steps[3].fees.network=t.network?0:null),t.park!==s.park&&(e.steps[3].fees.park=t.park?0:null),t.utilities!==s.utilities&&(e.steps[3].fees.utilities=t.utilities?0:null)},!0),e.$watch(function(){return e.steps[1]},function(t){angular.forEach(t.rooms,function(t){""==t.type||null==t.share||""==t.price||""==t.priceType?e.tableFilled[1].filled=!1:(e.tableFilled[1].filled=!0,r.StepPost({id:a.getDraft().id,step:2},e.steps[1],function(e){}))})},!0),e.$watch(function(){return e.steps[2]},function(t){""!==a.getDraft().id&&r.StepPost({id:a.getDraft().id,step:3},e.steps[2],function(e){})},!0),e.$watch(function(){return e.steps[3]},function(t){var s=0;angular.forEach(e.steps[3].fees,function(e,t){null==e&&(s+=1)}),0==s?(e.tableFilled[3].filled=!0,r.StepPost({id:a.getDraft().id,step:4},e.steps[3],function(e){})):e.tableFilled[3].filled=!1},!0),e.$watch(function(){return e.steps[4]},function(t){""!=e.steps[4].title&&""!=e.steps[4].description?(e.tableFilled[4].filled=!0,r.StepPost({id:a.getDraft().id,step:5},e.steps[4],function(e){})):e.tableFilled[4].filled=!1},!0),e.$watch(function(){return e.steps[5]},function(t){""!=e.steps[5].address.zipcode&&void 0!=e.steps[5].address.zipcode?(e.tableFilled[5].filled=!0,r.StepPost({id:a.getDraft().id,step:6},e.steps[5],function(e){})):e.tableFilled[5].filled=!1,void 0!=e.steps[5].address.zipcode?e.addressCorrect=!0:e.addressCorrect=!1},!0),e.$watch(function(){return e.steps[6].cover},function(t){""!==e.steps[6].cover?e.tableFilled[6].filled=!0:e.tableFilled[6].filled=!1},!0),e.$watch(function(){return e.tableFilled},function(t){e.sn=0;for(var s=0;7>s;s++)t[s].filled||(e.sn=e.sn+1);0==e.sn?e.canPost=!0:e.canPost=!1},!0),e.$watch(function(){return{studio:e.isStudio,bed:e.numBedrooms,bath:e.numBathrooms}},function(t){t.studio?e.steps[0].type="Studio":e.steps[0].type=null==t.bed||null==t.bath?void 0:t.bed+"B"+t.bath+"B"},!0),e.$watch(function(){return e.numBedrooms},function(t,s){t!==s&&(0==t?(e.isStudio=!0,e.numBathrooms=0):(e.isStudio=!1,e.numBathrooms=1))}),e.$watch("details1",function(t){if(t&&w(t)){e.addressGot=!0,e.addresses=[];for(var s={street_number:"short_name",route:"long_name",locality:"long_name",administrative_area_level_1:"short_name",postal_code:"short_name"},a=0;a<e.details1.address_components.length;a++){var i=e.details1.address_components[a].types[0];if(s[i]){var o=e.details1.address_components[a][s[i]];e.addresses.push(o)}}e.steps[5].address.street=e.addresses[0]+" "+e.addresses[1],e.steps[5].address.city=e.addresses[2],e.steps[5].address.state=e.addresses[3],e.steps[5].address.zipcode=e.addresses[4],P.geocode({address:e.steps[5].address.full},function(t,s){s==google.maps.GeocoderStatus.OK&&(e.steps[5].latitude=t[0].geometry.location.lat(),e.steps[5].longitude=t[0].geometry.location.lng())})}})}]),hereseasApp.controller("RoomDisplayController",["$state","$scope","roomService","$stateParams","languageService","requestService","userService","$mdDialog","alertService","$cookies",function(e,t,s,a,i,o,n,l,r,d){o.GetApt({id:a.aptId},function(c){function p(){t.data=c.data[0];for(var e=0;e<t.data.rooms.length;e++)t.hasShowInfo.push(!1);t.images=[];for(var e=0;e<t.data.images.length;e++)t.images.push({thumb:t.data.images[e],img:t.data.images[e]});t.sellerId=t.data.userId,t.username=t.data.username,t.avatar=t.data.userAvatar,t.add_apt=t.data.address.full,s.setMap(),t.rooms=t.data.rooms,t.theRoom=t.rooms[1],o.GetSchool({id:t.data.schoolId},function(e){e.result&&(t.schoolName=e.data.name,t.add_school=new google.maps.LatLng(1*e.data.latitude,1*e.data.longitude),t.durations=s.calDurations(t.add_apt,t.add_school))}),"true"==d.login&&o.GetFavList(function(e){null!==e.data.apartments?t.favoriteApts=e.data.apartments:t.favoriteApts=[],t.isFav=-1!==t.favoriteApts.indexOf(a.aptId)}),m()}function u(){n.deleteFavorite({id:a.aptId,category:"apartments"}).then(function(e){e.result&&(t.isFav=!1)})}function f(){"true"==d.login?n.postFavorite({id:a.aptId,category:"apartments"}).then(function(e){e.result&&(t.isFav=!0)}):r.alert("请登录").then(function(){t.$broadcast("login","1")})}function g(e){"true"==d.login?l.show({controller:["$scope","recvId",function(e,t){e.content="",e.sendmessage=function(){n.sendmessage({id:t,content:e.content}).then(function(e){e.result?alert("Message has been sent"):alert("err")})}}],templateUrl:"/app/view/message.html",parent:angular.element(document.body),targetEvent:e,clickOutsideToClose:!0,locals:{recvId:t.data.userId}}):r.alert("请登录").then(function(){t.$broadcast("login","1")})}function m(){for(var e in t.data.facilities.apt)t.numAptFacilitiesType++,1==t.data.facilities.apt[e]&&t.apt_true++;for(var e in t.data.facilities.room)t.numRoomFacilitiesType++,1==t.data.facilities.room[e]&&t.room_true++;for(var e in t.data.fees)t.numFeesType++,null!=t.data.fees[e]&&t.fees_true++}function v(){t.show_all_apt=!t.show_all_apt}function h(){t.show_all_room=!t.show_all_room}function w(){t.show_all_fees=!t.show_all_fees}function _(e){s.setDisplay(e)}function y(e){return i.getChineseName(e)}function D(){return t.apt_true==t.numAptFacilitiesType}function b(){return t.room_true==t.numRoomFacilitiesType}function P(){return t.fees_true==t.numFeesType}c.result?(t.aptId=a.aptId,t.apt_true=0,t.room_true=0,t.fees_true=0,t.show_all_apt=!1,t.show_all_room=!1,t.show_all_fees=!1,t.roomTypeStyle="background-color:red",t.hasShowInfo=[],t.aptIcons=["/app/view/img/icon/bbq.svg","/app/view/img/icon/businessRoom.svg","/app/view/img/icon/elevator.svg","/app/view/img/icon/freeParking.svg","/app/view/img/icon/frontDesk.svg","/app/view/img/icon/gym.svg","/app/view/img/icon/laundry.svg","/app/view/img/icon/partyRoom.svg","/app/view/img/icon/petsAllowed.svg","/app/view/img/icon/roof.svg","/app/view/img/icon/safetySystem.svg","/app/view/img/icon/swimmingPool.svg","/app/view/img/icon/wheelchairAccessible.svg","/app/view/img/icon/yard.svg"],t.roomIcons=["/app/view/img/icon/airCondition.svg","/app/view/img/icon/balcony.svg","/app/view/img/icon/dishwasher.svg","/app/view/img/icon/dryer.svg","/app/view/img/icon/extinguisher.svg","/app/view/img/icon/furnitures.svg","/app/view/img/icon/heater.svg","/app/view/img/icon/microwave.svg","/app/view/img/icon/oven.svg","/app/view/img/icon/refrigerator.svg","/app/view/img/icon/smokeDetector.svg","/app/view/img/icon/washer.svg"],t.numAptFacilitiesType=0,t.numRoomFacilitiesType=0,t.numFeesType=0,t.sendMessage=g,t.ShowAllApt=v,t.ShowAllRoom=h,t.ShowAllFees=w,t.SetMethod=_,t.name=y,t.has_all_facilities=D,t.has_all_room_facilities=b,t.has_all_fees=P,t.addFav=f,t.delFav=u,p(),t.showInfo=function(e){t.hasShowInfo[e]=!0},t.hideInfo=function(e){t.hasShowInfo[e]=!1}):e.go("home")}),t.showOtherUserInfo=function(s){e.go("othersProfile",{schoolId:t.data.schoolId,othersId:s})}}]);