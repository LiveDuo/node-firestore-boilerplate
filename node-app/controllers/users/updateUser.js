import HttpStatusCodes from 'http-status-codes'
import { firestore } from '../../services/databases/firestore'

import { uploadToFolderpath, removeFromTemp, storeBufferToTemp } from '../../services/helpers/upload'

import { pubsub } from '../../services/pubsub/google'

const doUpdateUserAsync = async (userId, fileDecoded) => {
	const filepath = await storeBufferToTemp(fileDecoded.buffer, fileDecoded.originalname)
	const mediaUrls = await uploadToFolderpath(filepath, 'update-multiple', true)
	await removeFromTemp(fileDecoded.originalname)
	
	await firestore.collection('users').doc(userId).update({mediaUrls: mediaUrls})
	const result = await firestore.collection('users').doc(userId).get()
	if (result.exists) {
		const data = result.data()
		delete data.password
		pubsub.publish('USER_UPDATED', { onUpdateUser: {...data}})
		console.log(`updated ${result.id} async`)
	}
}

const updateUser = async (req, res) => {

	let body = JSON.parse(req.body.json)
	if (req.file) {
		try {
			let fileDecoded = await req.file
			if (body.is_sync) {
				let filepath = await storeBufferToTemp(fileDecoded.buffer, fileDecoded.originalname)
				let mediaUrls = await uploadToFolderpath(filepath, 'update-multiple', true)
				await removeFromTemp(fileDecoded.originalname)
				
				req.image_urls = mediaUrls
			} else {
				doUpdateUserAsync(req.userId, fileDecoded)
			}
		} catch (error) {
			console.log(error.message)
			return res.status(HttpStatusCodes.BAD_REQUEST).send({ message: res.__('responses').image_upload_failed})
		}
	}

	try {
		await firestore.collection('users').doc(req.userId).update(body)
		const result = await firestore.collection('users').doc(req.userId).get()
		if (!result.exists) {
			throw new Error('User does not exist')
		}
		const data = result.data()
		delete data.password
		pubsub.publish('USER_UPDATED', { onUpdateUser: {...data}})
		return res.status(HttpStatusCodes.OK).send({...data})
	} catch (error) {
		console.log(error.message)
		return res.status(HttpStatusCodes.BAD_REQUEST).send({ message: res.__('responses').user_not_found})
	}
}

export { updateUser }