


export function ParsePathGiveUserWallet(_url){

    const params = _url.split("?");
    if(params.length < 2){
        return -1;
    }

    const UserWallet = params[1].split("=");
    if(UserWallet.length < 2){
        return -1;
    }

    return UserWallet[1].split("&")[0];
}