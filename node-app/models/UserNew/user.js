const userSchema = {
  "type": "object",
	"properties": {
			"first_name": { "type": "string" , "minLength": 1},
			"last_name": { "type": "string" , "minLength": 1},
			"email": { "type": "string" , "minLength": 1},
			"password": { "type": "string" , "minLength": 1},
			"image_urls": { "type": "array"}
	},
	"required": [ "first_name", 'last_name', 'email', 'password']
}

export { userSchema }