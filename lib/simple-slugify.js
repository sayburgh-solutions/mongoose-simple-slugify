/* eslint-disable func-names */

const crypto = require('crypto');

module.exports = function (schema) {
  schema.pre(['save'], async function (next) {
    const { source } = schema.tree.slug;

    let slug = this[source]
    .toString() // make sure the operand is a string
    .toLowerCase() // normalize the string
    .trim() // trim white spaces in the beginning and ending of the string
    .replace(/\s/g, '-') // replace all spaces with a dash
    .replace(/[&/\\#,+()$~%.'":*?!<>{}]/g, '') // replace all special characters
    .replace(/-+/g,"-"); // replace any repeated dashes

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
