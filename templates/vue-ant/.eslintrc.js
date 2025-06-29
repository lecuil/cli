module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:vue/vue3-recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:prettier/recommended',
		'./.eslintrc-auto-import.json',
	],
	overrides: [],
	parser: 'vue-eslint-parser',
	parserOptions: {
		ecmaVersion: 'latest',
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
	},
	plugins: ['vue', '@typescript-eslint'],
	rules: {
		'@typescript-eslint/no-unused-vars': 'off',
		'vue/multi-word-component-names': [
			'error',
			{
				ignores: ['index'], 
			},
		],
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		semi: 'off',
		'@typescript-eslint/no-this-alias': 'off',
		'eslintno-debugger': 'off',
		'vue/no-unused-vars': 'off',
		'vue/no-template-shadow': 'off',
		'vue/require-v-for-key': 'off',
		'vue/no-textarea-mustache': 'off',
		'vue/no-v-html': 'off',
		'no-constant-condition': 'off',
	},
};
