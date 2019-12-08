import Ajv from 'ajv'
// const Ajv = require('ajv');
const ajv = new Ajv()

ajv.addKeyword('isNotEmpty', {
  type: 'string',
  validate: (schema, data) => {
    return typeof data === 'string' && data.trim() !== ''
  },
  errors: false
})

// const validate = ajv.validate
export { ajv }