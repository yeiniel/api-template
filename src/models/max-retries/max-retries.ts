import { AccountLockingStrategy } from "../account-locking-strategy";
import { MaxRetriesTypegooseModel } from "./max-retries.typegoose-model";

export class MaxRetries implements AccountLockingStrategy {

    protected typegooseModel: typeof MaxRetriesTypegooseModel;

    protected maxFailedLoginAttempts: number;

    constructor(typegooseModel?: typeof MaxRetriesTypegooseModel, maxFailedLoginAttempts?: number){
        this.typegooseModel = typegooseModel ?? MaxRetriesTypegooseModel;
        this.maxFailedLoginAttempts = maxFailedLoginAttempts ?? 3;
    }
    
    async isLocked(id: string): Promise<boolean> {
        const maxRetries = await this.typegooseModel.findById(id);

        return maxRetries 
            && maxRetries.failedLoginAttempts >= this.maxFailedLoginAttempts;
    }
    
    async passwordCheck(id: string, checked: boolean): Promise<void> {
        const maxRetries = await this.typegooseModel.findById(id);

        if (!maxRetries) {
            await this.typegooseModel.create({
                _id: id,
                failedLoginAttempts: checked ? 0 : 1
            });
        } else {
            await this.typegooseModel.updateOne(
                { _id: id },
                { failedLoginAttempts: checked ? 0 : maxRetries.failedLoginAttempts + 1 }
            )
        }
    }
}