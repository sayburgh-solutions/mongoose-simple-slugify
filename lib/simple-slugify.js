/* eslint-disable func-names */

const crypto = require('crypto');

module.exports = function (schema) {
  schema.pre(['save'], async function (next) {
    if(this.isNew){
    const { source } = schema.tree.slug;

    let tempSlug = this[source]
    .toString() // make sure the operand is a string
    .toLowerCase() // normalize the string
    .trim() // trim white spaces in the beginning and ending of the string
    .replace(/\s/g, '-') // replace all spaces with a dash
    .replace(/[&/\\#,+()$~%.'":*?’‘!<>{};=@^_|[\]]/g, '') // replace all special characters
    .replace(/-+/g,"-"); // replace any repeated dashes


    let slug;
    // remove first and last hyphen (-) from slug
    if ((tempSlug.slice(-1) === "-") && (tempSlug.charAt(0) === "-")) {
      slug = tempSlug.slice(1,-1);
    } else if (tempSlug.slice(-1) === "-") {
      slug = tempSlug.substring(0, tempSlug.length - 1);
    } else if (tempSlug.charAt(0) === "-") {
      slug = tempSlug.slice(1);
    } else {
      slug = tempSlug;
    }

    try {
      slug = (await this.model(this.constructor.modelName).exists({ slug }))
        ? `${slug}-${crypto.randomBytes(5).toString('hex')}`
        : slug;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }

    this.slug = slug;
    }

    next();
  });
};
