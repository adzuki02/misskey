/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-default-export */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/order */
import { Meta, StoryObj } from '@storybook/vue3';
import MkAnimBg from './MkAnimBg.vue';
const meta = {
	title: 'components/MkAnimBg',
	component: MkAnimBg,
} satisfies Meta<typeof MkAnimBg>;
export const Default = {
	render(args) {
		return {
			components: {
				MkAnimBg,
			},
			setup() {
				return {
					args,
				};
			},
			computed: {
				props() {
					return {
						...this.args,
					};
				},
			},
			template: '<MkAnimBg v-bind="props" />',
		};
	},
	parameters: {
		layout: 'centered',
	},
} satisfies StoryObj<typeof MkAnimBg>;
export default meta;
