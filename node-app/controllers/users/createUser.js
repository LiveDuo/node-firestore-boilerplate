import { firestore } from '../../services/databases/firestore'
import { ajv } from '../../services/validation/ajv'
import { userSchema } from '../../models/UserNew/user'
import HttpStatusCodes from 'http-status-codes'
import { sign } from 'jsonwebtoken'
import { hash } from 'bcrypt'

const createUser = async (req, res) => {

	try {
		if (!ajv.validate(userSchema, req.body)) {
			// console.log(ajv.errors)
			throw new Error(ajv.errors[0].message)
		}
	} catch (error) {
		return res.status(HttpStatusCodes.BAD_REQUEST).send({ message: res.__('responses').invalid_request})
	}

	try {
		const result = await firestore.collection('users').where('email', '==', req.body.email).get()
		if (result.docs.length > 0) {
			throw new Error('User Already exists')
		}
	} catch (error) {
		console.log(error.message)
		return res.status(HttpStatusCodes.BAD_REQUEST).send({ message: 'User email already exists'})
	}

	try {
		req.body.password = await hash(req.body.password, 10)
	} catch (error) {
		console.log(error.message)
		return res.status(HttpStatusCodes.BAD_REQUEST).send({ message: res.__('responses').invalid_request})
	}
	
	try {
		const result = await firestore.collection('users').add(req.body)
		const token = sign({ id: result.id }, process.env.JWT_KEY)
		return res.status(HttpStatusCodes.OK).send({ jwt: token })
	} catch (error) {
		console.log(error.message)
		return res.status(HttpStatusCodes.BAD_REQUEST).send({ message: res.__('responses').invalid_request})
	}
}

export { createUser }