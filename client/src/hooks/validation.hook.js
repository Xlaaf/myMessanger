const MIN_PASSWORD_LENGTH = 6;

export const useValidation = () => {
    const isEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const passwordLength = (password) => {
        return password.length >= MIN_PASSWORD_LENGTH;
    }

    const passwordConfirm = (password, confirm) => {
        return password === confirm;
    }

    return {
        isEmail,
        passwordLength,
        passwordConfirm,
    };
}