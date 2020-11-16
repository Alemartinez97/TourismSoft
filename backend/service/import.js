const { knex, upsert } = require('../db');
const parse = require('csv-parse');

const importCsv = (csvContent) => {
  return new Promise((resolve, reject) => {
    parse(csvContent, async function(err, output){
      if (err) {
        return reject(err);
      }
      let lastProductId = null;
      for (let row of output) {
        const [
          productId,
          productName,
          productDescription,
          alias,
          categories,
          images,
          stamp,
          variantId,
          variantTypeId,
          variantName,
          stock,
          price,
          stampSize,
          imageNumber,
          width,
          height,
          length,
          properties,
        ] = row;
        if (productId === 'PID') {
          continue;
        }
        if (productId) {
          lastProductId = productId;
          await upsert('product', {
            id: productId,
            name: productName,
            description: productDescription,
            alias,
            images: images || 0,
            stamp: stamp || 0,
          });  
        }
        await upsert('product_variant', {
          id: variantId,
          variant_type_id: variantTypeId,
          product_id: lastProductId,
          name: variantName,
          stock,
          price: price || 0,
          stamp_size: stampSize,
          image_number: imageNumber,
          width: width || 0,
          height: height || 0,
          length: length || 0,
        });
        if (categories) {
          const catList = categories.split(',');
          await knex('product_category').where('product_id', lastProductId).del();
          for (let catId of catList) {
            await knex('product_category').insert({
              product_id: lastProductId,
              category_id: catId,
            });
          }
        }
        if (properties) {
          await knex('product_variant_property').where('product_variant_id', variantId).del();
          for (let p of properties.split('|')) {
            const [prop, value] = p.split(':');
            let existingProperty = await knex('property').select('id').where('name', prop).first();
            if (!existingProperty) {
              existingProperty = {
                id: (await knex('property').insert({ name: prop, value_type: 1 }, 'id'))[0],
              };
            }
            await knex('product_variant_property').insert({
              product_variant_id: variantId,
              property_id: existingProperty.id,
              value,
            });
          }
        }
      };
      resolve();
    });
  });
};

module.exports = {
  importCsv,
};
