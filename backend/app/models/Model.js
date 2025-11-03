import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();
class Model {
    model;
    friendlyFields;
    constructor(schema, friendlyFields) {
        this.friendlyFields = friendlyFields;
        this.model = prisma[schema];
    }
    checkFriendlyFields(modelSchema) {
        const restrictedKeys = [];
        for (const key of Object.keys(modelSchema)) {
            if (!this.friendlyFields.includes(key)) {
                restrictedKeys.push(key);
            }
        }
        if (restrictedKeys.length > 0) {
            throw new Error(`Restricted keys accessed: ${restrictedKeys.join(', ')}`);
        }
    }
}
export default Model;
