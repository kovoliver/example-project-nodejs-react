import { PrismaClient, Prisma } from '@prisma/client';

export const prisma = new PrismaClient();

class Model<T extends keyof PrismaClient> {
    protected model: PrismaClient[T];
    protected friendlyFields: string[];

    constructor(schema: T, friendlyFields: string[]) {
        this.friendlyFields = friendlyFields;
        this.model = prisma[schema];
    }

    protected checkFriendlyFields(modelSchema: Record<string, any>) {
        const restrictedKeys: string[] = [];

        for (const key of Object.keys(modelSchema)) {
            if (!this.friendlyFields.includes(key)) {
                restrictedKeys.push(key);
            }
        }

        if (restrictedKeys.length > 0) {
            throw new Error(`Restricted keys accessed: ${restrictedKeys.join(', ')}`);
        }
    }

    public async checkExists(field: string, value: any): Promise<boolean> {
        if (!this.friendlyFields.includes(field)) {
            throw new Error(`Access to field "${field}" is not allowed.`);
        }

        // @ts-ignore - dinamikus Prisma model hozzáférés
        const record = await this.model.findFirst({
            where: { [field]: value },
            select: { [field]: true },
        });

        return !!record;
    }
}

export default Model;