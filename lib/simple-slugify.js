const crypto = require('crypto');

module.exports = function slugify(schema) {
  // eslint-disable-next-line func-names
  schema.pre('save', async function (next) {
    const { source } = schema.tree.slug;

    let slug = this[source].toString().toLowerCase().trim().replace(' ', '-');

    try {
      slug = (await this.model(this.constructor.modelName).exists({ slug }))
        ? `${slug}-${crypto.randomBytes(5).toString('hex')}`
        : slug;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }

    this.slug = slug;
    next();
  });
};
