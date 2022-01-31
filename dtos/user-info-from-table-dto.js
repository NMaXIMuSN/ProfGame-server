module.exports = class UsersInfoDto{
    FIO;
    group;
    id;
    stats;
    money;
    constructor(model){
        this.FIO = model["last-name"]+" "+model["first-name"]+" "+model["midl-name"];
        this.group = model.group;
        this.id = model.user;
        this.stats = model.stats
        this.money = model.money
    }
    
}