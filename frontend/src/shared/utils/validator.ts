class Validator {
  private passwordRegex: RegExp = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*_\-+=?])\S{8,}$/;
  private emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  public validateName(name: string): string | null {
    if (name.trim().length < 3) {
      return 'Name must be at least 3 characters.';
    }
    return null;
  }

  public validateEmail(email: string): string | null {
    if (!this.emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    return null;
  }

  public validatePassword(password: string): string | null {
    if (!this.passwordRegex.test(password)) {
      return 'Password must be at least 8 characters, include a letter, a number, and a special character.';
    }
    return null;
  }
}

export const validator = new Validator();