import http from 'mpit-utils/libs/http';

export default {
	

	getList() {
		return new Promise((resolve, reject) => {
			resolve({
				data: {
					"State": true,
					"Data": [
						{
							"Key": "name",
							"Value": "helin"
						}
					]
				}
			});
		})		
	}

};