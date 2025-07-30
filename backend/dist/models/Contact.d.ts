import mongoose, { Document } from 'mongoose';
export interface IContact extends Document {
    name: string;
    email: string;
    phone: string;
    message: string;
    status: 'new' | 'read' | 'responded';
    createdAt: Date;
    updatedAt: Date;
}
declare const _default: mongoose.Model<IContact, {}, {}, {}, mongoose.Document<unknown, {}, IContact, {}> & IContact & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Contact.d.ts.map