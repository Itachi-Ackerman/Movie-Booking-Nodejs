export default class CtrlAdmin {
    /**
    * authenticating a admin
    * @param email
    * @param password
    */
    static auth(email: string, password: string): Promise<Object>;
}
