/* eslint-disable func-names */

const crypto = require('crypto');

const regex = /[&/\\#,+()$~%.'":*?<>{} ]/g;

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

  // schema.pre(['update', 'updateOne', 'findOneAndUpdate'], async function (next) {
  //   const updatedPayload = this.getUpdate();
  //   const { source } = this.schema.path('slug').options;

  //   console.log('xxxxxxxxx');
  //   console.log(this.get(source));
  //   console.log(updatedPayload[source]);

  //   if(source in updatedPayload && updatedPayload[source] !== this.get(source)) {
  //     console.log('performing slugify action')
  //   } else {
  //     console.log('not performing slugify action')
  //   }

  //   // if (this.schema.tree.slug.source in updatedPayload) {
  //   //   if (updatedPayload[this.schema.tree.slug.source] !== this.get(this.schema.tree.slug.source)) {
  //   //     let slug = this.get(this.schema.tree.slug.source)
  //   //       .toString()
  //   //       .toLowerCase()
  //   //       .trim()
  //   //       .replace(regex, '-');
  
  //   //     try {
  //   //       slug = (await this.model.exists({ slug }))
  //   //         ? `${slug}-${crypto.randomBytes(5).toString('hex')}`
  //   //         : slug;
  //   //     } catch (error) {
  //   //       // eslint-disable-next-line no-console
  //   //       console.log(error);
  //   //     }
  
  //   //     this.set({ slug });
  //   //   }
  //   // }

  //   next();
  // });
};
