export class Auth {
    constructor(api, ui) {
        this.api = api;
        this.ui = ui;
    }

    async handleLogin(username, password) {
        try {
            const result = await this.api.login({ username, password });
            if (result.status === 'success') {
                localStorage.setItem('currentUser', result.username);
                localStorage.setItem('currentFullName', result.fullname);
                localStorage.setItem('currentProfilePic', result.profile_pic); 
                localStorage.setItem('isLoggedIn', 'true');
                return true;
            }
            this.ui.showToast(result.message, 'error');
            return false;
        } catch (err) {
            this.ui.showToast("Server connection error.", "error");
            return false;
        }
    }

    toggleAuth(showSignup) {
        document.getElementById('loginForm').style.display = showSignup ? 'none' : 'block';
        document.getElementById('signupForm').style.display = showSignup ? 'block' : 'none';
        document.getElementById('authTitle').innerHTML = showSignup ? '<i class="fa-solid fa-star"></i> Join Group 8' : '<i class="fa-solid fa-box-open"></i> Cabuyao Tech';
    }

    logout() {
        localStorage.clear();
        location.reload();
    }
}