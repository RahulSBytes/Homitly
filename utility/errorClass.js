export default class expressError extends Error{
    constructor(status, message){
        super();
        this.status = status,
        this.message = message
    }
}


// ----------unused