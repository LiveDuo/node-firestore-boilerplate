import { firestore } from '../../services/databases/firestore'
// import { UserModel } from '../../models/User/user'
import HttpStatusCodes from 'http-status-codes'

import { getCachedThenQuery } from '../../services/caching/nodeCache'

const getUser = async (req, res) => {

	const userId = req.params.userId
	const promise = firestore.collection('users').doc(userId).get()

	try {
		const result = await getCachedThenQuery('get-user-id-'-userId, promise)
		if (!result.exists) {
			throw new Error('User does not exist')
		}
		const data = result.data()
		delete data.password
		return res.status(HttpStatusCodes.OK).send(data)
	} catch (error) {
		console.log(error.message)
		return res.status(HttpStatusCodes.BAD_REQUEST).send({message: res.__('responses').something_went_wrong})
	}
}

export { getUser }