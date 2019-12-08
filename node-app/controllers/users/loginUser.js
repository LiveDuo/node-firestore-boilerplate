// import { UserModel } from '../../models/User/user'
import { firestore } from '../../services/databases/firestore'
import HttpStatusCodes from 'http-status-codes'
import { sign } from 'jsonwebtoken'
import { compare } from 'bcrypt'

import { getCachedThenQuery } from '../../services/caching/nodeCache'

const loginUser = async (req, res) => {

	const email = req.body.email
	const password = req.body.password
	const promise = firestore.collection('users').where('email', '==', email).get()

	const result = await getCachedThenQuery('login-user-email-'+email, promise)
	if (result.docs.length <= 0) {
		return res.status(HttpStatusCodes.BAD_REQUEST).send({message: res.__('responses').user_not_found})
	}
	
	const data = result.docs[0].data()
	const isValid = await compare(password, data.password)
	if (!isValid) {
		return res.status(HttpStatusCodes.BAD_REQUEST).send({message: res.__('responses').password_invalid})
	}
	
	try {
		const id = result.docs[0].id
		const token = sign({ id: id }, process.env.JWT_KEY)
		return res.status(HttpStatusCodes.OK).send({ jwt: token })
	} catch (error) {
		console.log(error.message)
		return res.status(HttpStatusCodes.BAD_REQUEST).send({ message: res.__('responses').invalid_request})
	}
}

export { loginUser }