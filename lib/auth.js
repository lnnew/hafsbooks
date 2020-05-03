module.exports = {
    isOwner:function(request, response) {
        console.log("reqqqq",request.user);
        if (request.user) {
            return true;
        } else {
            return false;
        }
    },
    statusUI:function(request, response) {
        var authStatusUI = `
            <a href="/auth/login">로그인</a> |
            <a href="/auth/register">가입하기(facebook 계정이 없을 경우)</a> |
            <a href="/auth/facebook">facebook 간편 로그인</a>`
        if (this.isOwner(request, response)) {
            authStatusUI = `${request.user.displayname} | <a href="/auth/update">개인정보 수정</a> <a href="/auth/logout">로그아웃</a>`;
        }
        return authStatusUI;
    }
}
