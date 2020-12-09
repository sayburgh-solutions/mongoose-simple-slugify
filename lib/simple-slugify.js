/* eslint-disable func-names */

const crypto = require('crypto');

async function makeSlug(source, doc) {
  let slug = doc[source].toString().toLowerCase().trim().replace(' ', '-');

  try {
    slug = (await doc.model(doc.constructor.modelName).exists({ slug }))
      ? `${slug}-${crypto.randomBytes(5).toString('hex')}`
      : slug;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }

  return slug;
}

module.exports = function (schema) {
  schema.pre('save', async function (next) {
    const { source } = schema.tree.slug;

    const doc = this;

    this.slug = await makeSlug(source, doc);

    next();
  });
};
