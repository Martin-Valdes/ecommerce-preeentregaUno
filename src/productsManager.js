let products = [];

import { randomUUID } from 'crypto';
import fs from "fs";


const pathFile = "./src/data/products.json";

const addProduct = async(product) =>{
  
    await getProducts();
    const {title, description, code, price, stock, category, thumbnails} = product;
  
    const newProduct = {
        id: randomUUID(),
        title,
        description,
        code,
        price,
        status: true,
        stock,
        category,
        thumbnails: thumbnails || []
    };
    
    products.push( newProduct);
    await fs.promises.writeFile(pathFile, JSON.stringify(products));
        
        
    return product;
}


const getProducts = async(limit) => {
    const productList = await fs.promises.readFile(pathFile, "utf-8");
    const productParse = JSON.parse(productList);
    
    products = productParse || [];

    if (!limit) return products;
    return products.slice(0, limit)
}

const getProductById = async (id) => {
    
    products = await getProducts();
  const product = products.find((p) => p.id === id);

  return product;
}

const putProduct = async(id, productBody) =>{

    await getProducts();

    const productIndex = products.findIndex( product => product.id === id);
        products[productIndex] ={
            ...products[productIndex], ///copia del objeto
            ...productBody //sobreescritura
        }
    await fs.promises.writeFile(pathFile,JSON.stringify(products));
    const product = await getProductById(id);
    return product;
}

const deleteProduct = async(id) =>{
    await getProducts();
    const product = await getProductById(id);
    if(!product) return false;
    products = products.filter((product) => product.id !== id);
    await fs.promises.writeFile(pathFile,JSON.stringify(products));

    return true;
};

export default {
    addProduct,
    getProducts,
    getProductById,
    putProduct,
    deleteProduct,
  };