import mongoose, { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema({
    name: { type: String, required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    properties: [{
        name: { type: String },  // Puedes ajustar el tipo según tus necesidades
        values: [{ type: String }]  // Puedes ajustar el tipo según tus necesidades
    }]
});


export const Category = models?.Category || model('Category', CategorySchema);
