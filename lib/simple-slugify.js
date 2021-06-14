/* eslint-disable func-names */

const crypto = require('crypto');

const regex = /[&/\\#,+()$~%.'":*?!<>{} ]/g;

module.exports = function (schema) {
  schema.pre(['save'], async function (next) {
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
};
