module.exports = class UsersForActivationDto{
    FIO;
    id;
    cours;
    group;
    constructor(model){
        this.FIO = model["last-name"]+" "+model["first-name"]+" "+model["midl-name"];
        this.id = model.user;
        this.cours = model.cours;
        this.group = model.group;
    }
    
}