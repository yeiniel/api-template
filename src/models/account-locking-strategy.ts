/** A strategy of how to lock user login */
export interface AccountLockingStrategy {
    /** Whether or not the account is already locked */
    isLocked(id: string): Promise<boolean>;

    /** Whether or not the password is correct */
    passwordCheck(id: string, checked: boolean): Promise<void>;
}