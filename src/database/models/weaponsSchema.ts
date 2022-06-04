import {Schema, model} from "mongoose";

interface IWeapons {
    uuid: string;
    displayName: string;
    displayIcon: string;
}

const weaponSchema = new Schema<IWeapons>({
    uuid: {
        type: String,
        required: true
    },
    displayName: {
        type: String,
        required: true
    },
    displayIcon: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

export default model<IWeapons>("weapons", weaponSchema);