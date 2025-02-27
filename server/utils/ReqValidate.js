class ReqValidate {
    constructor(name, userName, email, password) {
        this.name = name
        this.userName = userName
        this.password = password
        this.email = email
    }
    validate() {
        console.log(this.name);
    }
}

export { ReqValidate }