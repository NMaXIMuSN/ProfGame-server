module.exports = class UsersInfoDto{
    FIO;
    imgUrl;
    id;
    stats;
    constructor(model){
        this.FIO = model["last-name"]+" "+model["first-name"]+" "+model["midl-name"];
        this.imgUrl = model.imgUrl;
        this.id = model.user;
        this.stats = model.stats
    }
    
}