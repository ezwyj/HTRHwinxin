module.exports = {
	"root": true,
    "parserOptions": {
		"parser": 'babel-eslint',
		"sourceType": "module"
    },
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true
    },
	"extends": ["eslint:recommended", "plugin:vue/essential"],
	"plugins": ["vue"],
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
		],
		"linebreak-style": [ //换行风格
			"error",
			"windows"
		],
		"no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
		"no-console": process.env.NODE_ENV === "production" ? "error" : "off"
	},
	"globals": {
		"__dirname": true,
		"process": true,
		"OP_CONFIG": true
	}
};