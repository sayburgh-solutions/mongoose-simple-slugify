/* eslint-disable func-names */

const crypto = require('crypto');

const regex = /[&/\\#,+()$~%.'":*?<>{} ]/g;

module.exports = function (schema) {
  schema.pre(['save', 'updateOne'], async function (next) {
    const { source } = schema.tree.slug;

    let slug = this[source].toString().toLowerCase().trim().replace(regex, '-');

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

  schema.pre(['update', 'findOneAndUpdate'], async function (next) {
    let slug = this.get(this.schema.tree.slug.source)
      .toString()
      .toLowerCase()
      .trim()
      .replace(regex, '-');

    try {
      slug = (await this.model.exists({ slug }))
        ? `${slug}-${crypto.randomBytes(5).toString('hex')}`
        : slug;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }

    this.set({ slug });

    next();
  });
};
