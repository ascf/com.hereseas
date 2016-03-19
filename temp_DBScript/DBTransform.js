//in mongo shell use following script to transform original database 
// add loc field with 2dsphere index

    // use existing filed data to create a new field 
    var f = function(i){
        var loc = [];
        var lat = parseFloat(i.latitude);
        var lon = parseFloat(i.longitude);
        if(isNaN(lat) || isNaN(lon)){
            loc = [];
            //printjson({message:"Find it"});
        }else{
            loc.push(lon,lat);
        }
        //printjson(loc);
        db.apartments.update(
            {_id:i._id},
            {$set:{"loc": loc}}
        )
        
    };

    // loop through all documents you want to change
    db.apartments.find(
        {latitude: {$exists: true},longitude:{$exists:true}}
        ).forEach(function(i){
            f(i); 
    });

    // geo index follow mongodb document
    db.apartments.ensureIndex({loc:'2dsphere'});