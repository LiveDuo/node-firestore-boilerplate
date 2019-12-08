// import { UserModel } from '../../models/User/user'
import { firestore } from '../../services/databases/firestore'
import HttpStatusCodes from 'http-status-codes'

const deleteUser = async (req, res) => {
	try {
		await firestore.collection('users').doc(req.userId).delete()
		return res.status(HttpStatusCodes.OK).end()
	} catch (error) {
		console.log(error.message)
		return res.status(HttpStatusCodes.BAD_REQUEST).send({message: res.__('responses').something_went_wrong})
	}
}

export { deleteUser }