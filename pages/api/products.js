import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";
export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req,res);
  if (method === 'GET') {
    if (req.query?.id) {
      res.json(await Product.findOne({ _id: req.query.id }))
    } else {
      const products = await Product.find();
      res.json(products);
    }

  }
  if (method === 'POST') {
    const { title, description, price, category, properties } = req.body;
    await Product.create({
      title, description, price, category, properties
    })
    res.json('post');
  }
  if (method === 'PUT') {
    const { title, description, price, _id, category, properties } = req.body;
    await Product.updateOne({ _id }, { title, description, price, category, properties });
    res.json(true);
  }
  if (method === 'DELETE') {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id })
      res.json(true);
    }
  }
}
