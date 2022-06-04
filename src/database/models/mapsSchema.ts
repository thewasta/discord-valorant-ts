import {Schema, model} from "mongoose";

interface IMap {
    uuid: string;
    displayName: string;
    coordinates: string;
    displayIcon: string;
    listViewIcon: string;
    splash: string;
    assetPath: string;
    mapUrl: string;
    xMultiplier: number;
    yMultiplier: number;
    xScalarToAdd: number;
    yScalarToAdd: number;
}

const mapSchema = new Schema<IMap>({
        uuid: {
            type: String,
            required: true
        }, displayName: {
            type: String,
            required: true
        }
        , coordinates: {
            type: String,
            required: true
        }
        , displayIcon: {
            type: String,
            required: false
        }
        , listViewIcon: {
            type: String,
            required: true
        }
        , splash: {
            type: String,
            required: true
        }
        , assetPath: {
            type: String,
            required: true
        }
        , mapUrl: {
            type: String,
            required: true
        }
        , xMultiplier: {
            type: Number,
            required: true
        }
        , yMultiplier: {
            type: Number,
            required: true
        }
        , xScalarToAdd: {
            type: Number,
            required: true
        }
        , yScalarToAdd: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    });

export default model<IMap>("maps", mapSchema);